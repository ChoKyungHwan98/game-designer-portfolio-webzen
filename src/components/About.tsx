import React from 'react';
import { motion } from 'motion/react';
import { EditableText } from './EditableText';

interface AboutProps {
  isEditing: boolean;
  content: any;
  setContent: (c: any) => void;
}

const stats = [
  {
    symbol: '0 → +',
    label: '재미 설계 철학',
    desc: '0에서 플러스가 되는\n경험을 설계하는 기획자',
  },
  {
    symbol: '3건+',
    label: '완성 프로젝트',
    desc: '시스템·밸런스·레벨\n처음부터 끝까지 단독 설계',
  },
  {
    symbol: 'A → Z',
    label: '전체 기획 담당',
    desc: '아이디어 발굴부터\n출시 전략까지 전담',
  },
];

export const About = ({ isEditing, content, setContent }: AboutProps) => (
  <section
    id="about"
    className="pt-[100px] lg:pt-[130px] pb-24 lg:pb-32 px-6 md:px-12 relative flex flex-col justify-start bg-transparent overflow-hidden"
  >
    {/* Subtle dot grid */}
    <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_center,rgba(0,0,0,0.025)_1px,transparent_1px)] bg-size-[28px_28px]" />
    <div className="absolute top-0 left-0 right-0 h-px bg-linear-to-r from-transparent via-[#0047BB]/20 to-transparent" />

    <div className="max-w-7xl mx-auto w-full relative z-10">

      {/* ── SECTION HEADER ── */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4 border-b border-black/5 pb-8">
        <div>
          <span className="text-[#0047BB] font-sans text-[11px] font-bold tracking-widest uppercase mb-3 block">01. 소개</span>
          <h2 className="flex flex-col gap-1 items-start mt-2">
            <span className="text-2xl md:text-3xl text-zinc-500 font-display font-medium tracking-tight">논리와 감성으로,</span>
            <span className="flex items-baseline gap-2 leading-none mt-1">
              <span className="text-[72px] md:text-[90px] lg:text-[110px] font-display font-black tracking-tighter text-zinc-300 leading-none">0</span>
              <span className="text-3xl md:text-4xl lg:text-5xl font-display font-black text-zinc-400">에서</span>
              <span className="text-[82px] md:text-[100px] lg:text-[124px] font-display font-black tracking-tighter text-[#0047BB] leading-none drop-shadow-[0_0_32px_rgba(0,71,187,0.18)]">+</span>
              <span className="text-3xl md:text-4xl lg:text-5xl font-display font-black text-zinc-400">로</span>
            </span>
          </h2>
        </div>
        <p className="text-zinc-400 text-sm leading-[1.8] md:text-right font-medium max-w-[220px]">
          프로젝트의 뼈대를 세우고<br />재미의 본질을 설계하는 핵심 철학입니다.
        </p>
      </div>

      {/* ── TWO-COLUMN LAYOUT ── */}
      <div className="grid lg:grid-cols-[1fr_400px] xl:grid-cols-[1fr_440px] gap-12 lg:gap-16 items-start">

        {/* LEFT: body copy — 2 paragraphs only */}
        <div className="flex flex-col gap-10 pt-2">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.75, ease: [0.16, 1, 0.3, 1] }}
            className="relative pl-5"
          >
            <div className="absolute left-0 top-1 bottom-1 w-[2px] bg-[#0047BB]/30 rounded-full" />
            <div className="text-[17px] md:text-[18px] lg:text-[20px] text-[#1A1A1A] leading-[1.9] font-semibold tracking-[-0.01em] break-keep">
              <EditableText value={content.p1} onSave={(v) => setContent({ ...content, p1: v })} isEditing={isEditing} markdown />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
            className="text-[14px] md:text-[15px] lg:text-[16px] text-zinc-500 leading-[1.85] font-medium tracking-[-0.005em] break-keep"
          >
            <EditableText value={content.p2} onSave={(v) => setContent({ ...content, p2: v })} isEditing={isEditing} markdown />
          </motion.div>
        </div>

        {/* RIGHT: unified stat panel */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          className="bg-white rounded-2xl border border-black/6 shadow-[0_4px_32px_-8px_rgba(0,0,0,0.07)] overflow-hidden"
        >
          {stats.map((stat, i) => (
            <div
              key={i}
              className={`flex items-center gap-6 px-7 py-6 group hover:bg-[#0047BB]/[0.025] transition-colors duration-300 ${i < stats.length - 1 ? 'border-b border-black/5' : ''}`}
            >
              {/* Symbol */}
              <div className="shrink-0 w-[88px] text-right">
                <span className="text-[22px] font-black text-[#0047BB]/80 font-mono tracking-tight leading-none group-hover:text-[#0047BB] transition-colors duration-300">
                  {stat.symbol}
                </span>
              </div>

              {/* Divider */}
              <div className="w-px self-stretch bg-black/6 shrink-0" />

              {/* Text */}
              <div className="flex flex-col gap-0.5">
                <p className="text-[10px] font-black tracking-[0.18em] text-[#0047BB]/50 uppercase">{stat.label}</p>
                <p className="text-[13px] lg:text-[14px] text-zinc-600 font-semibold leading-[1.6] break-keep whitespace-pre-line">{stat.desc}</p>
              </div>
            </div>
          ))}

          {/* Bottom accent */}
          <div className="px-7 py-5 bg-[#0047BB]/[0.03] border-t border-[#0047BB]/8">
            <p className="text-[13px] text-[#0047BB] font-bold leading-[1.7] break-keep">
              저도 누군가의 하루를 움직이는,{' '}
              <span className="font-black">그 +를 설계하는 기획자</span>가 되겠습니다.
            </p>
          </div>
        </motion.div>

      </div>
    </div>
  </section>
);
