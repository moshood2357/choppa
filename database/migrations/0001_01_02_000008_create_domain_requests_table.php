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
        Schema::create('domain_requests', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained('users')->onDelete('cascade');
            $table->string('requested_domain');
            $table->enum('type', ['subdomain', 'custom'])->default('subdomain');
            $table->enum('status', ['pending', 'available', 'taken', 'approved', 'active', 'failed'])->default('pending');
            $table->string('cyberpanel_domain_id')->nullable();
            $table->json('cyberpanel_response')->nullable();
            $table->text('error_message')->nullable();
            $table->timestamp('checked_at')->nullable();
            $table->timestamp('activated_at')->nullable();
            $table->timestamps();

            $table->index(['user_id', 'status']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('domain_requests');
    }
};
