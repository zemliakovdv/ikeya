// components/partner/PartnerJoinClub.js

export default function PartnerJoinClub() {
  return (
    <section
      className="goclub"
      style={{ backgroundImage: 'url(/assets/img/partner/go_club.jpg)' }}
    >
      <div className="container">
        <div className="row">
          <div className="col-12">
            <div className="goclub-inner">
              <h2 className="the_blues">
                <span>Вступайте</span> в Дизайн-клуб IKEYA
              </h2>
              <p><strong>Вы получаете вознаграждение за покупки клиентов!</strong></p>
              <p>
                Важно: вознаграждение начисляется только за заказы, оформленные после даты
                регистрации в Дизайн-клубе.
              </p>
              <a href="#vstupit_v_klub" className="the_blue_button">Вступить в клуб</a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}