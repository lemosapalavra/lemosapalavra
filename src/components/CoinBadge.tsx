interface CoinBadgeProps {
  amount: number;
  size?: "xs" | "sm" | "md";
  className?: string;
  label?: string;
}

/**
 * Reusable coin reward badge — shows a stylized golden coin + amount.
 * Use below videos, songs, activities, devocionais, etc., so the user
 * knows how many coins (🪙) they earn when completing the item.
 */
export default function CoinBadge({ amount, size = "sm", className = "", label }: CoinBadgeProps) {
  const dims =
    size === "xs"
      ? { coin: 14, font: "text-[10px]", pad: "px-1.5 py-0.5", gap: "gap-1" }
      : size === "md"
      ? { coin: 22, font: "text-sm", pad: "px-2.5 py-1", gap: "gap-1.5" }
      : { coin: 18, font: "text-xs", pad: "px-2 py-0.5", gap: "gap-1" };

  return (
    <span
      className={`inline-flex items-center ${dims.gap} ${dims.pad} rounded-full bg-gradient-to-r from-amber-100 to-yellow-100 border border-amber-300/80 text-amber-900 font-bold shadow-sm ${dims.font} ${className}`}
      title={`Ganhe ${amount} moedinha${amount > 1 ? "s" : ""} ao completar`}
    >
      <svg width={dims.coin} height={dims.coin} viewBox="0 0 24 24" className="drop-shadow-[0_1px_1px_rgba(180,120,0,0.5)]">
        <defs>
          <radialGradient id="coinGrad" cx="35%" cy="35%" r="70%">
            <stop offset="0%" stopColor="#FFF6B8" />
            <stop offset="55%" stopColor="#F5C842" />
            <stop offset="100%" stopColor="#B8860B" />
          </radialGradient>
        </defs>
        <circle cx="12" cy="12" r="11" fill="url(#coinGrad)" stroke="#8B5A00" strokeWidth="1.2" />
        <circle cx="12" cy="12" r="8" fill="none" stroke="#8B5A00" strokeWidth="0.8" opacity="0.6" />
        <text x="12" y="16" textAnchor="middle" fontSize="11" fontWeight="900" fill="#7A4A00" fontFamily="system-ui, sans-serif">$</text>
      </svg>
      <span>+{amount}</span>
      {label && <span className="font-normal opacity-80">{label}</span>}
    </span>
  );
}
