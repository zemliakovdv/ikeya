// ========== ИСПРАВЛЕННАЯ ВЕРСИЯ СКРИПТОВ ==========

document.addEventListener('DOMContentLoaded', function () {
  console.log('✅ Инициализация всех скриптов');

  // Инициализация всех компонентов
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

  console.log('🎉 Все скрипты инициализированы');
});

// ========== СТАРТОВЫЙ СЛАЙДЕР ==========
function initStartSlider() {
  const sliderEl = document.querySelector('.start-slider__swiper');
  if (!sliderEl) return;

  const startSlider = new Swiper('.start-slider__swiper', {
    loop: false,
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

    on: {
      init: function () {
        updateNavigationButtons(this, '.start-slider__nav-prev', '.start-slider__nav-next');
      },
      slideChange: function () {
        updateNavigationButtons(this, '.start-slider__nav-prev', '.start-slider__nav-next');
      }
    }
  });

  console.log('✅ Стартовый слайдер инициализирован');
}

// ========== СЛАЙДЕР КАТЕГОРИЙ ==========
function initCategoriesSlider() {
  const sliderEl = document.querySelector('.popular-categories-inner');
  if (!sliderEl) return;

  const categoriesSlider = new Swiper('.popular-categories-inner', {
    loop: false,
    slidesPerView: 1,
    spaceBetween: 0,
    speed: 600,

    navigation: {
      nextEl: '.popular-categories__nav-next',
      prevEl: '.popular-categories__nav-prev',
    },

    pagination: {
      el: '.popular-categories__pagination',
      clickable: true,
    },

    on: {
      init: function () {
        updateNavigationButtons(this, '.popular-categories__nav-prev', '.popular-categories__nav-next');
      },
      slideChange: function () {
        updateNavigationButtons(this, '.popular-categories__nav-prev', '.popular-categories__nav-next');
      }
    }
  });

  console.log('✅ Слайдер категорий инициализирован');
}

// ========== УНИВЕРСАЛЬНАЯ ФУНКЦИЯ ДЛЯ НАВИГАЦИИ ==========
function updateNavigationButtons(swiper, prevSelector, nextSelector) {
  const prevBtn = document.querySelector(prevSelector);
  const nextBtn = document.querySelector(nextSelector);

  if (!prevBtn || !nextBtn) return;

  // Скрываем prev на первом слайде
  if (swiper.isBeginning) {
    prevBtn.style.opacity = '0';
    prevBtn.style.pointerEvents = 'none';
  } else {
    prevBtn.style.opacity = '1';
    prevBtn.style.pointerEvents = 'auto';
  }

  // Скрываем next на последнем слайде
  if (swiper.isEnd) {
    nextBtn.style.opacity = '0';
    nextBtn.style.pointerEvents = 'none';
  } else {
    nextBtn.style.opacity = '1';
    nextBtn.style.pointerEvents = 'auto';
  }
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

    // Инициализируем слайдер миниатюр
    const thumbsSwiper = new Swiper(thumbsGallery, {
      spaceBetween: 8,
      slidesPerView: 3,
      freeMode: true,
      watchSlidesProgress: true,
    });

    // Инициализируем основной слайдер
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

    // Обновляем счетчик "+N"
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

  console.log('✅ Галереи товаров инициализированы');
}

// ========== СЛАЙДЕРЫ ТОВАРОВ ==========
function initProductsSliders() {
  const sliders = document.querySelectorAll('.products-slider');
  if (sliders.length === 0) return;

  sliders.forEach((slider) => {
    const btnNext = slider.querySelector('.products-slider__nav-next');
    const btnPrev = slider.querySelector('.products-slider__nav-prev');

    const swiper = new Swiper(slider, {
      slidesPerView: 1,
      spaceBetween: 0,
      navigation: {
        nextEl: btnNext,
        prevEl: btnPrev,
      },
      pagination: {
        el: slider.querySelector('.products-slider__pagination'),
        clickable: true,
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

  console.log('✅ Слайдеры товаров инициализированы');
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

// ========== СЛАЙДЕР ПРОМО-КАРТОЧЕК ==========
let promoCardsSlider;

function initPromoCardsSlider() {
  const sliderEl = document.querySelector('.promo-card-inner');
  if (!sliderEl) return;

  if (promoCardsSlider) {
    promoCardsSlider.destroy(true, true);
  }

  promoCardsSlider = new Swiper('.promo-card-inner', {
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

  console.log('✅ Слайдер промо-карточек инициализирован');
}

// ========== СЛАЙДЕР РЕКЛАМНЫХ БАННЕРОВ ==========
let adsBannerSlider;

function initAdsBannerSlider() {
  const sliderEl = document.querySelector('.ads-banner-inner');
  if (!sliderEl) return;

  if (adsBannerSlider) {
    adsBannerSlider.destroy(true, true);
  }

  adsBannerSlider = new Swiper('.ads-banner-inner', {
    slidesPerView: 1,
    spaceBetween: 20,
    loop: false,
    speed: 600,
    watchOverflow: true,

    navigation: {
      nextEl: '.ads-banner-slider__nav-next',
      prevEl: '.ads-banner-slider__nav-prev',
    },

    pagination: {
      el: '.ads-banner-slider__pagination',
      clickable: true,
    },

    on: {
      init: function () {
        updateNavigationButtons(this, '.ads-banner-slider__nav-prev', '.ads-banner-slider__nav-next');
      },
      slideChange: function () {
        updateNavigationButtons(this, '.ads-banner-slider__nav-prev', '.ads-banner-slider__nav-next');
      }
    }
  });

  console.log('✅ Слайдер баннеров инициализирован');
}

// ========== СЛАЙДЕР БЛОГА ==========
let blogSlider;

function initBlogSlider() {
  const sliderEl = document.querySelector('.blog-inner');
  if (!sliderEl) return;

  if (blogSlider) {
    blogSlider.destroy(true, true);
  }

  blogSlider = new Swiper('.blog-inner', {
    slidesPerView: 1,
    spaceBetween: 0,
    loop: false,
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
        updateNavigationButtons(this, '.blog-slider__nav-prev', '.blog-slider__nav-next');
      },
      slideChange: function () {
        updateNavigationButtons(this, '.blog-slider__nav-prev', '.blog-slider__nav-next');
      }
    }
  });

  console.log('✅ Слайдер блога инициализирован');
}

// ========== УПРАВЛЕНИЕ МЕГА-МЕНЮ КАТАЛОГА ==========

(function() {
    'use strict';

    // Элементы
    const catalogButton = document.getElementById('catalogButton');
    const catalogModal = document.getElementById('catalogModal');
    const body = document.body;

    // Проверка наличия элементов
    if (!catalogButton || !catalogModal) {
        console.warn('Каталог: кнопка или модальное окно не найдены');
        return;
    }

    // Состояние меню
    let isOpen = false;

    // Функция открытия меню
    function openCatalog() {
        catalogModal.classList.add('active');
        catalogButton.classList.add('active');
        body.style.overflow = 'hidden'; // Блокируем скролл страницы
        isOpen = true;
        
        // Фокус на первом элементе меню (для доступности)
        const firstMenuItem = catalogModal.querySelector('.menu-item');
        if (firstMenuItem) {
            firstMenuItem.focus();
        }
    }

    // Функция закрытия меню
    function closeCatalog() {
        catalogModal.classList.remove('active');
        catalogButton.classList.remove('active');
        body.style.overflow = ''; // Возвращаем скролл
        isOpen = false;
    }

    // Переключение состояния меню
    function toggleCatalog() {
        if (isOpen) {
            closeCatalog();
        } else {
            openCatalog();
        }
    }

    // Клик по кнопке каталога
    catalogButton.addEventListener('click', function(e) {
        e.stopPropagation();
        toggleCatalog();
    });

    // Закрытие при клике вне меню
    catalogModal.addEventListener('click', function(e) {
        if (e.target === catalogModal || e.target.classList.contains('catalog-modals__dialog')) {
            closeCatalog();
        }
    });

    // Закрытие по клавише Escape
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && isOpen) {
            closeCatalog();
        }
    });

    // Предотвращаем закрытие при клике внутри контента
    const catalogContent = catalogModal.querySelector('.catalog-modals__content');
    if (catalogContent) {
        catalogContent.addEventListener('click', function(e) {
            e.stopPropagation();
        });
    }

    // Закрытие при переходе по ссылке внутри меню (опционально)
    const catalogLinks = catalogModal.querySelectorAll('a');
    catalogLinks.forEach(link => {
        link.addEventListener('click', function() {
            // Задержка для плавного закрытия
            setTimeout(() => {
                closeCatalog();
            }, 200);
        });
    });

    // Публичный API (если нужно управлять извне)
    window.CatalogMenu = {
        open: openCatalog,
        close: closeCatalog,
        toggle: toggleCatalog,
        isOpen: function() {
            return isOpen;
        }
    };

})();



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

  console.log('✅ SEO текст инициализирован');
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

  console.log('✅ Галерея товара инициализирована');
}

// ========== СЛАЙДЕР ПРЕДМЕТОВ ==========
function initPredmetySlider() {
  const sliderEl = document.querySelector('.predmety-content__slider');
  if (!sliderEl) return;

  const predmetySwiper = new Swiper('.predmety-content__slider', {
    loop: false, // ИСПРАВЛЕНО: было loop: true
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

  function updatePredmetyNavigation(swiper) {
    const prevBtn = document.querySelector('.predmety-slider__nav-prev');
    const nextBtn = document.querySelector('.predmety-slider__nav-next');

    if (!prevBtn || !nextBtn) return;

    // Скрывает левую стрелку на первом слайде
    if (swiper.activeIndex === 0) {
      prevBtn.style.display = 'none';
    } else {
      prevBtn.style.display = 'block';
    }

    // Скрывает правую стрелку на последнем слайде
    const lastIndex = swiper.slides.length - swiper.params.slidesPerView;
    if (swiper.activeIndex >= lastIndex) {
      nextBtn.style.display = 'none';
    } else {
      nextBtn.style.display = 'block';
    }
  }

  console.log('✅ Слайдер предметов инициализирован');
}

// ========== ПЕРЕИНИЦИАЛИЗАЦИЯ ПРИ ПЕРЕКЛЮЧЕНИИ ТАБОВ ==========
const tabButtons = document.querySelectorAll('[data-bs-toggle="tab"]');
if (tabButtons.length > 0) {
  tabButtons.forEach(button => {
    button.addEventListener('shown.bs.tab', function () {
      setTimeout(() => {
        initProductGalleries();
        initProductsSliders();
      }, 100);
    });
  });
}

// ========== ОБРАБОТЧИКИ ИЗМЕНЕНИЯ РАЗМЕРА ОКНА ==========
let resizeTimer;
window.addEventListener('resize', function () {
  clearTimeout(resizeTimer);
  resizeTimer = setTimeout(function () {
    if (promoCardsSlider) promoCardsSlider.update();
    if (adsBannerSlider) adsBannerSlider.update();
    if (blogSlider) blogSlider.update();
  }, 250);
});


// ========== КАТАЛОГ: ПОЛНЫЙ ФУНКЦИОНАЛ ==========

document.addEventListener('DOMContentLoaded', function () {
  console.log('✅ Инициализация каталога');

  // Проверяем наличие каталога на странице
  if (!document.querySelector('.all-catalog')) {
    console.warn('⚠️ Секция каталога не найдена');
    return;
  }

  // 1. Сортировка (открытие/закрытие)
  initCatalogSort();

  // 2. Чипсы фильтров (при выборе чекбокса)
  initFilterChips();

  // 3. Кнопки "Ещё N" / "Скрыть"
  initShowMoreButtons();

  // 4. Закрепление aside с фильтрами
  initStickyFilters();

  // 5. Очистка фильтров
  initClearFilters();

  console.log('🎉 Каталог полностью инициализирован');
});

// ========== 1. СОРТИРОВКА ==========
function initCatalogSort() {
  const sortBlock = document.querySelector('.catalog-sort');
  if (!sortBlock) {
    console.warn('⚠️ Блок сортировки не найден');
    return;
  }

  const selected = sortBlock.querySelector('.catalog-sort__selected');
  const currentText = sortBlock.querySelector('.catalog-sort__current');
  const options = sortBlock.querySelectorAll('.catalog-sort__option');
  const dropdown = sortBlock.querySelector('.catalog-sort__dropdown');

  if (!selected || !currentText || options.length === 0) {
    console.warn('⚠️ Элементы сортировки не полные');
    return;
  }

  // Открытие/закрытие списка
  selected.addEventListener('click', function (e) {
    e.stopPropagation();
    sortBlock.classList.toggle('open');
    
    // Анимация иконки
    const icon = this.querySelector('svg');
    if (icon) {
      icon.style.transform = sortBlock.classList.contains('open') 
        ? 'rotate(180deg)' 
        : 'rotate(0deg)';
    }
  });

  // Выбор опции
  options.forEach(option => {
    option.addEventListener('click', function () {
      // Снимаем active со всех
      options.forEach(opt => opt.classList.remove('active'));

      // Добавляем active к выбранной
      this.classList.add('active');

      // Обновляем текст
      currentText.textContent = this.textContent.trim();

      // Закрываем список
      sortBlock.classList.remove('open');
      
      // Возвращаем иконку
      const icon = selected.querySelector('svg');
      if (icon) icon.style.transform = 'rotate(0deg)';

      // Получаем значение сортировки
      const sortType = this.dataset.sort;
      console.log('Выбрана сортировка:', sortType);

      // Здесь вызов функции сортировки
      applySorting(sortType);
    });
  });

  // Закрытие при клике вне списка
  document.addEventListener('click', function (e) {
    if (!sortBlock.contains(e.target)) {
      sortBlock.classList.remove('open');
      const icon = selected.querySelector('svg');
      if (icon) icon.style.transform = 'rotate(0deg)';
    }
  });

  // Закрытие по Escape
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && sortBlock.classList.contains('open')) {
      sortBlock.classList.remove('open');
      const icon = selected.querySelector('svg');
      if (icon) icon.style.transform = 'rotate(0deg)';
    }
  });

  console.log('✅ Сортировка инициализирована');
}

// Функция применения сортировки (пример)
function applySorting(sortType) {
  console.log('Применяем сортировку:', sortType);
  
  const cardsContainer = document.querySelector('.all-catalog-cards');
  if (!cardsContainer) return;

  // Здесь логика сортировки или AJAX-запрос
  // Например:
  // - Сортировка DOM-элементов
  // - Запрос на сервер с параметром sortType
  // - Перерисовка карточек товаров
}

// ========== 2. ЧИПСЫ ФИЛЬТРОВ ==========
function initFilterChips() {
  const chipsContainer = document.querySelector('.all-catalog-cheaps');
  if (!chipsContainer) {
    console.warn('⚠️ Контейнер чипсов не найден');
    return;
  }

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

  console.log('✅ Чипсы фильтров инициализированы');
}

// Добавление чипса
function addChip(filterType, value, checkbox) {
  const chipsContainer = document.querySelector('.all-catalog-cheaps');
  if (!chipsContainer) return;

  // Проверяем дубликаты
  const existing = chipsContainer.querySelector(`[data-value="${value}"]`);
  if (existing) return;

  const chip = document.createElement('div');
  chip.className = 'catalog-cheaps-item';
  chip.setAttribute('data-value', value);
  
  chip.innerHTML = `
    <p>${filterType}: <span>${value}</span></p>
    <button class="cheaps-item-delete" aria-label="Удалить фильтр">
      <svg width="11" height="11" viewBox="0 0 11 11" fill="none">
        <path d="M10.2083 10.6683C10.0883 10.6683 9.975 10.6217 9.88833 10.535L5.335 5.98167L0.781667 10.535C0.601667 10.715 0.315 10.715 0.135 10.535C-0.045 10.355 -0.045 10.0683 0.135 9.88833L4.68833 5.335L0.135 0.781667C-0.045 0.601667 -0.045 0.315 0.135 0.135C0.315 -0.045 0.601667 -0.045 0.781667 0.135L5.335 4.68833L9.88833 0.135C10.0683 -0.045 10.355 -0.045 10.535 0.135C10.715 0.315 10.715 0.601667 10.535 0.781667L5.98167 5.335L10.535 9.88833C10.715 10.0683 10.715 10.355 10.535 10.535C10.4483 10.6217 10.3283 10.6683 10.215 10.6683H10.2083Z" fill="#757575"/>
      </svg>
    </button>
  `;

  // Обработчик удаления чипса
  const deleteBtn = chip.querySelector('.cheaps-item-delete');
  deleteBtn.addEventListener('click', () => {
    chip.remove();
    checkbox.checked = false;
    updateClearAllButton();
  });

  // Вставляем чипс
  const clearAllBtn = chipsContainer.querySelector('.cheaps-clean');
  if (clearAllBtn) {
    chipsContainer.insertBefore(chip, clearAllBtn);
  } else {
    chipsContainer.appendChild(chip);
  }

  updateClearAllButton();
}

// Удаление чипса
function removeChip(value) {
  const chipsContainer = document.querySelector('.all-catalog-cheaps');
  if (!chipsContainer) return;

  const chip = chipsContainer.querySelector(`[data-value="${value}"]`);
  if (chip) {
    chip.remove();
    updateClearAllButton();
  }
}

// Обновление кнопки "Очистить все"
function updateClearAllButton() {
  const chipsContainer = document.querySelector('.all-catalog-cheaps');
  if (!chipsContainer) return;

  const chips = chipsContainer.querySelectorAll('.catalog-cheaps-item');
  let clearAllBtn = chipsContainer.querySelector('.cheaps-clean');

  if (chips.length > 0) {
    // Показываем кнопку "Очистить все"
    if (!clearAllBtn) {
      clearAllBtn = document.createElement('button');
      clearAllBtn.className = 'cheaps-clean';
      clearAllBtn.textContent = 'Очистить все';
      chipsContainer.appendChild(clearAllBtn);

      clearAllBtn.addEventListener('click', clearAllFilters);
    }

    // Показываем контейнер
    chipsContainer.style.display = 'flex';
  } else {
    // Скрываем контейнер, если чипсов нет
    if (clearAllBtn) clearAllBtn.remove();
    chipsContainer.style.display = 'none';
  }
}

// ========== 3. КНОПКИ "ЕЩЁ N" / "СКРЫТЬ" ==========
function initShowMoreButtons() {
  const filterSections = document.querySelectorAll('.filter-section');

  filterSections.forEach(section => {
    const brandGrid = section.querySelector('.brand-grid');
    const showMoreBtn = section.querySelector('.show-more');

    if (!brandGrid || !showMoreBtn) return;

    const items = Array.from(brandGrid.children);
    const visibleCount = 5;
    const hiddenCount = items.length - visibleCount;

    // Если элементов меньше или равно 5, кнопку не показываем
    if (hiddenCount <= 0) {
      showMoreBtn.style.display = 'none';
      return;
    }

    // Скрываем элементы после 5-го
    items.forEach((item, index) => {
      if (index >= visibleCount) {
        item.style.display = 'none';
        item.classList.add('hidden-item');
      }
    });

    // Получаем иконку
    const icon = showMoreBtn.querySelector('.toggle-icon img');
    const iconSrc = icon ? icon.src : 'assets/img/icons/arrow-down.svg';

    // Начальный текст кнопки
    showMoreBtn.innerHTML = `Ещё ${hiddenCount} <span class="toggle-icon"><img src="${iconSrc}" alt=""></span>`;

    // Обработчик клика
    showMoreBtn.addEventListener('click', function (e) {
      e.preventDefault();
      e.stopPropagation();

      const hiddenItems = brandGrid.querySelectorAll('.hidden-item');
      const isExpanded = this.classList.contains('expanded');

      if (isExpanded) {
        // Скрываем элементы
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
        // Показываем элементы
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

  console.log('✅ Кнопки "Ещё" инициализированы');
}

// ========== 4. ЗАКРЕПЛЕНИЕ ASIDE С ФИЛЬТРАМИ ==========
// 4. УЛУЧШЕННЫЙ ASIDE С КЛАССОМ
function initStickyFilters() {
    const filterAside = document.querySelector('.filter-aside');
    
    if (!filterAside) {
        console.warn('Боковая панель не найдена');
        return;
    }

    let isHovered = false;

    // Отслеживание наведения
    filterAside.addEventListener('mouseenter', function() {
        isHovered = true;
        this.classList.add('hovered');
        console.log('Курсор на фильтрах');
    });

    filterAside.addEventListener('mouseleave', function() {
        isHovered = false;
        this.classList.remove('hovered');
        console.log('Курсор вне фильтров');
    });

    // Блокировка скролла страницы когда курсор на aside
    filterAside.addEventListener('wheel', function(e) {
        if (!isHovered) {
            // Курсор не на фильтрах - ничего не делаем
            return;
        }

        const scrollTop = this.scrollTop;
        const scrollHeight = this.scrollHeight;
        const height = this.clientHeight;
        const delta = e.deltaY;

        const isScrollingUp = delta < 0;
        const isScrollingDown = delta > 0;

        // Если скроллим вверх и уже в самом верху
        if (isScrollingUp && scrollTop <= 0) {
            e.preventDefault();
            return false;
        }

        // Если скроллим вниз и уже в самом низу
        if (isScrollingDown && (scrollTop + height >= scrollHeight)) {
            e.preventDefault();
            return false;
        }

        // В остальных случаях блокируем скролл страницы
        e.stopPropagation();
        
    }, { passive: false });

    // Стили
    const style = document.createElement('style');
    style.textContent = `
        .filter-aside {
            position: sticky;
            top: 20px;
            max-height: calc(100vh - 40px);
            overflow-y: auto;
            overflow-x: hidden;
            transition: box-shadow 0.3s ease;
        }
        
        .filter-aside.hovered {
            box-shadow: 0 2px 8px rgba(0, 88, 163, 0.1);
        }
        
        .filter-aside::-webkit-scrollbar {
            width: 6px;
        }
        
        .filter-aside::-webkit-scrollbar-track {
            background: #f1f1f1;
            border-radius: 3px;
        }
        
        .filter-aside::-webkit-scrollbar-thumb {
            background: #ccc;
            border-radius: 3px;
        }
        
        .filter-aside::-webkit-scrollbar-thumb:hover {
            background: #999;
        }
        
        .all-catalog-inner {
            display: flex;
            gap: 24px;
            align-items: flex-start;
        }
        
        .filter-aside {
            flex: 0 0 256px;
            width: 256px;
        }
        
        .all-catalog-cards {
            flex: 1;
            min-width: 0;
        }
    `;
    
    document.head.appendChild(style);
    
    console.log('Sticky фильтры инициализированы');
}



// ========== 5. ОЧИСТКА ФИЛЬТРОВ ==========
function initClearFilters() {
  const clearButton = document.querySelector('.apply-filters');
  if (!clearButton) {
    console.warn('⚠️ Кнопка очистки фильтров не найдена');
    return;
  }

  clearButton.addEventListener('click', function (e) {
    e.preventDefault();
    clearAllFilters();
  });

  console.log('✅ Очистка фильтров инициализирована');
}

function clearAllFilters() {
  // Снимаем все чекбоксы
  const checkboxes = document.querySelectorAll('.brand-checkbox input[type="checkbox"]');
  checkboxes.forEach(checkbox => {
    checkbox.checked = false;
  });

  // Удаляем все чипсы
  const chipsContainer = document.querySelector('.all-catalog-cheaps');
  if (chipsContainer) {
    const chips = chipsContainer.querySelectorAll('.catalog-cheaps-item');
    chips.forEach(chip => chip.remove());
  }

  // Сбрасываем все развернутые кнопки "Ещё"
  const expandedButtons = document.querySelectorAll('.show-more.expanded');
  expandedButtons.forEach(button => {
    button.click(); // Симулируем клик для сворачивания
  });

  // Сбрасываем цветовые опции
  const activeColors = document.querySelectorAll('.color-option.active');
  activeColors.forEach(color => color.classList.remove('active'));

  // Сбрасываем поля цены (если есть)
  const priceInputs = document.querySelectorAll('.price-input');
  if (priceInputs.length >= 2) {
    priceInputs[0].value = '';
    priceInputs[1].value = '';
  }

  updateClearAllButton();

  console.log('✅ Все фильтры очищены');
}

// ========== ДОПОЛНИТЕЛЬНО: СВОРАЧИВАНИЕ СЕКЦИЙ ФИЛЬТРОВ ==========
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

  console.log('✅ Сворачивание секций фильтров инициализировано');
}

// Вызываем при загрузке
document.addEventListener('DOMContentLoaded', function () {
  initFilterSectionsToggle();
});


// ========== СЛАЙДЕР ЦЕНЫ ==========
function initPriceSlider() {
  const slider = document.querySelector('.price-slider');
  if (!slider) {
    console.warn('⚠️ Слайдер цены не найден');
    return;
  }

  const sliderFill = slider.querySelector('.price-slider-fill');
  const handleMin = slider.querySelector('.handle-min');
  const handleMax = slider.querySelector('.handle-max');
  const priceInputs = document.querySelectorAll('.price-input');

  if (!sliderFill || !handleMin || !handleMax || priceInputs.length < 2) {
    console.warn('⚠️ Элементы слайдера цены не полные');
    return;
  }

  const inputMin = priceInputs[0];
  const inputMax = priceInputs[1];

  // Настройки
  const MIN_VALUE = 19.99;
  const MAX_VALUE = 4999;
  const GAP = 10;
  
  // НОВОЕ: Начальные значения (93% от максимума)
  const INITIAL_MAX_PERCENT = 93;
  const INITIAL_MAX_VALUE = MIN_VALUE + ((MAX_VALUE - MIN_VALUE) * (INITIAL_MAX_PERCENT / 100));

  let isDraggingMin = false;
  let isDraggingMax = false;

  // Функция обновления UI слайдера
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

  // Функция получения позиции из события
  function getPositionFromEvent(e) {
    const rect = slider.getBoundingClientRect();
    let clientX = e.type.includes('touch') ? e.touches[0].clientX : e.clientX;
    let position = clientX - rect.left;
    position = Math.max(0, Math.min(position, rect.width));
    return (position / rect.width) * 100;
  }

  // Функция обновления значения из позиции
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

  // ========== ОБРАБОТЧИКИ ДЛЯ МИНИМАЛЬНОГО БЕГУНКА ==========
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

  // ========== ОБРАБОТЧИКИ ДЛЯ МАКСИМАЛЬНОГО БЕГУНКА ==========
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

  // ========== ОБРАБОТЧИКИ ДВИЖЕНИЯ ==========
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

  // ========== ОБРАБОТЧИКИ ОТПУСКАНИЯ ==========
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

  // ========== ОБРАБОТЧИКИ ДЛЯ ИНПУТОВ ==========
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

  // ========== КЛИК ПО САМОМУ СЛАЙДЕРУ ==========
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

  // ========== ИНИЦИАЛИЗАЦИЯ С НАЧАЛЬНЫМИ ЗНАЧЕНИЯМИ ==========
  // Устанавливаем начальные значения в инпуты
  inputMin.value = MIN_VALUE.toFixed(2);
  inputMax.value = INITIAL_MAX_VALUE.toFixed(2);
  
  // Обновляем слайдер
  updateSlider();
  
  console.log('✅ Слайдер цены инициализирован (max на 93%)');
}

// Добавляем инициализацию в DOMContentLoaded
document.addEventListener('DOMContentLoaded', function () {
  initPriceSlider();
});


// ========== STICKY КАРТОЧКА ТОВАРА (VERH) ==========
// Работает только на странице товара

(function() {
  'use strict';

  // Проверяем, что мы на странице товара
  function isProductPage() {
    return document.querySelector('.verh') && 
           document.querySelector('.goods') && 
           document.querySelector('main.shop-card');
  }

  // Инициализация при загрузке DOM
  document.addEventListener('DOMContentLoaded', function () {
    if (isProductPage()) {
      initStickyProductCard();
    }
  });

  // Основная функция
  function initStickyProductCard() {
    const header = document.querySelector('header');
    const verhSection = document.querySelector('.verh');
    const goodsSection = document.querySelector('.goods');

    // Дополнительная проверка элементов
    if (!header || !verhSection || !goodsSection) {
      console.warn('⚠️ Элементы для sticky карточки не найдены');
      return;
    }

    // Начальные параметры
    const goodsOffsetTop = goodsSection.offsetTop;
    let headerHeight = header.offsetHeight;
    let isSticky = false;
    let ticking = false;

    // Конфигурация
    const CONFIG = {
      triggerOffset: 500,        // Смещение от секции товара (px)
      transitionDuration: 300,   // Длительность анимации (ms)
      zIndexHeader: 1000,
      zIndexVerh: 999
    };

    // Инициализация стилей для verh
    initVerhStyles();

    // Обработчики
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onResize);

    // Проверяем начальное состояние
    handleScroll();

    // Инициализация кнопок
    initVerhButtons();

    console.log('✅ Sticky карточка товара инициализирована');

    // ========== ФУНКЦИИ ==========

    // Начальные стили для verh
    function initVerhStyles() {
      verhSection.style.cssText = `
        opacity: 0;
        display: none;
        visibility: hidden;
        transform: translateY(-20px);
        transition: all ${CONFIG.transitionDuration}ms cubic-bezier(0.4, 0, 0.2, 1);
        background: #fff;
        border-bottom: 1px solid #e0e0e0;
      `;
    }

    // Обработчик прокрутки с throttle
    function onScroll() {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          handleScroll();
          ticking = false;
        });
        ticking = true;
      }
    }

    // Основная логика прокрутки
    function handleScroll() {
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      const triggerPoint = goodsOffsetTop + CONFIG.triggerOffset;

      if (scrollTop > triggerPoint && !isSticky) {
        activateStickyMode();
      } else if (scrollTop <= triggerPoint && isSticky) {
        deactivateStickyMode();
      }
    }

    // Активация sticky режима
    function activateStickyMode() {
      isSticky = true;

      // Header
      header.style.cssText = `
        position: sticky;
        top: 0;
        z-index: ${CONFIG.zIndexHeader};
        transition: all ${CONFIG.transitionDuration}ms ease;
        background-color: #fff;
      `;
      header.classList.add('sticky');

      // Verh
      verhSection.style.cssText = `
        position: sticky;
        top: 104px;
        z-index: ${CONFIG.zIndexVerh};
        opacity: 1;
        display:block;
        visibility: visible;
        transform: translateY(0);
        background: #fff;
        border-bottom: 1px solid #e0e0e0;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        transition: all ${CONFIG.transitionDuration}ms cubic-bezier(0.4, 0, 0.2, 1);
      `;
    }

    // Деактивация sticky режима
    function deactivateStickyMode() {
      isSticky = false;

      // Verh
      verhSection.style.opacity = '0';
      verhSection.style.display = 'none';
      verhSection.style.visibility = 'hidden';
      verhSection.style.transform = 'translateY(-20px)';
      verhSection.style.boxShadow = 'none';

      // Header
      header.classList.remove('sticky');
    }

    // Обработчик изменения размера окна
    function onResize() {
      clearTimeout(onResize.timer);
      onResize.timer = setTimeout(() => {
        headerHeight = header.offsetHeight;
        if (isSticky) {
          verhSection.style.top = headerHeight + 'px';
        }
      }, 100);
    }

    // Инициализация кнопок в verh
    function initVerhButtons() {
      const addToCartBtn = verhSection.querySelector('.goods-add__cart');
      const likeBtn = verhSection.querySelector('.verh-like');

      // Кнопка "В корзину"
      if (addToCartBtn) {
        addToCartBtn.addEventListener('click', function(e) {
          e.preventDefault();
          
          // Анимация клика
          this.style.transform = 'scale(0.95)';
          setTimeout(() => {
            this.style.transform = 'scale(1)';
          }, 150);

          // Синхронизация с основной кнопкой
          const mainCartBtn = goodsSection.querySelector('.goods-add__cart');
          if (mainCartBtn) {
            mainCartBtn.click();
          }

          console.log('🛒 Товар добавлен в корзину (из sticky панели)');
        });
      }

      // Кнопка "Избранное"
      if (likeBtn) {
        likeBtn.addEventListener('click', function(e) {
          e.preventDefault();
          
          this.classList.toggle('active');

          // Синхронизация с основной кнопкой избранного
          const mainLikeBtn = goodsSection.querySelector('.like');
          if (mainLikeBtn) {
            mainLikeBtn.click();
          }

          console.log('❤️ Товар добавлен/удален из избранного');
        });
      }
    }
  }

})();

// ========== ВЫПАДАЮЩЕЕ МЕНЮ ПРОФИЛЯ ==========

document.addEventListener('DOMContentLoaded', function() {
  initProfileDropdown();
});

function initProfileDropdown() {
  const toggleButton = document.getElementById('profileMenuToggle');
  const dropdown = document.getElementById('profileDropdown');
  const logoutButton = document.getElementById('logoutButton');
  
  if (!toggleButton || !dropdown) {
    console.warn('⚠️ Элементы профиля не найдены');
    return;
  }

  // Открытие/закрытие меню
  toggleButton.addEventListener('click', function(e) {
    e.stopPropagation();
    dropdown.classList.toggle('active');
    
    if (dropdown.classList.contains('active')) {
      console.log('📂 Меню профиля открыто');
    } else {
      console.log('📁 Меню профиля закрыто');
    }
  });

  // Закрытие при клике вне меню
  document.addEventListener('click', function(e) {
    if (!dropdown.contains(e.target) && !toggleButton.contains(e.target)) {
      dropdown.classList.remove('active');
    }
  });

  // Закрытие при нажатии Escape
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && dropdown.classList.contains('active')) {
      dropdown.classList.remove('active');
    }
  });

  // Обработка выхода
  if (logoutButton) {
    logoutButton.addEventListener('click', function() {
      handleLogout();
    });
  }

  // Закрытие на мобильных при клике на псевдоэлемент (крестик)
  if (window.innerWidth <= 576) {
    dropdown.addEventListener('click', function(e) {
      const rect = this.getBoundingClientRect();
      const clickX = e.clientX - rect.left;
      const clickY = e.clientY - rect.top;
      
      // Проверяем клик в области крестика (верхний правый угол)
      if (clickX > rect.width - 60 && clickY < 60) {
        dropdown.classList.remove('active');
      }
    });
  }

  console.log('✅ Выпадающее меню профиля инициализировано');
}

// Функция выхода из аккаунта
function handleLogout() {
  const confirmed = confirm('Вы действительно хотите выйти?');
  
  if (confirmed) {
    console.log('🚪 Выход из аккаунта...');
    
    // В реальном приложении отправить запрос на сервер
    // fetch('/api/logout', { method: 'POST' })
    //   .then(() => {
    //     window.location.href = '/';
    //   });
    
    // Временная эмуляция
    setTimeout(() => {
      alert('Вы вышли из аккаунта');
      window.location.href = '/';
    }, 500);
  }
}

// Обновление счётчика заказов
function updateOrdersCount(count) {
  const badge = document.querySelector('.profile-badge');
  const menuBadge = document.querySelector('.menu-item-badge');
  
  if (badge) {
    badge.textContent = count;
    badge.style.display = count > 0 ? 'flex' : 'none';
  }
  
  if (menuBadge) {
    menuBadge.textContent = count;
    menuBadge.style.display = count > 0 ? 'flex' : 'none';
  }
  
  console.log(`🔢 Счётчик заказов обновлён: ${count}`);
}

// Загрузка данных профиля
function loadProfileData() {
  // В реальном приложении получать с сервера
  const profileData = {
    name: 'Иннокентий',
    ordersCount: 3
  };
  
  // Обновляем имя
  const profileName = document.querySelector('.profile-name');
  if (profileName) {
    profileName.textContent = profileData.name;
  }
  
  // Обновляем счётчики
  updateOrdersCount(profileData.ordersCount);
}

// Автозагрузка при инициализации
document.addEventListener('DOMContentLoaded', function() {
  loadProfileData();
});

// ========== ПЛАВАЮЩАЯ КНОПКА ЧАТА ==========

document.addEventListener('DOMContentLoaded', function() {
  initFabChat();
});

function initFabChat() {
  const fabButton = document.getElementById('fabChat');
  const fabBadge = document.getElementById('fabChatBadge');
  
  if (!fabButton) {
    console.warn('⚠️ FAB кнопка не найдена');
    return;
  }

  // Ripple эффект
  fabButton.addEventListener('click', function(e) {
    createRipple(e);
    openChat();
  });

  // Показываем кнопку с анимацией при загрузке
  setTimeout(() => {
    fabButton.classList.add('show');
  }, 500);

  // Опционально: скрытие при прокрутке вниз
  // handleScrollBehavior(fabButton);

  console.log('✅ FAB кнопка чата инициализирована');
}

// Создание ripple эффекта
function createRipple(event) {
  const button = event.currentTarget;
  const circle = document.createElement('span');
  const diameter = Math.max(button.clientWidth, button.clientHeight);
  const radius = diameter / 2;

  const rect = button.getBoundingClientRect();
  const x = event.clientX - rect.left - radius;
  const y = event.clientY - rect.top - radius;

  circle.style.width = circle.style.height = `${diameter}px`;
  circle.style.left = `${x}px`;
  circle.style.top = `${y}px`;
  circle.classList.add('ripple-effect');

  const ripple = button.querySelector('.ripple-effect');
  if (ripple) {
    ripple.remove();
  }

  button.appendChild(circle);

  setTimeout(() => {
    circle.remove();
  }, 600);
}

// Открытие чата
function openChat() {
  console.log('💬 Открытие чата...');
  
  // Здесь можно добавить логику открытия модального окна чата
  // или перенаправление на страницу чата
  
  alert('Чат открывается!');
  
  // Сбрасываем счётчик непрочитанных
  updateChatBadge(0);
}

// Обновление счётчика непрочитанных сообщений
function updateChatBadge(count) {
  const badge = document.getElementById('fabChatBadge');
  
  if (!badge) return;
  
  if (count > 0) {
    badge.textContent = count > 99 ? '99+' : count;
    badge.classList.remove('hidden');
  } else {
    badge.classList.add('hidden');
  }
  
  console.log(`🔢 Обновлён счётчик чата: ${count}`);
}

// Скрытие/показ кнопки при прокрутке (опционально)
function handleScrollBehavior(fabButton) {
  let lastScrollTop = 0;
  let scrollThreshold = 100; // Порог прокрутки в пикселях
  
  window.addEventListener('scroll', function() {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    
    // Скрываем при прокрутке вниз, показываем при прокрутке вверх
    if (scrollTop > lastScrollTop && scrollTop > scrollThreshold) {
      // Прокрутка вниз
      fabButton.classList.add('scroll-hidden');
    } else {
      // Прокрутка вверх
      fabButton.classList.remove('scroll-hidden');
    }
    
    lastScrollTop = scrollTop;
  });
}

// Показать кнопку программно
function showFabChat() {
  const fabButton = document.getElementById('fabChat');
  if (fabButton) {
    fabButton.classList.remove('hide', 'scroll-hidden');
    fabButton.classList.add('show');
  }
}

// Скрыть кнопку программно
function hideFabChat() {
  const fabButton = document.getElementById('fabChat');
  if (fabButton) {
    fabButton.classList.remove('show');
    fabButton.classList.add('hide');
  }
}

// Пример использования обновления счётчика
// updateChatBadge(5); // Установить 5 непрочитанных сообщений
// updateChatBadge(0); // Сбросить счётчик


// ========== STICKY HEADER (BOTTOM ТОЛЬКО В ВЕРХУ) ==========

(function() {
    'use strict';

    const header = document.querySelector('.header');
    const headerTop = document.querySelector('.header-top');
    const headerMiddle = document.querySelector('.header-middle');
    const headerBottom = document.querySelector('.header-bottom');
    
    if (!header || !headerTop || !headerMiddle || !headerBottom) {
        console.warn('Header elements not found');
        return;
    }

    let isSticky = false;
    const scrollThreshold = 10; // Минимальный порог для определения "верха"

    function handleScroll() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        if (scrollTop > scrollThreshold) {
            // Любой скролл - включаем sticky и скрываем bottom
            if (!isSticky) {
                header.classList.add('sticky');
                headerBottom.classList.add('hidden');
                isSticky = true;
            }
        } else {
            // В самом верху - показываем всё
            header.classList.remove('sticky');
            headerBottom.classList.remove('hidden');
            isSticky = false;
        }
    }

    // Throttle для оптимизации
    let ticking = false;
    
    window.addEventListener('scroll', function() {
        if (!ticking) {
            window.requestAnimationFrame(function() {
                handleScroll();
                ticking = false;
            });
            ticking = true;
        }
    });

    // Первоначальная проверка
    handleScroll();

})();
