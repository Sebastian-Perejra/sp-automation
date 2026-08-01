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
  const buttons = document.querySelectorAll(".lang-switcher a");

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
});
