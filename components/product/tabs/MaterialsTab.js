export default function MaterialsTab({ product }) {
  const attr = product.attributes;

  return (
    <div className="tab-pane fade show active">
      <div className="tab-material__content">
        
        {/* Материалы */}
        <h5>Материалы</h5>
        
        {attr.materials ? (
          <div dangerouslySetInnerHTML={{ __html: attr.materials }} />
        ) : (
          <p>Информация о материалах временно отсутствует.</p>
        )}
        
        {/* Уход */}
        {attr.care_instructions && (
          <>
            <h5 style={{ marginTop: '24px' }}>Уход</h5>
            <div dangerouslySetInnerHTML={{ __html: attr.care_instructions }} />
          </>
        )}
        
        {/* Если данных о материалах и уходе нет */}
        {!attr.materials && !attr.care_instructions && (
          <p>Информация о материалах и уходе временно отсутствует.</p>
        )}
      </div>
    </div>
  );
}
