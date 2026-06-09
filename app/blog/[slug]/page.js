import Image from 'next/image';
import Link from 'next/link';
import { cache, Suspense } from 'react';
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

const getCachedArticle = cache(async (slug) => getArticle(slug));

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
  const article = await getCachedArticle(params.slug);
  if (!article) return {};
  const seo = article.attributes.seo || {};
  const title = seo.title || article.attributes.title;
  const description = seo.description || article.attributes.excerpt;
  const canonicalUrl = `https://ikeya.by/blog/${params.slug}`;
  const imageUrl = extractImage(article) || 'https://ikeya.by/assets/img/no-image.jpg';

  return {
    title,
    description,
    keywords: seo.keywords,
    robots: seo.robots,
    alternates: { canonical: canonicalUrl },
    openGraph: {
      title,
      description,
      url: canonicalUrl,
      siteName: 'IKEYA',
      images: [{ url: imageUrl, width: 1200, height: 630, alt: title }],
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [imageUrl],
      url: canonicalUrl,
    },
  };
}

async function MoreArticlesSection({ slug }) {
  const moreArticles = await getMoreArticles(slug);

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

  if (moreSlides.length === 0) return null;

  return (
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
  );
}

export default async function ArticlePage({ params }) {
  const article = await getCachedArticle(params.slug);

  if (!article) return <div>Статья не найдена</div>;

  const attr = article.attributes;
  const categoryLabel = CONTENT_TYPE_LABELS[attr.content_type] || attr.content_type;
  const badgeLabel = attr.rubric || categoryLabel;
  const date = attr.published_at
    ? new Date(attr.published_at).toLocaleDateString('ru-RU')
    : null;

  return (
    <main className="the-detail">
      <div className="the-detail__wrapper">
        <div className="article-mobile-topbar">
          <Link href="/blog" className="article-mobile-topbar__back">
            <span className="article-mobile-topbar__icon" aria-hidden="true">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12.5 15L7.5 10L12.5 5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </span>
            <span className="article-mobile-topbar__title">{categoryLabel}</span>
          </Link>
        </div>

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
              <span className="detail-cheaps__item">{badgeLabel}</span>
              {date && <span className="deatil-cheaps__date">{date}</span>}
            </div>
          </section>

          {attr.body_blocks.map((block, index) => (
            <BlockRenderer key={index} block={block} />
          ))}
        </div>

        <Suspense fallback={null}>
          <MoreArticlesSection slug={params.slug} />
        </Suspense>
      </div>
    </main>
  );
}
