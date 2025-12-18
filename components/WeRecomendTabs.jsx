'use client';

import { useEffect } from 'react';
import ProductCard from './ProductsTabs/ProductCard';

export default function WeRecomendTabs() {
    useEffect(() => {
        // Инициализация Swiper для слайдеров товаров
    }, []);

    return (
        <section className="products-tabs recomended-tabs">
            <div className="container">
                <div className="row">
                    <div className="col-12">
                        <h2>Мы рекомендуем</h2>
                        <ul className="nav products-tabs__nav" id="productsTabs" role="tablist">
                            <li className="nav-item" role="presentation">
                                <button className="nav-link products-tabs__link active" id="svet-tab" data-bs-toggle="tab"
                                    data-bs-target="#svet" type="button" role="tab">
                                    Освещение
                                </button>
                            </li>
                            <li className="nav-item" role="presentation">
                                <button className="nav-link products-tabs__link" id="divans-tab" data-bs-toggle="tab"
                                    data-bs-target="#divans" type="button" role="tab">
                                    Диваны и кресла
                                </button>
                            </li>
                            <li className="nav-item" role="presentation">
                                <button className="nav-link products-tabs__link" id="lightings-tab" data-bs-toggle="tab"
                                    data-bs-target="#lightings" type="button" role="tab">
                                    Освещение
                                </button>
                            </li>
                            <li className="nav-item" role="presentation">
                                <button className="nav-link products-tabs__link" id="shkafi-tab" data-bs-toggle="tab"
                                    data-bs-target="#shkafi" type="button" role="tab">
                                    Шкафы
                                </button>
                            </li>
                            <li className="nav-item" role="presentation">
                                <button className="nav-link products-tabs__link" id="komodi-tab" data-bs-toggle="tab"
                                    data-bs-target="#komodi" type="button" role="tab">
                                    Комоды и тумбочки
                                </button>
                            </li>
                            <li className="nav-item" role="presentation">
                                <button className="nav-link products-tabs__link" id="hranenie-tab" data-bs-toggle="tab"
                                    data-bs-target="#hranenie" type="button" role="tab">
                                    Системы хранения
                                </button>
                            </li>
                            <li className="nav-item" role="presentation">
                                <button className="nav-link products-tabs__link" id="balkon-tab" data-bs-toggle="tab"
                                    data-bs-target="#balkon" type="button" role="tab">
                                    Сад и балкон
                                </button>
                            </li>
                        </ul>

                        <div className="tab-content products-tabs__content" id="productsTabsContent">
                            <div className="tab-pane fade show active" id="svet" role="tabpanel">
                                <div className="products-card-slider">
                                    <div className="products-slider swiper" data-slider="beds">
                                        <div className="swiper-wrapper">
                                            <div className="swiper-slide">
                                                <div className="row g-4 swiper-slide-inner">
                                                    <ProductCard
                                                        galleryId="beds-1"
                                                        images={[
                                                            "assets/img/main-page/we-recomend/recomend-1.png",
                                                            "assets/img/main-page/we-recomend/recomend-2.png",
                                                            "assets/img/main-page/we-recomend/recomend-3.png",
                                                            "assets/img/main-page/we-recomend/recomend-4.png",
                                                            "assets/img/main-page/we-recomend/recomend-5.png"
                                                        ]}
                                                        thumbs={[
                                                            { src: "assets/img/main-page/sales-hist/hits-1.png" },
                                                            { src: "assets/img/main-page/sales-hist/hits-1.png" },
                                                            { src: "assets/img/main-page/sales-hist/hits-3.png" },
                                                            { isMore: true, count: "+2" }
                                                        ]}
                                                        title="NÖSUND"
                                                        description="Потолочный светильник, береза, 44 см"
                                                        price="135"
                                                        salesHit={true}
                                                        promo="-10% промокод IKEYA"
                                                    />
                                                    <ProductCard
                                                        galleryId="beds-2"
                                                        images={[
                                                            "assets/img/main-page/we-recomend/recomend-2.png",
                                                            "assets/img/main-page/we-recomend/recomend-3.png",
                                                            "assets/img/main-page/we-recomend/recomend-4.png",
                                                            "assets/img/main-page/we-recomend/recomend-5.png",
                                                            "assets/img/main-page/we-recomend/recomend-1.png"
                                                        ]}
                                                        thumbs={[
                                                            { src: "assets/img/main-page/we-recomend/recomend-2.png" },
                                                            { src: "assets/img/main-page/we-recomend/recomend-3.png" },
                                                            { src: "assets/img/main-page/we-recomend/recomend-4.png" }
                                                        ]}
                                                        title="MUDDERVERK"
                                                        description="Lampa wisząca, mosiądz/opalowa biel szkło"
                                                        price="135"
                                                        salesHit={true}
                                                        promo="-10% промокод IKEYA"
                                                    />
                                                    <ProductCard
                                                        galleryId="beds-3"
                                                        images={[
                                                            "assets/img/main-page/we-recomend/recomend-3.png",
                                                            "assets/img/main-page/we-recomend/recomend-4.png",
                                                            "assets/img/main-page/we-recomend/recomend-5.png",
                                                            "assets/img/main-page/we-recomend/recomend-1.png",
                                                            "assets/img/main-page/we-recomend/recomend-2.png"
                                                        ]}
                                                        thumbs={[
                                                            { src: "assets/img/main-page/we-recomend/recomend-3.png" }
                                                        ]}
                                                        title="NYMÅNE"
                                                        description="Настольная лампа, антрацит, 33 см"
                                                        price="135"
                                                        salesHit={true}
                                                        promo="-10% промокод IKEYA"
                                                    />
                                                    <ProductCard
                                                        galleryId="beds-4"
                                                        images={["assets/img/main-page/we-recomend/recomend-4.png"]}
                                                        thumbs={[{ src: "assets/img/main-page/we-recomend/recomend-4.png" }]}
                                                        title="RÖDFLIK"
                                                        description="Настольная лампа, светло-бежевая"
                                                        price="135"
                                                        salesHit={true}
                                                        promo="-10% промокод IKEYA"
                                                    />
                                                    <ProductCard
                                                        galleryId="beds-5"
                                                        images={["assets/img/main-page/we-recomend/recomend-5.png"]}
                                                        thumbs={[{ src: "assets/img/main-page/we-recomend/recomend-5.png" }]}
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

                            <div className="tab-pane fade" id="divans" role="tabpanel">
                                <div className="products-card-slider">
                                    <div className="products-slider swiper" data-slider="divans">
                                        <div className="swiper-wrapper">
                                            <div className="swiper-slide">
                                                <div className="row g-4 swiper-slide-inner">
                                                    <ProductCard
                                                        galleryId="divans-1"
                                                        images={["assets/img/main-page/we-recomend/recomend-1.png"]}
                                                        thumbs={[{ src: "assets/img/main-page/we-recomend/recomend-1.png" }]}
                                                        title="SLATTUM"
                                                        description="Каркас кровати с обивкой, Vissle темно-серый, 140x200 см"
                                                        price="135"
                                                        salesHit={true}
                                                        promo="-10% промокод IKEYA"
                                                    />
                                                    <ProductCard
                                                        galleryId="divans-2"
                                                        images={["assets/img/main-page/we-recomend/recomend-2.png"]}
                                                        thumbs={[{ src: "assets/img/main-page/we-recomend/recomend-2.png" }]}
                                                        title="SLATTUM"
                                                        description="Каркас кровати с обивкой, Vissle темно-серый, 140x200 см"
                                                        price="135"
                                                        salesHit={true}
                                                        promo="-10% промокод IKEYA"
                                                    />
                                                    <ProductCard
                                                        galleryId="divans-3"
                                                        images={["assets/img/main-page/we-recomend/recomend-3.png"]}
                                                        thumbs={[{ src: "assets/img/main-page/we-recomend/recomend-3.png" }]}
                                                        title="SLATTUM"
                                                        description="Каркас кровати с обивкой, Vissle темно-серый, 140x200 см"
                                                        price="135"
                                                        salesHit={true}
                                                        promo="-10% промокод IKEYA"
                                                    />
                                                    <ProductCard
                                                        galleryId="divans-4"
                                                        images={["assets/img/main-page/we-recomend/recomend-4.png"]}
                                                        thumbs={[{ src: "assets/img/main-page/we-recomend/recomend-4.png" }]}
                                                        title="SLATTUM"
                                                        description="Каркас кровати с обивкой, Vissle темно-серый, 140x200 см"
                                                        price="135"
                                                        salesHit={true}
                                                        promo="-10% промокод IKEYA"
                                                    />
                                                    <ProductCard
                                                        galleryId="divans-5"
                                                        images={["assets/img/main-page/we-recomend/recomend-5.png"]}
                                                        thumbs={[{ src: "assets/img/main-page/we-recomend/recomend-5.png" }]}
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

                                    <div className="products-slider__nav products-slider__nav-prev" data-slider-nav="divans">
                                        <svg width="6.67" height="12" viewBox="0 0 7 12" fill="none"
                                            xmlns="http://www.w3.org/2000/svg">
                                            <path d="M6 1L1 6L6 11" stroke="currentColor" strokeWidth="1.5"
                                                strokeLinecap="round" strokeLinejoin="round" />
                                        </svg>
                                    </div>
                                    <div className="products-slider__nav products-slider__nav-next" data-slider-nav="divans">
                                        <svg width="6.67" height="12" viewBox="0 0 7 12" fill="none"
                                            xmlns="http://www.w3.org/2000/svg">
                                            <path d="M1 11L6 6L1 1" stroke="currentColor" strokeWidth="1.5"
                                                strokeLinecap="round" strokeLinejoin="round" />
                                        </svg>
                                    </div>

                                    <div className="products-slider__pagination" data-slider-pagination="divans"></div>
                                </div>
                            </div>

                            <div className="tab-pane fade" id="lightings" role="tabpanel">
                                <div className="products-card-slider">
                                    <div className="products-slider swiper" data-slider="lightings">
                                        <div className="swiper-wrapper">
                                            <div className="swiper-slide">
                                                <div className="row g-4 swiper-slide-inner">
                                                    <ProductCard
                                                        galleryId="lightings-1"
                                                        images={["assets/img/main-page/we-recomend/recomend-1.png"]}
                                                        thumbs={[{ src: "assets/img/main-page/we-recomend/recomend-1.png" }]}
                                                        title="SLATTUM"
                                                        description="Каркас кровати с обивкой, Vissle темно-серый, 140x200 см"
                                                        price="135"
                                                        salesHit={true}
                                                        promo="-10% промокод IKEYA"
                                                    />
                                                    <ProductCard
                                                        galleryId="lightings-2"
                                                        images={["assets/img/main-page/we-recomend/recomend-2.png"]}
                                                        thumbs={[{ src: "assets/img/main-page/we-recomend/recomend-2.png" }]}
                                                        title="SLATTUM"
                                                        description="Каркас кровати с обивкой, Vissle темно-серый, 140x200 см"
                                                        price="135"
                                                        salesHit={true}
                                                        promo="-10% промокод IKEYA"
                                                    />
                                                    <ProductCard
                                                        galleryId="lightings-3"
                                                        images={["assets/img/main-page/we-recomend/recomend-3.png"]}
                                                        thumbs={[{ src: "assets/img/main-page/we-recomend/recomend-3.png" }]}
                                                        title="SLATTUM"
                                                        description="Каркас кровати с обивкой, Vissle темно-серый, 140x200 см"
                                                        price="135"
                                                        salesHit={true}
                                                        promo="-10% промокод IKEYA"
                                                    />
                                                    <ProductCard
                                                        galleryId="lightings-4"
                                                        images={["assets/img/main-page/we-recomend/recomend-4.png"]}
                                                        thumbs={[{ src: "assets/img/main-page/we-recomend/recomend-4.png" }]}
                                                        title="SLATTUM"
                                                        description="Каркас кровати с обивкой, Vissle темно-серый, 140x200 см"
                                                        price="135"
                                                        salesHit={true}
                                                        promo="-10% промокод IKEYA"
                                                    />
                                                    <ProductCard
                                                        galleryId="lightings-5"
                                                        images={["assets/img/main-page/we-recomend/recomend-5.png"]}
                                                        thumbs={[{ src: "assets/img/main-page/we-recomend/recomend-5.png" }]}
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

                                    <div className="products-slider__nav products-slider__nav-prev" data-slider-nav="lightings">
                                        <svg width="6.67" height="12" viewBox="0 0 7 12" fill="none"
                                            xmlns="http://www.w3.org/2000/svg">
                                            <path d="M6 1L1 6L6 11" stroke="currentColor" strokeWidth="1.5"
                                                strokeLinecap="round" strokeLinejoin="round" />
                                        </svg>
                                    </div>
                                    <div className="products-slider__nav products-slider__nav-next" data-slider-nav="lightings">
                                        <svg width="6.67" height="12" viewBox="0 0 7 12" fill="none"
                                            xmlns="http://www.w3.org/2000/svg">
                                            <path d="M1 11L6 6L1 1" stroke="currentColor" strokeWidth="1.5"
                                                strokeLinecap="round" strokeLinejoin="round" />
                                        </svg>
                                    </div>

                                    <div className="products-slider__pagination" data-slider-pagination="lightings"></div>
                                </div>
                            </div>

                            <div className="tab-pane fade" id="shkafi" role="tabpanel">
                                <div className="products-card-slider">
                                    <div className="products-slider swiper" data-slider="shkafi">
                                        <div className="swiper-wrapper">
                                            <div className="swiper-slide">
                                                <div className="row g-4 swiper-slide-inner">
                                                    <ProductCard
                                                        galleryId="shkafi-1"
                                                        images={["assets/img/main-page/we-recomend/recomend-1.png"]}
                                                        thumbs={[{ src: "assets/img/main-page/we-recomend/recomend-1.png" }]}
                                                        title="SLATTUM"
                                                        description="Каркас кровати с обивкой, Vissle темно-серый, 140x200 см"
                                                        price="135"
                                                        salesHit={true}
                                                        promo="-10% промокод IKEYA"
                                                    />
                                                    <ProductCard
                                                        galleryId="shkafi-2"
                                                        images={["assets/img/main-page/we-recomend/recomend-2.png"]}
                                                        thumbs={[{ src: "assets/img/main-page/we-recomend/recomend-2.png" }]}
                                                        title="SLATTUM"
                                                        description="Каркас кровати с обивкой, Vissle темно-серый, 140x200 см"
                                                        price="135"
                                                        salesHit={true}
                                                        promo="-10% промокод IKEYA"
                                                    />
                                                    <ProductCard
                                                        galleryId="shkafi-3"
                                                        images={["assets/img/main-page/we-recomend/recomend-3.png"]}
                                                        thumbs={[{ src: "assets/img/main-page/we-recomend/recomend-3.png" }]}
                                                        title="SLATTUM"
                                                        description="Каркас кровати с обивкой, Vissle темно-серый, 140x200 см"
                                                        price="135"
                                                        salesHit={true}
                                                        promo="-10% промокод IKEYA"
                                                    />
                                                    <ProductCard
                                                        galleryId="shkafi-4"
                                                        images={["assets/img/main-page/we-recomend/recomend-4.png"]}
                                                        thumbs={[{ src: "assets/img/main-page/we-recomend/recomend-4.png" }]}
                                                        title="SLATTUM"
                                                        description="Каркас кровати с обивкой, Vissle темно-серый, 140x200 см"
                                                        price="135"
                                                        salesHit={true}
                                                        promo="-10% промокод IKEYA"
                                                    />
                                                    <ProductCard
                                                        galleryId="shkafi-5"
                                                        images={["assets/img/main-page/we-recomend/recomend-5.png"]}
                                                        thumbs={[{ src: "assets/img/main-page/we-recomend/recomend-5.png" }]}
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

                                    <div className="products-slider__nav products-slider__nav-prev" data-slider-nav="shkafi">
                                        <svg width="6.67" height="12" viewBox="0 0 7 12" fill="none"
                                            xmlns="http://www.w3.org/2000/svg">
                                            <path d="M6 1L1 6L6 11" stroke="currentColor" strokeWidth="1.5"
                                                strokeLinecap="round" strokeLinejoin="round" />
                                        </svg>
                                    </div>
                                    <div className="products-slider__nav products-slider__nav-next" data-slider-nav="shkafi">
                                        <svg width="6.67" height="12" viewBox="0 0 7 12" fill="none"
                                            xmlns="http://www.w3.org/2000/svg">
                                            <path d="M1 11L6 6L1 1" stroke="currentColor" strokeWidth="1.5"
                                                strokeLinecap="round" strokeLinejoin="round" />
                                        </svg>
                                    </div>

                                    <div className="products-slider__pagination" data-slider-pagination="shkafi"></div>
                                </div>
                            </div>

                            <div className="tab-pane fade" id="komodi" role="tabpanel">
                                <div className="products-card-slider">
                                    <div className="products-slider swiper" data-slider="komodi">
                                        <div className="swiper-wrapper">
                                            <div className="swiper-slide">
                                                <div className="row g-4 swiper-slide-inner">
                                                    <ProductCard
                                                        galleryId="komodi-1"
                                                        images={["assets/img/main-page/we-recomend/recomend-1.png"]}
                                                        thumbs={[{ src: "assets/img/main-page/we-recomend/recomend-1.png" }]}
                                                        title="SLATTUM"
                                                        description="Каркас кровати с обивкой, Vissle темно-серый, 140x200 см"
                                                        price="135"
                                                        salesHit={true}
                                                        promo="-10% промокод IKEYA"
                                                    />
                                                    <ProductCard
                                                        galleryId="komodi-2"
                                                        images={["assets/img/main-page/we-recomend/recomend-2.png"]}
                                                        thumbs={[{ src: "assets/img/main-page/we-recomend/recomend-2.png" }]}
                                                        title="SLATTUM"
                                                        description="Каркас кровати с обивкой, Vissle темно-серый, 140x200 см"
                                                        price="135"
                                                        salesHit={true}
                                                        promo="-10% промокод IKEYA"
                                                    />
                                                    <ProductCard
                                                        galleryId="komodi-3"
                                                        images={["assets/img/main-page/we-recomend/recomend-3.png"]}
                                                        thumbs={[{ src: "assets/img/main-page/we-recomend/recomend-3.png" }]}
                                                        title="SLATTUM"
                                                        description="Каркас кровати с обивкой, Vissle темно-серый, 140x200 см"
                                                        price="135"
                                                        salesHit={true}
                                                        promo="-10% промокод IKEYA"
                                                    />
                                                    <ProductCard
                                                        galleryId="komodi-4"
                                                        images={["assets/img/main-page/we-recomend/recomend-4.png"]}
                                                        thumbs={[{ src: "assets/img/main-page/we-recomend/recomend-4.png" }]}
                                                        title="SLATTUM"
                                                        description="Каркас кровати с обивкой, Vissle темно-серый, 140x200 см"
                                                        price="135"
                                                        salesHit={true}
                                                        promo="-10% промокод IKEYA"
                                                    />
                                                    <ProductCard
                                                        galleryId="komodi-5"
                                                        images={["assets/img/main-page/we-recomend/recomend-5.png"]}
                                                        thumbs={[{ src: "assets/img/main-page/we-recomend/recomend-5.png" }]}
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

                                    <div className="products-slider__nav products-slider__nav-prev" data-slider-nav="komodi">
                                        <svg width="6.67" height="12" viewBox="0 0 7 12" fill="none"
                                            xmlns="http://www.w3.org/2000/svg">
                                            <path d="M6 1L1 6L6 11" stroke="currentColor" strokeWidth="1.5"
                                                strokeLinecap="round" strokeLinejoin="round" />
                                        </svg>
                                    </div>
                                    <div className="products-slider__nav products-slider__nav-next" data-slider-nav="komodi">
                                        <svg width="6.67" height="12" viewBox="0 0 7 12" fill="none"
                                            xmlns="http://www.w3.org/2000/svg">
                                            <path d="M1 11L6 6L1 1" stroke="currentColor" strokeWidth="1.5"
                                                strokeLinecap="round" strokeLinejoin="round" />
                                        </svg>
                                    </div>

                                    <div className="products-slider__pagination" data-slider-pagination="komodi"></div>
                                </div>
                            </div>

                            <div className="tab-pane fade" id="hranenie" role="tabpanel">
                                <div className="products-card-slider">
                                    <div className="products-slider swiper" data-slider="hranenie">
                                        <div className="swiper-wrapper">
                                            <div className="swiper-slide">
                                                <div className="row g-4 swiper-slide-inner">
                                                    <ProductCard
                                                        galleryId="hranenie-1"
                                                        images={["assets/img/main-page/we-recomend/recomend-1.png"]}
                                                        thumbs={[{ src: "assets/img/main-page/we-recomend/recomend-1.png" }]}
                                                        title="SLATTUM"
                                                        description="Каркас кровати с обивкой, Vissle темно-серый, 140x200 см"
                                                        price="135"
                                                        salesHit={true}
                                                        promo="-10% промокод IKEYA"
                                                    />
                                                    <ProductCard
                                                        galleryId="hranenie-2"
                                                        images={["assets/img/main-page/we-recomend/recomend-2.png"]}
                                                        thumbs={[{ src: "assets/img/main-page/we-recomend/recomend-2.png" }]}
                                                        title="SLATTUM"
                                                        description="Каркас кровати с обивкой, Vissle темно-серый, 140x200 см"
                                                        price="135"
                                                        salesHit={true}
                                                        promo="-10% промокод IKEYA"
                                                    />
                                                    <ProductCard
                                                        galleryId="hranenie-3"
                                                        images={["assets/img/main-page/we-recomend/recomend-3.png"]}
                                                        thumbs={[{ src: "assets/img/main-page/we-recomend/recomend-3.png" }]}
                                                        title="SLATTUM"
                                                        description="Каркас кровати с обивкой, Vissle темно-серый, 140x200 см"
                                                        price="135"
                                                        salesHit={true}
                                                        promo="-10% промокод IKEYA"
                                                    />
                                                    <ProductCard
                                                        galleryId="hranenie-4"
                                                        images={["assets/img/main-page/we-recomend/recomend-4.png"]}
                                                        thumbs={[{ src: "assets/img/main-page/we-recomend/recomend-4.png" }]}
                                                        title="SLATTUM"
                                                        description="Каркас кровати с обивкой, Vissle темно-серый, 140x200 см"
                                                        price="135"
                                                        salesHit={true}
                                                        promo="-10% промокод IKEYA"
                                                    />
                                                    <ProductCard
                                                        galleryId="hranenie-5"
                                                        images={["assets/img/main-page/we-recomend/recomend-5.png"]}
                                                        thumbs={[{ src: "assets/img/main-page/we-recomend/recomend-5.png" }]}
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

                                    <div className="products-slider__nav products-slider__nav-prev" data-slider-nav="hranenie">
                                        <svg width="6.67" height="12" viewBox="0 0 7 12" fill="none"
                                            xmlns="http://www.w3.org/2000/svg">
                                            <path d="M6 1L1 6L6 11" stroke="currentColor" strokeWidth="1.5"
                                                strokeLinecap="round" strokeLinejoin="round" />
                                        </svg>
                                    </div>
                                    <div className="products-slider__nav products-slider__nav-next" data-slider-nav="hranenie">
                                        <svg width="6.67" height="12" viewBox="0 0 7 12" fill="none"
                                            xmlns="http://www.w3.org/2000/svg">
                                            <path d="M1 11L6 6L1 1" stroke="currentColor" strokeWidth="1.5"
                                                strokeLinecap="round" strokeLinejoin="round" />
                                        </svg>
                                    </div>

                                    <div className="products-slider__pagination" data-slider-pagination="hranenie"></div>
                                </div>
                            </div>

                            <div className="tab-pane fade" id="balkon" role="tabpanel">
                                <div className="products-card-slider">
                                    <div className="products-slider swiper" data-slider="balkon">
                                        <div className="swiper-wrapper">
                                            <div className="swiper-slide">
                                                <div className="row g-4 swiper-slide-inner">
                                                    <ProductCard
                                                        galleryId="balkon-1"
                                                        images={["assets/img/main-page/we-recomend/recomend-1.png"]}
                                                        thumbs={[{ src: "assets/img/main-page/we-recomend/recomend-1.png" }]}
                                                        title="SLATTUM"
                                                        description="Каркас кровати с обивкой, Vissle темно-серый, 140x200 см"
                                                        price="135"
                                                        salesHit={true}
                                                        promo="-10% промокод IKEYA"
                                                    />
                                                    <ProductCard
                                                        galleryId="balkon-2"
                                                        images={["assets/img/main-page/we-recomend/recomend-2.png"]}
                                                        thumbs={[{ src: "assets/img/main-page/we-recomend/recomend-2.png" }]}
                                                        title="SLATTUM"
                                                        description="Каркас кровати с обивкой, Vissle темно-серый, 140x200 см"
                                                        price="135"
                                                        salesHit={true}
                                                        promo="-10% промокод IKEYA"
                                                    />
                                                    <ProductCard
                                                        galleryId="balkon-3"
                                                        images={["assets/img/main-page/we-recomend/recomend-3.png"]}
                                                        thumbs={[{ src: "assets/img/main-page/we-recomend/recomend-3.png" }]}
                                                        title="SLATTUM"
                                                        description="Каркас кровати с обивкой, Vissle темно-серый, 140x200 см"
                                                        price="135"
                                                        salesHit={true}
                                                        promo="-10% промокод IKEYA"
                                                    />
                                                    <ProductCard
                                                        galleryId="balkon-4"
                                                        images={["assets/img/main-page/we-recomend/recomend-4.png"]}
                                                        thumbs={[{ src: "assets/img/main-page/we-recomend/recomend-4.png" }]}
                                                        title="SLATTUM"
                                                        description="Каркас кровати с обивкой, Vissle темно-серый, 140x200 см"
                                                        price="135"
                                                        salesHit={true}
                                                        promo="-10% промокод IKEYA"
                                                    />
                                                    <ProductCard
                                                        galleryId="balkon-5"
                                                        images={["assets/img/main-page/we-recomend/recomend-5.png"]}
                                                        thumbs={[{ src: "assets/img/main-page/we-recomend/recomend-5.png" }]}
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

                                    <div className="products-slider__nav products-slider__nav-prev" data-slider-nav="balkon">
                                        <svg width="6.67" height="12" viewBox="0 0 7 12" fill="none"
                                            xmlns="http://www.w3.org/2000/svg">
                                            <path d="M6 1L1 6L6 11" stroke="currentColor" strokeWidth="1.5"
                                                strokeLinecap="round" strokeLinejoin="round" />
                                        </svg>
                                    </div>
                                    <div className="products-slider__nav products-slider__nav-next" data-slider-nav="balkon">
                                        <svg width="6.67" height="12" viewBox="0 0 7 12" fill="none"
                                            xmlns="http://www.w3.org/2000/svg">
                                            <path d="M1 11L6 6L1 1" stroke="currentColor" strokeWidth="1.5"
                                                strokeLinecap="round" strokeLinejoin="round" />
                                        </svg>
                                    </div>

                                    <div className="products-slider__pagination" data-slider-pagination="balkon"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
