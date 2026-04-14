// components/partner/PartnerSteps.js

const CARDS = [
  {
    image: '/assets/img/partner/shag_1.png',
    alt: 'Идеи',
    text: 'Воплощайте самые смелые идеи без ограничений.',
  },
  {
    image: '/assets/img/partner/shag_2.png',
    alt: 'Заработок',
    text: 'Зарабатывайте вместе с нами.',
  },
  {
    image: '/assets/img/partner/shag_3.png',
    alt: 'Сообщество',
    text: 'Станьте частью сообщества дизайнеров IKEYA.',
  },
];

export default function PartnerSteps() {
  return (
    <section className="shag">
      <div className="container">
        <div className="row">
          <div className="col-12">
            <h2 className="the_blues">
              <span>Сделайте шаг</span> к новым возможностям
            </h2>
            <div className="shag-list">
              {CARDS.map((card) => (
                <div key={card.alt} className="shag-list-card">
                  <img src={card.image} alt={card.alt} />
                  <p>{card.text}</p>
                  <a href="#vstupit_v_klub" className="the_blue_button">Вступить в клуб</a>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}