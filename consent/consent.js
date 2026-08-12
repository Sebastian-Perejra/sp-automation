(function () {
  const STORAGE_KEY = 'sp_cookie_consent';
  const ICON_PATH = '/consent/consent-icon.webp';
  const GA_ID = 'G-456XH82BM9';

  let analyticsLoaded = false;

  function loadAnalytics() {
    if (analyticsLoaded) return;

    window['ga-disable-' + GA_ID] = false;

    window.dataLayer = window.dataLayer || [];

    window.gtag = window.gtag || function () {
      window.dataLayer.push(arguments);
    };

    const script = document.createElement('script');

    script.async = true;
    script.src =
      'https://www.googletagmanager.com/gtag/js?id=' +
      encodeURIComponent(GA_ID);

    document.head.appendChild(script);

    window.gtag('js', new Date());
    window.gtag('config', GA_ID);

    analyticsLoaded = true;
  }

  function disableAnalytics() {
    window['ga-disable-' + GA_ID] = true;
  }

  function applyConsent(consent) {
    if (consent?.analytics === true) {
      loadAnalytics();
    } else {
      disableAnalytics();
    }
  }

  const translations = {
    uk: {
      title: 'Налаштування cookies',

      intro:
        'Ми використовуємо необхідні cookies для роботи та безпеки сайту, а аналітичні cookies — лише за вашою згодою.',

      necessary: 'Необхідні',

      necessaryText:
        'Потрібні для базової роботи сайту, безпеки, роботи форм та збереження ваших налаштувань.',

      alwaysActive: 'Завжди активні',

      analytics: 'Аналітика',

      analyticsText:
        'Допомагає нам розуміти відвідуваність і використання сайту за допомогою Google Analytics.',

      thirdPartyInfo: 'Сторонні сервіси',

      thirdPartyInfoText:
        'На сайті наразі немає необов’язкових сторонніх сервісів, які потребують окремого вибору користувача. Технічні сторонні сервіси, необхідні для роботи та захисту сайту, належать до категорії «Необхідні».',

      rejectAll: 'Відхилити аналітику',
      save: 'Зберегти налаштування',
      acceptAll: 'Дозволити аналітику'
    },

    ru: {
      title: 'Настройки cookies',

      intro:
        'Мы используем необходимые cookies для работы и безопасности сайта, а аналитические cookies — только с вашего согласия.',

      necessary: 'Необходимые',

      necessaryText:
        'Нужны для базовой работы сайта, безопасности, работы форм и сохранения ваших настроек.',

      alwaysActive: 'Всегда активны',

      analytics: 'Аналитика',

      analyticsText:
        'Помогает нам понимать посещаемость и использование сайта с помощью Google Analytics.',

      thirdPartyInfo: 'Сторонние сервисы',

      thirdPartyInfoText:
        'На сайте сейчас нет необязательных сторонних сервисов, требующих отдельного выбора пользователя. Технические сторонние сервисы, необходимые для работы и защиты сайта, относятся к категории «Необходимые».',

      rejectAll: 'Отклонить аналитику',
      save: 'Сохранить настройки',
      acceptAll: 'Разрешить аналитику'
    },

    en: {
      title: 'Cookie settings',

      intro:
        'We use necessary cookies for website functionality and security. Analytics cookies are used only with your consent.',

      necessary: 'Necessary',

      necessaryText:
        'Required for basic website functionality, security, forms and remembering your preferences.',

      alwaysActive: 'Always active',

      analytics: 'Analytics',

      analyticsText:
        'Helps us understand website traffic and usage through Google Analytics.',

      thirdPartyInfo: 'Third-party services',

      thirdPartyInfoText:
        'The website currently does not use optional third-party services that require a separate user choice. Technical third-party services required for website functionality and security are treated as Necessary.',

      rejectAll: 'Reject analytics',
      save: 'Save preferences',
      acceptAll: 'Allow analytics'
    }
  };

  function getLanguage() {
    const lang =
      (document.documentElement.lang || 'uk').toLowerCase();

    if (lang.startsWith('ru')) return 'ru';
    if (lang.startsWith('en')) return 'en';

    return 'uk';
  }

  function getConsent() {
    const raw = localStorage.getItem(STORAGE_KEY);

    if (!raw) {
      return null;
    }

    try {
      return JSON.parse(raw);
    } catch (err) {
      return null;
    }
  }

  function saveConsent(analytics) {
    const value = {
      necessary: true,
      analytics: Boolean(analytics)
    };

    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(value)
    );

    applyConsent(value);

    window.dispatchEvent(
      new CustomEvent('spConsentChanged', {
        detail: value
      })
    );
  }

  function createConsentUI() {
    const lang = getLanguage();
    const t = translations[lang];
    const savedConsent = getConsent();

    applyConsent(savedConsent);

    const backdrop =
      document.createElement('div');

    backdrop.className =
      'sp-consent-backdrop';

    const modal =
      document.createElement('div');

    modal.className =
      'sp-consent-modal';

    modal.innerHTML = `
      <div class="sp-consent-content">

        <div class="sp-consent-header">
          <img src="${ICON_PATH}" alt="">
          <h2 class="sp-consent-title">
            ${t.title}
          </h2>
        </div>

        <p class="sp-consent-text">
          ${t.intro}
        </p>

        <div class="sp-consent-settings">

          <div class="sp-consent-row">
            <div class="sp-consent-row-copy">

              <div class="sp-consent-row-title">
                ${t.necessary}
              </div>

              <div class="sp-consent-row-text">
                ${t.necessaryText}
              </div>

            </div>

            <div class="sp-consent-always">
              ${t.alwaysActive}
            </div>
          </div>

          <div class="sp-consent-row">
            <div class="sp-consent-row-copy">

              <div class="sp-consent-row-title">
                ${t.analytics}
              </div>

              <div class="sp-consent-row-text">
                ${t.analyticsText}
              </div>

            </div>

            <label class="sp-consent-switch">

              <input
                type="checkbox"
                id="spConsentAnalytics"
                ${savedConsent?.analytics ? 'checked' : ''}
              >

              <span class="sp-consent-slider"></span>

            </label>
          </div>

          <div class="sp-consent-row">
            <div class="sp-consent-row-copy">

              <div class="sp-consent-row-title">
                ${t.thirdPartyInfo}
              </div>

              <div class="sp-consent-row-text">
                ${t.thirdPartyInfoText}
              </div>

            </div>
          </div>

        </div>

        <div class="sp-consent-actions sp-consent-actions--three">

          <button
            type="button"
            class="sp-consent-btn sp-consent-btn--reject"
            data-consent-action="reject"
          >
            ${t.rejectAll}
          </button>

          <button
            type="button"
            class="sp-consent-btn sp-consent-btn--save"
            data-consent-action="save"
          >
            ${t.save}
          </button>

          <button
            type="button"
            class="sp-consent-btn sp-consent-btn--accept"
            data-consent-action="accept"
          >
            ${t.acceptAll}
          </button>

        </div>

      </div>
    `;

    const reopen =
      document.createElement('button');

    reopen.type = 'button';

    reopen.className =
      'sp-consent-reopen';

    reopen.setAttribute(
      'aria-label',
      t.title
    );

    reopen.innerHTML = `
      <img src="${ICON_PATH}" alt="">
    `;

    document.body.appendChild(backdrop);
    document.body.appendChild(modal);
    document.body.appendChild(reopen);

    const analyticsToggle =
      modal.querySelector(
        '#spConsentAnalytics'
      );

    function openModal() {
      const currentConsent =
        getConsent();

      analyticsToggle.checked =
        Boolean(
          currentConsent?.analytics
        );

      backdrop.classList.add(
        'is-visible'
      );

      modal.classList.add(
        'is-visible'
      );

      reopen.classList.remove(
        'is-visible'
      );
    }

    function closeModal() {
      backdrop.classList.remove(
        'is-visible'
      );

      modal.classList.remove(
        'is-visible'
      );

      reopen.classList.add(
        'is-visible'
      );
    }

    modal
      .querySelector(
        '[data-consent-action="reject"]'
      )
      .addEventListener(
        'click',
        function () {
          analyticsToggle.checked = false;

          saveConsent(false);

          closeModal();
        }
      );

    modal
      .querySelector(
        '[data-consent-action="save"]'
      )
      .addEventListener(
        'click',
        function () {
          saveConsent(
            analyticsToggle.checked
          );

          closeModal();
        }
      );

    modal
      .querySelector(
        '[data-consent-action="accept"]'
      )
      .addEventListener(
        'click',
        function () {
          analyticsToggle.checked = true;

          saveConsent(true);

          closeModal();
        }
      );

    reopen.addEventListener(
      'click',
      openModal
    );

    if (savedConsent) {
      reopen.classList.add(
        'is-visible'
      );
    } else {
      requestAnimationFrame(
        openModal
      );
    }
  }

  if (
    document.readyState === 'loading'
  ) {
    document.addEventListener(
      'DOMContentLoaded',
      createConsentUI
    );
  } else {
    createConsentUI();
  }
})();
