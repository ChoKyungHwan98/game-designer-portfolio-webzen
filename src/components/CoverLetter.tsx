import React from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, Plus, X } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { EditableText } from './EditableText';
import type { ResumeData } from '../types';

interface CoverLetterProps {
  setView: (v: any) => void;
  isEditing: boolean;
  data: ResumeData;
  setData: (d: ResumeData) => void;
}

export const CoverLetter = ({ setView, isEditing, data, setData }: CoverLetterProps) => {
  return (
    <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
      className="pt-32 pb-20 md:pt-[160px] px-6 md:px-12 max-w-5xl mx-auto w-full">
      
      <div className="flex items-center justify-between mb-16">
        <button onClick={() => setView('resume')} className="flex items-center gap-2 text-zinc-500 hover:text-[#0047BB] transition-colors group font-sans tracking-tight text-sm font-bold">
          <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" /> 이력서로 돌아가기
        </button>
      </div>

      <div className="text-center mb-16">
        <span className="text-[#0047BB] font-mono text-xs uppercase tracking-[0.3em] font-bold mb-4 block">Cover Letter</span>
        <h2 className="text-4xl md:text-5xl font-display font-bold text-[#2C2C2C] tracking-[-0.02em] mb-6">자기소개서</h2>
        <div className="w-16 h-px bg-[#0047BB]/30 mx-auto"></div>
      </div>

      {data.selfIntroductions ? (
        <div className="relative border-l-[3px] border-zinc-200/80 ml-2 md:ml-[40px] lg:ml-[80px] w-full max-w-[880px]">
          {data.selfIntroductions.map((intro, idx) => (
            <React.Fragment key={idx}>
              <article className="relative w-full pl-8 md:pl-16 pb-20 md:pb-24">
                {isEditing && (
                  <button onClick={() => { if (confirm("삭제하시겠습니까?")) { const n = [...(data.selfIntroductions || [])]; n.splice(idx, 1); setData({...data, selfIntroductions: n}); }}}
                    className="absolute -top-4 right-0 z-20 p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors shadow-lg" title="삭제">
                    <X className="w-4 h-4" />
                  </button>
                )}

                <div className="absolute -left-[19px] md:-left-[24px] top-0 w-9 h-9 md:w-11 md:h-11 bg-white border-[3px] border-[#0047BB]/20 rounded-full flex items-center justify-center text-[#0047BB] font-mono font-bold text-xs md:text-sm shadow-sm ring-4 ring-white">
                  {String(idx + 1).padStart(2, '0')}
                </div>

                <div className="mb-8 md:mb-10">
                  <h3 className="text-[28px] md:text-[36px] lg:text-[40px] font-display font-black text-[#1A1A1A] leading-[1.3] tracking-tighter break-keep">
                    <EditableText value={intro.logline} onSave={(v) => { const n = [...(data.selfIntroductions || [])]; n[idx].logline = v; setData({...data, selfIntroductions: n}); }} isEditing={isEditing} multiline />
                  </h3>
                </div>

                <div className="max-w-[760px] text-[#333F48] leading-[1.85] md:leading-[1.9] text-[15px] md:text-[17px] font-medium tracking-[-0.01em] [&>p]:mb-11 md:[&>p]:mb-14 [&>p]:break-keep [&>p:first-of-type]:text-[17px] md:[&>p:first-of-type]:text-[19px] [&>p:first-of-type]:font-semibold [&>p:first-of-type]:mb-9 md:[&>p:first-of-type]:mb-10 [&>p:first-of-type]:text-[#333F48] [&>p:first-of-type]:border-b [&>p:first-of-type]:border-[#0047BB]/10 [&>p:first-of-type]:pb-6 [&_strong]:text-[#111] [&_strong]:font-extrabold [&_strong]:bg-[linear-gradient(to_top,#0047BB33_40%,transparent_40%)] [&_strong]:px-1 [&>blockquote]:border-l-[3px] [&>blockquote]:border-[#0047BB]/25 [&>blockquote]:bg-[#F2F0EB]/60 [&>blockquote]:py-4 [&>blockquote]:px-6 [&>blockquote]:italic [&>blockquote]:text-[#76787A] [&>blockquote]:my-8 [&>blockquote]:rounded-r-lg [&_ul]:flex [&_ul]:flex-col [&_ul]:gap-3 [&_ul]:my-10 [&_ul]:pl-0 [&_ul>li]:list-none [&_ul>li]:relative [&_ul>li]:pl-5 md:[&_ul>li]:pl-6 [&_ul>li]:py-3 [&_ul>li]:pr-4 [&_ul>li]:bg-white [&_ul>li]:border [&_ul>li]:border-zinc-200/80 [&_ul>li]:rounded-xl [&_ul>li]:shadow-[0_2px_8px_-4px_rgba(0,0,0,0.1)] [&_ul>li::before]:content-[''] [&_ul>li::before]:absolute [&_ul>li::before]:left-0 [&_ul>li::before]:top-0 [&_ul>li::before]:bottom-0 [&_ul>li::before]:w-1.5 [&_ul>li::before]:bg-[#0047BB] [&_ul>li::before]:rounded-l-xl [&_ul>li_strong]:text-[#0047BB] [&_ul>li_strong]:font-black [&_ul>li_strong]:bg-none [&_ul>li_strong]:px-0 [&_ul>li_strong]:mr-1.5 [&_ol]:list-decimal [&_ol]:list-outside [&_ol]:ml-6 [&_ol]:mb-8 [&_ol>li]:mb-3 [&_ol>li]:pl-2">
                  <EditableText value={intro.content} onSave={(v) => { const n = [...(data.selfIntroductions || [])]; n[idx].content = v; setData({...data, selfIntroductions: n}); }} isEditing={isEditing} markdown={true} />
                </div>
              </article>
            </React.Fragment>
          ))}

          {isEditing && (
            <button onClick={() => { const n = [...(data.selfIntroductions || [])]; n.push({ logline: "새로운 항목의 로그라인을 입력하세요.", content: "내용을 입력하세요." }); setData({...data, selfIntroductions: n}); }}
              className="flex flex-col items-center justify-center border-2 border-dashed border-zinc-200 bg-zinc-50 hover:bg-zinc-100 transition-colors min-h-[200px] cursor-pointer rounded-3xl">
              <Plus className="w-8 h-8 text-zinc-400 mb-2" />
              <span className="text-zinc-500 font-bold">새 자기소개 항목 추가</span>
            </button>
          )}
        </div>
      ) : (
        <div className="bg-white p-8 md:p-12 rounded-2xl border border-black/5 markdown-body">
          {isEditing ? (
            <textarea className="w-full h-[400px] bg-[#0a0a0a] border border-[#2a2a2a] rounded-lg p-6 text-[#e8e4dc] font-sans text-sm focus:outline-none focus:border-[#0047BB]"
              value={data.selfIntroduction || ''} onChange={(e) => setData({...data, selfIntroduction: e.target.value})} />
          ) : (
            <ReactMarkdown remarkPlugins={[remarkGfm]}>{data.selfIntroduction || ''}</ReactMarkdown>
          )}
        </div>
      )}
    </motion.section>
  );
};
