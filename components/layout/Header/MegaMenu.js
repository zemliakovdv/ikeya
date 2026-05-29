'use client'

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { IMAGES_BASE_URL, getCachedCategoriesTree } from '@/lib/api/ikea'

let cachedTree = null
const VISIBLE_CHILDREN_LIMIT = 4

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
  if (url.startsWith('/assets')) return url
  if (url.startsWith('http')) return url.replace(/^https?:\/\/[^/]+/, IMAGES_BASE_URL)
  return `${IMAGES_BASE_URL}${url.startsWith('/') ? url : `/${url}`}`
}

function getCategoryImage(cat) {
  const attrs = cat?.attributes || {}
  return resolveIcon(
    attrs.icon_url ||
    attrs.pictogram_url ||
    attrs.background_image_url ||
    attrs.local_image_path ||
    attrs.remote_image_url
  )
}

function hasChildren(cat) {
  return Array.isArray(cat?.children) && cat.children.length > 0
}

function estimateGroupHeight(group) {
  const section = group?.section || {}
  const children = Array.isArray(section.children) ? section.children : []
  const title = getCategoryName(section)
  const visibleChildren = children.slice(0, VISIBLE_CHILDREN_LIMIT)

  const TITLE_ROW_HEIGHT = 40
  const BASE_GROUP_GAP = 22
  const CHILD_ROW_HEIGHT = 36
  const LONG_CHILD_ROW_HEIGHT = 56
  const SHOW_MORE_HEIGHT = 28
  const TITLE_LONG_EXTRA = 16
  const LONG_TEXT_THRESHOLD = 36

  let height = TITLE_ROW_HEIGHT + BASE_GROUP_GAP

  if (title.length > LONG_TEXT_THRESHOLD) {
    height += TITLE_LONG_EXTRA
  }

  visibleChildren.forEach((child) => {
    const childName = getCategoryName(child)
    height += childName.length > LONG_TEXT_THRESHOLD ? LONG_CHILD_ROW_HEIGHT : CHILD_ROW_HEIGHT
  })

  if (children.length > VISIBLE_CHILDREN_LIMIT) {
    height += SHOW_MORE_HEIGHT
  }

  return height
}

function distributeGroupsByEstimatedHeight(groups, columnCount = 3) {
  const columns = Array.from({ length: columnCount }, () => [])
  const heights = Array.from({ length: columnCount }, () => 0)

  groups.forEach((group) => {
    let targetIndex = 0

    for (let i = 1; i < heights.length; i += 1) {
      if (heights[i] < heights[targetIndex]) {
        targetIndex = i
      }
    }

    columns[targetIndex].push(group)
    heights[targetIndex] += estimateGroupHeight(group)
  })

  return columns
}

function MegaMenuSidebar({ topItems, mainItems, activeRootId, setActiveRootId, onClose }) {
  const renderRootItem = (cat) => {
    const attrs = cat.attributes || {}
    const isActive = cat.id === activeRootId
    const iconUrl = resolveIcon(attrs.pictogram_url || attrs.icon_url)

    return (
      <Link
        key={cat.id}
        href={buildPath(cat)}
        className={`mega-menu-root-item${isActive ? ' active' : ''}`}
        onMouseEnter={() => setActiveRootId(cat.id)}
        onFocus={() => setActiveRootId(cat.id)}
        onClick={onClose}
      >
        <span className="mega-menu-root-item__content">
          {iconUrl && (
            <span className="mega-menu-root-item__icon">
              <img src={iconUrl} alt="" width={24} height={24} />
            </span>
          )}
          <span className="mega-menu-root-item__text">{getCategoryName(cat)}</span>
        </span>
        <span className="mega-menu-root-item__arrow">›</span>
      </Link>
    )
  }

  return (
    <aside className="mega-menu-sidebar" aria-label="Категории">
      {topItems.length > 0 && (
        <div className="mega-menu-sidebar__top">
          {topItems.map(renderRootItem)}
        </div>
      )}

      {mainItems.length > 0 && (
        <div className="mega-menu-sidebar__main">
          {mainItems.map(renderRootItem)}
        </div>
      )}
    </aside>
  )
}

function MegaMenuCategoryGroup({ rootSlug, section, onClose }) {
  const sectionSlug = getCategorySlug(section)
  const sectionPath = buildPath(section, [rootSlug])
  const iconUrl = resolveIcon(section?.attributes?.icon_url)
  const children = section?.children || []
  const visibleChildren = children.slice(0, VISIBLE_CHILDREN_LIMIT)
  const shouldShowMore = children.length > VISIBLE_CHILDREN_LIMIT && sectionPath && sectionPath !== '/catalog//'

  return (
    <div className="mega-menu-group">
      <div className="mega-menu-group__title-row">
        {iconUrl && (
          <span className="mega-menu-group__icon">
            <img src={iconUrl} alt="" width={40} height={40} />
          </span>
        )}
        <Link href={sectionPath} className="mega-menu-group__title" onClick={onClose}>
          {getCategoryName(section)}
        </Link>
      </div>

      {children.length > 0 && (
        <ul className="mega-menu-group__children">
          {visibleChildren.map((child) => (
            <li key={child.id}>
              <Link href={buildPath(child, [rootSlug, sectionSlug])} onClick={onClose}>
                {getCategoryName(child)}
              </Link>
            </li>
          ))}
        </ul>
      )}

      {shouldShowMore && (
        <Link href={sectionPath} className="mega-menu__show-more" onClick={onClose}>
          Показать еще
        </Link>
      )}
    </div>
  )
}

function MegaMenuColumns({ activeRoot, onClose }) {
  const rootSlug = getCategorySlug(activeRoot)
  const sections = activeRoot?.children || []

  const columns = useMemo(() => {
    const groups = sections.map((section) => ({ id: section.id, section }))
    return distributeGroupsByEstimatedHeight(groups, 3)
  }, [sections])

  return (
    <div className="mega-menu-columns" aria-label="Подкатегории">
      {columns.map((column, idx) => (
        <div className="mega-menu-column" key={`col-${idx}`}>
          {column.map((item) => (
            <MegaMenuCategoryGroup
              key={item.id}
              rootSlug={rootSlug}
              section={item.section}
              onClose={onClose}
            />
          ))}
        </div>
      ))}
    </div>
  )
}

function MegaMenuMobile({ tree, mobileStack, setMobileStack, onClose }) {
  const currentMobileCategory = mobileStack[mobileStack.length - 1] || null
  const currentMobileItems = currentMobileCategory?.children || tree
  const isMobileRootLevel = mobileStack.length === 0
  const isMobileFirstChildLevel = mobileStack.length === 1

  const mobileBackTitle = mobileStack.length === 1
    ? 'Все категории'
    : getCategoryName(mobileStack[mobileStack.length - 2])

  const getMobileCategoryHref = (cat) => {
    const ancestorSlugs = mobileStack.map((item) => getCategorySlug(item))
    return buildPath(cat, ancestorSlugs)
  }

  const handleMobileCategoryClick = (cat) => {
    if (hasChildren(cat)) setMobileStack((prev) => [...prev, cat])
  }

  const handleMobileClose = () => {
    setMobileStack([])
    onClose()
  }

  return (
    <div className="mega-menu-mobile-nav">
      {!isMobileRootLevel && (
        <button
          type="button"
          className="mega-menu-mobile-back"
          onClick={() => setMobileStack((prev) => prev.slice(0, -1))}
          aria-label="Назад"
        >
          <span className="mega-menu-mobile-back__icon">‹</span>
          <span className="mega-menu-mobile-back__text">{mobileBackTitle}</span>
        </button>
      )}

      {isMobileRootLevel ? (
        <div className="mega-menu-mobile-grid">
          {tree.map((cat) => {
            const iconUrl = getCategoryImage(cat)
            const title = getCategoryName(cat)
            const href = buildPath(cat)

            if (hasChildren(cat)) {
              return (
                <button
                  key={cat.id}
                  type="button"
                  className="mega-menu-mobile-card"
                  onClick={() => handleMobileCategoryClick(cat)}
                >
                  <span className="mega-menu-mobile-card__img">
                    {iconUrl && <img src={iconUrl} alt="" width={84} height={84} />}
                  </span>
                  <span className="mega-menu-mobile-card__title">{title}</span>
                </button>
              )
            }

            return (
              <Link
                key={cat.id}
                href={href}
                className="mega-menu-mobile-card"
                onClick={handleMobileClose}
              >
                <span className="mega-menu-mobile-card__img">
                  {iconUrl && <img src={iconUrl} alt="" width={84} height={84} />}
                </span>
                <span className="mega-menu-mobile-card__title">{title}</span>
              </Link>
            )
          })}
        </div>
      ) : (
        <div className="mega-menu-mobile-list">
          {currentMobileItems.map((cat) => {
            const iconUrl = getCategoryImage(cat)
            const title = getCategoryName(cat)
            const href = getMobileCategoryHref(cat)
            const itemHasChildren = hasChildren(cat)
            const className = `mega-menu-mobile-list-item${!isMobileFirstChildLevel ? ' mega-menu-mobile-list-item--plain' : ''}`

            if (itemHasChildren) {
              return (
                <button
                  key={cat.id}
                  type="button"
                  className={className}
                  onClick={() => handleMobileCategoryClick(cat)}
                >
                  {isMobileFirstChildLevel && (
                    <span className="mega-menu-mobile-list-item__img">
                      {iconUrl && <img src={iconUrl} alt="" width={48} height={48} />}
                    </span>
                  )}
                  <span className="mega-menu-mobile-list-item__title">{title}</span>
                  <span className="mega-menu-mobile-list-item__arrow">›</span>
                </button>
              )
            }

            return (
              <Link key={cat.id} href={href} className={className} onClick={handleMobileClose}>
                {isMobileFirstChildLevel && (
                  <span className="mega-menu-mobile-list-item__img">
                    {iconUrl && <img src={iconUrl} alt="" width={48} height={48} />}
                  </span>
                )}
                <span className="mega-menu-mobile-list-item__title">{title}</span>
                <span className="mega-menu-mobile-list-item__arrow">›</span>
              </Link>
            )
          })}
        </div>
      )}
    </div>
  )
}

export default function MegaMenu({ isOpen, onClose }) {
  const [tree, setTree] = useState([])
  const [activeRootId, setActiveRootId] = useState(null)
  const [mobileStack, setMobileStack] = useState([])
  const [hasLoaded, setHasLoaded] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [loadError, setLoadError] = useState(null)

  useEffect(() => {
    if (!isOpen || hasLoaded) return

    if (cachedTree) {
      setTree(cachedTree)
      setHasLoaded(true)
      setIsLoading(false)
      return
    }

    let cancelled = false

    async function load() {
      setIsLoading(true)
      setLoadError(null)

      try {
        const roots = await getCachedCategoriesTree()
        if (cancelled) return

        cachedTree = roots || []
        setTree(cachedTree)
        setHasLoaded(true)
      } catch (error) {
        if (cancelled) return
        setLoadError('Не удалось загрузить категории. Попробуйте открыть каталог еще раз.')
      } finally {
        if (!cancelled) setIsLoading(false)
      }
    }

    load()

    return () => {
      cancelled = true
    }
  }, [isOpen, hasLoaded])

  useEffect(() => {
    if (!isOpen) return

    const onEsc = (e) => {
      if (e.key === 'Escape') onClose()
    }

    window.addEventListener('keydown', onEsc)
    return () => window.removeEventListener('keydown', onEsc)
  }, [isOpen, onClose])

  useEffect(() => {
    if (!isOpen) {
      setActiveRootId(null)
      setMobileStack([])
    }
  }, [isOpen])

  useEffect(() => {
    if (!isOpen) return
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = prev
    }
  }, [isOpen])

  if (!isOpen) return null

  const activeRoot = activeRootId
    ? tree.find((cat) => cat.id === activeRootId) || tree[0]
    : tree[0]

  const topItems = tree.slice(0, 2)
  const mainItems = tree.slice(2)
  const showLoader = isLoading && tree.length === 0

  return (
    <div className="mega-menu-overlay" onClick={(e) => e.stopPropagation()}>
      <div className="container-menu">
        {showLoader ? (
          <div className="mega-menu-loader" role="status" aria-live="polite" aria-label="Загрузка каталога">
            <div className="page-loader__spinner" />
          </div>
        ) : loadError ? (
          <div className="mega-menu-error" role="alert">{loadError}</div>
        ) : (
          <>
            <MegaMenuMobile tree={tree} mobileStack={mobileStack} setMobileStack={setMobileStack} onClose={onClose} />

            <div className="mega-menu-desktop">
              <MegaMenuSidebar
                topItems={topItems}
                mainItems={mainItems}
                activeRootId={activeRoot?.id || null}
                setActiveRootId={setActiveRootId}
                onClose={onClose}
              />

              <div className="mega-menu-content">
                {activeRoot ? (
                  <MegaMenuColumns activeRoot={activeRoot} onClose={onClose} />
                ) : (
                  <div className="mega-menu-empty">Категории не найдены</div>
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
