'use client';

import { useEffect, useRef, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import styles from './Unsubscribe.module.css';

const MODAL_CONTENT = {
  success: {
    title: 'Вы отписались от рассылки',
    message: 'Мы исключили Вас из рассылки, но будем очень скучать!',
    variantClass: styles.modalSuccess,
  },
  already: {
    title: 'Вы уже отписаны',
    message: 'Вы уже отписаны от рекламной рассылки. Но мы всё равно будем скучать!',
    variantClass: styles.modalNeutral,
  },
  invalid: {
    title: 'Не удалось выполнить отписку',
    message: 'Ссылка для отписки недействительна. Возможно, она устарела или была повреждена.',
    variantClass: styles.modalError,
  },
  service_error: {
    title: 'Сервис временно недоступен',
    message: 'Не удалось выполнить отписку. Попробуйте открыть ссылку из письма позже.',
    variantClass: styles.modalError,
  },
};

export default function UnsubscribeResultModal() {
  const searchParams = useSearchParams();
  const [status, setStatus] = useState(null);
  const confirmButtonRef = useRef(null);
  const previousOverflowRef = useRef('');

  useEffect(() => {
    const unsubscribeStatus = searchParams.get('unsubscribe');

    if (!MODAL_CONTENT[unsubscribeStatus]) return;

    setStatus(unsubscribeStatus);

    const url = new URL(window.location.href);
    url.searchParams.delete('unsubscribe');
    window.history.replaceState(
      null,
      '',
      `${url.pathname}${url.search}${url.hash}`
    );
  }, [searchParams]);

  useEffect(() => {
    if (!status) return undefined;

    previousOverflowRef.current = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    confirmButtonRef.current?.focus();

    function handleKeyDown(event) {
      if (event.key === 'Escape') {
        setStatus(null);
      }
    }

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = previousOverflowRef.current;
    };
  }, [status]);

  if (!status) return null;

  const content = MODAL_CONTENT[status];

  return (
    <div className={styles.backdrop}>
      <div
        className={`${styles.modal} ${content.variantClass}`}
        role="dialog"
        aria-modal="true"
        aria-labelledby="unsubscribe-modal-title"
      >
        <button
          type="button"
          className={styles.closeButton}
          aria-label="Закрыть"
          onClick={() => setStatus(null)}
        >
          <span aria-hidden="true">×</span>
        </button>

        <svg
          className={styles.icon}
          viewBox="0 0 96 96"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          <circle cx="48" cy="48" r="40" fill="currentColor" opacity="0.12" />
          <circle cx="34" cy="40" r="5" fill="currentColor" />
          <circle cx="62" cy="40" r="5" fill="currentColor" />
          <path
            d="M32 66C39 57.5 57 57.5 64 66"
            stroke="currentColor"
            strokeWidth="5"
            strokeLinecap="round"
          />
        </svg>

        <h2 id="unsubscribe-modal-title" className={styles.title}>
          {content.title}
        </h2>
        <p className={styles.message}>{content.message}</p>

        <div className={styles.actions}>
          <button
            ref={confirmButtonRef}
            type="button"
            className={styles.button}
            onClick={() => setStatus(null)}
          >
            Хорошо
          </button>
        </div>
      </div>
    </div>
  );
}
