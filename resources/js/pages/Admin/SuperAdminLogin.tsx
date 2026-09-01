import React, { useState, useCallback, FormEvent, useEffect } from 'react';
import { router, usePage } from '@inertiajs/react';

// --- Global Constants ---
const PRIMARY_PINK = '#FF69B4'; // Used for button color base
const DARK_GRAY = '#1F2937'; // Tailwind gray-900 equivalent

// --- Utility Components ---

const EyeIcon: React.FC<{ isVisible: boolean }> = ({ isVisible }) => (
    <i className={`transition-colors ${isVisible ? 'fas fa-eye-slash' : 'fas fa-eye'} text-gray-400 hover:text-gray-600`} id="toggleIcon"></i>
);

// --- Main Component ---

const SuperAdminLogin: React.FC = () => {
    const { errors: pageErrors } = usePage().props as any;
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    useEffect(() => {
        if (pageErrors?.username) {
            setErrorMessage(pageErrors.username);
        }
    }, [pageErrors]);

    const togglePassword = useCallback(() => {
        setShowPassword(prev => !prev);
    }, []);

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        if (isSubmitting) return;

        // Basic validation
        if (!username || !password) {
            alert("Please enter both username and password.");
            return;
        }

        setIsSubmitting(true);

        setErrorMessage(null);
        
        // Submit to backend
        router.post('/admin/login', {
            username: username,
            password: password,
        }, {
            onFinish: () => {
                setIsSubmitting(false);
            },
            onError: (errors) => {
                setIsSubmitting(false);
                if (errors.username) {
                    setErrorMessage(errors.username);
                } else {
                    setErrorMessage('Invalid credentials. Please try again.');
                }
            },
        });
    };

    const buttonStyle = {
        backgroundColor: isSubmitting ? '#FF1493' : '#FF69B4',
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black flex items-center justify-center p-4">
            
            {/* Injecting background style directly as it's complex SVG data */}
            <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' fill='none opacity-50">
            
            </div>
            

            <div className="relative w-full max-w-md">
                
                {/* Login Card */}
                <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl border border-gray-200/50 p-8 sm:p-10">
                    
                    {/* Header */}
                    <div className="text-center mb-8">
                        <div className="flex justify-center mb-4">
                            <div className="bg-gray-900 p-4 rounded-full">
                                <i className="fas fa-user-shield text-2xl text-white"></i>
                            </div>
                        </div>
                        <h1 className="text-3xl font-bold text-gray-900 mb-2">Super Admin Access</h1>
                        <p className="text-gray-600 text-sm">Secure authentication portal</p>
                    </div>
                    
                    {/* Login Form */}
                    <form className="space-y-6" onSubmit={handleSubmit}>
                        
                        {/* Admin Username/Email Field */}
                        <div className="space-y-2">
                            <label htmlFor="admin-email" className="block text-sm font-semibold text-gray-700">Admin Username/Email</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <i className="fas fa-user-cog text-gray-400"></i>
                                </div>
                                <input 
                                    type="text" 
                                    id="admin-email" 
                                    name="admin-email" 
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    className="w-full pl-10 pr-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-gray-900 transition-all duration-200 bg-white text-gray-900 placeholder-gray-500" 
                                    placeholder="Enter admin username"
                                    required
                                    disabled={isSubmitting}
                                />
                            </div>
                        </div>
                        
                        {/* Password Field */}
                        <div className="space-y-2">
                            <label htmlFor="password" className="block text-sm font-semibold text-gray-700">Password</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <i className="fas fa-lock text-gray-400"></i>
                                </div>
                                <input 
                                    type={showPassword ? 'text' : 'password'} 
                                    id="password" 
                                    name="password" 
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full pl-10 pr-12 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-gray-900 transition-all duration-200 bg-white text-gray-900 placeholder-gray-500" 
                                    placeholder="Enter secure password"
                                    required
                                    disabled={isSubmitting}
                                />
                                <button type="button" onClick={togglePassword} className="absolute inset-y-0 right-0 pr-3 flex items-center" disabled={isSubmitting}>
                                    <EyeIcon isVisible={showPassword} />
                                </button>
                            </div>
                        </div>
                        
                        {/* Error Message */}
                        {errorMessage && (
                            <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                                <div className="flex items-start space-x-2">
                                    <i className="fas fa-exclamation-circle text-red-600 mt-0.5 text-sm"></i>
                                    <p className="text-xs text-red-800 leading-relaxed">
                                        {errorMessage}
                                    </p>
                                </div>
                            </div>
                        )}
                        
                        {/* Login Button */}
                        <button 
                            type="submit" 
                            className={`w-full text-white font-bold py-3 px-4 rounded-lg transition-all duration-200 transform hover:scale-[1.02] focus:ring-4 focus:ring-pink-300 focus:outline-none shadow-lg ${isSubmitting ? 'bg-pink-400 cursor-not-allowed' : 'hover:bg-[#FF1493]'}`}
                            style={buttonStyle}
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? 
                                <><i className="fas fa-spinner fa-spin mr-2"></i>Authenticating...</> :
                                <><i className="fas fa-shield-check mr-2"></i>Secure Login</>
                            }
                        </button>
                    </form>
                    
                    {/* Additional Security Info */}
                    <div className="mt-6 pt-6 border-t border-gray-200">
                        <div className="flex items-center justify-center space-x-4 text-xs text-gray-500">
                            <div className="flex items-center space-x-1"><i className="fas fa-lock"></i><span>256-bit SSL</span></div>
                            <div className="flex items-center space-x-1"><i className="fas fa-eye"></i><span>Activity Monitored</span></div>
                            <div className="flex items-center space-x-1"><i className="fas fa-clock"></i><span>Session Timeout: 30min</span></div>
                        </div>
                    </div>
                </div>
                
                {/* Footer */}
                <div className="text-center mt-6">
                    <p className="text-gray-400 text-xs">
                        © 2024 Platform Administration. Unauthorized access prohibited.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default SuperAdminLogin;