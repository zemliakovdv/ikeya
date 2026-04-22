// components/home/BlogSlider.js
'use client';

import Link from 'next/link';
import Image from 'next/image';

export default function BlogSlider({ slides }) {
  return (
    <section className="blog">
      <div className="container">
        <div className="row">
          <div className="col-12">
            <h2>Советы и лайфхаки</h2>

            <div className="blog-slider">
              <div className="blog-inner swiper">
                <div className="swiper-wrapper">
                  {slides.map((slideArticles, index) => (
                    <div key={index} className="swiper-slide">
                      <div className="blog-item">
                        {slideArticles.map(article => (
                          <div key={article.id} className="blog-card">
                            {article.image ? (
                              <Image
                                src={article.image}
                                alt={article.title}
                                width={400}
                                height={300}
                                priority={index === 0}
                                loading={index === 0 ? undefined : 'lazy'}
                              />
                            ) : (
                              <div className="blog-card__no-image" />
                            )}
                            <span>{article.category}</span>
                            <h4>{article.title}</h4>
                            <p>{article.excerpt}</p>
                            <Link href={article.link} />
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <button className="blog-slider__nav blog-slider__nav-prev">
                <svg width="7" height="12" viewBox="0 0 7 12" fill="none">
                  <path d="M6 1L1 6L6 11" stroke="#181818" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
              <button className="blog-slider__nav blog-slider__nav-next">
                <svg width="7" height="12" viewBox="0 0 7 12" fill="none">
                  <path d="M1 11L6 6L1 1" stroke="#181818" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
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