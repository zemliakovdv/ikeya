# Аудит логики статусов заказов в ЛК

Дата: 2026-06-15

## 1. Technical status для "Передано в доставку"

Точно по коду видно только одно: текст `Передано в доставку` не формируется на frontend.
В профиле человекочитаемый текст берётся из backend-поля `status_description` и кладётся в `statusDescription` в `components/profile/Orders.js`.

Значит technical status нужно искать не по тексту, а по `order.attributes.status` / `rawStatus`.

Из кода ближайшие delivery/courier technical statuses такие:

- `shipped`
- `handed_to_courier`
- `handed_to_courier_ikeya`
- `arrived_pvz`

Все они сейчас считаются `active`.

Вывод:

- если заказ реально показывал backend-текст `Передано в доставку` и пропал из активных, то наиболее вероятная причина не в `status_description`, а в новом technical status от backend, которого нет в `ACTIVE_STATUSES`;
- по текущему коду статус `shipped`, `handed_to_courier`, `handed_to_courier_ikeya` пропасть из active не должен.

## 2. Почему заказ мог пропасть из активных

Текущая классификация в `lib/api/account.js` whitelist-овая:

- active только если status входит в `ACTIVE_STATUSES`
- history только если status входит в `HISTORY_STATUSES` или это expired unpaid

Поэтому заказ пропадает из active, если его technical status:

- не входит в `ACTIVE_STATUSES`
- и одновременно не входит в `HISTORY_STATUSES`

Тогда он попадает в `none` и исчезает из обеих вкладок.

Для `Передано в доставку` это и есть главный риск: backend мог начать отдавать новый промежуточный status, а whitelist его не знает.

## 3. Полный список статусов, найденных в проекте

| technical status | где найден | текущая классификация | frontend display/mapped status | комментарий |
|---|---|---:|---|---|
| `created` | `ACTIVE_STATUSES`, `mapStatus`, dashboard map | active | `awaiting` | unpaid status |
| `processing` | `ACTIVE_STATUSES`, `mapStatus`, dashboard map | active | `awaiting` в `Orders.js`, `assembly` в dashboard | уже есть рассинхрон display |
| `confirmed` | `ACTIVE_STATUSES`, `mapStatus`, dashboard map | active | `assembly` | ok |
| `paid` | `ACTIVE_STATUSES`, `mapStatus`, dashboard map | active | `assembly` | ok |
| `purchased` | `ACTIVE_STATUSES`, `mapStatus`, dashboard map | active | `assembly` | ok |
| `received_poland` | `ACTIVE_STATUSES`, `mapStatus`, dashboard map | active | `transit` | ok |
| `preparing_for_shipment` | `ACTIVE_STATUSES`, `mapStatus`, dashboard map | active | `transit` | ok |
| `export_eu` | `ACTIVE_STATUSES`, `mapStatus`, dashboard map | active | `transit` | ok |
| `customs_poland` | `ACTIVE_STATUSES`, `mapStatus`, dashboard map | active | `transit` | ok |
| `on_border` | `ACTIVE_STATUSES`, `mapStatus`, dashboard map | active | `transit` / dashboard `customs-belarus` | display-рассинхрон |
| `customs_belarus` | `ACTIVE_STATUSES`, `mapStatus`, dashboard map | active | `customs-belarus` | ok |
| `shipped` | `ACTIVE_STATUSES`, `mapStatus`, dashboard map | active | `transit` в `Orders.js`, `in-transit-pvz` в dashboard | display-рассинхрон |
| `handed_to_courier` | `ACTIVE_STATUSES`, `mapStatus`, dashboard map | active | `transit` в `Orders.js`, `in-transit-pvz` в dashboard | display-рассинхрон |
| `handed_to_courier_ikeya` | `ACTIVE_STATUSES`, `mapStatus` | active | `transit` | в dashboard map отсутствует |
| `arrived_pvz` | `ACTIVE_STATUSES`, `mapStatus`, dashboard map | active | `arrived-pvz` | ok |
| `completed` | `HISTORY_STATUSES`, `mapStatus`, dashboard map | history | `delivered` | terminal |
| `delivered` | `HISTORY_STATUSES`, `mapStatus` | history | `delivered` | terminal |
| `cancelled` | `HISTORY_STATUSES`, `mapStatus`, dashboard map | history | `canceled` | terminal |
| `canceled` | `HISTORY_STATUSES`, `mapStatus`, dashboard map | history | `canceled` | terminal |

## 4. Какие статусы сейчас active

Из `lib/api/account.js`:

- `created`
- `processing`
- `confirmed`
- `paid`
- `purchased`
- `received_poland`
- `preparing_for_shipment`
- `export_eu`
- `customs_poland`
- `on_border`
- `customs_belarus`
- `shipped`
- `handed_to_courier`
- `handed_to_courier_ikeya`
- `arrived_pvz`

Плюс любой `checkout_draft`.

## 5. Какие статусы сейчас history

Из `lib/api/account.js`:

- `completed`
- `delivered`
- `cancelled`
- `canceled`

И отдельно туда попадают expired unpaid заказы только для:

- `created`
- `processing`

## 6. Какие статусы сейчас `none` и могут пропадать

Из известных в проекте технических статусов `none` сейчас нет.

Но архитектурный риск высокий: любой новый backend status, которого нет в `ACTIVE_STATUSES` и нет в `HISTORY_STATUSES`, исчезнет из обеих вкладок. Это и есть наиболее вероятная причина проблемы с `Передано в доставку`, если backend начал отдавать новый промежуточный code.

Примеры потенциально опасных новых статусов:

- `handed_to_delivery`
- `delivery_in_progress`
- `sent_to_delivery`
- `shipment_started`
- `received_by_customer`
- `delivery_completed`

Их в проекте сейчас нет.

## 7. Есть ли риск, что оплаченный заказ станет expired unpaid

По текущему helper почти нет.

Причина:

- `isProfileExpiredUnpaidOrder` сначала проверяет `UNPAID_STATUSES`
- `UNPAID_STATUSES = ['created', 'processing']`

То есть:

- `paid`
- `purchased`
- `shipped`
- `handed_to_courier`
- `arrived_pvz`
- `completed`
- `delivered`

не могут уйти в expired unpaid только из-за старого `created_at` или `payment_expires_at`.

Это место сейчас безопасное.

## 8. Рекомендуемая новая логика

Текущая проблема именно в whitelist active-статусов. Безопаснее сделать active не whitelist’ом, а "всё, что не terminal и не expired unpaid".

Рекомендуемая модель:

- `TERMINAL_HISTORY_STATUSES`:
  - `completed`
  - `delivered` если это финальный backend status
  - `cancelled`
  - `canceled`
  - другие реально terminal-only статусы, если backend их отдаёт
- `EXPIRED_UNPAID`:
  - только для `created`
  - только для `processing`

Безопасная логика:

```js
isProfileHistoryOrder(order) =
  !isDraft && (isExpiredUnpaid || TERMINAL_HISTORY_STATUSES.includes(rawStatus))

isProfileActiveOrder(order) =
  isDraft || !isProfileHistoryOrder(order)
```

Или эквивалент:

```js
isDraft || (!isExpiredUnpaid && !TERMINAL_HISTORY_STATUSES.includes(rawStatus))
```

Плюсы:

- новый неизвестный backend status не исчезает
- промежуточные delivery-статусы остаются в active
- в history попадают только terminal статусы и expired unpaid

## 9. Файлы для правки на следующем шаге

Минимально:

- `lib/api/account.js`

Вероятно дополнительно для выравнивания визуала и шагов:

- `components/profile/ProfileDashboard.js`
- `components/profile/Orders.js`
- `components/profile/TrackingModal.js`

Почему:

- в dashboard уже есть рассинхрон маппинга (`processing`, `shipped`, `handed_to_courier`, нет `handed_to_courier_ikeya`, нет `delivered`)
- tracking modal живёт на frontend statuses, а не на technical statuses

## 10. Итог

- `status_description` не участвует в логике active/history.
- По коду статусы `shipped`, `handed_to_courier`, `handed_to_courier_ikeya` должны оставаться active.
- Если заказ с текстом `Передано в доставку` пропал, наиболее вероятно backend прислал новый technical status, которого нет в `ACTIVE_STATUSES`.
- Корневая проблема: active сейчас считается через whitelist, поэтому неизвестный status исчезает. Лучше перевести логику на terminal-based history и считать active как "всё остальное".
