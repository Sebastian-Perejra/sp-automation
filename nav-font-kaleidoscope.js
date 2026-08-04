const navLinks = document.querySelectorAll(".desktop-nav a");

const fonts = [
  '"Roboto Mono", monospace',
  'Georgia, serif',
  '"Courier New", monospace',
  'Impact, sans-serif',
  '"Times New Roman", serif',
  '"Trebuchet MS", sans-serif'
];

navLinks.forEach(link => {
  let timer = null;
  let index = 0;

  link.addEventListener("mouseenter", () => {
    clearInterval(timer);

    timer = setInterval(() => {
      link.style.setProperty(
        "font-family",
        fonts[index],
        "important"
      );

      link.style.setProperty(
        "font-size",
        index % 2 === 0 ? "16px" : "14px",
        "important"
      );

      index = (index + 1) % fonts.length;
    }, 250);
  });

  link.addEventListener("mouseleave", () => {
    clearInterval(timer);
    timer = null;
    index = 0;

    link.style.removeProperty("font-family");
    link.style.removeProperty("font-size");
  });
});
