const HOME_LANG =
  document.documentElement.lang === 'en'
    ? 'en'
    : document.documentElement.lang === 'ru'
      ? 'ru'
      : 'uk';

const HOME_PART_SUFFIX =
  HOME_LANG === 'uk'
    ? ''
    : `-${HOME_LANG}`;

const HOME_PARTS = [
  {
    slot: 'home-reviews-slot',
    url:
      '/home/parts/reviews' +
      HOME_PART_SUFFIX +
      '.html'
  },
  {
    slot: 'home-contact-slot',
    url:
      '/home/parts/contact' +
      HOME_PART_SUFFIX +
      '.html'
  },
  {
    slot: 'home-solution-picker-slot',
    url:
      '/home/parts/solution-picker' +
      HOME_PART_SUFFIX +
      '.html'
  }
];

const HOME_BACKGROUND_IMAGES = [
  '/home/assets/air1.webp',
  '/home/assets/air2.webp',
  '/home/assets/air3.webp',
  '/home/assets/air4.webp',
  '/home/assets/air5.webp'
];

const REVIEWS_API_URL =
  'https://script.google.com/macros/s/AKfycbwQ4rbjx6uIXv9PJ-EpbriFkhMTWVT2urzz0Tgv6sPRuwKRboFjlT3-D2bGAcjL2vs/exec';

let reviewsLoaded = false;

let selectedSolutionCategory = '';
let selectedSolutionTask = '';
let selectedSolutionTools = '';
let selectedSolutionStepId = '';

const solutionResultPhrasesByLang = {
  uk: [
    'Так, це можна автоматизувати.',
    'Так, ручну роботу тут можна суттєво скоротити.',
    'Для цього можна побудувати автоматичний процес.',
    'Схоже на задачу, яку має сенс автоматизувати.',
    'Це хороший кандидат для автоматизації.',
    'Тут можна обійтися без значної частини ручної роботи.',
    'Це саме той тип задач, який зазвичай автоматизують.',
    'Тут можна зробити робочий процес значно простішим.',
    'Схоже, цю рутину можна перекласти на автоматизацію.',
    'Так, тут точно є що автоматизувати.'
  ],

  en: [
    'Yes, this can be automated.',
    'Yes, the manual work here can be reduced significantly.',
    'This can be turned into an automated process.',
    'This looks like a task worth automating.',
    'This is a good candidate for automation.',
    'A large part of the manual work can be removed here.',
    'This is exactly the kind of task that is usually automated.',
    'This workflow can be made much simpler.',
    'It looks like this routine can be handed over to automation.',
    'Yes, there is definitely something to automate here.'
  ],

  ru: [
    'Да, это можно автоматизировать.',
    'Да, здесь ручную работу можно существенно сократить.',
    'Для этого можно построить автоматический процесс.',
    'Похоже на задачу, которую имеет смысл автоматизировать.',
    'Это хороший кандидат для автоматизации.',
    'Здесь можно обойтись без значительной части ручной работы.',
    'Это как раз тот тип задач, который обычно автоматизируют.',
    'Здесь можно сделать рабочий процесс значительно проще.',
    'Похоже, эту рутину можно переложить на автоматизацию.',
    'Да, здесь точно есть что автоматизировать.'
  ]
};

const otherSolutionPhrasesByLang = {
  uk: [
    'Гаразд. Не всі задачі вкладаються в готові категорії 🙂',
    'Без проблем. Опишіть задачу своїми словами.',
    'Добре. Тут краще просто розібратися в самій задачі.',
    'Зрозуміло. Без категорій — просто опишіть, що потрібно.',
    'Гаразд, нестандартні задачі часто найцікавіші.',
    'Добре. Розкажіть, що зараз доводиться робити вручну.',
    'Схоже, тут потрібен індивідуальний сценарій.',
    'Домовились. Опишіть процес так, як він працює зараз.'
  ],

  en: [
    'Okay. Not every task fits neatly into a predefined category 🙂',
    'No problem. Describe the task in your own words.',
    'All right. In this case, it is better to look at the task itself.',
    'Got it. No categories — just describe what you need.',
    'Okay, unusual tasks are often the most interesting ones.',
    'All right. Tell me what you currently have to do manually.',
    'It looks like this needs a custom approach.',
    'Sounds good. Describe the process as it works today.'
  ],

  ru: [
    'Окей. Не все задачи укладываются в готовые категории 🙂',
    'Без проблем. Опишите задачу своими словами.',
    'Хорошо. Здесь лучше просто разобраться в самой задаче.',
    'Понятно. Давайте без категорий — просто опишите, что нужно.',
    'Окей, нестандартные задачи как раз самые интересные.',
    'Хорошо. Расскажите, что сейчас приходится делать вручную.',
    'Похоже, здесь нужен индивидуальный сценарий.',
    'Договорились. Опишите процесс так, как он работает сейчас.'
  ]
};

const solutionResultPhrases =
  solutionResultPhrasesByLang[HOME_LANG] ||
  solutionResultPhrasesByLang.uk;

const otherSolutionPhrases =
  otherSolutionPhrasesByLang[HOME_LANG] ||
  otherSolutionPhrasesByLang.uk;

function initHomeBackground() {
  if (!document.body) {
    return;
  }

  const firstBackground = new Image();
firstBackground.src = HOME_BACKGROUND_IMAGES[0];

const secondBackground = new Image();
secondBackground.src = HOME_BACKGROUND_IMAGES[1];

const preloadRest = () => {
  HOME_BACKGROUND_IMAGES
    .slice(2)
    .forEach(src => {
      const image = new Image();
      image.src = src;
    });
};

if ('requestIdleCallback' in window) {
  requestIdleCallback(preloadRest);
} else {
  setTimeout(preloadRest, 1800);
}

  const reducedMotion =
    window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches;

  const mobile =
    window.matchMedia(
      '(max-width: 768px)'
    ).matches;

  let currentIndex = 0;
  let showingLayerB = false;

  let targetX = 0;
  let targetY = 0;

  let currentX = 0;
  let currentY = 0;
  let backgroundScale = 1.035;
  let scaleDirection = 1;

  document.body.style.setProperty(
    '--home-bg-a',
    `url("${HOME_BACKGROUND_IMAGES[0]}")`
  );

  document.body.style.setProperty(
    '--home-bg-b',
    `url("${HOME_BACKGROUND_IMAGES[1]}")`
  );

  function showNextBackground() {
    const nextIndex =
      (currentIndex + 1) %
      HOME_BACKGROUND_IMAGES.length;

    if (showingLayerB) {
      document.body.style.setProperty(
        '--home-bg-a',
        `url("${HOME_BACKGROUND_IMAGES[nextIndex]}")`
      );

      document.body.classList.remove(
        'home-bg-show-b'
      );
    } else {
      document.body.style.setProperty(
        '--home-bg-b',
        `url("${HOME_BACKGROUND_IMAGES[nextIndex]}")`
      );

      document.body.classList.add(
        'home-bg-show-b'
      );
    }

    showingLayerB = !showingLayerB;
    currentIndex = nextIndex;
  }

  window.setInterval(
    showNextBackground,
    reducedMotion ? 18000 : 14000
  );

  if (mobile || reducedMotion) {
    return;
  }

  function animateParallax() {
    currentX +=
      (targetX - currentX) * 0.065;

    currentY +=
      (targetY - currentY) * 0.065;

    document.body.style.setProperty(
      '--home-bg-x',
      `${currentX.toFixed(2)}px`
    );

    document.body.style.setProperty(
      '--home-bg-y',
      `${currentY.toFixed(2)}px`
    );

    backgroundScale +=
  0.000006 * scaleDirection;

if (backgroundScale >= 1.055) {
  scaleDirection = -1;
}

if (backgroundScale <= 1.035) {
  scaleDirection = 1;
}

document.body.style.setProperty(
  '--home-bg-scale',
  backgroundScale.toFixed(4)
);
    window.requestAnimationFrame(
      animateParallax
    );
  }

  window.addEventListener(
    'mousemove',
    event => {
      const normalizedX =
        event.clientX /
        window.innerWidth -
        0.5;

      const normalizedY =
        event.clientY /
        window.innerHeight -
        0.5;

      targetX =
        normalizedX * -18;

      targetY =
        normalizedY * -14;
    },
    {
      passive: true
    }
  );

  document.documentElement.addEventListener(
    'mouseleave',
    () => {
      targetX = 0;
      targetY = 0;
    }
  );

  window.requestAnimationFrame(
    animateParallax
  );
}

async function loadHomePart(
  slotId,
  url
) {
  const slot =
    document.getElementById(slotId);

  if (!slot) {
    return;
  }

  const response =
    await fetch(url);

  if (!response.ok) {
    throw new Error(
      `Не вдалося завантажити ${url}`
    );
  }

  slot.innerHTML =
    await response.text();
}

async function loadHomeParts() {
  try {
    await Promise.all(
      HOME_PARTS.map(
        part =>
          loadHomePart(
            part.slot,
            part.url
          )
      )
    );

    renderHomeTurnstile();
  } catch (error) {
    console.error(
      'HOME PARTS ERROR:',
      error
    );
  }
}

function renderHomeTurnstile() {
  if (!window.turnstile) {
    setTimeout(
      renderHomeTurnstile,
      250
    );

    return;
  }

  document
    .querySelectorAll(
      '.cf-turnstile'
    )
    .forEach(element => {
      if (
        element.dataset.rendered ===
        'true'
      ) {
        return;
      }

      window.turnstile.render(
        element,
        {
          sitekey:
            element.dataset.sitekey
        }
      );

      element.dataset.rendered =
        'true';
    });
}

function initCarousel() {
  const carousel =
    document.getElementById('carousel');

  const hint =
    document.getElementById('hint');

  if (!carousel || !hint) {
    return;
  }

  const images =
    Array.from(
      carousel.querySelectorAll('img')
    );

  const reducedMotion =
    window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches;

  let isDragging = false;
  let startX = 0;

  let rotation = 0;
  let lastTime = performance.now();

  const rotationSpeed =
    360 / 80000;

  carousel.style.animation = 'none';

  const descriptionsByLang = {
  uk: {
    Excel: 'Автоматизація Excel',
    'Power BI': 'Візуалізація через Power BI',
    'Google Sheets': 'Скрипти в Google Таблицях',
    JavaScript: 'Автоматизація через JavaScript',
    VBA: 'Макроси та коди VBA',
    'Power Query': 'Імпорт та трансформації',
    'Power Pivot': 'DAX-аналіз у Power Pivot',
    'Telegram Bot': 'Telegram-боти та сповіщення',
    'Google Drive': 'Автоматизація Google Drive',
    'Web App': 'Вебзастосунки та PWA'
  },

  en: {
    Excel: 'Excel automation',
    'Power BI': 'Visualization with Power BI',
    'Google Sheets': 'Scripts in Google Sheets',
    JavaScript: 'Automation with JavaScript',
    VBA: 'VBA macros and code',
    'Power Query': 'Import and data transformations',
    'Power Pivot': 'DAX analysis in Power Pivot',
    'Telegram Bot': 'Telegram bots and notifications',
    'Google Drive': 'Google Drive automation',
    'Web App': 'Web apps and PWA'
  },

  ru: {
    Excel: 'Автоматизация Excel',
    'Power BI': 'Визуализация через Power BI',
    'Google Sheets': 'Скрипты в Google Таблицах',
    JavaScript: 'Автоматизация через JavaScript',
    VBA: 'Макросы и код VBA',
    'Power Query': 'Импорт и преобразование данных',
    'Power Pivot': 'DAX-анализ в Power Pivot',
    'Telegram Bot': 'Telegram-боты и уведомления',
    'Google Drive': 'Автоматизация Google Drive',
    'Web App': 'Веб-приложения и PWA'
  }
};

const descriptions =
  descriptionsByLang[HOME_LANG] ||
  descriptionsByLang.uk;

  function updateDepth() {
    images.forEach(
      (img, index) => {
        const angle =
          rotation +
          index * 36;

        const radians =
          angle *
          Math.PI /
          180;

        const depth =
          (
            Math.cos(radians) +
            1
          ) / 2;

        const scale =
          0.76 +
          depth * 0.34;

        const opacity =
          0.38 +
          depth * 0.62;

        const brightness =
          0.72 +
          depth * 0.36;

        const saturation =
          0.72 +
          depth * 0.38;

        const blur =
          (1 - depth) * 0.7;

        const shadow =
          6 +
          depth * 18;

        img.style.scale =
          scale.toFixed(3);

        img.style.opacity =
          opacity.toFixed(3);

        img.style.zIndex =
          String(
            Math.round(
              depth * 100
            )
          );

        img.style.filter =
          `
            brightness(${brightness.toFixed(3)})
            saturate(${saturation.toFixed(3)})
            blur(${blur.toFixed(2)}px)
            drop-shadow(
              0
              ${shadow.toFixed(1)}px
              ${(shadow * 1.5).toFixed(1)}px
              rgba(0, 0, 0, ${(
                0.08 +
                depth * 0.14
              ).toFixed(3)})
            )
          `;
      }
    );
  }

  function animate(time) {
    const delta =
      time - lastTime;

    lastTime = time;

    if (
      !isDragging &&
      !reducedMotion
    ) {
      rotation +=
        delta *
        rotationSpeed;
    }

    rotation %= 360;

    carousel.style.transform =
      `rotateY(${rotation}deg)`;

    updateDepth();

    window.requestAnimationFrame(
      animate
    );
  }

  carousel.parentElement.addEventListener(
    'mousedown',
    event => {
      isDragging = true;
      startX = event.clientX;
    }
  );

  document.addEventListener(
    'mousemove',
    event => {
      if (!isDragging) {
        return;
      }

      const delta =
        event.clientX -
        startX;

      rotation +=
        delta * 0.22;

      startX =
        event.clientX;
    }
  );

  document.addEventListener(
    'mouseup',
    () => {
      isDragging = false;
    }
  );

  carousel.parentElement.addEventListener(
    'touchstart',
    event => {
      if (
        !event.touches.length
      ) {
        return;
      }

      isDragging = true;

      startX =
        event.touches[0].clientX;
    },
    {
      passive: true
    }
  );

  carousel.parentElement.addEventListener(
    'touchmove',
    event => {
      if (
        !isDragging ||
        !event.touches.length
      ) {
        return;
      }

      const currentX =
        event.touches[0].clientX;

      const delta =
        currentX -
        startX;

      rotation +=
        delta * 0.18;

      startX =
        currentX;
    },
    {
      passive: true
    }
  );

  carousel.parentElement.addEventListener(
    'touchend',
    () => {
      isDragging = false;
    }
  );

  images.forEach(
    img => {
      img.addEventListener(
        'mouseenter',
        () => {
          hint.textContent =
            descriptions[
              img.alt
            ] || '';

          hint.style.display =
            'block';
        }
      );

      img.addEventListener(
        'mouseleave',
        () => {
          hint.style.display =
            'none';
        }
      );
    }
  );

  updateDepth();

  window.requestAnimationFrame(
    animate
  );
}

function openContactModal() {
  const modal =
    document.getElementById(
      'contact-modal'
    );

  if (!modal) {
    return;
  }

  modal.classList.add(
    'show'
  );

  setTimeout(
    () => {
      const input =
        document.getElementById(
          'contact-name'
        );

      if (input) {
        input.focus();
      }
    },
    50
  );
}

function closeContactModal() {
  const modal =
    document.getElementById(
      'contact-modal'
    );

  const status =
    document.getElementById(
      'contact-status'
    );

  if (modal) {
    modal.classList.remove(
      'show'
    );
  }

  if (status) {
    status.textContent = '';
  }
}

function handleOverlayClick(
  event
) {
  if (
    event.target.id ===
    'contact-modal'
  ) {
    closeContactModal();
  }
}

function selectContactMethod(
  type,
  button
) {
  const input =
    document.getElementById(
      'contact-method'
    );

  const hiddenType =
    document.getElementById(
      'contact-method-type'
    );

  if (
    !input ||
    !hiddenType
  ) {
    return;
  }

  document
    .querySelectorAll(
      '.contact-method-btn'
    )
    .forEach(btn => {
      btn.classList.remove(
        'active'
      );
    });

  button.classList.add(
    'active'
  );

  hiddenType.value = type;

  input.disabled = false;
  input.value = '';

  if (type === 'email') {
    input.type = 'email';
    input.placeholder =
      'name@example.com';
  }

  if (type === 'phone') {
    input.type = 'tel';
    input.placeholder =
      '+380...';
  }

  if (type === 'telegram') {
    input.type = 'text';
    input.placeholder =
      '@username';
  }

  input.focus();
}

const HOME_CONTACT_TEXTS = {
  uk: {
    fillAll: 'Заповніть усі поля.',
    robot: 'Підтвердьте, що ви не робот.',
    sending: 'Надсилаємо...',
    sent: '✓ Повідомлення надіслано',
    send: 'Надіслати',
    failed: 'Не вдалося надіслати. Спробуйте ще раз.',
    tooLong: 'Повідомлення занадто велике. Максимальний розмір — 5000 символів.',
    securityFailed: 'Перевірка захисту завершилася помилкою. Оновіть сторінку та спробуйте ще раз.',
    waitMinute: 'Повторне повідомлення можна надіслати через 1 хвилину.',
    required: 'Заповніть усі обов’язкові поля.'
  },

  en: {
    fillAll: 'Please complete all fields.',
    robot: 'Please confirm that you are not a robot.',
    sending: 'Sending...',
    sent: '✓ Message sent',
    send: 'Send',
    failed: 'Could not send. Please try again.',
    tooLong: 'The message is too long. The maximum length is 5000 characters.',
    securityFailed: 'The security check failed. Refresh the page and try again.',
    waitMinute: 'You can send another message in 1 minute.',
    required: 'Please complete all required fields.'
  },

  ru: {
    fillAll: 'Заполните все поля.',
    robot: 'Подтвердите, что вы не робот.',
    sending: 'Отправляем...',
    sent: '✓ Сообщение отправлено',
    send: 'Отправить',
    failed: 'Не удалось отправить. Попробуйте ещё раз.',
    tooLong: 'Сообщение слишком большое. Максимальный размер — 5000 символов.',
    securityFailed: 'Проверка защиты завершилась ошибкой. Обновите страницу и попробуйте ещё раз.',
    waitMinute: 'Повторное сообщение можно отправить через 1 минуту.',
    required: 'Заполните все обязательные поля.'
  }
};

const HOME_CONTACT_TEXT =
  HOME_CONTACT_TEXTS[HOME_LANG] ||
  HOME_CONTACT_TEXTS.uk;

async function testContactForm() {
  const name =
    document
      .getElementById(
        'contact-name'
      )
      ?.value.trim() || '';

  const contact =
    document
      .getElementById(
        'contact-method'
      )
      ?.value.trim() || '';

  const message =
    document
      .getElementById(
        'contact-message'
      )
      ?.value.trim() || '';

  const status =
    document.getElementById(
      'contact-status'
    );

  const button =
    document.querySelector(
      '.contact-send-btn'
    );

  const turnstileToken =
    document.querySelector(
      '#contact-modal [name="cf-turnstile-response"]'
    )?.value || '';

  if (
    !status ||
    !button
  ) {
    return;
  }

  if (
    !name ||
    !contact ||
    !message
  ) {
    status.textContent =
      HOME_CONTACT_TEXT.fillAll;

    status.style.color =
      '#cc0000';

    return;
  }

  if (!turnstileToken) {
    status.textContent =
      HOME_CONTACT_TEXT.robot;

    status.style.color =
      '#cc0000';

    return;
  }

  status.textContent =
    HOME_CONTACT_TEXT.sending;

  status.style.color =
    '#555';

  button.disabled = true;

  button.textContent =
    HOME_CONTACT_TEXT.sending;

  try {
    const response =
      await fetch(
        REVIEWS_API_URL,
        {
          method: 'POST',

          headers: {
            'Content-Type':
              'text/plain;charset=utf-8'
          },

          body:
            JSON.stringify({
              user_name:
                name,

              user_email:
                contact,

              message:
                message,

              turnstileToken:
                turnstileToken
            })
        }
      );

    const result =
      await response.json();

    if (!result.ok) {
      throw new Error(
        result.error ||
        HOME_CONTACT_TEXT.failed
      );
    }

    status.textContent =
      HOME_CONTACT_TEXT.sent;

    status.style.color =
      '#0F9D58';

    document.getElementById(
      'contact-name'
    ).value = '';

    document.getElementById(
      'contact-method'
    ).value = '';

    document.getElementById(
      'contact-message'
    ).value = '';

    if (window.turnstile) {
      const widget =
        document.querySelector(
          '#contact-modal .cf-turnstile'
        );

      if (widget) {
        window.turnstile.reset(
          widget
        );
      }
    }

    setTimeout(
      () => {
        closeContactModal();
      },
      1300
    );
  } catch (error) {
    console.error(
      error
    );

    let errorMessage =
      error.message ||
      HOME_CONTACT_TEXT.failed;

    if (
      errorMessage.includes(
        'Превышен допустимый размер данных'
      )
    ) {
      errorMessage =
        HOME_CONTACT_TEXT.tooLong;
    }

    if (
      errorMessage.includes(
        'Проверка защиты от роботов не пройдена'
      )
    ) {
      errorMessage =
        HOME_CONTACT_TEXT.securityFailed;
    }

    if (
      errorMessage.includes(
        'Повторное сообщение можно отправить через 1 минуту'
      )
    ) {
      errorMessage =
        HOME_CONTACT_TEXT.waitMinute;
    }

    if (
      errorMessage.includes(
        'Не заполнены обязательные поля сайта'
      )
    ) {
      errorMessage =
        HOME_CONTACT_TEXT.required;
    }

    status.textContent =
      errorMessage;

    status.style.color =
      '#cc0000';
  } finally {
    button.disabled = false;

    button.textContent =
      HOME_CONTACT_TEXT.send;
  }
}

function openReviewsPanel() {
  const panel =
    document.getElementById(
      'reviews-panel'
    );

  if (!panel) {
    return;
  }

  panel.classList.add(
    'show'
  );

  if (!reviewsLoaded) {
    loadPublishedReviews();
  }
}

function closeReviewsPanel() {
  const panel =
    document.getElementById(
      'reviews-panel'
    );

  if (panel) {
    panel.classList.remove(
      'show'
    );
  }
}

const HOME_REVIEWS_TEXTS = {
  uk: {
    loading: 'Завантажуємо відгуки...',
    button: '⭐ Відгуки',
    pinned: '📌 Закріплено',
    client: 'Клієнт',
    loadError: 'Не вдалося завантажити відгуки.'
  },

  en: {
    loading: 'Loading reviews...',
    button: '⭐ Reviews',
    pinned: '📌 Pinned',
    client: 'Client',
    loadError: 'Could not load reviews.'
  },

  ru: {
    loading: 'Загружаем отзывы...',
    button: '⭐ Отзывы',
    pinned: '📌 Закреплено',
    client: 'Клиент',
    loadError: 'Не удалось загрузить отзывы.'
  }
};

const HOME_REVIEWS_TEXT =
  HOME_REVIEWS_TEXTS[HOME_LANG] ||
  HOME_REVIEWS_TEXTS.uk;

async function loadPublishedReviews() {
  const list =
    document.getElementById(
      'reviews-panel-list'
    );

  if (!list) {
    return;
  }

  list.innerHTML =
    `<div class="reviews-panel-loading">${HOME_REVIEWS_TEXT.loading}</div>`;

  try {
    const response =
      await fetch(
        REVIEWS_API_URL +
        '?action=getReviews'
      );

    const data =
      await response.json();

    if (
      !data.ok ||
      !Array.isArray(
        data.reviews
      )
    ) {
      throw new Error(
        'Invalid reviews API response'
      );
    }

    const reviewsButton =
      document.getElementById(
        'reviews-float-btn'
      );

    if (reviewsButton) {
      reviewsButton.textContent =
        HOME_REVIEWS_TEXT.button +
        ' · ' +
        data.reviews.length;
    }

    list.innerHTML =
      data.reviews
        .map(review => {
          const rating =
            Math.max(
              1,
              Math.min(
                5,
                Number(
                  review.rating
                ) || 5
              )
            );

          const pinned =
            review.pinned
              ? `
                <div class="review-pinned">
                  ${HOME_REVIEWS_TEXT.pinned}
                </div>
              `
              : '';

          return `
            <div class="review-card">
              <div class="review-stars">
                ${'★'.repeat(rating)}${'☆'.repeat(5 - rating)}
              </div>

              ${pinned}

              <div class="review-text">
                ${escapeReviewHtml(review.review || '')}
              </div>

              <div class="review-meta">
                <div class="review-author">
                  — ${escapeReviewHtml(review.name || HOME_REVIEWS_TEXT.client)}
                </div>

                <div class="review-date">
                  ${escapeReviewHtml(review.published_at || '')}
                </div>
              </div>
            </div>
          `;
        })
        .join('');

    reviewsLoaded = true;
  } catch (error) {
    console.error(
      'REVIEWS ERROR:',
      error
    );

    list.innerHTML =
      `<div class="reviews-panel-loading">${HOME_REVIEWS_TEXT.loadError}</div>`;
  }
}

function escapeReviewHtml(
  value
) {
  return String(value)
    .replace(
      /&/g,
      '&amp;'
    )
    .replace(
      /</g,
      '&lt;'
    )
    .replace(
      />/g,
      '&gt;'
    )
    .replace(
      /"/g,
      '&quot;'
    )
    .replace(
      /'/g,
      '&#039;'
    );
}

function openReviewForm() {
  const overlay =
    document.getElementById(
      'review-form-overlay'
    );

  if (!overlay) {
    return;
  }

  overlay.classList.add(
    'show'
  );
}

function closeReviewForm() {
  const overlay =
    document.getElementById(
      'review-form-overlay'
    );

  if (overlay) {
    overlay.classList.remove(
      'show'
    );
  }
}

function selectReviewRating(
  rating
) {
  const value =
    document.getElementById(
      'review-rating-value'
    );

  if (!value) {
    return;
  }

  value.value = rating;

  document
    .querySelectorAll(
      '#review-rating button'
    )
    .forEach(
      (
        star,
        index
      ) => {
        star.classList.toggle(
          'active',
          index < rating
        );
      }
    );
}

const HOME_REVIEW_FORM_TEXTS = {
  uk: {
    empty: 'Напишіть текст відгуку.',
    rating: 'Оберіть оцінку від 1 до 5.',
    robot: 'Підтвердіть, що ви не робот.',
    sending: 'Надсилаємо...',
    sent: '✓ Відгук надіслано на модерацію',
    failed: 'Не вдалося надіслати відгук. Спробуйте ще раз.',
    tooLong: 'Відгук занадто великий. Максимальний розмір — 3000 символів.',
    security: 'Будь ласка, підтвердьте, що ви не робот.',
    emptyServer: 'Будь ласка, введіть текст відгуку.',
    send: 'Надіслати відгук',
    pageLang: 'UA'
  },

  en: {
    empty: 'Please write your review.',
    rating: 'Please select a rating from 1 to 5.',
    robot: 'Please confirm that you are not a robot.',
    sending: 'Sending...',
    sent: '✓ Review sent for moderation',
    failed: 'Could not send the review. Please try again.',
    tooLong: 'The review is too long. The maximum length is 3000 characters.',
    security: 'Please confirm that you are not a robot.',
    emptyServer: 'Please enter your review.',
    send: 'Submit review',
    pageLang: 'EN'
  },

  ru: {
    empty: 'Напишите текст отзыва.',
    rating: 'Выберите оценку от 1 до 5.',
    robot: 'Подтвердите, что вы не робот.',
    sending: 'Отправляем...',
    sent: '✓ Отзыв отправлен на модерацию',
    failed: 'Не удалось отправить отзыв. Попробуйте ещё раз.',
    tooLong: 'Отзыв слишком большой. Максимальный размер — 3000 символов.',
    security: 'Подтвердите, что вы не робот.',
    emptyServer: 'Введите текст отзыва.',
    send: 'Отправить отзыв',
    pageLang: 'RU'
  }
};

const HOME_REVIEW_FORM_TEXT =
  HOME_REVIEW_FORM_TEXTS[HOME_LANG] ||
  HOME_REVIEW_FORM_TEXTS.uk;

async function submitWebsiteReview() {
  const name =
    document
      .getElementById(
        'review-name'
      )
      ?.value.trim() || '';

  const rating =
    Number(
      document
        .getElementById(
          'review-rating-value'
        )
        ?.value || 0
    );

  const review =
    document
      .getElementById(
        'review-text-input'
      )
      ?.value.trim() || '';

  const turnstileToken =
    document.querySelector(
      '#review-form-overlay [name="cf-turnstile-response"]'
    )?.value || '';

  const status =
    document.getElementById(
      'review-form-status'
    );

  const button =
    document.querySelector(
      '.review-submit-btn'
    );

  if (
    !status ||
    !button
  ) {
    return;
  }

  if (!review) {
    status.textContent =
      HOME_REVIEW_FORM_TEXT.empty;

    status.style.color =
      '#cc0000';

    return;
  }

  if (
    rating < 1 ||
    rating > 5
  ) {
    status.textContent =
      HOME_REVIEW_FORM_TEXT.rating;

    status.style.color =
      '#cc0000';

    return;
  }

  if (!turnstileToken) {
    status.textContent =
      HOME_REVIEW_FORM_TEXT.robot;

    status.style.color =
      '#cc0000';

    return;
  }

  status.textContent =
    HOME_REVIEW_FORM_TEXT.sending;

  status.style.color =
    '#555';

  button.disabled = true;

  button.textContent =
    HOME_REVIEW_FORM_TEXT.sending;

  try {
    const response =
      await fetch(
        REVIEWS_API_URL,
        {
          method: 'POST',

          headers: {
            'Content-Type':
              'text/plain;charset=utf-8'
          },

          body:
            JSON.stringify({
              source: 'review',
              name: name,
              rating: rating,
              review: review,
              page_lang:
                HOME_REVIEW_FORM_TEXT.pageLang,
              turnstileToken:
                turnstileToken
            })
        }
      );

    const result =
      await response.json();

    if (!result.ok) {
      throw new Error(
        result.error ||
        HOME_REVIEW_FORM_TEXT.failed
      );
    }

    status.textContent =
      HOME_REVIEW_FORM_TEXT.sent;

    status.style.color =
      '#0F9D58';

    document.getElementById(
      'review-name'
    ).value = '';

    document.getElementById(
      'review-text-input'
    ).value = '';

    document.getElementById(
      'review-rating-value'
    ).value = '0';

    document
      .querySelectorAll(
        '#review-rating button'
      )
      .forEach(
        star => {
          star.classList.remove(
            'active'
          );
        }
      );

    if (window.turnstile) {
      const widget =
        document.querySelector(
          '#review-form-overlay .cf-turnstile'
        );

      if (widget) {
        window.turnstile.reset(
          widget
        );
      }
    }

    setTimeout(
      () => {
        closeReviewForm();
      },
      1400
    );
  } catch (error) {
    console.error(
      error
    );

    let errorMessage =
      error.message ||
      HOME_REVIEW_FORM_TEXT.failed;

    if (
      errorMessage.includes(
        'Превышен допустимый размер данных'
      )
    ) {
      errorMessage =
        HOME_REVIEW_FORM_TEXT.tooLong;
    }

    if (
      errorMessage.includes(
        'Проверка защиты от роботов не пройдена'
      )
    ) {
      errorMessage =
        HOME_REVIEW_FORM_TEXT.security;
    }

    if (
      errorMessage.includes(
        'Пустой отзыв'
      )
    ) {
      errorMessage =
        HOME_REVIEW_FORM_TEXT.emptyServer;
    }

    status.textContent =
      errorMessage;

    status.style.color =
      '#cc0000';
  } finally {
    button.disabled = false;

    button.textContent =
      HOME_REVIEW_FORM_TEXT.send;
  }
}
function openExcelStep() {
  openSolutionCategoryStep(
    'solution-excel-step'
  );
}

function openAnalyticsStep() {
  openSolutionCategoryStep(
    'solution-analytics-step'
  );
}

function openManualDataStep() {
  openSolutionCategoryStep(
    'solution-manual-data-step'
  );
}

function openTelegramStep() {
  openSolutionCategoryStep(
    'solution-telegram-step'
  );
}

function openPowerBiStep() {
  openSolutionCategoryStep(
    'solution-powerbi-step'
  );
}

function openSolutionCategoryStep(
  stepId
) {
  const startStep =
    document.getElementById(
      'solution-start-step'
    );

  const nextStep =
    document.getElementById(
      stepId
    );

  if (
    !startStep ||
    !nextStep
  ) {
    return;
  }

  startStep.classList.remove(
    'active'
  );

  nextStep.classList.add(
    'active'
  );

  setSolutionProgress(1);
}

function backToSolutionStart() {
  backToSolutionStartFrom(
    'solution-excel-step'
  );
}

function backToSolutionStartFromAnalytics() {
  backToSolutionStartFrom(
    'solution-analytics-step'
  );
}

function backToSolutionStartFromManualData() {
  backToSolutionStartFrom(
    'solution-manual-data-step'
  );
}

function backToSolutionStartFromTelegram() {
  backToSolutionStartFrom(
    'solution-telegram-step'
  );
}

function backToSolutionStartFromPowerBi() {
  backToSolutionStartFrom(
    'solution-powerbi-step'
  );
}

function backToSolutionStartFrom(
  stepId
) {
  const startStep =
    document.getElementById(
      'solution-start-step'
    );

  const currentStep =
    document.getElementById(
      stepId
    );

  if (
    !startStep ||
    !currentStep
  ) {
    return;
  }

  currentStep.classList.remove(
    'active'
  );

  startStep.classList.add(
    'active'
  );

  setSolutionProgress(0);
}

function setSolutionProgress(
  index
) {
  const progress =
    document.querySelectorAll(
      '.solution-picker-progress span'
    );

  progress.forEach(
    item => {
      item.classList.remove(
        'active'
      );
    }
  );

  if (
    progress[index]
  ) {
    progress[
      index
    ].classList.add(
      'active'
    );
  }
}

const HOME_SOLUTION_CATEGORIES = {
  uk: {
    excel: 'Excel / Google Sheets',
    analytics: 'Звіти та аналітика',
    manual: 'Ручна робота з даними',
    telegram: 'Telegram / сповіщення',
    powerbi: 'Power BI'
  },

  en: {
    excel: 'Excel / Google Sheets',
    analytics: 'Reports & analytics',
    manual: 'Manual data work',
    telegram: 'Telegram / notifications',
    powerbi: 'Power BI'
  },

  ru: {
    excel: 'Excel / Google Sheets',
    analytics: 'Отчёты и аналитика',
    manual: 'Ручная работа с данными',
    telegram: 'Telegram / уведомления',
    powerbi: 'Power BI'
  }
};

const HOME_SOLUTION_CATEGORY =
  HOME_SOLUTION_CATEGORIES[HOME_LANG] ||
  HOME_SOLUTION_CATEGORIES.uk;

function selectExcelTask(task) {
  selectSolutionTask(
    HOME_SOLUTION_CATEGORY.excel,
    task,
    'Excel / Power Query / VBA / Google Apps Script',
    'solution-excel-step'
  );
}

function selectAnalyticsTask(task) {
  selectSolutionTask(
    HOME_SOLUTION_CATEGORY.analytics,
    task,
    'Excel / Power Query / Power BI / Google Sheets',
    'solution-analytics-step'
  );
}

function selectManualDataTask(task) {
  selectSolutionTask(
    HOME_SOLUTION_CATEGORY.manual,
    task,
    'Excel / Power Query / VBA / Google Apps Script',
    'solution-manual-data-step'
  );
}

function selectTelegramTask(task) {
  selectSolutionTask(
    HOME_SOLUTION_CATEGORY.telegram,
    task,
    'Telegram Bot API / Google Apps Script / API / Webhooks',
    'solution-telegram-step'
  );
}

function selectPowerBiTask(task) {
  selectSolutionTask(
    HOME_SOLUTION_CATEGORY.powerbi,
    task,
    'Power BI / Power Query / DAX / Excel / Google Sheets',
    'solution-powerbi-step'
  );
}

const HOME_SOLUTION_PLACEHOLDERS = {
  uk:
    'Наприклад: щодня отримую файли від 12 менеджерів і вручну збираю їх в один звіт...',

  en:
    'For example: every day I receive files from 12 managers and manually combine them into one report...',

  ru:
    'Например: каждый день я получаю файлы от 12 менеджеров и вручную собираю их в один отчёт...'
};

const HOME_SOLUTION_PLACEHOLDER =
  HOME_SOLUTION_PLACEHOLDERS[HOME_LANG] ||
  HOME_SOLUTION_PLACEHOLDERS.uk;

function selectSolutionTask(
  category,
  task,
  tools,
  stepId
) {
  selectedSolutionCategory =
    category;

  selectedSolutionTask =
    task;

  selectedSolutionTools =
    tools;

  selectedSolutionStepId =
    stepId;

  const currentStep =
    document.getElementById(
      stepId
    );

  const resultStep =
    document.getElementById(
      'solution-result-step'
    );

  const selectedText =
    document.getElementById(
      'solution-selected-task-text'
    );

  const resultTitle =
    document.getElementById(
      'solution-result-title'
    );

  const toolsText =
    document.getElementById(
      'solution-result-tools-text'
    );

  const description =
    document.getElementById(
      'solution-description'
    );

  if (
    !currentStep ||
    !resultStep ||
    !selectedText ||
    !resultTitle ||
    !toolsText ||
    !description
  ) {
    return;
  }

  const randomPhrase =
    solutionResultPhrases[
      Math.floor(
        Math.random() *
        solutionResultPhrases.length
      )
    ];

  selectedText.textContent =
    task;

  resultTitle.textContent =
    randomPhrase;

  toolsText.textContent =
    tools;

  description.value = '';

  description.placeholder =
  HOME_SOLUTION_PLACEHOLDER;

  currentStep.classList.remove(
    'active'
  );

  resultStep.classList.add(
    'active'
  );

  setSolutionProgress(2);

  setTimeout(
    () => {
      description.focus();
    },
    100
  );
}

function openOtherSolution() {
  const texts = {
    uk: {
      category: 'Інше',
      task: 'Індивідуальна задача',
      tools: 'Підберемо після короткого опису задачі',
      placeholder:
        'Опишіть, що ви зараз робите вручну і який результат хотіли б отримувати автоматично...'
    },

    en: {
      category: 'Other',
      task: 'Custom task',
      tools: 'We’ll choose the right tools after a short description',
      placeholder:
        'Describe what you currently do manually and what result you would like to get automatically...'
    },

    ru: {
      category: 'Другое',
      task: 'Индивидуальная задача',
      tools: 'Подберём после короткого описания задачи',
      placeholder:
        'Опишите, что вы сейчас делаете вручную и какой результат хотели бы получать автоматически...'
    }
  };

  const text =
    texts[HOME_LANG] ||
    texts.uk;

  selectedSolutionCategory =
    text.category;

  selectedSolutionTask =
    text.task;

  selectedSolutionTools = '';

  selectedSolutionStepId =
    'solution-start-step';

  const startStep =
    document.getElementById(
      'solution-start-step'
    );

  const resultStep =
    document.getElementById(
      'solution-result-step'
    );

  const selectedText =
    document.getElementById(
      'solution-selected-task-text'
    );

  const resultTitle =
    document.getElementById(
      'solution-result-title'
    );

  const toolsText =
    document.getElementById(
      'solution-result-tools-text'
    );

  const description =
    document.getElementById(
      'solution-description'
    );

  const progress =
    document.querySelectorAll(
      '.solution-picker-progress span'
    );

  const randomPhrase =
    otherSolutionPhrases[
      Math.floor(
        Math.random() *
        otherSolutionPhrases.length
      )
    ];

  resultTitle.textContent =
    randomPhrase;

  selectedText.textContent =
    text.task;

  toolsText.textContent =
    text.tools;

  description.value = '';

  description.placeholder =
    text.placeholder;

  startStep.classList.remove(
    'active'
  );

  resultStep.classList.add(
    'active'
  );

  progress.forEach(item =>
    item.classList.remove('active')
  );

  if (progress[2]) {
    progress[2].classList.add(
      'active'
    );
  }

  setTimeout(() => {
    description.focus();
  }, 100);
}

function backToSelectedCategoryStep() {
  const resultStep =
    document.getElementById(
      'solution-result-step'
    );

  const previousStep =
    document.getElementById(
      selectedSolutionStepId
    );

  if (
    !resultStep ||
    !previousStep
  ) {
    return;
  }

  resultStep.classList.remove(
    'active'
  );

  previousStep.classList.add(
    'active'
  );

  if (
    selectedSolutionStepId ===
    'solution-start-step'
  ) {
    setSolutionProgress(0);
  } else {
    setSolutionProgress(1);
  }
}

function discussSelectedTask() {
  const texts = {
    uk: {
      category: 'Напрямок',
      task: 'Задача',
      description: 'Опис'
    },

    en: {
      category: 'Category',
      task: 'Task',
      description: 'Description'
    },

    ru: {
      category: 'Направление',
      task: 'Задача',
      description: 'Описание'
    }
  };

  const text =
    texts[HOME_LANG] ||
    texts.uk;

  const description =
    document
      .getElementById(
        'solution-description'
      )
      .value
      .trim();

  closeSolutionPicker();
  openContactModal();

  let message =
    text.category +
    ': ' +
    selectedSolutionCategory +
    '\n' +
    text.task +
    ': ' +
    selectedSolutionTask;

  if (description) {
    message +=
      '\n\n' +
      text.description +
      ':\n' +
      description;
  }

  document
    .getElementById(
      'contact-message'
    )
    .value =
    message;
}

function openHomeEstimator() {
  const trigger =
    document.querySelector(
      '.pricing-estimator-trigger'
    );

  if (!trigger) {
    return;
  }

  closeSolutionPicker();

  setTimeout(
    () => {
      trigger.click();
    },
    180
  );
}

function openSolutionPicker() {
  const picker =
    document.getElementById(
      'solution-picker'
    );

  if (picker) {
    picker.classList.add(
      'show'
    );
  }
}

function closeSolutionPicker() {
  const picker =
    document.getElementById(
      'solution-picker'
    );

  if (picker) {
    picker.classList.remove(
      'show'
    );
  }
}

function handleSolutionOverlayClick(
  event
) {
  if (
    event.target.id ===
    'solution-picker'
  ) {
    closeSolutionPicker();
  }
}

const WORKSPACE_PEEK_FRAMES = [
  {
    src: '/home/assets/workspace.webp',
    duration: 12000
  },
  {
    src: '/home/assets/2stood.webp',
    duration: 4500
  },
  {
    src: '/home/assets/3smoking.webp',
    duration: 9000
  },
  {
    src: '/home/assets/4pullups.webp',
    duration: 7000
  },
  {
    src: '/home/assets/5again_working.webp',
    duration: 14000
  }
];

let workspacePeekFrameIndex = 0;
let workspacePeekTimer = null;

function preloadWorkspacePeekFrames() {
  WORKSPACE_PEEK_FRAMES.forEach(frame => {
    const image = new Image();
    image.src = frame.src;
  });
}

function showWorkspacePeekFrame(index) {
  const overlay =
    document.getElementById(
      'workspace-peek'
    );

  if (!overlay) {
    return;
  }

  const image =
    overlay.querySelector(
      '.workspace-peek-image'
    );

  if (!image) {
    return;
  }

  image.classList.add(
    'is-switching'
  );

  window.setTimeout(
    () => {
      image.src =
        WORKSPACE_PEEK_FRAMES[index].src;

      workspacePeekFrameIndex =
        index;
          const progressDots =
          overlay.querySelectorAll(
            '.workspace-peek-progress span'
          );
        
        progressDots.forEach(
          (dot, dotIndex) => {
            dot.classList.toggle(
              'active',
              dotIndex === index
            );
          }
      );
    },
    260
  );

  window.setTimeout(
    () => {
      image.classList.remove(
        'is-switching'
      );
    },
    700
  );
}

function scheduleWorkspacePeekFrame() {
  window.clearTimeout(
    workspacePeekTimer
  );

  const currentFrame =
    WORKSPACE_PEEK_FRAMES[
      workspacePeekFrameIndex
    ];

  workspacePeekTimer =
    window.setTimeout(
      () => {
        let nextIndex =
          workspacePeekFrameIndex + 1;

        if (
          nextIndex >=
          WORKSPACE_PEEK_FRAMES.length
        ) {
          nextIndex = 0;
        }

        showWorkspacePeekFrame(
          nextIndex
        );

        workspacePeekTimer =
          window.setTimeout(
            scheduleWorkspacePeekFrame,
            750
          );
      },
      currentFrame.duration
    );
}

function openWorkspacePeek() {
  const overlay =
    document.getElementById(
      'workspace-peek'
    );

  if (!overlay) {
    return;
  }

  overlay.classList.add(
    'show'
  );

  overlay.setAttribute(
    'aria-hidden',
    'false'
  );

  document.body.classList.add(
    'workspace-peek-open'
  );

  workspacePeekFrameIndex = 0;

  showWorkspacePeekFrame(0);

  scheduleWorkspacePeekFrame();
}

function closeWorkspacePeek() {
  const overlay =
    document.getElementById(
      'workspace-peek'
    );

  if (!overlay) {
    return;
  }

  window.clearTimeout(
    workspacePeekTimer
  );

  workspacePeekTimer = null;

  overlay.classList.remove(
    'show'
  );

  overlay.setAttribute(
    'aria-hidden',
    'true'
  );

  document.body.classList.remove(
    'workspace-peek-open'
  );
}

function handleWorkspacePeekClick(event) {
  if (
    event.target.id ===
    'workspace-peek'
  ) {
    closeWorkspacePeek();
  }
}

preloadWorkspacePeekFrames();
document.addEventListener(
  'click',
  event => {
    const reviewOverlay =
      document.getElementById(
        'review-form-overlay'
      );

    if (
      reviewOverlay &&
      event.target ===
        reviewOverlay
    ) {
      closeReviewForm();
    }
  }
);

document.addEventListener(
  'keydown',
  event => {
    if (
      event.key !==
      'Escape'
    ) {
      return;
    }

    closeContactModal();
    closeReviewForm();
    closeSolutionPicker();
    closeReviewsPanel();
    closeWorkspacePeek();
  }
);

function initHeroSpotlight() {
  const hero =
    document.querySelector('.home-hero');

  if (!hero) {
    return;
  }

  hero.addEventListener(
    'mousemove',
    event => {
      const rect =
        hero.getBoundingClientRect();

      const x =
        ((event.clientX - rect.left) /
          rect.width) *
        100;

      const y =
        ((event.clientY - rect.top) /
          rect.height) *
        100;

      hero.style.setProperty(
        '--hero-spot-x',
        `${x}%`
      );

      hero.style.setProperty(
        '--hero-spot-y',
        `${y}%`
      );

      hero.classList.add(
        'hero-spotlight-active'
      );
    }
  );

  hero.addEventListener(
    'mouseleave',
    () => {
      hero.classList.remove(
        'hero-spotlight-active'
      );
    }
  );
}

function initHomeEntrance() {
  window.requestAnimationFrame(
    () => {
      document.body.classList.add(
        'home-ready'
      );
    }
  );
}

function initHeroTilt() {
  const hero =
    document.querySelector('.home-hero');

  if (!hero) {
    return;
  }

  if (
    window.matchMedia(
      '(max-width: 768px)'
    ).matches
  ) {
    return;
  }

  hero.addEventListener(
    'mousemove',
    event => {
      const rect =
        hero.getBoundingClientRect();

      const x =
        (event.clientX - rect.left) /
        rect.width -
        0.5;

      const y =
        (event.clientY - rect.top) /
        rect.height -
        0.5;

      const rotateY =
        x * 2.4;

      const rotateX =
        y * -1.8;

      hero.style.transform =
        `perspective(1200px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg)`;

      hero.classList.add(
        'hero-tilt-active'
      );
    }
  );

  hero.addEventListener(
    'mouseleave',
    () => {
      hero.style.transform =
        'perspective(1200px) rotateX(0deg) rotateY(0deg)';

      hero.classList.remove(
        'hero-tilt-active'
      );
    }
  );
}

function initMagneticCta() {
  const button =
    document.querySelector(
      '.solution-picker-btn'
    );

  if (!button) {
    return;
  }

  if (
    window.matchMedia(
      '(max-width: 768px)'
    ).matches
  ) {
    return;
  }

  button.addEventListener(
    'mousemove',
    event => {
      const rect =
        button.getBoundingClientRect();

      const x =
        event.clientX -
        rect.left -
        rect.width / 2;

      const y =
        event.clientY -
        rect.top -
        rect.height / 2;

      button.style.transform =
        `translate(${(x * 0.08).toFixed(2)}px, ${(y * 0.08).toFixed(2)}px)`;
    }
  );

  button.addEventListener(
    'mouseleave',
    () => {
      button.style.transform =
        'translate(0, 0)';
    }
  );
}

function initSolutionsNavHint() {
  const labels = {
    uk: 'РІШЕННЯ',
    en: 'SOLUTIONS',
    ru: 'РЕШЕНИЯ'
  };

  const targetLabel =
    labels[HOME_LANG] ||
    labels.uk;

  function applyHint() {
    const links =
      Array.from(
        document.querySelectorAll(
          '.topbar a'
        )
      );

    const solutionsLink =
      links.find(link =>
        link.textContent
          .trim()
          .toUpperCase() ===
        targetLabel
      );

    if (!solutionsLink) {
      return false;
    }

    solutionsLink.classList.add(
      'home-solutions-hint'
    );

    return true;
  }

  if (applyHint()) {
    return;
  }

  const observer =
    new MutationObserver(() => {
      if (applyHint()) {
        observer.disconnect();
      }
    });

  observer.observe(
    document.body,
    {
      childList: true,
      subtree: true
    }
  );
}

function initAutomationCardSpotlight() {
  const cards = document.querySelectorAll('.home-automation-card');

  cards.forEach(card => {
    card.addEventListener('mousemove', event => {
      const rect = card.getBoundingClientRect();

      card.style.setProperty(
        '--card-x',
        `${event.clientX - rect.left}px`
      );

      card.style.setProperty(
        '--card-y',
        `${event.clientY - rect.top}px`
      );
    });
  });
}

function initHeroEasterEgg() {
  const avatar =
    document.querySelector(
      '.hero-avatar-orbit'
    );

  if (!avatar) {
    return;
  }

  let clickCount = 0;
  let resetTimer = null;
  let terminalTimer = null;

  function resetClicks() {
    clickCount = 0;

    avatar.classList.remove(
      'easter-click-1',
      'easter-click-2'
    );
  }

  function showTerminal() {
    let terminal =
      document.querySelector(
        '.hero-easter-terminal'
      );

    if (!terminal) {
      terminal =
        document.createElement(
          'div'
        );

      terminal.className =
        'hero-easter-terminal';

      const easterWorkingText = {
        uk: 'Все ще працюю.',
        ru: 'Всё ещё работаю.',
        en: 'Still working.'
      };
      
      terminal.innerHTML = `
        <strong>No pain. Still gain.</strong>
        <span>
          ${easterWorkingText[HOME_LANG] || easterWorkingText.en}<i class="hero-easter-cursor"></i>
        </span>
      `;

      document.body.appendChild(
        terminal
      );
    }

    window.clearTimeout(
      terminalTimer
    );

    window.requestAnimationFrame(
      () => {
        terminal.classList.add(
          'show'
        );
      }
    );

    terminalTimer =
      window.setTimeout(
        () => {
          terminal.classList.remove(
            'show'
          );
        },
        3200
      );
  }

  avatar.addEventListener(
    'click',
    () => {
      clickCount += 1;

      window.clearTimeout(
        resetTimer
      );

      avatar.classList.remove(
        'easter-click-1',
        'easter-click-2',
        'easter-unlocked'
      );

      void avatar.offsetWidth;

      if (clickCount === 1) {
        avatar.classList.add(
          'easter-click-1'
        );
      }

      if (clickCount === 2) {
        avatar.classList.add(
          'easter-click-2'
        );
      }

      if (clickCount >= 3) {
        avatar.classList.add(
          'easter-unlocked'
        );

        showTerminal();

        clickCount = 0;
      }

      resetTimer =
        window.setTimeout(
          resetClicks,
          1800
        );
    }
  );
}

function initHomeHeroPin() {
  if (
    typeof gsap === 'undefined' ||
    typeof ScrollTrigger === 'undefined'
  ) {
    return;
  }

  if (
    window.matchMedia(
      '(max-width: 768px)'
    ).matches
  ) {
    return;
  }

  gsap.registerPlugin(
    ScrollTrigger
  );

  const hero =
    document.querySelector(
      '.home-hero'
    );

  const carousel =
    document.querySelector(
      '.carousel-container'
    );

  if (
    !hero ||
    !carousel ||
    hero.parentElement.classList.contains(
      'home-hero-pin-shell'
    )
  ) {
    return;
  }

  const shell =
    document.createElement(
      'div'
    );

  shell.className =
    'home-hero-pin-shell';

  hero.parentNode.insertBefore(
    shell,
    hero
  );

  shell.appendChild(
    hero
  );

  ScrollTrigger.create({
    trigger: shell,

    start: 'top 82px',

    endTrigger: carousel,

    end: () =>
      `top ${
        82 +
        hero.offsetHeight +
        12
      }px`,

    pin: shell,

    pinSpacing: false,

    anticipatePin: 1,

    invalidateOnRefresh: true
  });

  ScrollTrigger.refresh();
}

initHomeBackground();
initHeroSpotlight();
initHeroTilt();
initMagneticCta();
initSolutionsNavHint();
initCarousel();
initHomeEntrance();
loadHomeParts();
initAutomationCardSpotlight();
initHeroEasterEgg();
initHomeHeroPin();
