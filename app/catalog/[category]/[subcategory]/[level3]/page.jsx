// app/catalog/[category]/[subcategory]/[level3]/page.js
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import Modals from '@/components/Modals';
import Breadcrumbs from '@/components/Catalog/Breadcrumbs';
import CatalogCategories from '@/components/Catalog/CatalogCategories';
import FilterAside from '@/components/Catalog/FilterAside';
import ProductGrid from '@/components/Catalog/ProductGrid';
import SeoBlock from '@/components/Catalog/SeoBlock';

export async function generateMetadata({ params }) {
    return {
        title: `Столы уличные - IKEYA`,
        description: `Уличные столы для сада и балкона`
    };
}

export default function Level3Page({ params }) {
    const { category, subcategory, level3 } = params;

    // Breadcrumbs (5 уровней)
    const breadcrumbs = [
        { label: 'Главная', href: '/' },
        { label: 'Каталог', href: '/catalog' },
        { label: 'Сад и балкон', href: `/catalog/${category}` },
        { label: 'Уличная мебель', href: `/catalog/${category}/${subcategory}` },
        { label: 'Столы уличные', href: `/catalog/${category}/${subcategory}/${level3}` }
    ];

    // Категории с активной подкатегорией третьего уровня
    const categories = [
        { label: 'Все товары', href: '/catalog', active: false },
        { label: 'Сад и балкон', href: `/catalog/${category}`, active: false },
        { label: 'Уличная мебель', href: `/catalog/${category}/${subcategory}`, active: false },
        { 
            label: 'Столы и стулья',
            href: '#', 
            active: false,
            hasSubcategory: true,
            subcategories: [
                { label: 'Столы уличные', href: '#', active: true },
                { label: 'Стулья уличные', href: '#', active: false },
                { label: 'Барные стулья', href: '#', active: false },
                { label: 'Обеденные группы', href: '#', active: false },
                { label: 'Скамейки', href: '#', active: false },
                { label: 'Табуреты', href: '#', active: false },
                { label: 'Подушки для стульев', href: '#', active: false }
            ]
        }
    ];

    // Примененные фильтры
    const appliedFilters = [
        { label: 'SEGERN' },
        { label: '100 р. — 10 000 р.' },
        { label: 'Бежевый' }
    ];

    // Товары
    const products = Array.from({ length: 24 }, (_, i) => ({
        images: Array(5).fill(`/assets/img/catalog-page/category-view/view${i + 1}.png`),
        thumbnails: [],
        title: ['REVSKR', 'GALTAPPEN', 'ASKHOLMEN', 'STACKHOLMEN'][i % 4],
        description: 'Стол садовый, серо-коричневый окрашенный, 48x35x43 см',
        price: i % 3 === 0 ? '2299' : '135',
        badges: {
            hit: i === 0,
            discount: i % 4 === 0 ? '-10% IKEYA' : '',
            new: i === 23
        }
    }));

    return (
        <>
            <Header />
            
            <main className="main catalog-inner">
                <Breadcrumbs items={breadcrumbs} />
                
                <CatalogCategories show={false} />

                <section className="all-catalog">
                    <div className="container">
                        <div className="row">
                            <div className="col-12">
                                <h2>Столы уличные</h2>
                                <div className="all-catalog-inner">
                                    <FilterAside 
                                        type="deep"
                                        categories={categories}
                                        showApplyButton={true}
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
