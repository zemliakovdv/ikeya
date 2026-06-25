// components/catalog/products/ProductBadge.js
export default function ProductBadge({ label }) {
  const normalizedLabel = String(label || '').trim().toLowerCase();
  const variantClass = normalizedLabel === 'новинка'
    ? 'sales-hit--new'
    : normalizedLabel === 'хит продаж'
      ? 'sales-hit--bestseller'
      : '';
  const className = ['sales-hit', variantClass].filter(Boolean).join(' ');
  
  return (
    <span className={className} style={{ display: 'inline-block' }}>
      {label}
    </span>
  );
}
