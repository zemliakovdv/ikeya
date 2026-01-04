import Breadcrumbs from '../../../components/Breadcrumbs';
import ProductGallery from '../../../components/product/ProductGallery';
import ProductInfo from '../../../components/product/ProductInfo';
import ProductSlider from '../../../components/product/ProductSlider';
import ProductTabs from '../../../components/product/ProductTabs';
import DescriptionTab from '../../../components/product/tabs/DescriptionTab';
import SizesTab from '../../../components/product/tabs/SizesTab';
import MaterialsTab from '../../../components/product/tabs/MaterialsTab';
import ItemsTab from '../../../components/product/tabs/ItemsTab';
import InstructionsTab from '../../../components/product/tabs/InstructionsTab';
import ReviewsTab from '../../../components/product/tabs/ReviewsTab';
import DeliveryTab from '../../../components/product/tabs/DeliveryTab';
import AdvicesTab from '../../../components/product/tabs/AdvicesTab';

export default function ProductPage({ params }) {
  // Хлебные крошки
  const breadcrumbItems = [
    { label: 'Главная', href: '/' },
    { label: 'Каталог', href: '/catalog' },
    { label: 'Диваны и кресла', href: '/catalog/divany-i-kresla' },
    { label: 'Раскладные диваны', href: '/catalog/divany-i-kresla/raskladnye-divany' },
    { label: 'Раскладные угловые диваны', href: '/catalog/divany-i-kresla/raskladnye-divany/raskladnye-uglovye-divany' },
    { label: '3-местный диван-кровать', href: `/product/${params.slug}` }
  ];

  // Галерея
  const mainImages = Array(10).fill('/assets/img/catalog-card/maximum/maximum_1.png');
  const thumbnails = [
    '/assets/img/catalog-card/maximum/maximum_min_1.png',
    '/assets/img/catalog-card/maximum/maximum_min_2.png',
    '/assets/img/catalog-card/maximum/maximum_min_3.png',
    '/assets/img/catalog-card/maximum/maximum_min_4.png',
    '/assets/img/catalog-card/maximum/maximum_min_5.png',
    '/assets/img/catalog-card/maximum/maximum_min_6.png',
    '/assets/img/catalog-card/maximum/maximum_min_7.png',
    '/assets/img/catalog-card/maximum/maximum_min_3.png',
    '/assets/img/catalog-card/maximum/maximum_min_4.png',
    '/assets/img/catalog-card/maximum/maximum_min_5.png',
  ];

  // Данные товара
  const productData = {
    category: 'VIMLE',
    title: '3-местный диван-кровать с шезлонгом, с широкими подлокотниками Гуннаред/средний серый',
    sku: '695.452.87',
    rating: 4.5,
    reviewsCount: 645,
    badge: '-10% промокод IKEYA',
    price: '3 135',
    deliveryDays: 30,
    customsDuty: 65,
    selectedColor: 'С широкими подлокотниками Гуннаред/средний серый',
    colors: [
      '/assets/img/catalog-card/colors/color_1.jpg',
      '/assets/img/catalog-card/colors/color_2.jpg',
      '/assets/img/catalog-card/colors/color_3.jpg',
      '/assets/img/catalog-card/colors/color_4.jpg',
      '/assets/img/catalog-card/colors/color_5.jpg',
      '/assets/img/catalog-card/colors/color_6.jpg',
      '/assets/img/catalog-card/colors/color_7.jpg',
      '/assets/img/catalog-card/colors/color_8.jpg',
      '/assets/img/catalog-card/colors/color_9.jpg',
      '/assets/img/catalog-card/colors/color_10.jpg',
      '/assets/img/catalog-card/colors/color_11.jpg',
    ],
    sizes: [
      { name: '140x200', unit: 'см', price: 416.45, image: '/assets/img/catalog-card/sizes/size_1.png' },
      { name: '140x200', unit: 'см', price: -75.72, image: '/assets/img/catalog-card/sizes/size_1.png' },
      { name: '160x200', unit: 'см', price: 0, image: '/assets/img/catalog-card/sizes/size_1.png' },
      { name: '160x200', unit: 'см', price: 208.22, image: '/assets/img/catalog-card/sizes/size_1.png' },
      { name: '160x200', unit: 'см', price: 208.22, image: '/assets/img/catalog-card/sizes/size_1.png' },
      { name: '160x200', unit: 'см', price: 208.22, image: '/assets/img/catalog-card/sizes/size_1.png' },
    ],
    additions: [
      { id: 'Nogki', name: 'ножки', count: 3, selected: 'деревянный 10см' },
      { id: 'Gestkost', name: 'жесткость', count: 2, selected: 'жесткий' },
      { id: 'Matras', name: 'матрасы', count: 3, selected: 'Vågstranda' },
    ],
    features: [
      { name: 'Высота спинки', value: 68, unit: 'см' },
      { name: 'Ширина', value: 285, unit: 'см' },
      { name: 'Глубина', value: 98, unit: 'см' },
    ],
    collection: 'VIMLE'
  };

  // Детальные размеры для offcanvas
  const detailedSizes = [
    { label: 'Высота кровати', value: '53 см' },
    { label: 'Высота, включая подушки спинки', value: '83 см' },
    { label: 'Высота спинки', value: '68 см' },
    { label: 'Ширина', value: '285 см' },
    { label: 'Глубина', value: '98 см' },
    { label: 'Общая глубина в разложенном виде', value: '241 см' },
    { label: 'Глубина сиденья, козетка', value: '125 см' },
    { label: 'Ширина сиденья', value: '241 см' },
    { label: 'Глубина сиденья', value: '55 см' },
    { label: 'Высота сиденья', value: '48 см' },
    { label: 'Ширина кровати', value: '140 см' },
    { label: 'Длина кровати', value: '200 см' },
    { label: 'Толщина матраса', value: '12 см' },
    { label: 'Высота подлокотника', value: '54 см' },
  ];

  // К этому товару подходят
  const relatedProducts = Array(10).fill(null).map((_, i) => ({
    id: i + 1,
    title: 'SLATTUM',
    description: 'Каркас кровати с обивкой, Vissle темно-серый, 140x200 см',
    price: '135',
    images: Array(5).fill('/assets/img/main-page/sales-hist/hits-1.png'),
    thumbImages: [
      '/assets/img/main-page/sales-hist/hits-1.png',
      '/assets/img/main-page/sales-hist/hits-1.png',
      '/assets/img/main-page/sales-hist/hits-3.png',
    ],
    badges: { hit: 'Хит продаж', discount: '-10% промокод IKEYA' }
  }));

  // Похожие товары
  const similarProducts = Array(10).fill(null).map((_, i) => ({
    id: i + 11,
    title: 'GRÄDVIS',
    description: 'Стакан, прозрачное стекло, 21 cl',
    price: '135',
    images: Array(3).fill('/assets/img/main-page/sales-hist/hits-2.png'),
    thumbImages: [
      '/assets/img/main-page/sales-hist/hits-2.png',
      '/assets/img/main-page/sales-hist/hits-3.png',
    ],
    badges: { new: 'Новинка' }
  }));

  // Данные для табов
  const descriptionContent = [
    { text: 'Этот мягкий диван прослужит вам долго: наполнитель подушек сиденья сделан из высокоэластичного пенополиуретана, который обеспечивает оптимальную опору для тела и быстро восстанавливает свою первоначальную форму, как только вы встаете с дивана.' },
    { text: 'Секции можно комбинировать по-разному, чтобы получить диван нужных размера и формы.' },
    { text: 'Вы можете создать свою собственную идеальную комбинацию с помощью планировщика. Собирайте, разбирайте и снова компануйте, пока не найдете лучший вариант.' },
    { text: 'Уберите подушки сиденья и спинки, вытащите подрамник, и ваш диван быстро превратится в просторную, удобную кровать.' },
  ];

  const sizesData = [
    { label: 'Высота кровати', value: '53 см' },
    { label: 'Высота, включая подушки спинки', value: '83 см' },
    { label: 'Высота спинки', value: '68 см' },
    { label: 'Ширина', value: '285 см' },
    { label: 'Глубина', value: '98 см' },
    { label: 'Общая глубина в разложенном виде', value: '241 см' },
    { label: 'Глубина сиденья, козетка', value: '125 см' },
    { label: 'Ширина сиденья', value: '241 см' },
    { label: 'Глубина сиденья', value: '55 см' },
    { label: 'Высота сиденья', value: '48 см' },
    { label: 'Ширина кровати', value: '140 см' },
    { label: 'Длина кровати', value: '200 см' },
    { label: 'Толщина матраса', value: '12 см' },
    { label: 'Высота подлокотника', value: '54 см' },
  ];

  const packagesData = Array(10).fill(null).map((_, i) => ({
    title: `${i + 1} x механизм дивана-кровати SMEDSBYN`,
    details: [
      { label: 'Артикул', value: '004.176.21' },
      { label: 'Длина', value: '164 см' },
      { label: 'Ширина', value: '92 см' },
      { label: 'Высота', value: '30 см' },
      { label: 'Вес', value: '36,13 кг' },
      { label: 'Вес нетто', value: '36,13 кг' },
      { label: 'Объём упаковки', value: '448,8 л' },
    ]
  }));

  const materialsData = [
    { name: 'Каркас спинки', items: ['Фанера, Пенополиуретан 20 кг/куб.м, ДСП, Массив дерева, ДВП'] },
    { name: 'Передняя часть обвязки', items: ['Фанера, Пенополиуретан 20 кг/куб.м, ДСП'] },
    { name: 'Металлические части', items: ['Сталь'] },
    { name: 'Крепление', items: ['Ацеталь пластик'] },
    { name: 'Подкладка', items: ['100% полипропилен'] },
    { name: 'Спинная подушка', items: ['30% резаный пенополиуретан/ 70% полиэстерное волокно'] },
    { name: 'Подушка сиденья', items: ['Высокоэластичный пенополиуретан (холодный) 35 кг/куб.м'] },
  ];

  const careData = [
    { 
      title: 'Уход за чехлом',
      instructions: [
        'Машинная стирка при 40°C',
        'Не отбеливать',
        'Не использовать барабанную сушку',
        'Гладить при средней температуре',
      ]
    }
  ];

  const itemsData = Array(8).fill(null).map((_, i) => ({
    image: '/assets/img/catalog-card/place-hold.png',
    title: 'VIMLE',
    description: '2-местный диван, Гуннаред средний серый',
    badge: '-10% промокод IKEYA'
  }));

  const assemblyFiles = [
    { title: 'VIMLE 2-местный диван', sku: '604.895.49' },
    { title: 'VIMLE 2-местный диван', sku: '604.895.49' },
    { title: 'VIMLE 2-местный диван', sku: '604.895.49' },
    { title: 'VIMLE 2-местный диван', sku: '604.895.49' },
    { title: 'VIMLE 2-местный диван', sku: '604.895.49' },
  ];

  const recommendationsFiles = [
    { title: 'Уход за мебелью VIMLE', sku: '604.895.49' },
    { title: 'Рекомендации по эксплуатации', sku: '604.895.49' },
  ];

  const advicesData = [
    {
      image: '/assets/img/catalog-card/advices/advice_1.png',
      title: 'Диван-кровать: комфортное спальное место',
      description: 'Сон на диване может быть удобным! Достаточно правильно выбрать и обустроить спальное место.',
      link: '#'
    },
    {
      image: '/assets/img/catalog-card/advices/advice_2.png',
      title: 'Диваны, на которых можно спать каждый день',
      description: 'Диван, на котором можно спать каждый день, имеет упругое, плотное и в меру мягкое основание без выраженных неровностей — иначе будет болеть спина.',
      link: '#'
    },
    {
      image: '/assets/img/catalog-card/advices/advice_3.png',
      title: 'Если дома живет питомец',
      description: 'Среди милых домашних любимцев зачастую попадаются настоящие хулиганы. Острые когти могут оставить на диване неприятные царапины и затяжки. Так какой же диван выбрать?',
      link: '#'
    },
    {
      image: '/assets/img/catalog-card/advices/advice_4.png',
      title: 'Велюр для мебели: плюсы и минусы, виды, рекомендации по уходу',
      description: 'Рассмотрим, какие бывают виды велюра, особенности ткани и рекомендации по уходу за мебелью с такой обивкой.',
      link: '#'
    },
  ];

  // Табы
  const tabs = [
    {
      id: 'description',
      label: 'Описание',
      enabled: true,
      content: <DescriptionTab content={descriptionContent} designer="Ehlén Johansson/Paulin Machado" />
    },
    {
      id: 'size',
      label: 'Размеры',
      enabled: true,
      content: <SizesTab sizes={sizesData} packages={packagesData} image="/assets/img/catalog-card/cherteg.png" />
    },
    {
      id: 'material',
      label: 'Материалы и уход',
      enabled: true,
      content: <MaterialsTab materials={materialsData} care={careData} />
    },
    {
      id: 'predmety',
      label: 'Предметы в наборе',
      enabled: true,
      content: <ItemsTab items={itemsData} />
    },
    {
      id: 'instructions',
      label: 'Инструкции',
      enabled: true,
      content: <InstructionsTab assembly={assemblyFiles} recommendations={recommendationsFiles} />
    },
    {
      id: 'feedback',
      label: 'Отзывы',
      count: 645,
      enabled: true,
      content: <ReviewsTab />
    },
    {
      id: 'delivery',
      label: 'Услуги и доставка',
      enabled: true,
      content: <DeliveryTab showMinskServices={true} />
    },
    {
      id: 'advices',
      label: 'Советы',
      enabled: true,
      content: <AdvicesTab advices={advicesData} />
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
                  showColors={true}
                  showSizes={true}
                  showAdditions={true}
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
