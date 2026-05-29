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

export default function TextImagesRowBlock({ block }) {
  const leftImg = resolveUrl(
    (block.images || []).find((img) => img.slot === 'left_image')?.url
  );

  const rightImg = resolveUrl(
    (block.images || []).find((img) => img.slot === 'right_image')?.url
  );

  const buttonCategory = block.button_category;

  return (
    <section className="text-button-two-image">
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

      {(leftImg || rightImg) && (
        <div className="two-image-inner">
          {leftImg && (
            <Image
              src={leftImg}
              alt=""
              width={552}
              height={735}
              unoptimized
              style={{ objectFit: 'cover' }}
            />
          )}

          {rightImg && (
            <Image
              src={rightImg}
              alt=""
              width={552}
              height={735}
              unoptimized
              style={{ objectFit: 'cover' }}
            />
          )}
        </div>
      )}
    </section>
  );
}