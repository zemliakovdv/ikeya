// components/services/ServicesOrder.js
'use client';

import Link from 'next/link';
import { openJivoChat } from '@/components/FloatingChatButton';

export default function ServicesOrder() {
  return (
    <section className="uslugi-zakaz">
      <div className="container">
        <div className="row">
          <div className="col-12">
            <h2>Как заказать услугу?</h2>
            <div className="uslugi-zakaz_inner">
              <div className="uslugi-zakaz_item">
                <img src="/assets/img/uslugi/korzina.png" alt="Корзина" />
                <div className="zakaz-item_inform">
                  <p>При оформлении заказа в корзине</p>
                  <span>Укажите, что вам нужна услуга сборки, в комментариях к заказу.</span>
                  <Link href="/cart">Перейти в корзину</Link>
                </div>
              </div>
              <div className="uslugi-zakaz_item">
                <img src="/assets/img/uslugi/connect.png" alt="Чат" />
                <div className="zakaz-item_inform">
                  <p>Связь с менеджером</p>
                  <span>Наш менеджер свяжется с вами, чтобы уточнить детали и рассчитать точную стоимость.</span>
                  <button type="button" onClick={openJivoChat}>Перейти в чат-бот</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}