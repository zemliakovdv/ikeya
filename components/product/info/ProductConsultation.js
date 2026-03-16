// components/product/info/ProductConsultation.js
'use client';

export default function ProductConsultation() {
  
  const handleChatOpen = () => {
    // TODO: настроить интеграцию с чатом (Telegram / WhatsApp / Jivo)
    // window.open('https://t.me/your_bot', '_blank');
    console.log('Открытие чата');
  };

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
          onClick={(e) => {
            e.preventDefault();
            handleChatOpen();
          }}
        >
          Перейти в чат-бот
        </a>
      </div>
    </div>
  );
}