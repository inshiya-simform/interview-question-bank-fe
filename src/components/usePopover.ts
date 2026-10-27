import { useEffect, useRef, useState } from 'react';
import type { CSSProperties } from 'react';

// Leave the panel this much room below the trigger before it flips upward.
const FLIP_THRESHOLD_PX = 360;
const GAP_PX = 4;

export type PopoverPlacement = 'below' | 'beside';

// A panel beside its trigger needs this much height from the trigger down before it flips up.
const BESIDE_FLIP_PX = 560;
const BESIDE_MARGIN_PX = 16;

export function usePopover(
  isOpen: boolean,
  onClose: () => void,
  placement: PopoverPlacement = 'below',
) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const onCloseRef = useRef(onClose);
  const [position, setPosition] = useState<CSSProperties>();

  useEffect(() => {
    onCloseRef.current = onClose;
  });

  useEffect(() => {
    const wrapper = wrapperRef.current;
    if (!isOpen || !wrapper) return;

    // Fixed positioning keeps scrolling ancestors from clipping the panel.
    const place = () => {
      const rect = wrapper.getBoundingClientRect();
      if (placement === 'beside') {
        // Open to the side so a sidebar trigger doesn't cover the links around it.
        const width = panelRef.current?.offsetWidth ?? 0;
        const left = Math.min(rect.right + GAP_PX * 2, window.innerWidth - width - GAP_PX);
        setPosition(
          window.innerHeight - rect.top < BESIDE_FLIP_PX
            ? { left: Math.max(GAP_PX, left), bottom: BESIDE_MARGIN_PX }
            : { left: Math.max(GAP_PX, left), top: rect.top },
        );
        return;
      }
      const right = window.innerWidth - rect.right;
      setPosition(
        window.innerHeight - rect.bottom < FLIP_THRESHOLD_PX
          ? { right, bottom: window.innerHeight - rect.top + GAP_PX }
          : { right, top: rect.bottom + GAP_PX },
      );
    };
    const handlePointerDown = (event: PointerEvent) => {
      if (event.target instanceof Node && !wrapper.contains(event.target)) onCloseRef.current();
    };
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') return;
      onCloseRef.current();
      // The trigger is the wrapper's first button; hand focus back to it.
      wrapper.querySelector('button')?.focus();
    };

    place();
    panelRef.current?.focus();
    window.addEventListener('scroll', place, true);
    window.addEventListener('resize', place);
    document.addEventListener('pointerdown', handlePointerDown);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('scroll', place, true);
      window.removeEventListener('resize', place);
      document.removeEventListener('pointerdown', handlePointerDown);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, placement]);

  return { wrapperRef, panelRef, position };
}
