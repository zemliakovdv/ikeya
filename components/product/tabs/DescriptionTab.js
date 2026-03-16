export default function DescriptionTab({ product }) {
  const fa = product?.attributes?.full_attributes_ru || {}
  const desc = fa.description || {}
  const shortDescription = desc.short_description || ''
  const bulletPoints = Array.isArray(desc.description) ? desc.description : []

  if (!shortDescription && bulletPoints.length === 0) {
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
        {shortDescription && <p>{shortDescription}</p>}
        {bulletPoints.length > 0 && (
          <ul>
            {bulletPoints.map((point, i) => (
              <li key={i}>{point}</li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}