import Link from 'next/link';

export default function AdvicesTab({ advices }) {
  return (
    <div className="tab-advices__content">
      <h5>Советы и лайфхаки</h5>
      <div className="advices-content__cards">
        {advices.map((advice, index) => (
          <div key={index} className="advices-cards__item">
            <img src={advice.image} alt={advice.title} />
            <div className="advices-cards__info">
              <p>{advice.title}</p>
              <span>{advice.description}</span>
              <Link href={advice.link}>
                Читать статью{' '}
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="M12.775 9.99877C12.775 10.9321 10.2417 13.1654 8.125 14.8738C7.88334 15.0654 7.53334 15.0321 7.34167 14.7904C7.15 14.5488 7.18333 14.1988 7.425 14.0071C9.28333 12.5071 11.375 10.5904 11.65 9.99877C11.375 9.40711 9.28333 7.49044 7.425 5.99044C7.18333 5.79877 7.15 5.44877 7.34167 5.20711C7.53334 4.96544 7.88334 4.93211 8.125 5.12377C10.25 6.83211 12.775 9.07377 12.775 9.99877Z"
                    fill="#0058A3"
                  />
                </svg>
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
