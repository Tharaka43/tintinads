<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class BankAccount extends Model
{
    protected $fillable = [
        'bank_name',
        'account_number',
        'is_active',
    ];

    protected $casts = [
        'is_active' => 'boolean',
        'account_number' => 'encrypted', // Automatically encrypts/decrypts
    ];

    /**
     * Get account number for OCR search (returns decrypted value)
     */
    public function getAccountNumberForSearch(): string
    {
        return $this->account_number; // Already decrypted by the encrypted cast
    }
}
