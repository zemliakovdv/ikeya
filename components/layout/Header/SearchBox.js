'use client'

// components/layout/Header/SearchBox.js
import { useState, useEffect, useRef, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { IMAGES_BASE_URL } from '@/lib/api/ikea'

import { buildApiUrl } from '@/lib/config/api'

const HISTORY_KEY = 'search_history'
const MAX_HISTORY = 6
const MIN_QUERY_LENGTH = 2

const POPULAR_QUERIES = [
  'Системы хранения',
  'Сад и балкон',
  'Шкафы',
  'Настольные лампы',
]

const POPULAR_CATEGORIES = [
  { slug: 'sistemy-khraneniya', name: 'Системы хранения' },
  { slug: 'sad-i-balkon', name: 'Сад и балкон' },
  { slug: 'shkafy', name: 'Шкафы' },
  { slug: 'nastolnye-lampy', name: 'Настольные лампы' },
]

function getHistory() {
  if (typeof window === 'undefined') return []

  try {
    const parsed = JSON.parse(localStorage.getItem(HISTORY_KEY) || '[]')
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

function setHistoryStorage(history) {
  if (typeof window === 'undefined') return

  try {
    localStorage.setItem(HISTORY_KEY, JSON.stringify(history))
  } catch {
    // localStorage может быть недоступен в приватном режиме или при переполнении
  }
}

function saveToHistory(query) {
  const normalized = query?.trim()

  if (!normalized) return

  const history = getHistory().filter((item) => item.toLowerCase() !== normalized.toLowerCase())
  history.unshift(normalized)
  setHistoryStorage(history.slice(0, MAX_HISTORY))
}

function removeFromHistory(query) {
  const history = getHistory().filter((item) => item !== query)
  setHistoryStorage(history)
}

function resolveImageUrl(url) {
  if (!url) return null

  if (url.startsWith('/assets')) {
    return url
  }

  if (url.startsWith('http')) {
    return url.replace(/^https?:\/\/[^/]+/, IMAGES_BASE_URL)
  }

  return `${IMAGES_BASE_URL}${url.startsWith('/') ? url : `/${url}`}`
}

export default function SearchBox() {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState(null)
  const [isOpen, setIsOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [history, setHistory] = useState([])

  const wrapperRef = useRef(null)
  const inputRef = useRef(null)
  const debounceRef = useRef(null)
  const abortRef = useRef(null)

  const router = useRouter()

  useEffect(() => {
    setHistory(getHistory())
  }, [])

  useEffect(() => {
    function onDocClick(e) {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('click', onDocClick)

    return () => {
      document.removeEventListener('click', onDocClick)
    }
  }, [])

  useEffect(() => {
    function onEsc(e) {
      if (e.key === 'Escape') {
        setIsOpen(false)
        inputRef.current?.blur()
      }
    }

    window.addEventListener('keydown', onEsc)

    return () => {
      window.removeEventListener('keydown', onEsc)
    }
  }, [])

  useEffect(() => {
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current)
      abortRef.current?.abort()
    }
  }, [])

  const fetchSuggestions = useCallback(async (value) => {
    const trimmed = value.trim()

    if (trimmed.length < MIN_QUERY_LENGTH) {
      abortRef.current?.abort()
      setResults(null)
      setError('')
      setLoading(false)
      return
    }

    abortRef.current?.abort()

    const controller = new AbortController()
    abortRef.current = controller

    setLoading(true)
    setError('')

    try {
      const res = await fetch(
        buildApiUrl(`/search/autocomplete?q=${encodeURIComponent(trimmed)}`),
        { signal: controller.signal }
      )

      if (!res.ok) throw new Error('Search error')

      const data = await res.json()

      if (controller.signal.aborted) return

      setResults(data)
    } catch (e) {
      if (e.name === 'AbortError') return

      console.error('Search autocomplete error:', e)
      setResults(null)
      setError('Не удалось загрузить подсказки')
    } finally {
      if (!controller.signal.aborted) {
        setLoading(false)
      }
    }
  }, [])

  function handleInputChange(e) {
    const value = e.target.value

    setQuery(value)
    setIsOpen(true)

    if (debounceRef.current) clearTimeout(debounceRef.current)

    debounceRef.current = window.setTimeout(() => {
      fetchSuggestions(value)
    }, 300)
  }

  function handleFocus() {
    setHistory(getHistory())
    setIsOpen(true)
  }

  function handleClear() {
    if (debounceRef.current) clearTimeout(debounceRef.current)
    abortRef.current?.abort()

    setQuery('')
    setResults(null)
    setError('')
    setLoading(false)
    setIsOpen(true)

    inputRef.current?.focus()
  }

  function handleSubmit(e) {
    e.preventDefault()

    const trimmed = query.trim()

    if (!trimmed) return

    saveToHistory(trimmed)
    setHistory(getHistory())
    setIsOpen(false)

    router.push(`/search?q=${encodeURIComponent(trimmed)}`)
  }

  function handleSuggestionClick(suggestion) {
    const value = typeof suggestion === 'string' ? suggestion : suggestion?.query || suggestion?.title || ''
    const trimmed = value.trim()

    if (!trimmed) return

    saveToHistory(trimmed)
    setHistory(getHistory())
    setQuery(trimmed)
    setIsOpen(false)

    router.push(`/search?q=${encodeURIComponent(trimmed)}`)
  }

  function handleRemoveHistory(e, item) {
    e.stopPropagation()
    e.preventDefault()

    removeFromHistory(item)
    setHistory(getHistory())
  }

  function highlight(text, value) {
    if (!value || !text) return text

    const source = String(text)
    const q = value.trim()

    if (!q) return source

    const idx = source.toLowerCase().indexOf(q.toLowerCase())

    if (idx === -1) return source

    return (
      <>
        {source.slice(0, idx)}
        <strong>{source.slice(idx, idx + q.length)}</strong>
        {source.slice(idx + q.length)}
      </>
    )
  }

  function categoryPath(cat) {
    return cat?.url || '#'
  }

  function productPath(product) {
    if (product?.url) return product.url

    const attrs = product.attributes || {}
    const sku = attrs.sku || product.sku || product.id
    const slug = attrs.slug || product.slug

    if (slug && sku) return `/product/${slug}-${sku}/`
    if (sku) return `/product/${sku}/`

    return '#'
  }

  function productImage(product) {
    if (product?.preview_image) return resolveImageUrl(product.preview_image)

    const attrs = product.attributes || {}
    const localImages = Array.isArray(attrs.local_images) ? attrs.local_images : []
    const images = Array.isArray(attrs.images) ? attrs.images : []

    if (localImages.length > 0) return resolveImageUrl(localImages[0])
    if (images.length > 0) return resolveImageUrl(images[0])

    return null
  }

  const trimmedQuery = query.trim()
  const hasQuery = trimmedQuery.length >= MIN_QUERY_LENGTH
  const suggestions = Array.isArray(results?.suggestions) ? results.suggestions : []
  const categories = Array.isArray(results?.categories) ? results.categories : []
  const products = Array.isArray(results?.products) ? results.products : []
  const hasAutocompleteResults = suggestions.length > 0 || categories.length > 0 || products.length > 0

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

        {query.length > 0 && (
          <button
            type="button"
            className="search-clear"
            onClick={handleClear}
            aria-label="Очистить"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <path d="M18 6L6 18M6 6l12 12" stroke="#9e9e9e" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </button>
        )}

        <button type="submit" className="search-but" aria-label="Поиск">
          <img src="/assets/img/icons/header-search.svg" alt="" width="20" height="20" />
        </button>
      </form>

      {isOpen && (
        <div className="search-dropdown">
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
                          <circle cx="12" cy="12" r="9" stroke="#9e9e9e" strokeWidth="1.5" />
                          <path d="M12 7v5l3 3" stroke="#9e9e9e" strokeWidth="1.5" strokeLinecap="round" />
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
                          <path d="M18 6L6 18M6 6l12 12" stroke="#9e9e9e" strokeWidth="1.5" strokeLinecap="round" />
                        </svg>
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {!hasQuery && history.length === 0 && (
            <>
              <div className="search-section">
                <div className="search-section-title">Часто ищут</div>

                <ul className="search-suggestions">
                  {POPULAR_QUERIES.map((item) => (
                    <li key={item}>
                      <button
                        type="button"
                        className="search-suggestion-item"
                        onClick={() => handleSuggestionClick(item)}
                      >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                          <circle cx="11" cy="11" r="7" stroke="#9e9e9e" strokeWidth="1.5" />
                          <path d="M16.5 16.5L21 21" stroke="#9e9e9e" strokeWidth="1.5" strokeLinecap="round" />
                        </svg>

                        <span>{item}</span>
                      </button>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="search-section">
                <div className="search-section-title">Категории</div>

                <ul className="search-categories-list">
                  {POPULAR_CATEGORIES.map((cat) => (
                    <li key={cat.slug}>
                      <Link
                        href={`/catalog/${cat.slug}/`}
                        className="search-category-row"
                        onClick={() => setIsOpen(false)}
                      >
                        <strong>{cat.name}</strong>

                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                          <path d="M9 18l6-6-6-6" stroke="#9e9e9e" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </>
          )}

          {hasQuery && (
            <>
              {suggestions.length > 0 && (
                <div className="search-section">
                  <div className="search-section-title">Подсказки</div>

                  <ul className="search-suggestions">
                    {suggestions.slice(0, 5).map((item, index) => {
                      const suggestionKey = item?.query || item?.title || `suggestion-${index}`
                      const suggestionTitle = item?.title || item?.query || ''

                      return (
                        <li key={suggestionKey}>
                          <button
                            type="button"
                            className="search-suggestion-item"
                            onClick={() => handleSuggestionClick(item)}
                          >
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                              <circle cx="11" cy="11" r="7" stroke="#9e9e9e" strokeWidth="1.5" />
                              <path d="M16.5 16.5L21 21" stroke="#9e9e9e" strokeWidth="1.5" strokeLinecap="round" />
                            </svg>

                            <span>{highlight(suggestionTitle, query)}</span>
                          </button>
                        </li>
                      )
                    })}
                  </ul>
                </div>
              )}

              {categories.length > 0 && (
                <div className="search-section">
                  <div className="search-section-title">Категории</div>

                  <ul className="search-categories-list">
                    {categories.slice(0, 4).map((cat) => (
                      <li key={cat.id || cat.url}>
                        <Link
                          href={categoryPath(cat)}
                          className="search-category-row"
                          onClick={() => setIsOpen(false)}
                        >
                          <span>{highlight(cat.title || '', query)}</span>

                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                            <path d="M9 18l6-6-6-6" stroke="#9e9e9e" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
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
                      const img = productImage(product)
                      const productTitle =
                        product.small_desc_name ||
                        product.title ||
                        product.name_ru ||
                        ''
                      const breadcrumbText = product.category_title || ''

                      return (
                        <li key={product.id || product.sku || product.url}>
                          <Link
                            href={productPath(product)}
                            className="search-product-item"
                            onClick={() => setIsOpen(false)}
                          >
                            <div className="search-product-img">
                              {img ? (
                                <img
                                  src={img}
                                  alt={product.name_ru || productTitle}
                                  width={48}
                                  height={48}
                                  onError={(e) => {
                                    e.currentTarget.style.display = 'none'
                                  }}
                                />
                              ) : (
                                <div className="search-product-img-placeholder" />
                              )}
                            </div>

                            <div className="search-product-info">
                              <div className="search-product-name">
                                {highlight(productTitle, query)}
                              </div>

                              {breadcrumbText && (
                                <div className="search-product-breadcrumb">{breadcrumbText}</div>
                              )}
                            </div>
                          </Link>
                        </li>
                      )
                    })}
                  </ul>
                </div>
              )}

              {loading && <div className="search-loading">Поиск...</div>}

              {!loading && error && (
                <div className="search-empty">{error}</div>
              )}

              {!loading && !error && !hasAutocompleteResults && results !== null && (
                <div className="search-empty">Ничего не найдено</div>
              )}
            </>
          )}
        </div>
      )}
    </div>
  )
}
