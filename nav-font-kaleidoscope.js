(() => {
  const fontStyles = [
    {
      fontFamily: '"Roboto Mono", monospace',
      fontStyle: "normal",
      fontWeight: "500",
      letterSpacing: "-0.04em",
      transform: "scale(1.04)"
    },
    {
      fontFamily: 'Georgia, "Times New Roman", serif',
      fontStyle: "italic",
      fontWeight: "700",
      letterSpacing: "0.02em",
      transform: "skewX(-7deg) scale(1.06)"
    },
    {
      fontFamily: '"Courier New", monospace',
      fontStyle: "normal",
      fontWeight: "700",
      letterSpacing: "-0.08em",
      transform: "scaleX(0.94)"
    },
    {
      fontFamily: 'Impact, "Arial Black", sans-serif',
      fontStyle: "normal",
      fontWeight: "900",
      letterSpacing: "0.01em",
      transform: "scaleX(0.9) scaleY(1.08)"
    },
    {
      fontFamily: '"Times New Roman", serif',
      fontStyle: "italic",
      fontWeight: "400",
      letterSpacing: "0.09em",
      transform: "skewX(5deg) scale(1.03)"
    },
    {
      fontFamily: '"Trebuchet MS", Arial, sans-serif',
      fontStyle: "normal",
      fontWeight: "700",
      letterSpacing: "0.05em",
      transform: "scaleX(1.05)"
    }
  ];

  const timers = new WeakMap();

  function resetLink(link) {
    const timer = timers.get(link);

    if (timer) {
      clearInterval(timer);
      timers.delete(link);
    }

    link.style.removeProperty("font-family");
    link.style.removeProperty("font-style");
    link.style.removeProperty("font-weight");
    link.style.removeProperty("letter-spacing");
    link.style.removeProperty("transform");
    link.style.removeProperty("transition");
    link.style.removeProperty("display");
    link.style.removeProperty("transform-origin");
  }

  function startKaleidoscope(link) {
    resetLink(link);

    let index = 0;

    link.style.setProperty("display", "inline-block", "important");
    link.style.setProperty("transform-origin", "center", "important");
    link.style.setProperty(
      "transition",
      "font-family 0s, transform 0.12s ease, letter-spacing 0.12s ease",
      "important"
    );

    const applyStyle = () => {
      const style = fontStyles[index];

      link.style.setProperty(
        "font-family",
        style.fontFamily,
        "important"
      );

      link.style.setProperty(
        "font-style",
        style.fontStyle,
        "important"
      );

      link.style.setProperty(
        "font-weight",
        style.fontWeight,
        "important"
      );

      link.style.setProperty(
        "letter-spacing",
        style.letterSpacing,
        "important"
      );

      link.style.setProperty(
        "transform",
        style.transform,
        "important"
      );

      index = (index + 1) % fontStyles.length;
    };

    applyStyle();

    const timer = setInterval(applyStyle, 240);
    timers.set(link, timer);
  }

  document.addEventListener("mouseover", event => {
    const link = event.target.closest(".desktop-nav a");

    if (!link) return;
    if (link.contains(event.relatedTarget)) return;

    startKaleidoscope(link);
  });

  document.addEventListener("mouseout", event => {
    const link = event.target.closest(".desktop-nav a");

    if (!link) return;
    if (link.contains(event.relatedTarget)) return;

    resetLink(link);
  });

  window.addEventListener("blur", () => {
    document.querySelectorAll(".desktop-nav a").forEach(resetLink);
  });
})();
