'use client';

import { useState } from 'react';
import Link from 'next/link';
import AdditionOffcanvas from './AdditionOffcanvas';
import ParametersOffcanvas from './ParametersOffcanvas';

export default function ProductInfo({ 
  product, 
  detailedSizes = [],
  showColors = false, 
  showSizes = false, 
  showAdditions = false 
}) {
  const [selectedColor, setSelectedColor] = useState(0);

  // Данные для offcanvas
  const nogkiData = [
    { name: 'деревянный 10см', image: '/assets/img/catalog-card/nogki/nog_1.png', price: 0 },
    { name: 'нержавеющая сталь 10см', image: '/assets/img/catalog-card/nogki/nog_2.png', price: -56.93 },
    { name: 'деревянный 20см', image: '/assets/img/catalog-card/nogki/nog_3.png', price: 18.98 },
  ];

  const gestkostData = [
    { name: 'мягкий', image: '/assets/img/catalog-card/gestkost/gest_1.png', price: -50 },
    { name: 'жесткий', image: '/assets/img/catalog-card/gestkost/gest_2.png', price: 0 },
  ];

  const matrasData = [
    { name: 'Vågstranda', image: '/assets/img/catalog-card/matras/matras_1.png', price: 0 },
    { name: 'Comfort Plus', image: '/assets/img/catalog-card/matras/matras_2.png', price: 100 },
    { name: 'Premium', image: '/assets/img/catalog-card/matras/matras_3.png', price: 200 },
  ];

  return (
    <>
      <div className="goods-content">
        <div className="goods-content__inner">
          {/* Категория */}
          <span className="goods-category">{product.category}</span>
          
          {/* Заголовок */}
          <h1>{product.title}</h1>
          
          {/* Артикул */}
          <p className="artikul">Артикул: <span>{product.sku}</span></p>
          
          {/* Рейтинг и отзывы */}
          <div className="goods-feedback">
            <Link href="#">
              {[...Array(5)].map((_, i) => (
                <svg key={i} width="16" height="16" viewBox="0 0 16 16" fill="none">
                  {i < Math.floor(product.rating) ? (
                    <path d="M11.5134 14.6667C11.18 14.6667 10.76 14.56 10.2334 14.2467L8.38004 13.14C8.19337 13.0267 7.82004 13.0267 7.6267 13.14L5.77337 14.2467C4.68004 14.9 4.03337 14.6467 3.7467 14.4333C3.45337 14.22 3.01337 13.68 3.30004 12.4267L3.74004 10.5067C3.7867 10.3 3.6867 9.95999 3.54004 9.80666L2.00004 8.25333C1.43337 7.67999 1.22004 7.05333 1.40004 6.49333C1.5067 6.16666 1.84004 5.59999 2.9067 5.41999L4.8867 5.08666C5.0667 5.05333 5.34004 4.85333 5.42004 4.68666L6.51337 2.47999C7.01337 1.47333 7.6667 1.32666 8.0067 1.32666C8.3467 1.32666 9.00004 1.47999 9.49337 2.47999L10.5867 4.67999C10.6734 4.85333 10.94 5.05333 11.1267 5.08666L13.1067 5.41999C13.9 5.55333 14.4334 5.93333 14.6134 6.49999C14.72 6.82666 14.78 7.48666 14.0067 8.25999L12.4734 9.80666C12.3267 9.95999 12.2267 10.3 12.2734 10.5133L12.7134 12.4267C13 13.68 12.56 14.22 12.2667 14.4333C12.12 14.54 11.8734 14.66 11.52 14.66L11.5134 14.6667Z" fill="#FFB300" />
                  ) : i === Math.floor(product.rating) && product.rating % 1 !== 0 ? (
                    <>
                      <path d="M4.48667 14.6667C4.13334 14.6667 3.88667 14.5467 3.74001 14.44C3.45334 14.2267 3.00667 13.6867 3.29334 12.4333L3.73334 10.5133C3.78001 10.3067 3.68001 9.96666 3.53334 9.81333L1.99334 8.25999C1.22667 7.49333 1.28667 6.82666 1.39334 6.49999C1.57334 5.93999 2.10667 5.55333 2.90001 5.41999L4.88001 5.08666C5.06667 5.05333 5.33334 4.85333 5.42001 4.68666L6.51334 2.47999C7.00667 1.47999 7.65334 1.32666 8.00001 1.32666V13.0467C7.85334 13.0467 7.70667 13.08 7.62001 13.1333L5.76667 14.24C5.24001 14.5533 4.81334 14.66 4.48667 14.66V14.6667Z" fill="#FFB300" />
                      <path d="M10.2334 14.2467L8.38005 13.14C8.29338 13.0867 8.15338 13.0533 8.00671 13.0533V1.33334C8.34671 1.33334 9.00005 1.48668 9.49338 2.48668L10.5867 4.69334C10.6667 4.86668 10.94 5.06001 11.1267 5.09334L13.1067 5.42668C13.9 5.56001 14.4334 5.94001 14.6134 6.50668C14.72 6.83334 14.78 7.49334 14.0134 8.26668L12.4734 9.82001C12.3267 9.97334 12.2267 10.3133 12.2734 10.52L12.7134 12.44C13 13.6933 12.56 14.2333 12.2667 14.4467C12.12 14.5533 11.8734 14.6733 11.52 14.6733C11.1867 14.6733 10.7667 14.5667 10.24 14.2533L10.2334 14.2467Z" fill="#BDBDBD" />
                    </>
                  ) : (
                    <path d="M11.5134 14.6667C11.18 14.6667 10.76 14.56 10.2334 14.2467L8.38004 13.14C8.19337 13.0267 7.82004 13.0267 7.6267 13.14L5.77337 14.2467C4.68004 14.9 4.03337 14.6467 3.7467 14.4333C3.45337 14.22 3.01337 13.68 3.30004 12.4267L3.74004 10.5067C3.7867 10.3 3.6867 9.95999 3.54004 9.80666L2.00004 8.25333C1.43337 7.67999 1.22004 7.05333 1.40004 6.49333C1.5067 6.16666 1.84004 5.59999 2.9067 5.41999L4.8867 5.08666C5.0667 5.05333 5.34004 4.85333 5.42004 4.68666L6.51337 2.47999C7.01337 1.47333 7.6667 1.32666 8.0067 1.32666C8.3467 1.32666 9.00004 1.47999 9.49337 2.47999L10.5867 4.67999C10.6734 4.85333 10.94 5.05333 11.1267 5.08666L13.1067 5.41999C13.9 5.55333 14.4334 5.93333 14.6134 6.49999C14.72 6.82666 14.78 7.48666 14.0067 8.25999L12.4734 9.80666C12.3267 9.95999 12.2267 10.3 12.2734 10.5133L12.7134 12.4267C13 13.68 12.56 14.22 12.2667 14.4333C12.12 14.54 11.8734 14.66 11.52 14.66L11.5134 14.6667Z" fill="#BDBDBD" />
                  )}
                </svg>
              ))}
              <p><span className="feedback-counter">{product.reviewsCount}</span> отзывов</p>
            </Link>
          </div>

          {/* Промокод */}
          {product.badge && (
            <span className="sales-hit pink">{product.badge}</span>
          )}

          {/* Цена и доставка */}
          <div className="goods-costs">
            <p>{product.price}<span>.00</span></p>
            <div className="goods-delivery">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M10.3134 4.12667C10.2867 3.61333 10.2 3.26667 9.91338 2.98C9.50671 2.57333 8.96671 2.57333 7.99338 2.57333H3.66005C2.68671 2.57333 2.15338 2.57333 1.74005 2.98C1.32671 3.38667 1.33338 3.92667 1.33338 4.9V9.86C1.33338 10.5 1.33338 10.8533 1.52005 11.18C1.64005 11.3933 1.82005 11.5733 2.03338 11.6933C2.28005 11.8333 2.54671 11.8667 2.94671 11.88C3.16005 12.7667 3.95338 13.4333 4.90671 13.4333C5.86005 13.4333 6.65338 12.7667 6.86005 11.88H9.14671C9.36005 12.7667 10.1534 13.4333 11.1 13.4333C12.0467 13.4333 12.8467 12.7667 13.0534 11.88H13.12C13.2867 11.88 13.3667 11.88 13.44 11.8667C14.0734 11.7867 14.5734 11.2867 14.6534 10.6533C14.66 10.5867 14.6667 10.5 14.6667 10.3333V8.62C14.6667 6.18667 12.7267 4.2 10.3134 4.12667ZM4.12005 4.9C4.12005 4.64 4.32671 4.43333 4.58671 4.43333C4.84671 4.43333 5.05338 4.64 5.05338 4.9V7.38C5.05338 7.64 4.84671 7.84667 4.58671 7.84667C4.32671 7.84667 4.12005 7.64 4.12005 7.38V4.9ZM4.89338 12.5C4.29338 12.5 3.80671 12.0133 3.80671 11.4133C3.80671 10.8133 4.29338 10.3267 4.89338 10.3267C5.49338 10.3267 5.98005 10.8133 5.98005 11.4133C5.98005 12.0133 5.49338 12.5 4.89338 12.5ZM7.52671 7.38667C7.52671 7.64667 7.32005 7.85333 7.06005 7.85333C6.80005 7.85333 6.59338 7.64667 6.59338 7.38667V4.90667C6.59338 4.64667 6.80005 4.44 7.06005 4.44C7.32005 4.44 7.52671 4.64667 7.52671 4.90667V7.38667ZM11.0934 12.5C10.4934 12.5 10.0067 12.0133 10.0067 11.4133C10.0067 10.8133 10.4934 10.3267 11.0934 10.3267C11.6934 10.3267 12.18 10.8133 12.18 11.4133C12.18 12.0133 11.6934 12.5 11.0934 12.5Z" fill="#04A31A"/>
              </svg>
              <p>Доставка до {product.deliveryDays} дней</p>
            </div>
          </div>

          {/* Пошлина */}
          <div className="goods-poshlina">
            <div className="goods-poshlina_top">
              <button>
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <path d="M9.99996 1.66666C5.40829 1.66666 1.66663 5.40832 1.66663 9.99999C1.66663 14.5917 5.40829 18.3333 9.99996 18.3333C14.5916 18.3333 18.3333 14.5917 18.3333 9.99999C18.3333 5.40832 14.5916 1.66666 9.99996 1.66666ZM13.1 10.5833H10.5833V13.1C10.5833 13.425 10.325 13.6833 9.99996 13.6833C9.67496 13.6833 9.41663 13.425 9.41663 13.1V10.5833H6.89996C6.57496 10.5833 6.31663 10.325 6.31663 9.99999C6.31663 9.67499 6.57496 9.41666 6.89996 9.41666H9.41663V6.89999C9.41663 6.57499 9.67496 6.31666 9.99996 6.31666C10.325 6.31666 10.5833 6.57499 10.5833 6.89999V9.41666H13.1C13.425 9.41666 13.6833 9.67499 13.6833 9.99999C13.6833 10.325 13.425 10.5833 13.1 10.5833Z" fill="#CE0061"/>
                </svg>
              </button>
              <p><span>≈</span><span className="poshlina-number">{product.customsDuty}</span><span className="poshlina-valute">р.</span> пошлина не входит в цену</p>
            </div>
            <Link href="#">Правила оплаты и формирование таможенной пошлины</Link>
          </div>

          {/* Кнопка В корзину */}
          <button className="goods-add__cart">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path d="M7.26668 13.6833H12.5333C16.575 13.6833 17.15 10.85 17.75 7.84166C17.9584 6.79166 18.075 6.21666 17.7084 5.69999C17.3084 5.14999 16.6834 5.14999 15.7334 5.14999H5.82502L5.43335 3.27499C5.19168 2.32499 4.34168 1.65833 3.36668 1.65833H2.64168C2.31668 1.65833 2.05835 1.91666 2.05835 2.24166C2.05835 2.56666 2.31668 2.82499 2.64168 2.82499H3.36668C3.80835 2.82499 4.20002 3.12499 4.30002 3.54166L6.23335 12.7583C5.37502 13.1667 4.76668 14.0583 4.76668 15.1C4.76668 15.6083 5.16668 16.0167 5.66668 16.0167H7.20002C7.13335 16.2 7.09168 16.3917 7.09168 16.6C7.09168 17.5583 7.87502 18.3417 8.83335 18.3417C9.79168 18.3417 10.575 17.5583 10.575 16.6C10.575 16.3917 10.5334 16.2 10.4667 16.0167H12.6167C12.55 16.2 12.5084 16.3917 12.5084 16.6C12.5084 17.5583 13.2917 18.3417 14.25 18.3417C15.2084 18.3417 15.9917 17.5583 15.9917 16.6C15.9917 15.6417 15.2084 14.8583 14.25 14.8583H5.95002C6.05835 14.2 6.60835 13.6917 7.25835 13.6917L7.26668 13.6833ZM9.42502 16.5917C9.42502 16.9083 9.16668 17.175 8.84168 17.175C8.51668 17.175 8.25835 16.9167 8.25835 16.5917C8.25835 16.2667 8.51668 16.0083 8.84168 16.0083C9.16668 16.0083 9.42502 16.2667 9.42502 16.5917ZM14.2667 17.175C13.95 17.175 13.6834 16.9167 13.6834 16.5917C13.6834 16.2667 13.9417 16.0083 14.2667 16.0083C14.5917 16.0083 14.85 16.2667 14.85 16.5917C14.85 16.9167 14.5917 17.175 14.2667 17.175ZM15.7334 6.32499C16.175 6.32499 16.6667 6.32499 16.7667 6.39166C16.8417 6.49166 16.7167 7.09166 16.6084 7.61666C15.9417 10.9333 15.4917 12.525 12.5333 12.525H7.37502L6.07502 6.32499H15.7417H15.7334Z" fill="white"/>
            </svg>
            В корзину
          </button>

          {/* Цвета */}
          {showColors && product.colors && (
            <div className="goods-color">
              <p>Цвет: <span>{product.selectedColor}</span></p>
              <div className="goods-color__buttons">
                {product.colors.map((color, index) => (
                  <button 
                    key={index}
                    className={`goods-color__item ${selectedColor === index ? 'active' : ''}`}
                    onClick={() => setSelectedColor(index)}
                  >
                    <img src={color} alt={`Color ${index + 1}`} />
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Размеры */}
          {showSizes && product.sizes && (
            <div className="goods-sizes">
              <h2>Варианты размеров:</h2>
              <div className="goods-sizes__card">
                {product.sizes.map((size, index) => (
                  <Link key={index} href="#" className="goods-sizes__item">
                    <img src={size.image} alt={size.name} />
                    <p className="good-sizes__number">{size.name} <span>{size.unit}</span></p>
                    <p className={size.price === 0 ? 'no_cost' : ''}>
                      {size.price > 0 && '+'}
                      {size.price !== 0 && <span>{Math.abs(size.price)}</span>}
                      {size.price !== 0 && ' p.'}
                    </p>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Дополнения */}
          {showAdditions && product.additions && (
            <div className="goods-add">
              {product.additions.map((addition) => (
                <button 
                  key={addition.id}
                  className="goods-add__item" 
                  type="button" 
                  data-bs-toggle="offcanvas"
                  data-bs-target={`#offcanvas${addition.id}`} 
                  aria-controls={`offcanvas${addition.id}`}
                >
                  <div className="add-item__content">
                    <div className="add-item__top">
                      <p>{addition.name}</p>
                      <span>{addition.count}</span>
                    </div>
                    <p>{addition.selected}</p>
                  </div>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                    <path d="M15.33 12.0005C15.33 13.1205 12.29 15.8005 9.75003 17.8505C9.46003 18.0805 9.04003 18.0405 8.81003 17.7505C8.58003 17.4605 8.62003 17.0405 8.91003 16.8105C11.14 15.0105 13.65 12.7105 13.98 12.0005C13.65 11.2905 11.14 8.99048 8.91003 7.19048C8.62003 6.96048 8.58003 6.54048 8.81003 6.25048C9.04003 5.96048 9.46003 5.92048 9.75003 6.15048C12.3 8.20048 15.33 10.8905 15.33 12.0005Z" fill="#181818"/>
                  </svg>
                </button>
              ))}
            </div>
          )}

          {/* Характеристики */}
          {product.features && (
            <div className="goods-parametrs">
              <h2>Основные характеристики</h2>
              {product.features.map((feature, index) => (
                <div key={index} className="goods-parametrs__item">
                  <p className="parametrs-name">{feature.name}</p>
                  <p className="parametrs-number">{feature.value} <span>{feature.unit}</span></p>
                </div>
              ))}
              {detailedSizes.length > 0 && (
                <button 
                  className="goods-parametrs__button" 
                  type="button" 
                  data-bs-toggle="offcanvas"
                  data-bs-target="#offcanvasGoodsParametrs"
                  aria-controls="offcanvasGoodsParametrs"
                >
                  Показать все
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                    <path d="M12.775 10.0007C12.775 10.9341 10.2417 13.1674 8.125 14.8757C7.88334 15.0674 7.53334 15.0341 7.34167 14.7924C7.15 14.5507 7.18333 14.2007 7.425 14.0091C9.28333 12.5091 11.375 10.5924 11.65 10.0007C11.375 9.40906 9.28333 7.49239 7.425 5.99239C7.18333 5.80073 7.15 5.45073 7.34167 5.20906C7.53334 4.96739 7.88334 4.93406 8.125 5.12573C10.25 6.83406 12.775 9.07573 12.775 10.0007Z" fill="#181818"/>
                  </svg>
                </button>
              )}
            </div>
          )}

          {/* Доставка */}
          <div className="goods-dostavka">
            <button className="goods-add__item" type="button" data-bs-toggle="offcanvas"
              data-bs-target="#offcanvasRight" aria-controls="offcanvasRight">
              <p>Услуги и доставка</p>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M15.33 12.0005C15.33 13.1205 12.29 15.8005 9.75003 17.8505C9.46003 18.0805 9.04003 18.0405 8.81003 17.7505C8.58003 17.4605 8.62003 17.0405 8.91003 16.8105C11.14 15.0105 13.65 12.7105 13.98 12.0005C13.65 11.2905 11.14 8.99048 8.91003 7.19048C8.62003 6.96048 8.58003 6.54048 8.81003 6.25048C9.04003 5.96048 9.46003 5.92048 9.75003 6.15048C12.3 8.20048 15.33 10.8905 15.33 12.0005Z" fill="#181818"/>
              </svg>
            </button>
          </div>

          {/* Коллекция */}
          {product.collection && (
            <div className="goods-collections">
              <button className="goods-add__item" type="button" data-bs-toggle="offcanvas"
                data-bs-target="#offcanvasRight" aria-controls="offcanvasRight">
                <p>Все товары коллекции <span className="goods-collections__name">{product.collection}</span></p>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <path d="M15.33 12.0005C15.33 13.1205 12.29 15.8005 9.75003 17.8505C9.46003 18.0805 9.04003 18.0405 8.81003 17.7505C8.58003 17.4605 8.62003 17.0405 8.91003 16.8105C11.14 15.0105 13.65 12.7105 13.98 12.0005C13.65 11.2905 11.14 8.99048 8.91003 7.19048C8.62003 6.96048 8.58003 6.54048 8.81003 6.25048C9.04003 5.96048 9.46003 5.92048 9.75003 6.15048C12.3 8.20048 15.33 10.8905 15.33 12.0005Z" fill="#181818"/>
                </svg>
              </button>
            </div>
          )}

          {/* Консультация */}
          <div className="goods-consultation">
            <img src="/assets/img/catalog-card/consultation.png" alt="Консультация" />
            <div className="goods-consultation__content">
              <p>Нужна помощь в покупке этого продукта?</p>
              <span>Наша команда экспертов поможет вам с выбором подходящей продукции и поможет сделать заказ!</span>
              <Link href="#">Перейти в чат-бот</Link>
            </div>
          </div>
        </div>
      </div>

      {/* Offcanvas для дополнений */}
      {showAdditions && product.additions && (
        <>
          <AdditionOffcanvas 
            id="Nogki" 
            title="Ножки" 
            items={nogkiData}
          />
          <AdditionOffcanvas 
            id="Gestkost" 
            title="Жесткость" 
            items={gestkostData}
          />
          <AdditionOffcanvas 
            id="Matras" 
            title="Матрасы" 
            items={matrasData}
          />
        </>
      )}

      {/* Offcanvas с подробными параметрами */}
      {detailedSizes.length > 0 && (
        <ParametersOffcanvas sizes={detailedSizes} />
      )}
    </>
  );
}
