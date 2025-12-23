// app/catalog/page.js
import { Header, Footer } from '@/components/layout';
import Modals from '@/components/Modals';
import Breadcrumbs from '@/components/Catalog/Breadcrumbs';
import CatalogCategories from '@/components/Catalog/CatalogCategories';
import FilterAside from '@/components/Catalog/FilterAside';
import ProductGrid from '@/components/Catalog/ProductGrid';

export const metadata = {
    title: 'Каталог - IKEYA',
    description: 'Полный каталог товаров IKEYA'
};

export default function CatalogPage() {
    // Breadcrumbs
    const breadcrumbs = [
        { label: 'Главная', href: '/' },
        { label: 'Каталог', href: '/catalog' }
    ];

    // Категории для sidebar
    const categories = [
        { label: 'Все товары', href: '/catalog', active: false },
        { label: 'Сад и балкон', href: '/catalog/sad-i-balkon', active: false },
        { label: 'Мебель для хранения', href: '/catalog/mebel', active: false, hasSubcategory: true },
        { label: 'Освещение', href: '/catalog/osveshenie', active: false },
        { label: 'Диваны и кресла', href: '/catalog/divany', active: false },
        { label: 'Текстиль', href: '/catalog/tekstil', active: false },
        { label: 'Кровати и матрасы', href: '/catalog/krovati', active: false },
        { label: 'Небольшое хранение', href: '/catalog/hranenie', active: false },
        { label: 'Дети и младенцы', href: '/catalog/deti', active: false },
        { label: 'Украшения', href: '/catalog/ukrasheniya', active: false },
        { label: 'Столы и стулья', href: '/catalog/stoly', active: false },
        { label: 'Кухня и бытовая техника', href: '/catalog/kuhnya', active: false },
        { label: 'Ковры', href: '/catalog/kovry', active: false },
        { label: 'Стирка и уборка', href: '/catalog/stirka', active: false },
        { label: 'Ванные', href: '/catalog/vannye', active: false },
        { label: 'Домашняя электроника', href: '/catalog/elektronika', active: false },
        { label: 'Улучшение дома', href: '/catalog/uluchshenie', active: false }
    ];

    // Товары (20 карточек)
    const products = Array.from({ length: 20 }, (_, i) => ({
        images: Array(5).fill(`/assets/img/catalog-page/card/card${(i % 4) + 1}.png`),
        thumbnails: i % 3 === 2 ? [
            { src: '/assets/img/catalog-page/card/mini/mini1.png' },
            { src: '/assets/img/catalog-page/card/mini/mini2.png' },
            { src: '/assets/img/catalog-page/card/mini/mini3.png' },
            { isMore: true, count: i % 3 + 1 }
        ] : [],
        title: ['SLATTUM', 'GRADVIS', 'NSUND', 'PELARBJRK'][i % 4],
        description: 'Каркас кровати с обивкой, Vissle серо-бежевый, 140x200 см',
        price: i % 2 === 0 ? '135' : '2299',
        badges: {
            hit: i % 5 === 0,
            discount: i % 3 === 0 ? '-10% IKEYA' : '',
            new: i % 7 === 0
        }
    }));

    return (
        <>
            <Header />
            
            <main className="main catalog-inner">
                <Breadcrumbs items={breadcrumbs} />
                
                <CatalogCategories 
                    show={true}
                    visibleCount={20}
                />

                <section className="all-catalog">
                    <div className="container">
                        <div className="row">
                            <div className="col-12">
                                <div className="all-catalog-inner">
                                    <FilterAside 
                                        type="full"
                                        categories={categories}
                                        showApplyButton={false}
                                    />

                                    <ProductGrid 
                                        products={products}
                                        appliedFilters={[]}
                                        showFilters={false}
                                        currentPage={1}
                                        totalPages={0}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </main>

            <Footer />
            <Modals />
        </>
    );
}
