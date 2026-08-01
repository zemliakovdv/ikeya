// components/about/AboutHero.js

export default function AboutHero() {
  return (
    <section
      className="partner-start about-start"
      style={{ backgroundImage: 'url(/assets/img/about/banner_hero.png)' }}
    >
      <div className="container">
        <div className="row">
          <div className="col-12">
            <div className="partner-start_inner">
              <h1>
                Ikeya.by <span>— из мечты об интерьере в реальность</span>
              </h1>
              <p>От мебели до мелочей для уюта — всё, что делает дом настоящим.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}