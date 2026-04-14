'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  productName: string;
  price: string;
  bankInfo?: {
    bank: string;
    account: string;
    holder: string;
  };
}

const DEFAULT_BANK = {
  bank: '케이뱅크',
  account: '100-116-337157',
  holder: '박재오',
};

export default function PurchaseAgreementModal({
  isOpen,
  onClose,
  productName,
  price,
  bankInfo = DEFAULT_BANK,
}: Props) {
  const [agreed, setAgreed] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      setAgreed(false);
      setName('');
      setEmail('');
      setSent(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async () => {
    if (!agreed || !email || !name.trim()) return;
    setLoading(true);
    try {
      await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          service: `구매 신청: ${productName}`,
          name: name.trim(),
          email,
          phone: '',
          message: `상품: ${productName} (${price})\n입금자명: ${name.trim()}\n입금 대기 중. 입금 확인 후 이메일로 상품 전달 예정.`,
        }),
      });
      setSent(true);
    } catch (e) {
      alert('신청 전송 실패. 다시 시도해주세요.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="bg-gradient-to-br from-slate-900 to-slate-800 px-6 py-5 text-white">
          <h3 className="font-extrabold text-lg">{productName}</h3>
          <p className="text-slate-300 text-sm mt-0.5">{price}</p>
        </div>

        {sent ? (
          <div className="p-8 text-center">
            <div className="text-5xl mb-4">✅</div>
            <h4 className="text-lg font-extrabold text-slate-900 mb-2">신청 완료</h4>
            <p className="text-sm text-slate-600 leading-relaxed">
              아래 계좌로 입금해주시면 <strong>24시간 이내</strong> 이메일로 상품을 전달드립니다.
            </p>
            <div className="mt-5 bg-slate-50 border border-slate-200 rounded-xl p-4 text-left">
              <p className="text-xs text-slate-500 mb-1">입금 계좌</p>
              <p className="font-mono text-sm text-slate-900">
                {bankInfo.bank} {bankInfo.account}
              </p>
              <p className="text-xs text-slate-600 mt-1">예금주 {bankInfo.holder}</p>
            </div>
            <button
              onClick={onClose}
              className="mt-6 w-full bg-slate-900 text-white py-3 rounded-xl font-bold text-sm hover:bg-slate-800 transition"
            >
              닫기
            </button>
          </div>
        ) : (
          <div className="p-6 space-y-5">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-2">
                이름 (입금자명과 동일하게)
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="홍길동"
                className="w-full px-4 py-3 border border-slate-300 rounded-xl text-sm focus:outline-none focus:border-violet-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-2">
                이메일 (상품 전달용)
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                className="w-full px-4 py-3 border border-slate-300 rounded-xl text-sm focus:outline-none focus:border-violet-500"
              />
            </div>

            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-xs text-slate-700 leading-relaxed">
              <p className="font-bold text-amber-900 mb-2">📌 구매 전 확인사항</p>
              <ul className="space-y-1.5 list-disc pl-4">
                <li>
                  본 상품은 <strong>디지털 콘텐츠</strong>로, 제공 시작(이메일 전달) 후에는
                  전자상거래법 제17조 제2항 제5호에 따라 청약철회(환불)가 <strong>제한</strong>됩니다.
                </li>
                <li>
                  구매 전 랜딩 페이지의 <strong>샘플 미리보기·무료 체험 구간</strong>을 반드시 확인해주세요.
                </li>
                <li>
                  파일 손상·전달 누락 등 회사 귀책 사유 시 <strong>즉시 재전달 또는 전액 환불</strong>됩니다.
                </li>
                <li>
                  자세한 내용은{' '}
                  <Link href="/legal/refund" className="underline text-amber-900 font-bold" target="_blank">
                    환불 정책
                  </Link>{' '}
                  참조.
                </li>
              </ul>
            </div>

            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={agreed}
                onChange={(e) => setAgreed(e.target.checked)}
                className="mt-0.5 w-4 h-4 accent-violet-600"
              />
              <span className="text-sm text-slate-700 leading-relaxed">
                위 환불 제한 사항을 확인했으며, 이에{' '}
                <strong className="text-slate-900">동의</strong>합니다. (필수)
              </span>
            </label>

            <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 text-xs">
              <p className="font-bold text-slate-900 mb-1">💳 결제 방법: 계좌이체</p>
              <p className="font-mono text-slate-700">
                {bankInfo.bank} {bankInfo.account} ({bankInfo.holder})
              </p>
              <p className="text-slate-500 mt-2">
                신청 후 위 계좌로 입금하시면 24시간 이내 이메일 전달.
              </p>
            </div>

            <div className="flex gap-2">
              <button
                onClick={onClose}
                className="flex-1 py-3 border border-slate-300 rounded-xl text-sm font-bold text-slate-700 hover:bg-slate-50"
              >
                취소
              </button>
              <button
                onClick={handleSubmit}
                disabled={!agreed || !email || !name.trim() || loading}
                className="flex-[2] py-3 bg-violet-600 hover:bg-violet-500 disabled:bg-slate-300 disabled:cursor-not-allowed text-white rounded-xl text-sm font-bold transition"
              >
                {loading ? '전송 중...' : '구매 신청'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
