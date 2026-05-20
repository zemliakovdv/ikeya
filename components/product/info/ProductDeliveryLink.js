// components/product/info/ProductDeliveryLink.js
'use client';

export default function ProductDeliveryLink() {
  const handleClick = () => {
    const tabsSection = document.querySelector('.character');

    if (!tabsSection) return;

    tabsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });

    window.setTimeout(() => {
      const desktopDeliveryTab = document.querySelector(
        '.character-nav__tabs button[data-tab="delivery"]'
      );

      if (desktopDeliveryTab) {
        desktopDeliveryTab.click();
        return;
      }

      const mobileDeliveryTab = document.querySelector(
        '.product-mobile-tabs-list__item[data-tab="delivery"]'
      );

      if (mobileDeliveryTab) {
        mobileDeliveryTab.click();
      }
    }, 300);
  };

  return (
    <div className="goods-dostavka">
      <button
        className="goods-add__item"
        type="button"
        onClick={handleClick}
      >
        <p>Услуги</p>
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M15.33 12.0005C15.33 13.1205 12.29 15.8005 9.75003 17.8505C9.46003 18.0805 9.04003 18.0405 8.81003 17.7505C8.58003 17.4605 8.62003 17.0405 8.91003 16.8105C11.14 15.0105 13.65 12.7105 13.98 12.0005C13.65 11.2905 11.14 8.99048 8.91003 7.19048C8.62003 6.96048 8.58003 6.54048 8.81003 6.25048C9.04003 5.96048 9.46003 5.92048 9.75003 6.15048C12.3 8.20048 15.33 10.8905 15.33 12.0005Z"
            fill="#181818"
          />
        </svg>
      </button>
    </div>
  );
}