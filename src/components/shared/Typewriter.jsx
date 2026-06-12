import { useEffect, useMemo, useRef, useState } from 'react';
import { sounds } from '../../hooks/useSounds';

/**
 * Efeito de digitação, uma linha por vez.
 *
 * lines: array de strings ou objetos { text, speed?, delayAfter?, className? }
 *  - speed: ms por caractere (sobrepõe o padrão da prop)
 *  - delayAfter: pausa após a linha completar
 *  - className: estilo extra só daquela linha
 * bip: toca sounds.bip() a cada caractere (estilo terminal)
 */
export default function Typewriter({
  lines,
  speed = 38,
  lineDelay = 420,
  bip = false,
  cursor = true,
  className = '',
  lineClassName = '',
  onDone,
}) {
  const norm = useMemo(
    () => lines.map((l) => (typeof l === 'string' ? { text: l } : l)),
    [lines],
  );
  const [li, setLi] = useState(0); // linha atual
  const [ci, setCi] = useState(0); // caracteres digitados da linha atual
  const doneRef = useRef(false);

  useEffect(() => {
    if (li >= norm.length) {
      if (!doneRef.current) {
        doneRef.current = true;
        onDone && onDone();
      }
      return;
    }
    const line = norm[li];
    if (ci < line.text.length) {
      const t = setTimeout(() => {
        if (bip && line.text[ci] !== ' ') sounds.bip();
        setCi((c) => c + 1);
      }, line.speed ?? speed);
      return () => clearTimeout(t);
    }
    const t = setTimeout(() => {
      setLi((l) => l + 1);
      setCi(0);
    }, line.delayAfter ?? lineDelay);
    return () => clearTimeout(t);
  }, [li, ci, norm, speed, lineDelay, bip, onDone]);

  return (
    <div className={className}>
      {norm.map((line, i) => {
        if (i > li) return null;
        const text = i < li ? line.text : line.text.slice(0, ci);
        const active = i === li;
        return (
          <div key={i} className={`${lineClassName} ${line.className ?? ''}`}>
            {text}
            {cursor && active && (
              <span className="cursor-blink ml-0.5 inline-block h-[1em] w-[0.55ch] translate-y-[0.15em] bg-blush/90" />
            )}
          </div>
        );
      })}
    </div>
  );
}
