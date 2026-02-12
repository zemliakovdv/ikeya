'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

const API_BASE_URL = 'http://45.135.234.22/api/v1';

export default function AdvicesTab({ product }) {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchArticles() {
      try {
        // Запрашиваем статьи Tips & Ideas
        const response = await fetch(`${API_BASE_URL}/content/articles?content_type=tips_ideas&per_page=6`);
        const data = await response.json();
        
        setArticles(data.data || []);
      } catch (error) {
        console.error('Error fetching articles:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchArticles();
  }, []);

  if (loading) {
    return (
      <div className="tab-pane fade show active">
        <div className="tab-advices__content">
          <h5>Полезные советы</h5>
          <p>Загрузка...</p>
        </div>
      </div>
    );
  }

  if (articles.length === 0) {
    return (
      <div className="tab-pane fade show active">
        <div className="tab-advices__content">
          <h5>Полезные советы</h5>
          <p>Советы и рекомендации скоро появятся.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="tab-pane fade show active">
      <div className="tab-advices__content">
        <h5>Полезные советы</h5>
        
        <div className="advices-content__grid">
          {articles.map((article) => {
            const attr = article.attributes;
            
            // Берём изображение из tile_blocks или первого linked_product
            let imageUrl = '/assets/img/catalog-card/place-hold.png';
            
            if (attr.tile_blocks && attr.tile_blocks.length > 0) {
              const firstBlock = attr.tile_blocks[0];
              if (firstBlock.image_url) {
                imageUrl = firstBlock.image_url;
              }
            } else if (attr.linked_products && attr.linked_products.length > 0) {
              const firstProduct = attr.linked_products[0];
              if (firstProduct.local_images && firstProduct.local_images.length > 0) {
                imageUrl = firstProduct.local_images[0];
              }
            }

            return (
              <Link 
                key={article.id} 
                href={`/blog/${attr.slug}`}
                className="advice-card"
              >
                <div className="advice-card__image">
                  <img src={imageUrl} alt={attr.title} />
                </div>
                <div className="advice-card__info">
                  <h6>{attr.title}</h6>
                  {attr.excerpt && (
                    <p className="advice-card__excerpt">{attr.excerpt}</p>
                  )}
                  {attr.tags && attr.tags.length > 0 && (
                    <div className="advice-card__tags">
                      {attr.tags.slice(0, 3).map((tag, index) => (
                        <span key={index} className="tag">{tag}</span>
                      ))}
                    </div>
                  )}
                </div>
              </Link>
            );
          })}
        </div>

        {/* Ссылка на все советы */}
        <div className="advices-content__more" style={{ marginTop: '24px', textAlign: 'center' }}>
          <Link href="/blog?type=tips_ideas" className="btn btn-primary">
            Смотреть все советы
          </Link>
        </div>
      </div>
    </div>
  );
}
