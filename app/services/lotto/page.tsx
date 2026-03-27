import { redirect } from 'next/navigation';

// 토스페이먼츠 심사 정책상 판매 불가 상품으로 분류 — 비공개 처리
export default function LottoPage() {
  redirect('/');
}
