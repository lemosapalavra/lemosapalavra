import { useState, useEffect } from "react";

interface CelebrationAnimationProps {
  show: boolean;
  message: string;
  coins: number;
  emoji?: string;
  onClose: () => void;
}

const confettiEmojis = ["🎉", "🎊", "⭐", "✨", "🌟", "💫", "🎆", "🏆", "👏", "🪙", "🎈", "🎁"];

interface Particle {
  id: number;
  emoji: string;
  x: number;
  delay: number;
  duration: number;
  size: number;
}

export default function CelebrationAnimation({ show, message, coins, emoji = "🏆", onClose }: CelebrationAnimationProps) {
  const [particles, setParticles] = useState<Particle[]>([]);

  useEffect(() => {
    if (show) {
      const p: Particle[] = Array.from({ length: 40 }, (_, i) => ({
        id: i,
        emoji: confettiEmojis[Math.floor(Math.random() * confettiEmojis.length)],
        x: Math.random() * 100,
        delay: Math.random() * 2,
        duration: 2 + Math.random() * 3,
        size: 16 + Math.random() * 24,
      }));
      setParticles(p);
    }
  }, [show]);

  if (!show) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center" onClick={onClose}>
      {/* Confetti particles */}
      {particles.map((p) => (
        <span
          key={p.id}
          className="absolute pointer-events-none"
          style={{
            left: `${p.x}%`,
            top: "-10%",
            fontSize: p.size,
            animation: `confettiFall ${p.duration}s ease-in ${p.delay}s forwards`,
          }}
        >
          {p.emoji}
        </span>
      ))}
      
      {/* Central card */}
      <div className="bg-popover rounded-3xl p-8 shadow-2xl border-4 border-primary text-center z-10 animate-scale-in max-w-sm mx-4">
        <span className="text-7xl block mb-4 animate-bounce">{emoji}</span>
        <h2 className="font-display text-2xl font-bold text-foreground mb-2">Parabéns!</h2>
        <p className="font-body text-lg text-foreground">{message}</p>
        <p className="font-display text-xl font-bold text-primary mt-3">+{coins} 🪙</p>
        <button onClick={onClose} className="btn-cartoon px-6 py-3 mt-4 text-sm">Continuar</button>
      </div>

      <style>{`
        @keyframes confettiFall {
          0% { transform: translateY(0) rotate(0deg); opacity: 1; }
          100% { transform: translateY(110vh) rotate(720deg); opacity: 0; }
        }
      `}</style>
    </div>
  );
}
