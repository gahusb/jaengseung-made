import type { SupabaseClient } from '@supabase/supabase-js';
import { expandProductAccess } from '@/lib/product-access';

export interface ProductRow {
  id: string;
  name: string;
  description: string | null;
  description_long: string | null;
  price: number;
  category: string;
  is_active: boolean;
  is_listed: boolean;
  sort_order: number;
  features: string[] | null;
  pay_method: string;
}

export interface ProductFile {
  id: string;
  product_id: string | null;
  label: string;
  file_path: string;
  filename: string;
  size_bytes: number;
  sort_order: number;
  uploaded_at: string;
  deleted_at: string | null;
  min_tier: string; // 레거시 컬럼 — 신규 로직에서는 미사용
}

/** 카탈로그 노출 제품 (is_listed && is_active, sort_order 순) */
export async function getListedProducts(supabase: SupabaseClient): Promise<ProductRow[]> {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('is_listed', true)
    .eq('is_active', true)
    .order('sort_order')
    .order('id');
  if (error) throw error;
  return (data ?? []) as ProductRow[];
}

export async function getProductById(supabase: SupabaseClient, id: string): Promise<ProductRow | null> {
  const { data, error } = await supabase.from('products').select('*').eq('id', id).maybeSingle();
  if (error) throw error;
  return (data as ProductRow) ?? null;
}

/** 사용자의 결제 완료 product_id 목록 (orders 단일 소스) */
export async function getUserPaidProductIds(supabase: SupabaseClient, userId: string): Promise<string[]> {
  const { data, error } = await supabase
    .from('orders')
    .select('product_id')
    .eq('user_id', userId)
    .eq('status', 'paid')
    .not('product_id', 'is', null);
  if (error) throw error;
  return Array.from(new Set((data ?? []).map((r) => r.product_id as string)));
}

/** 접근 확장 포함 — 사용자가 다운로드 가능한 product_id 집합 */
export async function getUserAccessibleProductIds(supabase: SupabaseClient, userId: string): Promise<string[]> {
  return expandProductAccess(await getUserPaidProductIds(supabase, userId));
}

export async function getFilesByProductIds(supabase: SupabaseClient, productIds: string[]): Promise<ProductFile[]> {
  if (productIds.length === 0) return [];
  const { data, error } = await supabase
    .from('pack_files')
    .select('*')
    .in('product_id', productIds)
    .is('deleted_at', null)
    .order('product_id')
    .order('sort_order');
  if (error) throw error;
  return (data ?? []) as ProductFile[];
}

export async function getFileById(supabase: SupabaseClient, id: string): Promise<ProductFile | null> {
  const { data, error } = await supabase.from('pack_files').select('*').eq('id', id).maybeSingle();
  if (error) throw error;
  return (data as ProductFile) ?? null;
}
