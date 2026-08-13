import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { LogOut, Search, Settings, User } from "lucide-react";
import FeedbackFooter from "@/components/FeedbackFooter";
import DedicatoriaModal from "@/components/DedicatoriaModal";
import InstallShortcut from "@/components/InstallShortcut";
import NewVideosBadge from "@/components/NewVideosBadge";
import NotifyOptIn from "@/components/NotifyOptIn";
import { useCoins } from "@/hooks/useCoins";
import { useIsAdmin } from "@/hooks/useIsAdmin";

import logoCentral from "@/assets/logo-central.png";
import iconUsuario from "@/assets/icon-usuario.png";
import heroImg from "@/assets/lemos-play/milagres-jesus.png.asset.json";
import cardCriacao from "@/assets/lemos-play/a-criacao-thumb-v3.png.asset.json";
import cardNoe from "@/assets/lemos-play/noe-arca-thumb-v3.png.asset.json";
import cardDavi from "@/assets/lemos-play/davi-golias-thumb-v4.png.asset.json";
import cardMusicas from "@/assets/album-faixas/louvores.png.asset.json";
import cardAtividades from "@/assets/album-faixas/animais.png.asset.json";
import cardParabolas from "@/assets/album-faixas/parabolas.png.asset.json";
import cardHerois from "@/assets/album-faixas/herois.png.asset.json";
import cardJesus from "@/assets/lemos-play/jesus-serie-logo.png.asset.json";

const NAV = [
  { label: "Início", to: "/" },
  { label: "Histórias", to: "/lemosplay" },
  { label: "Músicas", to: "/louvores" },
  { label: "Atividades", to: "/atividades" },
  { label: "Playlists", to: "/louvores" },
  { label: "Mais", to: "/album" },
];

const CARDS = [
  { title: "A Criação", img: cardCriacao.url, to: "/lemosplay" },
  { title: "Arca de Noé", img: cardNoe.url, to: "/lemosplay" },
  { title: "Davi e Golias", img: cardDavi.url, to: "/lemosplay" },
  { title: "Músicas e Louvores", img: cardMusicas.url, to: "/louvores" },
  { title: "Atividades Bíblicas", img: cardAtividades.url, to: "/atividades" },
  { title: "Parábolas de Jesus", img: cardParabolas.url, to: "/lemosplay" },
  { title: "Álbum de Figurinhas", img: cardHerois.url, to: "/album" },
  { title: "Aprendendo com Jesus", img: cardJesus.url, to: "/devocionais" },
];

/** Versão 2 do site: cabeçalho com menu, herói e cards de destaque. */
export default function IndexV2() {
  const navigate = useNavigate();
  const { coins } = useCoins();
  const isAdmin = useIsAdmin();
  const [user, setUser] = useState<{ name: string; email?: string; avatar?: string } | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [dedicatoriaOpen, setDedicatoriaOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem("lemos_user");
    if (stored) {
      try { setUser(JSON.parse(stored)); } catch {}
    }
  }, []);

  useEffect(() => {
    const onDoc = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) setMenuOpen(false);
    };
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, []);

  const handleLogout = async () => {
    try { await (await import("@/integrations/supabase/client")).supabase.auth.signOut(); } catch {}
    localStorage.removeItem("lemos_user");
    setUser(null);
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Cabeçalho */}
      <header className="w-full sticky top-0 z-30 bg-white/95 backdrop-blur border-b border-border shadow-sm">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 h-20 flex items-center justify-between gap-3">
          <Link to="/" className="shrink-0">
            <img src={logoCentral} alt="Lemos a Palavra" className="h-14 sm:h-16 w-auto" />
          </Link>

          <nav className="hidden md:flex items-center gap-6">
            {NAV.map((n) => (
              <Link
                key={n.to + n.label}
                to={n.to}
                className="font-display font-bold text-[15px] text-foreground hover:text-primary transition-colors"
              >
                {n.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <button
              onClick={() => navigate("/biblia")}
              className="w-10 h-10 rounded-full bg-secondary hover:bg-accent flex items-center justify-center"
              aria-label="Buscar na Bíblia"
            >
              <Search className="w-5 h-5 text-foreground" />
            </button>
            {user && (
              <div className="hidden sm:flex items-center gap-1 px-2.5 py-1 rounded-full bg-gradient-to-r from-amber-100 to-yellow-100 border border-amber-300">
                <span className="text-base leading-none">🪙</span>
                <span className="font-display font-extrabold text-sm text-amber-900 tabular-nums">{coins}</span>
              </div>
            )}
            {isAdmin && (
              <button
                onClick={() => navigate("/config")}
                className="w-10 h-10 rounded-full bg-secondary hover:bg-accent flex items-center justify-center"
                aria-label="Configurações"
              >
                <Settings className="w-4 h-4 text-foreground" />
              </button>
            )}
            {user ? (
              <div className="relative" ref={menuRef}>
                <button
                  onClick={() => setMenuOpen((v) => !v)}
                  className="flex items-center gap-2 px-1.5 py-1 rounded-full hover:bg-secondary transition"
                  aria-label="Menu do usuário"
                >
                  <img
                    src={user.avatar || iconUsuario}
                    onError={(e) => { (e.currentTarget as HTMLImageElement).src = iconUsuario; }}
                    alt={user.name || "Usuário"}
                    className="w-10 h-10 rounded-full border-2 border-amber-300 object-cover bg-white"
                  />
                  <span className="hidden sm:block text-left leading-tight">
                    <span className="block font-display font-bold text-sm max-w-[170px] truncate">Seja Bem vindo, {user.name}</span>
                    <span className="block font-body text-[11px] text-muted-foreground">Deus Seja Louvado!</span>
                  </span>
                </button>

                {menuOpen && (
                  <div className="absolute right-0 mt-2 w-44 bg-popover rounded-xl shadow-lg border border-border overflow-hidden z-50">
                    <button
                      onClick={() => { setMenuOpen(false); handleLogout(); }}
                      className="w-full flex items-center gap-2 px-3 py-2 text-sm font-display font-bold text-destructive hover:bg-destructive/10 transition"
                    >
                      <LogOut className="w-4 h-4" /> Sair
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={() => navigate("/login")}
                className="w-10 h-10 rounded-full bg-secondary hover:bg-accent flex items-center justify-center"
                aria-label="Entrar"
              >
                <User className="w-5 h-5 text-foreground" />
              </button>
            )}
          </div>
        </div>

        {/* Menu mobile */}
        <nav className="md:hidden flex items-center gap-4 overflow-x-auto px-4 pb-2">
          {NAV.map((n) => (
            <Link key={"m" + n.label} to={n.to} className="font-display font-bold text-sm text-foreground whitespace-nowrap">
              {n.label}
            </Link>
          ))}
        </nav>
      </header>

      <main className="flex-1 w-full">
        {/* Herói */}
        <section
          className="w-full"
          style={{ background: "transparent" }}
        >
          <div className="max-w-7xl mx-auto px-5 sm:px-8 py-10 sm:py-14 grid md:grid-cols-2 gap-8 items-center">
            <div>
              <h1 className="font-display font-extrabold text-[clamp(28px,5vw,54px)] leading-[1.08] text-primary">
                Histórias que ensinam,
                <br /> valores que transformam,
                <br /> vidas que florescem!
              </h1>
              <button
                onClick={() => navigate("/lemosplay")}
                className="mt-7 px-8 py-4 rounded-full bg-amber-400 hover:bg-amber-500 text-amber-950 font-display font-extrabold tracking-wide shadow-lg transition active:scale-95"
              >
                EXPLORAR AGORA!
              </button>
            </div>
            <div className="flex justify-center">
              <img
                src={heroImg.url}
                alt="Crianças aprendendo histórias bíblicas"
                loading="eager"
                decoding="async"
                className="w-full max-w-md rounded-3xl shadow-xl object-cover"
              />
            </div>
          </div>
        </section>

        {/* Cards de destaque */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
          <h2 className="sr-only">Destaques</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-8 gap-3">
            {CARDS.map((c) => (
              <Link
                key={c.title}
                to={c.to}
                className="group relative rounded-2xl overflow-hidden shadow-md hover:shadow-xl hover:-translate-y-1 transition-all bg-card"
              >
                <img
                  src={c.img}
                  alt={c.title}
                  loading="lazy"
                  decoding="async"
                  className="w-full aspect-[3/4] object-cover"
                />
                <div className="absolute inset-x-0 bottom-0 bg-primary/85 px-2 py-2">
                  <p className="font-display font-bold text-xs sm:text-sm text-primary-foreground leading-tight text-center">
                    {c.title}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {user && (
          <div className="flex justify-center pb-4">
            <div className="flex flex-col items-center gap-2"><NewVideosBadge /><NotifyOptIn /></div>
          </div>
        )}

        <div className="flex items-end justify-center gap-6 pb-6">
          {user && <InstallShortcut compact />}
          <button
            onClick={() => setDedicatoriaOpen(true)}
            className="px-6 py-3 rounded-full border-2 border-amber-300 bg-amber-50 hover:bg-amber-100 font-display font-bold text-amber-900 transition"
          >
            📜 Dedicatória
          </button>
        </div>
      </main>

      <FeedbackFooter />
      <DedicatoriaModal open={dedicatoriaOpen} onOpenChange={setDedicatoriaOpen} />
    </div>
  );
}
