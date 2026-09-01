import React, { useState, FormEvent } from 'react';

// --- Global Constants ---
const PRIMARY_PINK = '#FF69B4';
const LIGHT_BLUE = '#87CEEB';

interface FormState {
    email: string;
}

const ForgotPasswordPage: React.FC = () => {
    const [formData, setFormData] = useState<FormState>({ email: '' });
    const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
    const [message, setMessage] = useState<string>('');

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        setStatus('loading');
        setMessage('');

        // Basic client-side email validation
        if (!formData.email || !formData.email.includes('@')) {
            setStatus('error');
            setMessage('Please enter a valid email address.');
            return;
        }

        // Simulate API call to send reset link
        setTimeout(() => {
            // In a real application, you'd check the API response here.
            
            setStatus('success');
            setMessage('Success! Check your inbox for the password reset link.');

            // Clear email field after successful submission
            setFormData({ email: '' });

        }, 2000);
    };

    const isButtonDisabled = status === 'loading';

    // Determine button appearance and text
    const buttonText = {
        idle: 'Send Reset Link',
        loading: 'Sending...',
        success: 'Link Sent Successfully!',
        error: 'Send Reset Link',
    };

    const buttonStyle = {
        backgroundColor: status === 'success' ? '#10B981' : PRIMARY_PINK, // Green on success
        hoverBackgroundColor: status === 'success' ? '#059669' : '#EC4899', // Darker green/pink
    };

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 sm:px-6 lg:px-8">
            <div className="w-full max-w-md">
                
                {/* Main Card */}
                <div className="bg-white rounded-lg shadow-lg p-6 sm:p-8">
                    
                    {/* Header */}
                    <div className="text-center mb-6">
                        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3">Forgot Your Password?</h1>
                        <p className="text-sm sm:text-base text-gray-600 leading-relaxed">Enter the email address associated with your Agent account to receive a reset link.</p>
                    </div>
                    
                    {/* Status Message */}
                    {message && (
                        <div 
                            className={`p-3 mb-4 rounded-md text-center ${status === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}
                            role="alert"
                        >
                            {message}
                        </div>
                    )}

                    {/* Form */}
                    <form className="space-y-6" onSubmit={handleSubmit}>
                        
                        {/* Email Input */}
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">Registered Email</label>
                            <input 
                                type="email" 
                                id="email" 
                                name="email" 
                                required 
                                value={formData.email}
                                onChange={handleChange}
                                disabled={isButtonDisabled}
                                className={`w-full px-3 py-3 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-light-blue focus:border-light-blue transition-colors duration-200`}
                                style={{ borderColor: LIGHT_BLUE, ringColor: LIGHT_BLUE }}
                                placeholder="Enter your registered email address"
                            />
                        </div>

                        {/* Submit Button */}
                        <button 
                            type="submit" 
                            className={`w-full text-white font-semibold py-3 px-4 rounded-md transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary-pink focus:ring-offset-2 ${isButtonDisabled ? 'opacity-60 cursor-not-allowed' : 'hover:bg-pink-500'}`}
                            style={{ backgroundColor: buttonStyle.backgroundColor, ringColor: PRIMARY_PINK }}
                            disabled={isButtonDisabled}
                        >
                            {buttonText[status]}
                        </button>
                    </form>

                    {/* Back to Login Link */}
                    <div className="mt-6 text-center">
                        <a 
                            href="#" 
                            className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900 transition-colors duration-200"
                        >
                            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
                            </svg>
                            Back to Login
                        </a>
                    </div>
                </div>

                {/* Security Note */}
                <div className="mt-4 text-center">
                    <p className="text-xs text-gray-500">For security purposes, you'll receive an email even if the address isn't registered.</p>
                </div>
            </div>
        </div>
    );
};

export default ForgotPasswordPage;