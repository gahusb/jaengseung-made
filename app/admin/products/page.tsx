'use client';

import { useEffect, useState } from 'react';

interface Product {
  id: string;
  name: string;
  description: string | null;
  description_long: string | null;
  price: number;
  features: string[] | null;
  is_listed: boolean;
  is_active: boolean;
  sort_order: number;
}

interface PackFile {
  id: string;
  product_id: string | null;
  label: string;
  filename: string;
  size_bytes: number;
}

function formatSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  if (bytes < 1024 * 1024 * 1024) return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
  return `${(bytes / 1024 / 1024 / 1024).toFixed(2)} GB`;
}

const EMPTY_FORM = {
  id: '',
  name: '',
  price: 0,
  description: '',
  description_long: '',
  featuresText: '',
  is_listed: false,
  sort_order: 0,
};

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [files, setFiles] = useState<PackFile[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  // 폼 상태
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null); // null = 신규
  const [form, setForm] = useState({ ...EMPTY_FORM });
  const [formError, setFormError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  // 파일 관리 선택 제품
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);

  // 업로드 상태
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [uploadLabel, setUploadLabel] = useState('');
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [uploadMsg, setUploadMsg] = useState<string | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);

  async function loadAll() {
    setLoading(true);
    setLoadError(null);
    try {
      const [pRes, fRes] = await Promise.all([
        fetch('/api/admin/products'),
        fetch('/api/admin/packs'),
      ]);
      const pData = await pRes.json();
      const fData = await fRes.json();
      if (!pRes.ok) throw new Error(pData.error ?? '제품 로드 실패');
      setProducts(pData.products ?? []);
      setFiles(fData.files ?? []);
    } catch (e) {
      setLoadError(e instanceof Error ? e.message : '로드 실패');
    } finally {
      setLoading(false);
    }
  }

  // 파일 목록만 재조회 후 반환 (자동 배정 매칭용)
  async function reloadFiles(): Promise<PackFile[]> {
    const res = await fetch('/api/admin/packs');
    const data = await res.json();
    const list: PackFile[] = data.files ?? [];
    setFiles(list);
    return list;
  }

  useEffect(() => { loadAll(); }, []);

  function openNew() {
    setEditingId(null);
    setForm({ ...EMPTY_FORM });
    setFormError(null);
    setShowForm(true);
  }

  function openEdit(p: Product) {
    setEditingId(p.id);
    setForm({
      id: p.id,
      name: p.name,
      price: p.price,
      description: p.description ?? '',
      description_long: p.description_long ?? '',
      featuresText: (p.features ?? []).join('\n'),
      is_listed: p.is_listed,
      sort_order: p.sort_order,
    });
    setFormError(null);
    setShowForm(true);
  }

  async function submitForm(e: React.FormEvent) {
    e.preventDefault();
    setFormError(null);
    setSaving(true);
    try {
      const features = form.featuresText
        .split('\n')
        .map((s) => s.trim())
        .filter((s) => s.length > 0);
      const payload = {
        id: form.id,
        name: form.name,
        price: Number(form.price),
        description: form.description,
        description_long: form.description_long,
        features,
        is_listed: form.is_listed,
        sort_order: Number(form.sort_order),
      };
      const method = editingId ? 'PATCH' : 'POST';
      const res = await fetch('/api/admin/products', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? '저장 실패');
      setShowForm(false);
      await loadAll();
    } catch (e) {
      setFormError(e instanceof Error ? e.message : '저장 실패');
    } finally {
      setSaving(false);
    }
  }

  async function toggleListed(p: Product) {
    try {
      await fetch('/api/admin/products', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: p.id, is_listed: !p.is_listed }),
      });
      await loadAll();
    } catch (e) {
      console.error(e);
    }
  }

  async function patchFileProduct(fileId: string, productId: string | null) {
    await fetch('/api/admin/packs', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: fileId, product_id: productId }),
    });
    await reloadFiles();
  }

  async function handleUpload(e: React.FormEvent) {
    e.preventDefault();
    setUploadError(null);
    setUploadMsg(null);
    if (!uploadFile || !uploadLabel || !selectedProductId) return;
    setUploading(true);
    setProgress(0);
    const targetName = uploadFile.name;
    const targetSize = uploadFile.size;

    try {
      // 1) 토큰 발급 (tier는 starter 고정)
      const tokenRes = await fetch('/api/admin/packs/upload-url', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tier: 'starter',
          label: uploadLabel,
          filename: uploadFile.name,
          sizeBytes: uploadFile.size,
        }),
      });
      if (!tokenRes.ok) {
        const err = await tokenRes.json();
        throw new Error(err.error ?? '토큰 발급 실패');
      }
      const { token, uploadUrl } = await tokenRes.json();

      // 2) 브라우저가 web-backend에 직접 multipart POST (XHR 진행률)
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
        fd.append('file', uploadFile);
        xhr.send(fd);
      });

      // 3) 방금 생성된 행을 filename+size로 찾아 자동 배정
      const fresh = await reloadFiles();
      const candidates = fresh.filter(
        (f) => f.filename === targetName && f.size_bytes === targetSize && f.product_id === null,
      );
      if (candidates.length === 1) {
        await patchFileProduct(candidates[0].id, selectedProductId);
        setUploadMsg('업로드 + 제품 배정 완료');
      } else {
        setUploadMsg(
          '업로드 완료. 자동 배정에 실패했습니다(동명 파일 등). 아래 미배정 목록에서 수동으로 배정하세요.',
        );
      }

      setUploadFile(null);
      setUploadLabel('');
      setProgress(0);
    } catch (e) {
      setUploadError(e instanceof Error ? e.message : '업로드 실패');
    } finally {
      setUploading(false);
    }
  }

  const selectedProduct = products.find((p) => p.id === selectedProductId) ?? null;
  const productFiles = selectedProductId
    ? files.filter((f) => f.product_id === selectedProductId)
    : [];
  const otherFiles = selectedProductId
    ? files.filter((f) => f.product_id !== selectedProductId)
    : [];

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-white text-2xl font-bold">제품 관리</h1>
          <p className="text-slate-400 text-sm mt-0.5">
            완성 소프트웨어 제품 등록·카탈로그 노출·다운로드 파일 배정.
          </p>
        </div>
        <button
          onClick={openNew}
          className="bg-violet-600 hover:bg-violet-500 text-white font-bold px-4 py-2 rounded"
        >
          + 새 제품
        </button>
      </div>

      {/* 폼 */}
      {showForm && (
        <form onSubmit={submitForm} className="bg-slate-900 rounded-xl border border-slate-700 p-5 mb-8">
          <h2 className="text-white font-bold mb-4">{editingId ? `제품 편집: ${editingId}` : '새 제품 등록'}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
            <div>
              <label className="text-slate-400 text-xs block mb-1">제품 id (영소문자/숫자/_)</label>
              <input
                type="text"
                value={form.id}
                onChange={(e) => setForm({ ...form, id: e.target.value })}
                disabled={!!editingId || saving}
                placeholder="예: lotto_pro"
                className="w-full bg-slate-800 text-white border border-slate-700 rounded px-3 py-2 disabled:opacity-60"
              />
            </div>
            <div>
              <label className="text-slate-400 text-xs block mb-1">제품명</label>
              <input
                type="text"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                disabled={saving}
                className="w-full bg-slate-800 text-white border border-slate-700 rounded px-3 py-2"
              />
            </div>
            <div>
              <label className="text-slate-400 text-xs block mb-1">가격 (원, 정수)</label>
              <input
                type="number"
                min={0}
                value={form.price}
                onChange={(e) => setForm({ ...form, price: Number(e.target.value) })}
                disabled={saving}
                className="w-full bg-slate-800 text-white border border-slate-700 rounded px-3 py-2"
              />
            </div>
            <div>
              <label className="text-slate-400 text-xs block mb-1">정렬 순서</label>
              <input
                type="number"
                value={form.sort_order}
                onChange={(e) => setForm({ ...form, sort_order: Number(e.target.value) })}
                disabled={saving}
                className="w-full bg-slate-800 text-white border border-slate-700 rounded px-3 py-2"
              />
            </div>
          </div>
          <div className="mb-3">
            <label className="text-slate-400 text-xs block mb-1">짧은 설명 (1줄)</label>
            <input
              type="text"
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              disabled={saving}
              className="w-full bg-slate-800 text-white border border-slate-700 rounded px-3 py-2"
            />
          </div>
          <div className="mb-3">
            <label className="text-slate-400 text-xs block mb-1">상세 설명</label>
            <textarea
              value={form.description_long}
              onChange={(e) => setForm({ ...form, description_long: e.target.value })}
              disabled={saving}
              rows={3}
              className="w-full bg-slate-800 text-white border border-slate-700 rounded px-3 py-2"
            />
          </div>
          <div className="mb-3">
            <label className="text-slate-400 text-xs block mb-1">특징 (줄바꿈으로 구분)</label>
            <textarea
              value={form.featuresText}
              onChange={(e) => setForm({ ...form, featuresText: e.target.value })}
              disabled={saving}
              rows={3}
              placeholder={'텔레그램 연동\n실시간 알림\n백테스트'}
              className="w-full bg-slate-800 text-white border border-slate-700 rounded px-3 py-2"
            />
          </div>
          <label className="flex items-center gap-2 mb-4 text-slate-300 text-sm">
            <input
              type="checkbox"
              checked={form.is_listed}
              onChange={(e) => setForm({ ...form, is_listed: e.target.checked })}
              disabled={saving}
            />
            카탈로그에 노출 (is_listed)
          </label>
          {formError && <p className="text-red-400 text-sm mb-3">{formError}</p>}
          <div className="flex gap-2">
            <button
              type="submit"
              disabled={saving}
              className="bg-violet-600 hover:bg-violet-500 disabled:bg-slate-700 text-white font-bold px-5 py-2 rounded"
            >
              {saving ? '저장 중...' : editingId ? '수정 저장' : '제품 생성'}
            </button>
            <button
              type="button"
              onClick={() => setShowForm(false)}
              disabled={saving}
              className="bg-slate-700 hover:bg-slate-600 text-white px-5 py-2 rounded"
            >
              취소
            </button>
          </div>
        </form>
      )}

      {/* 제품 목록 */}
      {loading ? (
        <p className="text-slate-400">불러오는 중...</p>
      ) : loadError ? (
        <p className="text-red-400">{loadError}</p>
      ) : products.length === 0 ? (
        <p className="text-slate-500">등록된 제품이 없습니다. [+ 새 제품]으로 등록하세요.</p>
      ) : (
        <div className="bg-slate-900 border border-slate-700 rounded-xl overflow-hidden mb-8">
          <table className="w-full text-sm">
            <thead className="bg-slate-800 text-slate-400">
              <tr>
                <th className="text-left px-4 py-3">제품명</th>
                <th className="text-right px-4 py-3">가격</th>
                <th className="text-center px-4 py-3">노출</th>
                <th className="text-center px-4 py-3">순서</th>
                <th className="text-right px-4 py-3">관리</th>
              </tr>
            </thead>
            <tbody>
              {products.map((p) => (
                <tr key={p.id} className="border-t border-slate-800">
                  <td className="px-4 py-3 text-white">
                    {p.name}
                    <span className="text-slate-500 text-xs ml-2">{p.id}</span>
                  </td>
                  <td className="px-4 py-3 text-right text-slate-300">₩{p.price.toLocaleString()}</td>
                  <td className="px-4 py-3 text-center">
                    <button
                      onClick={() => toggleListed(p)}
                      className={`px-2 py-1 rounded text-xs font-medium ${
                        p.is_listed
                          ? 'bg-emerald-600/30 text-emerald-300 border border-emerald-500/40'
                          : 'bg-slate-700 text-slate-400'
                      }`}
                    >
                      {p.is_listed ? '노출' : '숨김'}
                    </button>
                  </td>
                  <td className="px-4 py-3 text-center text-slate-400">{p.sort_order}</td>
                  <td className="px-4 py-3 text-right whitespace-nowrap">
                    <button
                      onClick={() => openEdit(p)}
                      className="text-violet-400 hover:text-violet-300 px-2"
                    >
                      편집
                    </button>
                    <button
                      onClick={() => { setSelectedProductId(p.id); setUploadMsg(null); setUploadError(null); }}
                      className="text-blue-400 hover:text-blue-300 px-2"
                    >
                      파일 관리
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* 파일 관리 섹션 */}
      {selectedProduct && (
        <div className="bg-slate-900 border border-slate-700 rounded-xl p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-white font-bold">
              파일 관리 — {selectedProduct.name}
            </h2>
            <button
              onClick={() => setSelectedProductId(null)}
              className="text-slate-400 hover:text-white text-sm"
            >
              닫기
            </button>
          </div>

          {/* 현재 제품 파일 */}
          <h3 className="text-slate-300 font-semibold text-sm mb-2">배정된 파일 ({productFiles.length})</h3>
          {productFiles.length === 0 ? (
            <p className="text-slate-500 text-sm mb-4">배정된 파일이 없습니다.</p>
          ) : (
            <div className="space-y-2 mb-4">
              {productFiles.map((f) => (
                <div key={f.id} className="bg-slate-800 border border-slate-700 rounded-lg p-3 flex items-center gap-3">
                  <span className="flex-1 text-white">{f.label}</span>
                  <span className="text-slate-400 text-xs">{f.filename}</span>
                  <span className="text-slate-500 text-xs">{formatSize(f.size_bytes)}</span>
                  <button
                    onClick={() => patchFileProduct(f.id, null)}
                    className="text-red-400 hover:text-red-300 text-sm px-2"
                  >
                    배정 해제
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* 업로드 */}
          <form onSubmit={handleUpload} className="border-t border-slate-800 pt-4 mb-4">
            <h3 className="text-slate-300 font-semibold text-sm mb-2">파일 업로드</h3>
            <input
              type="text"
              value={uploadLabel}
              onChange={(e) => setUploadLabel(e.target.value)}
              disabled={uploading}
              placeholder="파일 라벨 (예: 설치 가이드 PDF)"
              className="w-full bg-slate-800 text-white border border-slate-700 rounded px-3 py-2 mb-3"
            />
            <input
              type="file"
              onChange={(e) => setUploadFile(e.target.files?.[0] ?? null)}
              disabled={uploading}
              className="text-slate-300 mb-3 block"
            />
            {uploadFile && (
              <p className="text-slate-400 text-xs mb-3">
                선택됨: {uploadFile.name} ({formatSize(uploadFile.size)})
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
            {uploadMsg && <p className="text-emerald-400 text-sm mb-3">{uploadMsg}</p>}
            {uploadError && <p className="text-red-400 text-sm mb-3">{uploadError}</p>}
            <button
              type="submit"
              disabled={uploading || !uploadFile || !uploadLabel}
              className="bg-violet-600 hover:bg-violet-500 disabled:bg-slate-700 disabled:cursor-not-allowed text-white font-bold px-5 py-2 rounded"
            >
              {uploading ? '업로드 중...' : '업로드 + 자동 배정'}
            </button>
          </form>

          {/* 미배정/타제품 파일 배정 */}
          <div className="border-t border-slate-800 pt-4">
            <h3 className="text-slate-300 font-semibold text-sm mb-2">다른 파일 배정 ({otherFiles.length})</h3>
            {otherFiles.length === 0 ? (
              <p className="text-slate-500 text-sm">배정 가능한 다른 파일이 없습니다.</p>
            ) : (
              <div className="space-y-2">
                {otherFiles.map((f) => (
                  <div key={f.id} className="bg-slate-800 border border-slate-700 rounded-lg p-3 flex items-center gap-3">
                    <span className="flex-1 text-white">{f.label}</span>
                    <span className="text-slate-400 text-xs">{f.filename}</span>
                    <span className="text-slate-500 text-xs">
                      {f.product_id ? `현재: ${f.product_id}` : '미배정'}
                    </span>
                    <button
                      onClick={() => patchFileProduct(f.id, selectedProduct.id)}
                      className="text-blue-400 hover:text-blue-300 text-sm px-2"
                    >
                      이 제품에 배정
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
