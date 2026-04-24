'use client';

import ReviewItem from '@/components/profile/ReviewItem';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'https://test.ikeya.by/api/v1';

async function deleteReview(id, token) {
  const res = await fetch(`${API_BASE}/reviews/${id}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error('Не удалось удалить отзыв');
}

export default function ReviewList({ reviews, token, onDelete }) {
  async function handleDelete(id) {
    try {
      await deleteReview(id, token);
      onDelete(id);
    } catch (e) {
      console.error(e.message);
    }
  }

  return (
    <div className="review-list">
      {reviews.map((review) => (
        <ReviewItem
          key={review.id}
          review={review}
          onDelete={handleDelete}
        />
      ))}
    </div>
  );
}