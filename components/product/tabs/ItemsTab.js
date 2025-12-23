'use client';

import { useEffect, useRef } from 'react';

export default function ItemsTab({ items }) {
  const swiperRef = useRef(null);

  useEffect(() => {
    if (typeof window !== 'undefined' && window.Swiper) {
      const swiper = new window.Swiper(swiperRef.current, {
        slidesPerView: 4,
        spaceBetween: 20,
        navigation: {
          nextEl: '.predmety-content__slider .predmety-slider__nav-next',
          prevEl: '.predmety-content__slider .predmety-slider__nav-prev',
        },
        pagination: {
          el: '.predmety-content__slider .predmety-slider__pagination',
          clickable: true,
        },
      });

      return () => {
        if (swiper) swiper.destroy();
      };
    }
  }, []);

  return (
    <div className="tab-predmety__content">
      <div className="predmety-content__slider swiper" ref={swiperRef}>
        <div className="swiper-wrapper">
          {items.map((item, index) => (
            <div key={index} className="swiper-slide predmety-slider__card">
              <img src={item.image} alt={item.title} />
              {item.badge && <span className="sales-hit pink">{item.badge}</span>}
              <button className="like">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <path d="M12 20.6106C11.34 20.6106 10.67 20.4006 10.1 19.9706C7.66 18.1506 2 13.4306 2 8.92062C2 5.82062 4.35 3.39062 7.35 3.39062C9.01 3.39062 10.43 4.01062 12 5.45062C13.57 4.01062 14.99 3.39062 16.65 3.39062C19.65 3.39062 22 5.82062 22 8.92062C22 13.4206 16.33 18.1406 13.9 19.9706C13.33 20.3906 12.67 20.6106 12 20.6106ZM7.35 4.79062C5.1 4.79062 3.4 6.57062 3.4 8.92062C3.4 12.9006 9.17 17.5206 10.94 18.8506C11.57 19.3206 12.43 19.3206 13.06 18.8506C14.83 17.5306 20.6 12.9006 20.6 8.92062C20.6 6.56062 18.9 4.79062 16.65 4.79062C15.59 4.79062 14.36 5.05062 12.49 6.91062C12.22 7.18062 11.78 7.18062 11.5 6.91062C9.64 5.05062 8.4 4.79062 7.34 4.79062H7.35Z" fill="#181818" />
                </svg>
              </button>
              <p className="predmety-card__title">{item.title}</p>
              <span>{item.description}</span>
            </div>
          ))}
        </div>

        <div className="predmety-slider__pagination"></div>
        <button className="predmety-slider__nav predmety-slider__nav-prev">
          <svg width="7" height="12" viewBox="0 0 7 12" fill="none">
            <path d="M6 1L1 6L6 11" stroke="#181818" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
        <button className="predmety-slider__nav predmety-slider__nav-next">
          <svg width="7" height="12" viewBox="0 0 7 12" fill="none">
            <path d="M1 11L6 6L1 1" stroke="#181818" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      </div>
    </div>
  );
}
