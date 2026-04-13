// components/services/ServicesCosts.js

const TARIFFS = [
  {
    title: 'Стандартные услуги',
    price: <><span>10% </span>от стоимости товара</>,
    description: 'Например, если шкаф стоит 500 рублей, то сборка обойдётся в 50 рублей.',
  },
  {
    title: 'Минимальная стоимость',
    price: <><span>35 </span>рублей</>,
    description: 'Если стоимость сборки по тарифу 10% меньше 35 рублей, то минимальная стоимость услуги будет 35 рублей.',
  },
  {
    title: 'Крупногабаритные предметы',
    price: 'Индивидуально',
    description: 'Сборка кухонь, гардеробов PAX (это одна из самых популярных модульных систем гардеробов от IKEA) и других сложных систем обсуждается индивидуально.',
  },
];

export default function ServicesCosts() {
  return (
    <section className="uslugi-costs">
      <div className="container">
        <div className="row">
          <div className="col-12">
            <div className="uslugi-costs_inner">
              <h2>Стоимость сборки</h2>
              <div className="uslugi-tarifs">
                {TARIFFS.map((tariff) => (
                  <div key={tariff.title} className="uslugi-tarifs_point">
                    <div className="tarifs-point_top">
                      <p>{tariff.title}</p>
                    </div>
                    <div className="tarifs-point_bottom">
                      <p>{tariff.price}</p>
                      <p>{tariff.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}