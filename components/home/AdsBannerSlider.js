// components/home/AdsBannerSlider.js
'use client';

import { useEffect } from 'react';
import Link from 'next/link';

export default function AdsBannerSlider({ slides }) {
  useEffect(() => {
    if (typeof window === 'undefined' || !window.Swiper) return;

    const swiper = new window.Swiper('.ads-banner-inner', {
      slidesPerView: 1,
      spaceBetween: 0,
      loop: slides.length > 1,
      pagination: {
        el: '.ads-banner-slider__pagination',
        clickable: true,
      },
      navigation: {
        nextEl: '.ads-banner-slider__nav-next',
        prevEl: '.ads-banner-slider__nav-prev',
      },
    });

    return () => swiper?.destroy(true, true);
  }, [slides]);

  return (
    <section className="ads-banner">
      <div className="container">
        <div className="row">
          <div className="col-12">
            <div className="ads-banner-slider">
              <div className="ads-banner-inner swiper">
                <div className="swiper-wrapper">
                  {slides.map((slideBanners, index) => (
                    <div key={index} className="swiper-slide">
                      <div className="ads-banner-item">
                        {slideBanners.map(banner => (
                          <Link key={banner.id} href={banner.link}>
                            <img src={banner.image} alt="Рекламный баннер" />
                          </Link>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <button className="ads-banner-slider__nav ads-banner-slider__nav-prev">
                <svg width="7" height="12" viewBox="0 0 7 12" fill="none">
                  <path d="M6 1L1 6L6 11" stroke="#181818" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
              <button className="ads-banner-slider__nav ads-banner-slider__nav-next">
                <svg width="7" height="12" viewBox="0 0 7 12" fill="none">
                  <path d="M1 11L6 6L1 1" stroke="#181818" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>

              <div className="ads-banner-slider__pagination"></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
