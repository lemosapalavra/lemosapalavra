import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

// Only the quiz has server-verifiable answers at this stage.
// Never trust a browser-supplied score, user id or point amount.
const answers = [1, 0, 2, 0, 1] as const;
const cors = { "Access-Control-Allow-Origin": "*", "Access-Control-Allow-Headers": "authorization, apikey, content-type", "Access-Control-Allow-Methods": "POST, OPTIONS" };
Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: cors });
  if (req.method !== "POST") return new Response("Method not allowed", { status: 405, headers: cors });
  try {
    const authorization = req.headers.get("Authorization");
    if (!authorization?.startsWith("Bearer ")) return new Response("Unauthorized", { status: 401, headers: cors });
    const url = Deno.env.get("SUPABASE_URL");
    const anon = Deno.env.get("SUPABASE_ANON_KEY");
    const service = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
    if (!url || !anon || !service) return Response.json({ error: "Configuração incompleta do servidor.", code: "SERVER_CONFIG" }, { status: 500, headers: cors });
    const authClient = createClient(url, anon, { global: { headers: { Authorization: authorization } } });
    const { data: { user }, error } = await authClient.auth.getUser();
    if (error || !user) return new Response("Unauthorized", { status: 401, headers: cors });
    const body = await req.json();
    if (!Array.isArray(body.answers) || body.answers.length !== answers.length ||
        !body.answers.every((a: unknown, i: number) => Number.isInteger(a) && a === answers[i])) {
      return Response.json({ awarded: false, reason: "incomplete_or_incorrect" }, { status: 422, headers: cors });
    }
    const admin = createClient(url, service);
    const { data, error: awardError } = await admin.rpc("award_verified_activity_points", {
      p_user_id: user.id,
      p_activity_key: "quiz-biblico",
      p_completion_key: "quiz-v1",
      p_points: 50,
    });
    if (awardError) {
      console.error("Quiz points database failure", { code: awardError.code, message: awardError.message });
      const code = ["42883", "PGRST202"].includes(awardError.code) ? "RPC_MISSING" : awardError.code === "42501" ? "RPC_PERMISSION" : "RPC_ERROR";
      return Response.json({ error: "Falha ao registrar os pontos no banco.", code }, { status: 500, headers: cors });
    }
    return Response.json({ awarded: data === true, points: data === true ? 50 : 0 }, { headers: cors });
  } catch (error) {
    console.error("award-quiz-points failed", error);
    return Response.json({ error: "Não foi possível registrar os pontos." }, { status: 500, headers: cors });
  }
});
