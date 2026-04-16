// components/home/PromoBlockServer.js
import { IMAGES_BASE_URL } from '@/lib/api/ikea';
import PromoBlock from './PromoBlock';

const API_BASE_URL = 'https://test.ikeya.by/api/v1';

async function getCustomCategories() {
    try {
        const res = await fetch(`${API_BASE_URL}/categories/custom`, {
            next: { revalidate: 300 }
        });
        if (!res.ok) return [];
        const data = await res.json();
        return data.data || [];
    } catch (e) {
        console.error('Error fetching custom categories:', e);
        return [];
    }
}

async function getCategoryProducts(categoryId) {
    try {
        const res = await fetch(`${API_BASE_URL}/categories/${categoryId}/products?per_page=100`, {
            next: { revalidate: 60 }
        });
        if (!res.ok) return [];
        const data = await res.json();
        return data.data || [];
    } catch (e) {
        console.error(`Error fetching products for category ${categoryId}:`, e);
        return [];
    }
}

function mapProductToCard(product) {
    const attr = product.attributes;

    let images = [];
    if (Array.isArray(attr.local_images) && attr.local_images.length > 0) {
        images = attr.local_images.map(img =>
            `${IMAGES_BASE_URL}${img.startsWith('/') ? img : '/' + img}`
        );
    }

    return {
        id: product.id,
        sku: attr.sku,
        slug: attr.slug,
        title: attr.name_ru || attr.name || 'Без названия',
        description: attr.collection || attr.name_ru || '',
        price: attr.price ? `${parseFloat(attr.price).toFixed(2)}` : '0.00',
        images,
        badges: [
            attr.is_bestseller && 'hit',
            attr.is_popular && 'promo'
        ].filter(Boolean),
        url: `/product/${attr.slug}-${attr.sku}`,
    };
}

export default async function PromoBlockServer() {
    const customCategories = await getCustomCategories();

    if (!customCategories.length) return null;

    // Берём первую кастомную категорию
    const category = customCategories[0];
    const attr = category.attributes;

    // Баннер — берём local_image_path или background_image_url
    let bannerImage = null;
    if (attr.local_image_path) {
        const path = attr.local_image_path;
        bannerImage = path.startsWith('http')
            ? path
            : `https://test.ikeya.by${path.startsWith('/') ? '' : '/'}${path}`;
    } else if (attr.background_image_url) {
        const path = attr.background_image_url;
        // ✅ то же самое для background_image_url
        bannerImage = path.startsWith('http')
            ? path
            : `https://test.ikeya.by${path.startsWith('/') ? '' : '/'}${path}`;
    }


    // Ссылка баннера — на страницу категории
    const bannerUrl = `/catalog/${attr.slug}`;

    // Загружаем товары категории
    const rawProducts = await getCategoryProducts(category.id);
    const products = rawProducts.map(mapProductToCard);

    console.log('bannerImage:', bannerImage);
    console.log('local_image_path:', attr.local_image_path);


    if (!products.length) return null;

    return (
        <PromoBlock
            bannerImage={bannerImage}
            bannerUrl={bannerUrl}
            categoryName={attr.translated_name || attr.name}
            products={products}
        />
    );
}
