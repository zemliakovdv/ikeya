'use client';

import Link from 'next/link';
import { useState } from 'react';
import CookieSettingsModal from '@/components/cookie/CookieSettingsModal';

const STORAGE_KEY = 'ikeya_cookie_consent';

const LEGAL_TEXT = [
  'ПТЧУП «В2В Авто», УНП: 690542762, Р/с: BY09UNBS30120154200000015933, БИК UNBSBY2X ЗАО «БСБ Банк», г. Минск, пр. Победителей, 23, корп. 4, 223017 агрогор.Гатово, ул.Металлургическая, 3-4 Директор — Есьман Е.Е.',
  'Режим работы интернет-магазина: круглосуточно, без выходных.',
  'Дата включения сведений об интернет-магазине в Торговый реестр Республики Беларусь --.--.----, № регистрации ------',
  'Номера городских телефонов уполномоченных по защите прав потребителей: +375 (17) 270-35-26 – Минский районный исполнительный комитет, +375 (17) 328-53-54 – главное управление торговли и услуг Миноблисполкома',
];

export default function Footer() {
  const [modalOpen, setModalOpen] = useState(false);
  const [savedPrefs, setSavedPrefs] = useState(null);

  const saveConsent = (prefs) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(prefs));
    } catch {}
    setModalOpen(false);
  };

  const handleReject = () => {
    saveConsent({ technical: true, analytics: false, advertising: false });
  };

  const openCookieModal = () => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      setSavedPrefs(saved ? JSON.parse(saved) : { technical: true, analytics: false, advertising: false });
    } catch {
      setSavedPrefs({ technical: true, analytics: false, advertising: false });
    }
    setModalOpen(true);
  };

  return (
    <footer>

      {/* ===== ДЕСКТОП (≥992px) ===== */}
      <div className="footer d-none d-lg-block" aria-hidden="false">
        <div className="container">
          <div className="row">
            <div className="col-12">
              <div className="footer-inner">
                <div className="footer-top">
                  <div className="footer-links">
                    <Link href="#" className="footer-logo">
                      <img src="/assets/img/logo.svg" alt="Логотип" />
                    </Link>
                    <p>Мы в социальных сетях:</p>
                    <div className="footer-links__social">
                      <a href="#"><img src="/assets/img/icons/tg.svg" alt="Telegram" /></a>
                      <a href="#"><img src="/assets/img/icons/tik-tok.svg" alt="TikTok" /></a>
                      <a href="#"><img src="/assets/img/icons/instagram.svg" alt="Instagram" /></a>
                    </div>
                  </div>
                  <div className="footer-navigation">
                    <div className="footer-navigation-list">
                      <h5>Всё о IKEYA</h5>
                      <ul>
                        <li><Link href="/about">О компании</Link></li>
                        <li><Link href="/blog">Советы и идеи</Link></li>
                        <li><Link href="/pvz">Пункты выдачи</Link></li>
                        <li><Link href="#">Контакты</Link></li>
                      </ul>
                    </div>
                    <div className="footer-navigation-list">
                      <h5>Каталог</h5>
                      <ul>
                        <li><Link href="#">Коллекции</Link></li>
                        <li><Link href="#">Диваны и кресла</Link></li>
                        <li><Link href="#">Текстиль</Link></li>
                        <li><Link href="#">Украшения</Link></li>
                        <li><Link href="#">Освещение</Link></li>
                        <li><Link href="/catalog">Все категории</Link></li>
                      </ul>
                    </div>
                    <div className="footer-navigation-list">
                      <h5>Покупателям</h5>
                      <ul>
                        <li><Link href="#">Как сделать заказ</Link></li>
                        <li><Link href="#">Доставка</Link></li>
                        <li><Link href="#">Оплата</Link></li>
                        <li><Link href="#">Правовая информация</Link></li>
                        <li>
                          <button type="button" className="footer-cookie-btn" onClick={openCookieModal}>
                            Настройка cookie
                          </button>
                        </li>
                        <li><Link href="#">Политика конфиденциальности</Link></li>
                      </ul>
                    </div>
                  </div>
                  <div className="footer-payment">
                    <h5>Платежные системы</h5>
                    <img src="/assets/img/icons/payments.svg" alt="Платежные системы" />
                  </div>
                </div>
                <div className="footer-bottom">
                  {LEGAL_TEXT.map((text, i) => <p key={i}>{text}</p>)}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ===== МОБИЛЬНЫЙ (<992px) ===== */}
      <div className="footer-mobile d-lg-none" aria-hidden="false">
        <div className="container">
          <div className="row">
            <div className="col-12">
              <div className="footer-inner">
                <div className="footer-top">
                  <div className="footer-navigation">
                    <div className="footer-navigation-accord">
                      <div className="accordion accordion-flush" id="footerAccordion">
                        <div className="accordion-item">
                          <h2 className="accordion-header">
                            <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#footerCollapseOne" aria-expanded="false" aria-controls="footerCollapseOne">
                              Всё о IKEYA
                            </button>
                          </h2>
                          <div id="footerCollapseOne" className="accordion-collapse collapse" data-bs-parent="#footerAccordion">
                            <div className="accordion-body">
                              <ul>
                                <li><Link href="/about">О компании</Link></li>
                                <li><Link href="/blog">Советы и идеи</Link></li>
                                <li><Link href="/pvz">Пункты выдачи</Link></li>
                                <li><Link href="#">Контакты</Link></li>
                              </ul>
                            </div>
                          </div>
                        </div>
                        <div className="accordion-item">
                          <h2 className="accordion-header">
                            <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#footerCollapseTwo" aria-expanded="false" aria-controls="footerCollapseTwo">
                              Каталог
                            </button>
                          </h2>
                          <div id="footerCollapseTwo" className="accordion-collapse collapse" data-bs-parent="#footerAccordion">
                            <div className="accordion-body">
                              <ul>
                                <li><Link href="#">Коллекции</Link></li>
                                <li><Link href="#">Диваны и кресла</Link></li>
                                <li><Link href="#">Текстиль</Link></li>
                                <li><Link href="#">Украшения</Link></li>
                                <li><Link href="#">Освещение</Link></li>
                                <li><Link href="/catalog">Все категории</Link></li>
                              </ul>
                            </div>
                          </div>
                        </div>
                        <div className="accordion-item">
                          <h2 className="accordion-header">
                            <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#footerCollapseThree" aria-expanded="false" aria-controls="footerCollapseThree">
                              Покупателям
                            </button>
                          </h2>
                          <div id="footerCollapseThree" className="accordion-collapse collapse" data-bs-parent="#footerAccordion">
                            <div className="accordion-body">
                              <ul>
                                <li><Link href="#">Как сделать заказ</Link></li>
                                <li><Link href="#">Доставка</Link></li>
                                <li><Link href="#">Оплата</Link></li>
                                <li><Link href="#">Правовая информация</Link></li>
                                <li>
                                  <button type="button" className="footer-cookie-btn" onClick={openCookieModal}>
                                    Настройка cookie
                                  </button>
                                </li>
                                <li><Link href="#">Политика конфиденциальности</Link></li>
                              </ul>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="footer-links">
                    <div className="footer-sociai-inner">
                      <p>Мы в социальных сетях:</p>
                      <div className="footer-links__social">
                        <a href="#"><img src="/assets/img/icons/tg.svg" alt="Telegram" /></a>
                        <a href="#"><img src="/assets/img/icons/tik-tok.svg" alt="TikTok" /></a>
                        <a href="#"><img src="/assets/img/icons/instagram.svg" alt="Instagram" /></a>
                      </div>
                    </div>
                    <div className="footer-payment">
                      <h5>Платежные системы</h5>
                      <img src="/assets/img/icons/payments.svg" alt="Платежные системы" />
                    </div>
                  </div>
                </div>
                <div className="footer-bottom">
                  {LEGAL_TEXT.map((text, i) => <p key={i}>{text}</p>)}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {modalOpen && (
        <CookieSettingsModal
          initialPrefs={savedPrefs}
          onSave={saveConsent}
          onReject={handleReject}
          onClose={() => setModalOpen(false)}
        />
      )}
    </footer>
  );
}