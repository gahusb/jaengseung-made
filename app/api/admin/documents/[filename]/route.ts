import { NextResponse } from 'next/server';
import { readFile } from 'fs/promises';
import path from 'path';
import { verifyAdminTokenNode } from '@/lib/admin-auth';
import { cookies } from 'next/headers';

export const runtime = 'nodejs';

const ALLOWED_FILES = [
  'ebay-tool-proposal.html',
  'ebay-tool-questionnaire.html',
];

async function checkAuth() {
  const cookieStore = await cookies();
  const token = cookieStore.get('admin_token')?.value;
  return token && verifyAdminTokenNode(token);
}

export async function GET(
  request: Request,
  { params }: { params: Promise<{ filename: string }> }
) {
  if (!(await checkAuth())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { filename } = await params;

  if (!ALLOWED_FILES.includes(filename)) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }

  try {
    const filePath = path.join(process.cwd(), 'CONTENT', filename);
    const content = await readFile(filePath, 'utf-8');

    return new NextResponse(content, {
      headers: { 'Content-Type': 'text/html; charset=utf-8' },
    });
  } catch {
    return NextResponse.json({ error: 'File not found' }, { status: 404 });
  }
}
