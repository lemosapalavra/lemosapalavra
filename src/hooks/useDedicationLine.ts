import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

/** Alinha os avatares laterais ao centro vertical da Dedicatória na página inicial. */
export function useDedicationLine() {
  const { pathname } = useLocation();
  const [top, setTop] = useState<number | null>(null);
  useEffect(() => {
    if (pathname !== "/") { setTop(null); return; }
    let frame = 0;
    const update = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const anchor = document.getElementById("lemos-dedicatoria-anchor");
        if (!anchor) { setTop(null); return; }
        const rect = anchor.getBoundingClientRect();
        setTop(Math.max(65, Math.min(window.innerHeight - 65, rect.top + rect.height / 2)));
      });
    };
    const observer = new ResizeObserver(update);
    const anchor = document.getElementById("lemos-dedicatoria-anchor");
    if (anchor) observer.observe(anchor);
    update();
    window.addEventListener("resize", update);
    window.addEventListener("scroll", update, { passive: true });
    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
      window.removeEventListener("resize", update);
      window.removeEventListener("scroll", update);
    };
  }, [pathname]);
  return top;
}
