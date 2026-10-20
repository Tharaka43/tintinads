import json
import csv
import re
import os
import sys

sys.stdout.reconfigure(encoding='utf-8')

# 1. Load Ads & Mapping
with open('all_120_ads.json', 'r', encoding='utf-8') as f:
    ads = json.load(f)

with open('ad_id_mapping.json', 'r', encoding='utf-8') as f:
    id_mapping = json.load(f)

enriched_ads = []
for a in ads:
    num = a['num']
    live_id = id_mapping.get(str(num), id_mapping.get(num, num + 61))
    
    # Phone numbers cleaning
    raw_phone = a.get('phone', '').strip()
    raw_wa = a.get('whatsapp', '').strip() or raw_phone
    
    clean_phone_digits = re.sub(r'[^0-9]', '', raw_phone)
    if clean_phone_digits.startswith('94') and len(clean_phone_digits) == 11:
        normal_phone = '0' + clean_phone_digits[2:]
    elif len(clean_phone_digits) == 10 and clean_phone_digits.startswith('0'):
        normal_phone = clean_phone_digits
    else:
        normal_phone = raw_phone
        
    clean_wa_digits = re.sub(r'[^0-9]', '', raw_wa)
    if clean_wa_digits.startswith('0') and len(clean_wa_digits) == 10:
        wa_international = '94' + clean_wa_digits[1:]
        wa_display = clean_wa_digits
    elif clean_wa_digits.startswith('94') and len(clean_wa_digits) == 11:
        wa_international = clean_wa_digits
        wa_display = '0' + clean_wa_digits[2:]
    else:
        wa_international = '94' + clean_wa_digits[-9:] if len(clean_wa_digits) >= 9 else clean_wa_digits
        wa_display = raw_wa
        
    ad_url = f"https://tintinads.com/ad/{live_id}"
    
    # Clean single quotes and newlines in title for JS safety
    clean_title = a.get('title', '').replace('\n', ' ').replace('\r', ' ').strip()
    
    # VIP duration in days (VIP default = 3 days)
    enriched_ads.append({
        'num': num,
        'id': live_id,
        'code': a.get('code', f"AD-B{num}"),
        'title': clean_title,
        'category': a.get('category_name', 'General'),
        'listing_tier': 'VIP (රු. 700)',
        'tier_days': 3,
        'location': a.get('location', 'Colombo'),
        'price': a.get('price', 5000),
        'phone': normal_phone,
        'whatsapp': wa_display,
        'wa_intl': wa_international,
        'url': ad_url,
        'is_expired': False,
        'post_date': '2026-10-20T12:00:00+05:30'
    })

print(f"Enriched {len(enriched_ads)} ads.")

# 2. Generate VCF
vcf_lines = []
for a in enriched_ads:
    vcf_lines.append("BEGIN:VCARD")
    vcf_lines.append("VERSION:3.0")
    clean_name = re.sub(r'[^\w\s\u0D80-\u0DFF]', '', a['title'])[:30].strip() or a['category']
    vcf_lines.append(f"FN:TinTin VIP #{a['num']:02d} - {clean_name}")
    vcf_lines.append(f"N:{clean_name};TinTin VIP #{a['num']:02d};;;")
    vcf_lines.append(f"TEL;TYPE=CELL,VOICE:{a['phone']}")
    if a['whatsapp'] != a['phone']:
        vcf_lines.append(f"TEL;TYPE=WORK,VOICE:{a['whatsapp']}")
    vcf_lines.append(f"URL:{a['url']}")
    vcf_lines.append(f"NOTE:TinTinAds VIP Ad #{a['id']} | Cat: {a['category']} | Loc: {a['location']} | Price: Rs. {a['price']}")
    vcf_lines.append("END:VCARD")
    vcf_lines.append("")

with open('public/tintin_advertisers.vcf', 'w', encoding='utf-8') as f:
    f.write('\n'.join(vcf_lines))
print("Generated public/tintin_advertisers.vcf")

# 3. Generate CSV
with open('public/tintin_advertisers.csv', 'w', newline='', encoding='utf-8-sig') as f:
    writer = csv.writer(f)
    writer.writerow(['#', 'Ad ID', 'Title', 'Category', 'Location', 'Price (Rs.)', 'Calling Phone', 'WhatsApp Number', 'Live Ad URL'])
    for a in enriched_ads:
        writer.writerow([a['num'], a['id'], a['title'], a['category'], a['location'], a['price'], a['phone'], a['whatsapp'], a['url']])
print("Generated public/tintin_advertisers.csv")

# 4. Generate Interactive Panel HTML (tintin_connect.html)
ads_json_escaped = json.dumps(enriched_ads, ensure_ascii=False)

html_template = """<!DOCTYPE html>
<html lang="si">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>TinTinAds VIP Advertisers Connect & Auto-Renewal Hub</title>
    <link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=Noto+Sans+Sinhala:wght@400;500;600;700&display=swap');
        body {
            font-family: 'Inter', 'Noto Sans Sinhala', sans-serif;
            background-color: #0b0f19;
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
        .badge-vip {
            background: linear-gradient(135deg, #d97706 0%, #fbbf24 100%);
            color: #000;
        }
        .badge-platinum {
            background: linear-gradient(135deg, #8b5cf6 0%, #d946ef 100%);
            color: #fff;
        }
        .pulse-badge {
            animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }
        @keyframes pulse {
            0%, 100% { opacity: 1; }
            50% { opacity: .5; }
        }
    </style>
</head>
<body class="p-3 md:p-8 min-h-screen">
    <div class="max-w-7xl mx-auto space-y-6">

        <!-- Top Header Navigation -->
        <div class="flex flex-col md:flex-row justify-between items-start md:items-center bg-gray-900 border border-gray-800 p-5 rounded-2xl shadow-xl gap-4">
            <div>
                <div class="flex items-center space-x-3">
                    <span class="text-3xl">🚀</span>
                    <div>
                        <h1 class="text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-yellow-200 to-amber-500">
                            TinTinAds VIP Outreach & Auto-Renewal Hub
                        </h1>
                        <p class="text-xs md:text-sm text-gray-400 mt-1">
                            දැන්වීම් 1, 2, 3 යවන ක්‍රමවේදය | කල් ඉකුත් වූ (Expired) දැන්වීම් හඳුනාගැනීම සහ ස්වයංක්‍රීය WhatsApp Renewal පද්ධතිය
                        </p>
                    </div>
                </div>
            </div>
            <div class="flex flex-wrap gap-2">
                <a href="/hela_connect.html" class="inline-flex items-center space-x-2 bg-gray-800 hover:bg-gray-700 text-yellow-400 px-3.5 py-2 rounded-xl border border-yellow-500/30 font-semibold text-xs transition">
                    <i class="fa-solid fa-users"></i>
                    <span>තරඟකාරී Contacts</span>
                </a>
                <a href="/" target="_blank" class="inline-flex items-center space-x-2 bg-yellow-500 hover:bg-yellow-400 text-black px-4 py-2 rounded-xl font-bold text-xs shadow-lg transition">
                    <i class="fa-solid fa-globe"></i>
                    <span>TinTinAds.com මුල් පිටුව</span>
                </a>
            </div>
        </div>

        <!-- Metric Cards -->
        <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
            <div class="bg-gray-900 border border-gray-800 p-3.5 rounded-xl">
                <p class="text-[11px] text-gray-400 uppercase tracking-wider font-semibold">සම්පූර්ණ දැන්වීම්</p>
                <p class="text-xl font-black text-yellow-400 mt-1" id="stat-total">0</p>
            </div>
            <div class="bg-gray-900 border border-gray-800 p-3.5 rounded-xl">
                <p class="text-[11px] text-green-400 uppercase tracking-wider font-semibold">🟢 Active දැන්වීම්</p>
                <p class="text-xl font-black text-green-400 mt-1" id="stat-active">0</p>
            </div>
            <div class="bg-gray-900 border border-red-900/40 p-3.5 rounded-xl bg-red-950/20">
                <p class="text-[11px] text-red-400 uppercase tracking-wider font-semibold">⏰ Expired (කල් ඉකුත්)</p>
                <p class="text-xl font-black text-red-400 mt-1" id="stat-expired">0</p>
            </div>
            <div class="bg-gray-900 border border-gray-800 p-3.5 rounded-xl">
                <p class="text-[11px] text-amber-400 uppercase tracking-wider font-semibold">Message 1 යැවූ</p>
                <p class="text-xl font-black text-amber-400 mt-1" id="stat-msg1">0</p>
            </div>
            <div class="bg-gray-900 border border-gray-800 p-3.5 rounded-xl">
                <p class="text-[11px] text-blue-400 uppercase tracking-wider font-semibold">Message 2 යැවූ</p>
                <p class="text-xl font-black text-blue-400 mt-1" id="stat-msg2">0</p>
            </div>
            <div class="bg-gray-900 border border-purple-900/40 p-3.5 rounded-xl bg-purple-950/20">
                <p class="text-[11px] text-purple-400 uppercase tracking-wider font-semibold">💎 Renewal (Msg 3)</p>
                <p class="text-xl font-black text-purple-400 mt-1" id="stat-msg3">0</p>
            </div>
        </div>

        <!-- Auto-Sender Engine Controller Card -->
        <div class="bg-gradient-to-r from-gray-900 via-gray-850 to-gray-900 border-2 border-yellow-500/40 p-5 rounded-2xl shadow-2xl space-y-4">
            <div class="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
                <div>
                    <div class="flex items-center space-x-2">
                        <span class="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-yellow-500 text-black font-extrabold text-sm">
                            <i class="fa-solid fa-robot"></i>
                        </span>
                        <h3 class="text-lg font-extrabold text-white">
                            🤖 Smart WhatsApp Auto-Sender & Renewal Runner
                        </h3>
                    </div>
                    <p class="text-xs text-gray-300 mt-1">
                        කල් ඉකුත් වූ දැන්වීම් සඳහා Message 3 (Renewal) හෝ අලුත් දැන්වීම් සඳහා Message 1/2 ස්වයංක්‍රීයව వరుසින් යැවීමේ පහසුකම
                    </p>
                </div>

                <!-- Auto-Send Controls -->
                <div class="flex flex-wrap items-center gap-3">
                    <div>
                        <label class="block text-[10px] text-gray-400 uppercase font-bold mb-1">යවන Message එක:</label>
                        <select id="auto-msg-choice" class="bg-gray-950 border border-yellow-500/50 text-yellow-300 text-xs rounded-xl px-3 py-2 font-bold focus:outline-none">
                            <option value="3" selected>⏰ Message 3: Expired Renewal (රු. 1500 Pitch)</option>
                            <option value="1">⭐ Message 1: Welcome & Free VIP Link</option>
                            <option value="2">💬 Message 2: Quality Review & Details Check</option>
                        </select>
                    </div>

                    <div>
                        <label class="block text-[10px] text-gray-400 uppercase font-bold mb-1">Delay (ආරක්ෂිත කාල පරතරය):</label>
                        <select id="auto-delay-choice" class="bg-gray-950 border border-gray-700 text-gray-200 text-xs rounded-xl px-3 py-2 focus:outline-none">
                            <option value="5000">තත්පර 5 (වේගවත්)</option>
                            <option value="8000" selected>තත්පර 8 (නිර්දේශිත)</option>
                            <option value="12000">තත්පර 12 (උපරිම ආරක්ෂිත)</option>
                        </select>
                    </div>

                    <div class="pt-4 flex gap-2">
                        <button id="btn-start-auto" onclick="startAutoSender()" class="inline-flex items-center space-x-2 bg-gradient-to-r from-green-600 to-emerald-500 hover:from-green-500 hover:to-emerald-400 text-white px-5 py-2.5 rounded-xl font-bold text-xs shadow-lg transition transform active:scale-95">
                            <i class="fa-solid fa-play"></i>
                            <span>ස්වයංක්‍රීයව යැවීම අරඹන්න</span>
                        </button>
                        <button id="btn-stop-auto" onclick="stopAutoSender()" disabled class="inline-flex items-center space-x-1.5 bg-gray-800 text-gray-500 px-4 py-2.5 rounded-xl font-bold text-xs transition cursor-not-allowed">
                            <i class="fa-solid fa-stop"></i>
                            <span>නවත්වන්න</span>
                        </button>
                    </div>
                </div>
            </div>

            <!-- Auto-Send Live Progress Bar -->
            <div id="auto-progress-container" class="hidden bg-gray-950/80 border border-gray-800 rounded-xl p-4 space-y-2">
                <div class="flex justify-between items-center text-xs">
                    <span id="auto-progress-status" class="text-yellow-400 font-bold flex items-center gap-2">
                        <i class="fa-solid fa-spinner fa-spin"></i>
                        <span>ක්‍රියාත්මක වෙමින් පවතී...</span>
                    </span>
                    <span id="auto-progress-counter" class="text-gray-300 font-mono">0 / 0 Completed</span>
                </div>
                <div class="w-full bg-gray-800 rounded-full h-3 overflow-hidden">
                    <div id="auto-progress-bar" class="bg-gradient-to-r from-yellow-500 via-amber-400 to-green-500 h-3 rounded-full transition-all duration-300" style="width: 0%"></div>
                </div>
                <p id="auto-progress-log" class="text-[11px] text-gray-400 font-mono truncate">Ready.</p>
            </div>
        </div>

        <!-- WhatsApp Outreach Message Templates & Customizer -->
        <div class="bg-gray-900 border border-gray-800 p-5 rounded-2xl shadow-xl space-y-4">
            <div class="flex flex-col md:flex-row justify-between items-start md:items-center gap-3">
                <div>
                    <h3 class="text-base font-bold text-white flex items-center gap-2">
                        <i class="fa-brands fa-whatsapp text-green-400 text-lg"></i>
                        <span>WhatsApp Message Templates (3-Stage Lifecycle)</span>
                    </h3>
                    <p class="text-xs text-gray-400 mt-0.5">පණිවිඩය තෝරන්න හෝ මෙහි වෙනස් කරන්න (සෑම ad එකකටම එහි සැබෑ URL සහ විස්තර ස්වයංක්‍රීයව replace වේ)</p>
                </div>
                <div class="flex flex-wrap gap-2" id="template-buttons">
                    <button onclick="setTemplate(1)" id="btn-tpl-1" class="px-3 py-1.5 rounded-lg text-xs font-semibold bg-gray-800 text-gray-300 hover:bg-gray-700 border border-gray-700">
                        1. Welcome & VIP Link
                    </button>
                    <button onclick="setTemplate(2)" id="btn-tpl-2" class="px-3 py-1.5 rounded-lg text-xs font-semibold bg-gray-800 text-gray-300 hover:bg-gray-700 border border-gray-700">
                        2. Review & Details Check
                    </button>
                    <button onclick="setTemplate(3)" id="btn-tpl-3" class="px-3 py-1.5 rounded-lg text-xs font-bold bg-yellow-500 text-black border border-yellow-400">
                        ⏰ 3. Expired Ad Renewal & රු. 1500 Pitch (Recommended)
                    </button>
                </div>
            </div>

            <!-- Message Preview & Edit Textarea -->
            <div class="relative">
                <label class="block text-xs font-semibold text-gray-400 mb-1">
                    යවන පණිවිඩයේ Preview එක (වෙනස් කරගත හැක - <span class="text-yellow-400">{adUrl}</span>, <span class="text-yellow-400">{title}</span>, <span class="text-yellow-400">{location}</span>, <span class="text-yellow-400">{price}</span> auto-replace වේ):
                </label>
                <textarea id="message-template" rows="8" class="w-full bg-gray-950 border border-gray-700 rounded-xl p-4 text-xs font-mono text-gray-200 focus:outline-none focus:border-yellow-500 leading-relaxed custom-scrollbar" oninput="updateAllWhatsAppLinks()"></textarea>
            </div>
        </div>

        <!-- Quick Filter Category Tabs -->
        <div class="bg-gray-900 border border-gray-800 p-4 rounded-2xl shadow-xl space-y-3">
            <div class="flex items-center justify-between">
                <span class="text-xs font-bold text-gray-300 flex items-center gap-2">
                    <i class="fa-solid fa-filter text-yellow-400"></i>
                    <span>ක්ෂණිකව වෙන් කර බැලීම (Quick Filters):</span>
                </span>
                <span class="text-[11px] text-gray-400">එක් ක්ලික් එකකින් යැවූ සහ නොයැවූ පිරිස වෙන වෙනම බලන්න</span>
            </div>
            <div class="flex flex-wrap gap-2" id="quick-filter-buttons">
                <button onclick="setQuickFilter('all')" id="qf-all" class="px-3.5 py-2 rounded-xl text-xs font-extrabold bg-yellow-500 text-black shadow transition">
                    📋 සියල්ල (<span id="qf-all-count">0</span>)
                </button>
                <button onclick="setQuickFilter('msg1_pending')" id="qf-msg1_pending" class="px-3.5 py-2 rounded-xl text-xs font-bold bg-gray-800 text-amber-300 hover:bg-gray-750 border border-amber-500/40 transition">
                    ⏳ 1. Msg 1 නොයැවූ (<span id="qf-m1p-count">0</span>)
                </button>
                <button onclick="setQuickFilter('msg2_pending')" id="qf-msg2_pending" class="px-3.5 py-2 rounded-xl text-xs font-bold bg-gray-800 text-blue-300 hover:bg-gray-750 border border-blue-500/40 transition">
                    ⏳ 2. Msg 2 නොයැවූ (<span id="qf-m2p-count">0</span>)
                </button>
                <button onclick="setQuickFilter('expired')" id="qf-expired" class="px-3.5 py-2 rounded-xl text-xs font-black bg-red-950/70 text-red-300 hover:bg-red-900/80 border border-red-500/60 pulse-badge transition">
                    ⏰ 3. Expired - Msg 3 යැවිය යුතු (<span id="qf-exp-count">0</span>)
                </button>
                <button onclick="setQuickFilter('active')" id="qf-active" class="px-3.5 py-2 rounded-xl text-xs font-bold bg-gray-800 text-green-300 hover:bg-gray-750 border border-green-500/40 transition">
                    🟢 Active සක්‍රීය (<span id="qf-act-count">0</span>)
                </button>
                <button onclick="setQuickFilter('msg1_sent')" id="qf-msg1_sent" class="px-3.5 py-2 rounded-xl text-xs font-bold bg-gray-800 text-gray-300 hover:bg-gray-750 border border-gray-700 transition">
                    ✅ Msg 1 යැවූ (<span id="qf-m1s-count">0</span>)
                </button>
                <button onclick="setQuickFilter('msg2_sent')" id="qf-msg2_sent" class="px-3.5 py-2 rounded-xl text-xs font-bold bg-gray-800 text-gray-300 hover:bg-gray-750 border border-gray-700 transition">
                    ✅ Msg 2 යැවූ (<span id="qf-m2s-count">0</span>)
                </button>
                <button onclick="setQuickFilter('msg3_sent')" id="qf-msg3_sent" class="px-3.5 py-2 rounded-xl text-xs font-extrabold bg-purple-950/70 text-purple-300 hover:bg-purple-900/80 border border-purple-500/50 transition">
                    💎 Renewal (Msg 3) යැවූ (<span id="qf-m3s-count">0</span>)
                </button>
            </div>
        </div>

        <!-- Search & Filter Controls -->
        <div class="bg-gray-900 border border-gray-800 p-4 rounded-xl flex flex-col md:flex-row gap-3 items-center justify-between">
            <div class="relative w-full md:w-96">
                <i class="fa-solid fa-magnifying-glass absolute left-3 top-3.5 text-gray-500 text-xs"></i>
                <input type="text" id="search-input" placeholder="නම, දුරකථන අංකය, පළාත සොයන්න..." oninput="filterAds()" class="w-full bg-gray-950 border border-gray-800 rounded-lg pl-9 pr-4 py-2.5 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-yellow-500">
            </div>

            <div class="flex flex-wrap gap-2 w-full md:w-auto">
                <select id="filter-lifecycle" onchange="filterAds()" class="bg-gray-950 border border-yellow-500/40 text-yellow-300 font-bold text-xs rounded-lg px-3 py-2.5 focus:outline-none focus:border-yellow-500">
                    <option value="">සියලුම දැන්වීම් (All)</option>
                    <option value="expired">⏰ Expired පමණක් (Message 3 Renewal)</option>
                    <option value="active">🟢 Active පමණක් (සක්‍රීය)</option>
                    <option value="msg1_pending">⏳ Msg 1 නොයැවූ</option>
                    <option value="msg2_pending">⏳ Msg 2 නොයැවූ</option>
                    <option value="msg3_pending">⏳ Msg 3 (Renewal) නොයැවූ</option>
                    <option value="msg3_sent">✅ Msg 3 (Renewal) යැවූ</option>
                </select>

                <select id="filter-category" onchange="filterAds()" class="bg-gray-950 border border-gray-800 text-gray-300 text-xs rounded-lg px-3 py-2.5 focus:outline-none focus:border-yellow-500">
                    <option value="">සියලුම Categories</option>
                    <option value="Girls Personal">Girls Personal</option>
                    <option value="Live Cam">Live Cam</option>
                    <option value="Spa & Wellness Services">Spa & Wellness</option>
                    <option value="Boys Personal">Boys Personal</option>
                    <option value="Shemale Personal">Shemale Personal</option>
                </select>

                <button onclick="resetFilters()" class="bg-gray-800 hover:bg-gray-700 text-gray-300 text-xs px-3.5 py-2.5 rounded-lg border border-gray-700 font-semibold transition">
                    Reset Filters
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
                            <th class="p-3 text-center w-36">දැන්වීමේ තත්වය</th>
                            <th class="p-3">දැන්වීමේ විස්තරය</th>
                            <th class="p-3">ප්‍රදේශය</th>
                            <th class="p-3 font-semibold text-blue-300">සාමාන්‍ය Phone</th>
                            <th class="p-3 font-semibold text-green-300">WhatsApp</th>
                            <th class="p-3 text-center">සජීවී Link</th>
                            <th class="p-3 text-center w-60">WhatsApp පණිවිඩ අදියර 3 (1-Click)</th>
                        </tr>
                    </thead>
                    <tbody id="ads-tbody" class="divide-y divide-gray-800">
                        <!-- Rendered by JS -->
                    </tbody>
                </table>
            </div>

            <!-- Table Footer -->
            <div class="p-4 bg-gray-850 border-t border-gray-800 flex flex-col sm:flex-row justify-between items-center text-xs text-gray-400 gap-2">
                <span id="footer-count">පෙන්වන්නේ දැන්වීම් 0න් 0යි</span>
                <span class="text-yellow-400 font-semibold flex items-center gap-1.5">
                    <i class="fa-solid fa-crown text-yellow-400"></i>
                    <span>TinTinAds.com Official VIP Outreach & Auto-Renewal System</span>
                </span>
            </div>
        </div>

    </div>

    <!-- Notification Toast -->
    <div id="toast" class="fixed bottom-6 right-6 bg-yellow-500 text-black font-bold px-4 py-3 rounded-xl shadow-2xl transform translate-y-20 opacity-0 transition duration-300 flex items-center gap-2 text-xs z-50">
        <i class="fa-solid fa-circle-check text-base"></i>
        <span id="toast-text">Success!</span>
    </div>

    <script>
        let allAds = __ADS_JSON__;
        let selectedTemplateIdx = 3;

        // Predefined Message Templates
        const templates = {
            1: `👋 ආයුබෝවන්! 

අපි ඔබගේ දැන්වීම දැක, එය ශ්‍රී ලංකාවේ වේගයෙන්ම ජනප්‍රිය වන TinTinAds.com වෙබ් අඩවියේ අපගේ රු. 700 VIP Golden Package එක යටතේ කිසිදු මුදලක් අය නොකර නොමිලේම (FREE) පළ කළෙමු! 🌟🎉

🔗 ඔබගේ සජීවී දැන්වීම මෙතැනින් පරීක්ෂා කරන්න:
👉 {adUrl}

📝 එහි දුරකථන අංක, නගරය හෝ විස්තරවල කිසියම් අඩුපාඩුවක් ඇත්නම් කරුණාකර අපට මෙහි Reply කරන්න. අපි එය නොමිලේම නිවැරදි කර දෙන්නෙමු. 🤝

━━━━━━━━━━━━━━━━━━━━━━
💡 ඇයි ඔබ ඉදිරියටත් TinTinAds.com තෝරාගත යුත්තේ?
1️⃣ 🎙️ ලංකාවේ ප්‍රථම වතාවට සිංහල Voice Note (හඬ පට) සහිත දැන්වීම් - පාරිභෝගික විශ්වාසය 100%කින් ඉහළ නංවයි.
2️⃣ 🌟 VIP Golden Highlight & Top Rank - ඔබේ දැන්වීම සයිට් එකේ උඩින්ම කැපී පෙනෙන රන්වන් රාමුවක් සහිතව දිස්වේ.
3️⃣ 📲 Direct Call & WhatsApp - පාරිභෝගිකයින්ට එක ක්ලික් එකකින් කෙළින්ම ඔබ හා සම්බන්ධ විය හැක.

ස්තූතියි!
TinTinAds.com
💬 WhatsApp: 070 616 1617`,

            2: `👋 ආයුබෝවන්!

ඔබගේ ව්‍යාපාරික දැන්වීම අප විසින් TinTinAds.com හි රු. 700ක VIP පැකේජය යටතේ ඔබට නොමිලේම (FREE) පළ කර දුන්නෙමු! ✨🎉

🔗 ඔබගේ සජීවී දැන්වීම මෙතැනින් බලන්න:
👉 {adUrl}

මෙහි සඳහන් දුරකථන අංක, මිල ගණන් හෝ තොරතුරුවල කිසියම් අඩුපාඩුවක් හෝ වෙනස් විය යුතු දෙයක් ඇත්නම් අපට මෙහි Reply කරන්න. අපි එය නොමිලේම සකස් කර දෙන්නෙමු.

ස්තූතියි!
TinTinAds.com
💬 WhatsApp: 070 616 1617`,

            3: `⏰ ආයුබෝවන්! ඔබ TinTinAds.com හි නොමිලේ පළ කළ VIP දැන්වීම අද දින කල් ඉකුත් වී ඇත (Expired).

🔗 ඔබගේ දැන්වීම:
👉 {adUrl}
📌 මාතෘකාව: {title}
📍 ප්‍රදේශය: {location}

━━━━━━━━━━━━━━━━━━━━━━
🔥 ඔබේ දැන්වීම නැවත සක්‍රීය කර ඉහළම ප්‍රතිචාර ලබාගන්න!

අපගේ විශේෂ රු. 1,500/= Platinum පැකේජය:
⭐ දින 30ක් පුරා ඔබේ දැන්වීම සයිට් එකේ ඉහළින්ම (Top 1) ප්‍රදර්ශනය වේ.
⭐ VIP Golden Highlight Frame & Verified Badge.
⭐ දිනපතා සයිට් එකට පැමිණෙන දහස් ගණනක් සැබෑ ගැණුම්කරුවන්ගෙන් උපරිම Calls & WhatsApp පණිවිඩ!

දැන්ම ඔබේ දැන්වීම Renewal කර ගැනීමට අපට WhatsApp පණිවිඩයක් එවන්න:
💬 WhatsApp: 070 616 1617 (ශානිකා)
🌐 https://tintinads.com`
        };

        // Local Storage Tracking Fallback
        let outreachTracker = JSON.parse(localStorage.getItem('tintin_outreach_tracker') || '{}');

        // Fetch Live Data from Backend API if available
        async function fetchLiveOutreachData() {
            try {
                const res = await fetch('/api/outreach/data');
                if (res.ok) {
                    const data = await res.json();
                    if (data.ads && data.ads.length > 0) {
                        allAds = data.ads.map((a, idx) => ({
                            num: idx + 1,
                            id: a.id,
                            code: a.code,
                            title: a.title,
                            category: a.category,
                            location: a.location,
                            price: a.price,
                            phone: a.phone,
                            whatsapp: a.whatsapp,
                            wa_intl: a.wa_intl,
                            url: a.url,
                            is_expired: a.is_expired,
                            seconds_remaining: a.seconds_remaining,
                            post_date: a.post_date,
                            expire_date: a.expire_date,
                            msg1_sent: a.msg1_sent,
                            msg2_sent: a.msg2_sent,
                            msg3_sent: a.msg3_sent,
                        }));
                    }
                }
            } catch (e) {
                console.log('Using local embedded data fallback:', e);
            }
            updateMetrics();
            filterAds();
        }

        async function markMsgSent(adId, msgType, isSent) {
            if (!outreachTracker[adId]) outreachTracker[adId] = {};
            outreachTracker[adId]['msg' + msgType] = isSent ? new Date().toISOString() : null;
            localStorage.setItem('tintin_outreach_tracker', JSON.stringify(outreachTracker));

            // Also notify backend API
            try {
                await fetch('/api/outreach/mark', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ ad_id: adId, msg_type: String(msgType), sent: isSent })
                });
            } catch (err) {}

            const ad = allAds.find(x => x.id === adId);
            if (ad) ad['msg' + msgType + '_sent'] = isSent;

            updateMetrics();
            renderTable();
        }

        function setTemplate(idx) {
            selectedTemplateIdx = idx;
            document.getElementById('message-template').value = templates[idx];
            for (let i = 1; i <= 3; i++) {
                const btn = document.getElementById(`btn-tpl-${i}`);
                if (i === idx) {
                    btn.className = "px-3 py-1.5 rounded-lg text-xs font-bold bg-yellow-500 text-black border border-yellow-400";
                } else {
                    btn.className = "px-3 py-1.5 rounded-lg text-xs font-semibold bg-gray-800 text-gray-300 hover:bg-gray-700 border border-gray-700";
                }
            }
        }

        function getMessageText(type, ad) {
            const rawTpl = templates[type] || document.getElementById('message-template').value;
            return rawTpl
                .replace(/{adUrl}/g, ad.url)
                .replace(/{title}/g, ad.title)
                .replace(/{location}/g, ad.location)
                .replace(/{price}/g, Number(ad.price).toLocaleString())
                .replace(/{category}/g, ad.category);
        }

        function updateMetrics() {
            const total = allAds.length;
            const expired = allAds.filter(a => a.is_expired).length;
            const active = total - expired;

            const m1 = allAds.filter(a => a.msg1_sent || (outreachTracker[a.id] && outreachTracker[a.id].msg1)).length;
            const m2 = allAds.filter(a => a.msg2_sent || (outreachTracker[a.id] && outreachTracker[a.id].msg2)).length;
            const m3 = allAds.filter(a => a.msg3_sent || (outreachTracker[a.id] && outreachTracker[a.id].msg3)).length;

            const m1p = allAds.filter(a => !(a.msg1_sent || (outreachTracker[a.id] && outreachTracker[a.id].msg1))).length;
            const m2p = allAds.filter(a => !(a.msg2_sent || (outreachTracker[a.id] && outreachTracker[a.id].msg2))).length;

            document.getElementById('stat-total').innerText = total;
            document.getElementById('stat-active').innerText = active;
            document.getElementById('stat-expired').innerText = expired;
            document.getElementById('stat-msg1').innerText = m1;
            document.getElementById('stat-msg2').innerText = m2;
            document.getElementById('stat-msg3').innerText = m3;

            // Quick Filter Pills Counts
            if (document.getElementById('qf-all-count')) document.getElementById('qf-all-count').innerText = total;
            if (document.getElementById('qf-m1p-count')) document.getElementById('qf-m1p-count').innerText = m1p;
            if (document.getElementById('qf-m2p-count')) document.getElementById('qf-m2p-count').innerText = m2p;
            if (document.getElementById('qf-exp-count')) document.getElementById('qf-exp-count').innerText = expired;
            if (document.getElementById('qf-act-count')) document.getElementById('qf-act-count').innerText = active;
            if (document.getElementById('qf-m1s-count')) document.getElementById('qf-m1s-count').innerText = m1;
            if (document.getElementById('qf-m2s-count')) document.getElementById('qf-m2s-count').innerText = m2;
            if (document.getElementById('qf-m3s-count')) document.getElementById('qf-m3s-count').innerText = m3;
        }

        let currentQuickFilter = 'all';

        function setQuickFilter(type) {
            currentQuickFilter = type;
            const lifecycleSelect = document.getElementById('filter-lifecycle');
            if (type === 'all') {
                lifecycleSelect.value = '';
            } else {
                lifecycleSelect.value = type;
            }

            // Auto-switch the Auto-Sender message choice & template
            const autoChoice = document.getElementById('auto-msg-choice');
            if (type === 'msg1_pending' || type === 'msg1_sent') {
                autoChoice.value = '1';
                setTemplate(1);
            } else if (type === 'msg2_pending' || type === 'msg2_sent') {
                autoChoice.value = '2';
                setTemplate(2);
            } else if (type === 'expired' || type === 'msg3_sent' || type === 'msg3_pending') {
                autoChoice.value = '3';
                setTemplate(3);
            }

            // Update visual active state on buttons
            const btnKeys = ['all', 'msg1_pending', 'msg2_pending', 'expired', 'active', 'msg1_sent', 'msg2_sent', 'msg3_sent'];
            btnKeys.forEach(k => {
                const el = document.getElementById('qf-' + k);
                if (!el) return;
                if (k === type) {
                    el.className = "px-3.5 py-2 rounded-xl text-xs font-black bg-yellow-500 text-black shadow-lg ring-2 ring-yellow-400 transition transform scale-105";
                } else {
                    if (k === 'msg1_pending') el.className = "px-3.5 py-2 rounded-xl text-xs font-bold bg-gray-800 text-amber-300 hover:bg-gray-750 border border-amber-500/40 transition";
                    else if (k === 'msg2_pending') el.className = "px-3.5 py-2 rounded-xl text-xs font-bold bg-gray-800 text-blue-300 hover:bg-gray-750 border border-blue-500/40 transition";
                    else if (k === 'expired') el.className = "px-3.5 py-2 rounded-xl text-xs font-black bg-red-950/70 text-red-300 hover:bg-red-900/80 border border-red-500/60 pulse-badge transition";
                    else if (k === 'active') el.className = "px-3.5 py-2 rounded-xl text-xs font-bold bg-gray-800 text-green-300 hover:bg-gray-750 border border-green-500/40 transition";
                    else if (k === 'msg3_sent') el.className = "px-3.5 py-2 rounded-xl text-xs font-extrabold bg-purple-950/70 text-purple-300 hover:bg-purple-900/80 border border-purple-500/50 transition";
                    else el.className = "px-3.5 py-2 rounded-xl text-xs font-bold bg-gray-800 text-gray-300 hover:bg-gray-750 border border-gray-700 transition";
                }
            });

            filterAds();
        }


        let filteredAds = [...allAds];

        function filterAds() {
            const q = document.getElementById('search-input').value.toLowerCase().trim();
            const lifecycle = document.getElementById('filter-lifecycle').value;
            const cat = document.getElementById('filter-category').value;

            filteredAds = allAds.filter(a => {
                const m1 = a.msg1_sent || (outreachTracker[a.id] && outreachTracker[a.id].msg1);
                const m2 = a.msg2_sent || (outreachTracker[a.id] && outreachTracker[a.id].msg2);
                const m3 = a.msg3_sent || (outreachTracker[a.id] && outreachTracker[a.id].msg3);

                const matchesQ = !q || a.title.toLowerCase().includes(q) || a.phone.includes(q) || a.whatsapp.includes(q) || a.location.toLowerCase().includes(q) || String(a.id).includes(q) || String(a.num).includes(q);
                const matchesCat = !cat || a.category === cat;

                let matchesLifecycle = true;
                if (lifecycle === 'expired') matchesLifecycle = !!a.is_expired;
                else if (lifecycle === 'active') matchesLifecycle = !a.is_expired;
                else if (lifecycle === 'msg1_pending') matchesLifecycle = !m1;
                else if (lifecycle === 'msg2_pending') matchesLifecycle = !m2;
                else if (lifecycle === 'msg3_pending') matchesLifecycle = !m3 && !!a.is_expired;
                else if (lifecycle === 'msg3_sent') matchesLifecycle = !!m3;

                return matchesQ && matchesCat && matchesLifecycle;
            });

            renderTable();
        }

        function resetFilters() {
            document.getElementById('search-input').value = '';
            document.getElementById('filter-lifecycle').value = '';
            document.getElementById('filter-category').value = '';
            filterAds();
        }

        function renderTable() {
            const tbody = document.getElementById('ads-tbody');
            tbody.innerHTML = '';

            filteredAds.forEach(a => {
                const m1 = a.msg1_sent || (outreachTracker[a.id] && outreachTracker[a.id].msg1);
                const m2 = a.msg2_sent || (outreachTracker[a.id] && outreachTracker[a.id].msg2);
                const m3 = a.msg3_sent || (outreachTracker[a.id] && outreachTracker[a.id].msg3);

                const msg1Url = `https://wa.me/${a.wa_intl}?text=${encodeURIComponent(getMessageText(1, a))}`;
                const msg2Url = `https://wa.me/${a.wa_intl}?text=${encodeURIComponent(getMessageText(2, a))}`;
                const msg3Url = `https://wa.me/${a.wa_intl}?text=${encodeURIComponent(getMessageText(3, a))}`;

                const tr = document.createElement('tr');
                tr.className = `hover:bg-gray-800/60 transition ${a.is_expired ? 'bg-red-950/10' : ''}`;

                tr.innerHTML = `
                    <td class="p-3 text-center font-bold text-yellow-500">
                        #${a.num}
                    </td>
                    <td class="p-3 text-center">
                        ${a.is_expired 
                            ? `<span class="inline-flex items-center space-x-1 px-2.5 py-1 rounded-full text-[10px] font-extrabold bg-red-500/20 text-red-400 border border-red-500/40 pulse-badge">
                                 <i class="fa-solid fa-clock-rotate-left"></i>
                                 <span>කල් ඉකුත් වී ඇත</span>
                               </span>`
                            : `<span class="inline-flex items-center space-x-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-green-500/20 text-green-400 border border-green-500/40">
                                 <i class="fa-solid fa-circle-check"></i>
                                 <span>ක්‍රියාකාරීයි (VIP)</span>
                               </span>`
                        }
                    </td>
                    <td class="p-3">
                        <div class="font-bold text-white max-w-xs truncate" title="${a.title}">
                            ${a.title}
                        </div>
                        <div class="flex items-center space-x-2 mt-1">
                            <span class="badge-vip px-1.5 py-0.5 rounded text-[10px] font-black uppercase">VIP Rs. 700</span>
                            <span class="text-gray-400 text-[11px]">${a.category}</span>
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
                        <a href="${a.url}" target="_blank" class="inline-flex items-center space-x-1 bg-gray-800 hover:bg-gray-700 text-yellow-400 px-2 py-1 rounded-lg border border-yellow-500/30 text-[11px] font-semibold transition">
                            <span>Ad #${a.id}</span>
                            <i class="fa-solid fa-arrow-up-right-from-square text-[9px]"></i>
                        </a>
                    </td>
                    <td class="p-3 text-center whitespace-nowrap">
                        <div class="inline-flex items-center space-x-1.5">
                            <!-- Msg 1 Button -->
                            <a href="${msg1Url}" target="_blank" onclick="markMsgSent(${a.id}, 1, true)" title="Message 1: Welcome & VIP Free Link" class="px-2 py-1 rounded-lg text-[10px] font-bold border transition ${m1 ? 'bg-green-950/60 text-green-400 border-green-600/50' : 'bg-gray-800 text-gray-300 border-gray-700 hover:border-yellow-400'}">
                                <i class="fa-solid ${m1 ? 'fa-check' : 'fa-1'} mr-0.5"></i> Msg 1
                            </a>

                            <!-- Msg 2 Button -->
                            <a href="${msg2Url}" target="_blank" onclick="markMsgSent(${a.id}, 2, true)" title="Message 2: Details Review" class="px-2 py-1 rounded-lg text-[10px] font-bold border transition ${m2 ? 'bg-blue-950/60 text-blue-400 border-blue-600/50' : 'bg-gray-800 text-gray-300 border-gray-700 hover:border-blue-400'}">
                                <i class="fa-solid ${m2 ? 'fa-check' : 'fa-2'} mr-0.5"></i> Msg 2
                            </a>

                            <!-- Msg 3 (Renewal) Button -->
                            <a href="${msg3Url}" target="_blank" onclick="markMsgSent(${a.id}, 3, true)" title="Message 3: Expired Renewal Pitch" class="px-2.5 py-1 rounded-lg text-[10px] font-extrabold shadow transition ${m3 ? 'bg-purple-950/80 text-purple-300 border border-purple-500/60' : (a.is_expired ? 'bg-gradient-to-r from-red-600 to-amber-600 hover:from-red-500 hover:to-amber-500 text-white animate-pulse' : 'bg-gray-800 text-gray-400 border border-gray-700 hover:border-purple-400')}">
                                <i class="fa-solid ${m3 ? 'fa-check-double' : 'fa-clock'} mr-0.5"></i> ${m3 ? 'Renewal යැව්වා' : '⏰ Renewal (Msg 3)'}
                            </a>
                        </div>
                    </td>
                `;

                tbody.appendChild(tr);
            });

            document.getElementById('footer-count').innerText = `පෙන්වන්නේ දැන්වීම් ${allAds.length}න් ${filteredAds.length}යි`;
        }

        // ==========================================
        // AUTO-SENDER QUEUE ENGINE
        // ==========================================
        let autoSenderRunning = false;
        let autoSenderQueue = [];
        let autoSenderIdx = 0;
        let autoSenderTimer = null;

        function startAutoSender() {
            const choice = parseInt(document.getElementById('auto-msg-choice').value, 10);
            const delay = parseInt(document.getElementById('auto-delay-choice').value, 10);

            // Filter targets according to message choice
            if (choice === 3) {
                // Target expired ads where msg3 not sent yet (or all expired)
                autoSenderQueue = allAds.filter(a => a.is_expired && !(a.msg3_sent || (outreachTracker[a.id] && outreachTracker[a.id].msg3)));
                if (autoSenderQueue.length === 0) {
                    // Fallback to all expired ads
                    autoSenderQueue = allAds.filter(a => a.is_expired);
                }
            } else if (choice === 1) {
                autoSenderQueue = allAds.filter(a => !(a.msg1_sent || (outreachTracker[a.id] && outreachTracker[a.id].msg1)));
            } else {
                autoSenderQueue = allAds.filter(a => !(a.msg2_sent || (outreachTracker[a.id] && outreachTracker[a.id].msg2)));
            }

            if (autoSenderQueue.length === 0) {
                showToast("යැවීමට කිසිදු දැන්වීමක් නොමැත (සියල්ල සම්පූර්ණයි)!");
                return;
            }

            autoSenderRunning = true;
            autoSenderIdx = 0;

            document.getElementById('btn-start-auto').disabled = true;
            document.getElementById('btn-start-auto').classList.add('opacity-50', 'cursor-not-allowed');
            document.getElementById('btn-stop-auto').disabled = false;
            document.getElementById('btn-stop-auto').classList.remove('text-gray-500', 'cursor-not-allowed');
            document.getElementById('btn-stop-auto').classList.add('bg-red-600', 'text-white', 'hover:bg-red-500');

            document.getElementById('auto-progress-container').classList.remove('hidden');
            processNextInQueue(choice, delay);
        }

        function processNextInQueue(choice, delay) {
            if (!autoSenderRunning || autoSenderIdx >= autoSenderQueue.length) {
                finishAutoSender();
                return;
            }

            const ad = autoSenderQueue[autoSenderIdx];
            const total = autoSenderQueue.length;
            const current = autoSenderIdx + 1;
            const pct = Math.round((current / total) * 100);

            document.getElementById('auto-progress-bar').style.width = `${pct}%`;
            document.getElementById('auto-progress-counter').innerText = `${current} / ${total} (${pct}%)`;
            document.getElementById('auto-progress-log').innerText = `[Ad #${ad.id}] +${ad.wa_intl} වෙත Message ${choice} යවමින් පවතී...`;

            // Open WhatsApp Web
            const waUrl = `https://wa.me/${ad.wa_intl}?text=${encodeURIComponent(getMessageText(choice, ad))}`;
            window.open(waUrl, '_blank');

            // Mark sent
            markMsgSent(ad.id, choice, true);

            autoSenderIdx++;

            if (autoSenderIdx < autoSenderQueue.length) {
                document.getElementById('auto-progress-status').innerHTML = `<i class="fa-solid fa-clock mr-1"></i> මීළඟ අංකය වෙත යාමට තත්පර ${delay/1000}ක් රැඳී සිටියි...`;
                autoSenderTimer = setTimeout(() => {
                    processNextInQueue(choice, delay);
                }, delay);
            } else {
                finishAutoSender();
            }
        }

        function stopAutoSender() {
            autoSenderRunning = false;
            if (autoSenderTimer) clearTimeout(autoSenderTimer);
            document.getElementById('auto-progress-status').innerHTML = `<i class="fa-solid fa-pause mr-1 text-amber-400"></i> Auto-Send නවතා ඇත.`;
            document.getElementById('btn-start-auto').disabled = false;
            document.getElementById('btn-start-auto').classList.remove('opacity-50', 'cursor-not-allowed');
            document.getElementById('btn-stop-auto').disabled = true;
            document.getElementById('btn-stop-auto').className = "inline-flex items-center space-x-1.5 bg-gray-800 text-gray-500 px-4 py-2.5 rounded-xl font-bold text-xs transition cursor-not-allowed";
            showToast("Auto-Send සාර්ථකව නවත්වන ලදී.");
        }

        function finishAutoSender() {
            autoSenderRunning = false;
            document.getElementById('auto-progress-status').innerHTML = `<i class="fa-solid fa-circle-check mr-1 text-green-400"></i> Auto-Send සම්පූර්ණයි!`;
            document.getElementById('btn-start-auto').disabled = false;
            document.getElementById('btn-start-auto').classList.remove('opacity-50', 'cursor-not-allowed');
            document.getElementById('btn-stop-auto').disabled = true;
            document.getElementById('btn-stop-auto').className = "inline-flex items-center space-x-1.5 bg-gray-800 text-gray-500 px-4 py-2.5 rounded-xl font-bold text-xs transition cursor-not-allowed";
            showToast("සියලු පණිවිඩ සාර්ථකව යවා අවසන් විය! 🎉");
        }

        // Copy Helpers
        function copyText(txt) {
            navigator.clipboard.writeText(txt).then(() => {
                showToast(`Copied: ${txt}`);
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

        // Initialize on load
        setTemplate(3);
        fetchLiveOutreachData();
    </script>
</body>
</html>
"""

with open('public/tintin_connect.html', 'w', encoding='utf-8') as f:
    f.write(html_template.replace('__ADS_JSON__', ads_json_escaped))

print("Generated upgraded public/tintin_connect.html successfully!")
