import { useEffect, useMemo, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import useSounds, { startTrivia, stopTrivia } from '../hooks/useSounds';
import { ChoiceButton, ContinueButton } from './shared/ui';
import { DATA, mesLabel } from '../data/data';

// [02] CAP 2 — O COMEÇO
// Parte 1: conversa estilo WhatsApp → Parte 2: vídeo → Parte 3: modal
// de trivia sobre o vídeo → Parte 4: gráfico de divergência central
export default function Cap02_Comeco({ onNext }) {
  const [phase, setPhase] = useState('chat'); // chat | video | chart
  return (
    <div className="relative h-full overflow-hidden">
      <AnimatePresence mode="wait">
        {phase === 'chat' && (
          <motion.div key="chat" className="h-full" exit={{ opacity: 0 }} transition={{ duration: 0.7 }}>
            <ChatIntro onDone={() => setPhase('video')} />
          </motion.div>
        )}
        {phase === 'video' && (
          <motion.div
            key="video"
            className="h-full"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.7 }}
          >
            <VideoPart onDone={() => setPhase('chart')} />
          </motion.div>
        )}
        {phase === 'chart' && (
          <motion.div
            key="chart"
            className="h-full"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
          >
            <DivergenceChart onNext={onNext} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Parte 1 — conversa animada estilo WhatsApp
// ─────────────────────────────────────────────────────────────

const SCRIPT = [
  { from: 'pedro', text: 'chego dia 16' },
  { from: 'laura', text: 'vamo sair dia 17?' },
  { from: 'pedro', text: 'vamos', ticks: true },
];

function ChatIntro({ onDone }) {
  const s = useSounds();
  const [shown, setShown] = useState(0); // mensagens já exibidas
  const [typing, setTyping] = useState(null); // lado que está "digitando..."

  useEffect(() => {
    if (shown >= SCRIPT.length) {
      const t = setTimeout(onDone, 1600);
      return () => clearTimeout(t);
    }
    // indicador "digitando..." aparece, e 800ms depois entra a mensagem
    const t1 = setTimeout(() => setTyping(SCRIPT[shown].from), 350);
    const t2 = setTimeout(() => {
      setTyping(null);
      s.bip();
      setShown((n) => n + 1);
    }, 350 + 800);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, [shown]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className="flex h-full flex-col bg-[#0b141a]">
      {/* header do chat */}
      <div className="flex items-center gap-3 bg-[#202c33] px-4 pb-3 pt-[max(env(safe-area-inset-top),12px)]">
        <span className="text-lg text-white/60">‹</span>
        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-rose-400 to-rose-600 font-display text-sm font-bold text-white">
          L
        </div>
        <div>
          <div className="text-[15px] font-medium text-white">Laura</div>
          <div className="text-xs text-emerald-400/80">online</div>
        </div>
      </div>

      {/* mensagens */}
      <div className="flex flex-1 flex-col justify-center gap-2.5 px-4 pb-16">
        {SCRIPT.slice(0, shown).map((m, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 10, scale: 0.92 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ type: 'spring', stiffness: 420, damping: 28 }}
            className={`max-w-[75%] rounded-2xl px-3.5 py-2 text-[15px] leading-snug shadow ${
              m.from === 'pedro'
                ? 'self-end rounded-tr-md bg-[#005c4b] text-white'
                : 'self-start rounded-tl-md bg-[#202c33] text-white'
            }`}
          >
            {m.text}
            {m.ticks && <span className="ml-1.5 text-xs text-[#53bdeb]">✓✓</span>}
          </motion.div>
        ))}

        {typing && (
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            className={`flex gap-1.5 rounded-2xl px-4 py-3 ${
              typing === 'pedro' ? 'self-end rounded-tr-md bg-[#005c4b]' : 'self-start rounded-tl-md bg-[#202c33]'
            }`}
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
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Partes 2 e 3 — vídeo + 2 perguntas em modal de trivia
// ─────────────────────────────────────────────────────────────

const VIDEO_QS = [
  {
    q: 'Nas primeiras semanas, quem mandou mais mensagem?',
    opts: ['Pedro', 'Laura'],
    correct: 'Pedro',
    note: 'Foi o Pedro — desde o início. 😏',
    noteOnWrongOnly: true,
  },
  {
    q: 'E no Instagram? Nos primeiros 3 meses, quem mandava mais reels?',
    opts: ['Pedro', 'Laura', 'Praticamente igual'],
    correct: 'Laura',
  },
];

function VideoPart({ onDone }) {
  const s = useSounds();
  const videoRef = useRef(null);
  const [modal, setModal] = useState(false);
  const [answer, setAnswer] = useState(null);
  const [qi, setQi] = useState(0); // 0 = mensagens, 1 = reels
  const [videoOk, setVideoOk] = useState(true);
  const [showSkip, setShowSkip] = useState(false);
  const videoOkRef = useRef(true);
  const modalDoneRef = useRef(false);
  const openedRef = useRef(false);
  const doneRef = useRef(false);
  const timers = useRef([]);

  const later = (fn, ms) => timers.current.push(setTimeout(fn, ms));
  const finish = () => {
    if (doneRef.current) return;
    doneRef.current = true;
    onDone();
  };

  useEffect(() => {
    // tenta tocar com som (já houve interação); se bloquear, toca mudo
    const v = videoRef.current;
    if (v) {
      v.play().catch(() => {
        v.muted = true;
        v.play().catch(() => onVideoError());
      });
    }
    return () => {
      timers.current.forEach(clearTimeout);
      stopTrivia();
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // o modal aparece depois de alguns segundos, pausando o vídeo
  useEffect(() => {
    const t = setTimeout(() => {
      if (openedRef.current) return;
      openedRef.current = true;
      videoRef.current?.pause();
      setModal(true);
      startTrivia(); // melodia em loop enquanto o modal está aberto
    }, videoOk ? 4000 : 2600);
    return () => clearTimeout(t);
  }, [videoOk]);

  const onVideoError = () => {
    videoOkRef.current = false;
    setVideoOk(false);
    if (modalDoneRef.current) later(finish, 1500);
  };

  const closeModal = () => {
    setModal(false);
    modalDoneRef.current = true;
    const v = videoRef.current;
    if (videoOkRef.current && v) {
      v.play().catch(() => {});
      later(() => setShowSkip(true), 8000); // fallback caso "ended" não dispare
    } else {
      later(finish, 1800);
    }
  };

  const pick = (who) => {
    if (answer) return;
    const cur = VIDEO_QS[qi];
    setAnswer(who);
    stopTrivia();
    const correct = who === cur.correct;
    correct ? s.acerto() : s.erro();
    later(() => {
      if (qi < VIDEO_QS.length - 1) {
        setQi((n) => n + 1); // avança pra pergunta dos reels
        setAnswer(null);
        startTrivia();
      } else {
        closeModal(); // respondeu as duas → segue pro gráfico
      }
    }, correct ? 1100 : 2400);
  };

  return (
    <div className="relative h-full bg-black">
      {videoOk ? (
        /* vídeo do primeiro encontro — public/videos/IMG_1971.mov */
        <video
          ref={videoRef}
          src={`${import.meta.env.BASE_URL}videos/IMG_1971.mov`}
          className="absolute inset-0 h-full w-full object-cover"
          playsInline
          autoPlay
          preload="auto"
          onEnded={finish}
          onError={onVideoError}
        />
      ) : (
        // visual de fallback enquanto o vídeo não foi adicionado ao projeto
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-gradient-to-br from-[#1b1026] via-[#0d1b2a] to-[#0a0a0a]">
          <motion.div
            animate={{ scale: [1, 1.12, 1] }}
            transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
            className="text-5xl"
          >
            🎬
          </motion.div>
          <div className="px-10 text-center font-mono text-[11px] leading-relaxed text-white/30">
            [ vídeo entra aqui — public/videos/IMG_1971.mov ]
          </div>
        </div>
      )}

      {showSkip && !modal && (
        <div className="absolute inset-x-0 bottom-8 flex justify-center">
          <ContinueButton label="continuar →" onClick={finish} className="bg-black/40 backdrop-blur" />
        </div>
      )}

      {/* Parte 3 — modal com blur, pausando o vídeo */}
      <AnimatePresence>
        {modal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="absolute inset-0 z-20 flex items-center justify-center bg-black/60 px-6 backdrop-blur-md"
          >
            <motion.div
              initial={{ scale: 0.88, y: 18 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.92, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 320, damping: 26 }}
              className="w-full max-w-sm rounded-3xl border border-white/10 bg-[#131313] p-6 shadow-2xl"
            >
              <div className="mb-1 text-center font-mono text-[10px] tracking-[0.25em] text-white/30">
                {qi + 1}/{VIDEO_QS.length}
              </div>
              <div className="mb-5 text-center font-display text-lg font-medium leading-snug text-white">
                {VIDEO_QS[qi].q}
              </div>
              <div className="space-y-2.5">
                {VIDEO_QS[qi].opts.map((opt) => (
                  <ChoiceButton
                    key={opt}
                    onClick={() => pick(opt)}
                    disabled={!!answer}
                    state={
                      !answer
                        ? 'idle'
                        : opt === VIDEO_QS[qi].correct
                          ? answer === opt
                            ? 'right'
                            : 'reveal'
                          : answer === opt
                            ? 'wrong'
                            : 'dim'
                    }
                  >
                    {opt}
                  </ChoiceButton>
                ))}
              </div>
              {answer &&
                VIDEO_QS[qi].note &&
                (VIDEO_QS[qi].noteOnWrongOnly ? answer !== VIDEO_QS[qi].correct : true) && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="mt-4 text-center text-sm leading-relaxed text-white/60"
                  >
                    {VIDEO_QS[qi].note}
                  </motion.div>
                )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Parte 4 — gráfico de divergência central
// valor = ((pedro - laura) / (pedro + laura)) * 100
// positivo = Pedro na frente / negativo = Laura na frente
// ─────────────────────────────────────────────────────────────

const METRICAS = [
  { id: 'mensagens', label: 'Mensagens', cor: '#e879a0', data: DATA.monthly_messages },
  { id: 'reels', label: 'Reels', cor: '#60a5fa', data: DATA.instagram.monthly_reels },
  { id: 'audios', label: 'Áudios', cor: '#34d399', data: DATA.monthly_audios },
  { id: 'conversas', label: 'Iniciou conv.', cor: '#fbbf24', data: DATA.monthly_iniciacoes },
];

// geometria do SVG
const W = 360;
const H = 320;
const PAD_L = 16;
const PAD_R = 78;
const PAD_T = 36;
const PAD_B = 34;
const INNER_W = W - PAD_L - PAD_R;
const INNER_H = H - PAD_T - PAD_B;
const DOMAIN = 60; // eixo Y vai de -60% a +60%

const div = (p, l) => (p + l === 0 ? 0 : ((p - l) / (p + l)) * 100);

function smoothPath(pts) {
  if (!pts.length) return '';
  const r = (n) => Math.round(n * 10) / 10;
  let d = `M ${r(pts[0][0])} ${r(pts[0][1])}`;
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[i - 1] || pts[i];
    const p1 = pts[i];
    const p2 = pts[i + 1];
    const p3 = pts[i + 2] || p2;
    d += ` C ${r(p1[0] + (p2[0] - p0[0]) / 6)} ${r(p1[1] + (p2[1] - p0[1]) / 6)}, ${r(
      p2[0] - (p3[0] - p1[0]) / 6,
    )} ${r(p2[1] - (p3[1] - p1[1]) / 6)}, ${r(p2[0])} ${r(p2[1])}`;
  }
  return d;
}

// afasta labels que ficariam sobrepostos na ponta direita
function spreadLabels(items, minGap = 12) {
  const sorted = [...items].sort((a, b) => a.y - b.y);
  for (let i = 1; i < sorted.length; i++) {
    if (sorted[i].y - sorted[i - 1].y < minGap) sorted[i].y = sorted[i - 1].y + minGap;
  }
  return sorted;
}

function DivergenceChart({ onNext }) {
  const s = useSounds();
  // 0 eixos → 1 curvas dinâmicas → 2 linhas estáticas → 3 reveal → 4 botão
  const [step, setStep] = useState(0);
  const [tip, setTip] = useState(null);
  const [sel, setSel] = useState(null); // id da curva selecionada
  const svgRef = useRef(null);
  const scrubbing = useRef(false);

  const months = useMemo(() => Object.keys(DATA.monthly_messages), []);
  const x = (i) => PAD_L + (i / (months.length - 1)) * INNER_W;
  const y = (v) => PAD_T + (1 - (v + DOMAIN) / (2 * DOMAIN)) * INNER_H;
  const y0 = y(0);

  const { dynamics, cross, endLabels } = useMemo(() => {
    const dynamics = METRICAS.map((m) => {
      const vals = months.map((k) => div(m.data[k].pedro, m.data[k].laura));
      vals[0] = 0; // todas as 4 curvas começam forçadamente em 0% no primeiro ponto
      return {
        ...m,
        vals,
        pts: vals.map((v, i) => [x(i), y(v)]),
        raw: months.map((k) => m.data[k]),
      };
    });

    // ponto onde os reels cruzam o zero (Laura → Pedro na frente)
    const reels = dynamics.find((d) => d.id === 'reels');
    let cross = null;
    for (let i = 1; i < reels.vals.length; i++) {
      if (reels.vals[i - 1] < 0 && reels.vals[i] >= 0) {
        const t = -reels.vals[i - 1] / (reels.vals[i] - reels.vals[i - 1]);
        cross = { cx: x(i - 1) + t * (x(i) - x(i - 1)), cy: y0 };
        break;
      }
    }

    const endLabels = spreadLabels(
      dynamics.map((d) => ({ label: d.label, cor: d.cor, y: d.pts[d.pts.length - 1][1] })),
    );

    return { dynamics, cross, endLabels };
  }, [months]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    const ts = [
      setTimeout(() => setStep(1), 1000), // as 4 curvas começam a se desenhar
      setTimeout(() => {
        setStep(3); // pausa de 1s após as curvas → reveal
        s.chime();
      }, 1000 + 5700 + 1000),
      setTimeout(() => setStep(4), 1000 + 5700 + 1000 + 900),
    ];
    return () => ts.forEach(clearTimeout);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // tooltip some sozinho
  useEffect(() => {
    if (!tip) return;
    const t = setTimeout(() => setTip(null), 3500);
    return () => clearTimeout(t);
  }, [tip]);

  // ── interação: toca numa curva pra selecioná-la; arrasta na horizontal
  //    pra navegar pelas datas dessa curva (tooltip), sem afetar as outras.
  const svgXY = (e) => {
    const r = svgRef.current.getBoundingClientRect();
    return {
      sx: ((e.clientX - r.left) / r.width) * W,
      sy: ((e.clientY - r.top) / r.height) * H,
    };
  };
  const idxFromX = (sx) =>
    Math.min(Math.max(Math.round(((sx - PAD_L) / INNER_W) * (months.length - 1)), 0), months.length - 1);
  const showTip = (d, i) =>
    setTip({
      px: d.pts[i][0],
      py: d.pts[i][1],
      cor: d.cor,
      label: d.label,
      month: mesLabel(months[i], true),
      pedro: d.raw[i].pedro,
      laura: d.raw[i].laura,
    });
  const onPick = (e) => {
    e.stopPropagation();
    const { sx, sy } = svgXY(e);
    const i = idxFromX(sx);
    let best = dynamics[0];
    let bestDist = Infinity;
    for (const d of dynamics) {
      const dist = Math.abs(d.pts[i][1] - sy);
      if (dist < bestDist) {
        bestDist = dist;
        best = d;
      }
    }
    setSel(best.id);
    showTip(best, i);
    scrubbing.current = true;
    e.currentTarget.setPointerCapture?.(e.pointerId);
  };
  const onScrub = (e) => {
    if (!scrubbing.current) return;
    const d = dynamics.find((x) => x.id === sel);
    if (!d) return;
    showTip(d, idxFromX(svgXY(e).sx));
  };
  const endScrub = () => {
    scrubbing.current = false;
  };

  const xTicks = [0, 3, 6, 9, 12, 15];

  return (
    <div className="flex h-full flex-col items-center justify-center bg-[#0a0a0a] px-3">
      <div className="relative w-full max-w-[440px]">
        <svg ref={svgRef} viewBox={`0 0 ${W} ${H}`} className="w-full">
          {/* grid muito sutil */}
          <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1.2 }}>
            {[40, -40].map((v) => (
              <line key={v} x1={PAD_L} x2={W - PAD_R} y1={y(v)} y2={y(v)} stroke="rgba(255,255,255,0.05)" />
            ))}
            {[0, 4, 8, 12, 16].map((i) => (
              <line key={i} x1={x(i)} x2={x(i)} y1={PAD_T} y2={H - PAD_B} stroke="rgba(255,255,255,0.04)" />
            ))}
          </motion.g>

          {/* eixos finos e brancos */}
          <motion.line
            x1={PAD_L}
            y1={PAD_T}
            x2={PAD_L}
            y2={H - PAD_B}
            stroke="rgba(255,255,255,0.45)"
            strokeWidth="1"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
          />
          <motion.line
            x1={PAD_L}
            y1={y0}
            x2={W - PAD_R}
            y2={y0}
            stroke="rgba(255,255,255,0.45)"
            strokeWidth="1"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 0.8, delay: 0.15, ease: 'easeOut' }}
          />

          {/* labels do eixo Y: 0% no centro, Pedro acima, Laura abaixo */}
          <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7, duration: 0.8 }}>
            <text x={PAD_L + 6} y={PAD_T + 9} fontSize="9" letterSpacing="2" fill="rgba(255,255,255,0.5)">
              PEDRO
            </text>
            <text x={PAD_L + 6} y={H - PAD_B - 4} fontSize="9" letterSpacing="2" fill="rgba(255,255,255,0.5)">
              LAURA
            </text>
            <text x={PAD_L + 6} y={y0 - 5} fontSize="8" fill="rgba(255,255,255,0.35)">
              0%
            </text>
          </motion.g>

          {/* curvas dinâmicas se desenhando da esquerda pra direita.
              A selecionada fica em destaque; as outras esmaecem. */}
          {dynamics.map((d) => {
            const isSel = sel === d.id;
            return (
              <motion.path
                key={d.id}
                d={smoothPath(d.pts)}
                fill="none"
                stroke={d.cor}
                strokeWidth={isSel ? 2.8 : 1.8}
                strokeLinecap="round"
                style={{ filter: `drop-shadow(0 0 3px ${d.cor}55)` }}
                initial={{ pathLength: 0 }}
                animate={{ pathLength: step >= 1 ? 1 : 0, opacity: sel && !isSel ? 0.3 : 1 }}
                transition={{
                  pathLength: { duration: 5.5, ease: 'easeInOut' },
                  opacity: { duration: 0.3 },
                }}
              />
            );
          })}

          {/* reveal: meses no eixo X, labels das curvas, ponto da virada */}
          {step >= 3 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.9 }}>
              {xTicks.map((i) => (
                <text
                  key={i}
                  x={x(i)}
                  y={H - PAD_B + 15}
                  fontSize="8.5"
                  fill="rgba(255,255,255,0.45)"
                  textAnchor="middle"
                >
                  {mesLabel(months[i], i % 12 === 0)}
                </text>
              ))}
              {endLabels.map((l) => (
                <text key={l.label} x={W - PAD_R + 7} y={l.y + 3} fontSize="9" fill={l.cor}>
                  {l.label}
                </text>
              ))}
            </motion.g>
          )}

          {step >= 3 && cross && (
            <g>
              <motion.circle
                cx={cross.cx}
                cy={cross.cy}
                fill="#60a5fa"
                stroke="rgba(255,255,255,0.9)"
                strokeWidth="1"
                initial={{ r: 0 }}
                animate={{ r: [0, 5.5, 3.2] }}
                transition={{ duration: 0.9, delay: 0.4 }}
              />
              <motion.circle
                cx={cross.cx}
                cy={cross.cy}
                r="9"
                fill="none"
                stroke="#60a5fa"
                strokeWidth="1"
                initial={{ opacity: 0 }}
                animate={{ opacity: [0, 0.8, 0] }}
                transition={{ duration: 1.6, delay: 0.5, repeat: 2 }}
              />
              <motion.text
                x={cross.cx + 8}
                y={cross.cy - 9}
                fontSize="8.5"
                fontStyle="italic"
                fill="rgba(255,255,255,0.72)"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.9, duration: 0.8 }}
              >
                aqui ele assumiu
              </motion.text>
            </g>
          )}

          {/* destaque do ponto sob o dedo na curva selecionada */}
          {tip && <circle cx={tip.px} cy={tip.py} r="3.5" fill={tip.cor} stroke="white" strokeWidth="1" />}

          {/* camada de interação: toca numa curva pra selecioná-la e
              arrasta na horizontal pra percorrer as datas dela */}
          {step >= 3 && (
            <rect
              x={PAD_L}
              y={PAD_T}
              width={INNER_W}
              height={INNER_H}
              fill="transparent"
              style={{ pointerEvents: 'all', touchAction: 'none' }}
              onPointerDown={onPick}
              onPointerMove={onScrub}
              onPointerUp={endScrub}
              onPointerCancel={endScrub}
            />
          )}
        </svg>

        {/* tooltip minimalista */}
        <AnimatePresence>
          {tip && (
            <motion.div
              initial={{ opacity: 0, x: '-50%', y: '-112%' }}
              animate={{ opacity: 1, x: '-50%', y: '-118%' }}
              exit={{ opacity: 0 }}
              className="pointer-events-none absolute z-10 rounded-lg border border-white/10 bg-[#161616] px-2.5 py-1.5 text-[11px] shadow-xl"
              style={{
                left: `${(Math.min(Math.max(tip.px, 52), W - 52) / W) * 100}%`,
                top: `${(tip.py / H) * 100}%`,
              }}
            >
              <div className="flex items-center gap-1.5 text-white/55">
                <span className="inline-block h-1.5 w-1.5 rounded-full" style={{ background: tip.cor }} />
                {tip.month} · {tip.label}
              </div>
              <div className="mt-0.5 whitespace-nowrap text-white/90">
                Pedro {tip.pedro} · Laura {tip.laura}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="mt-7 h-12">
        {step >= 4 && <ContinueButton onClick={onNext} delay={0.1} />}
      </div>
    </div>
  );
}
