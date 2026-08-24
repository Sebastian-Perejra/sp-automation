(() => {
  const root = document.querySelector("#ar-case");

  if (!root) {
    return;
  }

  if (typeof window.__spCase11EnCleanup === "function") {
    window.__spCase11EnCleanup();
  }

  const controller = new AbortController();
  const signal = controller.signal;

  const baseDate = createDate("2026-08-24");
  const dueDate = createDate("2026-08-23");

  const policies = {
    standard: {
      label: "Standard",
      title: "Standard collection policy",
      thresholds: [1, 5, 10, 20]
    },

    key: {
      label: "Key Account",
      title: "Key Account collection policy",
      thresholds: [1, 7, 14, 30]
    },

    strict: {
      label: "Strict",
      title: "Strict collection policy",
      thresholds: [1, 3, 7, 14]
    }
  };

  const templateNames = {
    1: "Friendly payment reminder",
    2: "Second payment reminder",
    3: "Final payment reminder",
    4: "Formal demand for payment"
  };

  const templateSubjects = {
    1: "Payment status for invoice INV-4821",
    2: "Follow-up on payment for invoice INV-4821",
    3: "Final payment reminder for invoice INV-4821",
    4: "Formal demand for payment — invoice INV-4821"
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

  window.__spCase11EnCleanup = () => {
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
      "en-US",
      {
        month: "2-digit",
        day: "2-digit",
        year: "numeric",
        timeZone: "UTC"
      }
    ).format(date);
  }

  function formatTime(date) {
    return new Intl.DateTimeFormat(
      "en-US",
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
    return `UAH ${new Intl.NumberFormat(
      "en-US",
      {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      }
    ).format(value)}`;
  }

  function pluralDays(value) {
    return value === 1
      ? "1 day"
      : `${value} days`;
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
      `1–${firstEnd} days`,
      `${policy.thresholds[1]}+ days`,
      `${policy.thresholds[2]}+ days`,
      `${policy.thresholds[3]}+ days`
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
    setStatus("RUNNING");

    if (els.startButton) {
      els.startButton.disabled = true;

      els.startButton.innerHTML =
        "<span>●</span> Process running";
    }

    addAudit(
      "success",
      "Simulation started",
      `${getPolicy().title}. Data source: ${getSourceName()}.`
    );

    addSystemEvent(
      "success",
      `Connected to ${getSourceName()}`,
      "The system has access to current customer receivables data."
    );

    if (!(await wait(650, token))) {
      return;
    }

    addSystemEvent(
      "success",
      "Open items loaded",
      `Invoice INV-4821 found with an outstanding balance of ${formatUAH(state.outstanding)}.`
    );

    addAudit(
      "success",
      "Accounting data checked",
      `Open items for Raduga LLC were checked in ${getSourceName()}.`
    );

    if (!(await wait(700, token))) {
      return;
    }

    activateStep("detect");

    addSystemEvent(
      "warning",
      "Past-due invoice detected",
      `Invoice was due on 08/23/2026. It is currently ${pluralDays(getDaysOverdue())} past due.`
    );

    addAudit(
      "warning",
      "Past-due invoice identified",
      `INV-4821 · ${formatUAH(state.outstanding)} · due 08/23/2026.`
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
        ? "PREPARING FORMAL DEMAND"
        : `PREPARING REMINDER #${level}`
    );

    const token = state.runToken;

    addSystemEvent(
      "success",
      "Business rule triggered",
      level === 4
        ? `${getPolicy().title}: the case has reached the formal-demand stage.`
        : `${getPolicy().title}: reminder #${level} selected — "${templateNames[level]}".`
    );

    addAudit(
      "success",
      "Next communication stage selected",
      level === 4
        ? "A formal demand requires separate approval from the responsible manager."
        : `The system automatically selected template #${level}.`
    );

    if (!(await wait(550, token))) {
      return;
    }

    addSystemEvent(
      "success",
      "Case data populated automatically",
      `Customer, contract, invoice, due date, current balance of ${formatUAH(state.outstanding)}, and prior contact history were added to the document.`
    );

    addAudit(
      "success",
      "Draft prepared",
      `Outstanding balance: ${formatUAH(state.outstanding)}. Days past due: ${pluralDays(getDaysOverdue())}.`
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
      "AWAITING APPROVAL",
      "warning"
    );

    appendChat(
      "system",
      "AR Control Bot",
      [
        "A past-due receivable has been identified.",
        `<br><br><b>Customer:</b> Raduga LLC`,
        `<br><b>Invoice:</b> INV-4821`,
        `<br><b>Outstanding:</b> ${formatUAH(state.outstanding)}`,
        `<br><b>Due date:</b> 08/23/2026`,
        `<br><b>Days past due:</b> ${pluralDays(getDaysOverdue())}`,
        `<br><b>Previous contacts:</b> ${state.contactsSent}`,
        `<br><br>I prepared <b>reminder #${level}</b> — "${templateNames[level]}".`,
        "<br><br>Send this email to the customer?"
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
          `I wanted to follow up on the remaining balance for invoice INV-4821 dated July 24, 2026. The original invoice amount was ${formatUAH(state.invoiceAmount)}, and the current outstanding balance is ${formatUAH(state.outstanding)}.`;
      }

      if (paragraphs[3]) {
        paragraphs[3].textContent =
          `As of ${formatDate(state.currentDate)}, we do not see sufficient payment in our accounting system to close the invoice in full.`;
      }
    }

    if (level === 2) {
      if (paragraphs[2]) {
        paragraphs[2].textContent =
          state.outstanding <
          state.invoiceAmount
            ? `The original invoice amount was ${formatUAH(state.invoiceAmount)}. After payments received to date, the current outstanding balance is ${formatUAH(state.outstanding)}. Payment was due on August 23, 2026.`
            : `The invoice amount is ${formatUAH(state.invoiceAmount)}, and payment was due on August 23, 2026.`;
      }

      if (paragraphs[3]) {
        paragraphs[3].textContent =
          `As of ${formatDate(state.currentDate)}, the outstanding balance is ${formatUAH(state.outstanding)}, and we do not see payment sufficient to settle the invoice in full.`;
      }
    }

    if (level === 3) {
      if (paragraphs[1]) {
        paragraphs[1].textContent =
          `This is a final follow-up regarding the outstanding balance of ${formatUAH(state.outstanding)} on invoice INV-4821 dated July 24, 2026.`;
      }

      if (paragraphs[2]) {
        paragraphs[2].textContent =
          `Under the agreed payment terms, payment was due on August 23, 2026. As of ${formatDate(state.currentDate)}, the invoice is ${pluralDays(getDaysOverdue())} past due.`;
      }
    }

    if (level === 4) {
      if (paragraphs[3]) {
        paragraphs[3].textContent =
          `As of ${formatDate(state.currentDate)}, full payment for invoice INV-4821 has not been received by Demo Company LLC.`;
      }

      if (paragraphs[4]) {
        paragraphs[4].textContent =
          `Accordingly, the outstanding past-due balance owed by Raduga LLC to Demo Company LLC is ${formatUAH(state.outstanding)}.`;
      }

      if (paragraphs[7]) {
        paragraphs[7].textContent =
          `We therefore request payment of the full outstanding balance of ${formatUAH(state.outstanding)} within five business days of receipt of this letter.`;
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
        formatDate(state.currentDate);
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
      "First payment reminder",
      "Second payment reminder",
      "Final payment reminder"
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
          ? "FORMAL DEMAND"
          : `TEMPLATE #${level}`;
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
      "Oleksandr Kovalenko",
      "Yes. Send it to the customer."
    );

    addAudit(
      "success",
      "Manager approved the email",
      `Reminder #${state.currentLevel} approved for sending.`
    );

    await sendReminder(
      state.currentLevel
    );
  }

  async function sendReminder(level) {
    setBusy(true);
    setProcessing(true);
    activateStep("send");

    setStatus("SENDING");

    const token =
      state.runToken;

    addSystemEvent(
      "success",
      "Manager approval received",
      "The decision was recorded in the Audit Trail."
    );

    if (!(await wait(450, token))) {
      return;
    }

    addSystemEvent(
      "success",
      "Email prepared",
      `To: accounting@raduga.ua. CC: manager@demo-company.ua. Reminder #${level}.`
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
      "Email sent",
      `"${templateNames[level]}" was sent successfully.`
    );

    addAudit(
      "success",
      `Reminder #${level} sent`,
      "The email was sent to the customer and the account manager was copied."
    );

    if (!(await wait(450, token))) {
      return;
    }

    activateStep("monitor");
    setProcessing(false);
    setBusy(false);

    setStatus("MONITORING");

    addSystemEvent(
      "success",
      "Monitoring continues",
      "The system is now waiting for payment, a customer response, or the next control date."
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
        "Oleksandr Kovalenko",
        "No. Don't send it yet."
      );

      addAudit(
        "warning",
        "Manager declined the send",
        `Reminder #${state.currentLevel} was not sent.`
      );
    }

    if (source === "postpone") {
      appendChat(
        "manager",
        "Oleksandr Kovalenko",
        "Remind me about this email later."
      );

      addAudit(
        "warning",
        "Decision postponed",
        `Reminder #${state.currentLevel} remains prepared and ready.`
      );
    }

    if (source === "claim") {
      if (els.claimGate) {
        els.claimGate.hidden = true;
      }

      appendChat(
        "manager",
        "Oleksandr Kovalenko",
        "Don't send the formal demand yet. Bring this back to me later."
      );

      addAudit(
        "warning",
        "Formal-demand decision postponed",
        "The document is ready, but sending has not been approved."
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
      "DECISION POSTPONED",
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
      "Follow-up scheduled",
      `The system will return to this decision on ${formatDate(selected)}.`
    );

    addSystemEvent(
      "warning",
      "Manager decision saved",
      `Nothing will be sent now. Next checkpoint: ${formatDate(selected)}.`
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
        `Next checkpoint: ${formatDate(date)}`;
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
      `${pluralDays(daysForward)} later`;

    let text =
      `The simulation moves from ${formatDate(oldDate)} to ${formatDate(newDate)}.`;

    if (
      context.type ===
      "manager-postpone"
    ) {
      title =
        `${pluralDays(daysForward)} later`;

      text =
        `The date selected by the manager has arrived — ${formatDate(newDate)}.`;
    }

    if (
      context.type ===
      "escalation"
    ) {
      title =
        `${pluralDays(daysForward)} later`;

      text =
        `The workflow reaches its next collection checkpoint — ${formatDate(newDate)}.`;
    }

    if (
      context.type ===
      "promise-check"
    ) {
      title =
        "Promise-to-pay date reached";

      text =
        `The customer promised payment by ${formatDate(newDate)}. The system is moving to a fresh payment check.`;
    }

    if (
      context.type ===
      "claim-deadline"
    ) {
      title =
        "Formal-demand deadline reached";

      text =
        `The workflow moves to ${formatDate(newDate)} and checks whether the balance has been resolved.`;
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
      "RECHECKING"
    );

    addSystemEvent(
      "success",
      "Simulation time updated",
      `Current date: ${formatDate(state.currentDate)}.`
    );

    addAudit(
      "success",
      "Checkpoint reached",
      `Automated recheck started on ${formatDate(state.currentDate)}.`
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
        "PROMISED DATE REACHED",
        "warning"
      );

      addSystemEvent(
        "warning",
        "Promise-to-pay date reached",
        `As of ${formatDate(state.currentDate)}, full payment has not been found in ${getSourceName()}.`
      );

      addAudit(
        "warning",
        "Promise-to-pay date checked",
        "The system is waiting for the actual outcome: full payment, partial payment, or no payment."
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
        "FORMAL-DEMAND DEADLINE PASSED",
        "warning"
      );

      addSystemEvent(
        "warning",
        "Voluntary-payment period ended",
        "Full payment has not been confirmed after the formal demand."
      );

      addAudit(
        "warning",
        "Formal-demand period completed",
        `As of ${formatDate(state.currentDate)}, the balance remains outstanding.`
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
      `Checking payment in ${getSourceName()}`,
      `Invoice INV-4821. Current outstanding balance: ${formatUAH(state.outstanding)}.`
    );

    if (!(await wait(420, token))) {
      return false;
    }

    addSystemEvent(
      "warning",
      "No new payment found",
      `${getSourceName()} does not contain a payment sufficient to close the invoice in full.`
    );

    addAudit(
      "warning",
      "Payment recheck completed",
      `Current outstanding balance: ${formatUAH(state.outstanding)}.`
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
          "What happened on the promised payment date?";
      } else if (
        context ===
        "claim-deadline"
      ) {
        heading.textContent =
          "What happened after the formal demand?";
      } else {
        heading.textContent =
          "What happened after the customer was contacted?";
      }
    }

    if (intro) {
      if (
        context ===
        "promise-check"
      ) {
        intro.textContent =
          "The system waited until the promised date and checked the accounting data again. For this demo, choose what actually happened.";
      } else if (
        context ===
        "claim-deadline"
      ) {
        intro.textContent =
          "The voluntary-payment period following the formal demand has ended. For this demo, choose what happened next.";
      } else {
        intro.textContent =
          "In a live workflow, these events would come from SAP, 1C, a bank statement, email, or CRM. In this demo, you choose what happens next.";
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
        `${formatUAH(state.outstanding)} received in full`;
    }

    if (partialCard) {
      partialCard.textContent =
        `Customer paid ${formatUAH(getPartialAmount())}`;
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
      "PAYMENT DETECTED",
      "success"
    );

    const token =
      state.runToken;

    addSystemEvent(
      "success",
      "New payment detected",
      `${getSourceName()} contains a new accounting transaction for invoice INV-4821.`
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
      "Payment matched to invoice",
      `${formatUAH(received)} was automatically applied to INV-4821.`
    );

    addAudit(
      "success",
      "Payment received",
      `${formatUAH(received)} received. Outstanding balance: ${formatUAH(0)}.`
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
      "Partial payment detected",
      `${formatUAH(payment)} received. The balance was automatically updated from ${formatUAH(before)} to ${formatUAH(state.outstanding)}.`
    );

    addAudit(
      "success",
      "Partial payment applied",
      `${formatUAH(payment)} received. New outstanding balance: ${formatUAH(state.outstanding)}.`
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
          "PARTIALLY PAID";
      }
    }

    const description =
      els.partialPanel
        ?.querySelector(":scope > p");

    if (description) {
      description.textContent =
        `The case remains open. All future emails, manager notifications, and payment checks will use the actual outstanding balance of ${formatUAH(state.outstanding)}.`;
    }

    if (els.partialPanel) {
      els.partialPanel.hidden = false;

      els.partialPanel.scrollIntoView({
        behavior: "smooth",
        block: "nearest"
      });
    }

    setStatus(
      "PARTIALLY PAID",
      "warning"
    );
  }

  function continueAfterPartial() {
    if (els.partialPanel) {
      els.partialPanel.hidden = true;
    }

    addSystemEvent(
      "warning",
      "Case remains open",
      `The system continues monitoring the outstanding balance of ${formatUAH(state.outstanding)}.`
    );

    if (state.claimSent) {
      const recheckDate =
        addDays(
          state.currentDate,
          3
        );

      addAudit(
        "warning",
        "Balance remains after formal demand",
        `The next payment check is scheduled for ${formatDate(recheckDate)}.`
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
      "Outstanding balance remains under monitoring",
      `The next collection stage will be checked on ${formatDate(nextDate)}.`
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
      "Promise to pay detected",
      `The customer's response includes a payment date of ${formatDate(state.promiseDate)}.`
    );

    addAudit(
      "success",
      "Promise-to-pay date saved",
      `Automated escalation is paused until ${formatDate(state.promiseDate)}.`
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
        `Hi, we expect to make payment for invoice INV-4821 on ${formatDate(state.promiseDate)}. Please note that date in your records.`;
    }

    if (detected) {
      detected.textContent =
        `Promise-to-pay date: ${formatDate(state.promiseDate)}`;
    }

    if (description) {
      description.textContent =
        `No additional reminders will be sent. The next payment check will take place once the promised date of ${formatDate(state.promiseDate)} has been reached.`;
    }

    if (els.promisePanel) {
      els.promisePanel.hidden = false;

      els.promisePanel.scrollIntoView({
        behavior: "smooth",
        block: "nearest"
      });
    }

    setStatus(
      "WAITING FOR PROMISED DATE",
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
      "Escalation paused",
      `No additional customer reminders will be sent before ${formatDate(state.promiseDate)}.`
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
      "PROMISE TO PAY MISSED",
      "error"
    );

    addSystemEvent(
      "error",
      "Promised payment date missed",
      `The customer committed to ${formatDate(state.promiseDate || state.currentDate)}, but payment was not received by that date.`
    );

    addAudit(
      "error",
      "Customer did not meet promise to pay",
      `The workflow moves to the next stage: ${nextLevel === 4 ? "formal demand" : `reminder #${nextLevel}`}.`
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
        "Payment not found";
    }

    if (fields[2]) {
      fields[2].textContent =
        nextLevel === 4
          ? "Formal demand"
          : `Reminder #${nextLevel}`;
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
        "Move to the next stage";

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
      "AUTOMATION PAUSED",
      "error"
    );

    addSystemEvent(
      "error",
      "Business dispute detected",
      "The customer disputes the delivery or the amount due. The standard collection workflow has been stopped."
    );

    addAudit(
      "error",
      "Automated collection paused",
      "Reason: customer dispute. Human review is required."
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
      "VERIFYING PAYMENT",
      "warning"
    );

    addSystemEvent(
      "warning",
      "Payment confirmation received",
      "The customer says the payment has been initiated. Further escalation is temporarily paused."
    );

    addAudit(
      "warning",
      "Payment confirmation added to case",
      "File payment_order_INV-4821.pdf was saved in the case history."
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
      "CHECKING PAYMENT"
    );

    const token =
      state.runToken;

    addSystemEvent(
      "success",
      `${getSourceName()} data refreshed`,
      "Accounting data was synchronized again after receiving the customer's payment confirmation."
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
      "Funds received",
      `${formatUAH(payment)} was found in the accounting data and matched to INV-4821.`
    );

    addAudit(
      "success",
      "Payment confirmation verified",
      "The customer's payment confirmation matches the actual accounting transaction."
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
        "No payment after formal demand",
        "The customer did not settle the outstanding balance within the requested period."
      );

      addAudit(
        "error",
        "Formal demand did not resolve the balance",
        "The administrative collection workflow ended without full payment."
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
      "No response from customer",
      "No payment has been received, no payment date has been confirmed, and the customer has not responded."
    );

    addAudit(
      "warning",
      "Customer did not respond",
      `Current collection stage: ${state.currentLevel}.`
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
      "WAITING FOR NEXT STAGE",
      "warning"
    );

    addSystemEvent(
      "warning",
      "Next checkpoint scheduled",
      `If nothing changes, the system will return to this case on ${formatDate(nextDate)}.`
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
      "FORMAL DEMAND AWAITING APPROVAL",
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
        "Legal review";
    }

    addSystemEvent(
      "warning",
      "Formal demand prepared",
      "The workflow has reached a legally significant stage and stopped before sending."
    );

    addAudit(
      "warning",
      "Separate approval required",
      "The formal demand has been prepared, but the system cannot send it without explicit human approval."
    );

    appendChat(
      "system",
      "AR Control Bot",
      [
        "The case has reached the formal-demand stage.",
        `<br><br><b>Outstanding balance:</b> ${formatUAH(state.outstanding)}`,
        `<br><b>Days past due:</b> ${pluralDays(getDaysOverdue())}`,
        `<br><b>Previous reminders:</b> ${state.contactsSent}`,
        "<br><br>The formal demand is ready.",
        "<br>Your separate approval is required before it can be sent."
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
      "Oleksandr Kovalenko",
      "Approved. Send the formal demand."
    );

    addAudit(
      "warning",
      "Manager approved formal demand",
      "Explicit approval from the responsible person was recorded before sending."
    );

    setBusy(true);
    setProcessing(true);
    activateStep("send");

    setStatus(
      "SENDING FORMAL DEMAND",
      "warning"
    );

    const token =
      state.runToken;

    addSystemEvent(
      "success",
      "Formal demand validated",
      "Customer details, outstanding balance, prior-contact history, and attachments were assembled."
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
      "Formal demand sent",
      "The document was sent to the customer. The responsible account manager was copied."
    );

    addAudit(
      "warning",
      "Formal demand sent",
      `Sent on ${formatDate(state.currentDate)}. Manager approval is stored in the Audit Trail.`
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
      "FORMAL DEMAND SENT",
      "warning"
    );

    addSystemEvent(
      "warning",
      "Voluntary-payment period started",
      `Next control date: ${formatDate(state.claimDeadline)}.`
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
      "Manager stopped the workflow",
      "The formal demand was not sent. Further action has been moved to manual control."
    );

    showManualReview(
      "Manager decision",
      "Workflow stopped by the manager",
      "The formal demand was not approved. Automation stopped and handed the case to the responsible person."
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
      "REFERRED FOR LEGAL REVIEW",
      "warning"
    );

    addSystemEvent(
      "warning",
      "Legal-review package assembled",
      "The contract, invoice, delivery documentation, prior correspondence, formal demand, and Audit Trail were assembled into one case package."
    );

    addAudit(
      "warning",
      "Case materials ready for legal review",
      "Automation completed the administrative collection cycle and stopped before any legal decision."
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
        "Try another scenario";

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
      "CLOSED",
      "success"
    );

    addSystemEvent(
      "success",
      "Case closed automatically",
      `Outstanding balance on INV-4821 is ${formatUAH(0)}. All future reminders have been canceled.`
    );

    addAudit(
      "success",
      "Case completed",
      "The balance was paid in full. No manual case closure is required."
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
        "CLOSED";
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
      "HUMAN REVIEW",
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
          <strong>Waiting to start</strong>
          <p>This panel shows what the system is checking, which rule fired, and why the workflow moves to the next step.</p>
        </div>
      `;
    }

    if (els.managerChat) {
      els.managerChat.innerHTML = `
        <div class="ar-chat-empty">
          <div class="ar-telegram-empty-icon">✈</div>
          <strong>AR Control Bot</strong>
          <p>System updates and approval requests will appear in this chat.</p>
        </div>
      `;
    }

    if (els.auditLog) {
      els.auditLog.innerHTML = `
        <div class="ar-audit-empty">
          No events recorded yet.
        </div>
      `;
    }
  }

  let arTimewarpTimer = null;

  function showTimewarp(
    title =
      "Fast-forwarding",
    text =
      "The simulation is moving to the next control date."
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
      "READY TO START"
    );

    restoreEmptyStates();

    if (els.startButton) {
      els.startButton.disabled = false;

      els.startButton.innerHTML =
        "<span>▶</span> Start process";
    }

    if (els.auditExpand) {
      els.auditExpand.dataset.expanded =
        "false";

      els.auditExpand.textContent =
        "Expand";
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
                    ? "ACTIVE"
                    : "AVAILABLE";
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
        "Case routed for human review",
        "The complete prior history was preserved automatically."
      );

      showManualReview(
        "Customer dispute",
        "The automated workflow stopped exactly where it should",
        "The customer disputes part of the delivery or the outstanding amount. Further automatic escalation could be inappropriate, so the system handed the case to a person together with the complete history."
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
          ? "Collapse"
          : "Expand";

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
  setStatus("READY TO START");
})();
