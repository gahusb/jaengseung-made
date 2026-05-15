'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

type Mode = 'simple' | 'custom';

type SunoClip = {
  id: string;
  title?: string;
  audioUrl?: string;
  streamAudioUrl?: string;
  imageUrl?: string;
  tags?: string;
  duration?: number;
  prompt?: string;
};

type TaskState = {
  taskId: string;
  status: string;
  errorMessage?: string;
  clips: SunoClip[];
  updatedAt: number;
};

const MODELS = [
  { id: 'V4', label: 'V4 (기본)', desc: '안정적 고품질' },
  { id: 'V4_5', label: 'V4.5', desc: '최신 · 풍부한 디테일' },
  { id: 'V3_5', label: 'V3.5', desc: '빠른 생성' },
];

const TAG_PRESETS = [
  'k-pop', 'lo-fi', 'city pop', 'ballad', 'edm', 'trap',
  'rock', 'jazz', 'acoustic', 'cinematic', 'synthwave', 'ambient',
];

const LS_KEY = 'jsm_studio_task_ids_v2';

const isDone = (s: string) => s === 'SUCCESS' || s === 'FIRST_SUCCESS';
const isFailed = (s: string) => s.includes('FAILED') || s === 'SENSITIVE_WORD_ERROR';

export default function StudioPage() {
  const [mode, setMode] = useState<Mode>('simple');
  const [model, setModel] = useState('V4');
  const [prompt, setPrompt] = useState('');
  const [title, setTitle] = useState('');
  const [lyrics, setLyrics] = useState('');
  const [tags, setTags] = useState('');
  const [instrumental, setInstrumental] = useState(false);

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [tasks, setTasks] = useState<TaskState[]>([]);
  const pollRef = useRef<number | null>(null);

  const saveToLS = useCallback((ids: string[]) => {
    if (typeof window === 'undefined') return;
    try { localStorage.setItem(LS_KEY, JSON.stringify(ids.slice(0, 20))); } catch { /* noop */ }
  }, []);

  const fetchOne = useCallback(async (taskId: string) => {
    try {
      const res = await fetch(`/api/studio/status?taskId=${encodeURIComponent(taskId)}`);
      const json = await res.json();
      if (!json.ok) return null;
      const d = json.data?.data ?? json.data;
      const status: string = d?.status ?? 'PENDING';
      const errMsg: string | undefined = d?.errorMessage;
      const sunoData: SunoClip[] = d?.response?.sunoData ?? [];
      return { taskId, status, errorMessage: errMsg, clips: sunoData, updatedAt: Date.now() } as TaskState;
    } catch {
      return null;
    }
  }, []);

  const refreshAll = useCallback(async (ids: string[]) => {
    const results = await Promise.all(ids.map((id) => fetchOne(id)));
    setTasks((prev) => {
      const map = new Map(prev.map((t) => [t.taskId, t]));
      for (const r of results) if (r) map.set(r.taskId, r);
      return Array.from(map.values()).sort((a, b) => b.updatedAt - a.updatedAt);
    });
  }, [fetchOne]);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      const raw = localStorage.getItem(LS_KEY);
      const ids = raw ? (JSON.parse(raw) as string[]) : [];
      if (ids.length) {
        setTasks(ids.map((id) => ({ taskId: id, status: 'PENDING', clips: [], updatedAt: Date.now() })));
        refreshAll(ids);
      }
    } catch { /* noop */ }
  }, [refreshAll]);

  useEffect(() => {
    if (pollRef.current) window.clearInterval(pollRef.current);
    const pending = tasks.filter((t) => !isDone(t.status) && !isFailed(t.status));
    if (pending.length) {
      pollRef.current = window.setInterval(() => {
        refreshAll(pending.map((t) => t.taskId));
      }, 8000);
    }
    return () => { if (pollRef.current) window.clearInterval(pollRef.current); };
  }, [tasks, refreshAll]);

  const onSubmit = async () => {
    setError(null);
    if (mode === 'simple' && !prompt.trim()) { setError('프롬프트를 입력해주세요.'); return; }
    if (mode === 'custom') {
      if (!title.trim()) { setError('트랙 제목을 입력해주세요.'); return; }
      if (!tags.trim()) { setError('스타일 태그를 입력해주세요.'); return; }
      if (!lyrics.trim() && !instrumental) { setError('가사를 입력하거나 Instrumental을 켜주세요.'); return; }
    }
    setSubmitting(true);
    try {
      const res = await fetch('/api/studio/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          mode, model,
          prompt: prompt.trim(),
          title: title.trim(),
          lyrics: lyrics.trim(),
          tags: tags.trim(),
          make_instrumental: instrumental,
        }),
      });
      const json = await res.json();
      if (!res.ok || !json.ok) {
        setError(typeof json.error === 'string' ? json.error : '생성 실패');
        return;
      }
      const taskId: string | undefined = json.data?.data?.taskId ?? json.data?.taskId;
      if (!taskId) {
        setError('응답에서 taskId를 찾지 못했습니다.');
        return;
      }
      setTasks((prev) => {
        const next: TaskState[] = [
          { taskId, status: 'PENDING', clips: [], updatedAt: Date.now() },
          ...prev.filter((t) => t.taskId !== taskId),
        ];
        saveToLS(next.map((t) => t.taskId));
        return next;
      });
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    } finally {
      setSubmitting(false);
    }
  };

  const addTag = (t: string) => {
    const cur = tags.split(',').map((x) => x.trim()).filter(Boolean);
    if (cur.includes(t)) return;
    setTags([...cur, t].join(', '));
  };

  return (
    <div
      className="min-h-screen px-4 md:px-8 lg:px-12 py-10"
      style={{
        background:
          'radial-gradient(1200px 600px at 20% -10%, rgba(156,72,234,0.18), transparent 60%), radial-gradient(1000px 500px at 110% 10%, rgba(83,221,252,0.12), transparent 55%), var(--kx-surface)',
        color: 'var(--kx-on-surface)',
      }}
    >
      <div className="max-w-7xl mx-auto">
        <div className="flex items-end justify-between flex-wrap gap-4 mb-8">
          <div>
            <span className="kx-label">JAENGSEUNG STUDIO</span>
            <h1 className="kx-display text-3xl md:text-5xl font-extrabold mt-2" style={{ letterSpacing: '-0.02em' }}>
              프롬프트 한 줄로 트랙 만들기
            </h1>
            <p className="mt-2 text-sm" style={{ color: 'var(--kx-on-variant)' }}>
              Suno 엔진 기반 · Custom 모드로 가사·태그·보컬까지 세밀 제어
            </p>
          </div>
          <div
            className="text-xs px-3 py-1.5 rounded-full border"
            style={{
              borderColor: 'rgba(204,151,255,0.35)',
              background: 'rgba(204,151,255,0.1)',
              color: 'var(--kx-primary)',
            }}
          >
            ⚡ v1 Studio · Live
          </div>
        </div>

        <div className="grid lg:grid-cols-[minmax(0,7fr)_minmax(0,5fr)] gap-6">
          {/* 좌측: 제어판 */}
          <div
            className="rounded-2xl p-6 md:p-8"
            style={{
              background: 'rgba(12,22,45,0.7)',
              border: '1px solid rgba(255,255,255,0.06)',
              backdropFilter: 'blur(16px)',
            }}
          >
            <div className="flex gap-1 p-1 rounded-full mb-6" style={{ background: 'rgba(255,255,255,0.04)' }}>
              {(['simple', 'custom'] as Mode[]).map((m) => (
                <button
                  key={m}
                  onClick={() => setMode(m)}
                  className="flex-1 py-2.5 text-sm font-semibold rounded-full transition-all"
                  style={
                    mode === m
                      ? {
                          background: 'linear-gradient(135deg, rgba(204,151,255,0.25), rgba(83,221,252,0.15))',
                          color: '#fff',
                          boxShadow: '0 0 24px rgba(204,151,255,0.25) inset',
                        }
                      : { color: 'var(--kx-on-variant)' }
                  }
                >
                  {m === 'simple' ? '간단 모드' : 'Custom 모드'}
                </button>
              ))}
            </div>

            {mode === 'simple' ? (
              <div className="space-y-5">
                <Field label="프롬프트" hint="무드·장르·가사 아이디어를 한 줄로">
                  <textarea
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    rows={5}
                    placeholder="예: 비 오는 서울 새벽, 감성 시티팝 with 여성 보컬, 2010년대 무드"
                    className="w-full bg-transparent outline-none resize-none text-base"
                    style={{ color: 'var(--kx-on-surface)' }}
                  />
                </Field>
              </div>
            ) : (
              <div className="space-y-5">
                <Field label="트랙 제목">
                  <input
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="예: 새벽 세 시의 도시"
                    className="w-full bg-transparent outline-none text-base"
                    style={{ color: 'var(--kx-on-surface)' }}
                  />
                </Field>
                <Field label="가사" hint="Suno 포맷: [Verse] [Chorus] [Bridge] 등 태그 가능">
                  <textarea
                    value={lyrics}
                    onChange={(e) => setLyrics(e.target.value)}
                    rows={8}
                    placeholder={'[Verse]\n차가운 조명 아래 걷는 나\n새벽 세 시의 도시는 낯설어\n\n[Chorus]\n...'}
                    className="w-full bg-transparent outline-none resize-none font-mono text-sm leading-relaxed"
                    style={{ color: 'var(--kx-on-surface)' }}
                  />
                </Field>
                <Field label="스타일 태그" hint="쉼표로 구분 · 장르·무드·악기·보컬 톤">
                  <input
                    value={tags}
                    onChange={(e) => setTags(e.target.value)}
                    placeholder="city pop, female vocal, 120bpm, synth, nostalgic"
                    className="w-full bg-transparent outline-none text-base"
                    style={{ color: 'var(--kx-on-surface)' }}
                  />
                  <div className="flex flex-wrap gap-1.5 mt-3">
                    {TAG_PRESETS.map((t) => (
                      <button
                        key={t}
                        onClick={() => addTag(t)}
                        className="text-xs px-2.5 py-1 rounded-full transition"
                        style={{
                          background: 'rgba(255,255,255,0.04)',
                          border: '1px solid rgba(255,255,255,0.08)',
                          color: 'var(--kx-on-variant)',
                        }}
                      >
                        + {t}
                      </button>
                    ))}
                  </div>
                </Field>
              </div>
            )}

            <div className="grid grid-cols-2 gap-4 mt-6">
              <Field label="모델">
                <select
                  value={model}
                  onChange={(e) => setModel(e.target.value)}
                  className="w-full bg-transparent outline-none text-sm"
                  style={{ color: 'var(--kx-on-surface)' }}
                >
                  {MODELS.map((m) => (
                    <option key={m.id} value={m.id} style={{ background: '#0b1428' }}>
                      {m.label} — {m.desc}
                    </option>
                  ))}
                </select>
              </Field>
              <Field label="Instrumental (가사 없음)">
                <label className="flex items-center gap-3 cursor-pointer">
                  <span
                    className="relative inline-block w-11 h-6 rounded-full transition"
                    style={{ background: instrumental ? 'rgba(204,151,255,0.6)' : 'rgba(255,255,255,0.1)' }}
                  >
                    <span
                      className="absolute top-0.5 w-5 h-5 rounded-full bg-white transition-all"
                      style={{ left: instrumental ? '22px' : '2px' }}
                    />
                  </span>
                  <input
                    type="checkbox"
                    checked={instrumental}
                    onChange={(e) => setInstrumental(e.target.checked)}
                    className="sr-only"
                  />
                  <span className="text-xs" style={{ color: 'var(--kx-on-variant)' }}>
                    {instrumental ? 'ON' : 'OFF'}
                  </span>
                </label>
              </Field>
            </div>

            <div className="mt-8">
              <button
                onClick={onSubmit}
                disabled={submitting}
                className="w-full py-4 rounded-xl font-extrabold text-base transition-all disabled:opacity-60"
                style={{
                  background: submitting
                    ? 'rgba(204,151,255,0.2)'
                    : 'linear-gradient(135deg, #cc97ff 0%, #7c3aed 50%, #53ddfc 100%)',
                  color: '#0b1428',
                  boxShadow: submitting ? 'none' : '0 12px 40px -12px rgba(204,151,255,0.6)',
                  letterSpacing: '0.01em',
                }}
              >
                {submitting ? '생성 요청 중…' : '▶  Generate Track'}
              </button>
              {error && (
                <p className="mt-3 text-xs px-3 py-2 rounded-lg" style={{ background: 'rgba(215,51,87,0.12)', color: '#ff8ba7' }}>
                  {error}
                </p>
              )}
              <p className="mt-3 text-[11px] leading-relaxed" style={{ color: 'var(--kx-on-variant)' }}>
                생성된 결과는 Suno 서비스 약관을 따릅니다. 상업 이용 전 플랜·저작권을 반드시 확인하세요.
              </p>
            </div>
          </div>

          {/* 우측: 결과 */}
          <div
            className="rounded-2xl p-6 md:p-7"
            style={{
              background: 'rgba(9,17,36,0.7)',
              border: '1px solid rgba(255,255,255,0.06)',
              backdropFilter: 'blur(16px)',
            }}
          >
            <div className="flex items-center justify-between mb-4">
              <div>
                <span className="kx-label">RECENT TRACKS</span>
                <h2 className="kx-display text-xl font-bold mt-1">최근 생성 결과</h2>
              </div>
              {tasks.length > 0 && (
                <button
                  onClick={() => { setTasks([]); saveToLS([]); }}
                  className="text-[11px] underline underline-offset-4"
                  style={{ color: 'var(--kx-on-variant)' }}
                >
                  기록 지우기
                </button>
              )}
            </div>

            {tasks.length === 0 ? (
              <div
                className="rounded-xl p-8 text-center text-sm"
                style={{ border: '1px dashed rgba(255,255,255,0.1)', color: 'var(--kx-on-variant)' }}
              >
                아직 생성된 트랙이 없습니다.
                <br />왼쪽에서 프롬프트를 입력하고 Generate를 눌러보세요.
              </div>
            ) : (
              <ul className="space-y-4 max-h-[640px] overflow-y-auto pr-1">
                {tasks.map((task) => (
                  <li
                    key={task.taskId}
                    className="rounded-xl p-4"
                    style={{
                      background: 'rgba(20,31,56,0.6)',
                      border: '1px solid rgba(255,255,255,0.05)',
                    }}
                  >
                    <div className="flex items-center justify-between gap-3 mb-3">
                      <span className="text-[11px] font-mono opacity-60">task: {task.taskId.slice(0, 10)}…</span>
                      <StatusBadge status={task.status} />
                    </div>

                    {task.clips.length === 0 ? (
                      <div
                        className="h-9 rounded-md flex items-center justify-center text-xs"
                        style={{
                          background: 'linear-gradient(90deg, rgba(204,151,255,0.08) 0%, rgba(83,221,252,0.08) 100%)',
                          color: 'var(--kx-on-variant)',
                        }}
                      >
                        {isFailed(task.status)
                          ? (task.errorMessage ?? '생성 실패')
                          : '오디오 생성 중… (보통 1~3분)'}
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {task.clips.map((c) => {
                          const src = c.audioUrl || c.streamAudioUrl;
                          return (
                            <div
                              key={c.id}
                              className="rounded-lg p-3"
                              style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.04)' }}
                            >
                              <div className="flex items-center gap-3">
                                {c.imageUrl && (
                                  // eslint-disable-next-line @next/next/no-img-element
                                  <img
                                    src={c.imageUrl}
                                    alt=""
                                    className="w-12 h-12 rounded-md object-cover flex-shrink-0"
                                  />
                                )}
                                <div className="min-w-0 flex-1">
                                  <p className="font-semibold text-sm truncate" style={{ color: 'var(--kx-on-surface)' }}>
                                    {c.title || '제목 없음'}
                                  </p>
                                  {c.tags && (
                                    <p className="text-[11px] truncate mt-0.5" style={{ color: 'var(--kx-on-variant)' }}>
                                      {c.tags}
                                    </p>
                                  )}
                                </div>
                                {c.duration && (
                                  <span className="text-[10px] font-mono opacity-60">
                                    {Math.round(c.duration)}s
                                  </span>
                                )}
                              </div>
                              {src ? (
                                <audio controls src={src} className="w-full mt-2" style={{ height: 36 }} />
                              ) : null}
                              {c.audioUrl && (
                                <div className="mt-1.5 text-[11px]" style={{ color: 'var(--kx-on-variant)' }}>
                                  <a href={c.audioUrl} download className="underline underline-offset-4 hover:text-white">
                                    MP3 다운로드
                                  </a>
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        <div className="mt-10 grid md:grid-cols-3 gap-4 text-xs" style={{ color: 'var(--kx-on-variant)' }}>
          <Tip title="① 간단 모드" body="한 줄 프롬프트로 즉시 생성. 결과물 다양성 높음." />
          <Tip title="② Custom 모드" body="가사·태그·보컬·악기까지 정밀 제어. 반복 생성에 유리." />
          <Tip title="③ 상업 이용" body="Suno Pro 이상 플랜에서 생성한 결과만 수익화 가능. 플랜 확인 필수." />
        </div>
      </div>
    </div>
  );
}

function Field({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <div
      className="rounded-xl p-4"
      style={{
        background: 'rgba(255,255,255,0.02)',
        border: '1px solid rgba(255,255,255,0.06)',
      }}
    >
      <div className="flex items-baseline justify-between mb-2">
        <span className="text-[11px] font-semibold tracking-widest uppercase" style={{ color: 'var(--kx-primary)' }}>
          {label}
        </span>
        {hint && <span className="text-[10px]" style={{ color: 'var(--kx-on-variant)' }}>{hint}</span>}
      </div>
      {children}
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, { bg: string; fg: string; label: string }> = {
    SUCCESS: { bg: 'rgba(64,206,172,0.18)', fg: '#6cf0c6', label: '완료' },
    FIRST_SUCCESS: { bg: 'rgba(83,221,252,0.18)', fg: '#53ddfc', label: '첫 트랙 준비' },
    TEXT_SUCCESS: { bg: 'rgba(83,221,252,0.18)', fg: '#53ddfc', label: '가사 완료' },
    PENDING: { bg: 'rgba(204,151,255,0.18)', fg: '#cc97ff', label: '대기' },
  };
  let entry = map[status];
  if (!entry) {
    entry = isFailed(status)
      ? { bg: 'rgba(215,51,87,0.18)', fg: '#ff8ba7', label: '실패' }
      : { bg: 'rgba(255,255,255,0.06)', fg: 'rgba(255,255,255,0.6)', label: status };
  }
  return (
    <span
      className="text-[10px] font-semibold px-2 py-0.5 rounded-full whitespace-nowrap"
      style={{ background: entry.bg, color: entry.fg }}
    >
      {entry.label}
    </span>
  );
}

function Tip({ title, body }: { title: string; body: string }) {
  return (
    <div
      className="rounded-xl p-4"
      style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)' }}
    >
      <p className="font-semibold mb-1" style={{ color: 'var(--kx-on-surface)' }}>
        {title}
      </p>
      <p className="leading-relaxed">{body}</p>
    </div>
  );
}
