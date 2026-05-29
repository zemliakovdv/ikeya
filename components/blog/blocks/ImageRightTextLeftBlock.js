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

export default function ImageRightTextLeftBlock({ block }) {
  const side = (block.images || []).find((img) => img.slot === 'side_image');
  const imageUrl = resolveUrl(side?.url);
  const buttonCategory = block.button_category;

  return (
    <section className="left-text-right-image">
      <div className="text-container">
        {block.content && (
          <div dangerouslySetInnerHTML={{ __html: block.content }} />
        )}

        {block.button_enabled && buttonCategory && (
          <Link
            href={`/catalog/${buttonCategory.ikea_id}`}
            className="article-detail-button-transparent"
          >
            {block.button_text}
          </Link>
        )}
      </div>

      {imageUrl && (
        <Image
          src={imageUrl}
          alt=""
          width={552}
          height={735}
          unoptimized
          style={{ objectFit: 'cover' }}
        />
      )}
    </section>
  );
}