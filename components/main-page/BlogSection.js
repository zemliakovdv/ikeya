'use client';

import { useEffect } from 'react';

const blogSlides = [
  {
    id: 1,
    cards: [
      {
        id: 1,
        img: '/assets/img/main-page/blog/blog-1.png',
        category: 'Гостинная',
        title: 'Как сделать ванную удобнее: 8 «работающих» идей',
        description: 'Точечные вмешательства для видимого результата.',
        link: '#',
      },
      {
        id: 2,
        img: '/assets/img/main-page/blog/blog-1.png',
        category: 'Гостинная',
        title: 'Как сделать ванную удобнее: 8 «работающих» идей',
        description: 'Точечные вмешательства для видимого результата.',
        link: '#',
      },
      {
        id: 3,
        img: '/assets/img/main-page/blog/blog-1.png',
        category: 'Гостинная',
        title: 'Как сделать ванную удобнее: 8 «работающих» идей',
        description: 'Точечные вмешательства для видимого результата.',
        link: '#',
      },
    ],
  },
  {
    id: 2,
    cards: [
      {
        id: 4,
        img: '/assets/img/main-page/blog/blog-2.png',
        category: 'Гостинная',
        title: 'Как сделать ванную удобнее: 8 «работающих» идей',
        description: 'Точечные вмешательства для видимого результата.',
        link: '#',
      },
      {
        id: 5,
        img: '/assets/img/main-page/blog/blog-2.png',
        category: 'Гостинная',
        title: 'Как сделать ванную удобнее: 8 «работающих» идей',
        description: 'Точечные вмешательства для видимого результата.',
        link: '#',
      },
      {
        id: 6,
        img: '/assets/img/main-page/blog/blog-2.png',
        category: 'Гостинная',
        title: 'Как сделать ванную удобнее: 8 «работающих» идей',
        description: 'Точечные вмешательства для видимого результата.',
        link: '#',
      },
    ],
  },
  {
    id: 3,
    cards: [
      {
        id: 7,
        img: '/assets/img/main-page/blog/blog-3.png',
        category: 'Гостинная',
        title: 'Как сделать ванную удобнее: 8 «работающих» идей',
        description: 'Точечные вмешательства для видимого результата.',
        link: '#',
      },
      {
        id: 8,
        img: '/assets/img/main-page/blog/blog-3.png',
        category: 'Гостинная',
        title: 'Как сделать ванную удобнее: 8 «работающих» идей',
        description: 'Точечные вмешательства для видимого результата.',
        link: '#',
      },
      {
        id: 9,
        img: '/assets/img/main-page/blog/blog-3.png',
        category: 'Гостинная',
        title: 'Как сделать ванную удобнее: 8 «работающих» идей',
        description: 'Точечные вмешательства для видимого результата.',
        link: '#',
      },
    ],
  },
];

export default function BlogSection() {
  useEffect(() => {
    // ✅ Задержка 350ms (последняя, самая большая)
    const timer = setTimeout(() => {
      if (typeof window !== 'undefined' && window.Swiper) {
        const blogSwiper = document.querySelector('.blog-inner');
        
        if (blogSwiper) {
          // ✅ Уничтожаем старый экземпляр
          if (blogSwiper.swiper) {
            blogSwiper.swiper.destroy(true, true);
          }

          new window.Swiper(blogSwiper, {
            slidesPerView: 1,
            spaceBetween: 20,
            speed: 500,
            loop: true,
            navigation: {
              nextEl: '.blog-slider__nav-next',
              prevEl: '.blog-slider__nav-prev',
            },
            pagination: {
              el: '.blog-slider__pagination',
              clickable: true,
            },
          });
        }
      }
    }, 350); // ✅ Задержка 350ms

    return () => clearTimeout(timer);
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
                  {blogSlides.map((slide) => (
                    <div key={slide.id} className="swiper-slide">
                      <div className="blog-item">
                        {slide.cards.map((card) => (
                          <div key={card.id} className="blog-card">
                            <img src={card.img} alt="Статья" />
                            <span>{card.category}</span>
                            <h4>{card.title}</h4>
                            <p>{card.description}</p>
                            <a href={card.link}></a>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Навигационные кнопки */}
              <button className="blog-slider__nav blog-slider__nav-prev">
                <svg width="7" height="12" viewBox="0 0 7 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M6 1L1 6L6 11" stroke="#181818" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
              <button className="blog-slider__nav blog-slider__nav-next">
                <svg width="7" height="12" viewBox="0 0 7 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M1 11L6 6L1 1" stroke="#181818" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>

              {/* Пагинация */}
              <div className="blog-slider__pagination"></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
