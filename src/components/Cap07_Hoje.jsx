import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import useSounds from '../hooks/useSounds';
import { DATA } from '../data/data';

// [07] CAP 7 — "HOJE"
// Texto principal em camadas → o argumento (chat com o claude) →
// final dourado. Sem botão no fim. Este é o fim.
export default function Cap07_Hoje() {
  const [stage, setStage] = useState('texto'); // texto | chat | final

  return (
    <div className="relative h-full overflow-hidden bg-[#0a0a0a]">
      <Fundo />
      <AnimatePresence mode="wait">
        {stage === 'texto' && (
          <motion.div key="texto" className="relative h-full" exit={{ opacity: 0 }} transition={{ duration: 0.7 }}>
            <Texto onDone={() => setStage('chat')} />
          </motion.div>
        )}
        {stage === 'chat' && (
          <motion.div
            key="chat"
            className="relative h-full"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }} // fade out rápido do chat
          >
            <Argumento onDone={() => setStage('final')} />
          </motion.div>
        )}
        {stage === 'final' && (
          <motion.div key="final" className="relative h-full" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <Final />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// foto de fundo em tela cheia com overlay escuro pra legibilidade
function Fundo() {
  const [err, setErr] = useState(false);
  const src = DATA.cap7.foto_fundo;
  const ok = `${src}`.startsWith('http') && !err;

  return (
    <div className="absolute inset-0">
      {ok ? (
        <img src={src} className="h-full w-full object-cover" alt="" onError={() => setErr(true)} />
      ) : (
        /* PLACEHOLDER — Pedro vai inserir a URL da foto do iCloud em
           DATA.cap7.foto_fundo (src/data/data.js) */
        <div className="h-full w-full bg-gradient-to-br from-[#1c1424] via-[#101622] to-[#0a0a0a]" />
      )}
      <div className="absolute inset-0 bg-black" style={{ opacity: 0.6 }} />
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Parte 1 — texto principal em camadas (1.5s entre linhas)
// ─────────────────────────────────────────────────────────────

const LINHAS = [
  'amor.',
  'o claude me ajudou a fazer, mas LLM nenhuma poderia ou conseguiria dizer o quanto eu amo você.',
  'te quero p smp ❤️',
];

function Texto({ onDone }) {
  useEffect(() => {
    const t = setTimeout(onDone, 8600);
    return () => clearTimeout(t);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className="flex h-full flex-col items-center justify-center gap-5 px-8 text-center">
      {LINHAS.map((l, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 + i * 1.5, duration: 0.9 }}
          className={
            i === 0
              ? 'font-display text-3xl font-light italic text-white'
              : 'max-w-sm font-display text-xl font-light leading-relaxed text-white/90'
          }
        >
          {l}
        </motion.div>
      ))}
      {/* pausa de 2s e então… */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 + 2 * 1.5 + 0.9 + 2, duration: 0.9 }}
        className="mt-3 font-display text-lg italic text-white/55"
      >
        nem o claude…
      </motion.div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Parte 2 — o argumento: chat animado com o claude
// ─────────────────────────────────────────────────────────────

function Argumento({ onDone }) {
  const s = useSounds();
  // a primeira mensagem do claude já aparece; cada toque revela a próxima
  const [shown, setShown] = useState(1);
  const boxRef = useRef(null);
  const dialogo = DATA.cap7.dialogo;

  // som da primeira mensagem ao entrar
  useEffect(() => {
    s.bip();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // toque revela a próxima mensagem; depois da última, segue pro final
  const advance = () => {
    if (shown < dialogo.length) {
      s.bip();
      setShown((n) => n + 1);
    } else {
      onDone();
    }
  };

  // rola pra baixo suavemente conforme as mensagens chegam
  useEffect(() => {
    const el = boxRef.current;
    if (el) el.scrollTo({ top: el.scrollHeight, behavior: 'smooth' });
  }, [shown]);

  return (
    <div className="flex h-full items-center justify-center px-5" onPointerDown={advance}>
      <div
        ref={boxRef}
        className="max-h-[64vh] w-full max-w-sm space-y-3.5 overflow-y-auto rounded-2xl border border-white/10 bg-black/45 px-5 py-5 backdrop-blur-sm"
      >
        {dialogo.slice(0, shown).map((m, i) => {
          const claude = m.sender === 'claude';
          return (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="leading-relaxed"
            >
              <span
                className={`mr-2 font-mono text-[11px] ${claude ? 'text-sky-300/90' : 'text-white/55'}`}
              >
                {m.sender}:
              </span>
              <span className={claude ? 'text-[13px] text-sky-100/85' : 'text-[15px] text-white'}>
                {m.text}
              </span>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Parte 3 — final. Tela permanece estática. Sem botão.
// ─────────────────────────────────────────────────────────────

function Final() {
  const s = useSounds();

  useEffect(() => {
    const t = setTimeout(() => s.chime(), 3700);
    return () => clearTimeout(t);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className="flex h-full flex-col items-center justify-center gap-12 px-8 text-center">
      <div className="space-y-1.5">
        {[DATA.cap7.frase_final, `dito ${DATA.cap7.frase_contagem} vezes online.`, 'e contando.'].map((l, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 + i * 0.55, duration: 0.8 }}
            className={
              i === 0
                ? 'font-display text-2xl font-light italic text-rose-200'
                : 'font-display text-sm text-white/60'
            }
          >
            {l}
          </motion.div>
        ))}
      </div>

      {/* o momento mais importante de tudo — pausa de 1.5s antes */}
      <motion.div
        initial={{ opacity: 0, scale: 0.25 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 3.7, duration: 1.4, ease: [0.16, 1, 0.3, 1] }}
        className="font-display text-[42px] font-bold leading-[1.15] tracking-wide text-gold"
        style={{ textShadow: '0 0 38px rgba(232,185,74,0.35)' }}
      >
        FELIZ UM ANO
        <br />
        DE NAMORO
      </motion.div>
    </div>
  );
}
