document.addEventListener("DOMContentLoaded", () => {
  const root = document.documentElement;
  const finePointer = window.matchMedia("(pointer: fine)").matches;
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (reduceMotion) {
    root.style.setProperty("--pricing-bg-x", "50%");
    root.style.setProperty("--pricing-bg-y", "50%");
    root.style.setProperty("--pricing-shift-x", "0px");
    root.style.setProperty("--pricing-shift-y", "0px");
    return;
  }

  let targetX = 0;
  let targetY = 0;
  let currentX = 0;
  let currentY = 0;
  let autoPhase = 0;

  if (finePointer) {
    window.addEventListener(
      "pointermove",
      (event) => {
        const normalizedX =
          event.clientX / window.innerWidth - 0.5;

        const normalizedY =
          event.clientY / window.innerHeight - 0.5;

        targetX = normalizedX * 16;
        targetY = normalizedY * 10;
      },
      { passive: true }
    );

    window.addEventListener("pointerleave", () => {
      targetX = 0;
      targetY = 0;
    });
  }

  function animate() {
    autoPhase += 0.0025;

    let autoX = Math.sin(autoPhase) * 3;
    let autoY = Math.cos(autoPhase * 0.72) * 2;

    if (!finePointer) {
      targetX = autoX;
      targetY = autoY;
    } else {
      targetX += autoX * 0.002;
      targetY += autoY * 0.002;
    }

    currentX += (targetX - currentX) * 0.035;
    currentY += (targetY - currentY) * 0.035;

    root.style.setProperty(
      "--pricing-shift-x",
      `${currentX.toFixed(2)}px`
    );

    root.style.setProperty(
      "--pricing-shift-y",
      `${currentY.toFixed(2)}px`
    );

    requestAnimationFrame(animate);
  }

  animate();
});
