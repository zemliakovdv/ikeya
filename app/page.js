// app/page.js
import StartSlider from '@/components/home/StartSlider';
import PopularCategoriesSection from '@/components/home/PopularCategoriesSection';
import BestsellersSection from '@/components/home/BestsellersSection';
import ProductTabsSection from '@/components/home/ProductTabsSection';
import PromoBlock from '@/components/home/PromoBlock';
import AdsBanner from '@/components/home/AdsBanner';
import BlogSection from '@/components/home/BlogSection';
import SeoSection from '@/components/home/SeoSection';

// Данные для "Рекомендованные товары"
const recommendedTabs = [
  { id: 'lighting', label: 'Освещение' },
  { id: 'sofas', label: 'Диваны и кресла' },
  { id: 'lightin', label: 'Освещение' },
  { id: 'shkafy', label: 'Шкафы' },
  { id: 'komody', label: 'Комоды и тумбочки' },
  { id: 'hranenie', label: 'Системы хранения' },
  { id: 'sad', label: 'Сад и балкон' }
];

const recommendedProducts = {
  lighting: [
    {
      id: 'rec-beds-1',
      title: 'STOCKHOLM 2025',
      description: 'Стул, дуб/ротанг',
      price: '135.00',
      images: ['/assets/img/main-page/we-recomend/recomend-1.png'],
      badges: ['hit', 'promo'],
      url: '#'
    },
    {
      id: 'rec-beds-2',
      title: 'STOCKHOLM 2025',
      description: 'Стул, дуб/ротанг',
      price: '135.00',
      images: ['/assets/img/main-page/we-recomend/recomend-1.png'],
      badges: ['hit', 'promo'],
      url: '#'
    },
    {
      id: 'rec-beds-3',
      title: 'STOCKHOLM 2025',
      description: 'Стул, дуб/ротанг',
      price: '135.00',
      images: ['/assets/img/main-page/we-recomend/recomend-1.png'],
      badges: ['hit', 'promo'],
      url: '#'
    },
    {
      id: 'rec-beds-4',
      title: 'STOCKHOLM 2025',
      description: 'Стул, дуб/ротанг',
      price: '135.00',
      images: ['/assets/img/main-page/we-recomend/recomend-1.png'],
      badges: ['hit', 'promo'],
      url: '#'
    },
    {
      id: 'rec-beds-5',
      title: 'STOCKHOLM 2025',
      description: 'Стул, дуб/ротанг',
      price: '135.00',
      images: ['/assets/img/main-page/we-recomend/recomend-1.png'],
      badges: ['hit', 'promo'],
      url: '#'
    },
    {
      id: 'rec-beds-6',
      title: 'STOCKHOLM 2025',
      description: 'Стул, дуб/ротанг',
      price: '135.00',
      images: ['/assets/img/main-page/we-recomend/recomend-1.png'],
      badges: ['hit', 'promo'],
      url: '#'
    },
    {
      id: 'rec-beds-7',
      title: 'STOCKHOLM 2025',
      description: 'Стул, дуб/ротанг',
      price: '135.00',
      images: ['/assets/img/main-page/we-recomend/recomend-1.png'],
      badges: ['hit', 'promo'],
      url: '#'
    },
    {
      id: 'rec-beds-8',
      title: 'STOCKHOLM 2025',
      description: 'Стул, дуб/ротанг',
      price: '135.00',
      images: ['/assets/img/main-page/we-recomend/recomend-1.png'],
      badges: ['hit', 'promo'],
      url: '#'
    },
    {
      id: 'rec-beds-9',
      title: 'STOCKHOLM 2025',
      description: 'Стул, дуб/ротанг',
      price: '135.00',
      images: ['/assets/img/main-page/we-recomend/recomend-1.png'],
      badges: ['hit', 'promo'],
      url: '#'
    },
    {
      id: 'rec-beds-10',
      title: 'STOCKHOLM 2025',
      description: 'Стул, дуб/ротанг',
      price: '135.00',
      images: ['/assets/img/main-page/we-recomend/recomend-1.png'],
      badges: ['hit', 'promo'],
      url: '#'
    },
  ],
  sofas: [
    {
      id: 'rec-sofas-1',
      title: 'STOCKHOLM 2025',
      description: 'Стул, дуб/ротанг',
      price: '135.00',
      images: ['/assets/img/main-page/we-recomend/recomend-2.png'],
      badges: ['hit', 'promo'],
      url: '#'
    },
    {
      id: 'rec-sofas-2',
      title: 'STOCKHOLM 2025',
      description: 'Стул, дуб/ротанг',
      price: '135.00',
      images: ['/assets/img/main-page/we-recomend/recomend-2.png'],
      badges: ['hit', 'promo'],
      url: '#'
    },
    {
      id: 'rec-sofas-3',
      title: 'STOCKHOLM 2025',
      description: 'Стул, дуб/ротанг',
      price: '135.00',
      images: ['/assets/img/main-page/we-recomend/recomend-2.png'],
      badges: ['hit', 'promo'],
      url: '#'
    },
    {
      id: 'rec-sofas-4',
      title: 'STOCKHOLM 2025',
      description: 'Стул, дуб/ротанг',
      price: '135.00',
      images: ['/assets/img/main-page/we-recomend/recomend-2.png'],
      badges: ['hit', 'promo'],
      url: '#'
    },
    {
      id: 'rec-sofas-5',
      title: 'STOCKHOLM 2025',
      description: 'Стул, дуб/ротанг',
      price: '135.00',
      images: ['/assets/img/main-page/we-recomend/recomend-2.png'],
      badges: ['hit', 'promo'],
      url: '#'
    },
    {
      id: 'rec-sofas-6',
      title: 'STOCKHOLM 2025',
      description: 'Стул, дуб/ротанг',
      price: '135.00',
      images: ['/assets/img/main-page/we-recomend/recomend-2.png'],
      badges: ['hit', 'promo'],
      url: '#'
    },
    {
      id: 'rec-sofas-7',
      title: 'STOCKHOLM 2025',
      description: 'Стул, дуб/ротанг',
      price: '135.00',
      images: ['/assets/img/main-page/we-recomend/recomend-2.png'],
      badges: ['hit', 'promo'],
      url: '#'
    },
    {
      id: 'rec-sofas-8',
      title: 'STOCKHOLM 2025',
      description: 'Стул, дуб/ротанг',
      price: '135.00',
      images: ['/assets/img/main-page/we-recomend/recomend-2.png'],
      badges: ['hit', 'promo'],
      url: '#'
    },
    {
      id: 'rec-sofas-9',
      title: 'STOCKHOLM 2025',
      description: 'Стул, дуб/ротанг',
      price: '135.00',
      images: ['/assets/img/main-page/we-recomend/recomend-2.png'],
      badges: ['hit', 'promo'],
      url: '#'
    },
    {
      id: 'rec-sofas-10',
      title: 'STOCKHOLM 2025',
      description: 'Стул, дуб/ротанг',
      price: '135.00',
      images: ['/assets/img/main-page/we-recomend/recomend-2.png'],
      badges: ['hit', 'promo'],
      url: '#'
    },
  ],
  lightin: [
    {
      id: 'rec-beds-1',
      title: 'STOCKHOLM 2025',
      description: 'Стул, дуб/ротанг',
      price: '135.00',
      images: ['/assets/img/main-page/we-recomend/recomend-3.png'],
      badges: ['hit', 'promo'],
      url: '#'
    },
    {
      id: 'rec-beds-2',
      title: 'STOCKHOLM 2025',
      description: 'Стул, дуб/ротанг',
      price: '135.00',
      images: ['/assets/img/main-page/we-recomend/recomend-3.png'],
      badges: ['hit', 'promo'],
      url: '#'
    },
    {
      id: 'rec-beds-3',
      title: 'STOCKHOLM 2025',
      description: 'Стул, дуб/ротанг',
      price: '135.00',
      images: ['/assets/img/main-page/we-recomend/recomend-3.png'],
      badges: ['hit', 'promo'],
      url: '#'
    },
    {
      id: 'rec-beds-4',
      title: 'STOCKHOLM 2025',
      description: 'Стул, дуб/ротанг',
      price: '135.00',
      images: ['/assets/img/main-page/we-recomend/recomend-3.png'],
      badges: ['hit', 'promo'],
      url: '#'
    },
    {
      id: 'rec-beds-5',
      title: 'STOCKHOLM 2025',
      description: 'Стул, дуб/ротанг',
      price: '135.00',
      images: ['/assets/img/main-page/we-recomend/recomend-3.png'],
      badges: ['hit', 'promo'],
      url: '#'
    },
    {
      id: 'rec-beds-6',
      title: 'STOCKHOLM 2025',
      description: 'Стул, дуб/ротанг',
      price: '135.00',
      images: ['/assets/img/main-page/we-recomend/recomend-3.png'],
      badges: ['hit', 'promo'],
      url: '#'
    },
    {
      id: 'rec-beds-7',
      title: 'STOCKHOLM 2025',
      description: 'Стул, дуб/ротанг',
      price: '135.00',
      images: ['/assets/img/main-page/we-recomend/recomend-3.png'],
      badges: ['hit', 'promo'],
      url: '#'
    },
    {
      id: 'rec-beds-8',
      title: 'STOCKHOLM 2025',
      description: 'Стул, дуб/ротанг',
      price: '135.00',
      images: ['/assets/img/main-page/we-recomend/recomend-3.png'],
      badges: ['hit', 'promo'],
      url: '#'
    },
    {
      id: 'rec-beds-9',
      title: 'STOCKHOLM 2025',
      description: 'Стул, дуб/ротанг',
      price: '135.00',
      images: ['/assets/img/main-page/we-recomend/recomend-3.png'],
      badges: ['hit', 'promo'],
      url: '#'
    },
    {
      id: 'rec-beds-10',
      title: 'STOCKHOLM 2025',
      description: 'Стул, дуб/ротанг',
      price: '135.00',
      images: ['/assets/img/main-page/we-recomend/recomend-3.png'],
      badges: ['hit', 'promo'],
      url: '#'
    },
  ],
  shkafy: [
    {
      id: 'rec-beds-1',
      title: 'STOCKHOLM 2025',
      description: 'Стул, дуб/ротанг',
      price: '135.00',
      images: ['/assets/img/main-page/we-recomend/recomend-4.png'],
      badges: ['hit', 'promo'],
      url: '#'
    },
    {
      id: 'rec-beds-2',
      title: 'STOCKHOLM 2025',
      description: 'Стул, дуб/ротанг',
      price: '135.00',
      images: ['/assets/img/main-page/we-recomend/recomend-4.png'],
      badges: ['hit', 'promo'],
      url: '#'
    },
    {
      id: 'rec-beds-3',
      title: 'STOCKHOLM 2025',
      description: 'Стул, дуб/ротанг',
      price: '135.00',
      images: ['/assets/img/main-page/we-recomend/recomend-4.png'],
      badges: ['hit', 'promo'],
      url: '#'
    },
    {
      id: 'rec-beds-4',
      title: 'STOCKHOLM 2025',
      description: 'Стул, дуб/ротанг',
      price: '135.00',
      images: ['/assets/img/main-page/we-recomend/recomend-4.png'],
      badges: ['hit', 'promo'],
      url: '#'
    },
    {
      id: 'rec-beds-5',
      title: 'STOCKHOLM 2025',
      description: 'Стул, дуб/ротанг',
      price: '135.00',
      images: ['/assets/img/main-page/we-recomend/recomend-4.png'],
      badges: ['hit', 'promo'],
      url: '#'
    },
    {
      id: 'rec-beds-6',
      title: 'STOCKHOLM 2025',
      description: 'Стул, дуб/ротанг',
      price: '135.00',
      images: ['/assets/img/main-page/we-recomend/recomend-4.png'],
      badges: ['hit', 'promo'],
      url: '#'
    },
    {
      id: 'rec-beds-7',
      title: 'STOCKHOLM 2025',
      description: 'Стул, дуб/ротанг',
      price: '135.00',
      images: ['/assets/img/main-page/we-recomend/recomend-4.png'],
      badges: ['hit', 'promo'],
      url: '#'
    },
    {
      id: 'rec-beds-8',
      title: 'STOCKHOLM 2025',
      description: 'Стул, дуб/ротанг',
      price: '135.00',
      images: ['/assets/img/main-page/we-recomend/recomend-4.png'],
      badges: ['hit', 'promo'],
      url: '#'
    },
    {
      id: 'rec-beds-9',
      title: 'STOCKHOLM 2025',
      description: 'Стул, дуб/ротанг',
      price: '135.00',
      images: ['/assets/img/main-page/we-recomend/recomend-4.png'],
      badges: ['hit', 'promo'],
      url: '#'
    },
    {
      id: 'rec-beds-10',
      title: 'STOCKHOLM 2025',
      description: 'Стул, дуб/ротанг',
      price: '135.00',
      images: ['/assets/img/main-page/we-recomend/recomend-4.png'],
      badges: ['hit', 'promo'],
      url: '#'
    },
  ],
  komody: [
    {
      id: 'rec-beds-1',
      title: 'STOCKHOLM 2025',
      description: 'Стул, дуб/ротанг',
      price: '135.00',
      images: ['/assets/img/main-page/we-recomend/recomend-5.png'],
      badges: ['hit', 'promo'],
      url: '#'
    },
    {
      id: 'rec-beds-2',
      title: 'STOCKHOLM 2025',
      description: 'Стул, дуб/ротанг',
      price: '135.00',
      images: ['/assets/img/main-page/we-recomend/recomend-5.png'],
      badges: ['hit', 'promo'],
      url: '#'
    },
    {
      id: 'rec-beds-3',
      title: 'STOCKHOLM 2025',
      description: 'Стул, дуб/ротанг',
      price: '135.00',
      images: ['/assets/img/main-page/we-recomend/recomend-5.png'],
      badges: ['hit', 'promo'],
      url: '#'
    },
    {
      id: 'rec-beds-4',
      title: 'STOCKHOLM 2025',
      description: 'Стул, дуб/ротанг',
      price: '135.00',
      images: ['/assets/img/main-page/we-recomend/recomend-5.png'],
      badges: ['hit', 'promo'],
      url: '#'
    },
    {
      id: 'rec-beds-5',
      title: 'STOCKHOLM 2025',
      description: 'Стул, дуб/ротанг',
      price: '135.00',
      images: ['/assets/img/main-page/we-recomend/recomend-5.png'],
      badges: ['hit', 'promo'],
      url: '#'
    },
    {
      id: 'rec-beds-6',
      title: 'STOCKHOLM 2025',
      description: 'Стул, дуб/ротанг',
      price: '135.00',
      images: ['/assets/img/main-page/we-recomend/recomend-5.png'],
      badges: ['hit', 'promo'],
      url: '#'
    },
    {
      id: 'rec-beds-7',
      title: 'STOCKHOLM 2025',
      description: 'Стул, дуб/ротанг',
      price: '135.00',
      images: ['/assets/img/main-page/we-recomend/recomend-5.png'],
      badges: ['hit', 'promo'],
      url: '#'
    },
    {
      id: 'rec-beds-8',
      title: 'STOCKHOLM 2025',
      description: 'Стул, дуб/ротанг',
      price: '135.00',
      images: ['/assets/img/main-page/we-recomend/recomend-5.png'],
      badges: ['hit', 'promo'],
      url: '#'
    },
    {
      id: 'rec-beds-9',
      title: 'STOCKHOLM 2025',
      description: 'Стул, дуб/ротанг',
      price: '135.00',
      images: ['/assets/img/main-page/we-recomend/recomend-5.png'],
      badges: ['hit', 'promo'],
      url: '#'
    },
    {
      id: 'rec-beds-10',
      title: 'STOCKHOLM 2025',
      description: 'Стул, дуб/ротанг',
      price: '135.00',
      images: ['/assets/img/main-page/we-recomend/recomend-5.png'],
      badges: ['hit', 'promo'],
      url: '#'
    },
  ],
  hranenie: [
    {
      id: 'rec-beds-1',
      title: 'STOCKHOLM 2025',
      description: 'Стул, дуб/ротанг',
      price: '135.00',
      images: ['/assets/img/main-page/we-recomend/recomend-5.png'],
      badges: ['hit', 'promo'],
      url: '#'
    },
    {
      id: 'rec-beds-2',
      title: 'STOCKHOLM 2025',
      description: 'Стул, дуб/ротанг',
      price: '135.00',
      images: ['/assets/img/main-page/we-recomend/recomend-5.png'],
      badges: ['hit', 'promo'],
      url: '#'
    },
    {
      id: 'rec-beds-3',
      title: 'STOCKHOLM 2025',
      description: 'Стул, дуб/ротанг',
      price: '135.00',
      images: ['/assets/img/main-page/we-recomend/recomend-5.png'],
      badges: ['hit', 'promo'],
      url: '#'
    },
    {
      id: 'rec-beds-4',
      title: 'STOCKHOLM 2025',
      description: 'Стул, дуб/ротанг',
      price: '135.00',
      images: ['/assets/img/main-page/we-recomend/recomend-5.png'],
      badges: ['hit', 'promo'],
      url: '#'
    },
    {
      id: 'rec-beds-5',
      title: 'STOCKHOLM 2025',
      description: 'Стул, дуб/ротанг',
      price: '135.00',
      images: ['/assets/img/main-page/we-recomend/recomend-5.png'],
      badges: ['hit', 'promo'],
      url: '#'
    },
    {
      id: 'rec-beds-6',
      title: 'STOCKHOLM 2025',
      description: 'Стул, дуб/ротанг',
      price: '135.00',
      images: ['/assets/img/main-page/we-recomend/recomend-5.png'],
      badges: ['hit', 'promo'],
      url: '#'
    },
    {
      id: 'rec-beds-7',
      title: 'STOCKHOLM 2025',
      description: 'Стул, дуб/ротанг',
      price: '135.00',
      images: ['/assets/img/main-page/we-recomend/recomend-5.png'],
      badges: ['hit', 'promo'],
      url: '#'
    },
    {
      id: 'rec-beds-8',
      title: 'STOCKHOLM 2025',
      description: 'Стул, дуб/ротанг',
      price: '135.00',
      images: ['/assets/img/main-page/we-recomend/recomend-5.png'],
      badges: ['hit', 'promo'],
      url: '#'
    },
    {
      id: 'rec-beds-9',
      title: 'STOCKHOLM 2025',
      description: 'Стул, дуб/ротанг',
      price: '135.00',
      images: ['/assets/img/main-page/we-recomend/recomend-5.png'],
      badges: ['hit', 'promo'],
      url: '#'
    },
    {
      id: 'rec-beds-10',
      title: 'STOCKHOLM 2025',
      description: 'Стул, дуб/ротанг',
      price: '135.00',
      images: ['/assets/img/main-page/we-recomend/recomend-5.png'],
      badges: ['hit', 'promo'],
      url: '#'
    },
  ],
  sad: [
    {
      id: 'rec-beds-1',
      title: 'STOCKHOLM 2025',
      description: 'Стул, дуб/ротанг',
      price: '135.00',
      images: ['/assets/img/main-page/we-recomend/recomend-1.png'],
      badges: ['hit', 'promo'],
      url: '#'
    },
    {
      id: 'rec-beds-2',
      title: 'STOCKHOLM 2025',
      description: 'Стул, дуб/ротанг',
      price: '135.00',
      images: ['/assets/img/main-page/we-recomend/recomend-1.png'],
      badges: ['hit', 'promo'],
      url: '#'
    },
    {
      id: 'rec-beds-3',
      title: 'STOCKHOLM 2025',
      description: 'Стул, дуб/ротанг',
      price: '135.00',
      images: ['/assets/img/main-page/we-recomend/recomend-1.png'],
      badges: ['hit', 'promo'],
      url: '#'
    },
    {
      id: 'rec-beds-4',
      title: 'STOCKHOLM 2025',
      description: 'Стул, дуб/ротанг',
      price: '135.00',
      images: ['/assets/img/main-page/we-recomend/recomend-1.png'],
      badges: ['hit', 'promo'],
      url: '#'
    },
    {
      id: 'rec-beds-5',
      title: 'STOCKHOLM 2025',
      description: 'Стул, дуб/ротанг',
      price: '135.00',
      images: ['/assets/img/main-page/we-recomend/recomend-1.png'],
      badges: ['hit', 'promo'],
      url: '#'
    },
    {
      id: 'rec-beds-6',
      title: 'STOCKHOLM 2025',
      description: 'Стул, дуб/ротанг',
      price: '135.00',
      images: ['/assets/img/main-page/we-recomend/recomend-1.png'],
      badges: ['hit', 'promo'],
      url: '#'
    },
    {
      id: 'rec-beds-7',
      title: 'STOCKHOLM 2025',
      description: 'Стул, дуб/ротанг',
      price: '135.00',
      images: ['/assets/img/main-page/we-recomend/recomend-1.png'],
      badges: ['hit', 'promo'],
      url: '#'
    },
    {
      id: 'rec-beds-8',
      title: 'STOCKHOLM 2025',
      description: 'Стул, дуб/ротанг',
      price: '135.00',
      images: ['/assets/img/main-page/we-recomend/recomend-1.png'],
      badges: ['hit', 'promo'],
      url: '#'
    },
    {
      id: 'rec-beds-9',
      title: 'STOCKHOLM 2025',
      description: 'Стул, дуб/ротанг',
      price: '135.00',
      images: ['/assets/img/main-page/we-recomend/recomend-1.png'],
      badges: ['hit', 'promo'],
      url: '#'
    },
    {
      id: 'rec-beds-10',
      title: 'STOCKHOLM 2025',
      description: 'Стул, дуб/ротанг',
      price: '135.00',
      images: ['/assets/img/main-page/we-recomend/recomend-1.png'],
      badges: ['hit', 'promo'],
      url: '#'
    },
  ]
};

// Данные для "Новинки"
const newTabs = [
  { id: 'stoly', label: 'Столы и стулья' },
  { id: 'divany', label: 'Диваны и кресла' },
  { id: 'svet', label: 'Освещение' },
  { id: 'shkaf', label: 'Шкафы' },
  { id: 'tumba', label: 'Комоды и тумбочки' },
  { id: 'hron', label: 'Системы хранения' },
  { id: 'balkon', label: 'Сад и балкон' }
];

const newProducts = {
  stoly: [
    {
      id: 'new-stoly-1',
      title: 'STOCKHOLM 2025',
      description: 'Стул, дуб/ротанг',
      price: '135.00',
      images: [
        '/assets/img/main-page/news/new-1.png'],
      badges: ['hit', 'promo', 'new'],
      url: '#'
    },
    {
      id: 'new-stoly-2',
      title: 'STOCKHOLM 2025',
      description: 'Стул, дуб/ротанг',
      price: '135.00',
      images: [
        '/assets/img/main-page/news/new-1.png'],
      badges: ['hit', 'promo', 'new'],
      url: '#'
    },
    {
      id: 'new-stoly-3',
      title: 'STOCKHOLM 2025',
      description: 'Стул, дуб/ротанг',
      price: '135.00',
      images: [
        '/assets/img/main-page/news/new-1.png'],
      badges: ['hit', 'promo', 'new'],
      url: '#'
    },
    {
      id: 'new-stoly-4',
      title: 'STOCKHOLM 2025',
      description: 'Стул, дуб/ротанг',
      price: '135.00',
      images: [
        '/assets/img/main-page/news/new-1.png'],
      badges: ['hit', 'promo', 'new'],
      url: '#'
    },
    {
      id: 'new-stoly-5',
      title: 'STOCKHOLM 2025',
      description: 'Стул, дуб/ротанг',
      price: '135.00',
      images: [
        '/assets/img/main-page/news/new-1.png'],
      badges: ['hit', 'promo', 'new'],
      url: '#'
    },
    {
      id: 'new-stoly-6',
      title: 'STOCKHOLM 2025',
      description: 'Стул, дуб/ротанг',
      price: '135.00',
      images: [
        '/assets/img/main-page/news/new-1.png'],
      badges: ['hit', 'promo', 'new'],
      url: '#'
    },
    {
      id: 'new-stoly-7',
      title: 'STOCKHOLM 2025',
      description: 'Стул, дуб/ротанг',
      price: '135.00',
      images: [
        '/assets/img/main-page/news/new-1.png'],
      badges: ['hit', 'promo', 'new'],
      url: '#'
    },
    {
      id: 'new-stoly-8',
      title: 'STOCKHOLM 2025',
      description: 'Стул, дуб/ротанг',
      price: '135.00',
      images: [
        '/assets/img/main-page/news/new-1.png'],
      badges: ['hit', 'promo', 'new'],
      url: '#'
    },
    {
      id: 'new-stoly-9',
      title: 'STOCKHOLM 2025',
      description: 'Стул, дуб/ротанг',
      price: '135.00',
      images: [
        '/assets/img/main-page/news/new-1.png'],
      badges: ['hit', 'promo', 'new'],
      url: '#'
    },
    {
      id: 'new-stoly-10',
      title: 'STOCKHOLM 2025',
      description: 'Стул, дуб/ротанг',
      price: '135.00',
      images: [
        '/assets/img/main-page/news/new-1.png'],
      badges: ['hit', 'promo', 'new'],
      url: '#'
    },
  ],
  divany: [
    {
      id: 'new-beds-1',
      title: 'STOCKHOLM 2025',
      description: 'Стул, дуб/ротанг',
      price: '135.00',
      images: [
        '/assets/img/main-page/news/new-3.png'],
      badges: ['hit', 'promo', 'new'],
      url: '#'
    },
    {
      id: 'new-beds-1',
      title: 'STOCKHOLM 2025',
      description: 'Стул, дуб/ротанг',
      price: '135.00',
      images: [
        '/assets/img/main-page/news/new-3.png'],
      badges: ['hit', 'promo', 'new'],
      url: '#'
    },
    {
      id: 'new-beds-1',
      title: 'STOCKHOLM 2025',
      description: 'Стул, дуб/ротанг',
      price: '135.00',
      images: [
        '/assets/img/main-page/news/new-3.png'],
      badges: ['hit', 'promo', 'new'],
      url: '#'
    },
    {
      id: 'new-beds-1',
      title: 'STOCKHOLM 2025',
      description: 'Стул, дуб/ротанг',
      price: '135.00',
      images: [
        '/assets/img/main-page/news/new-3.png'],
      badges: ['hit', 'promo', 'new'],
      url: '#'
    },
    {
      id: 'new-beds-1',
      title: 'STOCKHOLM 2025',
      description: 'Стул, дуб/ротанг',
      price: '135.00',
      images: [
        '/assets/img/main-page/news/new-3.png'],
      badges: ['hit', 'promo', 'new'],
      url: '#'
    },
    {
      id: 'new-beds-1',
      title: 'STOCKHOLM 2025',
      description: 'Стул, дуб/ротанг',
      price: '135.00',
      images: [
        '/assets/img/main-page/news/new-3.png'],
      badges: ['hit', 'promo', 'new'],
      url: '#'
    },
    {
      id: 'new-beds-1',
      title: 'STOCKHOLM 2025',
      description: 'Стул, дуб/ротанг',
      price: '135.00',
      images: [
        '/assets/img/main-page/news/new-3.png'],
      badges: ['hit', 'promo', 'new'],
      url: '#'
    },
    {
      id: 'new-beds-1',
      title: 'STOCKHOLM 2025',
      description: 'Стул, дуб/ротанг',
      price: '135.00',
      images: [
        '/assets/img/main-page/news/new-3.png'],
      badges: ['hit', 'promo', 'new'],
      url: '#'
    },
    {
      id: 'new-beds-1',
      title: 'STOCKHOLM 2025',
      description: 'Стул, дуб/ротанг',
      price: '135.00',
      images: [
        '/assets/img/main-page/news/new-3.png'],
      badges: ['hit', 'promo', 'new'],
      url: '#'
    },
    {
      id: 'new-beds-1',
      title: 'STOCKHOLM 2025',
      description: 'Стул, дуб/ротанг',
      price: '135.00',
      images: [
        '/assets/img/main-page/news/new-3.png'],
      badges: ['hit', 'promo', 'new'],
      url: '#'
    }
  ],
  svet: [
    {
      id: 'new-beds-1',
      title: 'STOCKHOLM 2025',
      description: 'Стул, дуб/ротанг',
      price: '135.00',
      images: [
        '/assets/img/main-page/news/new-2.png'],
      badges: ['hit', 'promo', 'new'],
      url: '#'
    },
    {
      id: 'new-beds-1',
      title: 'STOCKHOLM 2025',
      description: 'Стул, дуб/ротанг',
      price: '135.00',
      images: [
        '/assets/img/main-page/news/new-2.png'],
      badges: ['hit', 'promo', 'new'],
      url: '#'
    },
    {
      id: 'new-beds-1',
      title: 'STOCKHOLM 2025',
      description: 'Стул, дуб/ротанг',
      price: '135.00',
      images: [
        '/assets/img/main-page/news/new-2.png'],
      badges: ['hit', 'promo', 'new'],
      url: '#'
    },
    {
      id: 'new-beds-1',
      title: 'STOCKHOLM 2025',
      description: 'Стул, дуб/ротанг',
      price: '135.00',
      images: [
        '/assets/img/main-page/news/new-2.png'],
      badges: ['hit', 'promo', 'new'],
      url: '#'
    },
    {
      id: 'new-beds-1',
      title: 'STOCKHOLM 2025',
      description: 'Стул, дуб/ротанг',
      price: '135.00',
      images: [
        '/assets/img/main-page/news/new-2.png'],
      badges: ['hit', 'promo', 'new'],
      url: '#'
    },
    {
      id: 'new-beds-1',
      title: 'STOCKHOLM 2025',
      description: 'Стул, дуб/ротанг',
      price: '135.00',
      images: [
        '/assets/img/main-page/news/new-2.png'],
      badges: ['hit', 'promo', 'new'],
      url: '#'
    },
    {
      id: 'new-beds-1',
      title: 'STOCKHOLM 2025',
      description: 'Стул, дуб/ротанг',
      price: '135.00',
      images: [
        '/assets/img/main-page/news/new-2.png'],
      badges: ['hit', 'promo', 'new'],
      url: '#'
    },
    {
      id: 'new-beds-1',
      title: 'STOCKHOLM 2025',
      description: 'Стул, дуб/ротанг',
      price: '135.00',
      images: [
        '/assets/img/main-page/news/new-2.png'],
      badges: ['hit', 'promo', 'new'],
      url: '#'
    },
    {
      id: 'new-beds-1',
      title: 'STOCKHOLM 2025',
      description: 'Стул, дуб/ротанг',
      price: '135.00',
      images: [
        '/assets/img/main-page/news/new-2.png'],
      badges: ['hit', 'promo', 'new'],
      url: '#'
    },
    {
      id: 'new-beds-1',
      title: 'STOCKHOLM 2025',
      description: 'Стул, дуб/ротанг',
      price: '135.00',
      images: [
        '/assets/img/main-page/news/new-2.png'],
      badges: ['hit', 'promo', 'new'],
      url: '#'
    }
  ],
  shkaf: [
    {
      id: 'new-beds-1',
      title: 'STOCKHOLM 2025',
      description: 'Стул, дуб/ротанг',
      price: '135.00',
      images: [
        '/assets/img/main-page/news/new-4.png'],
      badges: ['hit', 'promo', 'new'],
      url: '#'
    },
    {
      id: 'new-beds-1',
      title: 'STOCKHOLM 2025',
      description: 'Стул, дуб/ротанг',
      price: '135.00',
      images: [
        '/assets/img/main-page/news/new-4.png'],
      badges: ['hit', 'promo', 'new'],
      url: '#'
    },
    {
      id: 'new-beds-1',
      title: 'STOCKHOLM 2025',
      description: 'Стул, дуб/ротанг',
      price: '135.00',
      images: [
        '/assets/img/main-page/news/new-4.png'],
      badges: ['hit', 'promo', 'new'],
      url: '#'
    },
    {
      id: 'new-beds-1',
      title: 'STOCKHOLM 2025',
      description: 'Стул, дуб/ротанг',
      price: '135.00',
      images: [
        '/assets/img/main-page/news/new-4.png'],
      badges: ['hit', 'promo', 'new'],
      url: '#'
    },
    {
      id: 'new-beds-1',
      title: 'STOCKHOLM 2025',
      description: 'Стул, дуб/ротанг',
      price: '135.00',
      images: [
        '/assets/img/main-page/news/new-4.png'],
      badges: ['hit', 'promo', 'new'],
      url: '#'
    },
    {
      id: 'new-beds-1',
      title: 'STOCKHOLM 2025',
      description: 'Стул, дуб/ротанг',
      price: '135.00',
      images: [
        '/assets/img/main-page/news/new-4.png'],
      badges: ['hit', 'promo', 'new'],
      url: '#'
    },
    {
      id: 'new-beds-1',
      title: 'STOCKHOLM 2025',
      description: 'Стул, дуб/ротанг',
      price: '135.00',
      images: [
        '/assets/img/main-page/news/new-4.png'],
      badges: ['hit', 'promo', 'new'],
      url: '#'
    },
    {
      id: 'new-beds-1',
      title: 'STOCKHOLM 2025',
      description: 'Стул, дуб/ротанг',
      price: '135.00',
      images: [
        '/assets/img/main-page/news/new-4.png'],
      badges: ['hit', 'promo', 'new'],
      url: '#'
    },
    {
      id: 'new-beds-1',
      title: 'STOCKHOLM 2025',
      description: 'Стул, дуб/ротанг',
      price: '135.00',
      images: [
        '/assets/img/main-page/news/new-4.png'],
      badges: ['hit', 'promo', 'new'],
      url: '#'
    },
    {
      id: 'new-beds-1',
      title: 'STOCKHOLM 2025',
      description: 'Стул, дуб/ротанг',
      price: '135.00',
      images: [
        '/assets/img/main-page/news/new-4.png'],
      badges: ['hit', 'promo', 'new'],
      url: '#'
    }
  ],
  tumba: [
    {
      id: 'new-beds-1',
      title: 'STOCKHOLM 2025',
      description: 'Стул, дуб/ротанг',
      price: '135.00',
      images: [
        '/assets/img/main-page/news/new-5.png'],
      badges: ['hit', 'promo', 'new'],
      url: '#'
    },
    {
      id: 'new-beds-1',
      title: 'STOCKHOLM 2025',
      description: 'Стул, дуб/ротанг',
      price: '135.00',
      images: [
        '/assets/img/main-page/news/new-5.png'],
      badges: ['hit', 'promo', 'new'],
      url: '#'
    },
    {
      id: 'new-beds-1',
      title: 'STOCKHOLM 2025',
      description: 'Стул, дуб/ротанг',
      price: '135.00',
      images: [
        '/assets/img/main-page/news/new-5.png'],
      badges: ['hit', 'promo', 'new'],
      url: '#'
    },
    {
      id: 'new-beds-1',
      title: 'STOCKHOLM 2025',
      description: 'Стул, дуб/ротанг',
      price: '135.00',
      images: [
        '/assets/img/main-page/news/new-5.png'],
      badges: ['hit', 'promo', 'new'],
      url: '#'
    },
    {
      id: 'new-beds-1',
      title: 'STOCKHOLM 2025',
      description: 'Стул, дуб/ротанг',
      price: '135.00',
      images: [
        '/assets/img/main-page/news/new-5.png'],
      badges: ['hit', 'promo', 'new'],
      url: '#'
    },
    {
      id: 'new-beds-1',
      title: 'STOCKHOLM 2025',
      description: 'Стул, дуб/ротанг',
      price: '135.00',
      images: [
        '/assets/img/main-page/news/new-5.png'],
      badges: ['hit', 'promo', 'new'],
      url: '#'
    },
    {
      id: 'new-beds-1',
      title: 'STOCKHOLM 2025',
      description: 'Стул, дуб/ротанг',
      price: '135.00',
      images: [
        '/assets/img/main-page/news/new-5.png'],
      badges: ['hit', 'promo', 'new'],
      url: '#'
    },
    {
      id: 'new-beds-1',
      title: 'STOCKHOLM 2025',
      description: 'Стул, дуб/ротанг',
      price: '135.00',
      images: [
        '/assets/img/main-page/news/new-5.png'],
      badges: ['hit', 'promo', 'new'],
      url: '#'
    },
    {
      id: 'new-beds-1',
      title: 'STOCKHOLM 2025',
      description: 'Стул, дуб/ротанг',
      price: '135.00',
      images: [
        '/assets/img/main-page/news/new-5.png'],
      badges: ['hit', 'promo', 'new'],
      url: '#'
    },
    {
      id: 'new-beds-1',
      title: 'STOCKHOLM 2025',
      description: 'Стул, дуб/ротанг',
      price: '135.00',
      images: [
        '/assets/img/main-page/news/new-5.png'],
      badges: ['hit', 'promo', 'new'],
      url: '#'
    }
  ],
  hron: [
    {
      id: 'new-beds-1',
      title: 'STOCKHOLM 2025',
      description: 'Стул, дуб/ротанг',
      price: '135.00',
      images: [
        '/assets/img/main-page/news/new-2.png'],
      badges: ['hit', 'promo', 'new'],
      url: '#'
    },
    {
      id: 'new-beds-1',
      title: 'STOCKHOLM 2025',
      description: 'Стул, дуб/ротанг',
      price: '135.00',
      images: [
        '/assets/img/main-page/news/new-2.png'],
      badges: ['hit', 'promo', 'new'],
      url: '#'
    },
    {
      id: 'new-beds-1',
      title: 'STOCKHOLM 2025',
      description: 'Стул, дуб/ротанг',
      price: '135.00',
      images: [
        '/assets/img/main-page/news/new-2.png'],
      badges: ['hit', 'promo', 'new'],
      url: '#'
    },
    {
      id: 'new-beds-1',
      title: 'STOCKHOLM 2025',
      description: 'Стул, дуб/ротанг',
      price: '135.00',
      images: [
        '/assets/img/main-page/news/new-2.png'],
      badges: ['hit', 'promo', 'new'],
      url: '#'
    },
    {
      id: 'new-beds-1',
      title: 'STOCKHOLM 2025',
      description: 'Стул, дуб/ротанг',
      price: '135.00',
      images: [
        '/assets/img/main-page/news/new-2.png'],
      badges: ['hit', 'promo', 'new'],
      url: '#'
    },
    {
      id: 'new-beds-1',
      title: 'STOCKHOLM 2025',
      description: 'Стул, дуб/ротанг',
      price: '135.00',
      images: [
        '/assets/img/main-page/news/new-2.png'],
      badges: ['hit', 'promo', 'new'],
      url: '#'
    },
    {
      id: 'new-beds-1',
      title: 'STOCKHOLM 2025',
      description: 'Стул, дуб/ротанг',
      price: '135.00',
      images: [
        '/assets/img/main-page/news/new-2.png'],
      badges: ['hit', 'promo', 'new'],
      url: '#'
    },
    {
      id: 'new-beds-1',
      title: 'STOCKHOLM 2025',
      description: 'Стул, дуб/ротанг',
      price: '135.00',
      images: [
        '/assets/img/main-page/news/new-2.png'],
      badges: ['hit', 'promo', 'new'],
      url: '#'
    },
    {
      id: 'new-beds-1',
      title: 'STOCKHOLM 2025',
      description: 'Стул, дуб/ротанг',
      price: '135.00',
      images: [
        '/assets/img/main-page/news/new-2.png'],
      badges: ['hit', 'promo', 'new'],
      url: '#'
    },
    {
      id: 'new-beds-1',
      title: 'STOCKHOLM 2025',
      description: 'Стул, дуб/ротанг',
      price: '135.00',
      images: [
        '/assets/img/main-page/news/new-2.png'],
      badges: ['hit', 'promo', 'new'],
      url: '#'
    }
  ],
  balkon: [
    {
      id: 'new-beds-1',
      title: 'STOCKHOLM 2025',
      description: 'Стул, дуб/ротанг',
      price: '135.00',
      images: [
        '/assets/img/main-page/news/new-3.png'],
      badges: ['hit', 'promo', 'new'],
      url: '#'
    },
    {
      id: 'new-beds-1',
      title: 'STOCKHOLM 2025',
      description: 'Стул, дуб/ротанг',
      price: '135.00',
      images: [
        '/assets/img/main-page/news/new-3.png'],
      badges: ['hit', 'promo', 'new'],
      url: '#'
    },
    {
      id: 'new-beds-1',
      title: 'STOCKHOLM 2025',
      description: 'Стул, дуб/ротанг',
      price: '135.00',
      images: [
        '/assets/img/main-page/news/new-3.png'],
      badges: ['hit', 'promo', 'new'],
      url: '#'
    },
    {
      id: 'new-beds-1',
      title: 'STOCKHOLM 2025',
      description: 'Стул, дуб/ротанг',
      price: '135.00',
      images: [
        '/assets/img/main-page/news/new-3.png'],
      badges: ['hit', 'promo', 'new'],
      url: '#'
    },
    {
      id: 'new-beds-1',
      title: 'STOCKHOLM 2025',
      description: 'Стул, дуб/ротанг',
      price: '135.00',
      images: [
        '/assets/img/main-page/news/new-3.png'],
      badges: ['hit', 'promo', 'new'],
      url: '#'
    },
    {
      id: 'new-beds-1',
      title: 'STOCKHOLM 2025',
      description: 'Стул, дуб/ротанг',
      price: '135.00',
      images: [
        '/assets/img/main-page/news/new-3.png'],
      badges: ['hit', 'promo', 'new'],
      url: '#'
    },
    {
      id: 'new-beds-1',
      title: 'STOCKHOLM 2025',
      description: 'Стул, дуб/ротанг',
      price: '135.00',
      images: [
        '/assets/img/main-page/news/new-3.png'],
      badges: ['hit', 'promo', 'new'],
      url: '#'
    },
    {
      id: 'new-beds-1',
      title: 'STOCKHOLM 2025',
      description: 'Стул, дуб/ротанг',
      price: '135.00',
      images: [
        '/assets/img/main-page/news/new-3.png'],
      badges: ['hit', 'promo', 'new'],
      url: '#'
    },
    {
      id: 'new-beds-1',
      title: 'STOCKHOLM 2025',
      description: 'Стул, дуб/ротанг',
      price: '135.00',
      images: [
        '/assets/img/main-page/news/new-3.png'],
      badges: ['hit', 'promo', 'new'],
      url: '#'
    },
    {
      id: 'new-beds-1',
      title: 'STOCKHOLM 2025',
      description: 'Стул, дуб/ротанг',
      price: '135.00',
      images: [
        '/assets/img/main-page/news/new-3.png'],
      badges: ['hit', 'promo', 'new'],
      url: '#'
    }
  ]
};

export default function Home() {
  return (
    <main className="main">
      <StartSlider />
      <PopularCategoriesSection />

      {/* Хиты продаж */}
      <BestsellersSection />

      <PromoBlock />

      {/* Рекомендованные товары */}
      <ProductTabsSection
        title="Рекомендованные товары"
        tabs={recommendedTabs}
        tabProducts={recommendedProducts}
        sectionClass="recommended-tabs"
      />

      <AdsBanner />

      {/* Новинки */}
      <ProductTabsSection
        title="Новинки"
        tabs={newTabs}
        tabProducts={newProducts}
        sectionClass="new-tabs"
        showNewBadge={true}
      />

      <BlogSection />
      <SeoSection />
    </main>
  );
}
