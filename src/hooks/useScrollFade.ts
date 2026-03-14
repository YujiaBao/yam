import { useEffect } from 'react';

/**
 * Adds an 'is-scrolling' class to the target element during scroll,
 * then removes it after a timeout (default 3s) of no scroll activity.
 */
export const useScrollFade = (
  ref: React.RefObject<HTMLElement | null>,
  timeout = 3000
) => {
  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    let timer: ReturnType<typeof setTimeout>;

    const onScroll = () => {
      el.classList.add('is-scrolling');
      clearTimeout(timer);
      timer = setTimeout(() => {
        el.classList.remove('is-scrolling');
      }, timeout);
    };

    el.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      el.removeEventListener('scroll', onScroll);
      clearTimeout(timer);
      el.classList.remove('is-scrolling');
    };
  }, [ref, timeout]);
};
