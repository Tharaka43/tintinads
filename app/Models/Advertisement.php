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
            // Platinum (ID 4) -> 30 days
            $q->where(function ($sub) {
                $sub->where('listing_category_id', 4)
                    ->where('post_date', '>=', now()->subDays(30));
            })
            // VIP (ID 1) -> 3 days
            ->orWhere(function ($sub) {
                $sub->where('listing_category_id', 1)
                    ->where('post_date', '>=', now()->subDays(3));
            })
            // Premium/Super (ID 2) -> 2 days
            ->orWhere(function ($sub) {
                $sub->where('listing_category_id', 2)
                    ->where('post_date', '>=', now()->subDays(2));
            })
            // Normal (ID 3) or NULL -> 1 day
            ->orWhere(function ($sub) {
                $sub->where(function ($sub2) {
                        $sub2->where('listing_category_id', 3)
                             ->orWhereNull('listing_category_id');
                    })
                    ->where('post_date', '>=', now()->subDays(1));
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

        $days = 1; // Default Normal
        if ($this->listing_category_id == 4) {
            $days = 30; // Platinum
        } elseif ($this->listing_category_id == 1) {
            $days = 3;  // VIP
        } elseif ($this->listing_category_id == 2) {
            $days = 2;  // Premium
        }

        return $this->post_date->lt(now()->subDays($days));
    }

    /**
     * Get the voice note audio URL for this advertisement based on category.
     */
    public function getVoiceNoteUrlAttribute(): string
    {
        $catId = $this->common_category_id;
        $categoryName = strtolower(optional($this->commonCategory)->name ?? '');

        if ($catId == 5 || str_contains($categoryName, 'cam')) {
            return '/storage/audio/voice_live_cam.mp3';
        }
        if ($catId == 6 || str_contains($categoryName, 'spa') || str_contains($categoryName, 'wellness')) {
            return '/storage/audio/voice_spa_wellness.mp3';
        }
        if ($catId == 2 || str_contains($categoryName, 'boy')) {
            return '/storage/audio/voice_boys_personal.mp3';
        }
        if ($catId == 3 || str_contains($categoryName, 'shemale')) {
            return '/storage/audio/voice_shemale_personal.mp3';
        }
        if ($catId == 1 || str_contains($categoryName, 'girl') || str_contains($categoryName, 'personal')) {
            return '/storage/audio/voice_girls_personal.mp3';
        }

        return '/storage/audio/voice_default.mp3';
    }

    /**
     * Get the voice note spoken text for this advertisement based on category.
     */
    public function getVoiceNoteTextAttribute(): string
    {
        $catId = $this->common_category_id;
        $categoryName = strtolower(optional($this->commonCategory)->name ?? '');

        if ($catId == 5 || str_contains($categoryName, 'cam')) {
            return 'හායි, මගේ ලයිව් කැම් සර්විස් එකට ඔයාලව සාදරයෙන් පිළිගන්නවා. ඇඩ් එකේ තියෙන විස්තර බලලා, ලයිව් වීඩියෝ පැකේජ් ගන්න කැමති නම් දැන්ම මට WhatsApp මැසේජ් එකක් දාන්න.';
        }
        if ($catId == 6 || str_contains($categoryName, 'spa') || str_contains($categoryName, 'wellness')) {
            return 'ආයුබෝවන්. අපගේ ස්පා සහ සම්බාහන සේවාවන් ලබා ගැනීමට පෙර, කරුණාකර ඇඩ් එකේ විස්තර බලලා වේලාවක් වෙන් කරවා ගැනීමට දැන්ම අප අමතන්න. ස්තූතියි.';
        }
        if ($catId == 2 || str_contains($categoryName, 'boy')) {
            return 'හායි, මගේ ඇඩ් එකේ විස්තර හොඳට බලන්න. Genuine අය සහ Genuine girls ලා විතරක් මට කෝල් එකක් හරි WhatsApp මැසේජ් එකක් හරි දාන්න.';
        }
        if ($catId == 3 || str_contains($categoryName, 'shemale')) {
            return 'හායි, මගේ ඇඩ් එකේ විස්තර සහ සේවාවන් හොඳට කියවලා, Genuine නම් විතරක් මට දැන්ම කෝල් එකක් හෝ WhatsApp මැසේජ් එකක් දාන්නකෝ.';
        }
        if ($catId == 1 || str_contains($categoryName, 'girl') || str_contains($categoryName, 'personal')) {
            return 'හායි, මගේ ඇඩ් එකේ තියෙන විස්තර සහ පැකේජ් හොඳට බලලා කියවන්න. Genuine නම් විතරක් මට දැන්ම කෝල් එකක් හරි WhatsApp මැසේජ් එකක් හරි දාන්නකෝ.';
        }

        return 'හායි, මගේ දැන්වීමේ විස්තර හොඳට කියවලා බලන්න. Genuine නම් විතරක් කරුණාකර දැන්ම මට කෝල් එකක් හරි WhatsApp මැසේජ් එකක් හරි දාන්න.';
    }
}