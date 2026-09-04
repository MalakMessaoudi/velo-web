'use client';

import { useEffect, useState } from 'react';
import api from '@/app/lib/api';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend
} from 'recharts';
import { DollarSign, ShoppingCart, Users, TrendingUp } from 'lucide-react';

const COLORS = ['#0284c7', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

export default function AdminDashboardPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/admin/analytics')
      .then((res) => setData(res.data))
      .catch((err) => console.error('Failed to load stats', err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="text-center py-20 text-slate-500">جاري تحميل الإحصائيات...</div>;
  if (!data) return <div className="text-center py-20 text-rose-500">فشل في استرجاع البيانات التحليلية.</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div>
        <h1 className="text-3xl font-black text-slate-900 tracking-tight">لوحة الأداء والتحليلات</h1>
        <p className="text-sm text-slate-500">نظرة شاملة على الإيرادات وحركة المبيعات وسلوك العملاء</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white border border-slate-200 p-6 rounded-2xl shadow-sm flex items-center gap-4">
          <div className="p-3 bg-sky-50 text-sky-600 rounded-xl">
            <DollarSign className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs text-slate-400 font-semibold">إجمالي الإيرادات</span>
            <h3 className="text-2xl font-black text-slate-900 mt-0.5">
              {Number(data.kpis.total_revenue).toLocaleString()} <span className="text-xs font-normal">DH</span>
            </h3>
          </div>
        </div>

        <div className="bg-white border border-slate-200 p-6 rounded-2xl shadow-sm flex items-center gap-4">
          <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl">
            <ShoppingCart className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs text-slate-400 font-semibold">إجمالي الطلبات</span>
            <h3 className="text-2xl font-black text-slate-900 mt-0.5">{data.kpis.orders_count}</h3>
          </div>
        </div>

        <div className="bg-white border border-slate-200 p-6 rounded-2xl shadow-sm flex items-center gap-4">
          <div className="p-3 bg-amber-50 text-amber-600 rounded-xl">
            <TrendingUp className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs text-slate-400 font-semibold">متوسط قيمة الطلب</span>
            <h3 className="text-2xl font-black text-slate-900 mt-0.5">
              {Number(data.kpis.average_order_value).toLocaleString()} <span className="text-xs font-normal">DH</span>
            </h3>
          </div>
        </div>

        <div className="bg-white border border-slate-200 p-6 rounded-2xl shadow-sm flex items-center gap-4">
          <div className="p-3 bg-purple-50 text-purple-600 rounded-xl">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs text-slate-400 font-semibold">الزبائن المسجلين</span>
            <h3 className="text-2xl font-black text-slate-900 mt-0.5">{data.kpis.customers_count}</h3>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Monthly Revenue Chart */}
        <div className="bg-white border border-slate-200 p-6 rounded-2xl shadow-sm">
          <h2 className="text-lg font-bold text-slate-900 mb-6">نمو الإيرادات الشهرية (DH)</h2>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data.monthly_sales}>
                <XAxis dataKey="month" stroke="#94a3b8" />
                <YAxis stroke="#94a3b8" />
                <Tooltip />
                <Bar dataKey="total" fill="#0284c7" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Orders by Status Donut */}
        <div className="bg-white border border-slate-200 p-6 rounded-2xl shadow-sm">
          <h2 className="text-lg font-bold text-slate-900 mb-6">توزيع حالات الطلبات</h2>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data.orders_by_status}
                  dataKey="count"
                  nameKey="status"
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={90}
                  paddingAngle={5}
                >
                  {data.orders_by_status.map((_: any, index: number) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Top Selling Bikes Table */}
      <div className="bg-white border border-slate-200 p-6 rounded-2xl shadow-sm">
        <h2 className="text-lg font-bold text-slate-900 mb-4">الدراجات الأكثر مبيعاً</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-right">
            <thead className="bg-slate-50 text-slate-500 font-bold border-b">
              <tr>
                <th className="p-3">اسم الدراجة</th>
                <th className="p-3">الكمية المباعة</th>
                <th className="p-3">إجمالي الإيراد المحقق</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {data.top_products.map((prod: any, idx: number) => (
                <tr key={idx} className="hover:bg-slate-50/50">
                  <td className="p-3 font-semibold text-slate-800">{prod.name}</td>
                  <td className="p-3 font-bold text-slate-900">{prod.total_sold} وحدة</td>
                  <td className="p-3 font-extrabold text-emerald-600">
                    {Number(prod.total_revenue).toLocaleString()} DH
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="bg-white border border-slate-200 p-6 rounded-2xl shadow-sm flex items-center gap-4">
  <div className="p-3 bg-rose-50 text-rose-600 rounded-xl">
    <ShoppingCart className="w-6 h-6" />
  </div>
  <div>
    <span className="text-xs text-slate-400 font-semibold">السلات المتروكة (+24h)</span>
    <h3 className="text-2xl font-black text-slate-900 mt-0.5">
      {data.kpis.abandoned_carts_count || 0}
    </h3>
  </div>
</div>
        </div>
      </div>
    </div>
  );
}