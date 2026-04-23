# -*- coding: utf-8 -*-
"""
게임 이미지 파일명 통일 스크립트
- 기존 이미지 파일 리네임 명령 생성
- 데이터 파일(pc.ts, mobile.ts, console.ts) image 필드 전체 업데이트
- 다운로드 필요한 이미지 목록 출력
"""
import re, unicodedata, os

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

# 현재 존재하는 이미지 파일 목록 (확장자 포함)
existing_files = {f.lower(): f for f in os.listdir(IMG_DIR) if f.endswith(('.jpg', '.png', '.webp', '.jpeg'))}

# 데이터 파일 파싱 (정규식으로 title/image 추출)
def parse_games(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    games = []
    pattern = r'\{"id":\s*"([^"]+)".*?"title":\s*"([^"]+)".*?"image":\s*"([^"]*)"\}'
    for m in re.finditer(pattern, content):
        games.append({'id': m.group(1), 'title': m.group(2), 'old_image': m.group(3)})
    return games

pc_games = parse_games(os.path.join(DATA_DIR, 'pc.ts'))
mobile_games = parse_games(os.path.join(DATA_DIR, 'mobile.ts'))
console_games = parse_games(os.path.join(DATA_DIR, 'console.ts'))
all_games = pc_games + mobile_games + console_games

print('='*70)
print('1. 기존 파일 리네임 명령 (PowerShell)')
print('='*70)
rename_map = {}  # old_basename -> new_basename
for game in all_games:
    new_base = to_filename(game['title']) + '.jpg'
    old_img = game['old_image']
    if old_img:
        old_base = old_img.replace(IMAGE_PREFIX, '')
        if old_base and old_base != new_base:
            old_lower = old_base.lower()
            actual_old = existing_files.get(old_lower, old_base)
            if actual_old.lower() in existing_files:
                rename_map[actual_old] = new_base
                print(f'Rename-Item "{os.path.join(IMG_DIR, actual_old)}" "{new_base}"')

print(f'\n총 {len(rename_map)}개 파일 리네임 필요')

print('\n' + '='*70)
print('2. 새 image 필드 매핑 (전체 게임)')
print('='*70)
for game in all_games:
    new_base = to_filename(game['title']) + '.jpg'
    new_path = IMAGE_PREFIX + new_base
    print(f'{game["id"]:15} | {new_base:60} | {game["title"]}')

print('\n' + '='*70)
print('3. 다운로드 필요 목록 (현재 파일 없음)')
print('='*70)
need_download = []
for game in all_games:
    new_base = to_filename(game['title']) + '.jpg'
    # 새 이름으로도 없고, 리네임으로 커버도 안 되는 경우
    new_lower = new_base.lower()
    old_img = game['old_image']
    old_base = old_img.replace(IMAGE_PREFIX, '') if old_img else ''
    old_lower = old_base.lower() if old_base else ''
    has_file = (new_lower in existing_files) or (old_lower in existing_files and old_lower)
    if not has_file:
        need_download.append((game['id'], game['title'], new_base))
        print(f'{game["id"]:15} | {new_base:60} | {game["title"]}')

print(f'\n총 {len(need_download)}개 이미지 다운로드 필요')
print(f'이미 보유: {len(all_games) - len(need_download)}개')
