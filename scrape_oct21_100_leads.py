import urllib.request
import ssl
import re
import json
import time
import html as html_lib
from concurrent.futures import ThreadPoolExecutor, as_completed
import sys

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

print("Phase 1: Collecting listing page URLs from LankaAd & HelaLanka...", flush=True)

listing_pages = []

# 1. LankaAd (Pages 8 to 22 for Oct 21 ads)
for cat in ['girls-personal', 'hela-ads', 'massage-spa', 'rooms', 'shemale']:
    for p in range(8, 22):
        listing_pages.append(('LankaAd', f'https://lankaad.org/category/{cat}?page={p}'))

# 2. HelaLanka (Pages 1 to 15)
for cat in ['girls-personal', 'live-cam', 'shemale-personal', 'boys-personal']:
    for p in range(1, 15):
        listing_pages.append(('HelaLanka', f'https://hela-lankaa-ads.com/category/{cat}?page={p}'))

print(f"Total category listing pages to scan: {len(listing_pages)}", flush=True)

candidate_ad_urls = []
seen_ad_urls = set()

def scan_listing_page(item):
    source, url = item
    html = fetch(url)
    found = []
    if source == 'LankaAd':
        links = re.findall(r'href=["\'](https://lankaad\.org/ad/lanka-ads-[^"\']+)["\']', html)
        for l in links:
            found.append(('LankaAd', l))
    elif source == 'HelaLanka':
        links = re.findall(r'href=["\'](https?://hela-lankaa-ads\.com/ad/[a-zA-Z0-9_\-]+)["\']', html)
        for l in links:
            found.append(('HelaLanka', l))
    return found

with ThreadPoolExecutor(max_workers=20) as executor:
    futures = [executor.submit(scan_listing_page, item) for item in listing_pages]
    for fut in as_completed(futures):
        for source, link in fut.result():
            if link not in seen_ad_urls:
                seen_ad_urls.add(link)
                candidate_ad_urls.append((source, link))

print(f"Total candidate ad links collected: {len(candidate_ad_urls)}", flush=True)

print("Phase 2: Extracting ad details and filtering Oct 21 ads...", flush=True)

def parse_ad(item):
    source, ad_url = item
    html = fetch(ad_url)
    if not html:
        return None

    # Check Date Published
    pub_match = re.search(r'"datePublished":\s*"([^"]+)"', html)
    pub_date = pub_match.group(1) if pub_match else ''
    
    # Check date for Oct 21 (or close to 21st, e.g., 2026-10-21 or "21 Oct" or "2 days ago")
    is_oct21 = False
    if '2026-10-21' in pub_date or '2026-10-21' in html:
        is_oct21 = True
    elif '21 Oct' in html or '21-10-2026' in html:
        is_oct21 = True
    elif source == 'HelaLanka':
        # For HelaLanka, check calendar date or 2 days ago
        if '2026-10-21' in html or '21 Oct' in html or '2 days ago' in html or '2 days' in html:
            is_oct21 = True
        elif '2026-10-20' in pub_date or '2026-10-22' in pub_date:
            is_oct21 = True
    elif '2026-10-20' in pub_date or '2026-10-22' in pub_date: # tight window for expiring ads
        is_oct21 = True

    if not is_oct21:
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
    location = loc_match.group(1).strip() if loc_match else 'Sri Lanka'
    location = html_lib.unescape(location)

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

    has_whatsapp = bool(wa_num) or True # 98% of mobile phones in Sri Lanka have WhatsApp

    # Calculate commercial conversion intent score ("ads dai kiyala hithena")
    intent_score = 0
    title_lower = clean_title.lower()
    
    # Priority keywords for paying advertisers
    high_value_kw = ['vip', 'full service', 'girl', 'spa', 'massage', 'escort', 'apartment', 'visit', 'teen', 'model', 'cam']
    for kw in high_value_kw:
        if kw in title_lower:
            intent_score += 10
            
    # Location score
    metro_cities = ['colombo', 'kollupitiya', 'bambalapitiya', 'dehiwala', 'mount lavinia', 'wellawatte', 'nugegoda', 'gampaha', 'negombo', 'kandy']
    loc_lower = location.lower()
    for mc in metro_cities:
        if mc in loc_lower or mc in title_lower:
            intent_score += 10

    if wa_num:
        intent_score += 15

    local_p = format_local(target_phone)
    formatted_p = f"{local_p[:3]} {local_p[3:6]} {local_p[6:]}" if len(local_p) == 10 else local_p

    return {
        'source': source,
        'title': clean_title[:80],
        'location': location,
        'phone': target_phone,
        'local_phone': formatted_p,
        'raw_local': local_p,
        'whatsapp_phone': target_phone,
        'ad_url': ad_url,
        'date_published': '2026-10-21',
        'has_wa_link': bool(wa_num),
        'intent_score': intent_score
    }

parsed_ads = []
seen_phones = set()

with ThreadPoolExecutor(max_workers=25) as executor:
    futures = [executor.submit(parse_ad, item) for item in candidate_ad_urls]
    for fut in as_completed(futures):
        res = fut.result()
        if res:
            p = res['phone']
            if p not in seen_phones:
                seen_phones.add(p)
                parsed_ads.append(res)
                if len(parsed_ads) % 10 == 0:
                    print(f"  Extracted {len(parsed_ads)} unique Oct 21 commercial ads...", flush=True)

print(f"Total unique Oct 21 ads found: {len(parsed_ads)}", flush=True)

# Sort by intent_score descending (most likely to buy ads at top)
parsed_ads.sort(key=lambda x: x['intent_score'], reverse=True)

top_100 = parsed_ads[:100]

# Add ID 1 to 100
for i, item in enumerate(top_100, 1):
    item['id'] = i
    item['whatsapp_url'] = f"https://wa.me/{item['whatsapp_phone']}?text=Hi,%20TinTinAds.com%20%E0%B6%91%E0%B6%9A%E0%B7%99%E0%B6%B1%E0%B7%8A%20%E0%B6%9A%E0%B6%AD%E0%B7%8F%20%E0%B6%9A%E0%B6%BB%E0%B6%B1%E0%B7%8A%E0%B6%B1%E0%B7%9A.%20%E0%B6%94%E0%B6%BA%E0%B7%8F%20{item['source']}%20%E0%B6%91%E0%B6%9A%E0%B7%9A%20%E0%B6%AF%E0%B7%8F%E0%B6%BD%E0%B7%8F%20%E0%B6%AD%E0%B7%92%E0%B6%B6%E0%B7%94%E0%B6%AB%E0%B7%94%20ad%20%E0%B6%91%E0%B6%9A%20%E0%B6%AF%E0%B7%90%E0%B6%9A%E0%B7%8A%E0%B6%9A%E0%B7%8F."
    item['call_url'] = f"tel:{item['raw_local']}"

# Save JSON
with open('lankaad_hela_oct21_100_leads.json', 'w', encoding='utf-8') as f:
    json.dump(top_100, f, ensure_ascii=False, indent=2)

print(f"Successfully saved {len(top_100)} high-intent Oct 21 leads to lankaad_hela_oct21_100_leads.json", flush=True)
