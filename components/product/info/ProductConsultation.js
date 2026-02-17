// components/product/info/ProductConsultation.js
'use client';

export default function ProductConsultation() {
  
  const handleChatOpen = () => {
    // Здесь будет открытие чата
    // Варианты:
    // 1. Telegram Widget
    // 2. WhatsApp
    // 3. Jivo Chat
    // 4. Intercom
    // 5. Custom chat
    
    // Пример для Telegram:
    // window.open('https://t.me/your_bot', '_blank');
    
    // Пример для WhatsApp:
    // window.open('https://wa.me/375291234567?text=Здравствуйте, нужна консультация', '_blank');
    
    // Пока заглушка
    alert('Открытие чата (нужно настроить интеграцию)');
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
