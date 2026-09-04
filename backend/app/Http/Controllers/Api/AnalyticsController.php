<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Product;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\DB;

class AnalyticsController extends Controller
{
    public function getStats(): JsonResponse
    {
        // 1. مؤشرات الأداء الأساسية (KPIs)
        $totalRevenue = Order::where('status', '!=', 'cancelled')->sum('total_amount');
        $ordersCount = Order::count();
        $customersCount = User::role('customer')->count();
        $averageOrderValue = $ordersCount > 0 ? $totalRevenue / $ordersCount : 0;

        // 2. المبيعات الشهرية خلال آخر 6 أشهر
        $monthlySales = Order::select(
            DB::raw("TO_CHAR(created_at, 'Mon') as month"),
            DB::raw("DATE_TRUNC('month', created_at) as date_key"),
            DB::raw('SUM(total_amount) as total')
        )
        ->where('status', '!=', 'cancelled')
        ->groupBy('date_key', 'month')
        ->orderBy('date_key', 'asc')
        ->limit(6)
        ->get()
        ->map(function ($row) {
            return [
                'month' => $row->month,
                'total' => (float) $row->total,
            ];
        });

        // 3. توزيع الطلبات حسب الحالة (Pending, Delivered...)
        $ordersByStatus = Order::select('status', DB::raw('count(*) as count'))
            ->groupBy('status')
            ->get();

        // 4. أفضل 5 دراجات مبيعاً
        $topProducts = OrderItem::select(
            'products.name',
            DB::raw('SUM(order_items.quantity) as total_sold'),
            DB::raw('SUM(order_items.total_price) as total_revenue')
        )
        ->join('product_variants', 'order_items.product_variant_id', '=', 'product_variants.id')
        ->join('products', 'product_variants.product_id', '=', 'products.id')
        ->groupBy('products.id', 'products.name')
        ->orderByDesc('total_sold')
        ->limit(5)
        ->get();

        return response()->json([
            'kpis' => [
                'total_revenue' => round($totalRevenue, 2),
                'orders_count' => $ordersCount,
                'customers_count' => $customersCount,
                'average_order_value' => round($averageOrderValue, 2),
            ],
            'monthly_sales' => $monthlySales,
            'orders_by_status' => $ordersByStatus,
            'top_products' => $topProducts,
        ]);
        // داخل دالة getStats():
$abandonedCartsCount = \App\Models\Cart::whereNotNull('user_id')
    ->whereHas('items')
    ->where('updated_at', '<=', now()->subHours(24))
    ->count();

// أضفها داخل استجابة الـ JSON:
return response()->json([
    'kpis' => [
        // ...
        'abandoned_carts_count' => $abandonedCartsCount,
    ],
    // ...
]);
    }
}