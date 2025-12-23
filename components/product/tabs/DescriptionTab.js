export default function DescriptionTab({ content, designer }) {
  return (
    <div className="tab-desciption__content">
      <h5>Описание</h5>
      {content.map((text, index) => (
        <p key={index} className={text.bold ? 'bold' : ''}>{text.text}</p>
      ))}
      {designer && (
        <>
          <p className="bold">Дизайнер</p>
          <p style={{marginBottom: '24px'}}>{designer}</p>
        </>
      )}
      <h5>Полезная информация</h5>
      {/* ... */}
    </div>
  );
}
