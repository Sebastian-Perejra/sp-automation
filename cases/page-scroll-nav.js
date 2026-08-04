(() => {
  const button = document.createElement("button");

  button.className = "page-scroll-nav";
  button.type = "button";
  button.setAttribute("aria-label", "Прокрутить страницу вниз");

  button.innerHTML = `
    <span class="page-scroll-nav-icon" aria-hidden="true"></span>
  `;

  document.body.appendChild(button);

  function updateButtonState() {
    const scrollTop =
      window.pageYOffset ||
      document.documentElement.scrollTop;

    const documentHeight =
      Math.max(
        document.body.scrollHeight,
        document.documentElement.scrollHeight
      );

    const viewportHeight =
      window.innerHeight;

    const scrollableDistance =
      documentHeight - viewportHeight;

    if (scrollableDistance < 300) {
      button.classList.remove("visible");
      return;
    }

    button.classList.add("visible");

    const isPastMiddle =
      scrollTop > scrollableDistance / 2;

    button.classList.toggle("to-top", isPastMiddle);

    button.setAttribute(
      "aria-label",
      isPastMiddle
        ? "Прокрутить страницу наверх"
        : "Прокрутить страницу вниз"
    );
  }

  button.addEventListener("click", () => {
    const isToTop =
      button.classList.contains("to-top");

    window.scrollTo({
      top: isToTop
        ? 0
        : document.documentElement.scrollHeight,
      behavior: "smooth"
    });
  });

  window.addEventListener(
    "scroll",
    updateButtonState,
    { passive: true }
  );

  window.addEventListener(
    "resize",
    updateButtonState
  );

  updateButtonState();
})();
