import { Resend } from 'resend';
import { escapeHtml } from '@/lib/security';

const FROM = '쟁승메이드 <noreply@jaengseung-made.com>';
const ADMIN_EMAIL = 'bgg8988@gmail.com';
const SITE = 'https://jaengseung-made.com';

function resend() {
  return new Resend(process.env.RESEND_API_KEY);
}

/** 의뢰 접수 확인 — 고객에게 추적 링크 발송 */
export async function sendRequestReceivedEmail(opts: {
  name: string; email: string; service: string; publicToken: string;
}) {
  const { name, email, service, publicToken } = opts;
  await resend().emails.send({
    from: FROM,
    to: [email],
    subject: '[쟁승메이드] 의뢰가 접수되었습니다',
    html: `
      <h2>의뢰가 접수되었습니다</h2>
      <p>${escapeHtml(name)}님, <strong>${escapeHtml(service)}</strong> 의뢰가 정상 접수되었습니다.</p>
      <p>영업일 2일 내에 회신드리며, 아래 링크에서 진행 상태를 언제든 확인하실 수 있습니다.</p>
      <p><a href="${SITE}/track/${publicToken}">의뢰 진행 상태 확인하기</a></p>
      <hr />
      <p style="color:#666;font-size:12px;">이 링크는 본인 확인용입니다. 타인과 공유하지 마세요.</p>
    `,
  });
}

/** 견적 발송 — 고객에게 견적 링크 */
export async function sendQuoteSentEmail(opts: {
  clientName: string; clientEmail: string; quoteTitle: string; quoteToken: string; validUntil: string | null;
}) {
  const { clientName, clientEmail, quoteTitle, quoteToken, validUntil } = opts;
  await resend().emails.send({
    from: FROM,
    to: [clientEmail],
    subject: `[쟁승메이드] 견적서가 도착했습니다 — ${escapeHtml(quoteTitle)}`,
    html: `
      <h2>견적서를 보내드립니다</h2>
      <p>${escapeHtml(clientName)}님, 요청하신 건의 견적서가 준비되었습니다.</p>
      <p><a href="${SITE}/quote/${quoteToken}">견적서 확인하기</a></p>
      ${validUntil ? `<p style="color:#666;font-size:13px;">유효기간: ${escapeHtml(validUntil.slice(0, 10))}</p>` : ''}
      <p>견적서 페이지에서 바로 수락하시거나, 회신으로 문의 주세요.</p>
    `,
  });
}

/** 견적 수락/거절 — 관리자 알림 */
export async function sendQuoteDecisionEmail(opts: {
  decision: 'accepted' | 'rejected'; quoteTitle: string; clientName: string; total?: number;
}) {
  const { decision, quoteTitle, clientName, total } = opts;
  const label = decision === 'accepted' ? '수락' : '거절';
  await resend().emails.send({
    from: FROM,
    to: [ADMIN_EMAIL],
    subject: `[쟁승메이드] 견적 ${label} — ${escapeHtml(quoteTitle)}`,
    html: `
      <h2>고객이 견적을 ${label}했습니다</h2>
      <p>견적: ${escapeHtml(quoteTitle)} / 고객: ${escapeHtml(clientName)}</p>
      ${typeof total === 'number' ? `<p>수락 금액: ₩${total.toLocaleString('ko-KR')}</p>` : ''}
      <p><a href="${SITE}/admin/quotes">견적 관리로 이동</a></p>
    `,
  });
}
