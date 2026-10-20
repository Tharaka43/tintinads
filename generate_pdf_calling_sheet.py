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
    for b in ['sex', 'fuck', 'badu', 'spa massage service', 'xxx']:
        t = re.sub(re.escape(b), '', t, flags=re.IGNORECASE)
    t = re.sub(r'\s+', ' ', t).strip()
    return t[:35] if len(t) > 35 else t

# Load data
with open('scraped_hela_brand_new_advertisers.json', 'r', encoding='utf-8') as f:
    hela = json.load(f)
with open('scraped_lkads_advertisers.json', 'r', encoding='utf-8') as f:
    lkads = json.load(f)

existing_phones = set()
for fn in ['inserted_20_ads.json', 'inserted_batch2_ads.json', 'scraped_batch6_20_ads.json']:
    if os.path.exists(fn):
        with open(fn, 'r', encoding='utf-8') as f:
            for item in json.load(f):
                p = norm(item.get('contact_phone') or item.get('phone'))
                w = norm(item.get('contact_whatsapp') or item.get('whatsapp'))
                if p: existing_phones.add(p)
                if w: existing_phones.add(w)

untapped = []
seen = set()

for item in hela:
    p = norm(item.get('phone'))
    w = norm(item.get('whatsapp'))
    key = p or w
    if key and key not in existing_phones and key not in seen:
        seen.add(key)
        if p: seen.add(p)
        if w: seen.add(w)
        item['source'] = 'Hela'
        untapped.append(item)

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

# Logo
logo_b64 = ''
if os.path.exists('public/assets/siteicon.png'):
    with open('public/assets/siteicon.png', 'rb') as f:
        logo_b64 = base64.b64encode(f.read()).decode('utf-8')

table_rows = []
for i, u in enumerate(untapped, 1):
    t = clean_title(u.get('title', ''))
    loc = u.get('location') or 'Other'
    p = norm(u.get('phone'))
    w = norm(u.get('whatsapp'))
    if not p and w:
        p = w
    p_fmt = format_sl(p)
    w_fmt = format_sl(w)
    
    wa_text = '<span style="color:#059669; font-weight:bold;">Call අංකයමයි</span>'
    if w and p != w:
        wa_text = f'<span style="color:#2563eb; font-weight:bold;">WA: {w_fmt}</span>'
    elif not w:
        wa_text = '<span style="color:#dc2626;">Phone පමණි</span>'
    
    src = u.get('source', '')
    
    tr = f'''<tr>
        <td style="text-align:center; font-weight:bold; color:#64748b;">{i}</td>
        <td><strong>{t}</strong><br><span style="font-size:9px; color:#64748b;">{loc} ({src})</span></td>
        <td style="text-align:center; font-family:monospace; font-weight:bold; color:#1d4ed8; font-size:11px;">{p_fmt}</td>
        <td style="font-size:10px;">{wa_text}</td>
        <td style="text-align:center;"><span style="display:inline-block; width:13px; height:13px; border:1px solid #94a3b8; border-radius:2px;"></span></td>
        <td style="font-size:9px; color:#475569;">[ ] කැමතියි &nbsp; [ ] පසුව &nbsp; [ ] No Ans &nbsp; [ ] Rej</td>
    </tr>'''
    table_rows.append(tr)

body_html = '\n'.join(table_rows)

print_html = f'''<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<title>TinTinAds.com - Official Agent Calling List & Pitch Guide</title>
<style>
    @page {{
        size: A4 portrait;
        margin: 8mm 8mm 8mm 8mm;
    }}
    body {{
        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif;
        color: #1e293b;
        margin: 0;
        padding: 0;
        font-size: 9.5px;
        line-height: 1.3;
    }}
    .header {{
        border-bottom: 2px solid #eab308;
        padding-bottom: 6px;
        margin-bottom: 8px;
        display: flex;
        align-items: center;
        justify-content: space-between;
    }}
    .brand {{
        display: flex;
        align-items: center;
        gap: 10px;
    }}
    .brand img {{
        width: 44px;
        height: 44px;
        border-radius: 8px;
    }}
    .brand h1 {{
        margin: 0;
        font-size: 17px;
        color: #0f172a;
    }}
    .brand p {{
        margin: 2px 0 0 0;
        color: #64748b;
        font-size: 10.5px;
    }}
    .badge {{
        background: #fef08a;
        color: #854d0e;
        padding: 3px 8px;
        border-radius: 12px;
        font-weight: bold;
        font-size: 10px;
    }}
    .pitch-box {{
        background: #fffbeb;
        border: 1px solid #fde68a;
        border-radius: 6px;
        padding: 8px 12px;
        margin-bottom: 10px;
        page-break-inside: avoid;
    }}
    .pitch-title {{
        font-weight: bold;
        color: #92400e;
        margin-bottom: 4px;
        font-size: 11px;
    }}
    .pitch-step {{
        margin-bottom: 3px;
    }}
    .pitch-step strong {{
        color: #1e40af;
    }}
    table {{
        width: 100%;
        border-collapse: collapse;
        font-size: 9px;
    }}
    th {{
        background: #f1f5f9;
        color: #334155;
        font-weight: bold;
        border: 1px solid #cbd5e1;
        padding: 5px 4px;
        text-align: left;
    }}
    td {{
        border: 1px solid #e2e8f0;
        padding: 3.5px 4px;
        vertical-align: middle;
    }}
    tr:nth-child(even) {{
        background: #f8fafc;
    }}
    tr {{
        page-break-inside: avoid;
    }}
    thead {{
        display: table-header-group;
    }}
</style>
</head>
<body>

<div class="header">
    <div class="brand">
        <img src="data:image/png;base64,{logo_b64}" alt="Logo">
        <div>
            <h1>TinTinAds.com — Customer Outreach Calling Sheet</h1>
            <p>නියෝජිතවරියගේ ඇමතුම් නාමලේඛනය & නිල කතා කිරීමේ පිටපත | Total Contacts: 591 Active Leads</p>
        </div>
    </div>
    <div>
        <span class="badge">Official Agent Document</span>
    </div>
</div>

<div class="pitch-box">
    <div class="pitch-title">📞 නියෝජිතවරිය කතා කළ යුතු ආකාරය (Official Calling Script):</div>
    <div class="pitch-step">
        <strong>1. සුබපැතුම:</strong> "හෙලෝ අක්කේ / නංගී, සුබ දවසක්! මම TinTinAds.com සයිට් එකෙන් කතා කරන්නේ. ඔයාගේ දැන්වීමක් දැකලා සුබ ආරංචියක් දෙන්න කතා කළේ."
    </div>
    <div class="pitch-step">
        <strong>2. පිරිනැමීම:</strong> "අපි ඔයාගේ දැන්වීම අපේ TinTinAds සයිට් එකේ <strong>නොමිලේම (Free VIP) දින 7ක් දාලා දෙන්න</strong> තීරණය කළා. කිසිම මුදලක් අය කරන්නේ නෑ! දවසට දහස් ගණනක් බලන නිසා ඔයාට හොඳට Calls & WhatsApp මැසේජ් ලැබෙයි."
    </div>
    <div class="pitch-step">
        <strong>3. WhatsApp සම්බන්ධ කිරීම:</strong> "අපේ Agent කෙනෙක් ඔයාගේ WhatsApp එකට සයිට් එකේ link එක එවයි. ඔයාගේ ad එක දාලා නැත්නම් විස්තර සහ photos 2-3ක් එවල නොමිලේම දාගන්න."
    </div>
    <div style="font-size:8.5px; color:#b45309; margin-top:4px;">
        * සල්ලි ගන්නවද ඇහුවොත්: "නැහැ, දින 7ක් නොමිලේමයි." &nbsp;|&nbsp; සයිට් එක: "TinTinAds.com" &nbsp;|&nbsp; නීතිය: කාරුණිකව මිත්‍රශීලීව කතා කරන්න. &nbsp;|&nbsp; කතා කළ පසු Checkbox එක [✓] Mark කරන්න.
    </div>
</div>

<table>
    <thead>
        <tr>
            <th style="width:25px; text-align:center;">#</th>
            <th>දැන්වීම්කරුගේ විස්තරය (Name/Location)</th>
            <th style="width:95px; text-align:center;">Calling Phone</th>
            <th style="width:115px;">WhatsApp තත්ත්වය</th>
            <th style="width:35px; text-align:center;">Done</th>
            <th style="width:160px;">ප්‍රතිචාරය / සටහන් (Status & Notes)</th>
        </tr>
    </thead>
    <tbody>
        {body_html}
    </tbody>
</table>

</body>
</html>'''

with open('public/print_calling_list.html', 'w', encoding='utf-8') as f:
    f.write(print_html)

print('Generated public/print_calling_list.html successfully!')

edge = r'C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe'
html_path = os.path.abspath('public/print_calling_list.html')
pdf_path = os.path.abspath('public/TinTinAds_Agent_Calling_List.pdf')

print("Running Edge headless print to PDF...")
cmd = [edge, '--headless', '--disable-gpu', '--run-all-compositor-stages-before-draw', f'--print-to-pdf={pdf_path}', html_path]
res = subprocess.run(cmd, capture_output=True, timeout=90)
if os.path.exists(pdf_path):
    size_kb = round(os.path.getsize(pdf_path) / 1024, 1)
    print(f"SUCCESS: Generated PDF at {pdf_path} ({size_kb} KB)")
else:
    print("FAILED to create PDF. Stdout:", res.stdout.decode('utf-8', errors='ignore'), "Stderr:", res.stderr.decode('utf-8', errors='ignore'))
