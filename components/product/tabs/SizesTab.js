function normalizeMeasure(value) {
  if (typeof value !== 'string') return value;
  return value.replace(/\s*cm/gi, ' см').trim();
}

export default function SizesTab({ product }) {
  const attr = product.attributes;
  const fa = attr.full_attributes_ru || {}
  const sizeData = fa.size || {}
  const packaging = sizeData.packaging || {}
  const packagingDetails = Array.isArray(packaging.details) ? packaging.details : []

  // Собираем размеры в собранном виде — все ключи кроме служебных
  const excludedKeys = ['packaging', 'packages', 'desc']
  const sizeEntries = Object.entries(sizeData).filter(([key]) => !excludedKeys.includes(key))

  return (
    <div className="tab-pane fade show active">
      <div className="tab-size__content">
        <div className="size-contet__info">

          {/* Размер в собранном виде */}
          <h5>Размер в собранном виде</h5>

          {sizeEntries.length > 0 ? (
            sizeEntries.map(([key, value]) => (
              <div key={key} className="size-info__item">
                <p>{key}:</p>
                <p>{normalizeMeasure(value)}</p>
              </div>
            ))
          ) : (
            <p>Информация о размерах временно отсутствует.</p>
          )}

          {attr.weight && (
            <div className="size-info__item">
              <p>Вес:</p>
              <p>{attr.weight} кг</p>
            </div>
          )}

          {/* Упаковка */}
          {(packagingDetails.length > 0 || packaging.desc) && (
            <>
              <h5>Размер и вес упаковки</h5>
              {packaging.desc && <p>{packaging.desc}</p>}
              {packagingDetails.map((pkg, i) => (
                <div key={i} className="size-double__item">
                  {pkg.count && <h6>{pkg.count} шт.</h6>}
                  {pkg.length && (
                    <div className="size-info__item">
                      <p>Длина:</p><p>{normalizeMeasure(pkg.length)}</p>
                    </div>
                  )}
                  {pkg.width && (
                    <div className="size-info__item">
                      <p>Ширина:</p><p>{normalizeMeasure(pkg.width)}</p>
                    </div>
                  )}
                  {pkg.height && (
                    <div className="size-info__item">
                      <p>Высота:</p><p>{normalizeMeasure(pkg.height)}</p>
                    </div>
                  )}
                  {pkg.weight && (
                    <div className="size-info__item">
                      <p>Вес:</p><p>{normalizeMeasure(pkg.weight)}</p>
                    </div>
                  )}
                </div>
              ))}
            </>
          )}
        </div>
      </div>
    </div>
  );
}