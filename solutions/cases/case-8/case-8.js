(() => {
  const root = document.querySelector("#telegram-bot-case");

  if (!root) return;

  const chatArea = root.querySelector("#tg-chat-area");
  const dynamicZone = root.querySelector("#tg-dynamic-zone");
  const mainMenu = root.querySelector("#tg-main-menu");

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

  let currentStep = 1;

  let reminder = {
    text: "",
    timeLabel: "",
    mode: "",
    created: false
  };

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
    currentStep = step;

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

  function enableComposer(placeholder) {
    input.disabled = false;
    input.value = "";
    input.placeholder = placeholder;

    sendButton.disabled = true;

    input.classList.add("tg-next-action");

    setTimeout(() => {
      input.focus();
    }, 200);
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

  function showTimeOptions() {
    setGuide(
      3,
      "Тепер оберіть, коли бот має повернути це нагадування."
    );

    showReplyKeyboard([
      {
        label: "5 хв",
        action: () => chooseTime("через 5 хвилин")
      },
      {
        label: "10 хв",
        action: () => chooseTime("через 10 хвилин")
      },
      {
        label: "30 хв",
        action: () => chooseTime("через 30 хвилин")
      },
      {
        label: "1 година",
        action: () => chooseTime("через 1 годину")
      },
      {
        label: "Сьогодні ввечері",
        action: () => chooseTime("сьогодні ввечері")
      },
      {
        label: "Завтра зранку",
        action: () => chooseTime("завтра зранку")
      }
    ]);
  }

  function chooseTime(label) {
    reminder.timeLabel = label;

    hideReplyKeyboard();

    createMessage(label, "user");

    setTimeout(() => {
      createMessage(
        "Як нагадувати?"
      );

      showModeOptions();
    }, 350);
  }

  function showModeOptions() {
    setGuide(
      4,
      "Оберіть режим: один раз або повторювати нагадування, поки задача не буде виконана."
    );

    showReplyKeyboard([
      {
        label: "Один раз",
        action: () => chooseMode("Один раз")
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

    setTimeout(() => {
      createReminder();
    }, 350);
  }

  function createReminder() {
    reminder.created = true;

    createMessage(
      `✅ Нагадування створено.\n\n${reminder.text}\n\nКоли: ${reminder.timeLabel}\nРежим: ${reminder.mode}`
    );

    setGuide(
      5,
      "Готово. Бот зберіг нагадування. Тепер відкрийте список і перевірте, що задача там є."
    );

    renderCreatedActions();
  }

  function renderCreatedActions() {
    hideReplyKeyboard();

    showReplyKeyboard([
      {
        label: "📋 Відкрити список",
        action: () => showReminderList(true)
      },
      {
        label: "↗ Передати іншому",
        action: () => openShare()
      },
      {
        label: "➕ Створити ще",
        action: () => startNewReminder()
      }
    ]);
  }

  function showReminderList(fromFlow = false) {
    if (!reminder.created) {
      createMessage(
        "Активних нагадувань поки немає."
      );

      return;
    }

    hideReplyKeyboard();

    createMessage("📋 Ваші активні нагадування:");

    const card = document.createElement("div");
    card.className = "tg-message tg-message-bot";

    card.innerHTML = `
      <div class="tg-message-text">
        <strong>№1</strong><br>
        ${escapeHtml(reminder.text)}<br><br>
        ⏰ ${escapeHtml(reminder.timeLabel)}<br>
        🔁 ${escapeHtml(reminder.mode)}
      </div>
      <span class="tg-message-time">${getTime()}</span>
    `;

    dynamicZone.appendChild(card);

    if (fromFlow) {
      setGuide(
        6,
        "Нагадування є у списку. Тепер спробуйте передати його іншій людині."
      );
    }

    showReplyKeyboard([
      {
        label: "↗ Передати іншому",
        action: () => openShare()
      },
      {
        label: "✅ Виконано",
        action: () => markDone()
      },
      {
        label: "⏰ Відкласти",
        action: () => snoozeReminder()
      },
      {
        label: "➕ Нове нагадування",
        action: () => startNewReminder()
      }
    ]);

    scrollChat();
  }

  function openShare() {
    if (!reminder.created) {
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
      "Оберіть контакт — так виглядає передача нагадування іншій людині."
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

    hideReplyKeyboard();

    showReplyKeyboard([
      {
        label: "➕ Створити нове",
        action: () => startNewReminder()
      },
      {
        label: "📋 Список",
        action: () => showReminderList(false)
      }
    ]);

    guideMessage.textContent =
      `Готово. Нагадування передано контакту “${contactName}”. Ви пройшли повний сценарій.`;

    stepCounter.textContent = "7 / 7";

    guideSteps.forEach(item => {
      item.classList.remove("active");
      item.classList.add("done");
    });
  }

  function markDone() {
    hideReplyKeyboard();

    createMessage("✅ Виконано", "user");

    setTimeout(() => {
      createMessage(
        "Готово. Нагадування закрито."
      );

      reminder.created = false;

      showReplyKeyboard([
        {
          label: "➕ Створити нове",
          action: () => startNewReminder()
        }
      ]);
    }, 300);
  }

  function snoozeReminder() {
    hideReplyKeyboard();

    createMessage("⏰ Відкласти", "user");

    setTimeout(() => {
      createMessage(
        "На скільки відкласти?"
      );

      showReplyKeyboard([
        {
          label: "5 хв",
          action: () => applySnooze("5 хвилин")
        },
        {
          label: "10 хв",
          action: () => applySnooze("10 хвилин")
        },
        {
          label: "30 хв",
          action: () => applySnooze("30 хвилин")
        },
        {
          label: "1 година",
          action: () => applySnooze("1 годину")
        }
      ]);
    }, 300);
  }

  function applySnooze(label) {
    hideReplyKeyboard();

    createMessage(label, "user");

    setTimeout(() => {
      createMessage(
        `⏰ Нагадування відкладено на ${label}.`
      );

      renderCreatedActions();
    }, 300);
  }

  function startNewReminder() {
    hideReplyKeyboard();

    createMessage("➕ Додати", "user");

    setGuide(
      2,
      "Напишіть будь-яку власну задачу у полі Message і натисніть кнопку відправлення."
    );

    setMainMenuEnabled(false);

    setTimeout(() => {
      createMessage(
        "Напиши текст нагадування:"
      );

      enableComposer(
        "Наприклад: передзвонити клієнту"
      );
    }, 350);
  }

  function handleReminderText() {
    const value = input.value.trim();

    if (!value) return;

    reminder = {
      text: value,
      timeLabel: "",
      mode: "",
      created: false
    };

    createMessage(value, "user");

    disableComposer();

    setTimeout(() => {
      createMessage(
        "Коли нагадати?"
      );

      showTimeOptions();
    }, 350);
  }

  function showHelp() {
    createMessage(
      "Я можу створювати нагадування, показувати список, відкладати задачі, повторювати їх до виконання та передавати іншій людині."
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
    reminder = {
      text: "",
      timeLabel: "",
      mode: "",
      created: false
    };

    dynamicZone.innerHTML = "";

    hideReplyKeyboard();
    disableComposer();

    setMainMenuEnabled(true);

    setGuide(
      1,
      "Натисніть “Додати”, щоб створити перше нагадування."
    );

    addButton.classList.add("tg-next-action");

    closeShare();

    chatArea.scrollTop = 0;
  }

  input.addEventListener("input", () => {
    const hasText =
      input.value.trim().length > 0;

    sendButton.disabled = !hasText;

    input.classList.toggle(
      "tg-next-action",
      !hasText
    );

    sendButton.classList.toggle(
      "tg-next-action",
      hasText
    );
  });

  input.addEventListener("keydown", event => {
    if (
      event.key === "Enter" &&
      !sendButton.disabled
    ) {
      event.preventDefault();
      handleReminderText();
    }
  });

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
    () => showReminderList(false)
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
      if (event.target === shareModal) {
        closeShare();
      }
    }
  );

  shareContacts.forEach(contact => {
    contact.addEventListener("click", () => {
      completeShare(
        contact.dataset.tgContact
      );
    });
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
