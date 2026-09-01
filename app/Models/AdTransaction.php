<?php

namespace App\Models;

use App\Models\Agent;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class AdTransaction extends Model
{
    use HasFactory;

    protected $fillable = [
        'agent_id',
        'advertisement_id',
        'account_number',
        'bank_reference_number',
        'amount',
        'commission',
        'payment_datetime',
        'receipt_path',
        'notes',
        'status',
    ];

    protected $casts = [
        'amount' => 'decimal:2',
        'commission' => 'decimal:2',
        'payment_datetime' => 'datetime',
    ];

    public function advertisement()
    {
        return $this->belongsTo(Advertisement::class);
    }

    public function agent()
    {
        return $this->belongsTo(Agent::class);
    }
}


