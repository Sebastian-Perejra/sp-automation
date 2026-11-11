/* OSV login-screen parallax. Presentation-only; does not touch API, passwords or sessions. */
(() => {
  'use strict';
  const login = document.getElementById('login');
  if (!login || !window.matchMedia || !window.requestAnimationFrame) return;
  const coarse = window.matchMedia('(pointer: coarse)');
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
  const intensity = 9; // px maximum translation, deliberately subtle
  let raf = 0;
  let x = 0, y = 0;
  const reset = () => {
    if (raf) window.cancelAnimationFrame(raf);
    raf = 0;
    login.style.setProperty('--osv-parallax-x', '0px');
    login.style.setProperty('--osv-parallax-y', '0px');
  };
  login.addEventListener('pointermove', (event) => {
    if (login.classList.contains('hidden') || reduced.matches || coarse.matches || event.pointerType === 'touch') return;
    const rect = login.getBoundingClientRect();
    x = ((event.clientX - rect.left) / Math.max(rect.width, 1) - .5) * -2 * intensity;
    y = ((event.clientY - rect.top) / Math.max(rect.height, 1) - .5) * -2 * intensity;
    if (raf) return;
    raf = window.requestAnimationFrame(() => {
      login.style.setProperty('--osv-parallax-x', x.toFixed(2) + 'px');
      login.style.setProperty('--osv-parallax-y', y.toFixed(2) + 'px');
      raf = 0;
    });
  }, {passive:true});
  login.addEventListener('pointerleave', reset, {passive:true});
  if (typeof reduced.addEventListener === 'function') reduced.addEventListener('change', reset);
  if (typeof coarse.addEventListener === 'function') coarse.addEventListener('change', reset);
})();