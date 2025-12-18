# 🛋️ IKEYA - Интернет-магазин мебели

Современный интернет-магазин мебели и товаров для дома, построенный на Next.js 14 с использованием App Router.

## 📋 Содержание

- [О проекте](#о-проекте)
- [Технологии](#технологии)
- [Требования](#требования)
- [Установка](#установка)
- [Запуск](#запуск)
- [Структура проекта](#структура-проекта)
- [API](#api)
- [Скрипты](#скрипты)
- [Разработка](#разработка)
- [Деплой](#деплой)
- [Инфраструктура](#инфраструктура)

## 🎯 О проекте

IKEYA — это полнофункциональный интернет-магазин мебели с современным интерфейсом, включающий:
- Каталог товаров с категориями
- Слайдеры и промо-блоки
- Корзину и избранное
- Блог и SEO-секции
- Адаптивный дизайн

## 🚀 Технологии

### Frontend
- **[Next.js 14.2.0](https://nextjs.org/)** — React-фреймворк с App Router
- **[React 18.3.0](https://react.dev/)** — UI библиотека
- **[Swiper 11.1.0](https://swiperjs.com/)** — Слайдеры и галереи
- **[Bootstrap 5.3.8](https://getbootstrap.com/)** — CSS-фреймворк (CDN)

### Стили и шрифты
- **Bootstrap 5** — сетка и компоненты
- **Inter** — Google Fonts
- Кастомные CSS стили

## 📦 Требования

- **Node.js** >= 18.0.0
- **npm** >= 9.0.0 или **yarn** >= 1.22.0

## 🔧 Установка

1. Клонируйте репозиторий:
```bash
git clone <repository-url>
cd ikeya
```

2. Установите зависимости:
```bash
npm install
# или
yarn install
```

## ▶️ Запуск

### Режим разработки

Запуск dev-сервера на `http://localhost:3000`:

```bash
npm run dev
# или
yarn dev
```

### Production build

Сборка проекта для production:

```bash
npm run build
# или
yarn build
```

Запуск production-сервера:

```bash
npm start
# или
yarn start
```

### Линтинг

Проверка кода линтером:

```bash
npm run lint
# или
yarn lint
```

## 📁 Структура проекта

```
ikeya-furniture-shop/
├── app/                          # Next.js App Router
│   ├── layout.js                 # Root layout с метаданными
│   ├── page.js                   # Главная страница
│   ├── globals.css               # Глобальные стили
│   └── api/
│       └── v1/
│           └── products/
│               └── route.js      # API endpoint для товаров
│
├── components/                   # React компоненты
│   ├── layout/                   # Компоненты макета
│   │   ├── Header.js            # Шапка сайта
│   │   └── Footer.js            # Подвал сайта
│   ├── sections/                 # Секции страницы
│   │   ├── StartSlider.js       # Главный слайдер
│   │   ├── PopularCategories.js # Популярные категории
│   │   ├── PromoBlock.js        # Промо-блок
│   │   ├── AdsBanner.js         # Рекламные баннеры
│   │   ├── BlogSection.js       # Секция блога
│   │   └── SeoSection.js        # SEO-секция
│   └── products/                 # Компоненты товаров
│       ├── ProductCard.js       # Карточка товара
│       ├── ProductsSlider.js    # Слайдер товаров
│       └── ProductsTabs.js      # Вкладки с товарами
│
├── data/                         # Данные
│   └── mockData.js              # Моковые данные для разработки
│
├── public/                       # Статические файлы
│   └── assets/
│       ├── css/
│       │   └── main.css         # Основные стили
│       └── img/                 # Изображения
│           ├── icons/           # Иконки
│           ├── logo.svg         # Логотип
│           └── main-page/       # Изображения главной страницы
│
├── .github/
│   └── workflows/
│       └── deploy.yml            # GitHub Actions CI/CD
├── scripts/                      # Скрипты деплоя
│   ├── deploy.sh                 # Скрипт ручного деплоя
│   └── setup-server.sh          # Настройка сервера
├── nginx/
│   └── ikea_front.conf            # Nginx конфигурация
├── ecosystem.config.js           # PM2 конфигурация
├── next.config                   # Конфигурация Next.js
├── package.json                  # Зависимости и скрипты
├── README.md                     # Документация
└── INFRASTRUCTURE.md             # Документация по инфраструктуре
```

## 🔌 API

### Получить все товары

```http
GET /api/v1/products
```

### Получить товары по категории

```http
GET /api/v1/products?category=beds
```

**Параметры:**
- `category` (опционально) — фильтр по категории товара

**Пример ответа:**
```json
[
  {
    "id": 1,
    "title": "SLATTUM",
    "description": "Каркас кровати с обивкой, Vissle темно-серый, 140x200 см",
    "price": 135,
    "currencySuffix": "р.",
    "images": [
      {
        "id": 1,
        "src": "/assets/img/main-page/sales-hist/hits-1.png",
        "alt": "Товар 1"
      }
    ],
    "isHit": true,
    "promoLabel": "-10% промокод IKEYA",
    "category": "beds"
  }
]
```

## 📜 Скрипты

| Команда | Описание |
|---------|----------|
| `npm run dev` | Запуск dev-сервера на порту 3000 |
| `npm run build` | Сборка production-версии |
| `npm start` | Запуск production-сервера |
| `npm run lint` | Проверка кода линтером |

## 💻 Разработка

### Компоненты

Все компоненты находятся в директории `components/` и организованы по категориям:
- **layout/** — компоненты макета (Header, Footer)
- **sections/** — секции главной страницы
- **products/** — компоненты для работы с товарами

### Данные

Моковые данные хранятся в `data/mockData.js`. Для production необходимо подключить реальный API.

### Стили

- Глобальные стили: `app/globals.css`
- Основные стили: `public/assets/css/main.css`
- Bootstrap 5 подключен через CDN в `app/layout.js`

### Изображения

Статические изображения размещаются в `public/assets/img/`. Для оптимизации рекомендуется использовать компонент `next/image`.

## 🚀 Деплой

### Production сервер

- **URL**: http://45.135.234.22/ikea_front
- **Сервер**: 45.135.234.22
- **Пользователь**: deploy
- **Директория**: `/home/deploy/apps/ikea_front`

### Автоматический деплой (CI/CD)

Проект использует **GitHub Actions** для автоматического деплоя при push в ветки `main` или `master`.

**Настройка GitHub Secrets**:
- `DEPLOY_HOST` - `45.135.234.22`
- `DEPLOY_USER` - `deploy`
- `DEPLOY_SSH_KEY` - приватный SSH ключ для доступа к серверу

### Ручной деплой

1. **Первоначальная настройка сервера** (выполнить один раз):
```bash
chmod +x scripts/setup-server.sh
./scripts/setup-server.sh
```

2. **Деплой приложения**:
```bash
chmod +x scripts/deploy.sh
./scripts/deploy.sh
```

### Управление на сервере

```bash
# Подключение к серверу
ssh deploy@45.135.234.22

# Переход в директорию приложения
cd /home/deploy/apps/ikea_front

# Управление через PM2
pm2 restart ikea_front    # Перезапуск
pm2 stop ikea_front       # Остановка
pm2 logs ikea_front       # Просмотр логов
pm2 status              # Статус процессов
```

### Nginx конфигурация

Конфигурация Nginx находится в `nginx/ikea_front.conf`.

**Установка на сервере**:
```bash
# Копирование конфигурации
sudo cp nginx/ikea_front.conf /etc/nginx/sites-available/

# Создание симлинка
sudo ln -s /etc/nginx/sites-available/ikea_front.conf /etc/nginx/sites-enabled/

# Проверка конфигурации
sudo nginx -t

# Перезагрузка Nginx
sudo systemctl reload nginx
```

## 🏗️ Инфраструктура

Подробная документация по инфраструктуре сервера, настройке и управлению приложениями находится в файле **[INFRASTRUCTURE.md](./INFRASTRUCTURE.md)**.

**Быстрая инструкция по деплою**: см. **[DEPLOY.md](./DEPLOY.md)**

### Краткая информация

**Приложения на сервере**:
- **ikea_parser**: http://45.135.234.22/ikea_parser/
- **ikea_api**: http://45.135.234.22/api-docs/index.html (Swagger)
- **ikea_front**: http://45.135.234.22/ikea_front (этот проект)

**Технологии**:
- Node.js >= 18
- PM2 для управления процессами
- Nginx как reverse proxy
- GitHub Actions для CI/CD

## 🔄 Следующие шаги

- [x] Настройка CI/CD
- [ ] Интеграция с реальным API (ikea_api)
- [ ] Добавление state management (Redux/Zustand)
- [ ] Настройка TypeScript
- [ ] Оптимизация изображений (next/image)
- [ ] Добавление тестов
- [ ] Настройка HTTPS/SSL
- [ ] Docker контейнеризация (опционально)

## 📄 Лицензия

Проект является приватным.

---

**Разработано с ❤️ для IKEYA**
