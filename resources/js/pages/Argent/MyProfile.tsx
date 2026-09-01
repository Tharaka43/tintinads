import React, { FormEvent, useState } from 'react';
import axios from 'axios';
import { router } from '@inertiajs/react';

const PINK_500 = '#EC4899';
const PINK_600 = '#DB2777';
const BLUE_100 = '#DBEAFE';
const BLUE_500 = '#3B82F6';

interface UserData {
    id: number;
    name: string;
    email: string;
    number?: string | null;
    whatsapp_number?: string | null;
    telegram_number?: string | null;
    profile_picture?: string | null;
    created_at: string;
    updated_at: string;
}

interface ProfileDataProps {
    userData: UserData;
}

const MyProfile: React.FC<ProfileDataProps> = ({ userData }) => {
    const [name, setName] = useState(userData.name);
    const [email, setEmail] = useState(userData.email);
    const [number, setNumber] = useState(userData.number || '');
    const [whatsappNumber, setWhatsappNumber] = useState(userData.whatsapp_number || '');
    const [telegramNumber, setTelegramNumber] = useState(userData.telegram_number || '');
    const [profilePicture, setProfilePicture] = useState<File | null>(null);
    const [profilePicturePreview, setProfilePicturePreview] = useState<string | null>(
        userData.profile_picture || null
    );
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showToast, setShowToast] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0] ?? null;
        if (file) {
            setProfilePicture(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setProfilePicturePreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError(null);

        const formData = new FormData();
        formData.append('name', name);
        formData.append('email', email);
        formData.append('number', number || '');
        formData.append('whatsapp_number', whatsappNumber || '');
        formData.append('telegram_number', telegramNumber || '');
        if (profilePicture) {
            formData.append('profile_picture', profilePicture);
        }

        try {
            await axios.post('/agent/profile/update', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            setShowToast(true);
            setTimeout(() => {
                setShowToast(false);
                router.reload({ only: ['userData'] });
            }, 2000);
        } catch (err: any) {
            console.error(err);
            const errorMessage = err?.response?.data?.message 
                || err?.response?.data?.error 
                || 'Failed to update profile. Please try again.';
            setError(errorMessage);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="bg-gray-50 min-h-screen py-6 px-4 sm:px-6 lg:px-8">
            <div
                className={`fixed top-4 right-4 border text-blue-800 px-6 py-4 rounded-lg shadow-lg transition-transform duration-300 ease-in-out z-50 ${showToast ? 'translate-x-0 bg-blue-100 border-blue-200' : 'translate-x-full'}`}
                style={{ backgroundColor: BLUE_100, borderColor: 'rgb(219 234 254)' }}
            >
                <div className="flex items-center">
                    <svg className="w-5 h-5 mr-3" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
                    </svg>
                    <span className="font-medium">Profile updated successfully!</span>
                </div>
            </div>

            <div className="max-w-2xl mx-auto">
                <div className="text-center mb-8">
                    <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">My Profile</h1>
                    <p className="text-gray-600 text-sm sm:text-base">Manage your profile information and picture</p>
                </div>

                <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 sm:p-8">
                    <form className="space-y-6" onSubmit={handleSubmit}>
                        {/* Profile Picture Section */}
                        <div className="flex flex-col items-center">
                            <div className="relative">
                                <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-gray-200 bg-gray-100 flex items-center justify-center">
                                    {profilePicturePreview ? (
                                        <img
                                            src={profilePicturePreview}
                                            alt="Profile"
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        <i className="fas fa-user text-6xl text-gray-400"></i>
                                    )}
                                </div>
                                <label
                                    htmlFor="profilePicture"
                                    className="absolute bottom-0 right-0 bg-pink-500 text-white rounded-full p-2 cursor-pointer hover:bg-pink-600 transition-colors"
                                >
                                    <i className="fas fa-camera"></i>
                                </label>
                                <input
                                    type="file"
                                    id="profilePicture"
                                    accept="image/jpeg,image/png,image/jpg"
                                    onChange={handleFileChange}
                                    className="hidden"
                                />
                            </div>
                            <p className="text-xs text-gray-500 mt-2">Click the camera icon to change profile picture</p>
                        </div>

                        {error && (
                            <div className="bg-red-50 border border-red-200 rounded-lg px-4 py-3">
                                <p className="text-sm text-red-600">{error}</p>
                            </div>
                        )}

                        {/* Name Field */}
                        <div>
                            <label htmlFor="name" className="block text-sm font-semibold text-gray-700 mb-2">
                                Name <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                id="name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                required
                                disabled={isSubmitting}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500 transition-colors text-sm sm:text-base"
                            />
                        </div>

                        {/* Email Field */}
                        <div>
                            <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
                                Email <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="email"
                                id="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                disabled={isSubmitting}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500 transition-colors text-sm sm:text-base"
                            />
                        </div>

                        {/* Phone Number Field */}
                        <div>
                            <label htmlFor="number" className="block text-sm font-semibold text-gray-700 mb-2">
                                Phone Number
                            </label>
                            <input
                                type="tel"
                                id="number"
                                value={number}
                                onChange={(e) => setNumber(e.target.value)}
                                disabled={isSubmitting}
                                placeholder="Enter your phone number"
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500 transition-colors text-sm sm:text-base"
                            />
                        </div>

                        {/* WhatsApp Number Field */}
                        <div>
                            <label htmlFor="whatsapp_number" className="block text-sm font-semibold text-gray-700 mb-2">
                                WhatsApp Number
                            </label>
                            <input
                                type="tel"
                                id="whatsapp_number"
                                value={whatsappNumber}
                                onChange={(e) => setWhatsappNumber(e.target.value)}
                                disabled={isSubmitting}
                                placeholder="Enter your WhatsApp number"
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500 transition-colors text-sm sm:text-base"
                            />
                        </div>

                        {/* Telegram Number Field */}
                        <div>
                            <label htmlFor="telegram_number" className="block text-sm font-semibold text-gray-700 mb-2">
                                Telegram Number
                            </label>
                            <input
                                type="tel"
                                id="telegram_number"
                                value={telegramNumber}
                                onChange={(e) => setTelegramNumber(e.target.value)}
                                disabled={isSubmitting}
                                placeholder="Enter your Telegram number"
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500 transition-colors text-sm sm:text-base"
                            />
                        </div>

                        {/* Account Info */}
                        <div className="border-t border-gray-200 pt-6">
                            <h3 className="text-sm font-semibold text-gray-700 mb-4">Account Information</h3>
                            <div className="space-y-2 text-sm">
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Account Created:</span>
                                    <span className="text-gray-900">
                                        {new Date(userData.created_at).toLocaleDateString()}
                                    </span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Last Updated:</span>
                                    <span className="text-gray-900">
                                        {new Date(userData.updated_at).toLocaleDateString()}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Submit Button */}
                        <div className="pt-4">
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className={`w-full text-white font-semibold py-4 px-6 rounded-lg transition-colors duration-200 text-base sm:text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 ${isSubmitting ? 'bg-pink-400 cursor-not-allowed' : 'bg-pink-500 hover:bg-pink-600'}`}
                                style={{ backgroundColor: isSubmitting ? '#F472B6' : PINK_500 }}
                            >
                                {isSubmitting ? 'Updating Profile...' : 'Update Profile'}
                            </button>
                        </div>
                    </form>
                </div>

                <div className="mt-6 rounded-lg p-4" style={{ backgroundColor: BLUE_100, borderColor: 'rgb(219 234 254)' }}>
                    <div className="flex items-start">
                        <svg className="w-5 h-5 text-blue-500 mt-0.5 mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd"></path>
                        </svg>
                        <div>
                            <h4 className="text-sm font-semibold mb-1" style={{ color: BLUE_500 }}>Profile Security</h4>
                            <p className="text-xs" style={{ color: 'rgb(29 78 216)' }}>
                                Your profile information is secure. Profile pictures should be JPEG or PNG format, max 5MB.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MyProfile;

