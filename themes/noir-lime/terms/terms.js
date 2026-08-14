const mobileMenuButton =
  document.querySelector(
    ".mobile-menu-button"
  );

const mobileMenu =
  document.querySelector(
    ".mobile-menu"
  );

function closeMobileMenu() {
  mobileMenu?.classList.remove(
    "is-open"
  );

  mobileMenuButton?.setAttribute(
    "aria-expanded",
    "false"
  );
}

mobileMenuButton?.addEventListener(
  "click",
  () => {
    const isOpen =
      mobileMenu?.classList.toggle(
        "is-open"
      );

    mobileMenuButton.setAttribute(
      "aria-expanded",
      isOpen ? "true" : "false"
    );
  }
);

mobileMenu
  ?.querySelectorAll("a")
  .forEach(link => {
    link.addEventListener(
      "click",
      closeMobileMenu
    );
  });

document.addEventListener(
  "keydown",
  event => {
    if (event.key === "Escape") {
      closeMobileMenu();
    }
  }
);
