window.SOLUTIONS_CASES_UK = [
  {
    id: 1,
    title: "Автоматична обробка банківських виписок",
    type: "FINANCE AUTOMATION",
    short: "Брудні рядки банківської виписки → контрагент → призначення платежу → категорія → готовий структурований результат.",
    featured: false,
    priority: 62,
    concepts: [
      "automation",
      "bank",
      "payments",
      "categorization",
      "counterparty",
      "finance",
      "data_cleaning",
      "data_matching"
    ],
    tools: [
      "Excel",
      "Google Apps Script",
      "OCR"
    ],
    tags: [
      "банк",
      "платежі",
      "виписка",
      "категоризація",
      "контрагент"
    ],
    aliases: [
      "обробка банківської виписки",
      "розбір банківської виписки",
      "парсинг банківської виписки",
      "банковская выписка автоматизация",
      "разнести платежи",
      "категоризувати платежі",
      "bank statement parser"
    ],
    problems: [
      "вручну розношу банківські операції",
      "ручная обработка банковской выписки",
      "треба визначати контрагентів у платежах",
      "надо распределить банковские платежи по категориям"
    ],
    outcomes: [
      "структуровані платежі",
      "автоматична категоризація",
      "визначені контрагенти"
    ]
  },

  {
    id: 2,
    title: "Автоматичний парсинг PDF-інвойсів і пакувальних листів",
    type: "DOCUMENT AUTOMATION",
    short: "PDF у Google Drive → OCR → визначення типу документа → парсинг позицій → RAW / УПАКОВ → архів.",
    featured: false,
    priority: 72,
    concepts: [
      "automation",
      "pdf",
      "invoice",
      "packing",
      "ocr",
      "google_drive",
      "data_matching",
      "documents"
    ],
    tools: [
      "PDF",
      "OCR",
      "Google Drive",
      "Google Docs",
      "Google Sheets",
      "Google Apps Script"
    ],
    tags: [
      "інвойси",
      "packing list",
      "OCR",
      "парсер",
      "PDF"
    ],
    aliases: [
      "парсер інвойсів",
      "розпізнати pdf рахунок",
      "витягнути дані з pdf",
      "парсинг pdf",
      "invoice parser",
      "packing list parser",
      "распознать счет pdf",
      "обработать pdf документы"
    ],
    problems: [
      "вручну переписую позиції з pdf",
      "данные из счетов надо переносить в excel",
      "треба розпізнати інвойси",
      "надо читать упаковочные листы"
    ],
    outcomes: [
      "позиції з PDF у таблиці",
      "автоматичний OCR",
      "архівація оброблених PDF"
    ]
  },

  {
    id: 3,
    title: "Автоматичне створення дашборда з Excel-таблиці",
    type: "EXCEL ANALYTICS",
    short: "200 рядків продажів → агрегація → KPI → графіки → готовий аналітичний дашборд.",
    featured: false,
    priority: 58,
    concepts: [
      "automation",
      "excel",
      "dashboard",
      "analytics",
      "kpi",
      "reporting",
      "sales"
    ],
    tools: [
      "Excel",
      "JavaScript",
      "Dashboard"
    ],
    tags: [
      "дашборд",
      "Excel",
      "KPI",
      "продажі",
      "графіки"
    ],
    aliases: [
      "дашборд з excel",
      "звіт з excel",
      "графіки з excel",
      "excel dashboard",
      "sales dashboard",
      "отчет из excel",
      "визуализация excel",
      "побудувати kpi"
    ],
    problems: [
      "є таблиця excel хочу дашборд",
      "есть данные продаж нужен отчет",
      "треба автоматично будувати графіки",
      "надо сделать kpi из таблицы"
    ],
    outcomes: [
      "KPI",
      "графіки",
      "аналітичний дашборд",
      "агреговані дані"
    ]
  },

  {
    id: 4,
    title: "Планування виробничих потужностей і строків виконання замовлень",
    type: "PRODUCTION PLANNING",
    short: "Замовлення + виробничі лінії + добова потужність → розподіл по днях → дата готовності → статус і завантаження.",
    featured: true,
    priority: 94,
    concepts: [
      "automation",
      "production",
      "capacity",
      "scheduling",
      "deadline",
      "priority",
      "forecast"
    ],
    tools: [
      "Production Planning",
      "Capacity",
      "Scheduling"
    ],
    tags: [
      "виробництво",
      "потужність",
      "строки",
      "дата готовності",
      "пріоритет"
    ],
    aliases: [
      "capacity planning",
      "production capacity",
      "виробничий план",
      "планування строків",
      "коли буде готове замовлення",
      "когда будет готов заказ",
      "расчет даты готовности",
      "загрузка производственных линий",
      "розрахунок потужності"
    ],
    problems: [
      "не знаю коли замовлення буде готове",
      "не понимаю когда заказ будет готов",
      "як розподілити замовлення між лініями",
      "как спланировать загрузку производства",
      "треба враховувати термінові замовлення"
    ],
    outcomes: [
      "дата готовності",
      "завантаження ліній",
      "виробничий календар",
      "статус замовлення"
    ]
  },

  {
    id: 5,
    title: "Автоматичний розрахунок потреби в комплектуючих",
    type: "BOM / PROCUREMENT",
    short: "Замовлення готових виробів → BOM → загальна потреба → складські залишки → точна кількість комплектуючих до закупівлі.",
    featured: true,
    priority: 92,
    concepts: [
      "automation",
      "bom",
      "procurement",
      "stock",
      "mrp",
      "production",
      "data_matching"
    ],
    tools: [
      "BOM",
      "MRP Logic",
      "Stock",
      "Procurement"
    ],
    tags: [
      "BOM",
      "комплектуючі",
      "закупівлі",
      "залишки",
      "потреба"
    ],
    aliases: [
      "розрахунок комплектуючих",
      "планування закупівель",
      "расчет комплектующих",
      "план закупок",
      "bom calculator",
      "material requirements",
      "mrp",
      "що треба закупити",
      "что нужно закупить"
    ],
    problems: [
      "вручну рахую деталі на замовлення",
      "вручную считаю комплектующие",
      "не знаю скільки закупити",
      "не знаю сколько закупить",
      "треба врахувати складські залишки",
      "надо учесть остатки склада"
    ],
    outcomes: [
      "точна потреба",
      "список до закупівлі",
      "враховані залишки",
      "план комплектуючих"
    ]
  },

  {
    id: 6,
    title: "Автоматизація управлінської звітності в Power BI",
    type: "MANAGEMENT BI",
    short: "ERP / 1C / SAP → Power Query → модель даних → DAX → інтерактивний Power BI-звіт з автоматичним оновленням.",
    featured: true,
    priority: 100,
    concepts: [
      "automation",
      "reporting",
      "powerbi",
      "dashboard",
      "analytics",
      "kpi",
      "planfact",
      "powerquery",
      "erp",
      "integration",
      "realtime",
      "sales",
      "finance"
    ],
    tools: [
      "Power BI",
      "Power Query",
      "DAX",
      "ERP",
      "SAP",
      "1C",
      "Data Gateway"
    ],
    tags: [
      "Power BI",
      "звітність",
      "дашборд",
      "DAX",
      "ERP",
      "план-факт"
    ],
    aliases: [
      "управлінський звіт power bi",
      "management reporting",
      "executive dashboard",
      "bi reporting",
      "павер биай отчет",
      "павер бі звіт",
      "звіт для керівництва",
      "отчет для руководства",
      "дашборд керівника",
      "автооновлення power bi",
      "power bi from sap",
      "power bi from 1c"
    ],
    problems: [
      "щомісяця вручну збираю звіт",
      "каждый месяц вручную собираю отчет",
      "багато версій excel звіту",
      "много версий excel отчета",
      "керівництву потрібні актуальні цифри",
      "руководству нужны актуальные данные",
      "хочу бачити plan fact",
      "нужен план факт"
    ],
    outcomes: [
      "актуальна версія даних",
      "автоматичне оновлення",
      "інтерактивна аналітика",
      "єдина модель",
      "план-факт"
    ]
  },

  {
    id: 7,
    title: "Автоматичне об’єднання даних із сотень Excel-файлів",
    type: "DATA CONSOLIDATION",
    short: "Спільна папка з Excel-звітами → Power Query / Power BI → очищення → єдиний формат → один масив для аналізу.",
    featured: false,
    priority: 84,
    concepts: [
      "automation",
      "excel",
      "powerquery",
      "powerbi",
      "data_consolidation",
      "data_cleaning",
      "google_drive",
      "reporting",
      "realtime"
    ],
    tools: [
      "Excel",
      "Power Query",
      "Power BI",
      "Folder"
    ],
    tags: [
      "сотні файлів",
      "об’єднання",
      "Power Query",
      "папка",
      "консолідація"
    ],
    aliases: [
      "об'єднати excel файли",
      "звести сотні excel",
      "combine excel files",
      "folder consolidation",
      "power query from folder",
      "объединить файлы из папки",
      "собрать отчеты из папки",
      "консолідація excel звітів",
      "merge excel reports"
    ],
    problems: [
      "вручну копіюю дані з багатьох файлів",
      "вручную собираю данные из множества excel",
      "щотижня приходять нові excel файли",
      "каждую неделю новые отчеты в папке",
      "треба автоматично підхоплювати нові файли"
    ],
    outcomes: [
      "одне оновлення",
      "єдиний масив",
      "автоматичне підхоплення файлів",
      "очищені дані"
    ]
  },
 {
    id: 8,
    title: "Автоматизація нагадувань і задач через Telegram-бота",
    type: "TELEGRAM AUTOMATION",
    short: "Повідомлення або ручна задача → вибір часу → нагадування → повтор / відкласти / виконано.",
    featured: false,
    priority: 78,
    concepts: [
      "automation",
      "telegram",
      "bot",
      "notifications",
      "realtime"
    ],
    tools: [
      "Telegram",
      "Telegram Bot API",
      "Google Apps Script"
    ],
    tags: [
      "Telegram",
      "бот",
      "нагадування",
      "задачі",
      "follow-up"
    ],
    aliases: [
      "telegram бот",
      "бот для нагадувань",
      "нагадування в telegram",
      "telegram reminder bot",
      "бот для задач",
      "контроль задач",
      "follow-up bot",
      "нагадати про повідомлення",
      "переслати повідомлення як задачу",
      "повторні нагадування"
    ],
    problems: [
      "забуваю задачі з чатів",
      "повідомлення губляться в telegram",
      "треба нагадувати про задачі",
      "потрібно контролювати follow-up",
      "хочу створювати нагадування з повідомлень",
      "забуваю відповісти клієнту",
      "потрібні повторні нагадування поки задача не виконана"
    ],
    outcomes: [
      "автоматичні нагадування",
      "контроль задач",
      "повторні нагадування",
      "менше втрачених задач",
      "контроль follow-up",
      "задачі прямо в Telegram"
    ]
  }
];
