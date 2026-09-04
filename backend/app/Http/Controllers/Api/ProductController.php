<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreProductRequest;
use App\Models\Product;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\DB;

class ProductController extends Controller
{
    // عرض المنتجات للزبائن مع الفلاتر المتقدمة
    public function index(Request $request): JsonResponse
    {
        $query = Product::with(['category', 'variants', 'images'])
            ->where('is_active', true);

        // Filter by Category Slug
        if ($request->filled('category')) {
            $query->whereHas('category', function ($q) use ($request) {
                $q->where('slug', $request->category);
            });
        }

        // Filter by Brand
        if ($request->filled('brand')) {
            $query->where('brand', $request->brand);
        }

        // Filter by Price Range
        if ($request->filled('min_price')) {
            $query->where('base_price', '>=', $request->min_price);
        }
        if ($request->filled('max_price')) {
            $query->where('base_price', '<=', $request->max_price);
        }

        // Search by Name or Description
        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('name', 'ilike', "%{$search}%")
                  ->orWhere('description', 'ilike', "%{$search}%");
            });
        }

        // Sorting
        $sortBy = $request->get('sort_by', 'created_at');
        $sortOrder = $request->get('sort_order', 'desc');
        $query->orderBy($sortBy, $sortOrder);

        $products = $query->paginate(12);

        return response()->json($products);
    }

    // عرض تفاصيل منتج واحد عبر الـ Slug
    public function show(string $slug): JsonResponse
    {
        $product = Product::with(['category', 'variants', 'images', 'reviews.user'])
            ->where('slug', $slug)
            ->firstOrFail();

        return response()->json($product);
    }

    // إضافة منتج جديد مع الـ Variants (خاص بالمدير)
    public function store(StoreProductRequest $request): JsonResponse
    {
        $validated = $request->validated();

        $product = DB::transaction(function () use ($validated) {
            $product = Product::create([
                'category_id' => $validated['category_id'],
                'name' => $validated['name'],
                'slug' => Str::slug($validated['name']) . '-' . Str::random(5),
                'brand' => $validated['brand'] ?? null,
                'description' => $validated['description'],
                'base_price' => $validated['base_price'],
                'is_active' => $validated['is_active'] ?? true,
            ]);

            foreach ($validated['variants'] as $variant) {
                $product->variants()->create($variant);
            }

            return $product->load(['variants', 'category']);
        });

        return response()->json([
            'message' => 'Product created successfully',
            'product' => $product
        ], 201);
    }

    // حذف منتج
    public function destroy(Product $product): JsonResponse
    {
        $product->delete();
        return response()->json(['message' => 'Product deleted successfully']);
    }
}