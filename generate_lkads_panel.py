import json
import csv
import re
import os
import sys

sys.stdout.reconfigure(encoding='utf-8')

# 1. Load 323 LK-Ads advertisers
with open('scraped_lkads_advertisers.json', 'r', encoding='utf-8') as f:
    lk_ads = json.load(f)

print(f"Loaded {len(lk_ads)} advertisers from lk-ads.com.")

clean_list = []
for idx, a in enumerate(lk_ads, 1):
    phone = a['phone'].strip()
    wa = a.get('whatsapp', '').strip() or phone
    
    clean_p = re.sub(r'[^0-9]', '', phone)
    clean_wa = re.sub(r'[^0-9]', '', wa)
    
    norm_phone = '0' + clean_p[-9:] if len(clean_p) >= 9 else phone
    norm_wa = '0' + clean_wa[-9:] if len(clean_wa) >= 9 else wa
    wa_intl = '94' + clean_wa[-9:] if len(clean_wa) >= 9 else '94' + clean_p[-9:]
    
    clean_title = a.get('title', '').replace('\n', ' ').replace('\r', ' ').strip()
    
    clean_list.append({
        'num': idx,
        'title': clean_title,
        'category': a.get('category', 'Girls Personal'),
        'location': a.get('location', 'Colombo'),
        'price': float(a.get('price', 5000)),
        'phone': norm_phone,
        'whatsapp': norm_wa,
        'wa_intl': wa_intl,
        'url': a.get('url', ''),
        'is_new': a.get('is_new', True)
    })

# 2. Export public/lkads_advertisers.csv
with open('public/lkads_advertisers.csv', 'w', newline='', encoding='utf-8-sig') as f:
    writer = csv.writer(f)
    writer.writerow(['#', 'Title', 'Category', 'Location', 'Price (Rs.)', 'Calling Phone', 'WhatsApp Number', 'Is Brand New Lead', 'LK-Ads URL'])
    for a in clean_list:
        writer.writerow([a['num'], a['title'], a['category'], a['location'], a['price'], a['phone'], a['whatsapp'], 'YES' if a['is_new'] else 'NO', a['url']])

print("Generated public/lkads_advertisers.csv with 323 rows.")

# 3. Export public/lkads_advertisers.vcf
vcf_lines = []
for a in clean_list:
    clean_name = re.sub(r'[^\w\s\u0D80-\u0DFF]', '', a['title'])[:25].strip() or a['category']
    tag = "NEW" if a['is_new'] else "TOP"
    vcf_lines.append("BEGIN:VCARD")
    vcf_lines.append("VERSION:3.0")
    vcf_lines.append(f"FN:LK-Ads #{a['num']:03d} [{tag}] - {clean_name}")
    vcf_lines.append(f"N:{clean_name};LK-Ads #{a['num']:03d};;;")
    vcf_lines.append(f"TEL;TYPE=CELL,VOICE:{a['phone']}")
    if a['whatsapp'] != a['phone']:
        vcf_lines.append(f"TEL;TYPE=WORK,VOICE:{a['whatsapp']}")
    vcf_lines.append(f"URL:{a['url']}")
    vcf_lines.append(f"NOTE:LK-Ads Advertiser | Cat: {a['category']} | Loc: {a['location']} | Price: Rs. {a['price']}")
    vcf_lines.append("END:VCARD")
    vcf_lines.append("")

with open('public/lkads_advertisers.vcf', 'w', encoding='utf-8') as f:
    f.write('\n'.join(vcf_lines))

print("Generated public/lkads_advertisers.vcf with 323 vCards.")

# 4. Generate Interactive Panel HTML (public/lkads_connect.html)
ads_json_str = json.dumps(clean_list, ensure_ascii=False)

html_template = """<!DOCTYPE html>
<html lang="si">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>LK-Ads (New Lanka Ads) - 323 Advertisers Connect Panel</title>
    <link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=Noto+Sans+Sinhala:wght@400;500;600;700&display=swap');
        body {
            font-family: 'Inter', 'Noto Sans Sinhala', sans-serif;
            background-color: #080d1a;
            color: #f3f4f6;
        }
        .custom-scrollbar::-webkit-scrollbar {
            width: 8px;
            height: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
            background: #111827;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
            background: #374151;
            border-radius: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
            background: #4b5563;
        }
    </style>
</head>
<body class="p-4 md:p-8 min-h-screen">
    <div class="max-w-7xl mx-auto space-y-6">

        <!-- Top Header Navigation -->
        <div class="flex flex-col md:flex-row justify-between items-start md:items-center bg-gray-900 border border-blue-500/30 p-5 rounded-2xl shadow-xl gap-4">
            <div>
                <div class="flex items-center space-x-3">
                    <span class="text-3xl">🌐</span>
                    <div>
                        <div class="flex items-center space-x-2">
                            <h1 class="text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-sky-200 to-indigo-400">
                                LK-Ads.com (New Lanka Ads) 323 Contacts
                            </h1>
                            <span class="bg-blue-500/20 text-blue-400 border border-blue-500/40 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase">Top Classifieds Leads</span>
                        </div>
                        <p class="text-sm text-gray-400 mt-1">
                            ශ්‍රී ලංකාවේ ප්‍රමුඛතම LK-Ads සයිට් එකේ සක්‍රීය දැන්වීම්කරුවන් 323 දෙනාගේ WhatsApp & Calling අංක පැනලය
                        </p>
                    </div>
                </div>
            </div>
            <div class="flex flex-wrap gap-2">
                <a href="/tintin_connect.html" class="inline-flex items-center space-x-2 bg-yellow-500 hover:bg-yellow-400 text-black px-4 py-2.5 rounded-xl font-bold text-xs shadow-lg transition">
                    <i class="fa-solid fa-crown text-black"></i>
                    <span>TinTin VIP (120)</span>
                </a>
                <a href="/hela_connect.html" class="inline-flex items-center space-x-2 bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-2.5 rounded-xl font-bold text-xs shadow-lg transition">
                    <i class="fa-solid fa-fire text-white"></i>
                    <span>Hela Lanka Leads (311)</span>
                </a>
                <a href="/" target="_blank" class="inline-flex items-center space-x-2 bg-gray-800 hover:bg-gray-700 text-gray-300 px-4 py-2.5 rounded-xl border border-gray-700 font-semibold text-xs transition">
                    <i class="fa-solid fa-globe"></i>
                    <span>TinTinAds මුල් පිටුව</span>
                </a>
            </div>
        </div>

        <!-- Metric Cards -->
        <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div class="bg-gray-900 border border-gray-800 p-4 rounded-xl flex items-center justify-between">
                <div>
                    <p class="text-xs text-gray-400 uppercase tracking-wider font-semibold">සම්පූර්ණ LK-Ads Contacts</p>
                    <p class="text-2xl font-black text-blue-400 mt-1" id="stat-total">323</p>
                </div>
                <div class="w-12 h-12 bg-blue-500/10 rounded-xl flex items-center justify-center text-blue-400 text-xl font-bold">
                    <i class="fa-solid fa-users"></i>
                </div>
            </div>
            <div class="bg-gray-900 border border-gray-800 p-4 rounded-xl flex items-center justify-between">
                <div>
                    <p class="text-xs text-gray-400 uppercase tracking-wider font-semibold">Brand New Leads (නැවුම්)</p>
                    <p class="text-2xl font-black text-emerald-400 mt-1" id="stat-brand-new">254</p>
                </div>
                <div class="w-12 h-12 bg-emerald-500/10 rounded-xl flex items-center justify-center text-emerald-400 text-xl font-bold">
                    <i class="fa-solid fa-sparkles"></i>
                </div>
            </div>
            <div class="bg-gray-900 border border-gray-800 p-4 rounded-xl flex items-center justify-between">
                <div>
                    <p class="text-xs text-gray-400 uppercase tracking-wider font-semibold">Message යැවූ පිරිස</p>
                    <p class="text-2xl font-black text-green-400 mt-1" id="stat-contacted">0</p>
                </div>
                <div class="w-12 h-12 bg-green-500/10 rounded-xl flex items-center justify-center text-green-400 text-xl font-bold">
                    <i class="fa-solid fa-circle-check"></i>
                </div>
            </div>
            <div class="bg-gray-900 border border-gray-800 p-4 rounded-xl flex items-center justify-between">
                <div>
                    <p class="text-xs text-gray-400 uppercase tracking-wider font-semibold">යැවීමට ඉතිරි</p>
                    <p class="text-2xl font-black text-amber-400 mt-1" id="stat-pending">323</p>
                </div>
                <div class="w-12 h-12 bg-amber-500/10 rounded-xl flex items-center justify-center text-amber-400 text-xl font-bold">
                    <i class="fa-solid fa-clock"></i>
                </div>
            </div>
        </div>

        <!-- Quick Copy and Export Bar -->
        <div class="bg-gradient-to-r from-gray-900 via-gray-850 to-gray-900 border border-blue-500/30 p-5 rounded-2xl shadow-xl space-y-4">
            <div class="flex flex-col md:flex-row justify-between items-start md:items-center gap-3">
                <div>
                    <h3 class="text-base font-bold text-white flex items-center gap-2">
                        <i class="fa-solid fa-copy text-blue-400"></i>
                        <span>LK-Ads අංක එකවර Copy කරගන්න & Download Options:</span>
                    </h3>
                    <p class="text-xs text-gray-400 mt-0.5">WhatsApp අංක සහ Calling අංක වෙන වෙනම ක්ලික් එකකින් ලබාගන්න</p>
                </div>
                <div class="flex flex-wrap gap-2">
                    <a href="/lkads_advertisers.vcf" class="inline-flex items-center space-x-1.5 bg-blue-500 hover:bg-blue-400 text-white px-3.5 py-2 rounded-lg font-bold text-xs transition shadow">
                        <i class="fa-solid fa-address-book"></i>
                        <span>VCF (Contacts 323ම Phone එකට Save කරන්න)</span>
                    </a>
                    <a href="/lkads_advertisers.csv" class="inline-flex items-center space-x-1.5 bg-gray-800 hover:bg-gray-700 text-gray-200 px-3.5 py-2 rounded-lg border border-gray-700 font-semibold text-xs transition">
                        <i class="fa-solid fa-file-csv text-blue-400"></i>
                        <span>CSV බාගත කරන්න</span>
                    </a>
                </div>
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                <button onclick="copyAllWhatsAppComma()" class="flex items-center justify-between bg-green-950/40 hover:bg-green-900/60 border border-green-700/50 text-green-300 px-4 py-3 rounded-xl transition text-left group">
                    <div>
                        <div class="font-bold text-xs text-green-400 group-hover:text-green-300">WhatsApp අංක 323ම (Comma-separated)</div>
                        <div class="text-[11px] text-gray-400">Broadcast / Bulk Messages සඳහා</div>
                    </div>
                    <i class="fa-solid fa-copy text-green-400 text-base"></i>
                </button>

                <button onclick="copyAllWhatsAppLines()" class="flex items-center justify-between bg-emerald-950/40 hover:bg-emerald-900/60 border border-emerald-700/50 text-emerald-300 px-4 py-3 rounded-xl transition text-left group">
                    <div>
                        <div class="font-bold text-xs text-emerald-400 group-hover:text-emerald-300">WhatsApp අංක 323ම (Line-by-line)</div>
                        <div class="text-[11px] text-gray-400">Excel / Google Sheets සඳහා</div>
                    </div>
                    <i class="fa-solid fa-list-ol text-emerald-400 text-base"></i>
                </button>

                <button onclick="copyAllNormalPhones()" class="flex items-center justify-between bg-blue-950/40 hover:bg-blue-900/60 border border-blue-700/50 text-blue-300 px-4 py-3 rounded-xl transition text-left group">
                    <div>
                        <div class="font-bold text-xs text-blue-400 group-hover:text-blue-300">සාමාන්‍ය Call අංක 323ම (Normal Phone)</div>
                        <div class="text-[11px] text-gray-400">Direct Calling Outreach සඳහා</div>
                    </div>
                    <i class="fa-solid fa-phone text-blue-400 text-base"></i>
                </button>
            </div>
        </div>

        <!-- WhatsApp Outreach Message Templates & Customizer -->
        <div class="bg-gray-900 border border-gray-800 p-5 rounded-2xl shadow-xl space-y-4">
            <div class="flex flex-col md:flex-row justify-between items-start md:items-center gap-3">
                <div>
                    <h3 class="text-base font-bold text-white flex items-center gap-2">
                        <i class="fa-brands fa-whatsapp text-green-400 text-lg"></i>
                        <span>WhatsApp Message Templates & Settings</span>
                    </h3>
                    <p class="text-xs text-gray-400 mt-0.5">LK-Ads දැන්වීම්කරුවන්ට යවන ආරාධනා පණිවිඩය (පහත බොත්තම එබූ සැනින් මේ පණිවිඩය සමඟ WhatsApp විවෘත වේ)</p>
                </div>
                <div class="flex flex-wrap gap-2" id="template-buttons">
                    <button onclick="setTemplate(1)" id="btn-tpl-1" class="px-3 py-1.5 rounded-lg text-xs font-bold bg-blue-500 text-white border border-blue-400">
                        ⭐ 1. නොමිලේ VIP දැන්වීමක් පළ කිරීම (Best Pitch)
                    </button>
                    <button onclick="setTemplate(2)" id="btn-tpl-2" class="px-3 py-1.5 rounded-lg text-xs font-semibold bg-gray-800 text-gray-300 hover:bg-gray-700 border border-gray-700">
                        2. කෙටි මිත්‍රශීලී ආරාධනය (Short & Direct)
                    </button>
                    <button onclick="setTemplate(3)" id="btn-tpl-3" class="px-3 py-1.5 rounded-lg text-xs font-semibold bg-gray-800 text-gray-300 hover:bg-gray-700 border border-gray-700">
                        3. AI Voice Note සහ රු. 1,500 පැකේජය (Special Pitch)
                    </button>
                </div>
            </div>

            <!-- Message Preview & Edit Textarea -->
            <div class="relative">
                <textarea id="message-template" rows="8" class="w-full bg-gray-950 border border-gray-700 rounded-xl p-4 text-xs font-mono text-gray-200 focus:outline-none focus:border-blue-500 leading-relaxed custom-scrollbar" oninput="updateAllWhatsAppLinks()"></textarea>
            </div>
        </div>

        <!-- Search & Filter Controls -->
        <div class="bg-gray-900 border border-gray-800 p-4 rounded-xl flex flex-col md:flex-row gap-3 items-center justify-between">
            <div class="relative w-full md:w-96">
                <i class="fa-solid fa-magnifying-glass absolute left-3 top-3.5 text-gray-500 text-xs"></i>
                <input type="text" id="search-input" placeholder="නම, දුරකථන අංකය, පළාත සොයන්න..." oninput="filterAds()" class="w-full bg-gray-950 border border-gray-800 rounded-lg pl-9 pr-4 py-2.5 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-blue-500">
            </div>

            <div class="flex flex-wrap gap-2 w-full md:w-auto">
                <select id="filter-category" onchange="filterAds()" class="bg-gray-950 border border-gray-800 text-gray-300 text-xs rounded-lg px-3 py-2.5 focus:outline-none focus:border-blue-500">
                    <option value="">සියලුම Categories</option>
                    <option value="Girls Personal">Girls Personal</option>
                    <option value="Live Cam">Live Cam</option>
                    <option value="Spa & Wellness Services">Spa & Wellness</option>
                    <option value="Boys Personal">Boys Personal</option>
                    <option value="Shemale Personal">Shemale Personal</option>
                </select>

                <select id="filter-lead-type" onchange="filterAds()" class="bg-gray-950 border border-gray-800 text-gray-300 text-xs rounded-lg px-3 py-2.5 focus:outline-none focus:border-blue-500">
                    <option value="">සියලුම Leads (All 323)</option>
                    <option value="brand_new">🔥 Brand New Leads පමණක් (254)</option>
                </select>

                <select id="filter-status" onchange="filterAds()" class="bg-gray-950 border border-gray-800 text-gray-300 text-xs rounded-lg px-3 py-2.5 focus:outline-none focus:border-blue-500">
                    <option value="">සියලුම තත්වයන් (All)</option>
                    <option value="pending">Message නොයැවූ (Pending)</option>
                    <option value="contacted">Message යැවූ (Contacted)</option>
                </select>

                <button onclick="resetFilters()" class="bg-gray-800 hover:bg-gray-700 text-gray-300 text-xs px-3 py-2.5 rounded-lg border border-gray-700">
                    Reset
                </button>
            </div>
        </div>

        <!-- Advertisers Table -->
        <div class="bg-gray-900 border border-gray-800 rounded-2xl shadow-xl overflow-hidden">
            <div class="overflow-x-auto custom-scrollbar">
                <table class="w-full text-left border-collapse text-xs">
                    <thead>
                        <tr class="bg-gray-850 border-b border-gray-800 text-gray-400 uppercase font-semibold">
                            <th class="p-3 text-center w-12">#</th>
                            <th class="p-3 text-center w-28">Status</th>
                            <th class="p-3">දැන්වීමේ විස්තරය (Title & Category)</th>
                            <th class="p-3">නගරය</th>
                            <th class="p-3 font-semibold text-blue-300">සාමාන්‍ය Calling Phone</th>
                            <th class="p-3 font-semibold text-green-300">WhatsApp Number</th>
                            <th class="p-3 text-center">LK-Ads Link</th>
                            <th class="p-3 text-center w-36">WhatsApp Action</th>
                        </tr>
                    </thead>
                    <tbody id="ads-tbody" class="divide-y divide-gray-800">
                        <!-- Rendered by JS -->
                    </tbody>
                </table>
            </div>

            <!-- Table Footer -->
            <div class="p-4 bg-gray-850 border-t border-gray-800 flex justify-between items-center text-xs text-gray-400">
                <span id="footer-count">පෙන්වන්නේ දැන්වීම් 323න් 323යි</span>
                <span class="text-blue-400 font-semibold">🌐 LK-Ads (New Lanka Ads) Competitor Extractor System</span>
            </div>
        </div>

    </div>

    <!-- Notification Toast -->
    <div id="toast" class="fixed bottom-6 right-6 bg-blue-500 text-white font-bold px-4 py-3 rounded-xl shadow-2xl transform translate-y-20 opacity-0 transition duration-300 flex items-center gap-2 text-xs z-50">
        <i class="fa-solid fa-circle-check text-base"></i>
        <span id="toast-text">Copied to clipboard!</span>
    </div>

    <script>
        const allAds = __LKADS_JSON__;

        const templates = {
            1: `👋 ආයුබෝවන්! 

අපි ඔබගේ දැන්වීම දැක ඔබට විශේෂ පණිවිඩයක් එවන්නෙමු. 🌟

ශ්‍රී ලංකාවේ වේගයෙන්ම ජනප්‍රිය වන TinTinAds.com හි ඔබගේ දැන්වීම රු. 700ක VIP Golden Highlight එකක් යටතේ කිසිදු මුදලක් අය නොකර නොමිලේම (FREE) පළ කර දීමට අපි සූදානම්! 🎉

💡 අපගේ සයිට් එකේ විශේෂත්වය:
✔️ ලංකාවේ ප්‍රථම වතාවට සිංහල AI Voice Note (හඬ පට) සහිත දැන්වීම් සේවාව.
✔️ Google Search වල ඉහළින්ම Rank වීම නිසා දිනපතා දහස් ගණනක් සැබෑ ගැණුම්කරුවන්.
✔️ සෘජු WhatsApp & Call බොත්තම් මඟින් පාරිභෝගිකයින් ක්ෂණිකව ඔබ හා සම්බන්ධ වීම.

ඔබගේ දැන්වීම TinTinAds.com හි නොමිලේ පළ කර ගැනීමට කැමති නම්, ඔබගේ දැන්වීමේ විස්තරය හෝ Photo එක මෙහි එවන්න. අපි නොමිලේම පළ කර දෙන්නෙමු! 🤝

🌐 වෙබ් අඩවිය: https://tintinads.com
💬 TinTinAds නිල WhatsApp: 070 616 1617`,

            2: `👋 Hi! 

අපි ඔයාලගේ ad එක දැක්කා. ඔයාලට TinTinAds.com එකෙත් ඔයාලගේ ad එක නොමිලේම (FREE) VIP Highlight එකක් දාලා පළ කරගන්න කැමතිද? ✨

ලංකාවේ විශාල පිරිසක් දැන් TinTinAds එකෙන් Calls සහ WhatsApp Messages ලබාගන්නවා. 

කැමති නම් විස්තර මෙහෙට එවන්න, අපි දාලා Link එක එවන්නම්! 👍
🌐 https://tintinads.com`,

            3: `🔥 ඔබගේ දැන්වීමෙන් වැඩිම Calls ලබාගන්න - TinTinAds.com!

⭐ අපගේ විශේෂ රු. 1,500/= Platinum පැකේජය:
- දින 30ක් පුරා ඔබේ දැන්වීම සයිට් එකේ ඉහළින්ම (Top List).
- ලංකාවේ එකම සිංහල Voice Note (හඬ පට) පහසුකම.
- දින 30 පුරා අඛණ්ඩව Call & Leads ලබාගැනීමේ හැකියාව!

දැන්වීම් පළ කර ගැනීමට අප අමතන්න:
💬 WhatsApp: 070 616 1617
🌐 https://tintinads.com`
        };

        let contactedMap = JSON.parse(localStorage.getItem('lkads_contacted_ads') || '{}');

        function toggleContacted(num) {
            contactedMap[num] = !contactedMap[num];
            localStorage.setItem('lkads_contacted_ads', JSON.stringify(contactedMap));
            updateMetrics();
            renderTable();
        }

        function setTemplate(idx) {
            document.getElementById('message-template').value = templates[idx];
            for (let i = 1; i <= 3; i++) {
                const btn = document.getElementById(`btn-tpl-${i}`);
                if (i === idx) {
                    btn.className = "px-3 py-1.5 rounded-lg text-xs font-bold bg-blue-500 text-white border border-blue-400";
                } else {
                    btn.className = "px-3 py-1.5 rounded-lg text-xs font-semibold bg-gray-800 text-gray-300 hover:bg-gray-700 border border-gray-700";
                }
            }
            updateAllWhatsAppLinks();
        }

        function getMessageForAd(ad) {
            const tpl = document.getElementById('message-template').value;
            return tpl
                .replace(/{title}/g, ad.title)
                .replace(/{location}/g, ad.location)
                .replace(/{price}/g, ad.price)
                .replace(/{category}/g, ad.category);
        }

        function updateAllWhatsAppLinks() {
            renderTable();
        }

        function updateMetrics() {
            const total = allAds.length;
            const brandNewCount = allAds.filter(a => a.is_new).length;
            const contactedCount = Object.values(contactedMap).filter(Boolean).length;
            const pendingCount = total - contactedCount;
            document.getElementById('stat-total').innerText = total;
            document.getElementById('stat-brand-new').innerText = brandNewCount;
            document.getElementById('stat-contacted').innerText = contactedCount;
            document.getElementById('stat-pending').innerText = pendingCount;
        }

        let filteredAds = [...allAds];

        function filterAds() {
            const q = document.getElementById('search-input').value.toLowerCase().trim();
            const cat = document.getElementById('filter-category').value;
            const leadType = document.getElementById('filter-lead-type').value;
            const stat = document.getElementById('filter-status').value;

            filteredAds = allAds.filter(a => {
                const matchesQ = !q || a.title.toLowerCase().includes(q) || a.phone.includes(q) || a.whatsapp.includes(q) || a.location.toLowerCase().includes(q) || String(a.num).includes(q);
                const matchesCat = !cat || a.category === cat;
                const matchesLeadType = !leadType || (leadType === 'brand_new' ? a.is_new : true);
                const isContacted = !!contactedMap[a.num];
                const matchesStat = !stat || (stat === 'contacted' ? isContacted : !isContacted);
                return matchesQ && matchesCat && matchesLeadType && matchesStat;
            });

            renderTable();
        }

        function resetFilters() {
            document.getElementById('search-input').value = '';
            document.getElementById('filter-category').value = '';
            document.getElementById('filter-lead-type').value = '';
            document.getElementById('filter-status').value = '';
            filterAds();
        }

        function renderTable() {
            const tbody = document.getElementById('ads-tbody');
            tbody.innerHTML = '';

            filteredAds.forEach(a => {
                const isContacted = !!contactedMap[a.num];
                const msg = getMessageForAd(a);
                const waLink = `https://wa.me/${a.wa_intl}?text=${encodeURIComponent(msg)}`;

                const tr = document.createElement('tr');
                tr.className = `hover:bg-gray-800/60 transition ${isContacted ? 'bg-blue-950/20' : ''}`;

                tr.innerHTML = `
                    <td class="p-3 text-center font-bold text-blue-400">
                        #${a.num}
                    </td>
                    <td class="p-3 text-center">
                        <button onclick="toggleContacted(${a.num})" class="inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold border transition ${isContacted ? 'bg-green-500/20 text-green-400 border-green-500/40' : 'bg-gray-800 text-gray-400 border-gray-700 hover:border-blue-500'}">
                            <i class="fa-solid ${isContacted ? 'fa-check-circle' : 'fa-circle'}"></i>
                            <span>${isContacted ? 'යැව්වා' : 'Pending'}</span>
                        </button>
                    </td>
                    <td class="p-3">
                        <div class="font-bold text-white max-w-xs truncate" title="${a.title}">
                            ${a.title}
                        </div>
                        <div class="flex items-center space-x-2 mt-1">
                            ${a.is_new ? '<span class="bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 px-1.5 py-0.2 rounded text-[10px] font-black uppercase">NEW LEAD</span>' : ''}
                            <span class="bg-gray-800 text-gray-300 px-1.5 py-0.5 rounded text-[10px] font-semibold">${a.category}</span>
                            <span class="text-yellow-400 font-bold text-[11px]">රු. ${Number(a.price).toLocaleString()}</span>
                        </div>
                    </td>
                    <td class="p-3 text-gray-300 whitespace-nowrap">
                        <i class="fa-solid fa-location-dot text-red-400 mr-1 text-[10px]"></i>
                        ${a.location}
                    </td>
                    <td class="p-3 whitespace-nowrap">
                        <div class="flex items-center space-x-1.5">
                            <a href="tel:${a.phone}" class="font-mono text-blue-400 hover:text-blue-300 font-semibold">
                                <i class="fa-solid fa-phone text-[10px] mr-1"></i>${a.phone}
                            </a>
                            <button onclick="copyText('${a.phone}')" class="text-gray-500 hover:text-blue-400 p-1" title="Copy Number">
                                <i class="fa-regular fa-copy text-[11px]"></i>
                            </button>
                        </div>
                    </td>
                    <td class="p-3 whitespace-nowrap">
                        <div class="flex items-center space-x-1.5">
                            <a href="https://wa.me/${a.wa_intl}" target="_blank" class="font-mono text-green-400 hover:text-green-300 font-semibold">
                                <i class="fa-brands fa-whatsapp text-[11px] mr-1"></i>${a.whatsapp}
                            </a>
                            <button onclick="copyText('${a.whatsapp}')" class="text-gray-500 hover:text-green-400 p-1" title="Copy WhatsApp">
                                <i class="fa-regular fa-copy text-[11px]"></i>
                            </button>
                        </div>
                    </td>
                    <td class="p-3 text-center whitespace-nowrap">
                        <a href="${a.url}" target="_blank" class="inline-flex items-center space-x-1 bg-gray-800 hover:bg-gray-700 text-gray-400 hover:text-white px-2 py-1 rounded text-[11px] transition">
                            <span>LK Ad ↗</span>
                        </a>
                    </td>
                    <td class="p-3 text-center whitespace-nowrap">
                        <a href="${waLink}" target="_blank" onclick="markAsContacted(${a.num})" class="inline-flex items-center space-x-1.5 bg-green-600 hover:bg-green-500 text-white px-3 py-1.5 rounded-lg text-xs font-bold shadow transition">
                            <i class="fa-brands fa-whatsapp text-sm"></i>
                            <span>Message යවන්න</span>
                        </a>
                    </td>
                `;

                tbody.appendChild(tr);
            });

            document.getElementById('footer-count').innerText = `පෙන්වන්නේ දැන්වීම් ${allAds.length}න් ${filteredAds.length}යි`;
        }

        function markAsContacted(num) {
            contactedMap[num] = true;
            localStorage.setItem('lkads_contacted_ads', JSON.stringify(contactedMap));
            updateMetrics();
            setTimeout(renderTable, 500);
        }

        function copyText(txt) {
            navigator.clipboard.writeText(txt).then(() => {
                showToast(`Copied: ${txt}`);
            });
        }

        function copyAllWhatsAppComma() {
            const list = allAds.map(a => a.whatsapp).filter(Boolean);
            const unique = [...new Set(list)];
            navigator.clipboard.writeText(unique.join(', ')).then(() => {
                showToast(`WhatsApp අංක ${unique.length}ම Comma-separated පිටපත් විය!`);
            });
        }

        function copyAllWhatsAppLines() {
            const list = allAds.map(a => a.whatsapp).filter(Boolean);
            const unique = [...new Set(list)];
            navigator.clipboard.writeText(unique.join('\\n')).then(() => {
                showToast(`WhatsApp අංක ${unique.length}ම පේළි වශයෙන් පිටපත් විය!`);
            });
        }

        function copyAllNormalPhones() {
            const list = allAds.map(a => a.phone).filter(Boolean);
            const unique = [...new Set(list)];
            navigator.clipboard.writeText(unique.join('\\n')).then(() => {
                showToast(`සාමාන්‍ය Phone අංක ${unique.length}ම පිටපත් විය!`);
            });
        }

        function showToast(msg) {
            const toast = document.getElementById('toast');
            document.getElementById('toast-text').innerText = msg;
            toast.classList.remove('translate-y-20', 'opacity-0');
            setTimeout(() => {
                toast.classList.add('translate-y-20', 'opacity-0');
            }, 3000);
        }

        setTemplate(1);
        updateMetrics();
        renderTable();
    </script>
</body>
</html>
"""

final_html = html_template.replace('__LKADS_JSON__', ads_json_str)

with open('public/lkads_connect.html', 'w', encoding='utf-8') as f:
    f.write(final_html)

print("Generated public/lkads_connect.html successfully!")
