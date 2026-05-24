'use client'

// components/layout/Header/MegaMenu.js
import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { IMAGES_BASE_URL } from '@/lib/api/ikea'

import { buildApiUrl } from '@/lib/config/api'

// Модульный кеш — живёт пока открыта вкладка браузера
let _cachedTree = null

function getCategoryName(cat) {
  const attrs = cat?.attributes || {}
  return attrs.translated_name || attrs.name || 'Категория'
}

function getCategorySlug(cat) {
  return cat?.attributes?.slug || cat?.id || ''
}

function buildPath(cat, ancestorSlugs = []) {
  const slug = getCategorySlug(cat)
  const pathParts = [...ancestorSlugs, slug].filter(Boolean)

  return `/catalog/${pathParts.join('/')}/`
}

function resolveIcon(url) {
  if (!url) return null

  if (url.startsWith('/assets')) {
    return url
  }

  if (url.startsWith('http')) {
    return url.replace(/^https?:\/\/[^/]+/, IMAGES_BASE_URL)
  }

  return `${IMAGES_BASE_URL}${url.startsWith('/') ? url : `/${url}`}`
}

export default function MegaMenu({ isOpen, onClose }) {
  const [tree, setTree] = useState([])
  const [activeRootId, setActiveRootId] = useState(null)
  const [hasLoaded, setHasLoaded] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const menuRef = useRef(null)

  // Загружаем дерево категорий только при первом открытии меню
  useEffect(() => {
    if (!isOpen || hasLoaded) return

    if (_cachedTree) {
      setTree(_cachedTree)
      setHasLoaded(true)
      setIsLoading(false)
      return
    }

    const controller = new AbortController()

    async function load() {
      setIsLoading(true)

      try {
        const res = await fetch(buildApiUrl('/categories/tree'), {
          cache: 'no-store',
          signal: controller.signal,
        })

        if (!res.ok) throw new Error(`API Error: ${res.status}`)

        const data = await res.json()
        const roots = data.data || []

        _cachedTree = roots
        setTree(roots)
        setHasLoaded(true)
      } catch (e) {
        if (e.name !== 'AbortError') {
          console.error('MegaMenu: ошибка загрузки категорий', e)
        }
      } finally {
        if (!controller.signal.aborted) {
          setIsLoading(false)
        }
      }
    }

    load()

    return () => {
      controller.abort()
    }
  }, [isOpen, hasLoaded])

  // Закрытие по клику вне меню
  useEffect(() => {
    if (!isOpen) return

    function onDocClick(e) {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        onClose()
      }
    }

    function onEsc(e) {
      if (e.key === 'Escape') onClose()
    }

    document.addEventListener('click', onDocClick)
    window.addEventListener('keydown', onEsc)

    return () => {
      document.removeEventListener('click', onDocClick)
      window.removeEventListener('keydown', onEsc)
    }
  }, [isOpen, onClose])

  // Сбрасываем активную категорию при закрытии
  useEffect(() => {
    if (!isOpen) setActiveRootId(null)
  }, [isOpen])

  // Блокируем скролл страницы при открытом меню
  useEffect(() => {
    if (!isOpen) return

    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    return () => {
      document.body.style.overflow = previousOverflow
    }
  }, [isOpen])

  if (!isOpen) return null

  const activeRoot = activeRootId
    ? tree.find((cat) => cat.id === activeRootId) || tree[0]
    : tree[0]

  const sections = activeRoot?.children || []
  const rootSlug = getCategorySlug(activeRoot)

  const MAX_VISIBLE = 5
  const showLoader = isLoading && tree.length === 0

  const rootCategories = tree.map((cat) => {
    const attrs = cat.attributes || {}
    const iconUrl = resolveIcon(
      attrs.icon_url ||
      attrs.pictogram_url ||
      attrs.background_image_url ||
      attrs.local_image_path ||
      attrs.remote_image_url
    )

    return {
      id: cat.id,
      title: getCategoryName(cat),
      href: buildPath(cat),
      iconUrl,
    }
  })

  return (
    <div className="mega-menu-overlay" ref={menuRef}>
      <div className="container-menu">

        {showLoader ? (
          <div className="mega-menu-loader" role="status" aria-live="polite" aria-label="Загрузка каталога">
            <div className="page-loader__spinner" />
          </div>
        ) : (
          <>
            <div className="mega-menu-mobile-grid">
              {rootCategories.map((cat) => (
                <Link
                  key={cat.id}
                  href={cat.href}
                  className="mega-menu-mobile-card"
                  onClick={onClose}
                >
                  <span className="mega-menu-mobile-card__img">
                    {cat.iconUrl && (
                      <img src={cat.iconUrl} alt="" width={84} height={84} />
                    )}
                  </span>

                  <span className="mega-menu-mobile-card__title">
                    {cat.title}
                  </span>
                </Link>
              ))}
            </div>

            <div className="sidebar">
              {tree.map((cat) => {
                const attrs = cat.attributes || {}
                const isActive = cat.id === activeRoot?.id
                const iconUrl = resolveIcon(attrs.pictogram_url || attrs.icon_url)

                return (
                  <Link
                    key={cat.id}
                    href={buildPath(cat)}
                    className={`menu-item${isActive ? ' active' : ''}`}
                    onMouseEnter={() => setActiveRootId(cat.id)}
                    onClick={onClose}
                  >
                    {iconUrl && (
                      <div className="menu-item-icon">
                        <img src={iconUrl} alt="" width={24} height={24} />
                      </div>
                    )}

                    <span className="menu-item-text">
                      {getCategoryName(cat)}
                    </span>

                    <span className="menu-item-arrow">›</span>
                  </Link>
                )
              })}
            </div>

            <div className="mega-menu">
              {(() => {
                const columns = []
                let leafGroup = []

                sections.forEach((section) => {
                  if ((section.children || []).length > 0) {
                    if (leafGroup.length) {
                      columns.push({ type: 'group', items: leafGroup })
                      leafGroup = []
                    }

                    columns.push({ type: 'section', item: section })
                  } else {
                    leafGroup.push(section)

                    if (leafGroup.length === 3) {
                      columns.push({ type: 'group', items: leafGroup })
                      leafGroup = []
                    }
                  }
                })

                if (leafGroup.length) columns.push({ type: 'group', items: leafGroup })

                return columns.map((col, colIdx) => {
                  if (col.type === 'section') {
                    const section = col.item
                    const attrs = section.attributes || {}
                    const sectionSlug = getCategorySlug(section)
                    const sectionPath = buildPath(section, [rootSlug])
                    const iconUrl = resolveIcon(attrs.icon_url)
                    const children = section.children || []

                    return (
                      <div className="mega-menu-section" key={section.id}>
                        <div className="section-header">
                          {iconUrl && (
                            <div className="section-icon">
                              <img src={iconUrl} alt="" width={40} height={40} />
                            </div>
                          )}

                          <Link href={sectionPath} className="section-title" onClick={onClose}>
                            {getCategoryName(section)}
                          </Link>
                        </div>

                        {children.length > 0 && (
                          <ul className="section-links">
                            {children.slice(0, MAX_VISIBLE).map((child) => (
                              <li key={child.id}>
                                <Link href={buildPath(child, [rootSlug, sectionSlug])} onClick={onClose}>
                                  {getCategoryName(child)}
                                </Link>
                              </li>
                            ))}

                            {children.length > MAX_VISIBLE && (
                              <li>
                                <Link href={sectionPath} className="catalog-show__more" onClick={onClose}>
                                  Показать ещё ›
                                </Link>
                              </li>
                            )}
                          </ul>
                        )}
                      </div>
                    )
                  }

                  return (
                    <div className="mega-menu-section" key={`group-${colIdx}`}>
                      {col.items.map((section) => {
                        const attrs = section.attributes || {}
                        const sectionPath = buildPath(section, [rootSlug])
                        const iconUrl = resolveIcon(attrs.icon_url)

                        return (
                          <div className="section-header" key={section.id}>
                            {iconUrl && (
                              <div className="section-icon">
                                <img src={iconUrl} alt="" width={40} height={40} />
                              </div>
                            )}

                            <Link href={sectionPath} className="section-title" onClick={onClose}>
                              {getCategoryName(section)}
                            </Link>
                          </div>
                        )
                      })}
                    </div>
                  )
                })
              })()}
            </div>
          </>
        )}

      </div>
    </div>
  )
}