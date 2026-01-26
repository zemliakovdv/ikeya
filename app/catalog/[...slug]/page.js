// app/catalog/[...slug]/page.js

export async function generateMetadata({ params }) {
  const { slug = [] } = params;
  const level = slug.length;

  // Определяем заголовки по уровню
  const getTitleByLevel = (lvl, slugArray) => {
    switch (lvl) {
      case 1:
        return `${slugArray[0]} | Каталог IKEA`;
      case 2:
        return `${slugArray[1]} — ${slugArray[0]} | IKEA`;
      case 3:
        return `${slugArray[2]} — ${slugArray[1]} | IKEA`;
      case 4:
        return `${slugArray[3]} — ${slugArray[2]} | IKEA`;
      default:
        return 'Каталог IKEA';
    }
  };

  return {
    title: getTitleByLevel(level, slug),
    description: `Каталог товаров IKEA — ${slug.join(' / ')}`,
  };
}

export default async function CatalogDynamicPage({ params, searchParams }) {
  const { slug = [] } = params;
  const level = slug.length;

  // Деструктурируем slug по уровням
  const [level1, level2, level3, level4] = slug;

  console.log('📍 Catalog Page Debug:', {
    level,
    slug,
    level1,
    level2,
    level3,
    level4,
    searchParams
  });

  // Здесь импортируй нужный компонент в зависимости от уровня
  // Пока заглушка для проверки работоспособности
  return (
    <main className="catalog">
      <div className="container">
        <h1>Каталог — Уровень {level}</h1>
        
        <div style={{ background: '#f5f5f5', padding: '20px', marginTop: '20px' }}>
          <h2>Debug Info:</h2>
          <pre>{JSON.stringify({ level, slug, level1, level2, level3, level4 }, null, 2)}</pre>
        </div>

        {/* Здесь будет твой компонент CatalogPage */}
      </div>
    </main>
  );
}
