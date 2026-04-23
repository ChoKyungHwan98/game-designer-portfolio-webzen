import React, { useState, useEffect } from 'react';
import { Search, Filter } from 'lucide-react';
import { ALL_GAMES } from '../data/games';

// DO NOT modify game data here — refer to src/data/games/*.ts
// Single Source of Truth: scratch/Gaming_DNA_Final_Readable.md

interface GameHistoryViewProps {
  onBack: () => void;
  history?: any;
  setHistory?: any;
  isEditing?: boolean;
}

const GENRE_MAP: Record<string, string[]> = {
  '역할수행(RPG)': ['RPG'],
  '어드벤처':      ['어드벤처', '노벨', '비주얼 노벨', 'Text Adventure'],
  '퍼즐':          ['퍼즐', '퀴즈', '캐주얼'],
  '액션':          ['액션', '난투', '대전', '배틀로얄', 'Run and Gun', 'Bullet Hell'],
  '전략':          ['전략', 'AOS', 'RTS', 'CCG', 'TCG', '디펜스', 'Auto Battler', 'Board Game'],
  '시뮬레이션':    ['시뮬레이션', '스포츠', '레이싱', 'Simulation', 'Sandbox'],
  '슈팅':          ['슈팅', 'FPS', 'TPS', '히어로슈터', 'Co-op Shooter', 'Shooting'],
  '리듬':          ['리듬', '리듬 액션'],
};

const CHART_DATA = [
  { label: '역할수행(RPG)', score: 99, angle: 0 },
  { label: '어드벤처',      score: 92, angle: 45 },
  { label: '퍼즐',          score: 88, angle: 90 },
  { label: '액션',          score: 85, angle: 135 },
  { label: '전략',          score: 82, angle: 180 },
  { label: '시뮬레이션',    score: 87, angle: 225 },
  { label: '슈팅',          score: 45, angle: 270 },
  { label: '리듬',          score: 98, angle: 315 },
];

const SVG_SIZE = 340;
const CX = SVG_SIZE / 2;
const CY = SVG_SIZE / 2;
const PADDING = 40;

function getPt(value: number, angleDeg: number): string {
  const r = (value / 100) * (SVG_SIZE / 2 - PADDING);
  const rad = (angleDeg - 90) * (Math.PI / 180);
  return `${CX + r * Math.cos(rad)},${CY + r * Math.sin(rad)}`;
}

function getFallbackGradient(genre: string): string {
  const g = genre.toLowerCase();
  if (g.includes('rpg'))                         return 'from-blue-600/40 to-indigo-900/80';
  if (g.includes('액션') || g.includes('난투'))  return 'from-red-600/40 to-rose-900/80';
  if (g.includes('전략') || g.includes('aos'))   return 'from-emerald-600/40 to-teal-900/80';
  if (g.includes('슈팅') || g.includes('fps'))   return 'from-zinc-600/40 to-slate-900/80';
  if (g.includes('리듬'))                         return 'from-purple-600/40 to-fuchsia-900/80';
  if (g.includes('퍼즐') || g.includes('캐주얼'))return 'from-amber-500/40 to-orange-800/80';
  if (g.includes('레이싱') || g.includes('스포츠')) return 'from-cyan-600/40 to-blue-800/80';
  return 'from-zinc-400/40 to-zinc-800/80';
}

const LOAD_STEP = 32;

export const GameHistoryView = ({ onBack }: GameHistoryViewProps) => {
  const [activeGenre, setActiveGenre]     = useState<string | null>(null);
  const [searchQuery, setSearchQuery]     = useState('');
  const [hoveredPoint, setHoveredPoint]   = useState<number | null>(null);
  const [displayLimit, setDisplayLimit]   = useState(LOAD_STEP);

  const pcConsoleGames = ALL_GAMES.filter(g => g.category === 'PC' || g.category === 'Console');
  const mobileGames    = ALL_GAMES.filter(g => g.category === 'Mobile');

  const filteredGames = ALL_GAMES.filter(g => {
    const matchSearch = searchQuery
      ? g.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (g.company && g.company.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (g.genre && g.genre.toLowerCase().includes(searchQuery.toLowerCase()))
      : true;

    const matchGenre = activeGenre
      ? (GENRE_MAP[activeGenre] || [activeGenre]).some(kw =>
          g.genre?.toLowerCase().includes(kw.toLowerCase())
        )
      : true;

    return matchSearch && matchGenre;
  });

  useEffect(() => {
    setDisplayLimit(LOAD_STEP);
  }, [activeGenre, searchQuery]);

  const displayedGames = filteredGames.slice(0, displayLimit);

  const polygonPoints = CHART_DATA.map(d => getPt(d.score, d.angle)).join(' ');
  const bgPolygons    = [20, 40, 60, 80, 100].map(level =>
    CHART_DATA.map(d => getPt(level, d.angle)).join(' ')
  );

  return (
    <section className="min-h-screen bg-transparent pt-28 pb-32">
      <div className="max-w-7xl mx-auto px-6 md:px-12">

        {/* ── Header Grid ─────────────────────────────────── */}
        <div className="grid lg:grid-cols-2 gap-8 mb-16">

          {/* Radar Chart */}
          <div className="bg-white border border-black/5 rounded-4xl p-8 shadow-sm flex flex-col items-center justify-center min-h-[400px]">
            <h3 className="font-bold text-lg text-zinc-500 tracking-tight self-start mb-6">장르별 숙련도 차트</h3>
            <div className="relative" style={{ width: SVG_SIZE, height: SVG_SIZE }}>
              <svg width={SVG_SIZE} height={SVG_SIZE} className="overflow-visible">
                {/* Grid rings */}
                {bgPolygons.map((pts, i) => (
                  <polygon key={i} points={pts} fill="none" stroke="#E5E7EB" strokeWidth="1" />
                ))}
                {/* Axis lines */}
                {CHART_DATA.map((d, i) => {
                  const [x2, y2] = getPt(100, d.angle).split(',');
                  return <line key={i} x1={CX} y1={CY} x2={x2} y2={y2} stroke="#E5E7EB" strokeWidth="1" />;
                })}
                {/* Data polygon */}
                <polygon
                  points={polygonPoints}
                  fill="rgba(0,71,187,0.15)"
                  stroke="#0047BB"
                  strokeWidth="2.5"
                />
                {/* Data points */}
                {CHART_DATA.map((d, i) => {
                  const [px, py] = getPt(d.score, d.angle).split(',');
                  const hovered  = hoveredPoint === i;
                  return (
                    <g key={i}>
                      <circle
                        cx={px} cy={py}
                        r={hovered ? 6 : 4}
                        fill={hovered ? 'white' : '#0047BB'}
                        stroke="#0047BB"
                        strokeWidth={hovered ? 2 : 0}
                        className="transition-all cursor-pointer"
                        onMouseEnter={() => setHoveredPoint(i)}
                        onMouseLeave={() => setHoveredPoint(null)}
                      />
                    </g>
                  );
                })}
                {/* Labels */}
                {CHART_DATA.map((d, i) => {
                  const [lx, ly] = getPt(115, d.angle).split(',');
                  const active   = activeGenre === d.label;
                  return (
                    <g
                      key={i}
                      onClick={() => setActiveGenre(active ? null : d.label)}
                      className="cursor-pointer group"
                      transform={`translate(${lx},${ly})`}
                    >
                      <text
                        x="0" y="0"
                        textAnchor="middle"
                        alignmentBaseline="middle"
                        className={`font-bold transition-all text-[13px] tracking-tight ${
                          active ? 'fill-[#0047BB]' : 'fill-zinc-400 group-hover:fill-zinc-700'
                        }`}
                      >
                        {d.label}
                      </text>
                    </g>
                  );
                })}
                {/* Tooltip */}
                {hoveredPoint !== null && (() => {
                  const d = CHART_DATA[hoveredPoint];
                  const [px, py] = getPt(d.score, d.angle).split(',');
                  return (
                    <g className="pointer-events-none">
                      <rect x={Number(px) - 24} y={Number(py) - 34} width="48" height="24" rx="4" fill="#1A2332" />
                      <text x={px} y={Number(py) - 21} textAnchor="middle" alignmentBaseline="middle" fill="white" className="text-[12px] font-bold tracking-widest">
                        {d.score}점
                      </text>
                    </g>
                  );
                })()}
              </svg>
            </div>
            {/* Genre filter pills */}
            <div className="flex flex-wrap justify-center gap-2 mt-6 w-full">
              <button
                onClick={() => setActiveGenre(null)}
                className={`px-4 py-2 rounded-full text-[12px] font-bold transition-all ${
                  !activeGenre ? 'bg-[#0047BB] text-white' : 'bg-zinc-100 text-zinc-500'
                }`}
              >
                전체
              </button>
              {Object.keys(GENRE_MAP).map(genre => (
                <button
                  key={genre}
                  onClick={() => setActiveGenre(genre === activeGenre ? null : genre)}
                  className={`px-4 py-2 rounded-full text-[12px] font-bold transition-all ${
                    activeGenre === genre ? 'bg-[#0047BB] text-white' : 'bg-zinc-100 text-zinc-500'
                  }`}
                >
                  {genre.replace('역할수행(RPG)', 'RPG')}
                </button>
              ))}
            </div>
          </div>

          {/* Stats */}
          <div className="flex flex-col gap-4">
            <div className="bg-white border border-black/5 rounded-4xl p-8 shadow-sm flex-1 flex flex-col justify-center">
              <h3 className="font-bold text-lg text-zinc-500 tracking-tight mb-8">플레이 요약 통계</h3>
              <ul className="space-y-6">
                <li className="flex items-center justify-between border-b border-black/5 pb-4">
                  <span className="font-bold text-[#2C2C2C]">총 플레이</span>
                  <span className="font-black text-[#0047BB] text-xl">{ALL_GAMES.length}종 이상</span>
                </li>
                <li className="flex items-center justify-between border-b border-black/5 pb-4">
                  <span className="font-bold text-[#2C2C2C]">주력 플랫폼</span>
                  <span className="font-bold text-zinc-600 text-lg">PC / 콘솔</span>
                </li>
                <li className="flex items-center justify-between border-b border-black/5 pb-4">
                  <span className="font-bold text-[#2C2C2C]">최장 플레이</span>
                  <span className="font-bold text-zinc-600 text-lg">메이플스토리 (15년)</span>
                </li>
                <li className="flex items-center justify-between">
                  <span className="font-bold text-[#2C2C2C]">전문 분야</span>
                  <span className="font-bold text-[#0047BB] text-lg bg-[#0047BB]/10 px-3 py-1 rounded-md">RPG / 리듬</span>
                </li>
              </ul>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-[#0047BB] text-white border border-[#0047BB] rounded-2xl p-6 shadow-sm">
                <span className="block font-bold text-blue-200 mb-2">PC/콘솔</span>
                <span className="text-3xl font-black">{pcConsoleGames.length}종</span>
              </div>
              <div className="bg-white border border-black/5 rounded-2xl p-6 shadow-sm">
                <span className="block font-bold text-zinc-400 mb-2">모바일</span>
                <span className="text-3xl font-black text-[#2C2C2C]">{mobileGames.length}종</span>
              </div>
            </div>
          </div>
        </div>

        {/* ── Game Grid ────────────────────────────────────── */}
        <div className="flex items-center justify-between mb-8 pb-4 border-b border-black/10">
          <h2 className="text-2xl font-black tracking-tight flex items-center gap-3">
            게임 상세 플레이 이력
            {activeGenre && (
              <span className="text-[#0047BB] before:content-['|'] before:text-zinc-300 before:mr-3 before:font-light">
                {activeGenre} 검색 결과
              </span>
            )}
          </h2>
          <div className="flex items-center gap-3">
            {/* Search */}
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
              <input
                type="text"
                placeholder="게임 / 회사 / 장르 검색"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="pl-9 pr-4 py-2 text-sm border border-black/10 rounded-full bg-white focus:outline-none focus:ring-2 focus:ring-[#0047BB]/30 w-52"
              />
            </div>
            {activeGenre && (
              <button
                onClick={() => setActiveGenre(null)}
                className="text-sm font-bold text-zinc-400 hover:text-red-500 flex items-center gap-1 transition-colors"
              >
                <Filter className="w-4 h-4" /> 필터 해제
              </button>
            )}
          </div>
        </div>

        {filteredGames.length === 0 ? (
          <div className="py-24 flex flex-col items-center justify-center text-zinc-400 bg-white rounded-3xl border border-black/5">
            <Search className="w-10 h-10 mb-4 opacity-20" />
            <p className="font-bold text-lg">해당 조건의 게임이 없습니다.</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {displayedGames.map(game => (
                <div
                  key={game.id}
                  className="relative group h-[140px] rounded-2xl overflow-hidden border border-black/5 shadow-sm hover:shadow-xl transition-all"
                >
                  {/* Background */}
                  <div className={`absolute inset-0 transition-transform duration-500 group-hover:scale-110 ${
                    game.image ? 'bg-zinc-900' : `bg-gradient-to-br ${getFallbackGradient(game.genre ?? '')}`
                  }`}>
                    {game.image && (
                      <img
                        src={game.image}
                        alt={game.title}
                        className="w-full h-full object-cover opacity-60"
                        loading="lazy"
                        style={{
                          objectPosition: (game as any).position || 'center',
                          objectFit: (game as any).size || 'cover',
                        }}
                      />
                    )}
                  </div>
                  {/* Gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
                  {/* Content */}
                  <div className="relative h-full z-10 p-5 flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-start mb-2">
                        <span className="text-[9px] font-black text-white bg-white/20 backdrop-blur-md px-2 py-0.5 rounded tracking-widest uppercase">
                          {game.genre}
                        </span>
                        <span className="text-[9px] font-bold text-white/50 border border-white/20 px-1.5 py-0.5 rounded uppercase">
                          {game.category === 'PC' || game.category === 'Console' ? 'PC/CONSOLE' : 'MOBILE'}
                        </span>
                      </div>
                      <h4 className="font-bold text-white text-base md:text-lg leading-tight mb-1 group-hover:text-blue-400 transition-colors drop-shadow-sm line-clamp-2">
                        {game.title}
                      </h4>
                    </div>
                    <div className="flex items-center justify-between mt-auto pt-2">
                      <span className="text-[10px] font-bold text-white/60 truncate max-w-[60%]">{game.company}</span>
                      {(game as any).playTime && (
                        <span className="text-[10px] font-black text-yellow-400 drop-shadow-md">{(game as any).playTime}</span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {displayLimit < filteredGames.length && (
              <div className="mt-12 text-center">
                <button
                  onClick={() => setDisplayLimit(prev => prev + LOAD_STEP)}
                  className="px-10 py-4 bg-[#0047BB] text-white font-black text-sm tracking-[0.2em] rounded-full hover:bg-[#003799] transition-all shadow-xl shadow-[#0047BB]/20 active:scale-95"
                >
                  LOAD MORE RECORDS ({filteredGames.length - displayLimit} REMAINING)
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
};
