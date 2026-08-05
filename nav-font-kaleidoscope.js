document.addEventListener("DOMContentLoaded", () => {
  const currentPage =
    window.location.pathname.split("/").pop() || "index.html";

  document.querySelectorAll(".desktop-nav a").forEach(link => {
    const linkPage =
      new URL(link.href, window.location.href)
        .pathname
        .split("/")
        .pop();

    const isActive = linkPage === currentPage;

    link.classList.toggle("active", isActive);

    if (isActive) {
      link.setAttribute("aria-current", "page");
    } else {
      link.removeAttribute("aria-current");
    }
  });
});
