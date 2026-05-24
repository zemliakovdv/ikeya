'use client';

// components/blog/BlogCard.js

import Link from 'next/link';
import Image from 'next/image';

import { buildAssetUrl } from '@/lib/config/api';

function extractImage(article) {
  const blocks = article.attributes.body_blocks || [];
  for (const block of blocks) {
    const images = block.images || [];
    const hero = images.find((img) => img.slot === 'hero_image') || images[0];
    if (hero?.url) {
      return buildAssetUrl(hero.url);
    }
  }
  return null;
}

export default function BlogCard({ article }) {
  const { title, slug, excerpt, rubric } = article.attributes;
  const image = extractImage(article);

  return (
    <Link href={`/blog/${slug}`} className="blog-card">
      <div className="blog-card__image-wrap">
        {image ? (
          <Image
            src={image}
            alt={title}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="blog-card__image"
          />
        ) : (
          <div className="blog-card__image-placeholder" />
        )}
      </div>

      {rubric && (
        <span className="blog-card__badge">{rubric}</span>
      )}

      <h3 className="blog-card__title">{title}</h3>

      {excerpt && (
        <p className="blog-card__excerpt">{excerpt}</p>
      )}
    </Link>
  );
}