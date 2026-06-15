// ─────────────────────────────────────────────────────────────
// Sons — Web Audio API
// Tudo gerado por código. Zero arquivos externos.
// ─────────────────────────────────────────────────────────────

let _ctx = null;
let _unlocked = false;
let _silentEl = null;

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

// WAV mudo curto (data URI) tocado num <audio> em loop. No iOS, o botão
// físico de silencioso corta TODO o Web Audio (roteado como "ambiente").
// Manter um <audio> de mídia tocando segura a sessão em "playback",
// fazendo os sons saírem mesmo com o iPhone no silencioso.
function silentWavDataURI() {
  const rate = 8000;
  const samples = Math.floor(rate * 0.4);
  const dataLen = samples * 2; // 16-bit mono, tudo zero = silêncio
  const buf = new ArrayBuffer(44 + dataLen);
  const view = new DataView(buf);
  const str = (off, s) => {
    for (let i = 0; i < s.length; i++) view.setUint8(off + i, s.charCodeAt(i));
  };
  str(0, 'RIFF');
  view.setUint32(4, 36 + dataLen, true);
  str(8, 'WAVE');
  str(12, 'fmt ');
  view.setUint32(16, 16, true);
  view.setUint16(20, 1, true); // PCM
  view.setUint16(22, 1, true); // mono
  view.setUint32(24, rate, true);
  view.setUint32(28, rate * 2, true);
  view.setUint16(32, 2, true);
  view.setUint16(34, 16, true);
  str(36, 'data');
  view.setUint32(40, dataLen, true);
  let bin = '';
  const bytes = new Uint8Array(buf);
  for (let i = 0; i < bytes.length; i++) bin += String.fromCharCode(bytes[i]);
  return 'data:audio/wav;base64,' + btoa(bin);
}

// Chamar a cada gesto do usuário. Destrava o Web Audio (iOS exige
// resume + 1 som dentro do gesto) e segura a sessão de mídia ativa
// para tocar mesmo com o celular no silencioso.
export function unlockAudio() {
  const ac = ctx();
  if (!ac) return;
  if (ac.state === 'suspended') ac.resume().catch(() => {});

  if (!_unlocked) {
    _unlocked = true;
    // "esquenta" o Web Audio com um buffer mudo, dentro do gesto (iOS)
    try {
      const src = ac.createBufferSource();
      src.buffer = ac.createBuffer(1, 1, 22050);
      src.connect(ac.destination);
      src.start(0);
    } catch {
      /* noop */
    }
    try {
      _silentEl = new Audio(silentWavDataURI());
      _silentEl.loop = true;
      _silentEl.setAttribute('playsinline', '');
    } catch {
      /* noop */
    }
  }
  // (re)toca o loop mudo a cada gesto — mantém a sessão em "playback"
  if (_silentEl) _silentEl.play().catch(() => {});
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
