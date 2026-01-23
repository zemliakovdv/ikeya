export default function ProductBadge({ type, text }) {
  const badgeClasses = {
    hit: 'catalog-card-badge hit',
    promo: 'catalog-card-badge promo',
    new: 'catalog-card-badge new'
  };

  return (
    <div className={badgeClasses[type] || 'catalog-card-badge'}>
      <p>{text}</p>
    </div>
  );
}
