import { useEffect, useMemo, useState } from 'react';
import { AnimatePresence, LayoutGroup, motion } from 'framer-motion';
import Typewriter from './shared/Typewriter';
import useSounds from '../hooks/useSounds';
import { ChoiceButton, ContinueButton, FloatingHearts, Overline } from './shared/ui';
import { DATA } from '../data/data';

// [03] CAP 3 — "VOCÊ ME CONHECE?"
// 2 etapas de jogos: quem disse isso? → "eu te amo" primeiro online +
// o que veio depois (fluxo único, sem botão entre eles)
export default function Cap03_Conhece({ onNext }) {
  const [stage, setStage] = useState('intro');

  const stages = {
    intro: <Intro onDone={() => setStage('g1')} />,
    g1: <Game1 onDone={() => setStage('g23')} />,
    g23: <Game23 onDone={onNext} />,
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
  // 3 botões sempre: quando a resposta é um famoso, ela vira o terceiro botão
  const options = ['Pedro', 'Laura', r.decoy ?? r.resposta];

  const pick = (opt) => {
    if (chosen) return;
    setChosen(opt);
    if (opt === r.resposta) {
      setScore((n) => n + 1);
      s.acerto();
    } else {
      s.erro();
    }
    setTimeout(() => setShowCtx(true), 550);
  };

  // não avança sozinho — só com toque, depois do contexto revelado
  const advance = () => {
    if (!chosen || !showCtx) return;
    if (round < rounds.length - 1) {
      setRound((n) => n + 1);
      setChosen(null);
      setShowCtx(false);
    } else {
      setFinished(true);
    }
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
                <div className="text-sm italic leading-relaxed text-white/55">{r.contexto}</div>
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.6 }}
                  className="pt-1 font-mono text-[11px] tracking-widest text-white/30"
                >
                  toque para continuar
                </motion.div>
              </motion.div>
            )}
          </div>
        </motion.div>
      </AnimatePresence>

      {/* toque em qualquer lugar avança (só depois do contexto revelado) */}
      {showCtx && <button aria-label="continuar" onClick={advance} className="absolute inset-0 z-10" />}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// JOGOS 3.2 + 3.3 — "eu te amo" primeiro online → o que veio depois
// (fluxo único: o reveal do TE AMO já emenda na pergunta do 3.3)
// ─────────────────────────────────────────────────────────────

const G3_OPTIONS = [
  'tb to adorando namorar você',
  'amor, esse é o John Kennedy', // a correta da história — mas aqui qualquer clique leva a ela
  'boa noite gatinho',
  'ce me faz feliz demais',
];

function ChatBubble({ m }) {
  const pedro = m.sender === 'Pedro';
  const teAmo = m.highlight; // "TE AMO"
  const kennedy = m.text.startsWith('amor esse é o John');
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className={`max-w-[80%] rounded-2xl border border-transparent px-4 py-2.5 shadow ${
        pedro ? 'self-end rounded-tr-md bg-[#005c4b] text-white' : 'self-start rounded-tl-md bg-[#202c33] text-white'
      } ${teAmo ? '!border-rose-400/80 !bg-rose-500/20 shadow-[0_0_22px_rgba(244,114,182,0.3)]' : ''} ${
        kennedy ? '!border-gold/70 !bg-gold/10 shadow-[0_0_18px_rgba(232,185,74,0.25)]' : ''
      }`}
    >
      <span className={teAmo ? 'font-display text-xl font-bold tracking-wide text-rose-200' : 'text-[15px]'}>
        {m.text}
      </span>
      <span className="ml-2 align-bottom text-[10px] text-white/35">{m.time}</span>
    </motion.div>
  );
}

function Game23({ onDone }) {
  const s = useSounds();
  const convo = DATA.te_amo.conversation;
  const [phase, setPhase] = useState('q1'); // q1 | wrong | reveal
  const [chosen, setChosen] = useState(null);

  // sub-estados do reveal
  const [bubbles, setBubbles] = useState(0); // KKKK, TE AMO
  const [caption, setCaption] = useState(false);
  const [showG3, setShowG3] = useState(false);
  const [picked, setPicked] = useState(false);
  const [typing, setTyping] = useState(false);
  const [kennedy, setKennedy] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [legend, setLegend] = useState(false);
  const [btn, setBtn] = useState(false);

  // ordem aleatória das opções do 3.3
  const g3options = useMemo(
    () => G3_OPTIONS.map((o) => [Math.random(), o]).sort((a, b) => a[0] - b[0]).map(([, o]) => o),
    [],
  );

  const pickTeAmo = (who) => {
    if (chosen) return;
    setChosen(who);
    if (who === 'Laura') {
      s.chime();
      setTimeout(() => setPhase('reveal'), 900);
    } else {
      s.erro();
      setTimeout(() => setPhase('wrong'), 800);
    }
  };

  // reveal: KKKK + TE AMO + legenda → emenda na pergunta do 3.3
  useEffect(() => {
    if (phase !== 'reveal') return;
    const ts = [
      setTimeout(() => setBubbles(1), 400),
      setTimeout(() => setBubbles(2), 1000),
      setTimeout(() => setCaption(true), 1900),
      setTimeout(() => setShowG3(true), 1900 + 1500),
    ];
    return () => ts.forEach(clearTimeout);
  }, [phase]);

  // clique no 3.3: sem feedback de cor — a opção some, "digitando...",
  // e a mensagem do John Kennedy aparece como próxima bolha (sempre)
  const pickG3 = () => {
    if (picked) return;
    setPicked(true);
    setTimeout(() => setTyping(true), 300);
    setTimeout(() => {
      setTyping(false);
      setKennedy(true);
      s.bip();
    }, 300 + 1000);
    setTimeout(() => setExpanded(true), 300 + 1000 + 700); // conversa expande pra cima
    setTimeout(() => setLegend(true), 300 + 1000 + 700 + 1000);
    setTimeout(() => setBtn(true), 300 + 1000 + 700 + 1000 + 1500);
  };

  if (phase === 'q1') {
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
              onClick={() => pickTeAmo(who)}
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

  if (phase === 'wrong') {
    return (
      <div className="flex h-full flex-col items-center justify-center gap-6 px-8 text-center">
        <div className="text-4xl">🔴</div>
        <div className="font-display text-2xl font-medium text-white">Quase. Mas não foi dessa vez.</div>
        <ContinueButton
          label="Tentar de novo"
          delay={0.4}
          onClick={() => {
            setChosen(null);
            setPhase('q1');
          }}
        />
      </div>
    );
  }

  // ── reveal: chat que cresce ──
  const indices = [];
  if (expanded) indices.push(0, 1, 2); // contexto que aparece quando expande pra cima
  if (bubbles >= 1) indices.push(3); // KKKK
  if (bubbles >= 2) indices.push(4); // TE AMO
  if (kennedy) indices.push(5); // amor esse é o John Kennedy

  return (
    <div className="relative flex h-full flex-col px-6 pb-6 pt-14">
      <Overline className="absolute left-6 top-7">jogo 2 + 3</Overline>
      {!expanded && <FloatingHearts count={10} />}

      <LayoutGroup>
        <div className="flex flex-1 flex-col justify-center gap-2.5 overflow-y-auto">
          {indices.map((i) => (
            <ChatBubble key={i} m={convo[i]} />
          ))}

          {caption && !picked && (
            <motion.div
              layout
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="pt-1 text-center text-xs text-white/50"
            >
              {DATA.te_amo.time.replace(':', 'h')} do dia {DATA.te_amo.date}.
            </motion.div>
          )}

          {showG3 && !picked && (
            <motion.div
              layout
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-2.5 pt-3"
            >
              <div className="text-center font-display text-base font-medium text-white/90">
                o que ela mandou logo na sequência?
              </div>
              {g3options.map((opt, i) => (
                <motion.button
                  key={opt}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.12 }}
                  onClick={pickG3}
                  className="w-full rounded-2xl border border-white/15 bg-white/[0.05] px-5 py-3 text-[14px] font-medium text-white/90 transition active:scale-[0.98]"
                >
                  {opt}
                </motion.button>
              ))}
            </motion.div>
          )}

          {typing && (
            <motion.div
              layout
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex w-fit gap-1.5 self-start rounded-2xl rounded-tl-md bg-[#202c33] px-4 py-3"
            >
              {[0, 1, 2].map((d) => (
                <span
                  key={d}
                  className="typing-dot h-1.5 w-1.5 rounded-full bg-white/70"
                  style={{ animationDelay: `${d * 0.18}s` }}
                />
              ))}
            </motion.div>
          )}
        </div>
      </LayoutGroup>

      <div className="min-h-[40px] pt-2 text-center">
        {legend && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-sm italic leading-relaxed text-white/60"
          >
            Te amou por não saber quem era John Kennedy... Isso que é amor de tricolor!
          </motion.div>
        )}
      </div>
      <div className="h-12 pt-1">{btn && <ContinueButton onClick={onDone} />}</div>
    </div>
  );
}
