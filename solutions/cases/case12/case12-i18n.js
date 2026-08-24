(function () {
  "use strict";

  const C12 = window.C12 = window.C12 || {};

  C12.i18n = {
    current: "uk",

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

      let value = language;

      for (const part of parts) {
        if (
          value &&
          Object.prototype.hasOwnProperty.call(
            value,
            part
          )
        ) {
          value = value[part];
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

      document.documentElement.lang =
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
    }
  };

  console.info(
    "[CASE 12] i18n loaded:",
    C12.i18n.current
  );

})();
