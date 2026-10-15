import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

/** Acesso da família exclusivamente pela conta Google. */
export default function Login() {
  const [busy, setBusy] = useState<"google" | null>(null);
  const [pressed, setPressed] = useState<"google" | null>(null);
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

  const animateTap = (provider: "google") => {
    setPressed(provider);
    window.setTimeout(() => setPressed(null), 550);
  };

  const enterWithGoogle = async () => {
    if (busy) return;
    playTap();
    animateTap("google");
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


  return (
    <main className="fixed inset-0 w-full overflow-y-auto bg-[#1d381c]" aria-label="Entrar no Lemos a Palavra">
      <div className="relative mx-auto min-h-[100dvh] w-full max-w-[720px] overflow-hidden">
        <img
          src="/Pagina%20Iogin%20celular.png"
          alt="Imagem de boas-vindas da página de login do Lemos a Palavra"
          className="absolute inset-0 h-full w-full object-cover object-center"
        />
        <div className="relative z-10 flex min-h-[100dvh] flex-col items-center px-4 pt-[max(1.5rem,env(safe-area-inset-top))] pb-[max(1rem,env(safe-area-inset-bottom))]">
          <div className="flex-1 min-h-[24vh]" />
          <style>{`
            @keyframes loginIconFloat { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-9px); } }
            @keyframes loginIconPop { 0% { transform: scale(1); } 35% { transform: scale(.86) rotate(-8deg); } 65% { transform: scale(1.2) rotate(6deg); } 100% { transform: scale(1); } }
            @media (prefers-reduced-motion: reduce) { .login-motion { animation: none !important; } }
          `}</style>
          <section className="mb-[clamp(1rem,4vh,2.5rem)] w-full max-w-sm rounded-3xl border border-white/30 bg-[#123a2f]/40 px-3 py-3 shadow-2xl backdrop-blur-sm" aria-label="Escolha a forma de entrar">
            <div className="flex items-start justify-center gap-5 sm:gap-8">
              <button type="button" disabled={busy !== null} onClick={() => void enterWithGoogle()} aria-label="Entrar com Google" title="Entrar com Google"
                className="group flex w-20 flex-col items-center gap-1.5 text-center text-white disabled:opacity-80">
                <span className={`login-motion flex h-[72px] w-[72px] items-center justify-center rounded-full border-[3px] border-amber-300 bg-white shadow-[0_5px_15px_rgba(0,0,0,.45)] transition-transform group-hover:scale-110 group-active:scale-95 sm:h-20 sm:w-20 ${pressed === "google" ? "animate-[loginIconPop_.55s_ease-out]" : "animate-[loginIconFloat_3.8s_ease-in-out_infinite]"}`}>
                  <svg viewBox="0 0 48 48" className="h-11 w-11" aria-hidden="true">
                    <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5Z"/>
                    <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.28 5.48-4.81 7.18l7.73 6C44.37 38.03 46.98 31.88 46.98 24.55Z"/>
                    <path fill="#FBBC05" d="M10.53 28.59A14.4 14.4 0 0 1 9.75 24c0-1.59.27-3.13.76-4.59l-7.98-6.2A23.9 23.9 0 0 0 0 24c0 3.87.93 7.52 2.56 10.78l7.97-6.19Z"/>
                    <path fill="#34A853" d="M24 48c6.48 0 11.92-2.13 15.89-5.8l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48Z"/>
                  </svg>
                </span>
                <span className="text-xs font-extrabold drop-shadow-md">{busy === "google" ? "Aguarde..." : "Google"}</span>
              </button>


            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
