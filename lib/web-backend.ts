import crypto from 'crypto';

const BACKEND_BASE = process.env.WEB_BACKEND_BASE ?? 'https://gahusb.synology.me';
const SECRET = process.env.BACKEND_HMAC_SECRET ?? '';

if (!SECRET && process.env.NODE_ENV === 'production') {
  console.warn('BACKEND_HMAC_SECRET 미설정 — web-backend 호출 실패할 것임');
}

function sign(payload: Buffer): string {
  return crypto.createHmac('sha256', SECRET).update(payload).digest('hex');
}

interface SignLinkPayload {
  file_path: string;
  expires_in_seconds: number;
}

export async function signLink(payload: SignLinkPayload): Promise<{ url: string; expires_at: string }> {
  const body = Buffer.from(JSON.stringify(payload));
  const ts = String(Math.floor(Date.now() / 1000));
  const sig = sign(Buffer.concat([Buffer.from(`${ts}.`), body]));

  const res = await fetch(`${BACKEND_BASE}/api/packs/sign-link`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Timestamp': ts,
      'X-Signature': sig,
    },
    body,
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`web-backend sign-link 실패 (${res.status}): ${text}`);
  }
  return res.json();
}

interface UploadTokenPayload {
  tier: 'starter' | 'pro' | 'master';
  label: string;
  filename: string;
  size_bytes: number;
}

export function mintUploadToken(input: UploadTokenPayload): { token: string; uploadUrl: string; expiresAt: number } {
  const expiresAt = Math.floor(Date.now() / 1000) + 15 * 60;  // 15분
  const payload: Record<string, unknown> = {
    ...input,
    expires_at: expiresAt,
    jti: crypto.randomUUID(),
  };
  // web-backend 의 verify_upload_token 이 sort_keys=True + separators=(",", ":") 로 검증하므로
  // 키 알파벳 순서로 정렬한 객체를 JSON.stringify (JS 기본도 공백 없는 직렬화 → 호환)
  const orderedPayload = Object.keys(payload).sort().reduce((acc, k) => {
    acc[k] = payload[k];
    return acc;
  }, {} as Record<string, unknown>);
  const body = Buffer.from(JSON.stringify(orderedPayload));
  const sig = sign(body);
  const token = body.toString('base64url') + '.' + sig;
  return {
    token,
    uploadUrl: `${BACKEND_BASE}/api/packs/upload`,
    expiresAt,
  };
}

export async function listPackFilesViaBackend(): Promise<unknown[]> {
  const body = Buffer.alloc(0);
  const ts = String(Math.floor(Date.now() / 1000));
  const sig = sign(Buffer.concat([Buffer.from(`${ts}.`), body]));
  const res = await fetch(`${BACKEND_BASE}/api/packs/list`, {
    method: 'GET',
    headers: { 'X-Timestamp': ts, 'X-Signature': sig },
  });
  if (!res.ok) throw new Error('list 실패');
  return res.json();
}

export async function deletePackFileViaBackend(id: string): Promise<void> {
  const body = Buffer.alloc(0);
  const ts = String(Math.floor(Date.now() / 1000));
  const sig = sign(Buffer.concat([Buffer.from(`${ts}.`), body]));
  const res = await fetch(`${BACKEND_BASE}/api/packs/${id}`, {
    method: 'DELETE',
    headers: { 'X-Timestamp': ts, 'X-Signature': sig },
  });
  if (!res.ok) throw new Error('delete 실패');
}
