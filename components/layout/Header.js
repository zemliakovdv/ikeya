import Link from "next/link"

export function Header({ topMenu, categories, favoritesCount, cartCount }) {
  return (
    <header className="header">
      {/* Верхняя полоса */}
      <div className="header-top">
        <div className="container">
          <div className="row">
            <div className="col-12">
              <div className="header-top-inner">
                <nav className="header-top-menu">
                  <ul>
                    {topMenu.map((item, index) => (
                      <li key={index}>
                        <Link href={item.href}>{item.label}</Link>
                      </li>
                    ))}
                  </ul>
                </nav>
                <div className="header-top-phone">
                  <a href="tel:2626">
                    <img src="/assets/img/icons/header-short-phone.svg" alt="Телефон" />
                    2626
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Средняя полоса */}
      <div className="header-middle">
        <div className="container">
          <div className="row">
            <div className="col-12">
              <div className="header-middle-inner">
                <div className="header-middle-start">
                  <Link href="/" className="logo">
                    <img src="/assets/img/logo.svg" alt="Логотип" />
                  </Link>
                  <button id="catalogButton" className="catalog-btn" type="button">
                    <img src="/assets/img/icons/catalog-button.svg" alt="Каталог" />
                    <p>Каталог</p>
                  </button>
                  <Link href="#">Услуги</Link>
                </div>

                <div className="header-middle-search">
                  <form className="middle-searh-inner">
                    <input
                      type="search"
                      placeholder="Поиск по названию, артикулу"
                      id="search-form"
                    />
                    <button type="submit" className="search-but">
                      <img src="/assets/img/icons/header-search.svg" alt="Поиск" />
                    </button>
                  </form>
                </div>

                <div className="header-middle-panel">
                  <div className="header-panel-item">
                    <Link href="/favorites" className="panel-item-button">
                      <img src="/assets/img/icons/header-favorite.svg" alt="Избранное" />
                      <p>Избранное</p>
                      <span>{favoritesCount}</span>
                    </Link>
                  </div>
                  <div className="header-panel-item">
                    <button
                      type="button"
                      className="panel-item-button"
                      data-bs-toggle="modal"
                      data-bs-target="#loginModal"
                    >
                      <img src="/assets/img/icons/header-profile.svg" alt="Профиль" />
                      <p>Войти</p>
                      <span>0</span>
                    </button>
                  </div>
                  <div className="header-panel-item">
                    <Link href="/cart" className="panel-item-button">
                      <img src="/assets/img/icons/header-card.svg" alt="Корзина" />
                      <p>Корзина</p>
                      <span>{cartCount}</span>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Нижняя полоса */}
      <div className="header-bottom">
        <div className="container">
          <div className="row">
            <div className="col-12">
              <nav className="header-bottom-inner">
                {categories.map((cat, index) => (
                  <Link key={index} href={cat.href}>
                    {cat.label}
                  </Link>
                ))}
              </nav>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}
