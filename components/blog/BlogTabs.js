'use client';

// components/blog/BlogTabs.js

/**
 * Props:
 *  - rubrics     {string[]}          — список рубрик с бэка
 *  - activeTab   {string}            — активный slug ('all' или значение rubric)
 *  - onTabChange {fn(slug: string)}  — коллбэк при клике
 */
export default function BlogTabs({ rubrics = [], activeTab = 'all', onTabChange }) {
  const tabs = [
    { slug: 'all', label: 'Все' },
    ...rubrics.map((r) => ({ slug: r, label: r })),
  ];

  return (
    <div className="blog-tabs">
      {tabs.map((tab) => (
        <button
          key={tab.slug}
          type="button"
          className={`blog-tabs__item${activeTab === tab.slug ? ' blog-tabs__item--active' : ''}`}
          onClick={() => onTabChange?.(tab.slug)}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}