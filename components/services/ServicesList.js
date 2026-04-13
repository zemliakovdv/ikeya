// components/services/ServicesList.js

const SERVICES = [
  { image: '/assets/img/uslugi/deliveres.png', label: 'Доставка' },
  { image: '/assets/img/uslugi/podiem.png',    label: 'Подъем до двери' },
  { image: '/assets/img/uslugi/sborka.png',    label: 'Сборка мебели' },
];

export default function ServicesList() {
  return (
    <section className="uslugi-list">
      <div className="container">
        <div className="row">
          <div className="col-12">
            <div className="uslugi-list_inner">
              <div className="uslugi-list_items">
                {SERVICES.map((service) => (
                  <div key={service.label} className="uslugi-item_point">
                    <img src={service.image} alt={service.label} />
                    <p>{service.label}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}