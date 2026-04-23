# 게임 이미지 파일명 컨벤션

저장 위치: `public/images/games/complete/`

## 규칙

1. 영문은 소문자로 변환
2. 공백 → 언더스코어(`_`)
3. 구분자(`: - – / ~`) → 언더스코어(`_`)
4. 특수문자 제거: `™` `®` `©` `!` `?` `.` `(` `)` `'` `"`
5. 악센트 제거: `é→e`, `ó→o`, `ü→u`
6. 한국어 그대로 유지
7. 연속 언더스코어 → 단일 언더스코어(`__` → `_`)
8. 확장자: `.jpg` (없을 경우 `.png` 가능)

## 예시

| 게임 타이틀 | 파일명 |
|---|---|
| `The Elder Scrolls V: Skyrim Special Edition` | `the_elder_scrolls_v_skyrim_special_edition.jpg` |
| `DARK SOULS™ II` | `dark_souls_ii.jpg` |
| `DARK SOULS™: REMASTERED` | `dark_souls_remastered.jpg` |
| `Sekiro™: Shadows Die Twice` | `sekiro_shadows_die_twice.jpg` |
| `Baldur's Gate 3` | `baldurs_gate_3.jpg` |
| `Pokémon GO` | `pokemon_go.jpg` |
| `Pokémon Sleep` | `pokemon_sleep.jpg` |
| `Yu-Gi-Oh! Duel Links` | `yu_gi_oh_duel_links.jpg` |
| `Yu-Gi-Oh! Master Duel` | `yu_gi_oh_master_duel.jpg` |
| `Plague Inc. (전염병 주식회사)` | `plague_inc_전염병_주식회사.jpg` |
| `Grand Theft Auto V 레거시` | `grand_theft_auto_v_레거시.jpg` |
| `Grand Theft Auto: San Andreas` | `grand_theft_auto_san_andreas.jpg` |
| `Counter-Strike 2` | `counter_strike_2.jpg` |
| `PUBG: BATTLEGROUNDS` | `pubg_battlegrounds.jpg` |
| `Left 4 Dead 2` | `left_4_dead_2.jpg` |
| `Sid Meier's Civilization V` | `sid_meiers_civilization_v.jpg` |
| `Romance of the Three Kingdoms XI` | `romance_of_the_three_kingdoms_xi.jpg` |
| `블루 아카이브` | `블루_아카이브.jpg` |
| `쿠키런: 킹덤` | `쿠키런_킹덤.jpg` |
| `워크래프트 III: 리포지드` | `워크래프트_iii_리포지드.jpg` |
| `스타크래프트 II` | `스타크래프트_ii.jpg` |
| `삼국지8 REMAKE` | `삼국지8_remake.jpg` |
| `삼국지13` | `삼국지13.jpg` |
| `프로젝트 세카이 컬러풀 스테이지! feat.하츠네 미쿠` | `프로젝트_세카이_컬러풀_스테이지_feat하츠네_미쿠.jpg` |
| `소녀전선2: 망명` | `소녀전선2_망명.jpg` |
| `P의 거짓` | `p의_거짓.jpg` |
| `Blockudoku - 블록 퍼즐 게임` | `blockudoku_블록_퍼즐_게임.jpg` |
| `DNF Duel` | `dnf_duel.jpg` |

## 전체 게임별 파일명 목록

다운로드 필요 목록 전체: `scripts/images_to_download.csv` 참조  
(컬럼: id, category, title, company, target_filename)
