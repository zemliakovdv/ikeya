// app/catalog/search/page.js
import { Header, Footer } from '@/components/layout';
import Modals from '@/components/Modals';
import Breadcrumbs from '@/components/Catalog/Breadcrumbs';
import CatalogCategories from '@/components/Catalog/CatalogCategories';
import FilterAside from '@/components/Catalog/FilterAside';
import ProductGrid from '@/components/Catalog/ProductGrid';
import SeoBlock from '@/components/Catalog/SeoBlock';

export const metadata = {
    title: 'Результаты поиска - IKEYA',
    description: 'Найдено 586 товаров'
};

export default function SearchPage({ searchParams }) {
    const query = searchParams?.q || '';

    // Категории для поиска (плоский список)
    const categories = [
        { label: 'Все товары', href: '/catalog', active: false },
        { label: 'Мебель', href: '/catalog/mebel', active: false },
        { label: 'Текстиль', href: '/catalog/tekstil', active: false },
        { label: 'Декор', href: '/catalog/dekor', active: false }
    ];

    // Товары результатов поиска (24 карточки с другими изображениями)
    const products = Array.from({ length: 24 }, (_, i) => ({
        images: Array(5).fill(`/assets/img/catalog-page/catalog-search/image-${i + 1}.png`),
        thumbnails: i % 4 === 0 ? [
            { src: `/assets/img/catalog-page/catalog-search/mini/image-${32 + i}.png` },
            { src: `/assets/img/catalog-page/catalog-search/mini/image-${33 + i}.png` },
            { src: `/assets/img/catalog-page/catalog-search/mini/image-${34 + i}.png` },
            { isMore: true, count: 6 }
        ] : i % 4 === 1 ? [] : [
            { src: '/assets/img/main-page/sales-hist/hits-1.png' }
        ],
        title: ['EKET', 'METOD', 'BILLY & HGADAL', 'BILLY OXBERG'][i % 4],
        description: i % 4 === 0 ? 'Комбинация шкафов с ножками, 70x35x35 см' : 
                     i % 4 === 1 ? 'Навесной шкаф с полками, Upplöv бежевый, 60x60x200 см' :
                     i % 4 === 2 ? 'Книжный шкаф со стеклянной дверью, 40x30x106 см' :
                     'Книжный шкаф со стеклянными дверями, белый, 80x30x202 см',
        price: i % 3 === 0 ? '135' : i % 3 === 1 ? '3499' : '49.99',
        badges: {
            hit: false,
            discount: i % 5 === 0 ? '-10% IKEYA' : '',
            new: i % 6 === 0
        }
    }));

    return (
        <>
            <Header />
            
            <main className="main catalog-inner">
                {/* Breadcrumbs скрыты */}
                <Breadcrumbs hidden={true} />
                
                {/* Коллекции скрыты */}
                <CatalogCategories show={false} />

                <section className="all-catalog">
                    <div className="container">
                        <div className="row">
                            <div className="col-12">
                                <h2>586 товаров</h2>
                                <div className="all-catalog-inner">
                                    <FilterAside 
                                        type="search"
                                        categories={categories}
                                        showApplyButton={false}
                                    />

                                    <ProductGrid 
                                        products={products}
                                        appliedFilters={[]}
                                        showFilters={false}
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
