// components/ClientScripts.js
'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

export default function ClientScripts() {
  const pathname = usePathname();

  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Ждём загрузки Swiper
    const initScripts = () => {
      if (!window.Swiper) {
        setTimeout(initScripts, 100);
        return;
      }

      // ========== УНИВЕРСАЛЬНАЯ ФУНКЦИЯ ДЛЯ НАВИГАЦИИ ==========
      function updateNavigationButtons(swiper, prevSelector, nextSelector) {
        const prevBtn = document.querySelector(prevSelector);
        const nextBtn = document.querySelector(nextSelector);

        if (!prevBtn || !nextBtn) return;

        if (swiper.isBeginning) {
          prevBtn.style.opacity = '0';
          prevBtn.style.pointerEvents = 'none';
        } else {
          prevBtn.style.opacity = '1';
          prevBtn.style.pointerEvents = 'auto';
        }

        if (swiper.isEnd) {
          nextBtn.style.opacity = '0';
          nextBtn.style.pointerEvents = 'none';
        } else {
          nextBtn.style.opacity = '1';
          nextBtn.style.pointerEvents = 'auto';
        }
      }

      function updateNavButtons(swiper, btnPrev, btnNext) {
        if (!btnPrev || !btnNext) return;

        if (swiper.isBeginning) {
          btnPrev.style.display = 'none';
        } else {
          btnPrev.style.display = '';
        }

        if (swiper.isEnd) {
          btnNext.style.display = 'none';
        } else {
          btnNext.style.display = '';
        }
      }

      // ========== СТАРТОВЫЙ СЛАЙДЕР ==========
      function initStartSlider() {
        const sliderEl = document.querySelector('.start-slider__swiper');
        if (!sliderEl) return;

        const slideCount = sliderEl.querySelectorAll('.swiper-slide').length;

        new Swiper('.start-slider__swiper', {
          loop: slideCount > 2,
          slidesPerView: 1,
          spaceBetween: 0,
          speed: 600,
          navigation: {
            nextEl: '.start-slider__nav-next',
            prevEl: '.start-slider__nav-prev',
          },
          pagination: {
            el: '.start-slider__pagination',
            clickable: true,
          },
        });
      }

      // ========== СЛАЙДЕР КАТЕГОРИЙ ==========
      function initCategoriesSlider() {
        const sliderEl = document.querySelector('.popular-categories-inner');
        if (!sliderEl) return;

        const slideCount = sliderEl.querySelectorAll('.swiper-slide').length;
        const isHomePage = window.location.pathname === '/';

        const prevBtn = document.querySelector('.popular-categories__nav-prev');
        const nextBtn = document.querySelector('.popular-categories__nav-next');

        // Скрываем стрелки если категорий 8 или меньше
        if (slideCount <= 8) {
          if (prevBtn) prevBtn.style.display = 'none';
          if (nextBtn) nextBtn.style.display = 'none';
          return;
        }

        const paginationEl = document.querySelector('.popular-categories__pagination');

        new Swiper('.popular-categories-inner', {
          loop: slideCount > 8,
          slidesPerView: 8,
          spaceBetween: 16,
          speed: 600,
          navigation: {
            nextEl: '.popular-categories__nav-next',
            prevEl: '.popular-categories__nav-prev',
          },
          // Пагинация только на главной странице
          ...(isHomePage && paginationEl ? {
            pagination: {
              el: '.popular-categories__pagination',
              clickable: true,
            },
          } : {}),
          breakpoints: {
            320:  { slidesPerView: 2, spaceBetween: 10 },
            480:  { slidesPerView: 3, spaceBetween: 12 },
            768:  { slidesPerView: 4, spaceBetween: 14 },
            992:  { slidesPerView: 6, spaceBetween: 16 },
            1200: { slidesPerView: 8, spaceBetween: 16 },
          },
        });
      }

      // ========== ГАЛЕРЕИ ТОВАРОВ ==========
      function initProductGalleries() {
        const galleries = document.querySelectorAll('.product-gallery-main');
        if (galleries.length === 0) return;

        galleries.forEach((mainGallery) => {
          const galleryId = mainGallery.dataset.gallery;
          if (!galleryId) return;

          const thumbsGallery = document.querySelector(`[data-gallery-thumbs="${galleryId}"]`);
          if (!thumbsGallery) {
            console.warn(`⚠️ Миниатюры не найдены для галереи: ${galleryId}`);
            return;
          }

          const thumbsSwiper = new Swiper(thumbsGallery, {
            spaceBetween: 8,
            slidesPerView: 3,
            freeMode: true,
            watchSlidesProgress: true,
          });

          const mainSwiper = new Swiper(mainGallery, {
            spaceBetween: 10,
            navigation: {
              nextEl: mainGallery.querySelector('.swiper-button-next'),
              prevEl: mainGallery.querySelector('.swiper-button-prev'),
            },
            thumbs: {
              swiper: thumbsSwiper,
            },
          });

          const totalSlides = mainGallery.querySelectorAll('.swiper-slide').length;
          if (totalSlides > 3) {
            const moreSlide = thumbsGallery.querySelector('.product-gallery-thumbs__more');
            if (moreSlide) {
              const count = moreSlide.querySelector('.product-gallery-thumbs__count');
              if (count) {
                count.textContent = `+${totalSlides - 3}`;
              }
            }
          }
        });
      }

      // ========== СЛАЙДЕРЫ ТОВАРОВ ==========
      function initProductsSliders() {
        const sliders = document.querySelectorAll('.products-slider');
        if (sliders.length === 0) return;

        sliders.forEach((slider) => {
          const btnNext = slider.querySelector('.products-slider__nav-next');
          const btnPrev = slider.querySelector('.products-slider__nav-prev');

          const swiper = new Swiper(slider, {
            slidesPerView: 5,
            spaceBetween: 20,
            navigation: {
              nextEl: btnNext,
              prevEl: btnPrev,
            },
            pagination: {
              el: slider.querySelector('.products-slider__pagination'),
              clickable: true,
            },
            breakpoints: {
              320: { slidesPerView: 1, spaceBetween: 10 },
              576: { slidesPerView: 2, spaceBetween: 15 },
              768: { slidesPerView: 3, spaceBetween: 15 },
              992: { slidesPerView: 4, spaceBetween: 20 },
              1200: { slidesPerView: 5, spaceBetween: 20 },
            },
            on: {
              init: function () {
                updateNavButtons(this, btnPrev, btnNext);
              },
              slideChange: function () {
                updateNavButtons(this, btnPrev, btnNext);
              }
            }
          });
        });
      }

      // ========== СЛАЙДЕР ПРОМО-КАРТОЧЕК ==========
      function initPromoCardsSlider() {
        const sliderEl = document.querySelector('.promo-card-inner');
        if (!sliderEl) return;

        const promoCardsSlider = new Swiper('.promo-card-inner', {
          slidesPerView: 3,
          spaceBetween: 20,
          loop: false,
          speed: 600,
          watchOverflow: true,

          navigation: {
            nextEl: '.promo-cards-slider__nav-next',
            prevEl: '.promo-cards-slider__nav-prev',
          },

          pagination: {
            el: '.promo-cards-slider__pagination',
            clickable: true,
          },

          breakpoints: {
            320: {
              slidesPerView: 1,
              spaceBetween: 15,
            },
            768: {
              slidesPerView: 2,
              spaceBetween: 15,
            },
            992: {
              slidesPerView: 2,
              spaceBetween: 20,
            },
            1200: {
              slidesPerView: 3,
              spaceBetween: 20,
            },
          },

          on: {
            init: function () {
              updateNavigationButtons(this, '.promo-cards-slider__nav-prev', '.promo-cards-slider__nav-next');
            },
            slideChange: function () {
              updateNavigationButtons(this, '.promo-cards-slider__nav-prev', '.promo-cards-slider__nav-next');
            }
          }
        });
      }

      // ========== СЛАЙДЕР РЕКЛАМНЫХ БАННЕРОВ ==========
      function initAdsBannerSlider() {
        const sliderEl = document.querySelector('.ads-banner-inner');
        if (!sliderEl) return;

        const slideCount = sliderEl.querySelectorAll('.swiper-slide').length;

        const adsBannerSlider = new Swiper('.ads-banner-inner', {
          slidesPerView: 1,
          spaceBetween: 20,
          loop: slideCount > 2,
          speed: 600,
          watchOverflow: true,

          navigation: {
            nextEl: '.ads-banner-slider__nav-next',
            prevEl: '.ads-banner-slider__nav-prev',
          },

          pagination: {
            el: '.ads-banner-slider__pagination',
            clickable: true,
          }
        });
      }

      // ========== СЛАЙДЕР БЛОГА ==========
      function initBlogSlider() {
        const sliderEl = document.querySelector('.blog-inner');
        if (!sliderEl) return;

        const slideCount = sliderEl.querySelectorAll('.swiper-slide').length;
        const prevBtn = document.querySelector('.blog-slider__nav-prev');
        const nextBtn = document.querySelector('.blog-slider__nav-next');

        // Скрываем стрелки если слайдов меньше 2
        if (slideCount < 2) {
          if (prevBtn) prevBtn.style.display = 'none';
          if (nextBtn) nextBtn.style.display = 'none';
          return;
        }

        const blogSlider = new Swiper('.blog-inner', {
          slidesPerView: 1,
          spaceBetween: 0,
          loop: slideCount > 1,
          speed: 600,
          watchOverflow: true,

          navigation: {
            nextEl: '.blog-slider__nav-next',
            prevEl: '.blog-slider__nav-prev',
          },

          pagination: {
            el: '.blog-slider__pagination',
            clickable: true,
          },

          on: {
            init: function () {
              updateNavButtons(this, prevBtn, nextBtn);
            },
            slideChange: function () {
              updateNavButtons(this, prevBtn, nextBtn);
            }
          }
        });
      }

      // ========== УПРАВЛЕНИЕ МЕГА-МЕНЮ КАТАЛОГА ==========
      function initCatalogModal() {
        const catalogButton = document.getElementById('catalogButton');
        const catalogModal = document.getElementById('catalogModal');
        const body = document.body;

        if (!catalogButton || !catalogModal) {
          return;
        }

        let isOpen = false;

        function openCatalog() {
          catalogModal.classList.add('active');
          catalogButton.classList.add('active');
          body.style.overflow = 'hidden';
          isOpen = true;

          const firstMenuItem = catalogModal.querySelector('.menu-item');
          if (firstMenuItem) {
            firstMenuItem.focus();
          }
        }

        function closeCatalog() {
          catalogModal.classList.remove('active');
          catalogButton.classList.remove('active');
          body.style.overflow = '';
          isOpen = false;
        }

        function toggleCatalog() {
          if (isOpen) {
            closeCatalog();
          } else {
            openCatalog();
          }
        }

        catalogButton.addEventListener('click', function(e) {
          e.stopPropagation();
          toggleCatalog();
        });

        catalogModal.addEventListener('click', function(e) {
          if (e.target === catalogModal || e.target.classList.contains('catalog-modals__dialog')) {
            closeCatalog();
          }
        });

        document.addEventListener('keydown', function(e) {
          if (e.key === 'Escape' && isOpen) {
            closeCatalog();
          }
        });

        const catalogContent = catalogModal.querySelector('.catalog-modals__content');
        if (catalogContent) {
          catalogContent.addEventListener('click', function(e) {
            e.stopPropagation();
          });
        }

        const catalogLinks = catalogModal.querySelectorAll('a');
        catalogLinks.forEach(link => {
          link.addEventListener('click', function() {
            setTimeout(() => {
              closeCatalog();
            }, 200);
          });
        });

        window.CatalogMenu = {
          open: openCatalog,
          close: closeCatalog,
          toggle: toggleCatalog,
          isOpen: function() {
            return isOpen;
          }
        };
      }

      // ========== SEO ТЕКСТ ==========
      function initSeoText() {
        const seoTextContent = document.querySelector('.seo-text-content');
        const showBtn = document.querySelector('.button-text');
        const hideBtn = document.querySelector('.button-text-hidden');

        if (!seoTextContent || !showBtn || !hideBtn) return;

        showBtn.addEventListener('click', function () {
          seoTextContent.classList.add('open');
        });

        hideBtn.addEventListener('click', function () {
          seoTextContent.classList.remove('open');
        });
      }

      // ========== ГАЛЕРЕЯ ТОВАРА (СТРАНИЦА ТОВАРА) ==========
      function initGoodsImages() {
        const minisEl = document.querySelector('.goods-images__minis');
        const mainEl = document.querySelector('.goods-images__main');

        if (!minisEl || !mainEl) return;

        const swiperMinis = new Swiper('.goods-images__minis', {
          loop: true,
          spaceBetween: 10,
          slidesPerView: 4,
          freeMode: true,
          watchSlidesProgress: true,
        });

        const swiperMain = new Swiper('.goods-images__main', {
          loop: true,
          spaceBetween: 0,
          navigation: {
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev',
          },
          thumbs: {
            swiper: swiperMinis,
          },
        });
      }

      // ========== СЛАЙДЕР ПРЕДМЕТОВ ==========
      function initPredmetySlider() {
        const sliderEl = document.querySelector('.predmety-content__slider');
        if (!sliderEl) return;

        function updatePredmetyNavigation(swiper) {
          const prevBtn = document.querySelector('.predmety-slider__nav-prev');
          const nextBtn = document.querySelector('.predmety-slider__nav-next');

          if (!prevBtn || !nextBtn) return;

          if (swiper.activeIndex === 0) {
            prevBtn.style.display = 'none';
          } else {
            prevBtn.style.display = 'block';
          }

          const lastIndex = swiper.slides.length - swiper.params.slidesPerView;
          if (swiper.activeIndex >= lastIndex) {
            nextBtn.style.display = 'none';
          } else {
            nextBtn.style.display = 'block';
          }
        }

        const predmetySwiper = new Swiper('.predmety-content__slider', {
          loop: false,
          slidesPerView: 5,
          spaceBetween: 8,

          pagination: {
            el: '.predmety-slider__pagination',
            clickable: true,
            dynamicBullets: true,
          },

          navigation: {
            nextEl: '.predmety-slider__nav-next',
            prevEl: '.predmety-slider__nav-prev',
          },

          on: {
            init: function () {
              updatePredmetyNavigation(this);
            },
            slideChange: function () {
              updatePredmetyNavigation(this);
            },
          },
        });
      }

      // ========== СОРТИРОВКА ==========
      function initCatalogSort() {
        const sortBlock = document.querySelector('.catalog-sort');
        if (!sortBlock) return;

        const selected = sortBlock.querySelector('.catalog-sort__selected');
        const currentText = sortBlock.querySelector('.catalog-sort__current');
        const options = sortBlock.querySelectorAll('.catalog-sort__option');

        if (!selected || !currentText || options.length === 0) return;

        selected.addEventListener('click', function (e) {
          e.stopPropagation();
          sortBlock.classList.toggle('open');

          const icon = this.querySelector('svg');
          if (icon) {
            icon.style.transform = sortBlock.classList.contains('open')
              ? 'rotate(180deg)'
              : 'rotate(0deg)';
          }
        });

        options.forEach(option => {
          option.addEventListener('click', function () {
            options.forEach(opt => opt.classList.remove('active'));
            this.classList.add('active');
            currentText.textContent = this.textContent.trim();
            sortBlock.classList.remove('open');

            const icon = selected.querySelector('svg');
            if (icon) icon.style.transform = 'rotate(0deg)';

            const sortType = this.dataset.sort;
          });
        });

        document.addEventListener('click', function (e) {
          if (!sortBlock.contains(e.target)) {
            sortBlock.classList.remove('open');
            const icon = selected.querySelector('svg');
            if (icon) icon.style.transform = 'rotate(0deg)';
          }
        });

        document.addEventListener('keydown', function (e) {
          if (e.key === 'Escape' && sortBlock.classList.contains('open')) {
            sortBlock.classList.remove('open');
            const icon = selected.querySelector('svg');
            if (icon) icon.style.transform = 'rotate(0deg)';
          }
        });
      }

      // ========== ЧИПСЫ ФИЛЬТРОВ ==========
      function addChip(filterType, value, checkbox) {
        const chipsContainer = document.querySelector('.all-catalog-cheaps');
        if (!chipsContainer) return;

        const existing = chipsContainer.querySelector(`[data-value="${value}"]`);
        if (existing) return;

        const chip = document.createElement('div');
        chip.className = 'catalog-cheaps-item';
        chip.setAttribute('data-value', value);

        chip.innerHTML = `
          <p>${filterType}: <span>${value}</span></p>
          <button class="cheaps-item-delete" aria-label="Удалить фильтр">×</button>
        `;

        const deleteBtn = chip.querySelector('.cheaps-item-delete');
        deleteBtn.addEventListener('click', () => {
          chip.remove();
          checkbox.checked = false;
          updateClearAllButton();
        });

        const clearAllBtn = chipsContainer.querySelector('.cheaps-clean');
        if (clearAllBtn) {
          chipsContainer.insertBefore(chip, clearAllBtn);
        } else {
          chipsContainer.appendChild(chip);
        }

        updateClearAllButton();
      }

      function removeChip(value) {
        const chipsContainer = document.querySelector('.all-catalog-cheaps');
        if (!chipsContainer) return;

        const chip = chipsContainer.querySelector(`[data-value="${value}"]`);
        if (chip) {
          chip.remove();
          updateClearAllButton();
        }
      }

      function updateClearAllButton() {
        const chipsContainer = document.querySelector('.all-catalog-cheaps');
        if (!chipsContainer) return;

        const chips = chipsContainer.querySelectorAll('.catalog-cheaps-item');
        let clearAllBtn = chipsContainer.querySelector('.cheaps-clean');

        if (chips.length > 0) {
          if (!clearAllBtn) {
            clearAllBtn = document.createElement('button');
            clearAllBtn.className = 'cheaps-clean';
            clearAllBtn.textContent = 'Очистить все';
            chipsContainer.appendChild(clearAllBtn);
            clearAllBtn.addEventListener('click', clearAllFilters);
          }
          chipsContainer.style.display = 'flex';
        } else {
          if (clearAllBtn) clearAllBtn.remove();
          chipsContainer.style.display = 'none';
        }
      }

      function initFilterChips() {
        const chipsContainer = document.querySelector('.all-catalog-cheaps');
        if (!chipsContainer) return;

        const checkboxes = document.querySelectorAll('.brand-checkbox input[type="checkbox"]');

        checkboxes.forEach(checkbox => {
          checkbox.addEventListener('change', function () {
            const label = this.closest('.brand-checkbox');
            const labelText = label.querySelector('span:last-child');
            const brandName = labelText ? labelText.textContent.trim() : '';

            const section = this.closest('.filter-section');
            const sectionTitleEl = section ? section.querySelector('.section-title span:first-child') : null;
            const sectionTitle = sectionTitleEl ? sectionTitleEl.textContent.trim() : 'Фильтр';

            if (!brandName) return;

            if (this.checked) {
              addChip(sectionTitle, brandName, this);
            } else {
              removeChip(brandName);
            }
          });
        });
      }

      // ========== КНОПКИ "ЕЩЁ N" / "СКРЫТЬ" ==========
      function initShowMoreButtons() {
        const filterSections = document.querySelectorAll('.filter-section');

        filterSections.forEach(section => {
          const brandGrid = section.querySelector('.brand-grid');
          const showMoreBtn = section.querySelector('.show-more');

          if (!brandGrid || !showMoreBtn) return;

          const items = Array.from(brandGrid.children);
          const visibleCount = 5;
          const hiddenCount = items.length - visibleCount;

          if (hiddenCount <= 0) {
            showMoreBtn.style.display = 'none';
            return;
          }

          items.forEach((item, index) => {
            if (index >= visibleCount) {
              item.style.display = 'none';
              item.classList.add('hidden-item');
            }
          });

          const icon = showMoreBtn.querySelector('.toggle-icon img');
          const iconSrc = icon ? icon.src : 'assets/img/icons/arrow-down.svg';

          showMoreBtn.innerHTML = `Ещё ${hiddenCount} <span class="toggle-icon"><img src="${iconSrc}" alt=""></span>`;

          showMoreBtn.addEventListener('click', function (e) {
            e.preventDefault();
            e.stopPropagation();

            const hiddenItems = brandGrid.querySelectorAll('.hidden-item');
            const isExpanded = this.classList.contains('expanded');

            if (isExpanded) {
              hiddenItems.forEach(item => {
                item.style.display = 'none';
              });

              this.innerHTML = `Ещё ${hiddenCount} <span class="toggle-icon"><img src="${iconSrc}" alt=""></span>`;
              this.classList.remove('expanded');

              const toggleIcon = this.querySelector('.toggle-icon');
              if (toggleIcon) {
                toggleIcon.style.transform = 'rotate(0deg)';
              }
            } else {
              hiddenItems.forEach(item => {
                item.style.display = 'flex';
              });

              this.innerHTML = `Скрыть <span class="toggle-icon"><img src="${iconSrc}" alt=""></span>`;
              this.classList.add('expanded');

              const toggleIcon = this.querySelector('.toggle-icon');
              if (toggleIcon) {
                toggleIcon.style.transform = 'rotate(180deg)';
              }
            }
          });
        });
      }

      // ========== ЗАКРЕПЛЕНИЕ ASIDE С ФИЛЬТРАМИ ==========
      function initStickyFilters() {
        const filterAside = document.querySelector('.filter-aside');

        if (!filterAside) {
          return;
        }

        let isHovered = false;

        filterAside.addEventListener('mouseenter', function() {
          isHovered = true;
          this.classList.add('hovered');
        });

        filterAside.addEventListener('mouseleave', function() {
          isHovered = false;
          this.classList.remove('hovered');
        });

        filterAside.addEventListener('wheel', function(e) {
          if (!isHovered) return;

          const scrollTop = this.scrollTop;
          const scrollHeight = this.scrollHeight;
          const height = this.clientHeight;
          const delta = e.deltaY;

          const isScrollingUp = delta < 0;
          const isScrollingDown = delta > 0;

          if (isScrollingUp && scrollTop <= 0) {
            e.preventDefault();
            return false;
          }

          if (isScrollingDown && (scrollTop + height >= scrollHeight)) {
            e.preventDefault();
            return false;
          }

          e.stopPropagation();

        }, { passive: false });
      }

      // ========== ОЧИСТКА ФИЛЬТРОВ ==========
      function clearAllFilters() {
        const checkboxes = document.querySelectorAll('.brand-checkbox input[type="checkbox"]');
        checkboxes.forEach(checkbox => {
          checkbox.checked = false;
        });

        const chipsContainer = document.querySelector('.all-catalog-cheaps');
        if (chipsContainer) {
          const chips = chipsContainer.querySelectorAll('.catalog-cheaps-item');
          chips.forEach(chip => chip.remove());
        }

        const expandedButtons = document.querySelectorAll('.show-more.expanded');
        expandedButtons.forEach(button => {
          button.click();
        });

        const activeColors = document.querySelectorAll('.color-option.active');
        activeColors.forEach(color => color.classList.remove('active'));

        const priceInputs = document.querySelectorAll('.price-input');
        if (priceInputs.length >= 2) {
          priceInputs[0].value = '';
          priceInputs[1].value = '';
        }

        updateClearAllButton();
      }

      function initClearFilters() {
        const clearButton = document.querySelector('.apply-filters');
        if (!clearButton) return;

        clearButton.addEventListener('click', function (e) {
          e.preventDefault();
          clearAllFilters();
        });
      }

      // ========== СВОРАЧИВАНИЕ СЕКЦИЙ ФИЛЬТРОВ ==========
      function initFilterSectionsToggle() {
        const sectionTitles = document.querySelectorAll('.filter-section .section-title');

        sectionTitles.forEach(title => {
          title.addEventListener('click', function () {
            const section = this.parentElement;
            const content = Array.from(section.children).filter(
              child => !child.classList.contains('section-title')
            );
            const icon = this.querySelector('.toggle-icon img');

            section.classList.toggle('collapsed');

            content.forEach(el => {
              if (section.classList.contains('collapsed')) {
                el.style.display = 'none';
              } else {
                el.style.display = '';
              }
            });

            if (icon) {
              icon.style.transform = section.classList.contains('collapsed')
                ? 'rotate(180deg)'
                : 'rotate(0deg)';
            }
          });
        });
      }

      // ========== СЛАЙДЕР ЦЕНЫ ==========
      function initPriceSlider() {
        const slider = document.querySelector('.price-slider');
        if (!slider) return;

        const sliderFill = slider.querySelector('.price-slider-fill');
        const handleMin = slider.querySelector('.handle-min');
        const handleMax = slider.querySelector('.handle-max');
        const priceInputs = document.querySelectorAll('.price-input');

        if (!sliderFill || !handleMin || !handleMax || priceInputs.length < 2) return;

        const inputMin = priceInputs[0];
        const inputMax = priceInputs[1];

        const MIN_VALUE = 19.99;
        const MAX_VALUE = 4999;
        const GAP = 10;

        const INITIAL_MAX_PERCENT = 93;
        const INITIAL_MAX_VALUE = MIN_VALUE + ((MAX_VALUE - MIN_VALUE) * (INITIAL_MAX_PERCENT / 100));

        let isDraggingMin = false;
        let isDraggingMax = false;

        function updateSlider() {
          const minValue = parseFloat(inputMin.value) || MIN_VALUE;
          const maxValue = parseFloat(inputMax.value) || MAX_VALUE;

          const minPercent = ((minValue - MIN_VALUE) / (MAX_VALUE - MIN_VALUE)) * 100;
          const maxPercent = ((maxValue - MIN_VALUE) / (MAX_VALUE - MIN_VALUE)) * 100;

          handleMin.style.left = minPercent + '%';
          handleMax.style.left = maxPercent + '%';

          sliderFill.style.left = minPercent + '%';
          sliderFill.style.width = (maxPercent - minPercent) + '%';
        }

        function getPositionFromEvent(e) {
          const rect = slider.getBoundingClientRect();
          let clientX = e.type.includes('touch') ? e.touches[0].clientX : e.clientX;
          let position = clientX - rect.left;
          position = Math.max(0, Math.min(position, rect.width));
          return (position / rect.width) * 100;
        }

        function updateValueFromPosition(percent, isMin) {
          let value = Math.round(((percent / 100) * (MAX_VALUE - MIN_VALUE) + MIN_VALUE) * 100) / 100;

          if (isMin) {
            const maxValue = parseFloat(inputMax.value);
            value = Math.min(value, maxValue - GAP);
            value = Math.max(value, MIN_VALUE);
            inputMin.value = value.toFixed(2);
          } else {
            const minValue = parseFloat(inputMin.value);
            value = Math.max(value, minValue + GAP);
            value = Math.min(value, MAX_VALUE);
            inputMax.value = value.toFixed(2);
          }

          updateSlider();
        }

        handleMin.addEventListener('mousedown', (e) => {
          e.preventDefault();
          isDraggingMin = true;
          handleMin.classList.add('active');
          document.body.style.cursor = 'grabbing';
        });

        handleMin.addEventListener('touchstart', (e) => {
          isDraggingMin = true;
          handleMin.classList.add('active');
        }, { passive: true });

        handleMax.addEventListener('mousedown', (e) => {
          e.preventDefault();
          isDraggingMax = true;
          handleMax.classList.add('active');
          document.body.style.cursor = 'grabbing';
        });

        handleMax.addEventListener('touchstart', (e) => {
          isDraggingMax = true;
          handleMax.classList.add('active');
        }, { passive: true });

        document.addEventListener('mousemove', (e) => {
          if (isDraggingMin) {
            const percent = getPositionFromEvent(e);
            updateValueFromPosition(percent, true);
          }
          if (isDraggingMax) {
            const percent = getPositionFromEvent(e);
            updateValueFromPosition(percent, false);
          }
        });

        document.addEventListener('touchmove', (e) => {
          if (isDraggingMin) {
            const percent = getPositionFromEvent(e);
            updateValueFromPosition(percent, true);
          }
          if (isDraggingMax) {
            const percent = getPositionFromEvent(e);
            updateValueFromPosition(percent, false);
          }
        }, { passive: true });

        document.addEventListener('mouseup', () => {
          if (isDraggingMin) {
            isDraggingMin = false;
            handleMin.classList.remove('active');
            document.body.style.cursor = '';
          }
          if (isDraggingMax) {
            isDraggingMax = false;
            handleMax.classList.remove('active');
            document.body.style.cursor = '';
          }
        });

        document.addEventListener('touchend', () => {
          if (isDraggingMin) {
            isDraggingMin = false;
            handleMin.classList.remove('active');
          }
          if (isDraggingMax) {
            isDraggingMax = false;
            handleMax.classList.remove('active');
          }
        });

        inputMin.addEventListener('input', function () {
          let value = parseFloat(this.value) || MIN_VALUE;
          const maxValue = parseFloat(inputMax.value);

          if (value > maxValue - GAP) {
            value = maxValue - GAP;
            this.value = value.toFixed(2);
          }
          if (value < MIN_VALUE) {
            value = MIN_VALUE;
            this.value = value.toFixed(2);
          }

          updateSlider();
        });

        inputMax.addEventListener('input', function () {
          let value = parseFloat(this.value) || MAX_VALUE;
          const minValue = parseFloat(inputMin.value);

          if (value < minValue + GAP) {
            value = minValue + GAP;
            this.value = value.toFixed(2);
          }
          if (value > MAX_VALUE) {
            value = MAX_VALUE;
            this.value = value.toFixed(2);
          }

          updateSlider();
        });

        slider.addEventListener('click', (e) => {
          if (e.target.classList.contains('slider-handle')) return;

          const percent = getPositionFromEvent(e);
          const value = (percent / 100) * (MAX_VALUE - MIN_VALUE) + MIN_VALUE;
          const minValue = parseFloat(inputMin.value);
          const maxValue = parseFloat(inputMax.value);

          const distanceToMin = Math.abs(value - minValue);
          const distanceToMax = Math.abs(value - maxValue);

          if (distanceToMin < distanceToMax) {
            updateValueFromPosition(percent, true);
          } else {
            updateValueFromPosition(percent, false);
          }
        });

        inputMin.value = MIN_VALUE.toFixed(2);
        inputMax.value = INITIAL_MAX_VALUE.toFixed(2);

        updateSlider();
      }

      // ========== STICKY КАРТОЧКА ТОВАРА ==========
      function initStickyProductCard() {
        const header = document.querySelector('header');
        const verhSection = document.querySelector('.verh');
        const goodsSection = document.querySelector('.goods');

        if (!header || !verhSection || !goodsSection) return;

        const goodsOffsetTop = goodsSection.offsetTop;
        let headerHeight = header.offsetHeight;
        let isSticky = false;
        let ticking = false;

        const CONFIG = {
          triggerOffset: 500,
          transitionDuration: 300,
        };

        function handleScroll() {
          const scrollY = window.scrollY;
          const shouldBeSticky = scrollY >= (goodsOffsetTop - headerHeight - CONFIG.triggerOffset);

          if (shouldBeSticky && !isSticky) {
            verhSection.classList.add('sticky');
            verhSection.style.top = `${headerHeight}px`;
            isSticky = true;
          } else if (!shouldBeSticky && isSticky) {
            verhSection.classList.remove('sticky');
            verhSection.style.top = '';
            isSticky = false;
          }

          ticking = false;
        }

        function requestTick() {
          if (!ticking) {
            window.requestAnimationFrame(handleScroll);
            ticking = true;
          }
        }

        window.addEventListener('scroll', requestTick, { passive: true });

        window.addEventListener('resize', function() {
          headerHeight = header.offsetHeight;
          if (isSticky) {
            verhSection.style.top = `${headerHeight}px`;
          }
        });
      }

      // ========== ВЫЗОВ ВСЕХ ФУНКЦИЙ ==========
      initStartSlider();
      initCategoriesSlider();
      initProductGalleries();
      initProductsSliders();
      initPromoCardsSlider();
      initAdsBannerSlider();
      initBlogSlider();
      initCatalogModal();
      initSeoText();
      initGoodsImages();
      initPredmetySlider();
      initCatalogSort();
      initFilterChips();
      initShowMoreButtons();
      initStickyFilters();
      initClearFilters();
      initFilterSectionsToggle();
      initPriceSlider();
      initStickyProductCard();
    };

    initScripts();
  }, [pathname]);

  return null;
}