'use client';

import { useState, Suspense } from 'react';
import { useRouter } from 'next/navigation';
import AwaitingReviewList from '@/components/profile/AwaitingReviewList';
import ReviewList from '@/components/profile/ReviewList';
import ReviewDrawer from '@/components/profile/ReviewDrawer';
import ReviewSuccessModal from '@/components/profile/ReviewSuccessModal';
import NotFoundRecommendations from '@/components/recommendations/NotFoundRecommendations';

export default function Reviews({
  availableProducts,
  reviews,
  loading,
  error,
  token,
  onReviewCreated,
  onReviewDeleted,
}) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('awaiting');

  // Drawer
  const [drawerOpen, setDrawerOpen]       = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  // Success modal
  const [showSuccess, setShowSuccess] = useState(false);

  // Toast
  const [toast, setToast] = useState(null); // { message, onUndo }

  function openDrawer(product) {
    setSelectedProduct(product);
    setDrawerOpen(true);
  }

  function closeDrawer() {
    setDrawerOpen(false);
    setSelectedProduct(null);
  }

  async function handleReviewSubmitted(newReview, sku) {
    closeDrawer();
    setShowSuccess(true);
    onReviewCreated(newReview, sku);
  }

  async function handleDeleteReview(id) {
    // Optimistic delete
    onReviewDeleted(id);

    let undone = false;

    const toastTimer = setTimeout(() => {
      if (!undone) {
        // Подтверждаем удаление — запрос уже был отправлен в ReviewList
      }
      setToast(null);
    }, 4000);

    setToast({
      message: 'Отзыв удалён!',
      onUndo: () => {
        undone = true;
        clearTimeout(toastTimer);
        setToast(null);
        // При undo — перезагружаем страницу, т.к. нужно восстановить данные
        router.refresh();
      },
    });
  }

  if (loading) {
    return (
      <div className="reviews-loading">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Загрузка…</span>
        </div>
      </div>
    );
  }

  return (
    <div className="reviews-wrapper">

      {/* Табы */}
      <ul className="nav nav-tabs reviews-tabs" role="tablist">
        <li className="nav-item" role="presentation">
          <button
            className={`nav-link ${activeTab === 'awaiting' ? 'active' : ''}`}
            onClick={() => setActiveTab('awaiting')}
          >
            Ждут отзыва
          </button>
        </li>
        <li className="nav-item" role="presentation">
          <button
            className={`nav-link ${activeTab === 'reviews' ? 'active' : ''}`}
            onClick={() => setActiveTab('reviews')}
          >
            Отзывы
          </button>
        </li>
      </ul>

      {!!error && (
        <p className="reviews-error">{error}</p>
      )}

      <div className="tab-content">

        {/* Вкладка: Ждут отзыва */}
        {activeTab === 'awaiting' && (
          <div>
            {availableProducts.length === 0 ? (
              <div className="reviews-empty">
                <div className="reviews-empty__illustration">
                  <img src="/assets/img/profile/empty-awaiting-reviews.png" alt="" />
                </div>
                <div className="reviews-empty__title">Товаров для отзывов пока нет</div>
                <div className="reviews-empty__text">
                  Здесь будут отображаться товары, которые ждут отзыва
                </div>
                <button
                  className="reviews-empty__btn"
                  onClick={() => router.push('/catalog')}
                >
                  Перейти к покупкам
                </button>
              </div>
            ) : (
              <AwaitingReviewList
                products={availableProducts}
                onOpenDrawer={openDrawer}
              />
            )}
          </div>
        )}

        {/* Вкладка: Отзывы */}
        {activeTab === 'reviews' && (
          <div>
            {reviews.length === 0 ? (
              <div className="reviews-empty">
                <div className="reviews-empty__illustration">
                  <img src="/assets/img/profile/empty-reviews.png" alt="" />
                </div>
                <div className="reviews-empty__title">Отзывов пока нет</div>
                <div className="reviews-empty__text">
                  Здесь будут отображаться ваши отзывы на товары
                </div>
                <button
                  className="reviews-empty__btn"
                  onClick={() => router.push('/catalog')}
                >
                  Перейти к покупкам
                </button>
              </div>
            ) : (
              <ReviewList
                reviews={reviews}
                token={token}
                onDelete={handleDeleteReview}
              />
            )}
          </div>
        )}

      </div>

      {/* Секция рекомендаций (только при пустых состояниях) */}
      {((activeTab === 'awaiting' && availableProducts.length === 0) ||
        (activeTab === 'reviews'  && reviews.length === 0)) && (
        <Suspense fallback={null}>
          <NotFoundRecommendations />
        </Suspense>
      )}

      {/* Drawer с формой отзыва */}
      <ReviewDrawer
        open={drawerOpen}
        product={selectedProduct}
        token={token}
        onClose={closeDrawer}
        onSubmitted={handleReviewSubmitted}
      />

      {/* Модалка успеха */}
      <ReviewSuccessModal
        show={showSuccess}
        onClose={() => setShowSuccess(false)}
      />

      {/* Toast удаления */}
      {toast && (
        <div className="reviews-toast">
          <span>{toast.message}</span>
          <button className="reviews-toast__undo" onClick={toast.onUndo}>
            Отменить
          </button>
        </div>
      )}

    </div>
  );
}