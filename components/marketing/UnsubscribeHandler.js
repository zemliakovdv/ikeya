'use client';

import { useEffect, useRef } from 'react';
import { useSearchParams } from 'next/navigation';
import styles from './Unsubscribe.module.css';

function getRedirectStatus(response, payload) {
  if (response?.status === 422 || payload?.status === 'invalid_token') {
    return 'invalid';
  }

  if (!response?.ok) {
    return 'service_error';
  }

  if (payload?.success === true && payload?.status === 'unsubscribed') {
    return 'success';
  }

  if (payload?.success === true && payload?.status === 'already_unsubscribed') {
    return 'already';
  }

  return 'service_error';
}

async function parseJsonSafely(response) {
  try {
    const text = await response.text();
    if (!text) return null;
    return JSON.parse(text);
  } catch {
    return null;
  }
}

function redirectToHome(status) {
  window.location.replace(`/?unsubscribe=${status}`);
}

export default function UnsubscribeHandler() {
  const searchParams = useSearchParams();
  const requestStartedRef = useRef(false);

  useEffect(() => {
    if (requestStartedRef.current) return;
    requestStartedRef.current = true;

    const token = searchParams.get('token');

    if (token) {
      const url = new URL(window.location.href);
      url.searchParams.delete('token');
      window.history.replaceState(
        null,
        '',
        `${url.pathname}${url.search}${url.hash}`
      );
    }

    if (!token) {
      redirectToHome('invalid');
      return;
    }

    async function unsubscribe() {
      try {
        const response = await fetch('/api/v1/marketing/unsubscribe', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
          },
          credentials: 'omit',
          cache: 'no-store',
          body: JSON.stringify({ token }),
        });

        const payload = await parseJsonSafely(response);
        redirectToHome(getRedirectStatus(response, payload));
      } catch {
        redirectToHome('service_error');
      }
    }

    unsubscribe();
  }, [searchParams]);

  return (
    <main className={styles.loadingPage}>
      <section className={styles.loadingCard} aria-live="polite" aria-busy="true">
        <div className={styles.spinner} aria-hidden="true" />
        <h1 className={styles.title}>Обрабатываем запрос</h1>
        <p className={styles.message}>Пожалуйста, подождите…</p>
      </section>
    </main>
  );
}
