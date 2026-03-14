import { useEffect } from 'react';

/**
 * Custom hook to synchronize scrolling between two elements.
 * Uses percentage-based mapping to ensure proportional scrolling even if heights differ.
 * Scroll handlers are throttled via requestAnimationFrame for performance.
 */
export const useSyncScroll = (
  refA: React.RefObject<HTMLElement | null>,
  refB: React.RefObject<HTMLElement | null>,
  isEnabled: boolean
) => {
  useEffect(() => {
    const a = refA.current;
    const b = refB.current;

    if (!isEnabled || !a || !b) return;

    let isSyncingA = false;
    let isSyncingB = false;
    let rafA: number | null = null;
    let rafB: number | null = null;

    const handleScrollA = () => {
      if (isSyncingB) {
        isSyncingB = false;
        return;
      }

      if (rafA) return;
      rafA = requestAnimationFrame(() => {
        rafA = null;
        const maxScrollA = a.scrollHeight - a.clientHeight;
        if (maxScrollA <= 0) return;

        isSyncingA = true;
        const percentage = a.scrollTop / maxScrollA;
        const maxScrollB = b.scrollHeight - b.clientHeight;
        b.scrollTop = percentage * maxScrollB;
      });
    };

    const handleScrollB = () => {
      if (isSyncingA) {
        isSyncingA = false;
        return;
      }

      if (rafB) return;
      rafB = requestAnimationFrame(() => {
        rafB = null;
        const maxScrollB = b.scrollHeight - b.clientHeight;
        if (maxScrollB <= 0) return;

        isSyncingB = true;
        const percentage = b.scrollTop / maxScrollB;
        const maxScrollA = a.scrollHeight - a.clientHeight;
        a.scrollTop = percentage * maxScrollA;
      });
    };

    a.addEventListener('scroll', handleScrollA, { passive: true });
    b.addEventListener('scroll', handleScrollB, { passive: true });

    return () => {
      a.removeEventListener('scroll', handleScrollA);
      b.removeEventListener('scroll', handleScrollB);
      if (rafA) cancelAnimationFrame(rafA);
      if (rafB) cancelAnimationFrame(rafB);
    };
  }, [refA, refB, isEnabled]);
};
