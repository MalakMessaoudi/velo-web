'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/app/lib/api';
import { useCartStore } from '@/store/useCartStore';

export default function CheckoutPage() {
  const router = useRouter();
  const fetchCartStore = useCartStore((state) => state.fetchCart);

  const [form, setForm] = useState({
    shipping_address: '',
    shipping_city: '',
    phone_number: '',
  });

  const [subtotal, setSubtotal] = useState(0);
  const [couponCode, setCouponCode] = useState('');
  const [discount, setDiscount] = useState(0);
  const [appliedCode, setAppliedCode] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    api.get('/cart').then((res) => {
      if (!res.data.items || res.data.items.length === 0) {
        router.push('/cart');
      } else {
        setSubtotal(res.data.subtotal);
      }
    });
  }, [router]);

  const handleApplyCoupon = async () => {
    if (!couponCode) return;
    try {
      const res = await api.post('/coupons/validate', {
        code: couponCode,
        subtotal: subtotal,
      });
      setDiscount(res.data.discount_amount);
      setAppliedCode(res.data.code);
      alert(res.data.message);
    } catch (err: any) {
      alert(err.response?.data?.message || 'كود الخصم غير صالح');
    }
  };

  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await api.post('/checkout', {
        shipping_address: form.shipping_address,
        shipping_city: form.shipping_city,
        phone_number: form.phone_number,
        coupon_code: appliedCode || null,
      });

      await fetchCartStore();
      alert('تم تأكيد طلبك بنجاح!');
      router.push(`/profile`);
    } catch (err: any) {
      alert(err.response?.data?.message || 'تعذر إتمام عملية الدفع');
    } finally {
      setLoading(false);
    }
  };

  const total = Math.max(0, subtotal - discount);

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-extrabold text-slate-900 mb-8">إتمام عملية الشراء</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <form onSubmit={handleCheckout} className="space-y-4 bg-white p-6 border border-slate-200 rounded-xl">
          <h2 className="text-lg font-bold text-slate-900 mb-2">عنوان التوصيل</h2>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">المدينة</label>
            <input
              type="text"
              required
              value={form.shipping_city}
              onChange={(e) => setForm({ ...form, shipping_city: e.target.value })}
              className="w-full border border-slate-300 rounded-lg p-2.5 text-sm"
              placeholder="مثال: الدار البيضاء"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">العنوان بالتفصيل</label>
            <input
              type="text"
              required
              value={form.shipping_address}
              onChange={(e) => setForm({ ...form, shipping_address: e.target.value })}
              className="w-full border border-slate-300 rounded-lg p-2.5 text-sm"
              placeholder="الشارع، رقم العمارة، الشقة"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">رقم الهاتف</label>
            <input
              type="tel"
              required
              value={form.phone_number}
              onChange={(e) => setForm({ ...form, phone_number: e.target.value })}
              className="w-full border border-slate-300 rounded-lg p-2.5 text-sm"
              placeholder="06XXXXXXXX"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-4 py-3 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-lg transition-colors"
          >
            {loading ? 'جاري التأكيد...' : `تأكيد الطلب (${total.toLocaleString()} DH)`}
          </button>
        </form>

        <div className="bg-white p-6 border border-slate-200 rounded-xl h-fit space-y-4">
          <h2 className="text-lg font-bold text-slate-900">كود الخصم</h2>
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="أدخل كود الخصم (مثل WELCOME10)"
              value={couponCode}
              onChange={(e) => setCouponCode(e.target.value)}
              className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm uppercase"
            />
            <button
              type="button"
              onClick={handleApplyCoupon}
              className="bg-sky-600 hover:bg-sky-500 text-white text-sm font-bold px-4 py-2 rounded-lg"
            >
              تطبيق
            </button>
          </div>

          <div className="pt-4 border-t border-slate-100 space-y-2">
            <div className="flex justify-between text-slate-600 text-sm">
              <span>المجموع الجزئي:</span>
              <span>{subtotal.toLocaleString()} DH</span>
            </div>
            {discount > 0 && (
              <div className="flex justify-between text-emerald-600 text-sm">
                <span>الخصم ({appliedCode}):</span>
                <span>-{discount.toLocaleString()} DH</span>
              </div>
            )}
            <div className="flex justify-between font-black text-lg text-slate-900 pt-2 border-t">
              <span>المجموع الكلي:</span>
              <span>{total.toLocaleString()} DH</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}