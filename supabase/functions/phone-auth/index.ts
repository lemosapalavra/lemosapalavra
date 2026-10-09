// Legacy phone authentication has been disabled for security.
// The previous implementation accepted unverified phone numbers and used
// predictable passwords, allowing account takeover.
// Existing user accounts and profile records are not deleted.
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

Deno.serve((req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });
  return new Response(JSON.stringify({ error: "O acesso antigo por celular foi desativado por seguranca. Entre com Google." }), {
    status: 403,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
});
