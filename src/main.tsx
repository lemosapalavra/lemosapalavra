import { createRoot } from "react-dom/client";
import { HelmetProvider } from "react-helmet-async";
import App from "./App.tsx";
import "./index.css";


// Efeito sonoro global para interações, inclusive login e cadastro.
// Usa um único AudioContext e respeita a preferência por movimento reduzido.
const installInteractionSounds = () => {
  let context: AudioContext | null = null;
  let lastHover = 0;
  let lastClick = 0;
  let lastHoverTarget: Element | null = null;
  const selector = 'button, a[href], [role="button"], [role="link"], input:not([type="hidden"]), select, textarea, [role="checkbox"], [role="radio"], [role="tab"], [data-click-sound]';
  const sound = (hover: boolean) => {
    try {
      context ??= new AudioContext();
      if (context.state === "suspended") void context.resume();
      const oscillator = context.createOscillator();
      const gain = context.createGain();
      const now = context.currentTime;
      oscillator.type = "sine";
      oscillator.frequency.setValueAtTime(hover ? 590 : 760, now);
      oscillator.frequency.exponentialRampToValueAtTime(hover ? 520 : 540, now + 0.065);
      gain.gain.setValueAtTime(hover ? 0.018 : 0.042, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.085);
      oscillator.connect(gain);
      gain.connect(context.destination);
      oscillator.start(now);
      oscillator.stop(now + 0.09);
      oscillator.onended = () => { oscillator.disconnect(); gain.disconnect(); };
    } catch { /* Som indisponível neste dispositivo. */ }
  };
  document.addEventListener("pointerdown", (event) => {
    const target = event.target;
    if (!(target instanceof Element)) return;
    const interactive = target.closest(selector);
    if (!interactive || interactive.matches(":disabled, [aria-disabled='true']")) return;
    const now = Date.now();
    if (now - lastClick < 65) return;
    lastClick = now;
    sound(false);
  }, { capture: true, passive: true });
  document.addEventListener("pointerover", (event) => {
    if (event.pointerType !== "mouse" && event.pointerType !== "pen") return;
    const target = event.target;
    if (!(target instanceof Element)) return;
    const interactive = target.closest(selector);
    if (!interactive || interactive.matches(":disabled, [aria-disabled='true']")) return;
    if (interactive === lastHoverTarget) return;
    lastHoverTarget = interactive;
    const now = Date.now();
    if (now - lastHover < 110) return;
    lastHover = now;
    sound(true);
  }, { passive: true });
  document.addEventListener("pointerout", (event) => {
    const target = event.target;
    if (!(target instanceof Element)) return;
    const interactive = target.closest(selector);
    if (interactive && !(event.relatedTarget instanceof Node && interactive.contains(event.relatedTarget))) {
      if (lastHoverTarget === interactive) lastHoverTarget = null;
    }
  }, { passive: true });
  document.addEventListener("keydown", (event) => {
    if (event.repeat || (event.key !== "Enter" && event.key !== " ")) return;
    const target = event.target;
    if (!(target instanceof Element) || target.matches("input, textarea, select")) return;
    if (target.closest(selector)) sound(false);
  }, { capture: true });
};

installInteractionSounds();

createRoot(document.getElementById("root")!).render(
  <HelmetProvider>
    <App />
  </HelmetProvider>
);
