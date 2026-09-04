<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Coupon;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class CouponController extends Controller
{
    public function validateCoupon(Request $request): JsonResponse
    {
        $request->validate([
            'code' => 'required|string',
            'subtotal' => 'required|numeric|min:0',
        ]);

        $coupon = Coupon::where('code', $request->code)->first();

        if (! $coupon) {
            return response()->json(['message' => 'كود الخصم غير موجود.'], 404);
        }

        if ($coupon->expires_at && $coupon->expires_at->isPast()) {
            return response()->json(['message' => 'كود الخصم منتهي الصلاحية.'], 422);
        }

        if ($coupon->usage_limit && $coupon->used_count >= $coupon->usage_limit) {
            return response()->json(['message' => 'وصل كود الخصم للحد الأقصى من الاستخدام.'], 422);
        }

        if ($coupon->min_order_amount && $request->subtotal < $coupon->min_order_amount) {
            return response()->json([
                'message' => "يجب أن يتجاوز الطلب {$coupon->min_order_amount} درهم لتفعيل الخصم."
            ], 422);
        }

        $discount = 0;
        if ($coupon->type === 'percent') {
            $discount = ($request->subtotal * $coupon->value) / 100;
        } else {
            $discount = min($coupon->value, $request->subtotal);
        }

        return response()->json([
            'message' => 'تم تطبيق كود الخصم بنجاح.',
            'coupon_id' => $coupon->id,
            'code' => $coupon->code,
            'discount_amount' => round($discount, 2),
            'new_total' => round($request->subtotal - $discount, 2),
        ]);
    }
}