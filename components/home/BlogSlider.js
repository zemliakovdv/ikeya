// components/home/BlogSlider.js
'use client';

import { useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';

export default function BlogSlider({ slides = [] }) {
  const sliderRef = useRef(null);
  const swiperRef = useRef(null);

  useEffect(() => {
    if (typeof window === 'undefined' || !window.Swiper) return;
    if (!sliderRef.current) return;
    if (!slides.length) return;

    let raf1 = 0;
    let raf2 = 0;

    const init = () => {
      const sliderEl = sliderRef.current;
      if (!sliderEl) return;

      const wrapper = sliderEl.closest('.blog-slider--home');
      if (!wrapper) return;

      const slideCount = sliderEl.querySelectorAll('.swiper-slide').length;
      const prevBtn = wrapper.querySelector('.blog-slider__nav-prev--home');
      const nextBtn = wrapper.querySelector('.blog-slider__nav-next--home');
      const pagination = wrapper.querySelector('.blog-slider__pagination--home');

      if (swiperRef.current) {
        swiperRef.current.destroy(true, true);
        swiperRef.current = null;
      }

      if (slideCount < 2) {
        if (prevBtn) prevBtn.style.display = 'none';
        if (nextBtn) nextBtn.style.display = 'none';
        if (pagination) pagination.style.display = 'none';
        return;
      }

      if (prevBtn) prevBtn.style.display = '';
      if (nextBtn) nextBtn.style.display = '';
      if (pagination) pagination.style.display = '';

      swiperRef.current = new window.Swiper(sliderEl, {
        slidesPerView: 1,
        spaceBetween: 0,
        loop: slideCount > 1,
        speed: 600,
        watchOverflow: true,
        navigation: {
          nextEl: nextBtn,
          prevEl: prevBtn,
        },
        pagination: {
          el: pagination,
          clickable: true,
        },
      });
    };

    raf1 = requestAnimationFrame(() => {
      raf2 = requestAnimationFrame(init);
    });

    return () => {
      if (raf1) cancelAnimationFrame(raf1);
      if (raf2) cancelAnimationFrame(raf2);

      if (swiperRef.current) {
        swiperRef.current.destroy(true, true);
        swiperRef.current = null;
      }
    };
  }, [slides]);

  if (!slides.length) return null;

  return (
    <section className="blog">
      <div className="container">
        <div className="row">
          <div className="col-12">
            <h2>Советы и лайфхаки</h2>

            <div className="blog-slider blog-slider--home">
              <div ref={sliderRef} className="blog-inner blog-inner--home swiper">
                <div className="swiper-wrapper">
                  {slides.map((slideArticles, index) => (
                    <div key={index} className="swiper-slide">
                      <div className="blog-item">
                        {slideArticles.map((article) => (
                          <Link
                            key={article.id}
                            href={article.link}
                            className="blog-card"
                          >
                            {article.image ? (
                              <Image
                                src={article.image}
                                alt=""
                                width={400}
                                height={300}
                                priority={index === 0}
                                loading={index === 0 ? undefined : 'lazy'}
                                unoptimized
                              />
                            ) : (
                              <div className="blog-card__no-image" />
                            )}

                            {article.category && (
                              <span>{article.category}</span>
                            )}

                            <h4>{article.title}</h4>

                            {article.excerpt && (
                              <p>{article.excerpt}</p>
                            )}
                          </Link>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {slides.length > 1 && (
                <>
                  <button
                    className="blog-slider__nav blog-slider__nav-prev blog-slider__nav-prev--home"
                    type="button"
                    aria-label="Предыдущий слайд"
                  >
                    <svg width="7" height="12" viewBox="0 0 7 12" fill="none">
                      <path
                        d="M6 1L1 6L6 11"
                        stroke="#181818"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </button>

                  <button
                    className="blog-slider__nav blog-slider__nav-next blog-slider__nav-next--home"
                    type="button"
                    aria-label="Следующий слайд"
                  >
                    <svg width="7" height="12" viewBox="0 0 7 12" fill="none">
                      <path
                        d="M1 11L6 6L1 1"
                        stroke="#181818"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </button>

                  <div className="blog-slider__pagination blog-slider__pagination--home" />
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}