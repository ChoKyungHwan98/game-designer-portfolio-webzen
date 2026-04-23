# -*- coding: utf-8 -*-
"""
1. complete/ 폴더 이미지 컨벤션 리네임
2. 워크트리 데이터 파일 image 경로 업데이트 (빈칸→실제 파일)
"""
import os, re

IMG_DIR = r'C:\Users\Admin\Desktop\게임기획\포트폴리오\게임-기획자-포트폴리오-개선버전\public\images\games\complete'
DATA_DIR = r'C:\Users\Admin\Desktop\게임기획\포트폴리오\게임-기획자-포트폴리오-개선버전\.claude\worktrees\zealous-tereshkova-40c1c3\src\data\games'
PREFIX = './images/games/complete/'

# ── 1. 리네임 매핑 ──────────────────────────────────────────────────────────
RENAMES = {
    '2013_pro_baseball.jpg':                   '2013_프로야구.jpg',
    'apollo_justice_ace_attorney.jpg':          '역전재판_4.jpg',
    'black_desert.jpg':                         '검은사막.jpg',
    'dungeon_fighter_online.jpg':               '던전앤파이터.jpg',
    'elden_ring.jpg':                           '엘든_링.jpg',
    'get_to_work.jpg':                          'the_sims_4_get_to_work.jpg',
    'kartrider_drift.jpg':                      '카트라이더_드리프트.jpg',
    'lost_ark.jpg':                             '로스트아크.jpg',
    'ori_and_the_blind_forest.jpg':             'ori_and_the_blind_forest_definitive_edition.jpg',
    'phoenix_wright_ace_attorney.jpg':          '역전재판_1.jpg',
    'skyrim.jpg':                               'the_elder_scrolls_v_skyrim_special_edition.jpg',
    'tekken_7.jpg':                             '철권_7.jpg',
    'the_great_ace_attorney_2_resolve.jpg':     '대역전재판2_나루호도_류노스케의_각오.jpg',
    'the_great_ace_attorney_adventures.jpg':    '대역전재판_나루호도_류노스케의_모험.jpg',
    'the_king_of_fighters_98.jpg':              '킹_오브_파이터즈_98.jpg',
    '그루브_코스터_2.jpg':                       'groove_coaster_2.jpg',
    '길건너친구들.jpg':                          '길건너_친구들.jpg',
    '마블라이벌즈.jpg':                          '마블_라이벌즈.jpg',
    '블록쿠도쿠_블록_퍼즐_게임.jpg':             'blockudoku_블록_퍼즐_게임.jpg',
    '블루아카이브.jpg':                          '블루_아카이브.jpg',
    '서브웨이_서퍼.jpg':                         'subway_surfers.jpg',
    '전염병_주식회사.jpg':                        'plague_inc_전염병_주식회사.jpg',
    '템플_런.jpg':                              'temple_run.jpg',
    '후르츠_닌자.jpg':                           None,  # fruit_ninja.jpg 중복 → 삭제
}

# ── 2. 데이터에 반영할 image 경로 매핑 (game id → new filename) ──────────────
ID_TO_IMAGE = {
    # console.ts
    'console-1':   '엘든_링.jpg',
    'console-65':  'the_sims_4_get_to_work.jpg',
    'console-77':  '대역전재판_나루호도_류노스케의_모험.jpg',
    'console-78':  '대역전재판2_나루호도_류노스케의_각오.jpg',
    'console-129': '역전재판_1.jpg',
    'console-132': '역전재판_4.jpg',
    'console-133': 'ori_and_the_blind_forest_definitive_edition.jpg',
    'console-146': '철권_7.jpg',
    'console-150': '킹_오브_파이터즈_98.jpg',
    'console-127': 'the_elder_scrolls_v_skyrim_special_edition.jpg',
    # pc.ts
    'pc-7':  '검은사막.jpg',
    'pc-10': '던전앤파이터.jpg',
    'pc-12': '로스트아크.jpg',
    'pc-14': '마블_라이벌즈.jpg',
    'pc-25': '카트라이더_드리프트.jpg',
    # mobile.ts
    'mobile-8':  '블루_아카이브.jpg',
    'mobile-12': 'plague_inc_전염병_주식회사.jpg',
    'mobile-20': '2013_프로야구.jpg',
    'mobile-23': 'subway_surfers.jpg',
    'mobile-24': 'temple_run.jpg',
    'mobile-26': 'blockudoku_블록_퍼즐_게임.jpg',
    'mobile-32': '궁수의_전설.webp',
    'mobile-34': 'groove_coaster_2.jpg',
    'mobile-35': '길건너_친구들.jpg',
}

# ── Step 1: 리네임 ────────────────────────────────────────────────────────────
print('=== STEP 1: 이미지 리네임 ===')
for old, new in RENAMES.items():
    old_path = os.path.join(IMG_DIR, old)
    if not os.path.exists(old_path):
        print(f'  SKIP (없음): {old}')
        continue
    if new is None:
        os.remove(old_path)
        print(f'  삭제: {old}')
        continue
    new_path = os.path.join(IMG_DIR, new)
    if os.path.exists(new_path):
        print(f'  SKIP (이미 존재): {new}')
        continue
    os.rename(old_path, new_path)
    print(f'  {old} → {new}')

# ── Step 2: 데이터 파일 image 경로 업데이트 ──────────────────────────────────
print('\n=== STEP 2: 데이터 파일 업데이트 ===')
existing = {f.lower() for f in os.listdir(IMG_DIR)}

for fname in ['pc.ts', 'mobile.ts', 'console.ts']:
    fpath = os.path.join(DATA_DIR, fname)
    with open(fpath, 'r', encoding='utf-8') as f:
        content = f.read()

    updated = 0
    for gid, img_file in ID_TO_IMAGE.items():
        # 해당 파일에 속하는 ID인지 확인
        category = gid.split('-')[0]
        if category == 'pc' and fname != 'pc.ts': continue
        if category == 'mobile' and fname != 'mobile.ts': continue
        if category == 'console' and fname != 'console.ts': continue

        if img_file.lower() not in existing:
            print(f'  SKIP (파일 없음): {img_file}')
            continue

        new_path = PREFIX + img_file
        # "id": "gid" ... "image": "" 패턴에서 image를 업데이트
        pattern = r'("id":\s*"' + re.escape(gid) + r'"[^}]*"image":\s*)"[^"]*"'
        replacement = r'\1"' + new_path + '"'
        new_content, count = re.subn(pattern, replacement, content)
        if count > 0:
            content = new_content
            updated += count
            print(f'  {gid}: image → {img_file}')

    with open(fpath, 'w', encoding='utf-8') as f:
        f.write(content)
    print(f'  [{fname}] {updated}개 업데이트')

print('\n완료!')
