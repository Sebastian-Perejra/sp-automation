document.addEventListener("DOMContentLoaded", () => {
  const trigger = document.querySelector(".pricing-estimator-trigger");
  const panel = document.querySelector(".pricing-estimator-panel");
  const overlay = document.querySelector(".pricing-estimator-overlay");
  const closeButton = document.querySelector(".pricing-estimator-close");
  const content = document.querySelector(".pricing-estimator-content");
  const backButton = document.querySelector(".pricing-estimator-back");
  const resetButton = document.querySelector(".pricing-estimator-reset");
  const tiredButton = document.querySelector(".pricing-estimator-tired");
  const progressBar = document.querySelector(".pricing-estimator-progress-bar");
  const progressValue = document.querySelector(".pricing-estimator-progress-value");
  const progressLabel = document.querySelector(".pricing-estimator-progress-label");

  if (
    !trigger ||
    !panel ||
    !overlay ||
    !closeButton ||
    !content
  ) {
    return;
  }

  const questions = {
    start: {
      title: "Що потрібно зробити?",
      hint: "Оберіть напрямок, який найбільше схожий на ваше завдання.",
      options: [
        ["powerbi", "Power BI"],
        ["excel", "Excel / Google Sheets"],
        ["reports", "Автоматизація звітів"],
        ["telegram", "Telegram-бот"],
        ["documents", "PDF / рахунки / документи"],
        ["integration", "Інтеграція систем / API"],
        ["other", "Інше або поки не знаю"]
      ]
    },

    powerbi_type: {
      title: "Що потрібно зробити з Power BI?",
      options: [
        ["new", "Створити новий звіт"],
        ["improve", "Доопрацювати існуючий"],
        ["refresh", "Налаштувати автоматичне оновлення"],
        ["fix", "Виправити проблему"],
        ["full", "Комплексне рішення"]
      ]
    },

    powerbi_license: {
      title: "Чи налаштований у вас Power BI для публікації та спільної роботи?",
      hint: "Якщо ні — можемо врахувати налаштування та ліцензування окремо.",
      options: [
        ["yes", "Так"],
        ["no", "Ні"],
        ["unknown", "Не знаю"]
      ]
    },

    powerbi_sources: {
      title: "Звідки надходять дані?",
      hint: "Можна вибрати кілька варіантів.",
      multiple: true,
      options: [
        ["excel", "Excel / CSV"],
        ["sheets", "Google Sheets"],
        ["crm", "CRM / ERP"],
        ["api", "API / веб-сервіс"],
        ["database", "База даних"],
        ["other", "Інше"]
      ]
    },

    powerbi_visuals: {
      title: "Скільки візуалізацій приблизно потрібно?",
      options: [
        ["1", "1"],
        ["2-3", "2–3"],
        ["4-5", "4–5"],
        ["6+", "Більше 5"]
      ]
    },

    powerbi_complexity: {
      title: "Яка логіка потрібна у звіті?",
      hint: "Не потрібно знати технічні терміни — оберіть найближчий варіант.",
      options: [
        ["simple", "Базові показники, таблиці та графіки"],
        ["medium", "Фільтри, порівняння, KPI та розрахунки"],
        ["complex", "Складна бізнес-логіка та багато взаємозалежних показників"],
        ["unknown", "Не знаю — потрібно визначити"]
      ]
    },

    powerbi_users: {
      title: "Скільки людей повинні користуватися результатом?",
      hint: "Для Power BI кожному користувачу може знадобитися окрема ліцензія залежно від способу публікації.",
      options: [
        ["1", "1 користувач"],
        ["2-5", "2–5"],
        ["6-20", "6–20"],
        ["20+", "Більше 20"],
        ["unknown", "Не знаю"]
      ]
    },

    excel_type: {
      title: "Що потрібно зробити в Excel або Google Sheets?",
      multiple: true,
      options: [
        ["automation", "Автоматизувати ручну роботу"],
        ["formulas", "Формули та розрахунки"],
        ["reports", "Звіти / дашборди"],
        ["data", "Обробка та очищення даних"],
        ["files", "Об'єднання або створення файлів"],
        ["integration", "Обмін даними з іншою системою"],
        ["existing", "Доопрацювати існуючий файл"],
        ["other", "Інше"]
      ]
    },

    excel_platform: {
      title: "Де повинно працювати рішення?",
      options: [
        ["excel", "Microsoft Excel"],
        ["sheets", "Google Sheets"],
        ["both", "Excel і Google Sheets"],
        ["unknown", "Не знаю"]
      ]
    },

    excel_volume: {
      title: "Який приблизно обсяг даних?",
      options: [
        ["small", "До кількох тисяч рядків"],
        ["medium", "Десятки тисяч рядків"],
        ["large", "Сотні тисяч рядків або більше"],
        ["unknown", "Не знаю"]
      ]
    },

    excel_sources: {
      title: "Звідки потрібно отримувати дані?",
      multiple: true,
      options: [
        ["manual", "Користувач вводить вручну"],
        ["excel", "Інші Excel / CSV файли"],
        ["sheets", "Google Sheets"],
        ["crm", "CRM / ERP"],
        ["api", "API / веб-сервіс"],
        ["email", "Email / вкладення"],
        ["other", "Інше"]
      ]
    },

    excel_process: {
      title: "Наскільки великий процес потрібно автоматизувати?",
      options: [
        ["one", "Одну конкретну операцію"],
        ["several", "Кілька пов'язаних операцій"],
        ["full", "Повний процес від вхідних даних до результату"],
        ["unknown", "Не знаю — хочу прибрати ручну роботу"]
      ]
    },

    excel_launch: {
      title: "Як повинна запускатися автоматизація?",
      multiple: true,
      options: [
        ["button", "Кнопкою користувача"],
        ["schedule", "Автоматично за розкладом"],
        ["event", "При появі або зміні даних"],
        ["both", "Ручний та автоматичний режим"],
        ["unknown", "Не знаю"]
      ]
    },

    reports_sources: {
      title: "Звідки беруться дані для звіту?",
      multiple: true,
      options: [
        ["excel", "Excel / CSV"],
        ["sheets", "Google Sheets"],
        ["crm", "CRM / ERP"],
        ["email", "Email / вкладення"],
        ["api", "API"],
        ["multiple", "З кількох різних джерел"]
      ]
    },

    reports_count: {
      title: "Скільки різних звітів потрібно автоматизувати?",
      options: [
        ["1", "1"],
        ["2-3", "2–3"],
        ["4-5", "4–5"],
        ["6+", "Більше 5"]
      ]
    },

    reports_frequency: {
      title: "Як часто потрібно формувати звіт?",
      options: [
        ["manual", "За запитом"],
        ["daily", "Щодня"],
        ["weekly", "Щотижня"],
        ["monthly", "Щомісяця"],
        ["event", "При появі нових даних"]
      ]
    },

    reports_delivery: {
      title: "Що має відбуватися з готовим звітом?",
      multiple: true,
      options: [
        ["save", "Зберегти у файл / папку"],
        ["email", "Надіслати email"],
        ["telegram", "Надіслати в Telegram"],
        ["dashboard", "Оновити дашборд"],
        ["other", "Інший сценарій"]
      ]
    },

    telegram_type: {
      title: "Що потрібно зробити з Telegram-ботом?",
      options: [
        ["new", "Створити нового бота"],
        ["improve", "Доопрацювати існуючого"],
        ["fix", "Виправити проблему"],
        ["unknown", "Потрібна консультація"]
      ]
    },

    telegram_functions: {
      title: "Що повинен уміти бот?",
      multiple: true,
      options: [
        ["notifications", "Надсилати повідомлення / нагадування"],
        ["forms", "Приймати дані від користувача"],
        ["files", "Приймати або відправляти файли"],
        ["sheets", "Працювати з Google Sheets"],
        ["api", "Працювати з іншою системою / API"],
        ["roles", "Різні ролі користувачів"],
        ["commands", "Кнопки, меню та сценарії діалогу"],
        ["other", "Інше"]
      ]
    },

    telegram_users: {
      title: "Скільки користувачів приблизно працюватиме з ботом?",
      options: [
        ["1-10", "До 10"],
        ["11-50", "11–50"],
        ["51-200", "51–200"],
        ["200+", "Більше 200"],
        ["unknown", "Не знаю"]
      ]
    },

    telegram_complexity: {
      title: "Наскільки складним буде сценарій роботи?",
      options: [
        ["simple", "Кілька простих команд"],
        ["medium", "Кілька пов'язаних сценаріїв"],
        ["complex", "Багато станів, ролей та логіки"],
        ["unknown", "Не знаю"]
      ]
    },

    documents_type: {
      title: "Які документи потрібно обробляти?",
      multiple: true,
      options: [
        ["invoice", "Рахунки / invoices"],
        ["pdf", "PDF-документи"],
        ["scans", "Скани / фотографії"],
        ["orders", "Замовлення / заявки"],
        ["other", "Інші документи"]
      ]
    },

    documents_templates: {
      title: "Скільки різних форматів документів приблизно є?",
      options: [
        ["1", "Один стабільний формат"],
        ["2-5", "2–5 форматів"],
        ["6+", "Багато різних форматів"],
        ["unknown", "Не знаю"]
      ]
    },

    documents_volume: {
      title: "Скільки документів потрібно обробляти?",
      options: [
        ["small", "До 50 на місяць"],
        ["medium", "50–500 на місяць"],
        ["large", "Більше 500 на місяць"],
        ["unknown", "Не знаю"]
      ]
    },

    documents_result: {
      title: "Куди повинні потрапляти отримані дані?",
      multiple: true,
      options: [
        ["excel", "Excel"],
        ["sheets", "Google Sheets"],
        ["crm", "CRM / ERP"],
        ["database", "База даних"],
        ["api", "Інша система / API"]
      ]
    },

    integration_systems: {
      title: "Що потрібно зв'язати між собою?",
      multiple: true,
      options: [
        ["excel", "Excel / Google Sheets"],
        ["crm", "CRM / ERP"],
        ["telegram", "Telegram"],
        ["email", "Email"],
        ["api", "Веб-сервіс / API"],
        ["other", "Інші системи"]
      ]
    },

    integration_direction: {
      title: "Як повинні передаватися дані?",
      options: [
        ["oneway", "З однієї системи в іншу"],
        ["twoway", "В обидві сторони"],
        ["multiple", "Між кількома системами"],
        ["unknown", "Не знаю"]
      ]
    },

    integration_api: {
      title: "Чи є доступ до API або технічної документації системи?",
      options: [
        ["yes", "Так"],
        ["no", "Ні"],
        ["unknown", "Не знаю"]
      ]
    },

    integration_frequency: {
      title: "Як часто потрібно синхронізувати дані?",
      options: [
        ["manual", "За запитом"],
        ["schedule", "За розкладом"],
        ["realtime", "Практично одразу"],
        ["unknown", "Не знаю"]
      ]
    },

    other_type: {
      title: "Що найближче описує ваше завдання?",
      options: [
        ["data", "Робота з даними"],
        ["automation", "Автоматизація процесу"],
        ["report", "Звітність"],
        ["integration", "Обмін між системами"],
        ["problem", "Є проблема, але я не знаю яке потрібне рішення"]
      ]
    },

    common_existing: {
      title: "Рішення потрібно створити з нуля чи щось уже є?",
      options: [
        ["new", "З нуля"],
        ["existing", "Є існуюче рішення, потрібно доопрацювати"],
        ["broken", "Є рішення, але воно працює неправильно"],
        ["unknown", "Не знаю"]
      ]
    },

    common_urgency: {
      title: "Наскільки терміново потрібен результат?",
      options: [
        ["normal", "Без жорсткого дедлайну"],
        ["week", "Бажано протягом тижня"],
        ["urgent", "Потрібно максимально швидко"],
        ["date", "Є конкретний дедлайн"]
      ]
    },

    common_support: {
      title: "Чи потрібна підтримка після запуску?",
      options: [
        ["no", "Ні, достатньо передати готове рішення"],
        ["short", "Так, на період запуску"],
        ["ongoing", "Так, потрібна подальша підтримка"],
        ["unknown", "Поки не знаю"]
      ]
    }
  };

  const flows = {
    powerbi: [
      "powerbi_type",
      "powerbi_license",
      "powerbi_sources",
      "powerbi_visuals",
      "powerbi_complexity",
      "powerbi_users",
      "common_existing",
      "common_urgency",
      "common_support"
    ],

    excel: [
      "excel_type",
      "excel_platform",
      "excel_volume",
      "excel_sources",
      "excel_process",
      "excel_launch",
      "common_existing",
      "common_urgency",
      "common_support"
    ],

    reports: [
      "reports_sources",
      "reports_count",
      "reports_frequency",
      "reports_delivery",
      "common_existing",
      "common_urgency",
      "common_support"
    ],

    telegram: [
      "telegram_type",
      "telegram_functions",
      "telegram_users",
      "telegram_complexity",
      "common_existing",
      "common_urgency",
      "common_support"
    ],

    documents: [
      "documents_type",
      "documents_templates",
      "documents_volume",
      "documents_result",
      "common_existing",
      "common_urgency",
      "common_support"
    ],

    integration: [
      "integration_systems",
      "integration_direction",
      "integration_api",
      "integration_frequency",
      "common_existing",
      "common_urgency",
      "common_support"
    ],

    other: [
      "other_type",
      "common_existing",
      "common_urgency",
      "common_support"
    ]
  };

  let selectedFlow = null;
  let flow = ["start"];
  let stepIndex = 0;
  let answers = {};

  function openEstimator() {
    panel.classList.add("is-open");
    overlay.classList.add("is-open");
    document.body.classList.add("pricing-estimator-open");

    panel.setAttribute("aria-hidden", "false");
    overlay.setAttribute("aria-hidden", "false");

    render();
  }

  function closeEstimator() {
    panel.classList.remove("is-open");
    overlay.classList.remove("is-open");
    document.body.classList.remove("pricing-estimator-open");

    panel.setAttribute("aria-hidden", "true");
    overlay.setAttribute("aria-hidden", "true");
  }

  function resetEstimator() {
    selectedFlow = null;
    flow = ["start"];
    stepIndex = 0;
    answers = {};

    render();
  }

  function getCurrentQuestionId() {
    return flow[stepIndex];
  }

  function getCurrentQuestion() {
    return questions[getCurrentQuestionId()];
  }

  function updateProgress() {
    let percentage = 0;

    if (selectedFlow) {
      percentage = Math.round(
        (stepIndex / Math.max(flow.length, 1)) * 100
      );
    }

    if (progressBar) {
      progressBar.style.width = `${percentage}%`;
    }

    if (progressValue) {
      progressValue.textContent = `${percentage}%`;
    }

    if (progressLabel) {
      if (!selectedFlow) {
        progressLabel.textContent = "Початок";
      } else {
        progressLabel.textContent =
          `Крок ${Math.min(stepIndex + 1, flow.length)} з ${flow.length}`;
      }
    }
  }

  function selectSingle(questionId, value) {
    answers[questionId] = value;

    if (questionId === "start") {
      selectedFlow = value;
      flow = ["start", ...flows[value]];
      stepIndex = 1;
      render();
      return;
    }

    nextStep();
  }

  function toggleMultiple(questionId, value, button) {
    if (!Array.isArray(answers[questionId])) {
      answers[questionId] = [];
    }

    const selected = answers[questionId];
    const index = selected.indexOf(value);

    if (index === -1) {
      selected.push(value);
      button.classList.add("is-selected");
    } else {
      selected.splice(index, 1);
      button.classList.remove("is-selected");
    }

    const continueButton =
      content.querySelector(".pricing-estimator-continue");

    if (continueButton) {
      continueButton.disabled = selected.length === 0;
    }
  }

  function nextStep() {
    if (stepIndex < flow.length - 1) {
      stepIndex += 1;
      render();
      return;
    }

    showResult();
  }

  function previousStep() {
    if (stepIndex <= 0) {
      return;
    }

    stepIndex -= 1;

    if (stepIndex === 0) {
      selectedFlow = null;
      flow = ["start"];
    }

    render();
  }

  function render() {
    const questionId = getCurrentQuestionId();
    const question = getCurrentQuestion();

    if (!question) {
      resetEstimator();
      return;
    }

    updateProgress();

    if (backButton) {
      backButton.disabled = stepIndex === 0;
    }

    if (tiredButton) {
      tiredButton.style.display =
        stepIndex === 0 ? "none" : "block";
    }

    const wrapper = document.createElement("div");
    wrapper.className = "pricing-estimator-step";

    const number = document.createElement("div");
    number.className = "pricing-estimator-question-number";

    number.textContent =
      stepIndex === 0
        ? "Оберіть напрямок"
        : `Питання ${stepIndex}`;

    wrapper.appendChild(number);

    const title = document.createElement("h3");
    title.className = "pricing-estimator-question";
    title.textContent = question.title;

    wrapper.appendChild(title);

    if (question.hint) {
      const hint = document.createElement("p");
      hint.className = "pricing-estimator-hint";
      hint.textContent = question.hint;

      wrapper.appendChild(hint);
    }

    const options = document.createElement("div");
    options.className = "pricing-estimator-options";

    question.options.forEach(([value, label]) => {
      const button = document.createElement("button");

      button.type = "button";
      button.className = "pricing-estimator-option";
      button.textContent = label;

      const existing = answers[questionId];

      if (
        question.multiple &&
        Array.isArray(existing) &&
        existing.includes(value)
      ) {
        button.classList.add("is-selected");
      }

      if (!question.multiple && existing === value) {
        button.classList.add("is-selected");
      }

      button.addEventListener("click", () => {
        if (question.multiple) {
          toggleMultiple(questionId, value, button);
        } else {
          selectSingle(questionId, value);
        }
      });

      options.appendChild(button);
    });

    wrapper.appendChild(options);

    if (question.multiple) {
      const continueButton = document.createElement("button");

      continueButton.type = "button";
      continueButton.className = "pricing-estimator-continue";
      continueButton.textContent = "Продовжити";

      const existing = answers[questionId];

      continueButton.disabled =
        !Array.isArray(existing) || existing.length === 0;

      continueButton.addEventListener("click", nextStep);

      wrapper.appendChild(continueButton);
    }

    content.innerHTML = "";
    content.appendChild(wrapper);
  }

  function calculateEstimate() {
  const category = answers.start;

  const estimates = {
    powerbi: {
      min: 5,
      max: 9,
      label: "Базова оцінка Power BI"
    },
    excel: {
      min: 3,
      max: 6,
      label: "Базова оцінка Excel / Google Sheets"
    },
    reports: {
      min: 4,
      max: 8,
      label: "Базова оцінка автоматизації звітів"
    },
    telegram: {
      min: 5,
      max: 10,
      label: "Базова оцінка Telegram-бота"
    },
    documents: {
      min: 5,
      max: 10,
      label: "Базова оцінка обробки документів"
    },
    integration: {
      min: 8,
      max: 16,
      label: "Базова оцінка інтеграції"
    },
    other: {
      min: 4,
      max: 10,
      label: "Базова оцінка задачі"
    }
  };

  const base = estimates[category] || estimates.other;

  let minHours = base.min;
  let maxHours = base.max;

  const breakdown = [
    {
      label: base.label,
      minHours: base.min,
      maxHours: base.max
    }
  ];

  function addWork(label, min, max) {
    minHours += min;
    maxHours += max;

    breakdown.push({
      label,
      minHours: min,
      maxHours: max
    });
  }

  if (category === "powerbi") {
    if (answers.powerbi_type === "new") {
      addWork(
        "Створення нового звіту",
        2,
        4
      );
    }

    if (answers.powerbi_type === "full") {
      addWork(
        "Комплексне Power BI рішення",
        8,
        16
      );
    }

    if (answers.powerbi_license === "no") {
      addWork(
        "Налаштування Power BI",
        1,
        3
      );
    }

    const sources =
      answers.powerbi_sources || [];

    if (sources.length === 2) {
      addWork(
        "Два джерела даних",
        1,
        3
      );
    }

    if (sources.length >= 3) {
      addWork(
        "Кілька джерел даних",
        3,
        7
      );
    }

    if (
      sources.includes("api") ||
      sources.includes("database") ||
      sources.includes("crm")
    ) {
      addWork(
        "CRM / API / база даних",
        2,
        5
      );
    }

    if (answers.powerbi_visuals === "2-3") {
      addWork(
        "2–3 візуалізації",
        2,
        4
      );
    }

    if (answers.powerbi_visuals === "4-5") {
      addWork(
        "4–5 візуалізацій",
        4,
        8
      );
    }

    if (answers.powerbi_visuals === "6+") {
      addWork(
        "Більше 5 візуалізацій",
        7,
        14
      );
    }

    if (answers.powerbi_complexity === "medium") {
      addWork(
        "KPI, фільтри та розрахунки",
        3,
        6
      );
    }

    if (answers.powerbi_complexity === "complex") {
      addWork(
        "Складна бізнес-логіка",
        7,
        15
      );
    }
  }

  if (category === "excel") {
    const types =
      answers.excel_type || [];

    const sources =
      answers.excel_sources || [];

    const launches =
      answers.excel_launch || [];

    if (types.length >= 3) {
      addWork(
        "Кілька типів автоматизації",
        3,
        7
      );
    }

    if (
      types.includes("integration") ||
      types.includes("data")
    ) {
      addWork(
        "Обробка даних / інтеграція",
        2,
        5
      );
    }

    if (answers.excel_platform === "both") {
      addWork(
        "Excel + Google Sheets",
        3,
        7
      );
    }

    if (answers.excel_volume === "medium") {
      addWork(
        "Середній обсяг даних",
        1,
        3
      );
    }

    if (answers.excel_volume === "large") {
      addWork(
        "Великий обсяг даних",
        4,
        10
      );
    }

    if (sources.length >= 3) {
      addWork(
        "Кілька джерел даних",
        3,
        7
      );
    }

    if (
      sources.includes("crm") ||
      sources.includes("api") ||
      sources.includes("email")
    ) {
      addWork(
        "CRM / API / Email",
        2,
        6
      );
    }

    if (answers.excel_process === "several") {
      addWork(
        "Кілька пов'язаних операцій",
        3,
        6
      );
    }

    if (answers.excel_process === "full") {
      addWork(
        "Повний автоматизований процес",
        7,
        15
      );
    }

    if (
      launches.includes("schedule") ||
      launches.includes("event")
    ) {
      addWork(
        "Автоматичний запуск",
        2,
        5
      );
    }
  }

  if (category === "reports") {
    const sources =
      answers.reports_sources || [];

    const delivery =
      answers.reports_delivery || [];

    if (sources.length >= 3) {
      addWork(
        "Кілька джерел даних",
        3,
        7
      );
    }

    if (
      sources.includes("crm") ||
      sources.includes("api") ||
      sources.includes("multiple")
    ) {
      addWork(
        "CRM / API / комплексні джерела",
        3,
        7
      );
    }

    if (answers.reports_count === "2-3") {
      addWork(
        "2–3 звіти",
        3,
        6
      );
    }

    if (answers.reports_count === "4-5") {
      addWork(
        "4–5 звітів",
        6,
        12
      );
    }

    if (answers.reports_count === "6+") {
      addWork(
        "Більше 5 звітів",
        10,
        20
      );
    }

    if (delivery.length >= 2) {
      addWork(
        "Кілька каналів доставки",
        2,
        5
      );
    }

    if (answers.reports_frequency !== "manual") {
      addWork(
        "Автоматичне формування",
        1,
        4
      );
    }
  }

  if (category === "telegram") {
    const functions =
      answers.telegram_functions || [];

    if (functions.length >= 3) {
      addWork(
        "Кілька функцій бота",
        4,
        8
      );
    }

    if (functions.length >= 5) {
      addWork(
        "Розширений функціонал",
        4,
        10
      );
    }

    if (
      functions.includes("api") ||
      functions.includes("roles")
    ) {
      addWork(
        "API / ролі користувачів",
        3,
        7
      );
    }

    if (answers.telegram_complexity === "medium") {
      addWork(
        "Кілька пов'язаних сценаріїв",
        4,
        8
      );
    }

    if (answers.telegram_complexity === "complex") {
      addWork(
        "Складна логіка бота",
        10,
        20
      );
    }

    if (answers.telegram_users === "200+") {
      addWork(
        "Велика кількість користувачів",
        3,
        8
      );
    }
  }

  if (category === "documents") {
    const types =
      answers.documents_type || [];

    const results =
      answers.documents_result || [];

    if (types.includes("scans")) {
      addWork(
        "Скани / фотографії",
        4,
        10
      );
    }

    if (types.length >= 3) {
      addWork(
        "Кілька типів документів",
        3,
        7
      );
    }

    if (answers.documents_templates === "2-5") {
      addWork(
        "2–5 форматів документів",
        4,
        10
      );
    }

    if (answers.documents_templates === "6+") {
      addWork(
        "Багато форматів документів",
        10,
        24
      );
    }

    if (answers.documents_volume === "medium") {
      addWork(
        "50–500 документів на місяць",
        2,
        5
      );
    }

    if (answers.documents_volume === "large") {
      addWork(
        "Понад 500 документів на місяць",
        5,
        12
      );
    }

    if (
      results.includes("crm") ||
      results.includes("database") ||
      results.includes("api")
    ) {
      addWork(
        "Передача даних у зовнішню систему",
        3,
        8
      );
    }
  }

  if (category === "integration") {
    const systems =
      answers.integration_systems || [];

    if (systems.length >= 3) {
      addWork(
        "Кілька систем",
        5,
        12
      );
    }

    if (answers.integration_direction === "twoway") {
      addWork(
        "Двосторонній обмін",
        6,
        14
      );
    }

    if (answers.integration_direction === "multiple") {
      addWork(
        "Обмін між кількома системами",
        10,
        22
      );
    }

    if (answers.integration_api === "no") {
      addWork(
        "Відсутній готовий API",
        5,
        15
      );
    }

    if (answers.integration_api === "unknown") {
      addWork(
        "API потребує перевірки",
        2,
        8
      );
    }

    if (answers.integration_frequency === "realtime") {
      addWork(
        "Синхронізація майже в реальному часі",
        5,
        12
      );
    }
  }

  if (answers.common_existing === "existing") {
    addWork(
      "Доопрацювання існуючого рішення",
      1,
      4
    );
  }

  if (answers.common_existing === "broken") {
    addWork(
      "Діагностика та виправлення",
      2,
      6
    );
  }

  if (answers.common_support === "short") {
    addWork(
      "Підтримка під час запуску",
      1,
      3
    );
  }

  if (answers.common_support === "ongoing") {
    addWork(
      "Розширена підтримка",
      3,
      8
    );
  }

  minHours =
    Math.max(
      2,
      Math.round(minHours)
    );

  maxHours =
    Math.max(
      minHours + 1,
      Math.round(maxHours)
    );

  const rate =
    minHours > 50 && maxHours > 50
      ? 800
      : 1000;

  let baseMinPrice =
    minHours * rate;

  let baseMaxPrice =
    maxHours * rate;

  if (
    minHours <= 50 &&
    maxHours > 50
  ) {
    baseMinPrice =
      minHours * 1000;

    baseMaxPrice =
      maxHours * 800;
  }

  baseMinPrice =
    Math.ceil(
      baseMinPrice / 500
    ) * 500;

  baseMaxPrice =
    Math.ceil(
      baseMaxPrice / 500
    ) * 500;

  let urgencyPercent = 0;
  let urgencyLabel = "";

  if (answers.common_urgency === "week") {
    urgencyPercent = 50;
    urgencyLabel =
      "Пріоритетне виконання";
  }

  if (answers.common_urgency === "urgent") {
    urgencyPercent = 100;
    urgencyLabel =
      "Максимальна терміновість";
  }

  if (answers.common_urgency === "date") {
    urgencyPercent = 50;
    urgencyLabel =
      "Робота під конкретний дедлайн";
  }

  const urgencyMultiplier =
    1 + urgencyPercent / 100;

  let minPrice =
    baseMinPrice * urgencyMultiplier;

  let maxPrice =
    baseMaxPrice * urgencyMultiplier;

  minPrice =
    Math.ceil(
      minPrice / 500
    ) * 500;

  maxPrice =
    Math.ceil(
      maxPrice / 500
    ) * 500;

  const needsManualEstimate =
    category === "integration" &&
    (
      answers.integration_api === "no" ||
      answers.integration_direction === "multiple"
    );

  return {
    minHours,
    maxHours,
    baseMinPrice,
    baseMaxPrice,
    minPrice,
    maxPrice,
    urgencyPercent,
    urgencyLabel,
    breakdown,
    needsManualEstimate
  };
}

  function getAnswerLabels(questionId) {
  const question = questions[questionId];
  const answer = answers[questionId];

  if (!question || answer === undefined) {
    return "";
  }

  const getLabel = (value) => {
    const option = question.options.find(
      ([optionValue]) => optionValue === value
    );

    return option ? option[1] : String(value);
  };

  if (Array.isArray(answer)) {
    return answer
      .map(getLabel)
      .join(", ");
  }

  return getLabel(answer);
}

function buildEstimatorMessage(estimate = null) {
  const lines = [];

  lines.push(
    "Попередня заявка з калькулятора вартості"
  );

  lines.push("");

  flow.forEach((questionId) => {
    if (
      answers[questionId] === undefined
    ) {
      return;
    }

    const question =
      questions[questionId];

    if (!question) {
      return;
    }

    lines.push(question.title);
    lines.push(
      getAnswerLabels(questionId)
    );
    lines.push("");
  });

  if (estimate) {
    lines.push(
      "Орієнтовний склад робіт:"
    );

    estimate.breakdown.forEach(
      (item) => {
        lines.push(
          `${item.label}: ` +
          `${item.minHours}–${item.maxHours} год`
        );
      }
    );

    lines.push("");

    lines.push(
      "Орієнтовна трудомісткість:"
    );

    lines.push(
      `${estimate.minHours}–` +
      `${estimate.maxHours} год`
    );

    lines.push("");

    if (estimate.needsManualEstimate) {
      lines.push(
        "Попередня оцінка:"
      );

      lines.push(
        "Потрібна індивідуальна оцінка"
      );

      lines.push("");
    } else {
      lines.push(
        "Базова вартість:"
      );

      lines.push(
        `${estimate.baseMinPrice.toLocaleString("uk-UA")}–` +
        `${estimate.baseMaxPrice.toLocaleString("uk-UA")} грн`
      );

      lines.push("");

      if (estimate.urgencyPercent > 0) {
        lines.push(
          "Доплата за терміновість:"
        );

        lines.push(
          `${estimate.urgencyLabel}: ` +
          `+${estimate.urgencyPercent}%`
        );

        lines.push("");
      }

      lines.push(
        "Попередня вартість:"
      );

      lines.push(
        `${estimate.minPrice.toLocaleString("uk-UA")}–` +
        `${estimate.maxPrice.toLocaleString("uk-UA")} грн`
      );

      lines.push("");
    }
  }

  lines.push(
    "Хочу обговорити це завдання та уточнити остаточну вартість."
  );

  return lines.join("\n");
}
function saveEstimatorDraft(estimate = null) {
  const message =
    buildEstimatorMessage(estimate);

  sessionStorage.setItem(
    "pricingEstimatorContactDraft",
    message
  );
}

function goToContacts(estimate = null) {
  saveEstimatorDraft(estimate);

  window.location.href =
    "contacts.html?from=estimator";
}
  
  function showResult() {
  const estimate =
    calculateEstimate();

  if (progressBar) {
    progressBar.style.width = "100%";
  }

  if (progressValue) {
    progressValue.textContent = "100%";
  }

  if (progressLabel) {
    progressLabel.textContent =
      "Готово";
  }

  if (backButton) {
    backButton.disabled = false;
  }

  if (tiredButton) {
    tiredButton.style.display =
      "none";
  }

  const priceText =
    `${estimate.minPrice.toLocaleString("uk-UA")}–` +
    `${estimate.maxPrice.toLocaleString("uk-UA")} грн`;

  const basePriceText =
    `${estimate.baseMinPrice.toLocaleString("uk-UA")}–` +
    `${estimate.baseMaxPrice.toLocaleString("uk-UA")} грн`;

  const hoursText =
    `${estimate.minHours}–` +
    `${estimate.maxHours} год`;

  const breakdownHtml =
    estimate.breakdown
      .map(
        (item) => `
          <div class="pricing-estimator-cost-row">
            <span class="pricing-estimator-cost-label">
              ${item.label}
            </span>

            <span class="pricing-estimator-cost-value">
              ${item.minHours}–${item.maxHours} год
            </span>
          </div>
        `
      )
      .join("");

  const urgencyHtml =
    estimate.urgencyPercent > 0
      ? `
        <div class="pricing-estimator-cost-row pricing-estimator-cost-row-urgency">
          <span class="pricing-estimator-cost-label">
            ${estimate.urgencyLabel}
          </span>

          <span class="pricing-estimator-cost-value">
            +${estimate.urgencyPercent}%
          </span>
        </div>
      `
      : "";

  let resultHtml = "";

  if (estimate.needsManualEstimate) {
    resultHtml = `
      <div class="pricing-estimator-step">
        <div class="pricing-estimator-summary">

          <div class="pricing-estimator-question-number">
            Попередній результат
          </div>

          <h3 class="pricing-estimator-summary-title">
            Потрібна індивідуальна оцінка
          </h3>

          <p class="pricing-estimator-summary-text">
            У цьому сценарії вартість занадто залежить
            від доступу до систем, API та технічних обмежень.
          </p>

          <div class="pricing-estimator-cost-breakdown">

            <div class="pricing-estimator-cost-heading">
              Що формує оцінку
            </div>

            ${breakdownHtml}

            <div class="pricing-estimator-cost-total">
              <span>
                Орієнтовна трудомісткість
              </span>

              <strong>
                ${hoursText}
              </strong>
            </div>

          </div>

          <button
            class="pricing-estimator-contact-button pricing-estimator-result-contact"
            type="button"
          >
            Отримати точну оцінку
          </button>

        </div>
      </div>
    `;
  } else {
    resultHtml = `
      <div class="pricing-estimator-step">
        <div class="pricing-estimator-summary">

          <div class="pricing-estimator-question-number">
            Попередній результат
          </div>

          <h3 class="pricing-estimator-summary-title">
            ${priceText}
          </h3>

          <p class="pricing-estimator-summary-text">
            Орієнтовна трудомісткість:
            <strong>${hoursText}</strong>.
          </p>

          <div class="pricing-estimator-cost-breakdown">

            <div class="pricing-estimator-cost-heading">
              Як сформована оцінка
            </div>

            ${breakdownHtml}

            <div class="pricing-estimator-cost-separator"></div>

            <div class="pricing-estimator-cost-row">
              <span class="pricing-estimator-cost-label">
                Базова вартість
              </span>

              <span class="pricing-estimator-cost-value">
                ${basePriceText}
              </span>
            </div>

            ${urgencyHtml}

            <div class="pricing-estimator-cost-total">
              <span>
                Попередня вартість
              </span>

              <strong>
                ${priceText}
              </strong>
            </div>

          </div>

          <p class="pricing-estimator-summary-text pricing-estimator-summary-disclaimer">
            Це попередня оцінка за вашими відповідями,
            а не фіксована комерційна пропозиція.
            Після уточнення реальної задачі оцінка може змінитися.
          </p>

          <button
            class="pricing-estimator-contact-button pricing-estimator-result-contact"
            type="button"
          >
            Обговорити проєкт
          </button>

        </div>
      </div>
    `;
  }

  content.innerHTML =
    resultHtml;

  const contactButton =
    content.querySelector(
      ".pricing-estimator-result-contact"
    );

  if (contactButton) {
    contactButton.addEventListener(
      "click",
      () => {
        goToContacts(estimate);
      }
    );
  }
}
  
  function leaveRequest() {
  saveEstimatorDraft();

  window.location.href =
    "contacts.html?from=estimator";
}

  trigger.addEventListener("click", openEstimator);
  closeButton.addEventListener("click", closeEstimator);
  overlay.addEventListener("click", closeEstimator);

  if (backButton) {
    backButton.addEventListener("click", previousStep);
  }

  if (resetButton) {
    resetButton.addEventListener("click", resetEstimator);
  }

  if (tiredButton) {
    tiredButton.addEventListener("click", leaveRequest);
  }

  document.addEventListener("keydown", (event) => {
    if (
      event.key === "Escape" &&
      panel.classList.contains("is-open")
    ) {
      closeEstimator();
    }
  });

  render();
});
