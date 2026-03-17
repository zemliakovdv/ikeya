'use client'

// components/layout/Header/MegaMenu.js
import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'

export default function MegaMenu({ isOpen, onClose }) {
  const [allCategories, setAllCategories] = useState([])
  const [activeRootId, setActiveRootId] = useState(null)
  const menuRef = useRef(null)

  // Загружаем категории
  useEffect(() => {
    async function load() {
      try {
        let allCategories = []
        let page = 1
        const perPage = 100

        while (true) {
          const res = await fetch(
            `http://45.135.234.22/api/v1/categories?per_page=${perPage}&page=${page}`,
            { cache: 'no-store' }
          )
          if (!res.ok) throw new Error(`API Error: ${res.status}`)
          const data = await res.json()
          const cats = data.data || []
          allCategories = allCategories.concat(cats)
          if (cats.length < perPage || page >= (data.meta?.total_pages || 1)) break
          page++
        }

        setAllCategories(allCategories)
      } catch (e) {
        console.error('MegaMenu: ошибка загрузки категорий', e)
      }
    }
    load()
  }, [])

  // Закрытие по клику вне
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

  if (!isOpen) return null

  // Строим дерево категорий
  const allIds = new Set(allCategories.map((c) => c.id))

  // Корневые категории (parent_ids не содержат существующих категорий)
  const rootCategories = allCategories.filter((cat) => {
    const parentIds = cat.attributes?.parent_ids || []
    return parentIds.every((pid) => !allIds.has(pid))
  })

  // Дочерние первого уровня для активной корневой
  const activeRoot = activeRootId
    ? allCategories.find((c) => c.id === activeRootId)
    : rootCategories[0]

  const activeRootIdResolved = activeRoot?.id

  // Дочерние активной корневой — это "секции" мегаменю
  const sections = allCategories.filter((cat) => {
    const parentIds = cat.attributes?.parent_ids || []
    return parentIds[parentIds.length - 1] === activeRootIdResolved
  })

  // Для каждой секции — её дочерние (подкатегории)
  function getChildren(parentId) {
    return allCategories.filter((cat) => {
      const parentIds = cat.attributes?.parent_ids || []
      return parentIds[parentIds.length - 1] === parentId
    })
  }

  // Строим путь к категории через slug предков
  function buildPath(cat) {
    const parentIds = cat.attributes?.parent_ids || []
    const slugParts = []
    for (const pid of parentIds) {
      const parent = allCategories.find((c) => c.id === pid)
      if (parent && allIds.has(pid)) {
        slugParts.push(parent.attributes?.slug || pid)
      }
    }
    slugParts.push(cat.attributes?.slug || cat.id)
    return `/catalog/${slugParts.join('/')}/`
  }

  return (
    <div className="mega-menu-overlay" ref={menuRef}>
      <div className="container-menu">
        {/* Левый сайдбар — корневые категории */}
        <div className="sidebar">
          {rootCategories.map((cat) => {
            const attrs = cat.attributes || {}
            const isActive = (activeRootIdResolved === cat.id) ||
              (!activeRootId && cat.id === rootCategories[0]?.id)
            return (
              <div
                key={cat.id}
                className={`menu-item${isActive ? ' active' : ''}`}
                onMouseEnter={() => setActiveRootId(cat.id)}
              >
                {attrs.icon_url && (
                  <div className="menu-item-icon">
                    <img src={attrs.icon_url} alt="" width={24} height={24} />
                  </div>
                )}
                <span className="menu-item-text">
                  {attrs.translated_name || attrs.name || 'Категория'}
                </span>
                <span className="menu-item-arrow">›</span>
              </div>
            )
          })}
        </div>

        {/* Правая часть — подкатегории активной корневой */}
        <div className="mega-menu">
          {sections.map((section) => {
            const attrs = section.attributes || {}
            const children = getChildren(section.id)
            const MAX_VISIBLE = 5

            return (
              <div className="mega-menu-section" key={section.id}>
                <div className="section-header">
                  {attrs.icon_url && (
                    <div className="section-icon">
                      <img src={attrs.icon_url} alt="" width={40} height={40} />
                    </div>
                  )}
                  <Link
                    href={buildPath(section)}
                    className="section-title"
                    onClick={onClose}
                  >
                    {attrs.translated_name || attrs.name}
                  </Link>
                </div>

                {children.length > 0 && (
                  <ul className="section-links">
                    {children.slice(0, MAX_VISIBLE).map((child) => (
                      <li key={child.id}>
                        <Link href={buildPath(child)} onClick={onClose}>
                          {child.attributes?.translated_name || child.attributes?.name}
                        </Link>
                      </li>
                    ))}
                    {children.length > MAX_VISIBLE && (
                      <li>
                        <Link
                          href={buildPath(section)}
                          className="catalog-show__more"
                          onClick={onClose}
                        >
                          Показать ещё ›
                        </Link>
                      </li>
                    )}
                  </ul>
                )}
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}