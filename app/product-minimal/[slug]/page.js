import Breadcrumbs from '../../../components/Breadcrumbs';
import ProductGallery from '../../../components/product/ProductGallery';
import ProductInfo from '../../../components/product/ProductInfo';
import ProductSlider from '../../../components/product/ProductSlider';
import ProductTabs from '../../../components/product/ProductTabs';
import DescriptionTab from '../../../components/product/tabs/DescriptionTab';
import SizesTab from '../../../components/product/tabs/SizesTab';
import MaterialsTab from '../../../components/product/tabs/MaterialsTab';
import ReviewsTab from '../../../components/product/tabs/ReviewsTab';
import DeliveryTab from '../../../components/product/tabs/DeliveryTab';

export default function ProductMinimalPage({ params }) {
  // Хлебные крошки
  const breadcrumbItems = [
    { label: 'Главная', href: '/' },
    { label: 'Каталог', href: '/catalog' },
    { label: 'Товары для дома', href: '/catalog/tovary-dlya-doma' },
    { label: 'Текстиль', href: '/catalog/tovary-dlya-doma/tekstil' },
    { label: 'Постельное белье', href: `/product-minimal/${params.slug}` }
  ];

  // Галерея
  const mainImages = Array(5).fill('/assets/img/catalog-card/maximum/maximum_1.png');
  const thumbnails = [
    '/assets/img/catalog-card/maximum/maximum_min_1.png',
    '/assets/img/catalog-card/maximum/maximum_min_2.png',
    '/assets/img/catalog-card/maximum/maximum_min_3.png',
    '/assets/img/catalog-card/maximum/maximum_min_4.png',
    '/assets/img/catalog-card/maximum/maximum_min_5.png',
  ];

  // Данные товара (минимальная версия)
  const productData = {
    category: 'ÄNGSLILJA',
    title: 'Пододеяльник и 2 наволочки, белый/серый, 200x200/50x70 см',
    sku: '904.921.37',
    rating: 4.3,
    reviewsCount: 128,
    badge: null, // Без промокода
    price: '89',
    deliveryDays: 14,
    customsDuty: 15,
    features: [
      { name: 'Длина', value: 200, unit: 'см' },
      { name: 'Ширина', value: 200, unit: 'см' },
      { name: 'Количество в упаковке', value: 3, unit: 'шт' },
    ],
    collection: 'ÄNGSLILJA'
  };

  // Детальные размеры для offcanvas
  const detailedSizes = [
    { label: 'Длина пододеяльника', value: '200 см' },
    { label: 'Ширина пододеяльника', value: '200 см' },
    { label: 'Длина наволочки', value: '70 см' },
    { label: 'Ширина наволочки', value: '50 см' },
    { label: 'Количество наволочек', value: '2 шт' },
    { label: 'Плотность ткани', value: '125 нитей/кв.дюйм' },
  ];

  // К этому товару подходят
  const relatedProducts = Array(10).fill(null).map((_, i) => ({
    id: i + 1,
    title: 'DVALA',
    description: 'Простыня натяжная, белая, 160x200 см',
    price: '45',
    images: Array(3).fill('/assets/img/main-page/sales-hist/hits-1.png'),
    thumbImages: ['/assets/img/main-page/sales-hist/hits-1.png'],
    badges: { hit: 'Хит продаж' }
  }));

  // Похожие товары
  const similarProducts = Array(10).fill(null).map((_, i) => ({
    id: i + 11,
    title: 'LUKTJASMIN',
    description: 'Пододеяльник и 2 наволочки, белый/серый, 200x200/50x70 см',
    price: '95',
    images: Array(3).fill('/assets/img/main-page/sales-hist/hits-2.png'),
    thumbImages: ['/assets/img/main-page/sales-hist/hits-2.png'],
    badges: { new: 'Новинка' }
  }));

  // Данные для табов
  const descriptionContent = [
    { text: 'Качественное постельное белье из 100% хлопка для комфортного сна.' },
    { text: 'Материал мягкий и приятный к телу, позволяет коже дышать и хорошо впитывает влагу.' },
    { text: 'Благодаря высокой плотности ткани постельное белье прослужит много лет.' },
    { text: 'Застежка на пуговицы удерживает одеяло внутри пододеяльника.' },
  ];

  const sizesData = [
    { label: 'Длина пододеяльника', value: '200 см' },
    { label: 'Ширина пододеяльника', value: '200 см' },
    { label: 'Длина наволочки', value: '70 см' },
    { label: 'Ширина наволочки', value: '50 см' },
    { label: 'Количество наволочек', value: '2 шт' },
    { label: 'Плотность ткани', value: '125 нитей/кв.дюйм' },
  ];

  const packagesData = [
    {
      title: '1 x комплект постельного белья ÄNGSLILJA',
      details: [
        { label: 'Артикул', value: '904.921.37' },
        { label: 'Длина', value: '28 см' },
        { label: 'Ширина', value: '25 см' },
        { label: 'Высота', value: '8 см' },
        { label: 'Вес', value: '1,85 кг' },
        { label: 'Объём упаковки', value: '5,6 л' },
      ]
    }
  ];

  const materialsData = [
    { name: 'Ткань', items: ['100% хлопок'] },
    { name: 'Плотность ткани', items: ['125 нитей/кв.дюйм'] },
  ];

  const careData = [
    { 
      title: 'Уход',
      instructions: [
        'Машинная стирка при 60°C (обычная программа)',
        'Можно отбеливать (только средства без хлора)',
        'Не использовать барабанную сушку',
        'Гладить при высокой температуре (макс. 200°C)',
        'Не подвергать химической чистке',
      ]
    }
  ];

  // Табы (только 5 штук)
  const tabs = [
    {
      id: 'description',
      label: 'Описание',
      enabled: true,
      content: <DescriptionTab content={descriptionContent} designer="IKEA of Sweden" />
    },
    {
      id: 'size',
      label: 'Размеры',
      enabled: true,
      content: <SizesTab sizes={sizesData} packages={packagesData} image={null} />
    },
    {
      id: 'material',
      label: 'Материалы и уход',
      enabled: true,
      content: <MaterialsTab materials={materialsData} care={careData} />
    },
    {
      id: 'feedback',
      label: 'Отзывы',
      count: 128,
      enabled: true,
      content: <ReviewsTab />
    },
    {
      id: 'delivery',
      label: 'Услуги и доставка',
      enabled: true,
      content: <DeliveryTab showMinskServices={false} />
    },
  ];

  return (
    <main className="shop-card">
      {/* Хлебные крошки */}
      <Breadcrumbs items={breadcrumbItems} />

      {/* Основной блок товара */}
      <section className="goods">
        <div className="container">
          <div className="row">
            <div className="col-12">
              <div className="goods-wrapper">
                <ProductGallery images={mainImages} thumbnails={thumbnails} />
                <ProductInfo 
                  product={productData}
                  detailedSizes={detailedSizes}
                  showColors={false}
                  showSizes={false}
                  showAdditions={false}
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* К этому товару подходят */}
      <ProductSlider 
        title="К этому товару подходят" 
        products={relatedProducts}
        className="more"
      />

      {/* Табы с характеристиками */}
      <ProductTabs tabs={tabs} />

      {/* Похожие товары */}
      <ProductSlider 
        title="Похожие товары" 
        products={similarProducts}
        className="same"
      />
    </main>
  );
}
