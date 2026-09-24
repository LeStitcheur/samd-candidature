import { useEffect } from 'react';

export default function useImageParallax() {
  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
    const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)');
    const regions = [...document.querySelectorAll('.hero, .profile-visual, .hospital-photo, .oceanic')];
    const pointer = new Map();
    let frame = 0;
    const clear = () => regions.forEach(element => {
      ['--parallax-scroll', '--parallax-x', '--parallax-y'].forEach(name => element.style.removeProperty(name));
    });
    function update() {
      frame = 0;
      if (reduced.matches) { clear(); return; }
      const viewport = window.innerHeight;
      // Lire les positions ensemble avant de modifier les styles.
      const positions = regions.map(element => ({ element, rect: element.getBoundingClientRect() }));
      for (const { element, rect } of positions) {
        if (rect.bottom < 0 || rect.top > viewport) continue;
        const progress = Math.max(-1, Math.min(1, (viewport / 2 - rect.top - rect.height / 2) / ((viewport + rect.height) / 2)));
        const position = finePointer.matches ? pointer.get(element) : null;
        element.style.setProperty('--parallax-scroll', progress.toFixed(4));
        element.style.setProperty('--parallax-x', `${(position?.x || 0).toFixed(2)}px`);
        element.style.setProperty('--parallax-y', `${(position?.y || 0).toFixed(2)}px`);
      }
    }
    function schedule() { if (!frame && !reduced.matches) frame = requestAnimationFrame(update); }
    const handlers = regions.map(element => {
      function move(event) {
        if (reduced.matches || !finePointer.matches || event.pointerType === 'touch') return;
        const rect = element.getBoundingClientRect();
        pointer.set(element, { x: ((event.clientX - rect.left) / rect.width - .5) * 8, y: ((event.clientY - rect.top) / rect.height - .5) * 8 });
        schedule();
      }
      function leave() { pointer.delete(element); schedule(); }
      element.addEventListener('pointermove', move, { passive: true });
      element.addEventListener('pointerleave', leave);
      return () => { element.removeEventListener('pointermove', move); element.removeEventListener('pointerleave', leave); };
    });
    function preferenceChanged() { pointer.clear(); if (reduced.matches) { cancelAnimationFrame(frame); frame = 0; clear(); } else schedule(); }
    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', schedule, { passive: true });
    reduced.addEventListener('change', preferenceChanged);
    finePointer.addEventListener('change', preferenceChanged);
    schedule();
    return () => {
      cancelAnimationFrame(frame); clear(); handlers.forEach(remove => remove());
      window.removeEventListener('scroll', schedule); window.removeEventListener('resize', schedule);
      reduced.removeEventListener('change', preferenceChanged); finePointer.removeEventListener('change', preferenceChanged);
    };
  }, []);
}
