import { useState } from "react";
import { toast } from "sonner";
import {
  enableNotifications,
  notificationsEnabled,
  notificationsSupported,
  disableNotifications,
} from "@/lib/pushNotify";

/** Botão para o usuário ativar avisos de vídeos novos no celular. */
export default function NotifyOptIn() {
  const [on, setOn] = useState(notificationsEnabled());

  if (!notificationsSupported()) return null;

  const toggle = async () => {
    if (on) {
      disableNotifications();
      setOn(false);
      toast("🔕 Avisos desativados.");
      return;
    }
    const ok = await enableNotifications();
    setOn(ok);
    toast(
      ok
        ? "🔔 Pronto! Avisaremos no seu celular quando houver vídeos novos."
        : "Não foi possível ativar. Permita notificações nas configurações do navegador."
    );
  };

  return (
    <button
      onClick={toggle}
      className="mx-auto mt-2 flex items-center gap-2 rounded-full border-2 border-amber-300 bg-amber-50 px-4 py-1.5 shadow hover:scale-105 active:scale-95 transition"
      title="Receber aviso no celular quando houver vídeos novos"
    >
      <span className="text-base leading-none">{on ? "🔔" : "🔕"}</span>
      <span className="font-display font-bold text-xs text-amber-900">
        {on ? "Avisos no celular ativados" : "Quero ser avisado de vídeos novos"}
      </span>
    </button>
  );
}
