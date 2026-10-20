import json
import re
import os
import subprocess
import base64

def norm(p):
    if not p:
        return ''
    d = re.sub(r'\D', '', str(p))
    if d.startswith('94'):
        d = '0' + d[2:]
    return d

def format_sl(p):
    d = norm(p)
    if len(d) == 10 and d.startswith('0'):
        return f"{d[:3]} {d[3:6]} {d[6:]}"
    return d

def clean_title(t):
    if not t:
        return 'Advertiser'
    t = re.sub(r'<[^>]+>', '', t)
    # Remove vulgar/explicit words if any
    bad_words = ['sex', 'fuck', 'badu', 'spa massage service', 'xxx']
    for b in bad_words:
        t = re.sub(re.escape(b), '', t, flags=re.IGNORECASE)
    t = re.sub(r'\s+', ' ', t).strip()
    return t[:40] if len(t) > 40 else t

# Load data
with open('scraped_hela_brand_new_advertisers.json', 'r', encoding='utf-8') as f:
    hela = json.load(f)
with open('scraped_lkads_advertisers.json', 'r', encoding='utf-8') as f:
    lkads = json.load(f)

# tintin existing
existing_phones = set()
for fn in ['inserted_20_ads.json', 'inserted_batch2_ads.json', 'scraped_batch6_20_ads.json']:
    if os.path.exists(fn):
        with open(fn, 'r', encoding='utf-8') as f:
            data = json.load(f)
            for item in data:
                p = norm(item.get('contact_phone') or item.get('phone'))
                w = norm(item.get('contact_whatsapp') or item.get('whatsapp'))
                if p: existing_phones.add(p)
                if w: existing_phones.add(w)

untapped = []
seen = set()

# Process Hela
for item in hela:
    p = norm(item.get('phone'))
    w = norm(item.get('whatsapp'))
    key = p or w
    if key and key not in existing_phones and key not in seen:
        seen.add(key)
        if p: seen.add(p)
        if w: seen.add(w)
        item['source'] = 'Hela-Lanka'
        untapped.append(item)

# Process LK-Ads
for item in lkads:
    p = norm(item.get('phone'))
    w = norm(item.get('whatsapp'))
    key = p or w
    if key and key not in existing_phones and key not in seen:
        seen.add(key)
        if p: seen.add(p)
        if w: seen.add(w)
        item['source'] = 'LK-Ads'
        untapped.append(item)

print(f"Total unique untapped contacts: {len(untapped)}")

# Encode logo
logo_b64 = ""
if os.path.exists('public/assets/siteicon.png'):
    with open('public/assets/siteicon.png', 'rb') as f:
        logo_b64 = base64.b64encode(f.read()).decode('utf-8')

# Generate CSV
csv_rows = ["No,Name_Title,District,Calling_Phone,WhatsApp_Phone,Has_WhatsApp,Source,Called,Status,Notes"]
for i, u in enumerate(untapped, 1):
    t = clean_title(u.get('title', ''))
    loc = u.get('location') or 'Other'
    p = norm(u.get('phone'))
    w = norm(u.get('whatsapp'))
    if not p and w:
        p = w
    has_wa = "Yes" if w else "No"
    source = u.get('source', '')
    csv_rows.append(f'"{i}","{t}","{loc}","{format_sl(p)}","{format_sl(w)}","{has_wa}","{source}","","",""')

with open('public/kandy_agent_calling_list.csv', 'w', encoding='utf-8-sig') as f:
    f.write('\n'.join(csv_rows))
print("Generated public/kandy_agent_calling_list.csv")

# Build HTML with full styling, printing CSS, and client-side interactive storage
rows_html = []
for i, u in enumerate(untapped, 1):
    t = clean_title(u.get('title', ''))
    loc = u.get('location') or 'Other'
    p = norm(u.get('phone'))
    w = norm(u.get('whatsapp'))
    if not p and w:
        p = w
    
    p_fmt = format_sl(p)
    w_fmt = format_sl(w)
    
    wa_badge = ""
    if w and p == w:
        wa_badge = '<span class="badge-wa-same">WhatsApp එම අංකයමයි</span>'
    elif w and p != w:
        wa_badge = f'<span class="badge-wa-diff">WA: {w_fmt}</span>'
    else:
        wa_badge = '<span class="badge-wa-no">Phone පමණි (WA නැත)</span>'
        
    src_badge = '<span class="badge-hela">Hela</span>' if u.get('source') == 'Hela-Lanka' else '<span class="badge-lk">LK-Ads</span>'
    
    row = f'''
    <tr class="table-row" id="row-{i}" data-index="{i}" data-district="{loc}">
        <td class="text-center font-bold text-gray-500">{i}</td>
        <td>
            <div class="font-semibold text-gray-800">{t}</div>
            <div class="text-[11px] text-gray-400">{loc} | {src_badge}</div>
        </td>
        <td class="text-center">
            <a href="tel:{p}" class="font-mono font-bold text-blue-700 bg-blue-50 px-2 py-1 rounded border border-blue-200 inline-block hover:bg-blue-100">{p_fmt}</a>
        </td>
        <td>
            {wa_badge}
        </td>
        <td class="text-center print:hidden">
            <input type="checkbox" class="call-check w-5 h-5 accent-emerald-600 rounded cursor-pointer" id="chk-{i}" onchange="toggleCall({i})">
        </td>
        <td class="print:hidden">
            <select class="status-select text-xs bg-white border border-gray-300 rounded px-2 py-1 text-gray-700 focus:outline-none focus:border-blue-500" id="sel-{i}" onchange="changeStatus({i})">
                <option value="pending">⏳ කතා කළ යුතුයි</option>
                <option value="interested">✅ කැමතියි (විස්තර එවන්න කිව්වා)</option>
                <option value="no_answer">📞 Answer නෑ</option>
                <option value="busy">⌛ පසුව ගන්න කිව්වා</option>
                <option value="already_done">🌟 දැනටමත් දාලා තියෙන්නේ</option>
                <option value="not_interested">❌ අකමැතියි</option>
                <option value="wrong_no">⚠️ Wrong Number</option>
            </select>
        </td>
        <td class="hidden print:table-cell text-center border-l">
            <span class="inline-block w-4 h-4 border border-gray-400 rounded"></span>
        </td>
        <td class="hidden print:table-cell border-l text-xs text-gray-400">
            [ ] කැමතියි &nbsp; [ ] පසුව &nbsp; [ ] No Ans
        </td>
    </tr>
    '''
    rows_html.append(row)

table_body = '\n'.join(rows_html)

html_content = f'''<!DOCTYPE html>
<html lang="si">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>TinTinAds.com - නිල පාරිභෝගික සම්බන්ධීකරණ නියෝජිත අත්පොත & Calling List</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css">
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=Noto+Sans+Sinhala:wght@400;600;700;800&display=swap');
        body {{
            font-family: 'Inter', 'Noto Sans Sinhala', sans-serif;
            background-color: #f8fafc;
            color: #1e293b;
        }}
        .badge-wa-same {{
            background-color: #ecfdf5;
            color: #065f46;
            border: 1px solid #a7f3d0;
            padding: 2px 8px;
            border-radius: 9999px;
            font-size: 11px;
            font-weight: 600;
            display: inline-block;
        }}
        .badge-wa-diff {{
            background-color: #eff6ff;
            color: #1e40af;
            border: 1px solid #bfdbfe;
            padding: 2px 8px;
            border-radius: 9999px;
            font-size: 11px;
            font-weight: 700;
            display: inline-block;
        }}
        .badge-wa-no {{
            background-color: #fef2f2;
            color: #991b1b;
            border: 1px solid #fecaca;
            padding: 2px 8px;
            border-radius: 9999px;
            font-size: 11px;
            font-weight: 600;
            display: inline-block;
        }}
        .badge-hela {{
            background-color: #f0fdf4;
            color: #15803d;
            border: 1px solid #bbf7d0;
            padding: 1px 6px;
            border-radius: 4px;
            font-size: 10px;
            font-weight: 700;
        }}
        .badge-lk {{
            background-color: #e0f2fe;
            color: #0369a1;
            border: 1px solid #bae6fd;
            padding: 1px 6px;
            border-radius: 4px;
            font-size: 10px;
            font-weight: 700;
        }}
        @media print {{
            body {{
                background-color: #ffffff;
                color: #000000;
                font-size: 10pt;
                padding: 0;
            }}
            .no-print, .print\\:hidden {{
                display: none !important;
            }}
            .print-header {{
                display: block !important;
            }}
            table {{
                page-break-inside: auto;
                width: 100%;
                border-collapse: collapse;
            }}
            tr {{
                page-break-inside: avoid;
                page-break-after: auto;
            }}
            thead {{
                display: table-header-group;
            }}
            .page-break {{
                page-break-before: always;
            }}
            th, td {{
                border: 1px solid #cbd5e1 !important;
                padding: 4px 6px !important;
                font-size: 9pt !important;
            }}
        }}
    </style>
</head>
<body class="p-4 md:p-8">

    <div class="max-w-6xl mx-auto space-y-6">

        <!-- Top Header & Branding -->
        <div class="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm flex flex-col md:flex-row items-center justify-between gap-6">
            <div class="flex items-center space-x-4">
                <img src="data:image/png;base64,{logo_b64}" alt="TinTinAds Logo" class="w-16 h-16 rounded-2xl shadow-md border border-amber-200">
                <div>
                    <div class="flex items-center space-x-2">
                        <h1 class="text-2xl font-black text-gray-900 tracking-tight">TinTinAds.com</h1>
                        <span class="bg-amber-100 text-amber-800 text-xs font-bold px-2.5 py-0.5 rounded-full border border-amber-300">Official Agent Guide</span>
                    </div>
                    <p class="text-sm font-semibold text-gray-600 mt-1">
                        පාරිභෝගික සම්බන්ධීකරණ නියෝජිත අත්පොත සහ සක්‍රීය ඇමතුම් නාමලේඛනය
                    </p>
                    <p class="text-xs text-gray-400 mt-0.5">
                        තවමත් දැන්වීම් පළනොකළ සක්‍රීය දැන්වීම්කරුවන් 591 දෙනාගේ නිල Calling Sheet එක
                    </p>
                </div>
            </div>
            <div class="flex flex-wrap gap-2 no-print">
                <button onclick="window.print()" class="inline-flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs px-4 py-2.5 rounded-xl shadow transition">
                    <i class="fa-solid fa-print"></i>
                    <span>Print / Save as PDF</span>
                </button>
                <a href="/TinTinAds_Agent_Calling_List.pdf" target="_blank" class="inline-flex items-center space-x-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-4 py-2.5 rounded-xl shadow transition">
                    <i class="fa-solid fa-file-pdf"></i>
                    <span>Download Official PDF</span>
                </a>
                <a href="/kandy_agent_calling_list.csv" download class="inline-flex items-center space-x-2 bg-gray-800 hover:bg-gray-900 text-gray-200 font-bold text-xs px-4 py-2.5 rounded-xl shadow transition">
                    <i class="fa-solid fa-file-excel"></i>
                    <span>Excel CSV</span>
                </a>
            </div>
        </div>

        <!-- Section 1: Guide & Pitch Script for the Agent -->
        <div class="bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-200 rounded-2xl p-6 shadow-sm space-y-6">
            <div class="flex items-center space-x-3 border-b border-amber-200 pb-3">
                <span class="text-2xl">📖</span>
                <div>
                    <h2 class="text-lg font-extrabold text-amber-950">
                        නියෝජිතවරියට මඟපෙන්වීම සහ කතා කළ යුතු ආකාරය (Official Calling Pitch Script)
                    </h2>
                    <p class="text-xs text-amber-800">
                        ඇමතුම ලබාදෙන විට භාවිතා කළ යුතු නියම වචන මාලාව සහ උපදෙස්
                    </p>
                </div>
            </div>

            <!-- Pitch Script Box -->
            <div class="bg-white border-2 border-amber-300 rounded-xl p-5 shadow-sm space-y-4">
                <h3 class="text-sm font-bold text-amber-900 uppercase tracking-wider flex items-center space-x-2">
                    <i class="fa-solid fa-phone-volume text-amber-600"></i>
                    <span>දුරකථන ඇමතුම ගත් සැනින් කියවිය යුතු පිටපත (Calling Script)</span>
                </h3>
                
                <div class="space-y-3 text-sm text-gray-800 leading-relaxed">
                    <div class="p-3 bg-blue-50 border-l-4 border-blue-500 rounded-r-lg">
                        <p class="font-bold text-blue-900">1. සුහදව ආමන්ත්‍රණය කිරීම (Friendly Greeting):</p>
                        <p class="italic text-gray-700 mt-1">
                            "හෙලෝ අක්කේ / නංගී, සුබ දවසක්! මම TinTinAds.com (ටින්ටින් ඇඩ්ස්) වෙබ් අඩවියේ නියෝජිතවරියක් විදිහට කතා කරන්නේ. ඔයාගේ දැන්වීමක් දැකලා මේ සුබ ආරංචියක් දෙන්න කතා කළේ..."
                        </p>
                    </div>

                    <div class="p-3 bg-emerald-50 border-l-4 border-emerald-500 rounded-r-lg">
                        <p class="font-bold text-emerald-900">2. නොමිලේ VIP දීමනාව පිරිනැමීම (The Free VIP Offer):</p>
                        <p class="italic text-gray-700 mt-1">
                            "අපේ සයිට් එකේ ඔයාගේ දැන්වීම <strong>සම්පූර්ණයෙන්ම නොමිලේ (Free VIP) දින 7ක් පළ කරලා දෙන්න</strong> අපි තීරණය කළා. කිසිම මුදලක් අය කරන්නේ නෑ! දැනටමත් දිනපතා දහස් ගණනක් පාරිභෝගිකයින් අපේ සයිට් එක බලන නිසා ඔයාට දවසට අලුත් Calls සහ WhatsApp පණිවිඩ ගොඩක් ලබාගන්න පුළුවන්."
                        </p>
                    </div>

                    <div class="p-3 bg-purple-50 border-l-4 border-purple-500 rounded-r-lg">
                        <p class="font-bold text-purple-900">3. WhatsApp මඟින් සම්බන්ධ වීම (Next Step):</p>
                        <p class="italic text-gray-700 mt-1">
                            "අපේ WhatsApp Agent කෙනෙක් ඔයාගේ WhatsApp අංකයට අපේ සයිට් එකේ විස්තර සහ Link එකක් එවයි. ඔයාගේ දැන්වීම දැනටමත් සයිට් එකේ දාලා තියෙනවද කියලා බලලා, දාලා නැත්නම් ඔයාගේ හොඳ Photos 2-3ක් සහ විස්තර එවල නොමිලේම දාගන්න. එතකොට කෙලින්ම ඔයාගේ නම්බර් එකටම Customers ලා කතා කරයි."
                        </p>
                    </div>
                </div>
            </div>

            <!-- FAQ & Objection Handling -->
            <div class="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                <div class="bg-white p-4 rounded-xl border border-amber-200 shadow-sm space-y-1">
                    <p class="font-bold text-red-600 flex items-center space-x-1">
                        <i class="fa-solid fa-circle-question"></i>
                        <span>ප්‍රශ්නය: සල්ලි කීයක් ගන්නවද?</span>
                    </p>
                    <p class="text-gray-700 font-medium">
                        <strong>පිළිතුර:</strong> "නැහැ අක්කේ, දැනට දින 7ක් සම්පූර්ණයෙන්ම නොමිලේ VIP එක දෙන්නේ. පසුව ලැබෙන Calls බලා ඔයා කැමති නම් විතරක් සතියට රු. 700ක් ගෙවලා දිගටම තියාගන්න පුළුවන්."
                    </p>
                </div>

                <div class="bg-white p-4 rounded-xl border border-amber-200 shadow-sm space-y-1">
                    <p class="font-bold text-blue-600 flex items-center space-x-1">
                        <i class="fa-solid fa-circle-question"></i>
                        <span>ප්‍රශ්නය: මගේ නම්බර් එක කොහෙන්ද?</span>
                    </p>
                    <p class="text-gray-700 font-medium">
                        <strong>පිළිතුර:</strong> "ඔයා Classified සයිට් වල දාලා තිබුණු දැන්වීමක් දැකලා අපේ අලුත් සයිට් එකෙනුත් ඔයාට තව Customers ලා අරන් දෙන්න තමයි අපේ Manager කතා කරන්න කිව්වේ."
                    </p>
                </div>

                <div class="bg-white p-4 rounded-xl border border-amber-200 shadow-sm space-y-1">
                    <p class="font-bold text-emerald-600 flex items-center space-x-1">
                        <i class="fa-solid fa-circle-question"></i>
                        <span>ප්‍රශ්නය: සයිට් එක මොකක්ද?</span>
                    </p>
                    <p class="text-gray-700 font-medium">
                        <strong>පිළිතුර:</strong> "TinTinAds.com (ටින්ටින් ඇඩ්ස්). ලංකාවේ අලුත්ම වේගවත්ම Classifieds සයිට් එක. මම WhatsApp එකෙන් ලින්ක් එක එවන්නම්."
                    </p>
                </div>
            </div>

            <!-- Golden Rules -->
            <div class="bg-amber-100/70 border border-amber-300 rounded-xl p-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-3 text-xs text-amber-900 font-medium">
                <div>
                    <span class="font-extrabold text-amber-950 uppercase tracking-wider block mb-1">නියෝජිතවරියගේ රන් නීති 4:</span>
                    <ul class="list-disc list-inside space-y-0.5">
                        <li>ඉතාම කාරුණිකව, මෘදු හඬින් මිත්‍රශීලීව කතා කරන්න.</li>
                        <li>කිසිවෙකුට බල නොකරන්න; "නොමිලේ දෙන දීමනාව" සහ "Customers ලා ලැබෙන වාසිය" අවධාරණය කරන්න.</li>
                        <li>කතා කළ විගස පහත Table එකේ Checkbox එක Mark කර අදාළ Status එක තෝරන්න.</li>
                        <li>WhatsApp ඇති සහ නැති අය විශේෂයෙන් හඳුනාගන්න.</li>
                    </ul>
                </div>
                <div class="bg-white px-4 py-3 rounded-lg border border-amber-300 text-center shadow-sm shrink-0">
                    <span class="text-gray-500 block text-[10px] uppercase font-bold">මුළු ඇමතුම් ඉලක්කය</span>
                    <span class="text-2xl font-black text-amber-600">591</span>
                </div>
            </div>
        </div>

        <!-- Section 2: Interactive Filter & Progress Bar (Screen Only) -->
        <div class="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm space-y-4 no-print">
            <div class="flex flex-col md:flex-row items-center justify-between gap-4">
                <div class="flex items-center space-x-3 w-full md:w-auto">
                    <div class="relative w-full md:w-80">
                        <i class="fa-solid fa-search absolute left-3 top-3 text-gray-400 text-xs"></i>
                        <input type="text" id="searchInput" onkeyup="filterTable()" placeholder="නම, දුරකථන අංකය හෝ දිස්ත්‍රික්කය සොයන්න..." class="w-full pl-9 pr-3 py-2 text-xs border border-gray-300 rounded-xl focus:outline-none focus:border-blue-500">
                    </div>
                    <select id="districtFilter" onchange="filterTable()" class="text-xs border border-gray-300 rounded-xl px-3 py-2 bg-white text-gray-700 focus:outline-none focus:border-blue-500">
                        <option value="all">සියලුම ප්‍රදේශ (All Districts)</option>
                        <option value="Colombo">Colombo (කොළඹ)</option>
                        <option value="Kandy">Kandy (මහනුවර)</option>
                        <option value="Gampaha">Gampaha</option>
                        <option value="Other">වෙනත් (Other)</option>
                    </select>
                </div>

                <div class="flex items-center space-x-4 w-full md:w-auto justify-end">
                    <div class="text-right">
                        <span class="text-xs text-gray-500">කතා කර අවසන් ප්‍රගතිය:</span>
                        <div class="text-sm font-black text-emerald-600" id="progressText">0 / 591 (0%)</div>
                    </div>
                    <div class="w-32 bg-gray-200 rounded-full h-3 overflow-hidden">
                        <div class="bg-emerald-500 h-3 rounded-full transition-all duration-300" id="progressBar" style="width: 0%"></div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Section 3: The Calling Data Table -->
        <div class="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
            <div class="p-4 bg-gray-50 border-b border-gray-200 flex justify-between items-center">
                <h3 class="text-sm font-bold text-gray-800 flex items-center space-x-2">
                    <i class="fa-solid fa-address-book text-blue-600"></i>
                    <span>සක්‍රීය ඇමතුම් නාමලේඛනය (591 Active Leads)</span>
                </h3>
                <span class="text-xs text-gray-500 font-medium" id="showingCount">දැන්වීම්කරුවන් 591ම පෙන්වයි</span>
            </div>

            <div class="overflow-x-auto">
                <table class="w-full text-left text-xs" id="contactsTable">
                    <thead class="bg-gray-100 text-gray-600 uppercase font-bold text-[11px] border-b border-gray-200">
                        <tr>
                            <th class="p-3 text-center w-12">#</th>
                            <th class="p-3">නම / විස්තරය</th>
                            <th class="p-3 text-center">ඇමතුම් අංකය (Phone)</th>
                            <th class="p-3">WhatsApp තත්ත්වය</th>
                            <th class="p-3 text-center w-20 print:hidden">Done</th>
                            <th class="p-3 w-48 print:hidden">ප්‍රතිචාරය (Status)</th>
                            <th class="p-3 text-center w-12 hidden print:table-cell">Done</th>
                            <th class="p-3 w-36 hidden print:table-cell">Notes</th>
                        </tr>
                    </thead>
                    <tbody class="divide-y divide-gray-100" id="tableBody">
                        {table_body}
                    </tbody>
                </table>
            </div>
        </div>

    </div>

    <!-- Client-side script to handle localStorage progress & search -->
    <script>
        function saveProgress() {{
            const checked = {{}};
            const statuses = {{}};
            document.querySelectorAll('.call-check').forEach(c => {{
                if (c.checked) {{
                    const idx = c.id.replace('chk-', '');
                    checked[idx] = true;
                }}
            }});
            document.querySelectorAll('.status-select').forEach(s => {{
                const idx = s.id.replace('sel-', '');
                if (s.value !== 'pending') {{
                    statuses[idx] = s.value;
                }}
            }});
            localStorage.setItem('tintin_agent_checked', JSON.stringify(checked));
            localStorage.setItem('tintin_agent_statuses', JSON.stringify(statuses));
            updateStats();
        }}

        function loadProgress() {{
            try {{
                const checked = JSON.parse(localStorage.getItem('tintin_agent_checked') || '{{}}');
                const statuses = JSON.parse(localStorage.getItem('tintin_agent_statuses') || '{{}}');
                
                Object.keys(checked).forEach(idx => {{
                    const el = document.getElementById('chk-' + idx);
                    if (el) {{
                        el.checked = true;
                        const row = document.getElementById('row-' + idx);
                        if (row) row.classList.add('bg-emerald-50/40');
                    }}
                }});

                Object.keys(statuses).forEach(idx => {{
                    const el = document.getElementById('sel-' + idx);
                    if (el) el.value = statuses[idx];
                }});
            }} catch(e) {{
                console.error(e);
            }}
            updateStats();
        }}

        function toggleCall(idx) {{
            const chk = document.getElementById('chk-' + idx);
            const row = document.getElementById('row-' + idx);
            if (chk.checked) {{
                row.classList.add('bg-emerald-50/40');
            }} else {{
                row.classList.remove('bg-emerald-50/40');
            }}
            saveProgress();
        }}

        function changeStatus(idx) {{
            const sel = document.getElementById('sel-' + idx);
            const chk = document.getElementById('chk-' + idx);
            if (sel.value !== 'pending') {{
                chk.checked = true;
                toggleCall(idx);
            }}
            saveProgress();
        }}

        function updateStats() {{
            const total = {len(untapped)};
            const checkedCount = document.querySelectorAll('.call-check:checked').length;
            const pct = Math.round((checkedCount / total) * 100);
            document.getElementById('progressText').innerText = checkedCount + " / " + total + " (" + pct + "%)";
            document.getElementById('progressBar').style.width = pct + "%";
        }}

        function filterTable() {{
            const query = document.getElementById('searchInput').value.toLowerCase();
            const district = document.getElementById('districtFilter').value;
            const rows = document.querySelectorAll('.table-row');
            let visible = 0;

            rows.forEach(r => {{
                const text = r.innerText.toLowerCase();
                const rowDist = r.getAttribute('data-district') || '';
                
                const matchesQuery = text.includes(query);
                const matchesDistrict = (district === 'all') || (district === 'Other' && !['Colombo', 'Kandy', 'Gampaha'].includes(rowDist)) || (rowDist.toLowerCase().includes(district.toLowerCase()));

                if (matchesQuery && matchesDistrict) {{
                    r.style.display = '';
                    visible++;
                }} else {{
                    r.style.display = 'none';
                }}
            }});
            document.getElementById('showingCount').innerText = "පෙන්වන්නේ " + visible + " / {len(untapped)} කි";
        }}

        window.onload = loadProgress;
    </script>
</body>
</html>
'''

with open('public/kandy_agent_outreach.html', 'w', encoding='utf-8') as f:
    f.write(html_content)
print("Generated public/kandy_agent_outreach.html")

# Now generate PDF via Headless Edge
edge_path = r'C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe'
html_abs = os.path.abspath('public/kandy_agent_outreach.html')
pdf_abs = os.path.abspath('public/TinTinAds_Agent_Calling_List.pdf')

print("Generating PDF via Microsoft Edge...")
try:
    cmd = [
        edge_path,
        '--headless',
        '--disable-gpu',
        '--no-margins',
        f'--print-to-pdf={pdf_abs}',
        f'file:///{html_abs}'
    ]
    res = subprocess.run(cmd, capture_output=True, timeout=60)
    if os.path.exists(pdf_abs):
        size_kb = round(os.path.getsize(pdf_abs) / 1024, 1)
        print(f"Successfully generated PDF: public/TinTinAds_Agent_Calling_List.pdf ({size_kb} KB)")
    else:
        print("PDF file was not created. Error:", res.stderr.decode('utf-8', errors='ignore'))
except Exception as e:
    print(f"Error generating PDF: {e}")
