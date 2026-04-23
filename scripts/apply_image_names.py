# -*- coding: utf-8 -*-
"""
1. 기존 이미지 파일 리네임
2. pc.ts / mobile.ts / console.ts image 필드 전체 업데이트
3. 다운로드 필요 목록 CSV 저장
"""
import re, unicodedata, os, csv

IMG_DIR = r'C:\Users\Admin\Desktop\게임기획\포트폴리오\게임-기획자-포트폴리오-개선버전\public\images\games\complete'
DATA_DIR = r'C:\Users\Admin\Desktop\게임기획\포트폴리오\게임-기획자-포트폴리오-개선버전\src\data\games'
IMAGE_PREFIX = './images/games/complete/'

def to_filename(title):
    result = ''
    for char in title:
        if '\uAC00' <= char <= '\uD7A3' or '\u3131' <= char <= '\u318E':
            result += char
        else:
            n = unicodedata.normalize('NFD', char)
            result += n.encode('ascii', 'ignore').decode('ascii').lower()
    result = re.sub(r"'s\b", 's', result)
    result = re.sub(r"[™®©''\"\\']", '', result)
    result = re.sub(r'[!！?？。]', '', result)
    result = re.sub(r'[.\u3002]', '', result)
    result = re.sub(r'[:\-–—/~·×]', '_', result)
    result = re.sub(r'[\s]+', '_', result)
    result = re.sub(r'[^a-z0-9_\uAC00-\uD7A3\u3131-\u318E]', '', result)
    result = re.sub(r'_+', '_', result)
    return result.strip('_')

existing_files = {f.lower(): f for f in os.listdir(IMG_DIR) if f.endswith(('.jpg','.png','.webp','.jpeg'))}

def parse_and_update(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    def replacer(m):
        full = m.group(0)
        title = m.group(1)
        new_base = to_filename(title) + '.jpg'
        new_path = IMAGE_PREFIX + new_base
        # Replace image field
        updated = re.sub(r'"image":\s*"[^"]*"', f'"image": "{new_path}"', full)
        return updated

    pattern = r'\{[^}]*"title":\s*"([^"]+)"[^}]*\}'
    new_content = re.sub(pattern, replacer, content)

    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(new_content)
    print(f'Updated: {os.path.basename(filepath)}')

# Step 1: 기존 파일 리네임
print('=== STEP 1: 파일 리네임 ===')
renamed = 0
# old_path -> new_name 매핑: 데이터에서 old image 읽어서 생성
all_files = ['pc.ts', 'mobile.ts', 'console.ts']
for fname in all_files:
    fpath = os.path.join(DATA_DIR, fname)
    with open(fpath, 'r', encoding='utf-8') as f:
        content = f.read()
    pattern = r'"title":\s*"([^"]+)"[^}]*"image":\s*"([^"]*)"'
    for m in re.finditer(pattern, content):
        title, old_img = m.group(1), m.group(2)
        if not old_img:
            continue
        old_base = old_img.replace(IMAGE_PREFIX, '')
        new_base = to_filename(title) + '.jpg'
        if old_base == new_base:
            continue
        old_lower = old_base.lower()
        if old_lower in existing_files:
            actual = existing_files[old_lower]
            old_path = os.path.join(IMG_DIR, actual)
            new_path = os.path.join(IMG_DIR, new_base)
            if not os.path.exists(new_path):
                os.rename(old_path, new_path)
                print(f'  {actual} -> {new_base}')
                # Update existing_files dict
                del existing_files[old_lower]
                existing_files[new_base.lower()] = new_base
                renamed += 1
print(f'  총 {renamed}개 리네임 완료\n')

# Step 2: 데이터 파일 image 필드 업데이트
print('=== STEP 2: 데이터 파일 업데이트 ===')
for fname in all_files:
    parse_and_update(os.path.join(DATA_DIR, fname))

# Step 3: 다운로드 필요 목록 CSV 생성
print('\n=== STEP 3: 다운로드 목록 CSV 생성 ===')
# Reload existing files after rename
existing_files2 = {f.lower() for f in os.listdir(IMG_DIR) if f.endswith(('.jpg','.png','.webp','.jpeg'))}

rows = []
for fname in all_files:
    fpath = os.path.join(DATA_DIR, fname)
    with open(fpath, 'r', encoding='utf-8') as f:
        content = f.read()
    pattern = r'"id":\s*"([^"]+)".*?"category":\s*"([^"]+)".*?"title":\s*"([^"]+)".*?"company":\s*"([^"]+)".*?"image":\s*"([^"]*)"'
    for m in re.finditer(pattern, content):
        gid, cat, title, company, img = m.groups()
        new_base = to_filename(title) + '.jpg'
        if new_base.lower() not in existing_files2:
            rows.append([gid, cat, title, company, new_base])

csv_path = r'C:\Users\Admin\Desktop\게임기획\포트폴리오\게임-기획자-포트폴리오-개선버전\scripts\images_to_download.csv'
with open(csv_path, 'w', newline='', encoding='utf-8-sig') as f:
    w = csv.writer(f)
    w.writerow(['id', 'category', 'title', 'company', 'target_filename'])
    w.writerows(rows)

print(f'  저장: scripts/images_to_download.csv')
print(f'  다운로드 필요: {len(rows)}개')
print(f'  이미 보유: {355 - len(rows)}개')
