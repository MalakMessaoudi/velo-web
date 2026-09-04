'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import api from '@/app/lib/api';
import { useCartStore } from '@/store/useCartStore';
import { Bike, CheckCircle, ShoppingBag } from 'lucide-react';

export default function ProductDetailPage() {
  const { slug } = useParams();
  const [product, setProduct] = useState<any>(null);
  const [selectedVariant, setSelectedVariant] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [added, setAdded] = useState(false);
  const fetchCart = useCartStore((state) => state.fetchCart);

  useEffect(() => {
    api.get(`/products/${slug}`)
      .then((res) => {
        setProduct(res.data);
        if (res.data.variants?.length > 0) {
          setSelectedVariant(res.data.variants[0]);
        }
      })
      .finally(() => setLoading(false));
  }, [slug]);

  const handleAddToCart = async () => {
    if (!selectedVariant) return;
    try {
      await api.post('/cart/items', {
        product_variant_id: selectedVariant.id,
        quantity: 1,
      });
      await fetchCart();
      setAdded(true);
      setTimeout(() => setAdded(false), 2500);
    } catch (err: any) {
      alert(err.response?.data?.message || 'حدث خطأ أثناء الإضافة للسلة');
    }
  };

  if (loading) return <div className="text-center py-20">جاري التحميل...</div>;
  if (!product) return <div className="text-center py-20">الدراجة غير متوفرة</div>;

  const currentPrice = Number(product.base_price) + Number(selectedVariant?.additional_price || 0);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        <div className="h-96 bg-slate-100 rounded-2xl flex items-center justify-center border border-slate-200">
          <Bike className="w-36 h-36 text-slate-300" />
        </div>

        <div className="flex flex-col gap-6">
          <div>
            <span className="text-sm font-semibold uppercase tracking-wider text-sky-600">
              {product.brand}
            </span>
            <h1 className="text-3xl font-extrabold text-slate-900 mt-1">{product.name}</h1>
            <p className="text-2xl font-black text-slate-900 mt-4">
              {currentPrice.toLocaleString()} <span className="text-base font-normal text-slate-500">DH</span>
            </p>
          </div>

          <p className="text-slate-600 leading-relaxed">{product.description}</p>

          <div>
            <label className="block text-sm font-semibold text-slate-900 mb-2">
              مقاس الهيكل واللون (Variant):
            </label>
            <div className="flex flex-wrap gap-3">
              {product.variants.map((variant: any) => (
                <button
                  key={variant.id}
                  onClick={() => setSelectedVariant(variant)}
                  className={`px-4 py-2 text-sm rounded-lg border font-medium transition-all ${
                    selectedVariant?.id === variant.id
                      ? 'border-sky-600 bg-sky-50 text-sky-700 ring-2 ring-sky-600/20'
                      : 'border-slate-200 hover:border-slate-300 text-slate-700'
                  }`}
                >
                  مقاس {variant.frame_size} - {variant.color}
                </button>
              ))}
            </div>
          </div>

          <div className="pt-4 border-t border-slate-200">
            <button
              onClick={handleAddToCart}
              disabled={selectedVariant?.stock_quantity < 1}
              className={`w-full py-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-all ${
                added 
                  ? 'bg-emerald-600 text-white'
                  : selectedVariant?.stock_quantity < 1
                  ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
                  : 'bg-slate-900 hover:bg-slate-800 text-white shadow-lg'
              }`}
            >
              {added ? (
                <>
                  <CheckCircle className="w-5 h-5" /> تمت الإضافة للسلة بنجاح
                </>
              ) : selectedVariant?.stock_quantity < 1 ? (
                'الكمية غير متوفرة'
              ) : (
                <>
                  <ShoppingBag className="w-5 h-5" /> أضف إلى السلة
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
