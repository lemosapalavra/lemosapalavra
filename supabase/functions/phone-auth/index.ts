import { createClient } from "https://esm.sh/@supabase/supabase-js@2.58.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });

const onlyDigits = (v: string) => (v || "").replace(/\D/g, "");
const emailFor = (digits: string) => `celular${digits}@lemosapalavra.app`;
const passwordFor = (digits: string) => `lemos-${digits}-app`;

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { action, phone, name, ageRange, avatar } = await req.json();
    const digits = onlyDigits(phone);
    if (digits.length < 10 || digits.length > 11) {
      return json({ error: "Celular inválido." }, 400);
    }

    const admin = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
      { auth: { persistSession: false } },
    );

    const email = emailFor(digits);
    const password = passwordFor(digits);

    // Locate an existing account for this phone number.
    let userId: string | null = null;
    const { data: profile } = await admin
      .from("profiles")
      .select("id")
      .eq("email", email)
      .maybeSingle();
    if (profile?.id) userId = profile.id;

    if (!userId) {
      // Fallback: scan the auth users list (small user base).
      for (let page = 1; page <= 20 && !userId; page++) {
        const { data, error } = await admin.auth.admin.listUsers({ page, perPage: 200 });
        if (error || !data?.users?.length) break;
        const hit = data.users.find((u) => (u.email || "").toLowerCase() === email);
        if (hit) userId = hit.id;
        if (data.users.length < 200) break;
      }
    }

    if (!userId) {
      if (action !== "register") return json({ found: false });
      const { data, error } = await admin.auth.admin.createUser({
        email,
        password,
        email_confirm: true,
        user_metadata: {
          name: (name || "").trim(),
          age_range: ageRange || "",
          phone: phone || "",
          avatar: avatar || "",
          role: "",
        },
      });
      if (error || !data.user) return json({ error: error?.message || "Falha ao criar conta." }, 400);
      return json({ found: true, created: true, userId: data.user.id });
    }

    // Existing account: realign the internal password/confirmation so the
    // passwordless phone sign-in always works, even for legacy accounts.
    const updates: Record<string, unknown> = { password, email_confirm: true };
    if (action === "register") {
      updates.user_metadata = {
        name: (name || "").trim(),
        age_range: ageRange || "",
        phone: phone || "",
        avatar: avatar || "",
        role: "",
      };
    }
    const { error: updErr } = await admin.auth.admin.updateUserById(userId, updates);
    if (updErr) return json({ error: updErr.message }, 400);

    if (action === "register") {
      await admin
        .from("profiles")
        .update({
          name: (name || "").trim(),
          age_range: ageRange || "",
          phone: phone || "",
          avatar: avatar || "",
          updated_at: new Date().toISOString(),
        })
        .eq("id", userId);
    }

    return json({ found: true, created: false, userId });
  } catch (e) {
    return json({ error: e instanceof Error ? e.message : "Erro inesperado." }, 500);
  }
});
