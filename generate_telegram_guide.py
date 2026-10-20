import os
import subprocess
import base64

# Logo
logo_b64 = ''
if os.path.exists('public/assets/siteicon.png'):
    with open('public/assets/siteicon.png', 'rb') as f:
        logo_b64 = base64.b64encode(f.read()).decode('utf-8')

html_content = f'''<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<title>TinTinAds - Telegram Channel සෑදීම සහ Access පැවරීමේ නිල මාර්ගෝපදේශය</title>
<style>
    @page {{
        size: A4 portrait;
        margin: 12mm 12mm 12mm 12mm;
    }}
    body {{
        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif;
        color: #1e293b;
        margin: 0;
        padding: 0;
        font-size: 11pt;
        line-height: 1.5;
        background-color: #ffffff;
    }}
    .header {{
        border-bottom: 2px solid #2563eb;
        padding-bottom: 12px;
        margin-bottom: 16px;
        display: flex;
        align-items: center;
        justify-content: space-between;
    }}
    .brand {{
        display: flex;
        align-items: center;
        gap: 12px;
    }}
    .brand img {{
        width: 52px;
        height: 52px;
        border-radius: 12px;
    }}
    .brand h1 {{
        margin: 0;
        font-size: 20px;
        color: #0f172a;
    }}
    .brand p {{
        margin: 2px 0 0 0;
        color: #64748b;
        font-size: 11px;
    }}
    .badge {{
        background: #dbeafe;
        color: #1e40af;
        padding: 4px 10px;
        border-radius: 20px;
        font-weight: bold;
        font-size: 11px;
    }}
    .target-box {{
        background: #f8fafc;
        border: 2px dashed #94a3b8;
        border-radius: 10px;
        padding: 12px 16px;
        margin-bottom: 20px;
    }}
    .target-title {{
        font-weight: 800;
        color: #0f172a;
        font-size: 13px;
        margin-bottom: 6px;
    }}
    .step-card {{
        background: #ffffff;
        border: 1px solid #e2e8f0;
        border-radius: 10px;
        padding: 14px 18px;
        margin-bottom: 14px;
        page-break-inside: avoid;
        box-shadow: 0 1px 3px rgba(0,0,0,0.05);
    }}
    .step-num {{
        display: inline-block;
        background: #2563eb;
        color: #ffffff;
        font-weight: 800;
        font-size: 12px;
        padding: 2px 8px;
        border-radius: 6px;
        margin-right: 6px;
    }}
    .step-title {{
        font-size: 14px;
        font-weight: 800;
        color: #1e293b;
        display: inline-block;
    }}
    .step-desc {{
        margin-top: 8px;
        color: #334155;
        font-size: 10.5pt;
    }}
    .highlight-box {{
        background: #eff6ff;
        border-left: 4px solid #3b82f6;
        padding: 8px 12px;
        margin: 8px 0;
        font-size: 10pt;
        border-radius: 0 6px 6px 0;
    }}
    .code-box {{
        background: #0f172a;
        color: #38bdf8;
        font-family: monospace;
        padding: 8px 12px;
        border-radius: 6px;
        font-size: 11pt;
        font-weight: bold;
        margin: 6px 0;
        display: inline-block;
    }}
    .perm-list {{
        margin: 6px 0;
        padding-left: 20px;
        font-size: 10pt;
    }}
    .perm-list li {{
        margin-bottom: 4px;
    }}
    .important-notice {{
        background: #fef2f2;
        border: 1px solid #fecaca;
        border-radius: 8px;
        padding: 10px 14px;
        margin-top: 14px;
        font-size: 10pt;
        color: #991b1b;
        page-break-inside: avoid;
    }}
    .btn-print {{
        display: inline-block;
        background: #2563eb;
        color: white;
        padding: 8px 16px;
        border-radius: 8px;
        text-decoration: none;
        font-weight: bold;
        font-size: 12px;
    }}
    @media print {{
        .no-print {{
            display: none !important;
        }}
    }}
</style>
</head>
<body>

<div class="header">
    <div class="brand">
        <img src="data:image/png;base64,{logo_b64}" alt="Logo">
        <div>
            <h1>TinTinAds.com</h1>
            <p>නිල Telegram Channel සැකසීම සහ Access පැවරීමේ පියවරෙන් පියවර මාර්ගෝපදේශය</p>
        </div>
    </div>
    <div class="no-print">
        <span class="badge">Official Guide</span>
    </div>
</div>

<div class="target-box">
    <div class="target-title">📌 මෙම මාර්ගෝපදේශයේ ප්‍රධාන අරමුණ:</div>
    <div style="font-size: 10.5pt; color: #334155;">
        TinTinAds.com සඳහා නිල Telegram Channel එකක් සාදා, එහි <strong>සම්පූර්ණ පරිපාලක (Full Admin) බලතල</strong> පහත දුරකථන අංකය සතු පුද්ගලයාට ලබාදීමයි:
        <br>
        <span class="code-box">📞 Full Admin අංකය: 0704259059</span>
    </div>
</div>

<!-- Step 1 -->
<div class="step-card">
    <div>
        <span class="step-num">Step 1</span>
        <span class="step-title">Telegram හි අලුත් Channel එකක් සෑදීම (New Channel)</span>
    </div>
    <div class="step-desc">
        1. ඔබගේ දුරකථනයේ <strong>Telegram App</strong> එක විවෘත කරන්න.
        <br>
        2. පහළ දකුණු කෙළවරේ ඇති <strong>Pencil (පෑන) ලකුණ</strong> මත Click කරන්න.
        <br>
        3. එහි ඇති <strong>"New Channel"</strong> තෝරන්න.
        <br>
        4. ඉන්පසු <strong>"Create Channel"</strong> බොත්තම ඔබන්න.
    </div>
</div>

<!-- Step 2 -->
<div class="step-card">
    <div>
        <span class="step-num">Step 2</span>
        <span class="step-title">Channel එකට නම සහ විස්තර (Description) ඇතුළත් කිරීම</span>
    </div>
    <div class="step-desc">
        පහත තොරතුරු ඒ අයුරින්ම Copy කර හෝ Type කර ඇතුළත් කරන්න:
        
        <div class="highlight-box">
            <strong>Channel Name (නම):</strong>
            <br>
            <span style="font-size: 12pt; font-weight: bold; color: #1e3a8a;">TinTinAds VIP 🇱🇰 (Official)</span>
            <br>
            <span style="font-size: 9pt; color: #64748b;">(හෝ TinTinAds.com | Classifieds Sri Lanka)</span>
        </div>

        <div class="highlight-box">
            <strong>Description (විස්තරය):</strong>
            <br>
            🔥 ශ්‍රී ලංකාවේ අංක 1 VIP Classifieds සහ දැන්වීම් ජාලය.
            <br>
            🌐 නිල වෙබ් අඩවිය: https://tintinads.com/
            <br>
            📞 WhatsApp Support: 070 425 9059
        </div>

        <div style="margin-top: 6px;">
            📸 <strong>Profile Photo:</strong> TinTinAds නිල Logo එක (කහ පැහැති අයිකනය) Channel Photo එක ලෙස දමන්න.
        </div>
    </div>
</div>

<!-- Step 3 -->
<div class="step-card">
    <div>
        <span class="step-num">Step 3</span>
        <span class="step-title">Channel Type එක තේරීම (Public or Private)</span>
    </div>
    <div class="step-desc">
        1. <strong>Channel Type</strong> එක සඳහා <strong>"Public Channel"</strong> තෝරන්න.
        <br>
        2. <strong>Permanent Link:</strong> සඳහා පහත handle එකක් ලබාදෙන්න (ලබාගත හැකි එකක්):
        <br>
        <span class="code-box">t.me/tintinads_official</span> &nbsp; හෝ &nbsp; <span class="code-box">t.me/tintinadslk</span>
        <br>
        *(Public Link එකක් ලබාගැනීමට නොහැකි නම් "Private Channel" තෝරා Invite Link එකක් ලබාගන්න).*
    </div>
</div>

<!-- Step 4 -->
<div class="step-card" style="border: 2px solid #2563eb; background: #fafcff;">
    <div>
        <span class="step-num" style="background: #dc2626;">Step 4 (වැදගත්ම පියවර)</span>
        <span class="step-title" style="color: #1e3a8a;">0704259059 අංකයට සම්පූර්ණ Admin Access ලබාදීම</span>
    </div>
    <div class="step-desc">
        1. මුලින්ම ඔබගේ දුරකථනයේ Contacts වලට <strong>0704259059</strong> අංකය <strong>"TinTin Admin"</strong> ලෙස Save කරගන්න.
        <br>
        2. ඔබ සෑදූ Telegram Channel එක විවෘත කර ඉහළ ඇති Channel Name එක මත Click කරන්න.
        <br>
        3. ඉහළ දකුණු කෙළවරේ ඇති <strong>Pencil (Edit)</strong> ලකුණ Click කරන්න.
        <br>
        4. එහි ඇති <strong>"Administrators"</strong> වෙත යන්න.
        <br>
        5. <strong>"Add Admin"</strong> Click කර <strong>0704259059</strong> (TinTin Admin) තෝරන්න.
        <br>
        6. එහි පහත සියලුම Permissions (බලතල) <strong>ON (Enable)</strong> කරන්න:
        <ul class="perm-list">
            <li>✅ <strong>Change Channel Info</strong> (තොරතුරු වෙනස් කිරීම)</li>
            <li>✅ <strong>Post Messages</strong> (දැන්වීම් පළ කිරීම)</li>
            <li>✅ <strong>Edit Messages of Others</strong> (පණිවිඩ සංස්කරණය)</li>
            <li>✅ <strong>Delete Messages of Others</strong> (පණිවිඩ මකා දැමීම)</li>
            <li>✅ <strong>Add Subscribers</strong> (සාමාජිකයින් එකතු කිරීම)</li>
            <li>✅ <strong>Add New Admins</strong> (අලුත් Admins ලා පත් කිරීම)</li>
        </ul>
        7. ඉහළ දකුණු කෙළවරේ ඇති <strong>හරි ලකුණ (✓ / Done)</strong> ඔබා Save කරන්න.
    </div>
</div>

<!-- Step 5 -->
<div class="step-card">
    <div>
        <span class="step-num">Step 5</span>
        <span class="step-title">හිමිකාරිත්වය පැවරීම සහ Invite Link එක ලබාදීම</span>
    </div>
    <div class="step-desc">
        1. <strong>Transfer Ownership (විකල්ප - නිර්දේශිත):</strong>  
           Admin Permissions පිටුවේ පහළම ඇති <strong>"Transfer Channel Ownership"</strong> Click කර 0704259059 අංකයට Channel එකේ පූර්ණ අයිතිය පවරන්න.
        <br><br>
        2. <strong>Invite Link එක ලබාගැනීම:</strong>  
           Channel Info පිටුවේ ඇති <strong>Invite Link</strong> එක (උදා: `https://t.me/...`) Copy කර <strong>0704259059</strong> වෙත WhatsApp හෝ Telegram මඟින් එවන්න.
    </div>
</div>

<div class="important-notice">
    <strong>⚠️ විශේෂ අවවාදයයි:</strong> Channel එක සෑදූ පසු Invite Link එක සහ 0704259059 අංකයට Full Admin බලතල ලබාදුන් බව තහවුරු කරන්න. එවිට අපට වෙබ් අඩවිය සමඟ මෙම Channel එක ක්ෂණිකව සම්බන්ධ කර වැඩ කටයුතු ආරම්භ කළ හැක.
</div>

</body>
</html>'''

with open('public/telegram_guide.html', 'w', encoding='utf-8') as f:
    f.write(html_content)
print("Generated public/telegram_guide.html successfully!")

edge = r'C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe'
html_path = os.path.abspath('public/telegram_guide.html')
pdf_path = os.path.abspath('public/TinTinAds_Telegram_Channel_Guide.pdf')

print("Generating PDF via Edge...")
cmd = [edge, '--headless', '--disable-gpu', '--run-all-compositor-stages-before-draw', f'--print-to-pdf={pdf_path}', html_path]
res = subprocess.run(cmd, capture_output=True, timeout=30)
if os.path.exists(pdf_path):
    size_kb = round(os.path.getsize(pdf_path) / 1024, 1)
    print(f"SUCCESS: Generated PDF at {pdf_path} ({size_kb} KB)")
else:
    print("FAILED to create PDF. Stdout:", res.stdout.decode('utf-8', errors='ignore'), "Stderr:", res.stderr.decode('utf-8', errors='ignore'))
