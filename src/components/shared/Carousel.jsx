import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

/** Fallback elegante para mídia que ainda não foi adicionada ao projeto. */
export function MediaFallback({ icon = '🎬', note }) {
  return (
    <div className="flex h-full w-full flex-col items-center justify-center gap-3 bg-gradient-to-br from-[#1b1026] via-[#0d1b2a] to-[#0a0a0a]">
      <div className="text-5xl">{icon}</div>
      {note && (
        <div className="px-8 text-center font-mono text-[11px] leading-relaxed text-white/30">{note}</div>
      )}
    </div>
  );
}

/**
 * Renderiza um item de mídia em tela cheia (object-cover).
 * item: { type: 'img' | 'video', src, note?, icon? }
 * Vídeos tocam quando `active`; se o arquivo não existir, cai no fallback.
 */
export function Media({ item, active = true, fit = 'cover' }) {
  const [err, setErr] = useState(false);
  const ref = useRef(null);
  const isVideo = item.type === 'video';
  const placeholder = !item.src || !`${item.src}`.startsWith('http') ? !isVideo : false;
  const objectFit = fit === 'contain' ? 'object-contain' : 'object-cover';

  useEffect(() => {
    const v = ref.current;
    if (!v || !isVideo || err) return;
    if (active) {
      // tenta com som (já houve interação); se bloquear, toca mudo
      v.play().catch(() => {
        v.muted = true;
        v.play().catch(() => setErr(true));
      });
    } else {
      v.pause();
    }
  }, [active, isVideo, err]);

  if (isVideo) {
    if (err) return <MediaFallback icon={item.icon ?? '🎬'} note={item.note} />;
    return (
      <video
        ref={ref}
        src={item.src}
        className={`h-full w-full ${objectFit}`}
        playsInline
        loop
        preload="auto"
        onError={() => setErr(true)}
      />
    );
  }

  if (err || placeholder) return <MediaFallback icon={item.icon ?? '📷'} note={item.note} />;
  return (
    <img
      src={item.src}
      className={`h-full w-full select-none ${objectFit}`}
      draggable={false}
      alt=""
      onError={() => setErr(true)}
    />
  );
}

const variants = {
  enter: (dir) => ({ x: dir >= 0 ? 90 : -90, opacity: 0 }),
  center: { x: 0, opacity: 1 },
  exit: (dir) => ({ x: dir >= 0 ? -90 : 90, opacity: 0 }),
};

/** Carrossel simples de tela cheia — swipe pra passar, bolinhas no topo. */
export default function Carousel({ items, fit = 'cover' }) {
  const [[idx, dir], setIdx] = useState([0, 0]);

  const go = (n) => {
    const next = Math.min(Math.max(idx + n, 0), items.length - 1);
    if (next !== idx) setIdx([next, n]);
  };

  return (
    <div className="relative h-full w-full overflow-hidden">
      <AnimatePresence initial={false} custom={dir}>
        <motion.div
          key={idx}
          className="absolute inset-0"
          custom={dir}
          variants={variants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{ duration: 0.35, ease: 'easeInOut' }}
          drag={items.length > 1 ? 'x' : false}
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={0.7}
          dragMomentum={false}
          onDragEnd={(_e, info) => {
            if (info.offset.x < -70) go(1);
            else if (info.offset.x > 70) go(-1);
          }}
        >
          <Media item={items[idx]} active fit={fit} />
        </motion.div>
      </AnimatePresence>

      {items.length > 1 && (
        <div className="absolute inset-x-0 top-[max(env(safe-area-inset-top),16px)] z-10 flex justify-center gap-1.5">
          {items.map((_, i) => (
            <button
              key={i}
              onClick={() => setIdx([i, i > idx ? 1 : -1])}
              className={`h-1.5 rounded-full transition-all ${
                i === idx ? 'w-5 bg-white/85' : 'w-1.5 bg-white/30'
              }`}
              aria-label={`foto ${i + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
