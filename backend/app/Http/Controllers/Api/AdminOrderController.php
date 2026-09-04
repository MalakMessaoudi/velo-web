<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\ProductVariant;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class AdminOrderController extends Controller
{
    // جلب كل الطلبات مع بيانات الزبائن
    public function index(): JsonResponse
    {
        $orders = Order::with(['user', 'items.variant.product'])
            ->latest()
            ->paginate(15);

        return response()->json($orders);
    }

    // تحديث حالة الطلب وإشعار العميل
    public function updateStatus(Request $request, Order $order): JsonResponse
    {
        $request->validate([
            'status' => 'required|in:pending,processing,shipped,delivered,cancelled',
        ]);

        $order->update(['status' => $request->status]);

        return response()->json([
            'message' => 'تم تحديث حالة الطلب بنجاح.',
            'order' => $order,
        ]);
    }

    // التعديل السريع لكمية المخزون لأي خيار دراجة
    public function updateStock(Request $request, ProductVariant $variant): JsonResponse
    {
        $request->validate([
            'stock_quantity' => 'required|integer|min:0',
        ]);

        $variant->update(['stock_quantity' => $request->stock_quantity]);

        return response()->json([
            'message' => 'تم تحديث المخزون بنجاح.',
            'variant' => $variant,
        ]);
    }
}