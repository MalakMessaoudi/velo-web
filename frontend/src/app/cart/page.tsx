'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import api from '@/app/lib/api';
import { useCartStore } from '@/store/useCartStore';
import { Trash2, ShoppingBag, ArrowRight } from 'lucide-react';

export default function CartPage() {
  const [cart, setCart] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const fetchCartStore = useCartStore((state) => state.fetchCart);

  const loadCart = async () => {
    try {
      const res = await api.get('/cart');
      setCart(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCart();
  }, []);

  const updateQuantity = async (itemId: number, newQty: number) => {
    if (newQty < 1) return;
    try {
      await api.put(`/cart/items/${itemId}`, { quantity: newQty });
      await loadCart();
      await fetchCartStore();
    } catch (err: any) {
      alert(err.response?.data?.message || 'خطأ أثناء تحديث الكمية');
    }
  };

  const removeItem = async (itemId: number) => {
    try {
      await api.delete(`/cart/items/${itemId}`);
      await loadCart();
      await fetchCartStore();
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return <div className="text-center py-20 text-slate-500">جاري تحميل السلة...</div>;

  if (!cart || cart.items.length === 0) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-24 text-center">
        <ShoppingBag className="w-16 h-16 text-slate-300 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-slate-900">سلة التسوق فارغة</h2>
        <p className="text-slate-500 mt-2">لم تقم بإضافة أي دراجة إلى سلتك بعد.</p>
        <Link
          href="/products"
          className="inline-flex items-center gap-2 mt-6 bg-sky-600 hover:bg-sky-500 text-white font-bold px-6 py-3 rounded-lg shadow"
        >
          تصفح المتجر <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-extrabold text-slate-900 mb-8">سلة المشتريات</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2 space-y-4">
          {cart.items.map((item: any) => {
            const price = Number(item.variant.product.base_price) + Number(item.variant.additional_price);
            return (
              <div
                key={item.id}
                className="flex items-center justify-between p-4 bg-white border border-slate-200 rounded-xl shadow-sm"
              >
                <div className="flex flex-col">
                  <span className="font-bold text-slate-900">{item.variant.product.name}</span>
                  <span className="text-xs text-slate-500">
                    مقاس: {item.variant.frame_size} | اللون: {item.variant.color}
                  </span>
                  <span className="text-sm font-semibold text-sky-600 mt-1">
                    {price.toLocaleString()} DH
                  </span>
                </div>

                <div className="flex items-center gap-6">
                  <div className="flex items-center border border-slate-200 rounded-lg">
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      className="px-3 py-1 text-slate-600 hover:bg-slate-50"
                    >
                      -
                    </button>
                    <span className="px-3 py-1 font-semibold text-sm">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className="px-3 py-1 text-slate-600 hover:bg-slate-50"
                    >
                      +
                    </button>
                  </div>

                  <button
                    onClick={() => removeItem(item.id)}
                    className="text-red-500 hover:text-red-700 p-2"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm h-fit">
          <h2 className="text-lg font-bold text-slate-900 mb-4">ملخص الطلب</h2>
          <div className="flex justify-between text-slate-600 mb-2">
            <span>المجموع الجزئي</span>
            <span>{Number(cart.subtotal).toLocaleString()} DH</span>
          </div>
          <div className="flex justify-between text-slate-600 mb-4 pb-4 border-b border-slate-100">
            <span>الشحن</span>
            <span className="text-emerald-600 font-medium">مجاني</span>
          </div>
          <div className="flex justify-between text-lg font-black text-slate-900 mb-6">
            <span>الإجمالي</span>
            <span>{Number(cart.subtotal).toLocaleString()} DH</span>
          </div>

          <Link
            href="/checkout"
            className="block text-center w-full py-3 bg-sky-600 hover:bg-sky-500 text-white font-bold rounded-lg shadow-md transition-colors"
          >
            متابعة الدفع
          </Link>
        </div>
      </div>
    </div>
  );
}
