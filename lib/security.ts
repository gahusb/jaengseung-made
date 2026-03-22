/**
 * lib/security.ts — 공통 보안 유틸리티
 * XSS 방지, 입력 검증, Rate Limiting
 */

// ── HTML 이스케이프 (이메일 템플릿 XSS 방지) ──────────────────────
export function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;');
}

// ── 입력 검증 ─────────────────────────────────────────────────────
export function isValidEmail(email: string): boolean {
  return /^[^\s@]{1,64}@[^\s@]{1,253}\.[^\s@]{2,}$/.test(email);
}

export function isValidPhone(phone: string): boolean {
  const digits = phone.replace(/[\s\-]/g, '');
  return /^0\d{9,10}$/.test(digits);
}

/** 문자열을 maxLen으로 자르고 트림 */
export function sanitizeStr(str: unknown, maxLen: number): string {
  if (typeof str !== 'string') return '';
  return str.slice(0, maxLen).trim();
}

// ── 입력 길이 상수 ────────────────────────────────────────────────
export const INPUT_LIMITS = {
  NAME:    50,
  PHONE:   20,
  EMAIL:   100,
  SERVICE: 100,
  MESSAGE: 3000,
} as const;

// ── In-memory Rate Limiter ────────────────────────────────────────
// Vercel serverless 환경에서 인스턴스별 기본 보호용
// 더 강력한 보호가 필요하면 Upstash Redis + @upstash/ratelimit 사용
interface RLEntry { count: number; resetAt: number }
const rlMap = new Map<string, RLEntry>();

// 메모리 누수 방지: 10분마다 만료된 엔트리 정리
setInterval(() => {
  const now = Date.now();
  for (const [key, entry] of rlMap.entries()) {
    if (now > entry.resetAt) rlMap.delete(key);
  }
}, 10 * 60 * 1000);

export interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  retryAfterMs: number;
}

/**
 * @param key      식별자 (IP + endpoint 조합 권장)
 * @param windowMs 시간 창 (ms)
 * @param max      창 내 최대 허용 횟수
 */
export function checkRateLimit(
  key: string,
  windowMs: number,
  max: number,
): RateLimitResult {
  const now = Date.now();
  const entry = rlMap.get(key);

  if (!entry || now > entry.resetAt) {
    rlMap.set(key, { count: 1, resetAt: now + windowMs });
    return { allowed: true, remaining: max - 1, retryAfterMs: 0 };
  }

  if (entry.count >= max) {
    return { allowed: false, remaining: 0, retryAfterMs: entry.resetAt - now };
  }

  entry.count++;
  return { allowed: true, remaining: max - entry.count, retryAfterMs: 0 };
}

/** Request에서 클라이언트 IP 추출 (Vercel 헤더 우선) */
export function getClientIp(request: Request): string {
  const headers = request.headers as Headers;
  return (
    headers.get('x-real-ip') ??
    headers.get('x-forwarded-for')?.split(',')[0]?.trim() ??
    'unknown'
  );
}
