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
let secondTimer;
let hideTimer;

function getCurrentLanguage() {
    const lang = document.documentElement.lang.toLowerCase();

    if (lang.startsWith("uk")) {
        return "uk";
    }

    if (lang.startsWith("ru")) {
        return "ru";
    }

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
    if (assistantVisible) {
        return;
    }

    assistantVisible = true;

    const lang = getCurrentLanguage();

    const assistant =
        document.getElementById("sp-assistant");

    const message =
        document.getElementById("sp-assistant-message");

    const phrases = assistantMessages[lang];

    message.textContent =
        phrases[
            Math.floor(Math.random() * phrases.length)
        ];

    assistant.classList.add("show");

    secondTimer = setTimeout(() => {
        message.textContent =
            assistantFollowUp[lang].waiting;
    }, 60000);

    hideTimer = setTimeout(() => {
        message.textContent =
            assistantFollowUp[lang].goodbye;

        setTimeout(() => {
            hideAssistant();
        }, 3000);

    }, 120000);
}

function hideAssistant() {
    assistantVisible = false;

    clearTimeout(secondTimer);
    clearTimeout(hideTimer);

    document
        .getElementById("sp-assistant")
        .classList.remove("show");
}

function resetTimer() {
    clearTimeout(inactivityTimer);

    if (assistantVisible) {
        hideAssistant();
    }

    inactivityTimer = setTimeout(
        showAssistant,
        60000
    );
}

document.addEventListener(
    "DOMContentLoaded",
    () => {
        createAssistant();
        resetTimer();

        [
            "mousemove",
            "mousedown",
            "keydown",
            "touchstart",
            "scroll"
        ].forEach(eventName => {
            document.addEventListener(
                eventName,
                resetTimer,
                { passive: true }
            );
        });
    }
);

document.addEventListener("DOMContentLoaded", () => {

    const assistant = document.createElement("div");
    assistant.id = "sp-assistant";

    assistant.innerHTML = `
        <img
            id="sp-assistant-avatar"
            src="/assistant-avatar.png"
            alt="Assistant"
        >

        <div id="sp-assistant-message">
            Добрий день! Чим я можу допомогти?
        </div>
    `;

    document.body.appendChild(assistant);

    setTimeout(() => {
        assistant.classList.add("show");
    }, 1000);

});
