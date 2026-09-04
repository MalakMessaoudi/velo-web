<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ProductVariant extends Model
{
    protected $fillable = ['product_id', 'sku', 'frame_size', 'color', 'additional_price', 'stock_quantity'];

    public function product(): BelongsTo
    {
        return $this->belongsTo(Product::class);
    }
}