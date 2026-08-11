(() => {
  const earthImages = [
  'themes/noir-lime/assets/contacts/Earth_horizon_01.webp',
  'themes/noir-lime/assets/contacts/Earth_horizon_02.webp',
  'themes/noir-lime/assets/contacts/Earth_horizon_03.webp',
  'themes/noir-lime/assets/contacts/Earth_horizon_04.webp',
  'themes/noir-lime/assets/contacts/Earth_horizon_05.webp',
  'themes/noir-lime/assets/contacts/Earth_horizon_06.webp',
  'themes/noir-lime/assets/contacts/Earth_horizon_07.webp',
  'themes/noir-lime/assets/contacts/Earth_horizon_08.webp',
  'themes/noir-lime/assets/contacts/Earth_horizon_09.webp',
  'themes/noir-lime/assets/contacts/Earth_horizon_10.webp',
  'themes/noir-lime/assets/contacts/earth_01.webp',
  'themes/noir-lime/assets/contacts/earth_02.webp',
  'themes/noir-lime/assets/contacts/earth_03.webp',
  'themes/noir-lime/assets/contacts/earth_04.webp',
  'themes/noir-lime/assets/contacts/earth_05.webp',
  'themes/noir-lime/assets/contacts/earth_06.jpeg',
  'themes/noir-lime/assets/contacts/earth_07.webp',
  'themes/noir-lime/assets/contacts/earth_08.webp',
  'themes/noir-lime/assets/contacts/earth_9.jpeg',
  'themes/noir-lime/assets/contacts/earth_010.webp'
];
  const earthBackground =
    document.getElementById('earthBackground');

  if (earthBackground) {
    const earthLayers = Array.from(
      earthBackground.querySelectorAll(
        '.earth-background__image'
      )
    );

    if (earthLayers.length >= 2) {
      let currentImageIndex = 0;
      let activeLayerIndex = 0;

      earthLayers[0].style.backgroundImage =
        `url("${earthImages[0]}")`;

      earthLayers[0].classList.add('is-active');

      earthImages.forEach((src) => {
        const img = new Image();
        img.src = src;
      });

      function showNextEarthImage() {
        const nextImageIndex =
          (currentImageIndex + 1) % earthImages.length;

        const nextLayerIndex =
          activeLayerIndex === 0 ? 1 : 0;

        const currentLayer =
          earthLayers[activeLayerIndex];

        const nextLayer =
          earthLayers[nextLayerIndex];

        nextLayer.style.backgroundImage =
          `url("${earthImages[nextImageIndex]}")`;

        nextLayer.classList.add('is-active');
        currentLayer.classList.remove('is-active');

        currentImageIndex = nextImageIndex;
        activeLayerIndex = nextLayerIndex;
      }

      setInterval(showNextEarthImage, 16000);
    }
  }

  const layer =
    document.getElementById('codeArtifacts');

  const contactsShell =
    document.querySelector('.contacts-shell');

  if (!layer) return;

  function detectLanguage() {
    const fileName =
      window.location.pathname
        .split('/')
        .pop()
        .toLowerCase();

    if (fileName === 'contacts-ru.html') {
      return 'ru';
    }

    if (fileName === 'contacts-en.html') {
      return 'en';
    }

    return 'uk';
  }

  const currentLanguage = detectLanguage();

  const codeFragments = [
    'CALCULATE([Sales], ALL(Date))',
    'SUMX(FILTER(Sales, [Qty] > 0), [Amount])',
    'DIVIDE([Margin], [Revenue], 0)',
    'Table.TransformColumnTypes(Source, {...})',
    'Table.Group(Source, {"Customer"}, {...})',
    'Table.SelectRows(Source, each [Status] = "Active")',
    'let Source = Excel.CurrentWorkbook(){[Name="Data"]}[Content]',
    'const data = rows.filter(row => row.active);',
    'const total = items.reduce((sum, x) => sum + x.value, 0);',
    'document.querySelector(".case-card")',
    'await fetch("/api/data")',
    'Range("A1").Value = result',
    'Cells(row, 7).Value = total',
    '=SUMIFS($H:$H,$B:$B,B2)',
    '=XLOOKUP(A2,Data!A:A,Data!F:F,"")',
    '=FILTER(A2:G500,G2:G500<>"")',
    '2026-08-10T11:54:32',
    'ID_4821_773905',
    '0x7FA3C91D',
    '98.47%',
    'ROWS: 248,719',
    'REFRESH → 07:42:18',
    '[Query].[Result].[Value]',
    '{ status: "success", rows: 1842 }'
  ];

  const thoughtFragments = {
    uk: [
      'як це порахувати?',
      'як це автоматизувати?',
      'як це з’єднати?',
      'як це виконати автоматично?',
      'яка формула тут потрібна?',
      'чому це не рахується?',
      'як прибрати ручну роботу?',
      'як зв’язати ці таблиці?',
      'як підтягнути дані автоматично?',
      'як об’єднати ці файли?',
      'як знайти помилку?',
      'чому формула повертає пусто?',
      'як зробити це одним кліком?',
      'як не копіювати це вручну?',
      'як оновлювати дані автоматично?',
      'як звести все в одну таблицю?',
      'як знайти дублікати?',
      'як рознести це по категоріях?',
      'як зіставити ці дані?',
      'як побудувати логіку?',
      'як автоматично сформувати звіт?',
      'як це зробити без макросу?',
      'може тут потрібен Power Query?',
      'може це краще зробити через DAX?',
      'чи можна це зробити через JavaScript?',
      'як зв’язати Excel і Google Sheets?',
      'як підтягнути дані з API?',
      'як зробити перевірку автоматично?',
      'як виключити дублікати?',
      'як визначити останній запис?',
      'як знайти потрібний рядок?',
      'як зібрати дані з різних джерел?',
      'як обробити 20 000 рядків?',
      'як зробити це швидше?',
      'як позбутися цих ручних копіпастів?',
      'чому це займає стільки часу?',
      'це можна автоматизувати?',
      'як зробити, щоб воно саме оновлювалось?',
      'як зробити, щоб воно саме рахувало?',
      'як зробити, щоб воно саме розподіляло?',
      'як зробити, щоб воно саме перевіряло?',
      'як зробити, щоб воно саме формувало файл?',
      'як зробити, щоб воно саме відправляло результат?',
      'де тут помилка в логіці?',
      'чому дані не співпадають?',
      'як перевірити тисячі рядків?',
      'як звести це без ручної обробки?',
      'як автоматично визначити категорію?',
      'як автоматично знайти відповідність?',
      'як побудувати процес без людини?',
      'як це масштабувати?',
      'як перетворити це на нормальний процес?',
      'що тут можна автоматизувати?',
      'чи можна прибрати Excel-файл взагалі?',
      'чи можна зробити це через веб-інтерфейс?',
      'як зробити контроль помилок?',
      'як автоматично створити документ?',
      'як автоматично перейменувати файли?',
      'як автоматично розкласти файли по папках?',
      'як не перевіряти це вручну щодня?',
      'як зменшити кількість помилок?',
      'як це зробити стабільно?',
      'як це зробити без участі людини?',
      'яка тут має бути логіка?',
      'звідки краще брати ці дані?',
      'як синхронізувати ці джерела?',
      'чому тут різні формати?',
      'як очистити ці дані?',
      'як нормалізувати назви?',
      'як автоматично визначити статус?',
      'як побудувати правильний workflow?',
      'як зробити обробку пакетно?',
      'як уникнути повторної роботи?',
      'чи можна це запустити по кнопці?',
      'чи можна це запускати за розкладом?',
      'чи можна це зробити тригером?',
      'як зробити, щоб система сама реагувала?',
      'як автоматично сформувати результат?',
      'як перетворити цей хаос у структуру?'
    ],

    ru: [
      'как это посчитать?',
      'как это автоматизировать?',
      'как это связать?',
      'как выполнить это автоматически?',
      'какая формула здесь нужна?',
      'почему это не считается?',
      'как убрать ручную работу?',
      'как связать эти таблицы?',
      'как подтянуть данные автоматически?',
      'как объединить эти файлы?',
      'как найти ошибку?',
      'почему формула возвращает пустое значение?',
      'как сделать это одним кликом?',
      'как не копировать это вручную?',
      'как обновлять данные автоматически?',
      'как свести всё в одну таблицу?',
      'как найти дубликаты?',
      'как разнести это по категориям?',
      'как сопоставить эти данные?',
      'как построить логику?',
      'как автоматически сформировать отчёт?',
      'как сделать это без макроса?',
      'может, здесь нужен Power Query?',
      'может, это лучше сделать через DAX?',
      'можно ли сделать это через JavaScript?',
      'как связать Excel и Google Sheets?',
      'как подтянуть данные из API?',
      'как сделать проверку автоматической?',
      'как исключить дубликаты?',
      'как определить последнюю запись?',
      'как найти нужную строку?',
      'как собрать данные из разных источников?',
      'как обработать 20 000 строк?',
      'как сделать это быстрее?',
      'как избавиться от ручного копипаста?',
      'почему это занимает столько времени?',
      'это можно автоматизировать?',
      'как сделать, чтобы всё само обновлялось?',
      'как сделать, чтобы всё само считалось?',
      'как сделать, чтобы всё само распределялось?',
      'как сделать, чтобы всё само проверялось?',
      'как сделать, чтобы система сама формировала файл?',
      'как сделать, чтобы система сама отправляла результат?',
      'где здесь ошибка в логике?',
      'почему данные не совпадают?',
      'как проверить тысячи строк?',
      'как свести всё без ручной обработки?',
      'как автоматически определить категорию?',
      'как автоматически найти соответствие?',
      'как построить процесс без участия человека?',
      'как это масштабировать?',
      'как превратить это в нормальный процесс?',
      'что здесь можно автоматизировать?',
      'можно ли вообще убрать Excel-файл?',
      'можно ли сделать это через веб-интерфейс?',
      'как сделать контроль ошибок?',
      'как автоматически создать документ?',
      'как автоматически переименовать файлы?',
      'как автоматически разложить файлы по папкам?',
      'как не проверять это вручную каждый день?',
      'как уменьшить количество ошибок?',
      'как сделать это стабильным?',
      'как сделать это без участия человека?',
      'какая здесь должна быть логика?',
      'откуда лучше брать эти данные?',
      'как синхронизировать эти источники?',
      'почему здесь разные форматы?',
      'как очистить эти данные?',
      'как нормализовать названия?',
      'как автоматически определить статус?',
      'как построить правильный workflow?',
      'как сделать пакетную обработку?',
      'как избежать повторной работы?',
      'можно ли запускать это кнопкой?',
      'можно ли запускать это по расписанию?',
      'можно ли сделать это триггером?',
      'как сделать, чтобы система сама реагировала?',
      'как автоматически сформировать результат?',
      'как превратить этот хаос в структуру?'
    ],

    en: [
      'how can I calculate this?',
      'how can I automate this?',
      'how can I connect these?',
      'how can I run this automatically?',
      'which formula should I use here?',
      'why is this not calculating?',
      'how can I eliminate manual work?',
      'how can I connect these tables?',
      'how can I import the data automatically?',
      'how can I merge these files?',
      'how can I find the error?',
      'why does the formula return a blank value?',
      'how can I do this with one click?',
      'how can I avoid copying this manually?',
      'how can I update the data automatically?',
      'how can I consolidate everything into one table?',
      'how can I find duplicates?',
      'how can I split this into categories?',
      'how can I match these records?',
      'how can I build the logic?',
      'how can I generate the report automatically?',
      'how can I do this without a macro?',
      'maybe Power Query is needed here?',
      'maybe DAX would work better?',
      'can this be done with JavaScript?',
      'how can I connect Excel and Google Sheets?',
      'how can I pull data from an API?',
      'how can I automate the validation?',
      'how can I remove duplicates?',
      'how can I identify the latest record?',
      'how can I find the required row?',
      'how can I collect data from different sources?',
      'how can I process 20,000 rows?',
      'how can I make this faster?',
      'how can I get rid of manual copy-pasting?',
      'why does this take so much time?',
      'can this be automated?',
      'how can I make it update automatically?',
      'how can I make it calculate automatically?',
      'how can I make it distribute data automatically?',
      'how can I make it validate everything automatically?',
      'how can I make it generate the file automatically?',
      'how can I make it send the result automatically?',
      'where is the logic error?',
      'why does the data not match?',
      'how can I check thousands of rows?',
      'how can I consolidate this without manual processing?',
      'how can I determine the category automatically?',
      'how can I find the matching record automatically?',
      'how can I build a process without human intervention?',
      'how can I scale this?',
      'how can I turn this into a proper process?',
      'what can be automated here?',
      'can the Excel file be eliminated completely?',
      'can this be done through a web interface?',
      'how can I implement error control?',
      'how can I create a document automatically?',
      'how can I rename files automatically?',
      'how can I sort files into folders automatically?',
      'how can I stop checking this manually every day?',
      'how can I reduce the number of errors?',
      'how can I make this stable?',
      'how can I do this without human involvement?',
      'what should the logic be here?',
      'where should this data come from?',
      'how can I synchronize these sources?',
      'why are these formats different?',
      'how can I clean this data?',
      'how can I normalize these names?',
      'how can I determine the status automatically?',
      'how can I build the right workflow?',
      'how can I process this in batches?',
      'how can I avoid doing the same work twice?',
      'can I run this with a button?',
      'can I run this on a schedule?',
      'can this be triggered automatically?',
      'how can I make the system react automatically?',
      'how can I generate the result automatically?',
      'how can I turn this chaos into structure?'
    ]
  };

  const activeThoughts =
    thoughtFragments[currentLanguage];

  const fragments = [
    ...codeFragments,
    ...activeThoughts
  ];

  const thoughtSet =
    new Set(activeThoughts);

  let lastIndex = -1;

  function random(min, max) {
    return Math.random() * (max - min) + min;
  }

  function getFragment() {
    let index;

    do {
      index =
        Math.floor(
          Math.random() * fragments.length
        );
    } while (
      index === lastIndex &&
      fragments.length > 1
    );

    lastIndex = index;

    return fragments[index];
  }

  function createArtifact() {
    const artifact =
      document.createElement('span');

    const fragment =
      getFragment();

    artifact.className =
      'code-artifact';

    artifact.textContent =
      fragment;

    const isThought =
      thoughtSet.has(fragment);

    artifact.classList.add(
      isThought
        ? 'code-artifact--thought'
        : 'code-artifact--code'
    );

    let x;
    let y;
    let attempts = 0;

    const layerRect =
      layer.getBoundingClientRect();

    const contactRect =
      contactsShell
        ? contactsShell.getBoundingClientRect()
        : null;

    do {
      const side =
        Math.random() < 0.5
          ? 'left'
          : 'right';

      x =
        side === 'left'
          ? random(3, 20)
          : random(80, 90);

      y =
        random(16, 82);

      attempts++;

      if (!contactRect) {
        break;
      }

      const pointX =
        layerRect.left +
        (x / 100) * layerRect.width;

      const pointY =
        layerRect.top +
        (y / 100) * layerRect.height;

      const safeGap = 70;

      const insideProtectedZone =
        pointX >
          contactRect.left - safeGap &&
        pointX <
          contactRect.right + safeGap &&
        pointY >
          contactRect.top - safeGap &&
        pointY <
          contactRect.bottom + safeGap;

      if (!insideProtectedZone) {
        break;
      }
    } while (attempts < 50);

    artifact.style.left =
      `${x}%`;

    artifact.style.top =
      `${y}%`;

    artifact.style.setProperty(
      '--artifact-opacity',
      random(0.18, 0.38).toFixed(2)
    );

    artifact.style.fontSize =
      `${random(8, 11).toFixed(1)}px`;

    layer.appendChild(artifact);

    if (window.innerWidth <= 760) {
      requestAnimationFrame(() => {
        const mobileLayerRect =
          layer.getBoundingClientRect();

        const artifactRect =
          artifact.getBoundingClientRect();

        const edgeGap = 10;

        let left =
          artifact.offsetLeft;

        if (
          artifactRect.right >
          mobileLayerRect.right - edgeGap
        ) {
          left -=
            artifactRect.right -
            (
              mobileLayerRect.right -
              edgeGap
            );
        }

        if (
          artifactRect.left <
          mobileLayerRect.left + edgeGap
        ) {
          left +=
            (
              mobileLayerRect.left +
              edgeGap
            ) -
            artifactRect.left;
        }

        artifact.style.left =
          `${Math.max(edgeGap, left)}px`;
      });
    }

    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        artifact.classList.add(
          'is-visible'
        );
      });
    });

    const visibleTime =
      random(6500, 10000);

    setTimeout(() => {
      artifact.classList.remove(
        'is-visible'
      );

      artifact.classList.add(
        'is-fading'
      );

      setTimeout(() => {
        artifact.remove();
      }, 2200);
    }, visibleTime);
  }

  function scheduleNext() {
    const delay =
      random(7000, 12000);

    setTimeout(() => {
      createArtifact();

      if (Math.random() < 0.18) {
        setTimeout(
          createArtifact,
          random(1800, 3200)
        );
      }

      scheduleNext();
    }, delay);
  }

  setTimeout(() => {
    createArtifact();
    scheduleNext();
  }, 1800);
})();
