'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

type PackTier = 'starter' | 'pro' | 'master';

interface PackFile {
  id: string;
  min_tier: PackTier;
  label: string;
  filename: string;
  size_bytes: number;
  sort_order: number;
  uploaded_at: string;
}

const TIER_LABEL: Record<PackTier, string> = {
  starter: '입문',
  pro: '프로',
  master: '마스터',
};

function formatSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  if (bytes < 1024 * 1024 * 1024) return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
  return `${(bytes / 1024 / 1024 / 1024).toFixed(2)} GB`;
}

export default function AdminPacksPage() {
  const [files, setFiles] = useState<PackFile[]>([]);
  const [loading, setLoading] = useState(true);

  // 업로드 form state
  const [tier, setTier] = useState<PackTier>('starter');
  const [label, setLabel] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);

  async function loadFiles() {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/packs');
      const data = await res.json();
      setFiles(data.files ?? []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { loadFiles(); }, []);

  async function handleUpload(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (!file || !label) return;
    setUploading(true);
    setProgress(0);

    try {
      // 1) Vercel API에서 일회성 토큰 발급
      const tokenRes = await fetch('/api/admin/packs/upload-url', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tier,
          label,
          filename: file.name,
          sizeBytes: file.size,
        }),
      });
      if (!tokenRes.ok) {
        const err = await tokenRes.json();
        throw new Error(err.error ?? '토큰 발급 실패');
      }
      const { token, uploadUrl } = await tokenRes.json();

      // 2) 브라우저가 web-backend에 직접 multipart POST (XHR로 진행률 추적)
      await new Promise<void>((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.open('POST', uploadUrl);
        xhr.setRequestHeader('Authorization', `Bearer ${token}`);
        xhr.upload.onprogress = (ev) => {
          if (ev.lengthComputable) {
            setProgress(Math.round((ev.loaded / ev.total) * 100));
          }
        };
        xhr.onload = () => {
          if (xhr.status >= 200 && xhr.status < 300) resolve();
          else {
            try {
              const { detail } = JSON.parse(xhr.responseText);
              reject(new Error(detail ?? `HTTP ${xhr.status}`));
            } catch {
              reject(new Error(`HTTP ${xhr.status}`));
            }
          }
        };
        xhr.onerror = () => reject(new Error('네트워크 오류'));
        const fd = new FormData();
        fd.append('file', file);
        xhr.send(fd);
      });

      // 3) 리스트 갱신
      setFile(null);
      setLabel('');
      setProgress(0);
      await loadFiles();
    } catch (e) {
      setError(e instanceof Error ? e.message : '업로드 실패');
    } finally {
      setUploading(false);
    }
  }

  async function handleDelete(id: string, label: string) {
    if (!confirm(`"${label}" 자료를 삭제하시겠습니까?`)) return;
    try {
      const res = await fetch(`/api/admin/packs?id=${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('삭제 실패');
      await loadFiles();
    } catch (e) {
      alert(e instanceof Error ? e.message : '삭제 실패');
    }
  }

  async function handlePatch(id: string, updates: Partial<PackFile>) {
    try {
      await fetch('/api/admin/packs', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, ...updates }),
      });
      await loadFiles();
    } catch (e) {
      console.error(e);
    }
  }

  const grouped: Record<PackTier, PackFile[]> = {
    starter: files.filter((f) => f.min_tier === 'starter'),
    pro: files.filter((f) => f.min_tier === 'pro'),
    master: files.filter((f) => f.min_tier === 'master'),
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="mb-6">
        <h1 className="text-white text-2xl font-bold">팩 자료 관리</h1>
        <p className="text-slate-400 text-sm mt-0.5">
          NAS 자료 업로드 + 다운로드 활성화. 최대 5GB / 4시간 만료 공유 링크.
        </p>
        <p className="text-amber-400/90 text-xs mt-2">
          음악 팩 레거시 관리 화면입니다. 신규 제품 파일은{' '}
          <Link href="/admin/products" className="underline hover:text-amber-300">제품 관리</Link>에서 배정하세요.
        </p>
      </div>

      {/* 업로드 폼 */}
      <form onSubmit={handleUpload} className="bg-slate-900 rounded-xl border border-slate-700 p-5 mb-8">
        <h2 className="text-white font-bold mb-4">새 자료 업로드</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-3">
          <select
            value={tier}
            onChange={(e) => setTier(e.target.value as PackTier)}
            disabled={uploading}
            className="bg-slate-800 text-white border border-slate-700 rounded px-3 py-2"
          >
            <option value="starter">{TIER_LABEL.starter}</option>
            <option value="pro">{TIER_LABEL.pro}</option>
            <option value="master">{TIER_LABEL.master}</option>
          </select>
          <input
            type="text"
            value={label}
            onChange={(e) => setLabel(e.target.value)}
            disabled={uploading}
            placeholder="자료 라벨 (예: Suno 프롬프트 북 PDF)"
            className="bg-slate-800 text-white border border-slate-700 rounded px-3 py-2 md:col-span-2"
          />
        </div>
        <input
          type="file"
          onChange={(e) => setFile(e.target.files?.[0] ?? null)}
          disabled={uploading}
          className="text-slate-300 mb-3 block"
        />
        {file && (
          <p className="text-slate-400 text-xs mb-3">
            선택됨: {file.name} ({formatSize(file.size)})
          </p>
        )}
        {uploading && (
          <div className="mb-3">
            <div className="bg-slate-800 rounded h-2 overflow-hidden">
              <div className="bg-violet-500 h-full transition-all" style={{ width: `${progress}%` }} />
            </div>
            <p className="text-slate-400 text-xs mt-1">{progress}% 업로드 중... 페이지를 닫지 마세요</p>
          </div>
        )}
        {error && <p className="text-red-400 text-sm mb-3">{error}</p>}
        <button
          type="submit"
          disabled={uploading || !file || !label}
          className="bg-violet-600 hover:bg-violet-500 disabled:bg-slate-700 disabled:cursor-not-allowed text-white font-bold px-5 py-2 rounded"
        >
          {uploading ? '업로드 중...' : '업로드'}
        </button>
      </form>

      {/* 자료 리스트 */}
      {loading ? (
        <p className="text-slate-400">불러오는 중...</p>
      ) : (
        (['starter', 'pro', 'master'] as PackTier[]).map((t) => (
          <div key={t} className="mb-6">
            <h3 className="text-white font-bold mb-2">
              {TIER_LABEL[t]} ({grouped[t].length})
            </h3>
            {grouped[t].length === 0 ? (
              <p className="text-slate-500 text-sm pl-2">자료 없음</p>
            ) : (
              <div className="space-y-2">
                {grouped[t].map((f) => (
                  <div key={f.id} className="bg-slate-900 border border-slate-700 rounded-lg p-3 flex items-center gap-3">
                    <input
                      type="text"
                      defaultValue={f.label}
                      onBlur={(e) => {
                        if (e.target.value !== f.label) handlePatch(f.id, { label: e.target.value });
                      }}
                      className="flex-1 bg-transparent text-white border-b border-transparent focus:border-slate-500 px-1 py-1"
                    />
                    <span className="text-slate-400 text-xs">{f.filename}</span>
                    <span className="text-slate-500 text-xs">{formatSize(f.size_bytes)}</span>
                    <button
                      onClick={() => handleDelete(f.id, f.label)}
                      className="text-red-400 hover:text-red-300 text-sm px-2"
                    >
                      삭제
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))
      )}
    </div>
  );
}
