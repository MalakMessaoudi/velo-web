'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/app/lib/api';
import { Package, Download, User, CheckCircle2, Clock } from 'lucide-react';

export default function ProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
      return;
    }

    Promise.all([api.get('/me'), api.get('/orders')])
      .then(([userRes, ordersRes]) => {
        setUser(userRes.data.user);
        setOrders(ordersRes.data.data || []);
      })
      .catch(() => {
        localStorage.removeItem('token');
        router.push('/login');
      })
      .finally(() => setLoading(false));
  }, [router]);

  const handleDownloadInvoice = async (orderId: number, orderNumber: string) => {
    try {
      const response = await api.get(`/orders/${orderId}/invoice`, {
        responseType: 'blob',
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `invoice-${orderNumber}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      alert('تعذر تحميل الفاتورة حالياً.');
    }
  };

  if (loading) return <div className="text-center py-20 text-slate-500">جاري تحميل بيانات الحساب...</div>;

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* User Header */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 mb-8 flex items-center gap-4 shadow-sm">
        <div className="w-16 h-16 bg-sky-100 text-sky-600 rounded-full flex items-center justify-center font-bold text-2xl">
          <User className="w-8 h-8" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-slate-900">{user?.name}</h1>
          <p className="text-sm text-slate-500">{user?.email}</p>
        </div>
      </div>

      {/* Orders List */}
      <div>
        <h2 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
          <Package className="w-5 h-5 text-sky-600" /> طلباتي السابقة
        </h2>

        {orders.length === 0 ? (
          <div className="bg-white border border-slate-200 rounded-xl p-8 text-center text-slate-500">
            لا توجد طلبات مسجلة باسمك حتى الآن.
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <div
                key={order.id}
                className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm flex flex-col md:flex-row justify-between md:items-center gap-4"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-3">
                    <span className="font-extrabold text-slate-900">{order.order_number}</span>
                    <span className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200">
                      <Clock className="w-3 h-3" /> {order.status}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400">
                    تاريخ الطلب: {new Date(order.created_at).toLocaleDateString('ar-MA')}
                  </p>
                  <p className="text-sm font-semibold text-slate-800">
                    الإجمالي: {Number(order.total_amount).toLocaleString()} DH
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    onClick={() => handleDownloadInvoice(order.id, order.order_number)}
                    className="flex items-center gap-2 px-4 py-2 border border-slate-200 hover:bg-slate-50 rounded-lg text-sm font-semibold text-slate-700 transition-colors"
                  >
                    <Download className="w-4 h-4 text-sky-600" /> تحميل الفاتورة (PDF)
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}