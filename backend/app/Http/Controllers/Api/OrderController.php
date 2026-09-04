<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\CheckoutRequest;
use App\Models\Cart;
use App\Models\Coupon;
use App\Models\Order;
use App\Models\ProductVariant;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class OrderController extends Controller
{
    // عرض قائمة طلبات العميل الحالي
    public function index(Request $request): JsonResponse
    {
        $orders = Order::with(['items.variant.product'])
            ->where('user_id', $request->user()->id)
            ->latest()
            ->paginate(10);

        return response()->json($orders);
    }

    // إتمام الطلب (Checkout) داخل Transaction آمنة
    public function checkout(CheckoutRequest $request): JsonResponse
    {
        $user = $request->user();
        $cart = Cart::with('items.variant.product')->where('user_id', $user->id)->first();

        if (! $cart || $cart->items->isEmpty()) {
            return response()->json(['message' => 'عربة التسوق فارغة.'], 422);
        }

        return DB::transaction(function () use ($request, $user, $cart) {
            $subtotal = 0;

            // 1. التحقق من توافر المخزون وقفله للطلب (Pessimistic Locking)
            foreach ($cart->items as $cartItem) {
                $variant = ProductVariant::lockForUpdate()->find($cartItem->product_variant_id);

                if ($variant->stock_quantity < $cartItem->quantity) {
                    throw new \Exception("الكمية المطلوبة من الدراجة {$variant->product->name} غير متوفرة حالياً.");
                }

                $itemPrice = $variant->product->base_price + $variant->additional_price;
                $subtotal += $itemPrice * $cartItem->quantity;
            }

            // 2. التحقق من الكوبون وحساب الخصم
            $discountAmount = 0;
            $couponId = null;

            if ($request->filled('coupon_code')) {
                $coupon = Coupon::where('code', $request->coupon_code)->first();
                if ($coupon && (! $coupon->expires_at || ! $coupon->expires_at->isPast())) {
                    $couponId = $coupon->id;
                    $discountAmount = ($coupon->type === 'percent') 
                        ? ($subtotal * $coupon->value) / 100 
                        : min($coupon->value, $subtotal);
                    $coupon->increment('used_count');
                }
            }

            $totalAmount = max(0, $subtotal - $discountAmount);

            // 3. إنشاء سجل الطلب (Order)
            $order = Order::create([
                'order_number' => 'ORD-' . strtoupper(Str::random(10)),
                'user_id' => $user->id,
                'coupon_id' => $couponId,
                'status' => 'pending',
                'subtotal' => $subtotal,
                'discount_amount' => $discountAmount,
                'total_amount' => $totalAmount,
                'shipping_address' => $request->shipping_address,
                'shipping_city' => $request->shipping_city,
                'phone_number' => $request->phone_number,
            ]);

            // 4. تسجيل عناصر الطلب وخصم الكميات من المخزون
            foreach ($cart->items as $cartItem) {
                $variant = $cartItem->variant;
                $unitPrice = $variant->product->base_price + $variant->additional_price;

                $order->items()->create([
                    'product_variant_id' => $variant->id,
                    'unit_price' => $unitPrice,
                    'quantity' => $cartItem->quantity,
                    'total_price' => $unitPrice * $cartItem->quantity,
                ]);

                // خصم المخزون
                $variant->decrement('stock_quantity', $cartItem->quantity);
            }

            // 5. تفريغ عربة التسوق بعد نجاح العملية
            $cart->items()->delete();

            return response()->json([
                'message' => 'تم تأكيد طلبك بنجاح!',
                'order' => $order->load('items.variant.product'),
            ], 201);
        });
    }

    // تنزيل فاتورة الطلب بصيغة PDF
    public function downloadInvoice(Request $request, Order $order)
    {
        if ($order->user_id !== $request->user()->id && ! $request->user()->hasRole('admin')) {
            return response()->json(['message' => 'غير مصرح لك بالوصول إلى هذه الفاتورة.'], 403);
        }

        $order->load(['user', 'items.variant.product', 'coupon']);

        $pdf = Pdf::loadView('invoices.order', compact('order'));
        return $pdf->download("invoice-{$order->order_number}.pdf");
    }
}