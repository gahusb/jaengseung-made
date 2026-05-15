import type { SavedProgress } from './types';

const STORAGE_KEY = 'gyeol_survey_progress_v1';

/**
 * Progress 저장. 새로고침 후 복구용.
 * SSR 환경에서는 noop.
 */
export function saveProgress(progress: SavedProgress): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
  } catch {
    // storage quota exceeded 등 — 무시 (응답 자체에 영향 X)
  }
}

/**
 * Progress 복구. 없거나 파싱 실패 시 null.
 */
export function loadProgress(): SavedProgress | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as SavedProgress;
  } catch {
    return null;
  }
}

/**
 * 제출 성공 시 progress 삭제.
 */
export function clearProgress(): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    /* noop */
  }
}
