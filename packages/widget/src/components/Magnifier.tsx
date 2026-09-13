// @blakfy/accessibility-widget — Magnifier.tsx
// Cursor-following magnifier lens (#30, Option A — DOM-clone, zero new
// dependency). Clones the element under the cursor into a fixed circular
// lens, scaled up. Known limitation: a static snapshot — doesn't reflect
// live video/canvas content, and cloned interactive elements are inert.
// Host-page stylesheet rules that apply via ancestor selectors not present
// on the cloned node in isolation may render slightly differently.
import { useEffect, useRef } from 'preact/hooks';
import type { JSX } from 'preact';

interface MagnifierProps {
  enabled: boolean;
}

const LENS_SIZE_PX = 180;
const ZOOM_FACTOR = 2.5;

export function Magnifier({ enabled }: MagnifierProps): JSX.Element | null {
  const lensRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!enabled) return;
    const onMove = (e: PointerEvent) => {
      const lens = lensRef.current;
      if (!lens) return;
      const under = document.elementFromPoint(e.clientX, e.clientY) as HTMLElement | null;
      if (!under || under.closest('blakfy-a11y-root')) {
        lens.style.display = 'none';
        return;
      }
      lens.style.display = 'block';
      lens.style.left = `${e.clientX - LENS_SIZE_PX / 2}px`;
      lens.style.top = `${e.clientY - LENS_SIZE_PX / 2}px`;

      // Rebuild lens content: clone the element under the cursor and scale it,
      // offset so the cursor's exact pixel appears centered in the lens.
      const rect = under.getBoundingClientRect();
      let clone: HTMLElement;
      try {
        clone = under.cloneNode(true) as HTMLElement;
      } catch {
        lens.replaceChildren();
        return;
      }
      clone.style.position = 'absolute';
      clone.style.left = `${-(e.clientX - rect.left) * ZOOM_FACTOR + LENS_SIZE_PX / 2}px`;
      clone.style.top = `${-(e.clientY - rect.top) * ZOOM_FACTOR + LENS_SIZE_PX / 2}px`;
      clone.style.transform = `scale(${ZOOM_FACTOR})`;
      clone.style.transformOrigin = 'top left';
      clone.style.pointerEvents = 'none';
      lens.replaceChildren(clone);
    };
    document.addEventListener('pointermove', onMove, { passive: true });
    return () => document.removeEventListener('pointermove', onMove);
  }, [enabled]);

  if (!enabled) return null;
  return <div ref={lensRef} class="magnifier-lens" aria-hidden="true" />;
}
