<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('store_settings', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->unique()->constrained('users')->onDelete('cascade');
            $table->string('store_name');
            $table->text('store_description')->nullable();
            $table->json('business_info')->nullable();
            $table->json('shipping_settings')->nullable();
            $table->json('tax_settings')->nullable();
            $table->json('email_templates')->nullable();
            $table->boolean('auto_confirm_orders')->default(false);
            $table->boolean('require_order_approval')->default(false);
            $table->json('integrations')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('store_settings');
    }
};
