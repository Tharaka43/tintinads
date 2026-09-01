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
}


