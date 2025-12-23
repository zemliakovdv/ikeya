import Link from 'next/link';

const categories = [
  'Сад и балкон',
  'Мебель для хранения вещей',
  'Освещение',
  'Диваны и кресла',
  'Текстиль',
  'Кровати и матрасы',
  'Небольшое хранение и организация',
  'Дети и младенцы',
  'Украшения',
  'Столы и стулья',
  'Столы и стулья для учебы',
  'Приготовление пищи и сервировка стола',
  'Кухни и кухонная техника',
  'Ковры, коврики и полы',
  'Стирка и уборка',
  'Ванные комнаты',
  'Домашняя электроника',
  'Улучшение дома',
];

const collections = [
  'SEGERÖN', 'LACKÖ', 'VARMANSO', 'TARNO', 'TORPARÖ',
  'SEGERÖN', 'LACKÖ', 'VARMANSO', 'TARNO', 'TORPARÖ'
];

export default function CatalogFilter() {
  return (
    <aside className="filter-aside">
      {/* Категории */}
      <div className="filter-section">
        <div className="section-title">
          <span>Категория</span>
        </div>
        <ul className="category-list grand-catalog">
          {categories.map((category, index) => (
            <li key={index} className="category-item">
              <Link href="/catalog-start" className="category-link">
                {category}
              </Link>
            </li>
          ))}
        </ul>
      </div>

      {/* Цена */}
      <div className="filter-section">
        <div className="section-title">
          <span>Цена</span>
        </div>
        <div className="price-slider">
          <div className="price-slider-fill"></div>
          <div className="slider-handle handle-min"></div>
          <div className="slider-handle handle-max"></div>
        </div>
        <div className="price-range">
          <input type="number" className="price-input" placeholder="от" defaultValue="19.99" />
          <input type="number" className="price-input" placeholder="до" defaultValue="4999" />
        </div>
      </div>

      {/* Коллекции */}
      <div className="filter-section">
        <div className="section-title">
          <span>Коллекции</span>
          <span className="toggle-icon">
            <img src="/assets/img/icons/arrow-down.svg" alt="" />
          </span>
        </div>
        <div className="filter-search active">
          <div className="filter-search-inner">
            <svg width="16" height="16" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M13.2 12.54L10.52 9.86C11.4133 8.81333 11.96 7.46 11.96 5.98C11.9533 2.68 9.27333 0 5.98 0C2.68667 0 0 2.68 0 5.98C0 9.28 2.68 11.96 5.98 11.96C7.46 11.96 8.81333 11.4133 9.86 10.52L12.54 13.2C12.6333 13.2933 12.7467 13.3333 12.8667 13.3333C12.9867 13.3333 13.1067 13.2867 13.1933 13.2C13.3733 13.02 13.3733 12.7267 13.1933 12.54H13.2ZM5.98 11.0267C3.2 11.0267 0.933333 8.76 0.933333 5.98C0.933333 3.2 3.19333 0.933333 5.98 0.933333C8.76667 0.933333 11.0267 3.2 11.0267 5.98C11.0267 8.76 8.76 11.0267 5.98 11.0267Z" fill="#757575"/>
            </svg>
            <input className="filter-search-input" type="search" placeholder="Поиск" aria-label="Поиск" id="collection-search" />
          </div>
        </div>
        <div className="brand-grid">
          {collections.map((collection, index) => (
            <label key={index} className="brand-checkbox">
              <input type="checkbox" />
              <span className="custom-checkbox"></span>
              <span>{collection}</span>
            </label>
          ))}
        </div>
        <button className="show-more">
          Еще 75 <span className="toggle-icon"><img src="/assets/img/icons/arrow-down.svg" alt="" /></span>
        </button>
      </div>

      {/* Ширина */}
      <div className="filter-section" style={{display: 'none'}}>
        <div className="section-title">
          <span>Ширина</span>
          <span className="toggle-icon"><img src="/assets/img/icons/arrow-down.svg" alt="" /></span>
        </div>
        <div className="brand-grid">
          <label className="brand-checkbox">
            <input type="checkbox" />
            <span className="custom-checkbox"></span>
            <span>0 - 49 см</span>
          </label>
          <label className="brand-checkbox">
            <input type="checkbox" />
            <span className="custom-checkbox"></span>
            <span>50 - 99 см</span>
          </label>
          <label className="brand-checkbox">
            <input type="checkbox" />
            <span className="custom-checkbox"></span>
            <span>100 - 149 см</span>
          </label>
          <label className="brand-checkbox">
            <input type="checkbox" />
            <span className="custom-checkbox"></span>
            <span>150 - 199 см</span>
          </label>
          <label className="brand-checkbox">
            <input type="checkbox" />
            <span className="custom-checkbox"></span>
            <span>200+ см</span>
          </label>
        </div>
      </div>

      {/* Высота */}
      <div className="filter-section" style={{display: 'none'}}>
        <div className="section-title">
          <span>Высота</span>
          <span className="toggle-icon"><img src="/assets/img/icons/arrow-down.svg" alt="" /></span>
        </div>
        <div className="brand-grid">
          <label className="brand-checkbox">
            <input type="checkbox" />
            <span className="custom-checkbox"></span>
            <span>0 - 39 см</span>
          </label>
          <label className="brand-checkbox">
            <input type="checkbox" />
            <span className="custom-checkbox"></span>
            <span>40 - 49 см</span>
          </label>
          <label className="brand-checkbox">
            <input type="checkbox" />
            <span className="custom-checkbox"></span>
            <span>50 - 59 см</span>
          </label>
          <label className="brand-checkbox">
            <input type="checkbox" />
            <span className="custom-checkbox"></span>
            <span>60 - 69 см</span>
          </label>
          <label className="brand-checkbox">
            <input type="checkbox" />
            <span className="custom-checkbox"></span>
            <span>70+ см</span>
          </label>
        </div>
      </div>

      {/* Глубина */}
      <div className="filter-section" style={{display: 'none'}}>
        <div className="section-title">
          <span>Глубина</span>
          <span className="toggle-icon"><img src="/assets/img/icons/arrow-down.svg" alt="" /></span>
        </div>
        <div className="brand-grid">
          <label className="brand-checkbox">
            <input type="checkbox" />
            <span className="custom-checkbox"></span>
            <span>0 - 39 см</span>
          </label>
          <label className="brand-checkbox">
            <input type="checkbox" />
            <span className="custom-checkbox"></span>
            <span>40 - 59 см</span>
          </label>
          <label className="brand-checkbox">
            <input type="checkbox" />
            <span className="custom-checkbox"></span>
            <span>60 - 79 см</span>
          </label>
          <label className="brand-checkbox">
            <input type="checkbox" />
            <span className="custom-checkbox"></span>
            <span>80 - 99 см</span>
          </label>
          <label className="brand-checkbox">
            <input type="checkbox" />
            <span className="custom-checkbox"></span>
            <span>100+ см</span>
          </label>
        </div>
      </div>

      {/* Длина */}
      <div className="filter-section" style={{display: 'none'}}>
        <div className="section-title">
          <span>Длина</span>
          <span className="toggle-icon"><img src="/assets/img/icons/arrow-down.svg" alt="" /></span>
        </div>
        <div className="brand-grid">
          <label className="brand-checkbox">
            <input type="checkbox" />
            <span className="custom-checkbox"></span>
            <span>0 - 59 см</span>
          </label>
          <label className="brand-checkbox">
            <input type="checkbox" />
            <span className="custom-checkbox"></span>
            <span>60 - 79 см</span>
          </label>
          <label className="brand-checkbox">
            <input type="checkbox" />
            <span className="custom-checkbox"></span>
            <span>80 - 99 см</span>
          </label>
          <label className="brand-checkbox">
            <input type="checkbox" />
            <span className="custom-checkbox"></span>
            <span>100 - 119 см</span>
          </label>
          <label className="brand-checkbox">
            <input type="checkbox" />
            <span className="custom-checkbox"></span>
            <span>120+ см</span>
          </label>
        </div>
      </div>

      {/* Материал */}
      <div className="filter-section" style={{display: 'none'}}>
        <div className="section-title">
          <span>Материал</span>
          <span className="toggle-icon"><img src="/assets/img/icons/arrow-down.svg" alt="" /></span>
        </div>
        <div className="brand-grid">
          <label className="brand-checkbox">
            <input type="checkbox" />
            <span className="custom-checkbox"></span>
            <span>Цельная древесина</span>
          </label>
          <label className="brand-checkbox">
            <input type="checkbox" />
            <span className="custom-checkbox"></span>
            <span>Металл</span>
          </label>
          <label className="brand-checkbox">
            <input type="checkbox" />
            <span className="custom-checkbox"></span>
            <span>Пластик</span>
          </label>
          <label className="brand-checkbox">
            <input type="checkbox" />
            <span className="custom-checkbox"></span>
            <span>Ткань</span>
          </label>
          <label className="brand-checkbox">
            <input type="checkbox" />
            <span className="custom-checkbox"></span>
            <span>Ротанг</span>
          </label>
        </div>
        <button className="show-more">
          Еще 4 <span className="toggle-icon"><img src="/assets/img/icons/arrow-down.svg" alt="" /></span>
        </button>
      </div>

      {/* Цвет */}
      <div className="filter-section" style={{display: 'none'}}>
        <div className="section-title">
          <span>Цвет</span>
          <span className="toggle-icon"><img src="/assets/img/icons/arrow-down.svg" alt="" /></span>
        </div>
        <div className="color-options">
          <div className="color-option color-beige active" title="Бежевый"></div>
          <div className="color-option color-gray" title="Серый"></div>
          <div className="color-option color-brown" title="Коричневый"></div>
          <div className="color-option color-white" title="Белый"></div>
          <div className="color-option color-multicolor" title="Разноцветный"></div>
        </div>
        <button className="show-more">
          Еще 4 <span className="toggle-icon"><img src="/assets/img/icons/arrow-down.svg" alt="" /></span>
        </button>
      </div>

      {/* Количество мест */}
      <div className="filter-section" style={{display: 'none'}}>
        <div className="section-title">
          <span>Количество мест</span>
          <span className="toggle-icon"><img src="/assets/img/icons/arrow-down.svg" alt="" /></span>
        </div>
        <div className="brand-grid">
          <label className="brand-checkbox">
            <input type="checkbox" />
            <span className="custom-checkbox"></span>
            <span>1 человек</span>
          </label>
          <label className="brand-checkbox">
            <input type="checkbox" />
            <span className="custom-checkbox"></span>
            <span>До 2 мест</span>
          </label>
          <label className="brand-checkbox">
            <input type="checkbox" />
            <span className="custom-checkbox"></span>
            <span>2-местный</span>
          </label>
          <label className="brand-checkbox">
            <input type="checkbox" />
            <span className="custom-checkbox"></span>
            <span>3-местный</span>
          </label>
          <label className="brand-checkbox">
            <input type="checkbox" />
            <span className="custom-checkbox"></span>
            <span>До 4 мест</span>
          </label>
        </div>
        <button className="show-more">
          Еще 2 <span className="toggle-icon"><img src="/assets/img/icons/arrow-down.svg" alt="" /></span>
        </button>
      </div>

      {/* Форма */}
      <div className="filter-section" style={{display: 'none'}}>
        <div className="section-title">
          <span>Форма</span>
          <span className="toggle-icon"><img src="/assets/img/icons/arrow-down.svg" alt="" /></span>
        </div>
        <div className="brand-grid">
          <label className="brand-checkbox">
            <input type="checkbox" />
            <span className="custom-checkbox"></span>
            <span>Прямоугольный</span>
          </label>
          <label className="brand-checkbox">
            <input type="checkbox" />
            <span className="custom-checkbox"></span>
            <span>Стандартный</span>
          </label>
          <label className="brand-checkbox">
            <input type="checkbox" />
            <span className="custom-checkbox"></span>
            <span>Квадрат</span>
          </label>
          <label className="brand-checkbox">
            <input type="checkbox" />
            <span className="custom-checkbox"></span>
            <span>Круглый</span>
          </label>
          <label className="brand-checkbox">
            <input type="checkbox" />
            <span className="custom-checkbox"></span>
            <span>Другой</span>
          </label>
        </div>
        <button className="show-more">
          Еще 4 <span className="toggle-icon"><img src="/assets/img/icons/arrow-down.svg" alt="" /></span>
        </button>
      </div>

      <p className="filter-notification">
        Для просмотра всех фильтров выберите конечную ветку категории
      </p>

      <button className="apply-filters" style={{display: 'none'}}>
        Очистить фильтры
      </button>
    </aside>
  );
}
