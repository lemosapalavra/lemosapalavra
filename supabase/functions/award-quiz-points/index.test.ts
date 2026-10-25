import { assertEquals, assertExists } from "https://deno.land/std@0.224.0/assert/mod.ts";
import { stub } from "https://deno.land/std@0.224.0/testing/mock.ts";

// Exercise the actual HTTP handler without contacting Cloud or changing users.
// The RPC double models the existing SQL unique completion constraint; these
// tests cover the handler contract, not a live database transaction.
type Handler = (request: Request) => Response | Promise<Response>;
let handler: Handler | undefined;
const serveStub = stub(Deno, "serve", (...args: unknown[]) => {
  const callback = args.find((arg) => typeof arg === "function");
  assertExists(callback);
  handler = callback as Handler;
  return {} as ReturnType<typeof Deno.serve>;
});
try {
  await import("./index.ts");
} finally {
  serveStub.restore();
}
assertExists(handler);
const handleRequest = handler;

const correctAnswers = [1, 0, 2, 0, 1];
const userId = "00000000-0000-4000-8000-000000000001";
type Award = {
  p_user_id: string;
  p_activity_key: string;
  p_completion_key: string;
  p_points: number;
};

async function withIsolatedLedger(
  test: (ledger: { balance: number; events: Map<string, Award>; calls: Award[] }) => Promise<void>,
) {
  const ledger = { balance: 120, events: new Map<string, Award>(), calls: [] as Award[] };
  // SDK clients start background refresh timers, even with fake credentials.
  // Track and dispose them while retaining Deno's resource/leak checks.
  const timers: number[] = [];
  const realSetInterval = globalThis.setInterval;
  const intervalStub = stub(globalThis, "setInterval", (...args: Parameters<typeof setInterval>) => {
    const timer = realSetInterval(...args);
    timers.push(timer);
    return timer;
  });
  const envStub = stub(Deno.env, "get", (name: string) => {
    if (name === "SUPABASE_URL") return "https://quiz-tests.invalid";
    if (name === "SUPABASE_ANON_KEY") return "test-only-anon-key";
    if (name === "SUPABASE_SERVICE_ROLE_KEY") return "test-only-service-key";
    return undefined;
  });
  const fetchStub = stub(globalThis, "fetch", async (input: string | URL | Request, init?: RequestInit) => {
    const request = new Request(input, init);
    const url = new URL(request.url);
    assertEquals(url.origin, "https://quiz-tests.invalid");
    if (url.pathname === "/auth/v1/user") {
      return Response.json({ id: userId, aud: "authenticated", role: "authenticated" });
    }
    assertEquals(url.pathname, "/rest/v1/rpc/award_verified_activity_points");
    assertEquals(request.method, "POST");
    const award = await request.json() as Award;
    ledger.calls.push(award);
    assertEquals(award, {
      p_user_id: userId,
      p_activity_key: "quiz-biblico",
      p_completion_key: "quiz-v1",
      p_points: 50,
    });
    const key = `${award.p_user_id}/${award.p_activity_key}/${award.p_completion_key}`;
    if (ledger.events.has(key)) return Response.json(false);
    ledger.events.set(key, award);
    ledger.balance += award.p_points;
    return Response.json(true);
  });
  try {
    await test(ledger);
  } finally {
    fetchStub.restore();
    envStub.restore();
    for (const timer of timers) clearInterval(timer);
    intervalStub.restore();
  }
}

async function submit(answers: unknown) {
  const response = await handleRequest(new Request("https://quiz-tests.invalid/award-quiz-points", {
    method: "POST",
    headers: { Authorization: "Bearer test-only-token", "Content-Type": "application/json" },
    // Client-supplied identity and points must never control the award.
    body: JSON.stringify({ answers, user_id: "another-user", points: 999 }),
  }));
  return { status: response.status, body: await response.json() };
}

Deno.test("correct answers grant 50 points only once (isolated RPC)", async () => {
  await withIsolatedLedger(async (ledger) => {
    assertEquals(await submit(correctAnswers), { status: 200, body: { awarded: true, points: 50 } });
    assertEquals(ledger.balance, 170);
    for (let attempt = 0; attempt < 3; attempt++) {
      assertEquals(await submit(correctAnswers), { status: 200, body: { awarded: false, points: 0 } });
      assertEquals(ledger.balance, 170);
    }
    assertEquals(ledger.events.size, 1);
    assertEquals(ledger.calls.length, 4);
  });
});

Deno.test("incorrect answers never call the award RPC or change the balance", async () => {
  await withIsolatedLedger(async (ledger) => {
    for (let index = 0; index < correctAnswers.length; index++) {
      const incorrect = [...correctAnswers];
      incorrect[index] = (incorrect[index] + 1) % 3;
      assertEquals(await submit(incorrect), {
        status: 422, body: { awarded: false, reason: "incomplete_or_incorrect" },
      });
      assertEquals(ledger.balance, 120);
      assertEquals(ledger.calls.length, 0);
      assertEquals(ledger.events.size, 0);
    }
  });
});

Deno.test("incomplete and malformed answers do not change the balance", async () => {
  await withIsolatedLedger(async (ledger) => {
    for (const answers of [[], correctAnswers.slice(0, 4), [...correctAnswers, 0], ["1", 0, 2, 0, 1], null]) {
      assertEquals(await submit(answers), {
        status: 422, body: { awarded: false, reason: "incomplete_or_incorrect" },
      });
      assertEquals(ledger.balance, 120);
      assertEquals(ledger.calls.length, 0);
    }
  });
});

Deno.test("incorrect answers after a successful completion leave earned points intact", async () => {
  await withIsolatedLedger(async (ledger) => {
    assertEquals(await submit(correctAnswers), { status: 200, body: { awarded: true, points: 50 } });
    assertEquals(await submit([0, 0, 2, 0, 1]), {
      status: 422, body: { awarded: false, reason: "incomplete_or_incorrect" },
    });
    assertEquals(ledger.balance, 170);
    assertEquals(ledger.calls.length, 1);
    assertEquals(ledger.events.size, 1);
  });
});