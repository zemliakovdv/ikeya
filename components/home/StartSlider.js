'use client';

// components/home/StartSlider.js

import { useEffect, useMemo, useRef, useState } from 'react';
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
  const [isHydrated, setIsHydrated] = useState(false);
  const renderedSlides = useMemo(
    () => (isHydrated ? slides : slides.slice(0, 1)),
    [isHydrated, slides]
  );

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (!sliderRef.current) return;
    if (!renderedSlides.length) return;
    if (!isHydrated && slides.length > 1) return;

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
        loop: false,
        slidesPerView: 1,
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
        breakpoints: {
          320: {
            slidesPerView: 1,
            spaceBetween: 0,
          },
          360: {
            slidesPerView: 1,
            spaceBetween: 0,
          },
          576: {
            slidesPerView: 1,
            spaceBetween: 0,
          },
          768: {
            slidesPerView: 1,
            spaceBetween: 0,
          },
          992: {
            slidesPerView: 1,
            spaceBetween: 0,
          },
          1200: {
            slidesPerView: 1,
            spaceBetween: 0,
          },
          1400: {
            slidesPerView: 1,
            spaceBetween: 0,
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

      if (swiperRef.current) {
        swiperRef.current.destroy(true, true);
        swiperRef.current = null;
      }
    };
  }, [isHydrated, renderedSlides.length, slides.length, type]);

  if (!slides.length) return null;

  return (
    <section className={`start-slider start-slider--${type}`}>
      <div className="container">
        <div className="row">
          <div className="col-12">
            <div className="start-slider-inner">
              <div ref={sliderRef} className="swiper start-slider__swiper">
                <div className="swiper-wrapper">
                  {type === 'single' &&
                    renderedSlides.map((banner, idx) => {
                      const src = getImageUrl(banner);
                      if (!src) return null;
                      const isLcpImage = idx === 0;

                      return (
                        <div className="swiper-slide" key={banner.id || idx}>
                          <Link href={getLinkUrl(banner)}>
                            <Image
                              src={src}
                              alt={`Баннер ${idx + 1}`}
                              width={1500}
                              height={516}
                              sizes="(max-width: 768px) 100vw, 1500px"
                              priority={isLcpImage}
                              loading={isLcpImage ? undefined : 'lazy'}
                              fetchPriority={isLcpImage ? 'high' : undefined}
                              style={{ width: '100%', height: 'auto' }}
                            />
                          </Link>
                        </div>
                      );
                    })}

                  {type === 'triple' &&
                    renderedSlides.map((group, groupIdx) => (
                      <div className="swiper-slide" key={groupIdx}>
                        <div className="triple-banners">
                          {group.map((banner, i) => {
                            const src = getImageUrl(banner);
                            if (!src) return null;
                            const isLcpImage = groupIdx === 0 && i === 0;

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
                                  sizes="(max-width: 768px) 100vw, 572px"
                                  priority={isLcpImage}
                                  loading={isLcpImage ? undefined : 'lazy'}
                                  fetchPriority={isLcpImage ? 'high' : undefined}
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
