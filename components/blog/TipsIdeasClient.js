'use client';

// components/blog/TipsIdeasClient.js

import { useState, useEffect, useCallback, useRef } from 'react';
import BlogTabs from '@/components/blog/BlogTabs';
import BlogCard from '@/components/blog/BlogCard';

const API_BASE_URL = 'https://test.ikeya.by/api/v1';
const PER_PAGE = 20;

async function fetchArticles({ page = 1, rubric = null } = {}) {
    const params = new URLSearchParams({
        per_page: PER_PAGE,
        page,
    });
    if (rubric) params.set('rubric', rubric);

    const res = await fetch(`${API_BASE_URL}/content/articles?${params}`);
    if (!res.ok) throw new Error('Ошибка загрузки статей');
    return res.json();
}

/**
 * Props:
 *  - initialArticles {Array}    — первая страница статей (загружена на сервере)
 *  - initialMeta     {object}   — { total, page, per_page } с сервера
 *  - rubrics         {string[]} — уникальные рубрики (собраны на сервере)
 */
export default function TipsIdeasClient({ initialArticles = [], initialMeta = {}, rubrics = [] }) {
    const [activeTab, setActiveTab] = useState('all');
    const [articles, setArticles] = useState(initialArticles);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(
        () => initialArticles.length < (initialMeta.total ?? 0)
    );
    const [loading, setLoading] = useState(false);
    const [tabLoading, setTabLoading] = useState(false);

    const sentinelRef = useRef(null); // элемент-триггер для IntersectionObserver

    // ─── Вычисляем hasMore при изменении articles/page ─────────────────────────
    const totalPages = (meta) => Math.ceil((meta?.total ?? 0) / PER_PAGE);

    // ─── Смена таба: сброс списка, загрузка с page=1 ───────────────────────────
    const handleTabChange = useCallback(async (slug) => {
        if (slug === activeTab) return;
        setActiveTab(slug);
        setTabLoading(true);
        setArticles([]);
        try {
            const data = await fetchArticles({ page: 1, rubric: slug === 'all' ? null : slug });
            setArticles(data.data || []);
            setPage(1);
            setHasMore((data.data?.length ?? 0) < (data.meta?.total ?? 0));
        } catch (e) {
            console.error(e);
        } finally {
            setTabLoading(false);
        }
    }, [activeTab]);

    // ─── Подгрузка следующей страницы ──────────────────────────────────────────
    const loadMore = useCallback(async () => {
        if (loading || !hasMore) return;
        setLoading(true);
        try {
            const nextPage = page + 1;
            const data = await fetchArticles({
                page: nextPage,
                rubric: activeTab === 'all' ? null : activeTab,
            });
            const newArticles = data.data || [];
            setArticles((prev) => [...prev, ...newArticles]);
            setPage(nextPage);
            setHasMore(
                articles.length + newArticles.length < (data.meta?.total ?? 0)
            );
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    }, [loading, hasMore, page, activeTab, articles.length]);

    // ─── IntersectionObserver на sentinel ──────────────────────────────────────
    useEffect(() => {
        const sentinel = sentinelRef.current;
        if (!sentinel) return;

        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting) loadMore();
            },
            { rootMargin: '200px' }
        );

        observer.observe(sentinel);
        return () => observer.disconnect();
    }, [loadMore]);

    // ─── Рендер ────────────────────────────────────────────────────────────────
    return (
        <>
            <BlogTabs
                rubrics={rubrics}
                activeTab={activeTab}
                onTabChange={handleTabChange}
            />

            {tabLoading ? (
                <div className="blog-list__spinner">
                    <div className="spinner-border text-primary" role="status">
                        <span className="visually-hidden">Загрузка...</span>
                    </div>
                </div>
            ) : (
                <>
                    <div className="blog-list__grid">
                        {articles.map((article) => (
                            <BlogCard key={article.id} article={article} />
                        ))}
                    </div>

                    {/* Sentinel для бесконечной прокрутки */}
                    <div ref={sentinelRef} className="blog-list__sentinel" />

                    {loading && (
                        <div className="blog-list__spinner">
                            <div className="spinner-border text-primary" role="status">
                                <span className="visually-hidden">Загрузка...</span>
                            </div>
                        </div>
                    )}
                </>
            )}
        </>
    );
}