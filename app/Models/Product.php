<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Product extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'user_id',
        'category_id',
        'name',
        'slug',
        'description',
        'price',
        'cost_price',
        'quantity',
        'low_stock_threshold',
        'sku',
        'images',
        'instagram_product_id',
        'is_active',
        'is_featured',
        'view_count',
        'metadata',
    ];

    protected function casts(): array
    {
        return [
            'images' => 'json',
            'metadata' => 'json',
            'is_active' => 'boolean',
            'is_featured' => 'boolean',
            'price' => 'decimal:2',
            'cost_price' => 'decimal:2',
        ];
    }

    // Relationships
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function category()
    {
        return $this->belongsTo(Category::class);
    }

    public function orderItems()
    {
        return $this->hasMany(OrderItem::class);
    }

    public function inventoryLogs()
    {
        return $this->hasMany(InventoryLog::class);
    }

    // Scopes
    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    public function scopeFeatured($query)
    {
        return $query->where('is_featured', true);
    }

    public function scopeLowStock($query)
    {
        return $query->whereColumn('quantity', '<=', 'low_stock_threshold');
    }

    // Helper methods
    public function isInStock(): bool
    {
        return $this->quantity > 0;
    }

    public function isLowStock(): bool
    {
        return $this->quantity <= $this->low_stock_threshold;
    }

    public function getProfit(): float
    {
        return ($this->price - ($this->cost_price ?? 0)) * $this->quantity;
    }

    public function adjustStock(int $quantity, string $action = 'adjust', ?string $reason = null): void
    {
        $previousQuantity = $this->quantity;
        $this->quantity += $quantity;
        $this->save();

        InventoryLog::create([
            'product_id' => $this->id,
            'user_id' => $this->user_id,
            'action' => $action,
            'quantity_change' => $quantity,
            'quantity_before' => $previousQuantity,
            'quantity_after' => $this->quantity,
            'reason' => $reason,
        ]);
    }
}
