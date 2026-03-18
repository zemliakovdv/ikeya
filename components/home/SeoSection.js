'use client'

import { useState } from 'react'

export default function SeoSection({ seoText }) {
  const [isExpanded, setIsExpanded] = useState(false)

  if (!seoText) return null

  return (
    <section className="seo">
      <div className="container">
        <div className="row">
          <div className="col-12">
            <div className="seo-inner">
              {/* Весь текст всегда в DOM, без display:none */}
              <div
                className={`seo-text-content ${isExpanded ? 'seo-text-content--expanded' : ''}`}
                dangerouslySetInnerHTML={{ __html: seoText }}
              />

              <div className="seo-text-bottom">
                <div
                  className="seo-text-bottom-btn"
                  onClick={() => setIsExpanded(prev => !prev)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => e.key === 'Enter' && setIsExpanded(prev => !prev)}
                >
                  <div className="button-text">
                    <div className="else-link">
                      <p>{isExpanded ? 'Скрыть текст' : 'Показать полностью'}</p>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
