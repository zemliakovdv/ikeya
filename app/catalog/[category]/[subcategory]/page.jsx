// app/catalog/[category]/[subcategory]/page.js
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import Modals from '@/components/Modals';
import Breadcrumbs from '@/components/Catalog/Breadcrumbs';
import CatalogCategories from '@/components/Catalog/CatalogCategories';
import FilterAside from '@/components/Catalog/FilterAside';
import ProductGrid from '@/components/Catalog/ProductGrid';
import SeoBlock from '@/components/Catalog/SeoBlock';

export async function generateMetadata({ params }) {
    const subcategoryName = params.subcategory.replace(/-/g, ' ');
    return {
        title: `${subcategoryName} - IKEYA`,
        description: `Каталог ${subcategoryName}`
    };
}

export default function SubcategoryPage({ params }) {
    const categorySlug = params.category;
    const subcategorySlug = params.subcategory;
    
    const categoryName = 'Сад и балкон';
    const subcategoryName = 'Уличная мебель';

    // Breadcrumbs (4 уровня)
    const breadcrumbs = [
        { label: 'Главная', href: '/' },
        { label: 'Каталог', href: '/catalog' },
        { label: categoryName, href: `/catalog/${categorySlug}` },
        { label: subcategoryName, href: `/catalog/${categorySlug}/${subcategorySlug}` }
    ];

    // Категории с активной подкатегорией
    const categories = [
        { label: 'Все товары', href: '/catalog', active: false },
        { label: categoryName, href: `/catalog/${categorySlug}`, active: false },
        { 
            label: subcategoryName, 
            href: `/catalog/${categorySlug}/${subcategorySlug}`, 
            active: true,
            hasSubcategory: true,
            subcategories: [
                { label: 'Столы уличные', href: '#', active: false },
                { label: 'Стулья уличные', href: '#', active: false },
                { label: 'Диваны уличные', href: '#', active: false },
                { label: 'Кресла уличные', href: '#', active: false },
                { label: 'Шезлонги', href: '#', active: false },
                { label: 'Лежаки', href: '#', active: false },
                { label: 'Качели', href: '#', active: false }
            ]
        }
    ];

    // Примененные фильтры
    const appliedFilters = [
        { label: 'SEGERN' },
        { label: '100 р. — 10 000 р.' },
        { label: 'Бежевый' }
    ];

    // Товары (24 карточки с другими изображениями)
    const products = Array.from({ length: 24 }, (_, i) => ({
        images: Array(5).fill(`/assets/img/catalog-page/category-view/view${i + 1}.png`),
        thumbnails: i % 2 === 0 ? [
            { src: '/assets/img/catalog-page/category-view/mini/viewmini1.png' },
            { src: '/assets/img/catalog-page/category-view/mini/viewmini2.png' },
            { src: '/assets/img/catalog-page/category-view/mini/viewmini3.png' }
        ] : [],
        title: ['REVSKR', 'GALTAPPEN', 'ASKHOLMEN', 'UTLNGAN'][i % 4],
        description: 'Садовый стул, складной серо-коричневый',
        price: '135',
        badges: {
            hit: i % 8 === 0,
            discount: '',
            new: false
        }
    }));

    return (
        <>
            <Header />
            
            <main className="main catalog-inner">
                <Breadcrumbs items={breadcrumbs} />
                
                {/* Коллекции скрыты */}
                <CatalogCategories show={false} />

                <section className="all-catalog">
                    <div className="container">
                        <div className="row">
                            <div className="col-12">
                                <h2>{subcategoryName}</h2>
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
