import os
import re
import requests
from urllib.parse import quote
import sys

if sys.stdout.encoding != 'utf-8':
    import io
    sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')

BASE = r"c:\Users\Admin\Desktop\게임기획\포트폴리오\게임-기획자-포트폴리오-개선버전"
IMG_DIR = os.path.join(BASE, "public", "images", "games")
COMPLETE_DIR = os.path.join(IMG_DIR, "complete")
AUDIT_FILE = os.path.join(BASE, "scratch", "Gaming_DNA_Final_Readable.md")

# Hard-coded AppIDs for known Korean title failures
MANUAL_APPIDS = {
    "ELDEN RING": "1245620",
    "엘든 링": "1245620",
    "산나비": "1562700",
    "활협전": "1859910",
    "Among Us": "945360",
    "Hollow Knight": "367520",
    "Slay the Spire": "646570",
    "Vampire Survivors": "1794680",
    "Left 4 Dead 2": "550",
    "Papers, Please": "239030",
    "Undertale": "391540",
    "Katana ZERO": "1029390",
    "Goose Goose Duck": "1568590",
    "Goat Simulator": "265930",
    "60 Seconds!": "368360",
    "7 Days to End with You": "1634530",
    "A Way Out": "1222700",
    "Baldur's Gate 3": "1086940",
    "Inscryption": "1092790",
    "Omori": "1150690",
    "Terraria": "105600",
    "The Forest": "242760",
    "This War of Mine": "282070",
    "Frostpunk": "323190",
    "Rust": "252490",
    "Enshrouded": "1203620",
    "V Rising": "1604030",
    "Palworld": "1623730",
    "Lethal Company": "1966720",
    "Helldivers 2": "553850",
    "Kingdom Come: Deliverance II": "1771300",
    "Lies of P": "1627720",
    "Sekiro: Shadows Die Twice": "814380",
    "Dark Souls: Remastered": "570940",
    "Dark Souls II": "335300",
    "Dark Souls III": "374320",
    "Cyberpunk 2077": "1091500",
    "Red Dead Redemption 2": "1174180",
    "GTA V": "271590",
    "Danganronpa: Trigger Happy Havoc": "413410",
    "Danganronpa 2: Goodbye Despair": "413420",
    "Ghost Trick: Phantom Detective": "1967430",
    "IB": "1099950",
}

def to_filename(title):
    res = title.lower()
    res = re.sub(r'[^a-z0-9가-힣\s_]', ' ', res)
    res = res.strip()
    res = re.sub(r'\s+', '_', res)
    return res + ".jpg"

def get_console_list():
    with open(AUDIT_FILE, 'r', encoding='utf-8') as f:
        content = f.read()
    sections = re.split(r'## .*?Console', content)
    if len(sections) < 2:
        return []
    console_section = sections[1]
    console_section = re.split(r'---', console_section)[0]
    rows = re.findall(r'\|\s*\d+\s*\|\s*\*\*(.*?)\*\*\s*\|\s*(.*?)\s*\|\s*(.*?)\s*\|', console_section)
    return [r[0].strip() for r in rows]

def get_steam_image(title):
    # Check manual map first
    if title in MANUAL_APPIDS:
        appid = MANUAL_APPIDS[title]
        return f"https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/{appid}/header.jpg"
    # Try Steam search API
    try:
        url = f"https://store.steampowered.com/api/storesearch/?term={quote(title)}&l=english&cc=US"
        res = requests.get(url, timeout=10).json()
        if res.get('total', 0) > 0:
            appid = res['items'][0]['id']
            return f"https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/{appid}/header.jpg"
    except:
        pass
    return None

def run_batch(count=10):
    titles = get_console_list()
    completed = set(os.listdir(COMPLETE_DIR))
    processed = 0

    for title in titles:
        if processed >= count:
            break
        fname = to_filename(title)
        if fname in completed:
            print(f"  [SKIP - already complete] {title}")
            continue

        print(f"Downloading [{processed+1}/{count}]: {title}...")
        img_url = get_steam_image(title)
        if img_url:
            try:
                res = requests.get(img_url, timeout=10)
                if res.status_code == 200 and len(res.content) > 5000:
                    out = os.path.join(IMG_DIR, fname)
                    with open(out, 'wb') as f:
                        f.write(res.content)
                    print(f"  [SUCCESS] -> {fname}")
                    processed += 1
                else:
                    print(f"  [FAIL] Bad response for {title}")
            except Exception as e:
                print(f"  [ERROR] {title}: {e}")
        else:
            print(f"  [NOT FOUND] No Steam image for {title}")

    print(f"\nDone. {processed} downloaded. Check public/images/games/ and move verified ones to complete/")

if __name__ == "__main__":
    run_batch(10)
