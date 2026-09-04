<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Product;
use App\Models\Order;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ReviewController extends Controller
{
    public function store(Request $request, Product $product): JsonResponse
    {
        $request->validate([
            'rating' => 'required|integer|min:1|max:5',
            'comment' => 'nullable|string|max:1000',
        ]);

        $userId = $request->user()->id;

        // التحقق مما إذا كان المستخدم اشترى المنتج بالفعل
        $hasPurchased = Order::where('user_id', $userId)
            ->whereHas('items.variant', function ($q) use ($product) {
                $q->where('product_id', $product->id);
            })->exists();

        $review = $product->reviews()->updateOrCreate(
            ['user_id' => $userId, 'product_id' => $product->id],
            [
                'rating' => $request->rating,
                'comment' => $request->comment,
                'is_verified_purchase' => $hasPurchased,
            ]
        );

        return response()->json([
            'message' => 'شكراً على تقييمك!',
            'review' => $review
        ], 201);
    }
}