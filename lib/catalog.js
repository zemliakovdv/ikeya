// Временные mock данные - потом заменишь на API
export async function getCatalogData(params = {}) {
  const { level1, level2, level3, level4 } = params;
  
  // Определяем текущий уровень
  let currentLevel = 0;
  if (level4) currentLevel = 4;
  else if (level3) currentLevel = 3;
  else if (level2) currentLevel = 2;
  else if (level1) currentLevel = 1;
  
  // Формируем breadcrumbs
  const breadcrumbs = [
    { label: 'Главная', url: '/' },
    { label: 'Каталог', url: '/catalog' }
  ];
  
  if (level1) breadcrumbs.push({ label: 'Сад и балкон', url: `/catalog/${level1}` });
  if (level2) breadcrumbs.push({ label: 'Садовая и балконная мебель', url: `/catalog/${level1}/${level2}` });
  if (level3) breadcrumbs.push({ label: 'Садовая мебель', url: `/catalog/${level1}/${level2}/${level3}` });
  if (level4) breadcrumbs.push({ label: 'Садовые стулья и кресла', url: null });
  
  return {
    breadcrumbs,
    title: breadcrumbs[breadcrumbs.length - 1].label,
    currentLevel,
    categories: getMockCategories(currentLevel),
    filters: getMockFilters(currentLevel),
    products: getMockProducts(),
    totalProducts: 320
  };
}

function getMockCategories(level) {
  if (level === 0) {
    return [
      { id: 1, name: 'Коллекции', url: '/catalog/collections', image: '/assets/img/catalog-page/collection.png' },
      { id: 2, name: 'Уценённые товары', url: '/catalog/sale', image: '/assets/img/catalog-page/collection_2.png' },
      { id: 3, name: 'Сад и балкон', url: '/catalog/garden', image: '/assets/img/catalog-page/collection_3.png' },
      // ... остальные категории
    ];
  }
  return [];
}

function getMockFilters(level) {
  const baseFilters = {
    categories: getMockCategoryNav(level),
    priceMin: 19.99,
    priceMax: 4999,
    collections: [
      { value: 'segeron', label: 'SEGERÖN' },
      { value: 'lacko', label: 'LACKÖ' },
      { value: 'varmanso', label: 'VARMANSO' },
      { value: 'tarno', label: 'TARNO' },
      { value: 'torparo', label: 'TORPARÖ' },
    ],
    width: [
      { value: '0-49', label: '0 - 49 см' },
      { value: '50-99', label: '50 - 99 см' },
      { value: '100-149', label: '100 - 149 см' },
      { value: '150-199', label: '150 - 199 см' },
      { value: '200+', label: '200+ см' },
    ],
    height: [
      { value: '0-39', label: '0 - 39 см' },
      { value: '40-49', label: '40 - 49 см' },
      { value: '50-59', label: '50 - 59 см' },
      { value: '60-69', label: '60 - 69 см' },
      { value: '70+', label: '70+ см' },
    ],
    depth: [
      { value: '0-39', label: '0 - 39 см' },
      { value: '40-59', label: '40 - 59 см' },
      { value: '60-79', label: '60 - 79 см' },
      { value: '80-99', label: '80 - 99 см' },
      { value: '100+', label: '100+ см' },
    ],
    length: [
      { value: '0-59', label: '0 - 59 см' },
      { value: '60-79', label: '60 - 79 см' },
      { value: '80-99', label: '80 - 99 см' },
      { value: '100-119', label: '100 - 119 см' },
      { value: '120+', label: '120+ см' },
    ],
    materials: [
      { value: 'wood', label: 'Цельная древесина' },
      { value: 'metal', label: 'Металл' },
      { value: 'plastic', label: 'Пластик' },
      { value: 'fabric', label: 'Ткань' },
      { value: 'rattan', label: 'Ротанг' },
    ],
    colors: [
      { value: 'beige', label: 'Бежевый' },
      { value: 'gray', label: 'Серый' },
      { value: 'brown', label: 'Коричневый' },
      { value: 'white', label: 'Белый' },
      { value: 'multicolor', label: 'Разноцветный' },
    ],
    seats: [
      { value: '1', label: '1 место' },
      { value: '2', label: '2 места' },
      { value: '3', label: '3 места' },
      { value: '4+', label: '4+ мест' },
    ],
    shape: [
      { value: 'round', label: 'Круглая' },
      { value: 'square', label: 'Квадратная' },
      { value: 'rectangular', label: 'Прямоугольная' },
    ]
  };
  
  return baseFilters;
}

function getMockCategoryNav(level) {
  const baseCategories = [
    { id: 1, name: 'Сад и Балкон', url: '/catalog/garden', active: level >= 1 }
  ];
  
  if (level >= 2) {
    baseCategories.push({
      id: 2,
      name: 'Садовая и балконная мебель',
      url: '/catalog/garden/furniture',
      active: level === 2,
      hasSubcategories: level >= 2
    });
  }
  
  if (level >= 2) {
    baseCategories[baseCategories.length - 1].subcategories = [
      { id: 21, name: 'Садовая мебель', url: '/catalog/garden/furniture/outdoor', active: level === 3 },
      { id: 22, name: 'Садовые столы и стулья', url: '/catalog/garden/furniture/tables-chairs', active: false },
      { id: 23, name: 'Журнальные столики для сада и балкона', url: '/catalog/garden/furniture/coffee-tables', active: false },
    ];
  }
  
  if (level >= 4) {
    baseCategories[baseCategories.length - 1].subcategories = [
      { id: 31, name: 'Садовые стулья и кресла', url: '/catalog/garden/furniture/outdoor/chairs', active: true },
      { id: 32, name: 'Кресла для сада и балкона', url: '/catalog/garden/furniture/outdoor/armchairs', active: false },
      { id: 33, name: 'Стулья и табуреты для балкона и террасы', url: '/catalog/garden/furniture/outdoor/stools', active: false },
    ];
  }
  
  return baseCategories;
}

function getMockProducts() {
  return Array.from({ length: 20 }, (_, i) => ({
    id: i + 1,
    name: `ТОРПАРÖ Кресло садовое, складное ${i + 1}`,
    description: 'Складное, белое',
    price: 99.99 + (i * 10),
    oldPrice: i % 3 === 0 ? 129.99 + (i * 10) : null,
    url: `/product/${i + 1}`,
    images: [
      { url: '/assets/img/catalog-page/product-1.jpg', thumb: '/assets/img/catalog-page/product-1-thumb.jpg' },
      { url: '/assets/img/catalog-page/product-2.jpg', thumb: '/assets/img/catalog-page/product-2-thumb.jpg' },
    ],
    badges: i % 4 === 0 ? [{ type: 'hit', text: 'Хит продаж' }] : i % 5 === 0 ? [{ type: 'new', text: 'Новинка' }] : [],
    promo: i % 3 === 0 ? 'PROMO10' : null
  }));
}
