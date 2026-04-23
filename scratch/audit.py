import re
import sys
import io
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')

files = [
    'src/data/games/pc.ts',
    'src/data/games/console.ts',
    'src/data/games/mobile.ts'
]

total = 0
for f in files:
    with open(f, 'r', encoding='utf-8') as fp:
        content = fp.read()
    titles = re.findall(r'"title":\s*"([^"]+)"', content)
    print(f'\n=== {f}: {len(titles)}개 ===')
    for i, t in enumerate(titles, 1):
        print(f'  {i:3}. {t}')
    total += len(titles)

print(f'\n총 합계: {total}개')
