import json
import logging
import os

logging.basicConfig(level=logging.INFO)

input_file = 'excel_all_sheets.json'
output_file = 'src/data/games.ts'

with open(input_file, 'r', encoding='utf-8') as f:
    data = json.load(f)['data']

all_games = []
id_counter = 0

def clean_string(val):
    if not isinstance(val, str):
        return str(val).strip()
    return val.strip()

for sheet_name, category in [('PC', 'PC'), ('모바일', 'Mobile'), ('콘솔 및 기타', 'Console')]:
    items = data.get(sheet_name, [])
    for row in items:
        title = clean_string(row.get('게임 이름', ''))
        if not title:
            continue
        
        genre = clean_string(row.get('게임 장르', ''))
        if not genre:
            genre = '미분류'
            
        company = clean_string(row.get('게임 회사', ''))
        if not company:
            company = '미상'
            
        play_time = clean_string(row.get('플레이 시간', ''))
        
        # Double check and standardizing some companies
        comp_lower = company.lower()
        if '블리자드' in comp_lower or 'blizzard' in comp_lower:
            company = 'Blizzard'
        elif '라이엇' in comp_lower or 'riot' in comp_lower:
            company = 'Riot Games'
        elif '포켓몬' in comp_lower:
            company = 'The Pokemon Company'
        elif '넥슨' in comp_lower:
            company = 'Nexon'
        elif '넷마블' in comp_lower:
            company = 'Netmarble'
        elif '엔씨' in comp_lower or 'nc' in comp_lower:
            company = 'NCSoft'
        elif '호요버스' in comp_lower or 'hoyoverse' in comp_lower:
            company = 'HoYoverse'
            
        game_obj = {
            'id': str(id_counter),
            'category': category,
            'genre': genre,
            'title': title,
            'company': company,
        }
        
        if play_time:
            game_obj['playTime'] = play_time
            
        all_games.append(game_obj)
        id_counter += 1

ts_content = "import type { GameHistoryItem } from '../types';\n\n"
ts_content += "export const ALL_GAMES = [\n"
for idx, g in enumerate(all_games):
    ts_content += f"  {json.dumps(g, ensure_ascii=False)}"
    if idx < len(all_games) - 1:
        ts_content += ",\n"
    else:
        ts_content += "\n"
ts_content += "];\n"

with open(output_file, 'w', encoding='utf-8') as f:
    f.write(ts_content)

print(f"Successfully processed {len(all_games)} games.")
