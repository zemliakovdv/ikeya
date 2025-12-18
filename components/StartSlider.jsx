'use client';

import { useEffect } from 'react';

export default function StartSlider() {
    useEffect(() => {
        // Инициализация Swiper здесь или в main.js
    }, []);

    return (
        <section className="start-slider">
            <div className="container">
                <div className="row">
                    <div className="col-12">
                        <div className="start-slider-inner">
                            <div className="swiper start-slider__swiper">
                                <div className="swiper-wrapper">
                                    <div className="swiper-slide">
                                        <a href="#">
                                            <img src="assets/img/main-page/start-slider/start-slider-banner.jpg"
                                                alt="Слайд"/>
                                        </a>
                                    </div>
                                    <div className="swiper-slide">
                                        <a href="#">
                                            <img src="assets/img/main-page/start-slider/start-slider-banner.jpg"
                                                alt="Слайд"/>
                                        </a>
                                    </div>
                                    <div className="swiper-slide">
                                        <a href="#">
                                            <img src="assets/img/main-page/start-slider/start-slider-banner.jpg"
                                                alt="Слайд"/>
                                        </a>
                                    </div>
                                </div>
                            </div>

                            <div className="start-slider__pagination"></div>

                            <div className="start-slider__nav-prev">
                                <svg width="6.67" height="12" viewBox="0 0 7 12" fill="none"
                                    xmlns="http://www.w3.org/2000/svg">
                                    <path d="M6 1L1 6L6 11" stroke="currentColor" strokeWidth="1.5"
                                        strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                            </div>
                            <div className="start-slider__nav-next">
                                <svg width="6.67" height="12" viewBox="0 0 7 12" fill="none"
                                    xmlns="http://www.w3.org/2000/svg">
                                    <path d="M1 11L6 6L1 1" stroke="currentColor" strokeWidth="1.5"
                                        strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
