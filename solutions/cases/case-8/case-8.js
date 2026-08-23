(() => {
  const root = document.querySelector("#telegram-bot-case");

  if (!root) return;

  const chatArea = root.querySelector("#tg-chat-area");
  const dynamicZone = root.querySelector("#tg-dynamic-zone");
  const addButton = root.querySelector("#tg-add-reminder");
  const openListButton = root.querySelector("#tg-open-list");
  const deleteButton = root.querySelector("#tg-delete-reminder");
  const helpButton = root.querySelector("#tg-help");
  const replyKeyboard = root.querySelector("#tg-reply-keyboard");
  const input = root.querySelector("#tg-message-input");
  const sendButton = root.querySelector("#tg-send-button");
  const stepCounter = root.querySelector("#tg-step-counter");
  const guideMessage = root.querySelector("#tg-guide-message");
  const guideSteps = [
    ...root.querySelectorAll("[data-tg-guide-step]")
  ];
  const resetButton = root.querySelector("#tg-reset-demo");
  const shareModal = root.querySelector("#tg-share-modal");
  const shareClose = root.querySelector("#tg-share-close");
  const shareReminderText = root.querySelector(
    "#tg-share-reminder-text"
  );
  const shareContacts = [
    ...root.querySelectorAll("[data-tg-contact]")
  ];

  let reminder = createEmptyReminder();

  function createEmptyReminder() {
    return {
      text: "",
      timeLabel: "",
      scheduledAt: null,
      mode: "",
      created: false,
      status: "",
      snoozed: false
    };
  }

  function scrollChat() {
    requestAnimationFrame(() => {
      chatArea.scrollTo({
        top: chatArea.scrollHeight,
        behavior: "smooth"
      });
    });
  }

  function getTime() {
    return new Date().toLocaleTimeString("uk-UA", {
      hour: "2-digit",
      minute: "2-digit"
    });
  }

  function formatDateTime(date) {
    return new Intl.DateTimeFormat("uk-UA", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    }).format(date);
  }

  function createMessage(text, type = "bot") {
    const message = document.createElement("div");

    message.className =
      type === "user"
        ? "tg-message tg-message-user"
        : "tg-message tg-message-bot";

    const body = document.createElement("div");
    body.className = "tg-message-text";
    body.textContent = text;

    const time = document.createElement("span");
    time.className = "tg-message-time";
    time.textContent = getTime();

    message.appendChild(body);
    message.appendChild(time);

    dynamicZone.appendChild(message);

    scrollChat();

    return message;
  }

  function clearHints() {
    root
      .querySelectorAll(".tg-next-action")
      .forEach(element => {
        element.classList.remove("tg-next-action");
      });
  }

  function setGuide(step, text) {
    stepCounter.textContent = `${step} / 7`;
    guideMessage.textContent = text;

    guideSteps.forEach((item, index) => {
      const number = index + 1;

      item.classList.toggle(
        "active",
        number === step
      );

      item.classList.toggle(
        "done",
        number < step
      );
    });

    clearHints();
  }

  function completeGuide(text) {
    stepCounter.textContent = "7 / 7";
    guideMessage.textContent = text;

    guideSteps.forEach(item => {
      item.classList.remove("active");
      item.classList.add("done");
    });

    clearHints();
  }

  function enableComposer(placeholder) {
    input.disabled = false;
    input.value = "";
    input.placeholder = placeholder;
    sendButton.disabled = true;

    input.classList.add("tg-next-action");

    setTimeout(() => {
      input.focus();
    }, 150);
  }

  function disableComposer() {
    input.disabled = true;
    input.value = "";
    input.placeholder = "Message";
    sendButton.disabled = true;

    input.classList.remove("tg-next-action");
    sendButton.classList.remove("tg-next-action");
  }

  function hideReplyKeyboard() {
    replyKeyboard.hidden = true;
    replyKeyboard.innerHTML = "";
  }

  function showReplyKeyboard(buttons) {
    replyKeyboard.innerHTML = "";
    replyKeyboard.hidden = false;

    buttons.forEach((buttonData, index) => {
      const button = document.createElement("button");

      button.type = "button";
      button.textContent = buttonData.label;

      if (index === 0) {
        button.classList.add("tg-next-action");
      }

      button.addEventListener("click", () => {
        buttonData.action(button);
      });

      replyKeyboard.appendChild(button);
    });
  }

  function setMainMenuEnabled(enabled) {
    [
      addButton,
      openListButton,
      deleteButton,
      helpButton
    ].forEach(button => {
      button.disabled = !enabled;
    });
  }

  function startNewReminder() {
    hideReplyKeyboard();

    createMessage("➕ Додати", "user");

    setGuide(
      2,
      "Напишіть текст нагадування у полі Message."
    );

    setMainMenuEnabled(false);

    setTimeout(() => {
      createMessage(
        "Напиши, про що тобі нагадати?"
      );

      enableComposer(
        "Наприклад: передзвонити клієнту"
      );
    }, 300);
  }

  function handleReminderText() {
    const value = input.value.trim();

    if (!value) return;

    reminder = createEmptyReminder();
    reminder.text = value;

    createMessage(value, "user");

    disableComposer();

    setTimeout(() => {
      createMessage("Коли тобі нагадати?");
      showTimeOptions();
    }, 300);
  }

  function showTimeOptions() {
    setGuide(
      3,
      "Оберіть швидкий варіант або вкажіть точну дату та час."
    );

    showReplyKeyboard([
      {
        label: "5 хв",
        action: () =>
          chooseRelativeTime(5, "через 5 хвилин")
      },
      {
        label: "10 хв",
        action: () =>
          chooseRelativeTime(10, "через 10 хвилин")
      },
      {
        label: "30 хв",
        action: () =>
          chooseRelativeTime(30, "через 30 хвилин")
      },
      {
        label: "1 година",
        action: () =>
          chooseRelativeTime(60, "через 1 годину")
      },
      {
        label: "Сьогодні ввечері",
        action: chooseTonight
      },
      {
        label: "Завтра зранку",
        action: chooseTomorrowMorning
      },
      {
        label: "Завтра о...",
        action: showTomorrowTimePicker
      },
      {
        label: "📅 Обрати дату і час",
        action: showCustomDateTimePicker
      }
    ]);
  }

  function chooseRelativeTime(minutes, label) {
    const date =
      new Date(Date.now() + minutes * 60000);

    setChosenTime(date, label);
  }

  function chooseTonight() {
    const now = new Date();
    const date = new Date(now);

    date.setHours(19, 0, 0, 0);

    if (date <= now) {
      date.setDate(date.getDate() + 1);
    }

    setChosenTime(
      date,
      `сьогодні ввечері · ${formatDateTime(date)}`
    );
  }

  function chooseTomorrowMorning() {
    const date = new Date();

    date.setDate(date.getDate() + 1);
    date.setHours(8, 0, 0, 0);

    setChosenTime(
      date,
      `завтра зранку · ${formatDateTime(date)}`
    );
  }

  function showTomorrowTimePicker() {
    hideReplyKeyboard();

    createMessage("Завтра о...", "user");

    setGuide(
      3,
      "Оберіть точний час на завтра."
    );

    replyKeyboard.hidden = false;

    const picker = document.createElement("div");
    picker.className = "tg-date-picker";

    picker.innerHTML = `
      <span>Завтра</span>
      <input
        type="time"
        class="tg-picker-time"
        value="10:00"
      >
      <button
        type="button"
        class="tg-picker-confirm tg-next-action"
      >
        Підтвердити
      </button>
    `;

    replyKeyboard.appendChild(picker);

    const timeInput =
      picker.querySelector(".tg-picker-time");

    const confirm =
      picker.querySelector(".tg-picker-confirm");

    confirm.addEventListener("click", () => {
      const time = timeInput.value;

      if (!time) return;

      const [hours, minutes] =
        time.split(":").map(Number);

      const date = new Date();

      date.setDate(date.getDate() + 1);
      date.setHours(hours, minutes, 0, 0);

      setChosenTime(
        date,
        `завтра о ${time}`
      );
    });
  }

  function showCustomDateTimePicker() {
    hideReplyKeyboard();

    createMessage("📅 Обрати дату і час", "user");

    setGuide(
      3,
      "Оберіть будь-яку дату та точний час."
    );

    replyKeyboard.hidden = false;

    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);

    const minDate =
      tomorrow.toISOString().slice(0, 10);

    const picker = document.createElement("div");
    picker.className = "tg-date-picker tg-date-picker-custom";

    picker.innerHTML = `
      <input
        type="date"
        class="tg-picker-date"
        min="${minDate}"
        value="${minDate}"
      >
      <input
        type="time"
        class="tg-picker-time"
        value="10:00"
      >
      <button
        type="button"
        class="tg-picker-confirm tg-next-action"
      >
        Підтвердити
      </button>
    `;

    replyKeyboard.appendChild(picker);

    const dateInput =
      picker.querySelector(".tg-picker-date");

    const timeInput =
      picker.querySelector(".tg-picker-time");

    const confirm =
      picker.querySelector(".tg-picker-confirm");

    confirm.addEventListener("click", () => {
      if (
        !dateInput.value ||
        !timeInput.value
      ) {
        return;
      }

      const date =
        new Date(
          `${dateInput.value}T${timeInput.value}:00`
        );

      setChosenTime(
        date,
        formatDateTime(date)
      );
    });
  }

  function setChosenTime(date, label) {
    reminder.scheduledAt = date;
    reminder.timeLabel = label;

    hideReplyKeyboard();

    createMessage(label, "user");

    setTimeout(() => {
      createMessage("Як нагадувати?");
      showModeOptions();
    }, 300);
  }

  function showModeOptions() {
    setGuide(
      4,
      "Оберіть: нагадати один раз або повторювати, поки задача не буде виконана."
    );

    showReplyKeyboard([
      {
        label: "Один раз",
        action: () =>
          chooseMode("Один раз")
      },
      {
        label: "Повторювати до виконання",
        action: () =>
          chooseMode("Повторювати до виконання")
      }
    ]);
  }

  function chooseMode(mode) {
    reminder.mode = mode;

    hideReplyKeyboard();

    createMessage(mode, "user");

    setTimeout(createReminder, 300);
  }

  function createReminder() {
    reminder.created = true;
    reminder.status = "active";
    reminder.snoozed = false;

    createMessage(
      `✅ Нагадування створено.\n\n${reminder.text}\n\n⏰ ${reminder.timeLabel}\n🔁 ${reminder.mode}`
    );

    setGuide(
      5,
      "Нагадування готове. Тепер можете перевірити, як воно спрацює."
    );

    showCreatedActions();
  }

  function showCreatedActions() {
    showReplyKeyboard([
      {
        label: "🔔 Перевірити нагадування",
        action: testReminder
      },
      {
        label: "📋 Список",
        action: () => showReminderList(true)
      },
      {
        label: "↗ Передати іншому",
        action: openShare
      },
      {
        label: "➕ Створити ще",
        action: startNewReminder
      }
    ]);
  }

  function playReminderSignal() {
    if (
      "vibrate" in navigator
    ) {
      navigator.vibrate([
        120,
        80,
        120
      ]);
    }

    try {
      const AudioContextClass =
        window.AudioContext ||
        window.webkitAudioContext;

      if (!AudioContextClass) {
        return;
      }

      const context =
        new AudioContextClass();

      const oscillator =
        context.createOscillator();

      const gain =
        context.createGain();

      oscillator.frequency.value = 720;
      oscillator.type = "sine";

      gain.gain.setValueAtTime(
        0.0001,
        context.currentTime
      );

      gain.gain.exponentialRampToValueAtTime(
        0.13,
        context.currentTime + 0.02
      );

      gain.gain.exponentialRampToValueAtTime(
        0.0001,
        context.currentTime + 0.28
      );

      oscillator.connect(gain);
      gain.connect(context.destination);

      oscillator.start();
      oscillator.stop(
        context.currentTime + 0.3
      );
    } catch (error) {
      console.error(error);
    }
  }

  function testReminder() {
    hideReplyKeyboard();

    setGuide(
      6,
      "Зараз бот імітує реальне спрацювання створеного нагадування."
    );

    createMessage(
      "🔔 Перевірити нагадування",
      "user"
    );

    setTimeout(() => {
      playReminderSignal();

      createMessage(
        `⏰ Нагадування!\n\n${reminder.text}\n\nДавай, час виконати те, що ти запланував 🙂`
      );

      showReminderActions();
    }, 650);
  }

  function showReminderActions() {
    showReplyKeyboard([
      {
        label: "✅ Виконано",
        action: markDone
      },
      {
        label: "⏰ Відкласти",
        action: showSnoozeOptions
      },
      {
        label: "↗ Передати іншому",
        action: openShare
      }
    ]);
  }

  function showSnoozeOptions() {
    hideReplyKeyboard();

    createMessage(
      "⏰ Відкласти",
      "user"
    );

    setTimeout(() => {
      createMessage(
        "Добре. Через скільки нагадати ще раз?"
      );

      showReplyKeyboard([
        {
          label: "1 хв",
          action: () =>
            applySnooze(1)
        },
        {
          label: "10 хв",
          action: () =>
            applySnooze(10)
        },
        {
          label: "30 хв",
          action: () =>
            applySnooze(30)
        },
        {
          label: "1 година",
          action: () =>
            applySnooze(60)
        }
      ]);
    }, 300);
  }

  function applySnooze(minutes) {
    hideReplyKeyboard();

    const label =
      minutes === 60
        ? "1 година"
        : `${minutes} хв`;

    createMessage(label, "user");

    const date =
      new Date(Date.now() + minutes * 60000);

    reminder.scheduledAt = date;
    reminder.timeLabel =
      `через ${label}`;

    reminder.snoozed = true;
    reminder.status = "snoozed";

    setTimeout(() => {
      createMessage(
        `👌 Домовились. Нагадаю ще раз через ${label}.\n\nНаступне нагадування: ${formatDateTime(date)}`
      );

      showReplyKeyboard([
        {
          label: "🔔 Перевірити ще раз",
          action: testReminder
        },
        {
          label: "📋 Список",
          action: () =>
            showReminderList(false)
        }
      ]);
    }, 300);
  }

  function markDone() {
    hideReplyKeyboard();

    createMessage("✅ Виконано", "user");

    reminder.status = "done";
    reminder.created = false;

    setTimeout(() => {
      createMessage(
        `✅ Готово!\n\n“${reminder.text}” позначено як виконане. Більше нагадувати не буду.`
      );

      completeGuide(
        "Повний цикл завершено: задача створена, нагадування спрацювало та було виконане."
      );

      showReplyKeyboard([
        {
          label: "➕ Створити нове",
          action: startNewReminder
        }
      ]);

      setMainMenuEnabled(true);
    }, 300);
  }

  function showReminderList(fromFlow = false) {
    if (!reminder.created) {
      createMessage(
        "Активних нагадувань поки немає."
      );

      return;
    }

    hideReplyKeyboard();

    createMessage(
      "📋 Ваші активні нагадування:"
    );

    const card =
      document.createElement("div");

    card.className =
      "tg-message tg-message-bot";

    const status =
      reminder.status === "snoozed"
        ? "Відкладено"
        : "Активне";

    card.innerHTML = `
      <div class="tg-message-text">
        <strong>№1</strong><br>
        ${escapeHtml(reminder.text)}<br><br>
        ⏰ ${escapeHtml(reminder.timeLabel)}<br>
        🔁 ${escapeHtml(reminder.mode)}<br>
        ● ${status}
      </div>
      <span class="tg-message-time">${getTime()}</span>
    `;

    dynamicZone.appendChild(card);

    if (fromFlow) {
      setGuide(
        6,
        "Створене нагадування зберігається у списку."
      );
    }

    showReplyKeyboard([
      {
        label: "🔔 Перевірити",
        action: testReminder
      },
      {
        label: "↗ Передати іншому",
        action: openShare
      },
      {
        label: "✅ Виконано",
        action: markDone
      },
      {
        label: "⏰ Відкласти",
        action: showSnoozeOptions
      }
    ]);

    scrollChat();
  }

  function openShare() {
    if (!reminder.text) {
      createMessage(
        "Спочатку створіть нагадування."
      );

      return;
    }

    shareReminderText.textContent =
      reminder.text;

    shareModal.hidden = false;

    setGuide(
      7,
      "Оберіть контакт, якому потрібно передати нагадування."
    );
  }

  function closeShare() {
    shareModal.hidden = true;
  }

  function completeShare(contactName) {
    closeShare();

    createMessage(
      `↗ Нагадування передано: ${contactName}`
    );

    completeGuide(
      `Нагадування передано контакту “${contactName}”.`
    );

    showReplyKeyboard([
      {
        label: "🔔 Перевірити нагадування",
        action: testReminder
      },
      {
        label: "➕ Створити нове",
        action: startNewReminder
      }
    ]);
  }

  function showHelp() {
    createMessage(
      "Я можу створювати нагадування на швидкий або точний час, повторювати їх до виконання, відкладати, показувати список і передавати задачі іншим людям."
    );
  }

  function showDelete() {
    if (!reminder.created) {
      createMessage(
        "Немає активних нагадувань для видалення."
      );

      return;
    }

    createMessage(
      `Видалити нагадування “${reminder.text}”?`
    );

    showReplyKeyboard([
      {
        label: "Так, видалити",
        action: () => {
          reminder.created = false;
          reminder.status = "deleted";

          hideReplyKeyboard();

          createMessage(
            "🗑 Нагадування видалено."
          );

          setMainMenuEnabled(true);
        }
      },
      {
        label: "Скасувати",
        action: () => {
          hideReplyKeyboard();

          createMessage(
            "Видалення скасовано."
          );
        }
      }
    ]);
  }

  function escapeHtml(value) {
    return String(value || "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  function resetDemo() {
    reminder = createEmptyReminder();

    dynamicZone.innerHTML = "";

    hideReplyKeyboard();
    disableComposer();

    setMainMenuEnabled(true);

    setGuide(
      1,
      "Натисніть “Додати”, щоб створити перше нагадування."
    );

    addButton.classList.add(
      "tg-next-action"
    );

    closeShare();

    chatArea.scrollTop = 0;
  }

  input.addEventListener("input", () => {
    const hasText =
      input.value.trim().length > 0;

    sendButton.disabled =
      !hasText;

    input.classList.toggle(
      "tg-next-action",
      !hasText
    );

    sendButton.classList.toggle(
      "tg-next-action",
      hasText
    );
  });

  input.addEventListener(
    "keydown",
    event => {
      if (
        event.key === "Enter" &&
        !sendButton.disabled
      ) {
        event.preventDefault();
        handleReminderText();
      }
    }
  );

  sendButton.addEventListener(
    "click",
    handleReminderText
  );

  addButton.addEventListener(
    "click",
    startNewReminder
  );

  openListButton.addEventListener(
    "click",
    () =>
      showReminderList(false)
  );

  deleteButton.addEventListener(
    "click",
    showDelete
  );

  helpButton.addEventListener(
    "click",
    showHelp
  );

  resetButton.addEventListener(
    "click",
    resetDemo
  );

  shareClose.addEventListener(
    "click",
    closeShare
  );

  shareModal.addEventListener(
    "click",
    event => {
      if (
        event.target ===
        shareModal
      ) {
        closeShare();
      }
    }
  );

  shareContacts.forEach(contact => {
    contact.addEventListener(
      "click",
      () => {
        completeShare(
          contact.dataset.tgContact
        );
      }
    );
  });

  document.addEventListener(
    "keydown",
    event => {
      if (
        event.key === "Escape" &&
        !shareModal.hidden
      ) {
        closeShare();
      }
    }
  );

  resetDemo();
})();
