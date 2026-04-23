import re
import sys
import io
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')

# Refactoring tasks:
# 1. Fix category: "MOBILE" -> "Mobile", "CONSOLE" -> "Console", "PC" stays "PC"
# 2. Fix Cookie Run: OvenBreak -> 쿠키런: 오븐브레이크
# 3. Fix 로블록스 (mobile) - should not have Roblox Corporation, it's in mobile now
# 4. Count and report

fixes = {
    'src/data/games/mobile.ts': [
        ('"category": "MOBILE"', '"category": "Mobile"'),
        ('"title": "Cookie Run: OvenBreak"', '"title": "쿠키런: 오븐브레이크"'),
    ],
    'src/data/games/console.ts': [
        ('"category": "CONSOLE"', '"category": "Console"'),
    ],
    'src/data/games/pc.ts': [
        # PC is already correct type-wise
    ],
}

for filepath, replacements in fixes.items():
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    original = content
    for old, new in replacements:
        count = content.count(old)
        content = content.replace(old, new)
        if count > 0:
            print(f"[{filepath.split('/')[-1]}] '{old}' -> '{new}' ({count}곳)")
    
    if content != original:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(content)

print("\n리팩토링 완료.")

# Final count
total = 0
for f in ['src/data/games/pc.ts', 'src/data/games/console.ts', 'src/data/games/mobile.ts']:
    with open(f, 'r', encoding='utf-8') as fp:
        c = fp.read()
    n = len(re.findall(r'"title":\s*"[^"]+"', c))
    print(f"  {f.split('/')[-1]}: {n}개")
    total += n
print(f"  총: {total}개")
