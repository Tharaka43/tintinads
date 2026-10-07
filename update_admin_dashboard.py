import re

file_path = r'C:\Users\thara\Downloads\public_html\resources\js\pages\Admin\AdminDashboardHome.tsx'

with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

# Add to interface
content = content.replace("totalAdsPosted: number;", "totalAdsPosted: number;\n    totalSiteViews: number;")

# Add to UI
ui_replacement = """<span className="text-gray-600">Total Ads Posted: <strong style={{ color: LIGHT_BLUE }}>{data.totalAdsPosted.toLocaleString()}</strong></span>
                            <span className="text-gray-600 ml-4">Total Site Views: <strong style={{ color: PRIMARY_PINK }}>{data.totalSiteViews ? data.totalSiteViews.toLocaleString() : 0}</strong></span>"""

content = content.replace('<span className="text-gray-600">Total Ads Posted: <strong style={{ color: LIGHT_BLUE }}>{data.totalAdsPosted.toLocaleString()}</strong></span>', ui_replacement)

with open(file_path, 'w', encoding='utf-8') as f:
    f.write(content)

print('Updated AdminDashboardHome.tsx')
