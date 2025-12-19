// components/Catalog/ProductCard.jsx
'use client';

import { useEffect, useRef } from 'react';

export default function ProductCard({ product }) {
    const galleryId = useRef(`gallery-${Math.random().toString(36).substr(2, 9)}`);

    useEffect(() => {
        // Инициализация Swiper будет в main.js
        if (typeof window !== 'undefined' && window.initProductGallery) {
            window.initProductGallery(galleryId.current);
        }
    }, []);

    const {
        images = [],
        thumbnails = [],
        title = 'SLATTUM',
        description = 'Описание товара',
        price = '135.00',
        currency = 'р.',
        badges = { hit: false, discount: '', new: false },
        href = '#'
    } = product;

    return (
        <div className="col product-card-inner">
            <div className="product-card">
                {/* Gallery */}
                <div className="product-cardgallery">
                    <div 
                        style={{ '--swiper-navigation-color': '#fff', '--swiper-pagination-color': '#fff' }}
                        className="swiper product-gallery-main"
                        data-gallery={galleryId.current}
                    >
                        <div className="swiper-wrapper">
                            {images.map((img, i) => (
                                <div key={i} className="swiper-slide">
                                    <img src={img} alt={title} />
                                </div>
                            ))}
                        </div>
                        <div className="swiper-button-next"></div>
                        <div className="swiper-button-prev"></div>
                    </div>

                    <div 
                        className="swiper product-gallery-thumbs"
                        data-gallery-thumbs={galleryId.current}
                        style={thumbnails.length === 0 ? { opacity: 0 } : {}}
                    >
                        <div className="swiper-wrapper">
                            {thumbnails.map((thumb, i) => (
                                <div key={i} className="swiper-slide">
                                    {thumb.isMore ? (
                                        <div className="product-gallery-thumbsmore">
                                            <span className="product-gallery-thumbscount">{thumb.count}</span>
                                        </div>
                                    ) : (
                                        <img src={thumb.src} alt="" />
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Info */}
                <div className="product-cardinfo">
                    <h3 className="product-cardtitle">{title}</h3>
                    <p className="product-carddescription">{description}</p>
                    <p className="product-cardprice">
                        {price}<span>.00 {currency}</span>
                    </p>
                    <button className="shopbutton">
                        <img src="/assets/img/icons/shopping-cart.svg" alt="" />
                        <p>В корзину</p>
                    </button>
                </div>

                {/* Badges */}
                <span 
                    className="sales-hit" 
                    style={{ display: badges.hit ? 'inline-block' : 'none' }}
                >
                    Хит продаж
                </span>
                <span 
                    className="sales-hit pink" 
                    style={{ display: badges.discount ? 'inline-block' : 'none' }}
                >
                    {badges.discount}
                </span>
                <span 
                    className="sales-hit green" 
                    style={{ display: badges.new ? 'inline-block' : 'none' }}
                >
                    Новинка
                </span>

                <button className="like">
                    <img src="/assets/img/icons/header-favorite.svg" alt="" />
                </button>
            </div>
        </div>
    );
}
