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

  function formatDate(value) {
    if (!value) {
      return '—';
    }

    const [year, month, day] =
      value.split('-').map(Number);

    const date =
      new Date(year, month - 1, day);

    return new Intl.DateTimeFormat(
      'en-US',
      {
        month: 'long',
        day: 'numeric',
        year: 'numeric'
      }
    ).format(date);
  }

  function money(value) {
    return new Intl.NumberFormat(
      'en-US',
      {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      }
    ).format(Number(value || 0));
  }

  function underThousand(number) {
    const ones = [
      '',
      'one',
      'two',
      'three',
      'four',
      'five',
      'six',
      'seven',
      'eight',
      'nine',
      'ten',
      'eleven',
      'twelve',
      'thirteen',
      'fourteen',
      'fifteen',
      'sixteen',
      'seventeen',
      'eighteen',
      'nineteen'
    ];

    const tens = [
      '',
      '',
      'twenty',
      'thirty',
      'forty',
      'fifty',
      'sixty',
      'seventy',
      'eighty',
      'ninety'
    ];

    const parts = [];
    const hundreds =
      Math.floor(number / 100);

    const remainder =
      number % 100;

    if (hundreds) {
      parts.push(
        `${ones[hundreds]} hundred`
      );
    }

    if (remainder < 20) {
      if (remainder) {
        parts.push(ones[remainder]);
      }
    } else {
      const tensValue =
        Math.floor(remainder / 10);

      const onesValue =
        remainder % 10;

      if (onesValue) {
        parts.push(
          `${tens[tensValue]}-${ones[onesValue]}`
        );
      } else {
        parts.push(
          tens[tensValue]
        );
      }
    }

    return parts.join(' ');
  }

  function numberWords(value) {
    let number =
      Math.floor(
        Math.abs(
          Number(value || 0)
        )
      );

    if (number === 0) {
      return 'zero hryvnias';
    }

    const parts = [];

    const billions =
      Math.floor(
        number / 1000000000
      );

    number %=
      1000000000;

    const millions =
      Math.floor(
        number / 1000000
      );

    number %=
      1000000;

    const thousands =
      Math.floor(
        number / 1000
      );

    const remainder =
      number % 1000;

    if (billions) {
      parts.push(
        `${underThousand(billions)} billion`
      );
    }

    if (millions) {
      parts.push(
        `${underThousand(millions)} million`
      );
    }

    if (thousands) {
      parts.push(
        `${underThousand(thousands)} thousand`
      );
    }

    if (remainder) {
      parts.push(
        underThousand(remainder)
      );
    }

    const original =
      Math.floor(
        Math.abs(
          Number(value || 0)
        )
      );

    const currency =
      original === 1
        ? 'hryvnia'
        : 'hryvnias';

    return `${parts.join(' ')} ${currency}`;
  }

  function providerVatText() {
    return $('providerVat').value === 'yes'
      ? 'VAT registered'
      : 'not VAT registered';
  }

  function createContractPage(pageNumber) {
    const page =
      document.createElement('section');

    page.className =
      'doc-page';

    page.dataset.page =
      String(pageNumber);

    const header =
      document.createElement('div');

    header.className =
      'doc-header';

    header.innerHTML = `
      <div class="brand">
        <img class="header-logo" alt="">
        <span class="header-label">SP Automation · Contract Generator</span>
      </div>
      <span>Service Agreement</span>
    `;

    const pageNum =
      document.createElement('div');

    pageNum.className =
      'page-num';

    pageNum.textContent =
      String(pageNumber);

    const inner =
      document.createElement('div');

    inner.className =
      'page-inner';

    const footer =
      document.createElement('div');

    footer.className =
      'doc-footer';

    footer.innerHTML = `
      <span class="footer-label">sp-automation.com</span>
      <span>Demo Template</span>
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
    return (
      inner.scrollHeight <=
      inner.clientHeight + 2
    );
  }

  function buildPaginationGroups() {
    const groups = [];
    let index = 0;

    while (
      index < contractBlocks.length
    ) {
      const current =
        contractBlocks[index];

      if (
        current.classList.contains(
          'requisites-title'
        )
      ) {
        groups.push({
          blocks:
            contractBlocks.slice(index),
          forceNewPage: true
        });

        break;
      }

      if (
        current.classList.contains(
          'doc-title'
        )
      ) {
        const blocks = [current];

        index++;

        while (
          index < contractBlocks.length &&
          !contractBlocks[index]
            .classList
            .contains('section-title') &&
          !contractBlocks[index]
            .classList
            .contains('requisites-title')
        ) {
          blocks.push(
            contractBlocks[index]
          );

          index++;
        }

        groups.push({
          blocks,
          forceNewPage: false
        });

        continue;
      }

      if (
        current.classList.contains(
          'section-title'
        )
      ) {
        const blocks = [current];

        index++;

        if (
          index < contractBlocks.length &&
          !contractBlocks[index]
            .classList
            .contains('section-title') &&
          !contractBlocks[index]
            .classList
            .contains('requisites-title')
        ) {
          blocks.push(
            contractBlocks[index]
          );

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
      .querySelectorAll(
        '.clause, .doc-preamble'
      )
      .forEach(el => {
        el.style.textAlign =
          $('justify').checked
            ? 'justify'
            : 'left';
      });

    caseRoot
      .querySelectorAll(
        '.page-num'
      )
      .forEach(el => {
        el.classList.toggle(
          'on',
          $('pageNumbers').checked
        );
      });

    caseRoot
      .querySelectorAll(
        '.doc-header'
      )
      .forEach(el => {
        el.classList.toggle(
          'on',
          $('headerOn').checked
        );
      });

    caseRoot
      .querySelectorAll(
        '.header-logo'
      )
      .forEach(el => {
        el.src = logoData;

        el.classList.toggle(
          'on',
          $('logoOn').checked &&
          $('headerOn').checked
        );
      });

    caseRoot
      .querySelectorAll(
        '.header-label'
      )
      .forEach(el => {
        el.textContent =
          get('headerText');
      });

    caseRoot
      .querySelectorAll(
        '.doc-footer'
      )
      .forEach(el => {
        el.classList.toggle(
          'on',
          $('footerOn').checked
        );
      });

    caseRoot
      .querySelectorAll(
        '.footer-label'
      )
      .forEach(el => {
        el.textContent =
          get('footerText');
      });

    caseRoot
      .querySelectorAll(
        '.doc-page'
      )
      .forEach(el => {
        el.classList.toggle(
          'border-on',
          $('borderOn').checked
        );
      });
  }

  function paginateContract() {
    const oldScrollTop =
      previewScroll
        ? previewScroll.scrollTop
        : 0;

    documentStack.innerHTML =
      '';

    const groups =
      buildPaginationGroups();

    let pageNumber = 1;

    let currentPage =
      createContractPage(
        pageNumber
      );

    documentStack.appendChild(
      currentPage.page
    );

    function newPage() {
      pageNumber++;

      currentPage =
        createContractPage(
          pageNumber
        );

      documentStack.appendChild(
        currentPage.page
      );
    }

    function appendSingle(block) {
      currentPage.inner.appendChild(
        block
      );

      if (
        pageFits(
          currentPage.inner
        )
      ) {
        return;
      }

      block.remove();

      if (
        currentPage.inner.children.length
      ) {
        newPage();
      }

      currentPage.inner.appendChild(
        block
      );
    }

    groups.forEach(group => {
      if (
        group.forceNewPage &&
        currentPage.inner.children.length
      ) {
        newPage();
      }

      group.blocks.forEach(block => {
        currentPage.inner.appendChild(
          block
        );
      });

      if (
        pageFits(
          currentPage.inner
        )
      ) {
        return;
      }

      group.blocks.forEach(block => {
        block.remove();
      });

      if (
        currentPage.inner.children.length
      ) {
        newPage();
      }

      group.blocks.forEach(block => {
        currentPage.inner.appendChild(
          block
        );
      });

      if (
        !pageFits(
          currentPage.inner
        ) &&
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
      previewScroll.scrollTop =
        Math.min(
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
      formatDate(
        get('contractDate')
      );

    $('outNo').textContent =
      get('contractNo') || '—';

    $('outPlace').textContent =
      get('place') || '—';

    const customer =
      get('customerName') ||
      'CLIENT';

    const director =
      get('customerDirector') ||
      'AUTHORIZED REPRESENTATIVE';

    const provider =
      get('providerName') ||
      'SERVICE PROVIDER';

    $('outPreamble').textContent =
      `${customer}, represented by ${director}, ` +
      `duly authorized to act on its behalf ` +
      `(the “Client”), and ${provider} ` +
      `(the “Service Provider”), collectively referred to ` +
      `as the “Parties” and individually as a “Party,” ` +
      `enter into this Service Agreement as follows:`;

    $('clause11').textContent =
      `1.1. The Service Provider will provide the Client with ` +
      `${get('serviceText') || 'the agreed services'}, ` +
      `and the Client will accept and pay for those services ` +
      `in accordance with the terms of this Agreement.`;

    $('clause13').textContent =
      `1.3. The Service Provider will complete the agreed scope ` +
      `within up to ${get('workDays') || '0'} business days ` +
      `after receiving the required upfront payment, source data, ` +
      `system access, information, and approvals from the Client, ` +
      `unless the Parties agree to a different schedule in writing.`;

    const price =
      Number(
        get('price') || 0
      );

    const advance =
      Number(
        get('advance') || 0
      );

    const prepay =
      price * advance / 100;

    const vatClause =
      $('providerVat').value === 'yes'
        ? 'including VAT as required under applicable law'
        : 'VAT is not charged because the Service Provider is not VAT registered';

    $('clause31').textContent =
      `3.1. The total fee for the services under this Agreement ` +
      `is UAH ${money(price)} ` +
      `(${numberWords(price)} and 00 kopiykas); ${vatClause}.`;

    $('clause32').textContent =
      `3.2. The Client will make an upfront payment equal to ` +
      `${advance}% of the total contract value, or ` +
      `UAH ${money(prepay)}, within three banking days ` +
      `after receiving the Service Provider's invoice.`;

    $('clause51').textContent =
      `5.1. The Service Provider provides a warranty period of ` +
      `${get('warrantyDays') || '0'} calendar days ` +
      `beginning on the date the Client accepts the applicable deliverable. ` +
      `The warranty covers functionality within the agreed requirements.`;

    $('clause91').textContent =
      `9.1. This Agreement becomes effective when signed by both Parties ` +
      `and remains in effect through ${formatDate(get('endDate'))}. ` +
      `Any obligations that remain outstanding on that date ` +
      `will continue until fully performed.`;

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
      fontFamily:
        'Times New Roman',
      fontSize:
        '12',
      lineHeight:
        '1.15',
      titleSize:
        '14',
      marginLeft:
        '30',
      marginRight:
        '10',
      marginTop:
        '20',
      marginBottom:
        '20',
      justify:
        true,
      pageNumbers:
        true,
      headerOn:
        false,
      logoOn:
        false,
      footerOn:
        false,
      borderOn:
        false
    });

    $('presetName').textContent =
      'Default: DSTU';

    $('previewStatus').textContent =
      'DSTU 4163:2020';
  }

  function presetCorporate() {
    setState({
      fontFamily:
        'Arial',
      fontSize:
        '11',
      lineHeight:
        '1.15',
      titleSize:
        '14',
      marginLeft:
        '20',
      marginRight:
        '20',
      marginTop:
        '24',
      marginBottom:
        '22',
      justify:
        true,
      pageNumbers:
        true,
      headerOn:
        true,
      logoOn:
        true,
      footerOn:
        true,
      borderOn:
        true
    });

    $('presetName').textContent =
      'Preset: Corporate';

    $('previewStatus').textContent =
      'Corporate Style';
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
      btn.addEventListener(
        'click',
        () => {
          caseRoot
            .querySelectorAll('.tab')
            .forEach(tab => {
              tab.classList.remove(
                'active'
              );
            });

          caseRoot
            .querySelectorAll(
              '.tab-content'
            )
            .forEach(content => {
              content.classList.remove(
                'active'
              );
            });

          btn.classList.add(
            'active'
          );

          $('tab-' + btn.dataset.tab)
            .classList.add(
              'active'
            );
        }
      );
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
        if (
          el.type === 'checkbox'
        ) {
          el.checked =
            el.defaultChecked;

          return;
        }

        if (
          el.tagName === 'SELECT'
        ) {
          const selected =
            Array.from(
              el.options
            ).find(
              option =>
                option.defaultSelected
            ) ||
            el.options[0];

          if (selected) {
            el.value =
              selected.value;
          }

          return;
        }

        el.value =
          el.defaultValue;
      });

      $('presetName').textContent =
        'Default: DSTU';

      $('previewStatus').textContent =
        'DSTU 4163:2020';

      zoom = 0.72;

      applyZoom();

      caseRoot
        .querySelectorAll('.tab')
        .forEach(tab => {
          tab.classList.remove(
            'active'
          );
        });

      caseRoot
        .querySelectorAll(
          '.tab-content'
        )
        .forEach(content => {
          content.classList.remove(
            'active'
          );
        });

      const firstTab =
        caseRoot.querySelector(
          '.tab[data-tab="data"]'
        );

      firstTab.classList.add(
        'active'
      );

      $('tab-data').classList.add(
        'active'
      );

      update();

      requestAnimationFrame(
        () => {
          if (previewScroll) {
            previewScroll.scrollTop =
              0;

            previewScroll.scrollLeft =
              0;
          }
        }
      );
    }
  );

  $('printBtn').addEventListener(
    'click',
    () => {
      const frame =
        document.createElement(
          'iframe'
        );

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
        getComputedStyle(
          caseRoot
        );

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
          .map(
            name =>
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
        <html lang="en">
        <head>
          <meta charset="UTF-8">
          <title>Service Agreement ${get('contractNo')}</title>
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

      const printNow =
        () => {
          frame
            .contentWindow
            .focus();

          frame
            .contentWindow
            .print();

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

      const flash =
        $('flash');

      flash.classList.add(
        'show'
      );

      setTimeout(
        () => {
          flash.classList.remove(
            'show'
          );
        },
        1800
      );
    }
  );

  function applyZoom() {
    documentStack.style.zoom =
      zoom;

    $('zoomLabel').textContent =
      Math.round(
        zoom * 100
      ) + '%';
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
