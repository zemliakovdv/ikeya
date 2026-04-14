// components/partner/PartnerBenefits.js

const CARDS = [
  {
    image: '/assets/img/partner/vygoda_1.png',
    title: 'Специальные условия',
    description: 'Мы ценим ваше творчество и делаем всё, чтобы работа с нами была максимально выгодной.',
  },
  {
    image: '/assets/img/partner/vygoda_2.png',
    title: 'Надёжная логистика',
    description: 'Доставка в срок и с заботой о каждом заказе.',
  },
  {
    image: '/assets/img/partner/vygoda_3.png',
    title: 'Совместное продвижение',
    description: 'Мы делимся вашими проектами на нашем сайте и в соцсетях.',
  },
];

export default function PartnerBenefits() {
  return (
    <section className="vygoda">
      <div className="container">
        <div className="row">
          <div className="col-12">
            <div className="vygoda-inner">
              <h2 className="the_blues">
                Для вашего бизнеса — <span>больше выгоды</span>
              </h2>
              <div className="vygoda-list">
                {CARDS.map((card) => (
                  <div key={card.title} className="vygoda-list-card">
                    <img src={card.image} alt={card.title} />
                    <p className="vygoda-card-title">{card.title}</p>
                    <p className="vygoda-card-description">{card.description}</p>
                    <a href="#vstupit_v_klub" className="the_blue_button">Вступить в клуб</a>
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