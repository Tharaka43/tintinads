import re
import os

controller_path = r'C:\Users\thara\Downloads\public_html\app\Http\Controllers\ClassifiedsController.php'

with open(controller_path, 'r', encoding='utf-8') as f:
    content = f.read()

# Add SiteStatistic use statement if not exists
if 'use App\\Models\\SiteStatistic;' not in content:
    content = content.replace('use App\\Models\\Advertisement;', 'use App\\Models\\Advertisement;\nuse App\\Models\\SiteStatistic;')
elif 'use App\Models\SiteStatistic;' not in content:
    content = content.replace('use App\Models\Advertisement;', 'use App\Models\Advertisement;\nuse App\Models\SiteStatistic;')

# Inject increment logic at the start of index method
increment_logic = """    public function index(Request $request): Response
    {
        // Increment site views
        SiteStatistic::where('key', 'total_views')->increment('value');"""

content = re.sub(r'public function index\(Request \$request\): Response\s*\{', increment_logic, content)

with open(controller_path, 'w', encoding='utf-8') as f:
    f.write(content)

print('Updated ClassifiedsController')
