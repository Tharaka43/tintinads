<?php

namespace App\Http\Controllers;

use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;
use Inertia\Response;

class AgentAuthController extends Controller
{
    public function create(): Response|RedirectResponse
    {
        // If already authenticated as agent, redirect to dashboard
        if (Auth::guard('agent')->check()) {
            return redirect()->route('agent.dashboard');
        }

        return Inertia::render('Argent/AgentLoginPage');
    }

    public function store(Request $request): RedirectResponse
    {
        $credentials = $request->validate([
            'email' => ['required', 'string', 'email'],
            'password' => ['required', 'string'],
            'remember' => ['nullable', 'boolean'],
        ]);

        $remember = $request->boolean('remember');

        // First, try to authenticate with email and password
        if (Auth::guard('agent')->attempt([
            'email' => $credentials['email'],
            'password' => $credentials['password'],
        ], $remember)) {
            // Check if the authenticated agent is active
            $agent = Auth::guard('agent')->user();
            
            if (!$agent || !$agent->is_active) {
                // Agent is not active, log them out
                Auth::guard('agent')->logout();
                $request->session()->invalidate();
                $request->session()->regenerateToken();
                
                Log::warning('Agent login failed - account is not active', [
                    'email' => $credentials['email'],
                ]);

                return back()
                    ->withErrors(['email' => __('Your account has been deactivated. Please contact support.')])
                    ->onlyInput('email', 'remember');
            }

            $request->session()->regenerate();

            Log::info('Agent logged in successfully', [
                'agent_id' => $agent->id,
                'email' => $credentials['email'],
            ]);

            return redirect()->intended(route('agent.dashboard'));
        }

        Log::warning('Agent login failed - invalid credentials', [
            'email' => $credentials['email'],
        ]);

        return back()
            ->withErrors(['email' => __('These credentials do not match our records.')])
            ->onlyInput('email', 'remember');
    }

    public function destroy(Request $request): RedirectResponse
    {
        $agentId = Auth::guard('agent')->id();
        $email = Auth::guard('agent')->user()?->email;

        Auth::guard('agent')->logout();

        $request->session()->invalidate();
        $request->session()->regenerateToken();

        Log::info('Agent logged out', [
            'agent_id' => $agentId,
            'email' => $email,
        ]);

        return redirect()->route('agent.login');
    }
}

