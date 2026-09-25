<?php

namespace App\Models;

use App\Models\AdvertisementImage;
use App\Models\Agent;
use App\Models\CommonCategory;
use App\Models\ListingCategory;
use App\Models\SubCategory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;


class Advertisement extends Model
{
    use HasFactory;

    protected $fillable = [
        'agent_id',
        'code',
        'status',
        'payment_status',
        'title',
        'description',
        'price',
        'location',
        'phone_number',
        'whatsapp_number',
        'telegram_number',
        'common_category_id',
        'listing_category_id',
        'sub_category_id',
        'post_date',
    ];

    protected $casts = [
        'post_date' => 'datetime',
        'price' => 'decimal:2',
    ];

    public function images()
    {
        return $this->hasMany(AdvertisementImage::class);
    }

    public function commonCategory()
    {
        return $this->belongsTo(CommonCategory::class);
    }

    public function listingCategory()
    {
        return $this->belongsTo(ListingCategory::class);
    }

    public function subCategory()
    {
        return $this->belongsTo(SubCategory::class);
    }

    public function agent()
    {
        return $this->belongsTo(Agent::class);
    }

    public function transactions()
    {
        return $this->hasMany(AdTransaction::class);
    }

    /**
     * Scope a query to only include unexpired ads.
     */
    public function scopeUnexpired($query)
    {
        return $query->where(function ($q) {
            // VIP (ID 1) -> 7 days
            $q->where(function ($sub) {
                $sub->where('listing_category_id', 1)
                    ->where('post_date', '>=', now()->subDays(7));
            })
            // Super (ID 2) -> 5 days
            ->orWhere(function ($sub) {
                $sub->where('listing_category_id', 2)
                    ->where('post_date', '>=', now()->subDays(5));
            })
            // Normal (ID 3) or NULL -> 3 days
            ->orWhere(function ($sub) {
                $sub->where(function ($sub2) {
                        $sub2->where('listing_category_id', 3)
                             ->orWhereNull('listing_category_id');
                    })
                    ->where('post_date', '>=', now()->subDays(3));
            });
        });
    }

    /**
     * Check if the current ad is expired.
     */
    public function getIsExpiredAttribute(): bool
    {
        if (!$this->post_date) {
            return true;
        }

        $days = 3; // Default
        if ($this->listing_category_id == 1) {
            $days = 7;
        } elseif ($this->listing_category_id == 2) {
            $days = 5;
        }

        return $this->post_date->lt(now()->subDays($days));
    }
}