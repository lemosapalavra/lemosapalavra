import { useEffect, useState } from "react";

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
      <img src="${logoUrl}" alt="Lemos a Palavra">
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

export default function InstallShortcut() {
  const [wanted, setWanted] = useState(false);
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
      // 2) iOS Safari: no programmatic install, guide the user.
      if (isIOS()) {
        setDone(
          "📱 No iPhone/iPad, toque no botão Compartilhar do Safari e escolha “Adicionar à Tela de Início”. O ícone da Lemos a Palavra aparecerá na tela inicial."
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

  return (
    <div className="mt-4 rounded-xl border-2 border-amber-300/70 bg-amber-50/70 p-3">
      <label className="flex items-start gap-2 cursor-pointer select-none">
        <input
          type="checkbox"
          checked={wanted}
          onChange={(e) => { setWanted(e.target.checked); setDone(""); }}
          className="accent-amber-600 w-4 h-4 mt-0.5"
        />
        <span className="text-xs font-body text-amber-950 leading-snug">
          <strong>Quero um atalho clicável</strong> da <em>Lemos a Palavra</em> no meu dispositivo — com a logo,
          para entrar no site sem digitar o endereço nem escanear código.
        </span>
      </label>

      {wanted && (
        <div className="mt-3 flex flex-col gap-2">
          <button
            type="button"
            onClick={handleClick}
            disabled={busy}
            className="w-full bg-amber-500 hover:bg-amber-600 disabled:opacity-60 text-white font-display font-bold text-sm py-2.5 rounded-lg shadow transition flex items-center justify-center gap-2"
          >
            <img src="/favicon.png" alt="" className="w-6 h-6 rounded" />
            {busy
              ? "Preparando…"
              : installable
                ? "Instalar atalho na tela inicial"
                : "Baixar atalho com a logo"}
          </button>
          {done && (
            <p className="text-[11px] font-body text-amber-900 leading-snug">{done}</p>
          )}
        </div>
      )}
    </div>
  );
}
