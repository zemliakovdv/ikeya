export default function SizesTab({ product }) {
  const attr = product.attributes;
  
  // Парсим варианты (для упаковок)
  let variants = [];
  try {
    variants = attr.variants || [];
  } catch (e) {
    console.error('Error parsing variants:', e);
  }

  return (
    <div className="tab-pane fade show active">
      <div className="tab-size__content">
        <div className="size-contet__info">
          
          {/* Размер в собранном виде */}
          <h5>Размер в собранном виде</h5>
          
          {attr.dimensions && (
            <div className="size-info__item">
              <p>Размеры:</p>
              <p>{attr.dimensions}</p>
            </div>
          )}
          
          {attr.weight && (
            <div className="size-info__item">
              <p>Вес:</p>
              <p>{attr.weight} кг</p>
            </div>
          )}
          
          {attr.net_weight && (
            <div className="size-info__item">
              <p>Вес нетто:</p>
              <p>{attr.net_weight} кг</p>
            </div>
          )}
          
          {/* Если данных о размерах нет */}
          {!attr.dimensions && !attr.weight && (
            <p>Информация о размерах в собранном виде временно отсутствует.</p>
          )}
          
          {/* Размер и вес упаковки */}
          {(attr.package_dimensions || attr.package_volume || variants.length > 0) && (
            <>
              <h5>Размер и вес упаковки</h5>
              
              {variants.length > 0 ? (
                <>
                  <p>{variants.length} {variants.length === 1 ? 'упаковка' : variants.length < 5 ? 'упаковки' : 'упаковок'}</p>
                  <div className="size-info__double">
                    {variants.map((variant, index) => (
                      <div key={variant.itemNo || index} className="size-double__item">
                        <h6>
                          {index + 1} x {variant.name} {variant.typeName}
                        </h6>
                        
                        {variant.itemNo && (
                          <div className="size-info__item">
                            <p>Артикул</p>
                            <p>{variant.itemNo}</p>
                          </div>
                        )}
                        
                        {variant.itemMeasureReferenceText && (
                          <div className="size-info__item">
                            <p>Размеры:</p>
                            <p>{variant.itemMeasureReferenceText}</p>
                          </div>
                        )}
                        
                        {variant.weight && (
                          <div className="size-info__item">
                            <p>Вес:</p>
                            <p>{variant.weight} кг</p>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </>
              ) : (
                <>
                  <div className="size-info__item">
                    <p>Артикул</p>
                    <p>{attr.sku}</p>
                  </div>
                  
                  {attr.package_dimensions && (
                    <div className="size-info__item">
                      <p>Размеры упаковки:</p>
                      <p>{attr.package_dimensions}</p>
                    </div>
                  )}
                  
                  {attr.package_volume && (
                    <div className="size-info__item">
                      <p>Объём упаковки:</p>
                      <p>{attr.package_volume} м³</p>
                    </div>
                  )}
                </>
              )}
            </>
          )}
        </div>
        
        {/* Чертёж (если есть) */}
        {attr.blueprint_image && (
          <div className="size-content__banner">
            <img src={attr.blueprint_image} alt="Чертёж товара" />
          </div>
        )}
      </div>
    </div>
  );
}
