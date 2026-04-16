export default function InstructionsTab({ product }) {
  const fa = product?.attributes?.full_attributes_ru || {}
  const files = fa.instructions?.files || []
  const attr = product.attributes

  // SVG иконка PDF
  const PdfIcon = () => (
    <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M14 4C12.62 4 11.5 5.12 11.5 6.5V41.5C11.5 42.88 12.62 44 14 44H39C40.38 44 41.5 42.88 41.5 41.5V14L31.5 4H14Z"
        fill="#E2E5E7"
      />
      <path d="M34 14H41.5L31.5 4V11.5C31.5 12.88 32.62 14 34 14Z" fill="#B0B7BD" />
      <path
        d="M36.5 36.4998C36.5 37.1798 35.94 37.7398 35.26 37.7398H7.76C7.08 37.7398 6.52 37.1798 6.52 36.4998V23.9998C6.52 23.3198 7.08 22.7598 7.76 22.7598H35.26C35.94 22.7598 36.5 23.3198 36.5 23.9998V36.4998Z"
        fill="#F15642"
      />
      <path
        d="M11.94 27.6805C11.94 27.3605 12.2 26.9805 12.62 26.9805H14.92C16.22 26.9805 17.38 27.8405 17.38 29.5205C17.38 31.1005 16.22 31.9805 14.92 31.9805H13.26V33.3005C13.26 33.7405 12.98 33.9805 12.62 33.9805C12.3 33.9805 11.94 33.7405 11.94 33.3005V27.6805ZM13.26 28.2405V30.7405H14.92C15.6 30.7405 16.12 30.1405 16.12 29.5205C16.12 28.8205 15.6 28.2405 14.92 28.2405H13.26Z"
        fill="white"
      />
      <path
        d="M19.36 34.0001C19.04 34.0001 18.66 33.8201 18.66 33.3801V27.7001C18.66 27.3401 19.02 27.0801 19.36 27.0801H21.64C26.2 27.0801 26.1 34.0001 21.72 34.0001H19.34H19.36ZM19.98 28.3001V32.7801H21.64C24.34 32.7801 24.46 28.3001 21.64 28.3001H19.98Z"
        fill="white"
      />
      <path
        d="M27.74 28.3805V29.9605H30.28C30.64 29.9605 31 30.3205 31 30.6605C31 30.9805 30.64 31.2605 30.28 31.2605H27.74V33.3605C27.74 33.7205 27.5 33.9805 27.14 33.9805C26.7 33.9805 26.44 33.7205 26.44 33.3605V27.6805C26.44 27.3205 26.7 27.0605 27.14 27.0605H30.64C31.08 27.0605 31.34 27.3205 31.34 27.6805C31.34 28.0005 31.08 28.3605 30.64 28.3605H27.74V28.3805Z"
        fill="white"
      />
    </svg>
  );

  return (
    <div className="tab-pane fade show active">
      <div className="tab-instrustions__content">
        
        {/* Инструкции по сборке */}
        <h5>Инструкции по сборке</h5>
        {files.length > 0 ? (
          <div className="instrustions-content__files">
            {files.map((file, index) => (
              <a
                key={index}
                href={`https://test.ikeya.by${file.link}`}
                target="_blank"
                rel="noopener noreferrer"
                className="content-files__item"
              >
                <PdfIcon />
                <div className="content-files__info">
                  <p>{file.title || attr.name_ru || attr.name}</p>
                  <p className="artikul">Артикул: <span>{attr.sku}</span></p>
                </div>
              </a>
            ))}
          </div>
        ) : (
          <p>Инструкции по сборке временно отсутствуют.</p>
        )}
      </div>
    </div>
  );
}