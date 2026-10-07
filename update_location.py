import re

file_path = r'C:\Users\thara\Downloads\public_html\resources\js\pages\Argent\PostNewAd.tsx'

with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Replace LOCATION_OPTIONS with DISTRICT_CITIES map
district_cities_code = """const DISTRICT_CITIES: Record<string, string[]> = {
    'Ampara': ['Ampara', 'Akkaraipattu', 'Kalmunai', 'Sainthamaruthu'],
    'Anuradhapura': ['Anuradhapura', 'Eppawala', 'Kekirawa', 'Medawachchiya', 'Nochchiyagama', 'Tambuttegama'],
    'Badulla': ['Badulla', 'Bandarawela', 'Diyatalawa', 'Hali-Ela', 'Haputale', 'Mahiyanganaya', 'Passara', 'Welimada'],
    'Batticaloa': ['Batticaloa', 'Kattankudy', 'Valaichchenai'],
    'Colombo': ['Colombo 1', 'Colombo 2', 'Colombo 3', 'Colombo 4', 'Colombo 5', 'Colombo 6', 'Avissawella', 'Battaramulla', 'Boralesgamuwa', 'Dehiwala', 'Homagama', 'Kaduwela', 'Kesbewa', 'Kohuwala', 'Kolonnawa', 'Kottawa', 'Kotte', 'Maharagama', 'Malabe', 'Moratuwa', 'Mount Lavinia', 'Nawala', 'Nugegoda', 'Padukka', 'Pannipitiya', 'Piliyandala', 'Rajagiriya', 'Ratmalana', 'Wellampitiya'],
    'Galle': ['Galle', 'Ambalangoda', 'Baddegama', 'Batapola', 'Elpitiya', 'Hikkaduwa', 'Koggala', 'Karapitiya'],
    'Gampaha': ['Gampaha', 'Biyagama', 'Delgoda', 'Divulapitiya', 'Ganemulla', 'Ja-Ela', 'Kadawatha', 'Kandana', 'Katunayake', 'Kelaniya', 'Kiribathgoda', 'Minuwangoda', 'Mirigama', 'Negombo', 'Nittambuwa', 'Ragama', 'Veyangoda', 'Wattala'],
    'Hambantota': ['Hambantota', 'Ambalantota', 'Beliatta', 'Tangalle', 'Tissamaharama'],
    'Jaffna': ['Jaffna', 'Chavakachcheri', 'Nallur', 'Point Pedro'],
    'Kalutara': ['Kalutara', 'Aluthgama', 'Bandaragama', 'Beruwala', 'Horana', 'Matugama', 'Panadura', 'Wadduwa'],
    'Kandy': ['Kandy', 'Akurana', 'Digana', 'Gampola', 'Gelioya', 'Kadugannawa', 'Katugastota', 'Nawalapitiya', 'Peradeniya', 'Pilimathalawa', 'Wattegama'],
    'Kegalle': ['Kegalle', 'Aranayaka', 'Dehiowita', 'Deraniyagala', 'Galigamuwa', 'Hemmathagama', 'Karawanella', 'Kitulgala', 'Kotiyakumbura', 'Mawanella', 'Rambukkana', 'Ruwanwella', 'Thalgaspitiya', 'Warakapola', 'Yatiyanthota'],
    'Kilinochchi': ['Kilinochchi'],
    'Kurunegala': ['Kurunegala', 'Alawwa', 'Bingiriya', 'Dambadeniya', 'Galgamuwa', 'Giriulla', 'Hettipola', 'Ibbagamuwa', 'Kuliyapitiya', 'Mawathagama', 'Narammala', 'Pannala', 'Polgahawela', 'Wariyapola'],
    'Mannar': ['Mannar'],
    'Matale': ['Matale', 'Dambulla', 'Galewela', 'Palapathwela', 'Rattota', 'Sigiriya', 'Ukuwela', 'Yatawatta'],
    'Matara': ['Matara', 'Akuressa', 'Deniyaya', 'Dikwella', 'Hakmana', 'Kamburugamuwa', 'Kamburupitiya', 'Weligama'],
    'Monaragala': ['Monaragala', 'Bibile', 'Buttala', 'Kataragama', 'Medagama', 'Wellawaya'],
    'Mullaitivu': ['Mullaitivu'],
    'Nuwara Eliya': ['Nuwara Eliya', 'Agarapathana', 'Dayagama', 'Ginigathena', 'Hatton', 'Kotagala', 'Maskeliya', 'Nanu Oya', 'Nawalapitiya', 'Norwood', 'Ragala', 'Talawakele'],
    'Polonnaruwa': ['Polonnaruwa', 'Hingurakgoda', 'Kaduruwela', 'Medirigiriya'],
    'Puttalam': ['Puttalam', 'Chilaw', 'Dankotuwa', 'Kalpitiya', 'Marawila', 'Nattandiya', 'Wennappuwa'],
    'Ratnapura': ['Ratnapura', 'Balangoda', 'Eheliyagoda', 'Embilipitiya', 'Godakawela', 'Kuruwita', 'Nivitigala', 'Opanayaka', 'Pelmadulla', 'Rakwana'],
    'Trincomalee': ['Trincomalee', 'Gomarankadawala', 'Kantalai', 'Kinniya', 'Kuchchaveli', 'Mutur'],
    'Vavuniya': ['Vavuniya']
};

const DISTRICTS = Object.keys(DISTRICT_CITIES).map(d => ({ value: d, label: d }));"""

location_options_regex = re.compile(r'const LOCATION_OPTIONS = \[[^\]]+\];', re.DOTALL)
content = location_options_regex.sub(district_cities_code, content)

# 2. Add selectedDistrict state logic inside PostNewAd
state_init_code = """    // Parse initial district from location string if editing (format: "City, District")
    const initialLocation = ad?.location || '';
    let initialDistrict = '';
    if (initialLocation) {
        const parts = initialLocation.split(',').map(s => s.trim());
        const possibleDist = parts.length > 1 ? parts[parts.length - 1] : parts[0];
        if (DISTRICT_CITIES[possibleDist]) {
            initialDistrict = possibleDist;
        }
    }
    const [selectedDistrict, setSelectedDistrict] = useState(initialDistrict);"""

# Insert state_init_code right after const [previewUrls, setPreviewUrls] = useState<string[]>([]);
content = content.replace('const [previewUrls, setPreviewUrls] = useState<string[]>([]);', 'const [previewUrls, setPreviewUrls] = useState<string[]>([]);\n' + state_init_code)

# 3. Replace the location input UI
old_ui_regex = re.compile(r'<div className="space-y-2">\s*<label className="block text-sm font-medium text-gray-700">Locations \(Cities\) \*</label>\s*<Select.*?\{errors\.location && <p className="text-sm text-red-500">\{errors\.location\}</p>\}\s*</div>', re.DOTALL)

new_ui_code = """<div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                            <div className="space-y-2">
                                <label className="block text-sm font-medium text-gray-700">District *</label>
                                <Select
                                    name="district"
                                    options={DISTRICTS}
                                    placeholder="Select district..."
                                    value={DISTRICTS.find(d => d.value === selectedDistrict) || null}
                                    onChange={(option) => {
                                        const newDist = option ? option.value : '';
                                        setSelectedDistrict(newDist);
                                        setData('location', ''); // Reset city on district change
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
                            </div>
                            <div className="space-y-2">
                                <label className="block text-sm font-medium text-gray-700">City / Town *</label>
                                <Select
                                    name="city"
                                    options={selectedDistrict ? DISTRICT_CITIES[selectedDistrict].map(c => ({ value: c, label: c })) : []}
                                    placeholder="Select city..."
                                    isDisabled={!selectedDistrict}
                                    value={selectedDistrict && data.location ? { value: data.location.split(',')[0].trim(), label: data.location.split(',')[0].trim() } : null}
                                    onChange={(option) => {
                                        if (option) {
                                            setData('location', `${option.value}, ${selectedDistrict}`);
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
                            </div>
                        </div>"""

content = old_ui_regex.sub(new_ui_code, content)

with open(file_path, 'w', encoding='utf-8') as f:
    f.write(content)

print("Updated PostNewAd.tsx to use cascading dropdowns for Location")
