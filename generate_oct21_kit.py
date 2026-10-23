import json
import csv
import re
import os

def build_kit():
    json_path = 'lankaad_hela_oct21_100_leads.json'
    if not os.path.exists(json_path):
        print(f"File {json_path} does not exist yet.")
        return

    with open(json_path, 'r', encoding='utf-8') as f:
        contacts = json.load(f)

    print(f"Loaded {len(contacts)} leads from {json_path}")

    # 1. Generate VCF
    vcf_path = 'public/oct21_100_leads.vcf'
    with open(vcf_path, 'w', encoding='utf-8') as f:
        for c in contacts:
            cid = c['id']
            title_clean = re.sub(r'[^\w\s\u0D80-\u0DFF-]', '', c['title'])[:25].strip()
            f.write("BEGIN:VCARD\n")
            f.write("VERSION:3.0\n")
            f.write(f"FN:Oct21 Lead {cid:03d} - {title_clean}\n")
            f.write(f"TEL;TYPE=CELL:{c['raw_local']}\n")
            f.write(f"NOTE:Source: {c['source']} | Date: 2026-10-21 | Loc: {c['location']} | Lead for TinTinAds\n")
            f.write("END:VCARD\n")
    print(f"Generated {vcf_path}")

    # 2. Generate CSV
    csv_path = 'public/oct21_100_leads.csv'
    with open(csv_path, 'w', newline='', encoding='utf-8-sig') as f:
        writer = csv.writer(f)
        writer.writerow([
            'ID',
            'Source',
            'Phone (Local)',
            'WhatsApp Direct Link',
            'Call Link',
            'Date Published',
            'Location',
            'Title / Service',
            'Intent Score',
            'Original Ad URL'
        ])
        for c in contacts:
            writer.writerow([
                c['id'],
                c['source'],
                c['local_phone'],
                f"https://wa.me/{c['whatsapp_phone']}",
                f"tel:{c['raw_local']}",
                c['date_published'],
                c['location'],
                c['title'],
                c.get('intent_score', 0),
                c['ad_url']
            ])
    print(f"Generated {csv_path}")

    # 3. Generate Interactive Calling Sheet HTML
    html_content = f'''<!DOCTYPE html>
<html lang="si">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Oct 21 (පෙරේදා) Top 100 Hot Leads — LankaAd & HelaLanka</title>
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
            background: linear-gradient(135deg, #e11d48, #9333ea);
            padding: 20px;
            border-radius: 18px;
            margin-bottom: 16px;
            text-align: center;
            box-shadow: 0 10px 30px -5px rgba(225, 29, 72, 0.4);
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
        .search-input:focus {{ border-color: #ec4899; }}

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
        .card:hover {{ border-color: #ec4899; }}
        .card-info {{ flex: 1; min-width: 0; }}
        .badges {{
            display: flex;
            gap: 6px;
            align-items: center;
            margin-bottom: 5px;
        }}
        .card-num {{
            background: #38bdf8;
            color: #0f172a;
            font-weight: 900;
            font-size: 11px;
            padding: 2px 7px;
            border-radius: 5px;
        }}
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
        .btn-group {{
            display: flex;
            gap: 8px;
            flex-shrink: 0;
        }}
        .act-btn {{
            display: inline-flex;
            align-items: center;
            justify-content: center;
            width: 46px;
            height: 46px;
            border-radius: 12px;
            font-size: 19px;
            color: white;
            text-decoration: none;
            box-shadow: 0 4px 10px rgba(0,0,0,0.3);
            transition: transform 0.1s;
        }}
        .act-btn:active {{ transform: scale(0.92); }}
        .act-call {{ background: #d97706; }}
        .act-wa {{ background: #22c55e; }}

        .pitch-banner {{
            background: #1e1b4b;
            border: 1px dashed #6366f1;
            border-radius: 12px;
            padding: 12px;
            margin-bottom: 14px;
            font-size: 12px;
            line-height: 1.5;
            color: #c7d2fe;
        }}
        .pitch-banner b {{ color: #facc15; }}
    </style>
</head>
<body>
    <div class="header">
        <h1><i class="fas fa-fire-flame-curved"></i> Oct 21 Top 100 Hot Leads</h1>
        <p>LankaAd & HelaLanka මත ඔක්තෝබර් 21 පළවූ, Expire වෙමින් පවතින සහ TinTinAds වෙත දැන්වීම් ලබාගැනීමට වඩාත්ම සම්භාවිතාව ඇති සක්‍රීය අංක 100</p>
        <div class="stats-badge">
            <span><i class="fas fa-check-circle"></i> 100 Verified Leads</span>
            <span><i class="fab fa-whatsapp"></i> 100% WhatsApp Ready</span>
        </div>
        <div class="actions">
            <a href="/download-oct21-vcf" class="btn btn-vcf"><i class="fas fa-user-plus"></i> Save 100 to Phone (VCF)</a>
            <a href="/download-oct21-csv" class="btn btn-csv"><i class="fas fa-file-csv"></i> Download CSV</a>
            <a href="https://tintinads.com" target="_blank" class="btn btn-tintin"><i class="fas fa-globe"></i> TinTinAds.com</a>
        </div>
    </div>

    <div class="pitch-banner">
        💡 <b>Quick Pitch Reminder:</b> <i>"මම TinTinAds.com එකෙන් කතා කරන්නේ. ඔයා දාපු ad එක expire වෙලා නේද? අපේ සයිට් එකෙයි VIP Telegram Group එකෙයි හොඳටම views එනවා. අද ඔයාට විශේෂ offer එකක් විදියට <b>රු. 1,500/=</b> ටම ad එක දාලා දෙන්න පුළුවන්!"</i>
    </div>

    <div class="search-box">
        <input type="text" id="searchInput" class="search-input" placeholder="Search number, location (e.g. Colombo), or keyword..." onkeyup="filterCards()">
    </div>

    <div id="cardsList">
'''

    for c in contacts:
        source_class = 'source-lankaad' if c['source'] == 'LankaAd' else 'source-helalanka'
        encoded_wa_msg = f"Hi,%20TinTinAds.com%20%E0%B6%91%E0%B6%9A%E0%B7%99%E0%B6%B1%E0%B7%8A%20%E0%B6%9A%E0%B6%AD%E0%B7%8F%20%E0%B6%9A%E0%B6%BB%E0%B6%B1%E0%B7%8A%E0%B6%B1%E0%B7%9A.%20%E0%B6%94%E0%B6%BA%E0%B7%8F%20{c['source']}%20%E0%B6%91%E0%B6%9A%E0%B7%9A%20%E0%B6%AF%E0%B7%8F%E0%B6%BD%E0%B7%8F%20%E0%B6%AD%E0%B7%92%E0%B6%B6%E0%B7%94%E0%B6%AB%E0%B7%94%20ad%20%E0%B6%91%E0%B6%9A%20%E0%B6%AF%E0%B7%90%E0%B6%9A%E0%B7%8A%E0%B6%9A%E0%B7%8F."
        html_content += f'''
        <div class="card" data-search="{c['raw_local']} {c['location'].lower()} {c['title'].lower()} {c['source'].lower()}">
            <div class="card-info">
                <div class="badges">
                    <span class="card-num">#{c['id']:03d}</span>
                    <span class="source-tag {source_class}">{c['source']}</span>
                </div>
                <div class="card-phone">{c['local_phone']}</div>
                <div class="card-title">{c['title']}</div>
                <div class="card-meta"><i class="fas fa-map-marker-alt"></i> {c['location']} • <i class="fas fa-calendar-alt"></i> 2026-10-21</div>
            </div>
            <div class="btn-group">
                <a href="tel:{c['raw_local']}" class="act-btn act-call" title="Call directly"><i class="fas fa-phone-alt"></i></a>
                <a href="https://wa.me/{c['whatsapp_phone']}?text={encoded_wa_msg}" target="_blank" class="act-btn act-wa" title="WhatsApp Chat"><i class="fab fa-whatsapp"></i></a>
            </div>
        </div>
'''

    html_content += '''
    </div>

    <script>
        function filterCards() {
            var q = document.getElementById('searchInput').value.toLowerCase();
            var cards = document.getElementsByClassName('card');
            for (var i = 0; i < cards.length; i++) {
                var searchData = cards[i].getAttribute('data-search');
                if (searchData.indexOf(q) > -1) {
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

    html_path = 'public/oct21_calling_sheet.html'
    with open(html_path, 'w', encoding='utf-8') as f:
        f.write(html_content)

    print(f"Generated {html_path}")

if __name__ == '__main__':
    build_kit()
