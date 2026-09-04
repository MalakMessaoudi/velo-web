<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Invoice {{ $order->order_number }}</title>
    <style>
        body { font-family: sans-serif; font-size: 13px; color: #333; margin: 20px; }
        .invoice-header { border-bottom: 2px solid #0284c7; padding-bottom: 15px; margin-bottom: 20px; }
        .invoice-title { font-size: 22px; font-weight: bold; color: #0284c7; }
        .details-table, .items-table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
        .items-table th { background: #f1f5f9; padding: 8px; text-align: left; border-bottom: 1px solid #cbd5e1; }
        .items-table td { padding: 8px; border-bottom: 1px solid #e2e8f0; }
        .totals { float: right; width: 250px; }
        .totals td { padding: 4px; }
        .total-row { font-size: 15px; font-weight: bold; color: #0f172a; border-top: 1px solid #0f172a; }
    </style>
</head>
<body>
    <div class="invoice-header">
        <span class="invoice-title">VeloFlow Bikes</span>
        <div style="float: right;">
            <strong>Order Number:</strong> {{ $order->order_number }}<br>
            <strong>Date:</strong> {{ $order->created_at->format('Y-m-d') }}
        </div>
    </div>

    <table class="details-table">
        <tr>
            <td>
                <strong>Billed To:</strong><br>
                {{ $order->user->name }}<br>
                {{ $order->shipping_address }}, {{ $order->shipping_city }}<br>
                Phone: {{ $order->phone_number }}
            </td>
        </tr>
    </table>

    <table class="items-table">
        <thead>
            <tr>
                <th>Bike / Product</th>
                <th>Frame / Color</th>
                <th>Price</th>
                <th>Qty</th>
                <th>Total</th>
            </tr>
        </thead>
        <tbody>
            @foreach ($order->items as $item)
                <tr>
                    <td>{{ $item->variant->product->name }}</td>
                    <td>{{ $item->variant->frame_size }} - {{ $item->variant->color }}</td>
                    <td>{{ number_format($item->unit_price, 2) }} DH</td>
                    <td>{{ $item->quantity }}</td>
                    <td>{{ number_format($item->total_price, 2) }} DH</td>
                </tr>
            @endforeach
        </tbody>
    </table>

    <table class="totals">
        <tr>
            <td>Subtotal:</td>
            <td align="right">{{ number_format($order->subtotal, 2) }} DH</td>
        </tr>
        @if ($order->discount_amount > 0)
        <tr>
            <td>Discount:</td>
            <td align="right">-{{ number_format($order->discount_amount, 2) }} DH</td>
        </tr>
        @endif
        <tr class="total-row">
            <td>Total Amount:</td>
            <td align="right">{{ number_format($order->total_amount, 2) }} DH</td>
        </tr>
    </table>
</body>
</html>