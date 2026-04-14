// components/about/AboutSecurity.js

const CARDS = [
  {
    image: '/assets/img/about/security_1.png',
    alt: 'Безопасность',
    text: <>Все платежи проходят <strong>официально</strong> через белорусские банки.</>,
  },
  {
    image: '/assets/img/about/security_2.png',
    alt: 'Доставка',
    text: <>Заказы доставляются через <strong>«Европочту».</strong></>,
  },
  {
    image: '/assets/img/about/security_3.png',
    alt: 'Законодательство',
    text: <>Мы работаем строго в рамках <strong>законодательства РБ (Указ №297)</strong>, что гарантирует юридическую чистоту каждой поставки.</>,
  },
];

export default function AboutSecurity() {
  return (
    <section className="shag secures">
      <div className="container">
        <div className="row">
          <div className="col-12">
            <h2 className="the_blues">Безопасность <span>и прозрачность</span></h2>
            <div className="shag-list">
              {CARDS.map((card) => (
                <div key={card.alt} className="shag-list-card">
                  <img src={card.image} alt={card.alt} />
                  <p>{card.text}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}