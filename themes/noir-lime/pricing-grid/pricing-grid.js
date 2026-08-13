document.addEventListener("DOMContentLoaded", () => {
  const root = document.documentElement;

  let targetX = 0;
  let targetY = 0;
  let currentX = 0;
  let currentY = 0;

  window.addEventListener("pointermove", (event) => {
    targetX = (event.clientX / window.innerWidth - 0.5) * 16;
    targetY = (event.clientY / window.innerHeight - 0.5) * 10;
  });

  function animate() {
    currentX += (targetX - currentX) * 0.04;
    currentY += (targetY - currentY) * 0.04;

    root.style.setProperty(
      "--pricing-shift-x",
      `${currentX}px`
    );

    root.style.setProperty(
      "--pricing-shift-y",
      `${currentY}px`
    );

    requestAnimationFrame(animate);
  }

  animate();
});
