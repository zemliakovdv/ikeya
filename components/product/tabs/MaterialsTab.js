export default function MaterialsTab({ materials, care }) {
  return (
    <div className="tab-material__content">
      <h5>Материалы</h5>
      {materials.map((material, index) => (
        <div key={index}>
          <p>{material.name}:</p>
          <ul>
            {material.items.map((item, i) => (
              <li key={i}>{item}</li>
            ))}
          </ul>
        </div>
      ))}

      {care && care.map((careSection, index) => (
        <div key={index}>
          <p>{careSection.title}</p>
          <ul style={{marginBottom: '16px'}}>
            {careSection.instructions.map((instruction, i) => (
              <li key={i}>{instruction}</li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}
