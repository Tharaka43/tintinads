import React, { FormEvent } from 'react';
import { Head, useForm } from '@inertiajs/react';

type AgentLoginForm = {
    email: string;
    password: string;
    remember: boolean;
};

const AgentLoginPage: React.FC = () => {
    const {
        data,
        setData,
        post,
        processing,
        reset,
        errors,
    } = useForm<AgentLoginForm>({
        email: '',
        password: '',
        remember: false,
    });

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        post('/agent/login', {
            onFinish: () => reset('password'),
        });
    };

    return (
        <div className="min-h-screen bg-[#f8f9fc] flex flex-col justify-center sm:py-12 relative overflow-hidden">
            <Head title="Agent Login - ClassifiedHub" />
            
            {/* Background Decorations */}
            <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-pink-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
            <div className="absolute top-[-10%] right-[-10%] w-96 h-96 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
            <div className="absolute bottom-[-20%] left-[20%] w-96 h-96 bg-pink-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>

            <div className="relative py-0 sm:py-3 sm:max-w-md sm:mx-auto w-full px-4 sm:px-0">
                <div className="absolute inset-0 bg-gradient-to-r from-pink-400 to-purple-500 shadow-lg transform -skew-y-6 sm:skew-y-0 sm:-rotate-6 sm:rounded-3xl opacity-20"></div>
                
                <div className="relative bg-white shadow-xl rounded-2xl sm:rounded-3xl px-5 py-8 sm:p-12">
                    <div className="max-w-md mx-auto">
                        
                        {/* Logo and Header */}
                        <div className="text-center mb-8">
                            <a href="/" className="inline-flex items-center justify-center mb-6">
                                <img src="/build/assets/siteicon.png" alt="Logo Icon" className="h-12 w-auto mr-2" />
                                <img src="/build/assets/sitetxt.png" alt="Logo Text" className="h-8 w-auto" />
                            </a>
                            <h1 className="text-2xl font-black text-gray-900 tracking-tight">Agent Portal</h1>
                            <p className="text-gray-500 mt-2 text-sm font-medium">Log in to post and manage your advertisements</p>
                        </div>

                        {/* Login Form */}
                        <div className="divide-y divide-gray-200">
                            <form className="py-2 text-base leading-6 space-y-5 sm:space-y-6 text-gray-700 sm:text-lg sm:leading-7" onSubmit={handleSubmit}>
                                
                                {/* Email Field */}
                                <div className="relative">
                                    <label htmlFor="email" className="block text-sm font-bold text-gray-700 mb-1">Email Address</label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <i className="fas fa-envelope text-gray-400"></i>
                                        </div>
                                        <input 
                                            type="text" 
                                            id="email" 
                                            className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all bg-gray-50 focus:bg-white text-sm" 
                                            placeholder="agent@example.com"
                                            value={data.email}
                                            onChange={(e) => setData('email', e.target.value)}
                                            required
                                            disabled={processing}
                                        />
                                    </div>
                                    {errors.email && (
                                        <p className="mt-1 text-sm text-red-500 font-medium">{errors.email}</p>
                                    )}
                                </div>

                                {/* Password Field */}
                                <div className="relative">
                                    <label htmlFor="password" className="block text-sm font-bold text-gray-700 mb-1">Password</label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <i className="fas fa-lock text-gray-400"></i>
                                        </div>
                                        <input 
                                            type="password" 
                                            id="password" 
                                            className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all bg-gray-50 focus:bg-white text-sm" 
                                            placeholder="••••••••"
                                            value={data.password}
                                            onChange={(e) => setData('password', e.target.value)}
                                            required
                                            disabled={processing}
                                        />
                                    </div>
                                    {errors.password && (
                                        <p className="mt-1 text-sm text-red-500 font-medium">{errors.password}</p>
                                    )}
                                </div>

                                {/* Remember Me */}
                                <div className="flex items-center justify-between mt-4">
                                    <div className="flex items-center">
                                        <input 
                                            type="checkbox" 
                                            id="remember" 
                                            className="h-4 w-4 text-pink-600 focus:ring-pink-500 border-gray-300 rounded cursor-pointer transition-colors"
                                            checked={data.remember}
                                            onChange={(e) => setData('remember', e.target.checked)}
                                            disabled={processing}
                                        />
                                        <label htmlFor="remember" className="ml-2 block text-sm text-gray-600 cursor-pointer select-none">
                                            Remember me
                                        </label>
                                    </div>
                                </div>

                                {/* Submit Button */}
                                <div className="pt-4">
                                    <button 
                                        type="submit" 
                                        disabled={processing}
                                        className={`w-full flex justify-center items-center py-3.5 px-4 border border-transparent rounded-xl shadow-sm text-sm font-bold text-white bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500 transition-all ${processing ? 'opacity-75 cursor-wait' : 'hover:shadow-md transform hover:-translate-y-0.5'}`}
                                    >
                                        {processing ? (
                                            <>
                                                <i className="fas fa-circle-notch fa-spin mr-2"></i>
                                                Authenticating...
                                            </>
                                        ) : (
                                            <>
                                                Secure Login <i className="fas fa-arrow-right ml-2"></i>
                                            </>
                                        )}
                                    </button>
                                </div>
                            </form>
                        </div>
                        
                        {/* Footer text */}
                        <div className="mt-8 text-center text-sm text-gray-500">
                            <p>Are you a verified agent? Contact administration if you lost your credentials.</p>
                            <a href="/" className="mt-4 inline-flex items-center text-pink-600 hover:text-pink-700 font-semibold transition-colors">
                                <i className="fas fa-arrow-left mr-1"></i> Back to Homepage
                            </a>
                        </div>
                        
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AgentLoginPage;
