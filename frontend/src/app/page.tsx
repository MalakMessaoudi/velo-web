import Link from 'next/link';
import { ArrowRight, ShieldCheck, Zap, Wrench } from 'lucide-react';

export default function HomePage() {
  return (
    <main className="min-h-screen bg-slate-50">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-slate-900 text-white py-24 sm:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-2xl">
            <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight">
              انطلق بسرعة وأناقة مع دراجات <span className="text-sky-400">VeloFlow</span>
            </h1>
            <p className="mt-6 text-lg text-slate-300 leading-relaxed">
              هندسة متطورة للدراجات الهوائية والكهربائية المصنوعة من ألياف الكربون ومصممة لأعلى مستويات الأداء على مختلف الطرقات.
            </p>
            <div className="mt-8 flex gap-4">
              <Link
                href="/products"
                className="bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold px-6 py-3 rounded-lg flex items-center gap-2 transition-all shadow-lg"
              >
                تصفح الدراجات <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Badges */}
      <section className="py-12 border-b border-slate-200 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-sky-50 text-sky-600 rounded-lg">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900">ضمان شامل لمدة 5 سنوات</h3>
              <p className="text-sm text-slate-500">جودة مصنعية معتمدة للهيكل ومكونات الحركة</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="p-3 bg-sky-50 text-sky-600 rounded-lg">
              <Zap className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900">شحن آمن وسريع</h3>
              <p className="text-sm text-slate-500">توصيل لجميع المدن مع تتبع فوري للشحنة</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="p-3 bg-sky-50 text-sky-600 rounded-lg">
              <Wrench className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900">تجميع وضبط مجاني</h3>
              <p className="text-sm text-slate-500">تصلك الدراجة جاهزة للانطلاق مباشرة</p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}