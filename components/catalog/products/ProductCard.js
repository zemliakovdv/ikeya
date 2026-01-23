'use client';

import ProductGallery from './ProductGallery';

export default function ProductCard({ product, index = 0 }) {
  const handleFavoriteClick = (e) => {
    e.preventDefault();
    console.log('Add to favorites:', product.id);
  };

  const handleAddToCart = (e) => {
    e.preventDefault();
    console.log('Add to cart:', product.id);
  };

  return (
    <div className="col product-card-inner">
      <div className="product-card">
        <ProductGallery 
          images={product.images} 
          galleryId={`gallery-${index}`}
        />

        <div className="product-card__info">
          <h3 className="product-card__title">{product.title}</h3>
          <p className="product-card__description">{product.description}</p>
          <p className="product-card__price">
            {product.price}<span>.{product.priceDecimal || '00'} р.</span>
          </p>
          <button className="shop_button" onClick={handleAddToCart}>
            <img src="/assets/img/icons/shopping-cart.svg" alt="В корзину" />
            <p>В корзину</p>
          </button>
        </div>

        {product.hitBadge && (
          <span 
            className="sales-hit" 
            style={{ display: product.showHitBadge ? 'inline-block' : 'none' }}
          >
            {product.hitBadge}
          </span>
        )}

        {product.promoBadge && (
          <span 
            className="sales-hit pink" 
            style={{ display: product.showPromoBadge ? 'inline-block' : 'none' }}
          >
            {product.promoBadge}
          </span>
        )}

        {product.newBadge && (
          <span 
            className="sales-hit green" 
            style={{ display: product.showNewBadge ? 'inline-block' : 'none' }}
          >
            {product.newBadge}
          </span>
        )}

        <button className="like" onClick={handleFavoriteClick}>
          <img src="/assets/img/icons/header-favorite.svg" alt="Добавить в избранное" />
        </button>
      </div>
    </div>
  );
}
