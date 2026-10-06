import { useIconVisible } from "@/lib/iconVisibility";
import { useEffect, useState } from "react";
import { QRCodeCanvas } from "qrcode.react";
import { Download } from "lucide-react";
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

export default function InstallShortcut({ compact = false }: { compact?: boolean }) {
  // Always show the clickable logo shortcut on the login screen
  const [installable, setInstallable] = useState<boolean>(
    typeof window !== "undefined" && !!window.__lemosDeferredInstall
  );
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState<string>("");

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

  const siteUrl = typeof window !== "undefined" ? `${window.location.origin}/` : "https://lemosapalavra.live/";

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
          title="Clique para baixar o atalho da Lemos a Palavra"
          className={`relative group rounded-full overflow-visible border-2 border-border bg-background shadow-lg hover:scale-105 hover:brightness-125 hover:drop-shadow-[0_0_16px_hsl(var(--primary))] active:brightness-150 transition-all disabled:opacity-60 ${compact ? "h-16 w-16 sm:h-20 sm:w-20 icon-glow" : "h-32 w-32 sm:h-40 sm:w-40"}`}
        >
          <img loading="lazy" decoding="async"
            src="/favicon.png"
            alt="Lemos a Palavra"
            className="h-full w-full rounded-full object-cover"
          />
           {compact ? <Download className="absolute -bottom-1 -right-1 rounded-full bg-primary text-primary-foreground p-0.5" /> : <span className="absolute -bottom-3 left-1/2 -translate-x-1/2 whitespace-nowrap bg-primary text-primary-foreground font-display font-extrabold rounded-full shadow-lg text-xs sm:text-sm px-3 py-1">{busy ? "Preparando…" : "📥 Baixar atalho"}</span>}
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
