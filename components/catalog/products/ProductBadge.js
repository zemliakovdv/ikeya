// components/catalog/products/ProductBadge.js
export default function ProductBadge({ label, variant = 'default' }) {
  const className = variant === 'pink' ? 'sales-hit pink' : 'sales-hit';
  
  return (
    <span className={className} style={{ display: 'inline-block' }}>
      {label}
    </span>
  );
}
