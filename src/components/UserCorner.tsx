import avatar_jesus from "@/assets/avatar-jesus.png";
import avatar_maria from "@/assets/avatar-maria.png";
import avatar_davi from "@/assets/avatar-davi.png";
import avatar_moises from "@/assets/avatar-moises.png";
import avatar_abraao from "@/assets/avatar-abraao.png";
import avatar_jose from "@/assets/avatar-jose.png";
import avatar_daniel from "@/assets/avatar-daniel.png";
import { useIconVisible } from "@/lib/iconVisibility";
import { useEffect, useRef, useState } from "react";
import { Volume2, X } from "lucide-react";
import MeuMural from "@/components/MeuMural";
import { useCoins } from "@/hooks/useCoins";
const iconUsuario = "/usuario.png";
function profileStatus(user: Record<string, unknown> | null): string {
  if (String(user?.email || "").trim().toLowerCase() === "marcelloborbas@gmail.com") return "Administrador";
  return "Visitante";
}
function previousProfileStatus(user: Record<string, unknown> | null): string {
  const raw = String(user?.status ?? user?.perfil ?? user?.profile ?? user?.role ?? user?.tipo ?? "").normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().trim();
  if (raw === "vip") return "VIP";
  if (raw === "familia" || raw === "family") return "Família";
  if (raw === "amigos" || raw === "amigo" || raw === "friend") return "Amigos";
  return "Visitante";
}

/** Compatibilidade com avatares salvos por nome nos cadastros antigos. */
const avatarNames: Record<string, string> = {
  jesus: avatar_jesus, maria: avatar_maria, davi: avatar_davi,
  moises: avatar_moises, abraao: avatar_abraao, jose: avatar_jose,
  lia: "/lia-mascote.png", marta: avatar_maria, noe: avatar_moises,
  paulo: avatar_davi, daniel: avatar_daniel, matheus: avatar_daniel,
};
function resolveAvatar(value?: string): string {
  const raw = (value || "").trim();
  if (!raw) return iconUsuario;
  const key = raw.toLocaleLowerCase("pt-BR").normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  const legacy = raw.match(/\/avatars-login\/([a-z-]+)\.webp(?:\?.*)?$/i);
  return avatarNames[key] || (legacy ? avatarNames[legacy[1].toLowerCase()] : undefined) || raw;
}
import { Button } from "@/components/ui/button";
import { useLocation, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

/**
 * Avatar do usuário fixo no canto inferior direito, na mesma linha da LIA.
 * Mostra "Olá, nome" acima, o avatar e as moedinhas abaixo.
 * Ao tocar, abre a janela "Meu Mural".
 */
export default function UserCorner() {
  const { coins } = useCoins();
  const navigate = useNavigate();
  const pathname = useLocation().pathname;
  const onHome = pathname === "/";
  const [user, setUser] = useState<{ name?: string; avatar?: string; status?: string; perfil?: string; profile?: string; role?: string; tipo?: string } | null>(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const sync = () => {
      try {
        const s = localStorage.getItem("lemos_user");
        const parsed = s ? JSON.parse(s) : null;
        const selected = parsed?.id ? localStorage.getItem(`lemos_avatar_${parsed.id}`) : null;
        setUser(parsed ? { ...parsed, avatar: selected || parsed.avatar } : null);
      } catch { setUser(null); }
    };
    sync();
    window.addEventListener("storage", sync);
    window.addEventListener("focus", sync);
    window.addEventListener("pageshow", sync);
    window.addEventListener("lemos:coins", sync);
    window.addEventListener("lemos_admin_change", sync);
    return () => {
      window.removeEventListener("storage", sync);
      window.removeEventListener("focus", sync);
      window.removeEventListener("pageshow", sync);
      window.removeEventListener("lemos:coins", sync);
      window.removeEventListener("lemos_admin_change", sync);
    };
  }, [pathname]);


  const [menu, setMenu] = useState(false);
  const [helpOpen, setHelpOpen] = useState(false);
  const userHelpText = "Olá, que alegria em ver você aqui! em Status, você conhece o seu perfil! No Mural, você acompanha suas conquistas! Em Premiações, descobre seus Tesouros! E para encerrar sua visita, é só clicar em Sair! Jesus te ama e nós também!";
  const helpAudioRef = useRef<HTMLAudioElement | null>(null);
  const [helpSpeaking, setHelpSpeaking] = useState(false);
  const stopHelpAudio = () => {
    helpAudioRef.current?.pause();
    helpAudioRef.current = null;
    setHelpSpeaking(false);
  };
  useEffect(() => () => { helpAudioRef.current?.pause(); }, []);
  const speakHelp = () => {
    if (helpAudioRef.current) { stopHelpAudio(); return; }
    const audio = new Audio("/audio/lia/lia-usuario.mp3");
    helpAudioRef.current = audio;
    audio.onended = () => { if (helpAudioRef.current === audio) { helpAudioRef.current = null; setHelpSpeaking(false); } };
    audio.onerror = () => { if (helpAudioRef.current === audio) { helpAudioRef.current = null; setHelpSpeaking(false); } };
    setHelpSpeaking(true);
    void audio.play().catch(() => { if (helpAudioRef.current === audio) { helpAudioRef.current = null; setHelpSpeaking(false); } });
  };

  const logout = async () => {
    try { await supabase.auth.signOut(); } catch {}
    localStorage.removeItem("lemos_user");
    window.dispatchEvent(new Event("lemos_admin_change"));
    window.location.href = "/login";
  };

  // O avatar do usuário permanece visível em todas as rotas, inclusive após navegação.
  // Não depender da configuração de visibilidade dos ícones de menu.


  if (!user?.name) return (
    <a href="/login" aria-label="Entrar ou criar conta" title="Entrar ou criar conta" className="fixed right-1 top-1 z-[75] flex flex-col items-center gap-1">
      <span className="rounded-full border-2 border-amber-300 bg-white p-1 shadow-lg"><img src={iconUsuario} alt="Usuário" className="h-9 w-9 rounded-full object-cover sm:h-11 sm:w-11" /></span>
      <span className="rounded-full border border-amber-300 bg-white px-2 py-1 text-xs font-bold text-amber-900 shadow">Entrar / Cadastrar</span>
    </a>
  );

  const [welcomeGender, setWelcomeGender] = ((): ["feminino" | "masculino" | "", (v:"feminino"|"masculino")=>void] => {
    const saved = typeof window !== "undefined" ? localStorage.getItem("lemos_welcome_gender") : null;
    const explicit = saved === "feminino" || saved === "masculino" ? saved : "";
    return [explicit, (v) => { localStorage.setItem("lemos_welcome_gender", v); window.dispatchEvent(new Event("lemos_admin_change")); }];
  })();
  const firstName = (user.name || "").trim().split(/\\s+/)[0].toLocaleLowerCase("pt-BR");
  const feminineNames = ["amanda","ana","maria","marta","mariana","juliana","julia","beatriz","gabriela","fernanda","carolina","camila","isabela","isabella","larissa","leticia","patricia","renata","rebecca","rebeca","sofia","sophia","luiza","luisa","alice","helena","laura","valentina","manuela","clara","cecilia","marcela","marcia","paula","tania","claudia","marisa","rejane"];
  const welcome = welcomeGender === "feminino" || (!welcomeGender && feminineNames.includes(firstName))
    ? "Seja bem-vinda!" : "Seja bem-vindo!";
  const greeting = new Date().getHours() < 12 ? "Bom dia" : new Date().getHours() < 18 ? "Boa tarde" : "Boa noite";
  if (true) return (
    <>
      <div className="fixed right-1 top-1 sm:top-1 z-[110] flex flex-col items-end gap-1" onMouseEnter={() => setHelpOpen(true)} onMouseLeave={() => { setHelpOpen(false); stopHelpAudio(); }}>
        <button type="button" onClick={(event) => { event.stopPropagation(); setHelpOpen(false); stopHelpAudio(); setMenu(v => !v); }} onFocus={() => { if (!menu) setHelpOpen(true); }} aria-label="Opções do usuário" aria-expanded={menu}
          className="flex w-[132px] min-[390px]:w-[145px] sm:w-[190px] min-w-0 items-center gap-1.5 rounded-2xl border-[3px] border-amber-400 bg-gradient-to-br from-[#a9652c] via-[#794015] to-[#49250c] px-1.5 py-1.5 text-left text-amber-50 shadow-[0_4px_12px_rgba(0,0,0,.5)]">
          <img src={resolveAvatar(user.avatar)} onError={e => { if (!e.currentTarget.src.endsWith(iconUsuario)) e.currentTarget.src = iconUsuario; }} alt={user.name}
            className="h-9 w-9 min-[390px]:h-10 min-[390px]:w-10 sm:h-12 sm:w-12 shrink-0 rounded-full border-2 border-amber-300 bg-white object-contain" />
          <span className="block min-w-0 flex-1 overflow-hidden text-[9px] sm:text-xs leading-tight">
            <span className="block">{greeting},</span>
            <strong className="block w-full truncate text-[11px] sm:text-sm" title={user.name}>{user.name}</strong>
            <span className="block text-[10px] sm:text-xs">{welcome}</span><span className="block font-extrabold text-yellow-200">🪙 {coins}</span>
          </span>
        </button>
        {helpOpen && !menu && <div role="tooltip" aria-label="Explicação da LIA sobre o usuário" className="relative z-[112] w-[min(320px,calc(100vw-16px))] rounded-[22px] border-[3px] border-amber-400 bg-white p-3 text-slate-900 shadow-[0_0_16px_rgba(245,158,11,.65)]">
          <span aria-hidden="true" className="absolute -top-[12px] right-9 h-[20px] w-[20px] rotate-45 border-l-[3px] border-t-[3px] border-amber-400 bg-white" />
          <div className="relative flex items-start justify-between gap-2"><strong className="text-sm text-amber-900">A LIA explica! 💛</strong><div className="flex gap-1"><button type="button" onClick={speakHelp} aria-label={helpSpeaking ? "Parar gravação da LIA" : "Ouvir gravação da LIA"} className="rounded-full border-2 border-amber-400 bg-green-700 p-2 text-white shadow"><Volume2 size={17}/></button><button type="button" onClick={() => { setHelpOpen(false); stopHelpAudio(); }} aria-label="Fechar fala da LIA" className="rounded-full border border-amber-300 bg-white p-2 text-slate-700"><X size={17}/></button></div></div>
          <div className="mt-2 max-h-[min(34dvh,220px)] overflow-y-auto text-[13px] leading-relaxed"><p>Olá, que alegria em ver você aqui!</p><p className="mt-2">em <strong>Status</strong>, você conhece o seu perfil!</p><p className="mt-2">No <strong>Mural</strong>, você acompanha suas conquistas!</p><p className="mt-2">Em <strong>Premiações</strong>, descobre seus Tesouros!</p><p className="mt-2">E para encerrar sua visita, é só clicar em <strong>Sair</strong>!</p><strong className="mt-2 block text-amber-900">Jesus te ama e nós também!</strong></div>
        </div>}
        {menu && <div className="relative z-[111] flex flex-col items-end gap-2 rounded-xl bg-white/95 p-2 shadow-lg">
          <div className="w-full px-1 py-1 text-center text-sm font-bold text-amber-950">Status: {profileStatus(user)}</div>
          <div className="flex flex-wrap justify-end gap-1">
          <Button size="sm" variant="outline" onClick={() => { setOpen(true); setMenu(false); }}>Meu Mural</Button>
          <Button size="sm" variant="outline" onClick={() => { setMenu(false); navigate("/tesouros"); }}>🏆 Premiações</Button>
          <Button size="sm" variant="destructive" onClick={logout}>Sair</Button>
          </div>
        </div>}
      </div>
      <MeuMural open={open} onClose={() => setOpen(false)} />
    </>
  );

  return (
    <>
      <div className="fixed right-2 bottom-3 z-[45] flex flex-col items-center gap-1 sm:right-4">
      <Button variant="ghost"
        onClick={() => setMenu((v) => !v)}
        title="Opções do usuário"
        aria-label="Opções do usuário"
        aria-expanded={menu}
        className="h-auto flex flex-col items-center gap-1 icon-glow"
      >
        <span className="font-display font-extrabold text-[11px] sm:text-xs text-amber-900 bg-white/90 border border-amber-300 rounded-full px-2 py-0.5 shadow max-w-[130px] truncate">
          Olá, {user.name}
        </span>
        <span className="w-[64px] h-[64px] sm:w-[80px] sm:h-[80px] rounded-full bg-white shadow-lg border-2 border-amber-300 overflow-hidden block">
          <img
            src={user.avatar || iconUsuario}
            onError={(e) => { if (!e.currentTarget.src.endsWith(iconUsuario)) e.currentTarget.src = iconUsuario; }}
            alt={user.name}
            className="w-full h-full object-cover"
            loading="lazy"
          />
        </span>
        <span className="flex items-center gap-1 font-display font-extrabold text-[11px] sm:text-xs text-amber-900 bg-gradient-to-r from-amber-100 to-yellow-100 border border-amber-300 rounded-full px-2 py-0.5 shadow">
          🪙 {coins}
        </span>
      </Button>
      <Button variant="outline" size="sm" onClick={() => setOpen(true)} className="h-7 rounded-full px-3 font-display font-extrabold text-[11px] shadow">
        Meu Mural
      </Button>
      {menu && (
        <Button variant="destructive" size="sm" onClick={logout} className="h-7 rounded-full px-3 font-display font-extrabold text-[11px] shadow">
          Sair
        </Button>
      )}
      </div>

      <MeuMural open={open} onClose={() => setOpen(false)} />
    </>
  );
}
