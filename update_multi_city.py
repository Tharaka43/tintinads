import re

file_path = r'C:\Users\thara\Downloads\public_html\resources\js\pages\Argent\PostNewAd.tsx'

with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Update the City dropdown to support multiple selections (isMulti)
old_city_ui_regex = re.compile(r'<label className="block text-sm font-medium text-gray-700">City / Town \*</label>\s*<Select\s*name="city"\s*options=\{selectedDistrict \? DISTRICT_CITIES\[selectedDistrict\]\.map\(c => \(\{ value: c, label: c \}\)\) : \[\]\}\s*placeholder="Select city\.\.\."\s*isDisabled=\{\!selectedDistrict\}\s*value=\{selectedDistrict && data\.location \? \{ value: data\.location\.split\(\',\', 1\)\[0\]\.trim\(\), label: data\.location\.split\(\',\', 1\)\[0\]\.trim\(\) \} : null\}\s*onChange=\{\(option\) => \{\s*if \(option\) \{\s*setData\(\'location\', `\$\{option\.value\}, \$\{selectedDistrict\}`\);\s*\} else \{\s*setData\(\'location\', \'\'\);\s*\}\s*\}\}', re.DOTALL)

# Let's use a simpler regex replacement strategy since exact formatting might slightly differ.
# It's better to replace the entire <div className="space-y-2"> containing "City / Town *"
old_block_regex = re.compile(r'<div className="space-y-2">\s*<label className="block text-sm font-medium text-gray-700">City / Town \*</label>.*?\{errors\.location && <p className="text-sm text-red-500">\{errors\.location\}</p>\}\s*</div>', re.DOTALL)

new_block_code = """<div className="space-y-2">
                                <label className="block text-sm font-medium text-gray-700">Cities / Towns *</label>
                                <Select
                                    isMulti
                                    name="city"
                                    options={selectedDistrict ? DISTRICT_CITIES[selectedDistrict].map(c => ({ value: c, label: c })) : []}
                                    placeholder="Select cities..."
                                    isDisabled={!selectedDistrict}
                                    value={
                                        selectedDistrict && data.location
                                        ? data.location
                                            .split(',')
                                            .map(s => s.trim())
                                            .filter(s => s !== selectedDistrict && s !== '')
                                            .map(city => ({ value: city, label: city }))
                                        : []
                                    }
                                    onChange={(options) => {
                                        if (options && (options as any[]).length > 0) {
                                            const cities = (options as any[]).map(o => o.value).join(', ');
                                            setData('location', `${cities}, ${selectedDistrict}`);
                                        } else {
                                            setData('location', '');
                                        }
                                    }}
                                    styles={{
                                        control: (baseStyles, state) => ({
                                          ...baseStyles,
                                          borderColor: state.isFocused ? PINK : '#D1D5DB',
                                          padding: '4px',
                                          borderRadius: '0.5rem',
                                          boxShadow: state.isFocused ? `0 0 0 2px rgba(236, 72, 153, 0.2)` : 'none',
                                          '&:hover': {
                                            borderColor: state.isFocused ? PINK : '#9CA3AF'
                                          }
                                        }),
                                    }}
                                />
                                {errors.location && <p className="text-sm text-red-500">{errors.location}</p>}
                                <p className="text-xs text-gray-500 mt-1">You can select multiple towns within the district.</p>
                            </div>"""

content = old_block_regex.sub(new_block_code, content)

with open(file_path, 'w', encoding='utf-8') as f:
    f.write(content)

print("Updated PostNewAd.tsx to allow multiple cities selection.")
