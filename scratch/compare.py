import re
import sys
import io
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')

# 1. Read master list from .md
with open('scratch/Gaming_DNA_Final_Readable.md', 'r', encoding='utf-8') as f:
    md = f.read()

# Extract all titles from the .md
md_titles = set(re.findall(r'\|\s*\d+\s*\|\s*\*\*(.+?)\*\*\s*\|', md))
print(f"[MD 파일] 총 {len(md_titles)}개 타이틀\n")

# 2. Read all .ts files
ts_titles = {}
for fname in ['src/data/games/pc.ts', 'src/data/games/console.ts', 'src/data/games/mobile.ts']:
    with open(fname, 'r', encoding='utf-8') as f:
        content = f.read()
    titles = re.findall(r'"title":\s*"([^"]+)"', content)
    for t in titles:
        ts_titles[t] = fname

print(f"[TS 파일] 총 {len(ts_titles)}개 타이틀\n")

# 3. Find titles in .ts but NOT in .md (= erroneously added)
print("=" * 60)
print("⚠️  TS에 있지만 MD에 없는 항목 (잘못 추가된 항목 후보):")
print("=" * 60)
not_in_md = {t: f for t, f in ts_titles.items() if t not in md_titles}
for t, f in sorted(not_in_md.items()):
    print(f"  [{f.split('/')[-1]}] {t}")

print(f"\n총 {len(not_in_md)}개")

# 4. Find titles in .md but NOT in .ts (= missing from ts)
print("\n" + "=" * 60)
print("❌  MD에 있지만 TS에 없는 항목 (누락된 항목):")
print("=" * 60)
not_in_ts = md_titles - set(ts_titles.keys())
for t in sorted(not_in_ts):
    print(f"  {t}")
print(f"\n총 {len(not_in_ts)}개")
