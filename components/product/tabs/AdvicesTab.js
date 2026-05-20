'use client';

import Link from 'next/link';
import { resolveImageUrl } from '@/lib/api/ikea';

const PLACEHOLDER_IMAGE = '/assets/img/catalog-card/place-hold.png';

export default function AdvicesTab({ tips = [] }) {
  const validTips = Array.isArray(tips)
    ? tips.filter((tip) => tip?.slug)
    : [];

  if (!validTips.length) return null;

  return (
    <div className="tab-pane fade show active">
      <div className="tab-advices__content">
        <h5>Полезные советы</h5>

        <div className="advices-content__grid">
          {validTips.map((tip, index) => {
            const imageUrl = resolveImageUrl(tip.image_url) || PLACEHOLDER_IMAGE;

            return (
              <Link
                key={tip.slug || index}
                href={`/blog/${tip.slug}`}
                className="advice-card"
              >
                <div className="advice-card__image">
                  <img
                    src={imageUrl}
                    alt={tip.title || 'Совет'}
                    onError={(event) => {
                      event.currentTarget.src = PLACEHOLDER_IMAGE;
                    }}
                  />
                </div>

                <div className="advice-card__info">
                  <h6>{tip.title || 'Совет'}</h6>

                  {tip.excerpt && (
                    <p className="advice-card__excerpt">{tip.excerpt}</p>
                  )}

                  <span className="advice-card__link">
                    Читать статью
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                      <path
                        d="M6 3.33334L10.6667 8.00001L6 12.6667"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </span>
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