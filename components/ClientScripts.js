// components/ClientScripts.js
'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

export default function ClientScripts() {
  const pathname = usePathname();

  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Ждём загрузки Swiper
    const initScripts = () => {
      if (!window.Swiper) {
        setTimeout(initScripts, 100);
        return;
      }

      function updateNavButtons(swiper, btnPrev, btnNext) {
        if (!btnPrev || !btnNext) return;

        if (swiper.isBeginning) {
          btnPrev.style.display = 'none';
        } else {
          btnPrev.style.display = '';
        }

        if (swiper.isEnd) {
          btnNext.style.display = 'none';
        } else {
          btnNext.style.display = '';
        }
      }

      // ========== СТАРТОВЫЙ СЛАЙДЕР ==========
      function initStartSlider() {
        const sliderEl = document.querySelector('.start-slider__swiper');
        if (!sliderEl) return;

        const slideCount = sliderEl.querySelectorAll('.swiper-slide').length;

        new Swiper('.start-slider__swiper', {
          loop: slideCount > 2,
          slidesPerView: 1,
          spaceBetween: 0,
          speed: 600,
          navigation: {
            nextEl: '.start-slider__nav-next',
            prevEl: '.start-slider__nav-prev',
          },
          pagination: {
            el: '.start-slider__pagination',
            clickable: true,
          },
        });
      }

      // ========== СЛАЙДЕР РЕКЛАМНЫХ БАННЕРОВ ==========
      function initAdsBannerSlider() {
        const sliderEl = document.querySelector('.ads-banner-inner');
        if (!sliderEl) return;

        const slideCount = sliderEl.querySelectorAll('.swiper-slide').length;

        const adsBannerSlider = new Swiper('.ads-banner-inner', {
          slidesPerView: 1,
          spaceBetween: 20,
          loop: slideCount > 2,
          speed: 600,
          watchOverflow: true,

          navigation: {
            nextEl: '.ads-banner-slider__nav-next',
            prevEl: '.ads-banner-slider__nav-prev',
          },

          pagination: {
            el: '.ads-banner-slider__pagination',
            clickable: true,
          }
        });
      }

      // ========== СЛАЙДЕР БЛОГА ==========
      function initBlogSlider() {
        const sliderEl = document.querySelector('.blog-inner');
        if (!sliderEl) return;

        const slideCount = sliderEl.querySelectorAll('.swiper-slide').length;
        const prevBtn = document.querySelector('.blog-slider__nav-prev');
        const nextBtn = document.querySelector('.blog-slider__nav-next');

        // Скрываем стрелки если слайдов меньше 2
        if (slideCount < 2) {
          if (prevBtn) prevBtn.style.display = 'none';
          if (nextBtn) nextBtn.style.display = 'none';
          return;
        }

        const blogSlider = new Swiper('.blog-inner', {
          slidesPerView: 1,
          spaceBetween: 0,
          loop: slideCount > 1,
          speed: 600,
          watchOverflow: true,

          navigation: {
            nextEl: '.blog-slider__nav-next',
            prevEl: '.blog-slider__nav-prev',
          },

          pagination: {
            el: '.blog-slider__pagination',
            clickable: true,
          },

          on: {
            init: function () {
              updateNavButtons(this, prevBtn, nextBtn);
            },
            slideChange: function () {
              updateNavButtons(this, prevBtn, nextBtn);
            }
          }
        });
      }

      // ========== СЛАЙДЕР КАТЕГОРИЙ ГЛАВНОЙ ==========
      function initHomeCategoriesSlider() {
        const sliderEl = document.querySelector('.home-categories-inner');
        if (!sliderEl) return;

        const slideCount = sliderEl.querySelectorAll('.swiper-slide').length;
        const prevBtn = document.querySelector('.popular-categories__nav-prev');
        const nextBtn = document.querySelector('.popular-categories__nav-next');

        if (slideCount <= 1) {
          if (prevBtn) prevBtn.style.display = 'none';
          if (nextBtn) nextBtn.style.display = 'none';
          return;
        }

        new Swiper('.home-categories-inner', {
          loop: slideCount > 1,
          slidesPerView: 1,
          spaceBetween: 0,
          speed: 600,
          navigation: {
            nextEl: '.popular-categories__nav-next',
            prevEl: '.popular-categories__nav-prev',
          },
          pagination: {
            el: '.popular-categories__pagination',
            clickable: true,
            dynamicBullets: true,
            dynamicMainBullets: 3,
          },
        });
      }

      // ========== СЛАЙДЕР КАТЕГОРИЙ СТРАНИЦЫ О НАС ==========
      function initAboutCategoriesSlider() {
        const sliderEl = document.querySelector('.about-categories-inner');
        if (!sliderEl) return;

        const slideCount = sliderEl.querySelectorAll('.swiper-slide').length;

        if (slideCount <= 1) return;

        new Swiper('.about-categories-inner', {
          loop: slideCount > 1,
          slidesPerView: 1,
          spaceBetween: 0,
          speed: 600,
          navigation: {
            nextEl: '.popular-categories__nav-next',
            prevEl: '.popular-categories__nav-prev',
          },
          pagination: {
            el: '.popular-categories__pagination',
            clickable: true,
            dynamicBullets: true,
            dynamicMainBullets: 3,
          },
        });
      }

      // ========== ВЫЗОВ ВСЕХ ФУНКЦИЙ ==========
      initStartSlider();
      initHomeCategoriesSlider();
      initAboutCategoriesSlider();
      initAdsBannerSlider();
      initBlogSlider();
    };

    initScripts();
  }, [pathname]);

  return null;
}