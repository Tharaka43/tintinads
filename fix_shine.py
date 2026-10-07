import re
import os

files = [
    r'C:\Users\thara\Downloads\public_html\resources\js\pages\ClassifiedsPage.tsx',
    r'C:\Users\thara\Downloads\public_html\resources\js\pages\ListingDetailPage.tsx',
    r'C:\Users\thara\Downloads\public_html\resources\js\pages\PackagesPage.tsx'
]

replacement = """                    .platinum-silver-animated-border::before {
                        content: '';
                        position: absolute;
                        top: -2px;
                        left: -2px;
                        right: -2px;
                        bottom: -2px;
                        background: linear-gradient(
                            45deg,
                            transparent 40%,
                            rgba(255, 255, 255, 0.9) 50%,
                            transparent 60%
                        );
                        background-size: 300% 300%;
                        animation: shine 2.5s ease-in-out infinite;
                        pointer-events: none;
                        z-index: 1;
                        border-radius: inherit;
                    }"""

for file_path in files:
    if os.path.exists(file_path):
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()
        
        # Replace the broken pseudo element if it exists
        content = re.sub(
            r'\.platinum-silver-animated-border::before\s*\{[^}]*\}',
            replacement.strip(),
            content,
            flags=re.MULTILINE
        )
        
        with open(file_path, 'w', encoding='utf-8') as f:
            f.write(content)

print("done")
