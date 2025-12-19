// app/catalog/[category]/page.js
import { Header, Footer } from '@/components/layout';
import Modals from '@/components/Modals';
import Breadcrumbs from '@/components/Catalog/Breadcrumbs';
import CatalogCategories from '@/components/Catalog/CatalogCategories';
import FilterAside from '@/components/Catalog/FilterAside';
import ProductGrid from '@/components/Catalog/ProductGrid';
import SeoBlock from '@/components/Catalog/SeoBlock';

export async function generateMetadata({ params }) {
    const categoryName = params.category.replace(/-/g, ' ');
    return {
        title: `${categoryName} - Каталог IKEYA`,
        description: `Товары категории ${categoryName}`
    };
}

export default function CategoryPage({ params }) {
    const categorySlug = params.category;
    const categoryName = 'Сад и балкон'; // В реальном проекте - из API

    // Breadcrumbs (3 уровня)
    const breadcrumbs = [
        { label: 'Главная', href: '/' },
        { label: 'Каталог', href: '/catalog' },
        { label: categoryName, href: `/catalog/${categorySlug}` }
    ];

    // Категории с активной и подкатегориями
    const categories = [
        { label: 'Все товары', href: '/catalog', active: false },
        { 
            label: categoryName, 
            href: `/catalog/${categorySlug}`, 
            active: true,
            hasSubcategory: true,
            subcategories: [
                { label: 'Уличная мебель', href: `/catalog/${categorySlug}/mebel`, active: false },
                { label: 'Балконная мебель', href: `/catalog/${categorySlug}/balkon`, active: false },
                { label: 'Зонты и тенты', href: `/catalog/${categorySlug}/zonty`, active: false },
                { label: 'Растения и горшки', href: `/catalog/${categorySlug}/rasteniya`, active: false },
                { label: 'Освещение уличное', href: `/catalog/${categorySlug}/osveshenie`, active: false },
                { label: 'Декор для сада', href: `/catalog/${categorySlug}/dekor`, active: false },
                { label: 'Барбекю и гриль', href: `/catalog/${categorySlug}/barbekyu`, active: false }
            ]
        },
        { label: 'Мебель для хранения', href: '/catalog/mebel', active: false },
        { label: 'Освещение', href: '/catalog/osveshenie', active: false }
    ];

    // Примененные фильтры
    const appliedFilters = [
        { label: 'SEGERN' },
        { label: '100 р. — 10 000 р.' },
        { label: 'Бежевый' }
    ];

    // Товары (24 карточки)
    const products = Array.from({ length: 24 }, (_, i) => ({
        images: Array(5).fill(`/assets/img/catalog-page/card/card${(i % 4) + 1}.png`),
        thumbnails: i % 3 === 2 ? [
            { src: '/assets/img/catalog-page/card/mini/mini1.png' },
            { src: '/assets/img/catalog-page/card/mini/mini2.png' },
            { src: '/assets/img/catalog-page/card/mini/mini3.png' },
            { isMore: true, count: 2 }
        ] : [],
        title: ['SLATTUM', 'GRADVIS', 'NSUND', 'PELARBJRK'][i % 4],
        description: 'Каркас кровати с обивкой, Vissle серо-бежевый, 140x200 см',
        price: '135',
        badges: {
            hit: false,
            discount: i % 4 === 0 ? '-10% IKEYA' : '',
            new: false
        }
    }));

    return (
        <>
            <Header />
            
            <main className="main catalog-inner">
                <Breadcrumbs items={breadcrumbs} />
                
                <CatalogCategories 
                    show={true}
                    visibleCount={8}
                />

                <section className="all-catalog">
                    <div className="container">
                        <div className="row">
                            <div className="col-12">
                                <div className="all-catalog-inner">
                                    <FilterAside 
                                        type="category"
                                        categories={categories}
                                        showApplyButton={false}
                                    />

                                    <ProductGrid 
                                        products={products}
                                        appliedFilters={appliedFilters}
                                        showFilters={true}
                                        currentPage={1}
                                        totalPages={16}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                <SeoBlock show={true} />
            </main>

            <Footer />
            <Modals />
        </>
    );
}
