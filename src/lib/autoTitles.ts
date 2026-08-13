/**
 * Tooltips automáticos em todo o site.
 *
 * Ao passar o mouse sobre qualquer botão/link/ícone que já tenha
 * `aria-label` (ou um texto curto), copiamos esse texto para o atributo
 * `title`, fazendo o navegador exibir a dica de função do elemento.
 */
const SELECTOR = "button, a, [role='button'], summary, img, svg, input, select, textarea";

function describe(el: HTMLElement): string {
  const aria = el.getAttribute("aria-label");
  if (aria) return aria.trim();
  if (el instanceof HTMLImageElement && el.alt) return el.alt.trim();
  if (el instanceof HTMLInputElement && el.placeholder) return el.placeholder.trim();
  const text = (el.textContent || "").replace(/\s+/g, " ").trim();
  if (text && text.length <= 60) return text;
  return "";
}

function apply(target: EventTarget | null) {
  let el = target as HTMLElement | null;
  while (el && el !== document.body) {
    if (el.matches?.(SELECTOR)) {
      if (!el.getAttribute("title")) {
        const label = describe(el);
        if (label) el.setAttribute("title", label);
      }
      return;
    }
    el = el.parentElement;
  }
}

export function startAutoTitles() {
  const handler = (e: Event) => apply(e.target);
  document.addEventListener("mouseover", handler, { passive: true });
  document.addEventListener("focusin", handler, { passive: true });
  return () => {
    document.removeEventListener("mouseover", handler);
    document.removeEventListener("focusin", handler);
  };
}
