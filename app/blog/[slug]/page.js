import Image from 'next/image';
import Link from 'next/link';
import BlockRenderer from '@/components/blog/BlockRenderer';
import ArticleMoreSlider from '@/components/blog/ArticleMoreSlider';
import { IMAGES_BASE_URL } from '@/lib/api/ikea';

import { buildApiUrl } from '@/lib/config/api';

const CONTENT_TYPE_LABELS = {
  tips_ideas: 'Советы и идеи',
  news: 'Новости',
};

async function getArticle(slug) {
  const res = await fetch(buildApiUrl(`/content/articles/${slug}`), {
    next: { revalidate: 60 }
  });
  if (!res.ok) return null;
  const data = await res.json();
  return data.data || null;
}

async function getMoreArticles(slug) {
  const res = await fetch(buildApiUrl('/content/articles?per_page=9'), {
    next: { revalidate: 60 }
  });
  if (!res.ok) return [];
  const data = await res.json();
  return (data.data || []).filter(a => a.attributes.slug !== slug);
}

function resolveImageUrl(url) {
  if (!url) return null;

  if (url.startsWith('http')) {
    return url.replace(/^https?:\/\/[^/]+/, IMAGES_BASE_URL);
  }

  return `${IMAGES_BASE_URL}${url.startsWith('/') ? url : `/${url}`}`;
}

function extractImage(article) {
  const attr = article?.attributes || {};
  const blockGroups = [
    attr.tile_blocks || [],
    attr.body_blocks || [],
  ];

  for (const blocks of blockGroups) {
    for (const block of blocks) {
      const images = block.images || [];

      const image =
        images.find((img) => img.slot === 'hero_image' && img.url) ||
        images.find((img) => img.url);

      const imageUrl = resolveImageUrl(image?.url);

      if (imageUrl) return imageUrl;
    }
  }

  return null;
}

export async function generateMetadata({ params }) {
  const article = await getArticle(params.slug);
  if (!article) return {};
  const seo = article.attributes.seo || {};
  return {
    title: seo.title || article.attributes.title,
    description: seo.description || article.attributes.excerpt,
    keywords: seo.keywords,
    robots: seo.robots,
  };
}

export default async function ArticlePage({ params }) {
  const [article, moreArticles] = await Promise.all([
    getArticle(params.slug),
    getMoreArticles(params.slug),
  ]);

  if (!article) return <div>Статья не найдена</div>;

  const attr = article.attributes;
  const categoryLabel = CONTENT_TYPE_LABELS[attr.content_type] || attr.content_type;
  const date = attr.published_at
    ? new Date(attr.published_at).toLocaleDateString('ru-RU')
    : null;

  const moreSlides = [];
  for (let i = 0; i < moreArticles.length; i += 3) {
    moreSlides.push(moreArticles.slice(i, i + 3).map(a => ({
      id: a.id,
      title: a.attributes.title,
      excerpt: a.attributes.excerpt,
      category: CONTENT_TYPE_LABELS[a.attributes.content_type] || a.attributes.content_type,
      image: extractImage(a),
      link: `/blog/${a.attributes.slug}`,
    })));
  }

  return (
    <main className="the-detail">
      <div className="the-detail__wrapper">
        <section className="breadcumps">
          <div className="container">
            <div className="row">
              <div className="col-12">
                <div className="breadcumps-inner">
                  <Link href="/">Главная</Link>
                  <span>/</span>
                  <Link href="/blog">{categoryLabel}</Link>
                  <span>/</span>
                  <span>{attr.title}</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        <div className="the-detail__content">
          <section className="detail-content__head">
            <h1>{attr.title}</h1>
            <div className="the-detail__cheaps">
              <span className="detail-cheaps__item">{categoryLabel}</span>
              {date && <span className="deatil-cheaps__date">{date}</span>}
            </div>
          </section>

          {attr.body_blocks.map((block, index) => (
            <BlockRenderer key={index} block={block} />
          ))}
        </div>

        {moreSlides.length > 0 && (
          <div className="the-detail-more">
            <div className="container">
              <div className="row">
                <div className="col-12">
                  <h4>Больше вдохновений</h4>
                  <ArticleMoreSlider slides={moreSlides} />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
