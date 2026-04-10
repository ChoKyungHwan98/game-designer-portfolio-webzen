const xlsx = require('xlsx');
const fs = require('fs');

const path = 'C:\\Users\\Admin\\Desktop\\게임기획\\사전 과제\\내가 플레이 해본 게임 리스트_조경환(기획3기).xlsx';

try {
  fs.mkdirSync('src\\data', { recursive: true });
  const workbook = xlsx.readFile(path);
  const sheetName = workbook.SheetNames[0];
  const data = xlsx.utils.sheet_to_json(workbook.Sheets[sheetName], { header: 1 });
  
  const games = data.slice(1).filter(row => row.length > 0 && row[2]).map((row, idx) => ({
    id: idx,
    genre: row[1] || '미분류',
    title: row[2] || '',
    platform: row[3] || '알 수 없음',
    playTime: row[4] || ''
  }));

  const fileContent = 'export const ALL_GAMES = ' + JSON.stringify(games, null, 2) + ';\n';
  fs.writeFileSync('src\\data\\games.ts', fileContent, 'utf8');
  console.log('Successfully wrote src\\data\\games.ts with ' + games.length + ' games.');
} catch (e) {
  console.error(e);
}
