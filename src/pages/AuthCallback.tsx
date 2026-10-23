import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

/** Finaliza links de acesso por e-mail antes de abrir a página inicial. */
export default function AuthCallback() {
  const navigate = useNavigate();
  const [error, setError] = useState("");
  useEffect(() => {
    let active = true;
    const finish = async () => {
      try {
        const url = new URL(window.location.href);
        const code = url.searchParams.get("code");
        const tokenHash = url.searchParams.get("token_hash");
        const type = url.searchParams.get("type");
        const errorDescription = url.searchParams.get("error_description");
        if (errorDescription) throw new Error(errorDescription);
        if (code) {
          const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(code);
          if (exchangeError) throw exchangeError;
        } else if (tokenHash && type === "magiclink") {
          const { error: verifyError } = await supabase.auth.verifyOtp({ token_hash: tokenHash, type: "magiclink" });
          if (verifyError) throw verifyError;
        }
        const { data, error: sessionError } = await supabase.auth.getSession();
        if (sessionError) throw sessionError;
        if (!data.session?.user) throw new Error("O link expirou ou não foi confirmado. Solicite outro e-mail de acesso.");
        if (active) navigate("/", { replace: true });
      } catch (err) {
        if (active) setError(err instanceof Error ? err.message : "Não foi possível confirmar o acesso.");
      }
    };
    void finish();
    return () => { active = false; };
  }, [navigate]);
  return <main className="min-h-screen bg-[#1d381c] text-white flex flex-col items-center justify-center gap-5 p-6 text-center" aria-live="polite">
    {error ? <><h1 className="text-xl font-bold">Não foi possível entrar</h1><p>{error}</p><button className="rounded-full bg-amber-300 text-black px-6 py-3 font-bold" onClick={() => navigate("/login", { replace: true })}>Solicitar novo link</button></> : <><div className="w-12 h-12 rounded-full border-4 border-amber-300 border-t-transparent animate-spin" /><p>Confirmando seu acesso ao Lemos a Palavra...</p></>}
  </main>;
}
