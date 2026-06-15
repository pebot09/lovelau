import { useEffect, useRef, useState } from 'react';
import { motion, useMotionValue } from 'framer-motion';
import Typewriter from './shared/Typewriter';
import useSounds from '../hooks/useSounds';
import { ChoiceButton, ContinueButton, Overline } from './shared/ui';
import { DATA, mesLabel } from '../data/data';

// [06] CAP 6 — QUIZ DE DADOS
// 6 perguntas (5 múltipla escolha + 1 especial de timeline) e um
// resultado sem pontuação, só uma frase.
export default function Cap06_Quiz({ onNext }) {
  const [stage, setStage] = useState('intro'); // intro | quiz | result
  const [score, setScore] = useState(0);
  const quiz = DATA.cap6.quiz;

  return (
    <div className="h-full overflow-hidden bg-[#0a0a0a]">
      {/* Sem AnimatePresence mode="wait"/exit: a etapa anterior desmonta
          na hora e a nova entra com fade+slide. Evita o deadlock do
          framer ao trocar de etapa após o arrasto do timeline. */}
      <motion.div
        key={stage}
        className="h-full"
        initial={{ opacity: 0, x: 24 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, ease: 'easeInOut' }}
      >
        {stage === 'intro' && <Intro onDone={() => setStage('quiz')} />}
        {stage === 'quiz' && (
          <QuizFlow
            quiz={quiz}
            onCorrect={() => setScore((n) => n + 1)}
            onDone={() => setStage('result')}
          />
        )}
        {stage === 'result' && <Result score={score} total={quiz.length} onNext={onNext} />}
      </motion.div>
    </div>
  );
}

function Intro({ onDone }) {
  const [done, setDone] = useState(false);
  useEffect(() => {
    if (!done) return;
    const t = setTimeout(onDone, 1200);
    return () => clearTimeout(t);
  }, [done]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className="flex h-full items-center justify-center px-8">
      <Typewriter
        lines={['Agora os dados que você não sabe que existem.']}
        speed={42}
        className="text-center font-display text-2xl font-medium leading-snug"
        onDone={() => setDone(true)}
      />
    </div>
  );
}

function QuizFlow({ quiz, onCorrect, onDone }) {
  const [qi, setQi] = useState(0);
  const q = quiz[qi];

  const complete = (correct) => {
    if (correct) onCorrect();
    if (qi < quiz.length - 1) setQi((n) => n + 1);
    else onDone();
  };

  const btnLabel = qi < quiz.length - 1 ? 'próxima →' : 'ver resultado →';

  return (
    <div className="relative mx-auto flex h-full max-w-md flex-col px-6 pb-8 pt-20">
      <Overline className="absolute left-6 top-7">os dados ocultos</Overline>
      <div className="absolute right-6 top-7 flex gap-1.5">
        {quiz.map((_, i) => (
          <span key={i} className={`h-1.5 w-1.5 rounded-full ${i <= qi ? 'bg-blush' : 'bg-white/15'}`} />
        ))}
      </div>

      {/* Sem AnimatePresence mode="wait"/exit: a pergunta anterior
          desmonta na hora e a próxima entra com fade+slide. A pergunta do
          timeline usa arrasto, e o mode="wait" travava a virada pra
          próxima pergunta — deixando a tela preta. */}
      <motion.div
        key={qi}
        className="flex flex-1 flex-col justify-center"
        initial={{ opacity: 0, x: 26 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.45, ease: 'easeInOut' }}
      >
        {q.tipo === 'timeline' ? (
          <TimelineQuestion q={q} btnLabel={btnLabel} onComplete={complete} />
        ) : (
          <StandardQuestion q={q} btnLabel={btnLabel} onComplete={complete} />
        )}
      </motion.div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Pergunta padrão — mesmo estilo do Cap 4
// ─────────────────────────────────────────────────────────────

function StandardQuestion({ q, btnLabel, onComplete }) {
  const s = useSounds();
  const [chosen, setChosen] = useState(null);

  const pick = (opt) => {
    if (chosen) return;
    setChosen(opt);
    opt === q.correta ? s.acerto() : s.erro();
  };

  const stateFor = (opt) => {
    if (!chosen) return 'idle';
    if (opt === chosen) return opt === q.correta ? 'right' : 'wrong';
    if (opt === q.correta) return 'reveal';
    return 'dim';
  };

  return (
    <div className="flex flex-col gap-7">
      <div className="text-center font-display text-xl font-medium leading-snug text-white">{q.pergunta}</div>
      <div className="space-y-2.5">
        {q.opcoes.map((opt) => (
          <ChoiceButton key={opt} onClick={() => pick(opt)} disabled={!!chosen} state={stateFor(opt)}>
            {opt}
          </ChoiceButton>
        ))}
      </div>
      <div className="min-h-[88px]">
        {chosen && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.55 }}
            className="space-y-5"
          >
            <div className="border-l-2 border-blush/60 pl-3 text-left text-sm leading-relaxed text-white/75">
              {q.reveal}
            </div>
            <ContinueButton label={btnLabel} onClick={() => onComplete(chosen === q.correta)} delay={0.5} />
          </motion.div>
        )}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Pergunta especial — timeline arrastável (dez/24 → hoje)
// ─────────────────────────────────────────────────────────────

// linha do tempo: dez/2024 até jun/2026 ("hoje")
const TL_KEYS = (() => {
  const keys = [];
  let y = 2024;
  let m = 12;
  while (y < 2026 || (y === 2026 && m <= 6)) {
    keys.push(`${y}-${String(m).padStart(2, '0')}`);
    m += 1;
    if (m > 12) {
      m = 1;
      y += 1;
    }
  }
  return keys;
})();

// zona de acerto generosa em volta de nov/dez 2025
const Z0 = (TL_KEYS.indexOf('2025-11') - 0.8) / (TL_KEYS.length - 1);
const Z1 = (TL_KEYS.indexOf('2025-12') + 1.3) / (TL_KEYS.length - 1);

// resumo animado do dia recorde (reveal secundário)
const CHAT_326 = [
  { time: '12h', sender: 'Pedro', text: 'preciso entender melhor meu passado pra mapear minhas angústias' },
  { time: '12h', sender: 'Laura', text: 'mt fé sabe, nunca vamos saber se fizemos as escolhas certas' },
  { gap: true },
  { time: '22h', sender: 'Pedro', text: 'to cm fomeee' },
  { time: '22h', sender: 'Laura', text: 'tem comida' },
  { time: '22h', sender: 'Pedro', text: 'Oba' },
];

function TimelineQuestion({ q, btnLabel, onComplete }) {
  const s = useSounds();
  const wrapRef = useRef(null);
  const mx = useMotionValue(0);
  const [trackW, setTrackW] = useState(0);
  const [frac, setFrac] = useState(0);
  const [dragged, setDragged] = useState(false);
  const [result, setResult] = useState(null); // 'right' | 'wrong'
  const [reveal, setReveal] = useState(false);
  const MARKER = 28;

  useEffect(() => {
    const measure = () => wrapRef.current && setTrackW(Math.max(wrapRef.current.offsetWidth - MARKER, 0));
    measure();
    window.addEventListener('resize', measure);
    return () => window.removeEventListener('resize', measure);
  }, []);

  const release = () => {
    if (result) return;
    const f = trackW ? Math.min(Math.max(mx.get() / trackW, 0), 1) : 0;
    const ok = f >= Z0 && f <= Z1;
    setResult(ok ? 'right' : 'wrong');
    ok ? s.acerto() : s.erro();
    setTimeout(() => setReveal(true), ok ? 700 : 1400); // errou: mostra antes a zona certa
  };

  const mesAtual = mesLabel(TL_KEYS[Math.round(frac * (TL_KEYS.length - 1))], true);
  const markerCor = !result
    ? 'border-gold bg-[#0f0f0f]'
    : result === 'right'
      ? 'border-emerald-400 bg-emerald-400/20'
      : 'border-red-400 bg-red-400/20';

  return (
    <div className="flex flex-col gap-6">
      <div className="text-center font-display text-xl font-medium leading-snug text-white">{q.pergunta}</div>

      {/* barrinha do tempo */}
      <div className="px-1 pt-8">
        <div ref={wrapRef} className="relative h-7">
          <div className="absolute inset-x-0 top-1/2 h-1.5 -translate-y-1/2 rounded-full bg-white/12" />

          {/* zona certa — aparece depois da resposta
              (sem translate do Tailwind: o framer controla o transform) */}
          {result && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="absolute top-[7px] h-3.5 rounded border-x border-gold/60 bg-gold/25"
              style={{ left: Z0 * trackW + MARKER / 2, width: (Z1 - Z0) * trackW }}
            />
          )}

          {/* marcador arrastável (h-7 = altura do wrapper, dispensa centragem) */}
          <motion.div
            drag={result ? false : 'x'}
            dragConstraints={{ left: 0, right: trackW }}
            dragElastic={0}
            dragMomentum={false}
            style={{ x: mx }}
            onDrag={() => {
              setDragged(true);
              if (trackW) setFrac(Math.min(Math.max(mx.get() / trackW, 0), 1));
            }}
            onDragEnd={release}
            className={`absolute top-0 h-7 w-7 cursor-grab touch-none rounded-full border-2 shadow-lg active:cursor-grabbing ${markerCor}`}
          >
            {/* mês sob o marcador enquanto arrasta */}
            {(dragged || result) && (
              <div className="absolute -top-6 left-1/2 -translate-x-1/2 whitespace-nowrap font-mono text-[10px] text-gold">
                {mesAtual}
              </div>
            )}
          </motion.div>
        </div>

        <div className="mt-2 flex justify-between font-mono text-[10px] text-white/45">
          <span>dez/24</span>
          <span>hoje</span>
        </div>

        {!dragged && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="mt-2 text-center font-mono text-[11px] text-white/40"
          >
            ↑ arraste
          </motion.div>
        )}
      </div>

      {/* reveal: título + chat resumido + detalhe */}
      <div className="min-h-[220px]">
        {reveal && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-3">
            <div className="text-center font-display text-lg font-semibold text-gold">{q.reveal_titulo}</div>

            <div className="space-y-1.5 rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3">
              {CHAT_326.map((m, i) =>
                m.gap ? (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 + i * 0.5 }}
                    className="text-center text-white/30"
                  >
                    ···
                  </motion.div>
                ) : (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 + i * 0.5 }}
                    className="flex items-baseline gap-2 text-left"
                  >
                    <span className="w-7 shrink-0 font-mono text-[10px] text-white/35">{m.time}</span>
                    <span
                      className={`shrink-0 text-xs font-semibold ${
                        m.sender === 'Pedro' ? 'text-sky-300' : 'text-rose-300'
                      }`}
                    >
                      {m.sender}:
                    </span>
                    <span className="text-[12.5px] leading-snug text-white/85">“{m.text}”</span>
                  </motion.div>
                ),
              )}
            </div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 + CHAT_326.length * 0.5 + 0.3 }}
              className="text-center text-xs italic leading-relaxed text-white/55"
            >
              {q.reveal_detalhe}
            </motion.div>

            <ContinueButton
              label={btnLabel}
              onClick={() => onComplete(result === 'right')}
              delay={0.3 + CHAT_326.length * 0.5 + 0.7}
            />
          </motion.div>
        )}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Resultado — sem pontuação, só uma frase
// ─────────────────────────────────────────────────────────────

function Result({ score, total, onNext }) {
  const frase =
    score === total
      ? 'Você presta atenção.'
      : score >= 4
        ? 'Quase tudo. O resto você vai aprender.'
        : 'A gente tem muito pela frente.';

  return (
    <div className="flex h-full flex-col items-center justify-center gap-6 px-8 text-center">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9 }}
        className="max-w-xs font-display text-2xl font-medium leading-snug text-white"
      >
        {frase}
      </motion.div>
      <ContinueButton onClick={onNext} delay={1.2} className="mt-4" />
    </div>
  );
}
