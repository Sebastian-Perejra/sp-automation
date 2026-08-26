(function () {
  "use strict";

  const C12 = window.C12 = window.C12 || {};

  const pageLanguage =
    String(
      document.documentElement.lang ||
      "uk"
    ).toLowerCase();

  const initialLanguage =
    pageLanguage.startsWith("ru")
      ? "ru"
      : "uk";

  C12.i18n = {
    current: initialLanguage,

    languages: {
      uk: {
        code: "uk",
        locale: "uk-UA",
        name: "Українська",

        common: {
          yes: "Так",
          no: "Ні",
          close: "Закрити",
          cancel: "Скасувати",
          continue: "Продовжити",
          back: "Назад",
          loading: "Завантаження",
          save: "Зберегти"
        },

        roles: {
          dispatcher: "Диспетчер",
          manager: "Логіст",
          driver: "Водій",
          customer: "Клієнт",
          owner: "Власник"
        },

        statuses: {
          new: "НОВЕ",
          planning: "ПЛАНУВАННЯ",
          assigned: "ПРИЗНАЧЕНО",
          loading: "ЗАВАНТАЖЕННЯ",
          transit: "У ДОРОЗІ",
          delayed: "ЗАТРИМКА",
          customs: "МИТНИЦЯ",
          issue: "ПОТРЕБУЄ УВАГИ",
          delivered: "ДОСТАВЛЕНО",
          future: "ОЧІКУЄ"
        },

        execution: {
          own: "Власний транспорт",
          carrier: "Залучений перевізник",
          none: "Не призначено"
        },

        vehicleStatuses: {
          free: "ВІЛЬНИЙ",
          reserved: "ЗАРЕЗЕРВОВАНО",
          transit: "У РЕЙСІ",
          service: "СЕРВІС"
        },

        notifications: {
          orderCreated: "Замовлення створено",
          vehicleAssigned: "Автомобіль призначено",
          carrierAssigned: "Перевізника призначено",
          tripStarted: "Рейс розпочато",
          arrivedLoading: "Прибув на завантаження",
          cargoLoaded: "Вантаж завантажено",
          inTransit: "Вантаж у дорозі",
          delayReported: "Затримку зафіксовано",
          deliveryCompleted: "Доставку завершено",
          documentUploaded: "CMR / POD додано"
        },

        businessRules: {
          vehicleUnavailable: "Автомобіль недоступний",
          vehicleBusy: "Автомобіль уже виконує рейс",
          vehicleService: "Автомобіль на сервісі",
          wrongVehicleType: "Невідповідний тип автомобіля",
          insufficientCapacity: "Недостатня вантажність",
          insufficientPallets: "Недостатньо палетомісць",
          driverBusy: "Водій уже виконує рейс",
          driverMissing: "Водія не призначено",
          locationWarning: "Потрібна подача автомобіля",
          invalidStatusTransition: "Неможлива зміна статусу"
        },

        automation: {
          title: "Система зробила сама",

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
        code: "ru",
        locale: "ru-RU",
        name: "Русский",

        common: {
          yes: "Да",
          no: "Нет",
          close: "Закрыть",
          cancel: "Отмена",
          continue: "Продолжить",
          back: "Назад",
          loading: "Загрузка",
          save: "Сохранить"
        },

        roles: {
          dispatcher: "Диспетчер",
          manager: "Логист",
          driver: "Водитель",
          customer: "Клиент",
          owner: "Владелец"
        },

        statuses: {
          new: "НОВОЕ",
          planning: "ПЛАНИРОВАНИЕ",
          assigned: "НАЗНАЧЕНО",
          loading: "ПОГРУЗКА",
          transit: "В ПУТИ",
          delayed: "ЗАДЕРЖКА",
          customs: "ТАМОЖНЯ",
          issue: "ТРЕБУЕТ ВНИМАНИЯ",
          delivered: "ДОСТАВЛЕНО",
          future: "ОЖИДАЕТ"
        },

        execution: {
          own: "Собственный транспорт",
          carrier: "Привлечённый перевозчик",
          none: "Не назначено"
        },

        vehicleStatuses: {
          free: "СВОБОДЕН",
          reserved: "ЗАРЕЗЕРВИРОВАН",
          transit: "В РЕЙСЕ",
          service: "СЕРВИС"
        },

        notifications: {
          orderCreated: "Заказ создан",
          vehicleAssigned: "Автомобиль назначен",
          carrierAssigned: "Перевозчик назначен",
          tripStarted: "Рейс начат",
          arrivedLoading: "Прибыл на погрузку",
          cargoLoaded: "Груз загружен",
          inTransit: "Груз в пути",
          delayReported: "Задержка зафиксирована",
          deliveryCompleted: "Доставка завершена",
          documentUploaded: "CMR / POD добавлен"
        },

        businessRules: {
          vehicleUnavailable: "Автомобиль недоступен",
          vehicleBusy: "Автомобиль уже выполняет рейс",
          vehicleService: "Автомобиль на сервисе",
          wrongVehicleType: "Неподходящий тип автомобиля",
          insufficientCapacity: "Недостаточная грузоподъёмность",
          insufficientPallets: "Недостаточно палетомест",
          driverBusy: "Водитель уже выполняет рейс",
          driverMissing: "Водитель не назначен",
          locationWarning: "Необходима подача автомобиля",
          invalidStatusTransition: "Невозможно изменить статус"
        },

        automation: {
          title: "Система сделала сама",

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
      }
    },

    get(path, fallback = "") {
      const language =
        this.languages[this.current];

      if (!language) {
        return fallback;
      }

      const parts =
        String(path || "")
          .split(".")
          .filter(Boolean);

      let value =
        language;

      for (const part of parts) {
        if (
          value &&
          Object.prototype.hasOwnProperty.call(
            value,
            part
          )
        ) {
          value =
            value[part];
        } else {
          return fallback;
        }
      }

      return value;
    },

    setLanguage(languageCode) {
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

    is(languageCode) {
      return (
        this.current ===
        languageCode
      );
    }
  };

  console.info(
    "[CASE 12] i18n loaded:",
    C12.i18n.current
  );

})();
