# -*- coding: utf-8 -*-
"""
실제 존재하는 이미지만 경로 유지, 없는 건 "" 복원
"""
import re, unicodedata, os

IMG_DIR = r'C:\Users\Admin\Desktop\게임기획\포트폴리오\게임-기획자-포트폴리오-개선버전\public\images\games\complete'
DATA_DIR = r'C:\Users\Admin\Desktop\게임기획\포트폴리오\게임-기획자-포트폴리오-개선버전\src\data\games'
IMAGE_PREFIX = './images/games/complete/'

existing = {f.lower() for f in os.listdir(IMG_DIR) if f.endswith(('.jpg','.png','.webp','.jpeg'))}

def fix_file(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    def replacer(m):
        full = m.group(0)
        img_path = m.group(1)
        if not img_path:
            return full  # 이미 비어있으면 그대로
        basename = img_path.replace(IMAGE_PREFIX, '').lower()
        if basename in existing:
            return full  # 파일 있으면 그대로
        # 파일 없으면 "" 로 복원
        return re.sub(r'"image":\s*"[^"]+"', '"image": ""', full)

    pattern = r'\{[^}]*"image":\s*"([^"]*)"\s*\}'
    new_content = re.sub(pattern, replacer, content)

    fixed = content.count('"image": "./') - new_content.count('"image": "./')
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(new_content)
    print(f'{os.path.basename(filepath)}: {new_content.count(chr(34)+"image"+chr(34)+": "+chr(34)+"./")}/{content.count(chr(34)+"image"+chr(34)+": "+chr(34)+"./")} 경로 유지, {fixed}개 "" 복원')

for fname in ['pc.ts', 'mobile.ts', 'console.ts']:
    fix_file(os.path.join(DATA_DIR, fname))
