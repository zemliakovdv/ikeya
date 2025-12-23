'use client';

export default function ProductCard({ 
  id, 
  title, 
  description, 
  price, 
  images = [],
  thumbImages = [],
  badges = {} // { hit: 'Хит продаж', discount: '-10% промокод IKEYA', new: 'Новинка' }
}) {
  const galleryId = `beds-${id}`;
  
  return (
    <div className="col product-card-inner">
      <div className="product-card">
        {/* Слайдер изображений товара */}
        <div className="product-card__gallery">
          {/* Основной слайдер */}
          <div 
            style={{'--swiper-navigation-color': '#fff', '--swiper-pagination-color': '#fff'}}
            className="swiper product-gallery-main" 
            data-gallery={galleryId}
          >
            <div className="swiper-wrapper">
              {images.map((img, index) => (
                <div key={index} className="swiper-slide">
                  <img src={img} alt="Товар" />
                </div>
              ))}
            </div>
            <div className="swiper-button-next"></div>
            <div className="swiper-button-prev"></div>
          </div>

          {/* Слайдер миниатюр */}
          <div 
            thumbsSlider="" 
            className="swiper product-gallery-thumbs" 
            data-gallery-thumbs={galleryId}
            style={{opacity: 0}}
          >
            <div className="swiper-wrapper">
              {thumbImages.slice(0, 3).map((img, index) => (
                <div key={index} className="swiper-slide">
                  <img src={img} alt="Миниатюра" />
                </div>
              ))}
              {thumbImages.length > 3 && (
                <div className="swiper-slide product-gallery-thumbs__more">
                  <span className="product-gallery-thumbs__count">+{thumbImages.length - 3}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Информация о товаре */}
        <div className="product-card__info">
          <h3 className="product-card__title">{title}</h3>
          <p className="product-card__description">{description}</p>
          <p className="product-card__price">{price}<span>.00 р.</span></p>
          <button className="shop_button">
            <img src="/assets/img/icons/shopping-cart.svg" alt="В корзину" />
            <p>В корзину</p>
          </button>
        </div>

        {badges.hit && <span className="sales-hit">{badges.hit}</span>}
        {badges.discount && (
          <span className="sales-hit pink" style={{display: 'inline-block'}}>
            {badges.discount}
          </span>
        )}
        {badges.new && (
          <span className="sales-hit green" style={{display: 'inline-block'}}>
            {badges.new}
          </span>
        )}
        
        <button className="like">
          <svg width="20" height="18" viewBox="0 0 20 18" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M10 17.22C9.34 17.22 8.67 17.01 8.1 16.58C5.66 14.76 0 10.04 0 5.53C0 2.43 2.35 0 5.35 0C7.01 0 8.43 0.62 10 2.06C11.57 0.62 12.99 0 14.65 0C17.65 0 20 2.43 20 5.53C20 10.03 14.33 14.75 11.9 16.58C11.33 17 10.67 17.22 10 17.22ZM5.35 1.4C3.1 1.4 1.4 3.18 1.4 5.53C1.4 9.51 7.17 14.13 8.94 15.46C9.57 15.93 10.43 15.93 11.06 15.46C12.83 14.14 18.6 9.51 18.6 5.53C18.6 3.17 16.9 1.4 14.65 1.4C13.59 1.4 12.36 1.66 10.49 3.52C10.22 3.79 9.78 3.79 9.5 3.52C7.64 1.66 6.4 1.4 5.34 1.4H5.35Z" fill="#181818"/>
          </svg>
        </button>
      </div>
    </div>
  );
}
