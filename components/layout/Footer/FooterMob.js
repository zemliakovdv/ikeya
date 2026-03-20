'use client';

import Link from 'next/link';

export default function FooterMob() {
    return (
        <footer className="footer-mobile">
            <div className="container">
                <div className="row">
                    <div className="col-12">
                        <div className="footer-inner">
                            <div className="footer-top">
                                <div className="footer-navigation">
                                    <div className="footer-navigation-accord">
                                        <div className="accordion accordion-flush" id="accordionFlushExample">
                                            <div className="accordion-item">
                                                <h2 className="accordion-header">
                                                    <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#flush-collapseOne" aria-expanded="false" aria-controls="flush-collapseOne">
                                                        Всё о IKEYA
                                                    </button>
                                                </h2>
                                                <div id="flush-collapseOne" className="accordion-collapse collapse" data-bs-parent="#accordionFlushExample">
                                                    <div className="accordion-body">
                                                        <ul>
                                                            <li><Link href="#">О компании</Link></li>
                                                            <li><Link href="/blog">Советы и идеи</Link></li>
                                                            <li><Link href="/pvz">Пункты выдачи</Link></li>
                                                            <li><Link href="#">Контакты</Link></li>
                                                        </ul>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="accordion-item">
                                                <h2 className="accordion-header">
                                                    <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#flush-collapseTwo" aria-expanded="false" aria-controls="flush-collapseTwo">
                                                        Каталог
                                                    </button>
                                                </h2>
                                                <div id="flush-collapseTwo" className="accordion-collapse collapse" data-bs-parent="#accordionFlushExample">
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
                                                    <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#flush-collapseThree" aria-expanded="false" aria-controls="flush-collapseThree">
                                                        Покупателям
                                                    </button>
                                                </h2>
                                                <div id="flush-collapseThree" className="accordion-collapse collapse" data-bs-parent="#accordionFlushExample">
                                                    <div className="accordion-body">
                                                        <ul>
                                                            <li><Link href="#">Как сделать заказ</Link></li>
                                                            <li><Link href="#">Доставка</Link></li>
                                                            <li><Link href="#">Оплата</Link></li>
                                                            <li><Link href="#">Правовая информация</Link></li>
                                                            <li><Link href="#">Настройка cookie</Link></li>
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
                                        <div className="payments-logo">
                                            <svg width="51" height="32" viewBox="0 0 51 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <path d="M18.7313 8.28129L12.2717 23.7574H8.05778L4.87938 11.409C4.68667 10.6477 4.51965 10.369 3.93125 10.049C2.97285 9.52774 1.39007 9.03742 0 8.7329L0.0950698 8.28387H6.8784C7.74174 8.28387 8.52028 8.86193 8.71556 9.86322L10.3934 18.8181L14.5431 8.28387L18.7313 8.28129ZM35.2399 18.7071C35.2579 14.6219 29.6154 14.3974 29.654 12.5729C29.6668 12.0181 30.1935 11.4271 31.3447 11.2774C31.9151 11.2026 33.4901 11.1458 35.2733 11.969L35.9722 8.68645C35.0138 8.33806 33.7779 8 32.244 8C28.305 8 25.53 10.1032 25.5069 13.1148C25.4812 15.3419 27.4853 16.5858 28.9962 17.3265C30.5507 18.0852 31.0723 18.5729 31.0646 19.249C31.0543 20.2864 29.8261 20.7458 28.6776 20.7639C26.6734 20.7948 25.512 20.2194 24.5844 19.7858L23.8624 23.1768C24.7926 23.6052 26.5141 23.9794 28.2947 24C32.4881 24.0026 35.2271 21.9226 35.2399 18.7071ZM45.6462 23.76H49.3333L46.1138 8.28129H42.7119C41.9462 8.28129 41.3013 8.72774 41.016 9.41677L35.0344 23.7574H39.22L40.0499 21.4452H45.1657L45.6462 23.76ZM41.1985 18.2761L43.2977 12.4645L44.5053 18.2761H41.1985ZM24.4251 8.28129L21.1285 23.7574H17.1433L20.4399 8.28129H24.4251Z" fill="#181818" />
                                                <path d="M18.7313 8.28129L12.2717 23.7574H8.05778L4.87938 11.409C4.68667 10.6477 4.51965 10.369 3.93125 10.049C2.97285 9.52774 1.39007 9.03742 0 8.7329L0.0950698 8.28387H6.8784C7.74174 8.28387 8.52028 8.86193 8.71556 9.86322L10.3934 18.8181L14.5431 8.28387L18.7313 8.28129ZM35.2399 18.7071C35.2579 14.6219 29.6154 14.3974 29.654 12.5729C29.6668 12.0181 30.1935 11.4271 31.3447 11.2774C31.9151 11.2026 33.4901 11.1458 35.2733 11.969L35.9722 8.68645C35.0138 8.33806 33.7779 8 32.244 8C28.305 8 25.53 10.1032 25.5069 13.1148C25.4812 15.3419 27.4853 16.5858 28.9962 17.3265C30.5507 18.0852 31.0723 18.5729 31.0646 19.249C31.0543 20.2864 29.8261 20.7458 28.6776 20.7639C26.6734 20.7948 25.512 20.2194 24.5844 19.7858L23.8624 23.1768C24.7926 23.6052 26.5141 23.9794 28.2947 24C32.4881 24.0026 35.2271 21.9226 35.2399 18.7071ZM45.6462 23.76H49.3333L46.1138 8.28129H42.7119C41.9462 8.28129 41.3013 8.72774 41.016 9.41677L35.0344 23.7574H39.22L40.0499 21.4452H45.1657L45.6462 23.76ZM41.1985 18.2761L43.2977 12.4645L44.5053 18.2761H41.1985ZM24.4251 8.28129L21.1285 23.7574H17.1433L20.4399 8.28129H24.4251Z" fill="url(#paint0_linear_2018_6298)" />
                                                <defs>
                                                    <linearGradient id="paint0_linear_2018_6298" x1="7.9664" y1="13.5026" x2="29.276" y2="32.9404" gradientUnits="userSpaceOnUse">
                                                        <stop stopColor="#222357" />
                                                        <stop offset="1" stopColor="#254AA5" />
                                                    </linearGradient>
                                                </defs>
                                            </svg>
                                            <svg width="36" height="32" viewBox="0 0 36 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <path d="M13.5669 8.33445H22.5527V23.0109H13.5669V8.33445Z" fill="#FF5F00" />
                                                <path d="M14.4925 15.674C14.4914 14.2607 14.8117 12.8658 15.4293 11.5947C16.0469 10.3236 16.9455 9.20959 18.0572 8.33705C16.6804 7.25498 15.0268 6.5821 13.2856 6.39532C11.5444 6.20854 9.78583 6.5154 8.21078 7.28082C6.63573 8.04624 5.3078 9.23934 4.37875 10.7238C3.44971 12.2082 2.95703 13.924 2.95703 15.6752C2.95703 17.4264 3.44971 19.1423 4.37875 20.6267C5.3078 22.1111 6.63573 23.3042 8.21078 24.0696C9.78583 24.8351 11.5444 25.1419 13.2856 24.9551C15.0268 24.7684 16.6804 24.0955 18.0572 23.0134C16.9452 22.1406 16.0463 21.0262 15.4287 19.7546C14.8111 18.483 14.491 17.0876 14.4925 15.6739V15.674Z" fill="#EB001B" />
                                                <path d="M33.1588 15.674C33.1587 17.4253 32.6659 19.1412 31.7367 20.6257C30.8075 22.1102 29.4794 23.3033 27.9041 24.0686C26.3289 24.8339 24.5701 25.1405 22.8288 24.9535C21.0875 24.7664 19.4339 24.0932 18.0572 23.0108C19.1684 22.1375 20.0668 21.0232 20.6845 19.752C21.3023 18.4809 21.6233 17.086 21.6233 15.6726C21.6233 14.2593 21.3023 12.8644 20.6845 11.5932C20.0668 10.3221 19.1684 9.20777 18.0572 8.33445C19.4339 7.25203 21.0875 6.57882 22.8288 6.39177C24.5701 6.20472 26.3289 6.51138 27.9041 7.27669C29.4794 8.04201 30.8075 9.2351 31.7367 10.7196C32.6659 12.2041 33.1587 13.92 33.1588 15.6714V15.674Z" fill="#F79E1B" />
                                            </svg>
                                            <svg width="51" height="32" viewBox="0 0 51 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <g clipPath="url(#clip0_2018_6302)">
                                                    <path d="M0.000152588 9.00808H4.69845C5.12557 9.00808 6.40692 8.86571 6.97641 10.8589C7.40353 12.1403 7.97302 14.1335 8.82726 17.1233H9.112C9.96624 13.9911 10.6781 11.8555 10.9628 10.8589C11.5323 8.86571 12.9561 9.00808 13.5256 9.00808H17.9391V22.6759H13.3832V14.5606H13.0984L10.6781 22.6759H7.26116L4.84082 14.5606H4.41371V22.6759H0.000152588M19.79 9.00808H24.3459V17.1233H24.773L27.7628 10.4318C28.3323 9.15046 29.6137 9.00808 29.6137 9.00808H33.8848V22.6759H29.3289V14.5606H29.0442L26.0543 21.2521C25.4849 22.5335 24.0611 22.6759 24.0611 22.6759H19.79M40.0069 18.5471V22.6759H35.7357V15.5572H49.6882C49.1187 17.2657 47.1255 18.5471 44.8475 18.5471" fill="#0F754E" />
                                                    <path d="M49.973 14.703C50.5424 12.1403 48.834 9.00808 45.1323 9.00808H35.4509C35.7357 11.9979 38.2984 14.703 41.0035 14.703" fill="url(#paint0_linear_2018_6302)" />
                                                </g>
                                                <defs>
                                                    <linearGradient id="paint0_linear_2018_6302" x1="48.2645" y1="7.15724" x2="36.8747" y2="7.15724" gradientUnits="userSpaceOnUse">
                                                        <stop stopColor="#1F5CD7" />
                                                        <stop offset="1" stopColor="#02AEFF" />
                                                    </linearGradient>
                                                    <clipPath id="clip0_2018_6302">
                                                        <rect width="50.6667" height="32" fill="white" />
                                                    </clipPath>
                                                </defs>
                                            </svg>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="footer-bottom">
                                <p>ПТЧУП «В2В Авто», УНП: 690542762, Р/с: BY09UNBS30120154200000015933, БИК UNBSBY2X ЗАО «БСБ Банк», г. Минск, пр. Победителей, 23, корп. 4, 223017 агрогор.Гатово, ул.Металлургическая, 3-4 Директор — Есьман Е.Е.</p>
                                <p>Режим работы интернет-магазина: круглосуточно, без выходных.</p>
                                <p>Дата включения сведений об интернет-магазине в Торговый реестр Республики Беларусь --.--.----, № регистрации ------</p>
                                <p>Номера городских телефонов уполномоченных по защите прав потребителей: +375 (17) 270-35-26 – Минский районный исполнительный комитет, +375 (17) 328-53-54 – главное управление торговли и услуг Миноблисполкома</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
}