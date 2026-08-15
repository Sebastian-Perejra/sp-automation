const HOME_PARTS = [
  {
    slot: 'home-reviews-slot',
    url: '/home/parts/reviews.html'
  },
  {
    slot: 'home-contact-slot',
    url: '/home/parts/contact.html'
  },
  {
    slot: 'home-solution-picker-slot',
    url: '/home/parts/solution-picker.html'
  }
];

const REVIEWS_API_URL =
  'https://script.google.com/macros/s/AKfycbwQ4rbjx6uIXv9PJ-EpbriFkhMTWVT2urzz0Tgv6sPRuwKRboFjlT3-D2bGAcjL2vs/exec';

let reviewsLoaded = false;

let selectedSolutionCategory = '';
let selectedSolutionTask = '';
let selectedSolutionTools = '';
let selectedSolutionStepId = '';

const solutionResultPhrases = [
  'Так, це можна автоматизувати.',
  'Так, тут ручну роботу можна суттєво скоротити.',
  'Для цього можна побудувати автоматичний процес.',
  'Схоже на задачу, яку є сенс автоматизувати.',
  'Це хороший кандидат для автоматизації.',
  'Тут можна обійтися без значної частини ручної роботи.',
  'Це якраз той тип задач, який зазвичай автоматизують.',
  'Тут можна зробити значно простіший робочий процес.',
  'Схоже, цю рутину можна перекласти на автоматизацію.',
  'Так, тут точно є що автоматизувати.'
];

const otherSolutionPhrases = [
  'Окей. Не всі задачі вкладаються в готові категорії 🙂',
  'Без проблем. Опишіть задачу своїми словами.',
  'Добре. Тут краще просто розібратися в самій задачі.',
  'Зрозуміло. Давайте без категорій — просто опишіть, що потрібно.',
  'Окей, нестандартні задачі якраз найцікавіші.',
  'Добре. Розкажіть, що зараз доводиться робити вручну.',
  'Схоже, тут потрібен індивідуальний сценарій.',
  'Домовились. Опишіть процес так, як він працює зараз.'
];

async function loadHomePart(slotId, url) {
  const slot = document.getElementById(slotId);

  if (!slot) {
    return;
  }

  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`Не вдалося завантажити ${url}`);
  }

  slot.innerHTML = await response.text();
}

async function loadHomeParts() {
  try {
    await Promise.all(
      HOME_PARTS.map(part =>
        loadHomePart(part.slot, part.url)
      )
    );

    renderHomeTurnstile();
  } catch (error) {
    console.error('HOME PARTS ERROR:', error);
  }
}

function renderHomeTurnstile() {
  if (!window.turnstile) {
    setTimeout(renderHomeTurnstile, 250);
    return;
  }

  document.querySelectorAll('.cf-turnstile').forEach(element => {
    if (element.dataset.rendered === 'true') {
      return;
    }

    window.turnstile.render(element, {
      sitekey: element.dataset.sitekey
    });

    element.dataset.rendered = 'true';
  });
}

function initCarousel() {
  const carousel = document.getElementById('carousel');
  const hint = document.getElementById('hint');

  if (!carousel || !hint) {
    return;
  }

  let isDragging = false;
  let startX = 0;
  let currentRotation = 0;

  carousel.parentElement.addEventListener('mousedown', event => {
    isDragging = true;
    startX = event.clientX;
    carousel.style.animation = 'none';
  });

  document.addEventListener('mouseup', () => {
    if (!isDragging) {
      return;
    }

    isDragging = false;
    carousel.style.animation = 'spin 80s linear infinite';
  });

  document.addEventListener('mousemove', event => {
    if (!isDragging) {
      return;
    }

    const delta = event.clientX - startX;

    currentRotation += delta * 0.2;

    carousel.style.transform =
      `rotateY(${currentRotation}deg)`;

    startX = event.clientX;
  });

  const descriptions = {
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
  };

  document.querySelectorAll('.carousel img').forEach(img => {
    img.addEventListener('mouseenter', () => {
      hint.textContent = descriptions[img.alt] || '';
      hint.style.display = 'block';
    });

    img.addEventListener('mouseleave', () => {
      hint.style.display = 'none';
    });
  });
}

function openContactModal() {
  const modal = document.getElementById('contact-modal');

  if (!modal) {
    return;
  }

  modal.classList.add('show');

  setTimeout(() => {
    const input = document.getElementById('contact-name');

    if (input) {
      input.focus();
    }
  }, 50);
}

function closeContactModal() {
  const modal = document.getElementById('contact-modal');
  const status = document.getElementById('contact-status');

  if (modal) {
    modal.classList.remove('show');
  }

  if (status) {
    status.textContent = '';
  }
}

function handleOverlayClick(event) {
  if (event.target.id === 'contact-modal') {
    closeContactModal();
  }
}

function selectContactMethod(type, button) {
  const input = document.getElementById('contact-method');
  const hiddenType =
    document.getElementById('contact-method-type');

  if (!input || !hiddenType) {
    return;
  }

  document
    .querySelectorAll('.contact-method-btn')
    .forEach(btn => {
      btn.classList.remove('active');
    });

  button.classList.add('active');

  hiddenType.value = type;
  input.disabled = false;
  input.value = '';

  if (type === 'email') {
    input.type = 'email';
    input.placeholder = 'name@example.com';
  }

  if (type === 'phone') {
    input.type = 'tel';
    input.placeholder = '+380...';
  }

  if (type === 'telegram') {
    input.type = 'text';
    input.placeholder = '@username';
  }

  input.focus();
}

async function testContactForm() {
  const name =
    document.getElementById('contact-name')?.value.trim() || '';

  const contact =
    document.getElementById('contact-method')?.value.trim() || '';

  const message =
    document.getElementById('contact-message')?.value.trim() || '';

  const status =
    document.getElementById('contact-status');

  const button =
    document.querySelector('.contact-send-btn');

  const turnstileToken =
    document.querySelector(
      '#contact-modal [name="cf-turnstile-response"]'
    )?.value || '';

  if (!status || !button) {
    return;
  }

  if (!name || !contact || !message) {
    status.textContent = 'Заповніть усі поля.';
    status.style.color = '#cc0000';
    return;
  }

  if (!turnstileToken) {
    status.textContent = 'Підтвердіть, що ви не робот.';
    status.style.color = '#cc0000';
    return;
  }

  status.textContent = 'Надсилаємо...';
  status.style.color = '#555';

  button.disabled = true;
  button.textContent = 'Надсилаємо...';

  try {
    const response = await fetch(
      REVIEWS_API_URL,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'text/plain;charset=utf-8'
        },
        body: JSON.stringify({
          user_name: name,
          user_email: contact,
          message: message,
          turnstileToken: turnstileToken
        })
      }
    );

    const result = await response.json();

    if (!result.ok) {
      throw new Error(
        result.error || 'Помилка відправлення'
      );
    }

    status.textContent = '✓ Повідомлення надіслано';
    status.style.color = '#0F9D58';

    document.getElementById('contact-name').value = '';
    document.getElementById('contact-method').value = '';
    document.getElementById('contact-message').value = '';

    if (window.turnstile) {
      const widget =
        document.querySelector(
          '#contact-modal .cf-turnstile'
        );

      if (widget) {
        window.turnstile.reset(widget);
      }
    }

    setTimeout(() => {
      closeContactModal();
    }, 1300);
  } catch (error) {
    console.error(error);

    let errorMessage =
      error.message ||
      'Не вдалося надіслати. Спробуйте ще раз.';

    if (
      errorMessage.includes(
        'Превышен допустимый размер данных'
      )
    ) {
      errorMessage =
        'Повідомлення занадто велике. Максимальний розмір — 5000 символів.';
    }

    if (
      errorMessage.includes(
        'Проверка защиты от роботов не пройдена'
      )
    ) {
      errorMessage =
        'Перевірка захисту завершилася помилкою. Оновіть сторінку та спробуйте ще раз.';
    }

    if (
      errorMessage.includes(
        'Повторное сообщение можно отправить через 1 минуту'
      )
    ) {
      errorMessage =
        'Повторне повідомлення можна надіслати через 1 хвилину.';
    }

    if (
      errorMessage.includes(
        'Не заполнены обязательные поля сайта'
      )
    ) {
      errorMessage =
        'Заповніть усі обов’язкові поля.';
    }

    status.textContent = errorMessage;
    status.style.color = '#cc0000';
  } finally {
    button.disabled = false;
    button.textContent = 'Надіслати';
  }
}

function openReviewsPanel() {
  const panel = document.getElementById('reviews-panel');

  if (!panel) {
    return;
  }

  panel.classList.add('show');

  if (!reviewsLoaded) {
    loadPublishedReviews();
  }
}

function closeReviewsPanel() {
  const panel = document.getElementById('reviews-panel');

  if (panel) {
    panel.classList.remove('show');
  }
}

async function loadPublishedReviews() {
  const list =
    document.getElementById('reviews-panel-list');

  if (!list) {
    return;
  }

  list.innerHTML =
    '<div class="reviews-panel-loading">Завантажуємо відгуки...</div>';

  try {
    const response = await fetch(
      REVIEWS_API_URL + '?action=getReviews'
    );

    const data = await response.json();

    if (!data.ok || !Array.isArray(data.reviews)) {
      throw new Error('Некоректна відповідь API');
    }

    const reviewsButton =
      document.getElementById('reviews-float-btn');

    if (reviewsButton) {
      reviewsButton.textContent =
        '⭐ Відгуки · ' + data.reviews.length;
    }

    list.innerHTML = data.reviews
      .map(review => {
        const rating = Math.max(
          1,
          Math.min(
            5,
            Number(review.rating) || 5
          )
        );

        const pinned = review.pinned
          ? `
            <div class="review-pinned">
              📌 Закріплено
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
                — ${escapeReviewHtml(review.name || 'Клієнт')}
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
    console.error('REVIEWS ERROR:', error);

    list.innerHTML =
      '<div class="reviews-panel-loading">Не вдалося завантажити відгуки.</div>';
  }
}

function escapeReviewHtml(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function openReviewForm() {
  const overlay =
    document.getElementById('review-form-overlay');

  if (!overlay) {
    return;
  }

  overlay.classList.add('show');
}

function closeReviewForm() {
  const overlay =
    document.getElementById('review-form-overlay');

  if (overlay) {
    overlay.classList.remove('show');
  }
}

function selectReviewRating(rating) {
  const value =
    document.getElementById('review-rating-value');

  if (!value) {
    return;
  }

  value.value = rating;

  document
    .querySelectorAll('#review-rating button')
    .forEach((star, index) => {
      star.classList.toggle(
        'active',
        index < rating
      );
    });
}

async function submitWebsiteReview() {
  const name =
    document.getElementById('review-name')?.value.trim() || '';

  const rating = Number(
    document.getElementById('review-rating-value')?.value || 0
  );

  const review =
    document.getElementById('review-text-input')?.value.trim() || '';

  const turnstileToken =
    document.querySelector(
      '#review-form-overlay [name="cf-turnstile-response"]'
    )?.value || '';

  const status =
    document.getElementById('review-form-status');

  const button =
    document.querySelector('.review-submit-btn');

  if (!status || !button) {
    return;
  }

  if (!review) {
    status.textContent = 'Напишіть текст відгуку.';
    status.style.color = '#cc0000';
    return;
  }

  if (rating < 1 || rating > 5) {
    status.textContent = 'Оберіть оцінку від 1 до 5.';
    status.style.color = '#cc0000';
    return;
  }

  if (!turnstileToken) {
    status.textContent = 'Підтвердіть, що ви не робот.';
    status.style.color = '#cc0000';
    return;
  }

  status.textContent = 'Надсилаємо...';
  status.style.color = '#555';

  button.disabled = true;
  button.textContent = 'Надсилаємо...';

  try {
    const response = await fetch(
      REVIEWS_API_URL,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'text/plain;charset=utf-8'
        },
        body: JSON.stringify({
          source: 'review',
          name: name,
          rating: rating,
          review: review,
          page_lang: 'UA',
          turnstileToken: turnstileToken
        })
      }
    );

    const result = await response.json();

    if (!result.ok) {
      throw new Error(
        result.error || 'Помилка відправлення'
      );
    }

    status.textContent =
      '✓ Відгук надіслано на модерацію';

    status.style.color = '#0F9D58';

    document.getElementById('review-name').value = '';
    document.getElementById('review-text-input').value = '';
    document.getElementById('review-rating-value').value = '0';

    document
      .querySelectorAll('#review-rating button')
      .forEach(star => {
        star.classList.remove('active');
      });

    if (window.turnstile) {
      const widget =
        document.querySelector(
          '#review-form-overlay .cf-turnstile'
        );

      if (widget) {
        window.turnstile.reset(widget);
      }
    }

    setTimeout(() => {
      closeReviewForm();
    }, 1400);
  } catch (error) {
    console.error(error);

    let errorMessage =
      error.message ||
      'Не вдалося надіслати відгук. Спробуйте ще раз.';

    if (
      errorMessage.includes(
        'Превышен допустимый размер данных'
      )
    ) {
      errorMessage =
        'Відгук занадто великий. Максимальний розмір — 3000 символів.';
    }

    if (
      errorMessage.includes(
        'Проверка защиты от роботов не пройдена'
      )
    ) {
      errorMessage =
        'Будь ласка, підтвердьте, що ви не робот.';
    }

    if (
      errorMessage.includes('Пустой отзыв')
    ) {
      errorMessage =
        'Будь ласка, введіть текст відгуку.';
    }

    status.textContent = errorMessage;
    status.style.color = '#cc0000';
  } finally {
    button.disabled = false;
    button.textContent = 'Надіслати відгук';
  }
}

function openExcelStep() {
  openSolutionCategoryStep('solution-excel-step');
}

function openAnalyticsStep() {
  openSolutionCategoryStep('solution-analytics-step');
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

function openSolutionCategoryStep(stepId) {
  const startStep =
    document.getElementById('solution-start-step');

  const nextStep =
    document.getElementById(stepId);

  if (!startStep || !nextStep) {
    return;
  }

  startStep.classList.remove('active');
  nextStep.classList.add('active');

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

function backToSolutionStartFrom(stepId) {
  const startStep =
    document.getElementById('solution-start-step');

  const currentStep =
    document.getElementById(stepId);

  if (!startStep || !currentStep) {
    return;
  }

  currentStep.classList.remove('active');
  startStep.classList.add('active');

  setSolutionProgress(0);
}

function setSolutionProgress(index) {
  const progress =
    document.querySelectorAll(
      '.solution-picker-progress span'
    );

  progress.forEach(item => {
    item.classList.remove('active');
  });

  if (progress[index]) {
    progress[index].classList.add('active');
  }
}

function selectExcelTask(task) {
  selectSolutionTask(
    'Excel / Google Sheets',
    task,
    'Excel / Power Query / VBA / Google Apps Script',
    'solution-excel-step'
  );
}

function selectAnalyticsTask(task) {
  selectSolutionTask(
    'Звіти та аналітика',
    task,
    'Excel / Power Query / Power BI / Google Sheets',
    'solution-analytics-step'
  );
}

function selectManualDataTask(task) {
  selectSolutionTask(
    'Ручна робота з даними',
    task,
    'Excel / Power Query / VBA / Google Apps Script',
    'solution-manual-data-step'
  );
}

function selectTelegramTask(task) {
  selectSolutionTask(
    'Telegram / сповіщення',
    task,
    'Telegram Bot API / Google Apps Script / API / Webhooks',
    'solution-telegram-step'
  );
}

function selectPowerBiTask(task) {
  selectSolutionTask(
    'Power BI',
    task,
    'Power BI / Power Query / DAX / Excel / Google Sheets',
    'solution-powerbi-step'
  );
}

function selectSolutionTask(
  category,
  task,
  tools,
  stepId
) {
  selectedSolutionCategory = category;
  selectedSolutionTask = task;
  selectedSolutionTools = tools;
  selectedSolutionStepId = stepId;

  const currentStep =
    document.getElementById(stepId);

  const resultStep =
    document.getElementById('solution-result-step');

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

  selectedText.textContent = task;
  resultTitle.textContent = randomPhrase;
  toolsText.textContent = tools;

  description.value = '';
  description.placeholder =
    'Наприклад: щодня отримую файли від 12 менеджерів і вручну збираю їх в один звіт...';

  currentStep.classList.remove('active');
  resultStep.classList.add('active');

  setSolutionProgress(2);

  setTimeout(() => {
    description.focus();
  }, 100);
}

function openOtherSolution() {
  selectedSolutionCategory = 'Інше';
  selectedSolutionTask = 'Індивідуальна задача';
  selectedSolutionTools = '';
  selectedSolutionStepId = 'solution-start-step';

  const startStep =
    document.getElementById('solution-start-step');

  const resultStep =
    document.getElementById('solution-result-step');

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
    !startStep ||
    !resultStep ||
    !selectedText ||
    !resultTitle ||
    !toolsText ||
    !description
  ) {
    return;
  }

  const randomPhrase =
    otherSolutionPhrases[
      Math.floor(
        Math.random() *
        otherSolutionPhrases.length
      )
    ];

  resultTitle.textContent = randomPhrase;

  selectedText.textContent =
    'Індивідуальна задача';

  toolsText.textContent =
    'Підберемо після короткого опису задачі';

  description.value = '';

  description.placeholder =
    'Опишіть, що ви зараз робите вручну і який результат хотіли б отримувати автоматично...';

  startStep.classList.remove('active');
  resultStep.classList.add('active');

  setSolutionProgress(2);

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

  if (!resultStep || !previousStep) {
    return;
  }

  resultStep.classList.remove('active');
  previousStep.classList.add('active');

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
  const description =
    document.getElementById(
      'solution-description'
    )?.value.trim() || '';

  closeSolutionPicker();
  openContactModal();

  let text =
    'Напрям: ' +
    selectedSolutionCategory +
    '\n' +
    'Задача: ' +
    selectedSolutionTask;

  if (description) {
    text +=
      '\n\nОпис:\n' +
      description;
  }

  const contactMessage =
    document.getElementById(
      'contact-message'
    );

  if (contactMessage) {
    contactMessage.value = text;
  }
}

function openSolutionPicker() {
  const picker =
    document.getElementById('solution-picker');

  if (picker) {
    picker.classList.add('show');
  }
}

function closeSolutionPicker() {
  const picker =
    document.getElementById('solution-picker');

  if (picker) {
    picker.classList.remove('show');
  }
}

function handleSolutionOverlayClick(event) {
  if (event.target.id === 'solution-picker') {
    closeSolutionPicker();
  }
}

document.addEventListener('click', event => {
  const reviewOverlay =
    document.getElementById(
      'review-form-overlay'
    );

  if (
    reviewOverlay &&
    event.target === reviewOverlay
  ) {
    closeReviewForm();
  }
});

document.addEventListener('keydown', event => {
  if (event.key !== 'Escape') {
    return;
  }

  closeContactModal();
  closeReviewForm();
  closeSolutionPicker();
  closeReviewsPanel();
});

initCarousel();
loadHomeParts();
