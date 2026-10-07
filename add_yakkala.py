import re

file_path = r'C:\Users\thara\Downloads\public_html\resources\js\pages\Argent\PostNewAd.tsx'

with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

# Add Yakkala to Gampaha
# Old Gampaha string: 'Gampaha': ['Gampaha', 'Biyagama', 'Delgoda', 'Divulapitiya', 'Ganemulla', 'Ja-Ela', 'Kadawatha', 'Kandana', 'Katunayake', 'Kelaniya', 'Kiribathgoda', 'Minuwangoda', 'Mirigama', 'Negombo', 'Nittambuwa', 'Ragama', 'Veyangoda', 'Wattala']
# I'll replace the exact string or just do a regex replace for Gampaha array.

gampaha_regex = re.compile(r"'Gampaha': \[[^\]]+\]")

new_gampaha_list = "'Gampaha': ['Gampaha', 'Biyagama', 'Delgoda', 'Divulapitiya', 'Ganemulla', 'Ja-Ela', 'Kadawatha', 'Kandana', 'Katunayake', 'Kelaniya', 'Kiribathgoda', 'Kirindiwela', 'Minuwangoda', 'Mirigama', 'Negombo', 'Nittambuwa', 'Peliyagoda', 'Ragama', 'Veyangoda', 'Wattala', 'Yakkala']"

content = gampaha_regex.sub(new_gampaha_list, content)

with open(file_path, 'w', encoding='utf-8') as f:
    f.write(content)

print("Added Yakkala, Peliyagoda, Kirindiwela to Gampaha district.")
