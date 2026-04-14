// components/about/AboutMission.js

export default function AboutMission() {
  return (
    <section
      className="goclub mission"
      style={{ backgroundImage: 'url(/assets/img/about/missions.jpg)' }}
    >
      <div className="container">
        <div className="row">
          <div className="col-12">
            <div className="goclub-inner">
              <h2 className="the_blues">Наша миссия <span>сегодня</span></h2>
              <p>
                Помочь жителям Беларуси обустроить свой дом <strong>без лишних хлопот.</strong> Мы
                заботимся о каждой детали: от момента заказа до бережной доставки прямо к вашей
                двери.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}