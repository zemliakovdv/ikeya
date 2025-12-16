const startSlider = new Swiper('.start-slider__swiper', {
    loop: false, // Важно! loop должен быть false
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

    // Событие при инициализации и смене слайда
    on: {
        init: function () {
            updateNavigationButtons(this);
        },
        slideChange: function () {
            updateNavigationButtons(this);
        }
    }
});

// Функция обновления видимости кнопок
function updateNavigationButtons(swiper) {
    const prevBtn = document.querySelector('.start-slider__nav-prev');
    const nextBtn = document.querySelector('.start-slider__nav-next');

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
            updateCategoriesNav(this);
        },
        slideChange: function () {
            updateCategoriesNav(this);
        }
    }
});

function updateCategoriesNav(swiper) {
    const prevBtn = document.querySelector('.popular-categories__nav-prev');
    const nextBtn = document.querySelector('.popular-categories__nav-next');

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

// Инициализация всех галерей товаров
function initProductGalleries() {
    // Находим все галереи
    const galleries = document.querySelectorAll('.product-gallery-main');

    galleries.forEach((mainGallery) => {
        const galleryId = mainGallery.dataset.gallery;
        const thumbsGallery = document.querySelector(`[data-gallery-thumbs="${galleryId}"]`);

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

        // Проверяем количество изображений и добавляем счетчик
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

// Проверяем положение слайда и скрываем/показываем кнопки
function updateNavButtons(swiper, btnPrev, btnNext) {
    if (!btnPrev || !btnNext) return;
    if (swiper.isBeginning) {
        btnPrev.style.display = "none";
    } else {
        btnPrev.style.display = "";
    }
    if (swiper.isEnd) {
        btnNext.style.display = "none";
    } else {
        btnNext.style.display = "";
    }
}

// Инициализация слайдеров товаров для каждого таба
function initProductsSliders() {
    const sliders = document.querySelectorAll('.products-slider');

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
                el: '.products-slider__pagination',
                clickable: true,
            },
            on: {
                init: function () {
                    updateNavButtons(swiper, btnPrev, btnNext);
                },
                slideChange: function () {
                    updateNavButtons(swiper, btnPrev, btnNext);
                }
            }
        });
    });
}

// Инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', function () {
    initProductGalleries();
    initProductsSliders();
});

// Переинициализация галерей при переключении табов
const tabButtons = document.querySelectorAll('[data-bs-toggle="tab"]');
tabButtons.forEach(button => {
    button.addEventListener('shown.bs.tab', function () {
        setTimeout(() => {
            initProductGalleries();
            initProductsSliders();
        }, 100);
    });
});

// Инициализация слайдера промо-карточек
let promoCardsSlider;

function initPromoCardsSlider() {
    // Уничтожаем предыдущий экземпляр, если есть
    if (promoCardsSlider) {
        promoCardsSlider.destroy(true, true);
    }
    
    promoCardsSlider = new Swiper('.promo-card-inner', {
        slidesPerView: 3,
        spaceBetween: 20,
        loop: false,
        speed: 600,
        watchOverflow: true, // Скрывает навигацию, если слайдов мало
        
        navigation: {
            nextEl: '.promo-cards-slider__nav-next',
            prevEl: '.promo-cards-slider__nav-prev',
        },
        
        pagination: {
            el: '.promo-cards-slider__pagination',
            clickable: true,
        },
        
        breakpoints: {
            // Мобильные устройства
            320: {
                slidesPerView: 1,
                spaceBetween: 15,
            },
            // Планшеты
            768: {
                slidesPerView: 2,
                spaceBetween: 15,
            },
            // Десктоп маленький
            992: {
                slidesPerView: 2,
                spaceBetween: 20,
            },
            // Десктоп большой
            1200: {
                slidesPerView: 3,
                spaceBetween: 20,
            },
        },
        
        on: {
            init: function() {
                updatePromoNav(this);
            },
            slideChange: function() {
                updatePromoNav(this);
            },
            resize: function() {
                this.update();
            }
        }
    });
}

// Функция обновления видимости кнопок навигации
function updatePromoNav(swiper) {
    const prevBtn = document.querySelector('.promo-cards-slider__nav-prev');
    const nextBtn = document.querySelector('.promo-cards-slider__nav-next');
    
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

// Инициализация при загрузке DOM
document.addEventListener('DOMContentLoaded', function() {
    initPromoCardsSlider();
});

// Переинициализация при изменении размера окна (с debounce)
let resizeTimer;
window.addEventListener('resize', function() {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(function() {
        if (promoCardsSlider) {
            promoCardsSlider.update();
        }
    }, 250);
});

// Инициализация слайдера рекламных баннеров
let adsBannerSlider;

function initAdsBannerSlider() {
    // Уничтожаем предыдущий экземпляр, если есть
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
            init: function() {
                updateAdsBannerNav(this);
            },
            slideChange: function() {
                updateAdsBannerNav(this);
            },
            resize: function() {
                this.update();
            }
        }
    });
}

// Функция обновления видимости кнопок навигации
function updateAdsBannerNav(swiper) {
    const prevBtn = document.querySelector('.ads-banner-slider__nav-prev');
    const nextBtn = document.querySelector('.ads-banner-slider__nav-next');
    
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

// Инициализация при загрузке DOM
document.addEventListener('DOMContentLoaded', function() {
    initAdsBannerSlider();
});

// Переинициализация при изменении размера окна (с debounce)
let adsBannerResizeTimer;
window.addEventListener('resize', function() {
    clearTimeout(adsBannerResizeTimer);
    adsBannerResizeTimer = setTimeout(function() {
        if (adsBannerSlider) {
            adsBannerSlider.update();
        }
    }, 250);
});

// Инициализация слайдера блога
let blogSlider;

function initBlogSlider() {
    // Уничтожаем предыдущий экземпляр, если есть
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
            init: function() {
                updateBlogNav(this);
            },
            slideChange: function() {
                updateBlogNav(this);
            },
            resize: function() {
                this.update();
            }
        }
    });
}

// Функция обновления видимости кнопок навигации
function updateBlogNav(swiper) {
    const prevBtn = document.querySelector('.blog-slider__nav-prev');
    const nextBtn = document.querySelector('.blog-slider__nav-next');
    
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

// Инициализация при загрузке DOM
document.addEventListener('DOMContentLoaded', function() {
    initBlogSlider();
});

// Переинициализация при изменении размера окна (с debounce)
let blogResizeTimer;
window.addEventListener('resize', function() {
    clearTimeout(blogResizeTimer);
    blogResizeTimer = setTimeout(function() {
        if (blogSlider) {
            blogSlider.update();
        }
    }, 250);
});


document.addEventListener('DOMContentLoaded', function() {
    const catalogButton = document.getElementById('catalogButton');
    const catalogModal = document.getElementById('catalogModal');
    const catalogModalBody = catalogModal?.querySelector('.catalog-modal-body');
    const ANIMATION_DURATION = 350; // миллисекунды (под fade)
    
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
        
        // Принудительный reflow для корректной работы transition
        catalogModal.offsetHeight;
        
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
    
    // Обработчик клика по кнопке
    catalogButton.addEventListener('click', function(e) {
        e.stopPropagation();
        toggleCatalogModal();
    });
    
    // Закрытие при клике вне modal-body
    catalogModal.addEventListener('click', function(e) {
        // Проверяем, что клик был по фону, а не по содержимому
        if (e.target === catalogModal || 
            e.target.classList.contains('container') || 
            e.target.classList.contains('row') ||
            e.target.classList.contains('col-12')) {
            closeModal();
        }
    });
    
    // Предотвращаем закрытие при клике внутри modal-body
    if (catalogModalBody) {
        catalogModalBody.addEventListener('click', function(e) {
            e.stopPropagation();
        });
    }
    
    // Закрытие по Escape
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && isModalOpen()) {
            closeModal();
        }
    });
    
    catalogButton.classList.add('toggle-btn');
});

document.addEventListener('DOMContentLoaded', function() {
    // Элементы меню
    const menuItems = document.querySelectorAll('.div .item, .div .item-2');
    const categoryGroups = document.querySelectorAll('.category-group');
    
    // Функция для показа категории
    function showCategory(categoryId) {
        // Скрываем все категории
        categoryGroups.forEach(group => {
            group.classList.remove('active');
            group.style.display = 'none';
        });
        
        // Показываем нужную категорию
        const targetCategory = document.querySelector(`.category-group[data-category="${categoryId}"]`);
        if (targetCategory) {
            targetCategory.classList.add('active');
            targetCategory.style.display = 'block';
        }
        
        // Обновляем активный пункт меню
        menuItems.forEach(item => {
            item.classList.remove('active');
            if (item.getAttribute('data-category') === categoryId) {
                item.classList.add('active');
            }
        });
    }
    
    // Обработчики событий для пунктов меню
    menuItems.forEach(item => {
        const categoryId = item.getAttribute('data-category');
        
        // Наведение мыши
        item.addEventListener('mouseenter', function() {
            showCategory(categoryId);
        });
        
        // Клик (если нужно по клику)
        item.addEventListener('click', function(e) {
            e.preventDefault();
            showCategory(categoryId);
        });
    });
    
    // Показываем категорию "sad-i-balkon" по умолчанию
    showCategory('sad-i-balkon');
});


document.addEventListener('DOMContentLoaded', function () {
    const seoTextContent = document.querySelector('.seo-text-content');
    const showBtn = document.querySelector('.button-text');
    const hideBtn = document.querySelector('.button-text-hidden');

    showBtn.addEventListener('click', function () {
        seoTextContent.classList.add('open');
    });

    hideBtn.addEventListener('click', function () {
        seoTextContent.classList.remove('open');
    });
});

document.addEventListener('DOMContentLoaded', function() {
    const sortBlock = document.querySelector('.catalog-sort');
    const selected = sortBlock.querySelector('.catalog-sort__selected');
    const currentText = sortBlock.querySelector('.catalog-sort__current');
    const options = sortBlock.querySelectorAll('.catalog-sort__option');

    // Открытие/закрытие списка
    selected.addEventListener('click', function(e) {
        e.stopPropagation();
        sortBlock.classList.toggle('open');
    });

    // Выбор опции
    options.forEach(option => {
        option.addEventListener('click', function() {
            // Снимаем active со всех
            options.forEach(opt => opt.classList.remove('active'));
            
            // Добавляем active к выбранной
            this.classList.add('active');
            
            // Обновляем текст
            currentText.textContent = this.textContent;
            
            // Закрываем список
            sortBlock.classList.remove('open');
            
            // Получаем значение сортировки
            const sortType = this.dataset.sort;
            console.log('Выбрана сортировка:', sortType);
            
            // Здесь вызываем функцию сортировки каталога
            applySorting(sortType);
        });
    });

    // Закрытие при клике вне списка
    document.addEventListener('click', function(e) {
        if (!sortBlock.contains(e.target)) {
            sortBlock.classList.remove('open');
        }
    });

    // Закрытие по Escape
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            sortBlock.classList.remove('open');
        }
    });
});

// Функция применения сортировки (пример)
function applySorting(sortType) {
    console.log('Применяем сортировку:', sortType);
    
    // Здесь ваша логика сортировки товаров
    // Например, AJAX-запрос или сортировка элементов на странице
    
    switch(sortType) {
        case 'popular':
            // Сортировка по популярности
            break;
        case 'price-asc':
            // Сортировка по возрастанию цены
            break;
        case 'price-desc':
            // Сортировка по убыванию цены
            break;
        case 'name-asc':
            // Сортировка по имени А-Я
            break;
        case 'name-desc':
            // Сортировка по имени Я-А
            break;
        case 'new':
            // Сортировка по новизне
            break;
    }
}

// Полный скрипт для фильтров

document.addEventListener('DOMContentLoaded', function() {
    
    // ========== КНОПКИ "ЕЩЁ N" / "СКРЫТЬ" ==========
    function initShowMoreButtons() {
        document.querySelectorAll('.show-more').forEach(button => {
            const container = button.previousElementSibling;
            
            if (!container) return;
            
            const items = Array.from(container.children);
            const visibleCount = 5;
            const hiddenCount = items.length - visibleCount;
            
            if (hiddenCount <= 0) {
                button.style.display = 'none';
                return;
            }
            
            // Скрываем элементы после 5-го
            items.forEach((item, index) => {
                if (index >= visibleCount) {
                    item.style.display = 'none';
                    item.classList.add('hidden-item');
                }
            });
            
            // Получаем путь к иконке
            const icon = button.querySelector('.toggle-icon img');
            const iconSrc = icon ? icon.src : 'assets/img/icons/arrow-down.svg';
            
            // Устанавливаем начальный текст
            button.innerHTML = `Ещё ${hiddenCount} <span class="toggle-icon"><img src="${iconSrc}" alt=""></span>`;
            
            // Обработчик клика
            button.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation();
                
                const hiddenItems = container.querySelectorAll('.hidden-item');
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
    }
    
    // ========== СВОРАЧИВАНИЕ/РАЗВОРАЧИВАНИЕ СЕКЦИЙ ==========
    document.querySelectorAll('.section-title').forEach(title => {
        title.addEventListener('click', function() {
            const section = this.parentElement;
            const content = Array.from(section.children).filter(child => !child.classList.contains('section-title'));
            const icon = this.querySelector('.toggle-icon');
            
            content.forEach(el => {
                el.style.display = el.style.display === 'none' ? 'block' : 'none';
            });
            
            if (icon) {
                icon.textContent = icon.textContent === '▼' ? '▲' : '▼';
            }
        });
    });

    
    
    // ========== ВЫБОР РАЗМЕРОВ ==========
    document.querySelectorAll('.dimension-option').forEach(option => {
        option.addEventListener('click', function() {
            // Снимаем активный класс со всех в родительской секции
            this.parentElement.querySelectorAll('.dimension-option').forEach(opt => {
                opt.classList.remove('active');
            });
            // Добавляем активный класс к выбранному
            this.classList.add('active');
        });
    });
    
    // ========== ВЫБОР ЦВЕТА ==========
    document.querySelectorAll('.color-option').forEach(color => {
        color.addEventListener('click', function() {
            // Снимаем активный класс со всех цветов в родительской секции
            const parentGrid = this.closest('.brand-grid');
            if (parentGrid) {
                parentGrid.querySelectorAll('.color-option').forEach(opt => {
                    opt.classList.remove('active');
                });
            }
            // Добавляем активный класс к выбранному
            this.classList.add('active');
            
            // Также отмечаем чекбокс родительского label
            const parentLabel = this.closest('.brand-checkbox');
            if (parentLabel) {
                const checkbox = parentLabel.querySelector('input[type="checkbox"]');
                if (checkbox) {
                    checkbox.checked = true;
                }
            }
        });
    });
    
    // ========== СИНХРОНИЗАЦИЯ ЧЕКБОКСОВ С ЦВЕТАМИ ==========
    document.querySelectorAll('.brand-checkbox input[type="checkbox"]').forEach(checkbox => {
        checkbox.addEventListener('change', function() {
            const parentLabel = this.closest('.brand-checkbox');
            const colorOption = parentLabel.querySelector('.color-option');
            
            if (colorOption) {
                if (this.checked) {
                    colorOption.classList.add('active');
                } else {
                    colorOption.classList.remove('active');
                }
            }
        });
    });
    
    // ========== ОЧИСТКА ФИЛЬТРОВ ==========
    const clearButton = document.querySelector('.apply-filters');
    if (clearButton) {
        clearButton.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Сброс всех чекбоксов
            document.querySelectorAll('input[type="checkbox"]').forEach(checkbox => {
                checkbox.checked = false;
            });
            
            // Сброс всех активных размеров
            document.querySelectorAll('.dimension-option.active').forEach(active => {
                active.classList.remove('active');
            });
            
            // Активируем первый размер в каждой секции размеров
            document.querySelectorAll('.dimension-options').forEach(options => {
                const firstOption = options.querySelector('.dimension-option:first-child');
                if (firstOption) {
                    firstOption.classList.add('active');
                }
            });
            
            // Сброс всех активных цветов
            document.querySelectorAll('.color-option.active').forEach(active => {
                active.classList.remove('active');
            });
            
            // Активируем первый цвет
            const firstColor = document.querySelector('.color-option');
            if (firstColor) {
                firstColor.classList.add('active');
            }
            
            // Сброс полей цены
            const priceInputs = document.querySelectorAll('.price-input');
            if (priceInputs.length >= 2) {
                priceInputs[0].value = '100';
                priceInputs[1].value = '10000';
            }
            
            // Сброс всех развернутых кнопок "Ещё N" / "Скрыть"
            document.querySelectorAll('.show-more.expanded').forEach(button => {
                button.click(); // Симулируем клик для сворачивания
            });
            
            console.log('Все фильтры очищены');
            
            // Можно добавить уведомление пользователю
            // alert('Фильтры очищены');
        });
    }
    
    // ========== ИНИЦИАЛИЗАЦИЯ КНОПОК "ЕЩЁ" ==========
    initShowMoreButtons();
    
});


// ========== СЛАЙДЕР ЦЕНЫ ==========
function initPriceSlider() {
    const slider = document.querySelector('.price-slider');
    if (!slider) return;
    
    const sliderFill = slider.querySelector('.price-slider-fill');
    const handleMin = slider.querySelector('.handle-min');
    const handleMax = slider.querySelector('.handle-max');
    const inputMin = document.querySelectorAll('.price-input')[0];
    const inputMax = document.querySelectorAll('.price-input')[1];
    
    // Настройки
    const MIN_VALUE = 19.99;
    const MAX_VALUE = 4999;
    const GAP = 1; // Минимальная разница между значениями
    
    let isDraggingMin = false;
    let isDraggingMax = false;
    
    // Функция обновления UI слайдера
    function updateSlider() {
        const minValue = parseInt(inputMin.value) || MIN_VALUE;
        const maxValue = parseInt(inputMax.value) || MAX_VALUE;
        
        const minPercent = ((minValue - MIN_VALUE) / (MAX_VALUE - MIN_VALUE)) * 100;
        const maxPercent = ((maxValue - MIN_VALUE) / (MAX_VALUE - MIN_VALUE)) * 100;
        
        handleMin.style.left = minPercent + '%';
        handleMax.style.left = maxPercent + '%';
        
        sliderFill.style.left = minPercent + '%';
        sliderFill.style.width = (maxPercent - minPercent) + '%';
    }
    
    // Функция получения позиции в пикселях
    function getPositionFromEvent(e) {
        const rect = slider.getBoundingClientRect();
        let clientX = e.type.includes('touch') ? e.touches[0].clientX : e.clientX;
        let position = clientX - rect.left;
        position = Math.max(0, Math.min(position, rect.width));
        return (position / rect.width) * 100;
    }
    
    // Функция обновления значения из позиции
    function updateValueFromPosition(percent, isMin) {
        let value = Math.round((percent / 100) * (MAX_VALUE - MIN_VALUE) + MIN_VALUE);
        
        if (isMin) {
            const maxValue = parseInt(inputMax.value);
            value = Math.min(value, maxValue - GAP);
            value = Math.max(value, MIN_VALUE);
            inputMin.value = value;
        } else {
            const minValue = parseInt(inputMin.value);
            value = Math.max(value, minValue + GAP);
            value = Math.min(value, MAX_VALUE);
            inputMax.value = value;
        }
        
        updateSlider();
    }
    
    // Обработчики для минимального бегунка
    handleMin.addEventListener('mousedown', (e) => {
        e.preventDefault();
        isDraggingMin = true;
        handleMin.classList.add('active');
    });
    
    handleMin.addEventListener('touchstart', (e) => {
        isDraggingMin = true;
        handleMin.classList.add('active');
    });
    
    // Обработчики для максимального бегунка
    handleMax.addEventListener('mousedown', (e) => {
        e.preventDefault();
        isDraggingMax = true;
        handleMax.classList.add('active');
    });
    
    handleMax.addEventListener('touchstart', (e) => {
        isDraggingMax = true;
        handleMax.classList.add('active');
    });
    
    // Обработчики движения
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
    });
    
    // Обработчики отпускания
    document.addEventListener('mouseup', () => {
        if (isDraggingMin) {
            isDraggingMin = false;
            handleMin.classList.remove('active');
        }
        if (isDraggingMax) {
            isDraggingMax = false;
            handleMax.classList.remove('active');
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
    
    // Обработчики для инпутов
    inputMin.addEventListener('input', function() {
        let value = parseInt(this.value) || MIN_VALUE;
        const maxValue = parseInt(inputMax.value);
        
        if (value > maxValue - GAP) {
            value = maxValue - GAP;
            this.value = value;
        }
        if (value < MIN_VALUE) {
            value = MIN_VALUE;
            this.value = value;
        }
        
        updateSlider();
    });
    
    inputMax.addEventListener('input', function() {
        let value = parseInt(this.value) || MAX_VALUE;
        const minValue = parseInt(inputMin.value);
        
        if (value < minValue + GAP) {
            value = minValue + GAP;
            this.value = value;
        }
        if (value > MAX_VALUE) {
            value = MAX_VALUE;
            this.value = value;
        }
        
        updateSlider();
    });
    
    // Клик по самому слайдеру
    slider.addEventListener('click', (e) => {
        if (e.target.classList.contains('slider-handle')) return;
        
        const percent = getPositionFromEvent(e);
        const value = Math.round((percent / 100) * (MAX_VALUE - MIN_VALUE) + MIN_VALUE);
        const minValue = parseInt(inputMin.value);
        const maxValue = parseInt(inputMax.value);
        
        // Определяем, к какому бегунку ближе клик
        const distanceToMin = Math.abs(value - minValue);
        const distanceToMax = Math.abs(value - maxValue);
        
        if (distanceToMin < distanceToMax) {
            updateValueFromPosition(percent, true);
        } else {
            updateValueFromPosition(percent, false);
        }
    });
    
    // Инициализация
    updateSlider();
}

// Добавьте эту строку в DOMContentLoaded
document.addEventListener('DOMContentLoaded', function() {
    // ... весь ваш предыдущий код ...
    
    // Инициализация слайдера цены
    initPriceSlider();
});


document.addEventListener('DOMContentLoaded', function() {
    const callbackLink = document.querySelector('a[href="#"]');
    
    if (!callbackLink) return;
    
    const countdownSpan = callbackLink.querySelector('span.code-count');
    
    if (!countdownSpan) return;
    
    let seconds = 30; // Начальное значение в секундах
    let isCountdownActive = false;
    
    // Функция форматирования времени (MM:SS)
    function formatTime(totalSeconds) {
        const minutes = Math.floor(totalSeconds / 60);
        const secs = totalSeconds % 60;
        return `${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
    }
    
    // Функция запуска обратного отсчета
    function startCountdown() {
        if (isCountdownActive) return;
        
        isCountdownActive = true;
        callbackLink.style.pointerEvents = 'none'; // Блокируем клик
        callbackLink.style.opacity = '0.6'; // Визуально показываем, что неактивна
        
        seconds = 30; // Сброс на 30 секунд
        countdownSpan.textContent = formatTime(seconds);
        
        const interval = setInterval(() => {
            seconds--;
            countdownSpan.textContent = formatTime(seconds);
            
            if (seconds <= 0) {
                clearInterval(interval);
                isCountdownActive = false;
                callbackLink.style.pointerEvents = 'auto'; // Разблокируем клик
                callbackLink.style.opacity = '1'; // Возвращаем нормальный вид
                countdownSpan.textContent = formatTime(30); // Возвращаем 00:30
            }
        }, 1000);
    }
    
    // Обработчик клика
    callbackLink.addEventListener('click', function(e) {
        e.preventDefault();
        
        if (!isCountdownActive) {
            startCountdown();
            
            // Здесь можно добавить вызов API для запроса звонка
            console.log('Запрос звонка отправлен');
        }
    });
    
    // Инициализация начального значения
    countdownSpan.textContent = formatTime(30);
    
    // 🚀 АВТОЗАПУСК при загрузке страницы
    startCountdown();
});


document.addEventListener('DOMContentLoaded', function() {
    const upTheHideElements = document.querySelectorAll('.up-the-hide');
    
    upTheHideElements.forEach(element => {
        element.addEventListener('click', function() {
            // Ищем ближайший родительский элемент с классом modal-body
            const modalBody = this.closest('.modal-body');
            
            if (modalBody) {
                // Находим элемент с классом the-hide внутри modal-body
                const theHideElement = modalBody.querySelector('.login-notice');
                
                if (theHideElement) {
                    // Переключаем класс the-hide (убираем, если есть; добавляем, если нет)
                    theHideElement.classList.toggle('.the-hide');
                }
            }
        });
    });
});


document.addEventListener('DOMContentLoaded', function() {
    const searchButton = document.querySelector('.search-but');
    
    if (searchButton) {
        searchButton.addEventListener('click', function(e) {
            e.preventDefault();
            window.location.href = 'catalog-search.html';
        });
    }
});


// Инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', function() {
    initFilterChips();
});

function initFilterChips() {
    const chipsContainer = document.querySelector('.all-catalog-cheaps');
    const checkboxes = document.querySelectorAll('.brand-checkbox input[type="checkbox"]');
    const priceInputs = document.querySelectorAll('.price-input');
    
    // Создаём контейнер для чипсов, если его нет
    if (!chipsContainer) {
        const container = document.createElement('div');
        container.className = 'all-catalog-cheaps';
        // Вставляем контейнер перед фильтрами или в нужное место
        const filterSidebar = document.querySelector('.filter-sidebar'); // Замени на твой селектор
        if (filterSidebar) {
            filterSidebar.insertAdjacentElement('afterbegin', container);
        }
    }
    
    // Обработчик для чекбоксов коллекций
    checkboxes.forEach(checkbox => {
        checkbox.addEventListener('change', function() {
            const label = this.closest('.brand-checkbox');
            const brandName = label.querySelector('span:last-child').textContent.trim();
            const sectionTitle = this.closest('.filter-section').querySelector('.section-title span:first-child').textContent.trim();
            
            if (this.checked) {
                addChip(sectionTitle, brandName, 'collection', this);
            } else {
                removeChip('collection', brandName);
            }
        });
        
        // Добавляем чипсы для уже отмеченных чекбоксов при загрузке
        if (checkbox.checked) {
            const label = checkbox.closest('.brand-checkbox');
            const brandName = label.querySelector('span:last-child').textContent.trim();
            const sectionTitle = checkbox.closest('.filter-section').querySelector('.section-title span:first-child').textContent.trim();
            addChip(sectionTitle, brandName, 'collection', checkbox);
        }
    });
    
    // Обработчик для инпутов цены
    priceInputs.forEach(input => {
        input.addEventListener('change', updatePriceChip);
        input.addEventListener('blur', updatePriceChip);
    });
    
    // Инициализируем чипс цены, если есть значения
    updatePriceChip();
    
    // Обработчик для кнопки "Очистить все"
    updateClearAllButton();
}

// Добавление чипса
function addChip(filterType, value, dataType, relatedElement) {
    const container = document.querySelector('.all-catalog-cheaps');
    if (!container) return;
    
    // Проверяем, нет ли уже такого чипса
    const existingChip = container.querySelector(`[data-type="${dataType}"][data-value="${value}"]`);
    if (existingChip) return;
    
    const chip = document.createElement('div');
    chip.className = 'catalog-cheaps-item';
    chip.setAttribute('data-type', dataType);
    chip.setAttribute('data-value', value);
    
    chip.innerHTML = `
        <p>${filterType}: <span>${value}</span></p>
        <button class="cheaps-item-delete">
            <svg width="11" height="11" viewBox="0 0 11 11" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M10.2083 10.6683C10.0883 10.6683 9.975 10.6217 9.88833 10.535L5.335 5.98167L0.781667 10.535C0.601667 10.715 0.315 10.715 0.135 10.535C-0.045 10.355 -0.045 10.0683 0.135 9.88833L4.68833 5.335L0.135 0.781667C-0.045 0.601667 -0.045 0.315 0.135 0.135C0.315 -0.045 0.601667 -0.045 0.781667 0.135L5.335 4.68833L9.88833 0.135C10.0683 -0.045 10.355 -0.045 10.535 0.135C10.715 0.315 10.715 0.601667 10.535 0.781667L5.98167 5.335L10.535 9.88833C10.715 10.0683 10.715 10.355 10.535 10.535C10.4483 10.6217 10.3283 10.6683 10.215 10.6683H10.2083Z" fill="#757575"/>
            </svg>
        </button>
    `;
    
    // Обработчик удаления
    const deleteBtn = chip.querySelector('.cheaps-item-delete');
    deleteBtn.addEventListener('click', function() {
        removeChip(dataType, value);
        
        // Снимаем галочку с чекбокса
        if (relatedElement && relatedElement.type === 'checkbox') {
            relatedElement.checked = false;
        }
    });
    
    // Вставляем перед кнопкой "Очистить все" или в конец
    const clearAllBtn = container.querySelector('.cheaps-clean');
    if (clearAllBtn) {
        container.insertBefore(chip, clearAllBtn);
    } else {
        container.appendChild(chip);
    }
    
    updateClearAllButton();
}

// Удаление чипса
function removeChip(dataType, value) {
    const container = document.querySelector('.all-catalog-cheaps');
    if (!container) return;
    
    const chip = container.querySelector(`[data-type="${dataType}"][data-value="${value}"]`);
    if (chip) {
        chip.remove();
        updateClearAllButton();
    }
}

// Обновление чипса цены
function updatePriceChip() {
    const minInput = document.querySelector('.price-input[placeholder="от"]');
    const maxInput = document.querySelector('.price-input[placeholder="до"]');
    
    if (!minInput || !maxInput) return;
    
    const minValue = minInput.value.trim();
    const maxValue = maxInput.value.trim();
    
    // Удаляем старый чипс цены
    removeChip('price', 'price-range');
    
    // Если оба поля заполнены, добавляем новый чипс
    if (minValue && maxValue) {
        const container = document.querySelector('.all-catalog-cheaps');
        if (!container) return;
        
        const chip = document.createElement('div');
        chip.className = 'catalog-cheaps-item';
        chip.setAttribute('data-type', 'price');
        chip.setAttribute('data-value', 'price-range');
        
        chip.innerHTML = `
            <p>Цена: <span>от ${minValue} до ${maxValue}</span></p>
            <button class="cheaps-item-delete">
                <svg width="11" height="11" viewBox="0 0 11 11" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M10.2083 10.6683C10.0883 10.6683 9.975 10.6217 9.88833 10.535L5.335 5.98167L0.781667 10.535C0.601667 10.715 0.315 10.715 0.135 10.535C-0.045 10.355 -0.045 10.0683 0.135 9.88833L4.68833 5.335L0.135 0.781667C-0.045 0.601667 -0.045 0.315 0.135 0.135C0.315 -0.045 0.601667 -0.045 0.781667 0.135L5.335 4.68833L9.88833 0.135C10.0683 -0.045 10.355 -0.045 10.535 0.135C10.715 0.315 10.715 0.601667 10.535 0.781667L5.98167 5.335L10.535 9.88833C10.715 10.0683 10.715 10.355 10.535 10.535C10.4483 10.6217 10.3283 10.6683 10.215 10.6683H10.2083Z" fill="#757575"/>
                </svg>
            </button>
        `;
        
        // Обработчик удаления цены
        const deleteBtn = chip.querySelector('.cheaps-item-delete');
        deleteBtn.addEventListener('click', function() {
            minInput.value = '';
            maxInput.value = '';
            removeChip('price', 'price-range');
        });
        
        const clearAllBtn = container.querySelector('.cheaps-clean');
        if (clearAllBtn) {
            container.insertBefore(chip, clearAllBtn);
        } else {
            container.appendChild(chip);
        }
        
        updateClearAllButton();
    }
}

// Обновление кнопки "Очистить все"
function updateClearAllButton() {
    const container = document.querySelector('.all-catalog-cheaps');
    if (!container) return;
    
    const chips = container.querySelectorAll('.catalog-cheaps-item');
    let clearAllBtn = container.querySelector('.cheaps-clean');
    
    if (chips.length > 0) {
        // Показываем кнопку "Очистить все"
        if (!clearAllBtn) {
            clearAllBtn = document.createElement('button');
            clearAllBtn.className = 'cheaps-clean';
            clearAllBtn.innerHTML = 'Очистить все';
            container.appendChild(clearAllBtn);
            
            clearAllBtn.addEventListener('click', clearAllFilters);
        }
        
        // Показываем контейнер
        container.style.display = 'flex';
    } else {
        // Скрываем контейнер, если чипсов нет
        container.style.display = 'none';
    }
}

// Очистка всех фильтров
function clearAllFilters() {
    // Снимаем все чекбоксы
    const checkboxes = document.querySelectorAll('.brand-checkbox input[type="checkbox"]');
    checkboxes.forEach(checkbox => {
        checkbox.checked = false;
    });
    
    // Очищаем инпуты цены
    const priceInputs = document.querySelectorAll('.price-input');
    priceInputs.forEach(input => {
        input.value = '';
    });
    
    // Удаляем все чипсы
    const container = document.querySelector('.all-catalog-cheaps');
    if (container) {
        const chips = container.querySelectorAll('.catalog-cheaps-item');
        chips.forEach(chip => chip.remove());
        
        updateClearAllButton();
    }
}

document.addEventListener('DOMContentLoaded', function() {
    initFilterSectionsAdvanced();
});

function initFilterSectionsAdvanced() {
    const filterSections = document.querySelectorAll('.filter-section');
    
    filterSections.forEach(section => {
        const brandGrid = section.querySelector('.brand-grid');
        const showMoreBtn = section.querySelector('.show-more');
        const filterSearch = section.querySelector('.filter-search');
        const searchInput = section.querySelector('.filter-search-input');
        
        if (!brandGrid || !showMoreBtn) return;
        
        const checkboxes = brandGrid.querySelectorAll('.brand-checkbox');
        const totalCount = checkboxes.length;
        const visibleCount = 5;
        let isExpanded = false;
        
        // Сохраняем оригинальные тексты
        const originalTexts = new Map();
        checkboxes.forEach(checkbox => {
            const label = checkbox.querySelector('span:last-child');
            if (label) {
                originalTexts.set(checkbox, label.textContent);
            }
        });
        
        // Скрываем лишние элементы
        checkboxes.forEach((checkbox, index) => {
            if (index >= visibleCount) {
                checkbox.style.display = 'none';
            }
        });
        
        // Скрываем поиск
        if (filterSearch) {
            filterSearch.classList.remove('active');
            filterSearch.style.display = 'none';
        }
        
        // Обновляем кнопку
        const hiddenCount = totalCount - visibleCount;
        if (hiddenCount > 0) {
            updateButtonText(false);
        } else {
            showMoreBtn.style.display = 'none';
        }
        
        // Клик на "Показать еще"
        showMoreBtn.addEventListener('click', function() {
            isExpanded = !isExpanded;
            
            if (isExpanded) {
                // Раскрываем список
                checkboxes.forEach(checkbox => {
                    checkbox.style.display = 'flex';
                });
                
                // Показываем поиск
                if (totalCount > 5 && filterSearch) {
                    filterSearch.style.display = 'block';
                    filterSearch.classList.add('active');
                    
                    // Фокус на поле поиска (опционально)
                    setTimeout(() => {
                        if (searchInput) searchInput.focus();
                    }, 100);
                }
                
                updateButtonText(true);
            } else {
                // Сворачиваем список
                checkboxes.forEach((checkbox, index) => {
                    if (index >= visibleCount) {
                        checkbox.style.display = 'none';
                    }
                });
                
                // Скрываем и очищаем поиск
                if (filterSearch) {
                    filterSearch.style.display = 'none';
                    filterSearch.classList.remove('active');
                    if (searchInput) {
                        searchInput.value = '';
                        // Восстанавливаем оригинальные тексты
                        restoreOriginalTexts();
                    }
                }
                
                updateButtonText(false);
            }
        });
        
        // Поиск с подсветкой
        if (searchInput) {
            searchInput.addEventListener('input', function() {
                const searchTerm = this.value.toLowerCase().trim();
                let visibleCount = 0;
                
                checkboxes.forEach(checkbox => {
                    const label = checkbox.querySelector('span:last-child');
                    const originalText = originalTexts.get(checkbox);
                    
                    if (!originalText) return;
                    
                    const text = originalText.toLowerCase();
                    
                    if (text.includes(searchTerm) || searchTerm === '') {
                        checkbox.style.display = 'flex';
                        visibleCount++;
                        
                        // Подсветка совпадений
                        if (searchTerm !== '') {
                            const regex = new RegExp(`(${escapeRegex(searchTerm)})`, 'gi');
                            label.innerHTML = originalText.replace(regex, '<mark>$1</mark>');
                        } else {
                            label.textContent = originalText;
                        }
                    } else {
                        checkbox.style.display = 'none';
                    }
                });
                
                // Скрываем кнопку во время поиска
                if (searchTerm !== '') {
                    showMoreBtn.style.display = 'none';
                } else {
                    showMoreBtn.style.display = 'block';
                }
                
                // Показываем сообщение "Ничего не найдено"
                showNoResultsMessage(visibleCount === 0 && searchTerm !== '');
            });
        }
        
        // Вспомогательные функции
        function updateButtonText(expanded) {
            const icon = showMoreBtn.querySelector('.toggle-icon');
            if (expanded) {
                showMoreBtn.innerHTML = `Скрыть <span class="toggle-icon"><img src="assets/img/icons/arrow-down.svg" alt=""></span>`;
                if (icon) icon.style.transform = 'rotate(180deg)';
            } else {
                showMoreBtn.innerHTML = `Еще ${hiddenCount} <span class="toggle-icon"><img src="assets/img/icons/arrow-down.svg" alt=""></span>`;
            }
        }
        
        function restoreOriginalTexts() {
            checkboxes.forEach(checkbox => {
                const label = checkbox.querySelector('span:last-child');
                const originalText = originalTexts.get(checkbox);
                if (label && originalText) {
                    label.textContent = originalText;
                }
            });
        }
        
        function showNoResultsMessage(show) {
            let noResultsMsg = section.querySelector('.no-results-message');
            
            if (show) {
                if (!noResultsMsg) {
                    noResultsMsg = document.createElement('div');
                    noResultsMsg.className = 'no-results-message';
                    noResultsMsg.textContent = 'Ничего не найдено';
                    brandGrid.appendChild(noResultsMsg);
                }
            } else {
                if (noResultsMsg) {
                    noResultsMsg.remove();
                }
            }
        }
        
        function escapeRegex(string) {
            return string.replace(/[.*+?^${}()|[\]\\]/g, '\\___CODE_BLOCK_1___');
        }
    });
}