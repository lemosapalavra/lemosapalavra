import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const cors = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Content-Type": "application/json",
};
const expected = ["NOÉ", "DAVI", "DANIEL", "MOISÉS", "JESUS"];
const normalize = (value: string) => value.normalize("NFC").trim().toUpperCase();

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: cors });
  if (req.method !== "POST") return new Response("Method not allowed", { status: 405, headers: cors });
  try {
    const authorization = req.headers.get("Authorization");
    if (!authorization?.startsWith("Bearer ")) return Response.json({ error: "Unauthorized" }, { status: 401, headers: cors });
    const url = Deno.env.get("SUPABASE_URL");
    const anon = Deno.env.get("SUPABASE_ANON_KEY");
    const service = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
    if (!url || !anon || !service) return Response.json({ error: "SERVER_CONFIG" }, { status: 500, headers: cors });
    const authClient = createClient(url, anon, { global: { headers: { Authorization: authorization } } });
    const { data: { user }, error: authError } = await authClient.auth.getUser();
    if (authError || !user) return Response.json({ error: "Unauthorized" }, { status: 401, headers: cors });
    const body = await req.json();
    if (!Array.isArray(body?.answers) || body.answers.length !== expected.length ||
      !body.answers.every((answer: unknown, i: number) => typeof answer === "string" && normalize(answer) === expected[i])) {
      return Response.json({ awarded: false, reason: "incomplete_or_incorrect" }, { status: 422, headers: cors });
    }
    const admin = createClient(url, service);
    const { data, error } = await admin.rpc("award_verified_activity_points", {
      p_user_id: user.id,
      p_activity_key: "construtor-palavras",
      p_completion_key: "palavras-v1",
      p_points: 50,
    });
    if (error) {
      console.error("Wordbuilder award RPC failed", { code: error.code });
      return Response.json({ error: "RPC_ERROR" }, { status: 500, headers: cors });
    }
    return Response.json({ awarded: data === true, points: data === true ? 50 : 0 }, { headers: cors });
  } catch (error) {
    console.error("Wordbuilder award failed", error instanceof Error ? error.name : "unknown");
    return Response.json({ error: "SERVER_ERROR" }, { status: 500, headers: cors });
  }
});
