import Link from 'next/link';

const categories = [
  { id: 1, image: '/assets/img/catalog-page/collection.png', title: 'Коллекции', link: '/catalog-start' },
  { id: 2, image: '/assets/img/catalog-page/collection2.png', title: 'Уценённые товары', link: '/catalog-start' },
  { id: 3, image: '/assets/img/catalog-page/collection3.png', title: 'Сад и балкон', link: '/catalog-start' },
  { id: 4, image: '/assets/img/catalog-page/collection4.png', title: 'Мебель для хранения вещей', link: '/catalog-start' },
  { id: 5, image: '/assets/img/catalog-page/collection5.png', title: 'Освещение', link: '/catalog-start' },
  { id: 6, image: '/assets/img/catalog-page/collection6.png', title: 'Диваны и кресла', link: '/catalog-start' },
  { id: 7, image: '/assets/img/catalog-page/collection7.png', title: 'Текстиль', link: '/catalog-start' },
  { id: 8, image: '/assets/img/catalog-page/collection8.png', title: 'Кровати и матрасы', link: '/catalog-start' },
  { id: 9, image: '/assets/img/catalog-page/collection9.png', title: 'Небольшое хранение и организация', link: '/catalog-start' },
  { id: 10, image: '/assets/img/catalog-page/collection10.png', title: 'Дети и младенцы', link: '/catalog-start' },
  { id: 11, image: '/assets/img/catalog-page/collection11.png', title: 'Украшения', link: '/catalog-start' },
  { id: 12, image: '/assets/img/catalog-page/collection12.png', title: 'Столы и стулья', link: '/catalog-start' },
  { id: 13, image: '/assets/img/catalog-page/collection13.png', title: 'Столы и стулья для учебы', link: '/catalog-start' },
  { id: 14, image: '/assets/img/catalog-page/collection14.png', title: 'Приготовление пищи и сервировка стола', link: '/catalog-start' },
  { id: 15, image: '/assets/img/catalog-page/collection15.png', title: 'Кухни и кухонная техника', link: '/catalog-start' },
  { id: 16, image: '/assets/img/catalog-page/collection16.png', title: 'Ковры, коврики и полы', link: '/catalog-start' },
  { id: 17, image: '/assets/img/catalog-page/collection17.png', title: 'Стирка и уборка', link: '/catalog-start' },
  { id: 18, image: '/assets/img/catalog-page/collection18.png', title: 'Ванные комнаты', link: '/catalog-start' },
  { id: 19, image: '/assets/img/catalog-page/collection19.png', title: 'Домашняя электроника', link: '/catalog-start' },
  { id: 20, image: '/assets/img/catalog-page/collection20.png', title: 'Улучшение дома', link: '/catalog-start' },
];

export default function CatalogCategories({ limit = null }) {
  const displayCategories = limit ? categories.slice(0, limit) : categories;
  
  return (
    <section className="catalog-categories">
      <div className="container">
        <div className="row">
          <div className="col-12">
            <h2>Каталог</h2>
            <div className="catalog-categories-items">
              {displayCategories.map((category) => (
                <div key={category.id} className="catalog-categoties-card">
                  <Link href={category.link} className="atalog-categoties-card__link">
                    <div className="catalog-categoties-banner">
                      <img src={category.image} alt={category.title} />
                    </div>
                    <p>{category.title}</p>
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
