import { Resend } from 'resend';
import { escapeHtml } from '@/lib/security';
import type { ProductRow } from '@/lib/supabase/product-files';

const FROM = '쟁승메이드 <noreply@jaengseung-made.com>';
const ADMIN_EMAIL = 'bgg8988@gmail.com';
const BANK_INFO = '케이뱅크 100-116-337157 (예금주: 박재오)';

function resend() {
  return new Resend(process.env.RESEND_API_KEY);
}

const won = (n: number) => `₩${n.toLocaleString('ko-KR')}`;

/** 주문 접수: 고객 안내 + 관리자 알림 (실패해도 주문은 유효 — 호출부에서 try/catch) */
export async function sendOrderReceivedEmails(opts: {
  orderId: string;
  product: ProductRow;
  customerEmail: string;
  depositorName: string;
}) {
  const { orderId, product, customerEmail, depositorName } = opts;

  // XSS 방지: 사용자 입력값 이스케이프
  const safeDepositorName = escapeHtml(depositorName);
  const safeCustomerEmail = escapeHtml(customerEmail);

  const r = resend();
  await r.emails.send({
    from: FROM,
    to: [customerEmail],
    subject: `[쟁승메이드] 주문 접수 — ${product.name}`,
    html: `
      <h2>주문이 접수되었습니다</h2>
      <p><strong>${product.name}</strong> · ${won(product.price)}</p>
      <p>아래 계좌로 입금해 주시면, 확인 후 마이페이지에서 바로 다운로드하실 수 있습니다.</p>
      <p style="font-size:16px;"><strong>${BANK_INFO}</strong></p>
      <p>입금자명: <strong>${safeDepositorName}</strong></p>
      <hr />
      <p style="color:#666;font-size:12px;">주문번호 ${orderId} · 입금 확인은 영업시간 기준 최대 24시간 소요됩니다.</p>
    `,
  });
  await r.emails.send({
    from: FROM,
    to: [ADMIN_EMAIL],
    subject: `[쟁승메이드] 신규 주문(입금 대기) — ${product.name}`,
    html: `
      <h2>신규 계좌이체 주문</h2>
      <p>상품: ${product.name} (${won(product.price)})</p>
      <p>주문자 이메일: ${safeCustomerEmail} / 입금자명: ${safeDepositorName}</p>
      <p>주문번호: ${orderId}</p>
      <p>입금 확인 후 <a href="https://jaengseung-made.com/admin/orders">관리자 주문 페이지</a>에서 [입금 확인]을 눌러주세요.</p>
    `,
  });
}

/** 입금 확인: 고객에게 다운로드 활성화 안내 */
export async function sendOrderPaidEmail(opts: { product: ProductRow; customerEmail: string }) {
  const { product, customerEmail } = opts;
  await resend().emails.send({
    from: FROM,
    to: [customerEmail],
    subject: `[쟁승메이드] 입금 확인 완료 — ${product.name} 다운로드 안내`,
    html: `
      <h2>입금이 확인되었습니다</h2>
      <p><strong>${product.name}</strong> 다운로드가 활성화되었습니다.</p>
      <p><a href="https://jaengseung-made.com/mypage?tab=products">마이페이지 → 내 제품</a>에서 바로 받으실 수 있습니다.</p>
      <p style="color:#666;font-size:12px;">다운로드 링크는 클릭 시 4시간 동안 유효하며, 만료되면 다시 누르면 됩니다.</p>
    `,
  });
}
