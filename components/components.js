(() => {
  const languages = {
    uk: {
      suffix: "",
      home: "← На головну",
      menuLabel: "Відкрити меню",
      nav: {
        about: "Про мене",
        services: "Послуги",
        pricing: "Цінова політика",
        solutions: "Рішення",
        faq: "FAQ",
        contacts: "Контакти",
        terms: "Умови використання"
      },
      ticker:
        "Excel VBA · Google Apps Script · Power BI · DAX · Power Query · Автоматичні звіти · Автоматизація Excel · Обробка даних · Очищення даних · Парсинг даних · Інтеграції · Макроси · Кастомна логіка · Автоматизація бізнес-процесів · Аналітичні дашборди · Автоматизація Google Sheets · Вебзастосунки · JavaScript · Індивідуальні рішення для бізнесу ·",
      rights: "Усі права захищені.",
      terms: "Умови використання"
    },

    en: {
      suffix: "-en",
      home: "← Home",
      menuLabel: "Open menu",
      nav: {
        about: "About me",
        services: "Services",
        pricing: "Pricing",
        solutions: "Solutions",
        faq: "FAQ",
        contacts: "Contacts",
        terms: "Terms of Use"
      },
      ticker:
        "Excel VBA · Google Apps Script · Power BI · DAX · Power Query · Automated reports · Excel automation · Data processing · Data cleaning · Data parsing · Integrations · Macros · Custom logic · Business process automation · Analytics dashboards · Google Sheets automation · Web applications · JavaScript · Custom business solutions ·",
      rights: "All rights reserved.",
      terms: "Terms of Use"
    },

    ru: {
      suffix: "-ru",
      home: "← На главную",
      menuLabel: "Открыть меню",
      nav: {
        about: "Обо мне",
        services: "Услуги",
        pricing: "Ценовая политика",
        solutions: "Решения",
        faq: "FAQ",
        contacts: "Контакты",
        terms: "Условия использования"
      },
      ticker:
        "Excel VBA · Google Apps Script · Power BI · DAX · Power Query · Автоматические отчёты · Автоматизация Excel · Обработка данных · Очистка данных · Парсинг данных · Интеграции · Макросы · Кастомная логика · Автоматизация бизнес-процессов · Аналитические дашборды · Автоматизация Google Sheets · Веб-приложения · JavaScript · Индивидуальные решения для бизнеса ·",
      rights: "Все права защищены.",
      terms: "Условия использования"
    }
  };

  const pages = [
    "about",
    "services",
    "pricing",
    "solutions",
    "faq",
    "contacts"
  ];

  function getLanguage() {
    const lang =
      document.documentElement.lang
        ?.toLowerCase()
        .split("-")[0];

    if (lang === "en") return "en";
    if (lang === "ru") return "ru";

    return "uk";
  }

  function getCurrentPage() {
    const filename =
      window.location.pathname
        .split("/")
        .pop()
        .toLowerCase();

    if (
      filename === "" ||
      filename === "index.html" ||
      filename === "index-en.html" ||
      filename === "index-ru.html"
    ) {
      return "index";
    }

    for (const page of [
      ...pages,
      "terms"
    ]) {
      if (
        filename === `${page}.html` ||
        filename === `${page}-en.html` ||
        filename === `${page}-ru.html`
      ) {
        return page;
      }
    }

    return "";
  }

  function pageUrl(page, lang) {
    const suffix =
      languages[lang].suffix;

    if (page === "index") {
      return lang === "uk"
        ? "/index.html"
        : `/index${suffix}.html`;
    }

    return lang === "uk"
      ? `/${page}.html`
      : `/${page}${suffix}.html`;
  }

  async function loadComponent(
    selector,
    url
  ) {
    const container =
      document.querySelector(selector);

    if (!container) return;

    try {
      const response =
        await fetch(url);

      if (!response.ok) {
        throw new Error(
          `HTTP ${response.status}`
        );
      }

      container.innerHTML =
        await response.text();
    } catch (error) {
      console.error(
        `Component load failed: ${url}`,
        error
      );
    }
  }

  function buildNavigation(
    lang,
    currentPage
  ) {
    const text =
      languages[lang];

    const desktopNav =
      document.querySelector(
        "[data-component-desktop-nav]"
      );

    const mobileNav =
      document.querySelector(
        "[data-component-mobile-nav]"
      );

    if (desktopNav) {
      desktopNav.innerHTML =
        pages
          .map(page => {
            const active =
              currentPage === page
                ? ' class="active"'
                : "";

            return `<a href="${pageUrl(
              page,
              lang
            )}"${active}>${
              text.nav[page]
            }</a>`;
          })
          .join("");
    }

    if (mobileNav) {
      const mobilePages = [
        "index",
        ...pages,
        "terms"
      ];

      mobileNav.innerHTML =
        mobilePages
          .map(page => {
            const active =
              currentPage === page
                ? ' class="active"'
                : "";

            const label =
              page === "index"
                ? lang === "uk"
                  ? "Головна"
                  : lang === "ru"
                    ? "Главная"
                    : "Home"
                : text.nav[page];

            return `<a href="${pageUrl(
              page,
              lang
            )}"${active}>${label}</a>`;
          })
          .join("");
    }
  }

  function setupHeader(
    lang,
    currentPage
  ) {
    const text =
      languages[lang];

    const homeLink =
      document.querySelector(
        "[data-component-home]"
      );

    if (homeLink) {
      homeLink.textContent =
        text.home;

      homeLink.href =
        pageUrl(
          "index",
          lang
        );
    }

    const mobileMenuButton =
      document.querySelector(
        ".mobile-menu-button"
      );

    if (mobileMenuButton) {
      mobileMenuButton.setAttribute(
        "aria-label",
        text.menuLabel
      );
    }

    buildNavigation(
      lang,
      currentPage
    );

    document
      .querySelectorAll(
        ".lang-switcher button"
      )
      .forEach(button => {
        const targetLang =
          button.dataset.lang;

        button.classList.toggle(
          "active",
          targetLang === lang
        );

        button.addEventListener(
          "click",
          () => {
            const target =
              currentPage ||
              "index";

            window.location.href =
              pageUrl(
                target,
                targetLang
              );
          }
        );
      });

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
          isOpen
            ? "true"
            : "false"
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
  }

  function setupFooter(lang) {
    const text =
      languages[lang];

    const ticker =
      document.querySelector(
        "[data-component-ticker]"
      );

    if (ticker) {
      ticker.textContent =
        text.ticker;
    }

    const footerCopy =
      document.querySelector(
        "[data-component-footer-copy]"
      );

    if (footerCopy) {
      footerCopy.innerHTML =
        `© 2015–2026 Sebastian Automations. ${text.rights} <a href="${pageUrl(
          "terms",
          lang
        )}">${text.terms}</a>`;
    }
  }

  async function init() {
    const lang =
      getLanguage();

    const currentPage =
      getCurrentPage();

    await Promise.all([
      loadComponent(
        "#site-header-slot",
        "/components/header.html"
      ),
      loadComponent(
        "#site-footer-slot",
        "/components/footer.html"
      )
    ]);

    setupHeader(
      lang,
      currentPage
    );

    setupFooter(lang);
  }

  if (
    document.readyState ===
    "loading"
  ) {
    document.addEventListener(
      "DOMContentLoaded",
      init
    );
  } else {
    init();
  }
})();
