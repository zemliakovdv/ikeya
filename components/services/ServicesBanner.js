// components/uslugi/ServicesBanner.js

export default function ServicesBanner() {
  return (
    <section className="uslugi-banner">
      <div className="container">
        <div className="row">
          <div className="col-12">
            <h1>Наши услуги: сборка мебели и многое другое</h1>
            <div className="uslugi-inner">
              <img src="/assets/img/uslugi/main_banner.jpg" alt="Наши услуги" />
            </div>
            <p>
              Выбирайте нужные опции при оформлении заказа, остальное мы возьмём на себя:
              найдём перевозчика, согласуем цену и организуем сборку без лишних хлопот.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}