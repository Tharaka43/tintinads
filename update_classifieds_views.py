import re

file_path = r'C:\Users\thara\Downloads\public_html\app\Http\Controllers\ClassifiedsController.php'

with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

# Add display views calculation right before rendering
calc_logic = """        $realViews = SiteStatistic::where('key', 'total_views')->value('value') ?? 0;
        $displayViews = 5000 + ($realViews * 5);

        return Inertia::render('ClassifiedsPage', [
            'displayViews' => $displayViews,"""

content = content.replace("        return Inertia::render('ClassifiedsPage', [", calc_logic)

with open(file_path, 'w', encoding='utf-8') as f:
    f.write(content)

print("Updated ClassifiedsController")
