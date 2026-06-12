import { useEffect, useMemo, useRef, useState } from 'react';
import { AnimatePresence, LayoutGroup, motion } from 'framer-motion';
import Typewriter from './shared/Typewriter';
import useSounds from '../hooks/useSounds';
import { ChoiceButton, ContinueButton, FloatingHearts, Overline } from './shared/ui';
import { DATA } from '../data/data';

// [03] CAP 3 — "VOCÊ ME CONHECE?"
// 3 jogos em sequência: quem disse isso? → quem disse eu te amo
// primeiro online? → o que veio depois?
export default function Cap03_Conhece({ onNext }) {
  const [stage, setStage] = useState('intro');

  const stages = {
    intro: <Intro onDone={() => setStage('g1')} />,
    g1: <Game1 onDone={() => setStage('g2')} />,
    g2: <Game2 onDone={() => setStage('g3')} />,
    g3: <Game3 onDone={onNext} />,
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

// ─────────────────────────────────────────────────────────────
// Entrada — texto digitado, uma linha por vez
// ─────────────────────────────────────────────────────────────

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
          { text: 'Você acha que me conhece?', delayAfter: 650 },
          { text: 'Vamos ver.', delayAfter: 650 },
          { text: '3 jogos. Dados reais. Sem colinha.', className: 'text-white/55 !text-lg' },
        ]}
        speed={42}
        className="space-y-4 text-center font-display text-2xl font-medium leading-snug"
        onDone={() => setDone(true)}
      />
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// JOGO 3.1 — QUEM DISSE ISSO? (7 rodadas, placar X/7)
// ─────────────────────────────────────────────────────────────

function Game1({ onDone }) {
  const s = useSounds();
  const rounds = DATA.jogo31_rounds;
  const [round, setRound] = useState(0);
  const [score, setScore] = useState(0);
  const [chosen, setChosen] = useState(null);
  const [showCtx, setShowCtx] = useState(false);
  const [finished, setFinished] = useState(false);

  const r = rounds[round];
  const options = r.decoy ? ['Pedro', 'Laura', r.decoy] : ['Pedro', 'Laura'];
  const gotcha = !options.includes(r.resposta); // pegadinha: a resposta nem está nos botões

  const pick = (opt) => {
    if (chosen) return;
    setChosen(opt);
    const correct = opt === r.resposta;
    if (correct) {
      setScore((n) => n + 1);
      s.acerto();
    } else {
      gotcha ? s.buzzer() : s.erro();
    }
    setTimeout(() => setShowCtx(true), 550);
    setTimeout(() => {
      if (round < rounds.length - 1) {
        setRound((n) => n + 1);
        setChosen(null);
        setShowCtx(false);
      } else {
        setFinished(true);
      }
    }, gotcha ? 3300 : 2500);
  };

  const stateFor = (opt) => {
    if (!chosen) return 'idle';
    if (opt === chosen) return opt === r.resposta ? 'right' : 'wrong';
    if (opt === r.resposta) return 'reveal'; // o botão correto fica destacado
    return 'dim';
  };

  const tier =
    score === 7
      ? 'Ok, você me conhece.'
      : score >= 5
        ? 'Quase. Mas eu deixei passar algumas.'
        : score >= 3
          ? 'A gente precisa conversar.'
          : 'Você me conhece pessoalmente. Online é outra história.';

  if (finished) {
    return (
      <div className="flex h-full flex-col items-center justify-center gap-5 px-8 text-center">
        <Overline>quem disse isso?</Overline>
        <motion.div
          initial={{ scale: 0.6, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 260, damping: 18 }}
          className="font-display text-7xl font-bold text-blush"
        >
          {score}/7
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="max-w-xs font-display text-xl text-white/85"
        >
          {tier}
        </motion.div>
        <ContinueButton label="Próximo jogo →" onClick={onDone} delay={1.4} className="mt-6" />
      </div>
    );
  }

  return (
    <div className="relative mx-auto flex h-full max-w-md flex-col px-6 pb-8 pt-20">
      <Overline className="absolute left-6 top-7">jogo 1 · quem disse isso?</Overline>
      {/* placar no canto superior direito */}
      <div className="absolute right-6 top-6 rounded-full border border-white/15 px-3 py-1 font-mono text-xs text-white/70">
        {score}/7
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={round}
          className="flex flex-1 flex-col justify-center gap-7"
          initial={{ opacity: 0, x: 26 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -26 }}
          transition={{ duration: 0.4, ease: 'easeInOut' }}
        >
          <div className="text-center">
            <span className="font-display text-3xl leading-none text-blush/70">“</span>
            <div className="-mt-2 font-display text-[22px] font-medium leading-snug text-white">
              {r.frase}
            </div>
            <span className="font-display text-3xl leading-none text-blush/70">”</span>
          </div>

          <div className="space-y-2.5">
            {options.map((opt) => (
              <ChoiceButton key={opt} onClick={() => pick(opt)} disabled={!!chosen} state={stateFor(opt)}>
                {opt}
              </ChoiceButton>
            ))}
          </div>

          <div className="min-h-[72px] text-center">
            {showCtx && (
              <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="space-y-2">
                {gotcha && (
                  <motion.div
                    initial={{ scale: 0.6 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', stiffness: 320, damping: 16 }}
                    className="inline-block rounded-full border border-gold/70 bg-gold/10 px-4 py-1.5 text-sm font-semibold text-gold"
                  >
                    → {r.resposta}
                  </motion.div>
                )}
                <div className="text-sm italic leading-relaxed text-white/55">{r.contexto}</div>
              </motion.div>
            )}
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// JOGO 3.2 — QUEM DISSE "EU TE AMO" PRIMEIRO... ONLINE?
// ─────────────────────────────────────────────────────────────

function Game2({ onDone }) {
  const s = useSounds();
  const [stage, setStage] = useState('q'); // q | wrong | reveal
  const [chosen, setChosen] = useState(null);
  const [bubbles, setBubbles] = useState(0);
  const [caption, setCaption] = useState(false);
  const [btn, setBtn] = useState(false);

  // os dois balões do reveal vêm direto da conversa real
  const msgs = DATA.te_amo.conversation.slice(3, 5); // KKKKKKKKKKKK + TE AMO

  const pick = (who) => {
    if (chosen) return;
    setChosen(who);
    if (who === 'Laura') {
      s.chime();
      setTimeout(() => setStage('reveal'), 900);
    } else {
      s.erro();
      setTimeout(() => setStage('wrong'), 800);
    }
  };

  // balões aparecem um a um, de cima pra baixo, com delay de 600ms
  useEffect(() => {
    if (stage !== 'reveal') return;
    const ts = [
      setTimeout(() => setBubbles(1), 400),
      setTimeout(() => setBubbles(2), 1000),
      setTimeout(() => setCaption(true), 1900),
      setTimeout(() => setBtn(true), 1900 + 3000), // pausa de 3s
    ];
    return () => ts.forEach(clearTimeout);
  }, [stage]);

  if (stage === 'reveal') {
    return (
      <div className="relative flex h-full flex-col items-center justify-center gap-3 px-7">
        <FloatingHearts />
        <div className="w-full max-w-sm space-y-3">
          {bubbles >= 1 && (
            <motion.div
              initial={{ opacity: 0, y: -14 }}
              animate={{ opacity: 1, y: 0 }}
              className="w-fit rounded-2xl rounded-tl-md bg-[#202c33] px-4 py-2.5 text-[15px] text-white shadow"
            >
              KKKKKKKKKKKK
              <span className="ml-2 align-bottom text-[10px] text-white/40">{msgs[0].time}</span>
            </motion.div>
          )}
          {bubbles >= 2 && (
            <motion.div
              initial={{ opacity: 0, y: -14, scale: 0.85 }}
              animate={{ opacity: 1, y: 0, scale: [0.85, 1.08, 1, 1.06, 1] }}
              transition={{ duration: 1.4, ease: 'easeOut' }}
              className="w-fit rounded-2xl rounded-tl-md border border-rose-400/80 bg-gradient-to-br from-rose-500/30 to-rose-600/20 px-6 py-3.5 shadow-[0_0_28px_rgba(244,114,182,0.35)]"
            >
              <span className="font-display text-2xl font-bold tracking-wide text-rose-200">TE AMO</span>
              <span className="ml-2.5 align-bottom text-[10px] text-rose-200/50">{msgs[1].time}</span>
            </motion.div>
          )}
        </div>
        <div className="h-6">
          {caption && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-xs text-white/50">
              {DATA.te_amo.time.replace(':', 'h')} do dia {DATA.te_amo.date}.
            </motion.div>
          )}
        </div>
        <div className="mt-4 h-11">{btn && <ContinueButton label="Próximo jogo →" onClick={onDone} />}</div>
      </div>
    );
  }

  if (stage === 'wrong') {
    return (
      <div className="flex h-full flex-col items-center justify-center gap-6 px-8 text-center">
        <div className="text-4xl">🔴</div>
        <div className="font-display text-2xl font-medium text-white">Quase. Mas não foi dessa vez.</div>
        <ContinueButton
          label="Tentar de novo"
          delay={0.4}
          onClick={() => {
            setChosen(null);
            setStage('q');
          }}
        />
      </div>
    );
  }

  return (
    <div className="relative mx-auto flex h-full max-w-md flex-col justify-center gap-9 px-7">
      <Overline className="absolute left-6 top-7">jogo 2</Overline>
      <div className="text-center font-display text-[26px] font-medium leading-snug text-white">
        Quem disse <span className="italic text-blush">“eu te amo”</span> primeiro... online?
      </div>
      <div className="space-y-3">
        {['Pedro', 'Laura'].map((who) => (
          <ChoiceButton
            key={who}
            onClick={() => pick(who)}
            disabled={!!chosen}
            state={!chosen ? 'idle' : who === chosen ? (who === 'Laura' ? 'right' : 'wrong') : 'dim'}
            className="py-4 text-base"
          >
            {who}
          </ChoiceButton>
        ))}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// JOGO 3.3 — O QUE VEIO DEPOIS?
// ─────────────────────────────────────────────────────────────

const G3_OPTIONS = [
  'tb to adorando namorar você',
  'amor, esse é o John Kennedy', // ← correta
  'boa noite gatinho',
  'ce me faz feliz demais',
];
const G3_CORRECT = G3_OPTIONS[1];

function Game3({ onDone }) {
  const s = useSounds();
  const [stage, setStage] = useState('q'); // q | big | convo
  const [introDone, setIntroDone] = useState(false);
  const [chosen, setChosen] = useState(null);
  const [shown, setShown] = useState(0); // mensagens reveladas (de baixo pra cima)
  const [caption, setCaption] = useState(false);
  const [btn, setBtn] = useState(false);
  const bigDone = useRef(false);

  // ordem aleatória a cada vez
  const options = useMemo(
    () => G3_OPTIONS.map((o) => [Math.random(), o]).sort((a, b) => a[0] - b[0]).map(([, o]) => o),
    [],
  );

  const convo = DATA.te_amo.conversation;

  const pick = (opt) => {
    if (chosen) return;
    setChosen(opt);
    opt === G3_CORRECT ? s.acerto() : s.erro();
    setTimeout(() => setStage('big'), 1400);
  };

  // tempo 2: a conversa expande, mensagens surgindo de baixo pra cima
  // (o John Kennedy já está na tela — morph do tempo 1)
  useEffect(() => {
    if (stage !== 'convo') return;
    const ts = [];
    for (let k = 2; k <= convo.length; k++) {
      ts.push(
        setTimeout(() => {
          s.bip();
          setShown(k);
        }, (k - 1) * 600),
      );
    }
    ts.push(setTimeout(() => setCaption(true), convo.length * 600 + 500));
    ts.push(setTimeout(() => setBtn(true), convo.length * 600 + 1500));
    return () => ts.forEach(clearTimeout);
  }, [stage]); // eslint-disable-line react-hooks/exhaustive-deps

  const stateFor = (opt) => {
    if (!chosen) return 'idle';
    if (opt === chosen) return opt === G3_CORRECT ? 'right' : 'wrong';
    if (opt === G3_CORRECT) return 'reveal';
    return 'dim';
  };

  return (
    <LayoutGroup>
      <div className="relative mx-auto flex h-full max-w-md flex-col px-6 py-8">
        <Overline className="absolute left-6 top-7">jogo 3</Overline>

        {stage === 'q' && (
          <div className="flex flex-1 flex-col justify-center gap-7">
            <Typewriter
              lines={[
                { text: "Primeiro 'TE AMO' online enviado.", delayAfter: 500 },
                { text: 'O que ela mandou logo na sequência?', className: 'text-white/70 !text-lg' },
              ]}
              speed={34}
              className="space-y-2 text-center font-display text-xl font-medium"
              onDone={() => setIntroDone(true)}
            />
            <div className="min-h-[230px]">
              {introDone && (
                <motion.div
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-2.5"
                >
                  {options.map((opt) => (
                    <ChoiceButton key={opt} onClick={() => pick(opt)} disabled={!!chosen} state={stateFor(opt)}>
                      {opt}
                    </ChoiceButton>
                  ))}
                </motion.div>
              )}
            </div>
          </div>
        )}

        {/* tempo 1: a frase sozinha, grande, no centro, como se fosse digitada */}
        {stage === 'big' && (
          <div className="flex flex-1 items-center justify-center">
            <motion.div layoutId="kennedy" className="px-2 text-center">
              <Typewriter
                lines={[{ text: 'amor, esse é o John Kennedy' }]}
                speed={46}
                className="font-display text-3xl font-semibold leading-snug text-white"
                onDone={() => {
                  if (bigDone.current) return;
                  bigDone.current = true;
                  // pausa de 1.5s; shown=1 no mesmo commit para o morph
                  // do layoutId não perder o elemento por um frame
                  setTimeout(() => {
                    setShown(1);
                    setStage('convo');
                  }, 1500);
                }}
              />
            </motion.div>
          </div>
        )}

        {/* tempo 2: o contexto completo */}
        {stage === 'convo' && (
          <div className="flex flex-1 flex-col justify-end gap-2 pb-2">
            {convo.map((m, i) => {
              if (i < convo.length - shown) return null;
              const isLast = i === convo.length - 1;
              const pedro = m.sender === 'Pedro';
              const bubble = pedro
                ? 'self-end rounded-tr-md bg-[#005c4b] text-white'
                : 'self-start rounded-tl-md bg-[#202c33] text-white';
              const highlight = m.highlight
                ? '!border-rose-400/80 !bg-rose-500/20 shadow-[0_0_22px_rgba(244,114,182,0.3)]'
                : '';
              const kennedy = isLast
                ? '!border-gold/70 !bg-gold/10 shadow-[0_0_18px_rgba(232,185,74,0.25)]'
                : '';
              return (
                <motion.div
                  key={i}
                  layoutId={isLast ? 'kennedy' : undefined}
                  initial={isLast ? false : { opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.35 }}
                  className={`max-w-[80%] rounded-2xl border border-transparent px-4 py-2.5 shadow ${bubble} ${highlight} ${kennedy}`}
                >
                  <span className={m.highlight ? 'font-display text-xl font-bold text-rose-200' : 'text-[15px]'}>
                    {m.text}
                  </span>
                  <span className="ml-2 align-bottom text-[10px] text-white/35">{m.time}</span>
                </motion.div>
              );
            })}

            <div className="min-h-[30px] pt-3 text-center">
              {caption && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-sm italic text-white/55"
                >
                  Te amou e seguiu a explicação tática sem pausar. 😂
                </motion.div>
              )}
            </div>
            <div className="h-12 pt-1">{btn && <ContinueButton onClick={onDone} />}</div>
          </div>
        )}
      </div>
    </LayoutGroup>
  );
}
