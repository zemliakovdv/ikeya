import Link from 'next/link';

export default function DeliveryTab({ showMinskServices = true }) {
  return (
    <div className="tab-delivery__content">
      <h5>Доставка</h5>
      <p>Самовывоз <Link href="#">со склада г. Минск</Link></p>

      {showMinskServices && (
        <div className="delivery-not__minsk">
          <h5>Услуги в г. Минск (+20 км от Минска)</h5>

          <div className="not-minsk__item">
            <p>Подъем и занос мебели </p>
            <p>от 75.00 р.</p>
          </div>
          <div className="not-minsk__item">
            <p>Сборка мебели</p>
            <p>от 50.00 р.</p>
          </div>

          <Link href="#">Планирование кухни и корпусной мебели</Link>

          <p className="not-minsk__alert">
            Заявку на подъем и сборку мебели можно оставить в корзине
          </p>
        </div>
      )}
    </div>
  );
}
