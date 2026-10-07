import re

file_path = r'C:\Users\thara\Downloads\public_html\app\Http\Controllers\AdminReportsController.php'

with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

if 'use App\\Models\\SiteStatistic;' not in content:
    content = content.replace('use App\\Models\\Advertisement;', 'use App\\Models\\Advertisement;\nuse App\\Models\\SiteStatistic;')

# Inject totalSiteViews
injection = """            $percentageChange = $previousWeekAds > 0 
                ? round((($lastWeekAds - $previousWeekAds) / $previousWeekAds) * 100, 1)
                : 0;

            // Fetch Total Site Views
            $totalSiteViews = SiteStatistic::where('key', 'total_views')->value('value') ?? 0;"""

content = content.replace("""            $percentageChange = $previousWeekAds > 0 
                ? round((($lastWeekAds - $previousWeekAds) / $previousWeekAds) * 100, 1)
                : 0;""", injection)

response_injection = """                'totalAdsPosted' => $totalAdsPosted,
                'percentageChange' => $percentageChange,
                'totalSiteViews' => $totalSiteViews,"""

content = content.replace("""                'totalAdsPosted' => $totalAdsPosted,
                'percentageChange' => $percentageChange,""", response_injection)

with open(file_path, 'w', encoding='utf-8') as f:
    f.write(content)

print('Updated AdminReportsController')
