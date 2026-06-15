import { useEffect, useMemo, useRef, useState } from 'react';
import { animate, motion } from 'framer-motion';
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

const shuffle = (arr) => arr.map((v) => [Math.random(), v]).sort((a, b) => a[0] - b[0]).map(([, v]) => v);

// [04] CAP 4 — "A LINGUAGEM DE VOCÊS"
export default function Cap04_Linguagem({ onNext }) {
  const [stage, setStage] = useState('intro'); // intro | quiz | panels | outro

  const stages = {
    intro: <Intro onDone={() => setStage('quiz')} />,
    quiz: <Quiz onDone={() => setStage('panels')} />,
    panels: <Panels onDone={() => setStage('outro')} />,
    outro: <Outro onNext={onNext} />,
  };

  // sem AnimatePresence mode="wait": as etapas contêm jogos de arrastar,
  // e o mode="wait" travaria a saída (tela preta) — etapa anterior
  // desmonta na hora e a próxima entra com fade+slide.
  return (
    <div className="h-full overflow-hidden bg-[#0a0a0a]">
      <motion.div
        key={stage}
        className="h-full"
        initial={{ opacity: 0, x: 24 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, ease: 'easeInOut' }}
      >
        {stages[stage]}
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
// QUIZ — 3 perguntas (a de reels foi pro Cap 2). Sem texto de reveal:
// só borda verde/vermelha + placar X/3, e avança sozinho em 2.5s.
// ─────────────────────────────────────────────────────────────

const QUIZ = [
  {
    q: 'No WhatsApp, quem mandou mais mensagens no total?',
    options: ['Pedro', 'Laura', 'Praticamente igual'],
    correct: 'Pedro',
  },
  {
    q: "Quantas vezes a Laura usou a palavra 'amor' no WhatsApp?",
    options: ['Umas 400', 'Umas 500', 'Mais de 600'],
    correct: 'Mais de 600',
  },
  {
    q: 'Qual foi o emoji mais usado pela Laura?',
    options: ['❤', '😍', '😂', '🥰'],
    correct: '😍',
  },
];

function Quiz({ onDone }) {
  const s = useSounds();
  const [qi, setQi] = useState(0);
  const [chosen, setChosen] = useState(null);
  const [score, setScore] = useState(0);
  const q = QUIZ[qi];
  const isEmoji = qi === QUIZ.length - 1;

  const pick = (opt) => {
    if (chosen) return;
    setChosen(opt);
    const correct = opt === q.correct;
    if (correct) {
      setScore((n) => n + 1);
      s.acerto();
    } else {
      s.erro();
    }
    // avança automaticamente após o feedback visual (sem botão)
    setTimeout(() => {
      if (qi < QUIZ.length - 1) {
        setQi((n) => n + 1);
        setChosen(null);
      } else {
        onDone();
      }
    }, 2500);
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
      {/* placar X/3 no canto superior direito */}
      <div className="absolute right-6 top-6 rounded-full border border-white/15 px-3 py-1 font-mono text-xs text-white/70">
        {score}/{QUIZ.length}
      </div>

      <motion.div
        key={qi}
        className="flex flex-1 flex-col justify-center gap-8"
        initial={{ opacity: 0, x: 26 }}
        animate={{ opacity: 1, x: 0 }}
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
      </motion.div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// PAINÉIS — abrem em sequência, um por vez, com "ver mais →".
// Os dois jogos (emojis e palavras) somam num placar único.
// ─────────────────────────────────────────────────────────────

const PANELS = [Panel1Duelo, Panel2Reels, EmojiGame, WordsGame, Placar, Panel4Amor, Panel5Apelidos];

function Panels({ onDone }) {
  const [pi, setPi] = useState(0);
  const [ready, setReady] = useState(false);
  const [score, setScore] = useState(0); // placar acumulado dos 2 jogos

  const Cur = PANELS[pi];
  const next = () => {
    if (pi < PANELS.length - 1) {
      setPi((n) => n + 1);
      setReady(false);
    } else {
      onDone();
    }
  };

  // sem AnimatePresence: a fase anterior desmonta na hora (anti-deadlock
  // dos jogos de arrastar) e a próxima entra com fade+slide.
  return (
    <div className="relative h-full">
      <motion.div
        key={pi}
        className="h-full"
        initial={{ opacity: 0, x: 26 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, ease: 'easeInOut' }}
      >
        <Cur onReady={() => setReady(true)} score={score} onScore={(d) => setScore((v) => v + d)} />
      </motion.div>
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

// ─────────────────────────────────────────────────────────────
// Jogo de arrastar (base dos jogos de emojis e palavras)
// Arrasta cada token pro campo certo. Acerto +1, erro -1 (e o token
// vai sozinho pro campo certo). Placar acumula entre os dois jogos.
// ─────────────────────────────────────────────────────────────

function Token({ tk, kind, big }) {
  if (kind === 'emoji') return <span className={big ? 'text-5xl' : 'text-3xl'}>{emo(tk)}</span>;
  return (
    <span
      className={`rounded-full border border-white/20 bg-white/10 ${
        big ? 'px-4 py-1.5 text-base' : 'px-2.5 py-1 text-xs'
      } text-white/85`}
    >
      {tk}
    </span>
  );
}

function DragSortGame({ title, hint, kind, fixed, queue, score, onScore, onReady }) {
  const s = useSounds();
  const [placed, setPlaced] = useState({ pedro: [...fixed.pedro], laura: [...fixed.laura] });
  const [qi, setQi] = useState(0);
  const [flash, setFlash] = useState(null); // { side, ok }
  const [done, setDone] = useState(false);
  const pedroZone = useRef(null);
  const lauraZone = useRef(null);
  const cur = queue[qi];

  const place = (side) => {
    if (done || !cur) return;
    const correct = side === cur.owner;
    onScore(correct ? 1 : -1);
    correct ? s.acerto() : s.erro();
    // o token sempre termina no campo certo
    setPlaced((p) => ({ ...p, [cur.owner]: [...p[cur.owner], cur.token] }));
    setFlash({ side: cur.owner, ok: correct });
    setTimeout(() => setFlash(null), 700);
    const nq = qi + 1;
    if (nq >= queue.length) {
      setDone(true);
      setTimeout(onReady, 700);
    } else {
      setQi(nq);
    }
  };

  const onDrop = (point) => {
    const zones = [
      ['pedro', pedroZone],
      ['laura', lauraZone],
    ];
    for (const [side, ref] of zones) {
      const el = ref.current;
      if (!el) continue;
      const r = el.getBoundingClientRect();
      if (point.x >= r.left && point.x <= r.right && point.y >= r.top - 12 && point.y <= r.bottom + 12) {
        place(side);
        return;
      }
    }
    // fora dos campos → não pontua (o token volta sozinho)
  };

  const fields = [
    { side: 'pedro', nome: 'Pedro', ref: pedroZone, txt: 'text-sky-300', bd: 'border-sky-400/40', bg: 'bg-sky-500/[0.07]' },
    { side: 'laura', nome: 'Laura', ref: lauraZone, txt: 'text-rose-300', bd: 'border-rose-400/40', bg: 'bg-rose-500/[0.07]' },
  ];

  return (
    <div className="mx-auto flex h-full max-w-md flex-col px-5 pb-24 pt-16">
      <Overline className="text-center">{title}</Overline>
      <div className="mt-1 text-center font-mono text-xs text-white/50">
        placar: <span className={score < 0 ? 'text-rose-400' : 'text-gold'}>{score}</span>
      </div>

      {/* dois campos / alvos */}
      <div className="mt-4 grid flex-1 grid-cols-2 gap-3">
        {fields.map((f) => (
          <div
            key={f.side}
            ref={f.ref}
            className={`flex flex-col items-center gap-2 rounded-2xl border p-3 transition-colors ${f.bd} ${f.bg} ${
              flash?.side === f.side
                ? flash.ok
                  ? '!border-emerald-400 !bg-emerald-400/15'
                  : '!border-red-400 !bg-red-400/15'
                : ''
            }`}
          >
            <div className={`font-display text-sm font-semibold ${f.txt}`}>{f.nome}</div>
            <div className="flex flex-wrap items-center justify-center gap-2">
              {placed[f.side].map((tk, i) => (
                <Token key={`${tk}-${i}`} tk={tk} kind={kind} />
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* token atual pra arrastar */}
      <div className="mt-5 flex h-20 items-center justify-center">
        {!done && cur ? (
          <motion.div
            key={qi}
            drag
            dragSnapToOrigin
            dragMomentum={false}
            whileDrag={{ scale: 1.12, zIndex: 50 }}
            onDragEnd={(_e, info) => onDrop(info.point)}
            className="cursor-grab touch-none active:cursor-grabbing"
          >
            <Token tk={cur.token} kind={kind} big />
          </motion.div>
        ) : (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-sm italic text-white/40">
            pronto! 🎉
          </motion.div>
        )}
      </div>
      <div className="h-5 text-center font-mono text-[11px] tracking-widest text-white/25">{!done && hint}</div>
    </div>
  );
}

// Jogo dos emojis (😭 ✨ já fixos nos dois campos)
function EmojiGame({ onReady, score, onScore }) {
  const queue = useMemo(
    () =>
      shuffle([
        { token: '❤', owner: 'pedro' },
        { token: '🙏', owner: 'pedro' },
        { token: '😍', owner: 'laura' },
        { token: '🥰', owner: 'laura' },
        { token: '🤍', owner: 'laura' },
      ]),
    [],
  );
  return (
    <DragSortGame
      title="de quem é esse emoji?"
      hint="( arrasta pro campo certo )"
      kind="emoji"
      fixed={{ pedro: ['😭', '✨'], laura: ['😭', '✨'] }}
      queue={queue}
      score={score}
      onScore={onScore}
      onReady={onReady}
    />
  );
}

// Jogo das palavras (tava · amanhã · sair · melhor · casa já fixas)
function WordsGame({ onReady, score, onScore }) {
  const queue = useMemo(
    () =>
      shuffle([
        { token: 'mozão', owner: 'pedro' },
        { token: 'vamos', owner: 'pedro' },
        { token: 'foda', owner: 'pedro' },
        { token: 'poxa', owner: 'pedro' },
        { token: 'manda', owner: 'pedro' },
        { token: 'vida', owner: 'laura' },
        { token: 'saudade', owner: 'laura' },
        { token: 'mundo', owner: 'laura' },
        { token: 'dormir', owner: 'laura' },
        { token: 'nunca', owner: 'laura' },
      ]),
    [],
  );
  return (
    <DragSortGame
      title="de quem é essa palavra?"
      hint="( arrasta pro campo certo )"
      kind="word"
      fixed={{ pedro: ['tava', 'amanhã', 'sair', 'melhor', 'casa'], laura: ['tava', 'amanhã', 'sair', 'melhor', 'casa'] }}
      queue={queue}
      score={score}
      onScore={onScore}
      onReady={onReady}
    />
  );
}

// Placar final dos dois jogos
function Placar({ onReady, score }) {
  useEffect(() => {
    const t = setTimeout(onReady, 2600);
    return () => clearTimeout(t);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const msg =
    score >= 13
      ? 'Ok, você me conhece.'
      : score >= 8
        ? 'Quase.'
        : score >= 4
          ? 'Tá chegando lá.'
          : score >= 0
            ? 'Empate técnico.'
            : 'vou nem falar nada 👀';

  return (
    <div className="flex h-full flex-col items-center justify-center gap-5 px-8 pb-20 text-center">
      <Overline>placar dos jogos</Overline>
      <motion.div
        initial={{ scale: 0.6, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 260, damping: 18 }}
        className={`font-display text-7xl font-bold ${score < 0 ? 'text-rose-400' : 'text-gold'}`}
      >
        {score}
      </motion.div>
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="max-w-xs font-display text-xl text-white/85"
      >
        {msg}
      </motion.div>
    </div>
  );
}

// Painel contador — a palavra favorita dela (zero texto adicional)
function Panel4Amor({ onReady }) {
  const [n, setN] = useState(0);

  useEffect(() => {
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

// Painel apelidos — fecha o Cap 4
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
