'use client';

import Link from 'next/link';
import { useState } from 'react';
import CookieSettingsModal from '@/components/cookie/CookieSettingsModal';

const STORAGE_KEY = 'ikeya_cookie_consent';

const LEGAL_TEXT = [
  'Общество с ограниченной ответственностью «БелкаБокс», 220019, г. Минск, ул. Сухаревская, д.16, пом. 6, УНП 193748031, р/с BY25MTBK30120001093300124557 в ЗАО «МТБанк», БИК MTBKBY22, тел: +375 44 579 44 44',
  'Режим работы интернет-магазина: круглосуточно, без выходных.',
  'Дата включения сведений об интернет-магазине в Торговый реестр Республики Беларусь --.--.----, № регистрации ------',
  'Номера городских телефонов уполномоченных по защите прав потребителей: +375 (17) 270-35-26 – Минский районный исполнительный комитет, +375 (17) 328-53-54 – главное управление торговли и услуг Миноблисполкома',
];

export default function Footer({ categoryLinks = [] }) {
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

  const catalogList = (
    <ul>
      {categoryLinks.map((cat) => (
        <li key={cat.href}><Link href={cat.href}>{cat.name}</Link></li>
      ))}
      <li><a href="/catalog">Все категории</a></li>
    </ul>
  );

  return (
    <footer>

      {/* ===== ДЕСКТОП (≥992px) ===== */}
      <div className="footer d-none d-xl-block" aria-hidden="false">
        <div className="container">
          <div className="row">
            <div className="col-12">
              <div className="footer-inner">
                <div className="footer-top">
                  <div className="footer-links">
                    <a href="/" className="footer-logo">
                      <img src="/assets/img/logo.svg" alt="Логотип" width="163" height="40" />
                    </a>
                    <p>Мы в социальных сетях:</p>
                    <div className="footer-links__social">
                      <a href="https://www.instagram.com/shopbyshop_by"><img src="/assets/img/icons/instagram.svg" alt="Instagram" width="40" height="40" /></a>
                      <a href="https://t.me/ShopByShopBelarus"><img src="/assets/img/icons/tg.svg" alt="Telegram" width="40" height="40" /></a>
                    </div>
                  </div>
                  <div className="footer-navigation">
                    <div className="footer-navigation-list">
                      <h5>Всё о IKEYA</h5>
                      <ul>
                        <li><a href="/about">О компании</a></li>
                        <li><a href="/blog">Советы и идеи</a></li>
                        <li><a href="/pvz">Пункты выдачи</a></li>
                        <li><a href="#">Контакты</a></li>
                        <li><a href="/help">Помощь</a></li>
                      </ul>
                    </div>
                    <div className="footer-navigation-list">
                      <h5>Каталог</h5>
                      {catalogList}
                    </div>
                    <div className="footer-navigation-list">
                      <h5>Покупателям</h5>
                      <ul>
                        <li><a href="/help/how-to-order">Как сделать заказ</a></li>
                        <li><a href="/help/delivery">Доставка</a></li>
                        <li><a href="/help/payment">Оплата</a></li>
                        <li><a href="/help/personal-data-consent-ikeya-by/">Правовая информация</a></li>
                        <li>
                          <button type="button" className="footer-cookie-btn" onClick={openCookieModal}>
                            Настройка cookie
                          </button>
                        </li>
                        <li><a href="/help/user-agreement-ikeya-service/">Политика конфиденциальности</a></li>
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
      <div className="footer-mobile d-xl-none" aria-hidden="false">
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
                                <li><a href="/about">О компании</a></li>
                                <li><a href="/blog">Советы и идеи</a></li>
                                <li><a href="/pvz">Пункты выдачи</a></li>
                                <li><a href="#">Контакты</a></li>
                                <li><a href="/help">Помощь</a></li>
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
                              {catalogList}
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
                                <li><a href="/help/how-to-order">Как сделать заказ</a></li>
                                <li><a href="/help/delivery">Доставка</a></li>
                                <li><a href="/help/payment">Оплата</a></li>
                                <li><a href="/help/personal-data-consent-ikeya-by/">Правовая информация</a></li>
                                <li>
                                  <button type="button" className="footer-cookie-btn" onClick={openCookieModal}>
                                    Настройка cookie
                                  </button>
                                </li>
                                <li><a href="/help/user-agreement-ikeya-service/">Политика конфиденциальности</a></li>
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
                        <a href="https://www.instagram.com/shopbyshop_by"><img src="/assets/img/icons/instagram.svg" alt="Instagram" width="40" height="40" /></a>
                        <a href="https://t.me/ShopByShopBelarus"><img src="/assets/img/icons/tg.svg" alt="Telegram" width="40" height="40" /></a>
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