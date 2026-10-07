import re

file_path = r'C:\Users\thara\Downloads\public_html\resources\js\pages\ClassifiedsPage.tsx'

with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

# Add displayViews to props interface
if 'displayViews?: number;' not in content:
    content = content.replace('selectedLocation?: string;', 'selectedLocation?: string;\n    displayViews?: number;')

# Add displayViews to component props
if 'displayViews = 5000' not in content:
    content = content.replace('savedAdIds = []\n}) => {', 'savedAdIds = [],\n    displayViews = 5000\n}) => {')

# Add the visitor banner before the header
banner_code = """
            {/* Visitors Counter Strip */}
            <div className="bg-gradient-to-r from-red-600 via-pink-600 to-red-600 text-white text-center py-1.5 sm:py-2 px-4 shadow-md text-xs sm:text-sm font-bold flex items-center justify-center gap-2 relative overflow-hidden">
                <div className="absolute inset-0 bg-white opacity-10 animate-pulse"></div>
                <span className="relative flex h-2.5 w-2.5 sm:h-3 sm:w-3">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 sm:h-3 sm:w-3 bg-white"></span>
                </span>
                <span className="z-10 tracking-wide">
                    🔥 දිනපතා දහස් ගණනක් පැමිණෙන ශ්‍රී ලංකාවේ අංක 1 වෙබ් අඩවිය - <span className="text-yellow-300 ml-1 text-[13px] sm:text-[15px]">Total Visits: {displayViews.toLocaleString()}+</span>
                </span>
            </div>
            
            {/* Sticky Header */}"""

content = content.replace('{/* Sticky Header */}', banner_code, 1)

with open(file_path, 'w', encoding='utf-8') as f:
    f.write(content)

print("Updated ClassifiedsPage.tsx")
