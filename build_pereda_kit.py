import json
import csv
import html
import re

with open('lankaad_pereda_20_contacts.json', 'r', encoding='utf-8') as f:
    contacts = json.load(f)

# 1. Generate VCF File
vcf_path = 'public/lankaad_pereda_20.vcf'
with open(vcf_path, 'w', encoding='utf-8') as f:
    for c in contacts:
        cid = c['id']
        title_clean = re.sub(r'[^\w\s\u0D80-\u0DFF-]', '', c['title'])[:25].strip()
        f.write("BEGIN:VCARD\n")
        f.write("VERSION:3.0\n")
        f.write(f"FN:LankaAd Pereda {cid:02d} {title_clean}\n")
        f.write(f"TEL;TYPE=CELL:{c['local_phone']}\n")
        f.write(f"NOTE:Posted: {c['date_published']} | Expiry/Pereda lead for TinTinAds\n")
        f.write("END:VCARD\n")
print(f"Generated {vcf_path}")

# 2. Generate CSV File
csv_path = 'public/lankaad_pereda_20.csv'
with open(csv_path, 'w', newline='', encoding='utf-8-sig') as f:
    writer = csv.writer(f)
    writer.writerow(['ID', 'Phone (Local)', 'WhatsApp Link', 'Call Link', 'Date Published', 'Location', 'Title', 'Original LankaAd URL'])
    for c in contacts:
        writer.writerow([
            c['id'],
            c['local_phone'],
            f"https://wa.me/{c['whatsapp_phone']}",
            f"tel:{c['local_phone']}",
            c['date_published'],
            c['location'],
            c['title'],
            c['ad_url']
        ])
print(f"Generated {csv_path}")

# 3. Generate Interactive HTML Calling Sheet
html_content = f'''<!DOCTYPE html>
<html lang="si">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>LankaAd පෙරේදා (Oct 21) Ads - 20 WhatsApp Leads</title>
    <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" rel="stylesheet">
    <style>
        * {{ margin: 0; padding: 0; box-sizing: border-box; }}
        body {{
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
            background: #0f172a;
            color: #f8fafc;
            padding: 16px;
            max-width: 800px;
            margin: 0 auto;
        }}
        .header {{
            background: linear-gradient(135deg, #ec4899, #be185d);
            padding: 20px;
            border-radius: 16px;
            margin-bottom: 20px;
            text-align: center;
            box-shadow: 0 10px 25px -5px rgba(236, 72, 153, 0.4);
        }}
        .header h1 {{ font-size: 20px; font-weight: 900; margin-bottom: 6px; }}
        .header p {{ font-size: 13px; opacity: 0.95; }}
        .actions {{
            display: flex;
            gap: 10px;
            margin-top: 15px;
            justify-content: center;
            flex-wrap: wrap;
        }}
        .btn {{
            display: inline-flex;
            align-items: center;
            gap: 8px;
            padding: 10px 18px;
            border-radius: 10px;
            font-size: 13px;
            font-weight: 800;
            text-decoration: none;
            color: white;
            box-shadow: 0 4px 12px rgba(0,0,0,0.3);
            transition: transform 0.15s;
        }}
        .btn:active {{ transform: scale(0.96); }}
        .btn-vcf {{ background: #10b981; }}
        .btn-csv {{ background: #3b82f6; }}
        .card {{
            background: #1e293b;
            border: 1px solid #334155;
            border-radius: 14px;
            padding: 14px 16px;
            margin-bottom: 12px;
            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: 12px;
        }}
        .card-info {{ flex: 1; min-width: 0; }}
        .card-num {{
            display: inline-block;
            background: #38bdf8;
            color: #0f172a;
            font-weight: 900;
            font-size: 11px;
            padding: 2px 8px;
            border-radius: 6px;
            margin-bottom: 4px;
        }}
        .card-phone {{
            font-size: 18px;
            font-weight: 900;
            color: #facc15;
            letter-spacing: 0.5px;
        }}
        .card-title {{
            font-size: 12px;
            color: #cbd5e1;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
            margin-top: 2px;
        }}
        .card-meta {{
            font-size: 11px;
            color: #94a3b8;
            margin-top: 4px;
        }}
        .btn-group {{
            display: flex;
            gap: 8px;
            flex-shrink: 0;
        }}
        .act-btn {{
            display: inline-flex;
            align-items: center;
            justify-content: center;
            width: 44px;
            height: 44px;
            border-radius: 12px;
            font-size: 18px;
            color: white;
            text-decoration: none;
            box-shadow: 0 4px 10px rgba(0,0,0,0.3);
        }}
        .act-call {{ background: #f59e0b; }}
        .act-wa {{ background: #22c55e; }}
    </style>
</head>
<body>
    <div class="header">
        <h1><i class="fas fa-address-book"></i> LankaAd පෙරේදා (Oct 21) Ads - 20 Leads</h1>
        <p>පෙරේදා පළවූ සහ Expire වන දැන්වීම් හිමි, WhatsApp සහිත සක්‍රීය අංක 20</p>
        <div class="actions">
            <a href="/download-pereda-vcf" class="btn btn-vcf"><i class="fas fa-file-import"></i> Save to Phone (VCF)</a>
            <a href="/download-pereda-csv" class="btn btn-csv"><i class="fas fa-file-csv"></i> Download CSV</a>
        </div>
    </div>
'''

for c in contacts:
    html_content += f'''
    <div class="card">
        <div class="card-info">
            <span class="card-num">#{c['id']:02d}</span>
            <div class="card-phone">{c['local_phone']}</div>
            <div class="card-title">{c['title']}</div>
            <div class="card-meta"><i class="fas fa-calendar-alt"></i> {c['date_published']} • <i class="fas fa-map-marker-alt"></i> {c['location']}</div>
        </div>
        <div class="btn-group">
            <a href="tel:{c['local_phone']}" class="act-btn act-call" title="Normal Call"><i class="fas fa-phone-alt"></i></a>
            <a href="https://wa.me/{c['whatsapp_phone']}?text=Hi,%20TinTinAds.com%20%E0%B6%91%E0%B6%9A%E0%B7%99%E0%B6%B1%E0%B7%8A%20%E0%B6%9A%E0%B6%AD%E0%B7%8F%20%E0%B6%9A%E0%B6%BB%E0%B6%B1%E0%B7%8A%E0%B6%B1%E0%B7%9A" target="_blank" class="act-btn act-wa" title="WhatsApp Chat"><i class="fab fa-whatsapp"></i></a>
        </div>
    </div>
'''

html_content += '''
</body>
</html>
'''

with open('public/pereda_calling_sheet.html', 'w', encoding='utf-8') as f:
    f.write(html_content)

print("Generated public/pereda_calling_sheet.html")
