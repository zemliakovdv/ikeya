'use client'

// components/layout/Header/SearchBox.js
import { useState, useEffect, useRef, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { IMAGES_BASE_URL } from '@/lib/api/ikea'

const API_BASE_URL = 'http://45.135.234.22/api/v1'
const HISTORY_KEY = 'search_history'
const MAX_HISTORY = 6

const POPULAR_QUERIES = [
  'Системы хранения',
  'Сад и балкон',
  'Шкафы',
  'Настольные лампы',
]

function getHistory() {
  if (typeof window === 'undefined') return []
  try {
    return JSON.parse(localStorage.getItem(HISTORY_KEY) || '[]')
  } catch {
    return []
  }
}

function saveToHistory(query) {
  if (!query?.trim()) return
  const history = getHistory().filter((h) => h.toLowerCase() !== query.toLowerCase())
  history.unshift(query.trim())
  localStorage.setItem(HISTORY_KEY, JSON.stringify(history.slice(0, MAX_HISTORY)))
}

function removeFromHistory(query) {
  const history = getHistory().filter((h) => h !== query)
  localStorage.setItem(HISTORY_KEY, JSON.stringify(history))
}

export default function SearchBox() {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState(null)
  const [isOpen, setIsOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [history, setHistory] = useState([])
  const [popularCategories, setPopularCategories] = useState([])
  const wrapperRef = useRef(null)
  const inputRef = useRef(null)
  const debounceRef = useRef(null)
  const router = useRouter()

  useEffect(() => {
    setHistory(getHistory())
  }, [])

  useEffect(() => {
    async function loadPopular() {
      try {
        const res = await fetch(`${API_BASE_URL}/search/suggest?q=диван`)
        if (!res.ok) return
        const data = await res.json()
        setPopularCategories((data?.categories?.data || []).slice(0, 4))
      } catch {
        // тихо игнорируем
      }
    }
    loadPopular()
  }, [])

  useEffect(() => {
    function onDocClick(e) {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('click', onDocClick)
    return () => document.removeEventListener('click', onDocClick)
  }, [])

  useEffect(() => {
    function onEsc(e) {
      if (e.key === 'Escape') {
        setIsOpen(false)
        inputRef.current?.blur()
      }
    }
    window.addEventListener('keydown', onEsc)
    return () => window.removeEventListener('keydown', onEsc)
  }, [])

  const fetchSuggestions = useCallback(async (q) => {
    if (!q || q.trim().length < 2) {
      setResults(null)
      setLoading(false)
      return
    }
    setLoading(true)
    try {
      const res = await fetch(`${API_BASE_URL}/search/suggest?q=${encodeURIComponent(q.trim())}`)
      if (!res.ok) throw new Error('Search error')
      const data = await res.json()
      setResults(data)
    } catch (e) {
      console.error('Search suggest error:', e)
      setResults(null)
    } finally {
      setLoading(false)
    }
  }, [])

  function handleInputChange(e) {
    const val = e.target.value
    setQuery(val)
    setIsOpen(true)
    clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(() => fetchSuggestions(val), 300)
  }

  function handleFocus() {
    setHistory(getHistory())
    setIsOpen(true)
  }

  function handleClear() {
    setQuery('')
    setResults(null)
    inputRef.current?.focus()
  }

  function handleSubmit(e) {
    e.preventDefault()
    if (!query.trim()) return
    saveToHistory(query.trim())
    setHistory(getHistory())
    setIsOpen(false)
    router.push(`/search?q=${encodeURIComponent(query.trim())}`)
  }

  function handleSuggestionClick(suggestion) {
    setQuery(suggestion)
    saveToHistory(suggestion)
    setHistory(getHistory())
    setIsOpen(false)
    router.push(`/search?q=${encodeURIComponent(suggestion)}`)
  }

  function handleRemoveHistory(e, item) {
    e.stopPropagation()
    e.preventDefault()
    removeFromHistory(item)
    setHistory(getHistory())
  }

  function highlight(text, q) {
    if (!q || !text) return text
    const idx = text.toLowerCase().indexOf(q.toLowerCase())
    if (idx === -1) return text
    return (
      <>
        {text.slice(0, idx)}
        <strong>{text.slice(idx, idx + q.length)}</strong>
        {text.slice(idx + q.length)}
      </>
    )
  }

  function formatPrice(price) {
    if (!price) return ''
    return (price / 100).toLocaleString('ru-RU', {
      style: 'currency',
      currency: 'BYN',
      minimumFractionDigits: 2,
    })
  }

  function categoryPath(cat) {
    return `/catalog/${cat.attributes?.slug || cat.id}/`
  }

  function productPath(product) {
    const breadcrumbs = product.attributes?.breadcrumbs || []
    if (breadcrumbs.length > 0 && breadcrumbs[breadcrumbs.length - 1]?.url) {
      return breadcrumbs[breadcrumbs.length - 1].url
    }
    return `/product/${product.attributes?.sku || product.id}/`
  }

  function productImage(product) {
    const attrs = product.attributes || {}
    const localImages = attrs.local_images || []
    const images = attrs.images || []
    if (localImages.length > 0) return `${IMAGES_BASE_URL}/${localImages[0]}`
    if (images.length > 0) return images[0]
    return null
  }

  const hasQuery = query.trim().length >= 2
  const suggestions = results?.suggestions || []
  const categories = results?.categories?.data || []
  const products = results?.products?.data || []

  return (
    <div className="header-middle-search search-box" ref={wrapperRef}>
      <form className="middle-searh-inner" onSubmit={handleSubmit} autoComplete="off">
        <input
          ref={inputRef}
          type="search"
          placeholder="Поиск по названию, артикулу"
          id="search-form"
          value={query}
          onChange={handleInputChange}
          onFocus={handleFocus}
          autoComplete="off"
        />
        {query ? (
          <button type="button" className="search-but" onClick={handleClear} aria-label="Очистить">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </button>
        ) : (
          <button type="submit" className="search-but">
            <img src="/assets/img/icons/header-search.svg" alt="Поиск" />
          </button>
        )}
      </form>

      {isOpen && (
        <div className="search-dropdown">

          {/* Поле пустое — история поиска */}
          {!hasQuery && history.length > 0 && (
            <div className="search-section">
              <div className="search-section-title">Вы искали</div>
              <ul className="search-suggestions">
                {history.map((item) => (
                  <li key={item}>
                    <div className="search-suggestion-item search-suggestion-history">
                      <button
                        type="button"
                        className="search-suggestion-main"
                        onClick={() => handleSuggestionClick(item)}
                      >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                          <circle cx="12" cy="12" r="9" stroke="#9e9e9e" strokeWidth="1.5"/>
                          <path d="M12 7v5l3 3" stroke="#9e9e9e" strokeWidth="1.5" strokeLinecap="round"/>
                        </svg>
                        <span>{item}</span>
                      </button>
                      <button
                        type="button"
                        className="search-history-remove"
                        onClick={(e) => handleRemoveHistory(e, item)}
                        aria-label="Удалить"
                      >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                          <path d="M18 6L6 18M6 6l12 12" stroke="#9e9e9e" strokeWidth="1.5" strokeLinecap="round"/>
                        </svg>
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Поле пустое — нет истории: часто ищут + категории */}
          {!hasQuery && history.length === 0 && (
            <>
              <div className="search-section">
                <div className="search-section-title">Часто ищут</div>
                <ul className="search-suggestions">
                  {POPULAR_QUERIES.map((s) => (
                    <li key={s}>
                      <button
                        type="button"
                        className="search-suggestion-item"
                        onClick={() => handleSuggestionClick(s)}
                      >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                          <circle cx="11" cy="11" r="7" stroke="#9e9e9e" strokeWidth="1.5"/>
                          <path d="M16.5 16.5L21 21" stroke="#9e9e9e" strokeWidth="1.5" strokeLinecap="round"/>
                        </svg>
                        <span>{s}</span>
                      </button>
                    </li>
                  ))}
                </ul>
              </div>

              {popularCategories.length > 0 && (
                <div className="search-section">
                  <div className="search-section-title">Категории</div>
                  <ul className="search-categories-list">
                    {popularCategories.map((cat) => (
                      <li key={cat.id}>
                        <Link
                          href={categoryPath(cat)}
                          className="search-category-row"
                          onClick={() => setIsOpen(false)}
                        >
                          <strong>{cat.attributes?.translated_name || cat.attributes?.name}</strong>
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                            <path d="M9 18l6-6-6-6" stroke="#9e9e9e" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </>
          )}

          {/* Есть запрос — результаты поиска */}
          {hasQuery && (
            <>
              {suggestions.length > 0 && (
                <ul className="search-suggestions">
                  {suggestions.slice(0, 5).map((s) => (
                    <li key={s}>
                      <button
                        type="button"
                        className="search-suggestion-item"
                        onClick={() => handleSuggestionClick(s)}
                      >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                          <circle cx="11" cy="11" r="7" stroke="#9e9e9e" strokeWidth="1.5"/>
                          <path d="M16.5 16.5L21 21" stroke="#9e9e9e" strokeWidth="1.5" strokeLinecap="round"/>
                        </svg>
                        <span>{highlight(s, query)}</span>
                      </button>
                    </li>
                  ))}
                </ul>
              )}

              {categories.length > 0 && (
                <div className="search-section">
                  <div className="search-section-title">Категории</div>
                  <ul className="search-categories-list">
                    {categories.slice(0, 4).map((cat) => (
                      <li key={cat.id}>
                        <Link
                          href={categoryPath(cat)}
                          className="search-category-row"
                          onClick={() => setIsOpen(false)}
                        >
                          <strong>{highlight(cat.attributes?.translated_name || cat.attributes?.name || '', query)}</strong>
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                            <path d="M9 18l6-6-6-6" stroke="#9e9e9e" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {products.length > 0 && (
                <div className="search-section">
                  <div className="search-section-title">Товары</div>
                  <ul className="search-products">
                    {products.slice(0, 4).map((product) => {
                      const attrs = product.attributes || {}
                      const img = productImage(product)
                      const breadcrumbs = attrs.breadcrumbs || []
                      const breadcrumbText = breadcrumbs.map((b) => b.title).join(' / ')
                      return (
                        <li key={product.id}>
                          <Link
                            href={productPath(product)}
                            className="search-product-item"
                            onClick={() => setIsOpen(false)}
                          >
                            <div className="search-product-img">
                              {img ? (
                                <img src={img} alt={attrs.name || ''} width={48} height={48} />
                              ) : (
                                <div className="search-product-img-placeholder" />
                              )}
                            </div>
                            <div className="search-product-info">
                              <div className="search-product-name">
                                {highlight(attrs.name_ru || attrs.name || '', query)}
                              </div>
                              {breadcrumbText && (
                                <div className="search-product-breadcrumb">{breadcrumbText}</div>
                              )}
                            </div>
                            {attrs.price > 0 && (
                              <div className="search-product-price">{formatPrice(attrs.price)}</div>
                            )}
                          </Link>
                        </li>
                      )
                    })}
                  </ul>
                </div>
              )}

              {loading && <div className="search-loading">Поиск...</div>}

              {!loading && suggestions.length === 0 && categories.length === 0 && products.length === 0 && results !== null && (
                <div className="search-empty">Ничего не найдено по запросу «{query}»</div>
              )}
            </>
          )}
        </div>
      )}
    </div>
  )
}