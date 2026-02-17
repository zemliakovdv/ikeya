// lib/utils/productHelpers.js
export function getRelatedAndSimilarProducts(currentProduct, allProducts) {
  const currentCategoryId = currentProduct.attributes.category_id;
  
  // Блок 1: "К этому товару подходят" — товары из той же категории, исключая текущий
  const relatedProducts = allProducts
    .filter(p => 
      p.attributes.category_id === currentCategoryId && 
      p.attributes.sku !== currentProduct.attributes.sku
    )
    .slice(0, 10); // Максимум 10 товаров

  // Блок 2: "Похожие товары" — товары из тех же родительских категорий
  const parentCategoryIds = currentProduct.relationships?.categories?.data?.map(cat => cat.id) || [];
  const similarProducts = allProducts
    .filter(p => {
      const pParentIds = p.relationships?.categories?.data?.map(cat => cat.id) || [];
      return pParentIds.some(id => parentCategoryIds.includes(id)) && 
             p.attributes.sku !== currentProduct.attributes.sku &&
             p.attributes.category_id !== currentCategoryId; // Не дублировать с related
    })
    .slice(0, 10);

  return { relatedProducts, similarProducts };
}
