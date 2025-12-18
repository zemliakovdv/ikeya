'use client';

import { useEffect } from 'react';
import ProductCard from './ProductCard';

export default function ProductsTabs() {
    useEffect(() => {
        // Инициализация Swiper для слайдеров товаров
    }, []);

    return (
        <section className="products-tabs">
            <div className="container">
                <div className="row">
                    <div className="col-12">
                        <h2>Хиты продаж</h2>
                        <ul className="nav products-tabs__nav" id="productsTabs" role="tablist">
                            <li className="nav-item" role="presentation">
                                <button className="nav-link products-tabs__link active" id="beds-tab" data-bs-toggle="tab"
                                    data-bs-target="#beds" type="button" role="tab">
                                    Кровати и матрасы
                                </button>
                            </li>
                            <li className="nav-item" role="presentation">
                                <button className="nav-link products-tabs__link" id="sofas-tab" data-bs-toggle="tab"
                                    data-bs-target="#sofas" type="button" role="tab">
                                    Диваны и кресла
                                </button>
                            </li>
                            <li className="nav-item" role="presentation">
                                <button className="nav-link products-tabs__link" id="lighting-tab" data-bs-toggle="tab"
                                    data-bs-target="#lighting" type="button" role="tab">
                                    Освещение
                                </button>
                            </li>
                            <li className="nav-item" role="presentation">
                                <button className="nav-link products-tabs__link" id="wardrobes-tab" data-bs-toggle="tab"
                                    data-bs-target="#wardrobes" type="button" role="tab">
                                    Шкафы
                                </button>
                            </li>
                            <li className="nav-item" role="presentation">
                                <button className="nav-link products-tabs__link" id="dressers-tab" data-bs-toggle="tab"
                                    data-bs-target="#dressers" type="button" role="tab">
                                    Комоды и тумбочки
                                </button>
                            </li>
                            <li className="nav-item" role="presentation">
                                <button className="nav-link products-tabs__link" id="storage-tab" data-bs-toggle="tab"
                                    data-bs-target="#storage" type="button" role="tab">
                                    Системы хранения
                                </button>
                            </li>
                            <li className="nav-item" role="presentation">
                                <button className="nav-link products-tabs__link" id="garden-tab" data-bs-toggle="tab"
                                    data-bs-target="#garden" type="button" role="tab">
                                    Сад и балкон
                                </button>
                            </li>
                        </ul>

                        <div className="tab-content products-tabs__content" id="productsTabsContent">
                            <div className="tab-pane fade show active" id="beds" role="tabpanel">
                                <div className="products-card-slider">
                                    <div className="products-slider swiper" data-slider="beds">
                                        <div className="swiper-wrapper">
                                            <div className="swiper-slide">
                                                <div className="row g-4 swiper-slide-inner">
                                                    <ProductCard
                                                        galleryId="beds-1"
                                                        images={[
                                                            "assets/img/main-page/sales-hist/hits-1.png",
                                                            "assets/img/main-page/sales-hist/hits-2.png",
                                                            "assets/img/main-page/sales-hist/hits-3.png",
                                                            "assets/img/main-page/sales-hist/hits-4.png",
                                                            "assets/img/main-page/sales-hist/hits-5.png"
                                                        ]}
                                                        thumbs={[
                                                            { src: "assets/img/main-page/sales-hist/hits-1.png" },
                                                            { src: "assets/img/main-page/sales-hist/hits-1.png" },
                                                            { src: "assets/img/main-page/sales-hist/hits-3.png" },
                                                            { isMore: true, count: "+2" }
                                                        ]}
                                                        title="SLATTUM"
                                                        description="Каркас кровати с обивкой, Vissle темно-серый, 140x200 см"
                                                        price="135"
                                                        salesHit={true}
                                                        promo="-10% промокод IKEYA"
                                                    />
                                                    <ProductCard
                                                        galleryId="beds-2"
                                                        images={[
                                                            "assets/img/main-page/sales-hist/hits-1.png",
                                                            "assets/img/main-page/sales-hist/hits-3.png",
                                                            "assets/img/main-page/sales-hist/hits-4.png"
                                                        ]}
                                                        thumbs={[
                                                            { src: "assets/img/main-page/sales-hist/hits-1.png" },
                                                            { src: "assets/img/main-page/sales-hist/hits-3.png" },
                                                            { src: "assets/img/main-page/sales-hist/hits-4.png" }
                                                        ]}
                                                        title="SLATTUM"
                                                        description="Каркас кровати с обивкой, Vissle темно-серый, 140x200 см"
                                                        price="135"
                                                        salesHit={true}
                                                        promo="-10% промокод IKEYA"
                                                    />
                                                    <ProductCard
                                                        galleryId="beds-3"
                                                        images={["assets/img/main-page/sales-hist/hits-3.png"]}
                                                        thumbs={[{ src: "assets/img/main-page/sales-hist/hits-3.png" }]}
                                                        title="SLATTUM"
                                                        description="Каркас кровати с обивкой, Vissle темно-серый, 140x200 см"
                                                        price="135"
                                                        salesHit={true}
                                                        promo="-10% промокод IKEYA"
                                                    />
                                                    <ProductCard
                                                        galleryId="beds-4"
                                                        images={["assets/img/main-page/sales-hist/hits-4.png"]}
                                                        thumbs={[{ src: "assets/img/main-page/sales-hist/hits-4.png" }]}
                                                        title="SLATTUM"
                                                        description="Каркас кровати с обивкой, Vissle темно-серый, 140x200 см"
                                                        price="135"
                                                        salesHit={true}
                                                        promo="-10% промокод IKEYA"
                                                    />
                                                    <ProductCard
                                                        galleryId="beds-5"
                                                        images={["assets/img/main-page/sales-hist/hits-5.png"]}
                                                        thumbs={[{ src: "assets/img/main-page/sales-hist/hits-5.png" }]}
                                                        title="SLATTUM"
                                                        description="Каркас кровати с обивкой, Vissle темно-серый, 140x200 см"
                                                        price="135"
                                                        salesHit={true}
                                                        promo="-10% промокод IKEYA"
                                                    />
                                                </div>
                                            </div>

                                            <div className="swiper-slide">
                                                <div className="row g-4 swiper-slide-inner">
                                                    <ProductCard
                                                        galleryId="beds-1"
                                                        images={[
                                                            "assets/img/main-page/sales-hist/hits-1.png",
                                                            "assets/img/main-page/sales-hist/hits-2.png",
                                                            "assets/img/main-page/sales-hist/hits-3.png",
                                                            "assets/img/main-page/sales-hist/hits-4.png",
                                                            "assets/img/main-page/sales-hist/hits-5.png"
                                                        ]}
                                                        thumbs={[
                                                            { src: "assets/img/main-page/sales-hist/hits-1.png" },
                                                            { src: "assets/img/main-page/sales-hist/hits-1.png" },
                                                            { src: "assets/img/main-page/sales-hist/hits-3.png" },
                                                            { isMore: true, count: "+2" }
                                                        ]}
                                                        title="SLATTUM"
                                                        description="Каркас кровати с обивкой, Vissle темно-серый, 140x200 см"
                                                        price="135"
                                                        salesHit={true}
                                                        promo="-10% промокод IKEYA"
                                                    />
                                                    <ProductCard
                                                        galleryId="beds-2"
                                                        images={[
                                                            "assets/img/main-page/sales-hist/hits-1.png",
                                                            "assets/img/main-page/sales-hist/hits-3.png",
                                                            "assets/img/main-page/sales-hist/hits-4.png"
                                                        ]}
                                                        thumbs={[
                                                            { src: "assets/img/main-page/sales-hist/hits-1.png" },
                                                            { src: "assets/img/main-page/sales-hist/hits-3.png" },
                                                            { src: "assets/img/main-page/sales-hist/hits-4.png" }
                                                        ]}
                                                        title="SLATTUM"
                                                        description="Каркас кровати с обивкой, Vissle темно-серый, 140x200 см"
                                                        price="135"
                                                        salesHit={true}
                                                        promo="-10% промокод IKEYA"
                                                    />
                                                    <ProductCard
                                                        galleryId="beds-3"
                                                        images={["assets/img/main-page/sales-hist/hits-3.png"]}
                                                        thumbs={[{ src: "assets/img/main-page/sales-hist/hits-3.png" }]}
                                                        title="SLATTUM"
                                                        description="Каркас кровати с обивкой, Vissle темно-серый, 140x200 см"
                                                        price="135"
                                                        salesHit={true}
                                                        promo="-10% промокод IKEYA"
                                                    />
                                                    <ProductCard
                                                        galleryId="beds-4"
                                                        images={["assets/img/main-page/sales-hist/hits-4.png"]}
                                                        thumbs={[{ src: "assets/img/main-page/sales-hist/hits-4.png" }]}
                                                        title="SLATTUM"
                                                        description="Каркас кровати с обивкой, Vissle темно-серый, 140x200 см"
                                                        price="135"
                                                        salesHit={true}
                                                        promo="-10% промокод IKEYA"
                                                    />
                                                    <ProductCard
                                                        galleryId="beds-5"
                                                        images={["assets/img/main-page/sales-hist/hits-5.png"]}
                                                        thumbs={[{ src: "assets/img/main-page/sales-hist/hits-5.png" }]}
                                                        title="SLATTUM"
                                                        description="Каркас кровати с обивкой, Vissle темно-серый, 140x200 см"
                                                        price="135"
                                                        salesHit={true}
                                                        promo="-10% промокод IKEYA"
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="products-slider__nav products-slider__nav-prev" data-slider-nav="beds">
                                        <svg width="6.67" height="12" viewBox="0 0 7 12" fill="none"
                                            xmlns="http://www.w3.org/2000/svg">
                                            <path d="M6 1L1 6L6 11" stroke="currentColor" strokeWidth="1.5"
                                                strokeLinecap="round" strokeLinejoin="round" />
                                        </svg>
                                    </div>
                                    <div className="products-slider__nav products-slider__nav-next" data-slider-nav="beds">
                                        <svg width="6.67" height="12" viewBox="0 0 7 12" fill="none"
                                            xmlns="http://www.w3.org/2000/svg">
                                            <path d="M1 11L6 6L1 1" stroke="currentColor" strokeWidth="1.5"
                                                strokeLinecap="round" strokeLinejoin="round" />
                                        </svg>
                                    </div>

                                    <div className="products-slider__pagination" data-slider-pagination="beds"></div>
                                </div>
                            </div>

                            <div className="tab-pane fade" id="sofas" role="tabpanel">
                                <div className="products-card-slider">
                                    <div className="products-slider swiper" data-slider="sofas">
                                        <div className="swiper-wrapper">
                                            <div className="swiper-slide">
                                                <div className="row g-4 swiper-slide-inner">
                                                    <ProductCard
                                                        galleryId="sofas-1"
                                                        images={["assets/img/main-page/sales-hist/hits-1.png"]}
                                                        thumbs={[{ src: "assets/img/main-page/sales-hist/hits-1.png" }]}
                                                        title="SLATTUM"
                                                        description="Каркас кровати с обивкой, Vissle темно-серый, 140x200 см"
                                                        price="135"
                                                        salesHit={true}
                                                        promo="-10% промокод IKEYA"
                                                    />
                                                    <ProductCard
                                                        galleryId="sofas-2"
                                                        images={["assets/img/main-page/sales-hist/hits-2.png"]}
                                                        thumbs={[{ src: "assets/img/main-page/sales-hist/hits-2.png" }]}
                                                        title="SLATTUM"
                                                        description="Каркас кровати с обивкой, Vissle темно-серый, 140x200 см"
                                                        price="135"
                                                        salesHit={true}
                                                        promo="-10% промокод IKEYA"
                                                    />
                                                    <ProductCard
                                                        galleryId="sofas-3"
                                                        images={["assets/img/main-page/sales-hist/hits-3.png"]}
                                                        thumbs={[{ src: "assets/img/main-page/sales-hist/hits-3.png" }]}
                                                        title="SLATTUM"
                                                        description="Каркас кровати с обивкой, Vissle темно-серый, 140x200 см"
                                                        price="135"
                                                        salesHit={true}
                                                        promo="-10% промокод IKEYA"
                                                    />
                                                    <ProductCard
                                                        galleryId="sofas-4"
                                                        images={["assets/img/main-page/sales-hist/hits-4.png"]}
                                                        thumbs={[{ src: "assets/img/main-page/sales-hist/hits-4.png" }]}
                                                        title="SLATTUM"
                                                        description="Каркас кровати с обивкой, Vissle темно-серый, 140x200 см"
                                                        price="135"
                                                        salesHit={true}
                                                        promo="-10% промокод IKEYA"
                                                    />
                                                    <ProductCard
                                                        galleryId="sofas-5"
                                                        images={["assets/img/main-page/sales-hist/hits-5.png"]}
                                                        thumbs={[{ src: "assets/img/main-page/sales-hist/hits-5.png" }]}
                                                        title="SLATTUM"
                                                        description="Каркас кровати с обивкой, Vissle темно-серый, 140x200 см"
                                                        price="135"
                                                        salesHit={true}
                                                        promo="-10% промокод IKEYA"
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="products-slider__nav products-slider__nav-prev" data-slider-nav="sofas">
                                        <svg width="6.67" height="12" viewBox="0 0 7 12" fill="none"
                                            xmlns="http://www.w3.org/2000/svg">
                                            <path d="M6 1L1 6L6 11" stroke="currentColor" strokeWidth="1.5"
                                                strokeLinecap="round" strokeLinejoin="round" />
                                        </svg>
                                    </div>
                                    <div className="products-slider__nav products-slider__nav-next" data-slider-nav="sofas">
                                        <svg width="6.67" height="12" viewBox="0 0 7 12" fill="none"
                                            xmlns="http://www.w3.org/2000/svg">
                                            <path d="M1 11L6 6L1 1" stroke="currentColor" strokeWidth="1.5"
                                                strokeLinecap="round" strokeLinejoin="round" />
                                        </svg>
                                    </div>

                                    <div className="products-slider__pagination" data-slider-pagination="sofas"></div>
                                </div>
                            </div>

                            <div className="tab-pane fade" id="lighting" role="tabpanel">
                                <div className="products-card-slider">
                                    <div className="products-slider swiper" data-slider="lighting">
                                        <div className="swiper-wrapper">
                                            <div className="swiper-slide">
                                                <div className="row g-4 swiper-slide-inner">
                                                    <ProductCard
                                                        galleryId="lighting-1"
                                                        images={["assets/img/main-page/sales-hist/hits-1.png"]}
                                                        thumbs={[{ src: "assets/img/main-page/sales-hist/hits-1.png" }]}
                                                        title="SLATTUM"
                                                        description="Каркас кровати с обивкой, Vissle темно-серый, 140x200 см"
                                                        price="135"
                                                        salesHit={true}
                                                        promo="-10% промокод IKEYA"
                                                    />
                                                    <ProductCard
                                                        galleryId="lighting-2"
                                                        images={["assets/img/main-page/sales-hist/hits-2.png"]}
                                                        thumbs={[{ src: "assets/img/main-page/sales-hist/hits-2.png" }]}
                                                        title="SLATTUM"
                                                        description="Каркас кровати с обивкой, Vissle темно-серый, 140x200 см"
                                                        price="135"
                                                        salesHit={true}
                                                        promo="-10% промокод IKEYA"
                                                    />
                                                    <ProductCard
                                                        galleryId="lighting-3"
                                                        images={["assets/img/main-page/sales-hist/hits-3.png"]}
                                                        thumbs={[{ src: "assets/img/main-page/sales-hist/hits-3.png" }]}
                                                        title="SLATTUM"
                                                        description="Каркас кровати с обивкой, Vissle темно-серый, 140x200 см"
                                                        price="135"
                                                        salesHit={true}
                                                        promo="-10% промокод IKEYA"
                                                    />
                                                    <ProductCard
                                                        galleryId="lighting-4"
                                                        images={["assets/img/main-page/sales-hist/hits-4.png"]}
                                                        thumbs={[{ src: "assets/img/main-page/sales-hist/hits-4.png" }]}
                                                        title="SLATTUM"
                                                        description="Каркас кровати с обивкой, Vissle темно-серый, 140x200 см"
                                                        price="135"
                                                        salesHit={true}
                                                        promo="-10% промокод IKEYA"
                                                    />
                                                    <ProductCard
                                                        galleryId="lighting-5"
                                                        images={["assets/img/main-page/sales-hist/hits-5.png"]}
                                                        thumbs={[{ src: "assets/img/main-page/sales-hist/hits-5.png" }]}
                                                        title="SLATTUM"
                                                        description="Каркас кровати с обивкой, Vissle темно-серый, 140x200 см"
                                                        price="135"
                                                        salesHit={true}
                                                        promo="-10% промокод IKEYA"
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="products-slider__nav products-slider__nav-prev" data-slider-nav="lighting">
                                        <svg width="6.67" height="12" viewBox="0 0 7 12" fill="none"
                                            xmlns="http://www.w3.org/2000/svg">
                                            <path d="M6 1L1 6L6 11" stroke="currentColor" strokeWidth="1.5"
                                                strokeLinecap="round" strokeLinejoin="round" />
                                        </svg>
                                    </div>
                                    <div className="products-slider__nav products-slider__nav-next" data-slider-nav="lighting">
                                        <svg width="6.67" height="12" viewBox="0 0 7 12" fill="none"
                                            xmlns="http://www.w3.org/2000/svg">
                                            <path d="M1 11L6 6L1 1" stroke="currentColor" strokeWidth="1.5"
                                                strokeLinecap="round" strokeLinejoin="round" />
                                        </svg>
                                    </div>

                                    <div className="products-slider__pagination" data-slider-pagination="lighting"></div>
                                </div>
                            </div>

                            <div className="tab-pane fade" id="wardrobes" role="tabpanel">
                                <div className="products-card-slider">
                                    <div className="products-slider swiper" data-slider="wardrobes">
                                        <div className="swiper-wrapper">
                                            <div className="swiper-slide">
                                                <div className="row g-4 swiper-slide-inner">
                                                    <ProductCard
                                                        galleryId="wardrobes-1"
                                                        images={["assets/img/main-page/sales-hist/hits-1.png"]}
                                                        thumbs={[{ src: "assets/img/main-page/sales-hist/hits-1.png" }]}
                                                        title="SLATTUM"
                                                        description="Каркас кровати с обивкой, Vissle темно-серый, 140x200 см"
                                                        price="135"
                                                        salesHit={true}
                                                        promo="-10% промокод IKEYA"
                                                    />
                                                    <ProductCard
                                                        galleryId="wardrobes-2"
                                                        images={["assets/img/main-page/sales-hist/hits-2.png"]}
                                                        thumbs={[{ src: "assets/img/main-page/sales-hist/hits-2.png" }]}
                                                        title="SLATTUM"
                                                        description="Каркас кровати с обивкой, Vissle темно-серый, 140x200 см"
                                                        price="135"
                                                        salesHit={true}
                                                        promo="-10% промокод IKEYA"
                                                    />
                                                    <ProductCard
                                                        galleryId="wardrobes-3"
                                                        images={["assets/img/main-page/sales-hist/hits-3.png"]}
                                                        thumbs={[{ src: "assets/img/main-page/sales-hist/hits-3.png" }]}
                                                        title="SLATTUM"
                                                        description="Каркас кровати с обивкой, Vissle темно-серый, 140x200 см"
                                                        price="135"
                                                        salesHit={true}
                                                        promo="-10% промокод IKEYA"
                                                    />
                                                    <ProductCard
                                                        galleryId="wardrobes-4"
                                                        images={["assets/img/main-page/sales-hist/hits-4.png"]}
                                                        thumbs={[{ src: "assets/img/main-page/sales-hist/hits-4.png" }]}
                                                        title="SLATTUM"
                                                        description="Каркас кровати с обивкой, Vissle темно-серый, 140x200 см"
                                                        price="135"
                                                        salesHit={true}
                                                        promo="-10% промокод IKEYA"
                                                    />
                                                    <ProductCard
                                                        galleryId="wardrobes-5"
                                                        images={["assets/img/main-page/sales-hist/hits-5.png"]}
                                                        thumbs={[{ src: "assets/img/main-page/sales-hist/hits-5.png" }]}
                                                        title="SLATTUM"
                                                        description="Каркас кровати с обивкой, Vissle темно-серый, 140x200 см"
                                                        price="135"
                                                        salesHit={true}
                                                        promo="-10% промокод IKEYA"
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="products-slider__nav products-slider__nav-prev" data-slider-nav="wardrobes">
                                        <svg width="6.67" height="12" viewBox="0 0 7 12" fill="none"
                                            xmlns="http://www.w3.org/2000/svg">
                                            <path d="M6 1L1 6L6 11" stroke="currentColor" strokeWidth="1.5"
                                                strokeLinecap="round" strokeLinejoin="round" />
                                        </svg>
                                    </div>
                                    <div className="products-slider__nav products-slider__nav-next" data-slider-nav="wardrobes">
                                        <svg width="6.67" height="12" viewBox="0 0 7 12" fill="none"
                                            xmlns="http://www.w3.org/2000/svg">
                                            <path d="M1 11L6 6L1 1" stroke="currentColor" strokeWidth="1.5"
                                                strokeLinecap="round" strokeLinejoin="round" />
                                        </svg>
                                    </div>

                                    <div className="products-slider__pagination" data-slider-pagination="wardrobes"></div>
                                </div>
                            </div>

                            <div className="tab-pane fade" id="dressers" role="tabpanel">
                                <div className="products-card-slider">
                                    <div className="products-slider swiper" data-slider="dressers">
                                        <div className="swiper-wrapper">
                                            <div className="swiper-slide">
                                                <div className="row g-4 swiper-slide-inner">
                                                    <ProductCard
                                                        galleryId="dressers-1"
                                                        images={["assets/img/main-page/sales-hist/hits-1.png"]}
                                                        thumbs={[{ src: "assets/img/main-page/sales-hist/hits-1.png" }]}
                                                        title="SLATTUM"
                                                        description="Каркас кровати с обивкой, Vissle темно-серый, 140x200 см"
                                                        price="135"
                                                        salesHit={true}
                                                        promo="-10% промокод IKEYA"
                                                    />
                                                    <ProductCard
                                                        galleryId="dressers-2"
                                                        images={["assets/img/main-page/sales-hist/hits-2.png"]}
                                                        thumbs={[{ src: "assets/img/main-page/sales-hist/hits-2.png" }]}
                                                        title="SLATTUM"
                                                        description="Каркас кровати с обивкой, Vissle темно-серый, 140x200 см"
                                                        price="135"
                                                        salesHit={true}
                                                        promo="-10% промокод IKEYA"
                                                    />
                                                    <ProductCard
                                                        galleryId="dressers-3"
                                                        images={["assets/img/main-page/sales-hist/hits-3.png"]}
                                                        thumbs={[{ src: "assets/img/main-page/sales-hist/hits-3.png" }]}
                                                        title="SLATTUM"
                                                        description="Каркас кровати с обивкой, Vissle темно-серый, 140x200 см"
                                                        price="135"
                                                        salesHit={true}
                                                        promo="-10% промокод IKEYA"
                                                    />
                                                    <ProductCard
                                                        galleryId="dressers-4"
                                                        images={["assets/img/main-page/sales-hist/hits-4.png"]}
                                                        thumbs={[{ src: "assets/img/main-page/sales-hist/hits-4.png" }]}
                                                        title="SLATTUM"
                                                        description="Каркас кровати с обивкой, Vissle темно-серый, 140x200 см"
                                                        price="135"
                                                        salesHit={true}
                                                        promo="-10% промокод IKEYA"
                                                    />
                                                    <ProductCard
                                                        galleryId="dressers-5"
                                                        images={["assets/img/main-page/sales-hist/hits-5.png"]}
                                                        thumbs={[{ src: "assets/img/main-page/sales-hist/hits-5.png" }]}
                                                        title="SLATTUM"
                                                        description="Каркас кровати с обивкой, Vissle темно-серый, 140x200 см"
                                                        price="135"
                                                        salesHit={true}
                                                        promo="-10% промокод IKEYA"
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="products-slider__nav products-slider__nav-prev" data-slider-nav="dressers">
                                        <svg width="6.67" height="12" viewBox="0 0 7 12" fill="none"
                                            xmlns="http://www.w3.org/2000/svg">
                                            <path d="M6 1L1 6L6 11" stroke="currentColor" strokeWidth="1.5"
                                                strokeLinecap="round" strokeLinejoin="round" />
                                        </svg>
                                    </div>
                                    <div className="products-slider__nav products-slider__nav-next" data-slider-nav="dressers">
                                        <svg width="6.67" height="12" viewBox="0 0 7 12" fill="none"
                                            xmlns="http://www.w3.org/2000/svg">
                                            <path d="M1 11L6 6L1 1" stroke="currentColor" strokeWidth="1.5"
                                                strokeLinecap="round" strokeLinejoin="round" />
                                        </svg>
                                    </div>

                                    <div className="products-slider__pagination" data-slider-pagination="dressers"></div>
                                </div>
                            </div>

                            <div className="tab-pane fade" id="storage" role="tabpanel">
                                <div className="products-card-slider">
                                    <div className="products-slider swiper" data-slider="storage">
                                        <div className="swiper-wrapper">
                                            <div className="swiper-slide">
                                                <div className="row g-4 swiper-slide-inner">
                                                    <ProductCard
                                                        galleryId="storage-1"
                                                        images={["assets/img/main-page/sales-hist/hits-1.png"]}
                                                        thumbs={[{ src: "assets/img/main-page/sales-hist/hits-1.png" }]}
                                                        title="SLATTUM"
                                                        description="Каркас кровати с обивкой, Vissle темно-серый, 140x200 см"
                                                        price="135"
                                                        salesHit={true}
                                                        promo="-10% промокод IKEYA"
                                                    />
                                                    <ProductCard
                                                        galleryId="storage-2"
                                                        images={["assets/img/main-page/sales-hist/hits-2.png"]}
                                                        thumbs={[{ src: "assets/img/main-page/sales-hist/hits-2.png" }]}
                                                        title="SLATTUM"
                                                        description="Каркас кровати с обивкой, Vissle темно-серый, 140x200 см"
                                                        price="135"
                                                        salesHit={true}
                                                        promo="-10% промокод IKEYA"
                                                    />
                                                    <ProductCard
                                                        galleryId="storage-3"
                                                        images={["assets/img/main-page/sales-hist/hits-3.png"]}
                                                        thumbs={[{ src: "assets/img/main-page/sales-hist/hits-3.png" }]}
                                                        title="SLATTUM"
                                                        description="Каркас кровати с обивкой, Vissle темно-серый, 140x200 см"
                                                        price="135"
                                                        salesHit={true}
                                                        promo="-10% промокод IKEYA"
                                                    />
                                                    <ProductCard
                                                        galleryId="storage-4"
                                                        images={["assets/img/main-page/sales-hist/hits-4.png"]}
                                                        thumbs={[{ src: "assets/img/main-page/sales-hist/hits-4.png" }]}
                                                        title="SLATTUM"
                                                        description="Каркас кровати с обивкой, Vissle темно-серый, 140x200 см"
                                                        price="135"
                                                        salesHit={true}
                                                        promo="-10% промокод IKEYA"
                                                    />
                                                    <ProductCard
                                                        galleryId="storage-5"
                                                        images={["assets/img/main-page/sales-hist/hits-5.png"]}
                                                        thumbs={[{ src: "assets/img/main-page/sales-hist/hits-5.png" }]}
                                                        title="SLATTUM"
                                                        description="Каркас кровати с обивкой, Vissle темно-серый, 140x200 см"
                                                        price="135"
                                                        salesHit={true}
                                                        promo="-10% промокод IKEYA"
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="products-slider__nav products-slider__nav-prev" data-slider-nav="storage">
                                        <svg width="6.67" height="12" viewBox="0 0 7 12" fill="none"
                                            xmlns="http://www.w3.org/2000/svg">
                                            <path d="M6 1L1 6L6 11" stroke="currentColor" strokeWidth="1.5"
                                                strokeLinecap="round" strokeLinejoin="round" />
                                        </svg>
                                    </div>
                                    <div className="products-slider__nav products-slider__nav-next" data-slider-nav="storage">
                                        <svg width="6.67" height="12" viewBox="0 0 7 12" fill="none"
                                            xmlns="http://www.w3.org/2000/svg">
                                            <path d="M1 11L6 6L1 1" stroke="currentColor" strokeWidth="1.5"
                                                strokeLinecap="round" strokeLinejoin="round" />
                                        </svg>
                                    </div>

                                    <div className="products-slider__pagination" data-slider-pagination="storage"></div>
                                </div>
                            </div>

                            <div className="tab-pane fade" id="garden" role="tabpanel">
                                <div className="products-card-slider">
                                    <div className="products-slider swiper" data-slider="garden">
                                        <div className="swiper-wrapper">
                                            <div className="swiper-slide">
                                                <div className="row g-4 swiper-slide-inner">
                                                    <ProductCard
                                                        galleryId="garden-1"
                                                        images={["assets/img/main-page/sales-hist/hits-1.png"]}
                                                        thumbs={[{ src: "assets/img/main-page/sales-hist/hits-1.png" }]}
                                                        title="SLATTUM"
                                                        description="Каркас кровати с обивкой, Vissle темно-серый, 140x200 см"
                                                        price="135"
                                                        salesHit={true}
                                                        promo="-10% промокод IKEYA"
                                                    />
                                                    <ProductCard
                                                        galleryId="garden-2"
                                                        images={["assets/img/main-page/sales-hist/hits-2.png"]}
                                                        thumbs={[{ src: "assets/img/main-page/sales-hist/hits-2.png" }]}
                                                        title="SLATTUM"
                                                        description="Каркас кровати с обивкой, Vissle темно-серый, 140x200 см"
                                                        price="135"
                                                        salesHit={true}
                                                        promo="-10% промокод IKEYA"
                                                    />
                                                    <ProductCard
                                                        galleryId="garden-3"
                                                        images={["assets/img/main-page/sales-hist/hits-3.png"]}
                                                        thumbs={[{ src: "assets/img/main-page/sales-hist/hits-3.png" }]}
                                                        title="SLATTUM"
                                                        description="Каркас кровати с обивкой, Vissle темно-серый, 140x200 см"
                                                        price="135"
                                                        salesHit={true}
                                                        promo="-10% промокод IKEYA"
                                                    />
                                                    <ProductCard
                                                        galleryId="garden-4"
                                                        images={["assets/img/main-page/sales-hist/hits-4.png"]}
                                                        thumbs={[{ src: "assets/img/main-page/sales-hist/hits-4.png" }]}
                                                        title="SLATTUM"
                                                        description="Каркас кровати с обивкой, Vissle темно-серый, 140x200 см"
                                                        price="135"
                                                        salesHit={true}
                                                        promo="-10% промокод IKEYA"
                                                    />
                                                    <ProductCard
                                                        galleryId="garden-5"
                                                        images={["assets/img/main-page/sales-hist/hits-5.png"]}
                                                        thumbs={[{ src: "assets/img/main-page/sales-hist/hits-5.png" }]}
                                                        title="SLATTUM"
                                                        description="Каркас кровати с обивкой, Vissle темно-серый, 140x200 см"
                                                        price="135"
                                                        salesHit={true}
                                                        promo="-10% промокод IKEYA"
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="products-slider__nav products-slider__nav-prev" data-slider-nav="garden">
                                        <svg width="6.67" height="12" viewBox="0 0 7 12" fill="none"
                                            xmlns="http://www.w3.org/2000/svg">
                                            <path d="M6 1L1 6L6 11" stroke="currentColor" strokeWidth="1.5"
                                                strokeLinecap="round" strokeLinejoin="round" />
                                        </svg>
                                    </div>
                                    <div className="products-slider__nav products-slider__nav-next" data-slider-nav="garden">
                                        <svg width="6.67" height="12" viewBox="0 0 7 12" fill="none"
                                            xmlns="http://www.w3.org/2000/svg">
                                            <path d="M1 11L6 6L1 1" stroke="currentColor" strokeWidth="1.5"
                                                strokeLinecap="round" strokeLinejoin="round" />
                                        </svg>
                                    </div>

                                    <div className="products-slider__pagination" data-slider-pagination="garden"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
