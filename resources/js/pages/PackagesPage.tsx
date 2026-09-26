import React from 'react';
import { router } from '@inertiajs/react';

const PackagesPage: React.FC = () => {
    return (
        <div className="bg-gray-50 min-h-screen font-sans">
            {/* Header */}
            <header className="bg-white shadow-sm border-b sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">
                        <div className="flex items-center">
                            <button 
                                onClick={() => router.visit('/')}
                                className="p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors"
                            >
                                <i className="fas fa-arrow-left"></i>
                            </button>
                            <h1 className="ml-3 text-lg font-semibold text-gray-900">Back to Home</h1>
                        </div>
                    </div>
                </div>
            </header>

            {/* Custom Styles for Borders */}
            <style>{`
                @keyframes vipGoldBorderAnimation {
                    0% { background-position: 0% 50%; }
                    50% { background-position: 100% 50%; }
                    100% { background-position: 0% 50%; }
                }
                @keyframes premiumPinkBorderAnimation {
                    0% { background-position: 0% 50%; }
                    50% { background-position: 100% 50%; }
                    100% { background-position: 0% 50%; }
                }
                @keyframes platinumSilverBorderAnimation {
                    0% { background-position: 0% 50%; }
                    50% { background-position: 100% 50%; }
                    100% { background-position: 0% 50%; }
                }
                .vip-gold-animated-border {
                    position: relative;
                    background: linear-gradient(90deg, #fbbf24, #f59e0b, #d97706, #fbbf24);
                    background-size: 200% 100%;
                    animation: vipGoldBorderAnimation 3s ease infinite;
                }
                .premium-pink-animated-border {
                    position: relative;
                    background: linear-gradient(90deg, #f472b6, #ec4899, #d946ef, #f472b6);
                    background-size: 200% 100%;
                    animation: premiumPinkBorderAnimation 3s ease infinite;
                }
                .platinum-silver-animated-border {
                    position: relative;
                    background: linear-gradient(90deg, #94a3b8, #cbd5e1, #f1f5f9, #cbd5e1, #94a3b8);
                    background-size: 200% 100%;
                    animation: platinumSilverBorderAnimation 3s ease infinite;
                }
            `}</style>

            {/* Main Content */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="text-center mb-12">
                    <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                        අපගේ Packages (Pricing Plans)
                    </h1>
                    <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                        ඔබගේ අවශ්‍යතාවය අනුව ගැළපෙන Package එක තෝරාගන්න. හැම Package එකක්ම දින 30ක් පුරාවටම සක්‍රීයව පවතිනවා.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-8">
                    
                    {/* Normal Package */}
                    <div className="bg-white rounded-2xl shadow-md overflow-hidden border border-gray-200 hover:shadow-xl transition-shadow duration-300 flex flex-col">
                        <div className="p-8 text-center bg-gray-50 border-b border-gray-200">
                            <h2 className="text-2xl font-bold text-gray-800 mb-2">Normal</h2>
                            <p className="text-sm text-gray-500 mb-6">සාමාන්‍ය දැන්වීමක් සඳහා</p>
                            <div className="text-4xl font-extrabold text-pink-600">
                                Rs. 300
                            </div>
                        </div>
                        <div className="p-8 flex-grow">
                            <ul className="space-y-4">
                                <li className="flex items-center text-gray-600">
                                    <i className="fas fa-check text-green-500 mr-3"></i> දින 30ක කාලයක්
                                </li>
                                <li className="flex items-center text-gray-600">
                                    <i className="fas fa-check text-green-500 mr-3"></i> උපරිම පින්තූර 1ක් පමණයි
                                </li>
                                <li className="flex items-center text-gray-600">
                                    <i className="fas fa-check text-green-500 mr-3"></i> සාමාන්‍ය පෙනුම
                                </li>
                            </ul>
                        </div>
                    </div>

                    {/* Premium Package */}
                    <div className="p-[3px] rounded-2xl premium-pink-animated-border hover:shadow-xl transition-all duration-300 flex flex-col transform hover:-translate-y-2">
                        <div className="bg-white rounded-[14px] flex flex-col h-full overflow-hidden">
                            <div className="p-8 text-center bg-pink-50 border-b border-pink-100 relative">
                                <div className="absolute top-0 right-0 bg-gradient-to-r from-pink-500 to-rose-500 text-white text-xs font-bold px-3 py-1 rounded-bl-lg">
                                    <i className="fas fa-star mr-1"></i> Prem
                                </div>
                                <h2 className="text-2xl font-bold text-pink-700 mb-2">Premium</h2>
                                <p className="text-sm text-pink-500 mb-6">කැපී පෙනෙන දැන්වීමක් සඳහා</p>
                                <div className="text-4xl font-extrabold text-pink-600">
                                    Rs. 500
                                </div>
                            </div>
                            <div className="p-8 flex-grow">
                                <ul className="space-y-4">
                                    <li className="flex items-center text-gray-700">
                                        <i className="fas fa-check text-pink-500 mr-3"></i> දින 30ක කාලයක්
                                    </li>
                                    <li className="flex items-center text-gray-700">
                                        <i className="fas fa-check text-pink-500 mr-3"></i> උපරිම පින්තූර 3ක්
                                    </li>
                                    <li className="flex items-center text-gray-700">
                                        <i className="fas fa-check text-pink-500 mr-3"></i> රෝස පාට Border එක සහ Badge එක
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>

                    {/* VIP Package */}
                    <div className="p-[3px] rounded-2xl vip-gold-animated-border hover:shadow-xl transition-all duration-300 flex flex-col transform hover:-translate-y-2 shadow-yellow-500/20">
                        <div className="bg-white rounded-[14px] flex flex-col h-full overflow-hidden">
                            <div className="p-8 text-center bg-amber-50 border-b border-amber-100 relative">
                                <div className="absolute top-0 right-0 bg-gradient-to-r from-amber-400 to-amber-600 text-white text-xs font-bold px-3 py-1 rounded-bl-lg">
                                    <i className="fas fa-crown mr-1"></i> VIP
                                </div>
                                <h2 className="text-2xl font-bold text-amber-700 mb-2">VIP</h2>
                                <p className="text-sm text-amber-600 mb-6">ඉතාමත් ඉහළ අවධානයක් සඳහා</p>
                                <div className="text-4xl font-extrabold text-amber-600">
                                    Rs. 700
                                </div>
                            </div>
                            <div className="p-8 flex-grow">
                                <ul className="space-y-4">
                                    <li className="flex items-center text-gray-700">
                                        <i className="fas fa-check text-amber-500 mr-3"></i> දින 30ක කාලයක්
                                    </li>
                                    <li className="flex items-center text-gray-700">
                                        <i className="fas fa-check text-amber-500 mr-3"></i> උපරිම පින්තූර 5ක්
                                    </li>
                                    <li className="flex items-center text-gray-700">
                                        <i className="fas fa-check text-amber-500 mr-3"></i> රන් පාට Border එක සහ VIP Badge එක
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>

                    {/* Platinum Package */}
                    <div className="p-[3px] rounded-2xl platinum-silver-animated-border hover:shadow-xl transition-all duration-300 flex flex-col transform hover:-translate-y-2 shadow-slate-500/20">
                        <div className="bg-white rounded-[14px] flex flex-col h-full overflow-hidden">
                            <div className="p-8 text-center bg-slate-50 border-b border-slate-200 relative">
                                <div className="absolute top-0 right-0 bg-gradient-to-r from-slate-500 to-slate-700 text-white text-xs font-bold px-3 py-1 rounded-bl-lg">
                                    <i className="fas fa-gem mr-1"></i> Platinum
                                </div>
                                <h2 className="text-2xl font-bold text-slate-700 mb-2">Platinum</h2>
                                <p className="text-sm text-slate-500 mb-6">ඔබගේ ව්‍යාපාරයේ උපරිම වර්ධනයට</p>
                                <div className="text-4xl font-extrabold text-slate-700">
                                    Rs. 1500
                                </div>
                            </div>
                            <div className="p-8 flex-grow">
                                <ul className="space-y-4">
                                    <li className="flex items-center text-gray-700">
                                        <i className="fas fa-check text-slate-500 mr-3"></i> දින 30ක කාලයක්
                                    </li>
                                    <li className="flex items-center text-gray-700">
                                        <i className="fas fa-check text-slate-500 mr-3"></i> උපරිම පින්තූර 5ක්
                                    </li>
                                    <li className="flex items-center text-gray-700">
                                        <i className="fas fa-check text-slate-500 mr-3"></i> Silver Border එක සහ Platinum Badge එක
                                    </li>
                                    <li className="flex items-center text-gray-700 font-bold">
                                        <i className="fas fa-star text-slate-500 mr-3"></i> Top List පෙනුම
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>

                </div>

                <div className="mt-16 text-center">
                    <p className="text-gray-600 mb-6">ඔබට වැඩි විස්තර දැනගැනීමට අවශ්‍ය නම් අපව අමතන්න.</p>
                    <button 
                        onClick={() => router.visit('/login')}
                        className="bg-pink-600 hover:bg-pink-700 text-white font-bold py-3 px-8 rounded-full shadow-lg transition-colors duration-200"
                    >
                        දැන්වීමක් පළ කරන්න (Post Ad)
                    </button>
                </div>
            </div>
        </div>
    );
};

export default PackagesPage;
