// app/blog/page.js

import Breadcrumbs from '@/components/catalog/Breadcrumbs';
import TipsIdeasClient from '@/components/blog/TipsIdeasClient';

import { buildApiUrl } from '@/lib/config/api';
const PER_PAGE = 20;

const BREADCRUMBS = [
  { label: 'Главная', url: '/' },
  { label: 'Советы и идеи' },
];

async function getInitialData() {
  try {
    const res = await fetch(
      buildApiUrl(`/content/articles?per_page=${PER_PAGE}&page=1`),
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
  alternates: { canonical: 'https://ikeya.by/blog' },
  openGraph: {
    title: 'Советы и идеи | IKEYA',
    description: 'Советы по обустройству дома, идеи для интерьера и вдохновляющие проекты от IKEYA.',
    url: 'https://ikeya.by/blog',
    siteName: 'IKEYA',
    images: [{ url: 'https://ikeya.by/assets/img/no-image.jpg', width: 1200, height: 630, alt: 'Советы и идеи | IKEYA' }],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Советы и идеи | IKEYA',
    description: 'Советы по обустройству дома, идеи для интерьера и вдохновляющие проекты от IKEYA.',
    images: ['https://ikeya.by/assets/img/no-image.jpg'],
    url: 'https://ikeya.by/blog',
  },
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