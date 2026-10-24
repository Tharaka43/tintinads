import json
import re
import os

def create_crm_html(json_file, html_out_file, title, subtitle, sheet_key):
    with open(json_file, 'r', encoding='utf-8') as f:
        contacts = json.load(f)

    html = f'''<!DOCTYPE html>
<html lang="si">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{title} — TinTinAds Leads CRM</title>
    <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" rel="stylesheet">
    <style>
        * {{ margin: 0; padding: 0; box-sizing: border-box; }}
        body {{
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
            background: #090d16;
            color: #f1f5f9;
            padding: 12px;
            max-width: 900px;
            margin: 0 auto;
        }}
        .header {{
            background: linear-gradient(135deg, #0d9488, #4f46e5);
            padding: 20px;
            border-radius: 18px;
            margin-bottom: 14px;
            text-align: center;
            box-shadow: 0 10px 30px -5px rgba(13, 148, 136, 0.4);
        }}
        .header h1 {{ font-size: 21px; font-weight: 900; margin-bottom: 6px; }}
        .header p {{ font-size: 13px; opacity: 0.95; line-height: 1.4; }}

        /* Status Dashboard Counter */
        .crm-dashboard {{
            background: #111827;
            border: 1px solid #1f2937;
            border-radius: 16px;
            padding: 14px;
            margin-bottom: 16px;
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(110px, 1fr));
            gap: 10px;
            text-align: center;
        }}
        .crm-stat-box {{
            background: #1f2937;
            padding: 10px 6px;
            border-radius: 12px;
            border-bottom: 3px solid #374151;
            transition: transform 0.15s;
        }}
        .crm-stat-box:hover {{ transform: translateY(-2px); }}
        .stat-num {{ font-size: 20px; font-weight: 900; }}
        .stat-label {{ font-size: 11px; font-weight: 700; color: #9ca3af; margin-top: 3px; }}
        
        .box-interested {{ border-color: #22c55e; }}
        .box-interested .stat-num {{ color: #22c55e; }}
        .box-whatsapp {{ border-color: #06b6d4; }}
        .box-whatsapp .stat-num {{ color: #06b6d4; }}
        .box-answered {{ border-color: #eab308; }}
        .box-answered .stat-num {{ color: #eab308; }}
        .box-noanswer {{ border-color: #64748b; }}
        .box-noanswer .stat-num {{ color: #cbd5e1; }}
        .box-rejected {{ border-color: #ef4444; }}
        .box-rejected .stat-num {{ color: #ef4444; }}
        .box-paid {{ border-color: #f59e0b; }}
        .box-paid .stat-num {{ color: #facc15; }}

        .actions {{
            display: flex;
            gap: 8px;
            margin-top: 12px;
            justify-content: center;
            flex-wrap: wrap;
        }}
        .btn {{
            display: inline-flex;
            align-items: center;
            gap: 6px;
            padding: 8px 14px;
            border-radius: 10px;
            font-size: 12px;
            font-weight: 800;
            text-decoration: none;
            color: white;
            box-shadow: 0 4px 10px rgba(0,0,0,0.3);
            border: none;
            cursor: pointer;
            transition: all 0.15s;
        }}
        .btn:active {{ transform: scale(0.96); }}
        .btn-vcf {{ background: #10b981; }}
        .btn-csv {{ background: #2563eb; }}
        .btn-export {{ background: #8b5cf6; }}
        .btn-reset {{ background: #475569; }}

        .search-box {{
            margin-bottom: 12px;
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
            gap: 6px;
            margin-bottom: 14px;
            overflow-x: auto;
            padding-bottom: 4px;
        }}
        .tab-btn {{
            background: #1e293b;
            border: 1px solid #334155;
            color: #cbd5e1;
            padding: 8px 12px;
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

        /* Lead Cards */
        .card {{
            background: #131d2e;
            border: 1px solid #1e293b;
            border-radius: 14px;
            padding: 14px 16px;
            margin-bottom: 12px;
            display: flex;
            flex-direction: column;
            gap: 10px;
            transition: all 0.2s;
        }}
        .card:hover {{ border-color: #4f46e5; }}
        
        /* Status Card Borders */
        .card.status-interested {{ border-left: 5px solid #22c55e; background: #0f241d; }}
        .card.status-whatsapp {{ border-left: 5px solid #06b6d4; background: #0c232f; }}
        .card.status-answered {{ border-left: 5px solid #eab308; background: #262111; }}
        .card.status-noanswer {{ border-left: 5px solid #64748b; opacity: 0.75; }}
        .card.status-rejected {{ border-left: 5px solid #ef4444; opacity: 0.6; }}
        .card.status-paid {{ border-left: 5px solid #f59e0b; background: #2a1f07; }}

        .card-top {{
            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: 12px;
        }}
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

        /* Status Selector Row */
        .status-row {{
            border-top: 1px solid #1e293b;
            padding-top: 10px;
            display: flex;
            gap: 6px;
            flex-wrap: wrap;
            align-items: center;
        }}
        .status-btn {{
            background: #1e293b;
            border: 1px solid #334155;
            color: #94a3b8;
            padding: 5px 10px;
            border-radius: 8px;
            font-size: 11px;
            font-weight: 800;
            cursor: pointer;
            display: inline-flex;
            align-items: center;
            gap: 4px;
            transition: all 0.15s;
        }}
        .status-btn:active {{ transform: scale(0.95); }}
        
        /* Active Status Buttons */
        .status-btn[data-val="interested"].active {{ background: #15803d; border-color: #22c55e; color: white; }}
        .status-btn[data-val="whatsapp"].active {{ background: #0891b2; border-color: #06b6d4; color: white; }}
        .status-btn[data-val="answered"].active {{ background: #b45309; border-color: #eab308; color: white; }}
        .status-btn[data-val="noanswer"].active {{ background: #475569; border-color: #94a3b8; color: white; }}
        .status-btn[data-val="rejected"].active {{ background: #b91c1c; border-color: #ef4444; color: white; }}
        .status-btn[data-val="paid"].active {{ background: #d97706; border-color: #facc15; color: white; font-weight: 900; }}

        .note-input {{
            flex: 1;
            min-width: 200px;
            background: #0f172a;
            border: 1px solid #334155;
            border-radius: 8px;
            padding: 6px 10px;
            color: #e2e8f0;
            font-size: 11px;
            outline: none;
        }}
        .note-input:focus {{ border-color: #0d9488; }}
    </style>
</head>
<body>
    <div class="header">
        <h1>{title}</h1>
        <p>{subtitle}</p>
        <div class="actions">
            <button onclick="exportCRMProgress()" class="btn btn-export"><i class="fas fa-file-export"></i> Progress එක Save / Export</button>
            <a href="/download-kandy-cam-vcf" class="btn btn-vcf"><i class="fas fa-user-plus"></i> Save to Phone (VCF)</a>
            <a href="https://tintinads.com" target="_blank" class="btn btn-csv"><i class="fas fa-globe"></i> TinTinAds.com</a>
        </div>
    </div>

    <!-- Live Status Tracker Dashboard -->
    <div class="crm-dashboard">
        <div class="crm-stat-box box-interested">
            <div class="stat-num" id="stat-interested">0</div>
            <div class="stat-label">🟢 කැමති වුණා</div>
        </div>
        <div class="crm-stat-box box-whatsapp">
            <div class="stat-num" id="stat-whatsapp">0</div>
            <div class="stat-label">💬 WhatsApp යැව්වා</div>
        </div>
        <div class="crm-stat-box box-answered">
            <div class="stat-num" id="stat-answered">0</div>
            <div class="stat-label">🟡 Answer කළා</div>
        </div>
        <div class="crm-stat-box box-noanswer">
            <div class="stat-num" id="stat-noanswer">0</div>
            <div class="stat-label">⚪ No Answer</div>
        </div>
        <div class="crm-stat-box box-rejected">
            <div class="stat-num" id="stat-rejected">0</div>
            <div class="stat-label">❌ එපා කිව්වා</div>
        </div>
        <div class="crm-stat-box box-paid">
            <div class="stat-num" id="stat-paid">0</div>
            <div class="stat-label">💰 සල්ලි දැම්මා</div>
        </div>
    </div>

    <div class="pitch-banner">
        💡 <b>WhatsApp Strategy Reminder:</b> <i>"කෝල් නොකර, WhatsApp බොත්තම ඔබලා 'මම ඔයාගෙ ad එක අපේ site එකෙයි Telegram VIP එකෙයි නොමිලේ (FREE) දැම්මා. ඔයාට clientsලා එන්න ගත්තම කැමති නම් VIP එකට දාන්න' මැසේජ් එක යවන්න. කිසිම කෙනෙක් බනින්නේ නෑ!"</i>
    </div>

    <div class="search-box">
        <input type="text" id="searchInput" class="search-input" placeholder="Search number, name, note, or location..." onkeyup="filterCards()">
    </div>

    <!-- Filter Tabs -->
    <div class="filter-tabs">
        <button class="tab-btn active" onclick="setTab('all', this)">සියල්ල ({len(contacts)})</button>
        <button class="tab-btn" onclick="setTab('interested', this)">🟢 කැමති වූ අය (<span id="tab-cnt-interested">0</span>)</button>
        <button class="tab-btn" onclick="setTab('whatsapp', this)">💬 WhatsApp යැවූ (<span id="tab-cnt-whatsapp">0</span>)</button>
        <button class="tab-btn" onclick="setTab('answered', this)">🟡 Answer කළ (<span id="tab-cnt-answered">0</span>)</button>
        <button class="tab-btn" onclick="setTab('paid', this)">💰 Paid (<span id="tab-cnt-paid">0</span>)</button>
        <button class="tab-btn" onclick="setTab('pending', this)">⏳ Pending (නොකළ අය)</button>
    </div>

    <div id="cardsList">
'''

    for c in contacts:
        cid = c['id']
        phone = c['raw_local']
        source = c.get('source', 'LankaAd')
        ad_type = c.get('type', 'Lead')
        source_class = 'source-lankaad' if source == 'LankaAd' else 'source-helalanka'
        type_class = 'type-kandy' if ad_type == 'Kandy' else ('type-camshow' if ad_type == 'Camshow' else 'type-other')
        encoded_wa_msg = f"Hi,%20TinTinAds.com%20%E0%B6%91%E0%B6%9A%E0%B7%99%E0%B6%B1%E0%B7%8A%20%E0%B6%9A%E0%B6%AD%E0%B7%8F%20%E0%B6%9A%E0%B6%BB%E0%B6%B1%E0%B7%8A%E0%B6%B1%E0%B7%9A.%20%E0%B6%94%E0%B6%BA%E0%B7%8F%20{source}%20%E0%B6%91%E0%B6%9A%E0%B7%9A%20%E0%B6%AF%E0%B7%8F%E0%B6%BD%E0%B7%8F%20%E0%B6%AD%E0%B7%92%E0%B6%B6%E0%B7%94%E0%B6%AB%E0%B7%94%20ad%20%E0%B6%91%E0%B6%9A%20%E0%B6%AF%E0%B7%90%E0%B6%9A%E0%B7%8A%E0%B6%9A%E0%B7%8F."

        html += f'''
        <div class="card" id="card-{phone}" data-phone="{phone}" data-status="none" data-note="" data-search="{phone} {c['location'].lower()} {c['title'].lower()} {ad_type.lower()} {source.lower()}">
            <div class="card-top">
                <div class="card-info">
                    <div class="badges">
                        <span class="card-num">#{cid:03d}</span>
                        <span class="type-tag {type_class}">{ad_type}</span>
                        <a href="{c['ad_url']}" target="_blank" rel="noopener noreferrer" class="source-tag {source_class}" style="text-decoration:none;"><i class="fas fa-external-link-alt"></i> {source}</a>
                    </div>
                    <div class="card-phone">{c['local_phone']}</div>
                    <div class="card-title"><a href="{c['ad_url']}" target="_blank" rel="noopener noreferrer" style="color:inherit; text-decoration:none;">{c['title']}</a></div>
                    <div class="card-meta"><i class="fas fa-map-marker-alt"></i> {c['location']} • <i class="fas fa-calendar-alt"></i> {c.get('date_published', 'Recent')}</div>
                    <div><a href="{c['ad_url']}" target="_blank" rel="noopener noreferrer" class="ad-link-badge"><i class="fas fa-link"></i> {source} Ad එක බලන්න &rarr;</a></div>
                </div>
                <div class="btn-group">
                    <a href="tel:{phone}" onclick="markQuickStatus('{phone}', 'answered')" class="act-btn act-call" title="Call directly"><i class="fas fa-phone-alt"></i></a>
                    <a href="https://wa.me/{c['whatsapp_phone']}?text={encoded_wa_msg}" onclick="markQuickStatus('{phone}', 'whatsapp')" target="_blank" class="act-btn act-wa" title="WhatsApp Chat"><i class="fab fa-whatsapp"></i></a>
                    <a href="{c['ad_url']}" target="_blank" rel="noopener noreferrer" class="act-btn act-ad" title="View original ad"><i class="fas fa-arrow-up-right-from-square"></i></a>
                </div>
            </div>

            <!-- Status Buttons Row -->
            <div class="status-row">
                <button class="status-btn" data-val="interested" onclick="setStatus('{phone}', 'interested')">🟢 කැමති වුණා</button>
                <button class="status-btn" data-val="whatsapp" onclick="setStatus('{phone}', 'whatsapp')">💬 WhatsApp</button>
                <button class="status-btn" data-val="answered" onclick="setStatus('{phone}', 'answered')">🟡 Answer</button>
                <button class="status-btn" data-val="noanswer" onclick="setStatus('{phone}', 'noanswer')">⚪ No Ans</button>
                <button class="status-btn" data-val="rejected" onclick="setStatus('{phone}', 'rejected')">❌ එපා</button>
                <button class="status-btn" data-val="paid" onclick="setStatus('{phone}', 'paid')">💰 Paid</button>
                <input type="text" class="note-input" id="note-{phone}" placeholder="සටහනක් ලියන්න (උදා: හෙට 1500 දානවා, හවස කතා කරන්න)..." oninput="setNote('{phone}', this.value)">
            </div>
        </div>
'''

    html += f'''
    </div>

    <script>
        const STORAGE_KEY = 'tintin_crm_{sheet_key}';
        var crmData = {{}};
        try {{
            var stored = localStorage.getItem(STORAGE_KEY);
            if (stored) crmData = JSON.parse(stored);
        }} catch(e) {{}}

        var currentTab = 'all';

        function initCRM() {{
            for (var phone in crmData) {{
                var item = crmData[phone];
                var card = document.getElementById('card-' + phone);
                if (card) {{
                    if (item.status) applyStatusToCard(card, item.status);
                    if (item.note) {{
                        var noteInput = document.getElementById('note-' + phone);
                        if (noteInput) noteInput.value = item.note;
                        card.setAttribute('data-note', item.note.toLowerCase());
                    }}
                }}
            }}
            updateCounts();
        }}

        function applyStatusToCard(card, status) {{
            card.classList.remove('status-interested', 'status-whatsapp', 'status-answered', 'status-noanswer', 'status-rejected', 'status-paid');
            if (status && status !== 'none') card.classList.add('status-' + status);
            card.setAttribute('data-status', status || 'none');

            var btns = card.querySelectorAll('.status-btn');
            btns.forEach(function(b) {{
                if (b.getAttribute('data-val') === status) {{
                    b.classList.add('active');
                }} else {{
                    b.classList.remove('active');
                }}
            }});
        }}

        function setStatus(phone, status) {{
            if (!crmData[phone]) crmData[phone] = {{}};
            
            // Toggle off if clicking the already active status
            if (crmData[phone].status === status) {{
                crmData[phone].status = 'none';
            }} else {{
                crmData[phone].status = status;
            }}
            
            saveCRM();
            var card = document.getElementById('card-' + phone);
            if (card) applyStatusToCard(card, crmData[phone].status);
            updateCounts();
            filterCards();
        }}

        function markQuickStatus(phone, defaultStatus) {{
            if (!crmData[phone] || !crmData[phone].status || crmData[phone].status === 'none') {{
                setStatus(phone, defaultStatus);
            }}
        }}

        function setNote(phone, text) {{
            if (!crmData[phone]) crmData[phone] = {{}};
            crmData[phone].note = text;
            saveCRM();
            var card = document.getElementById('card-' + phone);
            if (card) card.setAttribute('data-note', text.toLowerCase());
        }}

        function saveCRM() {{
            try {{
                localStorage.setItem(STORAGE_KEY, JSON.stringify(crmData));
            }} catch(e) {{}}
        }}

        function updateCounts() {{
            var counts = {{
                interested: 0,
                whatsapp: 0,
                answered: 0,
                noanswer: 0,
                rejected: 0,
                paid: 0
            }};

            var cards = document.getElementsByClassName('card');
            for (var i = 0; i < cards.length; i++) {{
                var st = cards[i].getAttribute('data-status');
                if (counts[st] !== undefined) counts[st]++;
            }}

            for (var k in counts) {{
                var el = document.getElementById('stat-' + k);
                if (el) el.innerText = counts[k];
                var tabEl = document.getElementById('tab-cnt-' + k);
                if (tabEl) tabEl.innerText = counts[k];
            }}
        }}

        function setTab(tab, el) {{
            currentTab = tab;
            var buttons = document.getElementsByClassName('tab-btn');
            for (var i = 0; i < buttons.length; i++) buttons[i].classList.remove('active');
            el.classList.add('active');
            filterCards();
        }}

        function filterCards() {{
            var q = document.getElementById('searchInput').value.toLowerCase();
            var cards = document.getElementsByClassName('card');
            for (var i = 0; i < cards.length; i++) {{
                var searchData = cards[i].getAttribute('data-search') + ' ' + cards[i].getAttribute('data-note');
                var status = cards[i].getAttribute('data-status');
                
                var matchesSearch = searchData.indexOf(q) > -1;
                var matchesTab = false;

                if (currentTab === 'all') matchesTab = true;
                else if (currentTab === 'pending') matchesTab = (!status || status === 'none');
                else matchesTab = (status === currentTab);

                if (matchesSearch && matchesTab) {{
                    cards[i].style.display = 'flex';
                }} else {{
                    cards[i].style.display = 'none';
                }}
            }}
        }}

        function exportCRMProgress() {{
            var rows = [["Phone", "Status", "Note"]];
            for (var p in crmData) {{
                rows.push([p, crmData[p].status || "none", crmData[p].note || ""]);
            }}
            var csvContent = "data:text/csv;charset=utf-8," + rows.map(e => e.join(",")).join("\\n");
            var encodedUri = encodeURI(csvContent);
            var link = document.createElement("a");
            link.setAttribute("href", encodedUri);
            link.setAttribute("download", "{sheet_key}_progress.csv");
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }}

        document.addEventListener('DOMContentLoaded', initCRM);
        // Also run immediately
        initCRM();
    </script>
</body>
</html>
'''

    with open(html_out_file, 'w', encoding='utf-8') as f:
        f.write(html)
    print(f"Generated CRM Calling Sheet: {html_out_file}")

# 1. Update kandy_cam_sheet.html
create_crm_html(
    'kandy_cam_100_leads.json',
    'public/kandy_cam_sheet.html',
    '<i class="fas fa-headset"></i> Kandy & Camshow Lead Tracker (CRM)',
    'කතා කළ අය, කැමති වූ අය, WhatsApp යැවූ අය සහ සටහන් සජීවීව Mark කරගන්නා Smart Calling Dashboard එක',
    'kandy_cam'
)

# 2. Update oct21_calling_sheet.html
create_crm_html(
    'lankaad_hela_oct21_100_leads.json',
    'public/oct21_calling_sheet.html',
    '<i class="fas fa-fire"></i> Oct 21 Top 100 Hot Leads Tracker (CRM)',
    'කතා කළ අය, කැමති වූ අය, WhatsApp යැවූ අය සහ සටහන් සජීවීව Mark කරගන්නා Smart Calling Dashboard එක',
    'oct21'
)
