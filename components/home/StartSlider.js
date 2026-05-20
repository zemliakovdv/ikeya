'use client';

// components/home/StartSlider.js

import { useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { IMAGES_BASE_URL } from '@/lib/api/ikea';

function getImageUrl(banner) {
  const url = banner.attributes.image_url;
  if (!url) return null;

  if (url.startsWith('http')) {
    return url.replace(/^https?:\/\/[^/]+/, IMAGES_BASE_URL);
  }

  return `${IMAGES_BASE_URL}${url.startsWith('/') ? url : `/${url}`}`;
}

function getLinkUrl(banner) {
  if (banner.attributes.link_url) return banner.attributes.link_url;

  const categoryId = banner.relationships?.category?.data?.id;
  return categoryId ? `/catalog/${categoryId}` : '#';
}

export default function StartSlider({ slides = [], type = 'single' }) {
  const sliderRef = useRef(null);
  const swiperRef = useRef(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (!sliderRef.current) return;
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

      const sliderEl = sliderRef.current;
      if (!sliderEl) return;

      const wrapper = sliderEl.closest('.start-slider-inner');
      if (!wrapper) return;

      const slideCount = sliderEl.querySelectorAll('.swiper-slide').length;
      const prevBtn = wrapper.querySelector('.start-slider__nav-prev');
      const nextBtn = wrapper.querySelector('.start-slider__nav-next');
      const pagination = wrapper.querySelector('.start-slider__pagination');

      if (swiperRef.current) {
        swiperRef.current.destroy(true, true);
        swiperRef.current = null;
      }

      if (slideCount <= 1) {
        if (prevBtn) prevBtn.style.display = 'none';
        if (nextBtn) nextBtn.style.display = 'none';
        if (pagination) pagination.style.display = 'none';
        return;
      }

      if (prevBtn) prevBtn.style.display = '';
      if (nextBtn) nextBtn.style.display = '';
      if (pagination) pagination.style.display = '';

      swiperRef.current = new window.Swiper(sliderEl, {
        loop: slideCount > 2,
        slidesPerView: 1,
        spaceBetween: 0,
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

      if (swiperRef.current) {
        swiperRef.current.destroy(true, true);
        swiperRef.current = null;
      }
    };
  }, [slides.length, type]);

  if (!slides.length) return null;

  return (
    <section className="start-slider">
      <div className="container">
        <div className="row">
          <div className="col-12">
            <div className="start-slider-inner">
              <div ref={sliderRef} className="swiper start-slider__swiper">
                <div className="swiper-wrapper">
                  {type === 'single' &&
                    slides.map((banner, idx) => {
                      const src = getImageUrl(banner);
                      if (!src) return null;

                      return (
                        <div className="swiper-slide" key={banner.id || idx}>
                          <Link href={getLinkUrl(banner)}>
                            <Image
                              src={src}
                              alt={`Баннер ${idx + 1}`}
                              width={1500}
                              height={516}
                              priority={idx === 0}
                              unoptimized
                              style={{ width: '100%', height: 'auto' }}
                            />
                          </Link>
                        </div>
                      );
                    })}

                  {type === 'triple' &&
                    slides.map((group, groupIdx) => (
                      <div className="swiper-slide" key={groupIdx}>
                        <div className="triple-banners">
                          {group.map((banner, i) => {
                            const src = getImageUrl(banner);
                            if (!src) return null;

                            return (
                              <Link
                                key={banner.id || i}
                                href={getLinkUrl(banner)}
                                className="triple-banner-item"
                              >
                                <Image
                                  src={src}
                                  alt={`Баннер ${groupIdx * 3 + i + 1}`}
                                  width={572}
                                  height={594}
                                  priority={groupIdx === 0}
                                  unoptimized
                                  style={{ width: '100%', height: 'auto' }}
                                />
                              </Link>
                            );
                          })}
                        </div>
                      </div>
                    ))}
                </div>
              </div>

              {slides.length > 1 && (
                <>
                  <div className="start-slider__pagination" />

                  <button
                    className="start-slider__nav-prev"
                    type="button"
                    aria-label="Предыдущий слайд"
                  >
                    <svg width="6.67" height="12" viewBox="0 0 7 12" fill="none">
                      <path
                        d="M6 1L1 6L6 11"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </button>

                  <button
                    className="start-slider__nav-next"
                    type="button"
                    aria-label="Следующий слайд"
                  >
                    <svg width="6.67" height="12" viewBox="0 0 7 12" fill="none">
                      <path
                        d="M1 11L6 6L1 1"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}