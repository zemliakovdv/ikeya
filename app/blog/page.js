// app/blog/page.js

import Breadcrumbs from '@/components/catalog/Breadcrumbs';
import TipsIdeasClient from '@/components/blog/TipsIdeasClient';

const API_BASE_URL = 'http://45.135.234.22/api/v1';
const PER_PAGE = 20;

const BREADCRUMBS = [
  { label: 'Главная', url: '/' },
  { label: 'Советы и идеи' },
];

async function getInitialData() {
  try {
    const res = await fetch(
      `${API_BASE_URL}/content/articles?per_page=${PER_PAGE}&page=1`,
      { next: { revalidate: 300 } }
    );
    if (!res.ok) return { articles: [], meta: {}, rubrics: [] };
    const data = await res.json();

    // Собираем уникальные рубрики из первой страницы
    const rubrics = [
      ...new Set(
        (data.data || [])
          .map((a) => a.attributes.rubric)
          .filter(Boolean)
      ),
    ];

    return {
      articles: data.data || [],
      meta: data.meta || {},
      rubrics,
    };
  } catch (e) {
    console.error('Ошибка загрузки статей блога:', e);
    return { articles: [], meta: {}, rubrics: [] };
  }
}

export const metadata = {
  title: 'Советы и идеи | IKEYA',
  description: 'Советы по обустройству дома, идеи для интерьера и вдохновляющие проекты от IKEYA.',
};

export default async function BlogPage() {
  const { articles, meta, rubrics } = await getInitialData();

  return (
    <main>
      <Breadcrumbs items={BREADCRUMBS} />

      <section className="blog-list">
        <div className="container">
          <div className="row">
            <div className="col-12">
              <h1 className="blog-list__title">Советы и идеи</h1>

              <TipsIdeasClient
                initialArticles={articles}
                initialMeta={meta}
                rubrics={rubrics}
              />
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}