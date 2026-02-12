// components/product/info/ProductColors.js
'use client';

export default function ProductColors({ colors, currentColorName }) {
  // Проверяем наличие цветов
  const hasColors = colors && Array.isArray(colors) && colors.length > 0;
  
  if (!hasColors) {
    return null; // Скрываем если данных нет
  }

  return (
    <div className="goods-color">
      <p>Цвет: <span>{currentColorName}</span></p>
      <div className="goods-color__buttons">
        {colors.map((color, index) => (
          <button key={index} className="goods-color__item">
            <img src={color.image_url} alt={color.name} />
          </button>
        ))}
      </div>
    </div>
  );
}
