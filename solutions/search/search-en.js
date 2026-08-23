window.SOLUTIONS_CASES_EN = [
  {
    id: 1,
    title: "Automated bank statement processing",
    type: "FINANCE AUTOMATION",
    short: "Raw bank statement rows → counterparty → payment purpose → category → structured result.",
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
      "bank",
      "payments",
      "bank statement",
      "categorization",
      "counterparty"
    ],
    aliases: [
      "bank statement processing",
      "bank statement parser",
      "bank transaction parser",
      "categorize bank transactions",
      "categorize payments",
      "identify counterparties",
      "payment categorization",
      "financial transaction automation"
    ],
    problems: [
      "I manually process bank transactions",
      "I manually categorize bank statement rows",
      "I need to identify counterparties in payments",
      "I need to categorize bank payments automatically"
    ],
    outcomes: [
      "structured payments",
      "automatic categorization",
      "identified counterparties"
    ]
  },

  {
    id: 2,
    title: "Automated parsing of PDF invoices and packing lists",
    type: "DOCUMENT AUTOMATION",
    short: "PDF in Google Drive → OCR → document type detection → line-item parsing → RAW / PACKING → archive.",
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
      "invoices",
      "packing list",
      "OCR",
      "parser",
      "PDF"
    ],
    aliases: [
      "invoice parser",
      "pdf invoice parser",
      "extract data from pdf",
      "parse pdf",
      "packing list parser",
      "read invoice pdf",
      "process pdf documents",
      "extract invoice line items"
    ],
    problems: [
      "I manually copy line items from PDF files",
      "invoice data needs to be transferred to Excel",
      "I need to recognize invoices automatically",
      "I need to read packing lists"
    ],
    outcomes: [
      "PDF line items in a table",
      "automatic OCR",
      "processed PDF archive"
    ]
  },

  {
    id: 3,
    title: "Automated dashboard creation from an Excel table",
    type: "EXCEL ANALYTICS",
    short: "200 sales rows → aggregation → KPI → charts → ready-to-use analytical dashboard.",
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
      "dashboard",
      "Excel",
      "KPI",
      "sales",
      "charts"
    ],
    aliases: [
      "excel dashboard",
      "dashboard from excel",
      "report from excel",
      "charts from excel",
      "sales dashboard",
      "excel visualization",
      "build kpi",
      "automatic excel dashboard"
    ],
    problems: [
      "I have an Excel table and need a dashboard",
      "I have sales data and need a report",
      "I need charts to be generated automatically",
      "I need KPIs from a table"
    ],
    outcomes: [
      "KPI",
      "charts",
      "analytical dashboard",
      "aggregated data"
    ]
  },

  {
    id: 4,
    title: "Production capacity and order delivery planning",
    type: "PRODUCTION PLANNING",
    short: "Orders + production lines + daily capacity → daily allocation → completion date → status and utilization.",
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
      "production",
      "capacity",
      "deadlines",
      "completion date",
      "priority"
    ],
    aliases: [
      "capacity planning",
      "production capacity",
      "production planning",
      "delivery planning",
      "when will the order be ready",
      "calculate completion date",
      "production line utilization",
      "production scheduling"
    ],
    problems: [
      "I do not know when the order will be ready",
      "I need to distribute orders between production lines",
      "I need to plan production capacity",
      "I need to account for urgent orders",
      "I need to calculate realistic completion dates"
    ],
    outcomes: [
      "completion date",
      "line utilization",
      "production calendar",
      "order status"
    ]
  },

  {
    id: 5,
    title: "Automated component requirements calculation",
    type: "BOM / PROCUREMENT",
    short: "Finished-product orders → BOM → total requirements → inventory → exact quantity of components to purchase.",
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
      "components",
      "procurement",
      "inventory",
      "requirements"
    ],
    aliases: [
      "component requirements calculation",
      "procurement planning",
      "bom calculator",
      "material requirements",
      "mrp",
      "what needs to be purchased",
      "component planning",
      "inventory requirements"
    ],
    problems: [
      "I manually calculate components for orders",
      "I manually calculate material requirements",
      "I do not know how much to purchase",
      "I need to account for available inventory",
      "I need to calculate procurement requirements"
    ],
    outcomes: [
      "exact requirements",
      "purchase list",
      "inventory accounted for",
      "component plan"
    ]
  },

  {
    id: 6,
    title: "Management reporting automation in Power BI",
    type: "MANAGEMENT BI",
    short: "ERP / 1C / SAP → Power Query → data model → DAX → interactive Power BI reporting with automated refresh.",
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
      "reporting",
      "dashboard",
      "DAX",
      "ERP",
      "plan vs actual"
    ],
    aliases: [
      "management reporting power bi",
      "management reporting",
      "executive dashboard",
      "bi reporting",
      "power bi report",
      "management dashboard",
      "report for management",
      "power bi automated refresh",
      "power bi from sap",
      "power bi from 1c",
      "plan vs actual dashboard"
    ],
    problems: [
      "I manually prepare a report every month",
      "there are too many versions of the Excel report",
      "management needs up-to-date figures",
      "I need plan vs actual reporting",
      "I want one reliable reporting model"
    ],
    outcomes: [
      "current version of the data",
      "automated refresh",
      "interactive analytics",
      "single data model",
      "plan vs actual"
    ]
  },

  {
    id: 7,
    title: "Automated consolidation of data from hundreds of Excel files",
    type: "DATA CONSOLIDATION",
    short: "Shared folder with Excel reports → Power Query / Power BI → cleaning → standardized structure → one dataset for analysis.",
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
      "hundreds of files",
      "consolidation",
      "Power Query",
      "folder",
      "Excel"
    ],
    aliases: [
      "combine excel files",
      "merge excel files",
      "consolidate excel reports",
      "folder consolidation",
      "power query from folder",
      "combine files from folder",
      "merge excel reports",
      "automatically import new excel files"
    ],
    problems: [
      "I manually copy data from many Excel files",
      "I manually combine multiple Excel reports",
      "new Excel reports arrive every week",
      "I need new files to be picked up automatically",
      "I need one dataset from hundreds of files"
    ],
    outcomes: [
      "single refresh",
      "single dataset",
      "automatic ingestion of new files",
      "clean data"
    ]
  },

  {
  id: 8,
  title: "Automating reminders and task follow-up with a Telegram bot",
  type: "TELEGRAM AUTOMATION",
  short: "Message or task → choose a time → reminder → snooze / complete / pass to someone else.",
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
    "bot",
    "reminders",
    "tasks",
    "follow-up"
  ],
  aliases: [
    "telegram bot",
    "reminder bot",
    "telegram reminders",
    "task reminder bot",
    "follow-up bot",
    "telegram task automation",
    "remind me later",
    "message to reminder",
    "repeat reminder"
  ],
  problems: [
    "tasks get lost in chats",
    "messages get buried in Telegram",
    "I forget to follow up",
    "I need reminders for client tasks",
    "I want to create reminders from messages",
    "I forget to reply to clients",
    "I need repeated reminders until a task is completed"
  ],
  outcomes: [
    "automatic reminders",
    "task control",
    "repeat reminders",
    "fewer missed tasks",
    "better follow-up control",
    "tasks directly in Telegram"
  ]
  },

  {
    id: 9,
    title: "From customer inquiry to ready-to-send sales quotation",
    type: "SALES AUTOMATION",
    short: "Incoming email → Sales Quotations app → customer → products and prices → delivery → PDF → save → send.",
    featured: false,
    priority: 82,
    concepts: [
      "automation",
      "sales",
      "quotation",
      "documents",
      "workflow",
      "integration",
      "crm",
      "erp"
    ],
    tools: [
      "Outlook",
      "Excel",
      "ERP",
      "CRM",
      "1C",
      "PDF"
    ],
    tags: [
      "quotation",
      "sales quotation",
      "commercial offer",
      "sales automation",
      "CRM",
      "ERP",
      "Excel",
      "PDF"
    ],
    aliases: [
      "sales quotation automation",
      "quotation automation",
      "commercial offer automation",
      "automated quotation process",
      "create quotation from email",
      "generate quotation from customer request",
      "sales quote generator",
      "quotation workflow",
      "automated commercial offer",
      "generate pdf quotation",
      "prices from excel",
      "prices from erp",
      "prices from 1c",
      "customer data from crm"
    ],
    problems: [
      "I prepare quotations manually",
      "I manually copy customer requests from email",
      "I search for customer data in CRM or ERP",
      "I search for product prices in Excel or ERP",
      "I copy prices between different systems",
      "I sometimes use outdated price lists",
      "old customer data remains in copied quotation templates",
      "delivery costs are calculated separately",
      "I manually create PDF quotations",
      "quotation history is scattered across files and systems"
    ],
    outcomes: [
      "guided quotation workflow",
      "customer request imported from email",
      "customer data loaded from the selected source",
      "products and prices loaded from the selected source",
      "delivery included in the quotation process",
      "automatic PDF generation",
      "quotation saved in one module",
      "prepared customer email with PDF attachment",
      "less manual copying",
      "fewer quotation errors"
    ]
  }
];
