export default function ReviewsTab() {
  return (
    <div className="tab-feedbacks__content">
      <div className="feedbacks-content__info">
        <div className="content-info__inner">
          <img src="/assets/img/cart/no_feed.png" alt="Нет отзывов" />
          <p>Отзывов пока нет</p>
        </div>
      </div>
      <div className="feedbacks-content__alert">
        <p>Рейтинга пока нет. Он формируется на основе актуальных отзывов на заказанные и оплаченные товары</p>
        <p>Отзывы могут оставлять только те, кто купил товар. Так мы формируем честный рейтинг</p>
      </div>
    </div>
  );
}
