'use client';

import { useState, useEffect, useRef } from 'react';

import { buildApiUrl, buildAssetUrl } from '@/lib/config/api';

function parseImages(value) {
  if (Array.isArray(value)) return value;
  if (typeof value === 'string') {
    try { return JSON.parse(value); } catch { return []; }
  }
  return [];
}

function getImageSrc(product) {
  const localImages = parseImages(product?.local_images);
  if (localImages.length > 0) {
    return buildAssetUrl(localImages[0]);
  }
  const images = parseImages(product?.images);
  if (images.length > 0) {
    return images[0];
  }
  return '/assets/img/placeholder.png';
}

export default function ReviewDrawer({ open, product, token, onClose, onSubmitted }) {
  const [rating, setRating]       = useState(0);
  const [hoveredStar, setHoveredStar] = useState(0);
  const [body, setBody]           = useState('');
  const [photos, setPhotos]       = useState([]); // File[]
  const [previews, setPreviews]   = useState([]); // blob URLs
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors]       = useState({});
  const fileInputRef              = useRef(null);
  const drawerRef                 = useRef(null);

  // Устанавливаем начальный рейтинг если передан (клик по звезде в списке)
  useEffect(() => {
    if (open && product?.initialRating) {
      setRating(product.initialRating);
    }
  }, [open, product]);

  // Сброс формы при закрытии
  useEffect(() => {
    if (!open) {
      setRating(0);
      setHoveredStar(0);
      setBody('');
      setPhotos([]);
      setPreviews([]);
      setErrors({});
    }
  }, [open]);

  // Закрытие по Escape
  useEffect(() => {
    function handleKeyDown(e) {
      if (e.key === 'Escape') onClose();
    }
    if (open) document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [open, onClose]);

  // Блокируем скролл body при открытом дровере
  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  function handleFileChange(e) {
    const files = Array.from(e.target.files);
    addFiles(files);
  }

  function addFiles(files) {
    const allowed = ['image/jpeg', 'image/png', 'image/webp', 'image/avif', 'image/heic'];
    const maxSize = 5 * 1024 * 1024; // 5MB
    const valid = files.filter(f => allowed.includes(f.type) && f.size <= maxSize);
    const remaining = 5 - photos.length;
    const toAdd = valid.slice(0, remaining);

    setPhotos(prev => [...prev, ...toAdd]);
    setPreviews(prev => [
      ...prev,
      ...toAdd.map(f => URL.createObjectURL(f)),
    ]);
  }

  function removePhoto(idx) {
    URL.revokeObjectURL(previews[idx]);
    setPhotos(prev => prev.filter((_, i) => i !== idx));
    setPreviews(prev => prev.filter((_, i) => i !== idx));
  }

  function handleDrop(e) {
    e.preventDefault();
    const files = Array.from(e.dataTransfer.files);
    addFiles(files);
  }

  function validate() {
    const errs = {};
    if (!rating) errs.rating = 'Поставьте оценку';
    if (!body.trim()) errs.body = 'Напишите комментарий';
    return errs;
  }

  async function handleSubmit() {
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }

    setSubmitting(true);
    try {
      let res;

      if (photos.length > 0) {
        const formData = new FormData();
        formData.append('review[rating]', rating);
        formData.append('review[body]', body.trim());
        photos.forEach(photo => formData.append('review[photos][]', photo));
        res = await fetch(buildApiUrl(`/products/${product.sku}/reviews`), {
          method: 'POST',
          headers: { Authorization: `Bearer ${token}` },
          body: formData,
        });
      } else {
        res = await fetch(buildApiUrl(`/products/${product.sku}/reviews`), {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ review: { rating, body: body.trim() } }),
        });
      }

      if (!res.ok) {
        const json = await res.json().catch(() => ({}));
        const message = json.errors?.[0] || json.message || 'Не удалось отправить отзыв';
        throw new Error(message);
      }

      const json = await res.json();
      onSubmitted(json.data, product.sku);
    } catch (e) {
      setErrors({ submit: e.message });
    } finally {
      setSubmitting(false);
    }
  }

  if (!product) return null;

  const imageSrc = getImageSrc(product);
  const displayRating = hoveredStar || rating;

  return (
    <>
      {/* Backdrop */}
      {open && (
        <div
          className="review-drawer__backdrop"
          onClick={onClose}
        />
      )}

      {/* Drawer */}
      <div className={`review-drawer ${open ? 'review-drawer--open' : ''}`} ref={drawerRef}>

        {/* Шапка */}
        <div className="review-drawer__header">
          <h5 className="review-drawer__title" title={product.name}>
            {product.name}
          </h5>
          <button className="review-drawer__close" onClick={onClose} aria-label="Закрыть">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M18 6L6 18M6 6L18 18" stroke="#111827" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </button>
        </div>

        {/* Контент */}
        <div className="review-drawer__body">

          {/* Фото товара */}
          <div className="review-drawer__product-image">
            <img src={imageSrc} alt={product.name} width={120} height={120} />
          </div>

          {/* Оценка */}
          <div className="review-drawer__rating">
            <div className="review-drawer__rating-label">Оцените покупку</div>
            <div className="review-drawer__stars">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  className={`review-drawer__star ${displayRating >= star ? 'review-drawer__star--active' : ''}`}
                  onMouseEnter={() => setHoveredStar(star)}
                  onMouseLeave={() => setHoveredStar(0)}
                  onClick={() => {
                    setRating(star);
                    setErrors(prev => ({ ...prev, rating: null }));
                  }}
                  aria-label={`Оценить на ${star}`}
                >
                  <svg width="32" height="32" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M20.1484 25.6668C19.565 25.6668 18.83 25.4801 17.9084 24.9318L14.665 22.9951C14.3384 22.7968 13.685 22.7968 13.3467 22.9951L10.1034 24.9318C8.19003 26.0751 7.05837 25.6318 6.5567 25.2584C6.04337 24.8851 5.27337 23.9401 5.77503 21.7468L6.54503 18.3868C6.6267 18.0251 6.4517 17.4301 6.19503 17.1618L3.50003 14.4434C2.50837 13.4401 2.13503 12.3434 2.45003 11.3634C2.6367 10.7918 3.22003 9.80011 5.0867 9.48511L8.5517 8.90178C8.8667 8.84344 9.34503 8.49344 9.48503 8.20178L11.3984 4.34011C12.2734 2.57844 13.4167 2.32178 14.0117 2.32178C14.6067 2.32178 15.75 2.59011 16.6134 4.34011L18.5267 8.19011C18.6784 8.49344 19.145 8.84344 19.4717 8.90178L22.9367 9.48511C24.325 9.71844 25.2584 10.3834 25.5734 11.3751C25.76 11.9468 25.865 13.1018 24.5117 14.4551L21.8284 17.1618C21.5717 17.4301 21.3967 18.0251 21.4784 18.3984L22.2484 21.7468C22.75 23.9401 21.98 24.8851 21.4667 25.2584C21.21 25.4451 20.7784 25.6551 20.16 25.6551L20.1484 25.6668Z" fill={displayRating >= star ? '#FFC107' : '#E0E0E0'} />
                  </svg>
                </button>
              ))}
            </div>
            {errors.rating && (
              <div className="review-drawer__error">{errors.rating}</div>
            )}
          </div>

          {/* Комментарий */}
          <div className="review-drawer__field">
            <textarea
              className={`review-drawer__textarea ${errors.body ? 'review-drawer__textarea--error' : ''}`}
              placeholder="Комментарий"
              value={body}
              rows={4}
              onChange={e => {
                setBody(e.target.value);
                setErrors(prev => ({ ...prev, body: null }));
              }}
            />
            {errors.body && (
              <div className="review-drawer__error">{errors.body}</div>
            )}
            <div className="review-drawer__hint">
              Ваш подробный ответ поможет другим покупателям сделать верный выбор
            </div>
          </div>

          {/* Загрузка фото */}
          <div className="review-drawer__field">
            <div className="review-drawer__upload-label">
              Загрузите до 5 фото
            </div>

            {/* Превью загруженных фото */}
            {previews.length > 0 && (
              <div className="review-drawer__previews">
                {previews.map((src, idx) => (
                  <div key={idx} className="review-drawer__preview">
                    <img src={src} alt={`Фото ${idx + 1}`} />
                    <button
                      className="review-drawer__preview-remove"
                      onClick={() => removePhoto(idx)}
                      aria-label="Удалить фото"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Зона загрузки */}
            {photos.length < 5 && (
              <div
                className="review-drawer__dropzone"
                onDrop={handleDrop}
                onDragOver={e => e.preventDefault()}
                onClick={() => fileInputRef.current?.click()}
              >
                <div className="review-drawer__dropzone-hint">
                  Файл должен быть в формате .avif, .heic, .webp, .jpeg или .png (до 5 мб)
                </div>
                <button
                  type="button"
                  className="review-drawer__upload-btn"
                  onClick={e => {
                    e.stopPropagation();
                    fileInputRef.current?.click();
                  }}
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M21 15V19C21 20.1 20.1 21 19 21H5C3.9 21 3 20.1 3 19V15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                    <path d="M17 8L12 3L7 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M12 3V15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                  </svg>
                  Загрузите файл
                </button>
                <span className="review-drawer__dropzone-or">или перетащите сюда</span>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".avif,.heic,.webp,.jpeg,.jpg,.png"
                  multiple
                  style={{ display: 'none' }}
                  onChange={handleFileChange}
                />
              </div>
            )}
          </div>

          {/* Ошибка сабмита */}
          {errors.submit && (
            <div className="review-drawer__error review-drawer__error--submit">
              {errors.submit}
            </div>
          )}

        </div>

        {/* Футер с кнопкой */}
        <div className="review-drawer__footer">
          <button
            className="review-drawer__submit"
            onClick={handleSubmit}
            disabled={submitting}
          >
            {submitting ? 'Отправляем…' : 'Опубликовать отзыв'}
          </button>
        </div>

      </div>
    </>
  );
}