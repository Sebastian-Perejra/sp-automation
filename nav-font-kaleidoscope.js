(() => {
  const links = document.querySelectorAll(".desktop-nav a");

  if (!links.length) return;

  const styles = [
    {
      fontFamily: '"Roboto Mono", monospace',
      fontStyle: "normal",
      fontWeight: "500",
      letterSpacing: "-0.03em"
    },
    {
      fontFamily: 'Georgia, "Times New Roman", serif',
      fontStyle: "italic",
      fontWeight: "700",
      letterSpacing: "0.02em"
    },
    {
      fontFamily: '"Courier New", monospace',
      fontStyle: "normal",
      fontWeight: "700",
      letterSpacing: "-0.07em"
    },
    {
      fontFamily: '"Trebuchet MS", Arial, sans-serif',
      fontStyle: "normal",
      fontWeight: "700",
      letterSpacing: "0.05em"
    },
    {
      fontFamily: '"Times New Roman", serif',
      fontStyle: "italic",
      fontWeight: "400",
      letterSpacing: "0.08em"
    }
  ];

  links.forEach(link => {
    let delayTimer = null;
    let cycleTimer = null;
    let index = 0;

    const reset = () => {
      clearTimeout(delayTimer);
      clearInterval(cycleTimer);

      link.style.removeProperty("font-family");
      link.style.removeProperty("font-style");
      link.style.removeProperty("font-weight");
      link.style.removeProperty("letter-spacing");

      index = 0;
    };

    const changeFont = () => {
      const style = styles[index];

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

      index = (index + 1) % styles.length;
    };

    link.addEventListener("pointerenter", () => {
      reset();

      delayTimer = setTimeout(() => {
        changeFont();
        cycleTimer = setInterval(changeFont, 180);
      }, 350);
    });

    link.addEventListener("pointerleave", reset);
  });
})();
