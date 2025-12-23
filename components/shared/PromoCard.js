export default function PromoCard({ image, title, description, price, hitBadge = true, discountBadge = true }) {
  return (
    <div className="promo-card-item">
      <div className="product-card">
        {/* ✅ ОДНО изображение вместо слайдера */}
        <div className="promo-card__gallery">
          <img src={`/assets/img/main-page/promo-block/${image}`} alt="Товар" />
        </div>

        <div className="promo-card__info">
          <h3 className="product-card__title">{title}</h3>
          <p className="product-card__description">{description}</p>
          <p className="product-card__price">{price}<span>.00 р.</span></p>
          <button className="shop_button">
            <img src="/assets/img/icons/shopping-cart.svg" alt="В корзину" />
            <p>В корзину</p>
          </button>
        </div>

        {hitBadge && <span className="sales-hit">Хит продаж</span>}
        {discountBadge && <span className="sales-hit pink">-10% промокод IKEYA</span>}
        <button className="like">
          <img src="/assets/img/icons/header-favorite.svg" alt="Добавить в избранное" />
        </button>
      </div>
    </div>
  );
}
