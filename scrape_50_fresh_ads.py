import urllib.request
import re
import ssl
import json
import time
import os
import html as html_lib
import sys

sys.stdout.reconfigure(encoding='utf-8', line_buffering=True)

ctx = ssl.create_default_context()
ctx.check_hostname = False
ctx.verify_mode = ssl.CERT_NONE

HEADERS = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
}

def get_html(url):
    try:
        req = urllib.request.Request(url, headers=HEADERS)
        with urllib.request.urlopen(req, context=ctx, timeout=10) as resp:
            return resp.read().decode('utf-8', errors='ignore')
    except Exception as e:
        return ""

def download_image(url, save_paths):
    try:
        req = urllib.request.Request(url, headers=HEADERS)
        with urllib.request.urlopen(req, context=ctx, timeout=12) as resp:
            data = resp.read()
        for p in save_paths:
            os.makedirs(os.path.dirname(p), exist_ok=True)
            with open(p, 'wb') as f:
                f.write(data)
        return True
    except Exception as e:
        print(f"Failed to download image {url}: {e}", flush=True)
        return False

# 1. Load existing DB phones to exclude
existing_phones = set()
if os.path.exists('existing_db_phones.json'):
    with open('existing_db_phones.json', 'r', encoding='utf-8') as f:
        for p in json.load(f):
            existing_phones.add(p[-9:]) # last 9 digits

print(f"Loaded {len(existing_phones)} existing phone suffixes to avoid duplicates.", flush=True)

# 2. Gather candidate URLs from HelaLanka
listing_urls = [
    "https://hela-lankaa-ads.com/",
    "https://hela-lankaa-ads.com/category/girls-personal",
    "https://hela-lankaa-ads.com/category/girls-personal?page=2",
    "https://hela-lankaa-ads.com/category/girls-personal?page=3",
    "https://hela-lankaa-ads.com/category/live-cam",
    "https://hela-lankaa-ads.com/category/live-cam?page=2",
    "https://hela-lankaa-ads.com/category/boys-personal",
    "https://hela-lankaa-ads.com/category/shemale-personal"
]

all_ad_urls = []
seen_urls = set()

print("Collecting ad links from HelaLanka...", flush=True)
for u in listing_urls:
    h = get_html(u)
    if not h:
        continue
    links = re.findall(r'https?://hela-lankaa-ads\.com/ad/[a-zA-Z0-9_\-]+', h)
    for l in links:
        if l not in seen_urls:
            seen_urls.add(l)
            all_ad_urls.append(l)

print(f"Total candidate ad URLs gathered: {len(all_ad_urls)}", flush=True)

# 3. Process ads and extract 50 fresh ones
fresh_ads = []
seen_phones = set(existing_phones)

storage_dir = "storage/app/public/ad-images"
public_storage_dir = "public/storage/ad-images"
os.makedirs(storage_dir, exist_ok=True)
os.makedirs(public_storage_dir, exist_ok=True)

for idx, ad_url in enumerate(all_ad_urls):
    if len(fresh_ads) >= 50:
        break

    ad_html = get_html(ad_url)
    if not ad_html:
        continue

    # Title
    title_m = re.search(r'<title>(.*?)</title>', ad_html, re.I)
    raw_title = title_m.group(1) if title_m else "Classified Ad"
    clean_title = html_lib.unescape(raw_title)
    clean_title = re.sub(r'\|\s*Hela Lanka Ads.*$', '', clean_title).strip()
    clean_title = re.sub(r'[\r\n\t]+', ' ', clean_title)
    clean_title = re.sub(r'\s+', ' ', clean_title)[:85].strip()

    # Images
    imgs = list(dict.fromkeys(re.findall(r'https?://hela-lankaa-ads\.com/storage/images/[a-zA-Z0-9_\-\.]+', ad_html)))
    if not imgs:
        continue
    img_url = imgs[0]

    # Phone / WhatsApp
    phones = re.findall(r'(?:\+?94|0)7[0-9]{8}', ad_html)
    clean_phones = []
    for p in phones:
        digits = re.sub(r'[^0-9]', '', p)
        if digits.startswith('94') and len(digits) == 11:
            digits = '0' + digits[2:]
        if len(digits) == 10 and digits.startswith('07'):
            if digits not in clean_phones:
                clean_phones.append(digits)

    if not clean_phones:
        continue

    phone = clean_phones[0]
    p_suffix = phone[-9:]
    if p_suffix in seen_phones:
        continue

    wa = clean_phones[1] if len(clean_phones) > 1 else phone

    # Price
    price_m = re.search(r'(?:Rs\.?|LKR)\s*([\d,]+)', ad_html, re.I)
    if price_m:
        raw_price = price_m.group(1).replace(',', '')
        try:
            price = float(raw_price)
        except:
            price = 5000.0
    else:
        price = 5000.0
    if price < 500 or price > 100000:
        price = 5000.0

    # Location
    loc_m = re.search(r'<i class="[^"]*map[^"]*"></i>\s*([^<]+)', ad_html, re.I)
    location = loc_m.group(1).strip() if loc_m else "Colombo"
    location = re.sub(r'\s+', ' ', location)
    if not location or len(location) < 3 or location == 'All Island':
        location = "Colombo"

    # Description
    desc_m = re.search(r'<div class="[^"]*description[^"]*"[^>]*>(.*?)</div>', ad_html, re.S | re.I)
    if desc_m:
        desc_raw = re.sub(r'<[^>]+>', ' ', desc_m.group(1))
        clean_desc = html_lib.unescape(desc_raw)
        clean_desc = re.sub(r'\s+', ' ', clean_desc).strip()
    else:
        clean_desc = f"{clean_title}. Genuine service available. Contact: {phone}."

    if len(clean_desc) < 20:
        clean_desc = f"{clean_title}. Safe and professional services. For more details and appointments call or WhatsApp {phone}."

    # Category determination
    lower_text = (clean_title + " " + ad_html[:3000]).lower()
    if any(k in lower_text for k in ['live cam', 'cam show', 'video call', 'cam service']):
        category_id = 5 # Live Cam
    elif any(k in lower_text for k in ['spa', 'massage', 'wellness', 'ayurveda']):
        category_id = 6 # Spa & Wellness Services
    elif any(k in lower_text for k in ['shemale', 'crossdresser', 'ladyboy']):
        category_id = 3 # Shemale Personal
    elif any(k in lower_text for k in ['boy', 'gentlemen', 'handsome boy', 'male escort']):
        category_id = 2 # Boys Personal
    elif any(k in lower_text for k in ['room', 'apartment', 'house for rent', 'boardim']):
        category_id = 7 # Rooms
    else:
        category_id = 1 # Girls Personal

    # Download image
    ext = os.path.splitext(img_url)[1]
    if not ext or ext.lower() not in ['.jpg', '.jpeg', '.png', '.webp']:
        ext = '.jpg'
    img_filename = f"oct26_ad_{len(fresh_ads)+1}_{phone}{ext}"
    dest1 = os.path.join(storage_dir, img_filename)
    dest2 = os.path.join(public_storage_dir, img_filename)

    if not download_image(img_url, [dest1, dest2]):
        continue

    seen_phones.add(p_suffix)
    ad_item = {
        'num': len(fresh_ads) + 1,
        'title': clean_title,
        'description': clean_desc,
        'price': price,
        'location': location,
        'phone': phone,
        'whatsapp': wa,
        'category_id': category_id,
        'image': img_filename,
        'source_url': ad_url
    }
    fresh_ads.append(ad_item)
    print(f"[{len(fresh_ads)}/50] Fetched: {clean_title[:35]} | Phone: {phone} | Loc: {location} | Cat: {category_id}", flush=True)
    time.sleep(0.1)

print(f"\nSuccessfully collected {len(fresh_ads)} fresh ads with images!", flush=True)

with open('ads_batch_50_oct26.json', 'w', encoding='utf-8') as f:
    json.dump(fresh_ads, f, ensure_ascii=False, indent=2)

print("Saved to ads_batch_50_oct26.json", flush=True)
