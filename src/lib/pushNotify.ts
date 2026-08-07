/**
 * Avisos no celular/desktop usando notificações do próprio aparelho.
 * O usuário precisa autorizar uma vez; depois recebe um aviso sempre que
 * novos vídeos ou músicas entram no site (mesmo com o app em segundo plano,
 * enquanto o navegador estiver aberto).
 */

const OPT_KEY = "lemos_notify_opt_v1";

export function notificationsSupported() {
  return typeof window !== "undefined" && "Notification" in window;
}

export function notificationsEnabled() {
  return (
    notificationsSupported() &&
    Notification.permission === "granted" &&
    localStorage.getItem(OPT_KEY) === "1"
  );
}

export async function enableNotifications(): Promise<boolean> {
  if (!notificationsSupported()) return false;
  let perm = Notification.permission;
  if (perm === "default") perm = await Notification.requestPermission();
  if (perm !== "granted") return false;
  localStorage.setItem(OPT_KEY, "1");
  try {
    new Notification("🔔 Avisos ativados!", {
      body: "Você será avisado quando houver vídeos ou músicas novas na Lemos a Palavra.",
      icon: "/favicon.png",
      badge: "/favicon.png",
    });
  } catch {}
  return true;
}

export function disableNotifications() {
  localStorage.removeItem(OPT_KEY);
}

export function notifyNewContent(titles: string[], destino: string) {
  if (!notificationsEnabled() || titles.length === 0) return;
  try {
    const n = new Notification("🎉 Novidade na Lemos a Palavra!", {
      body: `${titles.length} novo(s): ${titles.slice(0, 3).join(" • ")}`,
      icon: "/favicon.png",
      badge: "/favicon.png",
      tag: "lemos-novidades",
    });
    n.onclick = () => {
      window.focus();
      window.location.href = destino;
    };
  } catch {}
}
