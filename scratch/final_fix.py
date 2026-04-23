
import re

def final_fix(file_path, pattern, replacement):
    with open(file_path, 'r', encoding='utf-8', errors='ignore') as f:
        content = f.read()
    
    # "category": "Pc" 또는 "category": "PC" 등 모든 조합을 찾아서 "category": "PC"로 변경
    new_content = re.sub(r'\"category\":\s*\"P[cC]\"', '\"category\": \"PC\"', content)
    # 혹시 작은 따옴표일 경우 대비
    new_content = re.sub(r'\'category\':\s*\'P[cC]\'', '\'category\': \'PC\'', new_content)
    
    with open(file_path, 'w', encoding='utf-8') as f:
        f.write(new_content)
    
    return len(re.findall(r'\"category\":\s*\"PC\"', new_content))

pc_path = r'c:\Users\Admin\Desktop\게임기획\포트폴리오\게임-기획자-포트폴리오-개선버전\src\data\games\pc.ts'
count = final_fix(pc_path, None, None)
print(f"Final PC count in pc.ts: {count}")
