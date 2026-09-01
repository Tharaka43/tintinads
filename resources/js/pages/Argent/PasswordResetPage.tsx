import React, { useState, useCallback, FormEvent, useMemo } from 'react';

// --- Global Constants ---
const PRIMARY_PINK = '#FF69B4';
const LIGHT_BLUE = '#87CEEB';

// --- Types ---
interface PasswordRequirements {
    length: boolean;
    number: boolean;
    uppercase: boolean;
    special: boolean;
}

// --- Utility Components for Icons ---
const CheckIcon: React.FC<{ fulfilled: boolean }> = ({ fulfilled }) => {
    const color = fulfilled ? LIGHT_BLUE : 'gray-400';
    return (
        <svg className={`w-4 h-4 text-${color}`} fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
        </svg>
    );
};

const EyeIcon: React.FC<{ isVisible: boolean }> = ({ isVisible }) => (
    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
        {isVisible ? (
            // Path for 'Eye Open'
            <>
                <path d="M10 12a2 2 0 100-4 2 2 0 000 4z"></path>
                <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd"></path>
            </>
        ) : (
            // Path for 'Eye Slash'
            <>
                <path d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L8.464 8.464M9.878 9.878l-1.415 1.415m4.243-4.243L14.12 5.636m0 0L15.535 4.222m-1.415 1.414l-1.415 1.415"></path>
            </>
        )}
    </svg>
);

// --- Main Component ---

const PasswordResetPage: React.FC = () => {
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [resetSuccess, setResetSuccess] = useState(false);

    // --- Logic 1: Password Strength & Requirements ---
    const checkStrength = useCallback((password: string): { score: number, requirements: PasswordRequirements } => {
        let score = 0;
        const requirements: PasswordRequirements = {
            length: password.length >= 8,
            number: /\d/.test(password),
            uppercase: /[A-Z]/.test(password),
            special: /[!@#$%^&*(),.?":{}|<>]/.test(password),
        };
        Object.values(requirements).forEach(met => { if (met) score++; });
        return { score, requirements };
    }, []);

    const { score, requirements } = useMemo(() => checkStrength(newPassword), [newPassword, checkStrength]);

    const strengthData = useMemo(() => {
        let text = 'Weak';
        let barClass = 'bg-red-500';
        if (score === 0) { text = 'Enter password'; barClass = 'bg-gray-300'; }
        else if (score === 2) { text = 'Fair'; barClass = 'bg-orange-500'; }
        else if (score === 3) { text = 'Good'; barClass = 'bg-primary-pink'; }
        else if (score === 4) { text = 'Strong'; barClass = 'bg-light-blue'; }
        return { text, barClass, width: (score / 4) * 100 };
    }, [score]);

    // --- Logic 2: Password Match ---
    const passwordsMatch = newPassword.length > 0 && newPassword === confirmPassword;
    const showMatchMessage = confirmPassword.length > 0;

    // --- Logic 3: Submit Button State ---
    const isReadyToSubmit = score >= 3 && passwordsMatch;
    const buttonClass = isReadyToSubmit 
        ? `bg-primary-pink hover:bg-pink-600 cursor-pointer` 
        : `bg-gray-400 cursor-not-allowed`;

    // --- Handlers ---
    const togglePasswordVisibility = (field: 'new' | 'confirm') => {
        if (field === 'new') setShowNewPassword(p => !p);
        if (field === 'confirm') setShowConfirmPassword(p => !p);
    };

    const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setNewPassword(e.target.value);
    };

    const handleConfirmChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setConfirmPassword(e.target.value);
    };

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        if (!isReadyToSubmit) return;

        setIsSubmitting(true);
        
        setTimeout(() => {
            setIsSubmitting(false);
            setResetSuccess(true);
            
            // Simulate redirect to login page after 3 seconds
            setTimeout(() => {
                // In a real application: navigate('/login')
                setResetSuccess(false); // Hide banner
                console.log('Redirecting to login page...');
            }, 3000);

        }, 1500);
    };


    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
            
            {/* Success Banner */}
            {resetSuccess && (
                <div id="successBanner" className="fixed top-0 left-0 right-0 bg-green-500 text-white px-4 py-3 z-50">
                    <div className="max-w-4xl mx-auto flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path></svg>
                            <span className="font-medium">Password successfully reset. Please log in.</span>
                        </div>
                        <button onClick={() => setResetSuccess(false)} className="text-white hover:text-gray-200">
                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd"></path></svg>
                        </button>
                    </div>
                </div>
            )}

            {/* Main Content */}
            <div className="w-full max-w-md">
                {/* Form Card */}
                <div className="bg-white rounded-2xl shadow-xl p-8 sm:p-10">
                    {/* Header */}
                    <div className="text-center mb-8">
                        <div className="w-16 h-16 bg-gradient-to-r from-primary-pink to-light-blue rounded-full flex items-center justify-center mx-auto mb-4">
                            <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd"></path>
                            </svg>
                        </div>
                        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Set a New Password</h1>
                        <p className="text-gray-600">Create a strong password to secure your account</p>
                    </div>

                    {/* Form */}
                    <form id="resetForm" className="space-y-6" onSubmit={handleSubmit}>
                        
                        {/* New Password Field */}
                        <div>
                            <label htmlFor="newPassword" className="block text-sm font-semibold text-gray-700 mb-2">New Password</label>
                            <div className="relative">
                                <input 
                                    type={showNewPassword ? 'text' : 'password'} 
                                    id="newPassword" 
                                    name="newPassword" 
                                    required
                                    value={newPassword}
                                    onChange={handlePasswordChange}
                                    className={`w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-pink focus:border-transparent transition-all duration-200 pr-12`}
                                    style={{ ringColor: PRIMARY_PINK }}
                                    placeholder="Enter your new password"
                                    disabled={isSubmitting}
                                />
                                <button type="button" onClick={() => togglePasswordVisibility('new')} className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700">
                                    <EyeIcon isVisible={showNewPassword} />
                                </button>
                            </div>
                            
                            {/* Password Strength Indicator */}
                            <div className="mt-2">
                                <div className="flex justify-between items-center mb-1">
                                    <span className="text-xs font-medium text-gray-600">Password Strength</span>
                                    <span id="strengthText" className={`text-xs font-medium`} style={{ color: strengthData.score === 1 ? '#EF4444' : strengthData.score === 2 ? '#F97316' : strengthData.score === 3 ? PRIMARY_PINK : LIGHT_BLUE }}>{strengthData.text}</span>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-2">
                                    <div id="strengthBar" className={`h-2 rounded-full transition-all duration-300 ${strengthData.barClass}`} style={{ width: `${strengthData.width}%` }}></div>
                                </div>
                            </div>
                        </div>

                        {/* Requirements Checklist */}
                        <div className="bg-gray-50 rounded-lg p-4">
                            <h3 className="text-sm font-semibold text-gray-700 mb-3">Password Requirements</h3>
                            <div className="space-y-2">
                                <div className={`flex items-center space-x-2 text-sm ${requirements.length ? 'text-light-blue' : 'text-gray-600'}`}>
                                    <CheckIcon fulfilled={requirements.length} />
                                    <span className={requirements.length ? 'line-through' : ''}>Minimum 8 characters</span>
                                </div>
                                <div className={`flex items-center space-x-2 text-sm ${requirements.number ? 'text-light-blue' : 'text-gray-600'}`}>
                                    <CheckIcon fulfilled={requirements.number} />
                                    <span className={requirements.number ? 'line-through' : ''}>Contains a number</span>
                                </div>
                                <div className={`flex items-center space-x-2 text-sm ${requirements.uppercase ? 'text-light-blue' : 'text-gray-600'}`}>
                                    <CheckIcon fulfilled={requirements.uppercase} />
                                    <span className={requirements.uppercase ? 'line-through' : ''}>Contains uppercase letter</span>
                                </div>
                                <div className={`flex items-center space-x-2 text-sm ${requirements.special ? 'text-light-blue' : 'text-gray-600'}`}>
                                    <CheckIcon fulfilled={requirements.special} />
                                    <span className={requirements.special ? 'line-through' : ''}>Contains special character</span>
                                </div>
                            </div>
                        </div>

                        {/* Confirm Password Field */}
                        <div>
                            <label htmlFor="confirmPassword" className="block text-sm font-semibold text-gray-700 mb-2">Confirm New Password</label>
                            <div className="relative">
                                <input 
                                    type={showConfirmPassword ? 'text' : 'password'} 
                                    id="confirmPassword" 
                                    name="confirmPassword" 
                                    required
                                    value={confirmPassword}
                                    onChange={handleConfirmChange}
                                    className={`w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-pink focus:border-transparent transition-all duration-200 pr-12`}
                                    style={{ ringColor: PRIMARY_PINK }}
                                    placeholder="Confirm your new password"
                                    disabled={isSubmitting}
                                />
                                <button type="button" onClick={() => togglePasswordVisibility('confirm')} className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700">
                                    <EyeIcon isVisible={showConfirmPassword} />
                                </button>
                            </div>
                            <div id="matchMessage" className="mt-1 text-sm">
                                {showMatchMessage && (
                                    <span className={passwordsMatch ? 'text-green-600' : 'text-red-600'}>
                                        {passwordsMatch ? '✓ Passwords match' : '✗ Passwords do not match'}
                                    </span>
                                )}
                            </div>
                        </div>

                        {/* Reset Button */}
                        <button 
                            type="submit" 
                            id="resetBtn" 
                            disabled={!isReadyToSubmit || isSubmitting}
                            className={`w-full text-white font-semibold py-3 px-4 rounded-lg transition-all duration-200 ${buttonClass}`}
                        >
                            {isSubmitting ? 'Resetting...' : 'Reset Password'}
                        </button>
                    </form>

                    {/* Back to Login */}
                    <div className="mt-6 text-center">
                        <a href="#" className="text-sm text-primary-pink hover:text-pink-600 font-medium transition-colors duration-200">
                            ← Back to Login
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PasswordResetPage;