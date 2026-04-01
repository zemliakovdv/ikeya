// components/product/RelatedProducts.js
'use client';

import ProductCard from '@/components/catalog/products/ProductCard';

export default function RelatedProducts({ products }) {
  if (!products || products.length === 0) return null;

  return (
    <section className="more">
      <div className="container">
        <div className="row">
          <div className="col-12">
            <div className="more-inner">
              <h2>К этому товару подходят</h2>
              <div className="products-card-slider">
                <div className="products-slider swiper">
                  <div className="swiper-wrapper">
                    {products.map((product) => (
                      <div className="swiper-slide" key={product.id}>
                        <ProductCard product={product} />
                      </div>
                    ))}
                  </div>
                  <div className="products-slider__pagination" />
                  <button className="products-slider__nav products-slider__nav-prev" type="button">
                    <svg width="7" height="12" viewBox="0 0 7 12" fill="none">
                      <path d="M6 1L1 6L6 11" stroke="#181818" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </button>
                  <button className="products-slider__nav products-slider__nav-next" type="button">
                    <svg width="7" height="12" viewBox="0 0 7 12" fill="none">
                      <path d="M1 11L6 6L1 1" stroke="#181818" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}