import { useEffect, useRef } from 'react';

export default function CustomCursor() {
  const ringRef = useRef<HTMLDivElement>(null);
  const dotRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (window.matchMedia('(pointer: coarse)').matches) return;

    const ring = ringRef.current;
    const dot = dotRef.current;
    if (!ring || !dot) return;

    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let curX = mouseX;
    let curY = mouseY;
    let rafId: number;

    const onMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      dot.style.transform = `translate(${mouseX}px, ${mouseY}px)`;
    };

    const onMouseEnterInteractive = () => ring.classList.add('cursor-hover');
    const onMouseLeaveInteractive = () => ring.classList.remove('cursor-hover');

    const attachListeners = () => {
      document.querySelectorAll<HTMLElement>('a, button, [role="button"], input, select, textarea, label').forEach(el => {
        el.addEventListener('mouseenter', onMouseEnterInteractive);
        el.addEventListener('mouseleave', onMouseLeaveInteractive);
      });
    };

    attachListeners();

    const observer = new MutationObserver(attachListeners);
    observer.observe(document.body, { childList: true, subtree: true });

    const animate = () => {
      curX += (mouseX - curX) * 0.1;
      curY += (mouseY - curY) * 0.1;
      ring.style.transform = `translate(${curX}px, ${curY}px)`;
      rafId = requestAnimationFrame(animate);
    };
    rafId = requestAnimationFrame(animate);

    document.addEventListener('mousemove', onMouseMove);

    return () => {
      document.removeEventListener('mousemove', onMouseMove);
      cancelAnimationFrame(rafId);
      observer.disconnect();
    };
  }, []);

  return (
    <>
      <div ref={ringRef} className="custom-cursor" aria-hidden="true" />
      <div ref={dotRef} className="custom-cursor-dot" aria-hidden="true" />
    </>
  );
}
