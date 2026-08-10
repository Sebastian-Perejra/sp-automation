(() => {
  const layer = document.getElementById('codeArtifacts');
  if (!layer) return;

  const fragments = [
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
  '{ status: "success", rows: 1842 }',

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
];

  let lastIndex = -1;

  function random(min, max) {
    return Math.random() * (max - min) + min;
  }

  function getFragment() {
    let index;

    do {
      index = Math.floor(Math.random() * fragments.length);
    } while (index === lastIndex && fragments.length > 1);

    lastIndex = index;
    return fragments[index];
  }

  function createArtifact() {
    const artifact = document.createElement('span');
    artifact.className = 'code-artifact';
    artifact.textContent = getFragment();

    const side = Math.random() < 0.5 ? 'left' : 'right';

    const x =
      side === 'left'
        ? random(2, 24)
        : random(76, 94);

    const y = random(16, 82);

    artifact.style.left = `${x}%`;
    artifact.style.top = `${y}%`;

    artifact.style.setProperty(
      '--artifact-opacity',
      random(0.18, 0.38).toFixed(2)
    );

    artifact.style.fontSize =
      `${random(8, 11).toFixed(1)}px`;

    layer.appendChild(artifact);

    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        artifact.classList.add('is-visible');
      });
    });

    const visibleTime = random(6500, 10000);

    setTimeout(() => {
      artifact.classList.remove('is-visible');
      artifact.classList.add('is-fading');

      setTimeout(() => {
        artifact.remove();
      }, 2200);
    }, visibleTime);
  }

  function scheduleNext() {
    const delay = random(7000, 12000);

    setTimeout(() => {
      createArtifact();

      if (Math.random() < 0.18) {
  setTimeout(createArtifact, random(1800, 3200));
}

      scheduleNext();
    }, delay);
  }

  setTimeout(() => {
    createArtifact();
    scheduleNext();
  }, 1800);
})();
