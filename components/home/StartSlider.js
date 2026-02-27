'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { getMainSliderBanners, IMAGES_BASE_URL } from '@/lib/api/ikea'

export default function StartSlider() {
  const [slides, setSlides] = useState([])
  const [loading, setLoading] = useState(true)
  const [sliderType, setSliderType] = useState(null) // 'single' или 'triple'

  useEffect(() => {
    async function loadBanners() {
      const { data } = await getMainSliderBanners()
      
      if (data.length === 0) {
        setLoading(false)
        return
      }

      // Определяем тип слайдера по первому баннеру
      const firstVariant = data[0]?.attributes?.variant
      if (firstVariant === 'main_1500x516') {
        setSliderType('single')
        // Сортируем по position
        const sorted = [...data].sort((a, b) => a.attributes.position - b.attributes.position)
        setSlides(sorted)
      } else if (firstVariant === 'main_572x594') {
        setSliderType('triple')
        // Сортируем по position
        const sorted = [...data].sort((a, b) => a.attributes.position - b.attributes.position)
        // Группируем по 3
        const grouped = []
        for (let i = 0; i < sorted.length; i += 3) {
          grouped.push(sorted.slice(i, i + 3))
        }
        setSlides(grouped)
      }

      setLoading(false)
    }

    loadBanners()
  }, [])

  useEffect(() => {
    if (loading || slides.length === 0 || typeof window === 'undefined') return

    // Инициализация Swiper после рендера слайдов
    import('swiper').then(({ default: Swiper }) => {
      import('swiper/modules').then(({ Navigation, Pagination }) => {
        new Swiper('.start-slider__swiper', {
          modules: [Navigation, Pagination],
          slidesPerView: 1,
          spaceBetween: 0,
          loop: true,
          pagination: {
            el: '.start-slider__pagination',
            clickable: true,
          },
          navigation: {
            nextEl: '.start-slider__nav-next',
            prevEl: '.start-slider__nav-prev',
          },
        })
      })
    })
  }, [loading, slides])

  if (loading) return <div className="start-slider-loader">Загрузка...</div>
  if (slides.length === 0) return null

  const getLinkUrl = (banner) => {
    if (banner.attributes.link_url) return banner.attributes.link_url
    const categoryId = banner.relationships?.category?.data?.id
    return categoryId ? `/catalog/${categoryId}` : '#'
  }

  const getImageUrl = (banner) => {
    const url = banner.attributes.image_url
    if (url.startsWith('http')) return url
    return `${IMAGES_BASE_URL}${url}`
  }

  const getAltText = (index) => `Баннер ${index + 1}`

  return (
    <section className="start-slider">
      <div className="container">
        <div className="row">
          <div className="col-12">
            <div className="start-slider-inner">
              <div className="swiper start-slider__swiper">
                <div className="swiper-wrapper">
                  {sliderType === 'single' && slides.map((banner, idx) => (
                    <div className="swiper-slide" key={banner.id || idx}>
                      <Link href={getLinkUrl(banner)}>
                        <img src={getImageUrl(banner)} alt={getAltText(idx)} />
                      </Link>
                    </div>
                  ))}

                  {sliderType === 'triple' && slides.map((group, groupIdx) => (
                    <div className="swiper-slide" key={groupIdx}>
                      <div className="triple-banners">
                        {group.map((banner, i) => (
                          <Link key={banner.id || i} href={getLinkUrl(banner)} className="triple-banner-item">
                            <img src={getImageUrl(banner)} alt={getAltText(groupIdx * 3 + i)} />
                          </Link>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="start-slider__pagination"></div>

              <div className="start-slider__nav-prev">
                <svg width="6.67" height="12" viewBox="0 0 7 12" fill="none">
                  <path d="M6 1L1 6L6 11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <div className="start-slider__nav-next">
                <svg width="6.67" height="12" viewBox="0 0 7 12" fill="none">
                  <path d="M1 11L6 6L1 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}