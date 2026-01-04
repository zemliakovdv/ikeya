'use client';

import { useEffect } from 'react';

export default function CatalogModal() {
  useEffect(() => {
    const catalogButton = document.getElementById('catalogButton');
    const catalogModal = document.getElementById('catalogModal');
    const catalogModalBody = catalogModal?.querySelector('.catalog-modal-body');
    const ANIMATION_DURATION = 350;

    if (!catalogButton || !catalogModal) {
      console.error('Не найдены необходимые элементы');
      return;
    }

    function isModalOpen() {
      return catalogModal.classList.contains('active');
    }

    function openModal() {
      catalogModal.style.display = 'block';
      document.body.style.overflow = 'hidden';
      catalogModal.offsetHeight; // reflow
      
      requestAnimationFrame(() => {
        catalogModal.classList.add('active');
        catalogButton.classList.add('active');
      });
      
      console.log('Модальное окно открыто');
    }

    function closeModal() {
      catalogModal.classList.remove('active');
      catalogButton.classList.remove('active');
      
      setTimeout(() => {
        catalogModal.style.display = 'none';
        document.body.style.overflow = '';
      }, ANIMATION_DURATION);
      
      console.log('Модальное окно закрыто');
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
  }, []);

  return (
    <div className="catalog-modal modal fade" id="collapseCatalogButton">
      {/* ✅ ИСПРАВЛЕНО! class → className */}
      <div className="container">
        <div className="row">
          <div className="col-12">
            <div className="catalog-modal-body">
              
              {/* Весь остальной код без изменений */}
              <div className="category-list">
                {/* ... */}
              </div>

              <div className="categories-container">
                {/* ... */}
              </div>
              
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
