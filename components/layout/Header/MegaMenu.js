'use client'

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { IMAGES_BASE_URL, getCachedCategoriesTree } from '@/lib/api/ikea'

let cachedTree = null
let treeRequestPromise = null
let desktopPreparationPromise = null
let isMegaMenuReady = false
const preloadedIcons = new Map()
const ICON_PRELOAD_TIMEOUT = 5000
const ICON_DECODE_TIMEOUT = 1500
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

function collectDesktopIconUrls(tree) {
  const urls = new Set()

  ;(tree || []).forEach((root) => {
    const rootAttrs = root?.attributes || {}
    const rootIcon = resolveIcon(rootAttrs.pictogram_url || rootAttrs.icon_url)

    if (rootIcon) urls.add(rootIcon)

    ;(root?.children || []).forEach((section) => {
      const sectionIcon = resolveIcon(section?.attributes?.icon_url)

      if (sectionIcon) urls.add(sectionIcon)
    })
  })

  return urls
}

function decodeImageWithTimeout(image) {
  if (typeof window === 'undefined' || typeof image?.decode !== 'function') {
    return Promise.resolve()
  }

  return new Promise((resolve) => {
    let settled = false
    let timeoutId = null

    const finish = () => {
      if (settled) return
      settled = true

      if (timeoutId) {
        window.clearTimeout(timeoutId)
        timeoutId = null
      }

      resolve()
    }

    timeoutId = window.setTimeout(finish, ICON_DECODE_TIMEOUT)
    image.decode().then(finish).catch(finish)
  })
}

function prepareDesktopIcon(url) {
  if (!url) return Promise.resolve()

  const cachedIcon = preloadedIcons.get(url)
  if (cachedIcon) return cachedIcon.promise

  let image = null

  const promise = new Promise((resolve) => {
    if (typeof window === 'undefined' || typeof Image === 'undefined') {
      resolve()
      return
    }

    let settled = false
    let timeoutId = null

    const finish = async (shouldDecode) => {
      if (settled) return
      settled = true

      if (timeoutId) {
        clearTimeout(timeoutId)
        timeoutId = null
      }

      if (image) {
        image.onload = null
        image.onerror = null
      }

      if (shouldDecode) {
        await decodeImageWithTimeout(image)
      }

      resolve()
    }

    try {
      image = new Image()
      image.onload = () => {
        void finish(true)
      }
      image.onerror = () => {
        void finish(false)
      }
      timeoutId = window.setTimeout(() => {
        void finish(false)
      }, ICON_PRELOAD_TIMEOUT)
      image.src = url

      if (image.complete) {
        void finish(true)
      }
    } catch {
      void finish(false)
    }
  })

  preloadedIcons.set(url, { image, promise })

  return promise
}

function preloadDesktopIcons(tree) {
  if (typeof window === 'undefined' || typeof Image === 'undefined') {
    return Promise.resolve()
  }

  const iconPromises = Array.from(collectDesktopIconUrls(tree), prepareDesktopIcon)

  return Promise.allSettled(iconPromises).then(() => undefined)
}

function loadMegaMenuTree() {
  if (cachedTree) return Promise.resolve(cachedTree)
  if (treeRequestPromise) return treeRequestPromise

  treeRequestPromise = getCachedCategoriesTree()
    .then((roots) => {
      const tree = Array.isArray(roots) ? roots : []

      if (tree.length === 0) {
        throw new Error('Mega menu categories tree is empty')
      }

      cachedTree = tree

      return tree
    })
    .catch((error) => {
      cachedTree = null
      isMegaMenuReady = false
      throw error
    })
    .finally(() => {
      treeRequestPromise = null
    })

  return treeRequestPromise
}

export function prefetchMegaMenu() {
  if (isMegaMenuReady && cachedTree) return Promise.resolve(cachedTree)
  if (desktopPreparationPromise) return desktopPreparationPromise

  desktopPreparationPromise = loadMegaMenuTree()
    .then(async (tree) => {
      await preloadDesktopIcons(tree)
      isMegaMenuReady = true

      return tree
    })
    .catch((error) => {
      isMegaMenuReady = false
      throw error
    })
    .finally(() => {
      desktopPreparationPromise = null
    })

  return desktopPreparationPromise
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

function MegaMenuDesktopSkeleton() {
  const sidebarItems = Array.from({ length: 12 })
  const groups = Array.from({ length: 9 })

  return (
    <div className="mega-menu-desktop mega-menu-desktop-skeleton" aria-hidden="true">
      <aside className="mega-menu-sidebar mega-menu-skeleton-sidebar">
        {sidebarItems.map((_, index) => (
          <div className="mega-menu-skeleton-root" key={`root-${index}`}>
            <span className="mega-menu-skeleton-icon" />
            <span className="mega-menu-skeleton-line mega-menu-skeleton-line--root" />
          </div>
        ))}
      </aside>

      <div className="mega-menu-content mega-menu-skeleton-content">
        <div className="mega-menu-columns">
          {groups.map((_, index) => (
            <div className="mega-menu-skeleton-group" key={`group-${index}`}>
              <div className="mega-menu-skeleton-title-row">
                <span className="mega-menu-skeleton-icon mega-menu-skeleton-icon--large" />
                <span className="mega-menu-skeleton-line mega-menu-skeleton-line--title" />
              </div>
              <span className="mega-menu-skeleton-line mega-menu-skeleton-line--child" />
              <span className="mega-menu-skeleton-line mega-menu-skeleton-line--child short" />
              <span className="mega-menu-skeleton-line mega-menu-skeleton-line--child" />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default function MegaMenu({ isOpen, onClose }) {
  const [tree, setTree] = useState(() => cachedTree || [])
  const [activeRootId, setActiveRootId] = useState(null)
  const [mobileStack, setMobileStack] = useState([])
  const [desktopReady, setDesktopReady] = useState(() => isMegaMenuReady && Boolean(cachedTree))
  const [loadError, setLoadError] = useState(null)

  useEffect(() => {
    if (!isOpen) return

    let cancelled = false

    async function load() {
      setLoadError(null)

      try {
        const roots = await loadMegaMenuTree()
        if (cancelled) return

        setTree(roots)

        try {
          await prefetchMegaMenu()
          if (!cancelled) setDesktopReady(true)
        } catch {
          if (!cancelled) {
            setDesktopReady(false)
            setLoadError('Не удалось загрузить категории. Попробуйте открыть каталог еще раз.')
          }
        }
      } catch {
        if (cancelled) return
        setDesktopReady(false)
        setLoadError('Не удалось загрузить категории. Попробуйте открыть каталог еще раз.')
      }
    }

    load()

    return () => {
      cancelled = true
    }
  }, [isOpen])

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

  const effectiveTree = tree.length > 0 ? tree : cachedTree || []
  const treeReady = effectiveTree.length > 0
  const currentDesktopReady = (desktopReady || isMegaMenuReady) && treeReady
  const activeRoot = activeRootId
    ? effectiveTree.find((cat) => cat.id === activeRootId) || effectiveTree[0]
    : effectiveTree[0]

  const topItems = effectiveTree.slice(0, 2)
  const mainItems = effectiveTree.slice(2)

  return (
    <div className="mega-menu-overlay" onClick={(e) => e.stopPropagation()}>
      <div className="container-menu">
        {loadError ? (
          <div className="mega-menu-error" role="alert">{loadError}</div>
        ) : (
          <>
            {treeReady ? (
              <MegaMenuMobile tree={effectiveTree} mobileStack={mobileStack} setMobileStack={setMobileStack} onClose={onClose} />
            ) : (
              <div className="mega-menu-loader" role="status" aria-live="polite" aria-label="Загрузка каталога">
                <div className="page-loader__spinner" />
              </div>
            )}

            {currentDesktopReady ? (
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
            ) : (
              <MegaMenuDesktopSkeleton />
            )}
          </>
        )}
      </div>
    </div>
  )
}
