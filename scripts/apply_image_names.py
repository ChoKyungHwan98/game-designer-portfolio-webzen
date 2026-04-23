# -*- coding: utf-8 -*-
"""
1. pc.ts / mobile.ts / console.ts image 필드 전체 업데이트
2. public/images/games/complete 폴더의 파일들과 매칭 (확장자 jpg, png, webp, jpeg 지원)
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

# 확장자 무관하게 파일명(소문자) -> 실제파일명 매핑
existing_files = {}
if os.path.exists(IMG_DIR):
    for f in os.listdir(IMG_DIR):
        if f.lower().endswith(('.jpg','.png','.webp','.jpeg')):
            base = os.path.splitext(f)[0].lower()
            existing_files[base] = f

def parse_and_update(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    def replacer(m):
        full = m.group(0)
        title = m.group(1)
        base_name = to_filename(title).lower()
        
        if base_name in existing_files:
            actual_file = existing_files[base_name]
            new_path = IMAGE_PREFIX + actual_file
            # Replace image field
            updated = re.sub(r'"image":\s*"[^"]*"', f'"image": "{new_path}"', full)
            return updated
        return full

    pattern = r'\{[^}]*"title":\s*"([^"]+)"[^}]*\}'
    new_content = re.sub(pattern, replacer, content)

    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(new_content)
    print(f'Updated: {os.path.basename(filepath)}')

print('=== 데이터 파일 이미지 경로 업데이트 ===')
all_files = ['pc.ts', 'mobile.ts', 'console.ts']
for fname in all_files:
    fpath = os.path.join(DATA_DIR, fname)
    if os.path.exists(fpath):
        parse_and_update(fpath)

# Step 3: 다운로드 필요 목록 CSV 생성
print('\n=== 다운로드 필요 목록 CSV 생성 ===')
rows = []
for fname in all_files:
    fpath = os.path.join(DATA_DIR, fname)
    if not os.path.exists(fpath): continue
    with open(fpath, 'r', encoding='utf-8') as f:
        content = f.read()
    pattern = r'"id":\s*"([^"]+)".*?"category":\s*"([^"]+)".*?"title":\s*"([^"]+)".*?"company":\s*"([^"]+)".*?"image":\s*"([^"]*)"'
    for m in re.finditer(pattern, content):
        gid, cat, title, company, img = m.groups()
        if not img or img == IMAGE_PREFIX:
            rows.append([gid, cat, title, company, to_filename(title) + '.jpg'])

csv_path = r'C:\Users\Admin\Desktop\게임기획\포트폴리오\게임-기획자-포트폴리오-개선버전\scripts\images_to_download.csv'
with open(csv_path, 'w', newline='', encoding='utf-8-sig') as f:
    w = csv.writer(f)
    w.writerow(['id', 'category', 'title', 'company', 'target_filename'])
    w.writerows(rows)

print(f'  저장: scripts/images_to_download.csv')
print(f'  이미지 없음: {len(rows)}개')
