<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Category;
use App\Models\Product;
use App\Models\ProductVariant;
use App\Models\Coupon;
use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Spatie\Permission\Models\Role;

class BikeShopSeeder extends Seeder
{
    public function run(): void
    {
      
        // 1. Create Roles
        

        $adminRole = Role::firstOrCreate([
            'name' => 'admin',
        ]);

        $customerRole = Role::firstOrCreate([
            'name' => 'customer',
        ]);


        // ========================================
        // 2. Create Admin User
        // ========================================

        $admin = User::firstOrCreate(
            [
                'email' => 'admin@veloflow.com',
            ],
            [
                'name' => 'Admin User',
                'password' => Hash::make('password123'),
            ]
        );

        // Give Admin role
        $admin->assignRole($adminRole);


        // ========================================
        // 3. Create Categories
        // ========================================

        $categories = [
            [
                'name' => 'Road Bikes',
                'slug' => 'road-bikes',
                'description' => 'Fast and lightweight bikes built for paved roads.',
            ],
            [
                'name' => 'Mountain Bikes',
                'slug' => 'mountain-bikes',
                'description' => 'Durable bikes engineered for rough trails and dirt paths.',
            ],
            [
                'name' => 'Electric Bikes',
                'slug' => 'electric-bikes',
                'description' => 'Power-assisted bikes for long commutes and effortless rides.',
            ],
            [
                'name' => 'Accessories',
                'slug' => 'accessories',
                'description' => 'Helmets, lights, and essential cycling gear.',
            ],
        ];


        foreach ($categories as $cat) {

            // firstOrCreate prevents duplicate categories
            $category = Category::firstOrCreate(
                [
                    'slug' => $cat['slug'],
                ],
                [
                    'name' => $cat['name'],
                    'description' => $cat['description'],
                ]
            );


            // ========================================
            // 4. Road Bike
            // ========================================

            if ($cat['slug'] === 'road-bikes') {

                $product = Product::firstOrCreate(
                    [
                        'slug' => 'veloflow-aero-carbon-x1',
                    ],
                    [
                        'category_id' => $category->id,
                        'name' => 'VeloFlow Aero Carbon X1',
                        'brand' => 'VeloFlow',
                        'description' => 'High performance aerodynamic road bike with lightweight carbon frame.',
                        'base_price' => 12500.00,
                        'is_active' => true,
                    ]
                );


                ProductVariant::firstOrCreate(
                    [
                        'sku' => 'AERO-X1-M-BLK',
                    ],
                    [
                        'product_id' => $product->id,
                        'frame_size' => 'M',
                        'color' => 'Matte Black',
                        'additional_price' => 0,
                        'stock_quantity' => 10,
                    ]
                );


                ProductVariant::firstOrCreate(
                    [
                        'sku' => 'AERO-X1-L-RED',
                    ],
                    [
                        'product_id' => $product->id,
                        'frame_size' => 'L',
                        'color' => 'Racing Red',
                        'additional_price' => 200,
                        'stock_quantity' => 5,
                    ]
                );
            }


            // ========================================
            // 5. Mountain Bike
            // ========================================

            if ($cat['slug'] === 'mountain-bikes') {

                $product = Product::firstOrCreate(
                    [
                        'slug' => 'trailmaster-7000-pro',
                    ],
                    [
                        'category_id' => $category->id,
                        'name' => 'TrailMaster 7000 Pro',
                        'brand' => 'TrailMaster',
                        'description' => 'Full suspension mountain bike built for challenging descents and technical trails.',
                        'base_price' => 8900.00,
                        'is_active' => true,
                    ]
                );


                ProductVariant::firstOrCreate(
                    [
                        'sku' => 'TM7K-M-GRN',
                    ],
                    [
                        'product_id' => $product->id,
                        'frame_size' => 'M',
                        'color' => 'Forest Green',
                        'additional_price' => 0,
                        'stock_quantity' => 8,
                    ]
                );


                ProductVariant::firstOrCreate(
                    [
                        'sku' => 'TM7K-L-GRN',
                    ],
                    [
                        'product_id' => $product->id,
                        'frame_size' => 'L',
                        'color' => 'Forest Green',
                        'additional_price' => 0,
                        'stock_quantity' => 6,
                    ]
                );
            }
        }


        // ========================================
        // 6. Create Coupon
        // ========================================

        Coupon::firstOrCreate(
            [
                'code' => 'WELCOME10',
            ],
            [
                'type' => 'percent',
                'value' => 10.00,
                'min_order_amount' => 1000.00,
                'expires_at' => now()->addMonths(3),
                'usage_limit' => 100,
                'used_count' => 0,
            ]
        );
    }
}