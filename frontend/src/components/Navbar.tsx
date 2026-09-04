'use client';

import Link from 'next/link';
import { useEffect } from 'react';
import { ShoppingBag, Bike, User } from 'lucide-react';
import { useCartStore } from '@/store/useCartStore';

export default function Navbar() {
  const { itemsCount, fetchCart } = useCartStore();

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-slate-100 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 font-bold text-xl text-slate-900 tracking-tight">
          <Bike className="h-6 w-6 text-sky-600" />
          <span>Velo<span className="text-sky-600">Flow</span></span>
        </Link>

        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-600">
          <Link href="/" className="hover:text-sky-600 transition-colors">الرئيسية</Link>
          <Link href="/products" className="hover:text-sky-600 transition-colors">كل الدراجات</Link>
          <Link href="/products?category=road-bikes" className="hover:text-sky-600 transition-colors">Road</Link>
          <Link href="/products?category=mountain-bikes" className="hover:text-sky-600 transition-colors">Mountain</Link>
          <Link href="/products?category=electric-bikes" className="hover:text-sky-600 transition-colors">Electric</Link>
        </nav>

        <div className="flex items-center gap-4">
          <Link href="/profile" className="p-2 text-slate-600 hover:text-sky-600 transition-colors">
            <User className="h-5 w-5" />
          </Link>
          <Link href="/cart" className="relative p-2 text-slate-600 hover:text-sky-600 transition-colors">
            <ShoppingBag className="h-5 w-5" />
            {itemsCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-sky-600 text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center">
                {itemsCount}
              </span>
            )}
          </Link>
        </div>
      </div>
    </header>
  );
}