<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\Cart;
use Illuminate\Support\Facades\Log;

class CheckAbandonedCarts extends Command
{
    protected $signature = 'carts:check-abandoned';
    protected $description = 'تتبع السلات المتروكة وإرسال إشعارات للعملاء';

    public function handle(): int
    {
        // البحث عن السلات التي تحتوي على عناصر ولم يتم تحديثها منذ 24 ساعة
        $abandonedCarts = Cart::whereNotNull('user_id')
            ->whereHas('items')
            ->where('updated_at', '<=', now()->subHours(24))
            ->with(['user', 'items.variant.product'])
            ->get();

        $this->info("تم العثور على {$abandonedCarts->count()} سلة متروكة.");

        foreach ($abandonedCarts as $cart) {
            // تسجيل العملية أو إرسال إيميل تذكيري للزبون
            Log::info("Abandoned cart notification queued for: {$cart->user->email}");
            
            // هنا يمكن تفعيل إرسال Mail حقيقي:
            // Mail::to($cart->user->email)->queue(new AbandonedCartMail($cart));
        }

        $this->info('تمت معالجة جميع السلات بنجاح.');
        return Command::SUCCESS;
    }
}