import React, { useState, useEffect } from 'react';

const PRIMARY_PINK = '#FF69B4';

const NavBar: React.FC = () => {
    const [savedAds, setSavedAds] = useState<number[]>([]);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    useEffect(() => {
        const saved = localStorage.getItem('savedAds');
        if (saved) {
            try {
                setSavedAds(JSON.parse(saved));
            } catch (e) {
                console.error("Error parsing saved ads", e);
            }
        }
    }, []);

    const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);

    return (
        <header className="sticky overflow-hidden top-0 z-50 bg-white shadow-sm border-b border-gray-200">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    {/* Logo */}
                    <a href="/" className="flex items-center">
                        <img src="/assets/siteicon.png" alt="ClassifiedHub Logo" className="h-15 mr-3" />
                        <img src="/assets/sitetxt.png" alt="ClassifiedHub Text" className="h-8 mr-3" />
                    </a>

                    {/* Desktop Navigation */}
                    <nav className="hidden md:flex items-center space-x-8">
                        <a href="/" className="text-gray-700 hover:text-primary-pink transition-colors">Browse</a>
                        <a href="/blog" className="text-gray-700 hover:text-primary-pink transition-colors font-medium">Blog</a>
                        <a href="/saved-ads" className="text-gray-700 hover:text-primary-pink transition-colors relative">
                            Saved Ads
                            {savedAds.length > 0 && (
                                <span className="absolute -top-2 -right-2 bg-pink-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                                    {savedAds.length}
                                </span>
                            )}
                        </a>
                        <a href="/packages" className="text-gray-700 hover:text-primary-pink transition-colors font-medium text-pink-600">
                            Packages & Pricing
                        </a>
                        <a href="/terms-and-conditions" className="text-gray-700 hover:text-primary-pink transition-colors">
                            Terms & Conditions
                        </a>
                    </nav>
                    
                    {/* Mobile Menu Button */}
                    <button className="md:hidden p-2" onClick={toggleMobileMenu}>
                        <i className="fas fa-bars text-gray-700"></i>
                    </button>
                </div>
            </div>

            {/* Mobile Navigation */}
            {isMobileMenuOpen && (
                <div className="md:hidden bg-white border-t border-gray-200">
                    <div className="px-4 py-2 space-y-2">
                        <a href="/" className="block py-2 text-gray-700 hover:text-pink-600">
                            <i className="fas fa-search w-6 text-center text-gray-400 mr-2"></i> Browse
                        </a>
                        <a href="/agents" className="block py-2 text-gray-700 hover:text-pink-600">
                            <i className="fas fa-user-shield w-6 text-center text-pink-500 mr-2"></i> Agents
                        </a>
                        <a href="/premium" className="block py-2 text-gray-700 hover:text-amber-500">
                            <i className="fas fa-crown w-6 text-center text-amber-500 mr-2"></i> Premium
                        </a>
                        <a href="/saved-ads" className="block py-2 text-gray-700 hover:text-red-600 relative">
                            <i className="far fa-heart w-6 text-center text-red-500 mr-2"></i> Saved Ads
                            {savedAds.length > 0 && (
                                <span className="ml-2 bg-pink-500 text-white text-xs rounded-full px-2 py-0.5">
                                    {savedAds.length}
                                </span>
                            )}
                        </a>
                        <a href="/blog" className="block py-2 text-gray-700 hover:text-cyan-600">
                            <i className="far fa-newspaper w-6 text-center text-cyan-500 mr-2"></i> Blog
                        </a>
                        <a href="/packages" className="block py-2 text-pink-600 hover:text-pink-700 font-medium">
                            <i className="fas fa-tags w-6 text-center text-pink-500 mr-2"></i> Packages & Pricing
                        </a>
                        <a href="/terms-and-conditions" className="block py-2 text-gray-700 hover:text-gray-900">
                            <i className="fas fa-file-contract w-6 text-center text-gray-400 mr-2"></i> Terms & Conditions
                        </a>
                    </div>
                </div>
            )}
        </header>
    );
};

export default NavBar;
