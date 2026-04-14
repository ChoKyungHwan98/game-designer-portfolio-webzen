import pandas as pd
import json

file_path = r'C:\Users\Admin\Desktop\게임기획\사전 과제\내가 플레이 해본 게임 리스트_조경환(기획3기).xlsx'
xls = pd.ExcelFile(file_path)
sheets = xls.sheet_names

summary = {}
for s in sheets:
    df = pd.read_excel(xls, sheet_name=s)
    df = df.dropna(how='all')
    df = df.fillna('')
    summary[s] = df.to_dict(orient='records')

with open('excel_all_sheets.json', 'w', encoding='utf-8') as f:
    json.dump({'sheets': sheets, 'data': summary}, f, ensure_ascii=False, indent=2)

print(f"Extracted sheets: {sheets}")
