'use client';

export default function ParametersOffcanvas({ sizes }) {
  return (
    <div 
      className="offcanvas offcanvas-end offcanvac-charart" 
      tabIndex="-1" 
      id="offcanvasGoodsParametrs"
      aria-labelledby="offcanvasGoodsParametrsLabel"
    >
      <div className="offcanvas-header">
        <h5 className="offcanvas-title" id="offcanvasGoodsParametrsLabel">О товаре</h5>
        <button type="button" className="btn-close" data-bs-dismiss="offcanvas" aria-label="Закрыть"></button>
      </div>
      <div className="offcanvas-body">
        <div className="offcanvac-charart__modal">
          <div className="tab-size__content">
            <div className="size-contet__info">
              <h5>Размер в собранном виде</h5>
              {sizes.map((size, index) => (
                <div key={index} className="size-info__item">
                  <p>{size.label}:</p>
                  <p>{size.value}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
