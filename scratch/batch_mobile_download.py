import os
import re
import requests
from bs4 import BeautifulSoup
from urllib.parse import quote
import sys

# Force UTF-8
if sys.stdout.encoding != 'utf-8':
    import io
    sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')

BASE_PATH = r"c:\Users\Admin\Desktop\게임기획\포트폴리오\게임-기획자-포트폴리오-개선버전"
IMG_DIR = os.path.join(BASE_PATH, "public", "images", "games")
COMPLETE_DIR = os.path.join(IMG_DIR, "complete")
AUDIT_FILE = os.path.join(BASE_PATH, "scratch", "Gaming_DNA_Final_Readable.md")

if not os.path.exists(IMG_DIR): os.makedirs(IMG_DIR)
if not os.path.exists(COMPLETE_DIR): os.makedirs(COMPLETE_DIR)

def to_snake_case(text):
    # Allow Korean characters but replace spaces/special chars with underscores
    res = text.lower()
    res = re.sub(r'[^a-z0-9가-힣\s_]', ' ', res)
    res = res.strip()
    res = re.sub(r'\s+', '_', res)
    return res

def get_mobile_list():
    with open(AUDIT_FILE, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Extract Mobile section using a more flexible regex
    sections = re.split(r'## .*? Mobile', content)
    if len(sections) < 2:
        print("Could not find Mobile section")
        return []
        
    mobile_section = sections[1]
    mobile_section = re.split(r'## ', mobile_section)[0]
    
    # Parse rows
    rows = re.findall(r'\|\s*\d+\s*\|\s*\*\*(.*?)\*\*\s*\|\s*(.*?)\s*\|\s*(.*?)\s*\|', mobile_section)
    return [r[0].strip() for r in rows]

def download_mobile_image(title):
    try:
        # Search Google Play
        search_url = f"https://play.google.com/store/search?q={quote(title)}&c=apps"
        headers = {'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'}
        res = requests.get(search_url, headers=headers, timeout=10)
        soup = BeautifulSoup(res.text, 'html.parser')
        
        # Find the first app link
        app_link = soup.select_one('a[href*="/store/apps/details"]')
        if app_link:
            app_url = "https://play.google.com" + app_link['href']
            app_res = requests.get(app_url, headers=headers, timeout=10)
            app_soup = BeautifulSoup(app_res.text, 'html.parser')
            
            # Look for Feature Graphic (often the first large img or meta tag)
            img_tag = app_soup.select_one('meta[property="og:image"]')
            if img_tag:
                img_url = img_tag['content'].split('=')[0] # Get high-res version
                return img_url
    except Exception as e:
        print(f"  [ERROR] {title}: {e}")
    return None

def run_batch(count=10):
    all_titles = get_mobile_list()
    completed = set(os.listdir(COMPLETE_DIR))
    skip_list = {"Pokémon Duel", "2010 프로야구", "2011 프로야구"} # Delisted/Old games
    
    processed = 0
    for title in all_titles:
        if processed >= count: break
        
        if title in skip_list:
            continue
            
        filename = to_snake_case(title) + ".jpg"
        if filename in completed:
            continue
            
        print(f"Downloading [{processed+1}/{count}]: {title}...")
        img_url = download_mobile_image(title)
        
        if img_url:
            try:
                img_data = requests.get(img_url, timeout=10).content
                with open(os.path.join(IMG_DIR, filename), 'wb') as f:
                    f.write(img_data)
                print(f"  [SUCCESS] -> {filename}")
                processed += 1
            except:
                print(f"  [FAIL] Download failed for {title}")
        else:
            print(f"  [NOT FOUND] Google Play search failed for {title}")
            # Even if not found, we count it as an attempt to avoid loop? 
            # No, let's keep going until we get 10 successes or reach end.
            pass

if __name__ == "__main__":
    run_batch(10)
    print("\nBatch Complete. Please inspect files in public/images/games/ and move to complete/ if verified.")
