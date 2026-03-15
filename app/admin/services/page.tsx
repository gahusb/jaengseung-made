'use client';

import { useEffect, useState } from 'react';

interface Service {
  id: string;
  name: string;
  description: string;
  is_active: boolean;
  order_index: number;
}

const SERVICE_ICONS: Record<string, string> = {
  saju: '🔮',
  lotto: '🎰',
  stock: '📈',
  automation: '🤖',
  prompt: '💡',
  freelance: '🛠',
};

export default function AdminServicesPage() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [toggling, setToggling] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/admin/services')
      .then((r) => r.json())
      .then((d) => setServices(d.services ?? []))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  async function toggleService(id: string, current: boolean) {
    setToggling(id);
    try {
      const res = await fetch('/api/admin/services', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, is_active: !current }),
      });
      if (res.ok) {
        setServices((prev) =>
          prev.map((s) => (s.id === id ? { ...s, is_active: !current } : s))
        );
      }
    } catch (e) {
      console.error(e);
    } finally {
      setToggling(null);
    }
  }

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <div className="mb-6">
        <h1 className="text-white text-2xl font-bold">서비스 설정</h1>
        <p className="text-slate-400 text-sm mt-0.5">각 서비스의 노출 여부를 관리합니다</p>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-48">
          <div className="animate-spin w-8 h-8 border-2 border-red-500 border-t-transparent rounded-full" />
        </div>
      ) : (
        <div className="space-y-3">
          {services.map((service) => (
            <div
              key={service.id}
              className={`bg-slate-900 rounded-2xl p-5 border transition-all ${
                service.is_active ? 'border-slate-700/50' : 'border-slate-800 opacity-60'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <span className="text-2xl">{SERVICE_ICONS[service.id] ?? '📦'}</span>
                  <div>
                    <h3 className="text-white font-semibold">{service.name}</h3>
                    <p className="text-slate-400 text-sm">{service.description}</p>
                  </div>
                </div>
                {/* 토글 스위치 */}
                <button
                  onClick={() => toggleService(service.id, service.is_active)}
                  disabled={toggling === service.id}
                  aria-label={`${service.name} ${service.is_active ? '비활성화' : '활성화'}`}
                  className={`relative w-12 h-6 rounded-full transition-colors duration-200 focus:outline-none ${
                    service.is_active ? 'bg-green-500' : 'bg-slate-600'
                  } ${toggling === service.id ? 'opacity-50' : ''}`}
                >
                  <span
                    className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform duration-200 ${
                      service.is_active ? 'translate-x-6' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>

              {/* 상태 배지 */}
              <div className="mt-3 flex items-center gap-2">
                <span
                  className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${
                    service.is_active
                      ? 'bg-green-900/40 text-green-400'
                      : 'bg-slate-700 text-slate-500'
                  }`}
                >
                  <span className={`w-1.5 h-1.5 rounded-full ${service.is_active ? 'bg-green-400' : 'bg-slate-500'}`} />
                  {service.is_active ? '활성' : '비활성'}
                </span>
                {!service.is_active && (
                  <span className="text-slate-500 text-xs">사이트에서 숨겨집니다</span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="mt-6 bg-slate-800/50 rounded-xl p-4 border border-slate-700/30">
        <p className="text-slate-400 text-xs">
          💡 서비스 on/off는 Supabase의 <code className="text-slate-300">service_settings</code> 테이블에 저장됩니다.
          아직 테이블이 없으면 아래 SQL을 실행하세요.
        </p>
        <pre className="text-slate-500 text-xs mt-2 bg-slate-900 rounded p-3 overflow-x-auto">{`CREATE TABLE service_settings (
  id text PRIMARY KEY,
  name text,
  description text,
  is_active boolean DEFAULT true,
  order_index integer DEFAULT 0,
  updated_at timestamptz DEFAULT now()
);`}</pre>
      </div>
    </div>
  );
}
