'use client';

import { useState } from 'react';
import BankTransferModal from '@/app/components/BankTransferModal';

// 상세 페이지의 구매 버튼 + 모달 트리거 (클라이언트 경계).
// 서버 페이지가 product 요약만 넘겨주고, 주문 금액은 서버(API)가 DB로 확정한다.

const KOR_BODY = { letterSpacing: '-0.01em' } as const;

interface Props {
  product: { id: string; name: string; price: number };
}

export default function BuySection({ product }: Props) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="inline-flex items-center justify-center w-full sm:w-auto px-8 py-3.5 rounded-lg text-sm font-semibold transition-colors hover:bg-[var(--jsm-accent-hover)]"
        style={{ background: 'var(--jsm-accent)', color: '#ffffff', ...KOR_BODY }}
      >
        구매하기
      </button>

      <BankTransferModal
        product={product}
        isOpen={open}
        onClose={() => setOpen(false)}
      />
    </>
  );
}
