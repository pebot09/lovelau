import { useEffect, useMemo, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import Typewriter from './shared/Typewriter';
import Carousel, { Media } from './shared/Carousel';
import useSounds from '../hooks/useSounds';
import { ChoiceButton, ContinueButton, Overline } from './shared/ui';
import { FOOD_PHOTOS, LAURA_ASINHA_INDEX, PHOTOS } from '../data/data';

const BASE = import.meta.env.BASE_URL;
const img = (src, note) => ({ type: 'img', src, note });
const vid = (file, note) => ({ type: 'video', src: `${BASE}videos/${file}`, note });

// [05] CAP 5 — ÁLBUM
// Sequência linear de fases: jogo de ordenação → cenas de fotos/vídeos
// com momentos especiais → mini-álbum surpresa gamificado da comida.
const PHASES = [
  'ficantes',
  'grandeDia',
  'mudanca',
  'paraty',
  'namorados',
  'recem',
  'casamento',
  'rtm',
  'modalPrincesa',
  'novembro',
  'reveillon',
  'carnaval',
  'itaipava',
  'shakira',
  'guapimirim',
  'hoje',
  'comida',
];

export default function Cap05_Album({ onNext }) {
  const [pi, setPi] = useState(0);
  const next = () => setPi((n) => Math.min(n + 1, PHASES.length - 1));
  const phase = PHASES[pi];

  const content = {
    ficantes: <FicantesGame onNext={next} />,
    grandeDia: <GrandeDia onDone={next} />,
    mudanca: <Scene items={[img(PHOTOS.IMG_0667)]} caption="a mudança" onNext={next} />,
    paraty: <Scene items={[img(PHOTOS.IMG_0748)]} caption="paraty" onNext={next} />,
    namorados: <Namorados onNext={next} />,
    recem: <RecemNamorados onNext={next} />,
    casamento: <Scene items={[img(PHOTOS.IMG_1431)]} caption="casamento em paraty" onNext={next} />,
    rtm: (
      <Scene
        items={[img(PHOTOS.IMG_2069), img(PHOTOS.IMG_2074)]}
        caption="rock the mountain"
        onNext={next}
      />
    ),
    modalPrincesa: <ModalPrincesa onNext={next} />,
    novembro: (
      <Scene
        items={[
          img(PHOTOS.IMG_2126), // penteado
          /* PLACEHOLDER: vídeo do penteado — public/videos/IMG_2128.mov */
          vid('IMG_2128.mov', '[ vídeo entra aqui — public/videos/IMG_2128.mov ]'),
          img(PHOTOS.IMG_2199), // no clube
        ]}
        caption="novembro"
        onNext={next}
      />
    ),
    reveillon: (
      <Scene
        items={[img(PHOTOS.IMG_2778), img(PHOTOS.IMG_2811), img(PHOTOS.IMG_2903)]}
        caption="réveillon"
        onNext={next}
      />
    ),
    carnaval: (
      <Scene
        items={[img(PHOTOS.IMG_3001), img(PHOTOS.IMG_3081), img(PHOTOS['463C040F']), img(PHOTOS.IMG_3168)]}
        caption="carnaval"
        onNext={next}
      />
    ),
    itaipava: (
      <Scene
        items={[
          img(PHOTOS.IMG_3808), // ela dormindo no colo no carro
          /* PLACEHOLDER: vídeo dela no violão — public/videos/IMG_4006.mov */
          vid('IMG_4006.mov', '[ vídeo entra aqui — public/videos/IMG_4006.mov ]'),
        ]}
        caption="itaipava"
        onNext={next}
      />
    ),
    shakira: (
      <Scene items={[img(PHOTOS.DD5D5531), img(PHOTOS.IMG_4026)]} caption="shakira" onNext={next} />
    ),
    guapimirim: (
      <Scene
        items={[
          img(PHOTOS.IMG_4248),
          /* PLACEHOLDER: vídeo — public/videos/IMG_4158.mov */
          vid('IMG_4158.mov', '[ vídeo entra aqui — public/videos/IMG_4158.mov ]'),
        ]}
        caption="guapimirim"
        onNext={next}
      />
    ),
    hoje: <Hoje onNext={next} />,
    comida: <FoodAlbum onDone={onNext} />,
  }[phase];

  return (
    <div className="relative h-full overflow-hidden bg-[#0a0a0a]">
      {/* Sem exit/mode="wait": a fase anterior desmonta na hora e a nova
          entra com fade. Evita o deadlock do AnimatePresence ao sair do
          jogo de arrastar (que estava deixando a tela preta). */}
      <motion.div
        key={phase}
        className="absolute inset-0"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.55, ease: 'easeInOut' }}
      >
        {content}
      </motion.div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Cena genérica: foto única ou carrossel + legenda + botão "→"
// ─────────────────────────────────────────────────────────────

function ArrowButton({ onClick, delay = 0.8 }) {
  return (
    <motion.button
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay, duration: 0.6 }}
      onClick={onClick}
      className="absolute bottom-6 right-6 z-10 flex h-12 w-12 items-center justify-center rounded-full border border-white/30 bg-black/35 text-lg text-white/90 backdrop-blur transition-transform active:scale-90"
      aria-label="avançar"
    >
      →
    </motion.button>
  );
}

function Scene({ items, caption, gold = false, onNext, btnDelay = 0.8 }) {
  return (
    <div className="relative h-full w-full overflow-hidden bg-black">
      {items.length === 1 ? (
        <Media item={items[0]} fit="contain" />
      ) : (
        <Carousel items={items} fit="contain" />
      )}

      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-black/75 to-transparent" />

      {/* borda dourada sutil pulsando (fase namorados) */}
      {gold && (
        <motion.div
          className="pointer-events-none absolute inset-3 rounded-2xl border-2 border-gold/80"
          animate={{
            opacity: [0.35, 0.9, 0.35],
            boxShadow: [
              '0 0 8px rgba(232,185,74,0.2), inset 0 0 8px rgba(232,185,74,0.12)',
              '0 0 26px rgba(232,185,74,0.5), inset 0 0 18px rgba(232,185,74,0.22)',
              '0 0 8px rgba(232,185,74,0.2), inset 0 0 8px rgba(232,185,74,0.12)',
            ],
          }}
          transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut' }}
        />
      )}

      {caption && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.7 }}
          className="absolute bottom-8 left-6 z-10 font-display text-lg italic text-white/90 drop-shadow"
        >
          {caption}
        </motion.div>
      )}

      <ArrowButton onClick={onNext} delay={btnDelay} />
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// FASE 1 — FICANTES: coloca as 4 fotos em ordem cronológica
// ─────────────────────────────────────────────────────────────

const FIC_FOTOS = [
  { key: 'IMG_2227', src: PHOTOS.IMG_2227 },
  { key: 'IMG_2363', src: PHOTOS.IMG_2363 },
  { key: '22E65995', src: PHOTOS['22E65995'] },
  { key: 'IMG_0008', src: PHOTOS.IMG_0008 },
];

// ordem correta (cronológica)
const FIC_ORDEM = ['IMG_2227', 'IMG_2363', '22E65995', 'IMG_0008'];

function FicantesGame({ onNext }) {
  const s = useSounds();
  const [placed, setPlaced] = useState([null, null, null, null]); // slot → key
  const [wrongSlot, setWrongSlot] = useState(null);
  const [expanded, setExpanded] = useState(null); // src ampliado
  const [victory, setVictory] = useState(false);
  const slotRefs = useRef([]);
  const downPos = useRef({ x: 0, y: 0 }); // posição do pointerdown p/ distinguir tap de arrasto

  // grade embaralhada (estável durante o jogo)
  const shuffled = useMemo(
    () => FIC_FOTOS.map((f) => [Math.random(), f]).sort((a, b) => a[0] - b[0]).map(([, f]) => f),
    [],
  );
  const inGrid = shuffled.filter((f) => !placed.includes(f.key));

  useEffect(() => {
    if (placed.every(Boolean) && !victory) {
      const t = setTimeout(() => {
        setVictory(true);
        s.match();
      }, 350);
      return () => clearTimeout(t);
    }
  }, [placed, victory]); // eslint-disable-line react-hooks/exhaustive-deps

  const onDrop = (foto, point) => {
    for (let i = 0; i < 4; i++) {
      const el = slotRefs.current[i];
      if (!el) continue;
      const r = el.getBoundingClientRect();
      if (point.x >= r.left - 10 && point.x <= r.right + 10 && point.y >= r.top - 14 && point.y <= r.bottom + 14) {
        if (placed[i]) return; // slot ocupado — volta pra grade
        if (FIC_ORDEM[i] === foto.key) {
          s.chime(); // acerto suave
          setPlaced((p) => p.map((v, j) => (j === i ? foto.key : v)));
        } else {
          s.erro();
          setWrongSlot(i);
          setTimeout(() => setWrongSlot(null), 1000); // borda vermelha por 1s
        }
        return;
      }
    }
  };

  return (
    <div className="relative flex h-full flex-col px-5 pb-7 pt-16">
      <div className="absolute inset-x-6 top-7">
        <Overline>álbum</Overline>
        <div className="mt-1 font-mono text-[10px] tracking-wider text-white/30">
          ficantes · arrasta pra ordenar · toca pra ampliar
        </div>
      </div>

      {/* grade 2x2 de fotos embaralhadas */}
      <div className="flex flex-1 items-center justify-center">
        <div className="grid w-full max-w-[330px] grid-cols-2 content-center gap-3">
          {inGrid.map((f) => (
            <motion.div
              key={f.key}
              layout
              drag
              dragSnapToOrigin
              dragMomentum={false}
              whileDrag={{ scale: 1.07, zIndex: 40 }}
              onDragEnd={(_e, info) => onDrop(f, info.point)}
              onPointerDown={(e) => {
                downPos.current = { x: e.clientX, y: e.clientY };
              }}
              onPointerUp={(e) => {
                // só amplia em tela cheia se foi um tap (movimento < 10px), não arrasto
                const dx = e.clientX - downPos.current.x;
                const dy = e.clientY - downPos.current.y;
                if (Math.hypot(dx, dy) < 10) setExpanded(f.src);
              }}
              className="relative cursor-grab touch-none active:cursor-grabbing"
            >
              <img
                src={f.src}
                className="pointer-events-none aspect-[3/4] w-full rounded-xl border border-white/10 bg-black/20 object-contain shadow-lg"
                draggable={false}
                alt=""
              />
              {/* número de posição — começa vazio */}
              <div className="mx-auto mt-1.5 h-5 w-5 rounded-full border border-dashed border-white/25" />
            </motion.div>
          ))}
        </div>
      </div>

      {/* slots numerados 1–4 */}
      <motion.div
        animate={victory ? { scale: [1, 1.05, 1] } : {}}
        transition={{ duration: 0.7 }}
        className="flex items-start justify-center gap-2.5"
      >
        {FIC_ORDEM.map((key, i) => {
          const foto = FIC_FOTOS.find((f) => f.key === placed[i]);
          const border = wrongSlot === i
            ? 'border-red-400 shadow-[0_0_14px_rgba(248,113,113,0.5)]'
            : foto
              ? 'border-emerald-400/90 shadow-[0_0_12px_rgba(52,211,153,0.35)]'
              : 'border-dashed border-white/25';
          return (
            <div key={i} className="w-[21%] max-w-[84px]">
              <div
                ref={(el) => (slotRefs.current[i] = el)}
                className={`aspect-[3/4] overflow-hidden rounded-lg border-2 bg-white/[0.03] transition-colors ${border} ${
                  victory ? '!border-gold/80' : ''
                }`}
              >
                {foto && (
                  <motion.img
                    src={foto.src}
                    initial={{ scale: 1.25, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="h-full w-full cursor-pointer object-contain"
                    onClick={() => setExpanded(foto.src)}
                    draggable={false}
                    alt=""
                  />
                )}
              </div>
              <div className="mt-1 text-center font-mono text-xs text-white/50">{i + 1}</div>
            </div>
          );
        })}
      </motion.div>

      <div className="mt-4 h-11">
        {victory && <ContinueButton label="Ver fase →" onClick={onNext} delay={0.5} />}
      </div>

      {/* foto ampliada em tela cheia */}
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={() => setExpanded(null)}
            className="absolute inset-0 z-50 flex items-center justify-center bg-black/95 p-4"
          >
            <motion.img
              src={expanded}
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.85 }}
              className="max-h-full max-w-full rounded-xl object-contain"
              alt=""
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// O GRANDE DIA — texto palavra por palavra, sem foto
// ─────────────────────────────────────────────────────────────

function GrandeDia({ onDone }) {
  const words = 'um dia de fortes emoções...'.split(' ');
  const typed = words.length * 450 + 900;
  const [out, setOut] = useState(false);

  useEffect(() => {
    const t1 = setTimeout(() => setOut(true), typed + 3000); // permanece 3s
    const t2 = setTimeout(onDone, typed + 3000 + 850);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <motion.div
      animate={{ opacity: out ? 0 : 1 }}
      transition={{ duration: 0.8 }}
      className="relative h-full w-full overflow-hidden bg-black"
    >
      {/* IMG_0500 ao fundo (inteira, sem corte) com escurecido pra leitura */}
      <Media item={img(PHOTOS.IMG_0500)} fit="contain" />
      <div className="pointer-events-none absolute inset-0 bg-black/60" />
      <div className="absolute inset-0 flex items-center justify-center px-10">
        <div className="text-center font-display text-2xl font-light italic leading-relaxed text-white drop-shadow-[0_2px_14px_rgba(0,0,0,0.95)]">
          {words.map((w, i) => (
            <motion.span
              key={i}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 + i * 0.45, duration: 0.8 }}
              className="mr-2 inline-block"
            >
              {w}
            </motion.span>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

// ─────────────────────────────────────────────────────────────
// NAMORADOS — data escrita → foto com borda dourada pulsando
// ─────────────────────────────────────────────────────────────

function Namorados({ onNext }) {
  const [sub, setSub] = useState('date');

  return (
    <AnimatePresence mode="wait">
      {sub === 'date' ? (
        <motion.div
          key="date"
          className="flex h-full items-center justify-center px-8"
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8 }}
        >
          <Typewriter
            lines={[{ text: '15 de junho de 2025' }]}
            speed={62}
            className="text-center font-display text-3xl font-light tracking-wide text-white"
            onDone={() => setTimeout(() => setSub('photo'), 2000)}
          />
        </motion.div>
      ) : (
        <motion.div
          key="photo"
          className="h-full"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.9 }}
        >
          {/* sem legenda — a foto fala por si */}
          <Scene items={[img(PHOTOS.IMG_0774)]} gold onNext={onNext} btnDelay={1.4} />
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// ─────────────────────────────────────────────────────────────
// RECÉM-NAMORADOS — adivinhe onde foi (2 fotos com zoom)
// ─────────────────────────────────────────────────────────────

const GUESS = [
  {
    src: PHOTOS.IMG_1074,
    q: 'Onde foi essa foto?',
    options: ['Marina da Glória', 'Vivo Rio', 'Arena Jockey', 'Aterro do Flamengo'],
    correct: 'Marina da Glória',
  },
  {
    src: PHOTOS.IMG_1236,
    q: 'E essa?',
    options: ['MAM', 'BCO', 'Rua Moraes e Vale', 'CCBB'],
    correct: 'MAM',
  },
];

function GuessWhere({ cfg, onDone }) {
  const s = useSounds();
  const [chosen, setChosen] = useState(null);
  const [showBtn, setShowBtn] = useState(false);

  const pick = (opt) => {
    if (chosen) return;
    setChosen(opt);
    opt === cfg.correct ? s.acerto() : s.erro();
    setTimeout(() => setShowBtn(true), 1700);
  };

  const frame = !chosen
    ? 'border-white/12'
    : chosen === cfg.correct
      ? 'border-emerald-400/90 shadow-[0_0_22px_rgba(52,211,153,0.35)]'
      : 'border-red-400/90 shadow-[0_0_22px_rgba(248,113,113,0.35)]';

  const stateFor = (opt) => {
    if (!chosen) return 'idle';
    if (opt === chosen) return opt === cfg.correct ? 'right' : 'wrong';
    if (opt === cfg.correct) return 'reveal'; // mostra a resposta certa
    return 'dim';
  };

  return (
    <div className="mx-auto flex h-full max-w-md flex-col justify-center gap-5 px-6">
      <div className={`relative h-[40vh] overflow-hidden rounded-2xl border-2 transition-colors ${frame}`}>
        {/* foto inteira e limpa desde o início (sem zoom/desfoque) */}
        <img
          src={cfg.src}
          className="h-full w-full bg-black/20 object-contain"
          draggable={false}
          alt=""
        />
      </div>

      <div className="text-center font-display text-lg font-medium text-white">{cfg.q}</div>

      <div className="grid grid-cols-2 gap-2">
        {cfg.options.map((opt) => (
          <ChoiceButton
            key={opt}
            onClick={() => pick(opt)}
            disabled={!!chosen}
            state={stateFor(opt)}
            className="!px-2 !py-3 !text-[13px]"
          >
            {opt}
          </ChoiceButton>
        ))}
      </div>

      <div className="h-11">{showBtn && <ContinueButton label="→" onClick={onDone} className="!px-10" />}</div>
    </div>
  );
}

function RecemNamorados({ onNext }) {
  const [qi, setQi] = useState(0);
  return (
    <div className="relative h-full pt-10">
      <Overline className="absolute left-6 top-7">recém-namorados · adivinhe onde foi</Overline>
      <AnimatePresence mode="wait">
        <motion.div
          key={qi}
          className="h-full"
          initial={{ opacity: 0, x: 24 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -24 }}
          transition={{ duration: 0.45 }}
        >
          <GuessWhere cfg={GUESS[qi]} onDone={() => (qi === 0 ? setQi(1) : onNext())} />
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// MODAL — ANTES DE NOVEMBRO: "Você quer tratamento de princesa?"
// ─────────────────────────────────────────────────────────────

function ModalPrincesa({ onNext }) {
  const s = useSounds();
  const [picked, setPicked] = useState(null);

  const pick = (opt) => {
    if (picked) return;
    setPicked(opt);
    if (opt === 'Sim') {
      s.chime();
      setTimeout(onNext, 600);
    } else {
      s.buzzer();
      setTimeout(onNext, 1500); // "vai ter mesmo assim" → pausa 1.5s
    }
  };

  return (
    <div className="flex h-full items-center justify-center bg-black px-6">
      <motion.div
        initial={{ opacity: 0, scale: 0.88, y: 16 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ delay: 0.35, type: 'spring', stiffness: 300, damping: 24 }}
        className="w-full max-w-sm rounded-3xl border border-white/10 bg-[#131313] p-6 shadow-2xl"
      >
        <div className="mb-5 text-center font-display text-lg font-medium text-white">
          Você quer tratamento de princesa?
        </div>
        <div className="grid grid-cols-2 gap-2.5">
          {['Sim', 'Não'].map((opt) => (
            <ChoiceButton
              key={opt}
              onClick={() => pick(opt)}
              disabled={!!picked}
              state={picked === opt ? (opt === 'Sim' ? 'right' : 'wrong') : picked ? 'dim' : 'idle'}
            >
              {opt}
            </ChoiceButton>
          ))}
        </div>
        <div className="mt-4 h-6 text-center">
          {picked === 'Não' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-sm italic text-rose-200/90"
            >
              vai ter mesmo assim
            </motion.div>
          )}
        </div>
      </motion.div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// HOJE — foto em tela cheia, "hoje" aparece aos 3s, botão aos 5s
// ─────────────────────────────────────────────────────────────

function Hoje({ onNext }) {
  const [cap, setCap] = useState(false);
  const [btn, setBtn] = useState(false);

  useEffect(() => {
    const t1 = setTimeout(() => setCap(true), 3000);
    const t2 = setTimeout(() => setBtn(true), 5000);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, []);

  return (
    <div className="relative h-full w-full overflow-hidden bg-black">
      <Media item={img(PHOTOS.IMG_4637)} fit="contain" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-36 bg-gradient-to-t from-black/75 to-transparent" />
      {cap && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.1 }}
          className="absolute bottom-9 left-6 font-display text-xl italic text-white/95 drop-shadow"
        >
          hoje
        </motion.div>
      )}
      {btn && (
        <div className="absolute inset-x-0 bottom-7 flex justify-center">
          <ContinueButton onClick={onNext} className="bg-black/35 backdrop-blur" />
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// MINI-ÁLBUM SURPRESA — "só pra lembrar que a gente adora comer"
// 27 fotos, toque avança; barrinha gamificada do franguinho 🍗
// ─────────────────────────────────────────────────────────────

const FOOD_EMOJIS = ['🍕', '🍣', '🍔', '🍝', '🍤', '🥟', '🌮', '🍦', '🥩', '🍟', '🧀', '🍫'];

function FoodAlbum({ onDone }) {
  const s = useSounds();
  const [stage, setStage] = useState('text'); // text | album
  const [i, setI] = useState(0); // foto atual
  const [p, setP] = useState(0); // progresso 0..1
  const [win, setWin] = useState(false);
  const winRef = useRef(false);
  const lastTap = useRef(0);
  const trackRef = useRef(null);
  const [trackW, setTrackW] = useState(0);

  useEffect(() => {
    const t = setTimeout(() => setStage('album'), 2700); // pausa de 2s + fade
    return () => clearTimeout(t);
  }, []);

  // mede a barra (pro franguinho andar em px)
  useEffect(() => {
    if (stage !== 'album') return;
    const measure = () => trackRef.current && setTrackW(trackRef.current.offsetWidth);
    measure();
    window.addEventListener('resize', measure);
    return () => window.removeEventListener('resize', measure);
  }, [stage]);

  // parar de clicar por mais de 0.8s: a barra diminui, o franguinho recua
  useEffect(() => {
    if (stage !== 'album' || win) return;
    let raf;
    let prev = performance.now();
    const loop = (t) => {
      const dt = (t - prev) / 1000;
      prev = t;
      if (t - lastTap.current > 180) setP((v) => (v > 0 ? Math.max(0, v - dt * 1.8) : v));
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [stage, win]);

  // barra cheia → vitória
  useEffect(() => {
    if (p >= 1 && !winRef.current) {
      winRef.current = true;
      setWin(true);
      s.match();
    }
  }, [p]); // eslint-disable-line react-hooks/exhaustive-deps

  const tap = () => {
    if (winRef.current || stage !== 'album') return;
    lastTap.current = performance.now();
    s.bip();
    setI((n) => (n + 1) % FOOD_PHOTOS.length); // toque avança a foto
    setP((v) => Math.min(1, v + 0.028)); // nível hard: ritmo alto obrigatório
  };

  if (stage === 'text') {
    return (
      <div className="flex h-full items-center justify-center bg-black px-10">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
          className="text-center font-display text-xl italic leading-relaxed text-white/90"
        >
          só pra lembrar que a gente adora comer
        </motion.div>
      </div>
    );
  }

  const chickenX = (1 - p) * Math.max(trackW - 24, 0);

  return (
    <div className="relative h-full w-full overflow-hidden bg-black" onPointerDown={tap}>
      {/* foto de comida atual — sem data, sem legenda, sem numeração */}
      <motion.div key={i} initial={{ opacity: 0.45 }} animate={{ opacity: 1 }} transition={{ duration: 0.14 }} className="absolute inset-0">
        <Media
          fit="contain"
          item={{
            type: 'img',
            src: FOOD_PHOTOS[i],
            note: `[ comida ${String(i + 1).padStart(2, '0')} — Pedro preenche a URL em FOOD_PHOTOS ]`,
            icon: FOOD_EMOJIS[i % FOOD_EMOJIS.length],
          }}
        />
      </motion.div>

      {/* barrinha gamificada fixa no topo */}
      <div className="absolute inset-x-0 top-0 z-20 flex items-center gap-2.5 bg-gradient-to-b from-black/90 via-black/55 to-transparent px-4 pb-6 pt-[max(env(safe-area-inset-top),14px)]">
        {/* PLACEHOLDER — recorte da foto da Laura mordendo asinha
            (ajustar LAURA_ASINHA_INDEX em src/data/data.js) */}
        <div
          className="relative h-11 w-11 shrink-0 overflow-hidden bg-[#1c1424]"
          style={{
            imageRendering: 'pixelated',
            boxShadow: '0 0 0 2px #0a0a0a, 0 0 0 4px #e8b94a, 0 0 0 6px #0a0a0a',
          }}
        >
          <FotoLaura />
        </div>

        <div ref={trackRef} className="relative h-3.5 flex-1 rounded-sm bg-white/10">
          {/* trilha percorrida (da direita pra esquerda) */}
          <motion.div
            className="absolute inset-y-0 right-0 rounded-sm bg-gradient-to-l from-amber-500/70 to-gold/80"
            animate={{ width: `${p * 100}%` }}
            transition={{ type: 'tween', duration: 0.15 }}
          />
          {/* franguinho avançando em direção à boca dela */}
          <motion.div
            className="absolute -top-[7px] left-0 text-xl"
            animate={{ x: chickenX }}
            transition={{ type: 'spring', stiffness: 260, damping: 24 }}
          >
            <motion.span
              className="inline-block"
              animate={{ rotate: [-9, 9, -9] }}
              transition={{ duration: 0.5, repeat: Infinity, ease: 'easeInOut' }}
            >
              🍗
            </motion.span>
          </motion.div>
        </div>
      </div>

      {/* vitória: NOM NOM NOM */}
      <AnimatePresence>
        {win && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            onPointerDown={(e) => e.stopPropagation()}
            className="absolute inset-0 z-30 flex flex-col items-center justify-center gap-5 bg-black/85 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: [0, 1.3, 1] }}
              transition={{ duration: 0.7 }}
              className="text-7xl"
            >
              😋
            </motion.div>
            <motion.div
              animate={{ scale: [1, 1.14, 1] }}
              transition={{ duration: 0.55, repeat: 3 }}
              className="font-display text-4xl font-extrabold tracking-wider text-gold"
            >
              NOM NOM NOM
            </motion.div>
            <ContinueButton onClick={onDone} delay={1.2} className="mt-4" />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// recorte da Laura na barrinha — cai num emoji enquanto a foto não existe
function FotoLaura() {
  const [err, setErr] = useState(false);
  const src = FOOD_PHOTOS[LAURA_ASINHA_INDEX];
  if (err || !`${src}`.startsWith('http')) {
    return <div className="flex h-full w-full items-center justify-center text-xl">😋</div>;
  }
  return <img src={src} className="h-full w-full object-cover" draggable={false} alt="" onError={() => setErr(true)} />;
}
