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
        Schema::table('users', function (Blueprint $table) {
            $table->enum('role', ['admin', 'customer'])->default('customer')->after('password');
            $table->string('store_name')->nullable()->after('role');
            $table->string('store_slug')->unique()->nullable()->after('store_name');
            $table->string('phone')->nullable()->after('store_slug');
            $table->text('about')->nullable()->after('phone');
            $table->string('logo_url')->nullable()->after('about');
            $table->string('banner_url')->nullable()->after('logo_url');
            $table->string('whatsapp_number')->nullable()->after('banner_url');
            $table->string('instagram_handle')->nullable()->after('whatsapp_number');
            $table->string('primary_domain')->nullable()->after('instagram_handle');
            $table->json('payment_methods')->default('{}')->after('primary_domain');
            $table->timestamp('last_login_at')->nullable()->after('payment_methods');
            $table->softDeletes();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropSoftDeletes();
            $table->dropColumn([
                'role',
                'store_name',
                'store_slug',
                'phone',
                'about',
                'logo_url',
                'banner_url',
                'whatsapp_number',
                'instagram_handle',
                'primary_domain',
                'payment_methods',
                'last_login_at',
            ]);
        });
    }
};
