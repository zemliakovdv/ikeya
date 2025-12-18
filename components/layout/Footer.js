import Link from "next/link"

export function Footer({
  logoSrc,
  logoAlt,
  socialLinks,
  navigationColumns,
  paymentImageSrc,
  paymentImageAlt,
  legalInfo,
}) {
  return (
    <footer className="footer">
      <div className="container">
        <div className="row">
          <div className="col-12">
            <div className="footer-inner">
              <div className="footer-top">
                <div className="footer-links">
                  <Link href="/" className="footer-logo">
                    <img src={logoSrc} alt={logoAlt} />
                  </Link>
                  <p>Мы в социальных сетях:</p>
                  <div className="footer-links__social">
                    {socialLinks.map((social, index) => (
                      <a key={index} href={social.href}>
                        <img src={social.iconSrc} alt={social.alt} />
                      </a>
                    ))}
                  </div>
                </div>

                <div className="footer-navigation">
                  {navigationColumns.map((column, index) => (
                    <div key={index} className="footer-navigation-list">
                      <h5>{column.title}</h5>
                      <ul>
                        {column.links.map((link, linkIndex) => (
                          <li key={linkIndex}>
                            <Link href={link.href}>{link.label}</Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>

                <div className="footer-payment">
                  <h5>Платежные системы</h5>
                  <img src={paymentImageSrc} alt={paymentImageAlt} />
                </div>
              </div>

              <div className="footer-bottom">
                {legalInfo.map((text, index) => (
                  <p key={index}>{text}</p>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
