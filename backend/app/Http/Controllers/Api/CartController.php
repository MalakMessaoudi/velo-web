<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Cart;
use App\Models\CartItem;
use App\Models\ProductVariant;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class CartController extends Controller
{
    // الحصول على سلة المستخدم الحالي أو إنشاؤها
    private function getOrCreateCart(Request $request): Cart
    {
        $user = $request->user('sanctum');

        if ($user) {
            return Cart::firstOrCreate(['user_id' => $user->id]);
        }

        $sessionId = $request->header('X-Session-ID') ?? $request->cookie('cart_session_id');
        if (! $sessionId) {
            $sessionId = (string) \Illuminate\Support\Str::uuid();
        }

        return Cart::firstOrCreate(['session_id' => $sessionId]);
    }

    // عرض محتويات السلة وحساب الأسعار
    public function index(Request $request): JsonResponse
    {
        $cart = $this->getOrCreateCart($request);
        $cart->load(['items.variant.product.images']);

        $subtotal = $cart->items->sum(function ($item) {
            $price = $item->variant->product->base_price + $item->variant->additional_price;
            return $price * $item->quantity;
        });

        return response()->json([
            'cart_id' => $cart->id,
            'items' => $cart->items,
            'subtotal' => round($subtotal, 2),
            'items_count' => $cart->items->sum('quantity'),
        ]);
    }

    // إضافة منتج (Variant) إلى السلة
    public function addItem(Request $request): JsonResponse
    {
        $request->validate([
            'product_variant_id' => 'required|exists:product_variants,id',
            'quantity' => 'required|integer|min:1',
        ]);

        $variant = ProductVariant::findOrFail($request->product_variant_id);

        if ($variant->stock_quantity < $request->quantity) {
            return response()->json(['message' => 'الكمية المطلوبة غير متوفرة في المخزون.'], 422);
        }

        $cart = $this->getOrCreateCart($request);

        $cartItem = $cart->items()->where('product_variant_id', $variant->id)->first();

        if ($cartItem) {
            $newQuantity = $cartItem->quantity + $request->quantity;
            if ($variant->stock_quantity < $newQuantity) {
                return response()->json(['message' => 'تجاوزت الحد الأقصى للمخزون المتاح.'], 422);
            }
            $cartItem->update(['quantity' => $newQuantity]);
        } else {
            $cart->items()->create([
                'product_variant_id' => $variant->id,
                'quantity' => $request->quantity,
            ]);
        }

        return response()->json(['message' => 'تمت إضافة الدراجة إلى السلة بنجاح.']);
    }

    // تحديث كمية عنصر في السلة
    public function updateItem(Request $request, CartItem $cartItem): JsonResponse
    {
        $request->validate([
            'quantity' => 'required|integer|min:1',
        ]);

        $variant = $cartItem->variant;

        if ($variant->stock_quantity < $request->quantity) {
            return response()->json(['message' => 'الكمية غير متوفرة في المخزون.'], 422);
        }

        $cartItem->update(['quantity' => $request->quantity]);

        return response()->json(['message' => 'تم تحديث الكمية بنجاح.']);
    }

    // حذف عنصر من السلة
    public function removeItem(CartItem $cartItem): JsonResponse
    {
        $cartItem->delete();
        return response()->json(['message' => 'تم حذف العنصر من السلة.']);
    }
}