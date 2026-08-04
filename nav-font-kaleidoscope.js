document.addEventListener("DOMContentLoaded", () => {
  const links = document.querySelectorAll(".desktop-nav a");

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
      letterSpacing: "0.01em"
    },
    {
      fontFamily: '"Courier New", monospace',
      fontStyle: "normal",
      fontWeight: "700",
      letterSpacing: "-0.06em"
    },
    {
      fontFamily: '"Trebuchet MS", Arial, sans-serif',
      fontStyle: "normal",
      fontWeight: "700",
      letterSpacing: "0.04em"
    },
    {
      fontFamily: '"Times New Roman", serif',
      fontStyle: "italic",
      fontWeight: "400",
      letterSpacing: "0.06em"
    }
  ];

  links.forEach(link => {
    const original = {
      fontFamily: link.style.fontFamily,
      fontStyle: link.style.fontStyle,
      fontWeight: link.style.fontWeight,
      letterSpacing: link.style.letterSpacing
    };

    let startTimer;
    let cycleTimer;
    let index = 0;

    const restore = () => {
      clearTimeout(startTimer);
      clearInterval(cycleTimer);

      link.style.fontFamily = original.fontFamily;
      link.style.fontStyle = original.fontStyle;
      link.style.fontWeight = original.fontWeight;
      link.style.letterSpacing = original.letterSpacing;

      index = 0;
    };

    link.addEventListener("mouseenter", () => {
      restore();

      startTimer = setTimeout(() => {
        const applyNextStyle = () => {
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

        applyNextStyle();
        cycleTimer = setInterval(applyNextStyle, 220);
      }, 350);
    });

    link.addEventListener("mouseleave", restore);
  });
});
