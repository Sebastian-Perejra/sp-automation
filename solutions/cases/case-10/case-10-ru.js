(() => {
  const caseRoot = document.getElementById('contract-generator-case');

  if (!caseRoot) {
    return;
  }

  const logoData =
    'data:image/svg+xml;charset=UTF-8,' +
    encodeURIComponent(`
<svg xmlns="http://www.w3.org/2000/svg" width="120" height="40" viewBox="0 0 120 40">
  <rect width="120" height="40" rx="8" fill="#0f172a"/>
  <text x="14" y="26" font-family="Arial, sans-serif" font-size="18" font-weight="700" fill="#9BE22D">SP</text>
  <text x="45" y="25" font-family="Arial, sans-serif" font-size="11" fill="#ffffff">Automation</text>
</svg>`);

  const $ = id => caseRoot.querySelector(`#${id}`);
  const get = id => $(id).value.trim();

  const controls = [
    ...caseRoot.querySelectorAll('input, select, textarea')
  ];

  const documentStack = $('documentStack');
  const previewScroll = caseRoot.querySelector('.preview-scroll');

  const contractBlocks = Array.from(
    documentStack.querySelectorAll('.page-inner')
  ).flatMap(inner => Array.from(inner.children));

  let zoom = 0.72;

  function setState(state) {
    Object.entries(state).forEach(([id, val]) => {
      const el = $(id);

      if (!el) {
        return;
      }

      if (el.type === 'checkbox') {
        el.checked = !!val;
      } else {
        el.value = val;
      }
    });

    update();
  }

  function dateRu(value) {
    if (!value) {
      return '—';
    }

    const [y, m, d] = value.split('-').map(Number);

    const months = [
      'января',
      'февраля',
      'марта',
      'апреля',
      'мая',
      'июня',
      'июля',
      'августа',
      'сентября',
      'октября',
      'ноября',
      'декабря'
    ];

    return `${String(d).padStart(2, '0')} ${months[m - 1]} ${y} года`;
  }

  function money(n) {
    return new Intl.NumberFormat('ru-UA', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(Number(n || 0));
  }

  function triad(n, forms, feminine = false) {
    const onesM = [
      '',
      'один',
      'два',
      'три',
      'четыре',
      'пять',
      'шесть',
      'семь',
      'восемь',
      'девять'
    ];

    const onesF = [
      '',
      'одна',
      'две',
      'три',
      'четыре',
      'пять',
      'шесть',
      'семь',
      'восемь',
      'девять'
    ];

    const teens = [
      'десять',
      'одиннадцать',
      'двенадцать',
      'тринадцать',
      'четырнадцать',
      'пятнадцать',
      'шестнадцать',
      'семнадцать',
      'восемнадцать',
      'девятнадцать'
    ];

    const tens = [
      '',
      '',
      'двадцать',
      'тридцать',
      'сорок',
      'пятьдесят',
      'шестьдесят',
      'семьдесят',
      'восемьдесят',
      'девяносто'
    ];

    const hundreds = [
      '',
      'сто',
      'двести',
      'триста',
      'четыреста',
      'пятьсот',
      'шестьсот',
      'семьсот',
      'восемьсот',
      'девятьсот'
    ];

    const out = [];
    const h = Math.floor(n / 100);
    const r = n % 100;
    const t = Math.floor(r / 10);
    const o = r % 10;

    if (h) {
      out.push(hundreds[h]);
    }

    if (t === 1) {
      out.push(teens[o]);
    } else {
      if (t) {
        out.push(tens[t]);
      }

      if (o) {
        out.push((feminine ? onesF : onesM)[o]);
      }
    }

    if (forms) {
      const x = n % 100;
      let form = forms[2];

      if (x < 11 || x > 19) {
        const z = n % 10;

        if (z === 1) {
          form = forms[0];
        } else if (z >= 2 && z <= 4) {
          form = forms[1];
        }
      }

      if (n) {
        out.push(form);
      }
    }

    return out.join(' ');
  }

  function numWords(num) {
    num = Math.floor(Number(num || 0));

    if (num === 0) {
      return 'ноль гривен';
    }

    const parts = [];
    const millions = Math.floor(num / 1000000);
    const thousands = Math.floor((num % 1000000) / 1000);
    const rest = num % 1000;

    if (millions) {
      parts.push(
        triad(
          millions,
          ['миллион', 'миллиона', 'миллионов']
        )
      );
    }

    if (thousands) {
      parts.push(
        triad(
          thousands,
          ['тысяча', 'тысячи', 'тысяч'],
          true
        )
      );
    }

    if (rest) {
      parts.push(triad(rest, null));
    }

    const x = num % 100;
    let form = 'гривен';

    if (x < 11 || x > 19) {
      const z = num % 10;

      if (z === 1) {
        form = 'гривна';
      } else if (z >= 2 && z <= 4) {
        form = 'гривны';
      }
    }

    return `${parts.join(' ')} ${form}`;
  }

  function providerVatText() {
    return $('providerVat').value === 'yes'
      ? 'плательщик НДС'
      : 'не плательщик НДС';
  }

  function createContractPage(pageNumber) {
    const page = document.createElement('section');
    page.className = 'doc-page';
    page.dataset.page = String(pageNumber);

    const header = document.createElement('div');
    header.className = 'doc-header';
    header.innerHTML = `
      <div class="brand">
        <img class="header-logo" alt="">
        <span class="header-label">SP Automation · Contract Generator</span>
      </div>
      <span>Договор оказания услуг</span>
    `;

    const pageNum = document.createElement('div');
    pageNum.className = 'page-num';
    pageNum.textContent = String(pageNumber);

    const inner = document.createElement('div');
    inner.className = 'page-inner';

    const footer = document.createElement('div');
    footer.className = 'doc-footer';
    footer.innerHTML = `
      <span class="footer-label">sp-automation.com</span>
      <span>Демонстрационный шаблон</span>
    `;

    page.appendChild(header);

    if (pageNumber > 1) {
      page.appendChild(pageNum);
    }

    page.appendChild(inner);
    page.appendChild(footer);

    return {
      page,
      inner
    };
  }

  function pageFits(inner) {
    return inner.scrollHeight <= inner.clientHeight + 2;
  }

  function buildPaginationGroups() {
    const groups = [];
    let index = 0;

    while (index < contractBlocks.length) {
      const current = contractBlocks[index];

      if (current.classList.contains('requisites-title')) {
        groups.push({
          blocks: contractBlocks.slice(index),
          forceNewPage: true
        });

        break;
      }

      if (current.classList.contains('doc-title')) {
        const blocks = [current];
        index++;

        while (
          index < contractBlocks.length &&
          !contractBlocks[index].classList.contains('section-title') &&
          !contractBlocks[index].classList.contains('requisites-title')
        ) {
          blocks.push(contractBlocks[index]);
          index++;
        }

        groups.push({
          blocks,
          forceNewPage: false
        });

        continue;
      }

      if (current.classList.contains('section-title')) {
        const blocks = [current];
        index++;

        if (
          index < contractBlocks.length &&
          !contractBlocks[index].classList.contains('section-title') &&
          !contractBlocks[index].classList.contains('requisites-title')
        ) {
          blocks.push(contractBlocks[index]);
          index++;
        }

        groups.push({
          blocks,
          forceNewPage: false
        });

        continue;
      }

      groups.push({
        blocks: [current],
        forceNewPage: false
      });

      index++;
    }

    return groups;
  }

  function applyPageChrome() {
    caseRoot
      .querySelectorAll('.clause, .doc-preamble')
      .forEach(el => {
        el.style.textAlign = $('justify').checked
          ? 'justify'
          : 'left';
      });

    caseRoot
      .querySelectorAll('.page-num')
      .forEach(el => {
        el.classList.toggle(
          'on',
          $('pageNumbers').checked
        );
      });

    caseRoot
      .querySelectorAll('.doc-header')
      .forEach(el => {
        el.classList.toggle(
          'on',
          $('headerOn').checked
        );
      });

    caseRoot
      .querySelectorAll('.header-logo')
      .forEach(el => {
        el.src = logoData;

        el.classList.toggle(
          'on',
          $('logoOn').checked &&
          $('headerOn').checked
        );
      });

    caseRoot
      .querySelectorAll('.header-label')
      .forEach(el => {
        el.textContent = get('headerText');
      });

    caseRoot
      .querySelectorAll('.doc-footer')
      .forEach(el => {
        el.classList.toggle(
          'on',
          $('footerOn').checked
        );
      });

    caseRoot
      .querySelectorAll('.footer-label')
      .forEach(el => {
        el.textContent = get('footerText');
      });

    caseRoot
      .querySelectorAll('.doc-page')
      .forEach(el => {
        el.classList.toggle(
          'border-on',
          $('borderOn').checked
        );
      });
  }

  function paginateContract() {
    const oldScrollTop = previewScroll
      ? previewScroll.scrollTop
      : 0;

    documentStack.innerHTML = '';

    const groups = buildPaginationGroups();

    let pageNumber = 1;
    let currentPage = createContractPage(pageNumber);

    documentStack.appendChild(currentPage.page);

    function newPage() {
      pageNumber++;
      currentPage = createContractPage(pageNumber);
      documentStack.appendChild(currentPage.page);
    }

    function appendSingle(block) {
      currentPage.inner.appendChild(block);

      if (pageFits(currentPage.inner)) {
        return;
      }

      block.remove();

      if (currentPage.inner.children.length) {
        newPage();
      }

      currentPage.inner.appendChild(block);
    }

    groups.forEach(group => {
      if (
        group.forceNewPage &&
        currentPage.inner.children.length
      ) {
        newPage();
      }

      group.blocks.forEach(block => {
        currentPage.inner.appendChild(block);
      });

      if (pageFits(currentPage.inner)) {
        return;
      }

      group.blocks.forEach(block => {
        block.remove();
      });

      if (currentPage.inner.children.length) {
        newPage();
      }

      group.blocks.forEach(block => {
        currentPage.inner.appendChild(block);
      });

      if (
        !pageFits(currentPage.inner) &&
        group.blocks.length > 1
      ) {
        group.blocks.forEach(block => {
          block.remove();
        });

        group.blocks.forEach(block => {
          appendSingle(block);
        });
      }
    });

    applyPageChrome();

    if (previewScroll) {
      previewScroll.scrollTop = Math.min(
        oldScrollTop,
        Math.max(
          0,
          previewScroll.scrollHeight -
          previewScroll.clientHeight
        )
      );
    }
  }

  function update() {
    caseRoot.style.setProperty(
      '--doc-font',
      `"${get('fontFamily')}", serif`
    );

    caseRoot.style.setProperty(
      '--doc-size',
      `${get('fontSize')}pt`
    );

    caseRoot.style.setProperty(
      '--doc-line',
      get('lineHeight')
    );

    caseRoot.style.setProperty(
      '--doc-left',
      `${get('marginLeft')}mm`
    );

    caseRoot.style.setProperty(
      '--doc-right',
      `${get('marginRight')}mm`
    );

    caseRoot.style.setProperty(
      '--doc-top',
      `${get('marginTop')}mm`
    );

    caseRoot.style.setProperty(
      '--doc-bottom',
      `${get('marginBottom')}mm`
    );

    caseRoot.style.setProperty(
      '--doc-title',
      `${get('titleSize')}pt`
    );

    $('outDate').textContent =
      dateRu(get('contractDate'));

    $('outNo').textContent =
      get('contractNo') || '—';

    $('outPlace').textContent =
      get('place') || '—';

    const customer =
      get('customerName') || 'ЗАКАЗЧИК';

    const director =
      get('customerDirector') ||
      'УПОЛНОМОЧЕННОЕ ЛИЦО';

    const provider =
      get('providerName') || 'ИСПОЛНИТЕЛЬ';

    $('outPreamble').textContent =
      `${customer}, в лице директора ${director}, ` +
      `действующего на основании Устава ` +
      `(далее — «Заказчик»), с одной стороны, и ` +
      `${provider}, действующий на основании записи ` +
      `о государственной регистрации физического лица-предпринимателя ` +
      `(далее — «Исполнитель»), с другой стороны, ` +
      `совместно именуемые в дальнейшем «Стороны», а каждый отдельно — ` +
      `«Сторона», заключили настоящий Договор о нижеследующем:`;

    $('clause11').textContent =
      `1.1. Исполнитель обязуется по заданию ` +
      `Заказчика оказать услуги по ` +
      `${get('serviceText') || 'согласованному перечню работ'}, ` +
      `а Заказчик обязуется принять надлежащим образом ` +
      `оказанные услуги и осуществить их оплату ` +
      `на условиях настоящего Договора.`;

    $('clause13').textContent =
      `1.3. Срок выполнения согласованного объёма услуг ` +
      `составляет до ${get('workDays') || '0'} рабочих дней ` +
      `с даты получения Исполнителем авансового платежа, ` +
      `необходимых исходных данных, доступов и согласований ` +
      `от Заказчика, если Стороны письменно не согласовали ` +
      `иной срок.`;

    const price =
      Number(get('price') || 0);

    const advance =
      Number(get('advance') || 0);

    const prepay =
      price * advance / 100;

    const vatClause =
      $('providerVat').value === 'yes'
        ? 'в том числе НДС в соответствии с действующим законодательством'
        : 'без НДС в связи с применением Исполнителем упрощённой системы налогообложения';

    $('clause31').textContent =
      `3.1. Общая стоимость услуг по настоящему Договору ` +
      `составляет ${money(price)} грн ` +
      `(${numWords(price)} 00 копеек), ${vatClause}.`;

    $('clause32').textContent =
      `3.2. Заказчик осуществляет авансовый платёж ` +
      `в размере ${advance}% от общей стоимости услуг, ` +
      `что составляет ${money(prepay)} грн, в течение ` +
      `3 банковских дней с даты получения счёта Исполнителя.`;

    $('clause51').textContent =
      `5.1. Гарантийный срок составляет ` +
      `${get('warrantyDays') || '0'} календарных дней ` +
      `с момента принятия результата Заказчиком ` +
      `и распространяется на функциональность в пределах ` +
      `согласованных требований.`;

    $('clause91').textContent =
      `9.1. Настоящий Договор вступает в силу с момента ` +
      `его подписания Сторонами и действует до ` +
      `${dateRu(get('endDate'))}, а в части ` +
      `неисполненных обязательств — до их полного исполнения.`;

    $('reqCustomerName').textContent =
      customer;

    $('reqCustomerEdrpou').textContent =
      get('customerEdrpou');

    $('reqCustomerIpn').textContent =
      get('customerIpn');

    $('reqCustomerVat').textContent =
      get('customerVat');

    $('reqCustomerAddress').textContent =
      get('customerAddress');

    $('reqCustomerIban').textContent =
      get('customerIban');

    $('reqCustomerBank').textContent =
      get('customerBank');

    $('reqCustomerMfo').textContent =
      get('customerMfo');

    $('reqCustomerDirector').textContent =
      director;

    $('sigCustomer').textContent =
      director;

    $('reqProviderName').textContent =
      provider;

    $('reqProviderTax').textContent =
      get('providerTax');

    $('reqProviderVat').textContent =
      providerVatText();

    $('reqProviderTaxSystem').textContent =
      get('providerTaxSystem');

    $('reqProviderAddress').textContent =
      get('providerAddress');

    $('reqProviderIban').textContent =
      get('providerIban');

    $('reqProviderBank').textContent =
      get('providerBank');

    $('reqProviderMfo').textContent =
      get('providerMfo');

    $('reqProviderEmail').textContent =
      get('providerEmail');

    paginateContract();
  }

  function presetDstu() {
    setState({
      fontFamily: 'Times New Roman',
      fontSize: '12',
      lineHeight: '1.15',
      titleSize: '14',
      marginLeft: '30',
      marginRight: '10',
      marginTop: '20',
      marginBottom: '20',
      justify: true,
      pageNumbers: true,
      headerOn: false,
      logoOn: false,
      footerOn: false,
      borderOn: false
    });

    $('presetName').textContent =
      'По умолчанию: ДСТУ';

    $('previewStatus').textContent =
      'ДСТУ 4163:2020';
  }

  function presetCorporate() {
    setState({
      fontFamily: 'Arial',
      fontSize: '11',
      lineHeight: '1.15',
      titleSize: '14',
      marginLeft: '20',
      marginRight: '20',
      marginTop: '24',
      marginBottom: '22',
      justify: true,
      pageNumbers: true,
      headerOn: true,
      logoOn: true,
      footerOn: true,
      borderOn: true
    });

    $('presetName').textContent =
      'Пресет: Корпоративный';

    $('previewStatus').textContent =
      'Корпоративный стиль';
  }

  controls.forEach(el => {
    el.addEventListener(
      'input',
      update
    );

    el.addEventListener(
      'change',
      update
    );
  });

  caseRoot
    .querySelectorAll('.tab')
    .forEach(btn => {
      btn.addEventListener('click', () => {
        caseRoot
          .querySelectorAll('.tab')
          .forEach(tab => {
            tab.classList.remove('active');
          });

        caseRoot
          .querySelectorAll('.tab-content')
          .forEach(content => {
            content.classList.remove('active');
          });

        btn.classList.add('active');

        $('tab-' + btn.dataset.tab)
          .classList.add('active');
      });
    });

  $('presetDstu').addEventListener(
    'click',
    presetDstu
  );

  $('presetCorporate').addEventListener(
    'click',
    presetCorporate
  );

  $('resetBtn').addEventListener(
    'click',
    () => {
      controls.forEach(el => {
        if (el.type === 'checkbox') {
          el.checked = el.defaultChecked;
          return;
        }

        if (el.tagName === 'SELECT') {
          const selected =
            Array.from(el.options).find(
              option => option.defaultSelected
            ) || el.options[0];

          if (selected) {
            el.value = selected.value;
          }

          return;
        }

        el.value = el.defaultValue;
      });

      $('presetName').textContent =
        'По умолчанию: ДСТУ';

      $('previewStatus').textContent =
        'ДСТУ 4163:2020';

      zoom = 0.72;
      applyZoom();

      caseRoot
        .querySelectorAll('.tab')
        .forEach(tab => {
          tab.classList.remove('active');
        });

      caseRoot
        .querySelectorAll('.tab-content')
        .forEach(content => {
          content.classList.remove('active');
        });

      const firstTab =
        caseRoot.querySelector(
          '.tab[data-tab="data"]'
        );

      firstTab.classList.add('active');
      $('tab-data').classList.add('active');

      update();

      requestAnimationFrame(() => {
        if (previewScroll) {
          previewScroll.scrollTop = 0;
          previewScroll.scrollLeft = 0;
        }
      });
    }
  );

  $('printBtn').addEventListener(
    'click',
    () => {
      const frame =
        document.createElement('iframe');

      frame.style.position =
        'fixed';

      frame.style.right =
        '0';

      frame.style.bottom =
        '0';

      frame.style.width =
        '0';

      frame.style.height =
        '0';

      frame.style.border =
        '0';

      const styles =
        getComputedStyle(caseRoot);

      const variables = [
        '--doc-font',
        '--doc-size',
        '--doc-line',
        '--doc-left',
        '--doc-right',
        '--doc-top',
        '--doc-bottom',
        '--doc-title',
        '--doc-section'
      ];

      const rootStyle =
        variables
          .map(name =>
            `${name}:${styles.getPropertyValue(name).trim()}`
          )
          .join(';');

      document.body.appendChild(
        frame
      );

      const printDocument =
        frame.contentDocument;

      printDocument.open();

      printDocument.write(`
        <!DOCTYPE html>
        <html lang="ru">
        <head>
          <meta charset="UTF-8">
          <title>Договор ${get('contractNo')}</title>
          <link
            rel="stylesheet"
            href="/solutions/cases/case-10/case10.css"
          >
          <style>
            @page{
              size:A4 portrait;
              margin:0;
            }

            html,
            body{
              margin:0!important;
              padding:0!important;
              background:#fff!important;
            }

            #contract-generator-case{
              ${rootStyle};
              width:auto!important;
            }

            #contract-generator-case .document-stack{
              zoom:1!important;
              margin:0!important;
            }

            #contract-generator-case .doc-page{
              margin:0!important;
              box-shadow:none!important;
              break-after:page;
              page-break-after:always;
            }

            #contract-generator-case .doc-page:last-child{
              break-after:auto;
              page-break-after:auto;
            }
          </style>
        </head>
        <body>
          <div
            id="contract-generator-case"
            style="${rootStyle}"
          >
            <div class="document-stack">
              ${documentStack.innerHTML}
            </div>
          </div>
        </body>
        </html>
      `);

      printDocument.close();

      const printNow = () => {
        frame.contentWindow.focus();
        frame.contentWindow.print();

        setTimeout(
          () => {
            frame.remove();
          },
          1000
        );
      };

      const stylesheet =
        printDocument.querySelector(
          'link[rel="stylesheet"]'
        );

      if (stylesheet) {
        stylesheet.addEventListener(
          'load',
          () => {
            setTimeout(
              printNow,
              150
            );
          }
        );

        stylesheet.addEventListener(
          'error',
          printNow
        );
      } else {
        printNow();
      }
    }
  );

  $('buildBtn').addEventListener(
    'click',
    () => {
      update();

      const flash = $('flash');

      flash.classList.add('show');

      setTimeout(() => {
        flash.classList.remove('show');
      }, 1800);
    }
  );

  function applyZoom() {
    documentStack.style.zoom =
      zoom;

    $('zoomLabel').textContent =
      Math.round(zoom * 100) + '%';
  }

  $('zoomIn').addEventListener(
    'click',
    () => {
      zoom =
        Math.min(
          1,
          zoom + 0.08
        );

      applyZoom();
    }
  );

  $('zoomOut').addEventListener(
    'click',
    () => {
      zoom =
        Math.max(
          0.4,
          zoom - 0.08
        );

      applyZoom();
    }
  );

  update();
  applyZoom();
})();
