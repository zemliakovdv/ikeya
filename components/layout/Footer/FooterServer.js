// components/layout/Footer/FooterServer.js
import Footer from './Footer';

const API_BASE = 'https://test.ikeya.by';

export default async function FooterServer() {
  let categoryLinks = [];

  try {
    const res = await fetch(`${API_BASE}/api/v1/categories/tree`, {
      next: { revalidate: 300 },
    });

    if (res.ok) {
      const data = await res.json();
      const roots = (data.data || []).filter((cat) => {
        const parentIds = cat.attributes?.parent_ids;
        return !parentIds || parentIds.length === 0;
      });

      categoryLinks = roots.slice(0, 5).map((cat) => ({
        name: cat.attributes?.translated_name || cat.attributes?.name || 'Категория',
        href: `/catalog/${cat.attributes?.slug || cat.id}/`,
      }));
    }
  } catch (e) {
    console.error('FooterServer: ошибка загрузки категорий', e);
  }

  return <Footer categoryLinks={categoryLinks} />;
}