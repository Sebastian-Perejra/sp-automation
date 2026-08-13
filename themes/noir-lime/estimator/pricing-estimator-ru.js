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
      title: "Что нужно сделать?",
      hint: "Выберите направление, которое больше всего похоже на вашу задачу.",
      options: [
        ["powerbi", "Power BI"],
        ["excel", "Excel / Google Sheets"],
        ["reports", "Автоматизация отчётов"],
        ["telegram", "Telegram-бот"],
        ["documents", "PDF / счета / документы"],
        ["integration", "Интеграция систем / API"],
        ["other", "Другое или пока не знаю"]
      ]
    },

    powerbi_type: {
      title: "Что нужно сделать с Power BI?",
      options: [
        ["new", "Создать новый отчёт"],
        ["improve", "Доработать существующий"],
        ["refresh", "Настроить автоматическое обновление"],
        ["fix", "Исправить проблему"],
        ["full", "Комплексное решение"]
      ]
    },

    powerbi_license: {
      title: "Настроен ли у вас Power BI для публикации и совместной работы?",
      hint: "Если нет — можем отдельно учесть настройку и лицензирование.",
      options: [
        ["yes", "Да"],
        ["no", "Нет"],
        ["unknown", "Не знаю"]
      ]
    },

    powerbi_sources: {
      title: "Откуда поступают данные?",
      hint: "Можно выбрать несколько вариантов.",
      multiple: true,
      options: [
        ["excel", "Excel / CSV"],
        ["sheets", "Google Sheets"],
        ["crm", "CRM / ERP"],
        ["api", "API / веб-сервис"],
        ["database", "База данных"],
        ["other", "Другое"]
      ]
    },

    powerbi_visuals: {
      title: "Сколько визуализаций примерно нужно?",
      options: [
        ["1", "1"],
        ["2-3", "2–3"],
        ["4-5", "4–5"],
        ["6+", "Больше 5"]
      ]
    },

    powerbi_complexity: {
      title: "Какая логика нужна в отчёте?",
      hint: "Не нужно знать технические термины — выберите наиболее близкий вариант.",
      options: [
        ["simple", "Базовые показатели, таблицы и графики"],
        ["medium", "Фильтры, сравнения, KPI и расчёты"],
        ["complex", "Сложная бизнес-логика и много взаимозависимых показателей"],
        ["unknown", "Не знаю — нужно определить"]
      ]
    },

    powerbi_users: {
      title: "Сколько человек должны пользоваться результатом?",
      hint: "Для Power BI каждому пользователю может потребоваться отдельная лицензия в зависимости от способа публикации.",
      options: [
        ["1", "1 пользователь"],
        ["2-5", "2–5"],
        ["6-20", "6–20"],
        ["20+", "Больше 20"],
        ["unknown", "Не знаю"]
      ]
    },

    excel_type: {
      title: "Что нужно сделать в Excel или Google Sheets?",
      multiple: true,
      options: [
        ["automation", "Автоматизировать ручную работу"],
        ["formulas", "Формулы и расчёты"],
        ["reports", "Отчёты / дашборды"],
        ["data", "Обработка и очистка данных"],
        ["files", "Объединение или создание файлов"],
        ["integration", "Обмен данными с другой системой"],
        ["existing", "Доработать существующий файл"],
        ["other", "Другое"]
      ]
    },

    excel_platform: {
      title: "Где должно работать решение?",
      options: [
        ["excel", "Microsoft Excel"],
        ["sheets", "Google Sheets"],
        ["both", "Excel и Google Sheets"],
        ["unknown", "Не знаю"]
      ]
    },

    excel_volume: {
      title: "Какой примерно объём данных?",
      options: [
        ["small", "До нескольких тысяч строк"],
        ["medium", "Десятки тысяч строк"],
        ["large", "Сотни тысяч строк или больше"],
        ["unknown", "Не знаю"]
      ]
    },

    excel_sources: {
      title: "Откуда нужно получать данные?",
      multiple: true,
      options: [
        ["manual", "Пользователь вводит вручную"],
        ["excel", "Другие Excel / CSV файлы"],
        ["sheets", "Google Sheets"],
        ["crm", "CRM / ERP"],
        ["api", "API / веб-сервис"],
        ["email", "Email / вложения"],
        ["other", "Другое"]
      ]
    },

    excel_process: {
      title: "Насколько большой процесс нужно автоматизировать?",
      options: [
        ["one", "Одну конкретную операцию"],
        ["several", "Несколько связанных операций"],
        ["full", "Полный процесс от входных данных до результата"],
        ["unknown", "Не знаю — хочу убрать ручную работу"]
      ]
    },

    excel_launch: {
      title: "Как должна запускаться автоматизация?",
      multiple: true,
      options: [
        ["button", "Кнопкой пользователя"],
        ["schedule", "Автоматически по расписанию"],
        ["event", "При появлении или изменении данных"],
        ["both", "Ручной и автоматический режим"],
        ["unknown", "Не знаю"]
      ]
    },

    reports_sources: {
      title: "Откуда берутся данные для отчёта?",
      multiple: true,
      options: [
        ["excel", "Excel / CSV"],
        ["sheets", "Google Sheets"],
        ["crm", "CRM / ERP"],
        ["email", "Email / вложения"],
        ["api", "API"],
        ["multiple", "Из нескольких разных источников"]
      ]
    },

    reports_count: {
      title: "Сколько разных отчётов нужно автоматизировать?",
      options: [
        ["1", "1"],
        ["2-3", "2–3"],
        ["4-5", "4–5"],
        ["6+", "Больше 5"]
      ]
    },

    reports_frequency: {
      title: "Как часто нужно формировать отчёт?",
      options: [
        ["manual", "По запросу"],
        ["daily", "Ежедневно"],
        ["weekly", "Еженедельно"],
        ["monthly", "Ежемесячно"],
        ["event", "При появлении новых данных"]
      ]
    },

    reports_delivery: {
      title: "Что должно происходить с готовым отчётом?",
      multiple: true,
      options: [
        ["save", "Сохранить в файл / папку"],
        ["email", "Отправить по email"],
        ["telegram", "Отправить в Telegram"],
        ["dashboard", "Обновить дашборд"],
        ["other", "Другой сценарий"]
      ]
    },

    telegram_type: {
      title: "Что нужно сделать с Telegram-ботом?",
      options: [
        ["new", "Создать нового бота"],
        ["improve", "Доработать существующего"],
        ["fix", "Исправить проблему"],
        ["unknown", "Нужна консультация"]
      ]
    },

    telegram_functions: {
      title: "Что должен уметь бот?",
      multiple: true,
      options: [
        ["notifications", "Отправлять сообщения / напоминания"],
        ["forms", "Принимать данные от пользователя"],
        ["files", "Принимать или отправлять файлы"],
        ["sheets", "Работать с Google Sheets"],
        ["api", "Работать с другой системой / API"],
        ["roles", "Разные роли пользователей"],
        ["commands", "Кнопки, меню и сценарии диалога"],
        ["other", "Другое"]
      ]
    },

    telegram_users: {
      title: "Сколько пользователей примерно будет работать с ботом?",
      options: [
        ["1-10", "До 10"],
        ["11-50", "11–50"],
        ["51-200", "51–200"],
        ["200+", "Больше 200"],
        ["unknown", "Не знаю"]
      ]
    },

    telegram_complexity: {
      title: "Насколько сложным будет сценарий работы?",
      options: [
        ["simple", "Несколько простых команд"],
        ["medium", "Несколько связанных сценариев"],
        ["complex", "Много состояний, ролей и логики"],
        ["unknown", "Не знаю"]
      ]
    },

    documents_type: {
      title: "Какие документы нужно обрабатывать?",
      multiple: true,
      options: [
        ["invoice", "Счета / invoices"],
        ["pdf", "PDF-документы"],
        ["scans", "Сканы / фотографии"],
        ["orders", "Заказы / заявки"],
        ["other", "Другие документы"]
      ]
    },

    documents_templates: {
      title: "Сколько разных форматов документов примерно есть?",
      options: [
        ["1", "Один стабильный формат"],
        ["2-5", "2–5 форматов"],
        ["6+", "Много разных форматов"],
        ["unknown", "Не знаю"]
      ]
    },

    documents_volume: {
      title: "Сколько документов нужно обрабатывать?",
      options: [
        ["small", "До 50 в месяц"],
        ["medium", "50–500 в месяц"],
        ["large", "Больше 500 в месяц"],
        ["unknown", "Не знаю"]
      ]
    },

    documents_result: {
      title: "Куда должны попадать полученные данные?",
      multiple: true,
      options: [
        ["excel", "Excel"],
        ["sheets", "Google Sheets"],
        ["crm", "CRM / ERP"],
        ["database", "База данных"],
        ["api", "Другая система / API"]
      ]
    },

    integration_systems: {
      title: "Что нужно связать между собой?",
      multiple: true,
      options: [
        ["excel", "Excel / Google Sheets"],
        ["crm", "CRM / ERP"],
        ["telegram", "Telegram"],
        ["email", "Email"],
        ["api", "Веб-сервис / API"],
        ["other", "Другие системы"]
      ]
    },

    integration_direction: {
      title: "Как должны передаваться данные?",
      options: [
        ["oneway", "Из одной системы в другую"],
        ["twoway", "В обе стороны"],
        ["multiple", "Между несколькими системами"],
        ["unknown", "Не знаю"]
      ]
    },

    integration_api: {
      title: "Есть ли доступ к API или технической документации системы?",
      options: [
        ["yes", "Да"],
        ["no", "Нет"],
        ["unknown", "Не знаю"]
      ]
    },

    integration_frequency: {
      title: "Как часто нужно синхронизировать данные?",
      options: [
        ["manual", "По запросу"],
        ["schedule", "По расписанию"],
        ["realtime", "Практически сразу"],
        ["unknown", "Не знаю"]
      ]
    },

    other_type: {
      title: "Что ближе всего описывает вашу задачу?",
      options: [
        ["data", "Работа с данными"],
        ["automation", "Автоматизация процесса"],
        ["report", "Отчётность"],
        ["integration", "Обмен между системами"],
        ["problem", "Есть проблема, но я не знаю, какое решение нужно"]
      ]
    },

    common_existing: {
      title: "Решение нужно создать с нуля или что-то уже есть?",
      options: [
        ["new", "С нуля"],
        ["existing", "Есть существующее решение, нужно доработать"],
        ["broken", "Есть решение, но оно работает неправильно"],
        ["unknown", "Не знаю"]
      ]
    },

    common_urgency: {
      title: "Насколько срочно нужен результат?",
      options: [
        ["normal", "Без жёсткого дедлайна"],
        ["week", "Желательно в течение недели"],
        ["urgent", "Нужно максимально быстро"],
        ["date", "Есть конкретный дедлайн"]
      ]
    },

    common_support: {
      title: "Нужна ли поддержка после запуска?",
      options: [
        ["no", "Нет, достаточно передать готовое решение"],
        ["short", "Да, на период запуска"],
        ["ongoing", "Да, нужна дальнейшая поддержка"],
        ["unknown", "Пока не знаю"]
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
        progressLabel.textContent = "Начало";
      } else {
        progressLabel.textContent =
          `Шаг ${Math.min(stepIndex + 1, flow.length)} из ${flow.length}`;
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
        ? "Выберите направление"
        : `Вопрос ${stepIndex}`;

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
      continueButton.textContent = "Продолжить";

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
        max: 9
      },
      excel: {
        min: 3,
        max: 6
      },
      reports: {
        min: 4,
        max: 8
      },
      telegram: {
        min: 5,
        max: 10
      },
      documents: {
        min: 5,
        max: 10
      },
      integration: {
        min: 8,
        max: 16
      },
      other: {
        min: 4,
        max: 10
      }
    };

    const base = estimates[category] || {
      min: 4,
      max: 10
    };

    let minHours = base.min;
    let maxHours = base.max;

    if (category === "powerbi") {
      if (answers.powerbi_type === "new") {
        minHours += 2;
        maxHours += 4;
      }

      if (answers.powerbi_type === "full") {
        minHours += 8;
        maxHours += 16;
      }

      if (answers.powerbi_license === "no") {
        minHours += 1;
        maxHours += 3;
      }

      const sources = answers.powerbi_sources || [];

      if (sources.length === 2) {
        minHours += 1;
        maxHours += 3;
      }

      if (sources.length >= 3) {
        minHours += 3;
        maxHours += 7;
      }

      if (
        sources.includes("api") ||
        sources.includes("database") ||
        sources.includes("crm")
      ) {
        minHours += 2;
        maxHours += 5;
      }

      if (answers.powerbi_visuals === "2-3") {
        minHours += 2;
        maxHours += 4;
      }

      if (answers.powerbi_visuals === "4-5") {
        minHours += 4;
        maxHours += 8;
      }

      if (answers.powerbi_visuals === "6+") {
        minHours += 7;
        maxHours += 14;
      }

      if (answers.powerbi_complexity === "medium") {
        minHours += 3;
        maxHours += 6;
      }

      if (answers.powerbi_complexity === "complex") {
        minHours += 7;
        maxHours += 15;
      }
    }

    if (category === "excel") {
      const types = answers.excel_type || [];
      const sources = answers.excel_sources || [];
      const launches = answers.excel_launch || [];

      if (types.length >= 3) {
        minHours += 3;
        maxHours += 7;
      }

      if (
        types.includes("integration") ||
        types.includes("data")
      ) {
        minHours += 2;
        maxHours += 5;
      }

      if (answers.excel_platform === "both") {
        minHours += 3;
        maxHours += 7;
      }

      if (answers.excel_volume === "medium") {
        minHours += 1;
        maxHours += 3;
      }

      if (answers.excel_volume === "large") {
        minHours += 4;
        maxHours += 10;
      }

      if (sources.length >= 3) {
        minHours += 3;
        maxHours += 7;
      }

      if (
        sources.includes("crm") ||
        sources.includes("api") ||
        sources.includes("email")
      ) {
        minHours += 2;
        maxHours += 6;
      }

      if (answers.excel_process === "several") {
        minHours += 3;
        maxHours += 6;
      }

      if (answers.excel_process === "full") {
        minHours += 7;
        maxHours += 15;
      }

      if (
        launches.includes("schedule") ||
        launches.includes("event")
      ) {
        minHours += 2;
        maxHours += 5;
      }
    }

    if (category === "reports") {
      const sources = answers.reports_sources || [];
      const delivery = answers.reports_delivery || [];

      if (sources.length >= 3) {
        minHours += 3;
        maxHours += 7;
      }

      if (
        sources.includes("crm") ||
        sources.includes("api") ||
        sources.includes("multiple")
      ) {
        minHours += 3;
        maxHours += 7;
      }

      if (answers.reports_count === "2-3") {
        minHours += 3;
        maxHours += 6;
      }

      if (answers.reports_count === "4-5") {
        minHours += 6;
        maxHours += 12;
      }

      if (answers.reports_count === "6+") {
        minHours += 10;
        maxHours += 20;
      }

      if (delivery.length >= 2) {
        minHours += 2;
        maxHours += 5;
      }

      if (answers.reports_frequency !== "manual") {
        minHours += 1;
        maxHours += 4;
      }
    }

    if (category === "telegram") {
      const functions = answers.telegram_functions || [];

      if (functions.length >= 3) {
        minHours += 4;
        maxHours += 8;
      }

      if (functions.length >= 5) {
        minHours += 4;
        maxHours += 10;
      }

      if (
        functions.includes("api") ||
        functions.includes("roles")
      ) {
        minHours += 3;
        maxHours += 7;
      }

      if (answers.telegram_complexity === "medium") {
        minHours += 4;
        maxHours += 8;
      }

      if (answers.telegram_complexity === "complex") {
        minHours += 10;
        maxHours += 20;
      }

      if (answers.telegram_users === "200+") {
        minHours += 3;
        maxHours += 8;
      }
    }

    if (category === "documents") {
      const types = answers.documents_type || [];
      const results = answers.documents_result || [];

      if (types.includes("scans")) {
        minHours += 4;
        maxHours += 10;
      }

      if (types.length >= 3) {
        minHours += 3;
        maxHours += 7;
      }

      if (answers.documents_templates === "2-5") {
        minHours += 4;
        maxHours += 10;
      }

      if (answers.documents_templates === "6+") {
        minHours += 10;
        maxHours += 24;
      }

      if (answers.documents_volume === "medium") {
        minHours += 2;
        maxHours += 5;
      }

      if (answers.documents_volume === "large") {
        minHours += 5;
        maxHours += 12;
      }

      if (
        results.includes("crm") ||
        results.includes("database") ||
        results.includes("api")
      ) {
        minHours += 3;
        maxHours += 8;
      }
    }

    if (category === "integration") {
      const systems = answers.integration_systems || [];

      if (systems.length >= 3) {
        minHours += 5;
        maxHours += 12;
      }

      if (answers.integration_direction === "twoway") {
        minHours += 6;
        maxHours += 14;
      }

      if (answers.integration_direction === "multiple") {
        minHours += 10;
        maxHours += 22;
      }

      if (answers.integration_api === "no") {
        minHours += 5;
        maxHours += 15;
      }

      if (answers.integration_api === "unknown") {
        minHours += 2;
        maxHours += 8;
      }

      if (answers.integration_frequency === "realtime") {
        minHours += 5;
        maxHours += 12;
      }
    }

    if (answers.common_existing === "existing") {
      minHours += 1;
      maxHours += 4;
    }

    if (answers.common_existing === "broken") {
      minHours += 2;
      maxHours += 6;
    }

    if (answers.common_urgency === "urgent") {
      minHours *= 1.1;
      maxHours *= 1.2;
    }

    if (answers.common_support === "short") {
      minHours += 1;
      maxHours += 3;
    }

    if (answers.common_support === "ongoing") {
      minHours += 3;
      maxHours += 8;
    }

    minHours = Math.max(2, Math.round(minHours));
    maxHours = Math.max(
      minHours + 1,
      Math.round(maxHours)
    );

    const rate =
      minHours > 50 && maxHours > 50
        ? 800
        : 1000;

    let minPrice = minHours * rate;
    let maxPrice = maxHours * rate;

    if (minHours <= 50 && maxHours > 50) {
      minPrice = minHours * 1000;
      maxPrice = maxHours * 800;
    }

    minPrice =
      Math.ceil(minPrice / 500) * 500;

    maxPrice =
      Math.ceil(maxPrice / 500) * 500;

    const needsManualEstimate =
      category === "integration" &&
      (
        answers.integration_api === "no" ||
        answers.integration_direction === "multiple"
      );

    return {
      minHours,
      maxHours,
      minPrice,
      maxPrice,
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

    lines.push("Предварительная заявка из калькулятора стоимости");
    lines.push("");

    flow.forEach((questionId) => {
      if (answers[questionId] === undefined) {
        return;
      }

      const question = questions[questionId];

      if (!question) {
        return;
      }

      lines.push(question.title);
      lines.push(getAnswerLabels(questionId));
      lines.push("");
    });

    if (estimate) {
      if (estimate.needsManualEstimate) {
        lines.push("Предварительная оценка:");
        lines.push("Требуется индивидуальная оценка");
        lines.push("");

        lines.push("Ориентировочная трудоёмкость:");
        lines.push(
          `${estimate.minHours}–${estimate.maxHours} ч`
        );
        lines.push("");
      } else {
        lines.push("Предварительная оценка:");
        lines.push(
          `${estimate.minPrice.toLocaleString("ru-RU")}–` +
          `${estimate.maxPrice.toLocaleString("ru-RU")} грн`
        );
        lines.push("");

        lines.push("Ориентировочная трудоёмкость:");
        lines.push(
          `${estimate.minHours}–${estimate.maxHours} ч`
        );
        lines.push("");
      }
    }

    lines.push(
      "Хочу обсудить эту задачу и уточнить окончательную стоимость."
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
      "contacts-ru.html?from=estimator";
  }

  function showResult() {
    const estimate = calculateEstimate();

    if (progressBar) {
      progressBar.style.width = "100%";
    }

    if (progressValue) {
      progressValue.textContent = "100%";
    }

    if (progressLabel) {
      progressLabel.textContent = "Готово";
    }

    if (backButton) {
      backButton.disabled = false;
    }

    if (tiredButton) {
      tiredButton.style.display = "none";
    }

    const priceText =
      `${estimate.minPrice.toLocaleString("ru-RU")}–` +
      `${estimate.maxPrice.toLocaleString("ru-RU")} грн`;

    const hoursText =
      `${estimate.minHours}–${estimate.maxHours} ч`;

    let resultHtml = "";

    if (estimate.needsManualEstimate) {
      resultHtml = `
        <div class="pricing-estimator-step">
          <div class="pricing-estimator-summary">

            <div class="pricing-estimator-question-number">
              Предварительный результат
            </div>

            <h3 class="pricing-estimator-summary-title">
              Требуется индивидуальная оценка
            </h3>

            <p class="pricing-estimator-summary-text">
              В этом сценарии стоимость слишком сильно зависит от доступа
              к системам, API и технических ограничений. Давать точную цифру
              автоматически было бы некорректно.
            </p>

            <p class="pricing-estimator-summary-text">
              Ориентир по трудоёмкости:
              <strong>${hoursText}</strong>.
            </p>

            <button
              class="pricing-estimator-contact-button pricing-estimator-result-contact"
              type="button"
            >
              Получить точную оценку
            </button>

          </div>
        </div>
      `;
    } else {
      resultHtml = `
        <div class="pricing-estimator-step">
          <div class="pricing-estimator-summary">

            <div class="pricing-estimator-question-number">
              Предварительный результат
            </div>

            <h3 class="pricing-estimator-summary-title">
              ${priceText}
            </h3>

            <p class="pricing-estimator-summary-text">
              Ориентировочная трудоёмкость:
              <strong>${hoursText}</strong>.
            </p>

            <p class="pricing-estimator-summary-text">
              Это предварительная оценка на основании ваших ответов,
              а не фиксированное коммерческое предложение.
              После короткого уточнения задачи оценка может измениться.
            </p>

            <button
              class="pricing-estimator-contact-button pricing-estimator-result-contact"
              type="button"
            >
              Обсудить проект
            </button>

          </div>
        </div>
      `;
    }

    content.innerHTML = resultHtml;

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
      "contacts-ru.html?from=estimator";
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
