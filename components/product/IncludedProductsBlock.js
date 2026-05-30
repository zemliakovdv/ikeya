// components/product/IncludedProductsBlock.js
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { resolveImageUrl } from '@/lib/api/ikea';

const PLACEHOLDER_IMAGE = '/assets/img/no-image.jpg';

function parsePrice(value) {
  const normalized = String(value ?? 0)
    .replace(/\s/g, '')
    .replace(',', '.');

  const parsed = Number.parseFloat(normalized);
  return Number.isFinite(parsed) ? parsed : 0;
}

function buildProductPath(product) {
  const attr = product?.attributes || {};
  const sku = attr.sku || product?.id;

  if (!sku) return '#';

  return attr.slug
    ? `/product/${attr.slug}-${sku}`
    : `/product/${sku}`;
}

function getProductImage(product) {
  const images = product?.attributes?.local_images;
  const firstImage = Array.isArray(images) ? images.find(Boolean) : null;

  return resolveImageUrl(firstImage) || PLACEHOLDER_IMAGE;
}

/**
 * IncludedProductsBlock — блок «Комплектующие»
 * Получает массив групп: [{ groupName, products[] }]
 * Каждая группа — кнопка, по клику открывается offcanvas со списком товаров.
 */
export default function IncludedProductsBlock({ groups = [] }) {
  const router = useRouter();
  const [openGroup, setOpenGroup] = useState(null);

  if (!groups.length) return null;

  const activeGroup = openGroup !== null ? groups[openGroup] : null;

  return (
    <>
      <div className="goods-add">
        {groups.map((group, index) => {
          const firstProduct = group.products[0];
          const firstName = firstProduct?.attributes?.name_ru || '—';

          return (
            <button
              key={index}
              className="goods-add__item"
              type="button"
              onClick={() => setOpenGroup(index)}
            >
              <div className="add-item__content">
                <div className="add-item__top">
                  <p>{group.groupName}</p>
                  <span>{group.products.length}</span>
                </div>
                <p>{firstName}</p>
              </div>

              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M15.33 12.0005C15.33 13.1205 12.29 15.8005 9.75003 17.8505C9.46003 18.0805 9.04003 18.0405 8.81003 17.7505C8.58003 17.4605 8.62003 17.0405 8.91003 16.8105C11.14 15.0105 13.65 12.7105 13.98 12.0005C13.65 11.2905 11.14 8.99048 8.91003 7.19048C8.62003 6.96048 8.58003 6.54048 8.81003 6.25048C9.04003 5.96048 9.46003 5.92048 9.75003 6.15048C12.3 8.20048 15.33 10.8905 15.33 12.0005Z" fill="#181818" />
              </svg>
            </button>
          );
        })}
      </div>

      {activeGroup && (
        <div
          className="modal-backdrop fade show"
          style={{ zIndex: 1040 }}
          onClick={() => setOpenGroup(null)}
        />
      )}

      <div
        className={`offcanvas offcanvas-end included-products-offcanvas${activeGroup ? ' show' : ''}`}
        tabIndex="-1"
        style={{ visibility: activeGroup ? 'visible' : 'hidden', zIndex: 10060 }}
      >
        {activeGroup && (
          <>
            <div className="offcanvas-header">
              <h5 className="offcanvas-title">{activeGroup.groupName}</h5>
              <button
                type="button"
                className="btn-close"
                onClick={() => setOpenGroup(null)}
                aria-label="Закрыть"
              />
            </div>

            <div className="offcanvas-body">
              <div className="offcanvas-nogki__modal">
                <div className="nogki-modal__content">
                  {activeGroup.products.map((product) => {
                    const pAttr = product?.attributes || {};
                    const pSku = pAttr.sku || product?.id;
                    const pName = pAttr.small_desc_name || pAttr.name_ru || '—';
                    const pImg = getProductImage(product);
                    const pPrice = parsePrice(pAttr.price_byn);
                    const diffStr = pPrice > 0
                      ? `${pPrice.toFixed(2).replace('.', ',')} р.`
                      : '';

                    return (
                      <button
                        key={pSku}
                        className="nogki-item"
                        type="button"
                        onClick={() => {
                          const path = buildProductPath(product);
                          if (path === '#') return;

                          setOpenGroup(null);
                          router.push(path);
                        }}
                      >
                        <img
                          src={pImg}
                          alt={pName}
                          onError={(event) => {
                            event.currentTarget.src = PLACEHOLDER_IMAGE;
                          }}
                        />
                        <p>{pName}</p>
                        {diffStr && <span>{diffStr}</span>}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </>
  );
}