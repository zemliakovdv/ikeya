// components/home/BestsellersSection.js
import { getBestsellers } from '@/lib/api/ikea';
import ProductTabsSection from '@/components/home/ProductTabsSection';

export default async function BestsellersSection() {
    const bestsellersResponse = await getBestsellers(1, 20);

    const salesProducts = {
        all: bestsellersResponse.data.map(item => {
            const attr = item.attributes;

            let imgs = attr.local_images || attr.images || [];
            if (typeof imgs === 'string') {
                try {
                    imgs = JSON.parse(imgs);
                } catch (e) {
                    imgs = [];
                }
            }
            if (!Array.isArray(imgs)) imgs = [];
            const images = imgs.map(img => {
                if (img.startsWith('http')) return img;
                if (img.startsWith('/')) return `http://45.135.234.22${img}`;
                return `http://45.135.234.22/${img}`;
            });

            return {
                id: item.id,
                title: attr.name || attr.name_ru,
                description: attr.collection || '',
                price: attr.price ? Number(attr.price).toFixed(2) : '0.00',
                images: images,
                badges: [
                    attr.is_bestseller ? 'hit' : null,
                    attr.is_popular ? 'promo' : null
                ].filter(Boolean),
                url: `/product/${attr.sku}`
            };
        })
    };

    const salesTabs = [
        { id: 'all', label: 'Все товары' }
    ];

    return (
        <ProductTabsSection
            title="Хиты продаж"
            tabs={salesTabs}
            tabProducts={salesProducts}
            sectionClass="sales-tabs"
        />
    );
}
