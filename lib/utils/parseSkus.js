// utils/parseSkus.js
export function cleanSkuArray(rawArray) {
  if (!rawArray || !Array.isArray(rawArray)) return [];
  
  // Если внутри первого элемента строки есть скобки и кавычки (битый JSON)
  if (typeof rawArray[0] === 'string' && rawArray[0].includes('[')) {
    try {
      // Склеиваем всё в одну строку и чистим от лишних символов, если это не валидный JSON
      const joined = rawArray.join('');
      const cleaned = joined.replace(/[\[\]\\"]/g, '').split(',');
      return cleaned.map(s => s.trim()).filter(Boolean);
    } catch (e) {
      return [];
    }
  }
  return rawArray;
}