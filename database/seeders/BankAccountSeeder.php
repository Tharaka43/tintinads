<?php

namespace Database\Seeders;

use App\Models\BankAccount;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class BankAccountSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $banks = [
            ['bank_name' => 'BOC Bank', 'account_number' => '94408546'],
            ['bank_name' => 'Sampath Bank', 'account_number' => '100752807704'],
            ['bank_name' => 'Commercial Bank', 'account_number' => '8040002584'],
            ['bank_name' => 'Commercial Bank', 'account_number' => '8024494737'],
        ];

        foreach ($banks as $bank) {
            // Check if a record with the same bank_name and account_number already exists
            $existing = BankAccount::where('bank_name', $bank['bank_name'])
                ->get()
                ->first(function ($record) use ($bank) {
                    return $record->getAccountNumberForSearch() === $bank['account_number'];
                });

            if (!$existing) {
                BankAccount::create([
                    'bank_name' => $bank['bank_name'],
                    'account_number' => $bank['account_number'], // Will be encrypted by model cast
                    'is_active' => true,
                ]);
            }
        }
    }
}
