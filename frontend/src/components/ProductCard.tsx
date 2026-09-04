import Link from 'next/link';
import { Bike } from 'lucide-react';

interface ProductCardProps {
  product: {
    id: number;
    name: string;
    slug: string;
    brand: string;
    base_price: string;
    category?: { name: string };
  };
}

export default function ProductCard({ product }: ProductCardProps) {
  return (
    <Link 
      href={`/products/${product.slug}`}
      className="group bg-white rounded-xl border border-slate-200 overflow-hidden hover:shadow-md transition-all flex flex-col justify-between"
    >
      <div className="h-48 bg-slate-100 flex items-center justify-center text-slate-400 group-hover:scale-105 transition-transform duration-300">
        <Bike className="w-16 h-16 text-slate-300" />
      </div>

      <div className="p-4 flex flex-col gap-2">
        <span className="text-xs font-semibold uppercase tracking-wider text-sky-600">
          {product.category?.name || product.brand}
        </span>
        <h3 className="font-bold text-slate-900 group-hover:text-sky-600 transition-colors line-clamp-1">
          {product.name}
        </h3>
        <p className="text-lg font-extrabold text-slate-900 mt-2">
          {Number(product.base_price).toLocaleString()} <span className="text-sm font-normal text-slate-500">DH</span>
        </p>
      </div>
    </Link>
  );
}