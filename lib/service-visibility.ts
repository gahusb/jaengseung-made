import { cookies } from 'next/headers';
import { createAdminClient } from '@/lib/supabase/admin';
import { verifyAdminTokenNode } from '@/lib/admin-auth';

/** 숨김 가능 서비스 id (service_settings.id와 일치) */
export type HideableService = 'saju' | 'music' | 'gyeol' | 'packages' | 'lotto';

/**
 * 서비스 노출 여부. admin_token 세션이면 항상 true.
 * service_settings 조회 실패(테이블 미생성 등) 시 안전하게 숨김(false).
 * @warning 레거시 숨김 전용 — 일반 공개 서비스(products 등) 가드에 재사용 금지.
 *          fail-closed 정책이라 DB 일시 장애 시 404가 됨. 캐싱 없음(매 렌더 DB 조회).
 */
export async function isServiceVisible(id: HideableService): Promise<boolean> {
  const cookieStore = await cookies();
  const token = cookieStore.get('admin_token')?.value;
  if (token && verifyAdminTokenNode(token)) return true;

  try {
    const supabase = createAdminClient();
    const { data, error } = await supabase
      .from('service_settings')
      .select('is_active')
      .eq('id', id)
      .maybeSingle();
    if (error || !data) return false;
    return data.is_active === true;
  } catch {
    return false;
  }
}
