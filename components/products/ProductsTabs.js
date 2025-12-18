"use client"

import { useState } from "react"
import { ProductsSlider } from "./ProductsSlider"

export function ProductsTabs({ title, tabs, productsByKey }) {
  const [activeKey, setActiveKey] = useState(tabs[0]?.key ?? "")

  return (
    <section className="products-tabs">
      <div className="container">
        <div className="row">
          <div className="col-12">
            <h2>{title}</h2>

            <ul className="nav products-tabs__nav" role="tablist">
              {tabs.map((tab) => (
                <li className="nav-item" role="presentation" key={tab.id}>
                  <button
                    type="button"
                    className={
                      "nav-link products-tabs__link" +
                      (activeKey === tab.key ? " active" : "")
                    }
                    role="tab"
                    aria-selected={activeKey === tab.key}
                    onClick={() => setActiveKey(tab.key)}
                  >
                    {tab.label}
                  </button>
                </li>
              ))}
            </ul>

            <div className="tab-content products-tabs__content">
              {tabs.map((tab) => (
                <div
                  key={tab.id}
                  className={
                    "tab-pane fade" +
                    (activeKey === tab.key ? " show active" : "")
                  }
                  role="tabpanel"
                >
                  <div className="products-card-slider">
                    <ProductsSlider products={productsByKey[tab.key] ?? []} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
