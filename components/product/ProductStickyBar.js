'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { useCart } from '@/contexts/CartContext';
import { useFavorites } from '@/contexts/FavoritesContext';
import { useAuth } from '@/contexts/AuthContext';
import { useAuthModals } from '@/components/auth/AuthModalsHost';

const API_BASE_URL = 'http://45.135.234.22';

function HeartIcon({ active }) {
  return (
    <svg width="25" height="22" viewBox="0 0 25 22" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M12.5 21.525C11.675 21.525 10.8375 21.2625 10.125 20.725C7.075 18.45 0 12.55 0 6.9125C0 3.0375 2.9375 0 6.6875 0C8.7625 0 10.5375 0.775 12.5 2.575C14.4625 0.775 16.2375 0 18.3125 0C22.0625 0 25 3.0375 25 6.9125C25 12.5375 17.9125 18.4375 14.875 20.725C14.1625 21.25 13.3375 21.525 12.5 21.525ZM6.6875 1.75C3.875 1.75 1.75 3.975 1.75 6.9125C1.75 11.8875 8.9625 17.6625 11.175 19.325C11.9625 19.9125 13.0375 19.9125 13.825 19.325C16.0375 17.675 23.25 11.8875 23.25 6.9125C23.25 3.9625 21.125 1.75 18.3125 1.75C16.9875 1.75 15.45 2.075 13.1125 4.4C12.775 4.7375 12.225 4.7375 11.875 4.4C9.55 2.075 8 1.75 6.675 1.75H6.6875Z"
        fill={active ? '#ce0061' : '#181818'} />
    </svg>
  );
}

export default function ProductStickyBar({ product }) {
  const { addToCart, updateQuantity, items } = useCart();
  const { isFavorite, add, remove } = useFavorites();
  const { isAuth } = useAuth();
  const { openLogin } = useAuthModals();

  const [visible, setVisible] = useState(false);
  const [addToCartLoading, setAddToCartLoading] = useState(false);

  useEffect(() => {
    const handleScroll = () => setVisible(window.scrollY > 400);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const attr = product.attributes;
  const sku = attr.sku || product.id;
  const isLiked = sku ? isFavorite(sku) : false;

  const currentQty = useMemo(() => {
    const found = (items || []).find((it) => it?.sku === sku);
    return Number(found?.quantity || 0);
  }, [items, sku]);

  const handleAddToCart = useCallback(async () => {
    setAddToCartLoading(true);
    try {
      await addToCart(sku, 1);
    } catch (e) {
      console.error('Ошибка добавления в корзину:', e);
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

  const handleLike = useCallback(async (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!sku) return;
    if (!isAuth) { openLogin(); return; }
    try {
      if (isLiked) await remove(sku);
      else await add(sku);
    } catch (err) {
      console.error('Ошибка избранного:', err);
    }
  }, [sku, isAuth, isLiked, openLogin, add, remove]);

  const image = Array.isArray(attr.local_images) && attr.local_images[0]
    ? `${API_BASE_URL}/${attr.local_images[0]}`
    : '/assets/img/no-image.jpg';

  const price = parseFloat(attr.price) || 0;
  const priceInt = Math.floor(price);
  const priceDec = (price % 1).toFixed(2).slice(2);

  const rating = parseFloat(attr.rating_avg) || 0;
  const ratingCount = attr.rating_count || 0;

  if (!visible) return null;

  return (
    <section
      className="verh"
      style={{
        position: 'sticky',
        top: '65px',
        zIndex: 998,
        background: '#fff',
        borderBottom: '1px solid #e0e0e0',
        boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
      }}
    >
      <div className="container">
        <div className="row">
          <div className="col-12">
            <div className="verh-inner">
              <div className="verh-card">

                <img src={image} alt={attr.name_ru || ''} />

                <div className="verh-card__info">
                  <p>{attr.name_ru || attr.name}</p>
                  {ratingCount > 0 && (
                    <div className="goods-feedback">
                      <a href="#reviews">
                        {[...Array(5)].map((_, i) => (
                          <svg key={i} width="16" height="16" viewBox="0 0 16 16" fill="none">
                            <path
                              d="M11.5134 14.6667C11.18 14.6667 10.76 14.56 10.2334 14.2467L8.38004 13.14C8.19337 13.0267 7.82004 13.0267 7.6267 13.14L5.77337 14.2467C4.68004 14.9 4.03337 14.6467 3.7467 14.4333C3.45337 14.22 3.01337 13.68 3.30004 12.4267L3.74004 10.5067C3.7867 10.3 3.6867 9.95999 3.54004 9.80666L2.00004 8.25333C1.43337 7.67999 1.22004 7.05333 1.40004 6.49333C1.5067 6.16666 1.84004 5.59999 2.9067 5.41999L4.8867 5.08666C5.0667 5.05333 5.34004 4.85333 5.42004 4.68666L6.51337 2.47999C7.01337 1.47333 7.6667 1.32666 8.0067 1.32666C8.3467 1.32666 9.00004 1.47999 9.49337 2.47999L10.5867 4.67999C10.6734 4.85333 10.94 5.05333 11.1267 5.08666L13.1067 5.41999C13.9 5.55333 14.4334 5.93333 14.6134 6.49999C14.72 6.82666 14.78 7.48666 14.0067 8.25999L12.4734 9.80666C12.3267 9.95999 12.2267 10.3 12.2734 10.5133L12.7134 12.4267C13 13.68 12.56 14.22 12.2667 14.4333C12.12 14.54 11.8734 14.66 11.52 14.66L11.5134 14.6667Z"
                              fill={i < Math.round(rating) ? '#FFB300' : '#BDBDBD'}
                            />
                          </svg>
                        ))}
                        <p><span className="feedback-counter">{ratingCount}</span> отзывов</p>
                      </a>
                    </div>
                  )}
                </div>

                <div className="verh-card__action">
                  <div className="goods-costs">
                    <p>{priceInt}<span>.{priceDec}</span></p>
                  </div>

                  {currentQty > 0 ? (
                    <div className="goods-added goods-added--compact">
                      <div className="goods-added__counter">
                        <button className="counter-button counter-button__minus" type="button" onClick={handleMinus}>
                          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                            <path d="M21.3 12.7H2.7C2.31 12.7 2 12.39 2 12C2 11.61 2.31 11.3 2.7 11.3H21.3C21.69 11.3 22 11.61 22 12C22 12.39 21.69 12.7 21.3 12.7Z" fill="#BDBDBD" />
                          </svg>
                        </button>
                        <span className="counter-vlaue">{currentQty}</span>
                        <button className="counter-button counter-button__plus" type="button" onClick={handlePlus}>
                          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                            <path d="M21.3 11.3H12.7V2.7C12.7 2.31 12.39 2 12 2C11.61 2 11.3 2.31 11.3 2.7V11.3H2.7C2.31 11.3 2 11.61 2 12C2 12.39 2.31 12.7 2.7 12.7H11.3V21.3C11.3 21.69 11.61 22 12 22C12.39 22 12.7 21.69 12.7 21.3V12.7H21.3C21.69 12.7 22 12.39 22 12C22 11.61 21.69 11.3 21.3 11.3Z" fill="#757575" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                      <button
                        className="goods-add__cart"
                        onClick={handleAddToCart}
                        type="button"
                        disabled={addToCartLoading}
                      >
                        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                          <path d="M7.26668 13.6833H12.5333C16.575 13.6833 17.15 10.85 17.75 7.84166C17.9584 6.79166 18.075 6.21666 17.7084 5.69999C17.3084 5.14999 16.6834 5.14999 15.7334 5.14999H5.82502L5.43335 3.27499C5.19168 2.32499 4.34168 1.65833 3.36668 1.65833H2.64168C2.31668 1.65833 2.05835 1.91666 2.05835 2.24166C2.05835 2.56666 2.31668 2.82499 2.64168 2.82499H3.36668C3.80835 2.82499 4.20002 3.12499 4.30002 3.54166L6.23335 12.7583C5.37502 13.1667 4.76668 14.0583 4.76668 15.1C4.76668 15.6083 5.16668 16.0167 5.66668 16.0167H7.20002C7.13335 16.2 7.09168 16.3917 7.09168 16.6C7.09168 17.5583 7.87502 18.3417 8.83335 18.3417C9.79168 18.3417 10.575 17.5583 10.575 16.6C10.575 16.3917 10.5334 16.2 10.4667 16.0167H12.6167C12.55 16.2 12.5084 16.3917 12.5084 16.6C12.5084 17.5583 13.2917 18.3417 14.25 18.3417C15.2084 18.3417 15.9917 17.5583 15.9917 16.6C15.9917 15.6417 15.2084 14.8583 14.25 14.8583H5.95002C6.05835 14.2 6.60835 13.6917 7.25835 13.6917L7.26668 13.6833Z" fill="white" />
                        </svg>
                        В корзину
                      </button>
                    </div>
                  )}
                </div>
                <button className="verh-like" type="button" onClick={handleLike}>
                  <HeartIcon active={isLiked} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}