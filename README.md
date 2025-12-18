# IKEYA - Интернет-магазин мебели

## 🚀 Технологии

- **Next.js 14** (App Router)
- **React 18**
- **Swiper 11** (слайдеры)
- **Bootstrap 5** (сетка и компоненты)
- **JavaScript** (ES6+)

## Структура проекта

ikeya-furniture-shop/
├── app/ # Next.js App Router
│ ├── layout.js # Главный layout с подключением стилей
│ ├── page.js # Главная страница
│ ├── globals.css # Глобальные стили
│ └── api/v1/products/ # API эндпоинты
├── components/ # React компоненты
│ ├── layout/ # Header, Footer
│ ├── sections/ # Секции страницы
│ └── products/ # Компоненты товаров
├── data/ # Моковые данные
│ └── mockData.js
├── public/ # Статические файлы
│ └── assets/
│ ├── css/
│ │ └── main.css # Ваши стили из верстки
│ └── img/ # Картинки
└── package.json