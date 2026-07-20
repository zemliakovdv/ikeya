import Link from 'next/link';

export default function PromoBlock({
  bannerImage,
  bannerUrl,
  categoryName,
}) {
  if (!bannerImage) return null;

  return (
    <section className="promo-category-banner">
      <div className="container">
        <Link
          href={bannerUrl || '/catalog'}
          className="promo-category-banner__link"
          aria-label={categoryName || 'Перейти в категорию'}
        >
          <img
            src={bannerImage}
            alt={categoryName || 'Промо-баннер категории'}
            className="promo-category-banner__image"
            width="1500"
            height="256"
            loading="lazy"
            fetchPriority="low"
          />
        </Link>
      </div>
    </section>
  );
}
