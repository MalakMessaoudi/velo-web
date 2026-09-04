'use client';

import { useState } from 'react';
import api from '@/app/lib/api';
import { Star } from 'lucide-react';

export default function ReviewForm({ productId, onReviewAdded }: { productId: number; onReviewAdded: () => void }) {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await api.post(`/products/${productId}/reviews`, { rating, comment });
      setComment('');
      alert('تم نشر تقييمك بنجاح');
      onReviewAdded();
    } catch (err: any) {
      alert(err.response?.data?.message || 'يجب تسجيل الدخول لإضافة تقييم');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-slate-50 p-6 rounded-xl border border-slate-200 mt-6 space-y-4">
      <h3 className="font-bold text-slate-900">أضف تقييمك لهذه الدراجة</h3>

      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            type="button"
            key={star}
            onClick={() => setRating(star)}
            className="text-amber-400 focus:outline-none"
          >
            <Star className={`w-6 h-6 ${rating >= star ? 'fill-current' : 'stroke-current fill-none'}`} />
          </button>
        ))}
      </div>

      <textarea
        required
        rows={3}
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        placeholder="شاركنا رأيك حول أداء الدراجة وجودتها..."
        className="w-full border border-slate-300 rounded-lg p-3 text-sm focus:outline-sky-500"
      />

      <button
        type="submit"
        disabled={submitting}
        className="px-6 py-2 bg-slate-900 text-white rounded-lg text-sm font-bold hover:bg-slate-800"
      >
        {submitting ? 'جاري الإرسال...' : 'إرسال التقييم'}
      </button>
    </form>
  );
}