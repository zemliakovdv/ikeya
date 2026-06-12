# SEO Catalog Pages Plan

## 1. Goal

Добавить в frontend отдельный SEO-контур для статических каталоговых страниц вида `/catalog/seo/[slug]`, который:

- получает конфигурацию страницы и список товаров из backend API `seo_catalog_pages`;
- рендерится как indexable SSR/SSG-страница с корректными metadata;
- не ломает текущий каталог `/catalog` и `/catalog/[...slug]`;
- не зависит от клиентского infinite scroll, фильтров и сортировки.

Текущий каталог уже реализован как серверные страницы:

- [`app/catalog/page.js`](app/catalog/page.js)
- [`app/catalog/[...slug]/page.js`](app/catalog/[...slug]/page.js)

Обе страницы рендерят интерактивный каталог с `ProductGridWithPagination` и клиентским `InfiniteProductGrid`, поэтому SEO-страницы лучше вводить как отдельный route layer, а не как ответвление внутри текущих страниц.

## 2. Required Frontend Flow

### 2.1 Request flow

1. Пользователь или бот открывает `/catalog/seo/:slug`.
2. Next route `app/catalog/seo/[slug]/page.js` получает `params.slug`.
3. Серверный слой frontend вызывает backend `GET /api/v1/seo_catalog_pages/:slug`.
4. Backend возвращает:
   - SEO-конфигурацию страницы;
   - текстовые блоки;
   - список товаров для страницы;
   - metadata для индексации;
   - служебные признаки публикации.
5. Если slug не найден или страница выключена, frontend вызывает `notFound()`.
6. Если страница найдена:
   - `generateMetadata()` собирает `title`, `description`, canonical, OG, Twitter;
   - page component рендерит `h1`, breadcrumbs, optional intro/SEO text, grid товаров;
   - при необходимости добавляется JSON-LD `BreadcrumbList` и `ItemList`.
7. Страница должна быть пригодна для static generation и ISR, без зависимости от client-side догрузки.

### 2.2 Rendering flow

1. `generateStaticParams()` заранее получает список slug через `GET /api/v1/seo_catalog_pages`.
2. Для каждого slug Next генерирует HTML страницы.
3. При запросе страницы используются только server fetch и server components.
4. Клиентские интерактивные части каталога не обязательны и не должны быть критичны для индексации.

## 3. Files To Create

| File | Purpose |
| --- | --- |
| `app/catalog/seo/[slug]/page.js` | Основной route для SEO-каталоговой страницы |
| `app/catalog/seo/[slug]/loading.js` | Опциональный lightweight fallback для route segment |
| `app/catalog/seo/[slug]/not-found.js` | Опциональный локальный not-found UI, если нужен отдельный UX |
| `lib/api/seoCatalogPages.js` | Узкий frontend helper для `list` и `getBySlug` без смешивания с обычным каталогом |
| `app/sitemap.js` или расширение существующего sitemap-файла | Добавление `/catalog/seo/[slug]` в sitemap |
| `app/api/revalidate/route.js` или выделенный secure endpoint | On-demand revalidation для SEO-страниц |
| `components/catalog/products/SeoProductCard.js` | Опциональный упрощенный серверно-дружественный card-компонент, если текущий `ProductCard` окажется слишком интерактивным для SEO-контура |

Примечание: фактическое создание `loading.js` и `not-found.js` не обязательно в первом этапе, но их стоит предусмотреть в архитектуре.

## 4. Files To Reuse

| File | Reuse strategy |
| --- | --- |
| [`components/catalog/Breadcrumbs.js`](components/catalog/Breadcrumbs.js) | Переиспользовать для UI и JSON-LD `BreadcrumbList` |
| [`components/home/SeoSection.js`](components/home/SeoSection.js) | Переиспользовать для нижнего SEO-текста, если backend отдаёт html/text блок |
| [`lib/config/api.js`](lib/config/api.js) | Переиспользовать `buildApiUrl`, `SITE_URL`, `buildAssetUrl` |
| [`lib/api/ikea.js`](lib/api/ikea.js) | Не расширять без необходимости; можно брать только общие image/api helpers как ориентир |
| [`app/product/[...slug]/page.js`](app/product/[...slug]/page.js) | Использовать как паттерн для metadata и JSON-LD |
| [`app/catalog/page.js`](app/catalog/page.js) | Использовать как паттерн canonical/OG/Twitter и базовой структуры каталога |
| [`app/catalog/[...slug]/page.js`](app/catalog/[...slug]/page.js) | Использовать как паттерн SSR product list + breadcrumbs |

Не рекомендуется переиспользовать напрямую:

- [`components/catalog/products/ProductGridWithPagination.js`](components/catalog/products/ProductGridWithPagination.js)
- [`components/catalog/products/InfiniteProductGrid.js`](components/catalog/products/InfiniteProductGrid.js)

Причина: эти компоненты завязаны на client-side pagination/infinite scroll и нужны для browse UX, а не для статических SEO landings.

## 5. Backend API Contract

Ниже рекомендуемый контракт, который frontend должен ожидать от backend.

### 5.1 `GET /api/v1/seo_catalog_pages`

Назначение: список slug для `generateStaticParams()` и sitemap.

Рекомендуемый response:

```json
{
  "data": [
    {
      "id": 1,
      "slug": "divany-do-1000-byn",
      "updated_at": "2026-06-11T10:00:00Z",
      "is_active": true
    }
  ],
  "meta": {}
}
```

Минимально необходимое frontend-полю:

- `slug`
- `updated_at` для sitemap `lastModified`
- `is_active`, если backend отдает и черновики, и опубликованные страницы

### 5.2 `GET /api/v1/seo_catalog_pages/:slug`

Назначение: полный payload для server render.

Рекомендуемый response:

```json
{
  "data": {
    "id": 1,
    "slug": "divany-do-1000-byn",
    "is_active": true,
    "title": "Диваны до 1000 BYN",
    "h1": "Диваны до 1000 BYN",
    "description": "Подборка диванов IKEA до 1000 BYN.",
    "seo_text": "<p>...</p>",
    "canonical_url": "https://ikeya.by/catalog/seo/divany-do-1000-byn",
    "meta_title": "Диваны до 1000 BYN купить в Беларуси | IKEYA",
    "meta_description": "Подборка диванов IKEA до 1000 BYN с доставкой по Беларуси.",
    "meta_keywords": "диваны ikea, диваны до 1000 byn",
    "robots": "index,follow",
    "og_image": "/assets/img/og-default.jpg",
    "breadcrumbs": [
      { "name": "Главная", "href": "/" },
      { "name": "Каталог", "href": "/catalog" },
      { "name": "Диваны до 1000 BYN", "href": "/catalog/seo/divany-do-1000-byn" }
    ],
    "products": [
      {
        "id": "123",
        "attributes": {}
      }
    ],
    "meta": {
      "total": 20
    },
    "updated_at": "2026-06-11T10:00:00Z"
  }
}
```

Критично для frontend:

- `slug`
- `is_active`
- `h1` или `title`
- `meta_title`
- `meta_description`
- `canonical_url`
- `products`
- `breadcrumbs`
- `updated_at`

Желательно, чтобы `products` уже были в том же shape, что и обычный catalog product list: массив сущностей с `id` и `attributes`, чтобы не вводить отдельную нормализацию карточек.

## 6. Page Behavior

SEO-страница должна вести себя иначе, чем обычный каталог:

- без infinite scroll;
- без фильтров;
- без сортировки;
- без query-driven pagination;
- без мутаций URL при скролле;
- без зависимости от client fetch после первого HTML.

Рекомендуемое поведение:

1. Весь список товаров страницы приходит на сервере одним payload.
2. Страница рендерит фиксированную grid-выкладку.
3. Если товаров нет, но страница активна:
   - либо рендерится empty SEO page с текстом;
   - либо страница переводится в `noindex`.
4. Если страница неактивна или backend отдает 404:
   - `notFound()`.
5. Breadcrumbs должны отражать SEO URL, а не реальную category chain.

## 7. Metadata

Нужно повторить уже используемый в проекте паттерн metadata из:

- [`app/catalog/page.js`](app/catalog/page.js)
- [`app/catalog/[...slug]/page.js`](app/catalog/[...slug]/page.js)
- [`app/product/[...slug]/page.js`](app/product/[...slug]/page.js)

Рекомендуемый набор:

- `title`
- `description`
- `keywords` при наличии
- `robots`
- `alternates.canonical`
- `openGraph.title`
- `openGraph.description`
- `openGraph.url`
- `openGraph.images`
- `twitter.card`
- `twitter.title`
- `twitter.description`
- `twitter.images`

Дополнительно:

- breadcrumbs JSON-LD уже можно получить через `components/catalog/Breadcrumbs.js`;
- для product list имеет смысл добавить JSON-LD `ItemList` с позициями и URL товаров;
- canonical всегда должен указывать на `/catalog/seo/[slug]`, если backend не задаёт другой канонический URL явно.

## 8. Static Generation / ISR

Текущий root catalog помечен как `dynamic = 'force-dynamic'` в [`app/catalog/page.js`](app/catalog/page.js), а category catalog сейчас тоже не выглядит как static route. Для SEO-страниц нужен отдельный режим.

Рекомендуемая стратегия:

- использовать `generateStaticParams()` на основе `GET /api/v1/seo_catalog_pages`;
- в `page.js` использовать server fetch с `next: { revalidate: N }`;
- выставить `export const revalidate = 3600` как стартовое безопасное значение;
- оставить `dynamicParams = true`, если новые slug могут появляться между deploy;
- если slug должны существовать только после rebuild, можно перейти на `dynamicParams = false` позже.

Практический компромисс первого этапа:

- prebuild только известные slug;
- обновлять HTML через ISR раз в 1 час;
- отдельным webhook-trigger обновлять страницу вне расписания.

## 9. On-Demand Revalidation

По текущему коду в проекте не найдено существующей инфраструктуры:

- нет `revalidatePath`;
- нет `revalidateTag`;
- нет `app/api/revalidate/route.js`;
- нет явного `REVALIDATE_SECRET`-контура.

Значит, SEO-страницы лучше проектировать сразу с отдельным revalidation endpoint.

Рекомендуемый flow:

1. Backend публикует или обновляет SEO page.
2. Backend вызывает frontend endpoint, например `POST /api/revalidate`.
3. Frontend валидирует secret.
4. Frontend вызывает:
   - `revalidatePath('/catalog/seo/[slug]', 'page')` для точечного slug;
   - при необходимости `revalidatePath('/sitemap.xml')` или route-level sitemap regeneration.
5. Endpoint возвращает success/failure payload для backend логов.

Рекомендуемый request body:

```json
{
  "secret": "shared-secret",
  "type": "seo_catalog_page",
  "slug": "divany-do-1000-byn"
}
```

## 10. Sitemap Integration

В текущем frontend найден `public/robots.txt`, но не найден действующий sitemap route/file. Это значит, что интеграцию sitemap придётся проектировать как новую или как расширение внешнего механизма, если он существует вне текущего репозитория.

Для frontend-плана нужно предусмотреть:

1. Если sitemap уже генерируется в другом месте, добавить туда `/catalog/seo/[slug]`.
2. Если sitemap будет жить в Next:
   - создать `app/sitemap.js`;
   - объединить туда product/catalog/seo URLs поэтапно или только SEO pages на первом шаге.

Для каждой SEO page желательно отдавать:

- `url`
- `lastModified`
- `changeFrequency: 'weekly'`
- `priority`, например `0.8`

SEO pages не должны попадать в sitemap, если:

- `is_active = false`
- backend вернул `noindex`
- страница пуста и признана неиндексируемой бизнес-правилом

## 11. Product Rendering

### 11.1 Can current `ProductCard` be reused?

Технически да, но с ограничениями.

[`components/catalog/products/ProductCard.js`](components/catalog/products/ProductCard.js) сейчас:

- client component;
- использует `useRouter`;
- зависит от `CartContext` и `FavoritesContext`;
- содержит hover image, variant switching, add-to-cart, like, cart counter;
- ориентирован на commerce UX, а не на lightweight SEO listing.

### 11.2 Recommendation

Рекомендуемый путь:

- для первого запуска проверить, можно ли безопасно отрендерить SEO grid через текущий `ProductCard`;
- если страница должна быть максимально лёгкой и стабильно индексируемой, ввести `SeoProductCard` как упрощённый компонент.

`SeoProductCard` должен содержать только:

- ссылку на товар;
- изображение;
- название;
- цену;
- опционально badge;

Без:

- add to cart;
- favorites;
- variant interactivity;
- client-only state, не влияющего на индексируемый HTML.

Итоговая рекомендация:

- short-term: допускается reuse `ProductCard`, если это ускоряет запуск;
- medium-term: для SEO-контура лучше отдельный `SeoProductCard`, чтобы не тянуть commerce-интерактивность на статическую landing page.

## 12. Risks

| Risk | Impact | Mitigation |
| --- | --- | --- |
| Backend отдаст products в shape, отличном от обычного каталога | Поломка карточек или ручная нормализация в page | Требовать shape совместимый с текущими `product.attributes` |
| Переиспользование `ProductGridWithPagination`/`InfiniteProductGrid` затянет client logic в SEO route | Хуже индексируемость, лишний JS, сложность | Для SEO route рендерить статическую grid без infinite scroll |
| Переиспользование текущего `ProductCard` потянет тяжелые client dependencies | Больше JS и потенциальные hydration edge cases | Вынести `SeoProductCard` отдельным этапом |
| Отсутствует текущий sitemap механизм | SEO pages не попадут в sitemap сразу | Добавить sitemap route или явно интегрироваться в существующий внешний генератор |
| Отсутствует revalidation endpoint | Изменения slug будут обновляться только по ISR | Добавить secure on-demand revalidation |
| Дублирование с обычными category pages | Каннибализация SEO / неверный canonical | canonical должен указывать на выбранную index page, дубликаты помечать noindex при необходимости |
| Пустые подборки | Тонкие страницы низкого качества | Порог публикации и fallback policy на backend или noindex |

## 13. Phased Implementation Plan

### Phase 1. Discovery and contract lock

- Подтвердить backend response shape для `list` и `detail`.
- Зафиксировать publish rules: active/inactive, noindex/index, empty page policy.
- Подтвердить, нужен ли отдельный `SeoProductCard`.

### Phase 2. Frontend API wrapper

- Создать `lib/api/seoCatalogPages.js`.
- Реализовать:
  - `getSeoCatalogPages()`
  - `getSeoCatalogPageBySlug(slug)`
- Нормализовать только response contract, без смешивания с обычным каталогом.

### Phase 3. Route implementation

- Создать `app/catalog/seo/[slug]/page.js`.
- Добавить `generateStaticParams()`.
- Добавить `generateMetadata()`.
- Рендерить breadcrumbs, h1, intro, product grid, seo text.

### Phase 4. Product card decision

- Либо временно переиспользовать `ProductCard`;
- либо добавить `SeoProductCard` и переключить SEO page на него.

### Phase 5. Indexation infrastructure

- Добавить sitemap integration.
- Добавить on-demand revalidation endpoint.
- Подключить backend webhook.

### Phase 6. Hardening

- Проверить 404/disabled/noindex сценарии.
- Проверить canonical consistency.
- Проверить HTML output на отсутствие критичных client-only провалов.

## 14. Acceptance Checklist

- Существует route `/catalog/seo/[slug]`.
- Страница рендерится сервером без client-side обязательной дозагрузки товаров.
- Для существующих slug работает `generateStaticParams()`.
- Для slug есть корректные `title`, `description`, canonical, OG, Twitter.
- На странице есть `h1`.
- Breadcrumbs ведут на SEO URL и отдают JSON-LD.
- Список товаров отображается в валидном product shape.
- Страница корректно обрабатывает `inactive` и `not found`.
- SEO pages добавляются в sitemap.
- SEO pages можно точечно переинвалидировать без полного deploy.
- Текущий каталог `/catalog` и `/catalog/[...slug]` не изменён.

## 15. Recommended First Safe Coding Step

Первый безопасный шаг: создать только frontend API wrapper и route skeleton без подключения sitemap и revalidation.

Конкретно:

1. Создать `lib/api/seoCatalogPages.js` с двумя server helper-функциями.
2. Создать `app/catalog/seo/[slug]/page.js`.
3. Реализовать:
   - `generateStaticParams()`
   - `generateMetadata()`
   - базовый server render страницы
4. На первом шаге:
   - не трогать текущий каталог;
   - не подключать infinite scroll;
   - не подключать фильтры и сортировку;
   - не менять `lib/api/ikea.js`;
   - не добавлять revalidation, пока не подтверждён backend webhook contract.

Это даёт минимальный вертикальный slice с наименьшим риском для существующего каталога и позволяет отдельно проверить backend contract, HTML output и metadata до внедрения sitemap/revalidation.
