// Legacy phone authentication has been retired for security.
// Never recreate accounts, reset passwords, or mutate profiles from a caller-supplied phone number.
// Keep this endpoint as an explicit denial until the deployed function is removed from the platform.
Deno.serve((_request) =>
  new Response(JSON.stringify({ error: "Autenticação antiga por telefone desativada." }), {
    status: 410,
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Cache-Control": "no-store",
    },
  })
);
