// ========== ИНТЕРАКТИВНАЯ КОРЗИНА С ПРОМОКОДОМ ==========

(function() {
    'use strict';

    // Проверка наличия корзины
    if (!document.querySelector('.cart-layout')) {
        return;
    }

    class ShoppingCart {
        constructor() {
            // Контейнер с товарами
            this.container = document.querySelector('.cart-items-container');
            
            // Элементы управления для секций
            this.availableSection = document.querySelector('.cart-section--available');
            this.unavailableSection = document.querySelector('.cart-section--unavailable');
            
            // Промокод
            this.promoInput = document.getElementById('cardSummaryCoupon');
            this.promoForm = document.querySelector('.card-summary__coupon form');
            this.promoCode = null;
            this.promoDiscount = 10; // 10% скидка
            
            // Кнопка оформления заказа
            this.checkoutBtn = document.querySelector('.cart-summary__checkout-btn');
            
            // НОВОЕ: Toast для уведомления о доставке
            this.deliveryToast = document.querySelector('.order-toast_delivery');
            
            this.init();
        }

        init() {
            this.attachQuantityListeners();
            this.attachCheckboxListeners();
            this.attachDeleteListeners();
            this.attachSelectAllListeners();
            this.attachRemoveSelectedListeners();
            this.attachPromoListener();
            this.attachCheckoutListener();
            this.updateSummary();
            
            // Инициализация состояний
            this.updateAvailableSelectAllState();
            this.updateUnavailableSelectAllState();
            this.updateRemoveButtonsState();
            
            console.log('✓ Корзина инициализирована');
        }

        // ========== ОБРАБОТЧИК КНОПКИ ОФОРМЛЕНИЯ ЗАКАЗА ==========
        attachCheckoutListener() {
            if (!this.checkoutBtn || !this.availableSection) return;
            
            this.checkoutBtn.addEventListener('click', (e) => {
                e.preventDefault(); // Предотвращаем переход по умолчанию
                
                const selectedItems = this.availableSection.querySelectorAll('.cart-item.selected');
                
                if (selectedItems.length === 0) {
                    // НЕТ выбранных товаров - показываем уведомление
                    this.checkoutBtn.classList.add('non-active');
                    this.showOrderToast();
                    
                    // Убираем класс non-active через 3 секунды
                    setTimeout(() => {
                        this.checkoutBtn.classList.remove('non-active');
                    }, 3000);
                    
                    console.log('⚠ Попытка оформить заказ без выбранных товаров');
                } else {
                    // ЕСТЬ выбранные товары - переходим на страницу оформления
                    console.log(`✓ Оформление заказа: ${selectedItems.length} товаров`);
                    
                    // Можно сохранить данные корзины в localStorage перед переходом
                    this.saveCartToStorage(selectedItems);
                    
                    // Переход на страницу оформления заказа
                    window.location.href = 'cart-order.html';
                }
            });
        }

        // Сохранение данных корзины в localStorage
        saveCartToStorage(selectedItems) {
            const cartData = [];
            
            selectedItems.forEach(item => {
                const name = item.querySelector('.cart-item__name')?.textContent || '';
                const desc = item.querySelector('.cart-item__desc')?.textContent || '';
                const qty = parseInt(item.querySelector('.qty-value')?.textContent) || 1;
                const basePrice = parseFloat(item.dataset.basePrice) || 0;
                const priceContainer = item.querySelector('.cart-item__price');
                const hasPromo = priceContainer?.classList.contains('is_promocod') || false;
                const image = item.querySelector('.cart-item__image img')?.src || '';
                
                cartData.push({
                    name,
                    desc,
                    qty,
                    basePrice,
                    hasPromo,
                    image,
                    promoDiscount: hasPromo ? this.promoDiscount : 0
                });
            });
            
            localStorage.setItem('cartOrderData', JSON.stringify(cartData));
            localStorage.setItem('cartPromoCode', this.promoCode || '');
            
            console.log('✓ Данные корзины сохранены в localStorage');
        }

        // Показ уведомления "Выберите товары"
        showOrderToast() {
            let toast = document.querySelector('.order-toast_choose');
            
            if (!toast) {
                // Создаем toast если его нет
                toast = document.createElement('div');
                toast.className = 'toast order-toast_choose';
                toast.setAttribute('role', 'alert');
                toast.setAttribute('aria-live', 'assertive');
                toast.setAttribute('aria-atomic', 'true');
                toast.style.display = 'none'; // Скрыт по умолчанию
                toast.style.opacity = '0';
                toast.style.transition = 'opacity 0.5s ease';
                
                toast.innerHTML = `
                    <div class="d-flex">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M12 2C6.49 2 2 6.49 2 12C2 17.51 6.49 22 12 22C17.51 22 22 17.51 22 12C22 6.49 17.51 2 12 2ZM11.3 8.28C11.3 7.89 11.61 7.58 12 7.58C12.39 7.58 12.7 7.89 12.7 8.28V12.47C12.7 12.86 12.39 13.17 12 13.17C11.61 13.17 11.3 12.86 11.3 12.47V8.28ZM12.83 15.72C12.83 16.18 12.46 16.56 11.99 16.56C11.52 16.56 11.15 16.18 11.15 15.72C11.15 15.26 11.52 14.88 11.99 14.88C12.46 14.88 12.83 15.25 12.83 15.71V15.72Z" fill="#F57C00"/>
                        </svg>
                        <div class="toast-body">Выберите хотя бы один товар для оформления заказа</div>
                        <button type="button" class="btn-close" data-bs-dismiss="toast" aria-label="Закрыть"></button>
                    </div>
                `;
                
                // Добавляем toast в DOM
                document.body.appendChild(toast);
            }
            
            // Показываем toast
            toast.style.display = 'flex';
            
            // Плавное появление
            setTimeout(() => {
                toast.style.opacity = '1';
            }, 10);
            
            // Используем Bootstrap Toast API
            const bsToast = new bootstrap.Toast(toast, {
                autohide: false // Отключаем автоматическое скрытие Bootstrap
            });
            bsToast.show();
            
            // Плавное исчезновение через 15 секунд
            setTimeout(() => {
                toast.style.opacity = '0';
                
                // Полностью скрываем toast после завершения анимации
                setTimeout(() => {
                    toast.style.display = 'none';
                    bsToast.hide();
                }, 500); // 500ms = время transition
            }, 15000);
        }

        // ========== НОВОЕ: УПРАВЛЕНИЕ УВЕДОМЛЕНИЕМ О ДОСТАВКЕ ==========
        updateDeliveryToast(total) {
            if (!this.deliveryToast) return;
            
            const MIN_DELIVERY_AMOUNT = 1000;
            
            if (total < MIN_DELIVERY_AMOUNT) {
                // Сумма меньше 1000 - показываем уведомление
                this.deliveryToast.style.display = 'flex';
                
                // Обновляем текст с информацией о недостающей сумме
                const remaining = MIN_DELIVERY_AMOUNT - total;
                const toastBody = this.deliveryToast.querySelector('.toast-body');
                
                if (toastBody && !toastBody.dataset.originalText) {
                    // Сохраняем оригинальный текст
                    toastBody.dataset.originalText = toastBody.textContent;
                }
                
                if (toastBody) {
                    // Можно обновить текст с динамической информацией
                    toastBody.textContent = `Добавьте товаров на ${remaining.toFixed(2)} р. для бесплатной доставки`;
                }
                
                console.log(`ℹ Показано уведомление о доставке (сумма: ${total.toFixed(2)} р.)`);
            } else {
                // Сумма больше или равна 1000 - скрываем уведомление
                this.deliveryToast.style.display = 'none';
                console.log(`✓ Уведомление о доставке скрыто (сумма: ${total.toFixed(2)} р.)`);
            }
        }

        // ========== ПРОМОКОД ==========
        attachPromoListener() {
            if (!this.promoForm || !this.promoInput) return;
            
            this.promoForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.applyPromoCode();
            });
            
            // Убираем класс errors при начале ввода
            this.promoInput.addEventListener('input', () => {
                this.promoInput.classList.remove('errors');
            });
        }

        applyPromoCode() {
            const code = this.promoInput.value.trim().toUpperCase();
            
            if (!code) {
                this.showErrorToast('Введите промокод');
                this.promoInput.classList.add('errors');
                return;
            }
            
            // Проверка промокода
            if (code === 'IKEYA') {
                // Убираем класс ошибки если был
                this.promoInput.classList.remove('errors');
                
                this.promoCode = code;
                
                // Применяем промокод ко всем доступным товарам
                this.applyDiscountToItems();
                
                // Блокируем поле промокода
                this.promoInput.disabled = true;
                const submitBtn = this.promoForm.querySelector('button');
                if (submitBtn) {
                    submitBtn.textContent = '✓ Применён';
                    submitBtn.disabled = true;
                    submitBtn.style.opacity = '0.7';
                }
                
                // Показываем строку скидки в сводке
                const promoRow = document.querySelector('.cart-summary__row.no_promokod');
                if (promoRow) {
                    promoRow.classList.remove('no_promokod');
                    promoRow.classList.add('is_promocod');
                    promoRow.style.display = 'flex';
                }
                
                // Показываем уведомление об успехе
                this.showPromoSuccess(code, this.promoDiscount);
                
                // Обновляем итог
                this.updateSummary();
                
                console.log(`✓ Промокод ${code} применён (-${this.promoDiscount}% скидка)`);
            } else {
                // Неверный промокод - показываем ошибку
                this.promoInput.classList.add('errors');
                this.showErrorToast('Невозможно применить данный промокод');
                this.promoInput.value = '';
            }
        }

        // Метод для показа toast с ошибкой
        showErrorToast(message) {
            // Ищем существующий toast
            let toast = document.querySelector('.promokod-toast');
            
            if (!toast) {
                // Создаем toast если его нет
                toast = document.createElement('div');
                toast.className = 'toast promokod-toast';
                toast.setAttribute('role', 'alert');
                toast.setAttribute('aria-live', 'assertive');
                toast.setAttribute('aria-atomic', 'true');
                
                toast.innerHTML = `
                    <div class="d-flex">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M12 2C6.49 2 2 6.49 2 12C2 17.51 6.49 22 12 22C17.51 22 22 17.51 22 12C22 6.49 17.51 2 12 2ZM11.3 8.28C11.3 7.89 11.61 7.58 12 7.58C12.39 7.58 12.7 7.89 12.7 8.28V12.47C12.7 12.86 12.39 13.17 12 13.17C11.61 13.17 11.3 12.86 11.3 12.47V8.28ZM12.83 15.72C12.83 16.18 12.46 16.56 11.99 16.56C11.52 16.56 11.15 16.18 11.15 15.72C11.15 15.26 11.52 14.88 11.99 14.88C12.46 14.88 12.83 15.25 12.83 15.71V15.72Z" fill="#B71C1C"/>
                        </svg>
                        <div class="toast-body">${message}</div>
                        <button type="button" class="btn-close" data-bs-dismiss="toast" aria-label="Закрыть"></button>
                    </div>
                `;
                
                // Добавляем toast в DOM (рядом с формой промокода)
                const couponSection = document.querySelector('.card-summary__coupon');
                if (couponSection) {
                    couponSection.appendChild(toast);
                } else {
                    document.body.appendChild(toast);
                }
            } else {
                // Обновляем текст существующего toast
                const toastBody = toast.querySelector('.toast-body');
                if (toastBody) {
                    toastBody.textContent = message;
                }
            }
            
            // Показываем toast используя Bootstrap
            const bsToast = new bootstrap.Toast(toast, {
                autohide: true,
                delay: 4000
            });
            bsToast.show();
            
            // Убираем класс errors при закрытии toast
            toast.addEventListener('hidden.bs.toast', () => {
                this.promoInput.classList.remove('errors');
            });
        }

        applyDiscountToItems() {
            const cartItems = document.querySelectorAll('.cart-section--available .cart-item');
            
            cartItems.forEach(item => {
                const priceContainer = item.querySelector('.cart-item__price');
                
                // Пропускаем, если уже применён промокод
                if (!priceContainer.classList.contains('no_promokod')) {
                    return;
                }
                
                const qtyValue = item.querySelector('.qty-value');
                const qty = parseInt(qtyValue.textContent);
                
                // Получаем текущую цену (базовую)
                const priceMainElement = priceContainer.querySelector('.price-main');
                const basePrice = this.extractPrice(priceMainElement);
                
                // Сохраняем базовую цену за 1 шт
                item.dataset.basePrice = (basePrice / qty).toFixed(2);
                
                // Рассчитываем цену со скидкой
                const discount = (basePrice * this.promoDiscount) / 100;
                const discountedPrice = basePrice - discount;
                
                // Форматируем цены
                const [oldInteger, oldDecimal] = basePrice.toFixed(2).split('.');
                const [newInteger, newDecimal] = discountedPrice.toFixed(2).split('.');
                
                // Удаляем класс no_promokod и добавляем is_promocod
                priceContainer.classList.remove('no_promokod');
                priceContainer.classList.add('is_promocod');
                
                // Обновляем HTML с промо-структурой
                priceContainer.innerHTML = `
                    <span class="price-promo">${newInteger}<span class="price-currency">.${newDecimal} р.</span></span>
                    <span class="price-main">${oldInteger}<span class="price-currency">.${oldDecimal} р.</span></span>
                    <span class="promo-size">Скидка <span class="promo-size__calc">${discount.toFixed(2)}</span> р.</span>
                    <div class="promo-badge">
                        <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M5.92591 13.3287C5.39925 13.3287 4.87258 13.1553 4.43258 12.8153C2.94591 11.662 1.66591 10.382 0.512579 8.89533C-0.200755 7.96867 -0.167421 6.67533 0.599245 5.822C2.29925 3.922 4.07925 2.182 6.03258 0.501999C6.29924 0.268665 6.62591 0.135332 6.97258 0.101999C8.63925 -0.0513346 11.5792 -0.164668 12.5326 0.795332C13.4926 1.75533 13.3792 4.69533 13.2259 6.35533C13.1926 6.702 13.0526 7.022 12.8259 7.29533C11.1459 9.24867 9.40591 11.0287 7.50591 12.7287C7.05925 13.1287 6.49925 13.3287 5.92591 13.3287ZM1.29258 6.442C0.825912 6.962 0.805912 7.75533 1.24591 8.32867C2.34591 9.74867 3.57258 10.982 4.99925 12.082C5.57258 12.522 6.35924 12.5087 6.88591 12.0353C8.75924 10.362 10.4659 8.60867 12.1259 6.68867C12.2326 6.56867 12.2926 6.422 12.3059 6.26867C12.5326 3.822 12.3659 1.92867 11.8792 1.44867C11.3992 0.968665 9.50591 0.801999 7.05925 1.022C6.90591 1.03533 6.75924 1.09533 6.63925 1.202C4.71258 2.85533 2.95925 4.56867 1.29258 6.442Z" fill="#00910A"/>
                        </svg>
                        <p>по промокоду</p>
                    </div>
                `;
                
                // Анимация появления
                priceContainer.classList.add('promo-applied');
                setTimeout(() => {
                    priceContainer.classList.remove('promo-applied');
                }, 600);
            });
        }

        showPromoSuccess(code, discount) {
            const notification = document.createElement('div');
            notification.className = 'promo-notification success';
            notification.innerHTML = `
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M10 0C4.48 0 0 4.48 0 10C0 15.52 4.48 20 10 20C15.52 20 20 15.52 20 10C20 4.48 15.52 0 10 0ZM8 15L3 10L4.41 8.59L8 12.17L15.59 4.58L17 6L8 15Z" fill="#00910A"/>
                </svg>
                <p>Промокод <strong>${code}</strong> применён! Скидка ${discount}%</p>
            `;
            
            document.body.appendChild(notification);
            
            setTimeout(() => {
                notification.classList.add('show');
            }, 10);
            
            setTimeout(() => {
                notification.classList.remove('show');
                setTimeout(() => {
                    notification.remove();
                }, 300);
            }, 3000);
        }

        // ========== ИЗМЕНЕНИЕ КОЛИЧЕСТВА ==========
        attachQuantityListeners() {
            const cartItems = document.querySelectorAll('.cart-section--available .cart-item');
            
            cartItems.forEach(item => {
                const minusBtn = item.querySelector('.qty-btn--minus');
                const plusBtn = item.querySelector('.qty-btn--plus');
                const qtyValue = item.querySelector('.qty-value');
                const priceContainer = item.querySelector('.cart-item__price');
                
                if (!minusBtn || !plusBtn || !qtyValue || !priceContainer) return;
                
                // Определяем базовую цену за 1 шт
                const priceElement = priceContainer.querySelector('.price-main');
                const currentPrice = this.extractPrice(priceElement);
                const qty = parseInt(qtyValue.textContent);
                
                // Сохраняем базовую цену за 1 шт
                item.dataset.basePrice = (currentPrice / qty).toFixed(2);
                
                // Кнопка "минус"
                minusBtn.addEventListener('click', () => {
                    let currentQty = parseInt(qtyValue.textContent);
                    if (currentQty > 1) {
                        currentQty--;
                        qtyValue.textContent = currentQty;
                        this.updateItemPrice(item, currentQty);
                        this.updateSummary();
                    }
                });
                
                // Кнопка "плюс"
                plusBtn.addEventListener('click', () => {
                    let currentQty = parseInt(qtyValue.textContent);
                    currentQty++;
                    qtyValue.textContent = currentQty;
                    this.updateItemPrice(item, currentQty);
                    this.updateSummary();
                });
            });
        }

        // Извлечение цены из элемента
        extractPrice(priceElement) {
            const priceText = priceElement.textContent;
            const price = parseFloat(priceText.replace(/[^\d.]/g, ''));
            return price;
        }

        // Обновление цены товара
        updateItemPrice(item, qty) {
            const priceContainer = item.querySelector('.cart-item__price');
            const basePrice = parseFloat(item.dataset.basePrice);
            const totalPrice = basePrice * qty;
            
            if (priceContainer.classList.contains('is_promocod')) {
                // С промокодом - показываем обе цены
                const discount = (totalPrice * this.promoDiscount) / 100;
                const discountedPrice = totalPrice - discount;
                
                const [oldInteger, oldDecimal] = totalPrice.toFixed(2).split('.');
                const [newInteger, newDecimal] = discountedPrice.toFixed(2).split('.');
                
                priceContainer.querySelector('.price-promo').innerHTML = 
                    `${newInteger}<span class="price-currency">.${newDecimal} р.</span>`;
                priceContainer.querySelector('.price-main').innerHTML = 
                    `${oldInteger}<span class="price-currency">.${oldDecimal} р.</span>`;
                priceContainer.querySelector('.promo-size__calc').textContent = discount.toFixed(2);
            } else {
                // Без промокода - обычная цена
                const [integer, decimal] = totalPrice.toFixed(2).split('.');
                const priceElement = priceContainer.querySelector('.price-main');
                priceElement.innerHTML = `${integer}<span class="price-currency">.${decimal} р.</span>`;
            }
            
            // Анимация изменения
            priceContainer.classList.add('price-updated');
            setTimeout(() => {
                priceContainer.classList.remove('price-updated');
            }, 300);
        }

        // ========== ЧЕКБОКСЫ ==========
        attachCheckboxListeners() {
            // Чекбоксы для ДОСТУПНЫХ товаров
            if (this.availableSection) {
                const availableCheckboxes = this.availableSection.querySelectorAll('.cart-item__checkbox');
                availableCheckboxes.forEach(checkbox => {
                    checkbox.addEventListener('change', () => {
                        const item = checkbox.closest('.cart-item');
                        
                        if (checkbox.checked) {
                            item.classList.add('selected');
                        } else {
                            item.classList.remove('selected');
                        }
                        
                        this.updateAvailableSelectAllState();
                        this.updateRemoveButtonsState();
                        this.updateSummary();
                    });
                });
            }
            
            // Чекбоксы для НЕДОСТУПНЫХ товаров
            if (this.unavailableSection) {
                const unavailableCheckboxes = this.unavailableSection.querySelectorAll('.cart-item__select input[type="checkbox"]');
                unavailableCheckboxes.forEach(checkbox => {
                    checkbox.addEventListener('change', () => {
                        const item = checkbox.closest('.cart-item');
                        
                        if (checkbox.checked) {
                            item.classList.add('selected');
                        } else {
                            item.classList.remove('selected');
                        }
                        
                        this.updateUnavailableSelectAllState();
                        this.updateRemoveButtonsState();
                    });
                });
            }
        }

        // Обновление состояния "Выбрать всё" для доступных товаров
        updateAvailableSelectAllState() {
            if (!this.availableSection) return;
            
            const selectAllCheckbox = this.availableSection.querySelector('#allGoodChoises');
            if (!selectAllCheckbox) return;
            
            const allCheckboxes = this.availableSection.querySelectorAll('.cart-item__checkbox');
            const checkedCheckboxes = this.availableSection.querySelectorAll('.cart-item__checkbox:checked');
            
            if (checkedCheckboxes.length === 0) {
                selectAllCheckbox.checked = false;
                selectAllCheckbox.indeterminate = false;
            } else if (checkedCheckboxes.length === allCheckboxes.length) {
                selectAllCheckbox.checked = true;
                selectAllCheckbox.indeterminate = false;
            } else {
                selectAllCheckbox.checked = false;
                selectAllCheckbox.indeterminate = true;
            }
        }

        // Обновление состояния "Выбрать всё" для недоступных товаров
        updateUnavailableSelectAllState() {
            if (!this.unavailableSection) return;
            
            const selectAllCheckbox = this.unavailableSection.querySelector('.cart-select-all__input');
            if (!selectAllCheckbox) return;
            
            const allCheckboxes = this.unavailableSection.querySelectorAll('.cart-item__select input[type="checkbox"]');
            const checkedCheckboxes = this.unavailableSection.querySelectorAll('.cart-item__select input[type="checkbox"]:checked');
            
            if (checkedCheckboxes.length === 0) {
                selectAllCheckbox.checked = false;
                selectAllCheckbox.indeterminate = false;
            } else if (checkedCheckboxes.length === allCheckboxes.length) {
                selectAllCheckbox.checked = true;
                selectAllCheckbox.indeterminate = false;
            } else {
                selectAllCheckbox.checked = false;
                selectAllCheckbox.indeterminate = true;
            }
        }

        // ========== ВЫБРАТЬ ВСЕ ==========
        attachSelectAllListeners() {
            // "Выбрать всё" для ДОСТУПНЫХ товаров
            if (this.availableSection) {
                const selectAllCheckbox = this.availableSection.querySelector('#allGoodChoises');
                
                if (selectAllCheckbox) {
                    selectAllCheckbox.addEventListener('change', () => {
                        const checkboxes = this.availableSection.querySelectorAll('.cart-item__checkbox');
                        const isChecked = selectAllCheckbox.checked;
                        
                        checkboxes.forEach(checkbox => {
                            checkbox.checked = isChecked;
                            const item = checkbox.closest('.cart-item');
                            
                            if (isChecked) {
                                item.classList.add('selected');
                            } else {
                                item.classList.remove('selected');
                            }
                        });
                        
                        this.updateRemoveButtonsState();
                        this.updateSummary();
                    });
                }
            }
            
            // "Выбрать всё" для НЕДОСТУПНЫХ товаров
            if (this.unavailableSection) {
                const selectAllCheckbox = this.unavailableSection.querySelector('.cart-select-all__input');
                
                if (selectAllCheckbox) {
                    selectAllCheckbox.addEventListener('change', () => {
                        const checkboxes = this.unavailableSection.querySelectorAll('.cart-item__select input[type="checkbox"]');
                        const isChecked = selectAllCheckbox.checked;
                        
                        checkboxes.forEach(checkbox => {
                            checkbox.checked = isChecked;
                            const item = checkbox.closest('.cart-item');
                            
                            if (isChecked) {
                                item.classList.add('selected');
                            } else {
                                item.classList.remove('selected');
                            }
                        });
                        
                        this.updateRemoveButtonsState();
                    });
                }
            }
        }

        // ========== СОСТОЯНИЕ КНОПОК "УДАЛИТЬ" ==========
        updateRemoveButtonsState() {
            // Кнопка удаления для доступных товаров
            if (this.availableSection) {
                const removeBtn = this.availableSection.querySelector('.cart-remove-selected');
                const selectedCount = this.availableSection.querySelectorAll('.cart-item__checkbox:checked').length;
                
                if (removeBtn) {
                    if (selectedCount > 0) {
                        removeBtn.disabled = false;
                        removeBtn.style.opacity = '1';
                        removeBtn.style.pointerEvents = 'auto';
                        
                        // Обновляем текст кнопки с количеством
                        const textNode = Array.from(removeBtn.childNodes).find(node => node.nodeType === Node.TEXT_NODE);
                        if (textNode) {
                            textNode.textContent = ` Удалить (${selectedCount})`;
                        }
                    } else {
                        removeBtn.disabled = true;
                        removeBtn.style.opacity = '0.5';
                        removeBtn.style.pointerEvents = 'none';
                        
                        const textNode = Array.from(removeBtn.childNodes).find(node => node.nodeType === Node.TEXT_NODE);
                        if (textNode) {
                            textNode.textContent = ' Удалить';
                        }
                    }
                }
            }
            
            // Кнопка удаления для недоступных товаров
            if (this.unavailableSection) {
                const removeBtn = this.unavailableSection.querySelector('.cart-remove-selected');
                const selectedCount = this.unavailableSection.querySelectorAll('.cart-item__select input[type="checkbox"]:checked').length;
                
                if (removeBtn) {
                    if (selectedCount > 0) {
                        removeBtn.disabled = false;
                        removeBtn.style.opacity = '1';
                        removeBtn.style.pointerEvents = 'auto';
                        
                        const textNode = Array.from(removeBtn.childNodes).find(node => node.nodeType === Node.TEXT_NODE);
                        if (textNode) {
                            textNode.textContent = ` Удалить (${selectedCount})`;
                        }
                    } else {
                        removeBtn.disabled = true;
                        removeBtn.style.opacity = '0.5';
                        removeBtn.style.pointerEvents = 'none';
                        
                        const textNode = Array.from(removeBtn.childNodes).find(node => node.nodeType === Node.TEXT_NODE);
                        if (textNode) {
                            textNode.textContent = ' Удалить';
                        }
                    }
                }
            }
        }

        // ========== УДАЛЕНИЕ ==========
        attachDeleteListeners() {
            const deleteButtons = document.querySelectorAll('.cart-item__delete');
            
            deleteButtons.forEach(btn => {
                btn.addEventListener('click', () => {
                    const item = btn.closest('.cart-item');
                    this.deleteItem(item);
                });
            });
        }

        // Удаление одного товара
        deleteItem(item) {
            if (!confirm('Удалить товар из корзины?')) return;
            
            const isAvailable = item.closest('.cart-section--available');
            
            item.style.transition = 'all 0.3s ease';
            item.style.opacity = '0';
            item.style.transform = 'translateX(20px)';
            
            setTimeout(() => {
                item.remove();
                
                if (isAvailable) {
                    this.updateAvailableSelectAllState();
                    this.updateSummary();
                    this.checkEmptySection(this.availableSection, 'available');
                } else {
                    this.updateUnavailableSelectAllState();
                    this.checkEmptySection(this.unavailableSection, 'unavailable');
                }
                
                this.updateRemoveButtonsState();
            }, 300);
        }

        // ========== УДАЛИТЬ ВЫБРАННОЕ ==========
        attachRemoveSelectedListeners() {
            // Удалить выбранные ДОСТУПНЫЕ товары
            if (this.availableSection) {
                const removeBtn = this.availableSection.querySelector('.cart-remove-selected');
                
                if (removeBtn) {
                    removeBtn.addEventListener('click', () => {
                        const selectedItems = this.availableSection.querySelectorAll('.cart-item.selected');
                        
                        if (selectedItems.length === 0) {
                            alert('Выберите товары для удаления');
                            return;
                        }
                        
                        if (!confirm(`Удалить выбранные товары (${selectedItems.length} шт.)?`)) return;
                        
                        selectedItems.forEach((item, index) => {
                            setTimeout(() => {
                                item.style.transition = 'all 0.3s ease';
                                item.style.opacity = '0';
                                item.style.transform = 'translateX(20px)';
                                
                                setTimeout(() => {
                                    item.remove();
                                    
                                    if (index === selectedItems.length - 1) {
                                        this.updateAvailableSelectAllState();
                                        this.updateRemoveButtonsState();
                                        this.updateSummary();
                                        this.checkEmptySection(this.availableSection, 'available');
                                    }
                                }, 300);
                            }, index * 100);
                        });
                    });
                }
            }
            
            // Удалить выбранные НЕДОСТУПНЫЕ товары
            if (this.unavailableSection) {
                const removeBtn = this.unavailableSection.querySelector('.cart-remove-selected');
                
                if (removeBtn) {
                    removeBtn.addEventListener('click', () => {
                        const selectedItems = this.unavailableSection.querySelectorAll('.cart-item.selected');
                        
                        if (selectedItems.length === 0) {
                            alert('Выберите товары для удаления');
                            return;
                        }
                        
                        if (!confirm(`Удалить выбранные товары (${selectedItems.length} шт.)?`)) return;
                        
                        selectedItems.forEach((item, index) => {
                            setTimeout(() => {
                                item.style.transition = 'all 0.3s ease';
                                item.style.opacity = '0';
                                item.style.transform = 'translateX(20px)';
                                
                                setTimeout(() => {
                                    item.remove();
                                    
                                    if (index === selectedItems.length - 1) {
                                        this.updateUnavailableSelectAllState();
                                        this.updateRemoveButtonsState();
                                        this.checkEmptySection(this.unavailableSection, 'unavailable');
                                    }
                                }, 300);
                            }, index * 100);
                        });
                    });
                }
            }
        }

        // ========== ПОДСЧЕТ ОБЩЕЙ СКИДКИ ПО ПРОМОКОДУ ==========
        calculateTotalPromoDiscount() {
            let totalDiscount = 0;
            
            // Получаем все выбранные товары с промокодом
            const selectedItemsWithPromo = this.availableSection.querySelectorAll('.cart-item.selected .cart-item__price.is_promocod');
            
            selectedItemsWithPromo.forEach(priceContainer => {
                const promoCalcElement = priceContainer.querySelector('.promo-size__calc');
                if (promoCalcElement) {
                    const discountValue = parseFloat(promoCalcElement.textContent);
                    if (!isNaN(discountValue)) {
                        totalDiscount += discountValue;
                    }
                }
            });
            
            return totalDiscount;
        }

        // ========== ОБНОВЛЕНИЕ ИТОГА ==========
        updateSummary() {
            if (!this.availableSection) return;
            
            const selectedItems = this.availableSection.querySelectorAll('.cart-item.selected');
            
            let totalItems = 0;
            let subtotal = 0;
            let totalDiscount = 0;
            
            selectedItems.forEach(item => {
                const qtyValue = item.querySelector('.qty-value');
                if (!qtyValue) return;
                
                const qty = parseInt(qtyValue.textContent);
                const basePrice = parseFloat(item.dataset.basePrice);
                const itemTotal = basePrice * qty;
                const priceContainer = item.querySelector('.cart-item__price');
                
                // Если промокод применён к этому товару
                if (priceContainer.classList.contains('is_promocod')) {
                    const discount = (itemTotal * this.promoDiscount) / 100;
                    totalDiscount += discount;
                    subtotal += (itemTotal - discount);
                } else {
                    subtotal += itemTotal;
                }
                
                totalItems += qty;
            });
            
            // Обновляем количество товаров в первой строке
            const itemsCountRow = document.querySelector('.cart-summary__row:first-child p:last-child');
            if (itemsCountRow) {
                // Сохраняем текст с весом если он есть
                const weightMatch = itemsCountRow.textContent.match(/\((.*?)\)/);
                const weightText = weightMatch ? ` ${weightMatch[0]}` : '';
                const itemWord = totalItems === 1 ? 'товар' : totalItems < 5 ? 'товара' : 'товаров';
                itemsCountRow.innerHTML = `${totalItems} ${itemWord}${weightText}`;
            }
            
            // Обновляем подытог (цена без скидки)
            const subtotalWithoutDiscount = subtotal + totalDiscount;
            const subtotalElement = document.querySelector('.summery-row__cost');
            if (subtotalElement) {
                subtotalElement.textContent = `${subtotalWithoutDiscount.toFixed(2)} р.`;
            }
            
            // ========== Обновляем общую скидку по промокоду ==========
            const totalPromoDiscount = this.calculateTotalPromoDiscount();
            
            if (this.promoCode && totalPromoDiscount > 0) {
                const promoRow = document.querySelector('.cart-summary__row.is_promocod, .cart-summary__row.no_promokod');
                const promoElement = promoRow?.querySelector('.summery-row__cost-promo');
                
                if (promoElement) {
                    promoElement.textContent = `-${totalPromoDiscount.toFixed(2)} р.`;
                }
                
                // Показываем строку со скидкой
                if (promoRow) {
                    promoRow.classList.remove('no_promokod');
                    promoRow.classList.add('is_promocod');
                    promoRow.style.display = 'flex';
                }
            } else {
                // Скрываем строку со скидкой, если промокода нет или скидка = 0
                const promoRow = document.querySelector('.cart-summary__row.is_promocod');
                if (promoRow) {
                    promoRow.style.display = 'none';
                }
            }
            
            // Рассчитываем доставку
            const deliveryCost = subtotal >= 2000 ? 0 : 56;
            const deliveryElement = document.querySelector('.summery-row__cost-delivery');
            if (deliveryElement) {
                deliveryElement.textContent = deliveryCost === 0 ? 'Бесплатно' : `${deliveryCost.toFixed(2)} р.`;
            }
            
            // Обновляем итого
            const total = subtotal + deliveryCost;
            const totalElement = document.querySelector('.summery-total__total');
            if (totalElement) {
                const [integer, decimal] = total.toFixed(2).split('.');
                totalElement.innerHTML = `${integer}<span>.${decimal} р.</span>`;
            }
            
            // НОВОЕ: Обновляем уведомление о доставке на основе итоговой суммы
            this.updateDeliveryToast(total);
            
            // Обновляем счетчик в header
            this.updateHeaderCart(totalItems);
        }

        // Обновление счетчика корзины в header
        updateHeaderCart(count) {
            const cartCount = document.querySelector('.cart-count');
            if (cartCount) {
                cartCount.textContent = count;
            }
        }

        // Проверка пустой секции
        checkEmptySection(section, type) {
            if (!section) return;
            
            const items = section.querySelectorAll('.cart-item');
            
            if (items.length === 0) {
                const emptyMessage = document.createElement('div');
                emptyMessage.className = 'empty-section';
                
                if (type === 'available') {
                    emptyMessage.innerHTML = `
                        <p>Корзина пуста</p>
                        <a href="catalog.html" class="btn btn-primary">Перейти в каталог</a>
                    `;
                } else {
                    emptyMessage.innerHTML = '<p>Нет недоступных товаров</p>';
                }
                
                // Убираем кнопки управления
                const topPanel = section.querySelector('.cart-main__top, .cart-section__top');
                if (topPanel) {
                    topPanel.style.display = 'none';
                }
                
                section.appendChild(emptyMessage);
            }
        }
    }

    // Инициализация при загрузке DOM
    document.addEventListener('DOMContentLoaded', () => {
        window.shoppingCart = new ShoppingCart();
    });

})();
