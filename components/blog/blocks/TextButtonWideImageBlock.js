import Image from 'next/image';
import Link from 'next/link';
import { IMAGES_BASE_URL } from '@/lib/api/ikea';

function resolveUrl(url) {
  if (!url) return null;

  if (url.startsWith('http')) {
    return url.replace(/^https?:\/\/[^/]+/, IMAGES_BASE_URL);
  }

  return `${IMAGES_BASE_URL}${url.startsWith('/') ? url : `/${url}`}`;
}

export default function TextButtonWideImageBlock({ block }) {
  const hero = (block.images || []).find((img) => img.slot === 'hero_image');
  const imageUrl = resolveUrl(hero?.url);
  const buttonCategory = block.button_category;

  return (
    <section className="text-button-wide-image">
      {block.content && (
        <div dangerouslySetInnerHTML={{ __html: block.content }} />
      )}

      {block.button_enabled && buttonCategory && (
        <Link
          href={`/categories/${buttonCategory.ikea_id}`}
          className="article-detail-button-transparent"
        >
          {block.button_text}
        </Link>
      )}

      {imageUrl && (
        <Image
          src={imageUrl}
          alt=""
          width={1136}
          height={600}
          unoptimized
          style={{ objectFit: 'cover', width: '100%' }}
        />
      )}
    </section>
  );
}