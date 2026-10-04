'use client';

import { useEffect, useRef, type RefObject } from 'react';

export type ClickOutsideHandler = (event: MouseEvent | TouchEvent) => void;

export function useClickOutside<T extends HTMLElement = HTMLElement>(
  handler: ClickOutsideHandler,
  enabled: boolean = true,
  targetRef?: RefObject<T | null>
): RefObject<T | null> {
  const internalRef = useRef<T | null>(null);
  const ref = targetRef ?? internalRef;

  useEffect(() => {
    if (!enabled) return;

    const listener = (event: MouseEvent | TouchEvent) => {
      const el = ref.current;
      if (!el || el.contains(event.target as Node)) {
        return;
      }
      handler(event);
    };

    document.addEventListener('mousedown', listener);
    document.addEventListener('touchstart', listener);

    return () => {
      document.removeEventListener('mousedown', listener);
      document.removeEventListener('touchstart', listener);
    };
  }, [handler, enabled, ref]);

  return ref;
}

export default useClickOutside;
