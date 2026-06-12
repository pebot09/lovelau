// ─────────────────────────────────────────────────────────────
// Sons — Web Audio API
// Tudo gerado por código. Zero arquivos externos.
// ─────────────────────────────────────────────────────────────

let _ctx = null;

function ctx() {
  if (typeof window === 'undefined') return null;
  if (!_ctx) {
    const AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return null;
    _ctx = new AC();
  }
  // navegadores suspendem o contexto até a primeira interação
  if (_ctx.state === 'suspended') _ctx.resume().catch(() => {});
  return _ctx;
}

// chamar no primeiro toque/clique da sessão para liberar o áudio
export function unlockAudio() {
  ctx();
}

// agenda um tom simples (osc + envelope de ganho)
function tone({ freq = 440, type = 'sine', delay = 0, dur = 0.15, vol = 0.15, glideTo = null }) {
  const ac = ctx();
  if (!ac) return;
  const t0 = ac.currentTime + delay;
  const osc = ac.createOscillator();
  const gain = ac.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(freq, t0);
  if (glideTo) osc.frequency.exponentialRampToValueAtTime(Math.max(glideTo, 1), t0 + dur);
  gain.gain.setValueAtTime(0.0001, t0);
  gain.gain.exponentialRampToValueAtTime(Math.max(vol, 0.0002), t0 + 0.015);
  gain.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
  osc.connect(gain);
  gain.connect(ac.destination);
  osc.start(t0);
  osc.stop(t0 + dur + 0.1);
}

export const sounds = {
  // terminal bip — onda senoidal curta 800hz
  bip: () => tone({ freq: 800, dur: 0.045, vol: 0.045 }),

  // fanfara ascendente 3 notas (C5 → E5 → G5)
  match: () => {
    tone({ freq: 523.25, type: 'triangle', delay: 0, dur: 0.18, vol: 0.18 });
    tone({ freq: 659.25, type: 'triangle', delay: 0.14, dur: 0.18, vol: 0.18 });
    tone({ freq: 783.99, type: 'triangle', delay: 0.28, dur: 0.45, vol: 0.2 });
  },

  // bip grave descendente
  buzzer: () => tone({ freq: 300, type: 'sawtooth', dur: 0.45, vol: 0.1, glideTo: 90 }),

  // fanfara curta de vitória
  acerto: () => {
    tone({ freq: 587.33, type: 'triangle', delay: 0, dur: 0.12, vol: 0.16 });
    tone({ freq: 880, type: 'triangle', delay: 0.1, dur: 0.32, vol: 0.18 });
  },

  // bip grave duplo
  erro: () => {
    tone({ freq: 185, type: 'square', delay: 0, dur: 0.12, vol: 0.07 });
    tone({ freq: 150, type: 'square', delay: 0.17, dur: 0.18, vol: 0.07 });
  },

  // sino suave agudo (E6 + harmônico)
  chime: () => {
    tone({ freq: 1318.5, dur: 0.9, vol: 0.09 });
    tone({ freq: 1975.5, delay: 0.02, dur: 0.7, vol: 0.04 });
  },

  // varredura de frequência curta
  whoosh: () => tone({ freq: 180, dur: 0.32, vol: 0.09, glideTo: 1100 }),
};

// ─────────────────────────────────────────────────────────────
// Melodia de trivia — 4 notas em loop enquanto o modal está aberto
// (arpejo de Lá maior, tom leve)
// ─────────────────────────────────────────────────────────────

let triviaTimer = null;

export function startTrivia() {
  stopTrivia();
  const phrase = () => {
    tone({ freq: 440.0, type: 'triangle', delay: 0, dur: 0.16, vol: 0.06 });
    tone({ freq: 554.37, type: 'triangle', delay: 0.22, dur: 0.16, vol: 0.06 });
    tone({ freq: 659.25, type: 'triangle', delay: 0.44, dur: 0.16, vol: 0.06 });
    tone({ freq: 554.37, type: 'triangle', delay: 0.66, dur: 0.22, vol: 0.06 });
  };
  phrase();
  triviaTimer = setInterval(phrase, 1400);
}

export function stopTrivia() {
  if (triviaTimer) {
    clearInterval(triviaTimer);
    triviaTimer = null;
  }
}

export default function useSounds() {
  return { ...sounds, startTrivia, stopTrivia };
}
