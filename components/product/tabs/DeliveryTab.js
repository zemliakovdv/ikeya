export default function DeliveryTab({ product }) {
  const attr = product.attributes;

  return (
    <div className="tab-pane fade show active">
      <div className="tab-delivery__content">
        
        {/* Заголовок */}
        <h5>Доставка</h5>
        
        {/* Самовывоз */}
        <p>
          Самовывоз <a href="#">со склада г. Минск</a>
        </p>
        
        {/* Услуги в Минске */}
        <div className="delivery-not__minsk">
          <h5>Услуги в г. Минск (+20 км от Минска)</h5>
          
          {/* Подъем и занос */}
          <div className="not-minsk__item">
            <p>Подъем и занос мебели</p>
            <p>от 75.00 р.</p>
          </div>
          
          {/* Сборка мебели */}
          <div className="not-minsk__item">
            <p>Сборка мебели</p>
            <p>от 50.00 р.</p>
          </div>
          
          {/* Информационное сообщение */}
          <p className="not-minsk__alert">
            Заявку на подъем и сборку мебели можно оставить в корзине
          </p>
        </div>
        
        {/* Дополнительная информация из API (если есть) */}
        {attr.delivery_name && (
          <div style={{ marginTop: '24px' }}>
            <h5>Информация о доставке товара</h5>
            <p><strong>{attr.delivery_name}</strong></p>
            {attr.delivery_cost && (
              <p>Стоимость: {attr.delivery_cost} р.</p>
            )}
            {attr.delivery_reason && (
              <p className="text-muted">{attr.delivery_reason}</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
