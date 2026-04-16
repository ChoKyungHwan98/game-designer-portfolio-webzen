import React, { useRef, useState } from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, ScrollText, Mail, Phone, User, GraduationCap, Award, Briefcase, Plus, X, Wrench, Figma, Info } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import html2pdf from 'html2pdf.js';
import { EditableText } from './EditableText';
import type { ResumeData } from '../types';

const TOOL_ICONS: Record<string, React.ReactNode> = {
  Word: <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 fill-current opacity-70 group-hover:opacity-100 group-hover:text-[#2b579a] transition-colors"><path d="M4.17 6.43l7.33-1.07v13.28l-7.33-1.07V6.43zm8.33-1.25V18.82l7.33 1.07V4.11L12.5 5.18zM6.5 8.79l1.19.12.8 4.23.95-4.23h1.05l.93 4.23.77-4.23 1.25.12-1.39 6.27h-1.12l-.98-4.32-.98 4.32H8l-1.5-6.51z"/></svg>,
  PowerPoint: <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 fill-current opacity-70 group-hover:opacity-100 group-hover:text-[#d24726] transition-colors"><path d="M4.18 6.48l7.32-1.07v13.2l-7.32-1.07V6.48zm8.32-1.32v13.68l7.32 1.07V4.09L12.5 5.16zM8.38 8.81h2.24c1.17 0 1.95.73 1.95 1.83 0 1.1-.78 1.83-1.95 1.83H9.4v3.23H8.38V8.81zm1.02.83v2.09h1.16c.55 0 .9-.36.9-.99 0-.64-.35-1.1-.9-1.1H9.4z"/></svg>,
  Excel: <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 fill-current opacity-70 group-hover:opacity-100 group-hover:text-[#217346] transition-colors"><path d="M4.18 6.48l7.32-1.07v13.2l-7.32-1.07V6.48zm8.32-1.32v13.68l7.32 1.07V4.09L12.5 5.16zm-5.74 3.73l1.14.15.82 2.37.89-2.37h1.02l-1.36 3.19 1.48 3.32h-1.14l-1.01-2.43-1 2.43H6.42l1.52-3.32-1.42-3.34z"/></svg>,
  Notion: <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 fill-current opacity-70 group-hover:opacity-100 group-hover:text-black transition-colors"><path d="M4.459 4.208c-.755 0-1.282.49-1.282 1.17v13.244c0 .679.527 1.17 1.282 1.17h15.082c.755 0 1.282-.491 1.282-1.17V5.378c0-.68-.527-1.17-1.282-1.17H4.459zM2.8 5.378c0-1.27 1.013-2.301 2.261-2.301h13.878C20.187 3.077 21.2 4.108 21.2 5.378v13.244c0 1.27-1.013 2.301-2.261 2.301H5.06A2.28 2.28 0 012.8 18.622V5.378zm5.553 10.603V8.895l4.896 6.945V8.125h1.196v7.856l-4.896-6.945v6.945H8.353z"/></svg>,
  Figma: <Figma className="w-3.5 h-3.5 opacity-70 group-hover:opacity-100 group-hover:text-[#f24e1e] transition-colors" />,
  Unity: <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 fill-current opacity-70 group-hover:opacity-100 group-hover:text-black transition-colors"><path d="M12 1.41l10.59 6.1v12.2L12 25.82 1.41 19.71V7.51zM12 3.8L3.8 8.53v9.42l8.2 4.71 8.2-4.71V8.53zM12 12.35l7-4.04-1.26-2.18-5.38 3.1-6.19-4.88-1.56 1.94 4.86 3.82-4.48 2.58L6.2 14.8l5.8-3.35z"/></svg>,
};

interface ResumeProps {
  setView: (v: any) => void;
  onBack: () => void;
  isEditing: boolean;
  data: ResumeData;
  setData: (d: ResumeData) => void;
}

export const Resume = ({ setView, onBack, isEditing, data, setData }: ResumeProps) => {
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
  const printRef = useRef<HTMLDivElement>(null);

  const handleDownload = async () => {
    if (!printRef.current || isGeneratingPdf) return;
    setIsGeneratingPdf(true);
    
    const element = printRef.current;
    const origLeft = element.style.left;
    const origTop = element.style.top;
    const origZIndex = element.style.zIndex;
    const origPosition = element.style.position;

    element.style.position = 'absolute';
    element.style.left = '0px';
    element.style.top = '0px';
    element.style.zIndex = '-9999';
    element.style.visibility = 'visible';

    try {
      const opt = {
        margin: [0, 0, 0, 0],
        filename: 'Resume_Portfolio.pdf',
        image: { type: 'jpeg', quality: 1 },
        html2canvas: { scale: 2, useCORS: true, letterRendering: true, windowWidth: 800 },
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' as const },
        pagebreak: { mode: 'css' }
      };
      
      const pdfBlob = await html2pdf().set(opt).from(element).output('blob');
      
      const blobUrl = URL.createObjectURL(pdfBlob);
      const link = document.createElement('a');
      link.style.display = 'none';
      link.href = blobUrl;
      link.download = 'Resume.pdf';
      
      document.body.appendChild(link);
      link.click();
      
      setTimeout(() => {
        document.body.removeChild(link);
        URL.revokeObjectURL(blobUrl);
      }, 5000);

    } catch (err) {
      console.error('PDF generation failed:', err);
      alert('PDF 생성에 실패했습니다. 다시 시도해 주세요.');
    } finally {
      element.style.position = origPosition;
      element.style.left = origLeft;
      element.style.top = origTop;
      element.style.zIndex = origZIndex;
      setIsGeneratingPdf(false);
    }
  };

  return (
    <>
      <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
        className="pt-32 pb-12 md:pt-[160px] md:pb-20 px-6 md:px-12 max-w-7xl mx-auto w-full">
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
          <button onClick={onBack} className="flex items-center gap-2 text-zinc-500 hover:text-[#0047BB] transition-colors group font-sans tracking-tight text-sm font-bold">
            <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" /> 대시보드로 돌아가기
          </button>
          <motion.button whileHover={{ y: -2 }} whileTap={{ scale: 0.98 }} onClick={handleDownload}
            disabled={isGeneratingPdf}
            className="px-8 py-4 bg-white border border-black/10 rounded-xl text-[#2C2C2C] font-bold flex items-center justify-center gap-3 hover:border-[#0047BB] hover:text-[#0047BB] transition-all duration-300 text-sm tracking-widest shadow-sm w-full sm:w-auto disabled:opacity-50">
            {isGeneratingPdf ? (
              <><span className="animate-spin inline-block w-4 h-4 border-2 border-[#0047BB] border-t-transparent rounded-full" /> PDF 생성 중...</>
            ) : (
              <><ScrollText className="w-4 h-4 text-[#0047BB]" /> PDF 다운로드</>
            )}
          </motion.button>
        </div>

        <div className="bg-white rounded-3xl p-6 lg:p-8 shadow-sm border border-black/5 mb-8 transition-colors">
          <div className="flex flex-col lg:flex-row items-center lg:items-start gap-8">
            <div className="flex flex-col sm:flex-row items-center gap-6 shrink-0">
              <div className="w-28 h-28 rounded-2xl overflow-hidden border border-black/5 shadow-sm shrink-0">
                <img src="https://picsum.photos/seed/profile/400/400" alt="Profile" className="w-full h-full object-cover grayscale opacity-80" />
              </div>
              <div className="text-center sm:text-left">
                <h1 className="text-3xl lg:text-4xl font-display font-bold text-[#2C2C2C] tracking-tight mb-1">
                  <EditableText value={data.name} onSave={(v) => setData({...data, name: v})} isEditing={isEditing} />
                </h1>
                <p className="text-[#0047BB] font-bold font-mono tracking-widest text-xs uppercase mb-4">
                  <EditableText value={data.role} onSave={(v) => setData({...data, role: v})} isEditing={isEditing} />
                </p>
                <div className="flex items-center gap-3 text-sm text-zinc-600 font-medium">
                  <Mail className="w-4 h-4 text-zinc-400" />
                  <EditableText value={data.email} onSave={(v) => setData({...data, email: v})} isEditing={isEditing} />
                </div>
                <div className="hidden print:flex items-center gap-3 text-sm text-zinc-600 mt-1">
                  <Phone className="w-4 h-4 text-zinc-400" />
                  <EditableText value={data.phone} onSave={(v) => setData({...data, phone: v})} isEditing={isEditing} />
                </div>
                
                {data.tools && data.tools.length > 0 && (
                  <div className="mt-5 flex flex-wrap gap-2">
                    {data.tools.map((tool, idx) => (
                      <span key={idx} className="group relative px-4 py-2 bg-white rounded-xl text-xs font-bold text-zinc-600 border border-black/5 hover:border-[#0047BB] hover:bg-[#0047BB]/5 hover:text-[#2C2C2C] transition-all cursor-help flex items-center justify-center gap-2 overflow-visible shadow-sm hover:shadow-md">
                        {TOOL_ICONS[tool.name] || <Wrench className="w-3.5 h-3.5 opacity-70 group-hover:opacity-100 group-hover:text-[#0047BB] transition-colors" />}
                        <EditableText value={tool.name} onSave={(v) => { const t = [...(data.tools||[])]; t[idx].name = v; setData({...data, tools: t}); }} isEditing={isEditing} />
                        <Info className="w-3 h-3 text-zinc-400 group-hover:text-[#0047BB] transition-colors" />
                        <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-[#0047BB] to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                        <div className="pointer-events-none absolute bottom-full left-1/2 -translate-x-1/2 translate-y-2 opacity-0 group-hover:-translate-y-2 group-hover:opacity-100 transition-all z-50 mb-3 w-max max-w-[320px] bg-[#2C2C2C] border border-white/10 text-white text-xs leading-[1.6] p-3 rounded-xl shadow-xl whitespace-pre-wrap font-medium text-left">
                          <EditableText value={tool.description} onSave={(v) => { const t = [...(data.tools||[])]; t[idx].description = v; setData({...data, tools: t}); }} isEditing={isEditing} />
                          <div className="absolute top-full left-1/2 -translate-x-1/2 border-solid border-t-[#2C2C2C] border-t-8 border-x-transparent border-x-8 border-b-0 w-0 h-0"></div>
                        </div>
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="hidden lg:block w-px h-24 bg-black/10 self-center shrink-0"></div>

            <div className="flex-1 min-w-0">
              <h3 className="text-xs font-bold text-zinc-400 tracking-widest uppercase mb-3 flex items-center gap-2">
                <User className="w-3.5 h-3.5" /> 자기소개
              </h3>
              <div className="text-sm text-zinc-600 leading-relaxed font-medium">
                <EditableText value={data.summary} onSave={(v) => setData({...data, summary: v})} isEditing={isEditing} markdown={true} />
              </div>
            </div>
          </div>
        </div>

        <motion.div 
          whileHover={{ y: -2 }}
          onClick={() => setView('cover-letter')}
          className="group relative bg-white rounded-3xl p-6 lg:p-8 shadow-sm border border-black/5 cursor-pointer overflow-hidden transition-all duration-300 hover:shadow-md hover:border-[#0047BB]/30 mb-8"
        >
          <div className="absolute top-0 left-0 bottom-0 w-1.5 bg-gradient-to-b from-[#0047BB] to-[#500014] opacity-80 group-hover:opacity-100 transition-opacity"></div>
          
          <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center gap-5 md:gap-8 ml-2">
            <div className="flex items-center gap-4 shrink-0">
              <div className="w-12 h-12 rounded-xl bg-zinc-50 border border-black/5 flex items-center justify-center group-hover:bg-[#0047BB]/5 transition-colors">
                <ScrollText className="w-5 h-5 text-[#0047BB]" />
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <div className="hidden md:flex items-center gap-2 mb-1.5">
                <span className="text-[10px] font-bold tracking-widest text-[#0047BB]">자기소개서</span>
              </div>
              <h3 className="text-lg md:text-[22px] font-bold text-[#2C2C2C] tracking-tight leading-snug group-hover:text-[#0047BB] transition-colors line-clamp-2">
                "{(data.selfIntroductions?.[0]?.logline || '자기소개서를 확인해주세요.').replace(/\*\*/g, '').replace(/  \n/g, ' ')}"
              </h3>
            </div>
          </div>
        </motion.div>

        <div className="grid lg:grid-cols-12 gap-8 mb-8">
          <div className="lg:col-span-5 space-y-6">
            <section className="bg-white rounded-3xl p-6 lg:p-8 shadow-sm border border-black/5 transition-colors">
              <h3 className="text-lg font-bold mb-5 flex items-center gap-3 text-[#2C2C2C]">
                <GraduationCap className="w-5 h-5" /> 학력 및 교육
              </h3>
              <div className="space-y-6">
                {data.education.map((edu, idx) => (
                  <div key={idx} className="relative pl-6 border-l-2 border-black/10">
                    <div className="absolute -left-[5px] top-1.5 w-2.5 h-2.5 rounded-none bg-zinc-300"></div>
                    <div className="flex flex-col gap-1 mb-2">
                      <h4 className="font-bold text-[15px] text-[#2C2C2C] leading-snug">
                        <EditableText value={edu.title} onSave={(v) => { const e = [...data.education]; e[idx].title = v; setData({...data, education: e}); }} isEditing={isEditing} />
                      </h4>
                      <span className="text-[11px] font-mono text-zinc-400">
                        <EditableText value={edu.period} onSave={(v) => { const e = [...data.education]; e[idx].period = v; setData({...data, education: e}); }} isEditing={isEditing} />
                      </span>
                    </div>
                    <div className="text-xs text-zinc-500 leading-relaxed mb-2">
                      <EditableText value={edu.description} onSave={(v) => { const e = [...data.education]; e[idx].description = v; setData({...data, education: e}); }} isEditing={isEditing} markdown={true} />
                    </div>
                    <ul className="text-[11px] text-zinc-500 space-y-1 list-disc list-inside">
                      {edu.details.map((detail, dIdx) => <li key={dIdx}>{detail}</li>)}
                    </ul>
                  </div>
                ))}
              </div>
            </section>

            <section className="bg-white rounded-3xl p-6 lg:p-8 shadow-sm border border-black/5 transition-colors">
              <h3 className="text-lg font-bold mb-5 flex items-center gap-3 text-[#2C2C2C]">
                <Award className="text-[#0047BB] w-5 h-5" /> 자격 및 수상
              </h3>
              <div className="space-y-3">
                {data.awards.map((award, idx) => (
                  <div key={idx} className="p-4 bg-zinc-50 rounded-xl border-l-3 border-l-[#0047BB] border-y border-r border-black/5">
                    <h4 className="font-bold text-sm mb-0.5 text-[#2C2C2C]">
                      <EditableText value={award.title} onSave={(v) => { const a = [...data.awards]; a[idx].title = v; setData({...data, awards: a}); }} isEditing={isEditing} />
                    </h4>
                    <p className="text-[11px] text-zinc-500">{award.organization} · {award.year}</p>
                  </div>
                ))}
              </div>
            </section>
          </div>

          <div className="lg:col-span-7">
            <section className="bg-white rounded-3xl p-6 lg:p-8 shadow-sm border border-black/5 transition-colors h-full">
              <h3 className="text-lg font-bold mb-5 flex items-center gap-3 text-[#2C2C2C]">
                <Briefcase className="text-[#0047BB] w-5 h-5" /> 프로젝트 경험
              </h3>
              <div className="space-y-7">
                {data.experience.map((exp, idx) => (
                  <div key={idx} className="relative pl-6 border-l-2 border-[#0047BB]/30">
                    <div className="absolute -left-[6px] top-1 w-3 h-3 rounded-full bg-[#0047BB] border-2 border-white"></div>
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-2">
                      <h4 className="font-bold text-base text-[#2C2C2C]">
                        <EditableText value={exp.title} onSave={(v) => { const e = [...data.experience]; e[idx].title = v; setData({...data, experience: e}); }} isEditing={isEditing} />
                      </h4>
                      <span className="text-[11px] font-mono text-zinc-400 shrink-0">
                        <EditableText value={exp.period} onSave={(v) => { const e = [...data.experience]; e[idx].period = v; setData({...data, experience: e}); }} isEditing={isEditing} />
                      </span>
                    </div>
                    <div className="text-sm text-[#0047BB] font-medium mb-3">
                      <EditableText value={exp.description} onSave={(v) => { const e = [...data.experience]; e[idx].description = v; setData({...data, experience: e}); }} isEditing={isEditing} markdown={true} />
                    </div>
                    <ul className="text-xs text-zinc-500 space-y-1.5 list-disc list-inside leading-relaxed">
                      {exp.details.map((detail, dIdx) => <li key={dIdx}>{detail}</li>)}
                    </ul>
                  </div>
                ))}
              </div>
            </section>
          </div>
        </div>
      </motion.section>

      <div ref={printRef} style={{ position: 'absolute', left: '-99999px', top: 0, width: '210mm', background: '#fff', color: '#000', fontFamily: "'Pretendard', 'Noto Sans KR', sans-serif", fontSize: '12px', lineHeight: '1.6' }}>
        <div style={{ padding: '28px 32px 16px', minHeight: '290mm' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', borderBottom: '2px solid #000', paddingBottom: '14px', marginBottom: '20px' }}>
            <div>
              <h1 style={{ fontSize: '26px', fontWeight: 900, margin: 0, letterSpacing: '-0.5px' }}>{data.name}</h1>
              <p style={{ fontSize: '12px', fontWeight: 700, color: '#666', letterSpacing: '3px', textTransform: 'uppercase', margin: '4px 0 0' }}>{data.role}</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
