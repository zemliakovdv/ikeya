'use client';

import { useEffect, useMemo, useState } from 'react';
import DescriptionTab from './tabs/DescriptionTab';
import SizesTab from './tabs/SizesTab';
import MaterialsTab from './tabs/MaterialsTab';
import ItemsTab from './tabs/ItemsTab';
import InstructionsTab from './tabs/InstructionsTab';
import ReviewsTab from './tabs/ReviewsTab';
import DeliveryTab from './tabs/DeliveryTab';
import AdvicesTab from './tabs/AdvicesTab';

const TAB_LABELS = {
  description: 'Описание',
  sizes: 'Размеры',
  materials: 'Материалы и уход',
  items: 'Предметы в наборе',
  instructions: 'Инструкции',
  reviews: 'Отзывы',
  delivery: 'Услуги и доставка',
  advices: 'Советы',
};

function TabContent({ tab, product, includedProducts, tips }) {
  if (tab === 'description') return <DescriptionTab product={product} />;
  if (tab === 'sizes') return <SizesTab product={product} />;
  if (tab === 'materials') return <MaterialsTab product={product} />;
  if (tab === 'items') return <ItemsTab product={includedProducts} includedProducts={includedProducts} />;
  if (tab === 'instructions') return <InstructionsTab product={product} />;
  if (tab === 'reviews') return <ReviewsTab product={product} />;
  if (tab === 'delivery') return <DeliveryTab product={product} />;
  if (tab === 'advices') return <AdvicesTab tips={tips} />;

  return null;
}

export default function ProductTabs({ product, includedProducts = [] }) {
  const attr = product.attributes;
  const fa = attr.full_attributes_ru || {};

  const tips = Array.isArray(attr.tips) && attr.tips.length > 0 ? attr.tips : [];

  const tabs = useMemo(() => {
    const hasDescription = Boolean(
      fa.description?.short_description ||
      (fa.description?.description && fa.description.description.length > 0)
    );

    const hasSizes = Boolean(fa.size && Object.keys(fa.size).length > 0);
    const hasMaterials = Boolean(fa.materials?.materials || fa.materials?.desc);
    const hasItems = Boolean(attr.included_products && attr.included_products.length > 0);
    const hasInstructions = Boolean(fa.instructions?.files && fa.instructions.files.length > 0);
    const hasReviews = Boolean(attr.rating_count && attr.rating_count > 0);
    const hasDelivery = true;
    const hasAdvices = tips.length > 0;

    return [
      hasDescription && 'description',
      hasSizes && 'sizes',
      hasMaterials && 'materials',
      hasItems && 'items',
      hasInstructions && 'instructions',
      hasReviews && 'reviews',
      hasDelivery && 'delivery',
      hasAdvices && 'advices',
    ].filter(Boolean);
  }, [attr.included_products, attr.rating_count, fa, tips.length]);

  const [activeTab, setActiveTab] = useState(tabs[0] || 'delivery');
  const [mobilePanelOpen, setMobilePanelOpen] = useState(false);

  useEffect(() => {
    if (tabs.length > 0 && !tabs.includes(activeTab)) {
      setActiveTab(tabs[0]);
    }
  }, [tabs, activeTab]);

  useEffect(() => {
    if (!mobilePanelOpen) return;

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        setMobilePanelOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [mobilePanelOpen]);

  const openMobilePanel = (tab) => {
    setActiveTab(tab);
    setMobilePanelOpen(true);
  };

  if (!tabs.length) return null;

  return (
    <section className="character">
      <div className="container">
        <div className="row">
          <div className="col-12">
            <div className="character-inner">
              <div className="character-tabs">

                <div className="product-mobile-tabs-list">
                  {tabs.map((tab) => (
                    <button
                      key={tab}
                      className="product-mobile-tabs-list__item"
                      type="button"
                      onClick={() => openMobilePanel(tab)}
                    >
                      <span>
                        {tab === 'reviews' && attr.rating_count > 0
                          ? `${TAB_LABELS[tab]} ${attr.rating_count}`
                          : TAB_LABELS[tab]}
                      </span>

                      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
                        <path
                          d="M12.775 10.0007C12.775 10.9341 10.2417 13.1674 8.125 14.8757C7.88334 15.0674 7.53334 15.0341 7.34167 14.7924C7.15 14.5507 7.18333 14.2007 7.425 14.0091C9.28333 12.5091 11.375 10.5924 11.65 10.0007C11.375 9.40906 9.28333 7.49239 7.425 5.99239C7.18333 5.80073 7.15 5.45073 7.34167 5.20906C7.53334 4.96739 7.88334 4.93406 8.125 5.12573C10.25 6.83406 12.775 9.07573 12.775 10.0007Z"
                          fill="currentColor"
                        />
                      </svg>
                    </button>
                  ))}
                </div>

                <div className="product-desktop-tabs">
                  <nav className="character-tabs__nav">
                    <div className="nav nav-tabs character-nav__tabs">
                      {tabs.map((tab) => (
                        <button
                          key={tab}
                          className={`nav-link ${activeTab === tab ? 'active' : ''}`}
                          type="button"
                          onClick={() => setActiveTab(tab)}
                        >
                          {TAB_LABELS[tab]}
                          {tab === 'reviews' && attr.rating_count > 0 && (
                            <span className="if_have_feed_count">{attr.rating_count}</span>
                          )}
                        </button>
                      ))}
                    </div>
                  </nav>

                  <div className="tab-content character-tab__content">
                    <TabContent
                      tab={activeTab}
                      product={product}
                      includedProducts={includedProducts}
                      tips={tips}
                    />
                  </div>
                </div>

                {mobilePanelOpen && (
                  <div className="product-mobile-tabs-panel" role="dialog" aria-modal="true" aria-label="О товаре">
                    <div className="product-mobile-tabs-panel__header">
                      <h2>О товаре</h2>
                      <button
                        className="product-mobile-tabs-panel__close"
                        type="button"
                        aria-label="Закрыть"
                        onClick={() => setMobilePanelOpen(false)}
                      >
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                          <path
                            d="M6 6L18 18M18 6L6 18"
                            stroke="currentColor"
                            strokeWidth="1.8"
                            strokeLinecap="round"
                          />
                        </svg>
                      </button>
                    </div>

                    <nav className="product-mobile-tabs-panel__nav">
                      {tabs.map((tab) => (
                        <button
                          key={tab}
                          className={`product-mobile-tabs-panel__nav-item ${activeTab === tab ? 'active' : ''}`}
                          type="button"
                          onClick={() => setActiveTab(tab)}
                        >
                          {TAB_LABELS[tab]}
                        </button>
                      ))}
                    </nav>

                    <div className="product-mobile-tabs-panel__content">
                      <TabContent
                        tab={activeTab}
                        product={product}
                        includedProducts={includedProducts}
                        tips={tips}
                      />
                    </div>
                  </div>
                )}

              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}