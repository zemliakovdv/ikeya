import Link from 'next/link';
import { buildAssetUrl } from '@/lib/config/api';

const PLACEHOLDER_IMAGE = '/assets/img/no-image.jpg';

function isPlainObject(value) {
  return !!value && typeof value === 'object' && !Array.isArray(value);
}

function getAttributes(product) {
  if (isPlainObject(product?.attributes)) return product.attributes;
  return isPlainObject(product) ? product : {};
}

function getSku(product, attr) {
  const candidate = attr.sku ?? product?.sku ?? product?.id ?? attr.id;

  if (Array.isArray(candidate)) {
    return candidate.find((value) => value !== null && value !== undefined && String(value).trim() !== '') || '';
  }

  return candidate !== null && candidate !== undefined ? String(candidate).trim() : '';
}

function getSlug(product, attr) {
  const value = attr.slug ?? product?.slug ?? '';
  return typeof value === 'string' ? value.trim() : '';
}

function getTitle(product, attr) {
  return (
    attr.name_ru ||
    attr.name ||
    attr.title ||
    product?.name_ru ||
    product?.name ||
    product?.title ||
    'Товар IKEYA'
  );
}

function parsePrice(value) {
  const normalized = String(value ?? '').replace(/\s/g, '').replace(',', '.');
  const parsed = Number.parseFloat(normalized);
  return Number.isFinite(parsed) ? parsed : null;
}

function formatPrice(value) {
  const parsed = parsePrice(value);
  if (parsed === null) return null;

  const floor = Math.floor(parsed).toLocaleString('ru-RU');
  const decimal = Math.round((parsed % 1) * 100).toString().padStart(2, '0');

  return { floor, decimal };
}

function extractImageCandidate(product, attr) {
  if (typeof attr.image_url === 'string' && attr.image_url.trim()) return attr.image_url.trim();
  if (typeof attr.image === 'string' && attr.image.trim()) return attr.image.trim();
  if (Array.isArray(attr.local_images) && attr.local_images[0]) return attr.local_images[0];
  if (Array.isArray(attr.images?.local_images) && attr.images.local_images[0]) return attr.images.local_images[0];
  if (Array.isArray(attr.images) && attr.images[0]) return attr.images[0];

  if (typeof product?.image_url === 'string' && product.image_url.trim()) return product.image_url.trim();
  if (typeof product?.image === 'string' && product.image.trim()) return product.image.trim();
  if (Array.isArray(product?.local_images) && product.local_images[0]) return product.local_images[0];
  if (Array.isArray(product?.images?.local_images) && product.images.local_images[0]) return product.images.local_images[0];
  if (Array.isArray(product?.images) && product.images[0]) return product.images[0];

  return '';
}

function resolveImageUrl(product, attr) {
  const image = extractImageCandidate(product, attr);

  if (!image) return PLACEHOLDER_IMAGE;
  if (/^https?:\/\//i.test(image)) return image;
  if (image.startsWith('/')) return buildAssetUrl(image) || PLACEHOLDER_IMAGE;

  return buildAssetUrl(image) || PLACEHOLDER_IMAGE;
}

function getProductUrl(slug, sku) {
  if (slug && sku) return `/product/${slug}-${sku}`;
  if (sku) return `/product/${sku}`;
  return '#';
}

function normalizeBadges(product, attr) {
  const source = attr.badges ?? product?.badges;

  if (!Array.isArray(source)) return [];

  return source
    .map((badge) => {
      if (typeof badge === 'string') return badge.trim();
      if (typeof badge?.label === 'string') return badge.label.trim();
      if (typeof badge?.name === 'string') return badge.name.trim();
      return '';
    })
    .filter(Boolean)
    .slice(0, 2);
}

export default function SeoProductCard({ product }) {
  const attr = getAttributes(product);
  const sku = getSku(product, attr);
  const slug = getSlug(product, attr);
  const title = getTitle(product, attr);
  const imageUrl = resolveImageUrl(product, attr);
  const productUrl = getProductUrl(slug, sku);
  const price = formatPrice(attr.price_byn ?? attr.price ?? product?.price_byn ?? product?.price);
  const badges = normalizeBadges(product, attr);
  const isAvailable = attr.available ?? attr.availability ?? product?.available ?? product?.availability;
  return (
    <div className="col product-card-inner">
      <article className="product-card">
        <Link href={productUrl} className="product-card__img-wrap">
          <img
            src={imageUrl}
            alt={title}
            className="product-card__img product-card__img--main"
            width="262"
            height="262"
            loading="lazy"
          />
        </Link>

        <div className="product-card__info">
          <div className="product-card__header">
            <h3 className="product-card__title">
              <Link href={productUrl}>{title}</Link>
            </h3>
          </div>

          {price ? (
            <p className="product-card__price">
              {price.floor}
              <span>.{price.decimal} р.</span>
            </p>
          ) : null}

          {isAvailable === false ? (
            <p className="product-card__description">Нет в наличии</p>
          ) : null}

          {badges.length > 0 ? (
            <div className="product-card__variants">
              {badges.map((badge) => (
                <span key={badge} className="product-card__variant-btn active">
                  {badge}
                </span>
              ))}
            </div>
          ) : null}
        </div>
      </article>
    </div>
  );
}
