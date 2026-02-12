export default function DescriptionTab({ product }) {
  const description = product?.attributes?.content_ru;

  if (!description) {
    return (
      <div className="tab-pane fade show active">
        <div className="tab-description__content">
          <p>Описание отсутствует.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="tab-pane fade show active">
      <div className="tab-description__content">
        <div dangerouslySetInnerHTML={{ __html: description }} />
      </div>
    </div>
  );
}
