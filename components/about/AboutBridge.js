// components/about/AboutBridge.js

export default function AboutBridge() {
  return (
    <section
      className="bridge"
      style={{ backgroundImage: 'url(/assets/img/about/bridge.png)' }}
    >
      <div className="container">
        <div className="row">
          <div className="col-12">
            <div className="bridge-text">
              <h2 className="the_blues">
                Мы — ваш <span>мост к любимым товарам IKEA</span>
              </h2>
              <p>
                IKEYA.BY — это не просто доставка. Это сервис, где совмещены широкий ассортимент,
                удобство, индивидуальные решения и надёжная логистика. Вы выбираете — мы воплощаем.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}