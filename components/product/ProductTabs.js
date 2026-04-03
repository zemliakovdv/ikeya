'use client';

import { useState, useEffect } from 'react';
import DescriptionTab from './tabs/DescriptionTab';
import SizesTab from './tabs/SizesTab';
import MaterialsTab from './tabs/MaterialsTab';
import ItemsTab from './tabs/ItemsTab';
import InstructionsTab from './tabs/InstructionsTab';
import ReviewsTab from './tabs/ReviewsTab';
import DeliveryTab from './tabs/DeliveryTab';
import AdvicesTab from './tabs/AdvicesTab';

export default function ProductTabs({ product }) {
  const attr = product.attributes;
  const fa = attr.full_attributes_ru || {};

  const hasDescription = Boolean(
    fa.description?.short_description ||
    (fa.description?.description && fa.description.description.length > 0)
  );
  const hasSizes        = Boolean(fa.size && Object.keys(fa.size).length > 0);
  const hasMaterials    = Boolean(fa.materials?.materials || fa.materials?.desc);
  const hasItems        = Boolean(attr.included_products && attr.included_products.length > 0);
  const hasInstructions = Boolean(fa.instructions?.files && fa.instructions.files.length > 0);
  const hasReviews      = Boolean(attr.rating_count && attr.rating_count > 0);
  const hasDelivery     = true;
  const tips            = Array.isArray(attr.tips) && attr.tips.length > 0 ? attr.tips : [];
  const hasAdvices      = tips.length > 0;

  const availableTabs = [
    hasDescription && 'description',
    hasSizes       && 'sizes',
    hasMaterials   && 'materials',
    hasItems       && 'items',
    hasInstructions && 'instructions',
    hasReviews     && 'reviews',
    hasDelivery    && 'delivery',
    hasAdvices     && 'advices',
  ].filter(Boolean);

  const [activeTab, setActiveTab] = useState(availableTabs[0] || 'delivery');

  useEffect(() => {
    if (availableTabs.length > 0 && !availableTabs.includes(activeTab)) {
      setActiveTab(availableTabs[0]);
    }
  }, []);

  return (
    <section className="character">
      <div className="container">
        <div className="row">
          <div className="col-12">
            <div className="character-inner">
              <div className="character-tabs">

                <nav className="character-tabs__nav">
                  <div className="nav nav-tabs character-nav__tabs">
                    {hasDescription  && <button className={`nav-link ${activeTab === 'description'  ? 'active' : ''}`} onClick={() => setActiveTab('description')}>Описание</button>}
                    {hasSizes        && <button className={`nav-link ${activeTab === 'sizes'        ? 'active' : ''}`} onClick={() => setActiveTab('sizes')}>Размеры</button>}
                    {hasMaterials    && <button className={`nav-link ${activeTab === 'materials'    ? 'active' : ''}`} onClick={() => setActiveTab('materials')}>Материалы и уход</button>}
                    {hasItems        && <button className={`nav-link ${activeTab === 'items'        ? 'active' : ''}`} onClick={() => setActiveTab('items')}>Предметы в наборе</button>}
                    {hasInstructions && <button className={`nav-link ${activeTab === 'instructions' ? 'active' : ''}`} onClick={() => setActiveTab('instructions')}>Инструкции</button>}
                    {hasReviews      && <button className={`nav-link ${activeTab === 'reviews'      ? 'active' : ''}`} onClick={() => setActiveTab('reviews')}>Отзывы {attr.rating_count > 0 && <span className="if_have_feed_count">{attr.rating_count}</span>}</button>}
                    {hasDelivery     && <button className={`nav-link ${activeTab === 'delivery'     ? 'active' : ''}`} onClick={() => setActiveTab('delivery')}>Услуги</button>}
                    {hasAdvices      && <button className={`nav-link ${activeTab === 'advices'      ? 'active' : ''}`} onClick={() => setActiveTab('advices')}>Советы</button>}
                  </div>
                </nav>

                <div className="tab-content character-tab__content">
                  {hasDescription  && activeTab === 'description'  && <DescriptionTab  product={product} />}
                  {hasSizes        && activeTab === 'sizes'        && <SizesTab        product={product} />}
                  {hasMaterials    && activeTab === 'materials'    && <MaterialsTab    product={product} />}
                  {hasItems        && activeTab === 'items'        && <ItemsTab        product={product} />}
                  {hasInstructions && activeTab === 'instructions' && <InstructionsTab product={product} />}
                  {hasReviews      && activeTab === 'reviews'      && <ReviewsTab      product={product} />}
                  {hasDelivery     && activeTab === 'delivery'     && <DeliveryTab     product={product} />}
                  {hasAdvices      && activeTab === 'advices'      && <AdvicesTab      tips={tips} />}
                </div>

              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}