import urllib.request
import ssl
import re
import json
import time
import html as html_lib
from concurrent.futures import ThreadPoolExecutor, as_completed
import sys
import csv

sys.stdout.reconfigure(encoding='utf-8', line_buffering=True)

ctx = ssl.create_default_context()
ctx.check_hostname = False
ctx.verify_mode = ssl.CERT_NONE

HEADERS = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
}

def clean_phone(raw):
    if not raw:
        return None
    digits = re.sub(r'[^0-9]', '', str(raw))
    if digits.startswith('94') and len(digits) == 11 and digits[2] == '7':
        return digits
    if digits.startswith('0') and len(digits) == 10 and digits[1] == '7':
        return '94' + digits[1:]
    if len(digits) == 9 and digits[0] == '7':
        return '94' + digits
    return None

def format_local(cleaned):
    if cleaned and cleaned.startswith('94') and len(cleaned) == 11:
        return '0' + cleaned[2:]
    return cleaned

def fetch(url):
    req = urllib.request.Request(url, headers=HEADERS)
    try:
        with urllib.request.urlopen(req, context=ctx, timeout=8) as r:
            return r.read().decode('utf-8', errors='ignore')
    except Exception:
        return ""

print("Phase 1: Gathering listing URLs for Kandy, Outstations, and Camshow...", flush=True)

target_listing_urls = []

# 1. LankaAd Live Cam category
for p in range(1, 6):
    target_listing_urls.append(('LankaAd', f'https://lankaad.org/category/live-cam?page={p}', 'Camshow'))

# 2. LankaAd Camshow search queries
for q in ['camshow', 'cam show', 'video call', 'imo cam']:
    for p in range(1, 4):
        target_listing_urls.append(('LankaAd', f'https://lankaad.org/search?q={urllib.parse.quote(q)}&page={p}', 'Camshow'))

# 3. LankaAd Kandy specific listings
for p in range(1, 6):
    target_listing_urls.append(('LankaAd', f'https://lankaad.org/search?q=kandy&page={p}', 'Kandy'))
for p in range(1, 5):
    target_listing_urls.append(('LankaAd', f'https://lankaad.org/category/girls-personal?city=kandy&page={p}', 'Kandy'))

# 4. LankaAd Outstation high-demand cities (Gampaha, Negombo, Kurunegala, Galle)
for city in ['kurunegala', 'gampaha', 'negombo', 'galle', 'kandy']:
    for p in range(1, 3):
        target_listing_urls.append(('LankaAd', f'https://lankaad.org/search?q={city}&page={p}', city.capitalize()))

# 5. HelaLanka Live Cam category & Kandy
for p in range(1, 6):
    target_listing_urls.append(('HelaLanka', f'https://hela-lankaa-ads.com/category/live-cam?page={p}', 'Camshow'))
for p in range(1, 4):
    target_listing_urls.append(('HelaLanka', f'https://hela-lankaa-ads.com/search?q=kandy&page={p}', 'Kandy'))

print(f"Total target listing pages to scan: {len(target_listing_urls)}", flush=True)

candidate_ad_items = []
seen_ad_urls = set()

def scan_listing(item):
    source, url, default_type = item
    html = fetch(url)
    found = []
    if source == 'LankaAd':
        links = re.findall(r'href=["\'](https://lankaad\.org/ad/lanka-ads-[^"\']+)["\']', html)
        for l in links:
            found.append((source, l, default_type))
    elif source == 'HelaLanka':
        links = re.findall(r'href=["\'](https?://hela-lankaa-ads\.com/ad/[a-zA-Z0-9_\-]+)["\']', html)
        for l in links:
            found.append((source, l, default_type))
    return found

with ThreadPoolExecutor(max_workers=20) as executor:
    futures = [executor.submit(scan_listing, item) for item in target_listing_urls]
    for fut in as_completed(futures):
        for source, link, default_type in fut.result():
            if link not in seen_ad_urls:
                seen_ad_urls.add(link)
                candidate_ad_items.append((source, link, default_type))

print(f"Total unique candidate ad links collected: {len(candidate_ad_items)}", flush=True)

print("Phase 2: Extracting Kandy & Camshow ads with WhatsApp...", flush=True)

def parse_ad(item):
    source, ad_url, default_type = item
    html = fetch(ad_url)
    if not html:
        return None

    # Title
    title_match = re.search(r'<title>(.*?)</title>', html, re.IGNORECASE)
    raw_title = title_match.group(1).split('|')[0].strip() if title_match else 'Advertiser'
    clean_title = re.sub(r'[\r\n\t]+', ' ', raw_title)
    clean_title = html_lib.unescape(clean_title)

    # Location
    loc_match = re.search(r'<i class="[^"]*map[^"]*"></i>\s*<span>([^<]+)</span>', html)
    if not loc_match:
        loc_match = re.search(r'<i class="[^"]*map[^"]*"></i>\s*([^<]+)', html)
    raw_loc = loc_match.group(1).strip() if loc_match else default_type
    location = html_lib.unescape(raw_loc)

    # WhatsApp & Phone Extraction
    wa_match = re.search(r'href=["\']https://(?:wa\.me|api\.whatsapp\.com)/(?:\+?([0-9]+))', html)
    wa_num = clean_phone(wa_match.group(1)) if wa_match else None

    tel_match = re.search(r'href=["\']tel:(?:\+?([0-9]+))["\']', html)
    tel_num = clean_phone(tel_match.group(1)) if tel_match else None

    raw_phones = re.findall(r'(?:07\d[\s-]?\d{3}[\s-]?\d{4}|(?:\+?94)[\s-]?7\d[\s-]?\d{3}[\s-]?\d{4})', html)
    raw_clean = [clean_phone(p) for p in raw_phones if clean_phone(p)]

    target_phone = wa_num or tel_num or (raw_clean[0] if raw_clean else None)
    if not target_phone:
        return None

    title_lower = clean_title.lower()
    loc_lower = location.lower()
    full_text = (clean_title + " " + location).lower()

    # Determine tag: Camshow or Kandy / Outstation
    is_cam = any(k in full_text for k in ['cam', 'camshow', 'video', 'imo', 'whatsapp show', 'live'])
    is_kandy = any(k in full_text for k in ['kandy', 'nuwara', 'peradeniya', 'katugastota', 'kundasale', 'gampola'])
    is_outstation = any(k in full_text for k in ['kurunegala', 'gampaha', 'negombo', 'galle', 'matara', 'kalutara'])

    # Filter: Must be Camshow OR Outside Colombo (Kandy/Outstation)
    if not (is_cam or is_kandy or is_outstation):
        # If default_type is Camshow or Kandy, accept it
        if default_type in ['Camshow', 'Kandy']:
            pass
        else:
            return None

    ad_type = "Kandy" if is_kandy else ("Camshow" if is_cam else default_type)

    # Calculate Score
    score = 0
    if is_kandy: score += 30
    if is_cam: score += 25
    if wa_num: score += 20
    if 'whatsapp' in full_text: score += 10
    if any(k in full_text for k in ['vip', 'full service', 'girl', 'spa']): score += 10

    local_p = format_local(target_phone)
    formatted_p = f"{local_p[:3]} {local_p[3:6]} {local_p[6:]}" if len(local_p) == 10 else local_p

    # Date
    pub_match = re.search(r'"datePublished":\s*"([^"]+)"', html)
    pub_date = pub_match.group(1)[:10] if pub_match else 'Recent'

    return {
        'source': source,
        'title': clean_title[:85],
        'location': location,
        'type': ad_type,
        'phone': target_phone,
        'local_phone': formatted_p,
        'raw_local': local_p,
        'whatsapp_phone': target_phone,
        'ad_url': ad_url,
        'date_published': pub_date,
        'score': score
    }

parsed_leads = []
seen_phones = set()

with ThreadPoolExecutor(max_workers=25) as executor:
    futures = [executor.submit(parse_ad, item) for item in candidate_ad_items]
    for fut in as_completed(futures):
        res = fut.result()
        if res:
            p = res['phone']
            if p not in seen_phones:
                seen_phones.add(p)
                parsed_leads.append(res)
                if len(parsed_leads) % 15 == 0:
                    print(f"  Extracted {len(parsed_leads)} unique Kandy / Camshow leads...", flush=True)

print(f"Total unique Kandy/Camshow leads found: {len(parsed_leads)}", flush=True)

# Sort by score descending (Kandy & Camshow with WhatsApp at top)
parsed_leads.sort(key=lambda x: x['score'], reverse=True)

top_100 = parsed_leads[:100]

# Add ID 1 to 100
for i, item in enumerate(top_100, 1):
    item['id'] = i
    item['whatsapp_url'] = f"https://wa.me/{item['whatsapp_phone']}?text=Hi,%20TinTinAds.com%20%E0%B6%91%E0%B6%9A%E0%B7%99%E0%B6%B1%E0%B7%8A%20%E0%B6%9A%E0%B6%AD%E0%B7%8F%20%E0%B6%9A%E0%B6%BB%E0%B6%B1%E0%B7%8A%E0%B6%B1%E0%B7%9A.%20%E0%B6%94%E0%B6%BA%E0%B7%8F%20{item['source']}%20%E0%B6%91%E0%B6%9A%E0%B7%9A%20%E0%B6%AF%E0%B7%8F%E0%B6%BD%E0%B7%8F%20%E0%B6%AD%E0%B7%92%E0%B6%B6%E0%B7%94%E0%B6%AB%E0%B7%94%20ad%20%E0%B6%91%E0%B6%9A%20%E0%B6%AF%E0%B7%90%E0%B6%9A%E0%B7%8A%E0%B6%9A%E0%B7%8F."
    item['call_url'] = f"tel:{item['raw_local']}"

json_path = 'kandy_cam_100_leads.json'
with open(json_path, 'w', encoding='utf-8') as f:
    json.dump(top_100, f, ensure_ascii=False, indent=2)

print(f"Saved {len(top_100)} leads to {json_path}", flush=True)

# 1. Generate VCF
vcf_path = 'public/kandy_cam_100_leads.vcf'
with open(vcf_path, 'w', encoding='utf-8') as f:
    for c in top_100:
        cid = c['id']
        t_clean = re.sub(r'[^\w\s\u0D80-\u0DFF-]', '', c['title'])[:25].strip()
        f.write("BEGIN:VCARD\n")
        f.write("VERSION:3.0\n")
        f.write(f"FN:{c['type']} Lead {cid:03d} - {t_clean}\n")
        f.write(f"TEL;TYPE=CELL:{c['raw_local']}\n")
        f.write(f"NOTE:Type: {c['type']} | Loc: {c['location']} | Source: {c['source']} | Lead for TinTinAds\n")
        f.write("END:VCARD\n")
print(f"Generated {vcf_path}", flush=True)

# 2. Generate CSV
csv_path = 'public/kandy_cam_100_leads.csv'
with open(csv_path, 'w', newline='', encoding='utf-8-sig') as f:
    writer = csv.writer(f)
    writer.writerow([
        'ID',
        'Category / Type',
        'Source',
        'Phone (Local)',
        'WhatsApp Link',
        'Call Link',
        'Location',
        'Title',
        'Original Ad URL'
    ])
    for c in top_100:
        writer.writerow([
            c['id'],
            c['type'],
            c['source'],
            c['local_phone'],
            f"https://wa.me/{c['whatsapp_phone']}",
            f"tel:{c['raw_local']}",
            c['location'],
            c['title'],
            c['ad_url']
        ])
print(f"Generated {csv_path}", flush=True)

# 3. Generate Calling Sheet HTML
html_content = f'''<!DOCTYPE html>
<html lang="si">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Kandy & Camshow Top 100 Hot Leads — LankaAd & HelaLanka</title>
    <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" rel="stylesheet">
    <style>
        * {{ margin: 0; padding: 0; box-sizing: border-box; }}
        body {{
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
            background: #090d16;
            color: #f1f5f9;
            padding: 12px;
            max-width: 850px;
            margin: 0 auto;
        }}
        .header {{
            background: linear-gradient(135deg, #0d9488, #4f46e5);
            padding: 20px;
            border-radius: 18px;
            margin-bottom: 16px;
            text-align: center;
            box-shadow: 0 10px 30px -5px rgba(13, 148, 136, 0.4);
        }}
        .header h1 {{ font-size: 21px; font-weight: 900; margin-bottom: 6px; }}
        .header p {{ font-size: 13px; opacity: 0.95; line-height: 1.4; }}
        
        .stats-badge {{
            display: inline-flex;
            gap: 12px;
            margin-top: 10px;
            font-size: 12px;
            font-weight: 800;
            background: rgba(0,0,0,0.3);
            padding: 6px 14px;
            border-radius: 20px;
            flex-wrap: wrap;
            justify-content: center;
        }}

        .actions {{
            display: flex;
            gap: 10px;
            margin-top: 14px;
            justify-content: center;
            flex-wrap: wrap;
        }}
        .btn {{
            display: inline-flex;
            align-items: center;
            gap: 8px;
            padding: 10px 16px;
            border-radius: 10px;
            font-size: 13px;
            font-weight: 800;
            text-decoration: none;
            color: white;
            box-shadow: 0 4px 12px rgba(0,0,0,0.3);
            transition: all 0.15s;
        }}
        .btn:active {{ transform: scale(0.96); }}
        .btn-vcf {{ background: #10b981; }}
        .btn-csv {{ background: #2563eb; }}
        .btn-tintin {{ background: #f59e0b; color: #000; }}

        .search-box {{
            margin-bottom: 16px;
            display: flex;
            gap: 8px;
        }}
        .search-input {{
            flex: 1;
            padding: 12px 16px;
            border-radius: 12px;
            border: 1px solid #334155;
            background: #1e293b;
            color: white;
            font-size: 14px;
            outline: none;
        }}
        .search-input:focus {{ border-color: #0d9488; }}

        .filter-tabs {{
            display: flex;
            gap: 8px;
            margin-bottom: 14px;
            overflow-x: auto;
            padding-bottom: 4px;
        }}
        .tab-btn {{
            background: #1e293b;
            border: 1px solid #334155;
            color: #cbd5e1;
            padding: 8px 14px;
            border-radius: 10px;
            font-size: 12px;
            font-weight: 800;
            cursor: pointer;
            white-space: nowrap;
        }}
        .tab-btn.active {{
            background: #0d9488;
            border-color: #0d9488;
            color: white;
        }}

        .card {{
            background: #131d2e;
            border: 1px solid #1e293b;
            border-radius: 14px;
            padding: 14px 16px;
            margin-bottom: 10px;
            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: 12px;
            transition: border-color 0.15s;
        }}
        .card:hover {{ border-color: #0d9488; }}
        .card-info {{ flex: 1; min-width: 0; }}
        .badges {{
            display: flex;
            gap: 6px;
            align-items: center;
            margin-bottom: 5px;
            flex-wrap: wrap;
        }}
        .card-num {{
            background: #38bdf8;
            color: #0f172a;
            font-weight: 900;
            font-size: 11px;
            padding: 2px 7px;
            border-radius: 5px;
        }}
        .type-tag {{
            font-size: 10px;
            font-weight: 800;
            padding: 2px 7px;
            border-radius: 5px;
            text-transform: uppercase;
        }}
        .type-kandy {{ background: #eab308; color: #000; }}
        .type-camshow {{ background: #ec4899; color: white; }}
        .type-other {{ background: #06b6d4; color: black; }}

        .source-tag {{
            font-size: 10px;
            font-weight: 800;
            padding: 2px 7px;
            border-radius: 5px;
            text-transform: uppercase;
        }}
        .source-lankaad {{ background: #dc2626; color: white; }}
        .source-helalanka {{ background: #059669; color: white; }}
        
        .card-phone {{
            font-size: 19px;
            font-weight: 900;
            color: #facc15;
            letter-spacing: 0.5px;
        }}
        .card-title {{
            font-size: 13px;
            color: #cbd5e1;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
            margin-top: 3px;
        }}
        .card-meta {{
            font-size: 11px;
            color: #94a3b8;
            margin-top: 4px;
        }}
        .ad-link-badge {{
            display: inline-flex;
            align-items: center;
            gap: 5px;
            font-size: 11px;
            color: #818cf8;
            text-decoration: none;
            margin-top: 4px;
            font-weight: 700;
        }}
        .ad-link-badge:hover {{ text-decoration: underline; color: #a5b4fc; }}

        .btn-group {{
            display: flex;
            gap: 6px;
            flex-shrink: 0;
        }}
        .act-btn {{
            display: inline-flex;
            align-items: center;
            justify-content: center;
            width: 42px;
            height: 42px;
            border-radius: 12px;
            font-size: 17px;
            color: white;
            text-decoration: none;
            box-shadow: 0 4px 10px rgba(0,0,0,0.3);
            transition: transform 0.1s;
        }}
        .act-btn:active {{ transform: scale(0.92); }}
        .act-call {{ background: #d97706; }}
        .act-wa {{ background: #22c55e; }}
        .act-ad {{ background: #4f46e5; }}

        .pitch-banner {{
            background: #042f2e;
            border: 1px dashed #0d9488;
            border-radius: 12px;
            padding: 12px;
            margin-bottom: 14px;
            font-size: 12px;
            line-height: 1.5;
            color: #ccfbf1;
        }}
        .pitch-banner b {{ color: #facc15; }}
    </style>
</head>
<body>
    <div class="header">
        <h1><i class="fas fa-video"></i> Kandy & Camshow Top 100 Leads</h1>
        <p>කොළඹින් පිට (Kandy / Outstations) සහ WhatsApp Camshow සේවා සපයන, සෘජු LankaAd දැන්වීම් සබැඳි සහිත සක්‍රීය අංක 100</p>
        <div class="stats-badge">
            <span><i class="fas fa-map-marker-alt"></i> Kandy & Outstations</span>
            <span><i class="fas fa-video"></i> 100% Camshow & WhatsApp</span>
            <span><i class="fas fa-link"></i> Direct Ad Links</span>
        </div>
        <div class="actions">
            <a href="/download-kandy-cam-vcf" class="btn btn-vcf"><i class="fas fa-user-plus"></i> Save 100 to Phone (VCF)</a>
            <a href="/download-kandy-cam-csv" class="btn btn-csv"><i class="fas fa-file-csv"></i> Download CSV</a>
            <a href="https://tintinads.com" target="_blank" class="btn btn-tintin"><i class="fas fa-globe"></i> TinTinAds.com</a>
        </div>
    </div>

    <div class="pitch-banner">
        💡 <b>Camshow / Kandy Pitch:</b> <i>"මම TinTinAds.com එකෙන් කතා කරන්නේ. ඔයාගේ Camshow / Ad එක අපේ VIP Telegram Channel එකේ දාලා දවස් ගානක් pin කරලා තියන්න පුළුවන්. ලංකාවෙන්ම genuine clientsලා ඔයාගේ WhatsApp එකට කෙළින්ම එනවා. අද ඔයාට <b>රු. 1,500/=</b> කට මුළු ad එකම දාලා දෙන්නම්!"</i>
    </div>

    <div class="search-box">
        <input type="text" id="searchInput" class="search-input" placeholder="Search number, location (Kandy, Kurunegala, Camshow)..." onkeyup="filterCards()">
    </div>

    <div class="filter-tabs">
        <button class="tab-btn active" onclick="setTab('all', this)">සියල්ල (100)</button>
        <button class="tab-btn" onclick="setTab('kandy', this)">Kandy / නුවර</button>
        <button class="tab-btn" onclick="setTab('camshow', this)">Camshow / Video</button>
        <button class="tab-btn" onclick="setTab('outstation', this)">අනෙකුත් ප්‍රදේශ</button>
    </div>

    <div id="cardsList">
'''

for c in top_100:
    source_class = 'source-lankaad' if c['source'] == 'LankaAd' else 'source-helalanka'
    type_class = 'type-kandy' if c['type'] == 'Kandy' else ('type-camshow' if c['type'] == 'Camshow' else 'type-other')
    encoded_wa_msg = f"Hi,%20TinTinAds.com%20%E0%B6%91%E0%B6%9A%E0%B7%99%E0%B6%B1%E0%B7%8A%20%E0%B6%9A%E0%B6%AD%E0%B7%8F%20%E0%B6%9A%E0%B6%BB%E0%B6%B1%E0%B7%8A%E0%B6%B1%E0%B7%9A.%20%E0%B6%94%E0%B6%BA%E0%B7%8F%20{c['source']}%20%E0%B6%91%E0%B6%9A%E0%B7%9A%20%E0%B6%AF%E0%B7%8F%E0%B6%BD%E0%B7%8F%20%E0%B6%AD%E0%B7%92%E0%B6%B6%E0%B7%94%E0%B6%AB%E0%B7%94%20ad%20%E0%B6%91%E0%B6%9A%20%E0%B6%AF%E0%B7%90%E0%B6%9A%E0%B7%8A%E0%B6%9A%E0%B7%8F."
    
    html_content += f'''
    <div class="card" data-search="{c['raw_local']} {c['location'].lower()} {c['title'].lower()} {c['type'].lower()} {c['source'].lower()}" data-type="{c['type'].lower()}">
        <div class="card-info">
            <div class="badges">
                <span class="card-num">#{c['id']:03d}</span>
                <span class="type-tag {type_class}">{c['type']}</span>
                <a href="{c['ad_url']}" target="_blank" rel="noopener noreferrer" class="source-tag {source_class}" style="text-decoration:none;" title="Click to view original ad on {c['source']}"><i class="fas fa-external-link-alt"></i> {c['source']}</a>
            </div>
            <div class="card-phone">{c['local_phone']}</div>
            <div class="card-title"><a href="{c['ad_url']}" target="_blank" rel="noopener noreferrer" style="color:inherit; text-decoration:none;" title="Click to view ad">{c['title']}</a></div>
            <div class="card-meta"><i class="fas fa-map-marker-alt"></i> {c['location']} • <i class="fas fa-calendar-alt"></i> {c['date_published']}</div>
            <div><a href="{c['ad_url']}" target="_blank" rel="noopener noreferrer" class="ad-link-badge"><i class="fas fa-link"></i> {c['source']} Ad එක බලන්න &rarr;</a></div>
        </div>
        <div class="btn-group">
            <a href="tel:{c['raw_local']}" class="act-btn act-call" title="Call directly"><i class="fas fa-phone-alt"></i></a>
            <a href="https://wa.me/{c['whatsapp_phone']}?text={encoded_wa_msg}" target="_blank" class="act-btn act-wa" title="WhatsApp Chat"><i class="fab fa-whatsapp"></i></a>
            <a href="{c['ad_url']}" target="_blank" rel="noopener noreferrer" class="act-btn act-ad" title="View original ad on {c['source']}"><i class="fas fa-arrow-up-right-from-square"></i></a>
        </div>
    </div>
'''

html_content += '''
    </div>

    <script>
        var currentTab = 'all';

        function setTab(tab, el) {
            currentTab = tab;
            var buttons = document.getElementsByClassName('tab-btn');
            for (var i = 0; i < buttons.length; i++) buttons[i].classList.remove('active');
            el.classList.add('active');
            filterCards();
        }

        function filterCards() {
            var q = document.getElementById('searchInput').value.toLowerCase();
            var cards = document.getElementsByClassName('card');
            for (var i = 0; i < cards.length; i++) {
                var searchData = cards[i].getAttribute('data-search');
                var type = cards[i].getAttribute('data-type');
                
                var matchesSearch = searchData.indexOf(q) > -1;
                var matchesTab = (currentTab === 'all') || 
                                 (currentTab === 'kandy' && type.indexOf('kandy') > -1) ||
                                 (currentTab === 'camshow' && type.indexOf('cam') > -1) ||
                                 (currentTab === 'outstation' && type.indexOf('kandy') === -1 && type.indexOf('cam') === -1);

                if (matchesSearch && matchesTab) {
                    cards[i].style.display = 'flex';
                } else {
                    cards[i].style.display = 'none';
                }
            }
        }
    </script>
</body>
</html>
'''

html_path = 'public/kandy_cam_sheet.html'
with open(html_path, 'w', encoding='utf-8') as f:
    f.write(html_content)

print(f"Generated {html_path}", flush=True)
print("ALL DONE SUCCESSFULLY!", flush=True)
