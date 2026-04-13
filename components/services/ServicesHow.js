// components/services/ServicesHow.js

const STEPS = [
  { num: 1, text: <><strong>Выберите услуги</strong> при оформлении заказа: доставка, подъём до двери, сборка.</> },
  { num: 2, text: <><strong>Менеджер связывается</strong> с вами, уточняет детали (адрес, этаж, лифт, состав заказа).</> },
  { num: 3, text: <><strong>Согласуем стоимость</strong> с перевозчиком/грузчиками/мастером и подтверждаем время.</> },
  { num: 4, text: <><strong>Доставка и работы</strong> в согласованный день.</> },
  { num: 5, text: <><strong>Оплата по факту</strong> совершения работ.</> },
];

export default function ServicesHow() {
  return (
    <section className="uslugi-how">
      <div className="container">
        <div className="row">
          <div className="col-12">
            <div className="uslugi-how_inner">
              <div className="how-inner_left">
                <h2>Как это работает</h2>
                <div className="how-inner_poinst">
                  {STEPS.map((step) => (
                    <div key={step.num} className="how-poinst__item">
                      <span>{step.num}</span>
                      <p>{step.text}</p>
                    </div>
                  ))}
                </div>
              </div>
              <img src="/assets/img/uslugi/divan.png" alt="Сборка мебели" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}