import { useEffect, useMemo, useState } from 'react';
import { AnimatePresence, animate, motion } from 'framer-motion';
import {
  Line,
  LineChart,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import Typewriter from './shared/Typewriter';
import useSounds from '../hooks/useSounds';
import { ChoiceButton, ContinueButton, Overline } from './shared/ui';
import { DATA, fmt, mesLabel } from '../data/data';

const AZUL = '#60a5fa';
const ROSA = '#e879a0';

// ❤ sem variation selector vira glifo de texto em alguns aparelhos
const emo = (e) => (e === '❤' ? '❤️' : e);

// [04] CAP 4 — "A LINGUAGEM DE VOCÊS"
export default function Cap04_Linguagem({ onNext }) {
  const [stage, setStage] = useState('intro'); // intro | quiz | panels | outro

  const stages = {
    intro: <Intro onDone={() => setStage('quiz')} />,
    quiz: <Quiz onDone={() => setStage('panels')} />,
    panels: <Panels onDone={() => setStage('outro')} />,
    outro: <Outro onNext={onNext} />,
  };

  return (
    <div className="h-full overflow-hidden bg-[#0a0a0a]">
      <AnimatePresence mode="wait">
        <motion.div
          key={stage}
          className="h-full"
          initial={{ opacity: 0, x: 24 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -24 }}
          transition={{ duration: 0.5, ease: 'easeInOut' }}
        >
          {stages[stage]}
        </motion.div>
      </AnimatePresence>
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
        lines={[
          { text: 'Todo casal inventa uma língua própria.', delayAfter: 650 },
          { text: 'Aqui está a de vocês.', delayAfter: 700 },
          {
            text: 'Mas primeiro — você acha que conhece os números?',
            className: 'text-white/55 !text-lg',
          },
        ]}
        speed={40}
        className="space-y-4 text-center font-display text-2xl font-medium leading-snug"
        onDone={() => setDone(true)}
      />
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// QUIZ — 4 perguntas, uma por vez
// ─────────────────────────────────────────────────────────────

const QUIZ = [
  {
    q: 'No WhatsApp, quem mandou mais mensagens no total?',
    options: ['Pedro', 'Laura', 'Praticamente igual'],
    correct: 'Pedro',
    reveal: 'Pedro — 14.281 contra 12.577. Mas a diferença é menor do que parece: 53% a 47%.',
  },
  {
    q: 'Nos primeiros 3 meses se conhecendo, quem mandava mais reels no Instagram?',
    options: ['Pedro', 'Laura', 'Praticamente igual'],
    correct: 'Laura',
    reveal: 'Laura — ela estava te conquistando via reel antes de você virar o pesado. A virada aconteceu em abril/2025.',
  },
  {
    q: "Quantas vezes a Laura usou a palavra 'amor' no WhatsApp?",
    options: ['Umas 400', 'Umas 500', 'Mais de 600'],
    correct: 'Mais de 600',
    reveal: '693 vezes. Em 17 meses. Uma média de 40 por mês.',
  },
  {
    q: 'Qual foi o emoji mais usado pela Laura?',
    options: ['❤', '😍', '😂', '🥰'],
    correct: '😍',
    reveal: '😍 — seguido de 🥰 e 🤍. O Pedro? ❤ e 😭.',
  },
];

function Quiz({ onDone }) {
  const s = useSounds();
  const [qi, setQi] = useState(0);
  const [chosen, setChosen] = useState(null);
  const q = QUIZ[qi];
  const isEmoji = qi === 3;

  const pick = (opt) => {
    if (chosen) return;
    setChosen(opt);
    opt === q.correct ? s.acerto() : s.erro();
  };

  const next = () => {
    if (qi < QUIZ.length - 1) {
      setQi((n) => n + 1);
      setChosen(null);
    } else {
      onDone();
    }
  };

  const stateFor = (opt) => {
    if (!chosen) return 'idle';
    if (opt === chosen) return opt === q.correct ? 'right' : 'wrong';
    if (opt === q.correct) return 'reveal';
    return 'dim';
  };

  return (
    <div className="relative mx-auto flex h-full max-w-md flex-col px-6 pb-8 pt-20">
      <Overline className="absolute left-6 top-7">os números</Overline>
      {/* progresso */}
      <div className="absolute right-6 top-7 flex gap-1.5">
        {QUIZ.map((_, i) => (
          <span
            key={i}
            className={`h-1.5 w-1.5 rounded-full ${i <= qi ? 'bg-blush' : 'bg-white/15'}`}
          />
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={qi}
          className="flex flex-1 flex-col justify-center gap-7"
          initial={{ opacity: 0, x: 26 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -26 }}
          transition={{ duration: 0.45, ease: 'easeInOut' }}
        >
          <div className="text-center font-display text-xl font-medium leading-snug text-white">{q.q}</div>

          <div className={isEmoji ? 'grid grid-cols-2 gap-2.5' : 'space-y-2.5'}>
            {q.options.map((opt) => (
              <ChoiceButton
                key={opt}
                onClick={() => pick(opt)}
                disabled={!!chosen}
                state={stateFor(opt)}
                className={isEmoji ? 'py-4 text-3xl' : ''}
              >
                {isEmoji ? emo(opt) : opt}
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
                <ContinueButton
                  label={qi < QUIZ.length - 1 ? 'próxima →' : 'ver mais →'}
                  onClick={next}
                  delay={0.5}
                />
              </motion.div>
            )}
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// PAINÉIS — abrem em sequência, um por vez, com "ver mais →"
// ─────────────────────────────────────────────────────────────

function Panels({ onDone }) {
  const [pi, setPi] = useState(0);
  const [ready, setReady] = useState(false);

  const panels = [Panel1Duelo, Panel2Reels, Panel3Emojis, Panel4Amor, Panel5Apelidos, Panel6Nuvem];
  const Panel = panels[pi];

  const next = () => {
    if (pi < panels.length - 1) {
      setPi((n) => n + 1);
      setReady(false);
    } else {
      onDone();
    }
  };

  return (
    <div className="relative h-full">
      <AnimatePresence mode="wait">
        <motion.div
          key={pi}
          className="h-full"
          initial={{ opacity: 0, x: 26 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -26 }}
          transition={{ duration: 0.5, ease: 'easeInOut' }}
        >
          <Panel onReady={() => setReady(true)} />
        </motion.div>
      </AnimatePresence>
      <div className="absolute inset-x-0 bottom-9">
        {ready && <ContinueButton label="ver mais →" onClick={next} />}
      </div>
    </div>
  );
}

// Painel 1 — duelo de mensagens
function Panel1Duelo({ onReady }) {
  useEffect(() => {
    const t = setTimeout(onReady, 3100);
    return () => clearTimeout(t);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const bars = [
    { nome: 'Pedro', count: DATA.whatsapp.pedro_messages, pct: DATA.whatsapp.pedro_percent, cor: 'from-sky-600 to-sky-400', txt: 'text-sky-300', w: '100%' },
    { nome: 'Laura', count: DATA.whatsapp.laura_messages, pct: DATA.whatsapp.laura_percent, cor: 'from-rose-600 to-rose-400', txt: 'text-rose-300', w: `${(47 / 53) * 100}%` },
  ];

  return (
    <div className="mx-auto flex h-full max-w-md flex-col justify-center gap-10 px-7 pb-20">
      <Overline className="text-center">duelo de mensagens</Overline>
      <div className="space-y-8">
        {bars.map((b, i) => (
          <div key={b.nome}>
            <div className="mb-2 flex items-end justify-between">
              <span className={`font-display text-sm font-semibold ${b.txt}`}>{b.nome}</span>
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 2.3, duration: 0.6 }}
                className="font-mono text-xs text-white/70"
              >
                {fmt(b.count)} · {b.pct}%
              </motion.span>
            </div>
            <div className="h-3.5 overflow-hidden rounded-full bg-white/[0.06]">
              <motion.div
                className={`h-full rounded-full bg-gradient-to-r ${b.cor}`}
                initial={{ width: '0%' }}
                animate={{ width: b.w }}
                transition={{ duration: 2.2, delay: i * 0.15, ease: 'easeOut' }}
              />
            </div>
          </div>
        ))}
      </div>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2.7, duration: 0.7 }}
        className="text-center text-sm italic text-white/60"
      >
        Você fala mais. Ela sente mais.
      </motion.div>
    </div>
  );
}

// Painel 2 — a virada dos reels (Recharts LineChart)
function Panel2Reels({ onReady }) {
  useEffect(() => {
    const t = setTimeout(onReady, 3300);
    return () => clearTimeout(t);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const data = useMemo(
    () =>
      Object.entries(DATA.instagram.monthly_reels).map(([k, v]) => ({
        m: mesLabel(k, true),
        Pedro: v.pedro,
        Laura: v.laura,
      })),
    [],
  );

  return (
    <div className="mx-auto flex h-full max-w-md flex-col justify-center gap-6 px-4 pb-20">
      <Overline className="text-center">a virada dos reels</Overline>
      <div className="h-[260px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 26, right: 14, left: 14, bottom: 4 }}>
            <XAxis
              dataKey="m"
              ticks={['jan/25', 'mai/25', 'set/25', 'jan/26', 'mai/26']}
              tick={{ fontSize: 9, fill: 'rgba(255,255,255,0.45)' }}
              axisLine={{ stroke: 'rgba(255,255,255,0.15)' }}
              tickLine={false}
              interval={0}
            />
            <YAxis hide domain={[0, 130]} />
            <Tooltip
              contentStyle={{
                background: '#161616',
                border: '1px solid rgba(255,255,255,0.12)',
                borderRadius: 12,
                fontSize: 12,
                padding: '6px 10px',
              }}
              labelStyle={{ color: 'rgba(255,255,255,0.55)', marginBottom: 2 }}
              itemStyle={{ padding: 0 }}
              cursor={{ stroke: 'rgba(255,255,255,0.2)', strokeDasharray: '3 3' }}
            />
            {/* marcação da virada — onde o Pedro assumiu os reels */}
            <ReferenceLine
              x="abr/25"
              stroke="rgba(232,185,74,0.55)"
              strokeDasharray="3 4"
              label={{ value: 'a virada', position: 'top', fill: '#e8b94a', fontSize: 10, fontStyle: 'italic' }}
            />
            <Line type="monotone" dataKey="Pedro" stroke={AZUL} strokeWidth={2} dot={false} animationDuration={2600} animationEasing="ease-in-out" />
            <Line type="monotone" dataKey="Laura" stroke={ROSA} strokeWidth={2} dot={false} animationDuration={2600} animationEasing="ease-in-out" />
          </LineChart>
        </ResponsiveContainer>
      </div>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2.8, duration: 0.7 }}
        className="text-center font-mono text-xs text-white/60"
      >
        <span className="text-sky-300">Pedro {DATA.instagram.pedro_reels}</span>
        <span className="mx-2 text-white/30">·</span>
        <span className="text-rose-300">Laura {DATA.instagram.laura_reels}</span>
      </motion.div>
    </div>
  );
}

// Painel 3 — os emojis de cada um
function Panel3Emojis({ onReady }) {
  useEffect(() => {
    const t = setTimeout(onReady, 3700);
    return () => clearTimeout(t);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const sizes = ['text-6xl', 'text-5xl', 'text-4xl', 'text-3xl', 'text-2xl'];
  const cols = [
    { nome: 'Pedro', list: DATA.emojis.pedro, txt: 'text-sky-300', offset: 0 },
    { nome: 'Laura', list: DATA.emojis.laura, txt: 'text-rose-300', offset: DATA.emojis.pedro.length },
  ];

  return (
    <div className="mx-auto flex h-full max-w-md flex-col justify-center gap-8 px-6 pb-20">
      <Overline className="text-center">os emojis de cada um</Overline>
      <div className="grid grid-cols-2 divide-x divide-white/10">
        {cols.map((c) => (
          <div key={c.nome} className="flex flex-col items-center gap-4 px-2">
            <div className={`font-display text-sm font-semibold ${c.txt}`}>{c.nome}</div>
            {/* do mais usado (maior) ao menos usado, um a um, com bounce */}
            {c.list.map((e, i) => (
              <motion.div
                key={e}
                className={sizes[Math.min(i, sizes.length - 1)]}
                initial={{ scale: 0, y: 14 }}
                animate={{ scale: 1, y: 0 }}
                transition={{
                  delay: (c.offset + i) * 0.32 + 0.2,
                  type: 'spring',
                  stiffness: 380,
                  damping: 11,
                }}
              >
                {emo(e)}
              </motion.div>
            ))}
          </div>
        ))}
      </div>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 3.2, duration: 0.7 }}
        className="text-center text-sm italic leading-relaxed text-white/60"
      >
        Vocês dois usam 😭 — mas claramente não pelo mesmo motivo.
      </motion.div>
    </div>
  );
}

// Painel 4 — a palavra favorita dela (zero texto adicional)
function Panel4Amor({ onReady }) {
  const [n, setN] = useState(0);

  useEffect(() => {
    // contador sobe rápido e desacelera no final
    const ctrl = animate(0, DATA.whatsapp.laura_amor_count, {
      duration: 2.6,
      delay: 0.9,
      ease: [0.16, 0.6, 0.25, 1],
      onUpdate: (v) => setN(Math.round(v)),
    });
    const t = setTimeout(onReady, 4000);
    return () => {
      ctrl.stop();
      clearTimeout(t);
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className="flex h-full flex-col items-center justify-center gap-6 pb-20">
      <motion.div
        initial={{ scale: 0.55, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 1.1, ease: 'easeOut' }}
        className="font-display text-7xl font-light italic tracking-tight text-rose-200"
      >
        amor
      </motion.div>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.9 }}
        className="font-mono text-4xl font-light tabular-nums text-gold"
      >
        {n}
      </motion.div>
    </div>
  );
}

// Painel 5 — os apelidos de vocês
function Panel5Apelidos({ onReady }) {
  useEffect(() => {
    const t = setTimeout(onReady, 5100);
    return () => clearTimeout(t);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const blocos = [
    { head: 'Pedro chama ela de', names: DATA.nicknames.pedro_calls_laura, cor: 'text-rose-200', base: 0 },
    { head: 'Laura chama ele de', names: DATA.nicknames.laura_calls_pedro, cor: 'text-[#e8c97a]', base: 2.2 },
  ];

  return (
    <div className="mx-auto flex h-full max-w-md flex-col items-center justify-center gap-12 px-7 pb-20">
      {blocos.map((b) => (
        <div key={b.head} className="text-center">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: b.base, duration: 0.6 }}
            className="mb-3 text-sm text-white/45"
          >
            {b.head}
          </motion.div>
          <div className="flex flex-wrap items-baseline justify-center gap-x-3 gap-y-1">
            {b.names.map((nome, i) => (
              <span key={nome} className="flex items-baseline gap-x-3">
                {i > 0 && (
                  <motion.span
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: b.base + 0.5 + i * 0.5 }}
                    className="text-white/30"
                  >
                    ·
                  </motion.span>
                )}
                <motion.span
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: b.base + 0.5 + i * 0.5, duration: 0.55 }}
                  className={`font-display text-2xl font-medium ${b.cor}`}
                >
                  {nome}
                </motion.span>
              </span>
            ))}
          </div>
        </div>
      ))}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 4.6, duration: 0.7 }}
        className="text-center text-sm italic text-white/60"
      >
        Você inventou um apelido. Ela foi pelo caminho poético.
      </motion.div>
    </div>
  );
}

// Painel 6 — nuvem de palavras
const AZUIS = ['#bfdbfe', '#93c5fd', '#60a5fa', '#3b82f6'];
const ROSAS = ['#fbcfe8', '#f9a8d4', '#e879a0', '#ec4899'];

function Cloud({ words, palette, nome, txt, startDelay }) {
  const n = words.length;
  const size = (i) => Math.round((26 - i * (15 / (n - 1))) * 10) / 10;
  return (
    <div className="flex flex-col items-center gap-3">
      <div className={`font-display text-sm font-semibold ${txt}`}>{nome}</div>
      <div className="flex flex-wrap items-baseline justify-center gap-x-2 gap-y-0.5">
        {words.map((w, i) => (
          <motion.span
            key={w}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: Math.max(1 - i * 0.035, 0.5), y: 0 }}
            transition={{ delay: startDelay + i * 0.08, duration: 0.5 }}
            style={{
              fontSize: `${size(i)}px`,
              color: palette[i % palette.length],
              fontWeight: i < 3 ? 600 : i < 7 ? 500 : 400,
            }}
          >
            {w}
          </motion.span>
        ))}
      </div>
    </div>
  );
}

function Panel6Nuvem({ onReady }) {
  useEffect(() => {
    const t = setTimeout(onReady, 2900);
    return () => clearTimeout(t);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className="mx-auto flex h-full max-w-md flex-col justify-center gap-8 px-4 pb-20">
      <Overline className="text-center">as palavras de vocês</Overline>
      <div className="grid grid-cols-2 gap-3">
        <Cloud words={DATA.pedro_top_words} palette={AZUIS} nome="Pedro" txt="text-sky-300" startDelay={0.2} />
        <Cloud words={DATA.laura_top_words} palette={ROSAS} nome="Laura" txt="text-rose-300" startDelay={0.5} />
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Saída
// ─────────────────────────────────────────────────────────────

function Outro({ onNext }) {
  return (
    <div className="flex h-full flex-col items-center justify-center gap-5 px-8 text-center">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9 }}
        className="font-display text-2xl font-medium text-white"
      >
        Essa é a língua de vocês.
      </motion.div>
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.9, duration: 0.9 }}
        className="font-display text-lg text-white/55"
      >
        Construída mensagem por mensagem.
      </motion.div>
      <ContinueButton onClick={onNext} delay={2.1} className="mt-8" />
    </div>
  );
}
