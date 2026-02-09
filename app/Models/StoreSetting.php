<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class StoreSetting extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'store_name',
        'store_description',
        'business_info',
        'shipping_settings',
        'tax_settings',
        'email_templates',
        'auto_confirm_orders',
        'require_order_approval',
        'integrations',
    ];

    protected function casts(): array
    {
        return [
            'business_info' => 'json',
            'shipping_settings' => 'json',
            'tax_settings' => 'json',
            'email_templates' => 'json',
            'integrations' => 'json',
            'auto_confirm_orders' => 'boolean',
            'require_order_approval' => 'boolean',
        ];
    }

    // Relationships
    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
