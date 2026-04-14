// components/about/AboutIdea.js

export default function AboutIdea() {
  return (
    <section className="unic from-idea">
      <div className="container">
        <div className="row">
          <div className="col-12">
            <div className="unic-inner">
              <div className="unic-text">
                <h2 className="the_blues"><span>От идеи</span> до воплощения</h2>
                <p>
                  Мы — команда IKEYA.BY.<br />
                  Всё началось с простой, но знакомой тысячам белорусов ситуации: как привезти
                  товары IKEA, если магазины так далеко? Мы сами ценим скандинавский дизайн и
                  функциональность, поэтому решили создать <strong>надёжный сервис</strong>,
                  который сделает IKEA <strong>доступной каждому.</strong>
                </p>
              </div>
              <div className="unic-banner">
                <img src="/assets/img/about/sofa.png" alt="От идеи до воплощения" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}