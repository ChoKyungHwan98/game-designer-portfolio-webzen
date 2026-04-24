import React from 'react';
import { Wrench } from 'lucide-react';
import { BRAND_ICONS } from './icons/BrandIcons';
import type { ResumeData } from '../types';

interface ResumeToolsProps {
  data: ResumeData;
}

export const ResumeTools = ({ data }: ResumeToolsProps) => {
  if (!data.tools || data.tools.length === 0) return null;

  return (
    <section className="mt-6 pt-6 border-t border-zinc-100">
      <h3 className="text-[19px] font-bold mb-5 flex items-center gap-3 text-[#1A1A1A]">
        <Wrench className="text-[#0047BB] w-5 h-5" /> 기술 역량 및 도구
      </h3>
      <div className="flex flex-col gap-5">
        {/* Group 1: Documentation & Office */}
        <div className="space-y-3">
          <h4 className="text-[10px] font-black text-[#0047BB] tracking-[0.4em] uppercase border-b border-[#0047BB]/10 pb-1.5">DOCUMENTATION & OFFICE</h4>
          <div className="grid grid-cols-2 gap-x-6 gap-y-2.5">
            {data.tools.filter(t => ["Excel", "PowerPoint", "Word", "Notion"].includes(t.name)).map((tool, idx) => (
                <div key={idx} className="flex items-start gap-2.5">
                  <div className="text-[#1A1A1A] shrink-0 pt-0.5 group">
                    {BRAND_ICONS[tool.name] || <Wrench className="w-5 h-5 text-zinc-400" />}
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[13px] font-bold text-[#1A1A1A]">{tool.name}</span>
                    <p className="text-[11.5px] text-zinc-500 font-medium leading-tight">{tool.description}</p>
                  </div>
                </div>
            ))}
          </div>
        </div>

        {/* Group 2: AI Assistants */}
        <div className="space-y-3">
          <h4 className="text-[10px] font-black text-[#0047BB] tracking-[0.4em] uppercase border-b border-[#0047BB]/10 pb-1.5">AI ASSISTANTS</h4>
          <div className="grid grid-cols-2 gap-x-6 gap-y-2.5">
            {data.tools.filter(t => ["ChatGPT", "Claude", "Gemini", "Antigravity"].includes(t.name)).map((tool, idx) => (
              <div key={idx} className="flex items-start gap-2.5">
                <div className="text-[#1A1A1A] shrink-0 pt-0.5 group">
                  {BRAND_ICONS[tool.name] || <Wrench className="w-5 h-5 text-zinc-400" />}
                </div>
                <div className="flex flex-col">
                  <span className="text-[13px] font-bold text-[#1A1A1A]">{tool.name}</span>
                  <p className="text-[11.5px] text-zinc-500 font-medium leading-tight">{tool.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Group 3: Creative & Engine */}
        <div className="space-y-3">
          <h4 className="text-[10px] font-black text-[#0047BB] tracking-[0.4em] uppercase border-b border-[#0047BB]/10 pb-1.5">CREATIVE & ENGINE</h4>
          <div className="grid grid-cols-2 gap-x-6 gap-y-2.5">
            {data.tools.filter(t => ["Figma", "Unity"].includes(t.name)).map((tool, idx) => (
                <div key={idx} className="flex items-start gap-2.5">
                  <div className="text-[#1A1A1A] shrink-0 pt-0.5 group">
                    {BRAND_ICONS[tool.name] || <Wrench className="w-5 h-5 text-zinc-400" />}
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[13px] font-bold text-[#1A1A1A]">{tool.name}</span>
                    <p className="text-[11.5px] text-zinc-500 font-medium leading-tight">{tool.description}</p>
                  </div>
                </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
};
