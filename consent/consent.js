(function () {
  const STORAGE_KEY = 'sp_cookie_consent';
  const ICON_PATH = '/consent/consent-icon.png';

  const translations = {
    uk: {
      title: 'Налаштування cookies',
      text: 'Ми використовуємо аналітичні cookies, щоб розуміти, як відвідувачі користуються сайтом. Ви можете дозволити або відхилити їх використання.',
      reject: 'Відхилити',
      accept: 'Дозволити'
    },
    ru: {
      title: 'Настройки cookies',
      text: 'Мы используем аналитические cookies, чтобы понимать, как посетители пользуются сайтом. Вы можете разрешить или отклонить их использование.',
      reject: 'Отклонить',
      accept: 'Разрешить'
    },
    en: {
      title: 'Cookie settings',
      text: 'We use analytics cookies to understand how visitors use the website. You can allow or reject their use.',
      reject: 'Reject',
      accept: 'Allow'
    }
  };

  function getLanguage() {
    const lang = (document.documentElement.lang || 'uk').toLowerCase();

    if (lang.startsWith('ru')) return 'ru';
    if (lang.startsWith('en')) return 'en';

    return 'uk';
  }

  function getConsent() {
    return localStorage.getItem(STORAGE_KEY);
  }

  function saveConsent(value) {
    localStorage.setItem(STORAGE_KEY, value);
  }

  function createConsentUI() {
    const lang = getLanguage();
    const t = translations[lang];

    const backdrop = document.createElement('div');
    backdrop.className = 'sp-consent-backdrop';

    const modal = document.createElement('div');
    modal.className = 'sp-consent-modal';

    modal.innerHTML = `
      <div class="sp-consent-content">
        <div class="sp-consent-header">
          <img src="${ICON_PATH}" alt="">
          <h2 class="sp-consent-title">${t.title}</h2>
        </div>

        <p class="sp-consent-text">${t.text}</p>

        <div class="sp-consent-actions">
          <button
            type="button"
            class="sp-consent-btn sp-consent-btn--reject"
            data-consent="reject"
          >
            ${t.reject}
          </button>

          <button
            type="button"
            class="sp-consent-btn sp-consent-btn--accept"
            data-consent="accept"
          >
            ${t.accept}
          </button>
        </div>
      </div>
    `;

    const reopen = document.createElement('button');
    reopen.type = 'button';
    reopen.className = 'sp-consent-reopen';
    reopen.setAttribute('aria-label', t.title);

    reopen.innerHTML = `
      <img src="${ICON_PATH}" alt="">
    `;

    document.body.appendChild(backdrop);
    document.body.appendChild(modal);
    document.body.appendChild(reopen);

    function openModal() {
      backdrop.classList.add('is-visible');
      modal.classList.add('is-visible');
      reopen.classList.remove('is-visible');
    }

    function closeModal() {
      backdrop.classList.remove('is-visible');
      modal.classList.remove('is-visible');
      reopen.classList.add('is-visible');
    }

    modal
      .querySelector('[data-consent="accept"]')
      .addEventListener('click', function () {
        saveConsent('accepted');
        closeModal();

        window.dispatchEvent(
          new CustomEvent('spConsentChanged', {
            detail: { analytics: true }
          })
        );
      });

    modal
      .querySelector('[data-consent="reject"]')
      .addEventListener('click', function () {
        saveConsent('rejected');
        closeModal();

        window.dispatchEvent(
          new CustomEvent('spConsentChanged', {
            detail: { analytics: false }
          })
        );
      });

    reopen.addEventListener('click', openModal);

    const consent = getConsent();

    if (consent === 'accepted' || consent === 'rejected') {
      reopen.classList.add('is-visible');
    } else {
      requestAnimationFrame(openModal);
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', createConsentUI);
  } else {
    createConsentUI();
  }
})();
