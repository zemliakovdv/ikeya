// components/product/info/ProductParameters.js
'use client';

export default function ProductParameters({ product }) {
  const attr = product.attributes;
  
  // Парсим размеры из строки "60 × 40 × 202 cm"
  const dimensions = attr.dimensions || '';
  const dimensionParts = dimensions.split('×').map(d => d.trim().replace(/[^\d]/g, ''));
  
  const width = dimensionParts[0] || null;
  const depth = dimensionParts[1] || null;
  const height = dimensionParts[2] || null;
  
  const weight = attr.weight ? parseFloat(attr.weight) : null;
  const netWeight = attr.net_weight ? parseFloat(attr.net_weight) : null;
  const packageVolume = attr.package_volume ? parseFloat(attr.package_volume) : null;

  // Если нет характеристик - не показываем блок
  if (!width && !depth && !height && !weight) {
    return null;
  }

  return (
    <>
      <div className="goods-parametrs">
        <h2>Основные характеристики</h2>
        
        {width && (
          <div className="goods-parametrs__item">
            <p className="parametrs-name">Ширина</p>
            <p className="parametrs-number">{width} <span>см</span></p>
          </div>
        )}
        
        {depth && (
          <div className="goods-parametrs__item">
            <p className="parametrs-name">Глубина</p>
            <p className="parametrs-number">{depth} <span>см</span></p>
          </div>
        )}
        
        {height && (
          <div className="goods-parametrs__item">
            <p className="parametrs-name">Высота</p>
            <p className="parametrs-number">{height} <span>см</span></p>
          </div>
        )}
        
        {weight && (
          <div className="goods-parametrs__item">
            <p className="parametrs-name">Вес</p>
            <p className="parametrs-number">{weight} <span>кг</span></p>
          </div>
        )}
        
        <button 
          className="goods-parametrs__button" 
          type="button" 
          data-bs-toggle="offcanvas"
          data-bs-target="#offcanvasGoodsParametrs"
          aria-controls="offcanvasGoodsParametrs"
        >
          Показать все
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M12.775 10.0007C12.775 10.9341 10.2417 13.1674 8.125 14.8757C7.88334 15.0674 7.53334 15.0341 7.34167 14.7924C7.15 14.5507 7.18333 14.2007 7.425 14.0091C9.28333 12.5091 11.375 10.5924 11.65 10.0007C11.375 9.40906 9.28333 7.49239 7.425 5.99239C7.18333 5.80073 7.15 5.45073 7.34167 5.20906C7.53334 4.96739 7.88334 4.93406 8.125 5.12573C10.25 6.83406 12.775 9.07573 12.775 10.0007Z"
              fill="#181818"
            />
          </svg>
        </button>
      </div>

      {/* Offcanvas с полными характеристиками */}
      <div 
        className="offcanvas offcanvas-end offcanvac-charart" 
        tabIndex="-1" 
        id="offcanvasGoodsParametrs"
        aria-labelledby="offcanvasGoodsParametrsLabel"
      >
        <div className="offcanvas-header">
          <h5 className="offcanvas-title" id="offcanvasGoodsParametrsLabel">
            О товаре
          </h5>
          <button 
            type="button" 
            className="btn-close" 
            data-bs-dismiss="offcanvas" 
            aria-label="Закрыть"
          ></button>
        </div>
        <div className="offcanvas-body">
          <div className="offcanvac-charart__modal">
            <div className="tab-size__content">
              <div className="size-contet__info">
                <h5>Размер в собранном виде</h5>
                
                {width && (
                  <div className="size-info__item">
                    <p>Ширина:</p>
                    <p>{width} см</p>
                  </div>
                )}
                
                {depth && (
                  <div className="size-info__item">
                    <p>Глубина:</p>
                    <p>{depth} см</p>
                  </div>
                )}
                
                {height && (
                  <div className="size-info__item">
                    <p>Высота:</p>
                    <p>{height} см</p>
                  </div>
                )}
                
                {weight && (
                  <div className="size-info__item">
                    <p>Вес:</p>
                    <p>{weight} кг</p>
                  </div>
                )}
                
                {netWeight && (
                  <div className="size-info__item">
                    <p>Вес нетто:</p>
                    <p>{netWeight} кг</p>
                  </div>
                )}
                
                {packageVolume && (
                  <div className="size-info__item">
                    <p>Объём упаковки:</p>
                    <p>{packageVolume} м³</p>
                  </div>
                )}
                
                {attr.package_dimensions && (
                  <div className="size-info__item">
                    <p>Размеры упаковки:</p>
                    <p>{attr.package_dimensions}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
