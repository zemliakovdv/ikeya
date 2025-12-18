'use client';

import { useEffect } from 'react';

export default function ProductCard({ galleryId, images, thumbs, title, description, price, salesHit, promo, newBadge }) {
    useEffect(() => {
        // Инициализация Swiper для галереи
    }, []);

    return (
        <div className="col product-card-inner">
            <div className="product-card">
                <div className="product-card__gallery">
                    <div style={{ "--swiper-navigation-color": "#fff", "--swiper-pagination-color": "#fff" }}
                        className="swiper product-gallery-main"
                        data-gallery={galleryId}>
                        <div className="swiper-wrapper">
                            {images.map((img, index) => (
                                <div className="swiper-slide" key={index}>
                                    <img src={img} alt="Товар"/>
                                </div>
                            ))}
                        </div>
                        <div className="swiper-button-next"></div>
                        <div className="swiper-button-prev"></div>
                    </div>

                    <div thumbsSlider=""
                        className="swiper product-gallery-thumbs"
                        data-gallery-thumbs={galleryId}>
                        <div className="swiper-wrapper">
                            {thumbs.map((thumb, index) => (
                                <div className="swiper-slide" key={index}>
                                    {thumb.isMore ? (
                                        <div className="product-gallery-thumbs__more">
                                            <span className="product-gallery-thumbs__count">{thumb.count}</span>
                                        </div>
                                    ) : (
                                        <img src={thumb.src} alt="Миниатюра"/>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="product-card__info">
                    <h3 className="product-card__title">{title}</h3>
                    <p className="product-card__description">{description}</p>
                    <p className="product-card__price">{price}<span>.00 р.</span></p>
                    <button className="shop_button">
                        <img src="assets/img/icons/shopping-cart.svg" alt="В корзину"/>
                        <p>В корзину</p>
                    </button>
                </div>

                {salesHit && <span className="sales-hit">Хит продаж</span>}
                {promo && <span className="sales-hit pink">{promo}</span>}
                {newBadge && <span className="sales-hit green">{newBadge}</span>}
                <button className="like">
                    <img src="assets/img/icons/header-favorite.svg" alt="Добавить в избранное"/>
                </button>
            </div>
        </div>
    );
}
