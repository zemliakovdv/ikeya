'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import ProfileLayout from '@/components/profile/ProfileLayout';
import ActiveOrders from '@/components/profile/ActiveOrders';
import OrderHistory from '@/components/profile/OrderHistory';
import { parseOrders } from '@/components/profile/Orders';
import PageLoader from '@/components/ui/PageLoader';
import { useAuth } from '@/contexts/AuthContext';
import { useCart } from '@/contexts/CartContext';
import { useAuthModals } from '@/components/auth/AuthModalsHost';
import { getOrderById, isProfileHistoryOrder, reorder } from '@/lib/api/account';

function decodeOrderId(value) {
  if (!value) return '';

  try {
    return decodeURIComponent(String(value));
  } catch {
    return String(value);
  }
}

function normalizeSingleOrderResponse(response) {
  const responseData = response?.data;

  if (Array.isArray(responseData)) {
    return parseOrders(response)[0] || null;
  }

  if (!responseData || typeof responseData !== 'object') {
    return null;
  }

  const normalizedResponse = {
    ...response,
    data: [responseData],
  };

  return parseOrders(normalizedResponse)[0] || null;
}

export default function OrderDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { isAuth, isHydrated } = useAuth();
  const { openLogin } = useAuthModals();
  const { refreshCart } = useCart();

  const rawOrderId = Array.isArray(params?.orderId)
    ? params.orderId[0]
    : params?.orderId;

  const orderId = useMemo(() => decodeOrderId(rawOrderId), [rawOrderId]);
  const orderPath = useMemo(
    () => (orderId ? `/profile/orders/${encodeURIComponent(orderId)}` : '/profile/orders'),
    [orderId]
  );

  const breadcrumbs = useMemo(
    () => [
      { label: 'Профиль', href: '/profile' },
      { label: 'Заказы', href: '/profile/orders' },
      { label: `Заказ № ${orderId || ''}`.trim(), href: null },
    ],
    [orderId]
  );

  const loginOpenedRef = useRef(false);
  const requestIdRef = useRef(0);

  const [loading, setLoading] = useState(true);
  const [order, setOrder] = useState(null);
  const [notFound, setNotFound] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!isHydrated) return;
    if (isAuth) {
      loginOpenedRef.current = false;
      return;
    }

    if (!loginOpenedRef.current) {
      loginOpenedRef.current = true;
      openLogin(orderPath);
      router.replace('/');
    }
  }, [isAuth, isHydrated, openLogin, orderPath, router]);

  const loadOrder = useCallback(async () => {
    if (!orderId) {
      setOrder(null);
      setError('');
      setNotFound(true);
      setLoading(false);
      return;
    }

    const requestId = requestIdRef.current + 1;
    requestIdRef.current = requestId;

    setLoading(true);
    setOrder(null);
    setNotFound(false);
    setError('');

    try {
      const response = await getOrderById(orderId);
      if (requestIdRef.current !== requestId) return;

      const nextOrder = normalizeSingleOrderResponse(response);
      if (!nextOrder) {
        setNotFound(true);
        return;
      }

      setOrder(nextOrder);
    } catch (err) {
      if (requestIdRef.current !== requestId) return;

      if (err?.status === 403 || err?.status === 404) {
        setNotFound(true);
      } else {
        setError('Не удалось загрузить заказ');
      }
    } finally {
      if (requestIdRef.current === requestId) {
        setLoading(false);
      }
    }
  }, [orderId]);

  useEffect(() => {
    if (!isHydrated || !isAuth) return;
    loadOrder();
  }, [isAuth, isHydrated, loadOrder]);

  const handleReorder = useCallback(async (repeatOrderId) => {
    try {
      const resp = await reorder(repeatOrderId);
      if (resp.has_missing) {
        alert(`Часть товаров недоступна: ${resp.missing_skus?.join(', ')}`);
      }
      await refreshCart();
      router.push('/cart');
    } catch (err) {
      alert(err.message || 'Не удалось повторить заказ');
    }
  }, [refreshCart, router]);

  if (!isHydrated || !isAuth || loading) {
    return <PageLoader />;
  }

  function renderNotFound() {
    return (
      <div className="orders-lists">
        <div className="empty" style={{ padding: '32px 0', textAlign: 'center' }}>
          <div className="empty-title">Заказ не найден</div>
          <button className="empty-btn" type="button" onClick={() => router.push('/profile/orders')}>
            Вернуться к заказам
          </button>
        </div>
      </div>
    );
  }

  function renderError() {
    return (
      <div className="orders-lists">
        <div className="empty" style={{ padding: '32px 0', textAlign: 'center' }}>
          <div className="empty-title">Не удалось загрузить заказ</div>
          <button className="empty-btn" type="button" onClick={loadOrder}>
            Повторить
          </button>
        </div>
      </div>
    );
  }

  function renderOrder() {
    if (!order) return renderNotFound();

    return (
      <div className="orders-lists">
        {isProfileHistoryOrder(order) ? (
          <OrderHistory
            orders={[order]}
            onReorder={handleReorder}
            showDateFilter={false}
          />
        ) : (
          <ActiveOrders orders={[order]} />
        )}
      </div>
    );
  }

  return (
    <ProfileLayout breadcrumbs={breadcrumbs}>
      {notFound ? renderNotFound() : error ? renderError() : renderOrder()}
    </ProfileLayout>
  );
}
