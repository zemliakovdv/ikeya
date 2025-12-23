import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="row">
          <div className="col-12">
            <div className="footer-inner">
              <div className="footer-top">
                <div className="footer-links">
                  <Link href="/" className="footer-logo">
                    <img src="/assets/img/logo.svg" alt="Логотип" />
                  </Link>
                  <p>Мы в социальных сетях:</p>
                  <div className="footer-links__social">
                    <a href="#"><img src="/assets/img/icons/telegram.svg" alt="Telegram" /></a>
                    <a href="#"><img src="/assets/img/icons/tik-tok.svg" alt="TikTok" /></a>
                    <a href="#"><img src="/assets/img/icons/instagram.svg" alt="Instagram" /></a>
                  </div>
                </div>
                <div className="footer-navigation">
                  <div className="footer-navigation-list">
                    <h5>Всё о IKEYA</h5>
                    <ul>
                      <li><a href="#">О компании</a></li>
                      <li><a href="#">Советы и идеи</a></li>
                      <li><a href="#">Пункты выдачи</a></li>
                      <li><a href="#">Контакты</a></li>
                    </ul>
                  </div>
                  <div className="footer-navigation-list">
                    <h5>Каталог</h5>
                    <ul>
                      <li><a href="#">Коллекции</a></li>
                      <li><a href="#">Диваны и кресла</a></li>
                      <li><a href="#">Текстиль</a></li>
                      <li><a href="#">Украшения</a></li>
                      <li><a href="#">Освещение</a></li>
                      <li><a href="#">Все категории</a></li>
                    </ul>
                  </div>
                  <div className="footer-navigation-list">
                    <h5>Покупателям</h5>
                    <ul>
                      <li><a href="#">Как сделать заказ</a></li>
                      <li><a href="#">Доставка</a></li>
                      <li><a href="#">Оплата</a></li>
                      <li><a href="#">Правовая информация</a></li>
                      <li><a href="#">Настройка cookie</a></li>
                      <li><a href="#">Политика конфиденциальности</a></li>
                    </ul>
                  </div>
                </div>
                <div className="footer-payment">
                  <h5>Платежные системы</h5>
                  <img src="/assets/img/icons/payments.svg" alt="Платежные системы" />
                </div>
              </div>
              <div className="footer-bottom">
                <p>ПТЧУП «В2В Авто», УНП: 690542762, Р/с: BY09UNBS30120154200000015933, БИК UNBSBY2X ЗАО
                «БСБ Банк», г. Минск, пр. Победителей, 23, корп. 4,
                223017 агрогор.Гатово , ул.Металлургическая, 3-4 Директор -Есьман Е.Е.</p>
                <p>Режим работы интернет-магазина: круглосуточно, без выходных.</p>
                <p>Дата включения сведений об интернет-магазине в Торговый реестр Республики Беларусь
                --.--.----, № регистрации ------</p>
                <p>Номера городских телефонов уполномоченных по защите прав потребителей: +375 (17)
                270-35-26 – Минский районный исполнительный комитет, +375 (17) 328-53-54 – главное
                управление торговли и услуг Миноблисполкома</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
