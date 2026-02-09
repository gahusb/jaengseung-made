'use client';

import { useState } from 'react';

export default function ContactForm() {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    service: 'RPA 자동화',
    message: '',
  });
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    setErrorMessage('');

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || '문의 전송에 실패했습니다.');
      }

      setStatus('success');
      // 폼 초기화
      setFormData({
        name: '',
        phone: '',
        email: '',
        service: 'RPA 자동화',
        message: '',
      });

      // 3초 후 성공 메시지 숨기기
      setTimeout(() => setStatus('idle'), 5000);
    } catch (error) {
      setStatus('error');
      setErrorMessage(error instanceof Error ? error.message : '문의 전송에 실패했습니다.');
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              이름 <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              placeholder="홍길동"
              disabled={status === 'loading'}
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">연락처</label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              placeholder="010-0000-0000"
              disabled={status === 'loading'}
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            이메일 <span className="text-red-500">*</span>
          </label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
            placeholder="example@email.com"
            disabled={status === 'loading'}
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">서비스 선택</label>
          <select
            name="service"
            value={formData.service}
            onChange={handleChange}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
            disabled={status === 'loading'}
          >
            <option>RPA 자동화</option>
            <option>웹 개발</option>
            <option>앱 개발</option>
            <option>맞춤형 솔루션</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            프로젝트 설명 <span className="text-red-500">*</span>
          </label>
          <textarea
            name="message"
            value={formData.message}
            onChange={handleChange}
            required
            rows={6}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none resize-none"
            placeholder="프로젝트에 대해 자세히 설명해주세요. 목적, 예상 기간, 예산 등을 포함하면 더 정확한 상담이 가능합니다."
            disabled={status === 'loading'}
          ></textarea>
        </div>

        {status === 'success' && (
          <div className="bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded-lg">
            ✅ 문의가 성공적으로 전송되었습니다! 24시간 이내 답변드리겠습니다.
          </div>
        )}

        {status === 'error' && (
          <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg">
            ❌ {errorMessage}
          </div>
        )}

        <button
          type="submit"
          disabled={status === 'loading'}
          className="w-full bg-blue-700 text-white py-4 rounded-lg text-lg font-bold hover:bg-blue-800 transition shadow-lg disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          {status === 'loading' ? '전송 중...' : '무료 상담 신청하기'}
        </button>
      </form>

      <div className="mt-8 pt-8 border-t border-gray-200">
        <div className="text-center text-gray-600">
          <p className="mb-4">또는 아래 연락처로 직접 문의주세요</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="mailto:bgg8988@gmail.com"
              className="flex items-center justify-center text-blue-700 hover:text-blue-800"
            >
              <span className="mr-2">📧</span> bgg8988@gmail.com
            </a>
            <a
              href="tel:010-3907-1392"
              className="flex items-center justify-center text-blue-700 hover:text-blue-800"
            >
              <span className="mr-2">📱</span> 010-3907-1392
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
