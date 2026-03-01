// components/product/ProductInfo.js
'use client';

import { useState, useCallback, useMemo } from 'react';
import { useCart } from '@/contexts/CartContext';
import GoodsAdded from '@/components/product/GoodsAdded';

import ProductColors from './info/ProductColors';
import ProductSizes from './info/ProductSizes';
import ProductParameters from './info/ProductParameters';
import ProductDeliveryLink from './info/ProductDeliveryLink';
import ProductConsultation from './info/ProductConsultation';

export default function ProductInfo({ product }) {
  const { addToCart, updateQuantity, items } = useCart();
  const [addToCartLoading, setAddToCartLoading] = useState(false);

  const attr = product.attributes;
  const sku = attr.sku || product.id;

  const currentQty = useMemo(() => {
    const found = (items || []).find((it) => it?.sku === sku);
    return Number(found?.quantity || 0);
  }, [items, sku]);

  const handleAddToCart = useCallback(async () => {
    setAddToCartLoading(true);
    try {
      await addToCart(sku, 1);
    } catch (error) {
      console.error('Ошибка добавления в корзину:', error);
    } finally {
      setAddToCartLoading(false);
    }
  }, [addToCart, sku]);

  const handleMinus = useCallback(() => {
    if (!currentQty) return;
    updateQuantity(sku, Math.max(0, currentQty - 1));
  }, [currentQty, sku, updateQuantity]);

  const handlePlus = useCallback(() => {
    updateQuantity(sku, currentQty + 1);
  }, [currentQty, sku, updateQuantity]);

  // Рейтинг
  const rating = parseFloat(attr.rating_avg) || 0;
  const ratingCount = attr.rating_count || 0;

  // Парсим локальные изображения
  let localImages = [];
  try {
    localImages = attr.local_images ? JSON.parse(attr.local_images) : [];
  } catch (e) {
    console.error('Error parsing local_images:', e);
  }

  // Парсим варианты
  let variants = [];
  try {
    variants = attr.variants || [];
  } catch (e) {
    console.error('Error parsing variants:', e);
  }

  return (
    <div className="goods-content">
      <div className="goods-content__inner">

        {/* Коллекция */}
        {attr.collection && (
          <span className="goods-category">{attr.collection}</span>
        )}

        {/* Название */}
        <h1>{attr.name_ru || attr.name}</h1>

        {/* Артикул */}
        <p className="artikul">Артикул: <span>{attr.sku}</span></p>

        {/* Рейтинг */}
        {ratingCount > 0 && (
          <div className="goods-feedback">
            <a href="#reviews">
              {[...Array(5)].map((_, i) => (
                <svg key={i} width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="M11.5134 14.6667C11.18 14.6667 10.76 14.56 10.2334 14.2467L8.38004 13.14C8.19337 13.0267 7.82004 13.0267 7.6267 13.14L5.77337 14.2467C4.68004 14.9 4.03337 14.6467 3.7467 14.4333C3.45337 14.22 3.01337 13.68 3.30004 12.4267L3.74004 10.5067C3.7867 10.3 3.6867 9.95999 3.54004 9.80666L2.00004 8.25333C1.43337 7.67999 1.22004 7.05333 1.40004 6.49333C1.5067 6.16666 1.84004 5.59999 2.9067 5.41999L4.8867 5.08666C5.0667 5.05333 5.34004 4.85333 5.42004 4.68666L6.51337 2.47999C7.01337 1.47333 7.6667 1.32666 8.0067 1.32666C8.3467 1.32666 9.00004 1.47999 9.49337 2.47999L10.5867 4.67999C10.6734 4.85333 10.94 5.05333 11.1267 5.08666L13.1067 5.41999C13.9 5.55333 14.4334 5.93333 14.6134 6.49999C14.72 6.82666 14.78 7.48666 14.0067 8.25999L12.4734 9.80666C12.3267 9.95999 12.2267 10.3 12.2734 10.5133L12.7134 12.4267C13 13.68 12.56 14.22 12.2667 14.4333C12.12 14.54 11.8734 14.66 11.52 14.66L11.5134 14.6667Z"
                    fill={i < Math.round(rating) ? "#FFB300" : "#BDBDBD"}
                  />
                </svg>
              ))}
              <p><span className="feedback-counter">{ratingCount}</span> отзывов</p>
            </a>
          </div>
        )}

        {/* Промокод */}
        <span className="sales-hit pink">-10% промокод IKEYA</span>

        {/* Цена */}
        <div className="goods-costs">
          <p>{Math.floor(attr.price)}<span>.{(attr.price % 1).toFixed(2).slice(2)}</span></p>

          {attr.delivery_name && (
            <div className="goods-delivery">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M10.3134 4.12667C10.2867 3.61333 10.2 3.26667 9.91338 2.98C9.50671 2.57333 8.96671 2.57333 7.99338 2.57333H3.66005C2.68671 2.57333 2.15338 2.57333 1.74005 2.98C1.32671 3.38667 1.33338 3.92667 1.33338 4.9V9.86C1.33338 10.5 1.33338 10.8533 1.52005 11.18C1.64005 11.3933 1.82005 11.5733 2.03338 11.6933C2.28005 11.8333 2.54671 11.8667 2.94671 11.88C3.16005 12.7667 3.95338 13.4333 4.90671 13.4333C5.86005 13.4333 6.65338 12.7667 6.86005 11.88H9.14671C9.36005 12.7667 10.1534 13.4333 11.1 13.4333C12.0467 13.4333 12.8467 12.7667 13.0534 11.88H13.12C13.2867 11.88 13.3667 11.88 13.44 11.8667C14.0734 11.7867 14.5734 11.2867 14.6534 10.6533C14.66 10.5867 14.6667 10.5 14.6667 10.3333V8.62C14.6667 6.18667 12.7267 4.2 10.3134 4.12667Z"
                  fill="#04A31A"
                />
              </svg>
              <p>{attr.delivery_name}</p>
            </div>
          )}
        </div>

        {/* Пошлина */}
        <div className="goods-poshlina">
          <div className="goods-poshlina_top">
            <button type="button">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M9.99996 1.66666C5.40829 1.66666 1.66663 5.40832 1.66663 9.99999C1.66663 14.5917 5.40829 18.3333 9.99996 18.3333C14.5916 18.3333 18.3333 14.5917 18.3333 9.99999C18.3333 5.40832 14.5916 1.66666 9.99996 1.66666ZM13.1 10.5833H10.5833V13.1C10.5833 13.425 10.325 13.6833 9.99996 13.6833C9.67496 13.6833 9.41663 13.425 9.41663 13.1V10.5833H6.89996C6.57496 10.5833 6.31663 10.325 6.31663 9.99999C6.31663 9.67499 6.57496 9.41666 6.89996 9.41666H9.41663V6.89999C9.41663 6.57499 9.67496 6.31666 9.99996 6.31666C10.325 6.31666 10.5833 6.57499 10.5833 6.89999V9.41666H13.1C13.425 9.41666 13.6833 9.67499 13.6833 9.99999C13.6833 10.325 13.425 10.5833 13.1 10.5833Z"
                  fill="#CE0061"
                />
              </svg>
            </button>
            <p>
              <span>≈</span>
              <span className="poshlina-number">{Math.floor(attr.price * 0.2)}</span>
              <span className="poshlina-valute">р.</span> пошлина не входит в цену
            </p>
          </div>
          <a href="#">Правила оплаты и формирование таможенной пошлины</a>
        </div>

        {/* Кнопка "В корзину" / блок добавленного товара */}
        {currentQty > 0 ? (
          <GoodsAdded quantity={currentQty} onMinus={handleMinus} onPlus={handlePlus} />
        ) : (
          <button
            className="goods-add__cart"
            onClick={handleAddToCart}
            type="button"
            disabled={addToCartLoading}
          >
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M7.26668 13.6833H12.5333C16.575 13.6833 17.15 10.85 17.75 7.84166C17.9584 6.79166 18.075 6.21666 17.7084 5.69999C17.3084 5.14999 16.6834 5.14999 15.7334 5.14999H5.82502L5.43335 3.27499C5.19168 2.32499 4.34168 1.65833 3.36668 1.65833H2.64168C2.31668 1.65833 2.05835 1.91666 2.05835 2.24166C2.05835 2.56666 2.31668 2.82499 2.64168 2.82499H3.36668C3.80835 2.82499 4.20002 3.12499 4.30002 3.54166L6.23335 12.7583C5.37502 13.1667 4.76668 14.0583 4.76668 15.1C4.76668 15.6083 5.16668 16.0167 5.66668 16.0167H7.20002C7.13335 16.2 7.09168 16.3917 7.09168 16.6C7.09168 17.5583 7.87502 18.3417 8.83335 18.3417C9.79168 18.3417 10.575 17.5583 10.575 16.6C10.575 16.3917 10.5334 16.2 10.4667 16.0167H12.6167C12.55 16.2 12.5084 16.3917 12.5084 16.6C12.5084 17.5583 13.2917 18.3417 14.25 18.3417C15.2084 18.3417 15.9917 17.5583 15.9917 16.6C15.9917 15.6417 15.2084 14.8583 14.25 14.8583H5.95002C6.05835 14.2 6.60835 13.6917 7.25835 13.6917L7.26668 13.6833Z"
                fill="white"
              />
            </svg>
            В корзину
          </button>
        )}

        {/* Выбор цвета */}
        <ProductColors
          variants={variants}
          currentSku={attr.sku}
          localImages={localImages}
        />

        {/* Варианты размеров */}
        <ProductSizes
          variants={variants}
          currentPrice={parseFloat(attr.price)}
          productImage={localImages[0]}
        />

        {/* Основные характеристики */}
        <ProductParameters product={product} />

        {/* Кнопка доставки */}
        <ProductDeliveryLink />

        {/* Консультация */}
        <ProductConsultation />

      </div>
    </div>
  );
}