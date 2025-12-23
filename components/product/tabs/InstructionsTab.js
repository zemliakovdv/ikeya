export default function InstructionsTab({ assembly, recommendations }) {
  const PDFIcon = () => (
    <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
      <path d="M14 4C12.62 4 11.5 5.12 11.5 6.5V41.5C11.5 42.88 12.62 44 14 44H39C40.38 44 41.5 42.88 41.5 41.5V14L31.5 4H14Z" fill="#E2E5E7" />
      <path d="M34 14H41.5L31.5 4V11.5C31.5 12.88 32.62 14 34 14Z" fill="#B0B7BD" />
      <path d="M36.5 36.4998C36.5 37.1798 35.94 37.7398 35.26 37.7398H7.76C7.08 37.7398 6.52 37.1798 6.52 36.4998V23.9998C6.52 23.3198 7.08 22.7598 7.76 22.7598H35.26C35.94 22.7598 36.5 23.3198 36.5 23.9998V36.4998Z" fill="#F15642" />
      <path d="M11.94 27.6805C11.94 27.3605 12.2 26.9805 12.62 26.9805H14.92C16.22 26.9805 17.38 27.8405 17.38 29.5205C17.38 31.1005 16.22 31.9805 14.92 31.9805H13.26V33.3005C13.26 33.7405 12.98 33.9805 12.62 33.9805C12.3 33.9805 11.94 33.7405 11.94 33.3005V27.6805ZM13.26 28.2405V30.7405H14.92C15.6 30.7405 16.12 30.1405 16.12 29.5205C16.12 28.8205 15.6 28.2405 14.92 28.2405H13.26Z" fill="white" />
    </svg>
  );

  return (
    <div className="tab-instrustions__content">
      <h5>Инструкции по сборке</h5>
      <div className="instrustions-content__files">
        {assembly.map((file, index) => (
          <div key={index} className="content-files__item">
            <PDFIcon />
            <div className="content-files__info">
              <p>{file.title}</p>
              <p className="artikul">Артикул: <span>{file.sku}</span></p>
            </div>
          </div>
        ))}
      </div>

      {recommendations && (
        <>
          <h5>Советы и рекомендации по использованию и уходу</h5>
          <div className="instrustions-content__files">
            {recommendations.map((file, index) => (
              <div key={index} className="content-files__item">
                <PDFIcon />
                <div className="content-files__info">
                  <p>{file.title}</p>
                  <p className="artikul">Артикул: <span>{file.sku}</span></p>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
