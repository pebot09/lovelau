import { useState } from 'react';
import { motion } from 'framer-motion';
import Typewriter from './shared/Typewriter';
import useSounds from '../hooks/useSounds';
import { DATA, fmt } from '../data/data';

// [00] BOOT SCREEN — terminal digitando letra por letra com bip
export default function Cap00_Boot({ onNext }) {
  const s = useSounds();
  const [ready, setReady] = useState(false);

  const lines = [
    { text: '> iniciando sistema...', delayAfter: 500 },
    { text: '> carregando memórias...', delayAfter: 520 },
    { text: `> ${fmt(DATA.whatsapp.total_messages)} mensagens encontradas...`, delayAfter: 620 },
    { text: '> processando...', delayAfter: 420 },
    { text: '████████████████████ 100%', speed: 52, delayAfter: 650, className: 'text-gold' },
    { text: '> pronto.', delayAfter: 350 },
  ];

  return (
    <div className="flex h-full flex-col items-center justify-center bg-[#050505] px-8">
      <div className="w-full max-w-xs">
        <Typewriter
          lines={lines}
          bip
          speed={34}
          className="space-y-1.5 font-mono text-[13px] leading-relaxed text-neutral-300"
          onDone={() => setReady(true)}
        />
      </div>

      <div className="mt-14 h-12">
        {ready && (
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.1, ease: 'easeOut' }}
            onClick={() => {
              s.whoosh();
              onNext();
            }}
            className="rounded-md border border-white/25 px-8 py-3 font-mono text-sm tracking-[0.18em] text-white/90 transition-colors hover:border-blush/80 hover:text-blush active:scale-95"
          >
            [ iniciar ]
          </motion.button>
        )}
      </div>
    </div>
  );
}
