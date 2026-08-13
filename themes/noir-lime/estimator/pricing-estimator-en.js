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
      title: "What do you need?",
      hint: "Choose the option that best matches your task.",
      options: [
        ["powerbi", "Power BI"],
        ["excel", "Excel / Google Sheets"],
        ["reports", "Report automation"],
        ["telegram", "Telegram bot"],
        ["documents", "PDF / invoices / documents"],
        ["integration", "System integration / API"],
        ["other", "Other or not sure yet"]
      ]
    },

    powerbi_type: {
      title: "What do you need to do with Power BI?",
      options: [
        ["new", "Create a new report"],
        ["improve", "Improve an existing report"],
        ["refresh", "Set up automatic refresh"],
        ["fix", "Fix a problem"],
        ["full", "Build a complete solution"]
      ]
    },

    powerbi_license: {
      title: "Is Power BI already set up for publishing and collaboration?",
      hint: "If not, setup and licensing can be included separately.",
      options: [
        ["yes", "Yes"],
        ["no", "No"],
        ["unknown", "Not sure"]
      ]
    },

    powerbi_sources: {
      title: "Where does the data come from?",
      hint: "You can select several options.",
      multiple: true,
      options: [
        ["excel", "Excel / CSV"],
        ["sheets", "Google Sheets"],
        ["crm", "CRM / ERP"],
        ["api", "API / web service"],
        ["database", "Database"],
        ["other", "Other"]
      ]
    },

    powerbi_visuals: {
      title: "Approximately how many visualizations are needed?",
      options: [
        ["1", "1"],
        ["2-3", "2–3"],
        ["4-5", "4–5"],
        ["6+", "More than 5"]
      ]
    },

    powerbi_complexity: {
      title: "How complex is the report logic?",
      hint: "You do not need technical terminology — choose the closest option.",
      options: [
        ["simple", "Basic metrics, tables and charts"],
        ["medium", "Filters, comparisons, KPIs and calculations"],
        ["complex", "Complex business logic and many interdependent metrics"],
        ["unknown", "Not sure — this needs to be defined"]
      ]
    },

    powerbi_users: {
      title: "How many people need to use the result?",
      hint: "Depending on the publishing method, each Power BI user may require a separate license.",
      options: [
        ["1", "1 user"],
        ["2-5", "2–5"],
        ["6-20", "6–20"],
        ["20+", "More than 20"],
        ["unknown", "Not sure"]
      ]
    },

    excel_type: {
      title: "What needs to be done in Excel or Google Sheets?",
      multiple: true,
      options: [
        ["automation", "Automate manual work"],
        ["formulas", "Formulas and calculations"],
        ["reports", "Reports / dashboards"],
        ["data", "Data processing and cleaning"],
        ["files", "Combine or generate files"],
        ["integration", "Exchange data with another system"],
        ["existing", "Improve an existing file"],
        ["other", "Other"]
      ]
    },

    excel_platform: {
      title: "Where should the solution work?",
      options: [
        ["excel", "Microsoft Excel"],
        ["sheets", "Google Sheets"],
        ["both", "Excel and Google Sheets"],
        ["unknown", "Not sure"]
      ]
    },

    excel_volume: {
      title: "Approximately how much data is involved?",
      options: [
        ["small", "Up to a few thousand rows"],
        ["medium", "Tens of thousands of rows"],
        ["large", "Hundreds of thousands of rows or more"],
        ["unknown", "Not sure"]
      ]
    },

    excel_sources: {
      title: "Where should the data come from?",
      multiple: true,
      options: [
        ["manual", "Entered manually by the user"],
        ["excel", "Other Excel / CSV files"],
        ["sheets", "Google Sheets"],
        ["crm", "CRM / ERP"],
        ["api", "API / web service"],
        ["email", "Email / attachments"],
        ["other", "Other"]
      ]
    },

    excel_process: {
      title: "How much of the process should be automated?",
      options: [
        ["one", "One specific operation"],
        ["several", "Several related operations"],
        ["full", "The full process from input data to final result"],
        ["unknown", "Not sure — I just want to reduce manual work"]
      ]
    },

    excel_launch: {
      title: "How should the automation be started?",
      multiple: true,
      options: [
        ["button", "By a user clicking a button"],
        ["schedule", "Automatically on a schedule"],
        ["event", "When data appears or changes"],
        ["both", "Manual and automatic modes"],
        ["unknown", "Not sure"]
      ]
    },

    reports_sources: {
      title: "Where does the report data come from?",
      multiple: true,
      options: [
        ["excel", "Excel / CSV"],
        ["sheets", "Google Sheets"],
        ["crm", "CRM / ERP"],
        ["email", "Email / attachments"],
        ["api", "API"],
        ["multiple", "Several different sources"]
      ]
    },

    reports_count: {
      title: "How many different reports need to be automated?",
      options: [
        ["1", "1"],
        ["2-3", "2–3"],
        ["4-5", "4–5"],
        ["6+", "More than 5"]
      ]
    },

    reports_frequency: {
      title: "How often should the report be generated?",
      options: [
        ["manual", "On demand"],
        ["daily", "Daily"],
        ["weekly", "Weekly"],
        ["monthly", "Monthly"],
        ["event", "When new data appears"]
      ]
    },

    reports_delivery: {
      title: "What should happen with the completed report?",
      multiple: true,
      options: [
        ["save", "Save to a file / folder"],
        ["email", "Send by email"],
        ["telegram", "Send via Telegram"],
        ["dashboard", "Update a dashboard"],
        ["other", "Another scenario"]
      ]
    },

    telegram_type: {
      title: "What do you need to do with the Telegram bot?",
      options: [
        ["new", "Create a new bot"],
        ["improve", "Improve an existing bot"],
        ["fix", "Fix a problem"],
        ["unknown", "I need advice"]
      ]
    },

    telegram_functions: {
      title: "What should the bot be able to do?",
      multiple: true,
      options: [
        ["notifications", "Send messages / reminders"],
        ["forms", "Collect data from users"],
        ["files", "Receive or send files"],
        ["sheets", "Work with Google Sheets"],
        ["api", "Work with another system / API"],
        ["roles", "Support different user roles"],
        ["commands", "Buttons, menus and dialog flows"],
        ["other", "Other"]
      ]
    },

    telegram_users: {
      title: "Approximately how many users will use the bot?",
      options: [
        ["1-10", "Up to 10"],
        ["11-50", "11–50"],
        ["51-200", "51–200"],
        ["200+", "More than 200"],
        ["unknown", "Not sure"]
      ]
    },

    telegram_complexity: {
      title: "How complex will the bot workflow be?",
      options: [
        ["simple", "A few simple commands"],
        ["medium", "Several connected workflows"],
        ["complex", "Many states, roles and business rules"],
        ["unknown", "Not sure"]
      ]
    },

    documents_type: {
      title: "What documents need to be processed?",
      multiple: true,
      options: [
        ["invoice", "Invoices"],
        ["pdf", "PDF documents"],
        ["scans", "Scans / photos"],
        ["orders", "Orders / requests"],
        ["other", "Other documents"]
      ]
    },

    documents_templates: {
      title: "Approximately how many document formats are there?",
      options: [
        ["1", "One consistent format"],
        ["2-5", "2–5 formats"],
        ["6+", "Many different formats"],
        ["unknown", "Not sure"]
      ]
    },

    documents_volume: {
      title: "How many documents need to be processed?",
      options: [
        ["small", "Up to 50 per month"],
        ["medium", "50–500 per month"],
        ["large", "More than 500 per month"],
        ["unknown", "Not sure"]
      ]
    },

    documents_result: {
      title: "Where should the extracted data go?",
      multiple: true,
      options: [
        ["excel", "Excel"],
        ["sheets", "Google Sheets"],
        ["crm", "CRM / ERP"],
        ["database", "Database"],
        ["api", "Another system / API"]
      ]
    },

    integration_systems: {
      title: "What needs to be connected?",
      multiple: true,
      options: [
        ["excel", "Excel / Google Sheets"],
        ["crm", "CRM / ERP"],
        ["telegram", "Telegram"],
        ["email", "Email"],
        ["api", "Web service / API"],
        ["other", "Other systems"]
      ]
    },

    integration_direction: {
      title: "How should the data move between systems?",
      options: [
        ["oneway", "From one system to another"],
        ["twoway", "In both directions"],
        ["multiple", "Between several systems"],
        ["unknown", "Not sure"]
      ]
    },

    integration_api: {
      title: "Do you have access to the system API or technical documentation?",
      options: [
        ["yes", "Yes"],
        ["no", "No"],
        ["unknown", "Not sure"]
      ]
    },

    integration_frequency: {
      title: "How often should the data be synchronized?",
      options: [
        ["manual", "On demand"],
        ["schedule", "On a schedule"],
        ["realtime", "Almost immediately"],
        ["unknown", "Not sure"]
      ]
    },

    other_type: {
      title: "Which option best describes your task?",
      options: [
        ["data", "Working with data"],
        ["automation", "Process automation"],
        ["report", "Reporting"],
        ["integration", "Data exchange between systems"],
        ["problem", "I have a problem but I am not sure what solution I need"]
      ]
    },

    common_existing: {
      title: "Does the solution need to be built from scratch?",
      options: [
        ["new", "Yes, from scratch"],
        ["existing", "There is an existing solution that needs improvement"],
        ["broken", "There is a solution, but it does not work correctly"],
        ["unknown", "Not sure"]
      ]
    },

    common_urgency: {
      title: "How urgent is the project?",
      options: [
        ["normal", "No strict deadline"],
        ["week", "Preferably within a week"],
        ["urgent", "As soon as possible"],
        ["date", "There is a specific deadline"]
      ]
    },

    common_support: {
      title: "Will you need support after launch?",
      options: [
        ["no", "No, delivery of the finished solution is enough"],
        ["short", "Yes, during the launch period"],
        ["ongoing", "Yes, ongoing support is required"],
        ["unknown", "Not sure yet"]
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
        progressLabel.textContent = "Start";
      } else {
        progressLabel.textContent =
          `Step ${Math.min(stepIndex + 1, flow.length)} of ${flow.length}`;
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
        ? "Choose a category"
        : `Question ${stepIndex}`;

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
      continueButton.textContent = "Continue";

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
      label: "Base Power BI estimate"
    },
    excel: {
      min: 3,
      max: 6,
      label: "Base Excel / Google Sheets estimate"
    },
    reports: {
      min: 4,
      max: 8,
      label: "Base report automation estimate"
    },
    telegram: {
      min: 5,
      max: 10,
      label: "Base Telegram bot estimate"
    },
    documents: {
      min: 5,
      max: 10,
      label: "Base document processing estimate"
    },
    integration: {
      min: 8,
      max: 16,
      label: "Base integration estimate"
    },
    other: {
      min: 4,
      max: 10,
      label: "Base project estimate"
    }
  };

  const base =
    estimates[category] ||
    estimates.other;

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
        "Create a new report",
        2,
        4
      );
    }

    if (answers.powerbi_type === "full") {
      addWork(
        "Complete Power BI solution",
        8,
        16
      );
    }

    if (answers.powerbi_license === "no") {
      addWork(
        "Power BI setup",
        1,
        3
      );
    }

    const sources =
      answers.powerbi_sources || [];

    if (sources.length === 2) {
      addWork(
        "Two data sources",
        1,
        3
      );
    }

    if (sources.length >= 3) {
      addWork(
        "Multiple data sources",
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
        "CRM / API / database",
        2,
        5
      );
    }

    if (answers.powerbi_visuals === "2-3") {
      addWork(
        "2–3 visualizations",
        2,
        4
      );
    }

    if (answers.powerbi_visuals === "4-5") {
      addWork(
        "4–5 visualizations",
        4,
        8
      );
    }

    if (answers.powerbi_visuals === "6+") {
      addWork(
        "More than 5 visualizations",
        7,
        14
      );
    }

    if (answers.powerbi_complexity === "medium") {
      addWork(
        "KPIs, filters and calculations",
        3,
        6
      );
    }

    if (answers.powerbi_complexity === "complex") {
      addWork(
        "Complex business logic",
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
        "Multiple automation types",
        3,
        7
      );
    }

    if (
      types.includes("integration") ||
      types.includes("data")
    ) {
      addWork(
        "Data processing / integration",
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
        "Medium data volume",
        1,
        3
      );
    }

    if (answers.excel_volume === "large") {
      addWork(
        "Large data volume",
        4,
        10
      );
    }

    if (sources.length >= 3) {
      addWork(
        "Multiple data sources",
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
        "Several connected operations",
        3,
        6
      );
    }

    if (answers.excel_process === "full") {
      addWork(
        "Full automated process",
        7,
        15
      );
    }

    if (
      launches.includes("schedule") ||
      launches.includes("event")
    ) {
      addWork(
        "Automatic execution",
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
        "Multiple data sources",
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
        "CRM / API / complex sources",
        3,
        7
      );
    }

    if (answers.reports_count === "2-3") {
      addWork(
        "2–3 reports",
        3,
        6
      );
    }

    if (answers.reports_count === "4-5") {
      addWork(
        "4–5 reports",
        6,
        12
      );
    }

    if (answers.reports_count === "6+") {
      addWork(
        "More than 5 reports",
        10,
        20
      );
    }

    if (delivery.length >= 2) {
      addWork(
        "Multiple delivery channels",
        2,
        5
      );
    }

    if (answers.reports_frequency !== "manual") {
      addWork(
        "Automatic report generation",
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
        "Multiple bot functions",
        4,
        8
      );
    }

    if (functions.length >= 5) {
      addWork(
        "Extended functionality",
        4,
        10
      );
    }

    if (
      functions.includes("api") ||
      functions.includes("roles")
    ) {
      addWork(
        "API / user roles",
        3,
        7
      );
    }

    if (answers.telegram_complexity === "medium") {
      addWork(
        "Several connected workflows",
        4,
        8
      );
    }

    if (answers.telegram_complexity === "complex") {
      addWork(
        "Complex bot logic",
        10,
        20
      );
    }

    if (answers.telegram_users === "200+") {
      addWork(
        "Large number of users",
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
        "Scans / photos",
        4,
        10
      );
    }

    if (types.length >= 3) {
      addWork(
        "Multiple document types",
        3,
        7
      );
    }

    if (answers.documents_templates === "2-5") {
      addWork(
        "2–5 document formats",
        4,
        10
      );
    }

    if (answers.documents_templates === "6+") {
      addWork(
        "Many document formats",
        10,
        24
      );
    }

    if (answers.documents_volume === "medium") {
      addWork(
        "50–500 documents per month",
        2,
        5
      );
    }

    if (answers.documents_volume === "large") {
      addWork(
        "More than 500 documents per month",
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
        "Send data to an external system",
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
        "Multiple systems",
        5,
        12
      );
    }

    if (answers.integration_direction === "twoway") {
      addWork(
        "Two-way data exchange",
        6,
        14
      );
    }

    if (answers.integration_direction === "multiple") {
      addWork(
        "Data exchange between multiple systems",
        10,
        22
      );
    }

    if (answers.integration_api === "no") {
      addWork(
        "No ready-to-use API",
        5,
        15
      );
    }

    if (answers.integration_api === "unknown") {
      addWork(
        "API requires review",
        2,
        8
      );
    }

    if (answers.integration_frequency === "realtime") {
      addWork(
        "Near real-time synchronization",
        5,
        12
      );
    }
  }

  if (answers.common_existing === "existing") {
    addWork(
      "Improvement of an existing solution",
      1,
      4
    );
  }

  if (answers.common_existing === "broken") {
    addWork(
      "Diagnostics and fixes",
      2,
      6
    );
  }

  if (answers.common_support === "short") {
    addWork(
      "Launch support",
      1,
      3
    );
  }

  if (answers.common_support === "ongoing") {
    addWork(
      "Extended support",
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
      "Priority delivery";
  }

  if (answers.common_urgency === "urgent") {
    urgencyPercent = 100;
    urgencyLabel =
      "Maximum urgency";
  }

  if (answers.common_urgency === "date") {
    urgencyPercent = 50;
    urgencyLabel =
      "Fixed deadline";
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
    "Preliminary request from the project cost calculator"
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
      "Estimated scope of work:"
    );

    estimate.breakdown.forEach(
      (item) => {
        lines.push(
          `${item.label}: ` +
          `${item.minHours}–${item.maxHours} hours`
        );
      }
    );

    lines.push("");

    lines.push(
      "Estimated workload:"
    );

    lines.push(
      `${estimate.minHours}–` +
      `${estimate.maxHours} hours`
    );

    lines.push("");

    if (estimate.needsManualEstimate) {
      lines.push(
        "Preliminary estimate:"
      );

      lines.push(
        "Individual assessment required"
      );

      lines.push("");
    } else {
      lines.push(
        "Base cost:"
      );

      lines.push(
        `${estimate.baseMinPrice.toLocaleString("en-US")}–` +
        `${estimate.baseMaxPrice.toLocaleString("en-US")} UAH`
      );

      lines.push("");

      if (estimate.urgencyPercent > 0) {
        lines.push(
          "Urgency surcharge:"
        );

        lines.push(
          `${estimate.urgencyLabel}: ` +
          `+${estimate.urgencyPercent}%`
        );

        lines.push("");
      }

      lines.push(
        "Preliminary project cost:"
      );

      lines.push(
        `${estimate.minPrice.toLocaleString("en-US")}–` +
        `${estimate.maxPrice.toLocaleString("en-US")} UAH`
      );

      lines.push("");
    }
  }

  lines.push(
    "I would like to discuss this project and confirm the final scope and cost."
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
      "contacts-en.html?from=estimator";
  }

  function showResult() {
  const estimate =
    calculateEstimate();

  if (progressBar) {
    progressBar.style.width =
      "100%";
  }

  if (progressValue) {
    progressValue.textContent =
      "100%";
  }

  if (progressLabel) {
    progressLabel.textContent =
      "Done";
  }

  if (backButton) {
    backButton.disabled = false;
  }

  if (tiredButton) {
    tiredButton.style.display =
      "none";
  }

  const priceText =
    `${estimate.minPrice.toLocaleString("en-US")}–` +
    `${estimate.maxPrice.toLocaleString("en-US")} UAH`;

  const basePriceText =
    `${estimate.baseMinPrice.toLocaleString("en-US")}–` +
    `${estimate.baseMaxPrice.toLocaleString("en-US")} UAH`;

  const hoursText =
    `${estimate.minHours}–` +
    `${estimate.maxHours} hours`;

  const breakdownHtml =
    estimate.breakdown
      .map(
        (item) => `
          <div class="pricing-estimator-cost-row">
            <span class="pricing-estimator-cost-label">
              ${item.label}
            </span>

            <span class="pricing-estimator-cost-value">
              ${item.minHours}–${item.maxHours} hours
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
            Preliminary result
          </div>

          <h3 class="pricing-estimator-summary-title">
            Individual assessment required
          </h3>

          <p class="pricing-estimator-summary-text">
            In this scenario, the final cost depends heavily
            on system access, API availability and technical limitations.
          </p>

          <div class="pricing-estimator-cost-breakdown">

            <div class="pricing-estimator-cost-heading">
              What affects the estimate
            </div>

            ${breakdownHtml}

            <div class="pricing-estimator-cost-total">
              <span>
                Estimated workload
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
            Get an accurate estimate
          </button>

        </div>
      </div>
    `;
  } else {
    resultHtml = `
      <div class="pricing-estimator-step">
        <div class="pricing-estimator-summary">

          <div class="pricing-estimator-question-number">
            Preliminary result
          </div>

          <h3 class="pricing-estimator-summary-title">
            ${priceText}
          </h3>

          <p class="pricing-estimator-summary-text">
            Estimated workload:
            <strong>${hoursText}</strong>.
          </p>

          <div class="pricing-estimator-cost-breakdown">

            <div class="pricing-estimator-cost-heading">
              How the estimate was calculated
            </div>

            ${breakdownHtml}

            <div class="pricing-estimator-cost-separator"></div>

            <div class="pricing-estimator-cost-row">
              <span class="pricing-estimator-cost-label">
                Base cost
              </span>

              <span class="pricing-estimator-cost-value">
                ${basePriceText}
              </span>
            </div>

            ${urgencyHtml}

            <div class="pricing-estimator-cost-total">
              <span>
                Preliminary project cost
              </span>

              <strong>
                ${priceText}
              </strong>
            </div>

          </div>

          <p class="pricing-estimator-summary-text pricing-estimator-summary-disclaimer">
            This is a preliminary estimate based on your answers,
            not a fixed commercial offer.
            The estimate may change after reviewing the actual project scope.
          </p>

          <button
            class="pricing-estimator-contact-button pricing-estimator-result-contact"
            type="button"
          >
            Discuss the project
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
      "contacts-en.html?from=estimator";
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
