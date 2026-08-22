window.SOLUTIONS_CASES_RU = [
  {
    id: 1,
    title: "Автоматическая обработка банковских выписок",
    type: "FINANCE AUTOMATION",
    short: "Сырые строки банковской выписки → контрагент → назначение платежа → категория → готовый структурированный результат.",
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
      "платежи",
      "выписка",
      "категоризация",
      "контрагент"
    ],
    aliases: [
      "обработка банковской выписки",
      "разбор банковской выписки",
      "парсинг банковской выписки",
      "автоматизация банковской выписки",
      "разнести платежи",
      "категоризировать платежи",
      "bank statement parser"
    ],
    problems: [
      "вручную разношу банковские операции",
      "ручная обработка банковской выписки",
      "нужно определять контрагентов в платежах",
      "надо распределить банковские платежи по категориям"
    ],
    outcomes: [
      "структурированные платежи",
      "автоматическая категоризация",
      "определенные контрагенты"
    ]
  },

  {
    id: 2,
    title: "Автоматический парсинг PDF-инвойсов и упаковочных листов",
    type: "DOCUMENT AUTOMATION",
    short: "PDF в Google Drive → OCR → определение типа документа → парсинг позиций → RAW / PACKING → архив.",
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
      "инвойсы",
      "packing list",
      "OCR",
      "парсер",
      "PDF"
    ],
    aliases: [
      "парсер инвойсов",
      "распознать pdf счет",
      "извлечь данные из pdf",
      "парсинг pdf",
      "invoice parser",
      "packing list parser",
      "обработать pdf документы",
      "извлечь позиции из инвойса"
    ],
    problems: [
      "вручную переписываю позиции из pdf",
      "данные из счетов надо переносить в excel",
      "нужно распознавать инвойсы",
      "надо читать упаковочные листы"
    ],
    outcomes: [
      "позиции из PDF в таблице",
      "автоматический OCR",
      "архивация обработанных PDF"
    ]
  },

  {
    id: 3,
    title: "Автоматическое создание дашборда из Excel-таблицы",
    type: "EXCEL ANALYTICS",
    short: "200 строк продаж → агрегация → KPI → графики → готовый аналитический дашборд.",
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
      "продажи",
      "графики"
    ],
    aliases: [
      "дашборд из excel",
      "отчет из excel",
      "графики из excel",
      "excel dashboard",
      "sales dashboard",
      "визуализация excel",
      "построить kpi",
      "автоматический дашборд"
    ],
    problems: [
      "есть таблица excel хочу дашборд",
      "есть данные продаж нужен отчет",
      "нужно автоматически строить графики",
      "надо сделать kpi из таблицы"
    ],
    outcomes: [
      "KPI",
      "графики",
      "аналитический дашборд",
      "агрегированные данные"
    ]
  },

  {
    id: 4,
    title: "Планирование производственных мощностей и сроков выполнения заказов",
    type: "PRODUCTION PLANNING",
    short: "Заказы + производственные линии + суточная мощность → распределение по дням → дата готовности → статус и загрузка.",
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
      "производство",
      "мощность",
      "сроки",
      "дата готовности",
      "приоритет"
    ],
    aliases: [
      "capacity planning",
      "production capacity",
      "производственный план",
      "планирование сроков",
      "когда будет готов заказ",
      "расчет даты готовности",
      "загрузка производственных линий",
      "планирование производства"
    ],
    problems: [
      "не знаю когда заказ будет готов",
      "как распределить заказы между линиями",
      "как спланировать загрузку производства",
      "нужно учитывать срочные заказы",
      "надо рассчитать реальную дату готовности"
    ],
    outcomes: [
      "дата готовности",
      "загрузка линий",
      "производственный календарь",
      "статус заказа"
    ]
  },

  {
    id: 5,
    title: "Автоматический расчет потребности в комплектующих",
    type: "BOM / PROCUREMENT",
    short: "Заказы готовых изделий → BOM → общая потребность → складские остатки → точное количество комплектующих к закупке.",
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
      "комплектующие",
      "закупки",
      "остатки",
      "потребность"
    ],
    aliases: [
      "расчет комплектующих",
      "планирование закупок",
      "расчет потребности",
      "план закупок",
      "bom calculator",
      "material requirements",
      "mrp",
      "что нужно закупить"
    ],
    problems: [
      "вручную считаю детали на заказ",
      "вручную считаю комплектующие",
      "не знаю сколько закупить",
      "нужно учитывать складские остатки",
      "надо рассчитать потребность в материалах"
    ],
    outcomes: [
      "точная потребность",
      "список к закупке",
      "учтенные остатки",
      "план комплектующих"
    ]
  },

  {
    id: 6,
    title: "Автоматизация управленческой отчетности в Power BI",
    type: "MANAGEMENT BI",
    short: "ERP / 1C / SAP → Power Query → модель данных → DAX → интерактивный Power BI-отчет с автоматическим обновлением.",
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
      "отчетность",
      "дашборд",
      "DAX",
      "ERP",
      "план-факт"
    ],
    aliases: [
      "управленческий отчет power bi",
      "management reporting",
      "executive dashboard",
      "bi reporting",
      "павер биай отчет",
      "отчет для руководства",
      "дашборд руководителя",
      "автообновление power bi",
      "power bi from sap",
      "power bi from 1c"
    ],
    problems: [
      "каждый месяц вручную собираю отчет",
      "много версий excel отчета",
      "руководству нужны актуальные данные",
      "нужен план факт",
      "хочу единый источник данных"
    ],
    outcomes: [
      "актуальная версия данных",
      "автоматическое обновление",
      "интерактивная аналитика",
      "единая модель",
      "план-факт"
    ]
  },

  {
    id: 7,
    title: "Автоматическое объединение данных из сотен Excel-файлов",
    type: "DATA CONSOLIDATION",
    short: "Общая папка с Excel-отчетами → Power Query / Power BI → очистка → единый формат → один массив для анализа.",
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
      "сотни файлов",
      "объединение",
      "Power Query",
      "папка",
      "консолидация"
    ],
    aliases: [
      "объединить excel файлы",
      "свести сотни excel",
      "combine excel files",
      "folder consolidation",
      "power query from folder",
      "объединить файлы из папки",
      "собрать отчеты из папки",
      "консолидация excel отчетов"
    ],
    problems: [
      "вручную копирую данные из многих файлов",
      "вручную собираю данные из множества excel",
      "каждую неделю новые excel файлы",
      "нужно автоматически подхватывать новые файлы",
      "надо собрать один массив из сотен файлов"
    ],
    outcomes: [
      "одно обновление",
      "единый массив",
      "автоматическое подхватывание файлов",
      "очищенные данные"
    ]
  }
];
