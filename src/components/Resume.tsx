import React, { useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ScrollText, Mail, Phone, GraduationCap, Award, Briefcase, Wrench, Figma, User } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import html2pdf from 'html2pdf.js';
import { EditableText } from './EditableText';
import { CoverLetter } from './CoverLetter';
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
  activeTab: 'resume' | 'cover-letter';
  setActiveTab: (tab: 'resume' | 'cover-letter') => void;
  isGeneratingPdf: boolean;
  setIsGeneratingPdf: (v: boolean) => void;
}

/* ================================================================ */
/*  PDF 인쇄용 HTML 문자열 생성 함수 (이력서 / 자기소개서)            */
/* ================================================================ */
function buildResumePdfHtml(data: ResumeData): string {
  const educationHtml = data.education.map(edu => `
    <div style="margin-bottom:14px">
      <div style="display:flex;justify-content:space-between;align-items:baseline;margin-bottom:3px">
        <h3 style="font-size:11.5px;font-weight:700;margin:0">${edu.title}</h3>
        <span style="font-size:9.5px;color:#666;font-family:monospace;white-space:nowrap;margin-left:8px">${edu.period}</span>
      </div>
      <p style="font-size:10px;color:#555;margin:0 0 3px 0">${edu.description}</p>
      ${edu.details.length ? `<ul style="margin:0;padding-left:14px;font-size:9.5px;color:#444">${edu.details.map(d => `<li style="margin-bottom:1px">${d}</li>`).join('')}</ul>` : ''}
    </div>
  `).join('');

  const toolsHtml = (data.tools || []).map(t => `
    <li style="margin-bottom:4px"><strong>${t.name}</strong> — ${t.description}</li>
  `).join('');

  const certsHtml = (data.certificates || []).map(c => `
    <li style="margin-bottom:3px">
      <div style="display:flex;justify-content:space-between;align-items:center">
        <span style="font-weight:600">${c.name}</span>
        <span style="font-family:monospace;color:#0047BB;font-size:9.5px;font-weight:700">${c.date}</span>
      </div>
    </li>
  `).join('');

  const expHtml = data.experience.map(exp => `
    <div style="margin-bottom:16px;page-break-inside:avoid">
      <div style="display:flex;justify-content:space-between;align-items:baseline;margin-bottom:4px">
        <h3 style="font-size:13px;font-weight:800;margin:0">${exp.title}</h3>
        <span style="font-size:10px;color:#666;font-family:monospace;white-space:nowrap;margin-left:8px">${exp.period}</span>
      </div>
      <div style="font-size:10.5px;font-weight:700;color:#333;margin-bottom:6px;padding:3px 7px;background:#f5f5f5;border-left:3px solid #0047BB">${exp.description}</div>
      <ul style="margin:0;padding-left:14px;font-size:10px;color:#444;line-height:1.7">
        ${exp.details.map(d => `<li style="margin-bottom:3px">${d}</li>`).join('')}
      </ul>
    </div>
  `).join('');

  // Clean summary for plain text (remove markdown bold)
  const summaryClean = data.summary.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>').replace(/\n/g, '<br/>');

  return `
    <div style="padding:24px 28px 16px;font-family:'Pretendard','Noto Sans KR',sans-serif;font-size:11px;line-height:1.55;color:#000;background:#fff">
      <!-- Header -->
      <div style="display:flex;justify-content:space-between;align-items:flex-end;border-bottom:2.5px solid #000;padding-bottom:12px;margin-bottom:16px">
        <div>
          <h1 style="font-size:24px;font-weight:900;margin:0;letter-spacing:-0.5px">${data.name}</h1>
          <p style="font-size:11px;font-weight:700;color:#666;letter-spacing:3px;text-transform:uppercase;margin:3px 0 0">${data.role}</p>
        </div>
        <div style="text-align:right;font-size:10px;color:#555">
          <p style="margin:0 0 2px 0">${data.email}</p>
          <p style="margin:0">${data.phone}</p>
        </div>
      </div>

      <!-- Summary -->
      <div style="margin-bottom:14px;font-size:10.5px;line-height:1.6;color:#333;padding:6px 10px;background:#f8f8ff;border-left:3px solid #0047BB;border-radius:0 4px 4px 0">
        ${summaryClean}
      </div>

      <!-- Two Column Grid -->
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:20px;margin-bottom:14px">
        <!-- Left: Education -->
        <div>
          <h2 style="font-size:12.5px;font-weight:800;border-bottom:1px solid #ccc;padding-bottom:5px;margin-bottom:8px">학력 및 교육</h2>
          ${educationHtml}
        </div>
        <!-- Right: Tools + Certificates -->
        <div>
          <h2 style="font-size:12.5px;font-weight:800;border-bottom:1px solid #ccc;padding-bottom:5px;margin-bottom:8px">핵심 기술 및 도구</h2>
          <ul style="margin:0;padding-left:14px;font-size:10px;color:#444">${toolsHtml}</ul>
          <h2 style="font-size:12.5px;font-weight:800;border-bottom:1px solid #ccc;padding-bottom:5px;margin:14px 0 8px 0">자격증</h2>
          <ul style="margin:0;padding-left:14px;font-size:10px;color:#444;list-style:none">${certsHtml}</ul>
        </div>
      </div>

      <!-- Experience -->
      <div>
        <h2 style="font-size:12.5px;font-weight:800;border-bottom:1px solid #ccc;padding-bottom:5px;margin-bottom:12px">프로젝트 경험</h2>
        ${expHtml}
      </div>
    </div>
  `;
}

function buildCoverLetterPdfHtml(data: ResumeData): string {
  const intros = data.selfIntroductions || [];

  const sectionsHtml = intros.map((intro, idx) => {
    // Convert markdown bold and line breaks in content
    const contentClean = intro.content
      .replace(/\*\*(.*?)\*\*/g, '<strong style="color:#0047BB">$1</strong>')
      .replace(/^---$/gm, '<hr style="border:none;border-top:1px solid #ddd;margin:8px 0"/>')
      .replace(/^\* \*\*(.*?)\*\* \*(.*?)\*$/gm, '<div style="display:flex;gap:6px;margin:3px 0"><strong style="color:#0047BB;min-width:60px">$1</strong><span style="color:#555">$2</span></div>')
      .replace(/^> (.*)/gm, '<blockquote style="border-left:3px solid #0047BB;padding:4px 10px;margin:6px 0;font-weight:700;color:#0047BB;font-size:12px">$1</blockquote>')
      .replace(/\n\n/g, '</p><p style="margin:0 0 6px 0">')
      .replace(/\n/g, '<br/>');
    const loglineClean = intro.logline
      .replace(/\*\*(.*?)\*\*/g, '<strong style="color:#0047BB">$1</strong>')
      .replace(/\n/g, '<br/>');

    return `
      <div style="margin-bottom:${idx < intros.length - 1 ? '16px' : '0'};page-break-inside:avoid">
        <div style="display:flex;align-items:baseline;gap:8px;margin-bottom:6px">
          <span style="font-size:10px;font-weight:800;color:#0047BB;font-family:monospace">${String(idx + 1).padStart(2, '0')}</span>
          <span style="font-size:10px;font-weight:700;color:#999;text-transform:uppercase;letter-spacing:1px">${intro.navTitle || '섹션 ' + (idx + 1)}</span>
        </div>
        <h3 style="font-size:14px;font-weight:900;color:#1a1a1a;margin:0 0 8px 0;line-height:1.4">${loglineClean}</h3>
        <div style="font-size:9.5px;color:#333;line-height:1.75">
          <p style="margin:0 0 6px 0">${contentClean}</p>
        </div>
      </div>
    `;
  }).join('');

  return `
    <div style="padding:24px 28px 16px;font-family:'Pretendard','Noto Sans KR',sans-serif;font-size:11px;line-height:1.55;color:#000;background:#fff">
      <!-- Header -->
      <div style="display:flex;justify-content:space-between;align-items:flex-end;border-bottom:2.5px solid #000;padding-bottom:12px;margin-bottom:18px">
        <div>
          <h1 style="font-size:24px;font-weight:900;margin:0;letter-spacing:-0.5px">${data.name}</h1>
          <p style="font-size:11px;font-weight:700;color:#666;letter-spacing:3px;text-transform:uppercase;margin:3px 0 0">자기소개서</p>
        </div>
        <div style="text-align:right;font-size:10px;color:#555">
          <p style="margin:0 0 2px 0">${data.email}</p>
          <p style="margin:0">${data.phone}</p>
        </div>
      </div>

      ${sectionsHtml}
    </div>
  `;
}

export const Resume = ({ setView, onBack, isEditing, data, setData, activeTab, isGeneratingPdf, setIsGeneratingPdf }: ResumeProps) => {

  const handleDownload = async () => {
    setIsGeneratingPdf(true);

    try {
      // Build the correct HTML based on which tab is active
      const htmlString = activeTab === 'resume'
        ? buildResumePdfHtml(data)
        : buildCoverLetterPdfHtml(data);

      const filename = activeTab === 'resume'
        ? '조경환_이력서.pdf'
        : '조경환_자기소개서.pdf';

      // Create temp container → attach to body so html2canvas can see it
      const container = document.createElement('div');
      container.style.cssText = 'position:absolute;top:0;left:0;width:210mm;z-index:99999;background:#fff;pointer-events:none;';
      container.innerHTML = htmlString;
      document.body.appendChild(container);

      // Wait a tick for fonts/DOM to paint
      await new Promise(r => setTimeout(r, 500));

      const opt = {
        margin: [0, 0, 0, 0],
        filename,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2, useCORS: true, logging: false, scrollY: 0, windowWidth: document.documentElement.offsetWidth },
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' as const },
        pagebreak: { mode: ['avoid-all'] },
      };

      await html2pdf().set(opt).from(container).save();

      // Remove temp element
      document.body.removeChild(container);
    } catch (err) {
      console.error('PDF generation failed', err);
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  // Navbar PDF 버튼 → CustomEvent 수신
  React.useEffect(() => {
    const handler = () => handleDownload();
    window.addEventListener('triggerPdfDownload', handler);
    return () => window.removeEventListener('triggerPdfDownload', handler);
  }, [activeTab, data]);
  return (
    <>
      <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
        className="pt-28 pb-12 md:pb-20 px-6 md:px-12 max-w-[1300px] mx-auto w-full min-h-screen flex flex-col relative">

        <AnimatePresence mode="wait">
          {activeTab === 'resume' ? (
            /* ========================================================= */
            /* RESUME TAB (Top Profile + Bottom Grid)                    */
            /* ========================================================= */
            <motion.div 
              key="resume"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="flex flex-col gap-8"
            >
              {/* TOP PROFILE BOX */}
              <div className="relative bg-white rounded-3xl p-6 lg:p-10 shadow-sm border border-black/5 transition-colors">
                <div className="flex flex-col lg:flex-row items-center lg:items-start gap-8">
                  {/* Left: Avatar & Contact */}
                  <div className="flex flex-col sm:flex-row items-center gap-6 shrink-0">
                    <div className="w-28 h-28 lg:w-32 lg:h-32 rounded-2xl overflow-hidden border border-black/5 shadow-sm shrink-0">
                      <img src="https://picsum.photos/seed/profile/400/400" alt="Profile" className="w-full h-full object-cover grayscale opacity-80" />
                    </div>
                    <div className="text-center sm:text-left">
                      <h1 className="text-3xl lg:text-4xl font-display font-bold text-[#2C2C2C] tracking-tight mb-1">
                        <EditableText value={data.name} onSave={(v) => setData({...data, name: v})} isEditing={isEditing} />
                      </h1>
                      <p className="text-[#0047BB] font-bold font-mono tracking-widest text-xs uppercase mb-4">
                        <EditableText value={data.role} onSave={(v) => setData({...data, role: v})} isEditing={isEditing} />
                      </p>
                      <div className="space-y-1.5">
                        <div className="flex items-center gap-3 text-sm text-zinc-600 font-medium justify-center sm:justify-start">
                          <Mail className="w-4 h-4 text-zinc-400" />
                          <EditableText value={data.email} onSave={(v) => setData({...data, email: v})} isEditing={isEditing} />
                        </div>
                        {isEditing && (
                          <div className="flex items-center gap-3 text-sm text-zinc-600 font-medium justify-center sm:justify-start">
                            <Phone className="w-4 h-4 text-zinc-400" />
                            <EditableText value={data.phone} onSave={(v) => setData({...data, phone: v})} isEditing={isEditing} />
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="hidden lg:block w-px h-28 bg-black/5 self-center shrink-0"></div>

                  {/* Right: Summary & Tools */}
                  <div className="flex-1 min-w-0">
                    <h3 className="text-xs font-bold text-zinc-400 tracking-widest uppercase mb-3 flex items-center gap-2 justify-center lg:justify-start">
                      <User className="w-3.5 h-3.5" /> 한줄 소개
                    </h3>
                    <div className="text-base lg:text-lg text-[#2C2C2C] leading-relaxed font-bold break-keep text-center lg:text-left mb-6 [&_strong]:text-[#0047BB] [&_strong]:bg-[linear-gradient(to_top,rgba(0,71,187,0.1)_40%,transparent_40%)]">
                      <EditableText value={data.summary} onSave={(v) => setData({...data, summary: v})} isEditing={isEditing} markdown={true} />
                    </div>

                    {data.tools && data.tools.length > 0 && (
                      <div className="flex flex-wrap gap-2 justify-center lg:justify-start">
                        {data.tools.map((tool, idx) => (
                          <span key={idx} className="group relative px-3 py-1.5 bg-zinc-50 rounded-lg text-[11px] font-bold text-zinc-600 border border-black/5 hover:border-[#0047BB] hover:bg-[#0047BB]/5 hover:text-[#2C2C2C] transition-all cursor-help flex items-center justify-center gap-1.5 overflow-visible shadow-sm">
                            {TOOL_ICONS[tool.name] || <Wrench className="w-3 h-3 opacity-70 group-hover:opacity-100 group-hover:text-[#0047BB] transition-colors" />}
                            <EditableText value={tool.name} onSave={(v) => { const t = [...(data.tools||[])]; t[idx].name = v; setData({...data, tools: t}); }} isEditing={isEditing} />
                            <div className="pointer-events-none absolute bottom-full left-1/2 -translate-x-1/2 translate-y-2 opacity-0 group-hover:-translate-y-2 group-hover:opacity-100 transition-all z-[100] mb-2 w-max max-w-[280px] bg-[#2C2C2C] border border-white/10 text-white text-[11px] leading-[1.6] p-2.5 rounded-lg shadow-xl whitespace-pre-wrap font-medium text-left">
                              <EditableText value={tool.description} onSave={(v) => { const t = [...(data.tools||[])]; t[idx].description = v; setData({...data, tools: t}); }} isEditing={isEditing} />
                              <div className="absolute top-full left-1/2 -translate-x-1/2 border-solid border-t-[#2C2C2C] border-t-6 border-x-transparent border-x-6 border-b-0 w-0 h-0"></div>
                            </div>
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* BOTTOM COLUMNS */}
              <div className="grid lg:grid-cols-12 gap-8">
                {/* Left Column */}
                <div className="lg:col-span-5 flex flex-col gap-8">
                  {/* Education */}
                  <section className="bg-white rounded-3xl p-6 lg:p-8 shadow-sm border border-black/5 h-full">
                    <h3 className="text-lg font-bold mb-6 flex items-center gap-3 text-[#2C2C2C]">
                      <GraduationCap className="text-[#0047BB] w-5 h-5" /> 학력 및 교육
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
                          <ul className="text-[11px] text-zinc-500 space-y-1 list-none">
                            {edu.details.map((detail, dIdx) => <li key={dIdx} className="relative pl-3"><span className="absolute left-0 top-1.5 w-1 h-1 bg-zinc-300 rounded-full"></span>{detail}</li>)}
                          </ul>
                        </div>
                      ))}
                    </div>
                  </section>

                  {/* Certificates */}
                  <section className="bg-white rounded-3xl p-6 lg:p-8 shadow-sm border border-black/5">
                    <h3 className="text-lg font-bold mb-5 flex items-center gap-3 text-[#2C2C2C]">
                      <Award className="text-[#0047BB] w-5 h-5" /> 자격증
                    </h3>
                    <div className="flex flex-col gap-2.5">
                      {data.certificates && data.certificates.map((cert, idx) => (
                        <div key={idx} className="flex items-center justify-between p-3.5 bg-zinc-50/50 rounded-xl border border-black/5 hover:border-[#0047BB]/30 hover:bg-[#0047BB]/5 transition-colors">
                          <h4 className="font-bold text-[14px] text-[#2C2C2C]">
                            <EditableText value={cert.name} onSave={(v) => { const c = [...(data.certificates||[])]; c[idx].name = v; setData({...data, certificates: c}); }} isEditing={isEditing} />
                          </h4>
                          <div className="flex flex-col items-end gap-0.5">
                            <span className="text-[10px] text-zinc-400 font-medium">취득 연도</span>
                            <span className="text-xs font-mono font-bold text-[#0047BB]">
                              <EditableText value={cert.date} onSave={(v) => { const c = [...(data.certificates||[])]; c[idx].date = v; setData({...data, certificates: c}); }} isEditing={isEditing} />
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </section>
                </div>

                {/* Right Column: Experience */}
                <div className="lg:col-span-7">
                  <section className="bg-white rounded-3xl p-6 lg:p-10 shadow-sm border border-black/5 h-full">
                    <h3 className="text-xl font-bold mb-8 flex items-center gap-3 text-[#2C2C2C]">
                      <Briefcase className="text-[#0047BB] w-5 h-5" /> 프로젝트 경험
                    </h3>
                    <div className="space-y-10">
                      {data.experience.map((exp, idx) => (
                        <div key={idx} className="relative pl-8 border-l-[3px] border-[#0047BB]/20">
                          <div className="absolute -left-[9px] top-1.5 w-4 h-4 rounded-full bg-[#0047BB] border-4 border-white shadow-sm"></div>
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
                            <h4 className="font-bold text-xl text-[#2C2C2C]">
                              <EditableText value={exp.title} onSave={(v) => { const e = [...data.experience]; e[idx].title = v; setData({...data, experience: e}); }} isEditing={isEditing} />
                            </h4>
                            <span className="text-xs font-mono font-bold text-zinc-400 bg-zinc-100 px-3 py-1 rounded-full shrink-0">
                              <EditableText value={exp.period} onSave={(v) => { const e = [...data.experience]; e[idx].period = v; setData({...data, experience: e}); }} isEditing={isEditing} />
                            </span>
                          </div>
                          <div className="text-[15px] text-[#0047BB] font-semibold mb-4 bg-[#0047BB]/5 inline-block px-3 py-1.5 rounded-lg border border-[#0047BB]/10">
                            <EditableText value={exp.description} onSave={(v) => { const e = [...data.experience]; e[idx].description = v; setData({...data, experience: e}); }} isEditing={isEditing} markdown={true} />
                          </div>
                          <ul className="text-[14px] text-zinc-600 space-y-2.5 list-none leading-relaxed">
                            {exp.details.map((detail, dIdx) => (
                              <li key={dIdx} className="relative pl-4">
                                <span className="absolute left-0 top-2 w-1.5 h-1.5 bg-zinc-300 rounded-full"></span>
                                {detail}
                              </li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </div>
                  </section>
                </div>
              </div>
            </motion.div>
          ) : (
            /* ========================================================= */
            /* COVER LETTER TAB (Only the content takes full width/focus)*/
            /* ========================================================= */
            <motion.div 
              key="cover-letter"
              initial={{ opacity: 0, scale: 0.98, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 1.02, y: -10 }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            >
              <CoverLetter setView={setView} isEditing={isEditing} data={data} setData={setData} />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.section>

    </>
  );
};
