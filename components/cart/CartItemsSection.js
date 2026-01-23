'use client';

export default function CartItemsSection({
  items = [],
  isUnavailable = false,
  onQuantityChange,
  onDelete,
  onFavorite,
  onSelectAll,
  onDeleteSelected,
  onCheckChange
}) {
  const sectionClass = isUnavailable 
    ? 'cart-section cart-section--unavailable' 
    : 'cart-section cart-section--available cart-items-container';

  const topClass = isUnavailable ? 'cart-section__top' : 'cart-main__top';

  return (
    <div className={sectionClass}>
      {isUnavailable && (
        <h2 className="cart-section__title">Недоступно для заказа</h2>
      )}

      {/* Верхняя панель */}
      <div className={topClass}>
        <label className="cart-select-all">
          <input 
            className="cart-select-all__input" 
            type="checkbox" 
            id={isUnavailable ? "unavailableChoises" : "allGoodChoises"}
            onChange={(e) => onSelectAll(e.target.checked)}
          />
          <label className="form-check-label" htmlFor={isUnavailable ? "unavailableChoises" : "allGoodChoises"}>
            Выбрать всё
          </label>
        </label>
        <button className="cart-remove-selected" onClick={onDeleteSelected}>
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M16.975 4.38341H13.5083L13.1417 3.61675C12.7583 2.83341 12.55 2.40008 12.1333 2.09175C12.0417 2.02508 11.9416 1.96675 11.8416 1.90841C11.375 1.66675 10.9 1.66675 10.025 1.66675C9.14998 1.66675 8.64165 1.66675 8.17498 1.91675C8.06665 1.97508 7.97498 2.03341 7.87498 2.10841C7.44998 2.43341 7.24998 2.88341 6.87498 3.69175L6.55832 4.38341H3.02498C2.69998 4.38341 2.44165 4.64175 2.44165 4.96675C2.44165 5.29175 2.69998 5.55008 3.02498 5.55008H3.64165L4.07498 12.7667C4.19998 14.8584 4.26665 15.9084 4.85832 16.7584C5.14998 17.1834 5.52498 17.5334 5.96665 17.8001C6.84998 18.3417 7.89998 18.3417 9.99998 18.3417C12.1 18.3417 13.15 18.3417 14.0333 17.8001C14.475 17.5334 14.8416 17.1834 15.1416 16.7584C15.7333 15.9084 15.8 14.8584 15.925 12.7667L16.375 5.54175H16.9916C17.3166 5.54175 17.575 5.28341 17.575 4.95841C17.575 4.63341 17.3166 4.37508 16.9916 4.37508L16.975 4.38341ZM7.93332 4.17508C8.24998 3.48341 8.39165 3.17508 8.57498 3.03341C8.61665 3.00008 8.65832 2.97508 8.70832 2.95008C8.91665 2.84175 9.25832 2.83341 10.0167 2.83341C10.775 2.83341 11.0917 2.83341 11.2917 2.94175C11.3417 2.96675 11.3833 2.99175 11.425 3.02508C11.6083 3.15841 11.7583 3.45841 12.0833 4.12508L12.2083 4.38341H7.83332L7.92498 4.17508H7.93332ZM14.75 12.7001C14.6333 14.5751 14.575 15.5167 14.175 16.0917C13.975 16.3751 13.7167 16.6251 13.4167 16.8001C12.8167 17.1667 11.8666 17.1667 9.99165 17.1667C8.11665 17.1667 7.16665 17.1667 6.56665 16.8001C6.26665 16.6167 6.00832 16.3751 5.80832 16.0917C5.39998 15.5084 5.34998 14.5667 5.23332 12.6917L4.79998 5.54175H15.1916L14.75 12.7001Z" fill="#757575" />
            <path d="M8.05831 8.2583C7.73331 8.2583 7.47498 8.51663 7.47498 8.84163V13.4916C7.47498 13.8166 7.73331 14.075 8.05831 14.075C8.38331 14.075 8.64164 13.8166 8.64164 13.4916V8.84163C8.64164 8.51663 8.38331 8.2583 8.05831 8.2583Z" fill="#757575" />
            <path d="M11.9416 8.2583C11.6166 8.2583 11.3583 8.51663 11.3583 8.84163V13.4916C11.3583 13.8166 11.6166 14.075 11.9416 14.075C12.2666 14.075 12.5249 13.8166 12.5249 13.4916V8.84163C12.5249 8.51663 12.2666 8.2583 11.9416 8.2583Z" fill="#757575" />
          </svg>
          {' '}Удалить
        </button>
      </div>

      {/* Список товаров */}
      {items.map(item => (
        <CartItem 
          key={item.id}
          item={item}
          isUnavailable={isUnavailable}
          onQuantityChange={onQuantityChange}
          onDelete={onDelete}
          onFavorite={onFavorite}
          onCheckChange={onCheckChange}
        />
      ))}
    </div>
  );
}

// Импорт компонента CartItem
import CartItem from './CartItem';
