// В самом начале файла main.js
setTimeout(() => {


// Модальное окно
// Получаем элементы (с правильными id и проверкой существования)
const catalogBtn = document.getElementById('catalogButton'); // Исправлено: catalogButton вместо catalogBtn
const catalogModal = document.getElementById('catalogModal');
const catalogOverlay = document.getElementById('catalogOverlay');
const header = document.querySelector('header');

// Проверяем, что элементы найдены
if (!catalogBtn || !catalogModal || !catalogOverlay || !header) {
    console.warn('Каталог модалка: некоторые элементы не найдены', {
        catalogBtn: !!catalogBtn,
        catalogModal: !!catalogModal,
        catalogOverlay: !!catalogOverlay,
        header: !!header
    });
}

// Сохраняем позицию скролла
let scrollPosition = 0;

// Функция открытия модального окна
function openCatalog() {
    if (!catalogModal || !catalogOverlay || !header) return;
    
    console.log('Открываем модалку');
    
    // Сохраняем текущую позицию скролла
    scrollPosition = window.pageYOffset || document.documentElement.scrollTop;
    
    // Получаем высоту header
    const headerHeight = header.offsetHeight;
    catalogModal.style.top = headerHeight + 'px';
    
    // Показываем модалку
    catalogModal.classList.add('active');
    catalogOverlay.classList.add('active');
    
    // Блокируем прокрутку body
    document.body.classList.add('no-scroll');
    document.body.style.top = `-${scrollPosition}px`;
}

// Функция закрытия модального окна
function closeCatalog() {
    if (!catalogModal || !catalogOverlay) return;
    
    console.log('Закрываем модалку');
    
    // Убираем модалку
    catalogModal.classList.remove('active');
    catalogOverlay.classList.remove('active');
    
    // Возвращаем прокрутку body
    document.body.classList.remove('no-scroll');
    document.body.style.top = '';
    
    // Восстанавливаем позицию скролла
    window.scrollTo(0, scrollPosition);
}

// Открытие по клику на кнопку (только если элементы существуют)
if (catalogBtn && catalogModal && catalogOverlay) {
    catalogBtn.addEventListener('click', function(e) {
        console.log('Клик по кнопке');
        e.stopPropagation();
        
        if (catalogModal.classList.contains('active')) {
            closeCatalog();
        } else {
            openCatalog();
        }
    });

    // Закрытие по клику на overlay
    catalogOverlay.addEventListener('click', function() {
        closeCatalog();
    });

    // Закрытие по нажатию Escape
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && catalogModal.classList.contains('active')) {
            closeCatalog();
        }
    });

    // Пересчет при изменении размера окна
    window.addEventListener('resize', function() {
        if (catalogModal.classList.contains('active') && header) {
            const headerHeight = header.offsetHeight;
            catalogModal.style.top = headerHeight + 'px';
        }
    });
}


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

document.addEventListener('DOMContentLoaded', function () {
    const sortBlock = document.querySelector('.catalog-sort');
    const selected = sortBlock.querySelector('.catalog-sort__selected');
    const currentText = sortBlock.querySelector('.catalog-sort__current');
    const options = sortBlock.querySelectorAll('.catalog-sort__option');

    // Открытие/закрытие списка
    selected.addEventListener('click', function (e) {
        e.stopPropagation();
        sortBlock.classList.toggle('open');
    });

    // Выбор опции
    options.forEach(option => {
        option.addEventListener('click', function () {
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
    document.addEventListener('click', function (e) {
        if (!sortBlock.contains(e.target)) {
            sortBlock.classList.remove('open');
        }
    });

    // Закрытие по Escape
    document.addEventListener('keydown', function (e) {
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

    switch (sortType) {
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

document.addEventListener('DOMContentLoaded', function () {

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
            button.addEventListener('click', function (e) {
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
        title.addEventListener('click', function () {
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
        option.addEventListener('click', function () {
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
        color.addEventListener('click', function () {
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
        checkbox.addEventListener('change', function () {
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
        clearButton.addEventListener('click', function (e) {
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
    inputMin.addEventListener('input', function () {
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

    inputMax.addEventListener('input', function () {
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
document.addEventListener('DOMContentLoaded', function () {
    // ... весь ваш предыдущий код ...

    // Инициализация слайдера цены
    initPriceSlider();
});


document.addEventListener('DOMContentLoaded', function () {
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
    callbackLink.addEventListener('click', function (e) {
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


document.addEventListener('DOMContentLoaded', function () {
    const upTheHideElements = document.querySelectorAll('.up-the-hide');

    upTheHideElements.forEach(element => {
        element.addEventListener('click', function () {
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


document.addEventListener('DOMContentLoaded', function () {
    const searchButton = document.querySelector('.search-but');

    if (searchButton) {
        searchButton.addEventListener('click', function (e) {
            e.preventDefault();
            window.location.href = 'catalog-search.html';
        });
    }
});


// Инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', function () {
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
        checkbox.addEventListener('change', function () {
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
    deleteBtn.addEventListener('click', function () {
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
        deleteBtn.addEventListener('click', function () {
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

document.addEventListener('DOMContentLoaded', function () {
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
        showMoreBtn.addEventListener('click', function () {
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
            searchInput.addEventListener('input', function () {
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

document.addEventListener('DOMContentLoaded', () => {

  // ---------- ВСПОМОГАТЕЛЬНЫЕ ФУНКЦИИ ----------

  // Преобразуем строку вида "2 430.93 р." в число 2430.93
  function parsePrice(str) {
    if (!str) return 0;
    return parseFloat(
      str.replace(/\s/g, '').replace('р.', '').replace('р', '').replace(',', '.')
    ) || 0;
  }

  // Формат числа в рубли по-русски
  function formatPrice(num) {
    return num.toLocaleString('ru-RU', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }) + ' р.';
  }

  // Правильное слово "товар/товара/товаров"
  function pluralizeTovar(n) {
    n = Math.abs(n) % 100;
    const n1 = n % 10;
    if (n > 10 && n < 20) return 'товаров';
    if (n1 > 1 && n1 < 5) return 'товара';
    if (n1 === 1) return 'товар';
    return 'товаров';
  }

  // ---------- ПЕРЕСЧЁТ ИТОГОВ ----------

  function recalcSummary() {
    const items = document.querySelectorAll('.cart-item');
    let productsTotal = 0;
    let count = 0;

    items.forEach(item => {
      const qtyEl   = item.querySelector('.qty-value');
      const priceEl = item.querySelector('.price-main');

      if (!qtyEl || !priceEl) return;

      const qty   = parseInt(qtyEl.textContent.trim(), 10) || 0;
      const price = parsePrice(priceEl.textContent);

      productsTotal += qty * price;
      count += qty;
    });

    // Стоимость товаров
    const costRowEl = document.querySelector('.cart-summary .summery-row__cost');
    if (costRowEl) {
      costRowEl.textContent = formatPrice(productsTotal);
    }

    // Доставка (берём как фиксированное значение из разметки)
    const deliveryEl = document.querySelectorAll('.cart-summary .summery-row__cost')[1];
    const delivery = deliveryEl ? parsePrice(deliveryEl.textContent) : 0;

    // ИТОГО = товары + доставка
    const totalEl = document.querySelector('.cart-summary .summery-total__total');
    if (totalEl) {
      const total = productsTotal + delivery;
      totalEl.innerHTML = formatPrice(total).replace(' р.', '<span> р.</span>');
    }

    // "3 товара ..."
    const countTextEl = document.querySelector('.cart-summary__row:nth-of-type(1) p:last-child');
    if (countTextEl) {
      countTextEl.innerHTML = `${count} ${pluralizeTovar(count)} <span>(4,5 кг)</span>`;
      // массу, если нужно, можно считать отдельно
    }
  }

  // ---------- СЧЁТЧИК КОЛИЧЕСТВА ----------

  document.addEventListener('click', (e) => {
    const minusBtn = e.target.closest('.qty-btn--minus');
    const plusBtn  = e.target.closest('.qty-btn--plus');

    if (!minusBtn && !plusBtn) return;

    const wrapper = (minusBtn || plusBtn).closest('.cart-item__qty');
    if (!wrapper) return;

    const valueEl = wrapper.querySelector('.qty-value');
    if (!valueEl) return;

    let value = parseInt(valueEl.textContent.trim(), 10) || 1;

    if (minusBtn) {
      value = Math.max(1, value - 1); // не даём опуститься ниже 1
    } else if (plusBtn) {
      value += 1;
    }

    valueEl.textContent = value;
    recalcSummary();
  });

  // ---------- УДАЛЕНИЕ КАРТОЧКИ ----------

  document.addEventListener('click', (e) => {
    const delBtn = e.target.closest('.cart-item__delete');
    if (!delBtn) return;

    const item = delBtn.closest('.cart-item');
    if (!item) return;

    item.remove();
    recalcSummary();
  });

  // ---------- ПЕРВИЧНЫЙ РАСЧЁТ ----------

  recalcSummary();
});

}, 300); // 300мс задержки