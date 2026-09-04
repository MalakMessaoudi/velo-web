'use client';

import { useEffect, useState } from 'react';
import api from '@/app/lib/api';
import { PackageCheck, RefreshCw, AlertCircle } from 'lucide-react';

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<number | null>(null);

  const fetchOrders = async () => {
    try {
      const res = await api.get('/admin/orders');
      setOrders(res.data.data || []);
    } catch (err) {
      console.error('Failed to load admin orders', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleStatusChange = async (orderId: number, newStatus: string) => {
    setUpdatingId(orderId);
    try {
      await api.patch(`/admin/orders/${orderId}/status`, { status: newStatus });
      await fetchOrders();
    } catch (err) {
      alert('فشل تحديث حالة الطلب');
    } finally {
      setUpdatingId(null);
    }
  };

  if (loading) return <div className="text-center py-20 text-slate-500">جاري تحميل الطلبات...</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-black text-slate-900">إدارة طلبات المتجر</h1>
          <p className="text-sm text-slate-500">متابعة شحن وتوصيل الدراجات وتحديث الحالات</p>
        </div>
        <button
          onClick={fetchOrders}
          className="p-2 border border-slate-200 rounded-lg hover:bg-slate-50 text-slate-600 transition-colors"
        >
          <RefreshCw className="w-5 h-5" />
        </button>
      </div>

      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-right">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold">
              <tr>
                <th className="p-4">رقم الطلب</th>
                <th className="p-4">الزبون</th>
                <th className="p-4">المدينة والهاتف</th>
                <th className="p-4">المبلغ الإجمالي</th>
                <th className="p-4">الحالة</th>
                <th className="p-4">إجراء</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {orders.map((order) => (
                <tr key={order.id} className="hover:bg-slate-50/50">
                  <td className="p-4 font-bold text-slate-900">{order.order_number}</td>
                  <td className="p-4">
                    <div className="font-semibold text-slate-800">{order.user?.name}</div>
                    <div className="text-xs text-slate-400">{order.user?.email}</div>
                  </td>
                  <td className="p-4 text-slate-600">
                    <div>{order.shipping_city}</div>
                    <div className="text-xs text-slate-400">{order.phone_number}</div>
                  </td>
                  <td className="p-4 font-extrabold text-slate-900">
                    {Number(order.total_amount).toLocaleString()} DH
                  </td>
                  <td className="p-4">
                    <span
                      className={`inline-block px-2.5 py-1 rounded-full text-xs font-bold ${
                        order.status === 'delivered'
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : order.status === 'shipped'
                          ? 'bg-sky-50 text-sky-700 border border-sky-200'
                          : order.status === 'cancelled'
                          ? 'bg-rose-50 text-rose-700 border border-rose-200'
                          : 'bg-amber-50 text-amber-700 border border-amber-200'
                      }`}
                    >
                      {order.status}
                    </span>
                  </td>
                  <td className="p-4">
                    <select
                      disabled={updatingId === order.id}
                      value={order.status}
                      onChange={(e) => handleStatusChange(order.id, e.target.value)}
                      className="border border-slate-300 rounded-lg px-2 py-1 text-xs bg-white focus:outline-sky-500"
                    >
                      <option value="pending">Pending</option>
                      <option value="processing">Processing</option>
                      <option value="shipped">Shipped</option>
                      <option value="delivered">Delivered</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}