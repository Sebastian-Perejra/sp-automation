(function () {
  "use strict";

  const C12 =
    window.C12 =
    window.C12 || {};

  const pageLanguage =
    String(
      document.documentElement.lang ||
      "uk"
    ).toLowerCase();

  const initialLanguage =
    pageLanguage.startsWith("en")
      ? "en"
      : pageLanguage.startsWith("ru")
        ? "ru"
        : "uk";


  const staticTranslations = {
    "Рішення": {
      ru:
        "Решения",

      en:
        "Solutions"
    },

    "ІНТЕРАКТИВНИЙ КЕЙС": {
      ru:
        "ИНТЕРАКТИВНЫЙ КЕЙС",

      en:
        "INTERACTIVE CASE"
    },

    "Система працює": {
      ru:
        "Система работает",

      en:
        "System online"
    },

    "ГОЛОВНЕ ПЕРЕВЕЗЕННЯ": {
      ru:
        "ГЛАВНАЯ ПЕРЕВОЗКА",

      en:
        "ACTIVE SHIPMENT"
    },

    "Поточний час симуляції": {
      ru:
        "Текущее время симуляции",

      en:
        "Simulation time"
    },

    "КЕЙС №12 · ЛОГІСТИКА": {
      ru:
        "КЕЙС №12 · ЛОГИСТИКА",

      en:
        "CASE 12 · TRANSPORT OPERATIONS"
    },

    "Одне перевезення.": {
      ru:
        "Одна перевозка.",

      en:
        "One shipment."
    },

    "П'ять точок зору.": {
      ru:
        "Пять точек зрения.",

      en:
        "Five perspectives."
    },

    "Один процес.": {
      ru:
        "Один процесс.",

      en:
        "One connected workflow."
    },

    "Замовлення надходять телефоном, електронною поштою, через месенджери, транспортні біржі та від постійних клієнтів. Подивіться, як одна операційна система перетворює цей потік на контрольований процес — від заявки до доставки.": {
      ru:
        "Заказы поступают по телефону, электронной почте, через мессенджеры, транспортные биржи и от постоянных клиентов. Посмотрите, как единая операционная система превращает этот поток в управляемый процесс — от заявки до доставки.",

      en:
        "Requests come in by phone, email, messaging apps, freight exchanges, and repeat customers. See how one connected operations workflow turns that incoming demand into a controlled process from intake through delivery."
    },

    "Розпочати зміну": {
      ru:
        "Начать смену",

      en:
        "Start the shift"
    },

    "Як це працює": {
      ru:
        "Как это работает",

      en:
        "See how it works"
    },

    "замовлень": {
      ru:
        "заказов",

      en:
        "orders"
    },

    "власних авто": {
      ru:
        "собственных авто",

      en:
        "company trucks"
    },

    "водіїв": {
      ru:
        "водителей",

      en:
        "drivers"
    },

    "перевізників": {
      ru:
        "перевозчиков",

      en:
        "carriers"
    },

    "ЄДИНИЙ ПРОЦЕС": {
      ru:
        "ЕДИНЫЙ ПРОЦЕСС",

      en:
        "ONE CONNECTED WORKFLOW"
    },

    "перевезень": {
      ru:
        "перевозок",

      en:
        "shipments"
    },

    "РОЛЬ 01": {
      ru:
        "РОЛЬ 01",

      en:
        "ROLE 01"
    },

    "РОЛЬ 02": {
      ru:
        "РОЛЬ 02",

      en:
        "ROLE 02"
    },

    "РОЛЬ 03": {
      ru:
        "РОЛЬ 03",

      en:
        "ROLE 03"
    },

    "РОЛЬ 04": {
      ru:
        "РОЛЬ 04",

      en:
        "ROLE 04"
    },

    "РОЛЬ 05": {
      ru:
        "РОЛЬ 05",

      en:
        "ROLE 05"
    },

    "Диспетчер": {
      ru:
        "Диспетчер",

      en:
        "Dispatcher"
    },

    "Логіст": {
      ru:
        "Логист",

      en:
        "Logistics Coordinator"
    },

    "Водій": {
      ru:
        "Водитель",

      en:
        "Driver"
    },

    "Клієнт": {
      ru:
        "Клиент",

      en:
        "Customer"
    },

    "Власник": {
      ru:
        "Владелец",

      en:
        "Owner"
    },

    "Приймає заявки": {
      ru:
        "Принимает заявки",

      en:
        "Manages incoming requests"
    },

    "Планує ресурси": {
      ru:
        "Планирует ресурсы",

      en:
        "Plans capacity"
    },

    "Виконує рейс": {
      ru:
        "Выполняет рейс",

      en:
        "Runs the trip"
    },

    "Бачить результат": {
      ru:
        "Видит результат",

      en:
        "Tracks the shipment"
    },

    "Контролює бізнес": {
      ru:
        "Контролирует бизнес",

      en:
        "Monitors the operation"
    },

    "Телефон": {
      ru:
        "Телефон",

      en:
        "Phone"
    },

    "Біржа": {
      ru:
        "Биржа",

      en:
        "Freight Exchange"
    },

    "БЕЗ СИСТЕМИ": {
      ru:
        "БЕЗ СИСТЕМЫ",

      en:
        "WITHOUT A SYSTEM"
    },

    "Операційний хаос": {
      ru:
        "Операционный хаос",

      en:
        "Operational chaos"
    },

    "Заявки розкидані між Email, телефоном, месенджерами та транспортними біржами.": {
      ru:
        "Заявки разбросаны между Email, телефоном, мессенджерами и транспортными биржами.",

      en:
        "Requests are scattered across email, phone calls, messaging apps, and freight exchanges."
    },

    "Диспетчер і логіст вручну перевіряють автомобілі, водіїв та поточні статуси.": {
      ru:
        "Диспетчер и логист вручную проверяют автомобили, водителей и текущие статусы.",

      en:
        "Dispatch and logistics staff manually check trucks, drivers, and current trip status."
    },

    "Затримку доводиться окремо передавати клієнту, диспетчеру та іншим учасникам.": {
      ru:
        "Информацию о задержке приходится отдельно передавать клиенту, диспетчеру и другим участникам.",

      en:
        "A delay has to be relayed separately to the customer, dispatcher, and other stakeholders."
    },

    "CMR, POD, листування та історія рейсу залишаються в різних місцях.": {
      ru:
        "CMR, POD, переписка и история рейса остаются в разных местах.",

      en:
        "CMR, POD, conversations, and trip history live in different places."
    },

    "ОДНЕ ОНОВЛЕННЯ": {
      ru:
        "ОДНО ОБНОВЛЕНИЕ",

      en:
        "ONE UPDATE"
    },

    "З ЄДИНИМ ПРОЦЕСОМ": {
      ru:
        "С ЕДИНЫМ ПРОЦЕССОМ",

      en:
        "WITH ONE CONNECTED WORKFLOW"
    },

    "Система тримає перевезення разом": {
      ru:
        "Система объединяет всю перевозку",

      en:
        "One system keeps the entire operation in sync"
    },

    "Усі підтверджені заявки потрапляють в один реєстр перевезень.": {
      ru:
        "Все подтверждённые заявки попадают в единый реестр перевозок.",

      en:
        "Every confirmed request lands in one transportation register."
    },

    "Система перевіряє доступність авто, водія та відповідність вимогам рейсу.": {
      ru:
        "Система проверяет доступность автомобиля и водителя, а также соответствие требованиям рейса.",

      en:
        "The system checks truck availability, driver availability, and shipment requirements."
    },

    "Одна зміна статусу оновлює ETA, контроль і потрібні повідомлення.": {
      ru:
        "Одно изменение статуса обновляет ETA, контроль и необходимые уведомления.",

      en:
        "One status update refreshes ETA, operational visibility, and the right notifications."
    },

    "Клієнт бачить статус, ETA та документи без постійних дзвінків диспетчеру.": {
      ru:
        "Клиент видит статус, ETA и документы без постоянных звонков диспетчеру.",

      en:
        "Customers can see status, ETA, and documents without calling dispatch for updates."
    },

    "01 · ДИСПЕТЧЕР": {
      ru:
        "01 · ДИСПЕТЧЕР",

      en:
        "01 · DISPATCHER"
    },

    "Усі заявки.": {
      ru:
        "Все заявки.",

      en:
        "Every request."
    },

    "Одна точка входу.": {
      ru:
        "Одна точка входа.",

      en:
        "One place to manage it."
    },

    "Заявки надходять з різних каналів. Диспетчер фіксує підтверджене перевезення, а система запускає подальший процес.": {
      ru:
        "Заявки поступают из разных каналов. Диспетчер фиксирует подтверждённую перевозку, а система запускает дальнейший процесс.",

      en:
        "Requests arrive through multiple channels. Dispatch captures the confirmed shipment, and the workflow takes it from there."
    },

    "ЗАРАЗ У СИСТЕМІ": {
      ru:
        "СЕЙЧАС В СИСТЕМЕ",

      en:
        "CURRENTLY IN THE SYSTEM"
    },

    "ВХІДНІ КАНАЛИ": {
      ru:
        "ВХОДЯЩИЕ КАНАЛЫ",

      en:
        "INCOMING CHANNELS"
    },

    "Нові звернення": {
      ru:
        "Новые обращения",

      en:
        "New requests"
    },

    "Месенджери": {
      ru:
        "Мессенджеры",

      en:
        "Messaging Apps"
    },

    "Транспортні біржі": {
      ru:
        "Транспортные биржи",

      en:
        "Freight Exchanges"
    },

    "ЖИВИЙ ПОТІК": {
      ru:
        "ЖИВОЙ ПОТОК",

      en:
        "LIVE FEED"
    },

    "Запит на перевезення": {
      ru:
        "Запрос на перевозку",

      en:
        "Shipment request"
    },

    "ВІД": {
      ru:
        "ОТ",

      en:
        "FROM"
    },

    "КОНТАКТ": {
      ru:
        "КОНТАКТ",

      en:
        "CONTACT"
    },

    "Завантаження": {
      ru:
        "Погрузка",

      en:
        "Pickup"
    },

    "Доставка": {
      ru:
        "Доставка",

      en:
        "Delivery"
    },

    "Вантаж": {
      ru:
        "Груз",

      en:
        "Freight"
    },

    "Вага": {
      ru:
        "Вес",

      en:
        "Weight"
    },

    "Автомобіль": {
      ru:
        "Автомобиль",

      en:
        "Truck"
    },

    "Ставка": {
      ru:
        "Ставка",

      en:
        "Rate"
    },

    "ДЖЕРЕЛО ЗАЯВКИ": {
      ru:
        "ИСТОЧНИК ЗАЯВКИ",

      en:
        "REQUEST SOURCE"
    },

    "Створити замовлення": {
      ru:
        "Создать заказ",

      en:
        "Create order"
    },

    "Реєстр перевезень": {
      ru:
        "Реестр перевозок",

      en:
        "Transportation register"
    },

    "Усі": {
      ru:
        "Все",

      en:
        "All"
    },

    "Увага": {
      ru:
        "Внимание",

      en:
        "Attention"
    },

    "Маршрут": {
      ru:
        "Маршрут",

      en:
        "Lane"
    },

    "Авто": {
      ru:
        "Авто",

      en:
        "Truck"
    },

    "Статус": {
      ru:
        "Статус",

      en:
        "Status"
    },

    "Показано": {
      ru:
        "Показано",

      en:
        "Showing"
    },

    "із": {
      ru:
        "из",

      en:
        "of"
    },

    "Відкрити весь реєстр →": {
      ru:
        "Открыть весь реестр →",

      en:
        "Open full register →"
    },

    "02 · ЛОГІСТ": {
      ru:
        "02 · ЛОГИСТ",

      en:
        "02 · LOGISTICS"
    },

    "Замовлення є.": {
      ru:
        "Заказ есть.",

      en:
        "The load is booked."
    },

    "Хто його повезе?": {
      ru:
        "Кто его повезёт?",

      en:
        "Now assign the right resource."
    },

    "Логіст бачить доступні ресурси, перевіряє вимоги до транспорту та призначає автомобіль і водія.": {
      ru:
        "Логист видит доступные ресурсы, проверяет требования к транспорту и назначает автомобиль и водителя.",

      en:
        "The logistics coordinator sees available capacity, validates shipment requirements, and assigns the right truck and driver."
    },

    "ПЛАНУВАННЯ": {
      ru:
        "ПЛАНИРОВАНИЕ",

      en:
        "PLANNING"
    },

    "Очікують призначення": {
      ru:
        "Ожидают назначения",

      en:
        "Awaiting assignment"
    },

    "ГОЛОВНИЙ КЕЙС": {
      ru:
        "ГЛАВНЫЙ КЕЙС",

      en:
        "ACTIVE CASE"
    },

    "ДОСТАВКА ДО": {
      ru:
        "ДОСТАВКА ДО",

      en:
        "DELIVER BY"
    },

    "Перетягніть на автомобіль →": {
      ru:
        "Перетащите на автомобиль →",

      en:
        "Drag onto a truck →"
    },

    "АВТОПАРК": {
      ru:
        "АВТОПАРК",

      en:
        "FLEET"
    },

    "Доступні ресурси": {
      ru:
        "Доступные ресурсы",

      en:
        "Available capacity"
    },

    "2 вільні": {
      ru:
        "2 свободны",

      en:
        "2 available"
    },

    "8 у рейсі": {
      ru:
        "8 в рейсе",

      en:
        "8 in transit"
    },

    "ВІЛЬНИЙ": {
      ru:
        "СВОБОДЕН",

      en:
        "AVAILABLE"
    },

    "У РЕЙСІ": {
      ru:
        "В РЕЙСЕ",

      en:
        "IN TRANSIT"
    },

    "Тип": {
      ru:
        "Тип",

      en:
        "Type"
    },

    "Вантажність": {
      ru:
        "Грузоподъёмность",

      en:
        "Payload capacity"
    },

    "Локація": {
      ru:
        "Местоположение",

      en:
        "Location"
    },

    "Доступний": {
      ru:
        "Доступен",

      en:
        "Available"
    },

    "Фургон": {
      ru:
        "Фургон",

      en:
        "Box Truck"
    },

    "АЛЬТЕРНАТИВА": {
      ru:
        "АЛЬТЕРНАТИВА",

      en:
        "ALTERNATIVE"
    },

    "Залучені перевізники": {
      ru:
        "Привлечённые перевозчики",

      en:
        "Third-Party Carriers"
    },

    "03 · ВОДІЙ": {
      ru:
        "03 · ВОДИТЕЛЬ",

      en:
        "03 · DRIVER"
    },

    "Мінімум інтерфейсу.": {
      ru:
        "Минимум интерфейса.",

      en:
        "Only what the driver needs."
    },

    "Тільки рейс.": {
      ru:
        "Только рейс.",

      en:
        "Nothing else."
    },

    "Водію не потрібен доступ до всієї таблиці. Він бачить лише своє завдання та фіксує ключові події перевезення.": {
      ru:
        "Водителю не нужен доступ ко всей таблице. Он видит только своё задание и фиксирует ключевые события перевозки.",

      en:
        "The driver does not need access to the full operations board. They see only their assigned trip and record the key milestones along the way."
    },

    "ДОБРОГО РАНКУ": {
      ru:
        "ДОБРОЕ УТРО",

      en:
        "GOOD MORNING"
    },

    "ПОТОЧНИЙ РЕЙС": {
      ru:
        "ТЕКУЩИЙ РЕЙС",

      en:
        "CURRENT TRIP"
    },

    "Розпочати рейс": {
      ru:
        "Начать рейс",

      en:
        "Start trip"
    },

    "Прибув на завантаження": {
      ru:
        "Прибыл на погрузку",

      en:
        "Arrived for pickup"
    },

    "Вантаж завантажено": {
      ru:
        "Груз загружен",

      en:
        "Confirm load"
    },

    "Вирушив до клієнта": {
      ru:
        "Выехал к клиенту",

      en:
        "Depart for delivery"
    },

    "Повідомити про затримку": {
      ru:
        "Сообщить о задержке",

      en:
        "Report a delay"
    },

    "Завершити доставку": {
      ru:
        "Завершить доставку",

      en:
        "Complete delivery"
    },

    "СТАН РЕЙСУ": {
      ru:
        "СТАТУС РЕЙСА",

      en:
        "TRIP STATUS"
    },

    "Призначено": {
      ru:
        "Назначено",

      en:
        "Assigned"
    },

    "Очікує старту": {
      ru:
        "Ожидает старта",

      en:
        "Waiting to start"
    },

    "У дорозі": {
      ru:
        "В пути",

      en:
        "In transit"
    },

    "ДОКУМЕНТИ": {
      ru:
        "ДОКУМЕНТЫ",

      en:
        "DOCUMENTS"
    },

    "Документи рейсу": {
      ru:
        "Документы рейса",

      en:
        "Trip documents"
    },

    "Додати CMR / POD": {
      ru:
        "Добавить CMR / POD",

      en:
        "Upload CMR / POD"
    },

    "Фото або PDF": {
      ru:
        "Фото или PDF",

      en:
        "Photo or PDF"
    },

    "04 · КЛІЄНТ": {
      ru:
        "04 · КЛИЕНТ",

      en:
        "04 · CUSTOMER"
    },

    "Без дзвінків:": {
      ru:
        "Без звонков:",

      en:
        "No more calls asking:"
    },

    "«Де моя машина?»": {
      ru:
        "«Где моя машина?»",

      en:
        "“Where's my truck?”"
    },

    "Клієнт бачить тільки потрібну йому інформацію: підтвердження, поточний статус, ETA, доставку та документи.": {
      ru:
        "Клиент видит только нужную ему информацию: подтверждение, текущий статус, ETA, доставку и документы.",

      en:
        "Customers see exactly what they need: confirmation, current status, ETA, delivery details, and documents."
    },

    "ВІДСТЕЖЕННЯ ПЕРЕВЕЗЕННЯ": {
      ru:
        "ОТСЛЕЖИВАНИЕ ПЕРЕВОЗКИ",

      en:
        "SHIPMENT TRACKING"
    },

    "ПІДТВЕРДЖЕНО": {
      ru:
        "ПОДТВЕРЖДЕНО",

      en:
        "CONFIRMED"
    },

    "ЗВІДКИ": {
      ru:
        "ОТКУДА",

      en:
        "ORIGIN"
    },

    "КУДИ": {
      ru:
        "КУДА",

      en:
        "DESTINATION"
    },

    "ОЧІКУВАНА ДОСТАВКА": {
      ru:
        "ОЖИДАЕМАЯ ДОСТАВКА",

      en:
        "EXPECTED DELIVERY"
    },

    "Заявку отримано": {
      ru:
        "Заявка получена",

      en:
        "Request received"
    },

    "Перевезення підтверджено": {
      ru:
        "Перевозка подтверждена",

      en:
        "Shipment confirmed"
    },

    "Вантаж забрано": {
      ru:
        "Груз забран",

      en:
        "Freight picked up"
    },

    "Доставлено": {
      ru:
        "Доставлено",

      en:
        "Delivered"
    },

    "ДОСТАВЛЕНО": {
      ru:
        "ДОСТАВЛЕНО",

      en:
        "DELIVERED"
    },

    "Отримав: Jan Kowalski": {
      ru:
        "Получил: Jan Kowalski",

      en:
        "Received by: Jan Kowalski"
    },

    "ПОВІДОМЛЕННЯ": {
      ru:
        "УВЕДОМЛЕНИЯ",

      en:
        "NOTIFICATIONS"
    },

    "Що отримує клієнт": {
      ru:
        "Что получает клиент",

      en:
        "What the customer receives"
    },

    "05 · ВЛАСНИК": {
      ru:
        "05 · ВЛАДЕЛЕЦ",

      en:
        "05 · OWNER"
    },

    "Не таблиця.": {
      ru:
        "Не таблица.",

      en:
        "Not another spreadsheet."
    },

    "Картина бізнесу.": {
      ru:
        "Картина бизнеса.",

      en:
        "A live view of the business."
    },

    "Операційні дані перетворюються на зрозумілу картину: перевезення, ризики, автопарк, клієнти та фінансовий результат.": {
      ru:
        "Операционные данные превращаются в понятную картину: перевозки, риски, автопарк, клиенты и финансовый результат.",

      en:
        "Operational data becomes a clear business picture: active shipments, risks, fleet utilization, customers, and financial performance."
    },

    "АКТИВНІ ПЕРЕВЕЗЕННЯ": {
      ru:
        "АКТИВНЫЕ ПЕРЕВОЗКИ",

      en:
        "ACTIVE SHIPMENTS"
    },

    "зараз у роботі": {
      ru:
        "сейчас в работе",

      en:
        "currently in progress"
    },

    "ДОСТАВКИ СЬОГОДНІ": {
      ru:
        "ДОСТАВКИ СЕГОДНЯ",

      en:
        "DELIVERIES TODAY"
    },

    "за планом": {
      ru:
        "по плану",

      en:
        "on plan"
    },

    "ПОТРЕБУЮТЬ УВАГИ": {
      ru:
        "ТРЕБУЮТ ВНИМАНИЯ",

      en:
        "REQUIRES ATTENTION"
    },

    "натисніть для деталей": {
      ru:
        "нажмите для деталей",

      en:
        "click for details"
    },

    "ВЧАСНА ДОСТАВКА": {
      ru:
        "ДОСТАВКА В СРОК",

      en:
        "ON-TIME DELIVERY"
    },

    "за останні 30 днів": {
      ru:
        "за последние 30 дней",

      en:
        "last 30 days"
    },

    "Операції зараз": {
      ru:
        "Операции сейчас",

      en:
        "Live operations"
    },

    "12 автомобілів": {
      ru:
        "12 автомобилей",

      en:
        "12 trucks"
    },

    "У рейсі": {
      ru:
        "В рейсе",

      en:
        "In transit"
    },

    "Вільні": {
      ru:
        "Свободны",

      en:
        "Available"
    },

    "Зарезервовано": {
      ru:
        "Зарезервировано",

      en:
        "Reserved"
    },

    "Сервіс": {
      ru:
        "Сервис",

      en:
        "Out of service"
    },

    "ЦЕЙ ТИЖДЕНЬ": {
      ru:
        "ЭТА НЕДЕЛЯ",

      en:
        "THIS WEEK"
    },

    "Фінансовий результат": {
      ru:
        "Финансовый результат",

      en:
        "Financial performance"
    },

    "ДОХІД": {
      ru:
        "ДОХОД",

      en:
        "REVENUE"
    },

    "ВИТРАТИ": {
      ru:
        "РАСХОДЫ",

      en:
        "COST"
    },

    "МАРЖА": {
      ru:
        "МАРЖА",

      en:
        "MARGIN"
    },

    "МАРЖИНАЛЬНІСТЬ": {
      ru:
        "МАРЖИНАЛЬНОСТЬ",

      en:
        "MARGIN %"
    },

    "КАНАЛИ": {
      ru:
        "КАНАЛЫ",

      en:
        "CHANNELS"
    },

    "Звідки приходять замовлення": {
      ru:
        "Откуда приходят заказы",

      en:
        "Where orders come from"
    },

    "Біржі · 26%": {
      ru:
        "Биржи · 26%",

      en:
        "Freight exchanges · 26%"
    },

    "Постійні клієнти · 16%": {
      ru:
        "Постоянные клиенты · 16%",

      en:
        "Repeat customers · 16%"
    },

    "Інше · 8%": {
      ru:
        "Другое · 8%",

      en:
        "Other · 8%"
    },

    "Потребують уваги": {
      ru:
        "Требуют внимания",

      en:
        "Needs attention"
    },

    "ЧАС ПЕРЕВЕЗЕННЯ": {
      ru:
        "ВРЕМЯ ПЕРЕВОЗКИ",

      en:
        "SHIPMENT TIMELINE"
    },

    "Перетягуйте час і дивіться, як змінюється вся система": {
      ru:
        "Перемещайте время и смотрите, как меняется вся система",

      en:
        "Drag the timeline to see the entire operation update in real time"
    },

    "Продовжити перевезення →": {
      ru:
        "Продолжить перевозку →",

      en:
        "Continue shipment →"
    },

    "ПІД КАПОТОМ": {
      ru:
        "ПОД КАПОТОМ",

      en:
        "UNDER THE HOOD"
    },

    "Не нова корпоративна система.": {
      ru:
        "Не новая корпоративная система.",

      en:
        "You don't always need another enterprise platform."
    },

    "Чітка бізнес-логіка.": {
      ru:
        "Чёткая бизнес-логика.",

      en:
        "You need the right business logic."
    },

    "Процес можна побудувати навколо інструментів, якими команда вже користується.": {
      ru:
        "Процесс можно построить вокруг инструментов, которыми команда уже пользуется.",

      en:
        "The workflow can be built around tools your team already uses."
    },

    "ДАНІ ТА РОБОЧЕ СЕРЕДОВИЩЕ": {
      ru:
        "ДАННЫЕ И РАБОЧАЯ СРЕДА",

      en:
        "DATA & WORKSPACE"
    },

    "БІЗНЕС-ЛОГІКА": {
      ru:
        "БИЗНЕС-ЛОГИКА",

      en:
        "BUSINESS LOGIC"
    },

    "КОМУНІКАЦІЯ": {
      ru:
        "КОММУНИКАЦИЯ",

      en:
        "COMMUNICATION"
    },

    "ЗОВНІШНІ ІНТЕРФЕЙСИ": {
      ru:
        "ВНЕШНИЕ ИНТЕРФЕЙСЫ",

      en:
        "EXTERNAL INTERFACES"
    },

    "Замовлення": {
      ru:
        "Заказы",

      en:
        "Orders"
    },

    "Команда": {
      ru:
        "Команда",

      en:
        "Team"
    },

    "Автопарк": {
      ru:
        "Автопарк",

      en:
        "Fleet"
    },

    "Документи": {
      ru:
        "Документы",

      en:
        "Documents"
    },

    "Клієнти": {
      ru:
        "Клиенты",

      en:
        "Customers"
    },

    "Аналітика": {
      ru:
        "Аналитика",

      en:
        "Analytics"
    },

    "вхід та статус": {
      ru:
        "вход и статус",

      en:
        "intake & status"
    },

    "ролі та дії": {
      ru:
        "роли и действия",

      en:
        "roles & actions"
    },

    "ресурси та рейси": {
      ru:
        "ресурсы и рейсы",

      en:
        "capacity & trips"
    },

    "CMR · POD · файли": {
      ru:
        "CMR · POD · файлы",

      en:
        "CMR · POD · files"
    },

    "ETA та повідомлення": {
      ru:
        "ETA и уведомления",

      en:
        "ETA & notifications"
    },

    "KPI та контроль": {
      ru:
        "KPI и контроль",

      en:
        "KPIs & control"
    },

    "НЕ ЗАВЖДИ ПОТРІБНА НОВА СИСТЕМА": {
      ru:
        "НЕ ВСЕГДА НУЖНА НОВАЯ СИСТЕМА",

      en:
        "YOU DON'T ALWAYS NEED A NEW SYSTEM"
    },

    "Іноді потрібно,": {
      ru:
        "Иногда нужно,",

      en:
        "Sometimes the real need is simple:"
    },

    "щоб ваш процес": {
      ru:
        "чтобы ваш процесс",

      en:
        "make your existing process"
    },

    "нарешті працював як система.": {
      ru:
        "наконец работал как система.",

      en:
        "work like a system."
    },

    "Робочий процес можна побудувати навколо Google Sheets та інструментів, які команда вже знає — з перевірками, автоматизацією, контролем і аналітикою.": {
      ru:
        "Рабочий процесс можно построить вокруг Google Sheets и знакомых команде инструментов — с проверками, автоматизацией, контролем и аналитикой.",

      en:
        "A reliable operations workflow can be built around Google Sheets and tools your team already knows — with validation, automation, control, and reporting built in."
    },

    "Обговорити свій процес →": {
      ru:
        "Обсудить свой процесс →",

      en:
        "Discuss your process →"
    },

    "Пройти кейс ще раз": {
      ru:
        "Пройти кейс ещё раз",

      en:
        "Run the case again"
    },

    "ВАШ": {
      ru:
        "ВАШ",

      en:
        "YOUR"
    },

    "ПРОЦЕС": {
      ru:
        "ПРОЦЕСС",

      en:
        "PROCESS"
    },

    "працює як система": {
      ru:
        "работает как система",

      en:
        "works like a system"
    }
  };


  const cityTranslations = {
    "Львів": {
      ru:
        "Львов",

      en:
        "Lviv"
    },

    "Київ": {
      ru:
        "Киев",

      en:
        "Kyiv"
    },

    "Тернопіль": {
      ru:
        "Тернополь",

      en:
        "Ternopil"
    },

    "Івано-Франківськ": {
      ru:
        "Ивано-Франковск",

      en:
        "Ivano-Frankivsk"
    },

    "Луцьк": {
      ru:
        "Луцк",

      en:
        "Lutsk"
    },

    "Рівне": {
      ru:
        "Ровно",

      en:
        "Rivne"
    },

    "Ужгород": {
      ru:
        "Ужгород",

      en:
        "Uzhhorod"
    },

    "Чернівці": {
      ru:
        "Черновцы",

      en:
        "Chernivtsi"
    },

    "Житомир": {
      ru:
        "Житомир",

      en:
        "Zhytomyr"
    },

    "Вінниця": {
      ru:
        "Винница",

      en:
        "Vinnytsia"
    },

    "Краків": {
      ru:
        "Краков",

      en:
        "Krakow"
    },

    "Варшава": {
      ru:
        "Варшава",

      en:
        "Warsaw"
    },

    "Люблін": {
      ru:
        "Люблин",

      en:
        "Lublin"
    },

    "Жешув": {
      ru:
        "Жешув",

      en:
        "Rzeszów"
    },

    "Катовіце": {
      ru:
        "Катовице",

      en:
        "Katowice"
    },

    "Вроцлав": {
      ru:
        "Вроцлав",

      en:
        "Wrocław"
    },

    "Познань": {
      ru:
        "Познань",

      en:
        "Poznań"
    },

    "Гданськ": {
      ru:
        "Гданьск",

      en:
        "Gdańsk"
    },

    "Кошице": {
      ru:
        "Кошице",

      en:
        "Košice"
    },

    "Пряшів": {
      ru:
        "Прешов",

      en:
        "Prešov"
    },

    "Братислава": {
      ru:
        "Братислава",

      en:
        "Bratislava"
    },

    "Будапешт": {
      ru:
        "Будапешт",

      en:
        "Budapest"
    },

    "Дебрецен": {
      ru:
        "Дебрецен",

      en:
        "Debrecen"
    },

    "Ньїредьгаза": {
      ru:
        "Ньиредьхаза",

      en:
        "Nyíregyháza"
    },

    "Бухарест": {
      ru:
        "Бухарест",

      en:
        "Bucharest"
    },

    "Клуж-Напока": {
      ru:
        "Клуж-Напока",

      en:
        "Cluj-Napoca"
    },

    "Орадя": {
      ru:
        "Орадя",

      en:
        "Oradea"
    }
  };


  const countryTranslations = {
    "Україна": {
      ru:
        "Украина",

      en:
        "Ukraine"
    },

    "Польща": {
      ru:
        "Польша",

      en:
        "Poland"
    },

    "Словаччина": {
      ru:
        "Словакия",

      en:
        "Slovakia"
    },

    "Угорщина": {
      ru:
        "Венгрия",

      en:
        "Hungary"
    },

    "Румунія": {
      ru:
        "Румыния",

      en:
        "Romania"
    },

    "Чехія": {
      ru:
        "Чехия",

      en:
        "Czechia"
    },

    "Молдова": {
      ru:
        "Молдова",

      en:
        "Moldova"
    },

    "Білорусь": {
      ru:
        "Беларусь",

      en:
        "Belarus"
    },

    "Крим": {
      ru:
        "Крым",

      en:
        "Crimea"
    }
  };


  C12.i18n = {
    current:
      initialLanguage,

    languages: {
      uk: {
        code:
          "uk",

        locale:
          "uk-UA",

        name:
          "Українська",

        common: {
          yes:
            "Так",

          no:
            "Ні",

          close:
            "Закрити",

          cancel:
            "Скасувати",

          continue:
            "Продовжити",

          back:
            "Назад",

          loading:
            "Завантаження",

          save:
            "Зберегти"
        },

        roles: {
          dispatcher:
            "Диспетчер",

          manager:
            "Логіст",

          driver:
            "Водій",

          customer:
            "Клієнт",

          owner:
            "Власник"
        },

        statuses: {
          new:
            "НОВЕ",

          planning:
            "ПЛАНУВАННЯ",

          assigned:
            "ПРИЗНАЧЕНО",

          loading:
            "ЗАВАНТАЖЕННЯ",

          transit:
            "У ДОРОЗІ",

          delayed:
            "ЗАТРИМКА",

          customs:
            "МИТНИЦЯ",

          issue:
            "ПОТРЕБУЄ УВАГИ",

          delivered:
            "ДОСТАВЛЕНО",

          future:
            "ОЧІКУЄ"
        },

        execution: {
          own:
            "Власний транспорт",

          carrier:
            "Залучений перевізник",

          none:
            "Не призначено"
        },

        vehicleStatuses: {
          free:
            "ВІЛЬНИЙ",

          reserved:
            "ЗАРЕЗЕРВОВАНО",

          transit:
            "У РЕЙСІ",

          service:
            "СЕРВІС"
        },

        notifications: {
          orderCreated:
            "Замовлення створено",

          vehicleAssigned:
            "Автомобіль призначено",

          carrierAssigned:
            "Перевізника призначено",

          tripStarted:
            "Рейс розпочато",

          arrivedLoading:
            "Прибув на завантаження",

          cargoLoaded:
            "Вантаж завантажено",

          inTransit:
            "Вантаж у дорозі",

          delayReported:
            "Затримку зафіксовано",

          deliveryCompleted:
            "Доставку завершено",

          documentUploaded:
            "CMR / POD додано"
        },

        businessRules: {
          vehicleUnavailable:
            "Автомобіль недоступний",

          vehicleBusy:
            "Автомобіль уже виконує рейс",

          vehicleService:
            "Автомобіль на сервісі",

          wrongVehicleType:
            "Невідповідний тип автомобіля",

          insufficientCapacity:
            "Недостатня вантажність",

          insufficientPallets:
            "Недостатньо палетомісць",

          driverBusy:
            "Водій уже виконує рейс",

          driverMissing:
            "Водія не призначено",

          locationWarning:
            "Потрібна подача автомобіля",

          invalidStatusTransition:
            "Неможлива зміна статусу"
        },

        automation: {
          title:
            "Система зробила сама",

          orderCreated: [
            "Присвоєно номер замовлення",
            "Зафіксовано час створення",
            "Замовлення додано до реєстру",
            "Встановлено початковий статус"
          ],

          assignment: [
            "Перевірено тип автомобіля",
            "Перевірено вантажність",
            "Перевірено доступність водія",
            "Автомобіль зарезервовано",
            "Водія призначено на рейс",
            "Клієнту сформовано підтвердження"
          ],

          delay: [
            "Затримку записано в історію",
            "ETA перераховано",
            "Замовлення позначено як проблемне",
            "Логісту створено попередження",
            "Диспетчеру оновлено статус",
            "Клієнту сформовано повідомлення",
            "KPI власника оновлено"
          ],

          delivered: [
            "Зафіксовано фактичний час доставки",
            "Статус змінено на ДОСТАВЛЕНО",
            "Автомобіль звільнено",
            "Водія звільнено",
            "Клієнту сформовано повідомлення",
            "Перевезення включено до аналітики"
          ]
        }
      },


      ru: {
        code:
          "ru",

        locale:
          "ru-RU",

        name:
          "Русский",

        common: {
          yes:
            "Да",

          no:
            "Нет",

          close:
            "Закрыть",

          cancel:
            "Отмена",

          continue:
            "Продолжить",

          back:
            "Назад",

          loading:
            "Загрузка",

          save:
            "Сохранить"
        },

        roles: {
          dispatcher:
            "Диспетчер",

          manager:
            "Логист",

          driver:
            "Водитель",

          customer:
            "Клиент",

          owner:
            "Владелец"
        },

        statuses: {
          new:
            "НОВОЕ",

          planning:
            "ПЛАНИРОВАНИЕ",

          assigned:
            "НАЗНАЧЕНО",

          loading:
            "ПОГРУЗКА",

          transit:
            "В ПУТИ",

          delayed:
            "ЗАДЕРЖКА",

          customs:
            "ТАМОЖНЯ",

          issue:
            "ТРЕБУЕТ ВНИМАНИЯ",

          delivered:
            "ДОСТАВЛЕНО",

          future:
            "ОЖИДАЕТ"
        },

        execution: {
          own:
            "Собственный транспорт",

          carrier:
            "Привлечённый перевозчик",

          none:
            "Не назначено"
        },

        vehicleStatuses: {
          free:
            "СВОБОДЕН",

          reserved:
            "ЗАРЕЗЕРВИРОВАН",

          transit:
            "В РЕЙСЕ",

          service:
            "СЕРВИС"
        },

        notifications: {
          orderCreated:
            "Заказ создан",

          vehicleAssigned:
            "Автомобиль назначен",

          carrierAssigned:
            "Перевозчик назначен",

          tripStarted:
            "Рейс начат",

          arrivedLoading:
            "Прибыл на погрузку",

          cargoLoaded:
            "Груз загружен",

          inTransit:
            "Груз в пути",

          delayReported:
            "Задержка зафиксирована",

          deliveryCompleted:
            "Доставка завершена",

          documentUploaded:
            "CMR / POD добавлен"
        },

        businessRules: {
          vehicleUnavailable:
            "Автомобиль недоступен",

          vehicleBusy:
            "Автомобиль уже выполняет рейс",

          vehicleService:
            "Автомобиль на сервисе",

          wrongVehicleType:
            "Неподходящий тип автомобиля",

          insufficientCapacity:
            "Недостаточная грузоподъёмность",

          insufficientPallets:
            "Недостаточно палетомест",

          driverBusy:
            "Водитель уже выполняет рейс",

          driverMissing:
            "Водитель не назначен",

          locationWarning:
            "Необходима подача автомобиля",

          invalidStatusTransition:
            "Невозможно изменить статус"
        },

        automation: {
          title:
            "Система сделала сама",

          orderCreated: [
            "Присвоен номер заказа",
            "Зафиксировано время создания",
            "Заказ добавлен в реестр",
            "Установлен начальный статус"
          ],

          assignment: [
            "Проверен тип автомобиля",
            "Проверена грузоподъёмность",
            "Проверена доступность водителя",
            "Автомобиль зарезервирован",
            "Водитель назначен на рейс",
            "Для клиента сформировано подтверждение"
          ],

          delay: [
            "Задержка записана в историю",
            "ETA пересчитан",
            "Заказ отмечен как проблемный",
            "Для логиста создано предупреждение",
            "Статус диспетчера обновлён",
            "Для клиента сформировано уведомление",
            "KPI владельца обновлены"
          ],

          delivered: [
            "Зафиксировано фактическое время доставки",
            "Статус изменён на ДОСТАВЛЕНО",
            "Автомобиль освобождён",
            "Водитель освобождён",
            "Для клиента сформировано уведомление",
            "Перевозка включена в аналитику"
          ]
        }
      },


      en: {
        code:
          "en",

        locale:
          "en-US",

        name:
          "English",

        common: {
          yes:
            "Yes",

          no:
            "No",

          close:
            "Close",

          cancel:
            "Cancel",

          continue:
            "Continue",

          back:
            "Back",

          loading:
            "Loading",

          save:
            "Save"
        },

        roles: {
          dispatcher:
            "Dispatcher",

          manager:
            "Logistics Coordinator",

          driver:
            "Driver",

          customer:
            "Customer",

          owner:
            "Owner"
        },

        statuses: {
          new:
            "NEW",

          planning:
            "PLANNING",

          assigned:
            "ASSIGNED",

          loading:
            "LOADING",

          transit:
            "IN TRANSIT",

          delayed:
            "DELAYED",

          customs:
            "CUSTOMS",

          issue:
            "REQUIRES ATTENTION",

          delivered:
            "DELIVERED",

          future:
            "UPCOMING"
        },

        execution: {
          own:
            "Company Fleet",

          carrier:
            "Third-Party Carrier",

          none:
            "Not Assigned"
        },

        vehicleStatuses: {
          free:
            "AVAILABLE",

          reserved:
            "RESERVED",

          transit:
            "IN TRANSIT",

          service:
            "OUT OF SERVICE"
        },

        notifications: {
          orderCreated:
            "Order created",

          vehicleAssigned:
            "Truck assigned",

          carrierAssigned:
            "Carrier assigned",

          tripStarted:
            "Trip started",

          arrivedLoading:
            "Arrived for pickup",

          cargoLoaded:
            "Load confirmed",

          inTransit:
            "Shipment in transit",

          delayReported:
            "Delay reported",

          deliveryCompleted:
            "Delivery completed",

          documentUploaded:
            "CMR / POD uploaded"
        },

        businessRules: {
          vehicleUnavailable:
            "Truck unavailable",

          vehicleBusy:
            "Truck is already assigned to another trip",

          vehicleService:
            "Truck is currently out of service",

          wrongVehicleType:
            "Truck type does not meet the shipment requirements",

          insufficientCapacity:
            "Insufficient payload capacity",

          insufficientPallets:
            "Insufficient pallet capacity",

          driverBusy:
            "Driver is already assigned to another trip",

          driverMissing:
            "No driver assigned",

          locationWarning:
            "Truck repositioning required",

          invalidStatusTransition:
            "This status change is not allowed"
        },

        automation: {
          title:
            "Handled automatically",

          orderCreated: [
            "Order number assigned",
            "Creation time recorded",
            "Order added to the transportation register",
            "Initial status set"
          ],

          assignment: [
            "Truck type validated",
            "Payload capacity checked",
            "Driver availability verified",
            "Truck reserved",
            "Driver assigned",
            "Customer confirmation prepared"
          ],

          delay: [
            "Delay recorded in trip history",
            "ETA recalculated",
            "Shipment flagged for attention",
            "Logistics coordinator alerted",
            "Dispatcher view updated",
            "Customer notification prepared",
            "Owner KPIs updated"
          ],

          delivered: [
            "Actual delivery time recorded",
            "Status changed to DELIVERED",
            "Truck released",
            "Driver released",
            "Customer notification prepared",
            "Shipment included in performance reporting"
          ]
        }
      }
    },


    get(
      path,
      fallback = ""
    ) {
      const language =
        this.languages[
          this.current
        ];

      if (!language) {
        return fallback;
      }

      const parts =
        String(
          path ||
          ""
        )
          .split(".")
          .filter(Boolean);

      let value =
        language;

      for (
        const part
        of parts
      ) {
        if (
          value &&
          Object.prototype
            .hasOwnProperty
            .call(
              value,
              part
            )
        ) {
          value =
            value[
              part
            ];
        }

        else {
          return fallback;
        }
      }

      return value;
    },


    translateStatic(
      value
    ) {
      const source =
        String(
          value ||
          ""
        )
          .replace(
            /\s+/g,
            " "
          )
          .trim();

      if (
        !source ||
        this.current ===
        "uk"
      ) {
        return source;
      }

      return (
        staticTranslations[
          source
        ]?.[
          this.current
        ] ||
        cityTranslations[
          source
        ]?.[
          this.current
        ] ||
        countryTranslations[
          source
        ]?.[
          this.current
        ] ||
        source
      );
    },


    city(
      value
    ) {
      if (
        this.current ===
        "uk"
      ) {
        return value;
      }

      return (
        cityTranslations[
          value
        ]?.[
          this.current
        ] ||
        value
      );
    },


    country(
      value
    ) {
      if (
        this.current ===
        "uk"
      ) {
        return value;
      }

      return (
        countryTranslations[
          value
        ]?.[
          this.current
        ] ||
        value
      );
    },


    setLanguage(
      languageCode
    ) {
      if (
        !this.languages[
          languageCode
        ]
      ) {
        console.warn(
          "[CASE 12] Unknown language:",
          languageCode
        );

        return false;
      }

      this.current =
        languageCode;

      this.applyStatic();

      document.dispatchEvent(
        new CustomEvent(
          "c12:languagechange",
          {
            detail: {
              language:
                languageCode
            }
          }
        )
      );

      return true;
    },


    getLocale() {
      return (
        this.languages[
          this.current
        ]?.locale ||
        "uk-UA"
      );
    },


    is(
      languageCode
    ) {
      return (
        this.current ===
        languageCode
      );
    },


    applyStatic() {
      const root =
        document.getElementById(
          "transportCase"
        );

      if (!root) {
        return false;
      }

      if (
        this.current ===
        "uk"
      ) {
        return true;
      }

      const walker =
        document.createTreeWalker(
          root,
          NodeFilter.SHOW_TEXT
        );

      const textNodes =
        [];

      while (
        walker.nextNode()
      ) {
        textNodes.push(
          walker.currentNode
        );
      }


      textNodes.forEach(
        node => {
          const original =
            node.nodeValue;

          const normalized =
            String(
              original ||
              ""
            )
              .replace(
                /\s+/g,
                " "
              )
              .trim();

          if (!normalized) {
            return;
          }

          const translated =
            this.translateStatic(
              normalized
            );

          if (
            translated ===
            normalized
          ) {
            return;
          }

          const leading =
            original.match(
              /^\s*/
            )?.[0] ||
            "";

          const trailing =
            original.match(
              /\s*$/
            )?.[0] ||
            "";

          node.nodeValue =
            leading +
            translated +
            trailing;
        }
      );


      root.querySelectorAll(
        "[aria-label]"
      ).forEach(
        element => {
          const value =
            element.getAttribute(
              "aria-label"
            );

          const labels = {
            "Повернутися до рішень": {
              ru:
                "Вернуться к решениям",

              en:
                "Back to solutions"
            },

            "Увімкнути або вимкнути звук": {
              ru:
                "Включить или выключить звук",

              en:
                "Toggle sound"
            },

            "Ролі в процесі перевезення": {
              ru:
                "Роли в процессе перевозки",

              en:
                "Roles in the transportation workflow"
            },

            "Закрити список звернень": {
              ru:
                "Закрыть список обращений",

              en:
                "Close request list"
            }
          };

          const translated =
            labels[
              value
            ]?.[
              this.current
            ];

          if (translated) {
            element.setAttribute(
              "aria-label",
              translated
            );
          }
        }
      );


      const backLink =
        root.querySelector(
          ".c12-back"
        );

      if (backLink) {
        backLink.href =
          this.current ===
          "ru"
            ? "../solutions-ru.html"
            : this.current ===
              "en"
              ? "../solutions-en.html"
              : "../solutions.html";
      }


      const contactLink =
        root.querySelector(
          ".c12-final__actions a"
        );

      if (contactLink) {
        contactLink.href =
          this.current ===
          "ru"
            ? "../contacts-ru.html"
            : this.current ===
              "en"
              ? "../contacts-en.html"
              : "../contacts.html";
      }


      return true;
    }
  };


  function initializeStaticTranslation() {
    if (
      C12.i18n.applyStatic()
    ) {
      return;
    }

    let attempts =
      0;

    const timer =
      window.setInterval(
        () => {
          attempts +=
            1;

          if (
            C12.i18n
              .applyStatic() ||
            attempts >=
              50
          ) {
            window.clearInterval(
              timer
            );
          }
        },
        100
      );
  }


  if (
    document.readyState ===
    "loading"
  ) {
    document.addEventListener(
      "DOMContentLoaded",
      initializeStaticTranslation,
      {
        once:
          true
      }
    );
  }

  else {
    initializeStaticTranslation();
  }


  console.info(
    "[CASE 12] i18n loaded:",
    C12.i18n.current
  );

})();

(function () {
  "use strict";

  const C12 =
    window.C12 =
    window.C12 || {};

  if (!C12.i18n) {
    return;
  }


  const translations = {

    uk: {
      timeMachine: {
        eyebrow:
          "ЧАС ПЕРЕВЕЗЕННЯ",

        hint:
          "Перетягуйте час і дивіться, як змінюється вся система",

        startDate:
          "26 СЕР",

        endDate:
          "28 СЕР",

        request:
          "Заявка",

        assignment:
          "Призначення",

        pickup:
          "Завантаження",

        delay:
          "Затримка",

        delivery:
          "Доставка",

        active:
          "Активні",

        inTransit:
          "У дорозі",

        attention:
          "Увага",

        delivered:
          "Доставлено",

        sliderAria:
          "Час перевезення"
      },

      automationFeed: {
        eyebrow:
          "АВТОМАТИЗАЦІЯ",

        title:
          "Система зробила сама",

        empty:
          "Виконайте першу дію — тут з'являться автоматичні операції системи."
      }
    },


    ru: {
      timeMachine: {
        eyebrow:
          "ВРЕМЯ ПЕРЕВОЗКИ",

        hint:
          "Перемещайте время и смотрите, как меняется вся система",

        startDate:
          "26 АВГ",

        endDate:
          "28 АВГ",

        request:
          "Заявка",

        assignment:
          "Назначение",

        pickup:
          "Погрузка",

        delay:
          "Задержка",

        delivery:
          "Доставка",

        active:
          "Активные",

        inTransit:
          "В пути",

        attention:
          "Внимание",

        delivered:
          "Доставлено",

        sliderAria:
          "Время перевозки"
      },

      automationFeed: {
        eyebrow:
          "АВТОМАТИЗАЦИЯ",

        title:
          "Система сделала сама",

        empty:
          "Выполните первое действие — здесь появятся автоматические операции системы."
      }
    },


    en: {
      timeMachine: {
        eyebrow:
          "SHIPMENT TIMELINE",

        hint:
          "Drag the timeline to see the entire operation update in real time",

        startDate:
          "26 AUG",

        endDate:
          "28 AUG",

        request:
          "Request",

        assignment:
          "Assignment",

        pickup:
          "Pickup",

        delay:
          "Delay",

        delivery:
          "Delivery",

        active:
          "Active",

        inTransit:
          "In Transit",

        attention:
          "Attention",

        delivered:
          "Delivered",

        sliderAria:
          "Shipment timeline"
      },

      automationFeed: {
        eyebrow:
          "AUTOMATION",

        title:
          "Handled automatically",

        empty:
          "Complete the first action to see the operations the system handles automatically."
      }
    }

  };


  Object.entries(
    translations
  ).forEach(
    ([language, sections]) => {

      const target =
        C12.i18n.languages[
          language
        ];

      if (!target) {
        return;
      }

      Object.entries(
        sections
      ).forEach(
        ([section, values]) => {

          target[section] = {
            ...(
              target[section] ||
              {}
            ),
            ...values
          };

        }
      );

    }
  );


  function applySemanticTranslations() {

    const root =
      document.getElementById(
        "transportCase"
      );

    if (!root) {
      return false;
    }


    root
      .querySelectorAll(
        "[data-i18n]"
      )
      .forEach(
        element => {

          const key =
            element.getAttribute(
              "data-i18n"
            );

          if (!key) {
            return;
          }

          const value =
            C12.i18n.get(
              key,
              ""
            );

          if (value) {
            element.textContent =
              value;
          }

        }
      );


    root
      .querySelectorAll(
        "[data-i18n-aria-label]"
      )
      .forEach(
        element => {

          const key =
            element.getAttribute(
              "data-i18n-aria-label"
            );

          if (!key) {
            return;
          }

          const value =
            C12.i18n.get(
              key,
              ""
            );

          if (value) {
            element.setAttribute(
              "aria-label",
              value
            );
          }

        }
      );


    root
      .querySelectorAll(
        "[data-i18n-title]"
      )
      .forEach(
        element => {

          const key =
            element.getAttribute(
              "data-i18n-title"
            );

          if (!key) {
            return;
          }

          const value =
            C12.i18n.get(
              key,
              ""
            );

          if (value) {
            element.setAttribute(
              "title",
              value
            );
          }

        }
      );


    root
      .querySelectorAll(
        "[data-i18n-placeholder]"
      )
      .forEach(
        element => {

          const key =
            element.getAttribute(
              "data-i18n-placeholder"
            );

          if (!key) {
            return;
          }

          const value =
            C12.i18n.get(
              key,
              ""
            );

          if (value) {
            element.setAttribute(
              "placeholder",
              value
            );
          }

        }
      );


    return true;
  }


  const previousApplyStatic =
    C12.i18n.applyStatic
      ?.bind(
        C12.i18n
      );


  C12.i18n.applyStatic =
    function () {

      if (
        previousApplyStatic
      ) {
        previousApplyStatic();
      }

      applySemanticTranslations();

      return true;
    };


  C12.i18n.apply =
    applySemanticTranslations;


  document.addEventListener(
    "c12:languagechange",
    () => {
      applySemanticTranslations();
    }
  );


  applySemanticTranslations();

})();
