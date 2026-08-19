(() => {
  const section = document.querySelector(
    ".about-history"
  );

  if (!section) return;

  const sticky = section.querySelector(
    ".about-history__sticky"
  );

  const viewport = section.querySelector(
    ".about-history__viewport"
  );

  const track = section.querySelector(
    ".about-history__track"
  );

  const progressFill = section.querySelector(
    ".about-history__progress-fill"
  );

  if (
    !sticky ||
    !viewport ||
    !track ||
    !progressFill
  ) {
    return;
  }

  const desktopQuery = window.matchMedia(
    "(min-width: 851px)"
  );

  let maxShift = 0;
  let scrollDistance = 0;
  let ticking = false;

  function clamp(
    value,
    min,
    max
  ) {
    return Math.min(
      Math.max(value, min),
      max
    );
  }

  function reset() {
    section.style.height = "";

    track.style.transform = "";

    progressFill.style.transform =
      "scaleX(0)";
  }

  function measure() {
    if (!desktopQuery.matches) {
      reset();
      return;
    }

    maxShift = Math.max(
      0,
      track.scrollWidth -
      viewport.clientWidth
    );

    scrollDistance =
      maxShift * 1.08;

    section.style.height =
      `${
        sticky.offsetHeight +
        scrollDistance
      }px`;

    update();
  }

  function update() {
    if (!desktopQuery.matches) {
      return;
    }

    const rect =
      section.getBoundingClientRect();

    const stickyTop = 92;

    const travelled =
      stickyTop -
      rect.top;

    const progress =
      scrollDistance > 0
        ? clamp(
            travelled /
              scrollDistance,
            0,
            1
          )
        : 0;

    const translate =
      maxShift *
      progress;

    track.style.transform =
      `translate3d(${
        -translate
      }px, 0, 0)`;

    progressFill.style.transform =
      `scaleX(${progress})`;
  }

  function requestUpdate() {
    if (ticking) return;

    ticking = true;

    requestAnimationFrame(
      () => {
        update();
        ticking = false;
      }
    );
  }

  window.addEventListener(
    "scroll",
    requestUpdate,
    {
      passive: true
    }
  );

  window.addEventListener(
    "resize",
    measure
  );

  desktopQuery.addEventListener(
    "change",
    measure
  );

  if (
    "ResizeObserver" in window
  ) {
    const observer =
      new ResizeObserver(
        measure
      );

    observer.observe(viewport);
    observer.observe(track);
  }

  measure();
})();
