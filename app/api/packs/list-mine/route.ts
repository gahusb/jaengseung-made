import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { createServerClient as createSSRClient } from '@supabase/ssr';
import { createAdminClient } from '@/lib/supabase/admin';
import { getUserAccessibleProductIds, getFilesByProductIds } from '@/lib/supabase/product-files';

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
  if (!user) return NextResponse.json({ products: [] });

  const admin = createAdminClient();
  const productIds = await getUserAccessibleProductIds(admin, user.id);
  if (productIds.length === 0) return NextResponse.json({ products: [] });

  const [files, { data: products }] = await Promise.all([
    getFilesByProductIds(admin, productIds),
    admin.from('products').select('id, name').in('id', productIds),
  ]);

  const nameMap = new Map((products ?? []).map((p) => [p.id, p.name as string]));
  const grouped = new Map<string, { id: string; name: string; files: typeof files }>();
  for (const f of files) {
    if (!f.product_id) continue;
    if (!grouped.has(f.product_id)) {
      grouped.set(f.product_id, { id: f.product_id, name: nameMap.get(f.product_id) ?? f.product_id, files: [] });
    }
    grouped.get(f.product_id)!.files.push(f);
  }
  return NextResponse.json({ products: Array.from(grouped.values()) });
}
