(() => {
  const root = document.querySelector("#ar-case");

  if (!root) {
    return;
  }

  if (typeof window.__spCase11RuCleanup === "function") {
    window.__spCase11RuCleanup();
  }

  const controller = new AbortController();
  const signal = controller.signal;

  const baseDate = createDate("2026-08-24");
  const dueDate = createDate("2026-08-23");

  const policies = {
    standard: {
      label: "Стандартная",
      title: "Стандартная политика",
      thresholds: [1, 5, 10, 20]
    },

    key: {
      label: "Ключевой клиент",
      title: "Политика для ключевого клиента",
      thresholds: [1, 7, 14, 30]
    },

    strict: {
      label: "Жесткий контроль",
      title: "Политика жесткого контроля",
      thresholds: [1, 3, 7, 14]
    }
  };

  const templateNames = {
    1: "Дружеское напоминание об оплате",
    2: "Повторное напоминание об оплате",
    3: "Финальное предупреждение об оплате",
    4: "Официальная претензия"
  };

  const templateSubjects = {
    1: "Уточнение статуса оплаты по счету INV-4821",
    2: "Повторное напоминание об оплате по счету INV-4821",
    3: "Финальное напоминание о погашении задолженности по счету INV-4821",
    4: "Претензия о погашении просроченной задолженности по счету INV-4821"
  };

  const arTimewarp =
    document.getElementById(
      "arTimewarp"
    );

  const arTimewarpTitle =
    document.getElementById(
      "arTimewarpTitle"
    );

  const arTimewarpText =
    document.getElementById(
      "arTimewarpText"
    );

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

  window.__spCase11RuCleanup = () => {
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
      "ru-RU",
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
      "ru-RU",
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
      "ru-RU",
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
      return `${value} дня`;
    }

    return `${value} дней`;
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
      `1–${firstEnd} дня`,
      `${policy.thresholds[1]}+ дней`,
      `${policy.thresholds[2]}+ дней`,
      `${policy.thresholds[3]}+ дней`
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
    setStatus("В РАБОТЕ");

    if (els.startButton) {
      els.startButton.disabled = true;

      els.startButton.innerHTML =
        "<span>●</span> Процесс запущен";
    }

    addAudit(
      "success",
      "Симуляция запущена",
      `${getPolicy().title}. Источник данных: ${getSourceName()}.`
    );

    addSystemEvent(
      "success",
      `Подключение к ${getSourceName()} установлено`,
      "Система получила доступ к актуальным данным взаиморасчетов с контрагентами."
    );

    if (!(await wait(650, token))) {
      return;
    }

    addSystemEvent(
      "success",
      "Открытые позиции загружены",
      "Найден счет INV-4821 с непогашенным остатком 350 000,00 грн."
    );

    addAudit(
      "success",
      "Проверка учетной системы выполнена",
      `Проверены открытые позиции ООО «Радуга» в ${getSourceName()}.`
    );

    if (!(await wait(700, token))) {
      return;
    }

    activateStep("detect");

    addSystemEvent(
      "warning",
      "Выявлена просрочка",
      `Срок оплаты 23.08.2026 истек. Текущая просрочка: ${pluralDays(getDaysOverdue())}.`
    );

    addAudit(
      "warning",
      "Выявлен просроченный счет",
      `INV-4821 · ${formatUAH(state.outstanding)} · срок оплаты 23.08.2026.`
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
        ? "ГОТОВИТСЯ ПРЕТЕНЗИЯ"
        : `ГОТОВИТСЯ НАПОМИНАНИЕ №${level}`
    );

    const token = state.runToken;

    addSystemEvent(
      "success",
      "Сработало бизнес-правило",
      level === 4
        ? `${getPolicy().title}: достигнут уровень официальной претензии.`
        : `${getPolicy().title}: выбрано напоминание №${level} — «${templateNames[level]}».`
    );

    addAudit(
      "success",
      "Выбран следующий уровень коммуникации",
      level === 4
        ? "Официальная претензия требует отдельного подтверждения ответственного лица."
        : `Система автоматически выбрала шаблон №${level}.`
    );

    if (!(await wait(550, token))) {
      return;
    }

    addSystemEvent(
      "success",
      "Данные подставлены автоматически",
      `Контрагент, договор, счет, срок оплаты, остаток ${formatUAH(state.outstanding)} и история предыдущих обращений добавлены в документ.`
    );

    addAudit(
      "success",
      "Черновик сформирован",
      `Текущий долг: ${formatUAH(state.outstanding)}. Просрочка: ${pluralDays(getDaysOverdue())}.`
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
      "ОЖИДАЕТ СОГЛАСОВАНИЯ",
      "warning"
    );

    appendChat(
      "system",
      "AR Control Bot",
      [
        "Выявлена просроченная дебиторская задолженность.",
        `<br><br><b>Клиент:</b> ООО «Радуга»`,
        `<br><b>Счет:</b> INV-4821`,
        `<br><b>Текущий долг:</b> ${formatUAH(state.outstanding)}`,
        `<br><b>Срок оплаты:</b> 23.08.2026`,
        `<br><b>Просрочка:</b> ${pluralDays(getDaysOverdue())}`,
        `<br><b>Предыдущих обращений:</b> ${state.contactsSent}`,
        `<br><br>Я подготовила <b>напоминание №${level}</b> — «${templateNames[level]}».`,
        "<br><br>Отправить письмо клиенту?"
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
          `Хотели бы уточнить статус погашения остатка по счету № INV-4821 от 24.07.2026. Первоначальная сумма счета составляла ${formatUAH(state.invoiceAmount)}, а текущий непогашенный остаток — ${formatUAH(state.outstanding)}.`;
      }

      if (paragraphs[3]) {
        paragraphs[3].textContent =
          `По состоянию на ${formatDate(state.currentDate)} поступление средств, достаточное для полного закрытия счета, в нашей учетной системе не отражено.`;
      }
    }

    if (level === 2) {
      if (paragraphs[2]) {
        paragraphs[2].textContent =
          state.outstanding <
          state.invoiceAmount
            ? `Первоначальная сумма счета составляет ${formatUAH(state.invoiceAmount)}. С учетом полученных оплат текущий непогашенный остаток составляет ${formatUAH(state.outstanding)}. Согласованный срок оплаты наступил 23.08.2026.`
            : `Сумма счета составляет ${formatUAH(state.invoiceAmount)}, а согласованный срок оплаты наступил 23.08.2026.`;
      }

      if (paragraphs[3]) {
        paragraphs[3].textContent =
          `По состоянию на ${formatDate(state.currentDate)} задолженность в размере ${formatUAH(state.outstanding)} остается непогашенной, а полное поступление средств в нашей учетной системе не зарегистрировано.`;
      }
    }

    if (level === 3) {
      if (paragraphs[1]) {
        paragraphs[1].textContent =
          `Обращаем ваше внимание, что по счету № INV-4821 от 24.07.2026 остается непогашенная задолженность в размере ${formatUAH(state.outstanding)}.`;
      }

      if (paragraphs[2]) {
        paragraphs[2].textContent =
          `В соответствии с согласованными условиями срок оплаты наступил 23.08.2026. По состоянию на ${formatDate(state.currentDate)} просрочка составляет ${pluralDays(getDaysOverdue())}.`;
      }
    }

    if (level === 4) {
      if (paragraphs[3]) {
        paragraphs[3].textContent =
          `По состоянию на ${formatDate(state.currentDate)} полная оплата по счету № INV-4821 на счет ООО «Демо Компания» не поступила.`;
      }

      if (paragraphs[4]) {
        paragraphs[4].textContent =
          `Таким образом, сумма просроченной задолженности ООО «Радуга» перед ООО «Демо Компания» составляет ${formatUAH(state.outstanding)}.`;
      }

      if (paragraphs[7]) {
        paragraphs[7].textContent =
          `В связи с изложенным требуем погасить задолженность в размере ${formatUAH(state.outstanding)} в полном объеме в течение 5 рабочих дней с момента получения настоящей претензии.`;
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
        `от ${formatDate(state.currentDate)}`;
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
      "Первое напоминание об оплате",
      "Повторное напоминание об оплате",
      "Финальное предупреждение об оплате"
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
          ? "ОФИЦИАЛЬНАЯ ПРЕТЕНЗИЯ"
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
      "Александр Коваленко",
      "Да. Отправить клиенту."
    );

    addAudit(
      "success",
      "Менеджер подтвердил отправку",
      `Напоминание №${state.currentLevel} согласовано.`
    );

    await sendReminder(
      state.currentLevel
    );
  }

  async function sendReminder(level) {
    setBusy(true);
    setProcessing(true);
    activateStep("send");

    setStatus("ОТПРАВКА");

    const token =
      state.runToken;

    addSystemEvent(
      "success",
      "Согласование менеджера получено",
      "Решение записано в Audit Trail."
    );

    if (!(await wait(450, token))) {
      return;
    }

    addSystemEvent(
      "success",
      "Email сформирован",
      `Получатель: accounting@raduga.ua. Копия: manager@demo-company.ua. Напоминание №${level}.`
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
      "Письмо отправлено",
      `«${templateNames[level]}» успешно отправлено клиенту.`
    );

    addAudit(
      "success",
      `Напоминание №${level} отправлено`,
      "Письмо отправлено клиенту. Менеджер добавлен в копию."
    );

    if (!(await wait(450, token))) {
      return;
    }

    activateStep("monitor");
    setProcessing(false);
    setBusy(false);

    setStatus("МОНИТОРИНГ");

    addSystemEvent(
      "success",
      "Контроль продолжается",
      "Система ожидает оплату, ответ клиента или следующую контрольную дату."
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
        "Александр Коваленко",
        "Нет. Пока не отправлять."
      );

      addAudit(
        "warning",
        "Менеджер отказался от отправки",
        `Напоминание №${state.currentLevel} не отправлено.`
      );
    }

    if (source === "postpone") {
      appendChat(
        "manager",
        "Александр Коваленко",
        "Напомнить мне об этом письме позже."
      );

      addAudit(
        "warning",
        "Решение отложено",
        `Напоминание №${state.currentLevel} остается подготовленным.`
      );
    }

    if (source === "claim") {
      if (els.claimGate) {
        els.claimGate.hidden = true;
      }

      appendChat(
        "manager",
        "Александр Коваленко",
        "Претензию пока не отправлять. Вернуться к этому вопросу позже."
      );

      addAudit(
        "warning",
        "Решение по претензии отложено",
        "Документ сформирован, но отправка не подтверждена."
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
      "РЕШЕНИЕ ОТЛОЖЕНО",
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
      "Следующее напоминание запланировано",
      `Система вернется к решению ${formatDate(selected)}.`
    );

    addSystemEvent(
      "warning",
      "Решение менеджера сохранено",
      `Отправка не выполняется. Следующая контрольная дата: ${formatDate(selected)}.`
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
        `Следующая контрольная дата: ${formatDate(date)}`;
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

    const token =
      state.runToken;

    const context =
      state.pendingTimeContext;

    const oldDate =
      cloneDate(state.currentDate);

    const newDate =
      cloneDate(state.nextDate);

    const daysForward =
      Math.max(
        1,
        differenceInDays(
          newDate,
          oldDate
        )
      );

    let title =
      `Проходит ${pluralDays(daysForward)}`;

    let text =
      `Система переносит процесс с ${formatDate(oldDate)} на ${formatDate(newDate)}.`;

    if (
      context.type ===
      "manager-postpone"
    ) {
      title =
        `Проходит ${pluralDays(daysForward)}`;

      text =
        `Наступает дата, на которую менеджер отложил решение — ${formatDate(newDate)}.`;
    }

    if (
      context.type ===
      "escalation"
    ) {
      title =
        `Проходит ${pluralDays(daysForward)}`;

      text =
        `Система доходит до следующей контрольной даты — ${formatDate(newDate)}.`;
    }

    if (
      context.type ===
      "promise-check"
    ) {
      title =
        "Наступает обещанная дата";

      text =
        `Клиент обещал оплату до ${formatDate(newDate)}. Система переходит к повторной проверке.`;
    }

    if (
      context.type ===
      "claim-deadline"
    ) {
      title =
        "Истекает срок после претензии";

      text =
        `Система переходит к контрольной дате ${formatDate(newDate)} и проверяет результат.`;
    }

    showTimewarp(
      title,
      text
    );

    if (!(await wait(1200, token))) {
      setBusy(false);
      return;
    }

    state.currentDate =
      newDate;

    state.nextDate = null;
    state.pendingTimeContext = null;

    if (els.timeTravel) {
      els.timeTravel.hidden = true;
    }

    updateSimulationHeader();

    activateStep("erp");
    setProcessing(true);

    setStatus(
      "ПОВТОРНАЯ ПРОВЕРКА"
    );

    addSystemEvent(
      "success",
      "Время симуляции изменено",
      `Текущая дата: ${formatDate(state.currentDate)}.`
    );

    addAudit(
      "success",
      "Наступила контрольная дата",
      `Автоматическая проверка запущена ${formatDate(state.currentDate)}.`
    );

    if (!(await wait(500, token))) {
      setBusy(false);
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
        "НАСТУПИЛА ОБЕЩАННАЯ ДАТА",
        "warning"
      );

      addSystemEvent(
        "warning",
        "Наступила обещанная дата оплаты",
        `По состоянию на ${formatDate(state.currentDate)} полная оплата в ${getSourceName()} не найдена.`
      );

      addAudit(
        "warning",
        "Обещанная дата проверена",
        "Система ожидает фактический результат: оплату, частичную оплату или отсутствие платежа."
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
        "СРОК ПРЕТЕНЗИИ ИСТЕК",
        "warning"
      );

      addSystemEvent(
        "warning",
        "Срок добровольного погашения истек",
        "Полная оплата после претензии не подтверждена."
      );

      addAudit(
        "warning",
        "Срок после претензии завершился",
        `По состоянию на ${formatDate(state.currentDate)} долг остается открытым.`
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
      `Проверка оплаты в ${getSourceName()}`,
      `Счет INV-4821. Текущий остаток: ${formatUAH(state.outstanding)}.`
    );

    if (!(await wait(420, token))) {
      return false;
    }

    addSystemEvent(
      "warning",
      "Новых поступлений не найдено",
      `В ${getSourceName()} не зарегистрирован платеж, достаточный для полного закрытия счета.`
    );

    addAudit(
      "warning",
      "Повторная проверка завершена",
      `Текущий непогашенный остаток: ${formatUAH(state.outstanding)}.`
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
          "Что произошло в обещанную клиентом дату?";
      } else if (
        context ===
        "claim-deadline"
      ) {
        heading.textContent =
          "Что произошло после официальной претензии?";
      } else {
        heading.textContent =
          "Что произошло после контакта с клиентом?";
      }
    }

    if (intro) {
      if (
        context ===
        "promise-check"
      ) {
        intro.textContent =
          "Система дождалась обещанной даты и повторно проверила бухгалтерские данные. В демо выберите фактическое развитие событий.";
      } else if (
        context ===
        "claim-deadline"
      ) {
        intro.textContent =
          "Срок добровольного погашения после претензии истек. В демо выберите, что произошло дальше.";
      } else {
        intro.textContent =
          "В реальном процессе эти события поступали бы из SAP, 1C, банковской выписки, email или CRM. В демо вы сами выбираете развитие ситуации.";
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
        `${formatUAH(state.outstanding)} будет зачислено полностью`;
    }

    if (partialCard) {
      partialCard.textContent =
        `Клиент оплатил ${formatUAH(getPartialAmount())}`;
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
      "ОПЛАТА ОБНАРУЖЕНА",
      "success"
    );

    const token =
      state.runToken;

    addSystemEvent(
      "success",
      "Обнаружен новый платеж",
      `${getSourceName()} содержит новую бухгалтерскую операцию по счету INV-4821.`
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
      "Платеж сопоставлен со счетом",
      `${formatUAH(received)} автоматически отнесено на INV-4821.`
    );

    addAudit(
      "success",
      "Оплата получена",
      `${formatUAH(received)} зачислено. Непогашенный остаток: 0,00 грн.`
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
      "Обнаружена частичная оплата",
      `Поступило ${formatUAH(payment)}. Остаток автоматически изменен с ${formatUAH(before)} на ${formatUAH(state.outstanding)}.`
    );

    addAudit(
      "success",
      "Частичная оплата зачислена",
      `Получено ${formatUAH(payment)}. Новый остаток: ${formatUAH(state.outstanding)}.`
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
          "ЧАСТИЧНО ОПЛАЧЕНО";
      }
    }

    const description =
      els.partialPanel
        ?.querySelector(":scope > p");

    if (description) {
      description.textContent =
        `Кейс не закрывается. Все последующие письма, сообщения менеджеру и проверки будут автоматически сформированы уже на фактический остаток ${formatUAH(state.outstanding)}.`;
    }

    if (els.partialPanel) {
      els.partialPanel.hidden = false;

      els.partialPanel.scrollIntoView({
        behavior: "smooth",
        block: "nearest"
      });
    }

    setStatus(
      "ЧАСТИЧНО ОПЛАЧЕНО",
      "warning"
    );
  }

  function continueAfterPartial() {
    if (els.partialPanel) {
      els.partialPanel.hidden = true;
    }

    addSystemEvent(
      "warning",
      "Кейс остается открытым",
      `Система продолжает контроль непогашенного остатка ${formatUAH(state.outstanding)}.`
    );

    if (state.claimSent) {
      const recheckDate =
        addDays(
          state.currentDate,
          3
        );

      addAudit(
        "warning",
        "После претензии остался непогашенный долг",
        `Следующая проверка назначена на ${formatDate(recheckDate)}.`
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
      "Контроль остатка продолжается",
      `Следующий уровень будет проверен ${formatDate(nextDate)}.`
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
      "Обнаружено обещание оплаты",
      `Из ответа клиента определена дата платежа: ${formatDate(state.promiseDate)}.`
    );

    addAudit(
      "success",
      "Обещанная дата оплаты сохранена",
      `Автоматическая эскалация приостановлена до ${formatDate(state.promiseDate)}.`
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
        `Добрый день. Оплату по счету INV-4821 планируем провести ${formatDate(state.promiseDate)}. Просим учесть эту дату.`;
    }

    if (detected) {
      detected.textContent =
        `Обещанная дата оплаты: ${formatDate(state.promiseDate)}`;
    }

    if (description) {
      description.textContent =
        `Новые напоминания клиенту отправляться не будут. Следующая проверка оплаты состоится после наступления обещанной даты ${formatDate(state.promiseDate)}.`;
    }

    if (els.promisePanel) {
      els.promisePanel.hidden = false;

      els.promisePanel.scrollIntoView({
        behavior: "smooth",
        block: "nearest"
      });
    }

    setStatus(
      "ОЖИДАЕМ ОБЕЩАННУЮ ДАТУ",
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
      "Эскалация поставлена на паузу",
      `До ${formatDate(state.promiseDate)} новые напоминания клиенту отправляться не будут.`
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
      "ОБЕЩАНИЕ НАРУШЕНО",
      "error"
    );

    addSystemEvent(
      "error",
      "Обещанная дата нарушена",
      `Клиент сам назвал дату ${formatDate(state.promiseDate || state.currentDate)}, но к этой дате оплата не получена.`
    );

    addAudit(
      "error",
      "Клиент не выполнил обещание по оплате",
      `Процесс переходит на следующий уровень: ${nextLevel === 4 ? "официальная претензия" : `напоминание №${nextLevel}`}.`
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
        "Оплата не найдена";
    }

    if (fields[2]) {
      fields[2].textContent =
        nextLevel === 4
          ? "Официальная претензия"
          : `Напоминание №${nextLevel}`;
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
        "Перейти к следующему уровню";

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
      "АВТОМАТИЗАЦИЯ ПРИОСТАНОВЛЕНА",
      "error"
    );

    addSystemEvent(
      "error",
      "Выявлен бизнес-спор",
      "Клиент оспаривает поставку или сумму. Стандартная процедура взыскания остановлена."
    );

    addAudit(
      "error",
      "Автоматическое взыскание приостановлено",
      "Причина: спор с клиентом. Требуется ручное рассмотрение."
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
      "ПРОВЕРКА ПЛАТЕЖА",
      "warning"
    );

    addSystemEvent(
      "warning",
      "Получено платежное поручение",
      "Клиент сообщил о проведенном платеже. Дальнейшая эскалация временно приостановлена."
    );

    addAudit(
      "warning",
      "Подтверждение платежа добавлено в кейс",
      "Файл payment_order_INV-4821.pdf сохранен в истории."
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
      "ПРОВЕРКА ОПЛАТЫ"
    );

    const token =
      state.runToken;

    addSystemEvent(
      "success",
      `Обновление данных ${getSourceName()}`,
      "Бухгалтерские данные повторно синхронизированы после получения платежного поручения."
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
      "Поступление средств подтверждено",
      `${formatUAH(payment)} найдено в бухгалтерских данных и сопоставлено с INV-4821.`
    );

    addAudit(
      "success",
      "Платежное поручение подтверждено",
      "Данные клиента совпадают с фактическим поступлением в учетной системе."
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
        "Оплаты после претензии нет",
        "Клиент не погасил задолженность в установленный срок."
      );

      addAudit(
        "error",
        "Официальная претензия не дала результата",
        "Административный цикл взыскания завершен без полной оплаты."
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
      "Ответа от клиента нет",
      "Оплата не получена, подтвержденной даты платежа нет, клиент не ответил."
    );

    addAudit(
      "warning",
      "Клиент не ответил",
      `Текущий уровень работы с задолженностью: ${state.currentLevel}.`
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
      "ОЖИДАЕМ СЛЕДУЮЩИЙ УРОВЕНЬ",
      "warning"
    );

    addSystemEvent(
      "warning",
      "Следующий контроль запланирован",
      `Если ситуация не изменится, система вернется к кейсу ${formatDate(nextDate)}.`
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
      "ОЖИДАЕТ СОГЛАСОВАНИЯ ПРЕТЕНЗИИ",
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
        "Юридическое рассмотрение";
    }

    addSystemEvent(
      "warning",
      "Официальная претензия подготовлена",
      "Система дошла до юридически значимого этапа и остановилась перед отправкой."
    );

    addAudit(
      "warning",
      "Требуется отдельное подтверждение",
      "Претензия сформирована, но система не имеет права самостоятельно выполнить этот шаг."
    );

    appendChat(
      "system",
      "AR Control Bot",
      [
        "Процесс дошел до уровня официальной претензии.",
        `<br><br><b>Текущий долг:</b> ${formatUAH(state.outstanding)}`,
        `<br><b>Просрочка:</b> ${pluralDays(getDaysOverdue())}`,
        `<br><b>Предыдущих напоминаний:</b> ${state.contactsSent}`,
        "<br><br>Претензия сформирована.",
        "<br>Перед ее отправкой требуется ваше отдельное подтверждение."
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
      "Александр Коваленко",
      "Подтверждаю отправку официальной претензии."
    );

    addAudit(
      "warning",
      "Менеджер согласовал официальную претензию",
      "Подтверждение ответственного лица зафиксировано перед отправкой."
    );

    setBusy(true);
    setProcessing(true);
    activateStep("send");

    setStatus(
      "ОТПРАВКА ПРЕТЕНЗИИ",
      "warning"
    );

    const token =
      state.runToken;

    addSystemEvent(
      "success",
      "Претензия проверена",
      "Реквизиты, сумма долга, история предыдущих обращений и перечень приложений сформированы."
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
      "Официальная претензия отправлена",
      "Документ отправлен клиенту. Ответственный менеджер добавлен в копию."
    );

    addAudit(
      "warning",
      "Претензия отправлена",
      `Дата отправки: ${formatDate(state.currentDate)}. Подтверждение менеджера сохранено в Audit Trail.`
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
      "ПРЕТЕНЗИЯ ОТПРАВЛЕНА",
      "warning"
    );

    addSystemEvent(
      "warning",
      "Начался срок добровольного погашения",
      `Крайняя контрольная дата: ${formatDate(state.claimDeadline)}.`
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
      "Менеджер остановил процесс",
      "Официальная претензия не отправлена. Дальнейшие действия переданы на ручной контроль."
    );

    showManualReview(
      "Решение менеджера",
      "Процесс остановлен решением менеджера",
      "Отправка официальной претензии не подтверждена. Автоматика остановилась и передала кейс ответственному лицу."
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
      "ПЕРЕДАНО НА ЮРИДИЧЕСКОЕ РАССМОТРЕНИЕ",
      "warning"
    );

    addSystemEvent(
      "warning",
      "Пакет для юридического рассмотрения сформирован",
      "Договор, счет, документы поставки, предыдущая переписка, претензия и Audit Trail собраны в один пакет."
    );

    addAudit(
      "warning",
      "Материалы готовы к передаче юристу",
      "Автоматизация завершила административный цикл и остановилась перед юридическим решением."
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
        "Пройти другой сценарий";

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
      "ЗАКРЫТО",
      "success"
    );

    addSystemEvent(
      "success",
      "Кейс закрыт автоматически",
      "Непогашенный остаток по INV-4821 равен 0,00 грн. Все будущие напоминания отменены."
    );

    addAudit(
      "success",
      "Кейс завершен",
      "Задолженность погашена полностью. Ручное закрытие не требуется."
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
        "ЗАКРЫТО";
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
      "РУЧНОЕ РАССМОТРЕНИЕ",
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
          <strong>Процесс ожидает запуска</strong>
          <p>Здесь будет видно, что именно проверяет система, какое правило сработало и почему процесс переходит к следующему шагу.</p>
        </div>
      `;
    }

    if (els.managerChat) {
      els.managerChat.innerHTML = `
        <div class="ar-chat-empty">
          <strong>Новых сообщений нет</strong>
          <p>Когда системе потребуется решение менеджера, запрос появится здесь.</p>
        </div>
      `;
    }

    if (els.auditLog) {
      els.auditLog.innerHTML = `
        <div class="ar-audit-empty">
          Событий пока не зафиксировано.
        </div>
      `;
    }
  }

  let arTimewarpTimer = null;

  function showTimewarp(
    title =
      "Перемотка времени",
    text =
      "Система быстро переносит сценарий к следующей контрольной дате."
  ) {
    if (!arTimewarp) {
      return;
    }

    if (arTimewarpTimer) {
      clearTimeout(arTimewarpTimer);
    }

    if (arTimewarpTitle) {
      arTimewarpTitle.textContent =
        title;
    }

    if (arTimewarpText) {
      arTimewarpText.textContent =
        text;
    }

    arTimewarp.classList.add(
      "is-visible"
    );

    arTimewarp.setAttribute(
      "aria-hidden",
      "false"
    );

    arTimewarpTimer =
      window.setTimeout(() => {
        arTimewarp.classList.remove(
          "is-visible"
        );

        arTimewarp.setAttribute(
          "aria-hidden",
          "true"
        );
      }, 1350);
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
      "ГОТОВО К ЗАПУСКУ"
    );

    restoreEmptyStates();

    if (els.startButton) {
      els.startButton.disabled = false;

      els.startButton.innerHTML =
        "<span>▶</span> Запустить процесс";
    }

    if (els.auditExpand) {
      els.auditExpand.dataset.expanded =
        "false";

      els.auditExpand.textContent =
        "Развернуть";
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
        "Кейс передан на ручное рассмотрение",
        "Вся предыдущая история автоматически сохранена."
      );

      showManualReview(
        "Спор с клиентом",
        "Автоматический процесс корректно остановлен",
        "Клиент оспаривает часть поставки или сумму задолженности. Дальнейшая автоматическая эскалация могла бы быть некорректной, поэтому система передала кейс человеку вместе с полной историей."
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
          ? "Свернуть"
          : "Развернуть";

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
  setStatus("ГОТОВО К ЗАПУСКУ");
})();
