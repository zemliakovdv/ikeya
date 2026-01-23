// components/profile/EmptyState.js
'use client';

export default function EmptyState({ type }) {
  const states = {
    active: {
      image: '../assets/img/profile/empty-orders.svg',
      title: 'У вас пока нет актуальных заказов',
      text: 'Когда появятся, будут отображаться здесь. Остальные заказы находятся в истории заказов'
    },
    history: {
      image: '../assets/img/profile/empty-history.svg',
      title: 'У вас пока нет истории заказов',
      text: 'Когда появятся, будут отображаться здесь.'
    },
    purchases: {
      image: '../assets/img/profile/empty-buys.svg',
      title: 'Купленных товаров пока нет',
      text: 'Когда появятся, будут отображаться здесь.'
    }
  };

  const state = states[type] || states.active;

  return (
    <div className="empty">
      <div className="empty-illustration">
        <img src={state.image} alt={state.title} />
      </div>
      <div className="empty-title">{state.title}</div>
      <div className="empty-text">{state.text}</div>
      <button className="empty-btn" onClick={() => window.location.href = '/catalog'}>
        Перейти к покупкам
      </button>
    </div>
  );
}
