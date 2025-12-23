'use client';

export default function AdditionOffcanvas({ id, title, items, onSelect }) {
  return (
    <div className="offcanvas offcanvas-end" tabIndex="-1" id={`offcanvas${id}`} aria-labelledby={`offcanvas${id}Label`}>
      <div className="offcanvas-header">
        <h5 className="offcanvas-title" id={`offcanvas${id}Label`}>{title}</h5>
        <button type="button" className="btn-close" data-bs-dismiss="offcanvas" aria-label="Закрыть"></button>
      </div>
      <div className="offcanvas-body">
        <div className={`offcanvas-${id.toLowerCase()}__modal`}>
          <div className={`${id.toLowerCase()}-modal__content`}>
            {items.map((item, index) => (
              <button 
                key={index}
                className={`${id.toLowerCase()}-item`}
                onClick={() => onSelect && onSelect(item)}
              >
                <img src={item.image} alt={item.name} />
                <p>{item.name}</p>
                {item.price !== 0 && (
                  <span>{item.price > 0 ? `+${item.price}` : item.price} р.</span>
                )}
                {item.price === 0 && <span></span>}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
