import { useRef, useState } from 'react';
import {
  AnimatePresence,
  animate,
  motion,
  useMotionTemplate,
  useMotionValue,
  useTransform,
} from 'framer-motion';
import useSounds from '../hooks/useSounds';

const BUMBLE_YELLOW = '#ffc629';

// partículas da explosão de corações do match
const PARTICLES = Array.from({ length: 14 }, (_, i) => ({
  angle: (i / 14) * Math.PI * 2,
  dist: 85 + (i % 3) * 42,
  size: 13 + (i % 4) * 7,
  delay: 0.05 + (i % 5) * 0.045,
}));

// [01] CAP 1 — BUMBLE: card com swipe (touch e mouse)
export default function Cap01_Bumble({ onNext }) {
  const s = useSounds();
  const [matched, setMatched] = useState(false);
  const [nopeFlash, setNopeFlash] = useState(false);
  const matchedRef = useRef(false);

  const x = useMotionValue(0);
  const rotate = useTransform(x, [-220, 220], [-13, 13]);

  // arrastar pra esquerda: 😂 + texto + tint vermelho proporcionais
  const leftAmount = useTransform(x, [-170, -16], [1, 0]);
  const redTint = useTransform(x, [-200, -10], [0.34, 0]);

  // arrastar pra direita: borda verde com brilho + tint verde proporcionais
  const greenTint = useTransform(x, [10, 190], [0, 0.22]);
  const glow = useTransform(x, [0, 190], [0, 1]);
  const borderColor = useTransform(x, [0, 150], ['rgba(255,255,255,0.10)', 'rgba(74,222,128,0.95)']);
  const glowSize = useTransform(glow, (g) => g * 42);
  const glowAlpha = useTransform(glow, (g) => g * 0.55);
  const boxShadow = useMotionTemplate`0 0 ${glowSize}px rgba(74,222,128,${glowAlpha}), 0 24px 50px rgba(0,0,0,0.55)`;

  const completeMatch = () => {
    if (matchedRef.current) return;
    matchedRef.current = true;
    s.match();
    animate(x, 480, { duration: 0.45, ease: 'easeIn' });
    setMatched(true);
    setTimeout(onNext, 2600); // transição pro Cap 2
  };

  const onDragEnd = (_e, info) => {
    if (matchedRef.current) return;
    if (info.offset.x > 130 || (info.offset.x > 60 && info.velocity.x > 550)) {
      completeMatch(); // swipe direito completo
    } else {
      // volta ao centro com spring
      animate(x, 0, { type: 'spring', stiffness: 380, damping: 26 });
    }
  };

  const nope = () => {
    if (matchedRef.current) return;
    s.buzzer();
    setNopeFlash(true);
    animate(x, [0, -42, 30, -18, 0], { duration: 0.55 });
    setTimeout(() => setNopeFlash(false), 1700);
  };

  return (
    <div className="relative flex h-full flex-col items-center justify-between overflow-hidden bg-gradient-to-b from-[#121212] to-[#0a0a0a] py-6">
      {/* header estilo Bumble */}
      <div className="font-display text-2xl font-bold lowercase tracking-tight" style={{ color: BUMBLE_YELLOW }}>
        bumble
      </div>

      {/* card */}
      <div className="relative flex w-full flex-1 items-center justify-center px-6">
        <motion.div
          drag={matched ? false : 'x'}
          dragElastic={0.85}
          dragMomentum={false}
          onDragEnd={onDragEnd}
          style={{ x, rotate, borderColor, boxShadow }}
          className="relative h-[min(62vh,540px)] w-[min(86vw,330px)] cursor-grab touch-pan-y overflow-hidden rounded-3xl border bg-neutral-900 active:cursor-grabbing"
        >
          {/* PLACEHOLDER — foto do Pedro: trocar este bloco por
              <img src="..." className="absolute inset-0 h-full w-full object-cover" />
              Pedro vai inserir depois */}
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-gradient-to-br from-[#27203a] via-[#1c2a40] to-[#11202e]">
            <div className="text-6xl">🏺</div>
            <div className="font-mono text-[11px] tracking-widest text-white/30">[ foto aqui ]</div>
          </div>

          {/* info sobre a foto */}
          <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/90 via-black/55 to-transparent px-5 pb-5 pt-16">
            <div className="font-display text-2xl font-bold text-white">
              Pedro, 28 <span className="align-middle text-base text-sky-400">✔</span>
            </div>
            {/* PLACEHOLDER — bio: Pedro vai escrever depois */}
            <div className="mt-1 text-sm italic text-white/45">[ bio em construção… ]</div>
            <div className="mt-3 flex flex-wrap gap-1.5">
              {['🎵 Música', '🏺 Cerâmica', '💻 Tech'].map((chip) => (
                <span key={chip} className="rounded-full border border-white/25 bg-white/10 px-3 py-1 text-xs text-white/85">
                  {chip}
                </span>
              ))}
            </div>
          </div>

          {/* tints proporcionais ao arrasto */}
          <motion.div className="pointer-events-none absolute inset-0 bg-red-500" style={{ opacity: redTint }} />
          <motion.div className="pointer-events-none absolute inset-0 bg-green-400" style={{ opacity: greenTint }} />

          {/* 😂 ao arrastar pra esquerda */}
          <motion.div
            className="pointer-events-none absolute left-5 top-6 -rotate-12 text-6xl"
            style={{ opacity: leftAmount }}
          >
            😂
          </motion.div>
        </motion.div>
      </div>

      {/* texto do swipe esquerdo — aparece progressivamente */}
      <div className="h-7">
        <motion.div
          className="px-8 text-center text-sm italic text-rose-200/90"
          style={{ opacity: nopeFlash ? 1 : leftAmount }}
        >
          Como se alguém fosse dizer não…
        </motion.div>
      </div>

      {/* botões estilo Bumble (alternativa ao swipe) */}
      <div className="mt-3 flex items-center gap-8">
        <button
          onClick={nope}
          className="flex h-14 w-14 items-center justify-center rounded-full border border-white/15 bg-white/5 text-xl text-white/70 transition active:scale-90"
          aria-label="não"
        >
          ✕
        </button>
        <button
          onClick={completeMatch}
          className="flex h-16 w-16 items-center justify-center rounded-full text-2xl shadow-lg transition active:scale-90"
          style={{ background: BUMBLE_YELLOW }}
          aria-label="sim"
        >
          ❤️
        </button>
      </div>
      <div className="mt-3 font-mono text-[10px] tracking-widest text-white/25">( arrasta o card )</div>

      {/* É UM MATCH! */}
      <AnimatePresence>
        {matched && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-black/85 backdrop-blur-sm"
          >
            <div className="relative">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: [0, 1.25, 1] }}
                transition={{ duration: 0.7, ease: 'easeOut' }}
                className="text-8xl"
              >
                ❤️
              </motion.div>
              {PARTICLES.map((p, i) => (
                <motion.span
                  key={i}
                  className="absolute left-1/2 top-1/2"
                  style={{ fontSize: p.size }}
                  initial={{ x: '-50%', y: '-50%', opacity: 0, scale: 0.4 }}
                  animate={{
                    x: `calc(-50% + ${Math.cos(p.angle) * p.dist}px)`,
                    y: `calc(-50% + ${Math.sin(p.angle) * p.dist}px)`,
                    opacity: [0, 1, 0],
                    scale: [0.4, 1.15, 0.7],
                  }}
                  transition={{ duration: 1.15, delay: p.delay, ease: 'easeOut' }}
                >
                  ❤️
                </motion.span>
              ))}
            </div>
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.5 }}
              className="mt-6 font-display text-4xl font-extrabold italic"
              style={{ color: BUMBLE_YELLOW }}
            >
              É um Match!
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
