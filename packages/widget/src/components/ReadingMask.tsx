// @blakfy/accessibility-widget — ReadingMask.tsx
// Cursor-following reading mask (#29): dims content above/below a horizontal
// band that tracks the pointer, helping dyslexia/attention users track a
// single line. Lives inside the widget's own Shadow DOM (not host-page CSS),
// mouse/touch-follow only — keyboard-driven movement is a follow-up.
import { useEffect, useRef } from 'preact/hooks';
import type { JSX } from 'preact';

interface ReadingMaskProps {
  enabled: boolean;
}

const BAND_HEIGHT_PX = 60;

export function ReadingMask({ enabled }: ReadingMaskProps): JSX.Element | null {
  const elRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!enabled) return;
    const onMove = (e: PointerEvent) => {
      if (elRef.current) {
        elRef.current.style.setProperty('--mask-y', `${e.clientY}px`);
      }
    };
    document.addEventListener('pointermove', onMove, { passive: true });
    return () => document.removeEventListener('pointermove', onMove);
  }, [enabled]);

  if (!enabled) return null;

  return (
    <div
      ref={elRef}
      class="reading-mask"
      aria-hidden="true"
      style={{ '--mask-band': `${BAND_HEIGHT_PX}px` } as unknown as JSX.CSSProperties}
    />
  );
}
