import { motion } from 'framer-motion';

// PLACEHOLDER de fim de jornada — os capítulos 5, 6 e 7 chegam na
// próxima sessão. Para adicionar um capítulo novo: criar o componente
// em src/components/ e registrá-lo no array CHAPTERS do App.jsx.
export default function Cap05_Continua() {
  return (
    <div className="flex h-full flex-col items-center justify-center gap-6 px-8 text-center">
      <motion.div
        animate={{ scale: [1, 1.18, 1] }}
        transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
        className="text-5xl"
      >
        🤍
      </motion.div>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.2 }}
        className="font-display text-3xl font-light italic text-white"
      >
        continua…
      </motion.div>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 1 }}
        className="font-mono text-[11px] tracking-[0.25em] text-white/35"
      >
        cap. 5, 6 e 7 — em breve
      </motion.div>
    </div>
  );
}
