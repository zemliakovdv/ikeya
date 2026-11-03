'use client'

import { useEffect, useRef, useState } from 'react'

function promoteFirstH2ToH1(html) {
  if (!html || /<h1[\s>]/i.test(html)) return html

  // Первый заголовок SEO-блока на главной должен быть H1.
  return html.replace(/<h2(\b[^>]*)>([\s\S]*?)<\/h2>/i, '<h1$1>$2</h1>')
}

export default function SeoSection({ seoText }) {
  const [isExpanded, setIsExpanded] = useState(false)
  const [needsToggle, setNeedsToggle] = useState(false)
  const contentRef = useRef(null)

  const html = promoteFirstH2ToH1(typeof seoText === 'string' ? seoText.trim() : '')

  useEffect(() => {
    const el = contentRef.current
    if (!el) return
    setNeedsToggle(el.scrollHeight > el.clientHeight)
  }, [html])

  if (!html) return null

  return (
    <section className="seo">
      <div className="container">
        <div className="row">
          <div className="col-12">
            <div className="seo-inner">
              <div
                ref={contentRef}
                id="seo-text-content"
                className={`seo-text-content ${isExpanded ? 'seo-text-content--expanded' : ''}`}
                dangerouslySetInnerHTML={{ __html: html }}
              />

              {needsToggle && (
                <div className="seo-text-bottom">
                  <button
                    className="seo-text-bottom-btn"
                    type="button"
                    onClick={() => setIsExpanded((prev) => !prev)}
                    aria-expanded={isExpanded}
                    aria-controls="seo-text-content"
                  >
                    <span className="button-text">
                      <span className="else-link">
                        <span>{isExpanded ? 'Скрыть текст' : 'Показать полностью'}</span>
                      </span>
                    </span>
                  </button>
                </div>
              )}

            </div>
          </div>
        </div>
      </div>
    </section>
  )
}