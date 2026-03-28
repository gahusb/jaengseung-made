'use client';

import { useState, useEffect, useRef } from 'react';

interface ContactModalProps {
  isOpen: boolean;
  onClose: () => void;
  service: string;
  checklist: string[];
  accentColor?: string; // tailwind class e.g. 'text-amber-400'
  accentBg?: string;    // e.g. 'bg-amber-400'
  headerFrom?: string;  // hex e.g. '#1a0a00'
  headerTo?: string;    // hex e.g. '#3d1a00'
}

export default function ContactModal({
  isOpen,
  onClose,
  service,
  checklist,
  accentColor = 'text-[#5ba4ff]',
  accentBg = 'bg-[#1a56db]',
  headerFrom = '#04102b',
  headerTo = '#0a2060',
}: ContactModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    service,
    message: '',
  });
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const [visible, setVisible] = useState(false);
  const firstInputRef = useRef<HTMLInputElement>(null);

  /* sync service prop into form */
  useEffect(() => {
    setFormData((prev) => ({ ...prev, service }));
  }, [service]);

  /* animation: open/close */
  useEffect(() => {
    if (isOpen) {
      setVisible(true);
      setTimeout(() => firstInputRef.current?.focus(), 100);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  /* close on Escape */
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onClose]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  // GA4 이벤트 헬퍼
  const trackEvent = (eventName: string, params?: Record<string, string>) => {
    if (typeof window !== 'undefined') {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const w = window as any;
      if (typeof w.gtag === 'function') {
        w.gtag('event', eventName, params);
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    setErrorMessage('');
    // 문의 시도 이벤트
    trackEvent('contact_attempt', { service: formData.service });
    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || '문의 전송에 실패했습니다.');
      setStatus('success');
      // 문의 성공 이벤트 (전환 추적 핵심)
      trackEvent('generate_lead', {
        event_category: 'contact',
        event_label: formData.service,
        value: '1',
      });
    } catch (error) {
      setStatus('error');
      setErrorMessage(error instanceof Error ? error.message : '문의 전송에 실패했습니다.');
      trackEvent('contact_error', { service: formData.service });
    }
  };

  if (!isOpen && !visible) return null;

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center p-4 transition-all duration-300 ${
        isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
      }`}
      style={{ background: 'rgba(4, 16, 43, 0.85)', backdropFilter: 'blur(8px)' }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
      onTransitionEnd={() => { if (!isOpen) setVisible(false); }}
    >
      <div
        className={`relative w-full max-w-3xl bg-white rounded-2xl shadow-2xl shadow-[#04102b]/50 overflow-hidden transition-all duration-300 ${
          isOpen ? 'scale-100 translate-y-0 opacity-100' : 'scale-95 translate-y-4 opacity-0'
        }`}
        style={{ maxHeight: '92vh', overflowY: 'auto' }}
      >
        {/* ─── Header ─── */}
        <div
          className="relative px-6 py-5 flex items-center justify-between"
          style={{ background: `linear-gradient(135deg, ${headerFrom}, ${headerTo})` }}
        >
          <div className="absolute inset-0 opacity-[0.05]"
            style={{ backgroundImage: 'linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)', backgroundSize: '24px 24px' }} />
          <div className="relative">
            <p className={`text-xs font-bold uppercase tracking-widest mb-0.5 ${accentColor}`}>CONTACT</p>
            <h2 className="text-white font-extrabold text-lg leading-tight">{service}</h2>
          </div>
          <button
            onClick={onClose}
            className="relative w-9 h-9 rounded-xl bg-white/10 hover:bg-white/20 border border-white/15 flex items-center justify-center text-white/70 hover:text-white transition-all"
            aria-label="닫기"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* ─── Body ─── */}
        {status === 'success' ? (
          /* Success State */
          <div className="flex flex-col items-center justify-center py-16 px-8 text-center">
            <div className="w-16 h-16 rounded-full bg-emerald-100 border-2 border-emerald-300 flex items-center justify-center mb-5">
              <svg className="w-8 h-8 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h3 className="text-[#04102b] text-xl font-extrabold mb-2">문의가 접수되었습니다</h3>
            <p className="text-slate-500 text-sm mb-1">24시간 이내로 답변 드리겠습니다.</p>
            <p className="text-slate-400 text-xs mb-6">bgg8988@gmail.com / 010-3907-1392</p>
            <button
              onClick={() => { setStatus('idle'); onClose(); setFormData({ name: '', phone: '', email: '', service, message: '' }); }}
              className="bg-[#04102b] hover:bg-[#0a1f5c] text-white px-8 py-2.5 rounded-xl text-sm font-bold transition"
            >
              닫기
            </button>
          </div>
        ) : (
          <div className="grid md:grid-cols-5">
            {/* Left: Checklist */}
            <div className="md:col-span-2 bg-[#f0f5ff] border-r border-[#dbe8ff] p-6">
              <h3 className="text-[#04102b] font-bold text-sm mb-4">신청 전 확인사항</h3>
              <ul className="space-y-3 mb-6">
                {checklist.map((item, i) => (
                  <li key={i} className="flex items-start gap-2.5">
                    <div className="w-5 h-5 rounded-full bg-white border-2 border-[#dbe8ff] flex items-center justify-center flex-shrink-0 mt-0.5">
                      <div className="w-2 h-2 rounded-full bg-[#1a56db]" />
                    </div>
                    <span className="text-slate-600 text-xs leading-relaxed">{item}</span>
                  </li>
                ))}
              </ul>

              {/* quick contact */}
              <div className="bg-white rounded-xl border border-[#dbe8ff] p-4">
                <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">직접 연락</div>
                <a href="mailto:bgg8988@gmail.com" className="flex items-center gap-2 text-xs text-slate-600 hover:text-[#1a56db] transition mb-2">
                  <svg className="w-3.5 h-3.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  bgg8988@gmail.com
                </a>
                <a href="tel:010-3907-1392" className="flex items-center gap-2 text-xs text-slate-600 hover:text-[#1a56db] transition">
                  <svg className="w-3.5 h-3.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  010-3907-1392
                </a>
              </div>

              <div className="mt-4 text-center">
                <div className="inline-flex items-center gap-1.5 bg-white border border-[#dbe8ff] text-[#1a56db] text-xs font-bold px-3 py-1.5 rounded-full">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  24h 이내 답변 보장
                </div>
              </div>
            </div>

            {/* Right: Form */}
            <div className="md:col-span-3 p-6">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-600 mb-1.5">
                      이름 <span className="text-red-400">*</span>
                    </label>
                    <input
                      ref={firstInputRef}
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      disabled={status === 'loading'}
                      placeholder="홍길동"
                      className="w-full px-3.5 py-2.5 text-sm border border-[#dbe8ff] rounded-xl focus:ring-2 focus:ring-[#1a56db] focus:border-[#1a56db] outline-none bg-white disabled:bg-slate-50 transition"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-600 mb-1.5">연락처</label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      disabled={status === 'loading'}
                      placeholder="010-0000-0000"
                      className="w-full px-3.5 py-2.5 text-sm border border-[#dbe8ff] rounded-xl focus:ring-2 focus:ring-[#1a56db] focus:border-[#1a56db] outline-none bg-white disabled:bg-slate-50 transition"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1.5">
                    이메일 <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    disabled={status === 'loading'}
                    placeholder="example@email.com"
                    className="w-full px-3.5 py-2.5 text-sm border border-[#dbe8ff] rounded-xl focus:ring-2 focus:ring-[#1a56db] focus:border-[#1a56db] outline-none bg-white disabled:bg-slate-50 transition"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1.5">문의 서비스</label>
                  <select
                    name="service"
                    value={formData.service}
                    onChange={handleChange}
                    disabled={status === 'loading'}
                    className="w-full px-3.5 py-2.5 text-sm border border-[#dbe8ff] rounded-xl focus:ring-2 focus:ring-[#1a56db] focus:border-[#1a56db] outline-none bg-white disabled:bg-slate-50 transition"
                  >
                    <option>{service}</option>
                    <option>외주 개발 문의</option>
                    <option>AI 자동화 키트 - 월 구독</option>
                    <option>프롬프트 엔지니어링 - 단건 설계</option>
                    <option>프롬프트 엔지니어링 - 비즈니스 패키지</option>
                    <option>프롬프트 엔지니어링 - 팀/기업 패키지</option>
                    <option>업무 자동화 - 단순 자동화</option>
                    <option>업무 자동화 - 중간 자동화</option>
                    <option>업무 자동화 - 대형 자동화</option>
                    <option>기타 문의</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1.5">
                    문의 내용 <span className="text-red-400">*</span>
                  </label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows={4}
                    disabled={status === 'loading'}
                    placeholder="문의하실 내용을 자유롭게 작성해주세요. 프로젝트 목적, 원하시는 기능, 예산 등을 적어주시면 더 정확한 답변이 가능합니다."
                    className="w-full px-3.5 py-2.5 text-sm border border-[#dbe8ff] rounded-xl focus:ring-2 focus:ring-[#1a56db] focus:border-[#1a56db] outline-none resize-none bg-white disabled:bg-slate-50 transition"
                  />
                </div>

                {status === 'error' && (
                  <div className="bg-red-50 border border-red-200 text-red-700 text-xs px-4 py-3 rounded-xl">
                    {errorMessage}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={status === 'loading'}
                  className="w-full bg-[#1a56db] hover:bg-[#1e4fc2] disabled:opacity-50 disabled:cursor-not-allowed text-white py-3 rounded-xl text-sm font-extrabold transition shadow-lg shadow-blue-900/20 flex items-center justify-center gap-2"
                >
                  {status === 'loading' ? (
                    <>
                      <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                      </svg>
                      전송 중...
                    </>
                  ) : '문의 보내기 →'}
                </button>

                <p className="text-center text-slate-400 text-xs">
                  문의 후 24시간 이내 답변 · 무료 상담 가능
                </p>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
