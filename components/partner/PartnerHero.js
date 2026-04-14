// components/partner/PartnerHero.js

export default function PartnerHero() {
  return (
    <section
      className="partner-start"
      style={{ backgroundImage: 'url(/assets/img/partner/hero_bg.jpg)' }}
    >
      <div className="container">
        <div className="row">
          <div className="col-12">
            <div className="partner-start_inner">
              <h1>
                Дизайн-клуб IKEYA —{' '}
                <span>новые возможности для дизайнеров</span>
              </h1>
              <a href="#vstupit_v_klub" className="the_blue_button">
                Вступить в клуб
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}