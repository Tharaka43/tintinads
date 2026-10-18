import React, { useState, useMemo, useCallback, useEffect } from 'react';
import axios from 'axios';

type AdStatus = 'Active' | 'Blocked' | 'Featured' | 'Pending Review' | 'Expired';
type PaymentStatus = 'paid' | 'unpaid';
type WaStep = 'step1' | 'step2' | 'step3';

interface Ad {
    id: string;
    title: string;
    description?: string;
    price?: number;
    location?: string;
    category: string;
    agentName: string;
    agentId: string;
    status: AdStatus;
    paymentStatus: PaymentStatus;
    datePosted: string;
    imgSrc: string;
    isFeatured: boolean;
    isSelected: boolean;
    advertisement_id?: number;
    receiptPath?: string | null;
    phone_number?: string | null;
    whatsapp_number?: string | null;
}

interface Stats {
    totalAds: number;
    activeAds: number;
    blockedAds: number;
    featuredAds: number;
}

interface Pagination {
    current_page: number;
    total_pages: number;
    per_page: number;
    total_items: number;
    from: number;
    to: number;
}

type SentStepsMap = Record<number, { step1?: boolean; step2?: boolean; step3?: boolean }>;

const StatusBadge: React.FC<{ status: AdStatus }> = ({ status }) => {
    const classes = useMemo(() => {
        switch (status) {
            case 'Active': return 'bg-green-100 text-green-700 border-green-200';
            case 'Featured': return 'bg-purple-100 text-purple-700 border-purple-200';
            case 'Blocked': return 'bg-red-100 text-red-700 border-red-200';
            case 'Pending Review': return 'bg-amber-100 text-amber-700 border-amber-200';
            case 'Expired': return 'bg-gray-100 text-gray-500 border-gray-200';
            default: return 'bg-gray-100 text-gray-500 border-gray-200';
        }
    }, [status]);
    return (
        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border shadow-sm ${classes}`}>
            {status}
        </span>
    );
};

const PaymentBadge: React.FC<{ status: PaymentStatus }> = ({ status }) => {
    const classes = status === 'paid'
        ? 'bg-green-100 text-green-700 border-green-200'
        : 'bg-red-100 text-red-700 border-red-200';
    return (
        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border shadow-sm ${classes}`}>
            {status}
        </span>
    );
};

const formatWhatsAppNumber = (raw?: string | null): string => {
    if (!raw) return '';
    const digits = raw.replace(/[^0-9]/g, '');
    if (!digits) return '';
    if (digits.startsWith('94') && digits.length >= 11) return digits;
    if (digits.startsWith('0') && digits.length === 10) return '94' + digits.slice(1);
    if (digits.length === 9) return '94' + digits;
    return digits;
};

const buildAdvertiserWhatsAppMessage = (ad: Ad, step: WaStep): string => {
    const adUrl = `https://tintinads.com/ad/${ad.advertisement_id}`;
    const priceStr = ad.price ? `Rs. ${Number(ad.price).toLocaleString()}` : 'Negotiable';
    const contactStr = ad.whatsapp_number || ad.phone_number || '';

    if (step === 'step1') {
        return [
            adUrl,
            '',
            '🎁 *සුබ පැතුම්! රු. 700/- ක් වටිනා VIP දැන්වීමක් ඔබට අද නොමිලේ!* 👑✨',
            '',
            `ආයුබෝවන්! ශ්‍රී ලංකාවේ වේගයෙන්ම ජනප්‍රිය වන *TinTinAds.com* වෙබ් අඩවිය හඳුන්වා දීමේ විශේෂ දීමනාවක් ලෙස, ඔබගේ *"${ad.title}"* දැන්වීම *රු. 700ක් වටිනා VIP Package දැන්වීමක් (දින 3ක් සඳහා)* ලෙස අප විසින් අද *සම්පූර්ණයෙන්ම නොමිලේ (100% FREE)* පළ කර ඇත! 🎉`,
            '',
            '🌟 *TinTinAds.com හි විශේෂත්වය:*',
            '✅ දිනපතා දහස් ගණනක් පාරිභෝගිකයන් පැමිණෙන වෙබ් අඩවියකි.',
            '✅ පාරිභෝගිකයන්ට මුල් පිටුවේ සිටම එක ක්ලික් එකකින් ඔබට කෙලින්ම Call හෝ WhatsApp කළ හැක.',
            '✅ "Online Today" සහ "100% Real Photo Checked" ලාංඡන නිසා වැඩිම පාරිභෝගික විශ්වාසයක් ලැබේ.',
            '',
            '💎 *අපගේ සාමාන්‍ය දැන්වීම් පැකේජ (Packages):*',
            '🔹 *Normal Package (රු. 300)* — දින 1 ක් සඳහා (පින්තූර 1)',
            '⭐ *Premium Package (රු. 500)* — දින 2 ක් සඳහා (පින්තූර 3 + රෝස Border & Badge)',
            '👑 *VIP Package (රු. 700)* — දින 3 ක් සඳහා (පින්තූර 5 + රන්වන් Border & VIP Badge) 👈 *(අද ඔබට නොමිලේ ලැබුණු පැකේජය!)*',
            '💎 *Platinum Package (රු. 1,500)* — *දින 30 ක් (මසක් පුරා)* Top List පෙනුම + Platinum Badge! 🔥',
            '',
            '🌐 සියලුම පැකේජ විස්තර: https://tintinads.com/packages',
        ].join('\n');
    }

    if (step === 'step2') {
        return [
            adUrl,
            '',
            '🌟 *ඔබගේ රු. 700 VIP දැන්වීම දැන් සජීවීව (LIVE) ක්‍රියාත්මකයි!* 🟢',
            '',
            '📋 *දැන්වීමේ විස්තර:*',
            `📌 *මාතෘකාව:* ${ad.title}`,
            `💰 *මිල:* ${priceStr}`,
            `📍 *නගරය:* ${ad.location || 'Sri Lanka'}`,
            contactStr ? `📞 *සම්බන්ධ වන අංකය:* ${contactStr}` : '',
            '👑 *පැකේජය:* VIP Verified Ad (Rs. 700 Value - FREE)',
            '',
            '📸 *ඔබගේ දැන්වීම සහ ඡායාරූප පරීක්ෂා කිරීමට පහත Link එක ක්ලික් කරන්න:*',
            `👉 ${adUrl}`,
            '',
            '✅ *වැදගත්:* මෙම දැන්වීමේ ඡායාරූප, මිල ගණන් හෝ විස්තර වල යම් අඩුපාඩුවක් හෝ වෙනස් කරගත යුතු දෙයක් ඇත්නම් කරුණාකර මේ WhatsApp අංකයටම Reply එකක් එවන්න. අපි එය වහාම නිවැරදි කර දෙන්නෙමු! 🤝✨',
        ].filter(Boolean).join('\n');
    }

    // step3: Expired + Rs. 1500 Offer
    return [
        adUrl,
        '',
        '⚠️ *විශේෂ දැනුම්දීමයි: ඔබගේ දැන්වීමේ කාලය අවසන් වී ඇත (AD EXPIRED)!* ⏰',
        '',
        'ආයුබෝවන්! 🙏',
        `*TinTinAds.com* හි ඔබට නොමිලේ ලබා දුන් *"${ad.title}"* (රු. 700 VIP) දැන්වීමේ කාලය දැන් අවසන් වී ඇත.`,
        '',
        '📈 පසුගිය දින කිහිපය තුළ ඔබගේ දැන්වීමට ඉතා ඉහළ පාරිභෝගික ආකර්ෂණයක් (Views & Calls) ලැබී තිබුණි! ඔබගේ දැන්වීම දිගටම වෙබ් අඩවියේ ඉහළින්ම තබා ගැනීමට දැන්ම අලුත් (Renew) කරගන්න:',
        '',
        '🔥 *විශේෂ වාසිදායක දීමනාව (Special Monthly Offer):*',
        '💎 *1️⃣ Platinum Package — රු. 1,500/- පමණයි!*',
        '• *දින 30ක් (සම්පූර්ණ මාසයක් පුරා)* දැන්වීම ක්‍රියාත්මක වේ! *(දිනකට වැය වන්නේ රු. 50ක් පමණි!)*',
        '• වෙබ් අඩවියේ ඉහළින්ම *Top List* පෙනුම සහ Platinum Badge එක.',
        '• උපරිම ඡායාරූප 5ක් එක් කළ හැක.',
        '',
        '📌 *අනෙකුත් පැකේජයන් (Other Packages):*',
        '👑 *2️⃣ VIP Package — රු. 700/-* (දින 3ක් සඳහා + Gold VIP Border + පින්තූර 5)',
        '⭐ *3️⃣ Premium Package — රු. 500/-* (දින 2ක් සඳහා + Pink Border + පින්තූර 3)',
        '🔹 *4️⃣ Normal Package — රු. 300/-* (දින 1ක් සඳහා + පින්තූර 1)',
        '',
        '💬 *ඔබගේ දැන්වීම නැවත පළ කරනවාද (Renew)?*',
        'ඔබට අවශ්‍ය Package එකේ අංකය *(1, 2, 3 හෝ 4)* මේ WhatsApp අංකයට Reply කරන්න. විනාඩි කිහිපයක් තුළ ඔබගේ දැන්වීම නැවත සක්‍රීය කර දෙන්නම්! 🚀🤝',
    ].join('\n');
};

const drawRoundedRect = (
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    w: number,
    h: number,
    r: number
) => {
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.lineTo(x + w - r, y);
    ctx.quadraticCurveTo(x + w, y, x + w, y + r);
    ctx.lineTo(x + w, y + h - r);
    ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
    ctx.lineTo(x + r, y + h);
    ctx.quadraticCurveTo(x, y + h, x, y + h - r);
    ctx.lineTo(x, y + r);
    ctx.quadraticCurveTo(x, y, x + r, y);
    ctx.closePath();
};

const generateAdPhotoCardBlob = async (ad: Ad, step: WaStep): Promise<Blob | null> => {
    return new Promise((resolve) => {
        try {
            const img = new Image();
            img.crossOrigin = 'anonymous';
            img.onload = () => {
                try {
                    const canvas = document.createElement('canvas');
                    canvas.width = 800;
                    canvas.height = 1000;
                    const ctx = canvas.getContext('2d');
                    if (!ctx) {
                        resolve(null);
                        return;
                    }

                    const shortTitle = ad.title.length > 40 ? ad.title.slice(0, 40) + '...' : ad.title;
                    const priceText = `Rs. ${ad.price ? Number(ad.price).toLocaleString() : '0'}`;

                    if (step === 'step1') {
                        // STEP 1: Rs. 700 FREE VIP GIFT + PACKAGES POSTER
                        ctx.fillStyle = '#0f172a';
                        ctx.fillRect(0, 0, 800, 1000);

                        // Gold Luxury Header
                        const headerGrad = ctx.createLinearGradient(0, 0, 800, 115);
                        headerGrad.addColorStop(0, '#f59e0b');
                        headerGrad.addColorStop(0.5, '#d97706');
                        headerGrad.addColorStop(1, '#b45309');
                        ctx.fillStyle = headerGrad;
                        ctx.fillRect(0, 0, 800, 115);

                        ctx.fillStyle = '#ffffff';
                        ctx.font = 'bold 28px sans-serif';
                        ctx.fillText('🎁 CONGRATULATIONS! Rs. 700 VIP AD FREE!', 28, 48);
                        ctx.font = 'bold 22px sans-serif';
                        ctx.fillStyle = '#fef3c7';
                        ctx.fillText('රු. 700ක් වටිනා VIP දැන්වීම ඔබට අද නොමිලේ පළ කර ඇත!', 28, 88);

                        // Ad Photo Area (800 x 470)
                        const areaW = 800;
                        const areaH = 470;
                        const scale = Math.max(areaW / img.width, areaH / img.height);
                        const drawW = img.width * scale;
                        const drawH = img.height * scale;
                        const offsetX = (areaW - drawW) / 2;
                        const offsetY = 115 + (areaH - drawH) / 2;

                        ctx.save();
                        ctx.beginPath();
                        ctx.rect(0, 115, areaW, areaH);
                        ctx.clip();
                        ctx.drawImage(img, offsetX, offsetY, drawW, drawH);
                        ctx.restore();

                        // VIP Badge on Photo
                        ctx.fillStyle = 'rgba(15, 23, 42, 0.88)';
                        drawRoundedRect(ctx, 24, 135, 360, 48, 24);
                        ctx.fill();
                        ctx.strokeStyle = '#fbbf24';
                        ctx.lineWidth = 2;
                        ctx.stroke();
                        ctx.fillStyle = '#fbbf24';
                        ctx.font = 'bold 21px sans-serif';
                        ctx.fillText('👑 VIP PACKAGE • Rs. 700 (FREE)', 42, 166);

                        // Ad Info Strip
                        ctx.fillStyle = '#1e293b';
                        ctx.fillRect(0, 585, 800, 115);
                        ctx.fillStyle = '#ffffff';
                        ctx.font = 'bold 27px sans-serif';
                        ctx.fillText(shortTitle, 28, 628);
                        ctx.fillStyle = '#fbbf24';
                        ctx.font = 'bold 24px sans-serif';
                        ctx.fillText(`${priceText}   •   📍 ${ad.location || 'Sri Lanka'}   •   🌐 tintinads.com/ad/${ad.advertisement_id}`, 28, 672);

                        // Packages Section Footer (y: 700 -> 1000)
                        ctx.fillStyle = '#0f172a';
                        ctx.fillRect(0, 700, 800, 300);

                        ctx.fillStyle = '#f8fafc';
                        ctx.font = 'bold 22px sans-serif';
                        ctx.fillText('💎 TinTinAds.com Advertising Packages (අපගේ දැන්වීම් පැකේජ):', 28, 740);

                        const cards = [
                            { name: 'Normal', price: 'Rs. 300', days: 'දින 1 ක්', sub: '1 Photo', bg: '#1e293b', border: '#475569', accent: '#cbd5e1' },
                            { name: 'Premium', price: 'Rs. 500', days: 'දින 2 ක්', sub: '3 Photos • Pink', bg: '#3b0764', border: '#ec4899', accent: '#f472b6' },
                            { name: '👑 VIP (FREE!)', price: 'Rs. 700', days: 'දින 3 ක්', sub: '5 Photos • Gold', bg: '#451a03', border: '#fbbf24', accent: '#fbbf24' },
                            { name: '💎 Platinum', price: 'Rs. 1500', days: 'දින 30 ක්!', sub: 'Top List • 30 Days', bg: '#064e3b', border: '#10b981', accent: '#34d399' },
                        ];

                        cards.forEach((c, idx) => {
                            const bx = 24 + idx * 190;
                            const by = 762;
                            const bw = 178;
                            const bh = 185;
                            ctx.fillStyle = c.bg;
                            drawRoundedRect(ctx, bx, by, bw, bh, 16);
                            ctx.fill();
                            ctx.strokeStyle = c.border;
                            ctx.lineWidth = idx >= 2 ? 3 : 1.5;
                            ctx.stroke();

                            ctx.fillStyle = c.accent;
                            ctx.font = 'bold 20px sans-serif';
                            ctx.fillText(c.name, bx + 14, by + 38);

                            ctx.fillStyle = '#ffffff';
                            ctx.font = 'bold 30px sans-serif';
                            ctx.fillText(c.price, bx + 14, by + 84);

                            ctx.fillStyle = '#e2e8f0';
                            ctx.font = 'bold 20px sans-serif';
                            ctx.fillText(c.days, bx + 14, by + 124);

                            ctx.fillStyle = '#94a3b8';
                            ctx.font = 'bold 15px sans-serif';
                            ctx.fillText(c.sub, bx + 14, by + 158);
                        });

                        ctx.fillStyle = '#38bdf8';
                        ctx.font = 'bold 18px sans-serif';
                        ctx.fillText('🌐 www.tintinads.com   |   ශ්‍රී ලංකාවේ වේගවත්ම Verified දැන්වීම් ජාලය', 120, 978);
                    } else if (step === 'step2') {
                        // STEP 2: LIVE VERIFIED AD PHOTO CARD
                        ctx.fillStyle = '#0f172a';
                        ctx.fillRect(0, 0, 800, 1000);

                        const grad = ctx.createLinearGradient(0, 0, 800, 0);
                        grad.addColorStop(0, '#ec4899');
                        grad.addColorStop(1, '#e11d48');
                        ctx.fillStyle = grad;
                        ctx.fillRect(0, 0, 800, 84);

                        ctx.fillStyle = '#ffffff';
                        ctx.font = 'bold 28px sans-serif';
                        ctx.fillText('TinTinAds.com  •  ⭐ Verified VIP Ad', 28, 52);

                        const areaW = 800;
                        const areaH = 650;
                        const scale = Math.max(areaW / img.width, areaH / img.height);
                        const drawW = img.width * scale;
                        const drawH = img.height * scale;
                        const offsetX = (areaW - drawW) / 2;
                        const offsetY = 84 + (areaH - drawH) / 2;

                        ctx.save();
                        ctx.beginPath();
                        ctx.rect(0, 84, areaW, areaH);
                        ctx.clip();
                        ctx.drawImage(img, offsetX, offsetY, drawW, drawH);
                        ctx.restore();

                        // Online Today Pill
                        ctx.fillStyle = 'rgba(0, 0, 0, 0.78)';
                        drawRoundedRect(ctx, 24, 108, 225, 44, 22);
                        ctx.fill();
                        ctx.fillStyle = '#10b981';
                        ctx.beginPath();
                        ctx.arc(48, 130, 8, 0, Math.PI * 2);
                        ctx.fill();
                        ctx.fillStyle = '#ffffff';
                        ctx.font = 'bold 20px sans-serif';
                        ctx.fillText('ONLINE TODAY', 68, 137);

                        // Bottom Info Panel
                        ctx.fillStyle = '#ffffff';
                        ctx.fillRect(0, 734, 800, 266);

                        ctx.fillStyle = '#111827';
                        ctx.font = 'bold 30px sans-serif';
                        ctx.fillText(shortTitle, 28, 786);

                        ctx.fillStyle = '#e11d48';
                        ctx.font = 'bold 38px sans-serif';
                        ctx.fillText(priceText, 28, 842);

                        ctx.fillStyle = '#374151';
                        ctx.font = 'bold 22px sans-serif';
                        ctx.fillText(`📍 ${ad.location || 'Sri Lanka'}   |   🔗 tintinads.com/ad/${ad.advertisement_id}`, 28, 892);

                        ctx.fillStyle = '#059669';
                        ctx.font = 'bold 20px sans-serif';
                        ctx.fillText('✅ ඔබගේ දැන්වීමේ අඩුපාඩු ඇත්නම් අපට WhatsApp මගින් දැනුම් දෙන්න!', 28, 945);
                    } else {
                        // STEP 3: AD EXPIRED + Rs. 1,500 PLATINUM 30-DAY OFFER POSTER
                        ctx.fillStyle = '#0f172a';
                        ctx.fillRect(0, 0, 800, 1000);

                        const expGrad = ctx.createLinearGradient(0, 0, 800, 0);
                        expGrad.addColorStop(0, '#dc2626');
                        expGrad.addColorStop(1, '#991b1b');
                        ctx.fillStyle = expGrad;
                        ctx.fillRect(0, 0, 800, 110);

                        ctx.fillStyle = '#ffffff';
                        ctx.font = 'bold 29px sans-serif';
                        ctx.fillText('⚠️ AD EXPIRED • ඔබගේ දැන්වීමේ කාලය අවසන් වී ඇත!', 28, 48);
                        ctx.fillStyle = '#fecaca';
                        ctx.font = 'bold 21px sans-serif';
                        ctx.fillText('ඔබගේ දැන්වීම දැන්ම Renew කර දිගටම පාරිභෝගිකයන් ලබාගන්න!', 28, 86);

                        // Ad Photo Area (800 x 400)
                        const areaW = 800;
                        const areaH = 400;
                        const scale = Math.max(areaW / img.width, areaH / img.height);
                        const drawW = img.width * scale;
                        const drawH = img.height * scale;
                        const offsetX = (areaW - drawW) / 2;
                        const offsetY = 110 + (areaH - drawH) / 2;

                        ctx.save();
                        ctx.beginPath();
                        ctx.rect(0, 110, areaW, areaH);
                        ctx.clip();
                        ctx.drawImage(img, offsetX, offsetY, drawW, drawH);
                        ctx.restore();

                        // Dark overlay on bottom of photo with Ad Title
                        ctx.fillStyle = 'rgba(15, 23, 42, 0.85)';
                        ctx.fillRect(0, 430, 800, 80);
                        ctx.fillStyle = '#ffffff';
                        ctx.font = 'bold 26px sans-serif';
                        ctx.fillText(`${shortTitle}  (${priceText})`, 28, 480);

                        // Special Rs. 1500 Offer Spotlight Box
                        const offerGrad = ctx.createLinearGradient(24, 530, 776, 720);
                        offerGrad.addColorStop(0, '#be123c');
                        offerGrad.addColorStop(1, '#6d28d9');
                        ctx.fillStyle = offerGrad;
                        drawRoundedRect(ctx, 24, 530, 752, 185, 20);
                        ctx.fill();
                        ctx.strokeStyle = '#fbbf24';
                        ctx.lineWidth = 3;
                        ctx.stroke();

                        ctx.fillStyle = '#fde047';
                        ctx.font = 'bold 22px sans-serif';
                        ctx.fillText('🔥 SPECIAL MONTHLY OFFER (වැඩිම දෙනෙක් තෝරන පැකේජය):', 48, 572);

                        ctx.fillStyle = '#ffffff';
                        ctx.font = 'bold 36px sans-serif';
                        ctx.fillText('💎 1. PLATINUM PACKAGE — Rs. 1,500/-', 48, 622);

                        ctx.fillStyle = '#f8fafc';
                        ctx.font = 'bold 22px sans-serif';
                        ctx.fillText('✅ දින 30ක් (මසක් පුරා) Top List පෙනුම! (දිනකට රු. 50ක් පමණි)', 48, 665);
                        ctx.fillStyle = '#fde047';
                        ctx.font = 'bold 20px sans-serif';
                        ctx.fillText('⭐ Platinum Badge + උපරිම ඡායාරූප 5ක් + ඉහළම පාරිභෝගික ආකර්ෂණය', 48, 698);

                        // Other 3 Packages Row
                        const otherPackages = [
                            { num: '2️⃣ VIP Package', price: 'Rs. 700', days: 'දින 3 ක් (Gold VIP)', color: '#fbbf24' },
                            { num: '3️⃣ Premium', price: 'Rs. 500', days: 'දින 2 ක් (Pink Badge)', color: '#f472b6' },
                            { num: '4️⃣ Normal', price: 'Rs. 300', days: 'දින 1 ක් (Standard)', color: '#94a3b8' },
                        ];

                        otherPackages.forEach((p, idx) => {
                            const bx = 24 + idx * 256;
                            const by = 738;
                            ctx.fillStyle = '#1e293b';
                            drawRoundedRect(ctx, bx, by, 240, 150, 16);
                            ctx.fill();
                            ctx.strokeStyle = p.color;
                            ctx.lineWidth = 2;
                            ctx.stroke();

                            ctx.fillStyle = p.color;
                            ctx.font = 'bold 21px sans-serif';
                            ctx.fillText(p.num, bx + 18, by + 40);

                            ctx.fillStyle = '#ffffff';
                            ctx.font = 'bold 32px sans-serif';
                            ctx.fillText(p.price, bx + 18, by + 88);

                            ctx.fillStyle = '#cbd5e1';
                            ctx.font = 'bold 18px sans-serif';
                            ctx.fillText(p.days, bx + 18, by + 125);
                        });

                        // Call to Action Footer
                        ctx.fillStyle = '#10b981';
                        ctx.font = 'bold 22px sans-serif';
                        ctx.fillText('💬 දැන්වීම නැවත පළ කිරීමට කැමති Package අංකය (1, 2, 3 හෝ 4) එවන්න!', 36, 945);
                    }

                    canvas.toBlob((blob) => resolve(blob), 'image/png', 0.95);
                } catch {
                    resolve(null);
                }
            };
            img.onerror = () => resolve(null);
            img.src = ad.imgSrc || '/placeholder-image.jpg';
        } catch {
            resolve(null);
        }
    });
};

const STEP_META: Record<WaStep, { shortLabel: string; title: string; badgeColor: string; btnColor: string }> = {
    step1: {
        shortLabel: '🎁 1. Free 700 VIP',
        title: 'පියවර 1: රු. 700 VIP නොමිලේ + Packages විස්තරය',
        badgeColor: 'bg-amber-500 text-white',
        btnColor: 'bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white',
    },
    step2: {
        shortLabel: '🔗 2. Ad Link Check',
        title: 'පියවර 2: දැන්වීමේ Link එක සහ අඩුපාඩු පරීක්ෂා කිරීම',
        badgeColor: 'bg-emerald-600 text-white',
        btnColor: 'bg-[#25D366] hover:bg-green-600 text-white',
    },
    step3: {
        shortLabel: '⏰ 3. Expired 1500 Offer',
        title: 'පියවර 3: දැන්වීම Expire වූ පසු රු. 1,500 Offer එක',
        badgeColor: 'bg-rose-600 text-white',
        btnColor: 'bg-gradient-to-r from-rose-600 to-purple-700 hover:from-rose-700 hover:to-purple-800 text-white',
    },
};

const SuperAdminAds: React.FC = () => {
    const [ads, setAds] = useState<Ad[]>([]);
    const [stats, setStats] = useState<Stats>({ totalAds: 0, activeAds: 0, blockedAds: 0, featuredAds: 0 });
    const [pagination, setPagination] = useState<Pagination>({ current_page: 1, total_pages: 1, per_page: 10, total_items: 0, from: 0, to: 0 });
    const [activeTab, setActiveTab] = useState('All Status');
    const [isLoading, setIsLoading] = useState(true);
    const [slipImage, setSlipImage] = useState<string | null>(null);
    const [previewAd, setPreviewAd] = useState<Ad | null>(null);
    const [selectedStep, setSelectedStep] = useState<WaStep>('step1');
    const [previewCardUrl, setPreviewCardUrl] = useState<string | null>(null);
    const [isGeneratingCard, setIsGeneratingCard] = useState(false);

    const [sentSteps, setSentSteps] = useState<SentStepsMap>(() => {
        try {
            const raw = localStorage.getItem('tintinads_admin_wa_funnel_v2');
            return raw ? JSON.parse(raw) : {};
        } catch {
            return {};
        }
    });
    const [toastNote, setToastNote] = useState<string | null>(null);

    const tabs = ['All Status', 'Active', 'Pending Review', 'Blocked', 'Featured'];

    const markStepAsSent = useCallback((adId: number | undefined, step: WaStep) => {
        if (!adId) return;
        setSentSteps((prev) => {
            const existing = prev[adId] || {};
            const updated: SentStepsMap = {
                ...prev,
                [adId]: { ...existing, [step]: true },
            };
            try {
                localStorage.setItem('tintinads_admin_wa_funnel_v2', JSON.stringify(updated));
            } catch {
                // ignore
            }
            return updated;
        });
    }, []);

    // Generate live poster preview whenever previewAd or selectedStep changes
    useEffect(() => {
        let active = true;
        let createdUrl: string | null = null;
        if (!previewAd) {
            setPreviewCardUrl(null);
            return;
        }
        setIsGeneratingCard(true);
        generateAdPhotoCardBlob(previewAd, selectedStep).then((blob) => {
            if (!active) return;
            setIsGeneratingCard(false);
            if (blob) {
                createdUrl = URL.createObjectURL(blob);
                setPreviewCardUrl(createdUrl);
            } else {
                setPreviewCardUrl(null);
            }
        });
        return () => {
            active = false;
            if (createdUrl) URL.revokeObjectURL(createdUrl);
        };
    }, [previewAd, selectedStep]);

    const handleSendWhatsAppStep = useCallback(async (ad: Ad, step: WaStep) => {
        const targetPhone = formatWhatsAppNumber(ad.whatsapp_number || ad.phone_number);
        const message = buildAdvertiserWhatsAppMessage(ad, step);

        // Generate & copy the branded Poster Card to clipboard so Admin can Ctrl+V paste in WhatsApp Web/Desktop
        const blob = await generateAdPhotoCardBlob(ad, step);
        if (blob && navigator.clipboard && typeof ClipboardItem !== 'undefined') {
            try {
                await navigator.clipboard.write([new ClipboardItem({ 'image/png': blob })]);
                setToastNote(`📸 "${STEP_META[step].shortLabel}" Poster Image එක Clipboard එකට Copy විය! WhatsApp විවෘත වූ පසු Ctrl+V (Paste) ඔබා Image එකද යැවිය හැක.`);
                setTimeout(() => setToastNote(null), 6500);
            } catch {
                // Clipboard image write not supported on some mobile browsers
            }
        }

        markStepAsSent(ad.advertisement_id, step);

        const waUrl = targetPhone
            ? `https://api.whatsapp.com/send?phone=${targetPhone}&text=${encodeURIComponent(message)}`
            : `https://api.whatsapp.com/send?text=${encodeURIComponent(message)}`;

        window.open(waUrl, '_blank', 'noopener,noreferrer');
    }, [markStepAsSent]);

    const handleSharePhotoAndTextMobile = useCallback(async (ad: Ad, step: WaStep) => {
        const message = buildAdvertiserWhatsAppMessage(ad, step);
        const blob = await generateAdPhotoCardBlob(ad, step);
        markStepAsSent(ad.advertisement_id, step);

        if (blob && navigator.share) {
            try {
                const file = new File([blob], `tintinads-${step}-${ad.advertisement_id}.png`, { type: 'image/png' });
                if (navigator.canShare && navigator.canShare({ files: [file] })) {
                    await navigator.share({
                        title: `${ad.title} - TinTinAds.com`,
                        text: message,
                        files: [file],
                    });
                    return;
                }
            } catch {
                // fallback to direct WhatsApp link
            }
        }
        handleSendWhatsAppStep(ad, step);
    }, [handleSendWhatsAppStep, markStepAsSent]);

    const handleDownloadPoster = useCallback(async (ad: Ad, step: WaStep) => {
        const blob = await generateAdPhotoCardBlob(ad, step);
        if (!blob) return;
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `tintinads-${step}-ad-${ad.advertisement_id}.png`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }, []);

    const loadAds = useCallback(async (page: number = 1) => {
        setIsLoading(true);
        try {
            const res = await axios.get('/admin/api/advertisements', {
                params: { page, status: activeTab, per_page: 10 }
            });
            if (res.data.success) {
                setAds(res.data.ads || []);
                setStats(res.data.stats || { totalAds: 0, activeAds: 0, blockedAds: 0, featuredAds: 0 });
                if (res.data.pagination) {
                    setPagination({
                        current_page: res.data.pagination.current_page || 1,
                        total_pages: res.data.pagination.total_pages || 1,
                        per_page: res.data.pagination.per_page || 10,
                        total_items: res.data.pagination.total_items || 0,
                        from: res.data.pagination.from ?? 0,
                        to: res.data.pagination.to ?? 0,
                    });
                }
            }
        } catch (e) {
            console.error('Failed to load ads', e);
        } finally {
            setIsLoading(false);
        }
    }, [activeTab]);

    useEffect(() => { loadAds(1); }, [loadAds]);

    const doAction = async (endpoint: string, adId: number, msg: string) => {
        try {
            const res = await axios.post(`/admin/api/advertisements/${endpoint}`, { ad_ids: [adId] });
            if (res.data.success) { alert(msg); loadAds(pagination.current_page); }
        } catch (e: any) {
            alert(e?.response?.data?.message || 'Action failed.');
        }
    };

    const togglePayment = async (adId: number, newStatus: PaymentStatus) => {
        try {
            const res = await axios.post('/admin/api/advertisements/update-payment-status', {
                ad_ids: [adId], payment_status: newStatus,
            });
            if (res.data.success) loadAds(pagination.current_page);
        } catch {
            alert('Failed to update payment status.');
        }
    };

    return (
        <div className="flex flex-col h-full bg-white relative">
            {toastNote && (
                <div className="fixed top-4 right-4 z-[250] max-w-md bg-emerald-900 text-white px-4 py-3 rounded-2xl shadow-2xl border border-emerald-400/40 flex items-center gap-3 text-xs sm:text-sm font-semibold">
                    <i className="fab fa-whatsapp text-2xl text-emerald-400 shrink-0"></i>
                    <span>{toastNote}</span>
                </div>
            )}

            <div className="p-6 border-b border-gray-100 flex flex-col md:flex-row md:items-end justify-between gap-4 shrink-0">
                <div>
                    <h2 className="text-2xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
                        Ad Approvals & 3-Step WhatsApp Funnel
                    </h2>
                    <p className="text-gray-500 text-sm mt-1">
                        Send (1) Rs. 700 Free VIP Gift + Packages, (2) Live Ad Link Check, and (3) Expired Rs. 1,500 Renewal Offer directly to advertisers on WhatsApp.
                    </p>
                </div>
                <div className="flex gap-3">
                    <div className="bg-gray-50 px-4 py-2 rounded-xl border border-gray-100 text-center min-w-[80px]">
                        <div className="text-xs text-gray-500 font-medium">Total</div>
                        <div className="text-xl font-bold text-gray-900">{stats.totalAds}</div>
                    </div>
                    <div className="bg-green-50 px-4 py-2 rounded-xl border border-green-100 text-center min-w-[80px]">
                        <div className="text-xs text-green-600 font-medium">Active</div>
                        <div className="text-xl font-bold text-green-700">{stats.activeAds}</div>
                    </div>
                    <div className="bg-amber-50 px-4 py-2 rounded-xl border border-amber-100 text-center min-w-[80px]">
                        <div className="text-xs text-amber-600 font-medium">Pending</div>
                        <div className="text-xl font-bold text-amber-700">{Math.max(0, stats.totalAds - stats.activeAds - stats.blockedAds)}</div>
                    </div>
                    <div className="bg-red-50 px-4 py-2 rounded-xl border border-red-100 text-center min-w-[80px]">
                        <div className="text-xs text-red-600 font-medium">Blocked</div>
                        <div className="text-xl font-bold text-red-700">{stats.blockedAds}</div>
                    </div>
                </div>
            </div>

            <div className="px-6 border-b border-gray-100 overflow-x-auto shrink-0">
                <nav className="-mb-px flex space-x-6">
                    {tabs.map(tab => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                                activeTab === tab
                                    ? 'border-pink-500 text-pink-600'
                                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                            }`}
                        >
                            {tab}
                        </button>
                    ))}
                </nav>
            </div>

            <div className="flex-1 overflow-auto bg-gray-50/50 p-6">
                {isLoading ? (
                    <div className="flex justify-center items-center h-40">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-pink-600"></div>
                    </div>
                ) : ads.length === 0 ? (
                    <div className="text-center py-16 bg-white rounded-2xl border border-gray-100 shadow-sm">
                        <div className="text-5xl mb-3">📭</div>
                        <h3 className="text-lg font-semibold text-gray-900">No ads found</h3>
                        <p className="text-gray-500 mt-1 text-sm">No advertisements matching this status.</p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {ads.map(ad => {
                            const adSent = ad.advertisement_id ? (sentSteps[ad.advertisement_id] || {}) : {};
                            const contactNum = ad.whatsapp_number || ad.phone_number;
                            return (
                                <div key={ad.id} className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex flex-col lg:flex-row gap-5 hover:shadow-md transition-shadow">
                                    <div className="w-full lg:w-44 h-36 shrink-0 rounded-xl overflow-hidden bg-gray-100 relative">
                                        <img src={ad.imgSrc} alt={ad.title} className="w-full h-full object-cover" />
                                        <div className="absolute top-2 left-2"><StatusBadge status={ad.status} /></div>
                                        {(adSent.step1 || adSent.step2 || adSent.step3) && (
                                            <div className="absolute bottom-2 left-2 right-2 flex flex-wrap gap-1">
                                                {adSent.step1 && <span className="bg-amber-500 text-white text-[9px] font-extrabold px-1.5 py-0.5 rounded shadow">1✓ VIP</span>}
                                                {adSent.step2 && <span className="bg-emerald-600 text-white text-[9px] font-extrabold px-1.5 py-0.5 rounded shadow">2✓ Link</span>}
                                                {adSent.step3 && <span className="bg-rose-600 text-white text-[9px] font-extrabold px-1.5 py-0.5 rounded shadow">3✓ Offer</span>}
                                            </div>
                                        )}
                                    </div>
                                    <div className="flex-1 min-w-0 flex flex-col justify-between">
                                        <div>
                                            <div className="flex items-start justify-between gap-2 mb-2">
                                                <h3 className="text-base font-bold text-gray-900 leading-tight line-clamp-2">{ad.title}</h3>
                                                <span className="text-sm font-bold text-pink-600 shrink-0">Rs. {ad.price ? ad.price.toLocaleString() : '0'}</span>
                                            </div>
                                            <div className="flex flex-wrap items-center gap-2 text-xs text-gray-500 mb-3">
                                                <span className="bg-gray-100 px-2 py-0.5 rounded-md font-mono">{ad.id}</span>
                                                <span>• {ad.category}</span>
                                                <span>• {ad.location || 'N/A'}</span>
                                                <span>• {ad.datePosted}</span>
                                                {contactNum && (
                                                    <span className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-700 border border-emerald-200 px-2.5 py-0.5 rounded-full font-bold">
                                                        <i className="fab fa-whatsapp text-emerald-600"></i>
                                                        {contactNum}
                                                    </span>
                                                )}
                                            </div>

                                            {/* 3-Step WhatsApp Funnel Buttons Bar */}
                                            <div className="mb-3 p-2.5 bg-gradient-to-r from-emerald-50/70 via-amber-50/50 to-rose-50/70 rounded-xl border border-emerald-200/70">
                                                <div className="flex items-center justify-between mb-1.5">
                                                    <span className="text-[11px] font-extrabold text-gray-700 flex items-center gap-1.5">
                                                        <i className="fab fa-whatsapp text-emerald-600 text-sm"></i>
                                                        WhatsApp 3-Step Marketing Funnel (අයිතිකරුට යවන පණිවිඩ 3):
                                                    </span>
                                                    <button
                                                        type="button"
                                                        onClick={() => { setSelectedStep('step1'); setPreviewAd(ad); }}
                                                        className="text-[11px] font-extrabold text-pink-600 hover:underline cursor-pointer"
                                                    >
                                                        👁️ Poster & Msg Preview
                                                    </button>
                                                </div>
                                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                                                    {/* Step 1 Button */}
                                                    <button
                                                        type="button"
                                                        onClick={() => handleSendWhatsAppStep(ad, 'step1')}
                                                        className={`flex items-center justify-center gap-1.5 px-2.5 py-2 rounded-lg text-[11px] font-extrabold shadow-xs transition cursor-pointer ${
                                                            adSent.step1
                                                                ? 'bg-amber-100 text-amber-900 border border-amber-400 hover:bg-amber-200'
                                                                : 'bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white'
                                                        }`}
                                                        title="1. රු. 700 VIP දැන්වීම නොමිලේ + Packages විස්තරය යවන්න"
                                                    >
                                                        <span>{adSent.step1 ? '✅ 1. 700 VIP Sent' : '🎁 1. Free 700 VIP + Pkgs'}</span>
                                                    </button>

                                                    {/* Step 2 Button */}
                                                    <button
                                                        type="button"
                                                        onClick={() => handleSendWhatsAppStep(ad, 'step2')}
                                                        className={`flex items-center justify-center gap-1.5 px-2.5 py-2 rounded-lg text-[11px] font-extrabold shadow-xs transition cursor-pointer ${
                                                            adSent.step2
                                                                ? 'bg-emerald-100 text-emerald-900 border border-emerald-400 hover:bg-emerald-200'
                                                                : 'bg-[#25D366] hover:bg-green-600 text-white'
                                                        }`}
                                                        title="2. දැන්වීමේ Link එක සහ අඩුපාඩු පරීක්ෂා කිරීමේ පණිවිඩය යවන්න"
                                                    >
                                                        <span>{adSent.step2 ? '✅ 2. Ad Link Sent' : '🔗 2. Send Ad Link Check'}</span>
                                                    </button>

                                                    {/* Step 3 Button */}
                                                    <button
                                                        type="button"
                                                        onClick={() => handleSendWhatsAppStep(ad, 'step3')}
                                                        className={`flex items-center justify-center gap-1.5 px-2.5 py-2 rounded-lg text-[11px] font-extrabold shadow-xs transition cursor-pointer ${
                                                            adSent.step3
                                                                ? 'bg-rose-100 text-rose-900 border border-rose-400 hover:bg-rose-200'
                                                                : 'bg-gradient-to-r from-rose-600 to-purple-700 hover:from-rose-700 hover:to-purple-800 text-white'
                                                        }`}
                                                        title="3. දැන්වීම Expire වූ පසු රු. 1,500 දින 30 Offer එක යවන්න"
                                                    >
                                                        <span>{adSent.step3 ? '✅ 3. 1500 Offer Sent' : '⏰ 3. Expired 1500 Offer'}</span>
                                                    </button>
                                                </div>
                                            </div>

                                            <div className="flex flex-wrap items-center gap-3 p-2.5 bg-gray-50 rounded-xl border border-gray-100 text-xs">
                                                <div className="flex items-center gap-2">
                                                    <div className="w-6 h-6 rounded-full bg-gradient-to-r from-pink-500 to-purple-600 flex items-center justify-center text-white font-bold text-[10px] shrink-0">
                                                        {(ad.agentName || 'A').charAt(0).toUpperCase()}
                                                    </div>
                                                    <span className="font-semibold text-gray-800">{ad.agentName}</span>
                                                    <span className="text-gray-400">({ad.agentId})</span>
                                                </div>
                                                <div className="h-3 w-px bg-gray-200"></div>
                                                <PaymentBadge status={ad.paymentStatus} />
                                                {ad.paymentStatus === 'unpaid' ? (
                                                    <button onClick={() => togglePayment(ad.advertisement_id!, 'paid')} className="text-green-600 font-semibold hover:underline">Mark Paid</button>
                                                ) : (
                                                    <button onClick={() => togglePayment(ad.advertisement_id!, 'unpaid')} className="text-red-500 font-semibold hover:underline">Mark Unpaid</button>
                                                )}
                                                <div className="h-3 w-px bg-gray-200"></div>
                                                <a
                                                    href={`/ad/${ad.advertisement_id}`}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="text-pink-600 font-bold hover:underline flex items-center gap-1"
                                                >
                                                    <i className="fas fa-external-link-alt text-[10px]"></i>
                                                    View Live Ad
                                                </a>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex flex-wrap lg:flex-col justify-end gap-2 shrink-0 lg:border-l border-gray-100 lg:pl-4 pt-3 lg:pt-0 border-t lg:border-t-0">
                                        <button
                                            onClick={() => { setSelectedStep('step1'); setPreviewAd(ad); }}
                                            className="inline-flex items-center justify-center gap-1.5 px-3 py-2 bg-blue-50 text-blue-600 text-xs font-bold rounded-xl hover:bg-blue-100 transition cursor-pointer"
                                        >
                                            <i className="fas fa-images"></i>
                                            <span>3 Posters & Msgs</span>
                                        </button>
                                        {ad.receiptPath ? (
                                            <button onClick={() => setSlipImage(ad.receiptPath!)} className="inline-flex items-center justify-center px-3 py-2 bg-pink-50 text-pink-600 text-xs font-bold rounded-xl hover:bg-pink-100 transition cursor-pointer">View Slip</button>
                                        ) : (
                                            <div className="inline-flex items-center justify-center px-3 py-2 bg-gray-50 text-gray-400 text-xs font-bold rounded-xl border border-gray-100 cursor-not-allowed">No Slip</div>
                                        )}
                                        {ad.status !== 'Active' && ad.status !== 'Featured' && (
                                            <button onClick={() => doAction('activate', ad.advertisement_id!, 'Ad Approved!')} className="inline-flex items-center justify-center px-3 py-2 bg-green-500 text-white text-xs font-bold rounded-xl hover:bg-green-600 transition shadow-sm cursor-pointer">Approve</button>
                                        )}
                                        {ad.status !== 'Blocked' && (
                                            <button onClick={() => doAction('block', ad.advertisement_id!, 'Ad Blocked!')} className="inline-flex items-center justify-center px-3 py-2 bg-red-50 text-red-600 text-xs font-bold rounded-xl hover:bg-red-100 transition cursor-pointer">Reject</button>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>

            {!isLoading && pagination.total_pages > 1 && (
                <div className="p-4 border-t border-gray-100 bg-white flex items-center justify-between shrink-0">
                    <span className="text-sm text-gray-500">Showing {pagination.from}–{pagination.to} of {pagination.total_items}</span>
                    <div className="flex gap-2">
                        <button onClick={() => loadAds(pagination.current_page - 1)} disabled={pagination.current_page === 1} className="px-4 py-1.5 border border-gray-200 rounded-xl text-sm font-medium disabled:opacity-40 hover:bg-gray-50 transition">Previous</button>
                        <span className="px-3 py-1.5 text-sm text-gray-600 font-medium">{pagination.current_page} / {pagination.total_pages}</span>
                        <button onClick={() => loadAds(pagination.current_page + 1)} disabled={pagination.current_page === pagination.total_pages} className="px-4 py-1.5 border border-gray-200 rounded-xl text-sm font-medium disabled:opacity-40 hover:bg-gray-50 transition">Next</button>
                    </div>
                </div>
            )}

            {slipImage && (
                <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm" onClick={() => setSlipImage(null)}>
                    <div className="relative max-w-2xl w-full" onClick={e => e.stopPropagation()}>
                        <button className="absolute -top-10 right-0 text-white font-semibold text-sm px-3 py-1 bg-white/10 hover:bg-white/20 rounded-lg transition" onClick={() => setSlipImage(null)}>Close</button>
                        {slipImage.toLowerCase().endsWith('.pdf') ? (
                            <iframe 
                                src={slipImage} 
                                title="Payment Receipt PDF"
                                className="w-full min-h-[70vh] rounded-xl shadow-2xl bg-white"
                            ></iframe>
                        ) : (
                            <img src={slipImage} alt="Payment Receipt" className="w-full h-auto max-h-[80vh] object-contain rounded-xl shadow-2xl bg-white" />
                        )}
                    </div>
                </div>
            )}

            {previewAd && (
                <div className="fixed inset-0 z-[200] flex items-center justify-center p-3 sm:p-4 bg-black/70 backdrop-blur-sm" onClick={() => setPreviewAd(null)}>
                    <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[94vh] overflow-hidden flex flex-col" onClick={e => e.stopPropagation()}>
                        <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-gradient-to-r from-pink-50 via-amber-50 to-purple-50 shrink-0">
                            <div>
                                <h3 className="font-extrabold text-gray-900 text-base">
                                    3-Step WhatsApp Marketing Funnel & Auto-Poster
                                </h3>
                                <p className="text-xs text-gray-500 mt-0.5">
                                    Advertiser Contact: <span className="font-mono font-bold text-emerald-700">{previewAd.whatsapp_number || previewAd.phone_number || 'No Phone'}</span>
                                </p>
                            </div>
                            <button onClick={() => setPreviewAd(null)} className="text-gray-400 hover:text-red-500 transition text-lg cursor-pointer px-2">✕</button>
                        </div>

                        {/* 3 Step Selector Tabs */}
                        <div className="px-4 pt-3 bg-gray-50 border-b border-gray-200 grid grid-cols-3 gap-2 shrink-0">
                            {(['step1', 'step2', 'step3'] as WaStep[]).map((st) => {
                                const isActive = selectedStep === st;
                                const isSent = previewAd.advertisement_id ? Boolean(sentSteps[previewAd.advertisement_id]?.[st]) : false;
                                return (
                                    <button
                                        key={st}
                                        type="button"
                                        onClick={() => setSelectedStep(st)}
                                        className={`py-2.5 px-3 rounded-t-xl text-xs font-extrabold transition flex items-center justify-center gap-1.5 cursor-pointer border-t border-x ${
                                            isActive
                                                ? 'bg-white text-pink-600 border-gray-200 shadow-xs'
                                                : 'bg-gray-100 text-gray-600 border-transparent hover:bg-gray-200/70'
                                        }`}
                                    >
                                        <span>{STEP_META[st].shortLabel}</span>
                                        {isSent && <span className="bg-emerald-600 text-white text-[9px] px-1.5 py-0.5 rounded-full">✓</span>}
                                    </button>
                                );
                            })}
                        </div>

                        <div className="p-4 sm:p-5 overflow-y-auto flex-1">
                            <div className="mb-3 flex items-center justify-between">
                                <span className={`text-xs font-extrabold px-3 py-1 rounded-full ${STEP_META[selectedStep].badgeColor}`}>
                                    {STEP_META[selectedStep].title}
                                </span>
                                <button
                                    type="button"
                                    onClick={() => handleDownloadPoster(previewAd, selectedStep)}
                                    className="text-xs font-bold text-blue-600 hover:underline flex items-center gap-1 cursor-pointer"
                                >
                                    <i className="fas fa-download"></i> Download Poster PNG
                                </button>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {/* Left Column: Auto-Generated HD Poster Preview */}
                                <div className="bg-slate-900 rounded-2xl p-3 flex flex-col items-center justify-center border border-slate-800">
                                    <div className="text-[11px] font-bold text-amber-300 mb-2 text-center">
                                        📸 Auto-Generated Poster (WhatsApp හි Ctrl+V ඔබා Paste කළ හැක)
                                    </div>
                                    {isGeneratingCard ? (
                                        <div className="h-64 flex items-center justify-center text-white text-xs">
                                            Generating HD Poster...
                                        </div>
                                    ) : previewCardUrl ? (
                                        <img
                                            src={previewCardUrl}
                                            alt="Generated Poster"
                                            className="w-full max-h-[380px] object-contain rounded-xl shadow-lg border border-white/10"
                                        />
                                    ) : (
                                        <img
                                            src={previewAd.imgSrc}
                                            alt={previewAd.title}
                                            className="w-full max-h-[340px] object-contain rounded-xl"
                                        />
                                    )}
                                </div>

                                {/* Right Column: WhatsApp Message Bubble Preview */}
                                <div className="bg-[#e5ddd5] p-3 rounded-2xl border border-gray-200 flex flex-col">
                                    <div className="text-[11px] font-bold text-gray-700 mb-2 flex items-center justify-between">
                                        <span><i className="fab fa-whatsapp text-emerald-600 mr-1"></i> WhatsApp Message Preview:</span>
                                    </div>
                                    <div className="bg-[#dcf8c6] rounded-xl p-2.5 shadow-xs border border-emerald-200 flex-1 overflow-y-auto max-h-[380px]">
                                        {/* Link Preview Header inside WhatsApp Bubble */}
                                        <div className="bg-white rounded-lg overflow-hidden border border-gray-200 mb-2">
                                            <img src={previewAd.imgSrc} alt="Ad" className="w-full h-28 object-cover bg-gray-100" />
                                            <div className="p-2 bg-gray-50 border-t border-gray-100">
                                                <p className="text-[11px] font-bold text-gray-900 truncate">{previewAd.title} - TinTinAds</p>
                                                <p className="text-[10px] text-emerald-600 font-semibold">tintinads.com/ad/{previewAd.advertisement_id}</p>
                                            </div>
                                        </div>
                                        <pre className="text-[11px] text-gray-800 whitespace-pre-wrap font-sans leading-relaxed">
                                            {buildAdvertiserWhatsAppMessage(previewAd, selectedStep)}
                                        </pre>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="p-4 border-t border-gray-100 bg-gray-50 flex flex-wrap justify-between items-center gap-2 shrink-0">
                            <div className="flex flex-wrap gap-2">
                                <button
                                    type="button"
                                    onClick={() => handleSendWhatsAppStep(previewAd, selectedStep)}
                                    className={`px-4 py-2.5 rounded-xl text-xs font-extrabold shadow-sm flex items-center gap-1.5 cursor-pointer ${STEP_META[selectedStep].btnColor}`}
                                >
                                    <i className="fab fa-whatsapp text-sm"></i>
                                    <span>Send {STEP_META[selectedStep].shortLabel} on WhatsApp</span>
                                </button>
                                <button
                                    type="button"
                                    onClick={() => handleSharePhotoAndTextMobile(previewAd, selectedStep)}
                                    className="px-3.5 py-2.5 rounded-xl text-xs font-bold text-emerald-800 bg-emerald-50 border border-emerald-300 hover:bg-emerald-100 flex items-center gap-1.5 cursor-pointer"
                                >
                                    <i className="fas fa-share-alt"></i>
                                    <span>Share Poster + Msg (Mobile)</span>
                                </button>
                            </div>
                            <div className="flex gap-2">
                                {previewAd.receiptPath && (
                                    <button onClick={() => { setSlipImage(previewAd.receiptPath!); setPreviewAd(null); }} className="px-3.5 py-2 rounded-xl text-xs font-bold text-pink-600 bg-pink-50 hover:bg-pink-100 cursor-pointer">View Slip</button>
                                )}
                                <button onClick={() => setPreviewAd(null)} className="px-4 py-2 rounded-xl text-xs font-bold text-gray-600 bg-white border border-gray-200 hover:bg-gray-50 cursor-pointer">Close</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default SuperAdminAds;
