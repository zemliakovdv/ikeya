import Breadcrumbs from '../../../../../../components/Breadcrumbs';
import FullCategoryFilter from '../../../../../../components/catalog/FullCategoryFilter';
import CatalogSort from '../../../../../../components/catalog/CatalogSort';
import FilterChips from '../../../../../../components/catalog/FilterChips';
import ProductCard from '../../../../../../components/catalog/ProductCard';
import Pagination from '../../../../../../components/catalog/Pagination';

export default function FourthLevelPage({ params }) {
    const breadcrumbItems = [
        { label: 'Главная', href: '/' },
        { label: 'Каталог', href: '/catalog' },
        { label: 'Сад и балкон', href: `/catalog/${params.category}` },
        { label: 'Садовая и балконная мебель', href: `/catalog/${params.category}/${params.subcategory}` },
        { label: 'Садовая мебель', href: `/catalog/${params.category}/${params.subcategory}/${params.subsubcategory}` },
        { label: 'Садовые стулья и кресла', href: `/catalog/${params.category}/${params.subcategory}/${params.subsubcategory}/${params.finalcategory}` }
    ];

    const subcategories = [
        { label: 'Садовые стулья и кресла', href: '/catalog-category', active: true },
        { label: 'Кресла для сада и балкона', href: '/catalog-category', active: false },
        { label: 'Стулья и табуреты для балкона и террасы', href: '/catalog-category', active: false },
    ];

    const products = [
        {
            id: 1,
            title: 'SLATTUM',
            description: 'Каркас кровати с обивкой, Vissle темно-серый, 140x200 см',
            price: '135',
            images: Array(5).fill('/assets/img/catalog-page/card/card1.png'),
            thumbImages: Array(5).fill('/assets/img/main-page/sales-hist/hits-1.png'),
            badges: { hit: 'Хит продаж', discount: '-10% промокод IKEYA' }
        },
        {
            id: 2,
            title: 'GRÄDVIS',
            description: 'Стакан, прозрачное стекло, 21 cl',
            price: '135',
            images: Array(5).fill('/assets/img/catalog-page/card/card2.png'),
            thumbImages: Array(5).fill('/assets/img/main-page/sales-hist/hits-1.png'),
            badges: { new: 'Новинка' }
        },
        {
            id: 3,
            title: 'NÖSUND',
            description: 'Потолочный светильник, белый, 44 см',
            price: '135',
            images: Array(5).fill('/assets/img/catalog-page/card/card3.png'),
            thumbImages: ['/assets/img/catalog-page/card/mini/cardmini1.png', '/assets/img/catalog-page/card/mini/cardmini2.png', '/assets/img/catalog-page/card/mini/cardmini3.png'],
            badges: { hit: 'Хит продаж' }
        },
        {
            id: 3,
            title: 'NÖSUND',
            description: 'Потолочный светильник, белый, 44 см',
            price: '135',
            images: Array(5).fill('/assets/img/catalog-page/card/card3.png'),
            thumbImages: ['/assets/img/catalog-page/card/mini/cardmini1.png', '/assets/img/catalog-page/card/mini/cardmini2.png', '/assets/img/catalog-page/card/mini/cardmini3.png'],
            badges: { hit: 'Хит продаж' }
        },
                {
            id: 1,
            title: 'SLATTUM',
            description: 'Каркас кровати с обивкой, Vissle темно-серый, 140x200 см',
            price: '135',
            images: Array(5).fill('/assets/img/catalog-page/card/card1.png'),
            thumbImages: Array(5).fill('/assets/img/main-page/sales-hist/hits-1.png'),
            badges: { hit: 'Хит продаж', discount: '-10% промокод IKEYA' }
        },
        {
            id: 2,
            title: 'GRÄDVIS',
            description: 'Стакан, прозрачное стекло, 21 cl',
            price: '135',
            images: Array(5).fill('/assets/img/catalog-page/card/card2.png'),
            thumbImages: Array(5).fill('/assets/img/main-page/sales-hist/hits-1.png'),
            badges: { new: 'Новинка' }
        },
        {
            id: 3,
            title: 'NÖSUND',
            description: 'Потолочный светильник, белый, 44 см',
            price: '135',
            images: Array(5).fill('/assets/img/catalog-page/card/card3.png'),
            thumbImages: ['/assets/img/catalog-page/card/mini/cardmini1.png', '/assets/img/catalog-page/card/mini/cardmini2.png', '/assets/img/catalog-page/card/mini/cardmini3.png'],
            badges: { hit: 'Хит продаж' }
        },
        {
            id: 3,
            title: 'NÖSUND',
            description: 'Потолочный светильник, белый, 44 см',
            price: '135',
            images: Array(5).fill('/assets/img/catalog-page/card/card3.png'),
            thumbImages: ['/assets/img/catalog-page/card/mini/cardmini1.png', '/assets/img/catalog-page/card/mini/cardmini2.png', '/assets/img/catalog-page/card/mini/cardmini3.png'],
            badges: { hit: 'Хит продаж' }
        },
                {
            id: 1,
            title: 'SLATTUM',
            description: 'Каркас кровати с обивкой, Vissle темно-серый, 140x200 см',
            price: '135',
            images: Array(5).fill('/assets/img/catalog-page/card/card1.png'),
            thumbImages: Array(5).fill('/assets/img/main-page/sales-hist/hits-1.png'),
            badges: { hit: 'Хит продаж', discount: '-10% промокод IKEYA' }
        },
        {
            id: 2,
            title: 'GRÄDVIS',
            description: 'Стакан, прозрачное стекло, 21 cl',
            price: '135',
            images: Array(5).fill('/assets/img/catalog-page/card/card2.png'),
            thumbImages: Array(5).fill('/assets/img/main-page/sales-hist/hits-1.png'),
            badges: { new: 'Новинка' }
        },
        {
            id: 3,
            title: 'NÖSUND',
            description: 'Потолочный светильник, белый, 44 см',
            price: '135',
            images: Array(5).fill('/assets/img/catalog-page/card/card3.png'),
            thumbImages: ['/assets/img/catalog-page/card/mini/cardmini1.png', '/assets/img/catalog-page/card/mini/cardmini2.png', '/assets/img/catalog-page/card/mini/cardmini3.png'],
            badges: { hit: 'Хит продаж' }
        },
        {
            id: 3,
            title: 'NÖSUND',
            description: 'Потолочный светильник, белый, 44 см',
            price: '135',
            images: Array(5).fill('/assets/img/catalog-page/card/card3.png'),
            thumbImages: ['/assets/img/catalog-page/card/mini/cardmini1.png', '/assets/img/catalog-page/card/mini/cardmini2.png', '/assets/img/catalog-page/card/mini/cardmini3.png'],
            badges: { hit: 'Хит продаж' }
        },
                {
            id: 1,
            title: 'SLATTUM',
            description: 'Каркас кровати с обивкой, Vissle темно-серый, 140x200 см',
            price: '135',
            images: Array(5).fill('/assets/img/catalog-page/card/card1.png'),
            thumbImages: Array(5).fill('/assets/img/main-page/sales-hist/hits-1.png'),
            badges: { hit: 'Хит продаж', discount: '-10% промокод IKEYA' }
        },
        {
            id: 2,
            title: 'GRÄDVIS',
            description: 'Стакан, прозрачное стекло, 21 cl',
            price: '135',
            images: Array(5).fill('/assets/img/catalog-page/card/card2.png'),
            thumbImages: Array(5).fill('/assets/img/main-page/sales-hist/hits-1.png'),
            badges: { new: 'Новинка' }
        },
        {
            id: 3,
            title: 'NÖSUND',
            description: 'Потолочный светильник, белый, 44 см',
            price: '135',
            images: Array(5).fill('/assets/img/catalog-page/card/card3.png'),
            thumbImages: ['/assets/img/catalog-page/card/mini/cardmini1.png', '/assets/img/catalog-page/card/mini/cardmini2.png', '/assets/img/catalog-page/card/mini/cardmini3.png'],
            badges: { hit: 'Хит продаж' }
        },
        {
            id: 3,
            title: 'NÖSUND',
            description: 'Потолочный светильник, белый, 44 см',
            price: '135',
            images: Array(5).fill('/assets/img/catalog-page/card/card3.png'),
            thumbImages: ['/assets/img/catalog-page/card/mini/cardmini1.png', '/assets/img/catalog-page/card/mini/cardmini2.png', '/assets/img/catalog-page/card/mini/cardmini3.png'],
            badges: { hit: 'Хит продаж' }
        },
                {
            id: 1,
            title: 'SLATTUM',
            description: 'Каркас кровати с обивкой, Vissle темно-серый, 140x200 см',
            price: '135',
            images: Array(5).fill('/assets/img/catalog-page/card/card1.png'),
            thumbImages: Array(5).fill('/assets/img/main-page/sales-hist/hits-1.png'),
            badges: { hit: 'Хит продаж', discount: '-10% промокод IKEYA' }
        },
        {
            id: 2,
            title: 'GRÄDVIS',
            description: 'Стакан, прозрачное стекло, 21 cl',
            price: '135',
            images: Array(5).fill('/assets/img/catalog-page/card/card2.png'),
            thumbImages: Array(5).fill('/assets/img/main-page/sales-hist/hits-1.png'),
            badges: { new: 'Новинка' }
        },
        {
            id: 3,
            title: 'NÖSUND',
            description: 'Потолочный светильник, белый, 44 см',
            price: '135',
            images: Array(5).fill('/assets/img/catalog-page/card/card3.png'),
            thumbImages: ['/assets/img/catalog-page/card/mini/cardmini1.png', '/assets/img/catalog-page/card/mini/cardmini2.png', '/assets/img/catalog-page/card/mini/cardmini3.png'],
            badges: { hit: 'Хит продаж' }
        },
        {
            id: 3,
            title: 'NÖSUND',
            description: 'Потолочный светильник, белый, 44 см',
            price: '135',
            images: Array(5).fill('/assets/img/catalog-page/card/card3.png'),
            thumbImages: ['/assets/img/catalog-page/card/mini/cardmini1.png', '/assets/img/catalog-page/card/mini/cardmini2.png', '/assets/img/catalog-page/card/mini/cardmini3.png'],
            badges: { hit: 'Хит продаж' }
        },
                {
            id: 1,
            title: 'SLATTUM',
            description: 'Каркас кровати с обивкой, Vissle темно-серый, 140x200 см',
            price: '135',
            images: Array(5).fill('/assets/img/catalog-page/card/card1.png'),
            thumbImages: Array(5).fill('/assets/img/main-page/sales-hist/hits-1.png'),
            badges: { hit: 'Хит продаж', discount: '-10% промокод IKEYA' }
        },
        {
            id: 2,
            title: 'GRÄDVIS',
            description: 'Стакан, прозрачное стекло, 21 cl',
            price: '135',
            images: Array(5).fill('/assets/img/catalog-page/card/card2.png'),
            thumbImages: Array(5).fill('/assets/img/main-page/sales-hist/hits-1.png'),
            badges: { new: 'Новинка' }
        },
        {
            id: 3,
            title: 'NÖSUND',
            description: 'Потолочный светильник, белый, 44 см',
            price: '135',
            images: Array(5).fill('/assets/img/catalog-page/card/card3.png'),
            thumbImages: ['/assets/img/catalog-page/card/mini/cardmini1.png', '/assets/img/catalog-page/card/mini/cardmini2.png', '/assets/img/catalog-page/card/mini/cardmini3.png'],
            badges: { hit: 'Хит продаж' }
        },
        {
            id: 3,
            title: 'NÖSUND',
            description: 'Потолочный светильник, белый, 44 см',
            price: '135',
            images: Array(5).fill('/assets/img/catalog-page/card/card3.png'),
            thumbImages: ['/assets/img/catalog-page/card/mini/cardmini1.png', '/assets/img/catalog-page/card/mini/cardmini2.png', '/assets/img/catalog-page/card/mini/cardmini3.png'],
            badges: { hit: 'Хит продаж' }
        },
                {
            id: 1,
            title: 'SLATTUM',
            description: 'Каркас кровати с обивкой, Vissle темно-серый, 140x200 см',
            price: '135',
            images: Array(5).fill('/assets/img/catalog-page/card/card1.png'),
            thumbImages: Array(5).fill('/assets/img/main-page/sales-hist/hits-1.png'),
            badges: { hit: 'Хит продаж', discount: '-10% промокод IKEYA' }
        },
        {
            id: 2,
            title: 'GRÄDVIS',
            description: 'Стакан, прозрачное стекло, 21 cl',
            price: '135',
            images: Array(5).fill('/assets/img/catalog-page/card/card2.png'),
            thumbImages: Array(5).fill('/assets/img/main-page/sales-hist/hits-1.png'),
            badges: { new: 'Новинка' }
        },
        {
            id: 3,
            title: 'NÖSUND',
            description: 'Потолочный светильник, белый, 44 см',
            price: '135',
            images: Array(5).fill('/assets/img/catalog-page/card/card3.png'),
            thumbImages: ['/assets/img/catalog-page/card/mini/cardmini1.png', '/assets/img/catalog-page/card/mini/cardmini2.png', '/assets/img/catalog-page/card/mini/cardmini3.png'],
            badges: { hit: 'Хит продаж' }
        },
        {
            id: 3,
            title: 'NÖSUND',
            description: 'Потолочный светильник, белый, 44 см',
            price: '135',
            images: Array(5).fill('/assets/img/catalog-page/card/card3.png'),
            thumbImages: ['/assets/img/catalog-page/card/mini/cardmini1.png', '/assets/img/catalog-page/card/mini/cardmini2.png', '/assets/img/catalog-page/card/mini/cardmini3.png'],
            badges: { hit: 'Хит продаж' }
        }
    ];

    return (
        <>
            <main class="main catalog-inner">
                <Breadcrumbs items={breadcrumbItems} />

                <section className="all-catalog">
                    <div className="container">
                        <div className="row">
                            <div className="col-12">
                                <div className="all-catalog-inner">
                                    <FullCategoryFilter
                                        breadcrumbCategories={[
                                            { label: 'Сад и Балкон', href: `/catalog/${params.category}` },
                                            { label: 'Садовая и балконная мебель', href: `/catalog/${params.category}/${params.subcategory}` },
                                            { label: 'Садовая мебель', href: `/catalog/${params.category}/${params.subcategory}/${params.subsubcategory}` }
                                        ]}
                                        subcategories={subcategories}
                                    />

                                    <div className="all-catalog-cards">
                                        <CatalogSort />
                                        <FilterChips chips={[]} onRemove={() => { }} onClearAll={() => { }} />

                                        <div className="all-catalog-items">
                                            {products.map((product) => (
                                                <ProductCard key={product.id} {...product} />
                                            ))}
                                        </div>

                                        <Pagination
                                            currentPage={1}
                                            totalPages={16}
                                            itemsPerPage={20}
                                            totalItems={320}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </main>
        </>
    );
}
