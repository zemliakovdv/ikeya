"use client"

import { useState } from "react"

export function SeoSection({ title, visibleContent, hiddenContent }) {
  const [isExpanded, setIsExpanded] = useState(false)

  return (
    <section className="seo">
      <div className="container">
        <div className="row">
          <div className="col-12">
            <div className="seo-inner">
              <h5>{title}</h5>

              <div className="seo-text-content-visible">
                {visibleContent.map((text, index) => (
                  <p key={index}>{text}</p>
                ))}
              </div>

              <div
                className="seo-text-content"
                style={{ display: isExpanded ? "block" : "none" }}
              >
                {hiddenContent.map((text, index) => (
                  <p key={index}>{text}</p>
                ))}
              </div>

              <div className="seo-text-bottom">
                <div className="seo-text-bottom-btn">
                  {!isExpanded && (
                    <button
                      type="button"
                      className="button-text"
                      onClick={() => setIsExpanded(true)}
                    >
                      <div className="else-link">
                        <p>Показать полностью</p>
                      </div>
                    </button>
                  )}

                  {isExpanded && (
                    <button
                      type="button"
                      className="button-text-hidden"
                      onClick={() => setIsExpanded(false)}
                    >
                      <div className="else-link">
                        <p>Скрыть текст</p>
                      </div>
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
