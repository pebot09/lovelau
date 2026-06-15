import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { unlockAudio } from './hooks/useSounds';
import Cap00_Boot from './components/Cap00_Boot';
import Cap01_Bumble from './components/Cap01_Bumble';
import Cap02_Comeco from './components/Cap02_Comeco';
import Cap03_Conhece from './components/Cap03_Conhece';
import Cap04_Linguagem from './components/Cap04_Linguagem';
import Cap05_Album from './components/Cap05_Album';
import Cap06_Quiz from './components/Cap06_Quiz';
import Cap07_Hoje from './components/Cap07_Hoje';

// Experiência linear e guiada: sem voltar, sem pular.
// O app termina no Cap 7 — sem botão de recomeçar.
const CHAPTERS = [
  Cap00_Boot,
  Cap01_Bumble,
  Cap02_Comeco,
  Cap03_Conhece,
  Cap04_Linguagem,
  Cap05_Album,
  Cap06_Quiz,
  Cap07_Hoje,
];

export default function App() {
  const [chapter, setChapter] = useState(0); // começa sempre no Cap 0

  // destrava o áudio e mantém a sessão viva a cada gesto (iOS precisa de
  // resume dentro do gesto; o loop mudo fura o botão de silencioso).
  // Vários eventos e sem { once } para ser robusto no celular.
  useEffect(() => {
    const unlock = () => unlockAudio();
    const evts = ['pointerdown', 'touchend', 'click'];
    evts.forEach((e) => window.addEventListener(e, unlock));
    return () => evts.forEach((e) => window.removeEventListener(e, unlock));
  }, []);

  const Current = CHAPTERS[Math.min(chapter, CHAPTERS.length - 1)];
  const next = () => setChapter((c) => Math.min(c + 1, CHAPTERS.length - 1));

  return (
    <div className="relative h-dvh w-full select-none overflow-hidden bg-ink font-sans text-neutral-100">
      {/* Sem AnimatePresence mode="wait"/exit: o capítulo anterior
          desmonta na hora e o próximo entra com fade+slide. O mode="wait"
          condicionava a montagem do próximo capítulo ao fim da animação
          de saída do anterior — e essa saída travava quando o capítulo
          tinha estado de gesto (drag) pendente do framer (ex.: o jogo de
          arrastar do Cap 5), deixando a tela preta na virada de capítulo. */}
      <motion.div
        key={chapter}
        className="absolute inset-0"
        initial={{ opacity: 0, x: 28 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.55, ease: 'easeInOut' }}
      >
        <Current onNext={next} />
      </motion.div>
    </div>
  );
}
