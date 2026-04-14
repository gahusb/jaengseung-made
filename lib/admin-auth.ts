import { createHmac, timingSafeEqual } from 'crypto';

function safeEqual(a: string, b: string): boolean {
  const bufA = Buffer.from(a);
  const bufB = Buffer.from(b);
  if (bufA.length !== bufB.length) return false;
  return timingSafeEqual(bufA, bufB);
}

const TOKEN_TTL = 24 * 60 * 60 * 1000; // 24시간

export function createAdminToken(): string {
  const secret = process.env.ADMIN_JWT_SECRET!;
  const payload = JSON.stringify({ iat: Date.now(), exp: Date.now() + TOKEN_TTL });
  const encoded = Buffer.from(payload).toString('base64url');
  const sig = createHmac('sha256', secret).update(encoded).digest('base64url');
  return `${encoded}.${sig}`;
}

export function verifyAdminTokenNode(token: string): boolean {
  try {
    const secret = process.env.ADMIN_JWT_SECRET;
    if (!secret) return false;
    const [encoded, sig] = token.split('.');
    if (!encoded || !sig) return false;
    const expected = createHmac('sha256', secret).update(encoded).digest('base64url');
    if (!safeEqual(sig, expected)) return false;
    const { exp } = JSON.parse(Buffer.from(encoded, 'base64url').toString());
    return Date.now() < exp;
  } catch {
    return false;
  }
}

export function checkAdminCredentials(id: string, password: string): boolean {
  const adminId = process.env.ADMIN_ID;
  const adminPassword = process.env.ADMIN_PASSWORD;
  if (!adminId || !adminPassword) return false;
  return id === adminId && password === adminPassword;
}

/* ─── 포트폴리오 공유 토큰 (위시캣 등 외부 제출용) ──────────────── */

export interface PortfolioTokenPayload {
  kind: 'portfolio';
  memo: string;
  iat: number;
  exp: number;
}

export function createPortfolioToken(memo: string, ttlDays = 30): string {
  const secret = process.env.ADMIN_JWT_SECRET!;
  const now = Date.now();
  const payload: PortfolioTokenPayload = {
    kind: 'portfolio',
    memo: memo.slice(0, 100),
    iat: now,
    exp: now + ttlDays * 24 * 60 * 60 * 1000,
  };
  const encoded = Buffer.from(JSON.stringify(payload)).toString('base64url');
  const sig = createHmac('sha256', secret).update(encoded).digest('base64url');
  return `${encoded}.${sig}`;
}

export function verifyPortfolioTokenNode(
  token: string
): PortfolioTokenPayload | null {
  try {
    const secret = process.env.ADMIN_JWT_SECRET;
    if (!secret) return null;
    const [encoded, sig] = token.split('.');
    if (!encoded || !sig) return null;
    const expected = createHmac('sha256', secret).update(encoded).digest('base64url');
    if (!safeEqual(sig, expected)) return null;
    const payload = JSON.parse(
      Buffer.from(encoded, 'base64url').toString()
    ) as PortfolioTokenPayload;
    if (payload.kind !== 'portfolio') return null;
    if (Date.now() >= payload.exp) return null;
    return payload;
  } catch {
    return null;
  }
}
