// ========== ПРОФИЛЬ: ВСЕ СКРИПТЫ ==========

document.addEventListener('DOMContentLoaded', function () {
  console.log('✅ Инициализация скриптов профиля...');

  // 1. Инициализация датапикера
  initDatePicker();

  // 2. Обработчики кнопок и ссылок
  initOrderHandlers();

  // 3. Инициализация слайдеров галерей товаров
  initProductGalleries();

  // 4. Инициализация основных слайдеров товаров
  initProductSliders();

  // 5. Копирование трек-номера
  initTrackNumberCopy();

  console.log('✅ Все скрипты профиля инициализированы');
});

// ========== ДАТАПИКЕР ==========
function initDatePicker() {
  const dateRangePicker = document.querySelector('#dateRangePicker');

  if (!dateRangePicker) {
    console.warn('⚠️ Датапикер не найден');
    return;
  }

  // Проверяем, что библиотека flatpickr загружена
  if (typeof flatpickr === 'undefined') {
    console.error('❌ Библиотека flatpickr не загружена');
    return;
  }

  flatpickr("#dateRangePicker", {
    mode: "range",
    dateFormat: "d.m.Y",
    defaultDate: ["2021-01-01", "2025-10-31"],
    locale: "ru",
    onChange: function (selectedDates, dateStr, instance) {
      console.log('Выбранные даты:', dateStr);
    }
  });

  console.log('✅ Датапикер инициализирован');
}

// ========== ОБРАБОТЧИКИ КНОПОК И ССЫЛОК ==========
function initOrderHandlers() {
  // Обработчик кнопки "Повторить заказ"
  const btnRepeatOrder = document.querySelector('.btn-repeat-order');
  if (btnRepeatOrder) {
    btnRepeatOrder.addEventListener('click', function () {
      alert('Заказ будет повторен!');
      console.log('🔄 Повтор заказа');
    });
  }

  // Обработчик ссылки "Почему заказ отменён?"
  const orderInfoLink = document.querySelector('.order-info-link');
  if (orderInfoLink) {
    orderInfoLink.addEventListener('click', function (e) {
      e.preventDefault();
      alert('Информация о причине отмены заказа');
      console.log('ℹ️ Просмотр информации об отмене');
    });
  }

  // Обработчики для всех кнопок "Повторить заказ" (если их несколько)
  const allRepeatButtons = document.querySelectorAll('.btn-repeat-order');
  if (allRepeatButtons.length > 1) {
    console.log(`✅ Найдено ${allRepeatButtons.length} кнопок повтора заказа`);
  }
}

// ========== ГАЛЕРЕИ ТОВАРОВ (Основной слайдер + Миниатюры) ==========
function initProductGalleries() {
  // Проверяем, что Swiper загружен
  if (typeof Swiper === 'undefined') {
    console.error('❌ Библиотека Swiper не загружена');
    return;
  }

  // Находим все галереи товаров
  const galleries = document.querySelectorAll('[data-gallery]');

  if (!galleries.length) {
    console.log('ℹ️ Галереи товаров не найдены');
    return;
  }

  galleries.forEach(gallery => {
    const galleryId = gallery.getAttribute('data-gallery');
    const thumbsElement = document.querySelector(`[data-gallery-thumbs="${galleryId}"]`);

    if (!thumbsElement) {
      console.warn(`⚠️ Миниатюры для галереи "${galleryId}" не найдены`);
      return;
    }

    // Слайдер миниатюр
    const thumbsSlider = new Swiper(`[data-gallery-thumbs="${galleryId}"]`, {
      spaceBetween: 8,
      slidesPerView: 4,
      freeMode: true,
      watchSlidesProgress: true,
      slideToClickedSlide: true
    });

    // Основной слайдер галереи
    const mainSlider = new Swiper(`[data-gallery="${galleryId}"]`, {
      spaceBetween: 10,
      navigation: {
        nextEl: `[data-gallery="${galleryId}"] .swiper-button-next`,
        prevEl: `[data-gallery="${galleryId}"] .swiper-button-prev`,
      },
      thumbs: {
        swiper: thumbsSlider,
      }
    });

    console.log(`✅ Галерея инициализирована: ${galleryId}`);
  });
}

// ========== ОСНОВНЫЕ СЛАЙДЕРЫ ТОВАРОВ ==========
function initProductSliders() {
  // Проверяем, что Swiper загружен
  if (typeof Swiper === 'undefined') {
    console.error('❌ Библиотека Swiper не загружена');
    return;
  }

  // Находим все слайдеры товаров по data-slider
  const productSliders = document.querySelectorAll('[data-slider]');

  if (!productSliders.length) {
    console.log('ℹ️ Слайдеры товаров не найдены');
    return;
  }

  productSliders.forEach(sliderEl => {
    const sliderId = sliderEl.getAttribute('data-slider');

    const swiper = new Swiper(sliderEl, {
      slidesPerView: 1,
      spaceBetween: 20,
      navigation: {
        nextEl: `[data-slider="${sliderId}"] .products-slider__nav-next`,
        prevEl: `[data-slider="${sliderId}"] .products-slider__nav-prev`,
      },
      pagination: {
        el: `[data-slider="${sliderId}"] .products-slider__pagination`,
        clickable: true,
      },
      breakpoints: {
        // >= 576px
        576: {
          slidesPerView: 2,
          spaceBetween: 20,
        },
        // >= 768px
        768: {
          slidesPerView: 3,
          spaceBetween: 20,
        },
        // >= 992px
        992: {
          slidesPerView: 4,
          spaceBetween: 20,
        },
        // >= 1200px
        1200: {
          slidesPerView: 5,
          spaceBetween: 24,
        }
      }
    });

    console.log(`✅ Слайдер товаров инициализирован: ${sliderId}`);
  });
}

// ========== КОПИРОВАНИЕ ТРЕК-НОМЕРА В БУФЕР ОБМЕНА ==========
function initTrackNumberCopy() {
  const orderAddressBlocks = document.querySelectorAll('.order-address');

  if (!orderAddressBlocks.length) {
    console.log('ℹ️ Блоки с трек-номерами не найдены');
    return;
  }

  orderAddressBlocks.forEach(block => {
    // Добавляем курсор pointer
    block.style.cursor = 'pointer';
    block.style.transition = 'all 0.2s ease';

    // Обработчик клика
    block.addEventListener('click', function () {
      const trackNumber = this.querySelector('.address-text strong');

      if (!trackNumber) {
        console.warn('⚠️ Трек-номер не найден в блоке');
        return;
      }

      const textToCopy = trackNumber.textContent.trim();

      // Копируем в буфер обмена
      copyToClipboard(textToCopy, this);
    });

    // Визуальный эффект при наведении
    block.addEventListener('mouseenter', function () {
      this.style.backgroundColor = '#f5f5f5';
    });

    block.addEventListener('mouseleave', function () {
      this.style.backgroundColor = 'transparent';
    });
  });

  console.log(`✅ Копирование трек-номера инициализировано для ${orderAddressBlocks.length} блоков`);
}

// Функция копирования в буфер обмена
function copyToClipboard(text, element) {
  // Современный метод (Clipboard API)
  if (navigator.clipboard && window.isSecureContext) {
    navigator.clipboard.writeText(text)
      .then(() => {
        showCopyNotification(element, 'success');
        console.log('✅ Скопировано:', text);
      })
      .catch(err => {
        console.error('❌ Ошибка копирования:', err);
        fallbackCopyToClipboard(text, element);
      });
  } else {
    // Fallback для старых браузеров
    fallbackCopyToClipboard(text, element);
  }
}

// Fallback метод для старых браузеров
function fallbackCopyToClipboard(text, element) {
  const textArea = document.createElement('textarea');
  textArea.value = text;
  textArea.style.position = 'fixed';
  textArea.style.left = '-9999px';
  textArea.style.top = '-9999px';
  document.body.appendChild(textArea);
  textArea.focus();
  textArea.select();

  try {
    const successful = document.execCommand('copy');
    if (successful) {
      showCopyNotification(element, 'success');
      console.log('✅ Скопировано (fallback):', text);
    } else {
      showCopyNotification(element, 'error');
    }
  } catch (err) {
    console.error('❌ Ошибка копирования:', err);
    showCopyNotification(element, 'error');
  }

  document.body.removeChild(textArea);
}

// Уведомление о копировании
function showCopyNotification(element, status) {
  // Создаем уведомление
  const notification = document.createElement('div');
  notification.className = 'copy-notification';

  if (status === 'success') {
    notification.innerHTML = `
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M8 1.33334C4.32 1.33334 1.33334 4.32 1.33334 8C1.33334 11.68 4.32 14.6667 8 14.6667C11.68 14.6667 14.6667 11.68 14.6667 8C14.6667 4.32 11.68 1.33334 8 1.33334ZM11.0267 6.36L7.36001 10.0267C7.24667 10.14 7.09334 10.2 6.94001 10.2C6.78667 10.2 6.63334 10.14 6.52001 10.0267L4.97334 8.48C4.74 8.24667 4.74 7.86667 4.97334 7.63334C5.20667 7.4 5.58667 7.4 5.82001 7.63334L6.94001 8.75334L10.18 5.51334C10.4133 5.28 10.7933 5.28 11.0267 5.51334C11.26 5.74667 11.26 6.12667 11.0267 6.36Z" fill="#04A31A"/>
      </svg>
      Скопировано
    `;
    notification.style.background = '#e8f5e9';
    notification.style.color = '#04A31A';
  } else {
    notification.innerHTML = `
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M8 1.33334C4.32 1.33334 1.33334 4.32 1.33334 8C1.33334 11.68 4.32 14.6667 8 14.6667C11.68 14.6667 14.6667 11.68 14.6667 8C14.6667 4.32 11.68 1.33334 8 1.33334ZM10.36 9.51334C10.5933 9.74667 10.5933 10.1267 10.36 10.36C10.2467 10.4733 10.0933 10.5267 9.94001 10.5267C9.78667 10.5267 9.63334 10.4733 9.52001 10.36L8 8.84L6.48001 10.36C6.36667 10.4733 6.21334 10.5267 6.06001 10.5267C5.90667 10.5267 5.75334 10.4733 5.64001 10.36C5.40667 10.1267 5.40667 9.74667 5.64001 9.51334L7.16001 8L5.64001 6.48C5.40667 6.24667 5.40667 5.86667 5.64001 5.63334C5.87334 5.4 6.25334 5.4 6.48667 5.63334L8.00667 7.15334L9.52667 5.63334C9.76001 5.4 10.14 5.4 10.3733 5.63334C10.6067 5.86667 10.6067 6.24667 10.3733 6.48L8.85334 8L10.3733 9.52L10.36 9.51334Z" fill="#CE0061"/>
      </svg>
      Ошибка копирования
    `;
    notification.style.background = '#ffebee';
    notification.style.color = '#CE0061';
  }

  // Позиционируем уведомление
  element.style.position = 'relative';
  element.appendChild(notification);

  // Анимация появления
  setTimeout(() => {
    notification.classList.add('show');
  }, 10);

  // Удаляем уведомление через 2 секунды
  setTimeout(() => {
    notification.classList.remove('show');
    setTimeout(() => {
      notification.remove();
    }, 300);
  }, 2000);

  // Анимация клика на блоке
  element.style.transform = 'scale(0.98)';
  setTimeout(() => {
    element.style.transform = 'scale(1)';
  }, 100);
}

// ========== РЕДАКТИРОВАНИЕ ЛИЧНЫХ ДАННЫХ ==========

document.addEventListener('DOMContentLoaded', function () {
  initEditPersonalDataModal();
});

function initEditPersonalDataModal() {
  const modal = document.getElementById('editPersonalDataModal');
  const form = document.getElementById('editPersonalDataForm');

  if (!modal || !form) {
    return;
  }

  // Загрузка данных при открытии модального окна
  modal.addEventListener('show.bs.modal', function () {
    loadPersonalData();
  });

  // Обработка отправки формы
  form.addEventListener('submit', function (e) {
    e.preventDefault();

    if (validateForm()) {
      savePersonalData();
    }
  });

  console.log('✅ Модальное окно личных данных инициализировано');
}

// Загрузка данных в форму
function loadPersonalData() {
  // В реальном приложении данные получать с сервера
  const userData = {
    lastName: 'Христорождественский',
    firstName: 'Иннокентий',
    middleName: 'Адольфович',
    gender: 'male',
    email: 'qwerty@gmail.com'
  };

  document.getElementById('lastName').value = userData.lastName || '';
  document.getElementById('firstName').value = userData.firstName || '';
  document.getElementById('middleName').value = userData.middleName || '';
  document.getElementById('email').value = userData.email || '';

  // Устанавливаем пол
  const genderRadio = document.querySelector(`input[name="gender"][value="${userData.gender}"]`);
  if (genderRadio) {
    genderRadio.checked = true;
  }

  console.log('✅ Данные загружены в форму');
}

// Валидация формы
function validateForm() {
  let isValid = true;
  const form = document.getElementById('editPersonalDataForm');

  // Удаляем предыдущие ошибки
  form.querySelectorAll('.is-invalid').forEach(el => {
    el.classList.remove('is-invalid');
  });
  form.querySelectorAll('.invalid-feedback').forEach(el => {
    el.remove();
  });

  // Проверка обязательных полей
  const requiredFields = [
    { id: 'lastName', name: 'Фамилия' },
    { id: 'firstName', name: 'Имя' },
    { id: 'middleName', name: 'Отчество' }
  ];

  requiredFields.forEach(field => {
    const input = document.getElementById(field.id);
    const value = input.value.trim();

    if (!value) {
      showFieldError(input, `${field.name} обязательно для заполнения`);
      isValid = false;
    } else if (value.length < 2) {
      showFieldError(input, `${field.name} должно содержать минимум 2 символа`);
      isValid = false;
    }
  });

  // Проверка email (если заполнен)
  const emailInput = document.getElementById('email');
  const emailValue = emailInput.value.trim();

  if (emailValue && !isValidEmail(emailValue)) {
    showFieldError(emailInput, 'Введите корректный email');
    isValid = false;
  }

  return isValid;
}

// Показать ошибку поля
function showFieldError(input, message) {
  input.classList.add('is-invalid');

  const errorDiv = document.createElement('div');
  errorDiv.className = 'invalid-feedback';
  errorDiv.textContent = message;

  input.parentElement.appendChild(errorDiv);
}

// Проверка email
function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

// Сохранение данных
function savePersonalData() {
  const formData = {
    lastName: document.getElementById('lastName').value.trim(),
    firstName: document.getElementById('firstName').value.trim(),
    middleName: document.getElementById('middleName').value.trim(),
    gender: document.querySelector('input[name="gender"]:checked').value,
    email: document.getElementById('email').value.trim()
  };

  console.log('💾 Сохранение данных:', formData);

  // В реальном приложении отправить на сервер
  // fetch('/api/profile/update', {
  //   method: 'POST',
  //   headers: { 'Content-Type': 'application/json' },
  //   body: JSON.stringify(formData)
  // })
  // .then(response => response.json())
  // .then(data => {
  //   console.log('✅ Данные сохранены');
  //   // Закрыть модальное окно
  //   bootstrap.Modal.getInstance(document.getElementById('editPersonalDataModal')).hide();
  //   // Обновить данные на странице
  //   updateProfileData(formData);
  // });

  // Временная эмуляция сохранения
  setTimeout(() => {
    alert('Данные успешно сохранены!');
    const modal = bootstrap.Modal.getInstance(document.getElementById('editPersonalDataModal'));
    modal.hide();

    // Обновляем данные на странице
    updateProfileData(formData);
  }, 500);
}

// Обновление данных на странице профиля
function updateProfileData(data) {
  const fullName = `${data.lastName} ${data.firstName} ${data.middleName}`;

  // Находим элемент с ФИО и обновляем
  const fioElement = document.querySelector('.data-item__value');
  if (fioElement) {
    fioElement.textContent = fullName;
  }

  console.log('✅ Данные на странице обновлены');
}

// ========== РЕДАКТИРОВАНИЕ ПАСПОРТНЫХ ДАННЫХ ==========

document.addEventListener('DOMContentLoaded', function () {
  initEditPassportModal();
});

function initEditPassportModal() {
  const form = document.getElementById('editPassportForm');

  if (!form) return;

  // Инициализация datepicker для дат
  initDatePickers();

  // Обработка отправки формы
  form.addEventListener('submit', function (e) {
    e.preventDefault();

    if (validatePassportForm()) {
      savePassportData();
    }
  });

  // Маски для полей
  initInputMasks();

  console.log('✅ Модальное окно паспортных данных инициализировано');
}

// Инициализация datepicker
function initDatePickers() {
  if (typeof flatpickr === 'undefined') {
    console.warn('⚠️ Библиотека flatpickr не загружена');
    return;
  }

  flatpickr("#passportIssueDate", {
    dateFormat: "d.m.Y",
    locale: "ru",
    maxDate: "today"
  });

  flatpickr("#birthDate", {
    dateFormat: "d.m.Y",
    locale: "ru",
    maxDate: "today"
  });
}

// Инициализация масок ввода
function initInputMasks() {
  // Только цифры для номера паспорта
  const passportNumber = document.getElementById('passportNumber');
  if (passportNumber) {
    passportNumber.addEventListener('input', function (e) {
      this.value = this.value.replace(/[^0-9]/g, '');
    });
  }

  // Только цифры для индекса
  const postalCode = document.getElementById('postalCode');
  if (postalCode) {
    postalCode.addEventListener('input', function (e) {
      this.value = this.value.replace(/[^0-9]/g, '');
    });
  }

  // Только цифры для идентификационного номера
  const identificationNumber = document.getElementById('identificationNumber');
  if (identificationNumber) {
    identificationNumber.addEventListener('input', function (e) {
      this.value = this.value.replace(/[^0-9]/g, '');
    });
  }
}

// Валидация формы
function validatePassportForm() {
  let isValid = true;
  const form = document.getElementById('editPassportForm');

  // Удаляем предыдущие ошибки
  form.querySelectorAll('.is-invalid').forEach(el => {
    el.classList.remove('is-invalid');
  });

  // Проверка всех обязательных полей
  const requiredFields = form.querySelectorAll('[required]');
  requiredFields.forEach(field => {
    if (!field.value.trim()) {
      field.classList.add('is-invalid');
      isValid = false;
    }
  });

  if (!isValid) {
    alert('Пожалуйста, заполните все обязательные поля');
  }

  return isValid;
}

// Сохранение данных
function savePassportData() {
  const formData = new FormData(document.getElementById('editPassportForm'));
  const data = Object.fromEntries(formData);

  console.log('💾 Сохранение паспортных данных:', data);

  // В реальном приложении отправить на сервер
  setTimeout(() => {
    alert('Паспортные данные успешно сохранены!');
    const modal = bootstrap.Modal.getInstance(document.getElementById('editPassportModal'));
    modal.hide();
  }, 500);
}

// ========== ПОДТВЕРЖДЕНИЕ ЭЛЕКТРОННОЙ ПОЧТЫ ==========

document.addEventListener('DOMContentLoaded', function () {
  initEmailConfirmation();
});

function initEmailConfirmation() {
  console.log('✅ Модальное окно подтверждения почты инициализировано');
}

// Функция для показа модального окна подтверждения
function showEmailConfirmationModal(email) {
  const modal = document.getElementById('emailConfirmationModal');

  if (!modal) {
    console.error('❌ Модальное окно подтверждения не найдено');
    return;
  }

  // Обновляем email в сообщении
  const emailLink = modal.querySelector('.email-link');
  if (emailLink) {
    emailLink.textContent = email;
    emailLink.href = `mailto:${email}`;
  }

  // Показываем модальное окно
  const bsModal = new bootstrap.Modal(modal);
  bsModal.show();

  console.log('✅ Показано окно подтверждения для:', email);
}

// Автоматический показ после сохранения email
function saveEmailDataWithConfirmation() {
  const formData = {
    email: document.getElementById('newEmail').value.trim(),
    emailConsent: document.getElementById('emailConsent').checked
  };

  console.log('💾 Сохранение email:', formData);

  // В реальном приложении отправить на сервер
  // fetch('/api/profile/update-email', {
  //   method: 'POST',
  //   headers: { 'Content-Type': 'application/json' },
  //   body: JSON.stringify(formData)
  // })
  // .then(response => response.json())
  // .then(data => {
  //   if (data.success) {
  //     // Закрываем модальное окно редактирования
  //     bootstrap.Modal.getInstance(document.getElementById('editEmailModal')).hide();
  //     
  //     // Показываем модальное окно подтверждения
  //     setTimeout(() => {
  //       showEmailConfirmationModal(formData.email);
  //     }, 300);
  //   }
  // });

  // Временная эмуляция сохранения
  setTimeout(() => {
    // Закрываем модальное окно редактирования
    const editModal = bootstrap.Modal.getInstance(document.getElementById('editEmailModal'));
    if (editModal) {
      editModal.hide();
    }

    // Показываем модальное окно подтверждения через небольшую задержку
    setTimeout(() => {
      showEmailConfirmationModal(formData.email);
    }, 300);

    // Обновляем email на странице
    updateEmailOnPage(formData.email);
  }, 500);
}
