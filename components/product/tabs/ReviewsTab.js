export default function ReviewsTab({ product }) {
  const attr = product.attributes;

  return (
    <div className="tab-pane fade show active">
      <div className="tab-feedbacks__content">
        
        {/* Заглушка - нет отзывов */}
        <div className="feedbacks-content__info">
          <div className="content-info__inner">
            <img src="/assets/img/cart/no_feed.png" alt="Отзывов пока нет" />
            <p>Отзывов пока нет</p>
          </div>
        </div>
        
        {/* Информационный блок */}
        <div className="feedbacks-content__alert">
          <p>
            Рейтинга пока нет. Он формируется на основе актуальных отзывов на
            заказанные и оплаченные товары
          </p>
          <p>
            Отзывы могут оставлять только те, кто купил товар. Так мы формируем
            честный рейтинг
          </p>
        </div>
        
      </div>
    </div>
  );
}
