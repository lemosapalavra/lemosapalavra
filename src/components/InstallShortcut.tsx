import shortcutImage from "@/assets/login-shortcut-icon.webp";
import { useIconVisible } from "@/lib/iconVisibility";
import { useEffect, useRef, useState } from "react";
import { QRCodeCanvas } from "qrcode.react";
import { Download, Volume2, VolumeX, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

declare global {
  interface Window {
    __lemosDeferredInstall: any;
  }
}

/**
 * Downloads a self-contained HTML shortcut file the user can save on their
 * desktop / files. Double-clicking it opens the site instantly, with the
 * Lemos a Palavra logo shown as a big clickable button. This works on any
 * OS (Windows, macOS, Linux, Android, iOS) without scanning QR codes or
 * typing the address.
 */
function downloadShortcutFile() {
  const siteUrl = `${window.location.origin}/`;
  const logoUrl = `${window.location.origin}/favicon.png`;
  const html = `<!doctype html>
<html lang="pt-BR">
<head>
<meta charset="utf-8">
<title>Lemos a Palavra</title>
<link rel="icon" href="${logoUrl}" type="image/png">
<meta http-equiv="refresh" content="0; url=${siteUrl}">
<style>
  html,body{margin:0;height:100%;background:linear-gradient(180deg,#fef3c7,#fde68a);font-family:system-ui,-apple-system,Segoe UI,Roboto,sans-serif;}
  .wrap{min-height:100%;display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center;padding:24px;}
  a{display:inline-block;text-decoration:none;color:#78350f;}
  img{width:220px;height:220px;border-radius:32px;box-shadow:0 20px 40px rgba(0,0,0,.15);}
  h1{font-size:28px;margin:20px 0 6px;}
  p{margin:0;color:#92400e;}
</style>
</head>
<body>
  <div class="wrap">
    <a href="${siteUrl}">
      <img loading="lazy" decoding="async" src="${logoUrl}" alt="Lemos a Palavra">
      <h1>Lemos a Palavra</h1>
      <p>Abrindo o site… se não abrir automaticamente, clique na logo.</p>
    </a>
  </div>
  <script>setTimeout(function(){location.href=${JSON.stringify(siteUrl)}},50);<\/script>
</body>
</html>`;
  const blob = new Blob([html], { type: "text/html;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "Lemos a Palavra.html";
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(() => URL.revokeObjectURL(url), 2000);
}

function isIOS() {
  return /iPad|iPhone|iPod/.test(navigator.userAgent);
}
function isAndroid() {
  return /Android/.test(navigator.userAgent);
}

export default function InstallShortcut({ compact = false, headerTile = false }: { compact?: boolean; headerTile?: boolean }) {
  // Always show the clickable logo shortcut on the login screen
  const [installable, setInstallable] = useState<boolean>(
    typeof window !== "undefined" && !!window.__lemosDeferredInstall
  );
  const [busy, setBusy] = useState(false);
  const atalhoVisible = useIconVisible("atalho");
  const [done, setDone] = useState<string>("");
  const navigate = useNavigate();
  const [downloadHelpOpen, setDownloadHelpOpen] = useState(false);
  const [downloadSpeaking, setDownloadSpeaking] = useState(false);
  const downloadAudioRef = useRef<HTMLAudioElement | null>(null);
  const stopDownloadAudio = () => { downloadAudioRef.current?.pause(); downloadAudioRef.current = null; setDownloadSpeaking(false); };
  useEffect(() => () => { downloadAudioRef.current?.pause(); }, []);
  const toggleDownloadAudio = () => {
    if (downloadAudioRef.current) { stopDownloadAudio(); return; }
    const audio = new Audio("/audio/lia/lia-downloads.mp3");
    downloadAudioRef.current = audio;
    audio.onended = () => { if (downloadAudioRef.current === audio) { downloadAudioRef.current = null; setDownloadSpeaking(false); } };
    audio.onerror = () => { if (downloadAudioRef.current === audio) { downloadAudioRef.current = null; setDownloadSpeaking(false); } };
    setDownloadSpeaking(true);
    void audio.play().catch(() => { if (downloadAudioRef.current === audio) { downloadAudioRef.current = null; setDownloadSpeaking(false); } });
  };

  useEffect(() => {
    const on = () => setInstallable(!!window.__lemosDeferredInstall);
    const off = () => setInstallable(false);
    window.addEventListener("lemos_installable", on);
    window.addEventListener("lemos_installed", off);
    return () => {
      window.removeEventListener("lemos_installable", on);
      window.removeEventListener("lemos_installed", off);
    };
  }, []);

  const handleClick = async () => {
    if (headerTile) {
      stopDownloadAudio();
      setDownloadHelpOpen(false);
      navigate("/tesouros");
      return;
    }
    setDone("");
    setBusy(true);
    try {
      import("@/lib/logEvent").then(({ logEvent }) => logEvent("Baixar Atalho"));
      // 1) Native PWA install (Chrome/Edge/Android): real icon on home screen.
      if (window.__lemosDeferredInstall) {
        const p = window.__lemosDeferredInstall;
        p.prompt();
        const choice = await p.userChoice;
        window.__lemosDeferredInstall = null;
        setInstallable(false);
        if (choice.outcome === "accepted") {
          setDone("✅ Atalho instalado! Procure o ícone da Lemos a Palavra na sua tela inicial.");
          setBusy(false);
          return;
        }
      }
      // 2) iOS Safari: sem instalação programática — baixa o atalho HTML e mostra a dica.
      if (isIOS()) {
        downloadShortcutFile();
        setDone(
          "📱 No iPhone/iPad: baixamos um atalho da Lemos a Palavra. Você também pode tocar no botão Compartilhar do Safari e escolher “Adicionar à Tela de Início” para criar o ícone da logo na tela inicial."
        );
        setBusy(false);
        return;
      }
      // 3) Android without install event: fallback download + hint.
      if (isAndroid()) {
        downloadShortcutFile();
        setDone(
          "📥 Baixamos um atalho. No menu do navegador (⋮) você também pode escolher “Adicionar à tela inicial” para criar um ícone com a logo."
        );
        setBusy(false);
        return;
      }
      // 4) Desktop fallback: download HTML shortcut with logo.
      downloadShortcutFile();
      setDone(
        "📥 Atalho baixado! Salve o arquivo Lemos a Palavra.html no seu Desktop — basta clicar duas vezes para abrir o site direto."
      );
    } finally {
      setBusy(false);
    }
  };

  if (!atalhoVisible) return null;
  const siteUrl = typeof window !== "undefined" ? `${window.location.origin}/` : "https://lemosapalavra.live/";

  if (headerTile) return (
    <div className="relative flex flex-col items-start" onMouseEnter={() => setDownloadHelpOpen(true)} onMouseLeave={() => { setDownloadHelpOpen(false); stopDownloadAudio(); }}>
      <button type="button" onClick={handleClick} onFocus={() => setDownloadHelpOpen(true)} disabled={busy}
        aria-label="Abrir Tesouro da Palavra e downloads" aria-describedby={downloadHelpOpen ? "lia-home-downloads" : undefined}
        title="Tesouro da Palavra"
        className="flex w-[132px] min-[390px]:w-[145px] sm:w-[190px] min-w-0 items-center gap-2 rounded-2xl border-[3px] border-amber-400 bg-gradient-to-br from-[#a9652c] via-[#794015] to-[#49250c] px-2 py-2 text-left text-amber-50 shadow-[0_4px_12px_rgba(0,0,0,.5)] transition-transform hover:scale-105 active:scale-95 disabled:opacity-60">
        <Download aria-hidden="true" className="h-9 w-9 shrink-0 rounded-full border-2 border-amber-300 bg-amber-100/20 p-1.5 text-yellow-200 sm:h-11 sm:w-11" />
        <span className="min-w-0 text-xs font-extrabold sm:text-sm">{busy ? "Preparando..." : "Download"}</span>
      </button>
      {downloadHelpOpen && <div id="lia-home-downloads" role="tooltip" className="absolute left-0 top-full z-[120] mt-3 w-[min(320px,calc(100vw-16px))] rounded-[22px] border-[3px] border-amber-400 bg-white p-3 text-slate-900 shadow-[0_0_16px_rgba(245,158,11,.65)]">
        <span aria-hidden="true" className="absolute -top-[12px] left-9 h-[20px] w-[20px] rotate-45 border-l-[3px] border-t-[3px] border-amber-400 bg-white" />
        <div className="relative flex items-start gap-2">
          <div className="min-w-0 flex-1 text-[13px] font-medium leading-relaxed">
            <p>Bem-vindo ao Tesouro da Palavra!</p>
            <p className="mt-2">Aqui, cada brincadeira vira uma linda conquista!</p>
            <p className="mt-2">Brinque, aprenda, ganhe pontos e desbloqueie presentes bíblicos para baixar!</p>
            <strong className="mt-2 block font-extrabold text-amber-900">Cada tesouro é uma semente de amor que Deus planta em seu coração!</strong>
          </div>
          <div className="flex shrink-0 flex-col gap-2">
            <button type="button" onClick={toggleDownloadAudio} aria-label={downloadSpeaking ? "Parar gravação da LIA" : "Ouvir gravação da LIA"} className="rounded-full border-2 border-amber-400 bg-green-700 p-2 text-white shadow">{downloadSpeaking ? <VolumeX size={17}/> : <Volume2 size={17}/>}</button>
            <button type="button" onClick={() => { setDownloadHelpOpen(false); stopDownloadAudio(); }} aria-label="Fechar explicação" className="rounded-full border border-amber-300 bg-white p-2 text-slate-700"><X size={17}/></button>
          </div>
        </div>
      </div>}
    </div>
  );

  return (
    <div className={compact ? "flex flex-col items-center gap-2" : "mt-4 flex flex-col items-center gap-3"}>
      <div className="relative flex items-center justify-center">
        {/* Pointing hand indicator — same vibe as the airplane hint */}
        {!compact && (
          <span
            aria-hidden
            className="absolute -left-14 sm:-left-16 text-4xl sm:text-5xl select-none"
            style={{ animation: "point-bounce 1s ease-in-out infinite" }}
          >
            👉
          </span>
        )}
        <Button variant="outline"
          type="button"
          onClick={handleClick}
          disabled={busy}
          aria-label="Baixar atalho clicável da Lemos a Palavra"
          title="Download"
          className={`relative group border-0 bg-transparent shadow-none p-0 hover:bg-transparent hover:scale-110 hover:brightness-110 hover:shadow-[0_0_22px_rgba(255,255,255,.9)] active:scale-95 focus-visible:ring-4 focus-visible:ring-amber-400 transition-all duration-200 cursor-pointer disabled:opacity-60 ${compact ? "h-[88px] w-[88px] sm:h-[110px] sm:w-[110px]" : "h-32 w-32 sm:h-40 sm:w-40"}`}
        >
          <img loading="lazy" decoding="async"
            src={shortcutImage}
            alt="Baixe o Atalho"
            className="h-full w-full object-contain drop-shadow-[0_0_12px_rgba(255,215,70,.75)]"
          />
           {compact ? null : <span className="absolute -bottom-3 left-1/2 -translate-x-1/2 whitespace-nowrap bg-primary text-primary-foreground font-display font-extrabold rounded-full shadow-lg text-xs sm:text-sm px-3 py-1">{busy ? "Preparando…" : "📥 Baixar atalho"}</span>}
        </Button>
      </div>
      {!compact && (
        <p className="text-xs sm:text-sm font-body text-amber-900 text-center leading-snug max-w-[280px] mt-3">
          Clique na logo para <strong>baixar o atalho</strong> da Lemos a Palavra
          e entrar direto no site, sem digitar o endereço.
        </p>
      )}

      {/* QR code + URL removidos a pedido do usuário. */}

      {done && (
        <p className="text-[11px] font-body text-amber-900 text-center leading-snug max-w-[260px]">{done}</p>
      )}
      <style>{`
        @keyframes point-bounce {
          0%, 100% { transform: translateX(0); }
          50% { transform: translateX(10px); }
        }
      `}</style>
    </div>
  );
}
