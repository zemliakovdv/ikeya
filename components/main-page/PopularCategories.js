'use client';

import { useEffect, useRef } from 'react';

export default function PopularCategories() {
    const swiperRef = useRef(null);

    useEffect(() => {
        const initSwiper = () => {
            if (typeof window !== 'undefined' && window.Swiper) {
                const swiperEl = document.querySelector('.popular-categories-inner');
                const paginationEl = document.querySelector('.popular-categories__pagination');
                const prevEl = document.querySelector('.popular-categories__nav-prev');
                const nextEl = document.querySelector('.popular-categories__nav-next');

                if (swiperEl && window.Swiper && !swiperRef.current) {
                    swiperRef.current = new window.Swiper(swiperEl, {
                        loop: false,
                        slidesPerView: 1,
                        spaceBetween: 0,
                        speed: 600,
                        pagination: {
                            el: paginationEl,
                            clickable: true,
                        },
                        navigation: {
                            nextEl: nextEl,
                            prevEl: prevEl,
                        },
                        on: {
                            init: function () {
                                console.log('PopularCategories инициализирован!');
                            },
                            slideChange: function () {
                                this.update();
                            }
                        }
                    });
                }
            }
        };

        const timeoutId = setTimeout(initSwiper, 100);

        return () => {
            clearTimeout(timeoutId);
            if (swiperRef.current) {
                swiperRef.current.destroy(true, true);
            }
        };
    }, []);

    return (
        <section className="popular-category">
            <div className="container">
                <div className="row">
                    <div className="col-12">
                        <h2>Популярные категории</h2>
                        <div className="popular-categories">
                            <div className="popular-categories-inner swiper">
                                <div className="swiper-wrapper">
                                    {/* Слайд 1 */}
                                    <div className="swiper-slide popular-categories-item">
                                        <div className="categories-item-card">
                                            <div className="categories-card-img">
                                                <img src="/assets/img/main-page/popular-categories/popular-categories-1.png" alt="Популярные категории" />
                                            </div>
                                            <p>Мягкая мебель</p>
                                            <a href="#"></a>
                                        </div>
                                        <div className="categories-item-card">
                                            <div className="categories-card-img">
                                                <img src="/assets/img/main-page/popular-categories/popular-categories-2.png" alt="Популярные категории" />
                                            </div>
                                            <p>Мягкая мебель</p>
                                            <a href="#"></a>
                                        </div>
                                        <div className="categories-item-card">
                                            <div className="categories-card-img">
                                                <img src="/assets/img/main-page/popular-categories/popular-categories-3.png" alt="Популярные категории" />
                                            </div>
                                            <p>Мягкая мебель</p>
                                            <a href="#"></a>
                                        </div>
                                        <div className="categories-item-card">
                                            <div className="categories-card-img">
                                                <img src="/assets/img/main-page/popular-categories/popular-categories-4.png" alt="Популярные категории" />
                                            </div>
                                            <p>Мягкая мебель</p>
                                            <a href="#"></a>
                                        </div>
                                        <div className="categories-item-card">
                                            <div className="categories-card-img">
                                                <img src="/assets/img/main-page/popular-categories/popular-categories-5.png" alt="Популярные категории" />
                                            </div>
                                            <p>Мягкая мебель</p>
                                            <a href="#"></a>
                                        </div>
                                        <div className="categories-item-card">
                                            <div className="categories-card-img">
                                                <img src="/assets/img/main-page/popular-categories/popular-categories-6.png" alt="Популярные категории" />
                                            </div>
                                            <p>Мягкая мебель</p>
                                            <a href="#"></a>
                                        </div>
                                        <div className="categories-item-card">
                                            <div className="categories-card-img">
                                                <img src="/assets/img/main-page/popular-categories/popular-categories-7.png" alt="Популярные категории" />
                                            </div>
                                            <p>Мягкая мебель</p>
                                            <a href="#"></a>
                                        </div>
                                        <div className="categories-item-card">
                                            <div className="categories-card-img">
                                                <img src="/assets/img/main-page/popular-categories/popular-categories-8.png" alt="Популярные категории" />
                                            </div>
                                            <p>Мягкая мебель</p>
                                            <a href="#"></a>
                                        </div>
                                    </div>

                                    {/* Слайд 2 и 3 аналогично */}
                                    <div className="swiper-slide popular-categories-item">
                                        <div className="categories-item-card">
                                            <div className="categories-card-img">
                                                <img src="/assets/img/main-page/popular-categories/popular-categories-1.png" alt="Популярные категории" />
                                            </div>
                                            <p>Мягкая мебель</p>
                                            <a href="#"></a>
                                        </div>
                                        <div className="categories-item-card">
                                            <div className="categories-card-img">
                                                <img src="/assets/img/main-page/popular-categories/popular-categories-2.png" alt="Популярные категории" />
                                            </div>
                                            <p>Мягкая мебель</p>
                                            <a href="#"></a>
                                        </div>
                                        <div className="categories-item-card">
                                            <div className="categories-card-img">
                                                <img src="/assets/img/main-page/popular-categories/popular-categories-3.png" alt="Популярные категории" />
                                            </div>
                                            <p>Мягкая мебель</p>
                                            <a href="#"></a>
                                        </div>
                                        <div className="categories-item-card">
                                            <div className="categories-card-img">
                                                <img src="/assets/img/main-page/popular-categories/popular-categories-4.png" alt="Популярные категории" />
                                            </div>
                                            <p>Мягкая мебель</p>
                                            <a href="#"></a>
                                        </div>
                                        <div className="categories-item-card">
                                            <div className="categories-card-img">
                                                <img src="/assets/img/main-page/popular-categories/popular-categories-5.png" alt="Популярные категории" />
                                            </div>
                                            <p>Мягкая мебель</p>
                                            <a href="#"></a>
                                        </div>
                                        <div className="categories-item-card">
                                            <div className="categories-card-img">
                                                <img src="/assets/img/main-page/popular-categories/popular-categories-6.png" alt="Популярные категории" />
                                            </div>
                                            <p>Мягкая мебель</p>
                                            <a href="#"></a>
                                        </div>
                                        <div className="categories-item-card">
                                            <div className="categories-card-img">
                                                <img src="/assets/img/main-page/popular-categories/popular-categories-7.png" alt="Популярные категории" />
                                            </div>
                                            <p>Мягкая мебель</p>
                                            <a href="#"></a>
                                        </div>
                                        <div className="categories-item-card">
                                            <div className="categories-card-img">
                                                <img src="/assets/img/main-page/popular-categories/popular-categories-8.png" alt="Популярные категории" />
                                            </div>
                                            <p>Мягкая мебель</p>
                                            <a href="#"></a>
                                        </div>
                                    </div>

                                    <div className="swiper-slide popular-categories-item">
                                        <div className="categories-item-card">
                                            <div className="categories-card-img">
                                                <img src="/assets/img/main-page/popular-categories/popular-categories-1.png" alt="Популярные категории" />
                                            </div>
                                            <p>Мягкая мебель</p>
                                            <a href="#"></a>
                                        </div>
                                        <div className="categories-item-card">
                                            <div className="categories-card-img">
                                                <img src="/assets/img/main-page/popular-categories/popular-categories-2.png" alt="Популярные категории" />
                                            </div>
                                            <p>Мягкая мебель</p>
                                            <a href="#"></a>
                                        </div>
                                        <div className="categories-item-card">
                                            <div className="categories-card-img">
                                                <img src="/assets/img/main-page/popular-categories/popular-categories-3.png" alt="Популярные категории" />
                                            </div>
                                            <p>Мягкая мебель</p>
                                            <a href="#"></a>
                                        </div>
                                        <div className="categories-item-card">
                                            <div className="categories-card-img">
                                                <img src="/assets/img/main-page/popular-categories/popular-categories-4.png" alt="Популярные категории" />
                                            </div>
                                            <p>Мягкая мебель</p>
                                            <a href="#"></a>
                                        </div>
                                        <div className="categories-item-card">
                                            <div className="categories-card-img">
                                                <img src="/assets/img/main-page/popular-categories/popular-categories-5.png" alt="Популярные категории" />
                                            </div>
                                            <p>Мягкая мебель</p>
                                            <a href="#"></a>
                                        </div>
                                        <div className="categories-item-card">
                                            <div className="categories-card-img">
                                                <img src="/assets/img/main-page/popular-categories/popular-categories-6.png" alt="Популярные категории" />
                                            </div>
                                            <p>Мягкая мебель</p>
                                            <a href="#"></a>
                                        </div>
                                        <div className="categories-item-card">
                                            <div className="categories-card-img">
                                                <img src="/assets/img/main-page/popular-categories/popular-categories-7.png" alt="Популярные категории" />
                                            </div>
                                            <p>Мягкая мебель</p>
                                            <a href="#"></a>
                                        </div>
                                        <div className="categories-item-card">
                                            <div className="categories-card-img">
                                                <img src="/assets/img/main-page/popular-categories/popular-categories-8.png" alt="Популярные категории" />
                                            </div>
                                            <p>Мягкая мебель</p>
                                            <a href="#"></a>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Навигация */}
                            <div className="popular-categories__nav popular-categories__nav-prev">
                                <svg width="6.67" height="12" viewBox="0 0 7 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M6 1L1 6L6 11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                            </div>
                            <div className="popular-categories__nav popular-categories__nav-next">
                                <svg width="6.67" height="12" viewBox="0 0 7 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M1 11L6 6L1 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                            </div>

                            {/* Пагинация */}
                            <div className="popular-categories__pagination"></div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
