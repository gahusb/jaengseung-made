import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { createServerClient as createSSRClient } from '@supabase/ssr';
import { createAdminClient } from '@/lib/supabase/admin';
import { extractPackTier, type PackTier } from '@/lib/pack-assets';
import { tierIncludes, getPackFilesForTiers } from '@/lib/supabase/pack-files';

export const runtime = 'nodejs';

export async function GET() {
  const cookieStore = await cookies();
  const supabase = createSSRClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll: () => cookieStore.getAll(),
        setAll: () => {},
      },
    },
  );
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ files: [] });

  const admin = createAdminClient();
  const { data: orders } = await admin
    .from('contact_requests')
    .select('service, status')
    .eq('user_id', user.id)
    .eq('status', 'completed');

  const tiers = new Set<PackTier>();
  for (const o of (orders ?? [])) {
    const t = extractPackTier(o.service);
    if (t) tierIncludes(t).forEach((x) => tiers.add(x));
  }

  const files = await getPackFilesForTiers(admin, Array.from(tiers));
  return NextResponse.json({ files });
}
