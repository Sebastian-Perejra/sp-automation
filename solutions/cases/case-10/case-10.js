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

  function dateUa(value) {
    if (!value) {
      return '—';
    }

    const [y, m, d] = value.split('-').map(Number);

    const months = [
      'січня',
      'лютого',
      'березня',
      'квітня',
      'травня',
      'червня',
      'липня',
      'серпня',
      'вересня',
      'жовтня',
      'листопада',
      'грудня'
    ];

    return `${String(d).padStart(2, '0')} ${months[m - 1]} ${y} року`;
  }

  function money(n) {
    return new Intl.NumberFormat('uk-UA', {
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
      'чотири',
      'п’ять',
      'шість',
      'сім',
      'вісім',
      'дев’ять'
    ];

    const onesF = [
      '',
      'одна',
      'дві',
      'три',
      'чотири',
      'п’ять',
      'шість',
      'сім',
      'вісім',
      'дев’ять'
    ];

    const teens = [
      'десять',
      'одинадцять',
      'дванадцять',
      'тринадцять',
      'чотирнадцять',
      'п’ятнадцять',
      'шістнадцять',
      'сімнадцять',
      'вісімнадцять',
      'дев’ятнадцять'
    ];

    const tens = [
      '',
      '',
      'двадцять',
      'тридцять',
      'сорок',
      'п’ятдесят',
      'шістдесят',
      'сімдесят',
      'вісімдесят',
      'дев’яносто'
    ];

    const hundreds = [
      '',
      'сто',
      'двісті',
      'триста',
      'чотириста',
      'п’ятсот',
      'шістсот',
      'сімсот',
      'вісімсот',
      'дев’ятсот'
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
      return 'нуль гривень';
    }

    const parts = [];
    const millions = Math.floor(num / 1000000);
    const thousands = Math.floor((num % 1000000) / 1000);
    const rest = num % 1000;

    if (millions) {
      parts.push(
        triad(
          millions,
          ['мільйон', 'мільйони', 'мільйонів']
        )
      );
    }

    if (thousands) {
      parts.push(
        triad(
          thousands,
          ['тисяча', 'тисячі', 'тисяч'],
          true
        )
      );
    }

    if (rest) {
      parts.push(triad(rest, null));
    }

    const x = num % 100;
    let form = 'гривень';

    if (x < 11 || x > 19) {
      const z = num % 10;

      if (z === 1) {
        form = 'гривня';
      } else if (z >= 2 && z <= 4) {
        form = 'гривні';
      }
    }

    return `${parts.join(' ')} ${form}`;
  }

  function providerVatText() {
    return $('providerVat').value === 'yes'
      ? 'платник ПДВ'
      : 'не платник ПДВ';
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
      <span>Договір надання послуг</span>
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
      <span>Демонстраційний шаблон</span>
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
      dateUa(get('contractDate'));

    $('outNo').textContent =
      get('contractNo') || '—';

    $('outPlace').textContent =
      get('place') || '—';

    const customer =
      get('customerName') || 'ЗАМОВНИК';

    const director =
      get('customerDirector') ||
      'УПОВНОВАЖЕНА ОСОБА';

    const provider =
      get('providerName') || 'ВИКОНАВЕЦЬ';

    $('outPreamble').textContent =
      `${customer}, в особі директора ${director}, ` +
      `що діє на підставі Статуту ` +
      `(далі — «Замовник»), з однієї сторони, та ` +
      `${provider}, що діє на підставі запису про ` +
      `державну реєстрацію фізичної особи-підприємця ` +
      `(далі — «Виконавець»), з іншої сторони, ` +
      `разом надалі — «Сторони», а кожна окремо — ` +
      `«Сторона», уклали цей Договір про таке:`;

    $('clause11').textContent =
      `1.1. Виконавець зобов’язується за завданням ` +
      `Замовника надати послуги з ` +
      `${get('serviceText') || 'погодженого переліку робіт'}, ` +
      `а Замовник зобов’язується прийняти належно ` +
      `надані послуги та здійснити їх оплату ` +
      `на умовах цього Договору.`;

    $('clause13').textContent =
      `1.3. Строк виконання погодженого обсягу послуг ` +
      `становить до ${get('workDays') || '0'} робочих днів ` +
      `з дати отримання Виконавцем авансового платежу, ` +
      `необхідних вихідних даних, доступів та погоджень ` +
      `від Замовника, якщо Сторони письмово не погодили ` +
      `інший строк.`;

    const price =
      Number(get('price') || 0);

    const advance =
      Number(get('advance') || 0);

    const prepay =
      price * advance / 100;

    const vatClause =
      $('providerVat').value === 'yes'
        ? 'у тому числі ПДВ відповідно до чинного законодавства'
        : 'без ПДВ у зв’язку із застосуванням Виконавцем спрощеної системи оподаткування';

    $('clause31').textContent =
      `3.1. Загальна вартість послуг за цим Договором ` +
      `становить ${money(price)} грн ` +
      `(${numWords(price)} 00 копійок), ${vatClause}.`;

    $('clause32').textContent =
      `3.2. Замовник здійснює авансовий платіж ` +
      `у розмірі ${advance}% від загальної вартості послуг, ` +
      `що становить ${money(prepay)} грн, протягом ` +
      `3 банківських днів з дати отримання рахунку Виконавця.`;

    $('clause51').textContent =
      `5.1. Гарантійний строк становить ` +
      `${get('warrantyDays') || '0'} календарних днів ` +
      `з моменту прийняття результату Замовником ` +
      `та поширюється на функціональність у межах ` +
      `погоджених вимог.`;

    $('clause91').textContent =
      `9.1. Цей Договір набирає чинності з моменту ` +
      `його підписання Сторонами та діє до ` +
      `${dateUa(get('endDate'))}, а в частині ` +
      `невиконаних зобов’язань – до їх повного виконання.`;

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
      'За замовчуванням: ДСТУ';

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
      'Пресет: Корпоративний';

    $('previewStatus').textContent =
      'Корпоративний стиль';
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
    presetDstu
  );

  $('printBtn').addEventListener(
    'click',
    () => window.print()
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
