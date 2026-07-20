// components/home/PromoBlockServer.js
import { IMAGES_BASE_URL } from '@/lib/api/ikea';
import PromoBlock from './PromoBlock';

import { buildApiUrl } from '@/lib/config/api';

function resolveImageUrl(url) {
    if (!url) return null;

    if (url.startsWith('http')) {
        return url.replace(/^https?:\/\/[^/]+/, IMAGES_BASE_URL);
    }

    return `${IMAGES_BASE_URL}${url.startsWith('/') ? url : `/${url}`}`;
}

async function getCustomCategories() {
    try {
        const res = await fetch(buildApiUrl('/categories/custom'), {
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

export default async function PromoBlockServer() {
    const customCategories = await getCustomCategories();

    if (!customCategories.length) return null;

    const category = customCategories[0];
    const attr = category.attributes || {};

    const bannerImage = resolveImageUrl(attr.local_image_path || attr.background_image_url);
    const bannerUrl = attr.slug ? `/catalog/${attr.slug}` : '/catalog';

    if (!bannerImage) return null;

    return (
        <PromoBlock
            bannerImage={bannerImage}
            bannerUrl={bannerUrl}
            categoryName={attr.translated_name || attr.name_ru || attr.name}
        />
    );
}
