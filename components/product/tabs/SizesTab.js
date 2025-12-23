export default function SizesTab({ sizes, packages, image }) {
  return (
    <div className="tab-size__content">
      <div className="size-contet__info">
        <h5>Размер в собранном виде</h5>
        {sizes.map((size, index) => (
          <div key={index} className="size-info__item">
            <p>{size.label}:</p>
            <p>{size.value}</p>
          </div>
        ))}

        <h5>Размер и вес упаковки</h5>
        <p>{packages.length} упаковок</p>
        <div className="size-info__double">
          {packages.map((pkg, index) => (
            <div key={index} className="size-double__item">
              <h6>{pkg.title}</h6>
              {pkg.details.map((detail, i) => (
                <div key={i} className="size-info__item">
                  <p>{detail.label}</p>
                  <p>{detail.value}</p>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
      {image && (
        <div className="size-content__banner">
          <img src={image} alt="Чертёж" />
        </div>
      )}
    </div>
  );
}
