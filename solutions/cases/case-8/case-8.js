(() => {
  const caseRoot = document.querySelector("#telegram-bot-case");

  if (!caseRoot) return;

  const runButton = caseRoot.querySelector("#tg-demo-run");
  const progress = caseRoot.querySelector("#tg-demo-progress");
  const statusText = caseRoot.querySelector("#tg-demo-status");
  const counterText = caseRoot.querySelector("#tg-demo-counter");

  const sourceCards = [
    ...caseRoot.querySelectorAll("[data-tg-source]")
  ];

  const userMessage = caseRoot.querySelector("#tg-user-message");
  const botReply = caseRoot.querySelector("#tg-bot-reply");
  const quickActions = [
    ...caseRoot.querySelectorAll("#tg-quick-actions button")
  ];
  const confirmation = caseRoot.querySelector("#tg-confirmation");
  const reminderCard = caseRoot.querySelector("#tg-reminder-card");

  const flowSteps = [
    ...caseRoot.querySelectorAll(".tg-flow article")
  ];

  const resultItems = [
    ...caseRoot.querySelectorAll(".tg-result-item")
  ];

  const statCreated = caseRoot.querySelector("#tg-stat-created");
  const statSent = caseRoot.querySelector("#tg-stat-sent");
  const statSnoozed = caseRoot.querySelector("#tg-stat-snoozed");
  const statDone = caseRoot.querySelector("#tg-stat-done");

  const scenarios = [
    {
      source: "Надіслати комерційну пропозицію клієнту до 16:00",
      bot: "Коли нагадати?",
      actionIndex: 2,
      actionText: "Сьогодні ввечері",
      confirmation: "Нагадування створено на сьогодні, 19:00",
      reminderTitle: "Надіслати комерційну пропозицію клієнту",
      reminderTime: "19:00",
      reminderStatus: "активне",
      repeat: "вимкнено"
    },
    {
      source: "Передзвонити клієнту завтра о 10:00",
      bot: "Коли нагадати?",
      actionIndex: 3,
      actionText: "Завтра зранку",
      confirmation: "Нагадування створено на завтра, 10:00",
      reminderTitle: "Передзвонити клієнту",
      reminderTime: "10:00",
      reminderStatus: "активне",
      repeat: "увімкнено"
    },
    {
      source: "Перевірити оплату рахунку після обіду",
      bot: "Коли нагадати?",
      actionIndex: 1,
      actionText: "Через 1 год",
      confirmation: "Нагадування створено на 14:30",
      reminderTitle: "Перевірити оплату рахунку",
      reminderTime: "14:30",
      reminderStatus: "активне",
      repeat: "вимкнено"
    }
  ];

  const sleep = delay =>
    new Promise(resolve => setTimeout(resolve, delay));

  function setFlowStep(index) {
    flowSteps.forEach((step, stepIndex) => {
      step.classList.toggle("active", stepIndex === index);
    });

    counterText.textContent =
      `${Math.min(index + 1, 5)} / 5`;

    progress.style.width =
      `${Math.min(((index + 1) / 5) * 100, 100)}%`;
  }

  function resetQuickActions() {
    quickActions.forEach(button => {
      button.classList.remove("active");
    });
  }

  function resetResultItems() {
    resultItems.forEach(item => {
      item.classList.remove("active", "snoozed", "done");
    });

    resultItems[0]?.classList.add("active");
    resultItems[1]?.classList.add("snoozed");
    resultItems[2]?.classList.add("done");

    const chips = [
      ...caseRoot.querySelectorAll(".tg-status-chip")
    ];

    if (chips[0]) {
      chips[0].className = "tg-status-chip active";
      chips[0].textContent = "Активне";
    }

    if (chips[1]) {
      chips[1].className = "tg-status-chip snoozed";
      chips[1].textContent = "Відкладено";
    }

    if (chips[2]) {
      chips[2].className = "tg-status-chip done";
      chips[2].textContent = "Виконано";
    }
  }

  function setReminderCard(data) {
    const head = reminderCard.querySelector(".tg-reminder-head");
    const title = reminderCard.querySelector("p");
    const meta = reminderCard.querySelectorAll(".tg-reminder-meta span");

    if (head) {
      const strong = head.querySelector("strong");
      const time = head.querySelector("span");

      if (strong) {
        strong.textContent = "Активне нагадування";
      }

      if (time) {
        time.textContent = data.reminderTime;
      }
    }

    if (title) {
      title.textContent = data.reminderTitle;
    }

    if (meta[0]) {
      meta[0].textContent =
        `Статус: ${data.reminderStatus}`;
    }

    if (meta[1]) {
      meta[1].textContent =
        `Повтор: ${data.repeat}`;
    }
  }

  function resetDemo() {
    sourceCards.forEach((card, index) => {
      card.classList.toggle("active", index === 0);
    });

    userMessage.textContent =
      scenarios[0].source;

    botReply.textContent =
      scenarios[0].bot;

    confirmation.textContent =
      "Нагадування буде надіслано сьогодні о 15:30";

    setReminderCard({
      reminderTitle:
        "Надіслати комерційну пропозицію клієнту",
      reminderTime: "15:30",
      reminderStatus: "активне",
      repeat: "вимкнено"
    });

    resetQuickActions();
    resetResultItems();

    flowSteps.forEach(step => {
      step.classList.remove("active");
    });

    progress.style.width = "0%";
    statusText.textContent = "Готово до запуску";
    counterText.textContent = "0 / 5";

    statCreated.textContent = "0";
    statSent.textContent = "0";
    statSnoozed.textContent = "0";
    statDone.textContent = "0";
  }

  async function animateSourceTransfer(data, scenarioIndex) {
    sourceCards.forEach((card, index) => {
      card.classList.toggle(
        "active",
        index === scenarioIndex
      );
    });

    const activeCard = sourceCards[scenarioIndex];

    activeCard?.classList.add("processing");

    statusText.textContent =
      "Повідомлення пересилається боту";

    setFlowStep(0);

    await sleep(650);

    userMessage.textContent =
      data.source;

    activeCard?.classList.remove("processing");
  }

  async function animateBotReply(data) {
    statusText.textContent =
      "Бот прийняв задачу";

    setFlowStep(1);

    botReply.textContent =
      "Аналізую повідомлення…";

    await sleep(500);

    botReply.textContent =
      data.bot;

    await sleep(450);
  }

  async function animateScheduling(data) {
    statusText.textContent =
      "Вибір часу нагадування";

    setFlowStep(2);

    resetQuickActions();

    const action =
      quickActions[data.actionIndex];

    if (action) {
      action.classList.add("active");
    }

    await sleep(650);

    confirmation.textContent =
      data.confirmation;

    setReminderCard(data);

    statCreated.textContent =
      String(
        Number(statCreated.textContent) + 1
      );

    await sleep(500);
  }

  async function animateReminder(data) {
    statusText.textContent =
      "Нагадування спрацювало";

    setFlowStep(3);

    botReply.textContent =
      `⏰ Нагадування: ${data.reminderTitle}`;

    confirmation.textContent =
      "Що зробити із задачею?";

    statSent.textContent =
      String(
        Number(statSent.textContent) + 1
      );

    await sleep(650);
  }

  async function animateAction(scenarioIndex) {
    statusText.textContent =
      "Користувач обирає дію";

    setFlowStep(4);

    const item =
      resultItems[scenarioIndex];

    const chip =
      item?.querySelector(".tg-status-chip");

    if (!item || !chip) {
      return;
    }

    if (scenarioIndex === 1) {
      item.classList.remove("active", "done");
      item.classList.add("snoozed");

      chip.className =
        "tg-status-chip snoozed";

      chip.textContent =
        "Відкладено";

      confirmation.textContent =
        "Нагадування відкладено на 10 хв";

      statSnoozed.textContent =
        String(
          Number(statSnoozed.textContent) + 1
        );
    } else {
      item.classList.remove("active", "snoozed");
      item.classList.add("done");

      chip.className =
        "tg-status-chip done";

      chip.textContent =
        "Виконано";

      confirmation.textContent =
        "Задачу позначено як виконану";

      statDone.textContent =
        String(
          Number(statDone.textContent) + 1
        );
    }

    await sleep(700);
  }

  async function runScenario(
    data,
    scenarioIndex
  ) {
    await animateSourceTransfer(
      data,
      scenarioIndex
    );

    await animateBotReply(data);

    await animateScheduling(data);

    await animateReminder(data);

    await animateAction(scenarioIndex);
  }

  async function runDemo() {
    runButton.disabled = true;
    runButton.textContent =
      "Демо виконується…";

    resetDemo();

    for (
      let index = 0;
      index < scenarios.length;
      index++
    ) {
      await runScenario(
        scenarios[index],
        index
      );

      if (
        index <
        scenarios.length - 1
      ) {
        statusText.textContent =
          "Переходимо до наступної задачі";

        await sleep(700);

        flowSteps.forEach(step => {
          step.classList.remove("active");
        });

        progress.style.width = "0%";
        counterText.textContent = "0 / 5";

        resetQuickActions();
      }
    }

    flowSteps.forEach(step => {
      step.classList.remove("active");
    });

    progress.style.width = "100%";
    counterText.textContent = "5 / 5";

    statusText.textContent =
      "Готово: задачі створено, нагадування надіслано, статуси оновлено";

    runButton.disabled = false;
    runButton.textContent =
      "↻ Запустити ще раз";
  }

  quickActions.forEach((button, index) => {
    button.addEventListener("click", () => {
      resetQuickActions();
      button.classList.add("active");

      confirmation.textContent =
        `Обрано: ${button.textContent.trim()}`;

      setFlowStep(2);
    });
  });

  sourceCards.forEach((card, index) => {
    card.addEventListener("click", () => {
      sourceCards.forEach(item => {
        item.classList.remove("active");
      });

      card.classList.add("active");

      const data =
        scenarios[index];

      if (!data) return;

      userMessage.textContent =
        data.source;

      botReply.textContent =
        data.bot;

      confirmation.textContent =
        "Оберіть час нагадування";

      setReminderCard(data);

      resetQuickActions();
    });
  });

  runButton.addEventListener(
    "click",
    runDemo
  );

  resetDemo();
})();
