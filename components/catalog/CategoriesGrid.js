// components/catalog/CategoriesGrid.js
'use client';

import Link from 'next/link';
import Image from 'next/image';

export default function CategoriesGrid({ categories, limit }) {
  // Моковые данные (замени на реальные из API)
  const mockCategories = categories?.length > 0 ? categories : [
    { id: 1, name: 'Коллекции', slug: 'furniture', image: '/assets/img/catalog-page/collection.png' },
    { id: 2, name: 'Уценённые товары', slug: 'kitchen', image: '/assets/img/catalog-page/collection_2.png' },
    { id: 3, name: 'Сад и балкон', slug: 'bedroom', image: '/assets/img/catalog-page/collection_3.png' },
    { id: 4, name: 'Мебель для хранения вещей', slug: 'living-room', image: '/assets/img/catalog-page/collection_4.png' },
    { id: 5, name: 'Освещение', slug: 'kids', image: '/assets/img/catalog-page/collection_5.png' },
    { id: 6, name: 'Диваны и кресла', slug: 'bathroom', image: '/assets/img/catalog-page/collection_6.png' },
    { id: 7, name: 'Текстиль', slug: 'office', image: '/assets/img/catalog-page/collection_7.png' },
    { id: 8, name: 'Кровати и матрасы', slug: 'storage', image: '/assets/img/catalog-page/collection_8.png' },
    { id: 9, name: 'Небольшое хранение и организация', slug: 'storage', image: '/assets/img/catalog-page/collection_9.png' },
  ];

  // Применяем лимит если указан
  const displayCategories = limit ? mockCategories.slice(0, limit) : mockCategories;

  return (
    <section className="catalog-categories">
      <div className="container">
        <div className="row">
          <div className="col-12">
            <h2>Категории</h2>
            <div className="catalog-categories-items">
              {displayCategories.map((category) => (
                <div key={category.id} className="catalog-categoties-card">
                  <Link 
                    href={`/catalog/${category.slug}`}
                    className="atalog-categoties-card__link"
                  >
                    <div className="catalog-categoties-banner">
                      <Image
                        src={category.image}
                        alt={category.name}
                        width={300}
                        height={200}
                        loading="lazy"
                      />
                    </div>
                    <p>{category.name}</p>
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
