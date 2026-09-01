<?php

namespace App\Http\Controllers;

use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;
use Inertia\Response;

class AdminAuthController extends Controller
{
    /**
     * Show the super admin login form
     */
    public function create(): Response|RedirectResponse
    {
        // If already authenticated as admin, redirect to dashboard
        if (Auth::guard('admin')->check()) {
            return redirect()->route('admin.dashboard');
        }

        return Inertia::render('Admin/SuperAdminLogin');
    }

    /**
     * Handle super admin login
     */
    public function store(Request $request): RedirectResponse
    {
        $credentials = $request->validate([
            'username' => ['required', 'string'],
            'password' => ['required', 'string'],
            'remember' => ['nullable', 'boolean'],
        ]);

        $remember = $request->boolean('remember');

        // Attempt to authenticate with username and password
        if (Auth::guard('admin')->attempt([
            'username' => $credentials['username'],
            'password' => $credentials['password'],
        ], $remember)) {
            // Check if the authenticated admin is active
            $admin = Auth::guard('admin')->user();
            
            if (!$admin || !$admin->is_active) {
                // Admin is not active, log them out
                Auth::guard('admin')->logout();
                $request->session()->invalidate();
                $request->session()->regenerateToken();
                
                Log::warning('Admin login failed - account is not active', [
                    'username' => $credentials['username'],
                ]);

                return back()
                    ->withErrors(['username' => __('Your account has been deactivated. Please contact support.')])
                    ->onlyInput('username');
            }

            $request->session()->regenerate();

            Log::info('Super admin logged in successfully', [
                'admin_id' => $admin->id,
                'username' => $credentials['username'],
                'ip' => $request->ip(),
            ]);

            return redirect()->intended(route('admin.dashboard'));
        }

        Log::warning('Super admin login failed - invalid credentials', [
            'username' => $credentials['username'],
            'ip' => $request->ip(),
        ]);

        return back()
            ->withErrors(['username' => __('Invalid credentials. Please try again.')])
            ->onlyInput('username');
    }

    /**
     * Handle super admin logout
     */
    public function destroy(Request $request): RedirectResponse
    {
        $adminId = Auth::guard('admin')->id();
        $username = Auth::guard('admin')->user()?->username;

        Auth::guard('admin')->logout();

        $request->session()->invalidate();
        $request->session()->regenerateToken();

        Log::info('Super admin logged out', [
            'admin_id' => $adminId,
            'username' => $username,
        ]);

        return redirect()->route('admin.login');
    }
}
