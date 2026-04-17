import React from 'react';
import { motion } from 'motion/react';
import type { Skill } from '../types';

interface SkillsProps {
  isEditing: boolean;
  skills: Skill[];
  setSkills: (s: Skill[]) => void;
}

export const Skills = ({ skills }: SkillsProps) => {
  return (
    <section
      id="skills"
      className="py-24 lg:py-32 px-6 md:px-12 relative bg-[#FAFAFA] border-t border-black/5 overflow-hidden"
    >
      {/* Subtle dot grid */}
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_center,rgba(0,0,0,0.025)_1px,transparent_1px)] bg-[size:28px_28px]" />

      <div className="max-w-7xl mx-auto w-full relative z-10">

        {/* ── HEADER ── */}
        <div className="mb-14 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <motion.span
              initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
              className="text-[#0047BB] text-[11px] font-black tracking-[0.22em] uppercase block mb-3"
            >
              03. 핵심 역량
            </motion.span>
            <motion.div
              initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
              transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            >
              <span className="text-xl md:text-2xl text-zinc-400 font-medium block mb-1">논리와 구조를 AI로 확장하는</span>
              <h2 className="text-5xl md:text-6xl lg:text-[5rem] font-black text-[#2C2C2C] tracking-tighter leading-none">기획 역량</h2>
            </motion.div>
          </div>
          <motion.p
            initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="text-zinc-600 text-sm font-medium max-w-xs md:text-right leading-relaxed"
          >
            추상적인 수치가 아닌,<br />실제 결과물로 증명하는 기획 역량입니다.
          </motion.p>
        </div>

        {/* ── SKILL CARDS ── */}
        <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
          {skills.map((skill, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 32 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.7, delay: idx * 0.15, ease: [0.16, 1, 0.3, 1] }}
              className="group bg-white rounded-3xl border border-black/5 shadow-sm hover:shadow-xl hover:border-[#0047BB]/20 hover:-translate-y-1 transition-all duration-500 flex flex-col overflow-hidden"
            >
              {/* Card top accent bar */}
              <div className="h-1 bg-gradient-to-r from-[#0047BB] to-[#0047BB]/30 group-hover:to-[#0047BB] transition-all duration-500" />

              <div className="p-8 flex flex-col flex-1">
                {/* ── Card Header ── */}
                <div className="flex items-start gap-4 mb-6 pb-6 border-b border-black/5">
                  <div className="w-11 h-11 rounded-2xl bg-[#0047BB]/8 flex items-center justify-center text-[#0047BB] group-hover:bg-[#0047BB] group-hover:text-white transition-all duration-300 shrink-0">
                    {skill.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-xl font-black text-[#2C2C2C] tracking-tight">{skill.name}</h3>
                    <p className="text-[13px] text-zinc-600 font-medium mt-1 leading-snug break-keep">{skill.caption}</p>
                  </div>
                </div>

                {/* ── Capabilities List ── */}
                <div className="flex flex-col gap-2.5 flex-1 mb-7">
                  {skill.capabilities.map((cap, cIdx) => {
                    const isMain = cap.tier === 1;
                    const isSub = cap.tier === 2;
                    const isDeep = cap.tier === 3;
                    return (
                      <div
                        key={cIdx}
                        className={`flex items-center gap-2.5 ${isDeep ? 'pl-7' : isSub ? 'pl-3.5' : ''}`}
                      >
                        {/* Hierarchical dot */}
                        <span className={`shrink-0 rounded-full ${
                          isMain ? 'w-2 h-2 bg-[#0047BB]' :
                          isSub  ? 'w-1.5 h-1.5 bg-[#0047BB]/50' :
                          isDeep ? 'w-1 h-1 bg-[#0047BB]/30' :
                                   'w-1.5 h-1.5 bg-zinc-300'
                        }`} />
                        <span className={`leading-snug ${
                          isMain
                            ? 'text-[14px] font-bold text-[#2C2C2C]'
                            : isSub
                            ? 'text-[13px] font-semibold text-zinc-600'
                            : isDeep
                            ? 'text-[12px] font-medium text-zinc-500'
                            : 'text-[13px] font-medium text-zinc-600'
                        }`}>{cap.name}</span>
                      </div>
                    );
                  })}
                </div>

                {/* ── Evidence Metrics (the "정수화") ── */}
                <div className="grid grid-cols-3 gap-2 pt-5 border-t border-dashed border-black/8">
                  {skill.evidences.map((ev, eIdx) => (
                    <div
                      key={eIdx}
                      className="flex flex-col items-center text-center px-1 py-2 rounded-xl hover:bg-[#0047BB]/4 transition-colors"
                    >
                      <span className="text-[#0047BB] font-black text-lg font-mono leading-none mb-1">{ev.value}</span>
                      <span className="text-zinc-500 text-[10px] font-semibold leading-tight">{ev.label}</span>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
};
