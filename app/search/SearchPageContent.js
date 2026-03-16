'use client';

import { useState, useEffect, useRef } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import ProductCard from '@/components/catalog/products/ProductCard';

const API_BASE_URL = 'http://45.135.234.22/api/v1';

export default function SearchPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const q = searchParams.get('q') || '';

  const [query, setQuery] = useState(q);
  const [results, setResults] = useState(null)
  const [loading, setLoading] = useState(false)
  const inputRef = useRef(null)

  // Загружаем результаты при изменении q в URL
  useEffect(() => {
    setQuery(q)
    if (!q.trim()) {
      setResults(null)
      return
    }
    fetchResults(q)
  }, [q])

  async function fetchResults(searchQuery) {
    if (!searchQuery.trim()) return
    setLoading(true)
    try {
      const res = await fetch(
        `${API_BASE_URL}/search/suggest?q=${encodeURIComponent(searchQuery.trim())}`
      )
      if (!res.ok) throw new Error('Search error')
      const data = await res.json()
      setResults(data)
    } catch (e) {
      console.error('Search error:', e)
      setResults(null)
    } finally {
      setLoading(false)
    }
  }

  function handleSubmit(e) {
    e.preventDefault()
    if (!query.trim()) return
    router.push(`/search?q=${encodeURIComponent(query.trim())}`)
  }

  const suggestions = results?.suggestions || []
  const categories = results?.categories?.data || []
  const products = results?.products?.data || []
  const hasResults = categories.length > 0 || products.length > 0

  return (
    <main className="main catalog-inner">
      <section className="all-catalog">
        <div className="container">

          {/* Поисковая строка */}
          <div className="search-page-header">
            <form className="search-page-form" onSubmit={handleSubmit}>
              <input
                ref={inputRef}
                type="search"
                value={query}
                onChange={e => setQuery(e.target.value)}
                placeholder="Поиск по названию, артикулу"
                className="search-page-input"
                autoFocus
              />
              <button type="submit" className="search-page-btn">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="2"/>
                  <path d="M16.5 16.5L21 21" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                </svg>
              </button>
            </form>

            {q && !loading && (
              <p className="search-page-query">
                Результаты поиска по запросу: <strong>«{q}»</strong>
              </p>
            )}
          </div>

          {/* Загрузка */}
          {loading && (
            <div className="search-page-loading">
              <p>Поиск...</p>
            </div>
          )}

          {/* Нет запроса */}
          {!q && !loading && (
            <div className="all-catalog-empty">
              <p>Введите запрос для поиска товаров</p>
            </div>
          )}

          {/* Нет результатов */}
          {q && !loading && results !== null && !hasResults && (
            <div className="all-catalog-empty">
              <p>По запросу «{q}» ничего не найдено</p>
              {suggestions.length > 0 && (
                <div className="search-page-suggestions">
                  <p>Возможно, вы искали:</p>
                  <ul>
                    {suggestions.slice(0, 5).map(s => (
                      <li key={s}>
                        <Link href={`/search?q=${encodeURIComponent(s)}`}>{s}</Link>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}

          {/* Результаты */}
          {!loading && hasResults && (
            <div className="search-page-results">

              {/* Категории */}
              {categories.length > 0 && (
                <div className="search-page-section">
                  <h2 className="search-page-section-title">
                    Категории <span className="search-page-count">{categories.length}</span>
                  </h2>
                  <div className="search-page-categories">
                    {categories.map(cat => (
                      <Link
                        key={cat.id}
                        href={`/catalog/${cat.attributes?.slug || cat.id}/`}
                        className="search-page-category-item"
                      >
                        {cat.attributes?.local_image_path && (
                          <img
                            src={`http://45.135.234.22/${cat.attributes.local_image_path}`}
                            alt={cat.attributes?.translated_name || ''}
                            width={48}
                            height={48}
                          />
                        )}
                        <span>{cat.attributes?.translated_name || cat.attributes?.name}</span>
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {/* Товары */}
              {products.length > 0 && (
                <div className="search-page-section">
                  <h2 className="search-page-section-title">
                    Товары <span className="search-page-count">{products.length}</span>
                  </h2>
                  <div className="row row-cols-2 row-cols-md-3 row-cols-lg-4 row-cols-xl-5 g-3">
                    {products.map(product => (
                      <ProductCard key={product.id} product={product} />
                    ))}
                  </div>
                </div>
              )}

              {/* Подсказки для уточнения */}
              {suggestions.length > 0 && (
                <div className="search-page-section">
                  <h2 className="search-page-section-title">Похожие запросы</h2>
                  <div className="search-page-tags">
                    {suggestions.slice(0, 8).map(s => (
                      <Link
                        key={s}
                        href={`/search?q=${encodeURIComponent(s)}`}
                        className="search-page-tag"
                      >
                        {s}
                      </Link>
                    ))}
                  </div>
                </div>
              )}

            </div>
          )}

        </div>
      </section>
    </main>
  )
}