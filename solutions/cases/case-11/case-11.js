(() => {
  const root = document.querySelector("#ar-case");

  if (!root) {
    return;
  }

  if (typeof window.__spCase11UkCleanup === "function") {
    window.__spCase11UkCleanup();
  }

  const controller = new AbortController();
  const signal = controller.signal;

  const baseDate = createDate("2026-08-24");
  const dueDate = createDate("2026-08-23");

  const policies = {
    standard: {
      label: "Стандартна",
      title: "Стандартна політика",
      thresholds: [1, 5, 10, 20]
    },

    key: {
      label: "Ключовий клієнт",
      title: "Політика для ключового клієнта",
      thresholds: [1, 7, 14, 30]
    },

    strict: {
      label: "Жорсткий контроль",
      title: "Політика жорсткого контролю",
      thresholds: [1, 3, 7, 14]
    }
  };

  const templateNames = {
    1: "Дружнє нагадування про оплату",
    2: "Повторне нагадування про оплату",
    3: "Фінальне попередження про оплату",
    4: "Офіційна претензія"
  };

  const templateSubjects = {
    1: "Уточнення статусу оплати за рахунком INV-4821",
    2: "Повторне нагадування щодо оплати за рахунком INV-4821",
    3: "Фінальне нагадування щодо погашення заборгованості за рахунком INV-4821",
    4: "Претензія щодо погашення простроченої заборгованості за рахунком INV-4821"
  };

  const stepOrder = [
    "erp",
    "detect",
    "prepare",
    "approval",
    "send",
    "monitor",
    "result"
  ];

  const els = {
    startButton: root.querySelector("#arStartButton"),
    runtimeStatus: root.querySelector("#arRuntimeStatus"),
    simulationTime: root.querySelector("#arSimulationTime"),
    systemFeed: root.querySelector("#arSystemFeed"),
    managerChat: root.querySelector("#arManagerChat"),
    managerActions: root.querySelector("#arManagerActions"),
    auditLog: root.querySelector("#arAuditLog"),
    paidAmount: root.querySelector("#arPaidAmount"),
    outstandingAmount: root.querySelector("#arOutstandingAmount"),
    daysOverdue: root.querySelector("#arDaysOverdue"),
    policyLabel: root.querySelector("#arPolicyLabel"),
    postponePanel: root.querySelector("#arPostponePanel"),
    postponeDate: root.querySelector("#arPostponeDate"),
    timeTravel: root.querySelector("#arTimeTravel"),
    nextEventText: root.querySelector("#arNextEventText"),
    advanceTimeButton: root.querySelector("#arAdvanceTimeButton"),
    customerOutcome: root.querySelector("#arCustomerOutcome"),
    promisePanel: root.querySelector("#arPromisePanel"),
    promiseBrokenPanel: root.querySelector("#arPromiseBrokenPanel"),
    partialPanel: root.querySelector("#arPartialPanel"),
    disputePanel: root.querySelector("#arDisputePanel"),
    paymentProofPanel: root.querySelector("#arPaymentProofPanel"),
    letterModal: root.querySelector("#arLetterModal"),
    letterTemplateNumber: root.querySelector("#arLetterTemplateNumber"),
    letterTemplateName: root.querySelector("#arLetterTemplateName"),
    letterSubject: root.querySelector("#arLetterSubject"),
    letterContent: root.querySelector("#arLetterContent"),
    letterOutstanding: root.querySelector("#arLetterOutstanding"),
    letterOverdue: root.querySelector("#arLetterOverdue"),
    letterPreviousContacts: root.querySelector("#arLetterPreviousContacts"),
    claimGate: root.querySelector("#arClaimGate"),
    legalPackage: root.querySelector("#arLegalPackage"),
    successScreen: root.querySelector("#arSuccessScreen"),
    manualReviewScreen: root.querySelector("#arManualReviewScreen"),
    auditExpand: root.querySelector("[data-ar-audit-expand]"),
    processOverview: root.querySelector(".ar-process-overview")
  };

  let previousDocumentOverflow = "";
  let state = createInitialState();

  window.__spCase11UkCleanup = () => {
    state.runToken += 1;
    controller.abort();

    if (els.letterModal?.classList.contains("is-open")) {
      els.letterModal.classList.remove("is-open");
      els.letterModal.setAttribute("aria-hidden", "true");
      document.documentElement.style.overflow = previousDocumentOverflow;
    }
  };

  function on(element, eventName, handler) {
    if (!element) {
      return;
    }

    element.addEventListener(eventName, handler, { signal });
  }

  function createInitialState() {
    return {
      source: getSelectedSource() || "sap",
      policy: getSelectedPolicy() || "standard",
      started: false,
      busy: false,
      runToken: 0,
      currentDate: new Date(baseDate.getTime()),
      invoiceAmount: 350000,
      paid: 0,
      outstanding: 350000,
      currentLevel: 1,
      currentPreviewLevel: 1,
      contactsSent: 0,
      sentDates: [],
      claimSent: false,
      claimDeadline: null,
      promiseDate: null,
      promiseBroken: false,
      pendingBrokenPromiseLevel: null,
      customerOutcomeContext: "",
      postponeContext: null,
      pendingTimeContext: null,
      nextDate: null,
      partialCount: 0,
      closed: false,
      manualReview: false
    };
  }

  function createDate(value) {
    const [year, month, day] = value.split("-").map(Number);

    return new Date(
      Date.UTC(
        year,
        month - 1,
        day,
        8,
        0,
        0
      )
    );
  }

  function cloneDate(date) {
    return new Date(date.getTime());
  }

  function addDays(date, amount) {
    const result = cloneDate(date);

    result.setUTCDate(
      result.getUTCDate() + amount
    );

    return result;
  }

  function addBusinessDays(date, amount) {
    const result = cloneDate(date);
    let added = 0;

    while (added < amount) {
      result.setUTCDate(
        result.getUTCDate() + 1
      );

      const day = result.getUTCDay();

      if (day !== 0 && day !== 6) {
        added += 1;
      }
    }

    return result;
  }

  function differenceInDays(later, earlier) {
    const laterValue = Date.UTC(
      later.getUTCFullYear(),
      later.getUTCMonth(),
      later.getUTCDate()
    );

    const earlierValue = Date.UTC(
      earlier.getUTCFullYear(),
      earlier.getUTCMonth(),
      earlier.getUTCDate()
    );

    return Math.max(
      0,
      Math.floor(
        (laterValue - earlierValue) / 86400000
      )
    );
  }

  function formatDate(date) {
    return new Intl.DateTimeFormat(
      "uk-UA",
      {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        timeZone: "UTC"
      }
    ).format(date);
  }

  function formatTime(date) {
    return new Intl.DateTimeFormat(
      "uk-UA",
      {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
        timeZone: "UTC"
      }
    ).format(date);
  }

  function formatDateTime(date) {
    return `${formatDate(date)} · ${formatTime(date)}`;
  }

  function formatUAH(value) {
    return `${new Intl.NumberFormat(
      "uk-UA",
      {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      }
    ).format(value)} грн`;
  }

  function pluralDays(value) {
    const mod10 = value % 10;
    const mod100 = value % 100;

    if (
      mod10 === 1 &&
      mod100 !== 11
    ) {
      return `${value} день`;
    }

    if (
      mod10 >= 2 &&
      mod10 <= 4 &&
      (
        mod100 < 12 ||
        mod100 > 14
      )
    ) {
      return `${value} дні`;
    }

    return `${value} днів`;
  }

  function wait(ms, token = state.runToken) {
    return new Promise(resolve => {
      window.setTimeout(() => {
        resolve(
          token === state.runToken &&
          root.isConnected
        );
      }, ms);
    });
  }

  function getSelectedSource() {
    return root
      .querySelector("[data-ar-source].active")
      ?.dataset
      .arSource;
  }

  function getSelectedPolicy() {
    return root
      .querySelector("[data-ar-policy].active")
      ?.dataset
      .arPolicy;
  }

  function getSourceName() {
    return state.source === "1c"
      ? "1C"
      : "SAP";
  }

  function getPolicy() {
    return policies[state.policy] || policies.standard;
  }

  function getDaysOverdue() {
    return differenceInDays(
      state.currentDate,
      dueDate
    );
  }

  function getRuleDate(level) {
    const threshold =
      getPolicy().thresholds[level - 1];

    return addDays(
      dueDate,
      threshold
    );
  }

  function getNextEscalationDate(level) {
    const target = getRuleDate(level);
    const tomorrow = addDays(
      state.currentDate,
      1
    );

    if (
      target.getTime() <=
      state.currentDate.getTime()
    ) {
      return tomorrow;
    }

    return target;
  }

  function setBusy(value) {
    state.busy = value;
  }

  function setStatus(text, tone = "normal") {
    if (!els.runtimeStatus) {
      return;
    }

    els.runtimeStatus.textContent = text;
    els.runtimeStatus.style.color = "";

    if (tone === "success") {
      els.runtimeStatus.style.color = "#9ee86e";
    }

    if (tone === "warning") {
      els.runtimeStatus.style.color = "#e8c76c";
    }

    if (tone === "error") {
      els.runtimeStatus.style.color = "#ef7f7f";
    }
  }

  function updateSimulationHeader() {
    if (els.simulationTime) {
      els.simulationTime.textContent =
        formatDateTime(state.currentDate);
    }

    if (els.paidAmount) {
      els.paidAmount.textContent =
        formatUAH(state.paid);
    }

    if (els.outstandingAmount) {
      els.outstandingAmount.textContent =
        formatUAH(state.outstanding);
    }

    if (els.daysOverdue) {
      els.daysOverdue.textContent =
        pluralDays(getDaysOverdue());
    }
  }

  function updatePolicyUi() {
    const policy = getPolicy();

    if (els.policyLabel) {
      els.policyLabel.textContent =
        policy.label;
    }

    const firstEnd =
      Math.max(
        1,
        policy.thresholds[1] - 1
      );

    const labels = [
      `1–${firstEnd} дні`,
      `${policy.thresholds[1]}+ днів`,
      `${policy.thresholds[2]}+ днів`,
      `${policy.thresholds[3]}+ днів`
    ];

    const names = [
      "reminder1",
      "reminder2",
      "reminder3",
      "claim"
    ];

    names.forEach((name, index) => {
      const span = root.querySelector(
        `[data-ar-rule="${name}"] > span`
      );

      if (span) {
        span.textContent = labels[index];
      }
    });
  }

  function lockScenarioControls(locked) {
    root
      .querySelectorAll(
        "[data-ar-source], [data-ar-policy]"
      )
      .forEach(button => {
        button.disabled = locked;
        button.style.opacity = locked ? "0.62" : "";
        button.style.cursor = locked ? "default" : "";
      });
  }

  function clearActiveRules() {
    root
      .querySelectorAll(".ar-rule-card.active")
      .forEach(card => {
        card.classList.remove("active");
      });
  }

  function highlightRule(rule) {
    clearActiveRules();

    let ruleName = "";

    if (typeof rule === "number") {
      if (rule === 1) {
        ruleName = "reminder1";
      }

      if (rule === 2) {
        ruleName = "reminder2";
      }

      if (rule === 3) {
        ruleName = "reminder3";
      }

      if (rule === 4) {
        ruleName = "claim";
      }
    } else {
      ruleName = rule;
    }

    root
      .querySelector(
        `[data-ar-rule="${ruleName}"]`
      )
      ?.classList
      .add("active");
  }

  function activateStep(step, mode = "active") {
    const targetIndex =
      stepOrder.indexOf(step);

    root
      .querySelectorAll("[data-ar-step]")
      .forEach(node => {
        const nodeIndex =
          stepOrder.indexOf(
            node.dataset.arStep
          );

        node.classList.remove(
          "active",
          "done",
          "paused",
          "error"
        );

        if (
          nodeIndex >= 0 &&
          nodeIndex < targetIndex
        ) {
          node.classList.add("done");
        }

        if (
          node.dataset.arStep === step
        ) {
          node.classList.add(mode);
        }
      });
  }

  function setProcessing(value) {
    els.processOverview
      ?.classList
      .toggle("processing", value);
  }

  function clearSystemFeed() {
    if (els.systemFeed) {
      els.systemFeed.innerHTML = "";
    }
  }

  function clearManagerChat() {
    if (els.managerChat) {
      els.managerChat.innerHTML = "";
    }
  }

  function clearAuditLog() {
    if (els.auditLog) {
      els.auditLog.innerHTML = "";
    }
  }

  function addSystemEvent(
    type,
    title,
    text,
    time = state.currentDate
  ) {
    if (!els.systemFeed) {
      return;
    }

    const item =
      document.createElement("div");

    item.className =
      `ar-system-event ${type || ""}`.trim();

    const timeElement =
      document.createElement("span");

    timeElement.className =
      "ar-event-time";

    timeElement.textContent =
      formatDateTime(time);

    const titleElement =
      document.createElement("strong");

    titleElement.textContent =
      title;

    const textElement =
      document.createElement("p");

    textElement.textContent =
      text;

    item.append(
      timeElement,
      titleElement,
      textElement
    );

    els.systemFeed.appendChild(item);

    els.systemFeed.scrollTop =
      els.systemFeed.scrollHeight;
  }

  function addAudit(
    type,
    title,
    text,
    time = state.currentDate
  ) {
    if (!els.auditLog) {
      return;
    }

    const item =
      document.createElement("div");

    item.className =
      `ar-audit-item ${type || ""}`.trim();

    const timeElement =
      document.createElement("time");

    timeElement.textContent =
      formatDateTime(time);

    const titleElement =
      document.createElement("strong");

    titleElement.textContent =
      title;

    const textElement =
      document.createElement("p");

    textElement.textContent =
      text;

    item.append(
      timeElement,
      titleElement,
      textElement
    );

    els.auditLog.appendChild(item);

    els.auditLog.scrollTop =
      els.auditLog.scrollHeight;
  }

  function appendChat(
    role,
    author,
    html,
    meta = ""
  ) {
    if (!els.managerChat) {
      return;
    }

    const item =
      document.createElement("div");

    item.className =
      `ar-chat-message ${
        role === "manager"
          ? "manager"
          : ""
      }`.trim();

    const authorElement =
      document.createElement("span");

    authorElement.className =
      "ar-chat-author";

    authorElement.textContent =
      author;

    const message =
      document.createElement("p");

    message.innerHTML =
      html;

    const metaElement =
      document.createElement("span");

    metaElement.className =
      "ar-chat-meta";

    metaElement.textContent =
      meta ||
      formatTime(state.currentDate);

    item.append(
      authorElement,
      message,
      metaElement
    );

    els.managerChat.appendChild(item);

    els.managerChat.scrollTop =
      els.managerChat.scrollHeight;
  }

  function showManagerActions() {
    if (els.managerActions) {
      els.managerActions.hidden = false;
    }
  }

  function hideManagerActions() {
    if (els.managerActions) {
      els.managerActions.hidden = true;
    }
  }

  function hideOutcomePanelsOnly() {
    [
      els.postponePanel,
      els.timeTravel,
      els.customerOutcome,
      els.promisePanel,
      els.promiseBrokenPanel,
      els.partialPanel,
      els.disputePanel,
      els.paymentProofPanel
    ].forEach(element => {
      if (element) {
        element.hidden = true;
      }
    });
  }

  function hideAllDynamicPanels() {
    [
      els.postponePanel,
      els.timeTravel,
      els.customerOutcome,
      els.promisePanel,
      els.promiseBrokenPanel,
      els.partialPanel,
      els.disputePanel,
      els.paymentProofPanel,
      els.claimGate,
      els.legalPackage,
      els.successScreen,
      els.manualReviewScreen
    ].forEach(element => {
      if (element) {
        element.hidden = true;
      }
    });
  }

  async function startProcess() {
    if (
      state.started ||
      state.busy
    ) {
      return;
    }

    state.started = true;
    state.runToken += 1;

    const token = state.runToken;

    setBusy(true);
    lockScenarioControls(true);
    hideAllDynamicPanels();
    hideManagerActions();
    clearSystemFeed();
    clearManagerChat();
    clearAuditLog();
    clearActiveRules();

    activateStep("erp");
    setProcessing(true);
    setStatus("В РОБОТІ");

    if (els.startButton) {
      els.startButton.disabled = true;
      els.startButton.innerHTML =
        "<span>●</span> Процес запущено";
    }

    addAudit(
      "success",
      "Симуляцію запущено",
      `${getPolicy().title}. Джерело даних: ${getSourceName()}.`
    );

    addSystemEvent(
      "success",
      `Підключення до ${getSourceName()} встановлено`,
      "Система отримала доступ до актуальних даних взаєморозрахунків із контрагентами."
    );

    if (!(await wait(650, token))) {
      return;
    }

    addSystemEvent(
      "success",
      "Відкриті позиції завантажено",
      "Знайдено рахунок INV-4821 із непогашеним залишком 350 000,00 грн."
    );

    addAudit(
      "success",
      "Перевірку бухгалтерської системи виконано",
      `Перевірено відкриті позиції ТОВ «Радуга» у ${getSourceName()}.`
    );

    if (!(await wait(700, token))) {
      return;
    }

    activateStep("detect");

    addSystemEvent(
      "warning",
      "Виявлено прострочення",
      `Строк оплати 23.08.2026 минув. Поточне прострочення: ${pluralDays(getDaysOverdue())}.`
    );

    addAudit(
      "warning",
      "Виявлено прострочений рахунок",
      `INV-4821 · ${formatUAH(state.outstanding)} · строк оплати 23.08.2026.`
    );

    if (!(await wait(750, token))) {
      return;
    }

    setProcessing(false);
    setBusy(false);

    await prepareLevel(1);
  }

  async function prepareLevel(level) {
    if (
      state.closed ||
      state.manualReview
    ) {
      return;
    }

    state.currentLevel = level;
    state.currentPreviewLevel = level;

    hideManagerActions();
    hideOutcomePanelsOnly();
    clearActiveRules();

    setBusy(true);
    setProcessing(true);
    activateStep("prepare");
    highlightRule(level);

    setStatus(
      level === 4
        ? "ГОТУЄТЬСЯ ПРЕТЕНЗІЯ"
        : `ГОТУЄТЬСЯ НАГАДУВАННЯ №${level}`
    );

    const token = state.runToken;

    addSystemEvent(
      "success",
      "Спрацювало бізнес-правило",
      level === 4
        ? `${getPolicy().title}: досягнуто рівня офіційної претензії.`
        : `${getPolicy().title}: обрано нагадування №${level} — «${templateNames[level]}».`
    );

    addAudit(
      "success",
      "Обрано наступний рівень комунікації",
      level === 4
        ? "Офіційна претензія потребує окремого підтвердження відповідальної особи."
        : `Система автоматично обрала шаблон №${level}.`
    );

    if (!(await wait(550, token))) {
      return;
    }

    addSystemEvent(
      "success",
      "Дані підставлено автоматично",
      `Контрагент, договір, рахунок, строк оплати, залишок ${formatUAH(state.outstanding)} та історію попередніх звернень додано до документа.`
    );

    addAudit(
      "success",
      "Чернетку сформовано",
      `Поточний борг: ${formatUAH(state.outstanding)}. Прострочення: ${pluralDays(getDaysOverdue())}.`
    );

    if (!(await wait(550, token))) {
      return;
    }

    if (level === 4) {
      setProcessing(false);
      setBusy(false);
      showClaimGate();
      return;
    }

    activateStep("approval");
    setProcessing(false);
    setBusy(false);

    setStatus(
      "ОЧІКУЄ ПОГОДЖЕННЯ",
      "warning"
    );

    appendChat(
      "system",
      "AR Control Bot",
      [
        "Виявлено прострочену дебіторську заборгованість.",
        `<br><br><b>Клієнт:</b> ТОВ «Радуга»`,
        `<br><b>Рахунок:</b> INV-4821`,
        `<br><b>Поточний борг:</b> ${formatUAH(state.outstanding)}`,
        `<br><b>Строк оплати:</b> 23.08.2026`,
        `<br><b>Прострочення:</b> ${pluralDays(getDaysOverdue())}`,
        `<br><b>Попередніх звернень:</b> ${state.contactsSent}`,
        `<br><br>Я підготувала <b>нагадування №${level}</b> — «${templateNames[level]}».`,
        "<br><br>Відправити лист клієнту?"
      ].join("")
    );

    showManagerActions();
  }

  function buildLetterPreview(level) {
    const template = root.querySelector(
      `[data-ar-template="${level}"]`
    );

    if (!template) {
      return null;
    }

    const wrapper =
      document.createElement("div");

    wrapper.appendChild(
      template.content.cloneNode(true)
    );

    const paragraphs =
      wrapper.querySelectorAll(
        ".ar-real-letter > p, .ar-formal-claim-document > p"
      );

    if (level === 1) {
      if (
        state.outstanding <
        state.invoiceAmount &&
        paragraphs[1]
      ) {
        paragraphs[1].textContent =
          `Хотіли б уточнити статус погашення залишку за рахунком № INV-4821 від 24.07.2026. Первісна сума рахунку становила ${formatUAH(state.invoiceAmount)}, а поточний непогашений залишок — ${formatUAH(state.outstanding)}.`;
      }

      if (paragraphs[3]) {
        paragraphs[3].textContent =
          `Станом на ${formatDate(state.currentDate)} надходження коштів, достатнє для повного закриття рахунку, у нашій обліковій системі не відображено.`;
      }
    }

    if (level === 2) {
      if (paragraphs[2]) {
        paragraphs[2].textContent =
          state.outstanding <
          state.invoiceAmount
            ? `Первісна сума рахунку становить ${formatUAH(state.invoiceAmount)}. З урахуванням отриманих оплат поточний непогашений залишок становить ${formatUAH(state.outstanding)}. Погоджений строк оплати настав 23.08.2026.`
            : `Сума рахунку становить ${formatUAH(state.invoiceAmount)}, а погоджений строк оплати настав 23.08.2026.`;
      }

      if (paragraphs[3]) {
        paragraphs[3].textContent =
          `Станом на ${formatDate(state.currentDate)} заборгованість у розмірі ${formatUAH(state.outstanding)} залишається непогашеною, а повне надходження коштів у нашій обліковій системі не зареєстровано.`;
      }
    }

    if (level === 3) {
      if (paragraphs[1]) {
        paragraphs[1].textContent =
          `Звертаємо вашу увагу, що за рахунком № INV-4821 від 24.07.2026 залишається непогашена заборгованість у розмірі ${formatUAH(state.outstanding)}.`;
      }

      if (paragraphs[2]) {
        paragraphs[2].textContent =
          `Відповідно до погоджених умов строк оплати настав 23.08.2026. Станом на ${formatDate(state.currentDate)} прострочення становить ${pluralDays(getDaysOverdue())}.`;
      }
    }

    if (level === 4) {
      if (paragraphs[3]) {
        paragraphs[3].textContent =
          `Станом на ${formatDate(state.currentDate)} повна оплата за рахунком № INV-4821 на рахунок ТОВ «Демо Компані» не надійшла.`;
      }

      if (paragraphs[4]) {
        paragraphs[4].textContent =
          `Таким чином, сума простроченої заборгованості ТОВ «Радуга» перед ТОВ «Демо Компані» становить ${formatUAH(state.outstanding)}.`;
      }

      if (paragraphs[7]) {
        paragraphs[7].textContent =
          `У зв’язку з викладеним вимагаємо погасити заборгованість у розмірі ${formatUAH(state.outstanding)} у повному обсязі протягом 5 робочих днів з моменту отримання цієї претензії.`;
      }

      updateClaimDocument(wrapper);
    }

    return wrapper;
  }

  function updateClaimDocument(wrapper) {
    const dateElement =
      wrapper.querySelector(
        ".ar-claim-meta span:nth-child(2)"
      );

    if (dateElement) {
      dateElement.textContent =
        `від ${formatDate(state.currentDate)}`;
    }

    const history =
      wrapper.querySelector(
        ".ar-claim-history"
      );

    if (!history) {
      return;
    }

    history.innerHTML = "";

    const fallbackDates = [
      getRuleDate(1),
      getRuleDate(2),
      getRuleDate(3)
    ];

    const labels = [
      "Перше нагадування про оплату",
      "Повторне нагадування про оплату",
      "Фінальне попередження про оплату"
    ];

    labels.forEach((label, index) => {
      const row =
        document.createElement("div");

      const date =
        state.sentDates[index] ||
        fallbackDates[index];

      const dateSpan =
        document.createElement("span");

      const action =
        document.createElement("strong");

      dateSpan.textContent =
        formatDate(date);

      action.textContent =
        label;

      row.append(
        dateSpan,
        action
      );

      history.appendChild(row);
    });
  }

  function openLetter(level) {
    if (
      !els.letterModal ||
      !els.letterContent
    ) {
      return;
    }

    const preview =
      buildLetterPreview(level);

    if (!preview) {
      return;
    }

    state.currentPreviewLevel = level;

    if (els.letterTemplateNumber) {
      els.letterTemplateNumber.textContent =
        level === 4
          ? "ОФІЦІЙНА ПРЕТЕНЗІЯ"
          : `ШАБЛОН №${level}`;
    }

    if (els.letterTemplateName) {
      els.letterTemplateName.textContent =
        templateNames[level];
    }

    if (els.letterSubject) {
      els.letterSubject.textContent =
        templateSubjects[level];
    }

    if (els.letterOutstanding) {
      els.letterOutstanding.textContent =
        formatUAH(state.outstanding);
    }

    if (els.letterOverdue) {
      els.letterOverdue.textContent =
        String(getDaysOverdue());
    }

    if (els.letterPreviousContacts) {
      els.letterPreviousContacts.textContent =
        String(state.contactsSent);
    }

    els.letterContent.innerHTML = "";

    while (preview.firstChild) {
      els.letterContent.appendChild(
        preview.firstChild
      );
    }

    if (
      !els.letterModal.classList.contains(
        "is-open"
      )
    ) {
      previousDocumentOverflow =
        document.documentElement.style.overflow;
    }

    document.documentElement.style.overflow =
      "hidden";

    els.letterModal.classList.add(
      "is-open"
    );

    els.letterModal.setAttribute(
      "aria-hidden",
      "false"
    );
  }

  function closeLetter() {
    if (!els.letterModal) {
      return;
    }

    els.letterModal.classList.remove(
      "is-open"
    );

    els.letterModal.setAttribute(
      "aria-hidden",
      "true"
    );

    document.documentElement.style.overflow =
      previousDocumentOverflow;
  }

  async function approveReminder() {
    if (
      state.busy ||
      state.currentLevel >= 4
    ) {
      return;
    }

    hideManagerActions();
    closeLetter();

    appendChat(
      "manager",
      "Олександр Коваленко",
      "Так. Відправити клієнту."
    );

    addAudit(
      "success",
      "Менеджер підтвердив відправлення",
      `Нагадування №${state.currentLevel} погоджено.`
    );

    await sendReminder(
      state.currentLevel
    );
  }

  async function sendReminder(level) {
    setBusy(true);
    setProcessing(true);
    activateStep("send");

    setStatus("ВІДПРАВЛЕННЯ");

    const token =
      state.runToken;

    addSystemEvent(
      "success",
      "Погодження менеджера отримано",
      "Рішення записано до Audit Trail."
    );

    if (!(await wait(450, token))) {
      return;
    }

    addSystemEvent(
      "success",
      "Email сформовано",
      `Одержувач: accounting@raduga.ua. Копія: manager@demo-company.ua. Нагадування №${level}.`
    );

    if (!(await wait(520, token))) {
      return;
    }

    state.contactsSent += 1;

    state.sentDates.push(
      cloneDate(state.currentDate)
    );

    addSystemEvent(
      "success",
      "Лист відправлено",
      `«${templateNames[level]}» успішно відправлено клієнту.`
    );

    addAudit(
      "success",
      `Нагадування №${level} відправлено`,
      "Лист направлено клієнту. Менеджера додано в копію."
    );

    if (!(await wait(450, token))) {
      return;
    }

    activateStep("monitor");
    setProcessing(false);
    setBusy(false);

    setStatus("МОНІТОРИНГ");

    addSystemEvent(
      "success",
      "Контроль продовжується",
      "Система очікує оплату, відповідь клієнта або наступну контрольну дату."
    );

    showCustomerOutcome(
      "after-contact"
    );
  }

  function beginPostpone(source) {
    if (state.busy) {
      return;
    }

    hideManagerActions();
    hideOutcomePanelsOnly();

    state.postponeContext = {
      type:
        source === "claim"
          ? "claim"
          : "reminder",

      level: state.currentLevel
    };

    if (source === "decline") {
      appendChat(
        "manager",
        "Олександр Коваленко",
        "Ні. Поки не відправляти."
      );

      addAudit(
        "warning",
        "Менеджер відмовився від відправлення",
        `Нагадування №${state.currentLevel} не відправлено.`
      );
    }

    if (source === "postpone") {
      appendChat(
        "manager",
        "Олександр Коваленко",
        "Нагадати мені про цей лист пізніше."
      );

      addAudit(
        "warning",
        "Рішення відкладено",
        `Нагадування №${state.currentLevel} залишається підготовленим.`
      );
    }

    if (source === "claim") {
      if (els.claimGate) {
        els.claimGate.hidden = true;
      }

      appendChat(
        "manager",
        "Олександр Коваленко",
        "Претензію поки не відправляти. Повернутися до цього питання пізніше."
      );

      addAudit(
        "warning",
        "Рішення щодо претензії відкладено",
        "Документ сформовано, але відправлення не підтверджено."
      );
    }

    if (els.postponePanel) {
      els.postponePanel.hidden = false;

      els.postponePanel.scrollIntoView({
        behavior: "smooth",
        block: "nearest"
      });
    }

    setStatus(
      "РІШЕННЯ ВІДКЛАДЕНО",
      "warning"
    );
  }

  function schedulePostpone(date) {
    if (!state.postponeContext) {
      return;
    }

    const minimum =
      addDays(
        state.currentDate,
        1
      );

    const selected =
      date.getTime() <
      minimum.getTime()
        ? minimum
        : date;

    addAudit(
      "warning",
      "Наступне нагадування заплановано",
      `Система повернеться до рішення ${formatDate(selected)}.`
    );

    addSystemEvent(
      "warning",
      "Рішення менеджера збережено",
      `Відправлення не виконується. Наступна контрольна дата: ${formatDate(selected)}.`
    );

    if (els.postponePanel) {
      els.postponePanel.hidden = true;
    }

    scheduleTimeTravel(
      selected,
      {
        type: "manager-postpone",
        level: state.postponeContext.level,
        sourceType: state.postponeContext.type
      }
    );

    state.postponeContext = null;
  }

  function scheduleTimeTravel(
    date,
    context
  ) {
    state.nextDate =
      cloneDate(date);

    state.pendingTimeContext =
      context;

    if (els.nextEventText) {
      els.nextEventText.textContent =
        `Наступна контрольна дата: ${formatDate(date)}`;
    }

    if (els.timeTravel) {
      els.timeTravel.hidden = false;

      els.timeTravel.scrollIntoView({
        behavior: "smooth",
        block: "nearest"
      });
    }
  }

  async function advanceTime() {
    if (
      state.busy ||
      !state.nextDate ||
      !state.pendingTimeContext
    ) {
      return;
    }

    setBusy(true);

    const context =
      state.pendingTimeContext;

    state.currentDate =
      cloneDate(state.nextDate);

    state.nextDate = null;
    state.pendingTimeContext = null;

    if (els.timeTravel) {
      els.timeTravel.hidden = true;
    }

    updateSimulationHeader();

    activateStep("erp");
    setProcessing(true);

    setStatus(
      "ПОВТОРНА ПЕРЕВІРКА"
    );

    addSystemEvent(
      "success",
      "Час симуляції змінено",
      `Поточна дата: ${formatDate(state.currentDate)}.`
    );

    addAudit(
      "success",
      "Настала контрольна дата",
      `Автоматична перевірка запущена ${formatDate(state.currentDate)}.`
    );

    const token =
      state.runToken;

    if (!(await wait(500, token))) {
      return;
    }

    await simulateUnpaidCheck();

    setProcessing(false);
    setBusy(false);

    if (
      context.type ===
      "manager-postpone"
    ) {
      if (
        context.sourceType ===
        "claim"
      ) {
        showClaimGate();
      } else {
        await prepareLevel(
          context.level
        );
      }

      return;
    }

    if (
      context.type ===
      "escalation"
    ) {
      await prepareLevel(
        context.level
      );

      return;
    }

    if (
      context.type ===
      "promise-check"
    ) {
      activateStep("monitor");

      setStatus(
        "ОБІЦЯНА ДАТА НАСТАЛА",
        "warning"
      );

      addSystemEvent(
        "warning",
        "Настала обіцяна дата оплати",
        `Станом на ${formatDate(state.currentDate)} повну оплату в ${getSourceName()} не знайдено.`
      );

      addAudit(
        "warning",
        "Обіцяну дату перевірено",
        "Система очікує фактичний результат: оплату, часткову оплату або відсутність платежу."
      );

      showCustomerOutcome(
        "promise-check"
      );

      return;
    }

    if (
      context.type ===
      "claim-deadline"
    ) {
      activateStep("monitor");

      setStatus(
        "СТРОК ПРЕТЕНЗІЇ МИНУВ",
        "warning"
      );

      addSystemEvent(
        "warning",
        "Строк добровільного погашення минув",
        "Повну оплату після претензії не підтверджено."
      );

      addAudit(
        "warning",
        "Строк після претензії завершився",
        `Станом на ${formatDate(state.currentDate)} борг залишається відкритим.`
      );

      showCustomerOutcome(
        "claim-deadline"
      );
    }
  }

  async function simulateUnpaidCheck() {
    const token =
      state.runToken;

    addSystemEvent(
      "success",
      `Перевірка оплати в ${getSourceName()}`,
      `Рахунок INV-4821. Поточний залишок: ${formatUAH(state.outstanding)}.`
    );

    if (!(await wait(420, token))) {
      return false;
    }

    addSystemEvent(
      "warning",
      "Нових надходжень не знайдено",
      `У ${getSourceName()} не зареєстровано платежу, достатнього для повного закриття рахунку.`
    );

    addAudit(
      "warning",
      "Повторну перевірку завершено",
      `Поточний непогашений залишок: ${formatUAH(state.outstanding)}.`
    );

    return true;
  }

  function showCustomerOutcome(context) {
    state.customerOutcomeContext =
      context;

    if (!els.customerOutcome) {
      return;
    }

    const heading =
      els.customerOutcome.querySelector(
        ".ar-panel-heading strong"
      );

    const intro =
      els.customerOutcome.querySelector(
        ".ar-customer-outcome-intro"
      );

    if (heading) {
      if (
        context ===
        "promise-check"
      ) {
        heading.textContent =
          "Що сталося в обіцяну клієнтом дату?";
      } else if (
        context ===
        "claim-deadline"
      ) {
        heading.textContent =
          "Що сталося після офіційної претензії?";
      } else {
        heading.textContent =
          "Що сталося після контакту з клієнтом?";
      }
    }

    if (intro) {
      if (
        context ===
        "promise-check"
      ) {
        intro.textContent =
          "Система дочекалася обіцяної дати та повторно перевірила бухгалтерські дані. У демо оберіть фактичний розвиток подій.";
      } else if (
        context ===
        "claim-deadline"
      ) {
        intro.textContent =
          "Строк добровільного погашення після претензії минув. У демо оберіть, що відбулося далі.";
      } else {
        intro.textContent =
          "У реальному процесі ці події надходили б із SAP, 1C, банківської виписки, email або CRM. У демо ви самі обираєте розвиток ситуації.";
      }
    }

    updateOutcomeCardAmounts();

    els.customerOutcome.hidden =
      false;

    els.customerOutcome.scrollIntoView({
      behavior: "smooth",
      block: "nearest"
    });
  }

  function updateOutcomeCardAmounts() {
    const paidCard =
      root.querySelector(
        '[data-ar-outcome="paid"] small'
      );

    const partialCard =
      root.querySelector(
        '[data-ar-outcome="partial"] small'
      );

    if (paidCard) {
      paidCard.textContent =
        `${formatUAH(state.outstanding)} буде зараховано повністю`;
    }

    if (partialCard) {
      partialCard.textContent =
        `Клієнт оплатив ${formatUAH(getPartialAmount())}`;
    }
  }

  function getPartialAmount() {
    if (
      state.outstanding >
      200000
    ) {
      return 200000;
    }

    const calculated =
      Math.round(
        (
          state.outstanding *
          0.6
        ) /
        1000
      ) *
      1000;

    return Math.min(
      state.outstanding - 1000,
      Math.max(
        10000,
        calculated
      )
    );
  }

  async function handleCustomerOutcome(
    outcome
  ) {
    if (
      state.busy ||
      state.closed ||
      state.manualReview
    ) {
      return;
    }

    if (els.customerOutcome) {
      els.customerOutcome.hidden = true;
    }

    if (outcome === "paid") {
      await handleFullPayment();
      return;
    }

    if (outcome === "partial") {
      handlePartialPayment();
      return;
    }

    if (outcome === "promise") {
      handlePromise();
      return;
    }

    if (outcome === "no-response") {
      await handleNoResponse();
      return;
    }

    if (outcome === "dispute") {
      handleDispute();
      return;
    }

    if (outcome === "payment-proof") {
      handlePaymentProof();
    }
  }

  async function handleFullPayment() {
    setBusy(true);
    activateStep("erp");
    setProcessing(true);

    setStatus(
      "ОПЛАТУ ВИЯВЛЕНО",
      "success"
    );

    const token =
      state.runToken;

    addSystemEvent(
      "success",
      "Виявлено новий платіж",
      `${getSourceName()} містить нову бухгалтерську операцію за рахунком INV-4821.`
    );

    if (!(await wait(520, token))) {
      return;
    }

    const received =
      state.outstanding;

    state.paid += received;
    state.outstanding = 0;

    updateSimulationHeader();

    addSystemEvent(
      "success",
      "Платіж зіставлено з рахунком",
      `${formatUAH(received)} автоматично віднесено на INV-4821.`
    );

    addAudit(
      "success",
      "Оплату отримано",
      `${formatUAH(received)} зараховано. Непогашений залишок: 0,00 грн.`
    );

    if (!(await wait(520, token))) {
      return;
    }

    setProcessing(false);
    setBusy(false);

    closeCase();
  }

  function handlePartialPayment() {
    const payment =
      getPartialAmount();

    const before =
      state.outstanding;

    state.paid += payment;
    state.outstanding -= payment;
    state.partialCount += 1;

    updateSimulationHeader();
    highlightRule("partial");

    addSystemEvent(
      "success",
      "Виявлено часткову оплату",
      `Надійшло ${formatUAH(payment)}. Залишок автоматично змінено з ${formatUAH(before)} на ${formatUAH(state.outstanding)}.`
    );

    addAudit(
      "success",
      "Часткову оплату зараховано",
      `Отримано ${formatUAH(payment)}. Новий залишок: ${formatUAH(state.outstanding)}.`
    );

    const fields =
      els.partialPanel
        ?.querySelectorAll(
          ".ar-payment-reconciliation > div"
        );

    if (
      fields &&
      fields.length >= 4
    ) {
      const value0 =
        fields[0].querySelector("strong");

      const value1 =
        fields[1].querySelector("strong");

      const value2 =
        fields[2].querySelector("strong");

      const value3 =
        fields[3].querySelector("strong");

      if (value0) {
        value0.textContent =
          formatUAH(before);
      }

      if (value1) {
        value1.textContent =
          formatUAH(payment);
      }

      if (value2) {
        value2.textContent =
          formatUAH(state.outstanding);
      }

      if (value3) {
        value3.textContent =
          "ЧАСТКОВО ОПЛАЧЕНО";
      }
    }

    const description =
      els.partialPanel
        ?.querySelector(":scope > p");

    if (description) {
      description.textContent =
        `Кейс не закривається. Усі наступні листи, повідомлення менеджеру та перевірки будуть автоматично сформовані вже на фактичний залишок ${formatUAH(state.outstanding)}.`;
    }

    if (els.partialPanel) {
      els.partialPanel.hidden = false;

      els.partialPanel.scrollIntoView({
        behavior: "smooth",
        block: "nearest"
      });
    }

    setStatus(
      "ЧАСТКОВО ОПЛАЧЕНО",
      "warning"
    );
  }

  function continueAfterPartial() {
    if (els.partialPanel) {
      els.partialPanel.hidden = true;
    }

    addSystemEvent(
      "warning",
      "Кейс залишається відкритим",
      `Система продовжує контроль непогашеного залишку ${formatUAH(state.outstanding)}.`
    );

    if (state.claimSent) {
      const recheckDate =
        addDays(
          state.currentDate,
          3
        );

      addAudit(
        "warning",
        "Після претензії залишився непогашений борг",
        `Наступну перевірку призначено на ${formatDate(recheckDate)}.`
      );

      scheduleTimeTravel(
        recheckDate,
        {
          type: "claim-deadline"
        }
      );

      return;
    }

    const nextLevel =
      Math.min(
        state.currentLevel + 1,
        4
      );

    const nextDate =
      getNextEscalationDate(
        nextLevel
      );

    addAudit(
      "warning",
      "Контроль залишку продовжується",
      `Наступний рівень буде перевірено ${formatDate(nextDate)}.`
    );

    scheduleTimeTravel(
      nextDate,
      {
        type: "escalation",
        level: nextLevel
      }
    );
  }

  function handlePromise() {
    state.promiseDate =
      addDays(
        state.currentDate,
        5
      );

    state.promiseBroken = false;

    highlightRule("promise");

    addSystemEvent(
      "success",
      "Виявлено обіцянку оплати",
      `Із відповіді клієнта визначено дату платежу: ${formatDate(state.promiseDate)}.`
    );

    addAudit(
      "success",
      "Обіцяну дату оплати збережено",
      `Автоматичну ескалацію призупинено до ${formatDate(state.promiseDate)}.`
    );

    const reply =
      els.promisePanel
        ?.querySelector(
          ".ar-customer-reply p"
        );

    const detected =
      els.promisePanel
        ?.querySelector(
          ".ar-promise-detected strong"
        );

    const description =
      els.promisePanel
        ?.querySelector(
          ".ar-promise-detected p"
        );

    if (reply) {
      reply.textContent =
        `Добрий день. Оплату за рахунком INV-4821 плануємо провести ${formatDate(state.promiseDate)}. Просимо врахувати цю дату.`;
    }

    if (detected) {
      detected.textContent =
        `Обіцяна дата оплати: ${formatDate(state.promiseDate)}`;
    }

    if (description) {
      description.textContent =
        `Нові нагадування клієнту не надсилатимуться. Наступна перевірка оплати відбудеться після настання обіцяної дати ${formatDate(state.promiseDate)}.`;
    }

    if (els.promisePanel) {
      els.promisePanel.hidden = false;

      els.promisePanel.scrollIntoView({
        behavior: "smooth",
        block: "nearest"
      });
    }

    setStatus(
      "ОЧІКУЄМО ОБІЦЯНУ ДАТУ",
      "warning"
    );
  }

  function acceptPromise() {
    if (!state.promiseDate) {
      return;
    }

    if (els.promisePanel) {
      els.promisePanel.hidden = true;
    }

    addSystemEvent(
      "warning",
      "Ескалацію поставлено на паузу",
      `До ${formatDate(state.promiseDate)} нові нагадування клієнту не надсилатимуться.`
    );

    scheduleTimeTravel(
      state.promiseDate,
      {
        type: "promise-check"
      }
    );
  }

  function showBrokenPromise() {
    state.promiseBroken = true;

    const nextLevel =
      Math.min(
        Math.max(
          state.currentLevel + 1,
          2
        ),
        4
      );

    state.pendingBrokenPromiseLevel =
      nextLevel;

    highlightRule("promise");

    activateStep(
      "monitor",
      "error"
    );

    setStatus(
      "ОБІЦЯНКУ ПОРУШЕНО",
      "error"
    );

    addSystemEvent(
      "error",
      "Обіцяну дату порушено",
      `Клієнт сам назвав дату ${formatDate(state.promiseDate || state.currentDate)}, але на цю дату оплату не отримано.`
    );

    addAudit(
      "error",
      "Клієнт не виконав обіцянку щодо оплати",
      `Процес переходить до наступного рівня: ${nextLevel === 4 ? "офіційна претензія" : `нагадування №${nextLevel}`}.`
    );

    if (!els.promiseBrokenPanel) {
      continueAfterBrokenPromise();
      return;
    }

    els.promiseBrokenPanel.classList.add(
      "ar-dispute-panel"
    );

    const fields =
      els.promiseBrokenPanel.querySelectorAll(
        ".ar-promise-broken-data > div strong"
      );

    if (fields[0]) {
      fields[0].textContent =
        formatDate(
          state.promiseDate ||
          state.currentDate
        );
    }

    if (fields[1]) {
      fields[1].textContent =
        "Оплату не знайдено";
    }

    if (fields[2]) {
      fields[2].textContent =
        nextLevel === 4
          ? "Офіційна претензія"
          : `Нагадування №${nextLevel}`;
    }

    let button =
      els.promiseBrokenPanel.querySelector(
        "[data-ar-promise-broken-continue]"
      );

    if (!button) {
      button =
        document.createElement("button");

      button.type = "button";
      button.className =
        "ar-start-button";

      button.dataset.arPromiseBrokenContinue =
        "true";

      button.textContent =
        "Перейти до наступного рівня";

      button.style.marginTop =
        "18px";

      on(
        button,
        "click",
        continueAfterBrokenPromise
      );

      els.promiseBrokenPanel.appendChild(
        button
      );
    }

    els.promiseBrokenPanel.hidden = false;

    els.promiseBrokenPanel.scrollIntoView({
      behavior: "smooth",
      block: "nearest"
    });
  }

  async function continueAfterBrokenPromise() {
    if (
      !state.pendingBrokenPromiseLevel
    ) {
      return;
    }

    const nextLevel =
      state.pendingBrokenPromiseLevel;

    state.pendingBrokenPromiseLevel =
      null;

    if (els.promiseBrokenPanel) {
      els.promiseBrokenPanel.hidden = true;
    }

    await prepareLevel(nextLevel);
  }

  function handleDispute() {
    highlightRule("dispute");

    activateStep(
      "monitor",
      "paused"
    );

    setStatus(
      "АВТОМАТИЗАЦІЮ ПРИЗУПИНЕНО",
      "error"
    );

    addSystemEvent(
      "error",
      "Виявлено бізнес-спір",
      "Клієнт оспорює поставку або суму. Стандартну процедуру стягнення зупинено."
    );

    addAudit(
      "error",
      "Автоматичне стягнення призупинено",
      "Причина: спір із клієнтом. Потрібен ручний розгляд."
    );

    if (els.disputePanel) {
      els.disputePanel.hidden = false;

      els.disputePanel.scrollIntoView({
        behavior: "smooth",
        block: "nearest"
      });
    }
  }

  function handlePaymentProof() {
    setStatus(
      "ПЕРЕВІРКА ПЛАТЕЖУ",
      "warning"
    );

    addSystemEvent(
      "warning",
      "Отримано платіжне доручення",
      "Клієнт повідомив про здійснений платіж. Подальшу ескалацію тимчасово призупинено."
    );

    addAudit(
      "warning",
      "Підтвердження платежу додано до кейса",
      "Файл payment_order_INV-4821.pdf збережено в історії."
    );

    if (els.paymentProofPanel) {
      els.paymentProofPanel.hidden = false;

      els.paymentProofPanel.scrollIntoView({
        behavior: "smooth",
        block: "nearest"
      });
    }
  }

  async function verifyPaymentProof() {
    if (state.busy) {
      return;
    }

    if (els.paymentProofPanel) {
      els.paymentProofPanel.hidden = true;
    }

    setBusy(true);
    activateStep("erp");
    setProcessing(true);

    setStatus(
      "ПЕРЕВІРКА ОПЛАТИ"
    );

    const token =
      state.runToken;

    addSystemEvent(
      "success",
      `Оновлення даних ${getSourceName()}`,
      "Бухгалтерські дані повторно синхронізовано після отримання платіжного доручення."
    );

    if (!(await wait(650, token))) {
      return;
    }

    const payment =
      state.outstanding;

    state.paid += payment;
    state.outstanding = 0;

    updateSimulationHeader();

    addSystemEvent(
      "success",
      "Надходження коштів підтверджено",
      `${formatUAH(payment)} знайдено в бухгалтерських даних та зіставлено з INV-4821.`
    );

    addAudit(
      "success",
      "Платіжне доручення підтверджено",
      "Дані клієнта збігаються з фактичним надходженням у бухгалтерській системі."
    );

    setProcessing(false);
    setBusy(false);

    closeCase();
  }

  async function handleNoResponse() {
    if (
      state.customerOutcomeContext ===
      "claim-deadline" &&
      state.claimSent
    ) {
      addSystemEvent(
        "error",
        "Оплати після претензії немає",
        "Клієнт не погасив заборгованість у встановлений строк."
      );

      addAudit(
        "error",
        "Офіційна претензія не дала результату",
        "Адміністративний цикл стягнення завершено без повної оплати."
      );

      showLegalPackage();
      return;
    }

    if (
      state.customerOutcomeContext ===
      "promise-check"
    ) {
      showBrokenPromise();
      return;
    }

    addSystemEvent(
      "warning",
      "Відповіді від клієнта немає",
      "Оплату не отримано, підтвердженої дати платежу немає, клієнт не відповів."
    );

    addAudit(
      "warning",
      "Клієнт не відповів",
      `Поточний рівень роботи із заборгованістю: ${state.currentLevel}.`
    );

    const nextLevel =
      Math.min(
        state.currentLevel + 1,
        4
      );

    const nextDate =
      getNextEscalationDate(
        nextLevel
      );

    setStatus(
      "ОЧІКУЄМО НАСТУПНИЙ РІВЕНЬ",
      "warning"
    );

    addSystemEvent(
      "warning",
      "Наступний контроль заплановано",
      `Якщо ситуація не зміниться, система повернеться до кейса ${formatDate(nextDate)}.`
    );

    scheduleTimeTravel(
      nextDate,
      {
        type: "escalation",
        level: nextLevel
      }
    );
  }

  function showClaimGate() {
    state.currentLevel = 4;
    state.currentPreviewLevel = 4;

    hideManagerActions();
    hideOutcomePanelsOnly();

    highlightRule(4);
    activateStep("approval");

    setStatus(
      "ОЧІКУЄ ПОГОДЖЕННЯ ПРЕТЕНЗІЇ",
      "warning"
    );

    const values =
      els.claimGate
        ?.querySelectorAll(
          ".ar-claim-gate-data > div strong"
        );

    if (
      values &&
      values.length >= 4
    ) {
      values[0].textContent =
        formatUAH(state.outstanding);

      values[1].textContent =
        pluralDays(getDaysOverdue());

      values[2].textContent =
        String(state.contactsSent);

      values[3].textContent =
        "Юридичний розгляд";
    }

    addSystemEvent(
      "warning",
      "Офіційну претензію підготовлено",
      "Система дійшла до юридично значущого етапу та зупинилася перед відправленням."
    );

    addAudit(
      "warning",
      "Потрібне окреме підтвердження",
      "Претензія сформована, але система не має права самостійно виконати цей крок."
    );

    appendChat(
      "system",
      "AR Control Bot",
      [
        "Процес дійшов до рівня офіційної претензії.",
        `<br><br><b>Поточний борг:</b> ${formatUAH(state.outstanding)}`,
        `<br><b>Прострочення:</b> ${pluralDays(getDaysOverdue())}`,
        `<br><b>Попередніх нагадувань:</b> ${state.contactsSent}`,
        "<br><br>Претензію сформовано.",
        "<br>Перед її відправленням потрібне ваше окреме підтвердження."
      ].join("")
    );

    if (els.claimGate) {
      els.claimGate.hidden = false;

      els.claimGate.scrollIntoView({
        behavior: "smooth",
        block: "nearest"
      });
    }
  }

  async function approveClaim() {
    if (
      state.busy ||
      state.claimSent
    ) {
      return;
    }

    closeLetter();

    if (els.claimGate) {
      els.claimGate.hidden = true;
    }

    appendChat(
      "manager",
      "Олександр Коваленко",
      "Підтверджую відправлення офіційної претензії."
    );

    addAudit(
      "warning",
      "Менеджер погодив офіційну претензію",
      "Підтвердження відповідальної особи зафіксовано перед відправленням."
    );

    setBusy(true);
    setProcessing(true);
    activateStep("send");

    setStatus(
      "ВІДПРАВЛЕННЯ ПРЕТЕНЗІЇ",
      "warning"
    );

    const token =
      state.runToken;

    addSystemEvent(
      "success",
      "Претензію перевірено",
      "Реквізити, сума боргу, історія попередніх звернень та перелік додатків сформовані."
    );

    if (!(await wait(550, token))) {
      return;
    }

    state.claimSent = true;
    state.contactsSent += 1;

    state.sentDates.push(
      cloneDate(state.currentDate)
    );

    addSystemEvent(
      "warning",
      "Офіційну претензію відправлено",
      "Документ передано клієнту. Відповідального менеджера додано до копії."
    );

    addAudit(
      "warning",
      "Претензію відправлено",
      `Дата відправлення: ${formatDate(state.currentDate)}. Підтвердження менеджера збережено в Audit Trail.`
    );

    if (!(await wait(450, token))) {
      return;
    }

    state.claimDeadline =
      addBusinessDays(
        state.currentDate,
        5
      );

    activateStep("monitor");
    setProcessing(false);
    setBusy(false);

    setStatus(
      "ПРЕТЕНЗІЮ НАДІСЛАНО",
      "warning"
    );

    addSystemEvent(
      "warning",
      "Розпочато строк добровільного погашення",
      `Крайня контрольна дата: ${formatDate(state.claimDeadline)}.`
    );

    scheduleTimeTravel(
      state.claimDeadline,
      {
        type: "claim-deadline"
      }
    );
  }

  function stopClaimProcess() {
    if (els.claimGate) {
      els.claimGate.hidden = true;
    }

    addAudit(
      "warning",
      "Менеджер зупинив процес",
      "Офіційну претензію не відправлено. Подальші дії передано на ручний контроль."
    );

    showManualReview(
      "Рішення менеджера",
      "Процес зупинено рішенням менеджера",
      "Відправлення офіційної претензії не підтверджено. Автоматика зупинилася та передала кейс відповідальній особі."
    );
  }

  function showLegalPackage() {
    hideOutcomePanelsOnly();

    activateStep(
      "result",
      "paused"
    );

    setProcessing(false);

    setStatus(
      "ПЕРЕДАНО НА ЮРИДИЧНИЙ РОЗГЛЯД",
      "warning"
    );

    addSystemEvent(
      "warning",
      "Пакет для юридичного розгляду сформовано",
      "Договір, рахунок, документи поставки, попереднє листування, претензію та Audit Trail зібрано в один пакет."
    );

    addAudit(
      "warning",
      "Матеріали готові до передачі юристу",
      "Автоматизація завершила адміністративний цикл та зупинилася перед юридичним рішенням."
    );

    if (!els.legalPackage) {
      return;
    }

    els.legalPackage.hidden = false;

    let restartButton =
      els.legalPackage.querySelector(
        "[data-ar-legal-restart]"
      );

    if (!restartButton) {
      restartButton =
        document.createElement("button");

      restartButton.type = "button";
      restartButton.className =
        "ar-start-button";

      restartButton.dataset.arLegalRestart =
        "true";

      restartButton.textContent =
        "Пройти інший сценарій";

      restartButton.style.marginTop =
        "18px";

      on(
        restartButton,
        "click",
        restartProcess
      );

      els.legalPackage.appendChild(
        restartButton
      );
    }

    els.legalPackage.scrollIntoView({
      behavior: "smooth",
      block: "nearest"
    });
  }

  function closeCase() {
    state.closed = true;

    hideManagerActions();
    hideOutcomePanelsOnly();
    clearActiveRules();
    highlightRule("paid");

    activateStep(
      "result",
      "done"
    );

    setStatus(
      "ЗАКРИТО",
      "success"
    );

    addSystemEvent(
      "success",
      "Кейс закрито автоматично",
      "Непогашений залишок за INV-4821 дорівнює 0,00 грн. Усі майбутні нагадування скасовано."
    );

    addAudit(
      "success",
      "Кейс завершено",
      "Заборгованість погашена повністю. Ручне закриття не потрібне."
    );

    const values =
      els.successScreen
        ?.querySelectorAll(
          ".ar-success-data > div strong"
        );

    if (
      values &&
      values.length >= 4
    ) {
      values[0].textContent =
        "INV-4821";

      values[1].textContent =
        formatUAH(state.paid);

      values[2].textContent =
        formatUAH(state.outstanding);

      values[3].textContent =
        "ЗАКРИТО";
    }

    if (els.successScreen) {
      els.successScreen.hidden = false;

      els.successScreen.scrollIntoView({
        behavior: "smooth",
        block: "nearest"
      });
    }
  }

  function showManualReview(
    reason,
    title,
    text
  ) {
    state.manualReview = true;

    hideManagerActions();
    hideOutcomePanelsOnly();

    activateStep(
      "result",
      "paused"
    );

    setStatus(
      "РУЧНИЙ РОЗГЛЯД",
      "warning"
    );

    const screen =
      els.manualReviewScreen;

    if (!screen) {
      return;
    }

    const titleElement =
      screen.querySelector("h3");

    const paragraphs =
      screen.querySelectorAll(
        ":scope > p"
      );

    const reasonElement =
      screen.querySelector(
        ".ar-review-reason strong"
      );

    if (titleElement) {
      titleElement.textContent =
        title;
    }

    if (paragraphs[0]) {
      paragraphs[0].textContent =
        text;
    }

    if (reasonElement) {
      reasonElement.textContent =
        reason;
    }

    screen.hidden = false;

    screen.scrollIntoView({
      behavior: "smooth",
      block: "nearest"
    });
  }

  function restoreEmptyStates() {
    if (els.systemFeed) {
      els.systemFeed.innerHTML = `
        <div class="ar-empty-state">
          <strong>Процес очікує запуску</strong>
          <p>Тут буде видно, що саме перевіряє система, яке правило спрацювало і чому процес переходить до наступного кроку.</p>
        </div>
      `;
    }

    if (els.managerChat) {
      els.managerChat.innerHTML = `
        <div class="ar-chat-empty">
          <strong>Нових повідомлень немає</strong>
          <p>Коли системі буде потрібне рішення менеджера, запит з’явиться тут.</p>
        </div>
      `;
    }

    if (els.auditLog) {
      els.auditLog.innerHTML = `
        <div class="ar-audit-empty">
          Подій ще не зафіксовано.
        </div>
      `;
    }
  }

  function restartProcess() {
    state.runToken += 1;

    const source =
      state.source;

    const policy =
      state.policy;

    state =
      createInitialState();

    state.source =
      source;

    state.policy =
      policy;

    closeLetter();
    hideAllDynamicPanels();
    hideManagerActions();

    clearActiveRules();
    activateStep("erp");
    setProcessing(false);

    lockScenarioControls(false);

    updateSimulationHeader();
    updatePolicyUi();

    setStatus(
      "ГОТОВО ДО ЗАПУСКУ"
    );

    restoreEmptyStates();

    if (els.startButton) {
      els.startButton.disabled = false;

      els.startButton.innerHTML =
        "<span>▶</span> Запустити процес";
    }

    if (els.auditExpand) {
      els.auditExpand.dataset.expanded =
        "false";

      els.auditExpand.textContent =
        "Розгорнути";
    }

    if (els.auditLog) {
      els.auditLog.style.maxHeight = "";
    }

    root
      .querySelector(".ar-start-scene")
      ?.scrollIntoView({
        behavior: "smooth",
        block: "center"
      });
  }

  root
    .querySelectorAll("[data-ar-source]")
    .forEach(button => {
      on(
        button,
        "click",
        () => {
          if (state.started) {
            return;
          }

          root
            .querySelectorAll("[data-ar-source]")
            .forEach(item => {
              const active =
                item === button;

              item.classList.toggle(
                "active",
                active
              );

              const indicator =
                item.querySelector("i");

              if (indicator) {
                indicator.textContent =
                  active
                    ? "АКТИВНО"
                    : "ДОСТУПНО";
              }
            });

          state.source =
            button.dataset.arSource;
        }
      );
    });

  root
    .querySelectorAll("[data-ar-policy]")
    .forEach(button => {
      on(
        button,
        "click",
        () => {
          if (state.started) {
            return;
          }

          root
            .querySelectorAll("[data-ar-policy]")
            .forEach(item => {
              item.classList.toggle(
                "active",
                item === button
              );
            });

          state.policy =
            button.dataset.arPolicy;

          updatePolicyUi();
        }
      );
    });

  on(
    els.startButton,
    "click",
    startProcess
  );

  root
    .querySelectorAll(
      "[data-ar-manager-action]"
    )
    .forEach(button => {
      on(
        button,
        "click",
        async () => {
          if (state.busy) {
            return;
          }

          const action =
            button.dataset.arManagerAction;

          if (action === "approve") {
            await approveReminder();
            return;
          }

          if (action === "preview") {
            openLetter(
              state.currentLevel
            );
            return;
          }

          if (action === "postpone") {
            beginPostpone(
              "postpone"
            );
            return;
          }

          if (action === "decline") {
            beginPostpone(
              "decline"
            );
          }
        }
      );
    });

  root
    .querySelectorAll(
      "[data-ar-letter-close]"
    )
    .forEach(button => {
      on(
        button,
        "click",
        closeLetter
      );
    });

  on(
    root.querySelector(
      "[data-ar-letter-send]"
    ),
    "click",
    async () => {
      if (
        state.currentPreviewLevel === 4
      ) {
        await approveClaim();
      } else {
        await approveReminder();
      }
    }
  );

  root
    .querySelectorAll(
      "[data-ar-postpone-days]"
    )
    .forEach(button => {
      on(
        button,
        "click",
        () => {
          const days =
            Number(
              button.dataset.arPostponeDays ||
              1
            );

          schedulePostpone(
            addDays(
              state.currentDate,
              days
            )
          );
        }
      );
    });

  on(
    root.querySelector(
      "[data-ar-postpone-custom]"
    ),
    "click",
    () => {
      els.postponeDate?.focus();
    }
  );

  on(
    root.querySelector(
      "[data-ar-postpone-confirm]"
    ),
    "click",
    () => {
      const value =
        els.postponeDate?.value;

      if (!value) {
        return;
      }

      schedulePostpone(
        createDate(value)
      );
    }
  );

  on(
    els.advanceTimeButton,
    "click",
    advanceTime
  );

  root
    .querySelectorAll("[data-ar-outcome]")
    .forEach(button => {
      on(
        button,
        "click",
        async () => {
          await handleCustomerOutcome(
            button.dataset.arOutcome
          );
        }
      );
    });

  on(
    root.querySelector(
      "[data-ar-promise-accept]"
    ),
    "click",
    acceptPromise
  );

  on(
    root.querySelector(
      "[data-ar-partial-continue]"
    ),
    "click",
    continueAfterPartial
  );

  on(
    root.querySelector(
      "[data-ar-dispute-review]"
    ),
    "click",
    () => {
      if (els.disputePanel) {
        els.disputePanel.hidden = true;
      }

      addAudit(
        "warning",
        "Кейс передано на ручний розгляд",
        "Вся попередня історія автоматично збережена."
      );

      showManualReview(
        "Спір із клієнтом",
        "Автоматичний процес коректно зупинено",
        "Клієнт оспорює частину поставки або суму заборгованості. Подальша автоматична ескалація могла б бути некоректною, тому система передала кейс людині разом із повною історією."
      );
    }
  );

  on(
    root.querySelector(
      "[data-ar-proof-check]"
    ),
    "click",
    verifyPaymentProof
  );

  on(
    root.querySelector(
      "[data-ar-claim-preview]"
    ),
    "click",
    () => {
      openLetter(4);
    }
  );

  on(
    root.querySelector(
      "[data-ar-claim-approve]"
    ),
    "click",
    approveClaim
  );

  on(
    root.querySelector(
      "[data-ar-claim-postpone]"
    ),
    "click",
    () => {
      beginPostpone("claim");
    }
  );

  on(
    root.querySelector(
      "[data-ar-claim-stop]"
    ),
    "click",
    stopClaimProcess
  );

  root
    .querySelectorAll("[data-ar-restart]")
    .forEach(button => {
      on(
        button,
        "click",
        restartProcess
      );
    });

  on(
    els.auditExpand,
    "click",
    () => {
      const expanded =
        els.auditExpand.dataset.expanded ===
        "true";

      const next =
        !expanded;

      els.auditExpand.dataset.expanded =
        String(next);

      els.auditExpand.textContent =
        next
          ? "Згорнути"
          : "Розгорнути";

      if (els.auditLog) {
        els.auditLog.style.maxHeight =
          next
            ? "760px"
            : "";
      }
    }
  );

  on(
    document,
    "keydown",
    event => {
      if (
        event.key === "Escape" &&
        els.letterModal
          ?.classList
          .contains("is-open")
      ) {
        closeLetter();
      }
    }
  );

  if (els.promiseBrokenPanel) {
    els.promiseBrokenPanel.classList.add(
      "ar-dispute-panel"
    );
  }

  updateSimulationHeader();
  updatePolicyUi();
  activateStep("erp");
  setStatus("ГОТОВО ДО ЗАПУСКУ");
})();
