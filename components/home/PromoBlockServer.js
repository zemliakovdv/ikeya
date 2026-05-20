// components/home/PromoBlockServer.js
import { IMAGES_BASE_URL } from '@/lib/api/ikea';
import PromoBlock from './PromoBlock';

const API_BASE_URL = 'https://test.ikeya.by/api/v1';

function resolveImageUrl(url) {
    if (!url) return null;

    if (url.startsWith('http')) {
        return url.replace(/^https?:\/\/[^/]+/, IMAGES_BASE_URL);
    }

    return `${IMAGES_BASE_URL}${url.startsWith('/') ? url : `/${url}`}`;
}

async function getCustomCategories() {
    try {
        const res = await fetch(`${API_BASE_URL}/categories/custom`, {
            next: { revalidate: 300 },
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
            next: { revalidate: 60 },
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
    const attr = product.attributes || {};

    const images = Array.isArray(attr.local_images)
        ? attr.local_images.map(resolveImageUrl).filter(Boolean)
        : [];

    const sku = attr.sku || product.id;
    const slug = attr.slug;

    return {
        id: product.id,
        sku,
        slug,
        title: attr.name_ru || attr.name || 'Без названия',
        description: attr.collection || attr.name_ru || '',
        price: attr.price_byn || attr.price || '0.00',
        images,
        badges: [
            attr.is_bestseller && 'hit',
            attr.is_popular && 'promo',
            attr.promo && 'promo',
        ].filter(Boolean),
        url: slug && sku ? `/product/${slug}-${sku}` : '#',
    };
}

export default async function PromoBlockServer() {
    const customCategories = await getCustomCategories();

    if (!customCategories.length) return null;

    const category = customCategories[0];
    const attr = category.attributes || {};

    const bannerImage = resolveImageUrl(attr.local_image_path || attr.background_image_url);
    const bannerUrl = attr.slug ? `/catalog/${attr.slug}` : '/catalog';

    const rawProducts = await getCategoryProducts(category.id);
    const products = rawProducts.map(mapProductToCard);

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