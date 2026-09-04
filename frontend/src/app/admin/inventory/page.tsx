'use client';

import { useEffect, useState } from 'react';
import api from '@/app/lib/api';
import { Layers, AlertTriangle } from 'lucide-react';

export default function AdminInventoryPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    try {
      const res = await api.get('/products');
      setProducts(res.data.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleUpdateStock = async (variantId: number, newStock: number) => {
    try {
      await api.patch(`/admin/variants/${variantId}/stock`, { stock_quantity: newStock });
      alert('تم تحديث المخزون بنجاح');
      await loadData();
    } catch (err) {
      alert('فشل تحديث المخزون');
    }
  };

  if (loading) return <div className="text-center py-20">جاري تحميل بيانات المخزون...</div>;

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-black text-slate-900 mb-6 flex items-center gap-2">
        <Layers className="w-6 h-6 text-sky-600" /> مراقبة وتحديث المخزون
      </h1>

      <div className="space-y-6">
        {products.map((product) => (
          <div key={product.id} className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
            <h2 className="text-lg font-bold text-slate-900 mb-4">{product.name}</h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {product.variants?.map((variant: any) => (
                <div
                  key={variant.id}
                  className={`p-4 border rounded-lg flex justify-between items-center ${
                    variant.stock_quantity <= 3 ? 'border-rose-200 bg-rose-50/30' : 'border-slate-200'
                  }`}
                >
                  <div>
                    <div className="font-bold text-sm text-slate-800">
                      مقاس {variant.frame_size} - {variant.color}
                    </div>
                    <div className="text-xs text-slate-500">SKU: {variant.sku}</div>
                    {variant.stock_quantity <= 3 && (
                      <div className="flex items-center gap-1 text-xs text-rose-600 mt-1 font-semibold">
                        <AlertTriangle className="w-3.5 h-3.5" /> مخزون منخفض
                      </div>
                    )}
                  </div>

                  <input
                    type="number"
                    min="0"
                    defaultValue={variant.stock_quantity}
                    onBlur={(e) => {
                      const val = parseInt(e.target.value);
                      if (!isNaN(val) && val !== variant.stock_quantity) {
                        handleUpdateStock(variant.id, val);
                      }
                    }}
                    className="w-20 border border-slate-300 rounded p-1.5 text-center text-sm font-bold bg-white"
                  />
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}