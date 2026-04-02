'use client';

import { useState } from 'react';

interface Document {
  id: string;
  title: string;
  description: string;
  category: '제안서' | '질문지' | '계약서';
  fileName: string;
  updatedAt: string;
  status: 'draft' | 'sent' | 'accepted';
}

const documents: Document[] = [
  {
    id: 'ebay-proposal',
    title: '이베이 부품 AI 자동화 — 제안서',
    description: '프로젝트 개요, 3단 패키지 견적(120/198/330만원), 기술 스택, 진행 절차',
    category: '제안서',
    fileName: 'ebay-tool-proposal.html',
    updatedAt: '2026-04-02',
    status: 'draft',
  },
  {
    id: 'ebay-questionnaire',
    title: '이베이 부품 AI 자동화 — 요구사항 질문지',
    description: '고객 사전 확인 17항목 (타겟 사이트, 샘플 품번, eBay 셀러 티어 등)',
    category: '질문지',
    fileName: 'ebay-tool-questionnaire.html',
    updatedAt: '2026-04-02',
    status: 'draft',
  },
];

const CATEGORY_COLORS: Record<string, string> = {
  '제안서': 'bg-blue-900/40 text-blue-400 border-blue-500/30',
  '질문지': 'bg-amber-900/40 text-amber-400 border-amber-500/30',
  '계약서': 'bg-green-900/40 text-green-400 border-green-500/30',
};

const STATUS_CONFIG: Record<string, { label: string; color: string }> = {
  draft: { label: '초안', color: 'bg-slate-700/60 text-slate-300' },
  sent: { label: '발송', color: 'bg-blue-900/40 text-blue-400' },
  accepted: { label: '수락', color: 'bg-green-900/40 text-green-400' },
};

export default function AdminDocumentsPage() {
  const [previewDoc, setPreviewDoc] = useState<Document | null>(null);

  return (
    <div className="p-6 max-w-6xl mx-auto">
      {/* 헤더 */}
      <div className="mb-6">
        <h1 className="text-white text-2xl font-bold">프로젝트 문서</h1>
        <p className="text-slate-400 text-sm mt-0.5">
          고객 제안서, 견적서, 요구사항 질문지 등 프로젝트 문서를 관리합니다
        </p>
      </div>

      {/* 문서 카드 그리드 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        {documents.map((doc) => (
          <div
            key={doc.id}
            className="bg-slate-900 rounded-2xl border border-slate-700/50 p-5 flex flex-col"
          >
            {/* 카테고리 + 상태 뱃지 */}
            <div className="flex items-center gap-2 mb-3">
              <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium border ${CATEGORY_COLORS[doc.category]}`}>
                {doc.category}
              </span>
              <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${STATUS_CONFIG[doc.status].color}`}>
                {STATUS_CONFIG[doc.status].label}
              </span>
            </div>

            {/* 제목 + 설명 */}
            <h3 className="text-white font-semibold text-sm mb-1.5">{doc.title}</h3>
            <p className="text-slate-400 text-xs leading-relaxed mb-4 flex-1">{doc.description}</p>

            {/* 수정일 + 버튼 */}
            <div className="flex items-center justify-between">
              <span className="text-slate-600 text-xs">수정일: {doc.updatedAt}</span>
              <div className="flex gap-2">
                <button
                  onClick={() => setPreviewDoc(doc)}
                  className="px-3 py-1.5 rounded-lg text-xs font-medium bg-red-600/20 text-red-400 hover:bg-red-600/30 transition border border-red-500/20"
                >
                  미리보기
                </button>
                <button
                  onClick={() => window.open(`/api/admin/documents/${doc.fileName}`, '_blank')}
                  className="px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-700 text-slate-300 hover:bg-slate-600 hover:text-white transition"
                >
                  새 탭에서 열기
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* 미리보기 섹션 */}
      {previewDoc && (
        <div className="bg-slate-900 rounded-2xl border border-slate-700/50 overflow-hidden">
          {/* 미리보기 헤더 */}
          <div className="flex items-center justify-between px-5 py-3 border-b border-slate-700/50">
            <div className="flex items-center gap-3">
              <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
              <span className="text-white text-sm font-medium">{previewDoc.title}</span>
            </div>
            <button
              onClick={() => setPreviewDoc(null)}
              className="p-1.5 rounded-lg text-slate-500 hover:text-white hover:bg-slate-800 transition"
              aria-label="미리보기 닫기"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* iframe */}
          <iframe
            src={`/api/admin/documents/${previewDoc.fileName}`}
            className="w-full bg-white"
            style={{ height: '80vh' }}
            title={previewDoc.title}
          />
        </div>
      )}
    </div>
  );
}
