<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class DomainRequest extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'requested_domain',
        'type',
        'status',
        'cyberpanel_domain_id',
        'cyberpanel_response',
        'error_message',
        'checked_at',
        'activated_at',
    ];

    protected function casts(): array
    {
        return [
            'cyberpanel_response' => 'json',
            'checked_at' => 'datetime',
            'activated_at' => 'datetime',
        ];
    }

    // Relationships
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    // Scopes
    public function scopeActive($query)
    {
        return $query->where('status', 'active');
    }

    public function scopePending($query)
    {
        return $query->where('status', 'pending');
    }

    // Helper methods
    public function isAvailable(): bool
    {
        return $this->status === 'available';
    }

    public function isTaken(): bool
    {
        return $this->status === 'taken';
    }

    public function isActive(): bool
    {
        return $this->status === 'active';
    }
}
