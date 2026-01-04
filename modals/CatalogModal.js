'use client';

import { useEffect, useState } from 'react';

export default function CatalogModal() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);

    // Весь код выполнится ТОЛЬКО после монтирования
    const catalogButton = document.getElementById('catalogButton');
    const catalogModal = document.getElementById('catalogModal');
    const catalogModalBody = catalogModal?.querySelector('.catalog-modal-body');
    const ANIMATION_DURATION = 350;

    if (!catalogButton || !catalogModal) {
      return; // ← Убрал console.error
    }

    function isModalOpen() {
      return catalogModal.classList.contains('active');
    }

    function openModal() {
      catalogModal.style.display = 'block';
      document.body.style.overflow = 'hidden';
      catalogModal.offsetHeight;
      
      requestAnimationFrame(() => {
        catalogModal.classList.add('active');
        catalogButton.classList.add('active');
      });
    }

    function closeModal() {
      catalogModal.classList.remove('active');
      catalogButton.classList.remove('active');
      
      setTimeout(() => {
        catalogModal.style.display = 'none';
        document.body.style.overflow = '';
      }, ANIMATION_DURATION);
    }

    function toggleCatalogModal() {
      isModalOpen() ? closeModal() : openModal();
    }

    catalogButton.addEventListener('click', function (e) {
      e.stopPropagation();
      toggleCatalogModal();
    });

    catalogModal.addEventListener('click', function (e) {
      if (e.target === catalogModal ||
          e.target.classList.contains('container') ||
          e.target.classList.contains('row') ||
          e.target.classList.contains('col-12')) {
        closeModal();
      }
    });

    if (catalogModalBody) {
      catalogModalBody.addEventListener('click', function (e) {
        e.stopPropagation();
      });
    }

    const handleEscape = (e) => {
      if (e.key === 'Escape' && isModalOpen()) {
        closeModal();
      }
    };
    
    document.addEventListener('keydown', handleEscape);
    catalogButton.classList.add('toggle-btn');

    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [mounted]);

  if (!mounted) {
    return null; // ← НЕ рендерим на сервере
  }

  return (
    <div className="catalog-modal modal fade" id="collapseCatalogButton">
      <div className="container">
        <div className="row">
          <div className="col-12">
            <div className="catalog-modal-body">
              
              {/* Список главных категорий */}
              <div className="category-list">
                <div className="div categorys-head">
                  <div className="item">
                    <img className="img" src="assets/img/catalog-modal/collections.svg" alt="Коллекции" />
                    <div className="text">
                      <div className="entered-text">Коллекции</div>
                    </div>
                  </div>
                  <div className="item">
                    <img className="img" src="assets/img/catalog-modal/discount.svg" alt="Уценённые товары" />
                    <div className="text">
                      <div className="text-wrapper">Уценённые товары</div>
                    </div>
                  </div>
                </div>

                <div className="div categorys-content">
                  <div className="item active" data-category="sad-i-balkon">
                    <img className="img" src="assets/img/catalog-modal/sad_i_balcon.svg" alt="Сад и балкон" />
                    <div className="text">
                      <div className="entered-text-2">Сад и балкон</div>
                    </div>
                    <img className="img" src="assets/img/catalog-modal/arrow-right.svg" alt="arrow" />
                  </div>

                  {/* Остальные категории... */}
                  
                </div>
              </div>

              {/* Подкатегории */}
              <div className="categories-container">
                {/* Твой контент */}
              </div>
              
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
