// components/home/BlogSection.js

import BlogSlider from '@/components/home/BlogSlider';
import { IMAGES_BASE_URL } from '@/lib/api/ikea';

import { buildApiUrl } from '@/lib/config/api';

const CONTENT_TYPE_LABELS = {
  tips_ideas: 'Советы и идеи',
  news: 'Новости',
};

async function getArticles() {
  try {
    const res = await fetch(
      buildApiUrl('/content/articles?per_page=9'),
      { next: { revalidate: 60 } }
    );

    if (!res.ok) return [];

    const data = await res.json();
    return data.data || [];
  } catch (e) {
    console.error('Ошибка загрузки статей:', e);
    return [];
  }
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

export default async function BlogSection() {
  const articles = await getArticles();

  if (!articles.length) return null;

  const mapped = articles.map((article) => {
    const attr = article.attributes || {};

    return {
      id: article.id,
      title: attr.title,
      excerpt: attr.excerpt,
      category: CONTENT_TYPE_LABELS[attr.content_type] || attr.content_type,
      image: extractImage(article),
      link: `/blog/${attr.slug}`,
    };
  });

  const slides = [];
  for (let i = 0; i < mapped.length; i += 3) {
    slides.push(mapped.slice(i, i + 3));
  }

  return <BlogSlider slides={slides} />;
}