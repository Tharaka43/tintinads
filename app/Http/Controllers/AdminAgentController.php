<?php

namespace App\Http\Controllers;

use App\Models\Agent;
use App\Models\Advertisement;
use App\Models\AdTransaction;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class AdminAgentController extends Controller
{
    /**
     * Get all agents with their statistics
     */
    public function index(Request $request): JsonResponse
    {
        try {
            $agents = Agent::withCount(['advertisements', 'adTransactions'])
                ->withSum('adTransactions', 'commission')
                ->get()
                ->map(function (Agent $agent) {
                    // Calculate status based on is_active
                    $status = 'Pending Approval';
                    if ($agent->is_active === true) {
                        $status = 'Active';
                    } elseif ($agent->is_active === false && $agent->created_at->diffInDays(now()) > 0) {
                        $status = 'Blocked';
                    }

                    // Get avatar URL
                    $avatar = 'https://ui-avatars.com/api/?name=' . urlencode($agent->name) . '&background=ec4899&color=fff';
                    if ($agent->profile_picture) {
                        if (Storage::disk('public')->exists($agent->profile_picture)) {
                            $avatar = Storage::url($agent->profile_picture);
                        }
                    }

                    return [
                        'id' => 'AG' . str_pad((string) $agent->id, 3, '0', STR_PAD_LEFT),
                        'name' => $agent->name,
                        'email' => $agent->email,
                        'status' => $status,
                        'totalAds' => $agent->advertisements_count ?? 0,
                        'totalCommission' => (float) ($agent->ad_transactions_sum_commission ?? 0),
                        'avatar' => $avatar,
                        'isActive' => (bool) $agent->is_active,
                        'number' => $agent->number,
                        'whatsapp_number' => $agent->whatsapp_number,
                        'telegram_number' => $agent->telegram_number,
                        'last_login_at' => $agent->last_login_at ? $agent->last_login_at->format('Y-m-d H:i:s') : null,
                        'raw_id' => $agent->id,
                    ];
                });

            return response()->json([
                'success' => true,
                'agents' => $agents,
            ]);
        } catch (\Exception $e) {
            Log::error('Failed to fetch agents', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Failed to fetch agents.',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Create a new agent
     */
    public function store(Request $request): JsonResponse
    {
        try {
            $validated = $request->validate([
                'name' => ['required', 'string', 'max:255'],
                'email' => ['required', 'string', 'email', 'max:255', 'unique:agents,email'],
                'password' => ['required', 'string', 'min:8'],
                'number' => ['nullable', 'string', 'max:255'],
                'whatsapp_number' => ['nullable', 'string', 'max:255'],
                'telegram_number' => ['nullable', 'string', 'max:255'],
                'profile_picture' => ['nullable', 'image', 'mimes:jpeg,png,jpg', 'max:5120'],
                'is_active' => ['nullable', 'boolean'],
            ]);

            // Handle profile picture upload
            if ($request->hasFile('profile_picture')) {
                $profilePath = $request->file('profile_picture')->store('profile-pictures', 'public');
                $validated['profile_picture'] = $profilePath;
            }

            // Hash password
            $validated['password'] = Hash::make($validated['password']);

            // Set default is_active if not provided
            if (!isset($validated['is_active'])) {
                $validated['is_active'] = false; // New agents start as inactive
            }

            // Convert empty strings to null for optional fields
            if (isset($validated['number']) && $validated['number'] === '') {
                $validated['number'] = null;
            }
            if (isset($validated['whatsapp_number']) && $validated['whatsapp_number'] === '') {
                $validated['whatsapp_number'] = null;
            }
            if (isset($validated['telegram_number']) && $validated['telegram_number'] === '') {
                $validated['telegram_number'] = null;
            }

            $agent = Agent::create($validated);

            Log::info('Agent created by admin', [
                'agent_id' => $agent->id,
                'email' => $agent->email,
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Agent created successfully.',
                'agent' => [
                    'id' => 'AG' . str_pad((string) $agent->id, 3, '0', STR_PAD_LEFT),
                    'name' => $agent->name,
                    'email' => $agent->email,
                    'status' => $agent->is_active ? 'Active' : 'Pending Approval',
                    'totalAds' => 0,
                    'totalCommission' => 0.00,
                    'avatar' => $agent->profile_picture 
                        ? Storage::url($agent->profile_picture) 
                        : 'https://ui-avatars.com/api/?name=' . urlencode($agent->name) . '&background=ec4899&color=fff',
                    'isActive' => (bool) $agent->is_active,
                ],
            ], 201);
        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed.',
                'errors' => $e->errors(),
            ], 422);
        } catch (\Exception $e) {
            Log::error('Failed to create agent', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Failed to create agent.',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Update an agent
     */
    
    /**
     * Get single agent details with recent ads
     */
    public function show($id): JsonResponse
    {
        try {
            $agent = Agent::with(['advertisements' => function($q) {
                $q->orderBy('created_at', 'desc')->take(20);
            }])->findOrFail($id);
            
            $status = 'Pending Approval';
            if ($agent->is_active === true) {
                $status = 'Active';
            } elseif ($agent->is_active === false && $agent->created_at->diffInDays(now()) > 0) {
                $status = 'Blocked';
            }
            
            return response()->json([
                'success' => true,
                'agent' => [
                    'id' => 'AG' . str_pad((string) $agent->id, 3, '0', STR_PAD_LEFT),
                    'name' => $agent->name,
                    'email' => $agent->email,
                    'number' => $agent->number,
                    'status' => $status,
                    'last_login_at' => $agent->last_login_at ? $agent->last_login_at->format('Y-m-d h:i A') : 'Never',
                    'ads' => $agent->advertisements->map(function($ad) {
                        return [
                            'id' => $ad->id,
                            'title' => $ad->title,
                            'category' => $ad->category,
                            'created_at' => $ad->created_at->format('Y-m-d h:i A'),
                            'status' => $ad->status,
                        ];
                    })
                ]
            ]);
        } catch (\Exception $e) {
            Log::error('Failed to fetch agent details', [
                'error' => $e->getMessage()
            ]);
            return response()->json([
                'success' => false,
                'message' => 'Failed to fetch agent details.'
            ], 500);
        }
    }

    public function update(Request $request, $id): JsonResponse
    {
        try {
            // Extract numeric ID from format like "AG001"
            $numericId = (int) str_replace('AG', '', $id);
            $agent = Agent::findOrFail($numericId);

            $validated = $request->validate([
                'name' => ['required', 'string', 'max:255'],
                'email' => ['required', 'string', 'email', 'max:255', 'unique:agents,email,' . $agent->id],
                'status' => ['required', 'string', 'in:Active,Blocked,Pending Approval'],
                'number' => ['nullable', 'string', 'max:255'],
                'whatsapp_number' => ['nullable', 'string', 'max:255'],
                'telegram_number' => ['nullable', 'string', 'max:255'],
                'profile_picture' => ['nullable', 'image', 'mimes:jpeg,png,jpg', 'max:5120'],
            ]);

            // Map status to is_active
            $validated['is_active'] = $validated['status'] === 'Active';

            // Handle profile picture upload
            if ($request->hasFile('profile_picture')) {
                // Delete old profile picture if exists
                if ($agent->profile_picture) {
                    Storage::disk('public')->delete($agent->profile_picture);
                }

                $profilePath = $request->file('profile_picture')->store('profile-pictures', 'public');
                $validated['profile_picture'] = $profilePath;
            }

            // Remove status from validated as we've converted it to is_active
            unset($validated['status']);

            // Convert empty strings to null for optional fields
            if (isset($validated['number']) && $validated['number'] === '') {
                $validated['number'] = null;
            }
            if (isset($validated['whatsapp_number']) && $validated['whatsapp_number'] === '') {
                $validated['whatsapp_number'] = null;
            }
            if (isset($validated['telegram_number']) && $validated['telegram_number'] === '') {
                $validated['telegram_number'] = null;
            }

            $agent->update($validated);

            Log::info('Agent updated by admin', [
                'agent_id' => $agent->id,
            ]);

            // Reload agent with relationships for response
            $agent->refresh();
            $agent->loadCount(['advertisements', 'adTransactions']);
            $agent->loadSum('adTransactions', 'commission');

            $status = 'Pending Approval';
            if ($agent->is_active === true) {
                $status = 'Active';
            } elseif ($agent->is_active === false && $agent->created_at->diffInDays(now()) > 0) {
                $status = 'Blocked';
            }

            $avatar = 'https://ui-avatars.com/api/?name=' . urlencode($agent->name) . '&background=ec4899&color=fff';
            if ($agent->profile_picture) {
                if (Storage::disk('public')->exists($agent->profile_picture)) {
                    $avatar = Storage::url($agent->profile_picture);
                }
            }

            return response()->json([
                'success' => true,
                'message' => 'Agent updated successfully.',
                'agent' => [
                    'id' => 'AG' . str_pad((string) $agent->id, 3, '0', STR_PAD_LEFT),
                    'name' => $agent->name,
                    'email' => $agent->email,
                    'status' => $status,
                    'totalAds' => $agent->advertisements_count ?? 0,
                    'totalCommission' => (float) ($agent->ad_transactions_sum_commission ?? 0),
                    'avatar' => $avatar,
                    'isActive' => (bool) $agent->is_active,
                ],
            ]);
        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed.',
                'errors' => $e->errors(),
            ], 422);
        } catch (\Exception $e) {
            Log::error('Failed to update agent', [
                'agent_id' => $id,
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Failed to update agent.',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Toggle agent active status
     */
    public function toggleStatus(Request $request, $id): JsonResponse
    {
        try {
            // Extract numeric ID from format like "AG001"
            $numericId = (int) str_replace('AG', '', $id);
            $agent = Agent::findOrFail($numericId);

            $validated = $request->validate([
                'is_active' => ['required', 'boolean'],
            ]);

            $agent->update([
                'is_active' => $validated['is_active'],
            ]);

            Log::info('Agent status toggled by admin', [
                'agent_id' => $agent->id,
                'is_active' => $agent->is_active,
            ]);

            // Reload agent with relationships for response
            $agent->refresh();
            $agent->loadCount(['advertisements', 'adTransactions']);
            $agent->loadSum('adTransactions', 'commission');

            $status = 'Pending Approval';
            if ($agent->is_active === true) {
                $status = 'Active';
            } elseif ($agent->is_active === false && $agent->created_at->diffInDays(now()) > 0) {
                $status = 'Blocked';
            }

            $avatar = 'https://ui-avatars.com/api/?name=' . urlencode($agent->name) . '&background=ec4899&color=fff';
            if ($agent->profile_picture) {
                if (Storage::disk('public')->exists($agent->profile_picture)) {
                    $avatar = Storage::url($agent->profile_picture);
                }
            }

            return response()->json([
                'success' => true,
                'message' => 'Agent status updated successfully.',
                'agent' => [
                    'id' => 'AG' . str_pad((string) $agent->id, 3, '0', STR_PAD_LEFT),
                    'name' => $agent->name,
                    'email' => $agent->email,
                    'status' => $status,
                    'totalAds' => $agent->advertisements_count ?? 0,
                    'totalCommission' => (float) ($agent->ad_transactions_sum_commission ?? 0),
                    'avatar' => $avatar,
                    'isActive' => (bool) $agent->is_active,
                ],
            ]);
        } catch (\Exception $e) {
            Log::error('Failed to toggle agent status', [
                'agent_id' => $id,
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Failed to update agent status.',
                'error' => $e->getMessage(),
            ], 500);
        }
    }
}

