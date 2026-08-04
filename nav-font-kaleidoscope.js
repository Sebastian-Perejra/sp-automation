(() => {
  const links = document.querySelectorAll(".desktop-nav a");

  if (!links.length) return;

  const classes = [
    "font-style-1",
    "font-style-2",
    "font-style-3",
    "font-style-4",
    "font-style-5"
  ];

  links.forEach(link => {
    let startTimer = null;
    let cycleTimer = null;
    let currentIndex = 0;

    const resetFont = () => {
      clearTimeout(startTimer);
      clearInterval(cycleTimer);

      classes.forEach(className => {
        link.classList.remove(className);
      });

      currentIndex = 0;
    };

    link.addEventListener("mouseenter", () => {
      resetFont();

      startTimer = setTimeout(() => {
        cycleTimer = setInterval(() => {
          classes.forEach(className => {
            link.classList.remove(className);
          });

          link.classList.add(classes[currentIndex]);

          currentIndex =
            (currentIndex + 1) % classes.length;
        }, 170);
      }, 500);
    });

    link.addEventListener("mouseleave", resetFont);
    link.addEventListener("blur", resetFont);
  });
})();
