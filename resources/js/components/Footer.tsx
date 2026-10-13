import React from 'react';
import { Link } from '@inertiajs/react';

const Footer = () => {
    return (
        <footer className="bg-gray-900 text-gray-300 py-12 mt-16 border-t border-gray-800">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
                    
                    {/* Column 1: About & SEO */}
                    <div className="space-y-4 text-center md:text-left">
                        <div className="flex flex-col items-center md:items-start space-y-2">
                            <img 
                                src="/assets/sitelogo.png" 
                                alt="TinTinAds Logo" 
                                className="h-20 object-contain"
                            />
                            <h2 className="text-2xl font-bold text-white tracking-wide">
                                <span className="text-pink-500">TinTin</span>Ads
                            </h2>
                        </div>
                        <p className="text-sm leading-relaxed text-gray-400 mt-4">
                            Looking for the best alternative to SL Ads, Hela Ads, and Hitad? Welcome to TinTinAds! 
                            We are Sri Lanka's fastest-growing marketplace to buy, sell, and find exactly what you need. 
                            Whether you are searching for Lanka Ads, Spa Ads, jobs, vehicles, or personal ads in Sri Lanka, 
                            TinTinAds provides a safe, secure, and lightning-fast platform for all your classified needs.
                        </p>
                    </div>

                    {/* Column 2: Quick Links */}
                    <div className="space-y-4 text-center md:text-left md:pl-8">
                        <h3 className="text-lg font-semibold text-white">Quick Links</h3>
                        <ul className="space-y-2">
                            <li>
                                <Link href="/" className="text-sm hover:text-pink-500 transition-colors">Home</Link>
                            </li>
                            <li>
                                <Link href="/blog" className="text-sm hover:text-pink-500 transition-colors">Blog</Link>
                            </li>
                            <li>
                                <Link href="/packages" className="text-sm hover:text-pink-500 transition-colors">Packages & Pricing</Link>
                            </li>
                            <li>
                                <Link href="/saved-ads" className="text-sm hover:text-pink-500 transition-colors">Saved Ads</Link>
                            </li>
                            <li>
                                <Link href="/terms-and-conditions" className="text-sm hover:text-pink-500 transition-colors">Terms & Conditions</Link>
                            </li>
                        </ul>
                    </div>

                    {/* Column 3: Contact & Socials */}
                    <div className="space-y-4 text-center md:text-left">
                        <h3 className="text-lg font-semibold text-white">Contact Us</h3>
                        
                        {/* Address */}
                        <div className="flex items-center justify-center md:justify-start space-x-2 text-sm text-gray-300">
                            <i className="fas fa-map-marker-alt text-pink-500"></i>
                            <span>Marine Drive, Colombo</span>
                        </div>

                        {/* Contact Numbers */}
                        <div className="space-y-2 pt-1 text-sm">
                            <div className="flex items-center justify-center md:justify-start space-x-2">
                                <i className="fab fa-whatsapp text-green-500 text-base"></i>
                                <span className="text-gray-400 font-medium">Chandana:</span>
                                <a 
                                    href="https://wa.me/94716161613" 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    className="text-white hover:text-green-400 transition-colors font-medium"
                                >
                                    071 616 1613
                                </a>
                            </div>
                            <div className="flex items-center justify-center md:justify-start space-x-2">
                                <i className="fab fa-whatsapp text-green-500 text-base"></i>
                                <span className="text-gray-400 font-medium">Shanika:</span>
                                <a 
                                    href="https://wa.me/94706161617" 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    className="text-white hover:text-green-400 transition-colors font-medium"
                                >
                                    070 616 1617
                                </a>
                            </div>
                            <div className="flex items-center justify-center md:justify-start space-x-2">
                                <i className="fab fa-whatsapp text-green-500 text-base"></i>
                                <span className="text-gray-400 font-medium">Tharaka:</span>
                                <a 
                                    href="https://wa.me/94704259059" 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    className="text-white hover:text-green-400 transition-colors font-medium"
                                >
                                    070 425 9059
                                </a>
                            </div>
                        </div>
                        
                        <div className="pt-2">
                            <h3 className="text-sm font-semibold text-gray-400 mb-3">Follow Us</h3>
                            <div className="flex items-center justify-center md:justify-start space-x-4">
                                <a 
                                    href="https://www.facebook.com/profile.php?id=61593834616300" 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-blue-600 hover:text-white transition-all transform hover:scale-110"
                                >
                                    <i className="fab fa-facebook-f text-lg"></i>
                                </a>
                                <a 
                                    href="https://www.tiktok.com/@tintin.com11?is_from_webapp=1&sender_device=pc" 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-pink-600 hover:text-white transition-all transform hover:scale-110"
                                >
                                    <i className="fab fa-tiktok text-lg"></i>
                                </a>
                            </div>
                        </div>
                    </div>

                </div>

                {/* Bottom Copyright */}
                <div className="mt-12 pt-8 border-t border-gray-800 text-center text-xs text-gray-500 flex flex-col md:flex-row justify-between items-center">
                    <p>&copy; {new Date().getFullYear()} TinTinAds. All rights reserved.</p>
                    <p className="mt-2 md:mt-0">Sri Lanka's Premium Classifieds Network</p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
