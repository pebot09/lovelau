import { motion } from 'framer-motion';

/** Botão padrão de avanço de capítulo/etapa. */
export function ContinueButton({ onClick, label = 'Continuar →', delay = 0, className = '' }) {
  return (
    <motion.button
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.6, ease: 'easeOut' }}
      onClick={onClick}
      className={`mx-auto block rounded-full border border-white/20 px-7 py-2.5 font-display text-sm tracking-wide text-white/85 transition-colors hover:border-blush/70 hover:text-white active:scale-95 ${className}`}
    >
      {label}
    </motion.button>
  );
}

/**
 * Botão de alternativa de quiz.
 * state: idle | right (pisca 🟢) | wrong (pisca 🔴) | reveal (correto destacado) | dim
 */
export function ChoiceButton({ children, onClick, state = 'idle', disabled = false, className = '' }) {
  const styles = {
    idle: 'border-white/15 bg-white/[0.05] text-white/90',
    right: 'flash-green',
    wrong: 'flash-red',
    reveal: 'border-emerald-400/80 bg-emerald-400/10 text-emerald-200',
    dim: 'border-white/10 bg-white/[0.02] text-white/35',
  }[state];
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`w-full rounded-2xl border px-5 py-3.5 text-[15px] font-medium transition-all duration-150 active:scale-[0.98] ${styles} ${className}`}
    >
      {children}
    </button>
  );
}

/** Rótulo discreto de seção (canto superior). */
export function Overline({ children, className = '' }) {
  return (
    <div className={`text-[10px] uppercase tracking-[0.28em] text-white/35 ${className}`}>
      {children}
    </div>
  );
}

/** Corações flutuando de baixo pra cima (jogo 3.2 e afins). */
export function FloatingHearts({ count = 14 }) {
  const hearts = Array.from({ length: count }, (_, i) => ({
    left: 4 + ((i * 37) % 92),
    size: 14 + ((i * 7) % 18),
    delay: (i % 7) * 0.45,
    dur: 3.2 + ((i * 13) % 20) / 10,
    emoji: ['❤️', '🤍', '💗', '💞'][i % 4],
  }));
  const travel = typeof window !== 'undefined' ? window.innerHeight + 120 : 900;
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {hearts.map((h, i) => (
        <motion.span
          key={i}
          className="absolute"
          style={{ left: `${h.left}%`, bottom: -48, fontSize: h.size }}
          animate={{ y: -travel, opacity: [0, 1, 1, 0] }}
          transition={{
            duration: h.dur,
            delay: h.delay,
            repeat: Infinity,
            repeatDelay: 0.8,
            ease: 'linear',
            times: [0, 0.12, 0.8, 1],
          }}
        >
          {h.emoji}
        </motion.span>
      ))}
    </div>
  );
}
