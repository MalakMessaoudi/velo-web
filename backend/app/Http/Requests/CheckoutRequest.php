<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class CheckoutRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'shipping_address' => 'required|string|max:255',
            'shipping_city' => 'required|string|max:100',
            'phone_number' => 'required|string|max:20',
            'coupon_code' => 'nullable|string|exists:coupons,code',
        ];
    }
}