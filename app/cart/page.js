import CartRecommendations from '@/components/cart/CartRecommendations';
import CartPageClient from '@/components/cart/CartPageClient';

export default function CartPage() {
  return (
    <>
      <CartPageClient />
      <div style={{ backgroundColor: '#FAFAFA' }}>
        <CartRecommendations />
      </div>
    </>
  );
}