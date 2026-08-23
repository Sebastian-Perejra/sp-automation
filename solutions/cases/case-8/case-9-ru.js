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
    return new Date().toLocaleTimeString("ru-RU", {
      hour: "2-digit",
      minute: "2-digit"
    });
  }

  function formatDateTime(date) {
    return new Intl.DateTimeFormat("ru-RU", {
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
    input.placeholder = "Сообщение";
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

    createMessage("➕ Добавить", "user");

    setGuide(
      2,
      "Введите текст напоминания в поле сообщения."
    );

    setMainMenuEnabled(false);

    setTimeout(() => {
      createMessage(
        "О чём тебе напомнить?"
      );

      enableComposer(
        "Например: перезвонить клиенту"
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
      createMessage("Когда тебе напомнить?");
      showTimeOptions();
    }, 300);
  }

  function showTimeOptions() {
    setGuide(
      3,
      "Выберите быстрый вариант или укажите точную дату и время."
    );

    showReplyKeyboard([
      {
        label: "5 мин",
        action: () =>
          chooseRelativeTime(5, "через 5 минут")
      },
      {
        label: "10 мин",
        action: () =>
          chooseRelativeTime(10, "через 10 минут")
      },
      {
        label: "30 мин",
        action: () =>
          chooseRelativeTime(30, "через 30 минут")
      },
      {
        label: "1 час",
        action: () =>
          chooseRelativeTime(60, "через 1 час")
      },
      {
        label: "Сегодня вечером",
        action: chooseTonight
      },
      {
        label: "Завтра утром",
        action: chooseTomorrowMorning
      },
      {
        label: "Завтра в...",
        action: showTomorrowTimePicker
      },
      {
        label: "📅 Выбрать дату и время",
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
      `сегодня вечером · ${formatDateTime(date)}`
    );
  }

  function chooseTomorrowMorning() {
    const date = new Date();

    date.setDate(date.getDate() + 1);
    date.setHours(8, 0, 0, 0);

    setChosenTime(
      date,
      `завтра утром · ${formatDateTime(date)}`
    );
  }

  function showTomorrowTimePicker() {
    hideReplyKeyboard();

    createMessage("Завтра в...", "user");

    setGuide(
      3,
      "Выберите точное время на завтра."
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
        Подтвердить
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
        `завтра в ${time}`
      );
    });
  }

  function showCustomDateTimePicker() {
    hideReplyKeyboard();

    createMessage(
      "📅 Выбрать дату и время",
      "user"
    );

    setGuide(
      3,
      "Выберите любую дату и точное время."
    );

    replyKeyboard.hidden = false;

    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);

    const minDate =
      tomorrow.toISOString().slice(0, 10);

    const picker = document.createElement("div");
    picker.className =
      "tg-date-picker tg-date-picker-custom";

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
        Подтвердить
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
      createMessage("Как напоминать?");
      showModeOptions();
    }, 300);
  }

  function showModeOptions() {
    setGuide(
      4,
      "Выберите: напомнить один раз или повторять, пока задача не будет выполнена."
    );

    showReplyKeyboard([
      {
        label: "Один раз",
        action: () =>
          chooseMode("Один раз")
      },
      {
        label: "Повторять до выполнения",
        action: () =>
          chooseMode("Повторять до выполнения")
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
      `✅ Напоминание создано.\n\n${reminder.text}\n\n⏰ ${reminder.timeLabel}\n🔁 ${reminder.mode}`
    );

    setGuide(
      5,
      "Напоминание готово. Теперь можно проверить, как оно сработает."
    );

    showCreatedActions();
  }

  function showCreatedActions() {
    showReplyKeyboard([
      {
        label: "🔔 Проверить напоминание",
        action: testReminder
      },
      {
        label: "📋 Список",
        action: () => showReminderList(true)
      },
      {
        label: "↗ Передать другому",
        action: openShare
      },
      {
        label: "➕ Создать ещё",
        action: startNewReminder
      }
    ]);
  }

  function playReminderSignal() {
    if ("vibrate" in navigator) {
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
      "Сейчас бот имитирует реальное срабатывание созданного напоминания."
    );

    createMessage(
      "🔔 Проверить напоминание",
      "user"
    );

    setTimeout(() => {
      playReminderSignal();

      createMessage(
        `⏰ Напоминание!\n\n${reminder.text}\n\nДавай, пора выполнить то, что ты запланировал 🙂`
      );

      showReminderActions();
    }, 650);
  }

  function showReminderActions() {
    showReplyKeyboard([
      {
        label: "✅ Выполнено",
        action: markDone
      },
      {
        label: "⏰ Отложить",
        action: showSnoozeOptions
      },
      {
        label: "↗ Передать другому",
        action: openShare
      }
    ]);
  }

  function showSnoozeOptions() {
    hideReplyKeyboard();

    createMessage(
      "⏰ Отложить",
      "user"
    );

    setTimeout(() => {
      createMessage(
        "Хорошо. Через сколько напомнить ещё раз?"
      );

      showReplyKeyboard([
        {
          label: "1 мин",
          action: () =>
            applySnooze(1)
        },
        {
          label: "10 мин",
          action: () =>
            applySnooze(10)
        },
        {
          label: "30 мин",
          action: () =>
            applySnooze(30)
        },
        {
          label: "1 час",
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
        ? "1 час"
        : `${minutes} мин`;

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
        `👌 Договорились. Напомню ещё раз через ${label}.\n\nСледующее напоминание: ${formatDateTime(date)}`
      );

      showReplyKeyboard([
        {
          label: "🔔 Проверить ещё раз",
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

    createMessage("✅ Выполнено", "user");

    reminder.status = "done";
    reminder.created = false;

    setTimeout(() => {
      createMessage(
        `✅ Готово!\n\n«${reminder.text}» отмечено как выполненное. Больше напоминать не буду.`
      );

      completeGuide(
        "Полный цикл завершён: задача создана, напоминание сработало и задача была выполнена."
      );

      showReplyKeyboard([
        {
          label: "➕ Создать новое",
          action: startNewReminder
        }
      ]);

      setMainMenuEnabled(true);
    }, 300);
  }

  function showReminderList(fromFlow = false) {
    if (!reminder.created) {
      createMessage(
        "Активных напоминаний пока нет."
      );

      return;
    }

    hideReplyKeyboard();

    createMessage(
      "📋 Ваши активные напоминания:"
    );

    const card =
      document.createElement("div");

    card.className =
      "tg-message tg-message-bot";

    const status =
      reminder.status === "snoozed"
        ? "Отложено"
        : "Активно";

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
        "Созданное напоминание сохраняется в активном списке."
      );
    }

    showReplyKeyboard([
      {
        label: "🔔 Проверить",
        action: testReminder
      },
      {
        label: "↗ Передать другому",
        action: openShare
      },
      {
        label: "✅ Выполнено",
        action: markDone
      },
      {
        label: "⏰ Отложить",
        action: showSnoozeOptions
      }
    ]);

    scrollChat();
  }

  function openShare() {
    if (!reminder.text) {
      createMessage(
        "Сначала создайте напоминание."
      );

      return;
    }

    shareReminderText.textContent =
      reminder.text;

    shareModal.hidden = false;

    setGuide(
      7,
      "Выберите контакт, которому хотите передать напоминание."
    );
  }

  function closeShare() {
    shareModal.hidden = true;
  }

  function completeShare(contactName) {
    closeShare();

    createMessage(
      `↗ Напоминание передано: ${contactName}`
    );

    completeGuide(
      `Напоминание передано контакту «${contactName}».`
    );

    showReplyKeyboard([
      {
        label: "🔔 Проверить напоминание",
        action: testReminder
      },
      {
        label: "➕ Создать новое",
        action: startNewReminder
      }
    ]);
  }

  function showHelp() {
    createMessage(
      "Я могу создавать напоминания на быстрый или точный срок, повторять их до выполнения, откладывать, показывать активный список и передавать задачи другим людям."
    );
  }

  function showDelete() {
    if (!reminder.created) {
      createMessage(
        "Активных напоминаний для удаления нет."
      );

      return;
    }

    createMessage(
      `Удалить напоминание «${reminder.text}»?`
    );

    showReplyKeyboard([
      {
        label: "Да, удалить",
        action: () => {
          reminder.created = false;
          reminder.status = "deleted";

          hideReplyKeyboard();

          createMessage(
            "🗑 Напоминание удалено."
          );

          setMainMenuEnabled(true);
        }
      },
      {
        label: "Отмена",
        action: () => {
          hideReplyKeyboard();

          createMessage(
            "Удаление отменено."
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
      "Нажмите «Добавить», чтобы создать первое напоминание."
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
