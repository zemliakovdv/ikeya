'use client';

import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import * as cartAPI from '@/lib/api/cart';
import { getProductBySku, getPopularProducts } from '@/lib/api/ikea';

const CartContext = createContext();

let updateTimeoutId = null;

export function CartProvider({ children }) {
    const [cart, setCart] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // ==================== ЗАГРУЗКА КОРЗИНЫ ====================

    const fetchCart = useCallback(async () => {
        try {
            setLoading(true);
            const response = await cartAPI.getCart();

            // Если есть товары в корзине - обогащаем их данными
            if (response.cart?.items && response.cart.items.length > 0) {
                const enrichedItems = await Promise.all(
                    response.cart.items.map(async (item) => {
                        try {
                            const productData = await getProductBySku(item.sku);
                            const attrs = productData.data?.attributes || {};

                            return {
                                ...item,
                                product: {
                                    ...item.product,
                                    name_ru: attrs.name_ru || item.product.name,
                                    local_images: attrs.local_images || item.product.images?.local_images,
                                    images: attrs.images || item.product.images?.images,
                                    collection: attrs.collection
                                }
                            };
                        } catch (error) {
                            console.error(`Не удалось загрузить данные для SKU ${item.sku}`);
                            return item;
                        }
                    })
                );

                response.cart.items = enrichedItems;
            }

            // ЗАГРУЖАЕМ ПОПУЛЯРНЫЕ ТОВАРЫ для рекомендаций
            if (!response.cart?.recommendations || response.cart.recommendations.length === 0) {
                try {
                    const popularData = await getPopularProducts({ page: 1, per_page: 10 });
                    response.cart = response.cart || {};
                    response.cart.recommendations = popularData.data || [];
                } catch (error) {
                    console.error('Не удалось загрузить популярные товары');
                }
            }

            setCart(response.cart);
            setError(null);
        } catch (err) {
            setError(err.message);
            setCart(null);
        } finally {
            setLoading(false);
        }
    }, []);




    // Загрузить корзину при монтировании
    useEffect(() => {
        fetchCart();
    }, [fetchCart]);

    // ==================== ОПЕРАЦИИ С КОРЗИНОЙ ====================

    /**
     * Добавить товар в корзину
     */
    const addToCart = async (sku, quantity = 1) => {
        try {
            setLoading(true);
            const response = await cartAPI.addToCart(sku, quantity);

            // Обогащаем данные товаров после добавления
            if (response.cart?.items && response.cart.items.length > 0) {
                const enrichedItems = await Promise.all(
                    response.cart.items.map(async (item) => {
                        try {
                            const productData = await getProductBySku(item.sku);
                            const attrs = productData.data?.attributes || {};

                            return {
                                ...item,
                                product: {
                                    ...item.product,
                                    name_ru: attrs.name_ru || item.product.name,
                                    local_images: attrs.local_images || item.product.images?.local_images,
                                    images: attrs.images || item.product.images?.images,
                                    collection: attrs.collection
                                }
                            };
                        } catch (error) {
                            console.error(`Не удалось загрузить данные для SKU ${item.sku}`);
                            return item;
                        }
                    })
                );

                response.cart.items = enrichedItems;
            }

            setCart(response.cart);
            setError(null);
            return response;
        } catch (err) {
            setError(err.message);
            throw err;
        } finally {
            setLoading(false);
        }
    };


    /**
     * Удалить товар из корзины
     */
    const removeFromCart = async (sku) => {
        try {
            setLoading(true);
            const response = await cartAPI.removeFromCart(sku);

            // Обогащаем данные товаров после удаления
            if (response.cart?.items && response.cart.items.length > 0) {
                const enrichedItems = await Promise.all(
                    response.cart.items.map(async (item) => {
                        try {
                            const productData = await getProductBySku(item.sku);
                            const attrs = productData.data?.attributes || {};

                            return {
                                ...item,
                                product: {
                                    ...item.product,
                                    name_ru: attrs.name_ru || item.product.name,
                                    local_images: attrs.local_images || item.product.images?.local_images,
                                    images: attrs.images || item.product.images?.images,
                                    collection: attrs.collection
                                }
                            };
                        } catch (error) {
                            console.error(`Не удалось загрузить данные для SKU ${item.sku}`);
                            return item;
                        }
                    })
                );

                response.cart.items = enrichedItems;
            }

            setCart(response.cart);
            setError(null);
            return response;
        } catch (err) {
            setError(err.message);
            throw err;
        } finally {
            setLoading(false);
        }
    };


    /**
     * Изменить количество товара
     */
    const updateQuantity = async (sku, newQuantity) => {
        // Если количество = 0 → удаляем товар
        if (newQuantity === 0) {
            return removeFromCart(sku);
        }

        // ОПТИМИСТИЧНОЕ ОБНОВЛЕНИЕ: сразу обновляем UI
        setCart(prevCart => {
            if (!prevCart) return prevCart;

            return {
                ...prevCart,
                items: prevCart.items.map(item =>
                    item.sku === sku
                        ? { ...item, quantity: newQuantity }
                        : item
                )
            };
        });

        // ДЕБАУНС: отменяем предыдущий запрос, если он ещё не ушёл
        if (updateTimeoutId) {
            clearTimeout(updateTimeoutId);
        }

        // Отправляем запрос только через 500мс после последнего клика
        updateTimeoutId = setTimeout(async () => {
            try {
                const response = await cartAPI.updateCartItemQuantity(sku, newQuantity);

                // Обновляем корзину данными с сервера (с пересчитанными ценами)
                if (response.cart?.items && response.cart.items.length > 0) {
                    const enrichedItems = await Promise.all(
                        response.cart.items.map(async (item) => {
                            try {
                                const productData = await getProductBySku(item.sku);
                                const attrs = productData.data?.attributes || {};

                                return {
                                    ...item,
                                    product: {
                                        ...item.product,
                                        name_ru: attrs.name_ru || item.product.name,
                                        local_images: attrs.local_images || item.product.images?.local_images,
                                        images: attrs.images || item.product.images?.images,
                                        collection: attrs.collection
                                    }
                                };
                            } catch (error) {
                                console.error(`Не удалось загрузить данные для SKU ${item.sku}`);
                                return item;
                            }
                        })
                    );

                    response.cart.items = enrichedItems;
                }

                setCart(response.cart);
                setError(null);
            } catch (err) {
                // Если ошибка - откатываем изменения
                await fetchCart();
                setError(err.message);
            }
        }, 500); // ⬅️ Ждём 500мс после последнего клика
    };


    /**
     * Очистить всю корзину
     */
    const clearCart = async () => {
        try {
            setLoading(true);
            await cartAPI.clearCart();
            setCart(null);
            setError(null);
        } catch (err) {
            setError(err.message);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    /**
     * Применить промокод
     */
    const applyPromo = async (code) => {
        try {
            setLoading(true);
            const response = await cartAPI.applyPromoCode(code);
            setCart(response.cart);
            setError(null);
            return response;
        } catch (err) {
            setError(err.message);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    /**
     * Удалить промокод
     */
    const removePromo = async () => {
        try {
            setLoading(true);
            const response = await cartAPI.removePromoCode();
            setCart(response.cart);
            setError(null);
            return response;
        } catch (err) {
            setError(err.message);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    /**
     * Оформить заказ
     */
    const checkout = async (orderData) => {
        try {
            setLoading(true);
            const response = await cartAPI.checkout(orderData);
            setCart(null); // Очищаем корзину после заказа
            setError(null);
            return response;
        } catch (err) {
            setError(err.message);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    // ==================== ВЫЧИСЛЯЕМЫЕ ЗНАЧЕНИЯ ====================

    const itemsCount = cart?.items_count || 0;
    const items = cart?.items || [];
    const totals = cart?.totals || {};
    const flags = cart?.flags || {};
    const recommendations = cart?.recommendations || [];

    // Доступные товары (available: true)
    const availableItems = items.filter(item => item.available);

    // Недоступные товары (available: false)
    const unavailableItems = items.filter(item => !item.available);

    const value = {
        // Состояние
        cart,
        loading,
        error,

        // Методы
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        applyPromo,
        removePromo,
        checkout,
        refreshCart: fetchCart,

        // Вычисляемые значения
        itemsCount,
        items,
        availableItems,
        unavailableItems,
        totals,
        flags,
        recommendations,
    };

    return (
        <CartContext.Provider value={value}>
            {children}
        </CartContext.Provider>
    );
}

export function useCart() {
    const context = useContext(CartContext);
    if (!context) {
        throw new Error('useCart должен использоваться внутри CartProvider');
    }
    return context;
}
