import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { verifyAdminTokenNode } from '@/lib/admin-auth';
import { mintUploadToken } from '@/lib/web-backend';
import type { PackTier } from '@/lib/pack-assets';

export const runtime = 'nodejs';

async function checkAuth() {
  const cookieStore = await cookies();
  const token = cookieStore.get('admin_token')?.value;
  return token && verifyAdminTokenNode(token);
}

const VALID_TIERS = new Set<PackTier>(['starter', 'pro', 'master']);
const MAX_BYTES = 5 * 1024 * 1024 * 1024;
const ALLOWED_EXT = new Set(['pdf', 'zip', 'mp4', 'mov', 'mkv', 'wav', 'm4a', 'mp3', 'png', 'jpg', 'jpeg', 'webp', 'prj']);

export async function POST(request: Request) {
  if (!(await checkAuth())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { tier, label, filename, sizeBytes } = await request.json();

  if (!VALID_TIERS.has(tier)) {
    return NextResponse.json({ error: 'tier 유효하지 않음' }, { status: 400 });
  }
  if (!label || typeof label !== 'string' || label.length > 200) {
    return NextResponse.json({ error: 'label 필요 (1-200자)' }, { status: 400 });
  }
  if (!filename || typeof filename !== 'string') {
    return NextResponse.json({ error: 'filename 필요' }, { status: 400 });
  }
  const ext = filename.includes('.') ? filename.split('.').pop()!.toLowerCase() : '';
  if (!ALLOWED_EXT.has(ext)) {
    return NextResponse.json({ error: `허용되지 않은 확장자: ${ext}` }, { status: 400 });
  }
  if (typeof sizeBytes !== 'number' || sizeBytes <= 0 || sizeBytes > MAX_BYTES) {
    return NextResponse.json({ error: '파일 크기 0-5GB' }, { status: 400 });
  }

  const { token, uploadUrl, expiresAt } = mintUploadToken({
    tier,
    label,
    filename,
    size_bytes: sizeBytes,
  });

  return NextResponse.json({ token, uploadUrl, expiresAt });
}
