'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';

function ContactFormInner() {
  const searchParams = useSearchParams();
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    service: '외주 개발 문의',
    message: '',
  });
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    const serviceParam = searchParams.get('service');
    if (serviceParam) {
      setFormData((prev) => ({ ...prev, service: serviceParam }));
    }
  }, [searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    setErrorMessage('');

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || '문의 전송에 실패했습니다.');
      setStatus('success');
      setFormData({ name: '', phone: '', email: '', service: '외주 개발 문의', message: '' });
      setTimeout(() => setStatus('idle'), 5000);
    } catch (error) {
      setStatus('error');
      setErrorMessage(error instanceof Error ? error.message : '문의 전송에 실패했습니다.');
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-semibold text-slate-600 mb-1.5">
            이름 <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            disabled={status === 'loading'}
            placeholder="홍길동"
            className="w-full px-3.5 py-2.5 text-sm border border-[#dbe8ff] rounded-xl focus:ring-2 focus:ring-[#1a56db] focus:border-[#1a56db] outline-none bg-white disabled:bg-slate-50"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-slate-600 mb-1.5">연락처</label>
          <input
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            disabled={status === 'loading'}
            placeholder="010-0000-0000"
            className="w-full px-3.5 py-2.5 text-sm border border-[#dbe8ff] rounded-xl focus:ring-2 focus:ring-[#1a56db] focus:border-[#1a56db] outline-none bg-white disabled:bg-slate-50"
          />
        </div>
      </div>

      <div>
        <label className="block text-xs font-semibold text-slate-600 mb-1.5">
          이메일 <span className="text-red-500">*</span>
        </label>
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          required
          disabled={status === 'loading'}
          placeholder="example@email.com"
          className="w-full px-3.5 py-2.5 text-sm border border-[#dbe8ff] rounded-xl focus:ring-2 focus:ring-[#1a56db] focus:border-[#1a56db] outline-none bg-white disabled:bg-slate-50"
        />
      </div>

      <div>
        <label className="block text-xs font-semibold text-slate-600 mb-1.5">문의 서비스</label>
        <select
          name="service"
          value={formData.service}
          onChange={handleChange}
          disabled={status === 'loading'}
          className="w-full px-3.5 py-2.5 text-sm border border-[#dbe8ff] rounded-xl focus:ring-2 focus:ring-[#1a56db] focus:border-[#1a56db] outline-none bg-white disabled:bg-slate-50"
        >
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
        <label className="block text-xs font-semibold text-slate-600 mb-1.5">
          문의 내용 <span className="text-red-500">*</span>
        </label>
        <textarea
          name="message"
          value={formData.message}
          onChange={handleChange}
          required
          rows={5}
          disabled={status === 'loading'}
          placeholder="문의하실 내용을 자유롭게 작성해주세요. 프로젝트 목적, 원하시는 기능, 예산 등을 적어주시면 더 정확한 답변이 가능합니다."
          className="w-full px-3.5 py-2.5 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none resize-none bg-white disabled:bg-slate-50"
        />
      </div>

      {status === 'success' && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm px-4 py-3 rounded-xl">
          ✅ 문의가 전송되었습니다! 24시간 이내 답변드리겠습니다.
        </div>
      )}
      {status === 'error' && (
        <div className="bg-red-50 border border-red-200 text-red-800 text-sm px-4 py-3 rounded-xl">
          ❌ {errorMessage}
        </div>
      )}

      <button
        type="submit"
        disabled={status === 'loading'}
        className="w-full bg-[#1a56db] hover:bg-[#1e4fc2] text-white py-3 rounded-xl text-sm font-bold transition shadow-lg shadow-blue-900/20 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {status === 'loading' ? '전송 중...' : '문의 보내기'}
      </button>

      <p className="text-slate-400 text-xs text-center">
        문의 후 24시간 이내 답변 보장 · 무료 상담 가능
      </p>
    </form>
  );
}

export default function ContactForm() {
  return (
    <Suspense fallback={<div className="text-slate-400 text-sm">로딩 중...</div>}>
      <ContactFormInner />
    </Suspense>
  );
}
