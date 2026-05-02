import type { SupabaseClient } from '@supabase/supabase-js';
import type { PackTier } from '../pack-assets';

export interface PackFile {
  id: string;
  min_tier: PackTier;
  label: string;
  file_path: string;
  filename: string;
  size_bytes: number;
  sort_order: number;
  uploaded_at: string;
  deleted_at: string | null;
}

const TIER_HIERARCHY: Record<PackTier, PackTier[]> = {
  starter: ['starter'],
  pro: ['starter', 'pro'],
  master: ['starter', 'pro', 'master'],
};

export function tierIncludes(userTier: PackTier): PackTier[] {
  return TIER_HIERARCHY[userTier];
}

export async function getPackFilesForTiers(
  supabase: SupabaseClient,
  tiers: PackTier[],
): Promise<PackFile[]> {
  if (tiers.length === 0) return [];
  const { data, error } = await supabase
    .from('pack_files')
    .select('*')
    .in('min_tier', tiers)
    .is('deleted_at', null)
    .order('min_tier')
    .order('sort_order');
  if (error) throw error;
  return (data ?? []) as PackFile[];
}

export async function getPackFileById(
  supabase: SupabaseClient,
  id: string,
): Promise<PackFile | null> {
  const { data, error } = await supabase
    .from('pack_files')
    .select('*')
    .eq('id', id)
    .is('deleted_at', null)
    .maybeSingle();
  if (error) throw error;
  return (data as PackFile) ?? null;
}
