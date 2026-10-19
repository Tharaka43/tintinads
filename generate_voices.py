import asyncio
import os
import edge_tts

VOICES_CONFIG = [
    {
        "id": "girls_personal",
        "filename": "voice_girls_personal.mp3",
        "voice": "si-LK-ThiliniNeural",
        "rate": "+0%",
        "pitch": "+0Hz",
        "text": "හායි, මගේ ඇඩ් එකේ තියෙන විස්තර සහ පැකේජ් හොඳට බලලා කියවන්න. Genuine නම් විතරක් මට දැන්ම කෝල් එකක් හරි WhatsApp මැසේජ් එකක් හරි දාන්නකෝ."
    },
    {
        "id": "live_cam",
        "filename": "voice_live_cam.mp3",
        "voice": "si-LK-ThiliniNeural",
        "rate": "+0%",
        "pitch": "+0Hz",
        "text": "හායි, මගේ ලයිව් කැම් සර්විස් එකට ඔයාලව සාදරයෙන් පිළිගන්නවා. ඇඩ් එකේ තියෙන විස්තර බලලා, ලයිව් වීඩියෝ පැකේජ් ගන්න කැමති නම් දැන්ම මට WhatsApp මැසේජ් එකක් දාන්න."
    },
    {
        "id": "spa_wellness",
        "filename": "voice_spa_wellness.mp3",
        "voice": "si-LK-ThiliniNeural",
        "rate": "-3%",
        "pitch": "+0Hz",
        "text": "ආයුබෝවන්. අපගේ ස්පා සහ සම්බාහන සේවාවන් ලබා ගැනීමට පෙර, කරුණාකර ඇඩ් එකේ විස්තර බලලා වේලාවක් වෙන් කරවා ගැනීමට දැන්ම අප අමතන්න. ස්තූතියි."
    },
    {
        "id": "boys_personal",
        "filename": "voice_boys_personal.mp3",
        "voice": "si-LK-SameeraNeural",
        "rate": "+0%",
        "pitch": "+0Hz",
        "text": "හායි, මගේ ඇඩ් එකේ විස්තර හොඳට බලන්න. Genuine අය සහ Genuine girls ලා විතරක් මට කෝල් එකක් හරි WhatsApp මැසේජ් එකක් හරි දාන්න."
    },
    {
        "id": "shemale_personal",
        "filename": "voice_shemale_personal.mp3",
        "voice": "si-LK-ThiliniNeural",
        "rate": "+0%",
        "pitch": "+0Hz",
        "text": "හායි, මගේ ඇඩ් එකේ විස්තර සහ සේවාවන් හොඳට කියවලා, Genuine නම් විතරක් මට දැන්ම කෝල් එකක් හෝ WhatsApp මැසේජ් එකක් දාන්නකෝ."
    },
    {
        "id": "default",
        "filename": "voice_default.mp3",
        "voice": "si-LK-ThiliniNeural",
        "rate": "+0%",
        "pitch": "+0Hz",
        "text": "හායි, මගේ දැන්වීමේ විස්තර හොඳට කියවලා බලන්න. Genuine නම් විතරක් කරුණාකර දැන්ම මට කෝල් එකක් හරි WhatsApp මැසේජ් එකක් හරි දාන්න."
    }
]

async def generate():
    out_dir_storage = os.path.join("storage", "app", "public", "audio")
    os.makedirs(out_dir_storage, exist_ok=True)

    for item in VOICES_CONFIG:
        path_sto = os.path.join(out_dir_storage, item["filename"])
        
        print(f"Generating {item['filename']} with voice {item['voice']}...")
        comm = edge_tts.Communicate(item["text"], item["voice"], rate=item["rate"], pitch=item["pitch"])
        await comm.save(path_sto)
        size = os.path.getsize(path_sto)
        print(f"  Done: {item['filename']} ({size} bytes)")

if __name__ == "__main__":
    asyncio.run(generate())
