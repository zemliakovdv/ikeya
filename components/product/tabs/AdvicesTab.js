'use client';

import Link from 'next/link';

const IMAGES_BASE_URL = 'http://45.135.234.22';

export default function AdvicesTab({ tips = [] }) {
  if (!tips.length) return null;

  return (
    <div className="tab-pane fade show active">
      <div className="tab-advices__content">
        <h5>Полезные советы</h5>

        <div className="advices-content__grid">
          {tips.map((tip, index) => {
            const imageUrl = tip.image_url
              ? tip.image_url.startsWith('http')
                ? tip.image_url
                : `${IMAGES_BASE_URL}${tip.image_url}`
              : '/assets/img/catalog-card/place-hold.png';

            return (
              <Link
                key={tip.slug || index}
                href={`/blog/${tip.slug}`}
                className="advice-card"
              >
                <div className="advice-card__image">
                  <img src={imageUrl} alt={tip.title} />
                </div>
                <div className="advice-card__info">
                  <h6>{tip.title}</h6>
                  {tip.excerpt && (
                    <p className="advice-card__excerpt">{tip.excerpt}</p>
                  )}
                </div>
              </Link>
            );
          })}
        </div>

        <div className="advices-content__more" style={{ marginTop: '24px', textAlign: 'center' }}>
          <Link href="/blog" className="btn btn-primary">
            Смотреть все советы
          </Link>
        </div>
      </div>
    </div>
  );
}