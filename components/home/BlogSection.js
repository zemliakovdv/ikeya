// components/home/BlogSection.js
import BlogSlider from '@/components/home/BlogSlider';
import { IMAGES_BASE_URL } from '@/lib/api/ikea';

const API_BASE_URL = 'http://45.135.234.22/api/v1';

const CONTENT_TYPE_LABELS = {
  tips_ideas: 'Советы и идеи',
  news: 'Новости',
};

async function getArticles() {
  try {
    const res = await fetch(
      `${API_BASE_URL}/content/articles?per_page=9`,
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

function extractImage(article) {
  const blocks = article.attributes.body_blocks || [];
  for (const block of blocks) {
    const images = block.images || [];
    const hero = images.find(img => img.slot === 'hero_image') || images[0];
    if (hero?.url) {
      // Заменяем localhost на боевой IMAGES_BASE_URL
      if (hero.url.startsWith('http')) return hero.url;
      return `${IMAGES_BASE_URL}${hero.url}`;
    }
  }
  return null;
}

export default async function BlogSection() {
  const articles = await getArticles();

  if (!articles.length) return null;

  const mapped = articles.map(a => ({
    id: a.id,
    title: a.attributes.title,
    excerpt: a.attributes.excerpt,
    category: CONTENT_TYPE_LABELS[a.attributes.content_type] || a.attributes.content_type,
    image: extractImage(a),
    link: `/blog/${a.attributes.slug}`,
  }));

  // По 3 статьи на слайд
  const slides = [];
  for (let i = 0; i < mapped.length; i += 3) {
    slides.push(mapped.slice(i, i + 3));
  }

  return <BlogSlider slides={slides} />;
}
