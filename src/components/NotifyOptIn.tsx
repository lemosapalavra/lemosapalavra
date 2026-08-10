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
        ? "🔔 Pronto! Você será avisado quando houver vídeos novos."
        : "Não foi possível ativar. Permita notificações nas configurações do navegador."
    );
  };

  return (
    <button
      onClick={toggle}
      className={`mx-auto mt-3 flex items-center gap-3 rounded-full border-2 px-6 py-3 shadow-lg hover:scale-105 active:scale-95 transition ${
        on
          ? "bg-green-600 border-green-700 text-white"
          : "bg-amber-50 border-amber-300 text-amber-900"
      }`}
      title="Receber aviso no celular quando houver vídeos novos"
      aria-pressed={on}
    >
      <span className="text-2xl leading-none">{on ? "🔔" : "🔕"}</span>
      <span className={`font-display font-extrabold text-base sm:text-lg ${on ? "text-white" : ""}`}>
        {on ? "Você será avisado de vídeos novos" : "Quero ser avisado de vídeos novos"}
      </span>
    </button>
  );
}
