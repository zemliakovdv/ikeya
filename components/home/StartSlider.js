'use client';

// components/home/StartSlider.js

import { useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { IMAGES_BASE_URL } from '@/lib/api/ikea';

function getImageUrl(banner) {
  const url = banner.attributes.image_url;
  if (!url) return null;
  return url.startsWith('http') ? url : `${IMAGES_BASE_URL}${url}`;
}

function getLinkUrl(banner) {
  if (banner.attributes.link_url) return banner.attributes.link_url;
  const categoryId = banner.relationships?.category?.data?.id;
  return categoryId ? `/catalog/${categoryId}` : '#';
}

/**
 * Props:
 *  - slides  {Array}   — для single: массив баннеров
 *                      — для triple: массив групп по 3
 *  - type    {string}  — 'single' | 'triple'
 */
export default function StartSlider({ slides = [], type = 'single' }) {
  useEffect(() => {
    if (!slides.length || typeof window === 'undefined') return;

    // Swiper доступен глобально через CDN
    const initSwiper = () => {
      if (!window.Swiper) return;
      new window.Swiper('.start-slider__swiper', {
        slidesPerView: 1,
        spaceBetween: 0,
        loop: true,
        pagination: {
          el: '.start-slider__pagination',
          clickable: true,
        },
        navigation: {
          nextEl: '.start-slider__nav-next',
          prevEl: '.start-slider__nav-prev',
        },
      });
    };

    // Если Swiper уже загружен — инициализируем сразу
    if (window.Swiper) {
      initSwiper();
    } else {
      // Иначе ждём загрузки скрипта
      window.addEventListener('swiper-ready', initSwiper, { once: true });
      return () => window.removeEventListener('swiper-ready', initSwiper);
    }
  }, [slides]);

  if (!slides.length) return null;

  return (
    <section className="start-slider">
      <div className="container">
        <div className="row">
          <div className="col-12">
            <div className="start-slider-inner">
              <div className="swiper start-slider__swiper">
                <div className="swiper-wrapper">

                  {type === 'single' && slides.map((banner, idx) => {
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
                            style={{ width: '100%', height: 'auto' }}
                          />
                        </Link>
                      </div>
                    );
                  })}

                  {type === 'triple' && slides.map((group, groupIdx) => (
                    <div className="swiper-slide" key={groupIdx}>
                      <div className="triple-banners">
                        {group.map((banner, i) => {
                          const src = getImageUrl(banner);
                          if (!src) return null;
                          return (
                            <Link key={banner.id || i} href={getLinkUrl(banner)} className="triple-banner-item">
                              <Image
                                src={src}
                                alt={`Баннер ${groupIdx * 3 + i + 1}`}
                                width={572}
                                height={594}
                                priority={groupIdx === 0}
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

              <div className="start-slider__pagination" />

              <div className="start-slider__nav-prev">
                <svg width="6.67" height="12" viewBox="0 0 7 12" fill="none">
                  <path d="M6 1L1 6L6 11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <div className="start-slider__nav-next">
                <svg width="6.67" height="12" viewBox="0 0 7 12" fill="none">
                  <path d="M1 11L6 6L1 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}