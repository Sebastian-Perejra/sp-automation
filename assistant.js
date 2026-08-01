const assistantMessages = {
    uk: [
        "👋 Усе гаразд?",
        "🤖 Поки ви думаєте, я вже думаю, як це автоматизувати.",
        "☕ Не втомилися?",
        "🔍 Шукаєте щось конкретне?",
        "⚡ Можливо, рішення вже існує.",
        "🚀 Іноді все починається з однієї ідеї.",
        "🧩 Спробуємо підібрати рішення?",
        "💬 Опишіть завдання двома реченнями.",
        "📊 Показати схожий проєкт?",
        "🤝 Не знайшли потрібний розділ?"
    ],

    ru: [
        "👋 Всё в порядке?",
        "🤖 Пока вы думаете, я уже думаю, как это автоматизировать.",
        "☕ Не устали?",
        "🔍 Ищете что-то конкретное?",
        "⚡ Возможно, решение уже существует.",
        "🚀 Иногда всё начинается с одной идеи.",
        "🧩 Попробуем подобрать решение?",
        "💬 Опишите задачу двумя предложениями.",
        "📊 Показать похожий проект?",
        "🤝 Не нашли нужный раздел?"
    ],

    en: [
        "👋 Everything okay?",
        "🤖 While you think, I am already thinking about automation.",
        "☕ Need a short break?",
        "🔍 Looking for something specific?",
        "⚡ A solution may already exist.",
        "🚀 Every automation starts with an idea.",
        "🧩 Shall we find the right solution?",
        "💬 Describe your task in two sentences.",
        "📊 Want to see a similar project?",
        "🤝 Didn't find the right section?"
    ]
};

const assistantFollowUp = {
    uk: {
        waiting: "👀 Я все ще тут.",
        goodbye: "🤖 Добре, не буду заважати."
    },

    ru: {
        waiting: "👀 Я всё ещё здесь.",
        goodbye: "🤖 Хорошо, не буду мешать."
    },

    en: {
        waiting: "👀 I am still here.",
        goodbye: "🤖 All right, I won't disturb you."
    }
};

let assistantVisible = false;
let inactivityTimer;
let waitingTimer;
let goodbyeTimer;
let finalHideTimer;
let assistantHasGreeted = false;

const assistantGreetings = {
    uk: {
        morning: "Доброго ранку!",
        day: "Добрий день!",
        evening: "Добрий вечір!",
        night: "Доброї ночі!"
    },

    ru: {
        morning: "Доброе утро!",
        day: "Добрый день!",
        evening: "Добрый вечер!",
        night: "Доброй ночи!"
    },

    en: {
        morning: "Good morning!",
        day: "Good afternoon!",
        evening: "Good evening!",
        night: "Good night!"
    }
};

function getTimeGreeting(lang) {
    const hour = new Date().getHours();

    if (hour >= 6 && hour < 11) {
        return assistantGreetings[lang].morning;
    }

    if (hour >= 11 && hour < 18) {
        return assistantGreetings[lang].day;
    }

    if (hour >= 18 && hour < 23) {
        return assistantGreetings[lang].evening;
    }

    return assistantGreetings[lang].night;
}

function getCurrentLanguage() {
    const lang = document.documentElement.lang.toLowerCase();

    if (lang.startsWith("uk")) return "uk";
    if (lang.startsWith("ru")) return "ru";

    return "en";
}

function createAssistant() {
    const assistant = document.createElement("div");

    assistant.id = "sp-assistant";

    assistant.innerHTML = `
        <img
            id="sp-assistant-avatar"
            src="/assistant-avatar.png"
            alt="Assistant"
        >

        <div id="sp-assistant-message"></div>
    `;

    document.body.appendChild(assistant);
}

function showAssistant() {
    if (assistantVisible) return;

    assistantVisible = true;

    const lang = getCurrentLanguage();
    const assistant = document.getElementById("sp-assistant");
    const message = document.getElementById("sp-assistant-message");
    const phrases = assistantMessages[lang];

    const randomPhrase =
    phrases[Math.floor(Math.random() * phrases.length)];

if (!assistantHasGreeted) {
    const greeting = getTimeGreeting(lang);
    message.textContent = greeting + " " + randomPhrase;
    assistantHasGreeted = true;
} else {
    message.textContent = randomPhrase;
}

    assistant.classList.add("show");
    playAssistantSound();

    waitingTimer = setTimeout(() => {
        message.textContent = assistantFollowUp[lang].waiting;
    }, 60000);

    goodbyeTimer = setTimeout(() => {
        message.textContent = assistantFollowUp[lang].goodbye;

        finalHideTimer = setTimeout(() => {
            hideAssistant();
        }, 3000);
    }, 120000);
}

function hideAssistant() {
    assistantVisible = false;

    clearTimeout(waitingTimer);
    clearTimeout(goodbyeTimer);
    clearTimeout(finalHideTimer);

    const assistant = document.getElementById("sp-assistant");

    if (assistant) {
        assistant.classList.remove("show");
    }
}

function resetInactivityTimer() {
    clearTimeout(inactivityTimer);

    if (assistantVisible) {
        hideAssistant();
    }

    inactivityTimer = setTimeout(() => {
        showAssistant();
        playAssistantSound();
    }, 60000);
}

let assistantAudioContext = null;

function unlockAssistantAudio() {
    if (!assistantAudioContext) {
        assistantAudioContext = new (
            window.AudioContext ||
            window.webkitAudioContext
        )();
    }

    if (assistantAudioContext.state === "suspended") {
        assistantAudioContext.resume();
    }
}

function playAssistantSound() {
    if (!assistantAudioContext) return;

    const ctx = assistantAudioContext;
    const now = ctx.currentTime;

    const oscillator = ctx.createOscillator();
    const gain = ctx.createGain();

    oscillator.type = "sine";

    oscillator.frequency.setValueAtTime(740, now);
    oscillator.frequency.exponentialRampToValueAtTime(
        1180,
        now + 0.11
    );

    gain.gain.setValueAtTime(0.12, now);
    gain.gain.exponentialRampToValueAtTime(
        0.001,
        now + 0.3
    );

    oscillator.connect(gain);
    gain.connect(ctx.destination);

    oscillator.start(now);
    oscillator.stop(now + 0.3);
}

document.addEventListener("DOMContentLoaded", () => {
    createAssistant();
    resetInactivityTimer();
        ["pointerdown", "keydown", "touchstart"].forEach(eventName => {
        document.addEventListener(
            eventName,
            unlockAssistantAudio,
            { once: true, passive: true }
        );
    });

    [
        "mousemove",
        "mousedown",
        "keydown",
        "touchstart",
        "scroll"
    ].forEach(eventName => {
        document.addEventListener(
            eventName,
            resetInactivityTimer,
            { passive: true }
        );
    });
});
document.addEventListener("DOMContentLoaded", () => {
  const path = window.location.pathname.toLowerCase();
  const fileName = path.split("/").pop() || "index.html";

  let language = "ua";
  let suffix = "";
  let activeLanguage = "UA";

  if (fileName.includes("-en.html")) {
    language = "en";
    suffix = "-en";
    activeLanguage = "EN";
  } else if (fileName.includes("-ru.html")) {
    language = "ru";
    suffix = "-ru";
    activeLanguage = "RU";
  }

  const languageButtons = document.querySelectorAll(
    ".lang-switcher a, .lang-switcher button"
  );

  languageButtons.forEach(button => {
    const isActive =
      button.textContent.trim().toUpperCase() === activeLanguage;

    button.classList.toggle("active-language", isActive);

    if (isActive) {
      button.setAttribute("aria-current", "page");
    } else {
      button.removeAttribute("aria-current");
    }
  });

  const nav = document.querySelector(".desktop-nav");

  if (!nav) return;

  const labels = {
    ua: {
      about: "Про мене",
      services: "Послуги",
      pricing: "Цінова політика",
      solutions: "Рішення",
      faq: "FAQ",
      contacts: "Контакти"
    },
    en: {
      about: "About Me",
      services: "Services",
      pricing: "Pricing",
      solutions: "Solutions",
      faq: "FAQ",
      contacts: "Contacts"
    },
    ru: {
      about: "Обо мне",
      services: "Услуги",
      pricing: "Ценовая политика",
      solutions: "Решения",
      faq: "FAQ",
      contacts: "Контакты"
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

  const currentPage = fileName
    .replace("-en.html", "")
    .replace("-ru.html", "")
    .replace(".html", "");

  nav.innerHTML = pages
    .map(page => {
      const isActive = page === currentPage;

      return `
        <a
          href="${page}${suffix}.html"
          class="${isActive ? "active-page" : ""}"
          ${isActive ? 'aria-current="page"' : ""}
        >
          ${labels[language][page]}
        </a>
      `;
    })
    .join("");
});

  let activeLanguage = "UA";

  if (path.includes("-en.html")) {
    activeLanguage = "EN";
  } else if (path.includes("-ru.html")) {
    activeLanguage = "RU";
  }

  buttons.forEach(button => {
    const isActive =
      button.textContent.trim().toUpperCase() === activeLanguage;

    button.classList.toggle("active-language", isActive);
    button.setAttribute("aria-current", isActive ? "page" : "false");
  });

document.addEventListener("DOMContentLoaded", () => {
  const nav = document.querySelector(".desktop-nav");

  if (!nav) return;

  const path = window.location.pathname.toLowerCase();
  const fileName = path.split("/").pop() || "index.html";

  let language = "ua";
  let suffix = "";

  if (fileName.includes("-en.html")) {
    language = "en";
    suffix = "-en";
  } else if (fileName.includes("-ru.html")) {
    language = "ru";
    suffix = "-ru";
  }

  const labels = {
    ua: {
      about: "Про мене",
      services: "Послуги",
      pricing: "Цінова політика",
      solutions: "Рішення",
      faq: "FAQ",
      contacts: "Контакти"
    },
    en: {
      about: "About Me",
      services: "Services",
      pricing: "Pricing",
      solutions: "Solutions",
      faq: "FAQ",
      contacts: "Contacts"
    },
    ru: {
      about: "Обо мне",
      services: "Услуги",
      pricing: "Ценовая политика",
      solutions: "Решения",
      faq: "FAQ",
      contacts: "Контакты"
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

  const currentPage = fileName
    .replace("-en.html", "")
    .replace("-ru.html", "")
    .replace(".html", "");

  nav.innerHTML = pages
    .map(page => {
      const activeClass = page === currentPage ? "active-page" : "";
      const ariaCurrent =
        page === currentPage ? 'aria-current="page"' : "";

      return `
        <a
          class="${activeClass}"
          href="${page}${suffix}.html"
          ${ariaCurrent}
        >
          ${labels[language][page]}
        </a>
      `;
    })
    .join("");
});

  navLinks.forEach(link => {
    const href = link.getAttribute("href")?.toLowerCase();

    if (!href) return;

    const linkFile = href.split("/").pop();
    const currentFile = path.split("/").pop() || "index.html";

    const isActive =
      linkFile === currentFile ||
      (currentFile === "" && linkFile === "index.html");

    link.classList.toggle("active-page", isActive);

    if (isActive) {
      link.setAttribute("aria-current", "page");
    } else {
      link.removeAttribute("aria-current");
    }
  });
});
