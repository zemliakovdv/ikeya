// components/product/info/ProductConsultation.js
'use client';

import { openJivoChat } from '@/components/FloatingChatButton';

export default function ProductConsultation() {
  return (
    <div className="goods-consultation">
      <img src="/assets/img/catalog-card/consultation.png" alt="Консультация" />
      <div className="goods-consultation__content">
        <p>Нужна помощь в покупке этого продукта?</p>
        <span>
          Наша команда экспертов поможет вам с выбором подходящей продукции и поможет сделать заказ!
        </span>
        <a
          href="#"
          onClick={(e) => { e.preventDefault(); openJivoChat(); }}
        >
          Перейти в чат-бот
        </a>
      </div>
    </div>
  );
}