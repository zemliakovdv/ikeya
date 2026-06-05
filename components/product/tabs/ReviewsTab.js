// components/product/tabs/ReviewsTab.js
'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { resolveImageUrl } from '@/lib/api/ikea';

import { buildApiUrl } from '@/lib/config/api';
const PER_PAGE = 20;

function toNumber(value, fallback = 0) {
  const parsed = Number.parseFloat(String(value ?? '').replace(',', '.'));
  return Number.isFinite(parsed) ? parsed : fallback;
}

function formatDate(value) {
  if (!value) return '';

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return '';

  return date.toLocaleDateString('ru-RU', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

function buildReviewsUrl({ sku, page, rating, withPhoto, sort = 'newest' }) {
  const params = new URLSearchParams();

  params.set('page', String(page));
  params.set('per_page', String(PER_PAGE));
  params.set('sort', sort);

  if (rating) {
    params.set('rating', String(rating));
  }

  if (withPhoto) {
    params.set('with_photo', '1');
  }

  return buildApiUrl(`/products/${sku}/reviews?${params.toString()}`);
}

function Stars({ rating = 0, size = 16 }) {
  const rounded = Math.round(toNumber(rating));

  return (
    <div className="review-stars" aria-label={`Оценка ${rounded} из 5`}>
      {[1, 2, 3, 4, 5].map((star) => (
        <svg
          key={star}
          width={size}
          height={size}
          viewBox="0 0 16 16"
          fill="none"
          aria-hidden="true"
        >
          <path
            d="M11.5134 14.6667C11.18 14.6667 10.76 14.56 10.2334 14.2467L8.38004 13.14C8.19337 13.0267 7.82004 13.0267 7.6267 13.14L5.77337 14.2467C4.68004 14.9 4.03337 14.6467 3.7467 14.4333C3.45337 14.22 3.01337 13.68 3.30004 12.4267L3.74004 10.5067C3.7867 10.3 3.6867 9.95999 3.54004 9.80666L2.00004 8.25333C1.43337 7.67999 1.22004 7.05333 1.40004 6.49333C1.5067 6.16666 1.84004 5.59999 2.9067 5.41999L4.8867 5.08666C5.0667 5.05333 5.34004 4.85333 5.42004 4.68666L6.51337 2.47999C7.01337 1.47333 7.6667 1.32666 8.0067 1.32666C8.3467 1.32666 9.00004 1.47999 9.49337 2.47999L10.5867 4.67999C10.6734 4.85333 10.94 5.05333 11.1267 5.08666L13.1067 5.41999C13.9 5.55333 14.4334 5.93333 14.6134 6.49999C14.72 6.82666 14.78 7.48666 14.0067 8.25999L12.4734 9.80666C12.3267 9.95999 12.2267 10.3 12.2734 10.5133L12.7134 12.4267C13 13.68 12.56 14.22 12.2667 14.4333C12.12 14.54 11.8734 14.66 11.52 14.66L11.5134 14.6667Z"
            fill={star <= rounded ? '#FFB300' : '#D9D9D9'}
          />
        </svg>
      ))}
    </div>
  );
}

function EmptyReviews() {
  return (
    <>
      <div className="feedbacks-content__info">
        <div className="content-info__inner">
          <img src="/assets/img/cart/no_feed.png" alt="Отзывов пока нет" />
          <p>Отзывов пока нет</p>
        </div>
      </div>

      <div className="feedbacks-content__alert">
        <p>
          Рейтинга пока нет. Он формируется на основе актуальных отзывов на
          заказанные и оплаченные товары
        </p>
        <p>
          Отзывы могут оставлять только те, кто купил товар. Так мы формируем
          честный рейтинг
        </p>
      </div>
    </>
  );
}

function ReviewsSummary({ aggregates, distribution }) {
  const ratingAvg = toNumber(aggregates?.rating_avg);
  const ratingCount = Number(aggregates?.rating_count || 0);

  const maxDistribution = Math.max(
    1,
    ...[5, 4, 3, 2, 1].map((rating) => Number(distribution?.[String(rating)] || 0))
  );

  return (
    <aside className="feedbacks-rating">
      <div className="feedbacks-rating__top">
        <Stars rating={ratingAvg} size={24} />
        <p className="feedbacks-rating__value">
          {ratingAvg.toFixed(1)} / 5
        </p>
      </div>

      <p className="feedbacks-rating__description">
        Рейтинг формируется на основе актуальных отзывов
      </p>

      <div className="feedbacks-rating__distribution">
        {[5, 4, 3, 2, 1].map((rating) => {
          const count = Number(distribution?.[String(rating)] || 0);
          const width = `${Math.round((count / maxDistribution) * 100)}%`;

          return (
            <div className="feedbacks-rating__row" key={rating}>
              <p>{rating} {rating === 1 ? 'звезда' : 'звезды'}</p>
              <div className="feedbacks-rating__bar">
                <span style={{ width }} />
              </div>
              <p>{count}</p>
            </div>
          );
        })}
      </div>

      <p className="feedbacks-rating__notice">
        Отзывы могут оставлять только те, кто купил товар. Так мы формируем честный рейтинг
      </p>

      {ratingCount === 0 && (
        <p className="feedbacks-rating__empty">Отзывов пока нет</p>
      )}
    </aside>
  );
}

function AvatarPlaceholder() {
  return (
    <div className="feedbacks-review__avatar-placeholder" aria-hidden="true">
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
        <path
          d="M12 12C14.2091 12 16 10.2091 16 8C16 5.79086 14.2091 4 12 4C9.79086 4 8 5.79086 8 8C8 10.2091 9.79086 12 12 12Z"
          stroke="#BDBDBD"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M18.8598 20C18.8598 16.91 15.7898 14.4 11.9998 14.4C8.2098 14.4 5.13977 16.91 5.13977 20"
          stroke="#BDBDBD"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  );
}

function ReviewItem({ review }) {
  const photos = Array.isArray(review.photos)
    ? review.photos.map((photo) => resolveImageUrl(photo)).filter(Boolean)
    : [];

  return (
    <article className="feedbacks-review">
      <div className="feedbacks-review__avatar">
        <AvatarPlaceholder />
      </div>

      <div className="feedbacks-review__body">
        <div className="feedbacks-review__header">
          <div>
            <h6>{review.author_name || 'Покупатель'}</h6>
            {review.variant_label && (
              <p className="feedbacks-review__variant">{review.variant_label}</p>
            )}
          </div>

          <div className="feedbacks-review__meta">
            <Stars rating={review.rating} />
            <p>{formatDate(review.published_at || review.created_at)}</p>
          </div>
        </div>

        {review.body && (
          <p className="feedbacks-review__text">{review.body}</p>
        )}

        {photos.length > 0 && (
          <div className="feedbacks-review__photos">
            {photos.map((photo, index) => (
              <img
                key={`${photo}-${index}`}
                src={photo}
                alt={`Фото к отзыву ${index + 1}`}
                onError={(event) => {
                  event.currentTarget.style.display = 'none';
                }}
              />
            ))}
          </div>
        )}
      </div>
    </article>
  );
}

export default function ReviewsTab({ product }) {
  const attr = product?.attributes || {};
  const sku = attr.sku || product?.id;

  const [reviews, setReviews] = useState([]);
  const [aggregates, setAggregates] = useState({
    rating_avg: attr.rating_avg || 0,
    rating_weighted: attr.rating_weighted || 0,
    rating_count: attr.rating_count || 0,
  });
  const [distribution, setDistribution] = useState({});
  const [photos, setPhotos] = useState([]);
  const [meta, setMeta] = useState({
    page: 1,
    per_page: PER_PAGE,
    total: 0,
    total_pages: 1,
  });

  const [ratingFilter, setRatingFilter] = useState(null);
  const [withPhoto, setWithPhoto] = useState(false);
  const [sort, setSort] = useState('newest');
  const [loading, setLoading] = useState(Boolean(sku));
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const dropdownRef = useRef(null);

  const hasMore = Number(meta.page || 1) < Number(meta.total_pages || 1);
  const hasReviews = reviews.length > 0;

  const visibleRatingFilters = useMemo(() => {
    const items = [{ label: 'Все', value: null }];

    [5, 4, 3, 2, 1].forEach((rating) => {
      const count = Number(distribution?.[String(rating)] || 0);
      if (count > 0) {
        items.push({ label: String(rating), value: rating });
      }
    });

    return items;
  }, [distribution]);

  const loadReviews = useCallback(async ({ page = 1, append = false } = {}) => {
    if (!sku) return;

    if (append) {
      setLoadingMore(true);
    } else {
      setLoading(true);
    }

    setError(false);

    try {
      const response = await fetch(
        buildReviewsUrl({
          sku,
          page,
          rating: ratingFilter,
          withPhoto,
          sort,
        }),
        { cache: 'no-store' }
      );

      if (!response.ok) {
        throw new Error(`Reviews API error: ${response.status}`);
      }

      const payload = await response.json();

      const nextReviews = Array.isArray(payload.data) ? payload.data : [];
      const nextPhotos = Array.isArray(payload.photos) ? payload.photos : [];

      setReviews((prev) => (append ? [...prev, ...nextReviews] : nextReviews));
      setAggregates(payload.aggregates || {});
      setDistribution(payload.rating_distribution || {});
      setPhotos(nextPhotos);
      setMeta(payload.meta || {
        page,
        per_page: PER_PAGE,
        total: nextReviews.length,
        total_pages: 1,
      });
    } catch {
      if (!append) {
        setReviews([]);
      }

      setError(true);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  }, [sku, ratingFilter, withPhoto, sort]);

  useEffect(() => {
    loadReviews({ page: 1, append: false });
  }, [loadReviews]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!dropdownRef.current) return;
      if (!dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const photoUrls = useMemo(
    () => photos.map((photo) => resolveImageUrl(photo)).filter(Boolean),
    [photos]
  );

  const handleRatingFilter = (rating) => {
    setRatingFilter(rating);
  };

  const handleToggleWithPhoto = () => {
    setWithPhoto((value) => !value);
    setIsDropdownOpen(false);
  };

  const handleSelectSort = (nextSort) => {
    setSort(nextSort);
    setIsDropdownOpen(false);
  };

  const handleLoadMore = () => {
    if (loadingMore || !hasMore) return;
    loadReviews({ page: Number(meta.page || 1) + 1, append: true });
  };

  const sortLabel = sort === 'oldest' ? 'Сначала старые' : 'Сначала новые';

  return (
    <div className="tab-pane fade show active">
      <div className="tab-feedbacks__content">
        {loading ? (
          <p className="text-muted">Загружаем отзывы...</p>
        ) : error ? (
          <div className="feedbacks-content__alert">
            <p>Не удалось загрузить отзывы. Попробуйте обновить страницу.</p>
          </div>
        ) : hasReviews ? (
          <div className="feedbacks-layout">
            <div className="feedbacks-main">
              {photoUrls.length > 0 && (
                <div className="feedbacks-photos">
                  {photoUrls.map((photo, index) => (
                    <button
                      key={`${photo}-${index}`}
                      type="button"
                      className="feedbacks-photos__item"
                      aria-label={`Фото из отзывов ${index + 1}`}
                    >
                      <img
                        src={photo}
                        alt={`Фото из отзывов ${index + 1}`}
                        onError={(event) => {
                          event.currentTarget.style.display = 'none';
                        }}
                      />
                    </button>
                  ))}
                </div>
              )}

              <div className="feedbacks-toolbar">
                <div className="feedbacks-rating-filter">
                  {visibleRatingFilters.map((item) => (
                    <button
                      key={item.label}
                      type="button"
                      className={`feedbacks-rating-filter__item ${ratingFilter === item.value ? 'active' : ''}`}
                      onClick={() => handleRatingFilter(item.value)}
                    >
                      {item.value === null ? (
                        item.label
                      ) : (
                        <>
                          <span>{item.label}</span>
                          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                            <path
                              d="M11.5134 14.6667C11.18 14.6667 10.76 14.56 10.2334 14.2467L8.38004 13.14C8.19337 13.0267 7.82004 13.0267 7.6267 13.14L5.77337 14.2467C4.68004 14.9 4.03337 14.6467 3.7467 14.4333C3.45337 14.22 3.01337 13.68 3.30004 12.4267L3.74004 10.5067C3.7867 10.3 3.6867 9.95999 3.54004 9.80666L2.00004 8.25333C1.43337 7.67999 1.22004 7.05333 1.40004 6.49333C1.5067 6.16666 1.84004 5.59999 2.9067 5.41999L4.8867 5.08666C5.0667 5.05333 5.34004 4.85333 5.42004 4.68666L6.51337 2.47999C7.01337 1.47333 7.6667 1.32666 8.0067 1.32666C8.3467 1.32666 9.00004 1.47999 9.49337 2.47999L10.5867 4.67999C10.6734 4.85333 10.94 5.05333 11.1267 5.08666L13.1067 5.41999C13.9 5.55333 14.4334 5.93333 14.6134 6.49999C14.72 6.82666 14.78 7.48666 14.0067 8.25999L12.4734 9.80666C12.3267 9.95999 12.2267 10.3 12.2734 10.5133L12.7134 12.4267C13 13.68 12.56 14.22 12.2667 14.4333C12.12 14.54 11.8734 14.66 11.52 14.66L11.5134 14.6667Z"
                              fill="#FFB300"
                            />
                          </svg>
                        </>
                      )}
                    </button>
                  ))}
                </div>

                <div className="feedbacks-sort-dropdown" ref={dropdownRef}>
                  <button
                    type="button"
                    className="feedbacks-sort__button"
                    onClick={() => setIsDropdownOpen((value) => !value)}
                    aria-expanded={isDropdownOpen}
                  >
                    {sortLabel}
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                      <path
                        d="M4 6L8 10L12 6"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </button>

                  {isDropdownOpen && (
                    <div className="feedbacks-sort-dropdown__menu">
                      <button
                        type="button"
                        className={`feedbacks-sort-dropdown__item ${withPhoto ? 'active' : ''}`}
                        onClick={handleToggleWithPhoto}
                      >
                        Только с фото
                      </button>

                      <button
                        type="button"
                        className={`feedbacks-sort-dropdown__item ${sort === 'newest' ? 'active' : ''}`}
                        onClick={() => handleSelectSort('newest')}
                      >
                        Сначала новые
                      </button>

                      <button
                        type="button"
                        className={`feedbacks-sort-dropdown__item ${sort === 'oldest' ? 'active' : ''}`}
                        onClick={() => handleSelectSort('oldest')}
                      >
                        Сначала старые
                      </button>
                    </div>
                  )}
                </div>
              </div>

              <div className="feedbacks-list">
                {reviews.map((review) => (
                  <ReviewItem key={review.id} review={review} />
                ))}
              </div>

              {hasMore && (
                <button
                  type="button"
                  className="feedbacks-load-more"
                  onClick={handleLoadMore}
                  disabled={loadingMore}
                >
                  {loadingMore ? 'Загружаем...' : 'Показать еще'}
                </button>
              )}
            </div>

            <ReviewsSummary
              aggregates={aggregates}
              distribution={distribution}
            />
          </div>
        ) : (
          <EmptyReviews />
        )}
      </div>
    </div>
  );
}
