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
    return new Date().toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit"
    });
  }

  function formatDateTime(date) {
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "2-digit",
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

    createMessage("➕ Add", "user");

    setGuide(
      2,
      "Type your reminder in the Message field."
    );

    setMainMenuEnabled(false);

    setTimeout(() => {
      createMessage(
        "What would you like me to remind you about?"
      );

      enableComposer(
        "For example: call the client"
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
      createMessage("When should I remind you?");
      showTimeOptions();
    }, 300);
  }

  function showTimeOptions() {
    setGuide(
      3,
      "Choose a quick option or set an exact date and time."
    );

    showReplyKeyboard([
      {
        label: "5 min",
        action: () =>
          chooseRelativeTime(5, "in 5 minutes")
      },
      {
        label: "10 min",
        action: () =>
          chooseRelativeTime(10, "in 10 minutes")
      },
      {
        label: "30 min",
        action: () =>
          chooseRelativeTime(30, "in 30 minutes")
      },
      {
        label: "1 hour",
        action: () =>
          chooseRelativeTime(60, "in 1 hour")
      },
      {
        label: "Tonight",
        action: chooseTonight
      },
      {
        label: "Tomorrow morning",
        action: chooseTomorrowMorning
      },
      {
        label: "Tomorrow at...",
        action: showTomorrowTimePicker
      },
      {
        label: "📅 Choose date & time",
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
      `tonight · ${formatDateTime(date)}`
    );
  }

  function chooseTomorrowMorning() {
    const date = new Date();

    date.setDate(date.getDate() + 1);
    date.setHours(8, 0, 0, 0);

    setChosenTime(
      date,
      `tomorrow morning · ${formatDateTime(date)}`
    );
  }

  function showTomorrowTimePicker() {
    hideReplyKeyboard();

    createMessage("Tomorrow at...", "user");

    setGuide(
      3,
      "Choose an exact time for tomorrow."
    );

    replyKeyboard.hidden = false;

    const picker = document.createElement("div");
    picker.className = "tg-date-picker";

    picker.innerHTML = `
      <span>Tomorrow</span>
      <input
        type="time"
        class="tg-picker-time"
        value="10:00"
      >
      <button
        type="button"
        class="tg-picker-confirm tg-next-action"
      >
        Confirm
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
        `tomorrow at ${time}`
      );
    });
  }

  function showCustomDateTimePicker() {
    hideReplyKeyboard();

    createMessage("📅 Choose date & time", "user");

    setGuide(
      3,
      "Choose any date and exact time."
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
        Confirm
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
      createMessage("How should I remind you?");
      showModeOptions();
    }, 300);
  }

  function showModeOptions() {
    setGuide(
      4,
      "Choose whether the bot should remind you once or keep reminding you until the task is completed."
    );

    showReplyKeyboard([
      {
        label: "Once",
        action: () =>
          chooseMode("Once")
      },
      {
        label: "Repeat until done",
        action: () =>
          chooseMode("Repeat until done")
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
      `✅ Reminder created.\n\n${reminder.text}\n\n⏰ ${reminder.timeLabel}\n🔁 ${reminder.mode}`
    );

    setGuide(
      5,
      "Your reminder is ready. Now test what happens when it fires."
    );

    showCreatedActions();
  }

  function showCreatedActions() {
    showReplyKeyboard([
      {
        label: "🔔 Test reminder",
        action: testReminder
      },
      {
        label: "📋 List",
        action: () => showReminderList(true)
      },
      {
        label: "↗ Pass to someone",
        action: openShare
      },
      {
        label: "➕ Create another",
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
      "The bot is now simulating a real reminder notification."
    );

    createMessage(
      "🔔 Test reminder",
      "user"
    );

    setTimeout(() => {
      playReminderSignal();

      createMessage(
        `⏰ Reminder!\n\n${reminder.text}\n\nCome on — time to get it done 🙂`
      );

      showReminderActions();
    }, 650);
  }

  function showReminderActions() {
    showReplyKeyboard([
      {
        label: "✅ Done",
        action: markDone
      },
      {
        label: "⏰ Snooze",
        action: showSnoozeOptions
      },
      {
        label: "↗ Pass to someone",
        action: openShare
      }
    ]);
  }

  function showSnoozeOptions() {
    hideReplyKeyboard();

    createMessage(
      "⏰ Snooze",
      "user"
    );

    setTimeout(() => {
      createMessage(
        "Sure. When should I remind you again?"
      );

      showReplyKeyboard([
        {
          label: "1 min",
          action: () =>
            applySnooze(1)
        },
        {
          label: "10 min",
          action: () =>
            applySnooze(10)
        },
        {
          label: "30 min",
          action: () =>
            applySnooze(30)
        },
        {
          label: "1 hour",
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
        ? "1 hour"
        : `${minutes} min`;

    createMessage(label, "user");

    const date =
      new Date(Date.now() + minutes * 60000);

    reminder.scheduledAt = date;
    reminder.timeLabel =
      `in ${label}`;

    reminder.snoozed = true;
    reminder.status = "snoozed";

    setTimeout(() => {
      createMessage(
        `👌 Got it. I’ll remind you again in ${label}.\n\nNext reminder: ${formatDateTime(date)}`
      );

      showReplyKeyboard([
        {
          label: "🔔 Test again",
          action: testReminder
        },
        {
          label: "📋 List",
          action: () =>
            showReminderList(false)
        }
      ]);
    }, 300);
  }

  function markDone() {
    hideReplyKeyboard();

    createMessage("✅ Done", "user");

    reminder.status = "done";
    reminder.created = false;

    setTimeout(() => {
      createMessage(
        `✅ Done!\n\n“${reminder.text}” has been marked as completed. I won’t remind you about it again.`
      );

      completeGuide(
        "Full cycle completed: the task was created, the reminder fired and the task was completed."
      );

      showReplyKeyboard([
        {
          label: "➕ Create a new reminder",
          action: startNewReminder
        }
      ]);

      setMainMenuEnabled(true);
    }, 300);
  }

  function showReminderList(fromFlow = false) {
    if (!reminder.created) {
      createMessage(
        "You do not have any active reminders yet."
      );

      return;
    }

    hideReplyKeyboard();

    createMessage(
      "📋 Your active reminders:"
    );

    const card =
      document.createElement("div");

    card.className =
      "tg-message tg-message-bot";

    const status =
      reminder.status === "snoozed"
        ? "Snoozed"
        : "Active";

    card.innerHTML = `
      <div class="tg-message-text">
        <strong>#1</strong><br>
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
        "The reminder is stored in your active list."
      );
    }

    showReplyKeyboard([
      {
        label: "🔔 Test",
        action: testReminder
      },
      {
        label: "↗ Pass to someone",
        action: openShare
      },
      {
        label: "✅ Done",
        action: markDone
      },
      {
        label: "⏰ Snooze",
        action: showSnoozeOptions
      }
    ]);

    scrollChat();
  }

  function openShare() {
    if (!reminder.text) {
      createMessage(
        "Create a reminder first."
      );

      return;
    }

    shareReminderText.textContent =
      reminder.text;

    shareModal.hidden = false;

    setGuide(
      7,
      "Choose who you want to pass this reminder to."
    );
  }

  function closeShare() {
    shareModal.hidden = true;
  }

  function completeShare(contactName) {
    closeShare();

    createMessage(
      `↗ Reminder passed to: ${contactName}`
    );

    completeGuide(
      `The reminder has been passed to “${contactName}”.`
    );

    showReplyKeyboard([
      {
        label: "🔔 Test reminder",
        action: testReminder
      },
      {
        label: "➕ Create a new reminder",
        action: startNewReminder
      }
    ]);
  }

  function showHelp() {
    createMessage(
      "I can create reminders for a quick or exact time, repeat them until completion, snooze them, show your active list and pass tasks to other people."
    );
  }

  function showDelete() {
    if (!reminder.created) {
      createMessage(
        "There are no active reminders to delete."
      );

      return;
    }

    createMessage(
      `Delete the reminder “${reminder.text}”?`
    );

    showReplyKeyboard([
      {
        label: "Yes, delete",
        action: () => {
          reminder.created = false;
          reminder.status = "deleted";

          hideReplyKeyboard();

          createMessage(
            "🗑 Reminder deleted."
          );

          setMainMenuEnabled(true);
        }
      },
      {
        label: "Cancel",
        action: () => {
          hideReplyKeyboard();

          createMessage(
            "Deletion cancelled."
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
      "Tap “Add” to create your first reminder."
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
