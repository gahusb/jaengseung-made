import { createHmac } from 'crypto';

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
    if (sig !== expected) return false;
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
