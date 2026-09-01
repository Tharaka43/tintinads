import React from 'react';
import { router } from '@inertiajs/react';

const TermsAndConditions: React.FC = () => {
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

            {/* Main Content */}
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="bg-white rounded-lg shadow-sm p-6 sm:p-8">
                    {/* Title */}
                    <div className="mb-8 text-center">
                        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">
                            Terms and Conditions
                        </h1>
                        <p className="text-lg text-gray-600">නියම සහ කොන්දේසි</p>
                    </div>

                    {/* Sinhala Section */}
                    <div className="mb-12">
                        <h2 className="text-2xl font-bold text-gray-900 mb-6 pb-3 border-b-2 border-gray-200">
                            සිංහල (Sinhala)
                        </h2>
                        
                        <div className="space-y-6 text-gray-700 leading-relaxed">
                            <section>
                                <h3 className="text-xl font-semibold text-gray-800 mb-3">1. හැඳින්වීම සහ පිළිගැනීම</h3>
                                <p className="mb-3">
                                    මෙම නියම සහ කොන්දේසි (මෙතැන් සිට "නියම") මඟින් Tin Tin ads වෙබ් අඩවිය (මෙතැන් සිට "වෙබ් අඩවිය") භාවිතා කිරීම පාලනය කරනු ලැබේ. වෙබ් අඩවියට පිවිසීමෙන් හෝ භාවිත කිරීමෙන්, ඔබ මෙම නියම සහ කොන්දේසි, සහ අපගේ වියාචනය (Disclaimer) කියවා, තේරුම් ගෙන, සහ ඒවාට බැඳී සිටීමට එකඟ වේ. ඔබ මෙම නියමයන්ට එකඟ නොවන්නේ නම්, ඔබ මෙම වෙබ් අඩවිය භාවිතා නොකළ යුතුය.
                                </p>
                            </section>

                            <section>
                                <h3 className="text-xl font-semibold text-gray-800 mb-3">2. වෙබ් අඩවියේ සේවාව</h3>
                                <p className="mb-3">
                                    Tin Tin ads යනු නිදහස් දැන්වීම් පළ කිරීම සඳහා වන මාර්ගගත වේදිකාවක් පමණි. අපි වෙබ් අඩවියේ දැන්වීම් පළ කරන්නන් සහ සේවා ලබා ගන්නන් අතර සම්බන්ධීකරණ සේවාවන් සපයනු නොලැබේ.
                                </p>
                                <p className="mb-3">
                                    වෙබ් අඩවියේ අන්තර්ගතයේ සත්‍යතාව, නිරවද්‍යතාව, හෝ නීත්‍යානුකූලභාවය පිළිබඳව අප කිසිදු සහතිකයක් ලබා නොදේ.
                                </p>
                                <p className="mb-3">
                                    අපගේ සේවාව ලබා දී ඇත්තේ නිදහස් දැන්වීම් පල කරගැනීමට ඇති මාද්‍යක් ලෙස පමණි.
                                </p>
                            </section>

                            <section>
                                <h3 className="text-xl font-semibold text-gray-800 mb-3">3. පරිශීලක වගකීම් සහ හැසිරීම</h3>
                                <p className="mb-3">
                                    <strong>වගකීම:</strong> වෙබ් අඩවිය හරහා ඔබ සිදු කරන සෑම ගනුදෙනුවක්ම, සන්නිවේදනයක්ම, සහ අනෙකුත් ක්‍රියාකාරකම් පිළිබඳ සම්පූර්ණ වගකීම ඔබ සතුය.
                                </p>
                                <p className="mb-3">
                                    <strong>නීති විරෝධී ක්‍රියාකාරකම්:</strong> ශ්‍රී ලංකාවේ පවතින නීති සහ රෙගුලාසි උල්ලංඝනය කරන කිසිදු අන්තර්ගතයක් හෝ ක්‍රියාකාරකමක් වෙබ් අඩවියේ පළ කිරීම හෝ සිදු කිරීම තහනම්ය.
                                </p>
                                <p className="mb-3">
                                    <strong>තහනම් අන්තර්ගත:</strong>
                                </p>
                                <ul className="list-disc list-inside ml-4 space-y-2 mb-3">
                                    <li>අසභ්‍ය, නින්දා අපහාස හෝ තර්ජනාත්මක අන්තර්ගත.</li>
                                    <li>වෙනත් පුද්ගලයින්ගේ හෝ ආයතනවල බුද්ධිමය දේපළ අයිතිවාසිකම් උල්ලංඝනය කිරීම.</li>
                                    <li>වෛරී ප්‍රකාශන හෝ වෙනස් කොට සැලකීමට පෙළඹවීම.</li>
                                    <li>සත්ව හිංසනය හෝ ළමා අපචාර සම්බන්ධ අන්තර්ගත.</li>
                                </ul>
                                <p className="mb-3">
                                    <strong>වයස් සීමාව:</strong> මෙම වෙබ් අඩවිය භාවිතා කිරීමට ඔබ අවම වශයෙන් වයස අවුරුදු 18 හෝ ඊට වැඩි විය යුතුය.
                                </p>
                            </section>

                            <section>
                                <h3 className="text-xl font-semibold text-gray-800 mb-3">4. දැන්වීම් පළ කිරීමේ නීති</h3>
                                <p className="mb-3">
                                    <strong>නිරවද්‍යතාව:</strong> පළ කරනු ලබන සියලුම දැන්වීම් සත්‍ය සහ නිවැරදි විය යුතුය. සාවද්‍ය හෝ නොමඟ යවන සුළු තොරතුරු ඇතුළත් දැන්වීම් Tin Tin ads වෙතින් ඉවත් කිරීමට අපට අයිතිය ඇත.
                                </p>
                                <p className="mb-3">
                                    <strong>සේවා සඳහා මුදල් ගෙවීම:</strong> සේවා ලබා ගන්නන් හට, සේවා සපයන්නා හමු වීමට පෙර මුදල් ගෙවීමෙන් හෝ තැන්පතු ලබා දීමෙන් වළකින ලෙස දැඩිව උපදෙස් දෙනු ලැබේ. ගනුදෙනු සියල්ල සිදු කළ යුත්තේ මුහුණට මුහුණ හමු වූ පසු සහ සේවාව තහවුරු කර ගැනීමෙන් පසුව පමණි.
                                </p>
                                <p className="mb-3">
                                    <strong>අයිතිය:</strong> වෙබ් අඩවියට හා එහි පරිශීලකයින්ට සුදුසු යැයි නොසලකන ඕනෑම දැන්වීමක්, දැනුම් දීමකින් තොරව, ප්‍රතික්ෂේප කිරීමට හෝ ඉවත් කිරීමට Tin Tin ads හි පූර්ණ අයිතිය ඇත.
                                </p>
                            </section>

                            <section>
                                <h3 className="text-xl font-semibold text-gray-800 mb-3">5. වගකීම් සීමා කිරීම (Limitation of Liability)</h3>
                                <p className="mb-3">
                                    Tin Tin ads වෙබ් අඩවිය භාවිතා කිරීමෙන් හෝ එහි පළ කර ඇති දැන්වීම් හරහා සිදුවන කිසිදු හානියක්, පාඩුවක්, හෝ නීතිමය ගැටලුවක් සඳහා අප වග කියනු නොලැබේ.
                                </p>
                                <p className="mb-3">
                                    වෙබ් අඩවියේ ඇති සත්‍යාපිත (Verified) දැන්වීම් යනු සපයන්නාගේ අනන්‍යතාවය තහවුරු කිරීමට ගත් උත්සාහයක් පමණක් වන අතර, එම සේවාවේ සම්පූර්ණ ගුණාත්මකභාවය හෝ ආරක්ෂාව සහතික නොකරයි.
                                </p>
                            </section>

                            <section>
                                <h3 className="text-xl font-semibold text-gray-800 mb-3">6. නියම සංශෝධනය කිරීම</h3>
                                <p className="mb-3">
                                    Tin Tin ads වෙබ් අඩවියට මෙම නියම සහ කොන්දේසි ඕනෑම වේලාවක වෙනස් කිරීමට හෝ සංශෝධනය කිරීමට අයිතිය ඇත. සංශෝධනය කිරීමෙන් පසු, වෙබ් අඩවිය දිගටම භාවිතා කිරීමෙන් ඔබ එම නව නියමයන්ට බැඳී සිටීමට එකඟ වේ.
                                </p>
                            </section>
                        </div>
                    </div>

                    {/* Divider */}
                    <div className="border-t-2 border-gray-300 my-12"></div>

                    {/* English Section */}
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900 mb-6 pb-3 border-b-2 border-gray-200">
                            English (ඉංග්‍රීසි)
                        </h2>
                        
                        <div className="space-y-6 text-gray-700 leading-relaxed">
                            <section>
                                <h3 className="text-xl font-semibold text-gray-800 mb-3">1. Introduction and Acceptance</h3>
                                <p className="mb-3">
                                    These Terms and Conditions (hereinafter "Terms") govern your use of the Tin Tin ads website (hereinafter "Website"). By accessing or using the Website, you acknowledge that you have read, understood, and agree to be bound by these Terms and our Disclaimer. If you do not agree to these Terms, you must not use this Website.
                                </p>
                            </section>

                            <section>
                                <h3 className="text-xl font-semibold text-gray-800 mb-3">2. Website Service</h3>
                                <p className="mb-3">
                                    Tin Tin ads is solely an online platform for publishing free classified advertisements. We do not provide intermediation services between advertisers and service seekers on the Website.
                                </p>
                                <p className="mb-3">
                                    We offer no guarantee regarding the authenticity, accuracy, or legality of the content posted on the Website.
                                </p>
                                <p className="mb-3">
                                    Our service is provided strictly as a medium for publishing free advertisements.
                                </p>
                            </section>

                            <section>
                                <h3 className="text-xl font-semibold text-gray-800 mb-3">3. User Responsibility and Conduct</h3>
                                <p className="mb-3">
                                    <strong>Responsibility:</strong> You are solely responsible for all transactions, communications, and activities carried out by you through the Website.
                                </p>
                                <p className="mb-3">
                                    <strong>Illegal Activities:</strong> It is prohibited to post or engage in any content or activity on the Website that violates the laws and regulations of Sri Lanka.
                                </p>
                                <p className="mb-3">
                                    <strong>Prohibited Content:</strong>
                                </p>
                                <ul className="list-disc list-inside ml-4 space-y-2 mb-3">
                                    <li>Obscene, defamatory, or threatening content.</li>
                                    <li>Content that infringes on the intellectual property rights of others.</li>
                                    <li>Hate speech or incitement to discrimination.</li>
                                    <li>Content related to animal cruelty or child abuse.</li>
                                </ul>
                                <p className="mb-3">
                                    <strong>Age Restriction:</strong> You must be at least 18 years of age or older to use this Website.
                                </p>
                            </section>

                            <section>
                                <h3 className="text-xl font-semibold text-gray-800 mb-3">4. Ad Posting Rules</h3>
                                <p className="mb-3">
                                    <strong>Accuracy:</strong> All advertisements posted must be true and accurate. Tin Tin ads reserves the right to remove any advertisement containing false or misleading information.
                                </p>
                                <p className="mb-3">
                                    <strong>Payment for Services:</strong> Service seekers are strongly advised not to pay money or provide deposits before meeting the service provider. All transactions should be conducted only after meeting face-to-face and confirming the service.
                                </p>
                                <p className="mb-3">
                                    <strong>Right to Refuse:</strong> Tin Tin ads reserves the full right to refuse or remove any advertisement, without prior notice, that is deemed unsuitable for the Website and its users.
                                </p>
                            </section>

                            <section>
                                <h3 className="text-xl font-semibold text-gray-800 mb-3">5. Limitation of Liability</h3>
                                <p className="mb-3">
                                    We are not liable for any loss, damage, or legal issue resulting from the use of the Tin Tin ads Website or through transactions arising from the advertisements posted thereon.
                                </p>
                                <p className="mb-3">
                                    "Verified" advertisements on the Website are only an attempt to confirm the provider's identity and do not guarantee the complete quality or safety of the service.
                                </p>
                            </section>

                            <section>
                                <h3 className="text-xl font-semibold text-gray-800 mb-3">6. Modification of Terms</h3>
                                <p className="mb-3">
                                    Tin Tin ads reserves the right to change or modify these Terms and Conditions at any time. By continuing to use the Website after any modification, you agree to be bound by the updated Terms.
                                </p>
                            </section>
                        </div>
                    </div>

                    {/* Footer Note */}
                    <div className="mt-12 pt-8 border-t border-gray-200 text-center">
                        <p className="text-sm text-gray-500">
                            Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                        </p>
                        <p className="text-sm text-gray-500 mt-2">
                            For questions or concerns, please contact us via WhatsApp.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TermsAndConditions;

