import { redirect } from 'next/navigation';

// PG 심사 정책상 로또 관련 서비스 비공개 처리
export default function LottoPage() {
  redirect('/');
}
