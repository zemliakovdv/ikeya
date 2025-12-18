'use client';

import { useEffect } from 'react';

export default function Blog() {
    useEffect(() => {
        // Инициализация Swiper
    }, []);

    return (
        <section className="blog">
            <div className="container">
                <div className="row">
                    <div className="col-12">
                        <h2>Советы и лайфхакти</h2>
                        <div className="blog-slider">
                            <div className="blog-inner swiper">
                                <div className="swiper-wrapper">
                                    <div className="swiper-slide">
                                        <div className="blog-item">
                                            <div className="blog-card">
                                                <img src="assets/img/main-page/blog/blog-1.png" alt="Статья"/>
                                                <span>Гостинная</span>
                                                <h4>Как сделать ванную удобнее: 8 «работающих» идей</h4>
                                                <p>Точечные вмешательства для видимого результата.</p>
                                                <a href="#"></a>
                                            </div>
                                            <div className="blog-card">
                                                <img src="assets/img/main-page/blog/blog-1.png" alt="Статья"/>
                                                <span>Гостинная</span>
                                                <h4>Как сделать ванную удобнее: 8 «работающих» идей</h4>
                                                <p>Точечные вмешательства для видимого результата.</p>
                                                <a href="#"></a>
                                            </div>
                                            <div className="blog-card">
                                                <img src="assets/img/main-page/blog/blog-1.png" alt="Статья"/>
                                                <span>Гостинная</span>
                                                <h4>Как сделать ванную удобнее: 8 «работающих» идей</h4>
                                                <p>Точечные вмешательства для видимого результата.</p>
                                                <a href="#"></a>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="swiper-slide">
                                        <div className="blog-item">
                                            <div className="blog-card">
                                                <img src="assets/img/main-page/blog/blog-2.png" alt="Статья"/>
                                                <span>Гостинная</span>
                                                <h4>Как сделать ванную удобнее: 8 «работающих» идей</h4>
                                                <p>Точечные вмешательства для видимого результата.</p>
                                                <a href="#"></a>
                                            </div>
                                            <div className="blog-card">
                                                <img src="assets/img/main-page/blog/blog-2.png" alt="Статья"/>
                                                <span>Гостинная</span>
                                                <h4>Как сделать ванную удобнее: 8 «работающих» идей</h4>
                                                <p>Точечные вмешательства для видимого результата.</p>
                                                <a href="#"></a>
                                            </div>
                                            <div className="blog-card">
                                                <img src="assets/img/main-page/blog/blog-2.png" alt="Статья"/>
                                                <span>Гостинная</span>
                                                <h4>Как сделать ванную удобнее: 8 «работающих» идей</h4>
                                                <p>Точечные вмешательства для видимого результата.</p>
                                                <a href="#"></a>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="swiper-slide">
                                        <div className="blog-item">
                                            <div className="blog-card">
                                                <img src="assets/img/main-page/blog/blog-3.png" alt="Статья"/>
                                                <span>Гостинная</span>
                                                <h4>Как сделать ванную удобнее: 8 «работающих» идей</h4>
                                                <p>Точечные вмешательства для видимого результата.</p>
                                                <a href="#"></a>
                                            </div>
                                            <div className="blog-card">
                                                <img src="assets/img/main-page/blog/blog-3.png" alt="Статья"/>
                                                <span>Гостинная</span>
                                                <h4>Как сделать ванную удобнее: 8 «работающих» идей</h4>
                                                <p>Точечные вмешательства для видимого результата.</p>
                                                <a href="#"></a>
                                            </div>
                                            <div className="blog-card">
                                                <img src="assets/img/main-page/blog/blog-3.png" alt="Статья"/>
                                                <span>Гостинная</span>
                                                <h4>Как сделать ванную удобнее: 8 «работающих» идей</h4>
                                                <p>Точечные вмешательства для видимого результата.</p>
                                                <a href="#"></a>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <button className="blog-slider__nav blog-slider__nav-prev">
                                <svg width="7" height="12" viewBox="0 0 7 12" fill="none"
                                    xmlns="http://www.w3.org/2000/svg">
                                    <path d="M6 1L1 6L6 11" stroke="#181818" strokeWidth="1.5" strokeLinecap="round"
                                        strokeLinejoin="round" />
                                </svg>
                            </button>
                            <button className="blog-slider__nav blog-slider__nav-next">
                                <svg width="7" height="12" viewBox="0 0 7 12" fill="none"
                                    xmlns="http://www.w3.org/2000/svg">
                                    <path d="M1 11L6 6L1 1" stroke="#181818" strokeWidth="1.5" strokeLinecap="round"
                                        strokeLinejoin="round" />
                                </svg>
                            </button>

                            <div className="blog-slider__pagination"></div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
