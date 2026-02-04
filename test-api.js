// test-api.js
const API_BASE_URL = 'http://45.135.234.22/api/v1';

async function testAPI() {
  try {
    console.log('🔍 Проверяем API...\n');

    // Тест 1: Популярные категории
    console.log('📁 Получаем популярные категории...');
    const categoriesResponse = await fetch(`${API_BASE_URL}/categories/popular`);
    const categoriesData = await categoriesResponse.json();
    console.log('✅ Категории:', categoriesData.data?.length || 0, 'шт.');
    console.log('Пример:', categoriesData.data?.[0]?.attributes?.name, '\n');

    // Тест 2: Товары
    console.log('📦 Получаем товары...');
    const productsResponse = await fetch(`${API_BASE_URL}/products?page=1&per_page=5`);
    const productsData = await productsResponse.json();
    console.log('✅ Товары:', productsData.data?.length || 0, 'шт.');
    console.log('Пример:', productsData.data?.[0]?.attributes?.name, '\n');

    console.log('🎉 API работает отлично!');
  } catch (error) {
    console.error('❌ Ошибка:', error.message);
  }
}

testAPI();
