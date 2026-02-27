import Image from 'next/image';
import { IMAGES_BASE_URL } from '@/lib/api/ikea';

function resolveUrl(url) {
  if (!url) return null;
  return url.replace(/^https?:\/\/[^/]+/, IMAGES_BASE_URL);
}

export default function TextWithImageBlock({ block }) {
  const hero = (block.images || []).find(img => img.slot === 'hero_image');
  const imageUrl = resolveUrl(hero?.url);

  return (
    <section className="text-with-big-image">
      {block.content && <p>{block.content}</p>}
      {imageUrl && (
        <Image
          src={imageUrl}
          alt={block.content || ''}
          width={1136}
          height={600}
          style={{ objectFit: 'cover', width: '100%' }}
        />
      )}
    </section>
  );
}
