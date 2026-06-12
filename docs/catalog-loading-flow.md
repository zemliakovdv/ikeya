# Catalog Loading Flow IKEYA

## 0. Scope

Документ собран только по frontend/Next.js-коду в этом репозитории.

Не запускались:

- сервер
- браузер
- Playwright
- Lighthouse
- devtools

Цель: зафиксировать текущий технический flow каталога после уже принятого первого безопасного шага по page 2+ infinite scroll, чтобы вместе с backend определить основные точки ускорения.

Важно:

- код приложения в этом шаге не менялся;
- internal routes page 2+ уже находятся в принятом переходном состоянии;
- в этом отчёте это состояние описывается как текущий факт.

### Уже принятый безопасный шаг

По текущему коду и контексту задачи:

- internal routes для page 2+ возвращают переходный shape `{ data, products, meta }`;
- `InfiniteProductGrid` читает оба формата через `normalizeProductsResponse()`;
- page 2+ в `/catalog` и `/catalog/[...slug]` считается уже стабилизированным на уровне контракта ответа.

### Основные файлы анализа

Routes:

- `app/catalog/page.js`
- `app/catalog/[...slug]/page.js`
- `app/search/page.js`
- `app/api/products/route.js`
- `app/api/categories/[categoryId]/products/route.js`

Catalog components:

- `components/catalog/*`
- `components/catalog/products/InfiniteProductGrid.js`
- `components/catalog/products/ProductGridWithPagination.js`
- `components/catalog/sidebar/FilterAside.js`
- `components/catalog/sidebar/CategoryTree.js`
- `components/catalog/sidebar/PriceFilter.js`
- `components/catalog/sidebar/CheckboxFilter.js`
- `components/catalog/ProductSort.js`
- `components/catalog/FilterChips.js`
- `components/catalog/CategoriesGrid.js`
- `components/catalog/ChildCategoriesSlider.js`
- `components/catalog/products/ProductCard.js`

API/helpers:

- `lib/api/ikea.js`
- `lib/config/api.js`
- `lib/utils/categoryHelpers.js`

Неактивный код, не участвующий в текущем route flow каталога:

- `components/catalog/CatalogClient.js`

### Команды поиска, использованные при анализе

```bash
rg -n "getCategories|getCachedCategoriesTree|getCategory|getCategoryProducts|getProducts|categories|products|filters|sort|min_price|max_price|revalidate|cache|localStorage|sessionStorage" app components lib contexts

rg -n "catalog|slug|parent_ids|breadcrumbs|children|InfiniteProductGrid|FilterAside|CategoryTree|ProductSort|FilterChips|PriceFilter|CheckboxFilter" app components lib contexts

rg -n "fetch\(|buildApiUrl|IMAGES_BASE_URL|buildAssetUrl|local_images|remote_image_url|image_url" app components lib contexts
```

## 1. Краткая схема flow

### `/catalog`

#### Какие server/client компоненты участвуют

Server:

- `app/catalog/page.js`

Client:

- `components/catalog/Breadcrumbs.js`
- `components/catalog/CategoriesGrid.js`
- `components/catalog/sidebar/FilterAside.js`
- `components/catalog/MobileCatalogFilters.js`
- `components/catalog/ProductSort.js`
- `components/catalog/FilterChips.js`
- `components/catalog/products/ProductGridWithPagination.js`
- `components/catalog/products/InfiniteProductGrid.js`
- `components/catalog/Pagination.js`

#### Какие данные грузятся на первом рендере

`app/catalog/page.js` делает `Promise.all` из:

1. `getCachedCategoriesTree()`
2. `getCachedCatalogSeo()`
3. `getProducts({ page: currentPage, per_page: 20, sort })`

#### Какие запросы уходят

Первый render `/catalog`:

1. `GET /categories/tree`
2. `GET /products?page={page}&per_page=20&sort?`

`getCachedCatalogSeo()` повторно использует payload из `/categories/tree`, а не отдельный endpoint.

#### Что блокирует первый рендер

HTML первого рендера зависит от:

- categories tree
- SEO данных каталога из tree payload
- первой страницы products

#### Как работает page 2+

После SSR:

- `InfiniteProductGrid` получает `initialProducts`
- хранит локальный `products` state
- при прокрутке вызывает internal route:
  - `/api/v1/products?page=N...`
- internal route возвращает переходный shape:
  - `{ data, products, meta }`
- `InfiniteProductGrid` нормализует ответ и append-ит новые товары

### `/catalog/[...slug]`

#### Как slug берётся из URL

В `app/catalog/[...slug]/page.js`:

- `const { slug } = await params`
- `slug` — массив path segments
- `currentSlug = slug[slug.length - 1]`

#### Как определяется текущая категория

Текущий flow:

1. `getCachedCategoriesTree()`
2. `flattenCategoriesTree(tree)`
3. `findCategoryBySlug(allCategories, currentSlug)`

То есть category id для товаров и фильтров определяется по последнему slug, а не по полному path.

#### Как строятся breadcrumbs

Через:

- `findNodeInTree(tree, slugChain)`
- `buildBreadcrumbsFromTree(tree, slugChain)`

Breadcrumbs не приходят отдельным готовым backend endpoint для category page.

#### Как определяются children

Через:

- `const { node: currentNode } = findNodeInTree(tree, slug)`
- `const childCategories = currentNode?.children || []`

#### Как грузится первая страница товаров

После резолва `currentCategory.id` page делает `Promise.all`:

1. `getCategoryWithFilters(currentCategory.id)`
2. `getCategoryProducts(currentCategory.id, currentPage, 20, sort, sp || {})`

#### Как работает page 2+

`InfiniteProductGrid` вызывает:

- `/api/v1/categories/{categoryId}/products?page=N...`

Current internal route shape:

- `{ data, products, meta }`

`InfiniteProductGrid` читает его через нормализацию и append-ит товары в текущую category list.

#### Что происходит при переходе между категориями

При переходе на другую category:

- route заново SSR-ится;
- снова нужен `categories/tree`;
- снова ищется `currentCategory`;
- заново загружаются:
  - `/categories/{id}`
  - `/categories/{id}/products?page=1...`
- `ProductGridWithPagination` меняет ключ;
- `InfiniteProductGrid` сбрасывает локальный список и начинает заново с новой первой страницы.

## 2. Таблица файлов

| Файл | Роль | Server/Client | Что загружает | Кому передаёт props/state | Риски для скорости |
| --- | --- | --- | --- | --- | --- |
| `app/catalog/page.js` | root catalog route | Server | tree, catalog SEO, first page products | `FilterAside`, `MobileCatalogFilters`, `ProductGridWithPagination` | первый рендер зависит от tree и products |
| `app/catalog/[...slug]/page.js` | category route | Server | tree, category filters, first page category products | sidebar, toolbar, grid | полная зависимость от tree для slug/category resolve |
| `app/api/products/route.js` | internal route page 2+ root catalog | Server | backend `/products` | `InfiniteProductGrid` | no-store, root filters не поддерживаются тут полноценно |
| `app/api/categories/[categoryId]/products/route.js` | internal route page 2+ category | Server | backend `/categories/{id}/products` | `InfiniteProductGrid` | min/max фильтрация делается на Next-слое |
| `components/catalog/products/ProductGridWithPagination.js` | мост SSR -> infinite grid + pagination | Client | не делает fetch | `InfiniteProductGrid`, `Pagination` | меняет grid key при category/query reset |
| `components/catalog/products/InfiniteProductGrid.js` | page 2+ infinite loading | Client | internal `/api/v1/*` routes | локальный state товаров | зависит от response/meta contract |
| `components/catalog/sidebar/FilterAside.js` | desktop filters | Client | не делает fetch, читает URL | меняет route query через `router.push` | каждый фильтр инициирует новый route render |
| `components/catalog/MobileCatalogFilters.js` | mobile filters | Client | не делает fetch, читает URL | меняет route query через `router.push` | дублирует часть logic desktop filters |
| `components/catalog/sidebar/CategoryTree.js` | sidebar category navigation | Client | не делает fetch | строит ссылки | требует уже загруженный tree |
| `components/catalog/ProductSort.js` | sort UI | Client | не делает fetch | меняет query | каждый выбор сортировки делает новый route render |
| `components/catalog/FilterChips.js` | active filters chips | Client | не делает fetch | меняет query | повторно собирает filter query |
| `components/catalog/CategoriesGrid.js` | root categories grid | Client | не делает fetch | рендерит root categories | много картинок, обычный `img` |
| `components/catalog/ChildCategoriesSlider.js` | root-level children slider | Client | не делает fetch | рендерит children | клиентский Swiper, дополнительная инициализация |
| `components/catalog/products/ProductCard.js` | product card | Client | не делает catalog fetch | cart/favorites actions | много клиентской логики на карточку |
| `lib/api/ikea.js` | основной catalog API layer | Server/Shared | tree, category, products | page routes и другие части app | смешение `revalidate` и in-memory cache |
| `lib/utils/categoryHelpers.js` | tree/slug/breadcrumb helpers | Shared | не делает fetch | page routes и nav | обход дерева при каждом category resolve |
| `lib/config/api.js` | URL/image helpers | Shared | не делает fetch | весь app | часть URL всё равно местами собирается вручную |

## 3. Таблица API-запросов

| Этап | Endpoint | Method | Где вызывается | Параметры | Когда вызывается | Кэшируется ли | Потенциальная проблема |
| --- | --- | --- | --- | --- | --- | --- | --- |
| root catalog SSR | `/categories/tree` | GET | `getCachedCategoriesTree()` -> `app/catalog/page.js` | нет | первый render `/catalog` | да, `revalidate: 300` + in-memory 5 мин | тянется всё дерево, хотя root route использует только root categories |
| root catalog SEO | `/categories/tree` | GET | `getCachedCatalogSeo()` | нет | metadata/render `/catalog` | да | SEO каталога зависит от tree payload |
| root catalog SSR | `/products` | GET | `getProducts()` -> `app/catalog/page.js` | `page`, `per_page`, `sort` | первый render `/catalog` и query navigation | да, `revalidate: 300` | root route не использует полноценные backend facets/filters |
| category metadata | `/categories/tree` | GET | `generateMetadata()` в `app/catalog/[...slug]/page.js` | нет | metadata category page | да | metadata тоже требует tree lookup |
| category resolve | `/categories/tree` | GET | `app/catalog/[...slug]/page.js` | нет | каждый category render | да | current category резолвится без backend endpoint по path |
| category info + filters | `/categories/{id}` | GET | `getCategoryWithFilters()` | `id` | category render | да, `revalidate: 300` | отдельный fetch только ради category attrs и available_filters |
| category first page SSR | `/categories/{id}/products` | GET | `getCategoryProducts()` | `page`, `per_page`, `sort`, `min_price`, `max_price`, `filters[...][]` | category render | да, `revalidate: 300` | filters и products не объединены в один endpoint |
| page 2+ root catalog | internal `/api/v1/products` -> rewrite на backend `/api/v1/products` | GET | `InfiniteProductGrid` | `page`, `per_page`, `sort` + queryString | infinite scroll `/catalog` | нет, `cache: no-store` | root route не прокидывает полноценные root filters |
| page 2+ category | internal `/api/v1/categories/{id}/products` -> rewrite на backend | GET | `InfiniteProductGrid` | `page`, `per_page`, `sort`, `min_price`, `max_price`, `filters[...][]` | infinite scroll category | нет, `cache: no-store` | min/max фильтрация остаётся на Next-слое |
| categories flat list | `/categories?per_page=100&page=N` | GET | `getCachedCategories()` / `app/api/categories/route.js` | paginated | активным catalog route не используется напрямую | in-memory после no-store fetch | потенциально тяжёлый путь, если начать использовать на клиенте |
| popular categories | `/categories/popular` | GET | `getPopularCategories()` в `lib/api/ikea.js` | нет | в основном не core flow каталога | да, `fetchAPI` | влияет на другие разделы, но не на category route |
| top categories | `/categories/top` | GET | `getTopCategories()` в `lib/api/ikea.js` | нет | в основном не core flow каталога | да, `fetchAPI` | не central для catalog loading flow |
| search suggest | `/search/suggest` | GET | `app/search/SearchPageContent.js`, `app/api/search/route.js` | `q`, `page`, `per_page`, filters | search page | search route no-store | не основной catalog route, но паттерн похож на category products flow |

### Текущий shape internal routes page 2+

Оба internal route сейчас возвращают:

```json
{
  "data": [],
  "products": [],
  "meta": {}
}
```

Это переходный единый контракт для page 2+.

## 4. Определение категории по slug

### Как frontend получает slug path

`app/catalog/[...slug]/page.js` получает:

- `params.slug`

Это массив path segments для URL вида:

- `/catalog/parent/child`

### Нужен ли полный categories tree

Да. По текущему коду полный tree обязателен для:

- поиска category по slug
- построения breadcrumbs
- определения children/subcategories
- определения root/non-root level category

### Как находится current category

Текущая схема:

1. `getCachedCategoriesTree()`
2. `flattenCategoriesTree(tree)`
3. `findCategoryBySlug(allCategories, currentSlug)`

То есть:

- сначала tree превращается в flat list;
- затем поиск идёт по последнему slug segment.

### Сколько запросов требуется

Минимальный category render требует:

1. `/categories/tree`
2. `/categories/{id}`
3. `/categories/{id}/products`

Metadata category page также использует tree.

### Есть ли поиск по 900+ категориям на frontend

Да.

По коду есть:

- загрузка полного tree;
- flatten tree в массив всех нод;
- поиск category на frontend logic.

Это доказанный по коду bottleneck.

### Как строится путь `/catalog/parent/child`

Путь в UI и breadcrumbs строится из slug chain.

`basePath` category page строится через:

- `buildCategoryChain(allCategories, currentCategory)`
- затем slug каждого узла склеивается в `/catalog/...`

### Как используются `parent_ids`

`parent_ids` используются в helpers для:

- `buildCategoryChain(...)`
- определения родительской цепочки
- вычисления URL/переходов между уровнями

### Как строятся breadcrumbs

Через:

- `buildBreadcrumbsFromTree(tree, slugChain)`

То есть breadcrumbs строятся из дерева, а не из готового backend breadcrumbs endpoint.

### Как определяются children/subcategories

Через:

- `findNodeInTree(tree, slugChain)`
- `currentNode?.children || []`

### Что происходит, если slug не найден

Если `currentCategory` не найден:

- выполняется `redirect('/catalog')`

### Есть ли backend endpoint для resolve category by slug/path

В текущем коде такого endpoint не найдено.

Это backend-dependent узкое место.

## 5. Загрузка товаров

### Где грузится первая страница товаров

`/catalog`:

- в `app/catalog/page.js`
- через `getProducts({ page, per_page: 20, sort })`

`/catalog/[...slug]`:

- в `app/catalog/[...slug]/page.js`
- через `getCategoryProducts(currentCategory.id, currentPage, 20, sort, sp || {})`

### Где грузится page 2+

Page 2+ всегда грузит `InfiniteProductGrid`.

Root catalog:

- internal `/api/v1/products`

Category catalog:

- internal `/api/v1/categories/{id}/products`

### Какие параметры уходят

Для category products:

- `category id`
- `page`
- `per_page`
- `filters[...][]`
- `min_price`
- `max_price`
- `sort`

Для root page 2+:

- `page`
- `per_page`
- `sort`
- queryString из route

### Где хранится список товаров

SSR first page:

- в props route page

Page 2+:

- в локальном state `products` внутри `InfiniteProductGrid`

### Как работает append

В `InfiniteProductGrid`:

- response нормализуется через `normalizeProductsResponse()`
- `sanitize(rawProducts)`
- если `nextProducts.length > 0`:
  - `setProducts((prev) => [...prev, ...nextProducts])`

### Как работает reset при смене категории

При смене `categoryId`, `initialPage`, `queryString` или `initialProducts`:

- меняется `requestKey`
- старый fetch abort-ится
- `products` state сбрасывается в `sanitizedInitialProducts`
- `pageRef` сбрасывается в `initialPage + 1`

### Как работает reset при смене фильтра

Filters меняют URL query через `router.push`.

После этого:

- route заново SSR-ится;
- `InfiniteProductGrid` получает новый `queryString`;
- список page 2+ сбрасывается на новую первую страницу.

### Как работает reset при смене сортировки

Точно так же:

- `sort` меняет query;
- route rerender;
- `InfiniteProductGrid` получает новый `requestKey`;
- локальный список сбрасывается.

### Есть ли abort старых запросов

Да.

В `InfiniteProductGrid` используется:

- `abortRef.current?.abort()`
- `AbortController`

### Есть ли requestKey/race protection

Да.

Есть:

- `requestKeyRef`
- проверка:
  - `if (controller.signal.aborted || requestKeyRef.current !== activeRequestKey) return;`

### Есть ли дублирующиеся fetch

Да, на route уровне:

- tree fetch повторяется при каждом category navigation;
- category page отдельно тянет tree, category info, products first page.

Page 2+ itself после принятого safe step не показывает по коду проблему shape mismatch.

## 6. Фильтры

### Откуда берутся фильтры

На category route filters берутся из:

- `getCategoryWithFilters(currentCategory.id)`
- endpoint `/categories/{id}`

То есть filters не строятся из products response first page.

### Приходят ли filters вместе с products response

Нет, по текущему коду это отдельный fetch.

### Строятся ли filters на frontend из товаров

Для category catalog нет.

Для search page часть range/derived logic строится на клиенте, но это отдельный flow.

### Есть ли отдельный endpoint

Специального endpoint вида `/categories/{id}/filters` в коде не найдено.

Фактический источник filters:

- `/categories/{id}`

### Как формируется `filters[PARAMETER][]=VALUE_ID`

В `FilterAside` и `MobileCatalogFilters`:

- создаётся `URLSearchParams`
- для каждого выбранного значения выполняется:
  - `params.append(\`filters[${parameter}][]\`, value)`

### Как работает price filter

Desktop:

- `PriceFilter`
- debounce 600ms в `FilterAside`

Mobile:

- draft state в `MobileCatalogFilters`
- apply по кнопке

### Есть ли debounce

Да:

- desktop category filters: 600ms
- search page: 600ms

### Есть ли лишние запросы на каждый клик

Да.

Каждый checkbox filter:

- меняет query через `router.push`
- запускает новый route render
- повторно вызывает category first page flow

### Где применяется `min_price/max_price`

1. SSR category first page:
   - `getCategoryProducts(..., sp || {})`
2. Page 2+ category:
   - internal `app/api/categories/[categoryId]/products/route.js`

### Есть ли проблема, что `min_price/max_price` фильтруются на Next-слое, а meta приходит от backend

Да, проблема есть и доказана кодом.

В internal category page 2+ route:

- backend response сначала приходит как есть;
- затем `filteredProducts` режутся на Next-слое;
- `meta` берётся из backend без пересчёта.

Следствие:

- `total`
- `total_pages`

могут не соответствовать реально отфильтрованному page 2+ набору.

## 7. Сортировка

### Где хранится sort

Sort хранится в URL query:

- `sort`

### Как sort попадает в запрос

SSR:

- route читает `searchParams.sort`
- пробрасывает в `getProducts()` или `getCategoryProducts()`

Page 2+:

- `InfiniteProductGrid` берёт `queryString`
- добавляет туда `page` и `per_page`

### Происходит ли полный reset списка

Да.

Смена `sort`:

- вызывает `router.push`
- route rerender
- `InfiniteProductGrid` сбрасывает page 2+ state под новый `requestKey`

### Как влияет на infinite scroll

После смены sort:

- список начинается заново с SSR first page;
- append page 2+ продолжается уже с новым `sort`.

### Есть ли race condition при быстрой смене сортировки

На уровне page 2+ частично закрыто:

- abort старого запроса есть;
- requestKey protection есть.

На уровне полного route navigation UX всё равно зависит от скорости нового SSR render.

## 8. Карточка товара в каталоге

### Какие поля товара нужны карточке

`ProductCard` использует:

- `product.id`
- `attributes.sku`
- `attributes.slug`
- `attributes.name_ru`
- `attributes.small_desc_name`
- `attributes.price_byn` или `attributes.price`
- `attributes.local_images`
- `attributes.variants`
- `attributes.is_bestseller`
- `attributes.is_popular`
- `attributes.is_new`

### Какие поля реально приходят из endpoint

По коду карточка ожидает эти поля уже в products response.

Дополнительных catalog fetch по SKU для карточек не найдено.

### Как строится URL товара

Через helper в `ProductCard`:

- если есть `slug` и `sku` -> `/product/${slug}-${sku}`
- иначе fallback `/product/${sku}`

### Как строится image URL

Через локальный helper `resolveImage(path)`:

- `/assets...` остаётся локальным
- `http...` заменяется на `IMAGES_BASE_URL`
- относительный path склеивается с `IMAGES_BASE_URL`

### Используется ли `local_images`

Да, это основной источник картинок карточки.

### Используется ли `remote_image_url`

В самой product card — нет как основной путь.

Card работает в основном через:

- `local_images`
- variant images

### Есть ли fallback

Да:

- `PLACEHOLDER_IMAGE = '/assets/img/no-image.jpg'`
- `onError` на `img`

### Есть ли дополнительные запросы по SKU для карточек

В catalog flow не найдено.

### Используется ли Next Image или img

В `ProductCard` используется:

- обычный `img`

### Есть ли lazy loading / priority

Да:

- main image: `loading={priority ? 'eager' : 'lazy'}`
- hover image: `loading="lazy"`

### Возможны ли тяжёлые изображения на первом экране

Да.

Это доказано кодом:

- обычные `img`
- hover image может держать второй image
- variants добавляют ещё миниатюры

## 9. Кэширование

| Что кэшируется | Где | TTL/revalidate | Когда инвалидируется | Риск устаревания | Влияние на скорость |
| --- | --- | --- | --- | --- | --- |
| categories tree payload | `getCachedCategoriesTreePayload()` in-memory | 5 минут | TTL / рестарт процесса | средний | ускоряет повторные category render в одном процессе |
| categories tree fetch | Next fetch cache | `revalidate: 300` | TTL | средний | уменьшает повторные сетевые tree fetch |
| catalog SEO inside tree payload | тот же payload | 5 минут / `revalidate: 300` | TTL | средний | не требует отдельного SEO endpoint |
| `fetchAPI()` в `lib/api/ikea.js` | Next fetch cache | `revalidate: 300` | TTL | средний | ускоряет category/products/category-info SSR |
| flat categories cache | `_categoriesCache` in-memory | 5 минут | TTL | средний | полезен, но не central для active catalog route |
| dedupe tree request | `_categoriesTreeRequestPromise` | пока идёт запрос | после resolve/reject | низкий | убирает параллельные дубли |
| internal page 2+ routes | route-level fetch | `cache: no-store` | каждый запрос | низкий | page 2+ всегда тянется свежим запросом |
| browser history page state | `window.history.replaceState` | без TTL | при navigation | низкий | синхронизирует URL page 2+ |
| localStorage/sessionStorage для active catalog flow | не найдено | нет | нет | нет | на основной catalog flow не влияет |
| images browser cache | браузерный кэш | зависит от headers backend/static | зависит от headers | предположение | может помогать повторным карточкам/категориям |

## 10. Request waterfall

### A. Первый заход на `/catalog`

Запросы:

1. `/categories/tree`
2. `/products?page=1&per_page=20&sort?`

Что блокирует HTML:

- tree
- first page products

Что догружается на клиенте:

- page 2+ через `InfiniteProductGrid`

### B. Переход `/catalog` -> `/catalog/[slug]`

Запросы:

1. `/categories/tree`
2. `/categories/{id}`
3. `/categories/{id}/products?page=1...`

Что пересчитывается:

- current category resolve
- breadcrumbs
- children
- filter labels/titles
- first page products

Что кэшируется:

- tree fetch и fetchAPI частично через `revalidate`
- in-memory tree payload

Где возможен повтор `categories/tree`:

- при каждом новом category render
- в metadata flow category page

### C. Переход между категориями

Запросы:

1. `/categories/tree`
2. `/categories/{id}`
3. `/categories/{id}/products?page=1...`

Что сбрасывается:

- local page 2+ list в `InfiniteProductGrid`
- `currentPage`
- `hasMore`
- `pageRef`

Что может дублироваться:

- tree fetch / tree lookup
- category filters fetch

### D. Применение фильтра

Запросы:

1. route navigation
2. `/categories/tree`
3. `/categories/{id}`
4. `/categories/{id}/products?page=1&filters...`

Reset/append:

- список page 2+ сбрасывается на новую SSR first page;
- новый append начинается с page 2.

Риски race condition:

- на page 2+ есть abort/requestKey protection;
- на route уровне всё равно есть зависимость от повторного SSR.

### E. Смена сортировки

Запросы:

1. route navigation
2. `/categories/tree`
3. `/categories/{id}`
4. `/categories/{id}/products?page=1&sort=...`

Reset/append:

- reset списка;
- новый append с page 2 под новым sort.

Риски:

- page 2+ race partly закрыт;
- SSR wait остаётся.

### F. Infinite scroll page 2+

Internal route:

- `/api/v1/products`
- `/api/v1/categories/{id}/products`

Backend route:

- `/products`
- `/categories/{id}/products`

Response shape:

- `{ data, products, meta }`

Append:

- `setProducts((prev) => [...prev, ...nextProducts])`

Abort/requestKey:

- есть `abortRef`
- есть `requestKeyRef`
- есть guard against stale response

## 11. Узкие места frontend

Ниже только доказанные по коду bottlenecks. Если формулировка не полностью доказана, она помечена как предположение.

1. Полное дерево категорий загружается для category resolve, breadcrumbs и children.
2. Поиск категории по slug/path выполняется на frontend/server Next-слое, а не через backend endpoint.
3. `currentCategory` определяется по последнему slug, а не по полному path.
4. Category route выполняет раздельные fetch:
   - tree
   - category info/filters
   - category products
5. Root catalog filter UI не обеспечен полноценным backend/data contract для фильтров.
6. `min_price/max_price` в internal category page 2+ route фильтруются на Next-слое, а `meta` остаётся backend-ным.
7. Desktop и mobile filters дублируют значительную часть query/filter logic.
8. Каждый checkbox filter делает новый route render, а не локальный data refresh.
9. `CategoriesGrid` использует обычные `img`.
10. `ProductCard` содержит заметный объём клиентской логики на каждый item.
11. `ChildCategoriesSlider` добавляет клиентскую инициализацию Swiper.
12. Предположение: при 900+ категориях flatten + tree search на каждом category navigation даст заметную CPU-нагрузку даже при частичном кэшировании сети.

Console logging:

- критичных лишних `console.log` в активном catalog flow не найдено;
- `console.error` присутствуют в error paths и сами по себе не выглядят bottleneck.

## 12. Что нужно от backend для ускорения

### Вариант 1: `GET /categories/resolve?path=parent/child`

Должен возвращать:

- current category
- breadcrumbs
- children
- parent chain
- seo/meta

Что заменяет на frontend:

- tree lookup для current category
- `flattenCategoriesTree`
- `findCategoryBySlug`
- часть breadcrumb/children reconstruction

Сколько запросов/вычислений экономит:

- минимум один обязательный tree fetch
- обход полного дерева категорий

Плюсы:

- точечно убирает самое дорогое backend-dependent место

Минусы:

- products и filters всё ещё могут идти отдельно

### Вариант 2: `GET /categories/{id}/products` с facets

Должен возвращать:

- products
- pagination meta
- available filters/facets
- price range
- sort options

Что заменяет:

- отдельный `GET /categories/{id}` для filters

Как помогает фильтрам:

- filters/facets можно брать из того же ответа, что и products

Плюсы:

- убирает отдельный fetch filters
- упрощает first render category

Минусы:

- slug/path resolve всё ещё не решён

### Вариант 3: `GET /catalog/page?path=parent/child`

Single endpoint первого рендера категории:

- category
- breadcrumbs
- children
- products first page
- filters/facets
- price_range
- seo

Что заменяет:

- tree fetch
- category info fetch
- first page products fetch
- frontend slug resolve

Сколько запросов экономит:

- category first render можно сократить с 3 запросов до 1

Плюсы:

- максимальный потенциальный эффект

Минусы:

- риск большого ответа
- нужен чёткий контракт

## 13. Минимальный backend contract

Самый полезный endpoint:

- `GET /catalog/resolve?path={slugPath}`

Пример response shape:

```json
{
  "category": {
    "id": 123,
    "slug": "chairs",
    "name": "...",
    "parent_ids": [],
    "breadcrumbs": [],
    "seo": {}
  },
  "children": [],
  "products": {
    "data": [],
    "meta": {}
  },
  "filters": [],
  "price_range": {
    "min": 0,
    "max": 0
  },
  "sort_options": []
}
```

### Какие поля реально нужны frontend по текущему коду

Для category:

- `id`
- `slug`
- `translated_name` или `name`
- `parent_ids`

Для breadcrumbs:

- либо готовый `breadcrumbs`
- либо достаточно parent chain + current category slug/name

Для children:

- `id`
- `slug`
- `translated_name` или `name`
- одно image field:
  - `icon_url`
  - `pictogram_url`
  - `background_image_url`
  - `local_image_path`
  - `remote_image_url`

Для products:

- текущий shape, совместимый с `ProductCard`

Для filters:

- `parameter`
- `translated_name | name`
- `values[].id`
- `values[].translated_name | name`

Для price:

- готовый `price_range.min/max`

Для sort:

- `sort_options`
- либо хотя бы `default_sort`

## 14. Что можно ускорить только на frontend

| Идея | Файлы | Что меняется | Риск | Ожидаемый эффект |
| --- | --- | --- | --- | --- |
| более явная memoization tree/category-derived computations | category routes, helpers | меньше лишних вычислений | низкий | небольшое снижение CPU |
| дальнейшее использование abort controller там, где появятся новые client fetch | client data layers | меньше stale responses | низкий | стабильнее UI |
| сохранение requestKey protection как базового паттерна | `InfiniteProductGrid` и похожие client fetch | защита от race | низкий | стабильнее page 2+ |
| уменьшение повторных fetch на соседних категориях через prefetch | navigation/category UI | быстрее переходы | средний | ускорение navigation UX |
| lazy load filters UI там, где допустимо | filters UI | меньше первичной client нагрузки | средний | легче mount |
| разделение server/client data ещё жёстче | routes/catalog client pieces | меньше client state на первом экране | средний | быстрее hydration |
| кэширование categories tree на frontend-side navigation уровне | route/data layer | меньше повторной работы | средний | быстрее category transitions |
| image loading tweaks | grids/cards/sliders | меньше веса первого экрана | низкий/средний | быстрее визуальная загрузка |
| skeleton без blocking | route/client UI | лучше perceived performance | низкий | лучше UX |
| убрать лишние `console.log`, если появятся | разные компоненты | меньше шума | низкий | минимальный эффект |

## 15. Что нельзя нормально ускорить без backend

1. Resolve категории по slug/path.
2. Необходимость грузить всё дерево категорий для current category context.
3. Отсутствие combined endpoint category + filters + products.
4. Отсутствие facets/price_range в products response как единого источника.
5. Некорректная `meta` при Next-side `min_price/max_price`.
6. Тяжёлые category first render waterfalls.
7. Отсутствие backend-prepared breadcrumbs/children.

## 16. Итоговая рекомендация

### 3 самые дорогие точки сейчас

1. Полная зависимость category route от `categories/tree`.
2. Frontend/server-side resolve category по slug вместо backend endpoint по path.
3. Раздельные fetch category context и products, плюс Next-side `min_price/max_price` filtering для page 2+.

### Что можно сделать быстро на frontend

1. Дальше удерживать единый page 2+ contract и requestKey/abort pattern.
2. Сокращать повторные вычисления и дубли filter logic.
3. Улучшать image loading и prefetch соседних navigation paths.

### Что лучше делать через backend

1. Добавить `GET /categories/resolve?path=...`.
2. Вернуть facets/filters вместе с category products.
3. В идеале перейти к single endpoint первого рендера category page.

### Какой endpoint даст максимальный эффект

Максимальный эффект даст:

- `GET /catalog/page?path=parent/child`

Потому что он одновременно убирает:

- tree fetch
- frontend slug resolve
- отдельный category fetch
- часть вычислений breadcrumbs/children

### Рекомендуемый порядок работ

1. Зафиксировать текущий принятый page 2+ contract как baseline.
2. Затем сделать backend endpoint resolve category by path.
3. Потом объединить products + filters/facets.
4. После этого, если нужно, перейти к single endpoint первого рендера category page.
