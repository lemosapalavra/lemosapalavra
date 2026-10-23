import { useEffect, useRef, useState, type FormEvent } from "react";
import loginBackground from "@/assets/login-optimized.webp";
import { useNavigate } from "react-router-dom";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable/index";
import { Volume2, VolumeX, X } from "lucide-react";
import InstallShortcut from "@/components/InstallShortcut";

/** Acesso da família por Google ou link de e-mail. */
export default function Login() {
  const [busy, setBusy] = useState<"google" | "email" | null>(null);
  const [pressed, setPressed] = useState<"google" | null>(null);
  const [emailLoginOpen, setEmailLoginOpen] = useState(false);
  const [emailAddress, setEmailAddress] = useState("");
  const [liaOpen, setLiaOpen] = useState(false);
  const [speaking, setSpeaking] = useState(false);
  const speechRef = useRef<SpeechSynthesisUtterance | null>(null);
  const loginHelp = "Oieee! Bem-vindo ao Lemos a Palavra! Para entrar, clique no ícone do Google e escolha sua conta, ou clique no envelope para receber um link de acesso por e-mail. Quer abrir nosso site mais rápido no celular? Toque em Baixar atalho. Deus te abençoe!";
  useEffect(() => () => { window.speechSynthesis?.cancel(); }, []);
  const toggleSpeech = () => {
    if (!("speechSynthesis" in window)) { toast({ title: "Leitura em voz alta indisponível neste navegador." }); return; }
    window.speechSynthesis.cancel();
    if (speechRef.current) { speechRef.current = null; setSpeaking(false); return; }
    const utterance = new SpeechSynthesisUtterance(loginHelp);
    utterance.lang = "pt-BR";
    utterance.rate = 0.94;
    const voice = window.speechSynthesis.getVoices().find(v => /^pt-BR/i.test(v.lang)) ?? window.speechSynthesis.getVoices().find(v => /^pt/i.test(v.lang));
    if (voice) utterance.voice = voice;
    utterance.onend = utterance.onerror = () => { if (speechRef.current === utterance) { speechRef.current = null; setSpeaking(false); } };
    speechRef.current = utterance;
    setSpeaking(true);
    window.speechSynthesis.speak(utterance);
  };
  const navigate = useNavigate();
  const [checkingSession, setCheckingSession] = useState(true);

  useEffect(() => {
    let active = true;
    const timeout = window.setTimeout(() => { if (active) setCheckingSession(false); }, 12000);
    void supabase.auth.getSession().then(({ data }) => {
      if (!active) return;
      window.clearTimeout(timeout);
      if (data.session?.user) navigate("/", { replace: true });
      else setCheckingSession(false);
    }).catch(() => { if (active) setCheckingSession(false); });
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      if (active && session?.user) navigate("/", { replace: true });
    });
    return () => { active = false; window.clearTimeout(timeout); listener.subscription.unsubscribe(); };
  }, [navigate]);

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


  const enterWithEmail = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (busy) return;
    const email = emailAddress.trim().toLowerCase();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      toast({ title: "Informe um e-mail válido", variant: "destructive" });
      return;
    }
    playTap();
    setBusy("email");
    try {
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: { emailRedirectTo: window.location.origin + "/login", shouldCreateUser: true },
      });
      if (error) throw error;
      toast({ title: "Confira seu e-mail", description: "Se o endereço estiver habilitado, você receberá um link para entrar." });
      setEmailLoginOpen(false);
    } catch (error) {
      toast({ title: "Não foi possível enviar o link", description: error instanceof Error ? error.message : "Tente novamente.", variant: "destructive" });
    } finally {
      setBusy(null);
    }
  };

  return (
    <main className="fixed inset-0 w-full overflow-y-auto bg-[#1d381c]" aria-label="Entrar no Lemos a Palavra">
      <div className="relative mx-auto min-h-[100dvh] w-full max-w-[720px] overflow-hidden">
        <img
          src={loginBackground}
          alt="Imagem de boas-vindas da página de login do Lemos a Palavra"
          className="absolute inset-0 h-full w-full object-cover object-center"
        />
        <div className="relative z-10 flex min-h-[100dvh] flex-col items-center px-4 pt-[max(1.5rem,env(safe-area-inset-top))] pb-[max(1rem,env(safe-area-inset-bottom))]">
          <div className="flex-1 min-h-[24vh]" />
          <style>{`
            @keyframes loginIconFloat { 0%,100% { transform: scale(1); filter: drop-shadow(0 0 5px rgba(255,255,255,.3)); } 50% { transform: scale(1.12); filter: drop-shadow(0 0 18px rgba(255,215,70,.9)); } }
            @keyframes loginIconGlow { 0%,100% { opacity: 1; } 50% { opacity: .96; } }
            @keyframes loginIconPop { 0% { transform: scale(1); } 35% { transform: scale(.86) rotate(-8deg); } 65% { transform: scale(1.2) rotate(6deg); } 100% { transform: scale(1); } }
            .google-login-floating { animation: loginIconFloat 2.6s ease-in-out infinite, loginIconGlow 2.6s ease-in-out infinite; will-change: transform; }
            .google-login-pressed { animation: loginIconPop .55s ease-out, loginIconGlow 2.6s ease-in-out infinite; }
            @media (prefers-reduced-motion: reduce) { .login-motion { animation: none !important; } }
          `}</style>
          <section className="relative -translate-y-[clamp(3rem,10dvh,7rem)] mx-auto w-fit px-4 py-3" aria-label="Escolha a forma de entrar">
            <div className="flex items-start justify-center gap-8 sm:gap-12">
              <button type="button" disabled={busy !== null || checkingSession} onClick={() => void enterWithGoogle()} aria-label="Entrar com Google" title="Entrar com Google"
                className="group flex w-20 items-center justify-center text-white disabled:opacity-80">
                <span className={`login-motion flex h-[72px] w-[72px] items-center justify-center rounded-full border-[3px] border-white bg-white/20 shadow-[0_0_0_2px_rgba(255,215,85,.9),0_0_16px_5px_rgba(255,255,255,.9),0_0_28px_9px_rgba(255,210,65,.65),0_5px_12px_rgba(0,0,0,.45)] backdrop-blur-[2px] transition-transform group-hover:scale-110 group-active:scale-95 sm:h-20 sm:w-20 ${pressed === "google" ? "google-login-pressed" : "google-login-floating"}`}>
                  <svg viewBox="0 0 48 48" className="h-11 w-11" aria-hidden="true">
                    <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5Z"/>
                    <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.28 5.48-4.81 7.18l7.73 6C44.37 38.03 46.98 31.88 46.98 24.55Z"/>
                    <path fill="#FBBC05" d="M10.53 28.59A14.4 14.4 0 0 1 9.75 24c0-1.59.27-3.13.76-4.59l-7.98-6.2A23.9 23.9 0 0 0 0 24c0 3.87.93 7.52 2.56 10.78l7.97-6.19Z"/>
                    <path fill="#34A853" d="M24 48c6.48 0 11.92-2.13 15.89-5.8l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48Z"/>
                  </svg>
                </span>

              </button>
              <button type="button" disabled={busy !== null || checkingSession} onClick={() => { playTap(); setEmailLoginOpen(value => !value); }} aria-label="Entrar por e-mail" title="Entrar por e-mail" className="group flex w-20 items-center justify-center disabled:opacity-60">
                <span className="login-motion google-login-floating flex h-[72px] w-[72px] items-center justify-center rounded-full border-[3px] border-white bg-white/20 shadow-[0_0_0_2px_rgba(255,215,85,.9),0_0_16px_5px_rgba(255,255,255,.9),0_0_28px_9px_rgba(255,210,65,.65),0_5px_12px_rgba(0,0,0,.45)] backdrop-blur-[2px] transition-transform group-hover:scale-110 group-active:scale-95 sm:h-20 sm:w-20">
                  <svg viewBox="0 0 64 64" className="h-[62px] w-[62px]" aria-hidden="true">
                    <circle cx="32" cy="32" r="29" fill="#ffffff" stroke="#f9cc56" strokeWidth="3" />
                    <rect x="12" y="19" width="40" height="27" rx="5" fill="#4285F4" />
                    <path d="M13 22 32 36 51 22" fill="none" stroke="white" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </span>
              </button>
            </div>
            <div className="relative mt-3 flex flex-col items-center">
              <button type="button" onClick={() => { playTap(); setLiaOpen(value => !value); }} aria-label="Conversar com a LIA" title="Conversar com a LIA" className="login-motion relative translate-y-[clamp(3rem,10dvh,7rem)] transition-transform hover:scale-105 active:scale-95">
                <img src="/LIA%20Posso%20Ajudar.webp" alt="LIA — Posso Ajudar?" className="h-auto w-[155px] max-w-[48vw] object-contain drop-shadow-[0_3px_9px_rgba(0,0,0,.6)] sm:w-[190px]" />
              </button>
              {liaOpen && (
                <div role="dialog" aria-label="Ajuda da LIA no login" className="relative z-20 mt-2 w-[min(310px,88vw)] rounded-2xl border-2 border-amber-300 bg-[#102f4a]/95 p-3 text-white shadow-[0_0_22px_rgba(255,215,80,.6)]">
                  <div className="flex items-center justify-between gap-2 border-b border-white/25 pb-2">
                    <strong className="text-sm text-yellow-300">COMO ACESSAR O SITE</strong>
                    <div className="flex items-center gap-1">
                      <button type="button" onClick={toggleSpeech} aria-label={speaking ? "Parar leitura" : "Ouvir orientação da página"} title={speaking ? "Parar leitura" : "Ouvir orientação"} className="rounded-lg bg-white/15 p-2">{speaking ? <VolumeX size={20} /> : <Volume2 size={20} />}</button>
                      <button type="button" onClick={() => { setLiaOpen(false); window.speechSynthesis?.cancel(); speechRef.current = null; setSpeaking(false); }} aria-label="Fechar ajuda" className="rounded-lg bg-white/15 p-2"><X size={20} /></button>
                    </div>
                  </div>
                  <p className="mt-3 text-sm leading-relaxed">Oieee! 💛 Para entrar, escolha sua conta no <strong>Google</strong> ou toque no <strong>envelope</strong> para receber um link por e-mail.</p>
                  <p className="mt-2 text-sm leading-relaxed">Quer entrar mais rápido pelo celular? Baixe o atalho e abra o Lemos a Palavra pelo ícone!</p>
                  <div className="mt-3 rounded-xl border border-sky-400 bg-sky-950/70 p-2 text-center">
                    <InstallShortcut compact />
                    <p className="mt-1 text-xs font-semibold text-white">Baixar atalho para o celular</p>
                  </div>
                </div>
              )}
            </div>
            {emailLoginOpen && (
              <form onSubmit={enterWithEmail} className="mx-auto mt-3 flex w-full max-w-xs flex-col gap-2 rounded-xl bg-slate-950/85 p-3">
                <label htmlFor="lemos-email-login" className="text-center text-xs font-semibold text-white">Receber link de acesso no e-mail</label>
                <input id="lemos-email-login" type="email" autoComplete="email" required value={emailAddress} onChange={event => setEmailAddress(event.target.value)} placeholder="seuemail@exemplo.com" className="h-11 rounded-md border border-slate-300 bg-white px-3 text-slate-950 placeholder:text-slate-500" />
                <button type="submit" disabled={busy !== null} className="rounded-md bg-amber-400 px-4 py-2 font-semibold text-slate-950 disabled:opacity-60">{busy === "email" ? "Enviando..." : "Enviar link de acesso"}</button>
              </form>
            )}
          </section>
        </div>
      </div>
    </main>
  );
}
