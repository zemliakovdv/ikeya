'use client'

// components/layout/Header/MegaMenu.js
import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'

const API_BASE = 'https://test.ikeya.by'

// Модульный кеш — живёт пока открыта вкладка браузера
let _cachedTree = null

// Строим путь к категории.
// Теперь slug берём из самого объекта — дерево уже содержит нужную структуру.
// Для полного пути нужно знать slug всех предков — передаём их через ancestorSlugs.
function buildPath(cat, ancestorSlugs = []) {
  const slug = cat.attributes?.slug || cat.id
  return `/catalog/${[...ancestorSlugs, slug].join('/')}/`
}

// Нормализуем icon_url — может быть относительным или абсолютным
function resolveIcon(url) {
  if (!url) return null
  if (url.startsWith('http')) return url
  return `${API_BASE}${url}`
}

export default function MegaMenu({ isOpen, onClose }) {
  const [tree, setTree] = useState([]) // корневые категории с вложенными children
  const [activeRootId, setActiveRootId] = useState(null)
  const menuRef = useRef(null)

  // Загружаем дерево категорий
  useEffect(() => {
    async function load() {
      if (_cachedTree) {
        setTree(_cachedTree)
        return
      }

      try {
        const res = await fetch(`${API_BASE}/api/v1/categories/tree`, {
          cache: 'no-store',
        })

        if (!res.ok) throw new Error(`API Error: ${res.status}`)

        const data = await res.json()
        const roots = data.data || []

        _cachedTree = roots
        setTree(roots)
      } catch (e) {
        console.error('MegaMenu: ошибка загрузки категорий', e)
      }
    }

    load()
  }, [])

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
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }

    return () => {
      document.body.style.overflow = ''
    }
  }, [isOpen])

  if (!isOpen) return null

  // Активная корневая категория (по hover или первая по умолчанию)
  const activeRoot = activeRootId
    ? tree.find((c) => c.id === activeRootId)
    : tree[0]

  // Секции правой части — дочерние активной корневой (children[])
  const sections = activeRoot?.children || []

  // slug активной корневой — нужен для построения пути к секциям и их детям
  const rootSlug = activeRoot?.attributes?.slug || activeRoot?.id || ''

  const MAX_VISIBLE = 5

  // Корневые категории для мобильной сетки
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
      title: attrs.translated_name || attrs.name || 'Категория',
      href: `/catalog/${attrs.slug || cat.id}/`,
      iconUrl,
    }
  })

  return (
    <div className="mega-menu-overlay" ref={menuRef}>
      <div className="container-menu">

        {/* Мобильный каталог — сетка корневых категорий */}
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

        {/* Левый сайдбар — корневые категории */}
        <div className="sidebar">
          {tree.map((cat) => {
            const attrs = cat.attributes || {}
            const isActive = cat.id === activeRoot?.id
            const iconUrl = resolveIcon(attrs.pictogram_url || attrs.icon_url)

            return (
              <Link
                key={cat.id}
                href={`/catalog/${attrs.slug || cat.id}/`}
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
                  {attrs.translated_name || attrs.name || 'Категория'}
                </span>

                <span className="menu-item-arrow">›</span>
              </Link>
            )
          })}
        </div>

        {/* Правая часть — секции и подкатегории активной корневой */}
        <div className="mega-menu">
          {(() => {
            // Группируем секции: с детьми — отдельная колонка, без детей — по 3 в одну
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
                const sectionSlug = attrs.slug || section.id
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
                        {attrs.translated_name || attrs.name}
                      </Link>
                    </div>

                    {children.length > 0 && (
                      <ul className="section-links">
                        {children.slice(0, MAX_VISIBLE).map((child) => (
                          <li key={child.id}>
                            <Link href={buildPath(child, [rootSlug, sectionSlug])} onClick={onClose}>
                              {child.attributes?.translated_name || child.attributes?.name}
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

              // type === 'group': несколько секций без детей в одной колонке
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
                          {attrs.translated_name || attrs.name}
                        </Link>
                      </div>
                    )
                  })}
                </div>
              )
            })
          })()}
        </div>

      </div>
    </div>
  )
}