// components/partner/PartnerUnique.js

export default function PartnerUnique() {
  return (
    <section className="unic">
      <div className="container">
        <div className="row">
          <div className="col-12">
            <div className="unic-inner">
              <div className="unic-text">
                <h2 className="the_blues">
                  Создавайте уникальные интерьеры <span>вместе с нами!</span>
                </h2>
                <p>
                  С ikeya.by вы получаете доступ к полному ассортименту IKEA в Европе и
                  дополнительные преимущества, которые сделают вашу работу ещё более выгодной.
                </p>
                <a href="#vstupit_v_klub" className="the_blue_button">Начать создавать!</a>
              </div>
              <div className="unic-banner">
                <img src="/assets/img/partner/unicalno.png" alt="Начать создавать!" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}