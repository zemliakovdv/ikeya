// components/home/BlogSlider.js
'use client';

import { useEffect, useMemo, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';

function flattenSlides(slides) {
  return slides.flatMap((slideArticles) => slideArticles || []);
}

function BlogCard({ article, priority = false }) {
  return (
    <Link href={article.link} className="blog-card">
      {article.image ? (
        <Image
          src={article.image}
          alt=""
          width={400}
          height={300}
          priority={priority}
          loading={priority ? undefined : 'lazy'}
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
  );
}

export default function BlogSlider({ slides = [] }) {
  const desktopSliderRef = useRef(null);
  const mobileSliderRef = useRef(null);
  const desktopSwiperRef = useRef(null);
  const mobileSwiperRef = useRef(null);

  const mobileSlides = useMemo(() => flattenSlides(slides), [slides]);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (!desktopSliderRef.current) return;
    if (!slides.length) return;

    let raf1 = 0;
    let raf2 = 0;
    let retryTimer = 0;
    let cancelled = false;

    const init = () => {
      if (cancelled) return;

      if (!window.Swiper) {
        retryTimer = window.setTimeout(init, 100);
        return;
      }

      const sliderEl = desktopSliderRef.current;
      if (!sliderEl) return;

      const wrapper = sliderEl.closest('.blog-slider--desktop');
      if (!wrapper) return;

      const slideCount = sliderEl.querySelectorAll('.swiper-slide').length;
      const prevBtn = wrapper.querySelector('.blog-slider__nav-prev--home');
      const nextBtn = wrapper.querySelector('.blog-slider__nav-next--home');
      const pagination = wrapper.querySelector('.blog-slider__pagination--home');

      if (desktopSwiperRef.current) {
        desktopSwiperRef.current.destroy(true, true);
        desktopSwiperRef.current = null;
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

      desktopSwiperRef.current = new window.Swiper(sliderEl, {
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
      cancelled = true;

      if (retryTimer) window.clearTimeout(retryTimer);
      if (raf1) cancelAnimationFrame(raf1);
      if (raf2) cancelAnimationFrame(raf2);

      if (desktopSwiperRef.current) {
        desktopSwiperRef.current.destroy(true, true);
        desktopSwiperRef.current = null;
      }
    };
  }, [slides]);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (!mobileSliderRef.current) return;
    if (!mobileSlides.length) return;

    let raf1 = 0;
    let raf2 = 0;
    let retryTimer = 0;
    let cancelled = false;

    const init = () => {
      if (cancelled) return;

      if (!window.Swiper) {
        retryTimer = window.setTimeout(init, 100);
        return;
      }

      const sliderEl = mobileSliderRef.current;
      if (!sliderEl) return;

      const wrapper = sliderEl.closest('.blog-slider--mobile');
      if (!wrapper) return;

      const slideCount = sliderEl.querySelectorAll('.swiper-slide').length;
      const pagination = wrapper.querySelector('.blog-slider__pagination--home');

      if (mobileSwiperRef.current) {
        mobileSwiperRef.current.destroy(true, true);
        mobileSwiperRef.current = null;
      }

      if (slideCount < 2) {
        if (pagination) pagination.style.display = 'none';
        return;
      }

      if (pagination) pagination.style.display = '';

      mobileSwiperRef.current = new window.Swiper(sliderEl, {
        slidesPerView: 1.18,
        spaceBetween: 12,
        loop: false,
        speed: 500,
        watchOverflow: true,
        pagination: {
          el: pagination,
          clickable: true,
        },
        breakpoints: {
          320: {
            slidesPerView: 1.18,
            spaceBetween: 12,
          },
          360: {
            slidesPerView: 1.25,
            spaceBetween: 12,
          },
          576: {
            slidesPerView: 2.35,
            spaceBetween: 16,
          },
          768: {
            slidesPerView: 2.65,
            spaceBetween: 16,
          },
        },
      });
    };

    raf1 = requestAnimationFrame(() => {
      raf2 = requestAnimationFrame(init);
    });

    return () => {
      cancelled = true;

      if (retryTimer) window.clearTimeout(retryTimer);
      if (raf1) cancelAnimationFrame(raf1);
      if (raf2) cancelAnimationFrame(raf2);

      if (mobileSwiperRef.current) {
        mobileSwiperRef.current.destroy(true, true);
        mobileSwiperRef.current = null;
      }
    };
  }, [mobileSlides]);

  if (!slides.length) return null;

  return (
    <section className="blog">
      <div className="container">
        <div className="row">
          <div className="col-12">
            <h2>Советы и идеи</h2>

            <div className="blog-slider blog-slider--home blog-slider--desktop">
              <div ref={desktopSliderRef} className="blog-inner blog-inner--home swiper">
                <div className="swiper-wrapper">
                  {slides.map((slideArticles, index) => (
                    <div key={index} className="swiper-slide">
                      <div className="blog-item">
                        {slideArticles.map((article) => (
                          <BlogCard
                            key={article.id}
                            article={article}
                            priority={index === 0}
                          />
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

            <div className="blog-slider blog-slider--home blog-slider--mobile">
              <div ref={mobileSliderRef} className="blog-mobile-inner swiper">
                <div className="swiper-wrapper">
                  {mobileSlides.map((article, index) => (
                    <div key={`${article.id}-${index}`} className="swiper-slide">
                      <BlogCard
                        article={article}
                        priority={index === 0}
                      />
                    </div>
                  ))}
                </div>
              </div>

              {mobileSlides.length > 1 && (
                <div className="blog-slider__pagination blog-slider__pagination--home" />
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}