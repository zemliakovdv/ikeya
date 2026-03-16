export default function MaterialsTab({ product }) {
  const fa = product?.attributes?.full_attributes_ru || {}
  const materialsData = fa.materials || {}
  const careDesc = materialsData.desc || ''
  const materials = materialsData.materials || {}
  const materialEntries = Object.entries(materials)

  if (!careDesc && materialEntries.length === 0) {
    return (
      <div className="tab-pane fade show active">
        <div className="tab-material__content">
          <p>Информация о материалах временно отсутствует.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="tab-pane fade show active">
      <div className="tab-material__content">

        {/* Состав по частям */}
        {materialEntries.length > 0 && (
          <>
            <h5>Материалы</h5>
            {materialEntries.map(([part, value]) => (
              <div key={part} className="size-info__item">
                <p>{part}:</p>
                <p>{value}</p>
              </div>
            ))}
          </>
        )}

        {/* Уход */}
        {careDesc && (
          <>
            <h5 style={{ marginTop: '24px' }}>Уход</h5>
            <p>{careDesc}</p>
          </>
        )}
      </div>
    </div>
  )
}