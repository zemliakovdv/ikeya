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

const API_BASE_URL = 'http://45.135.234.22/api/v1';

export default function ProductTabs({ product }) {
  const attr = product.attributes;
  
  // Проверка статей из API
  const [hasAdvices, setHasAdvices] = useState(false);
  const [advicesLoaded, setAdvicesLoaded] = useState(false);
  
  // Проверяем наличие данных для каждого таба
  const hasDescription = Boolean(
    (attr.content_ru && attr.content_ru.trim() !== '' && attr.content_ru !== 'null') ||
    (attr.short_description_ru && attr.short_description_ru.trim() !== '' && attr.short_description_ru !== 'null')
  );
  
  const hasSizes = Boolean(
    (attr.dimensions && attr.dimensions !== 'null') ||
    (attr.package_dimensions && attr.package_dimensions !== 'null')
  );
  
  const hasMaterials = Boolean(
    attr.materials && 
    attr.materials.trim() !== '' && 
    attr.materials !== 'null'
  );
  
  const hasItems = Boolean(
    attr.variants && 
    Array.isArray(attr.variants) && 
    attr.variants.length > 0
  );
  
  const hasInstructions = Boolean(
    attr.assembly_instructions && 
    attr.assembly_instructions.trim() !== '' && 
    attr.assembly_instructions !== 'null'
  );
  
  const hasReviews = Boolean(attr.rating_count && attr.rating_count > 0);
  
  const hasDelivery = true;

  // Проверяем статьи
  useEffect(() => {
    async function checkAdvices() {
      try {
        const response = await fetch(`${API_BASE_URL}/content/articles?content_type=tips_ideas&per_page=1`);
        if (response.ok) {
          const data = await response.json();
          setHasAdvices(data.data && data.data.length > 0);
        } else {
          setHasAdvices(false);
        }
      } catch (error) {
        setHasAdvices(false);
      } finally {
        setAdvicesLoaded(true);
      }
    }
    checkAdvices();
  }, []);

  // Список доступных табов
  const availableTabs = [];
  if (hasDescription) availableTabs.push('description');
  if (hasSizes) availableTabs.push('sizes');
  if (hasMaterials) availableTabs.push('materials');
  if (hasItems) availableTabs.push('items');
  if (hasInstructions) availableTabs.push('instructions');
  if (hasReviews) availableTabs.push('reviews');
  if (hasDelivery) availableTabs.push('delivery');
  if (hasAdvices && advicesLoaded) availableTabs.push('advices');

  const [activeTab, setActiveTab] = useState(availableTabs[0] || 'delivery');

  // Обновляем activeTab если он недоступен
  useEffect(() => {
    if (availableTabs.length > 0 && !availableTabs.includes(activeTab)) {
      setActiveTab(availableTabs[0]);
    }
  }, [hasAdvices, advicesLoaded]);

  return (
    <section className="character">
      <div className="container">
        <div className="row">
          <div className="col-12">
            <div className="character-inner">
              <div className="character-tabs">
                
                {/* Табы навигации */}
                <nav className="character-tabs__nav">
                  <div className="nav nav-tabs character-nav__tabs">
                    
                    {hasDescription && (
                      <button
                        className={`nav-link ${activeTab === 'description' ? 'active' : ''}`}
                        onClick={() => setActiveTab('description')}
                      >
                        Описание
                      </button>
                    )}
                    
                    {hasSizes && (
                      <button
                        className={`nav-link ${activeTab === 'sizes' ? 'active' : ''}`}
                        onClick={() => setActiveTab('sizes')}
                      >
                        Размеры
                      </button>
                    )}
                    
                    {hasMaterials && (
                      <button
                        className={`nav-link ${activeTab === 'materials' ? 'active' : ''}`}
                        onClick={() => setActiveTab('materials')}
                      >
                        Материалы и уход
                      </button>
                    )}
                    
                    {hasItems && (
                      <button
                        className={`nav-link ${activeTab === 'items' ? 'active' : ''}`}
                        onClick={() => setActiveTab('items')}
                      >
                        Предметы в наборе
                      </button>
                    )}
                    
                    {hasInstructions && (
                      <button
                        className={`nav-link ${activeTab === 'instructions' ? 'active' : ''}`}
                        onClick={() => setActiveTab('instructions')}
                      >
                        Инструкции
                      </button>
                    )}
                    
                    {hasReviews && (
                      <button
                        className={`nav-link ${activeTab === 'reviews' ? 'active' : ''}`}
                        onClick={() => setActiveTab('reviews')}
                      >
                        Отзывы {attr.rating_count > 0 && <span className="if_have_feed_count">{attr.rating_count}</span>}
                      </button>
                    )}
                    
                    {hasDelivery && (
                      <button
                        className={`nav-link ${activeTab === 'delivery' ? 'active' : ''}`}
                        onClick={() => setActiveTab('delivery')}
                      >
                        Услуги и доставка
                      </button>
                    )}
                    
                    {hasAdvices && advicesLoaded && (
                      <button
                        className={`nav-link ${activeTab === 'advices' ? 'active' : ''}`}
                        onClick={() => setActiveTab('advices')}
                      >
                        Советы
                      </button>
                    )}
                    
                  </div>
                </nav>

                {/* Контент табов */}
                <div className="tab-content character-tab__content">
                  {hasDescription && activeTab === 'description' && <DescriptionTab product={product} />}
                  {hasSizes && activeTab === 'sizes' && <SizesTab product={product} />}
                  {hasMaterials && activeTab === 'materials' && <MaterialsTab product={product} />}
                  {hasItems && activeTab === 'items' && <ItemsTab product={product} />}
                  {hasInstructions && activeTab === 'instructions' && <InstructionsTab product={product} />}
                  {hasReviews && activeTab === 'reviews' && <ReviewsTab product={product} />}
                  {hasDelivery && activeTab === 'delivery' && <DeliveryTab product={product} />}
                  {hasAdvices && advicesLoaded && activeTab === 'advices' && <AdvicesTab product={product} />}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
