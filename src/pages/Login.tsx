import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

/** Acesso da família por conta Google; Facebook será habilitado quando disponível. */
export default function Login() {
  const [busy, setBusy] = useState(false);
  const navigate = useNavigate();

  const enterWithGoogle = async () => {
    if (busy) return;
    setBusy(true);
    try {
      const { lovable } = await import("@/integrations/lovable/index");
      const result = await lovable.auth.signInWithOAuth("google", {
        redirect_uri: window.location.origin,
      });
      if (result.error) throw result.error;
      if (result.redirected) return;
      const { data } = await supabase.auth.getUser();
      if (!data.user) throw new Error("A conta Google não foi confirmada. Tente novamente.");
      navigate("/");
    } catch (error) {
      toast({
        title: "Não foi possível entrar com Google",
        description: error instanceof Error ? error.message : "Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setBusy(false);
    }
  };

  return (
    <main className="fixed inset-0 min-h-[100dvh] w-full overflow-y-auto bg-[#1d381c]" aria-label="Entrar no Lemos a Palavra">
      <div className="relative mx-auto min-h-[100dvh] w-full max-w-[720px] overflow-hidden">
        <img
          src="/Pagina%20Inicial%20celular.png"
          alt="Jesus com crianças, uma ovelhinha e a Bíblia em uma paisagem iluminada"
          className="absolute inset-0 h-full w-full object-cover object-center"
        />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-[48%] bg-gradient-to-t from-[#122c26]/90 via-[#122c26]/55 to-transparent" />
        <div className="relative z-10 flex min-h-[100dvh] flex-col justify-end px-5 pb-[max(2.5rem,env(safe-area-inset-bottom))] pt-12">
          <section className="mx-auto w-full max-w-sm rounded-3xl border border-white/50 bg-[#123a2f]/85 p-5 text-center shadow-2xl backdrop-blur-sm">
            <h1 className="text-2xl font-extrabold text-white drop-shadow-md">Bem-vindo ao Lemos a Palavra!</h1>
            <p className="mt-2 text-sm font-semibold text-white">Pai, mãe ou responsável, entre com sua conta para começar.</p>
            <button
              type="button"
              disabled={busy}
              onClick={() => void enterWithGoogle()}
              className="mt-5 flex min-h-14 w-full items-center justify-center gap-3 rounded-2xl border-2 border-white bg-white px-4 text-base font-extrabold text-slate-800 shadow-lg transition hover:bg-slate-100 focus-visible:outline-4 focus-visible:outline-amber-300 disabled:opacity-60"
            >
              <span aria-hidden="true" className="text-2xl font-black text-[#4285f4]">G</span>
              {busy ? "Conectando..." : "Continuar com Google"}
            </button>
            <p className="mt-3 text-xs font-medium text-white/90">O Facebook será disponibilizado quando a autenticação estiver configurada.</p>
          </section>
        </div>
      </div>
    </main>
  );
}
