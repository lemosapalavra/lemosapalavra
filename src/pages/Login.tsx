import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

/** Acesso da família por conta Google; Facebook será habilitado quando disponível. */
export default function Login() {
  const [busy, setBusy] = useState<"google" | "facebook" | null>(null);
  const navigate = useNavigate();

  const playTap = () => {
    try {
      const AudioContextClass = window.AudioContext;
      if (!AudioContextClass) return;
      const ctx = new AudioContextClass();
      const oscillator = ctx.createOscillator();
      const gain = ctx.createGain();
      oscillator.type = "sine";
      oscillator.frequency.setValueAtTime(660, ctx.currentTime);
      oscillator.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.1);
      gain.gain.setValueAtTime(0.09, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.16);
      oscillator.connect(gain);
      gain.connect(ctx.destination);
      oscillator.start();
      oscillator.stop(ctx.currentTime + 0.17);
      oscillator.onended = () => void ctx.close();
    } catch { /* audio may be unavailable */ }
  };

  const enterWithGoogle = async () => {
    if (busy) return;
    playTap();
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
    playTap();
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
          className="absolute inset-0 h-full w-full object-cover object-center saturate-[1.3] contrast-[1.08] brightness-[1.06]"
        />
        <div className="pointer-events-none absolute inset-x-0 top-0 h-[27%] bg-gradient-to-b from-[#123a2f]/45 via-[#123a2f]/20 to-transparent" />
        <div className="relative z-10 flex min-h-[100dvh] flex-col items-center px-4 pt-[max(1.5rem,env(safe-area-inset-top))] pb-[max(1rem,env(safe-area-inset-bottom))]">
          <div className="flex-1 min-h-[24vh]" />
          <a href="/" className="mb-3 rounded-full border-2 border-amber-300 bg-[#17412e]/70 px-6 py-2.5 text-center text-sm font-extrabold text-white shadow-lg transition hover:bg-[#17412e]/90 focus-visible:outline-4 focus-visible:outline-amber-300">Acessar o site</a>
          <section className="mb-[clamp(1rem,4vh,2.5rem)] w-full max-w-sm rounded-3xl border border-white/30 bg-[#123a2f]/40 px-3 py-3 shadow-2xl backdrop-blur-sm" aria-label="Escolha a forma de entrar">
            <div className="flex items-start justify-center gap-5 sm:gap-8">
              <button type="button" disabled={busy !== null} onClick={() => void enterWithGoogle()} aria-label="Entrar com Google" title="Entrar com Google"
                className="group flex w-20 flex-col items-center gap-1.5 text-center text-white disabled:opacity-60">
                <span className="flex h-[72px] w-[72px] items-center justify-center rounded-full border-[3px] border-amber-300 bg-white shadow-[0_5px_15px_rgba(0,0,0,.45)] transition-transform group-hover:scale-110 group-active:scale-95 sm:h-20 sm:w-20">
                  <svg viewBox="0 0 48 48" className="h-11 w-11" aria-hidden="true">
                    <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5Z"/>
                    <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.28 5.48-4.81 7.18l7.73 6C44.37 38.03 46.98 31.88 46.98 24.55Z"/>
                    <path fill="#FBBC05" d="M10.53 28.59A14.4 14.4 0 0 1 9.75 24c0-1.59.27-3.13.76-4.59l-7.98-6.2A23.9 23.9 0 0 0 0 24c0 3.87.93 7.52 2.56 10.78l7.97-6.19Z"/>
                    <path fill="#34A853" d="M24 48c6.48 0 11.92-2.13 15.89-5.8l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48Z"/>
                  </svg>
                </span>
                <span className="text-xs font-extrabold drop-shadow-md">{busy === "google" ? "Aguarde..." : "Google"}</span>
              </button>
              <button type="button" disabled={busy !== null} onClick={() => void enterWithFacebook()} aria-label="Entrar com Facebook" title="Entrar com Facebook"
                className="group flex w-20 flex-col items-center gap-1.5 text-center text-white disabled:opacity-60">
                <span className="flex h-[72px] w-[72px] items-center justify-center rounded-full border-[3px] border-amber-300 bg-[#1877f2] shadow-[0_5px_15px_rgba(0,0,0,.45)] transition-transform group-hover:scale-110 group-active:scale-95 sm:h-20 sm:w-20">
                  <span aria-hidden="true" className="translate-y-1 font-sans text-[58px] font-black leading-none text-white">f</span>
                </span>
                <span className="text-xs font-extrabold drop-shadow-md">{busy === "facebook" ? "Aguarde..." : "Facebook"}</span>
              </button>

            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
