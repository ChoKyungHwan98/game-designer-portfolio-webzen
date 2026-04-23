
import os

def force_replace(file_path, target, replacement):
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    count = content.count(target)
    new_content = content.replace(target, replacement)
    
    with open(file_path, 'w', encoding='utf-8') as f:
        f.write(new_content)
    
    return count

pc_path = r'c:\Users\Admin\Desktop\게임기획\포트폴리오\게임-기획자-포트폴리오-개선버전\src\data\games\pc.ts'
view_path = r'c:\Users\Admin\Desktop\게임기획\포트폴리오\게임-기획자-포트폴리오-개선버전\src\components\GameHistoryView.tsx'

pc_count = force_replace(pc_path, '"category": "Pc"', '"category": "PC"')
view_count = force_replace(view_path, "category === 'Pc'", "category === 'PC'")

print(f"pc.ts replaced: {pc_count}")
print(f"GameHistoryView.tsx replaced: {view_count}")
