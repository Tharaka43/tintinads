import re

file_path = r'C:\Users\thara\Downloads\public_html\resources\js\pages\ClassifiedsPage.tsx'
with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

pattern = r'const hasPremiumAds = useMemo\(\(\) => \{\n        return ads.some\(ad => ad.isPremium\);\n    \}, \[ads\]\);'
replacement = r'const hasPremiumAds = useMemo(() => {\n        return ads.some(ad => ad.isPremium);\n    }, [ads]);\n\n    const hasPlatinumAds = useMemo(() => {\n        return ads.some(ad => ad.isPlatinum);\n    }, [ads]);'

content = re.sub(pattern, replacement, content)

with open(file_path, 'w', encoding='utf-8') as f:
    f.write(content)
