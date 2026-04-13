// components/services/ServicesInfo.js

export default function ServicesInfo() {
  return (
    <section className="uslugi-ifrorm">
      <div className="container">
        <div className="row">
          <div className="col-12">
            <div className="uslugi-ifrorm_inner">
              <div className="uslugi-ifrorm_item">
                <h2>Доставка</h2>
                <p>
                  Мы подбираем проверенного перевозчика, согласуем стоимость с вами и
                  организуем доставку в удобное время.{' '}
                  <strong>Оплата — напрямую службе доставки</strong> по факту получения заказа.
                  Доставка формируется{' '}
                  <strong>по Минску и в радиусе 25 км от Мкада.</strong>
                </p>
              </div>
              <div className="uslugi-ifrorm_item">
                <h2>Подъём до двери (грузчики)</h2>
                <p>
                  Нужен подъём на этаж/до квартиры? Отметьте услугу при оформлении, и
                  мы подберём грузчиков. Менеджер уточнит детали и согласует
                  стоимость, <strong>оплата — по факту подъёма.</strong>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}