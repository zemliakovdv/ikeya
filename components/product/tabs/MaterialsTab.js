export default function MaterialsTab({ product }) {
  const fa = product?.attributes?.full_attributes_ru || {};
  const materialsData = fa.materials || {};

  const careDesc = typeof materialsData.desc === 'string'
    ? materialsData.desc.trim()
    : '';

  const rawMaterials = materialsData.materials;
  const materials = rawMaterials && typeof rawMaterials === 'object' && !Array.isArray(rawMaterials)
    ? rawMaterials
    : {};

  const materialEntries = Object.entries(materials)
    .filter(([, value]) => {
      if (value === undefined || value === null) return false;
      return String(value).trim() !== '';
    });

  if (!careDesc && materialEntries.length === 0) {
    return (
      <div className="tab-pane fade show active">
        <div className="tab-material__content">
          <p>Информация о материалах временно отсутствует.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="tab-pane fade show active">
      <div className="tab-material__content">

        {materialEntries.length > 0 && (
          <>
            <h2 className="tab-material__title">Материалы</h2>

            <div className="tab-material__list">
              {materialEntries.map(([part, value]) => (
                <div key={part} className="tab-material__item">
                  <p className="tab-material__label">
                    <strong>{part}:</strong>
                  </p>
                  <p className="tab-material__value">{String(value).trim()}</p>
                </div>
              ))}
            </div>
          </>
        )}

        {careDesc && (
          <div className="tab-material__care">
            <h2 className="tab-material__title">Уход</h2>
            <p className="tab-material__care-text">{careDesc}</p>
          </div>
        )}

      </div>
    </div>
  );
}