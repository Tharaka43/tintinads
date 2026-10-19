import json
import csv
import re
import os
import urllib.request
import ssl
import sys
import time
from concurrent.futures import ThreadPoolExecutor, as_completed

sys.stdout.reconfigure(encoding='utf-8')

ctx = ssl.create_default_context()
ctx.check_hostname = False
ctx.verify_mode = ssl.CERT_NONE

headers = {'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'}

# 1. Load existing phone suffixes to know which ones are brand new
existing_phone_suffixes = set()

for fpath in ['all_120_ads.json', 'public/hela_new_advertisers.csv', 'public/hela_advertisers.csv']:
    if os.path.exists(fpath):
        try:
            content = open(fpath, 'r', encoding='utf-8').read()
            for p in re.findall(r'07[0-9]{8}', content):
                existing_phone_suffixes.add(p[-9:])
        except Exception:
            pass

print(f"Loaded {len(existing_phone_suffixes)} existing phone numbers to identify brand-new leads.")

# 2. Gather candidate ad URLs from lk-ads.com
candidate_urls = set()

def fetch_listing(url):
    try:
        req = urllib.request.Request(url, headers=headers)
        with urllib.request.urlopen(req, context=ctx, timeout=10) as resp:
            html = resp.read().decode('utf-8', errors='ignore')
            found = re.findall(r'href="(https://lk-ads\.com/ads/[^"#?]+)"', html)
            return set(found)
    except Exception:
        return set()

pages_to_crawl = []
# Homepage pagination (latest ads across all categories)
for p in range(1, 11):
    pages_to_crawl.append(f'https://lk-ads.com/page/{p}/')

# Category pagination
for cat in ['girls-personal', 'live-cam', 'spa-massage', 'shemale', 'boys-personal']:
    for p in range(1, 6):
        pages_to_crawl.append(f'https://lk-ads.com/ads-category/{cat}/page/{p}/')

print(f"Harvesting ad URLs from {len(pages_to_crawl)} listing pages on lk-ads.com...")

with ThreadPoolExecutor(max_workers=8) as executor:
    futures = [executor.submit(fetch_listing, u) for u in pages_to_crawl]
    for fut in as_completed(futures):
        candidate_urls.update(fut.result())

print(f"Total candidate ad URLs collected from lk-ads.com: {len(candidate_urls)}")

# 3. Process each ad URL to extract Phone, WhatsApp, Title, Price, Location, Category
def parse_ad(url):
    try:
        req = urllib.request.Request(url, headers=headers)
        with urllib.request.urlopen(req, context=ctx, timeout=10) as resp:
            html = resp.read().decode('utf-8', errors='ignore')
            
            # Extract phone numbers
            phones = re.findall(r'(?:\+?94|0)7[0-9]{8}', html)
            clean_phones = []
            for p in phones:
                digits = re.sub(r'[^0-9]', '', p)
                if digits.startswith('94') and len(digits) == 11:
                    digits = '0' + digits[2:]
                if len(digits) == 10 and digits.startswith('07'):
                    if digits not in clean_phones:
                        clean_phones.append(digits)
            
            if not clean_phones:
                return None
            
            phone = clean_phones[0]
            wa = clean_phones[1] if len(clean_phones) > 1 else phone
            
            # Title
            title_m = re.search(r'<title>(.*?)</title>', html)
            raw_title = title_m.group(1) if title_m else ""
            clean_title = re.sub(r'[\r\n|\-]+.*New Lanka Ads.*$', '', raw_title, flags=re.I).strip()
            clean_title = re.sub(r'&amp;', '&', clean_title)
            clean_title = re.sub(r'&quot;', '"', clean_title)
            clean_title = re.sub(r'\s+', ' ', clean_title)[:75].strip()
            if not clean_title:
                clean_title = "LK-Ads Advertiser"
            
            # Price
            price_m = re.search(r'(?:Rs\.?|LKR)\s*([\d,]+)', html, re.I)
            price = 5000.0
            if price_m:
                try:
                    price = float(price_m.group(1).replace(',', ''))
                except:
                    pass
            if price < 500 or price > 100000:
                price = 5000.0
            
            # Location
            loc = "Colombo"
            common_cities = ['Colombo', 'Gampaha', 'Kandy', 'Negombo', 'Kurunegala', 'Galle', 'Matara', 'Kalutara', 'Kiribathgoda', 'Dehiwala', 'Nugegoda', 'Maharagama', 'Kollupitiya', 'Bambalapitiya', 'Mount Lavinia', 'Malabe', 'Kaduwela', 'Pettah', 'Wattala', 'Ja-Ela', 'Moratuwa', 'Panadura', 'Jaffna', 'Batticaloa', 'Trincomalee', 'Anuradhapura']
            combined_text = (clean_title + " " + html[:3000])
            for city in common_cities:
                if city.lower() in combined_text.lower():
                    loc = city
                    break
            
            # Category
            lower_text = combined_text.lower()
            if 'cam' in lower_text or 'video show' in lower_text:
                cat = "Live Cam"
            elif 'spa' in lower_text or 'massage' in lower_text or 'wellness' in lower_text:
                cat = "Spa & Wellness Services"
            elif 'shemale' in lower_text or 'ladyboy' in lower_text or 'trans' in lower_text:
                cat = "Shemale Personal"
            elif 'boy' in lower_text or 'male' in lower_text:
                cat = "Boys Personal"
            else:
                cat = "Girls Personal"
            
            is_new = (phone[-9:] not in existing_phone_suffixes) and (wa[-9:] not in existing_phone_suffixes)
            
            return {
                'title': clean_title,
                'phone': phone,
                'whatsapp': wa,
                'location': loc,
                'category': cat,
                'price': price,
                'url': url,
                'is_new': is_new
            }
    except Exception:
        return None

print(f"Scraping detailed advertiser profiles from {len(candidate_urls)} URLs (using 10 workers)...")

all_records = []
seen_phones = set()
unique_advertisers = []

with ThreadPoolExecutor(max_workers=10) as executor:
    futures = {executor.submit(parse_ad, u): u for u in candidate_urls}
    done_count = 0
    for fut in as_completed(futures):
        done_count += 1
        res = fut.result()
        if res:
            all_records.append(res)
            suffix = res['phone'][-9:]
            if suffix not in seen_phones:
                seen_phones.add(suffix)
                unique_advertisers.append(res)
        if done_count % 100 == 0 or done_count == len(candidate_urls):
            print(f"Progress: {done_count}/{len(candidate_urls)} URLs processed. Found {len(unique_advertisers)} unique advertisers.")

print(f"\n==========================================")
print(f"✅ Extracted {len(unique_advertisers)} UNIQUE ADVERTISERS from lk-ads.com!")
new_count = sum(1 for a in unique_advertisers if a['is_new'])
print(f"🌟 Brand New Leads (never seen in previous DB): {new_count}")
print(f"==========================================\n")

# Save to JSON
with open('scraped_lkads_advertisers.json', 'w', encoding='utf-8') as f:
    json.dump(unique_advertisers, f, ensure_ascii=False, indent=2)

print("Saved to scraped_lkads_advertisers.json")
