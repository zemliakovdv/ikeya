// components/about/AboutPartner.js

const STATS = [
  {
    title: <>8+ <span>лет</span></>,
    desc: 'более 8 лет работает на рынке',
  },
  {
    title: <>300 000+ <span>заказов</span></>,
    desc: 'более 300 000 заказов доставлено — опыт, проверенный временем',
  },
  {
    title: <>50 000+ <span>клиентов</span></>,
    desc: 'свыше 50 000 клиентов — доказательство доверия и качества',
  },
];

export default function AboutPartner() {
  return (
    <section className="belka">
      <div className="container">
        <div className="row">
          <div className="col-12">
            <div className="belka-inner">
              <h2 className="the_blues">
                <span>Надёжный партнёр</span> «Голубая Белка»
              </h2>
              <p className="belka-description">
                За каждой нашей доставкой стоит <strong>опытная</strong> логистическая компания «Голубая Белка»
              </p>
              <div className="belka-characters">
                {STATS.map((stat, index) => (
                  <div key={index} className="belka-item">
                    <p className="belka-item-title">{stat.title}</p>
                    <p className="belka-item-desc">{stat.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
      <div
        className="belka-banner"
        style={{ backgroundImage: 'url(/assets/img/about/belka.jpg)' }}
      />
    </section>
  );
}