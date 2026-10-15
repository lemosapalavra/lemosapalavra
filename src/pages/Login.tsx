import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

/** Acesso da família por conta Google; Facebook será habilitado quando disponível. */
export default function Login() {
  const [busy, setBusy] = useState<"google" | "facebook" | null>(null);
  const navigate = useNavigate();

  const enterWithGoogle = async () => {
    if (busy) return;
    setBusy("google");
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
      setBusy(null);
    }
  };

  const enterWithFacebook = async () => {
    if (busy) return;
    setBusy("facebook");
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "facebook",
        options: { redirectTo: window.location.origin },
      });
      if (error) throw error;
    } catch (error) {
      toast({
        title: "Facebook ainda não está configurado",
        description: error instanceof Error ? error.message : "É necessário habilitar o provedor no backend.",
        variant: "destructive",
      });
    } finally {
      setBusy(null);
    }
  };

  return (
    <main className="fixed inset-0 w-full overflow-y-auto bg-[#1d381c]" aria-label="Entrar no Lemos a Palavra">
      <div className="relative mx-auto min-h-[100dvh] w-full max-w-[720px] overflow-hidden">
        <img
          src="/Pagina%20Inicial%20celular.png"
          alt="Jesus com crianças, uma ovelhinha e a Bíblia em uma paisagem iluminada"
          className="absolute inset-0 h-full w-full object-cover object-center"
        />
        <div className="pointer-events-none absolute inset-x-0 top-0 h-[27%] bg-gradient-to-b from-[#123a2f]/85 via-[#123a2f]/50 to-transparent" />
        <div className="relative z-10 flex min-h-[100dvh] flex-col items-center px-4 pt-[max(1.5rem,env(safe-area-inset-top))] pb-[max(1rem,env(safe-area-inset-bottom))]">
          <header className="w-full max-w-lg rounded-3xl border border-white/40 bg-[#153d31]/75 px-5 py-4 text-center shadow-xl backdrop-blur-sm">
            <h1 className="text-[clamp(1.35rem,4vw,2rem)] font-black leading-tight text-white drop-shadow-md">Bem-vindo ao Lemos a Palavra!</h1>
            <p className="mt-2 text-sm font-bold leading-snug text-white sm:text-base">Pai, mãe ou responsável, entre com sua conta para começar.</p>
          </header>
          <div className="flex-1 min-h-[24vh]" />
          <section className="mb-[clamp(5rem,15vh,10rem)] w-full max-w-sm space-y-2 rounded-3xl border border-white/40 bg-[#123a2f]/80 p-3 shadow-2xl backdrop-blur-md sm:p-4" aria-label="Escolha a forma de entrar">
            <button type="button" disabled={busy !== null} onClick={() => void enterWithGoogle()}
              className="flex min-h-12 w-full items-center justify-center gap-3 rounded-2xl bg-white px-4 text-sm font-extrabold text-slate-800 shadow-md transition hover:scale-[1.02] hover:bg-slate-100 focus-visible:outline-4 focus-visible:outline-amber-300 disabled:opacity-60 sm:min-h-14 sm:text-base">
              <span aria-hidden="true" className="text-2xl font-black text-[#4285f4]">G</span>
              {busy === "google" ? "Conectando..." : "Continuar com Google"}
            </button>
            <button type="button" disabled={busy !== null} onClick={() => void enterWithFacebook()}
              className="flex min-h-12 w-full items-center justify-center gap-3 rounded-2xl bg-[#1877f2] px-4 text-sm font-extrabold text-white shadow-md transition hover:scale-[1.02] hover:bg-[#1264d3] focus-visible:outline-4 focus-visible:outline-amber-300 disabled:opacity-60 sm:min-h-14 sm:text-base">
              <span aria-hidden="true" className="text-2xl font-black">f</span>
              {busy === "facebook" ? "Conectando..." : "Continuar com Facebook"}
            </button>
            <button type="button" disabled aria-label="Instagram: login indisponível"
              className="flex min-h-12 w-full cursor-not-allowed items-center justify-center gap-3 rounded-2xl border border-white/30 bg-gradient-to-r from-[#833ab4]/65 via-[#c13584]/65 to-[#e1306c]/65 px-4 text-sm font-extrabold text-white opacity-75 shadow-md sm:min-h-14 sm:text-base">
              <span aria-hidden="true" className="text-xl">◎</span>
              Instagram — indisponível
            </button>
            <p className="px-1 text-center text-[11px] leading-snug text-white/90">Google ativo. Facebook depende da ativação no backend. Instagram não oferece login pessoal compatível.</p>
          </section>
        </div>
      </div>
    </main>
  );
}
