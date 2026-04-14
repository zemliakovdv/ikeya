// components/about/AboutAllInOne.js
import { getCachedCategoriesTree, IMAGES_BASE_URL } from '@/lib/api/ikea';
import AboutCategoriesSlider from '@/components/about/AboutCategoriesSlider';

const PLACEHOLDER_IMAGE = '/assets/img/main-page/popular-categories/popular-categories-1.png';

function resolveImageUrl(attr) {
  const candidates = [
    attr.icon_url,
    attr.background_image_url,
    attr.local_image_path,
    attr.remote_image_url,
  ];
  for (const url of candidates) {
    if (!url) continue;
    if (url.startsWith('http')) return url;
    return `${IMAGES_BASE_URL}${url.startsWith('/') ? url : '/' + url}`;
  }
  return PLACEHOLDER_IMAGE;
}

export default async function AboutAllInOne() {
  const tree = await getCachedCategoriesTree();

  // Берём только корневые категории (верхний уровень дерева)
  const categories = (tree || []).map((item) => {
    const attr = item.attributes;
    return {
      id:    item.id,
      name:  attr.translated_name || attr.name || 'Категория',
      image: resolveImageUrl(attr),
      url:   `/catalog/${attr.slug}`,
    };
  });

  return (
    <section className="allinone">
      <div className="container">
        <div className="row">
          <div className="col-12">
            <div className="allinone-inner">
              <h2 className="the_blues"><span>Формат</span> «Все в одном месте»</h2>
              <p className="allinone-description">
                Мы собрали мебель, текстиль, посуду, декор и многое другое —{' '}
                <strong>всё для вашего дома в одном магазине.</strong> Это экономит время и делает
                процесс покупки максимально удобным.
              </p>
              <AboutCategoriesSlider categories={categories} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}