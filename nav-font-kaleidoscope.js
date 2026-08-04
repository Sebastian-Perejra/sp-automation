.desktop-nav a {
  display: inline-block;
  min-width: max-content;
  text-align: center;
  transform-origin: center;
}

.desktop-nav a:hover {
  animation: nav-font-kaleidoscope 1.5s steps(1, end) infinite;
}

@keyframes nav-font-kaleidoscope {
  0% {
    font-family: "Manrope", Arial, sans-serif;
    font-style: normal;
    font-weight: 600;
    letter-spacing: 0;
    transform: scale(1);
  }

  16% {
    font-family: "Roboto Mono", "Courier New", monospace;
    font-style: normal;
    font-weight: 500;
    letter-spacing: -0.04em;
    transform: scale(1.04);
  }

  32% {
    font-family: Georgia, "Times New Roman", serif;
    font-style: italic;
    font-weight: 700;
    letter-spacing: 0.02em;
    transform: skewX(-6deg) scale(1.05);
  }

  48% {
    font-family: Impact, "Arial Black", sans-serif;
    font-style: normal;
    font-weight: 900;
    letter-spacing: 0;
    transform: scaleX(0.92) scaleY(1.08);
  }

  64% {
    font-family: "Courier New", monospace;
    font-style: normal;
    font-weight: 700;
    letter-spacing: -0.07em;
    transform: scaleX(0.95);
  }

  80% {
    font-family: "Times New Roman", serif;
    font-style: italic;
    font-weight: 400;
    letter-spacing: 0.08em;
    transform: skewX(5deg) scale(1.03);
  }

  100% {
    font-family: "Trebuchet MS", Arial, sans-serif;
    font-style: normal;
    font-weight: 700;
    letter-spacing: 0.04em;
    transform: scaleX(1.05);
  }
}

@media (max-width: 760px) {
  .desktop-nav a:hover {
    animation: none;
  }
}
