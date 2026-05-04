import logoCentral from "@/assets/logo-central.png";

export interface OrbitCategory {
  key: string;
  label: string;
  icon?: string;
  emoji?: string;
  sublabel?: string;
}

interface CategoryOrbitProps {
  categories: OrbitCategory[];
  activeKey?: string;
  onSelect: (key: string) => void;
  /** Diameter in px of the orbit circle */
  size?: number;
  iconSize?: number;
  logoSize?: number;
}

/**
 * Orbital category selector matching the homepage style:
 * central logo with floating category icons around it.
 */
export default function CategoryOrbit({
  categories,
  activeKey,
  onSelect,
  size = 460,
  iconSize = 96,
  logoSize = 170,
}: CategoryOrbitProps) {
  const radius = size / 2 - iconSize / 2 - 6;
  const center = size / 2;
  const n = categories.length;
  // Start at top (-90°) and distribute evenly
  const startAngle = -90;

  return (
    <div
      className="relative mx-auto"
      style={{ width: size, height: size, maxWidth: "100%" }}
    >
      {/* Central logo */}
      <img
        src={logoCentral}
        alt="Lemos a Palavra"
        className="absolute z-10 drop-shadow-xl"
        style={{
          width: logoSize,
          height: logoSize,
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
        }}
      />

      {/* Orbiting categories */}
      <div className="absolute inset-0">
        {categories.map((cat, i) => {
          const angleDeg = startAngle + (360 / n) * i;
          const angleRad = (angleDeg * Math.PI) / 180;
          const x = center + Math.cos(angleRad) * radius - iconSize / 2;
          const y = center + Math.sin(angleRad) * radius - iconSize / 2;
          const isActive = activeKey === cat.key;

          return (
            <button
              key={cat.key}
              onClick={() => onSelect(cat.key)}
              className={`absolute flex flex-col items-center gap-1 hover:scale-110 transition-transform ${
                isActive ? "scale-110" : ""
              }`}
              style={{ left: x, top: y, width: iconSize }}
            >
              {cat.icon ? (
                <img
                  src={cat.icon}
                  alt={cat.label}
                  className={`rounded-full shadow-lg border-2 object-cover ${
                    isActive ? "border-primary" : "border-primary/30"
                  }`}
                  style={{ width: iconSize, height: iconSize }}
                  loading="lazy"
                />
              ) : (
                <div
                  className={`rounded-full shadow-lg border-2 flex items-center justify-center bg-popover ${
                    isActive ? "border-primary" : "border-primary/30"
                  }`}
                  style={{ width: iconSize, height: iconSize }}
                >
                  <span className="text-4xl">{cat.emoji}</span>
                </div>
              )}
              <span className="font-display text-xs font-bold text-foreground text-center leading-tight whitespace-pre-line drop-shadow">
                {cat.label}
              </span>
              {cat.sublabel && (
                <span className="font-body text-[10px] text-muted-foreground">
                  {cat.sublabel}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
