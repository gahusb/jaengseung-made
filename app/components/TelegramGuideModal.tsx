'use client';

/**
 * TelegramGuideModal
 * 고객에게 텔레그램 연결 방법을 단계별로 시각적으로 설명하는 모달
 * - 이미지로 캡처해서 공유하거나 인앱으로 보여줄 수 있음
 */
export default function TelegramGuideModal({ onClose }: { onClose: () => void }) {
  const steps = [
    {
      no: 1,
      title: '마이페이지 접속',
      desc: '로그인 후 우측 상단 프로필 메뉴 → 마이페이지로 이동합니다.',
      icon: (
        <svg className="w-7 h-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
      ),
      color: 'bg-blue-50 border-blue-200 text-blue-600',
      dot: 'bg-blue-500',
      mockup: (
        <div className="bg-white rounded-xl border border-slate-200 p-3 text-xs shadow-sm">
          <div className="flex items-center gap-2 mb-3 pb-2 border-b border-slate-100">
            <div className="w-6 h-6 rounded-full bg-gradient-to-br from-blue-500 to-violet-500" />
            <span className="font-semibold text-slate-700">내 계정</span>
            <span className="ml-auto text-slate-400">▶ 마이페이지</span>
          </div>
          <div className="text-slate-500">내 정보 · 결제 내역 · 텔레그램 연동</div>
        </div>
      ),
    },
    {
      no: 2,
      title: '\'내 정보\' 탭 → 텔레그램 연결하기 클릭',
      desc: '\'내 정보\' 탭의 텔레그램 알림 연동 섹션에서 버튼을 클릭합니다.',
      icon: (
        <svg className="w-7 h-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5" />
        </svg>
      ),
      color: 'bg-sky-50 border-sky-200 text-sky-600',
      dot: 'bg-sky-500',
      mockup: (
        <div className="bg-white rounded-xl border border-slate-200 p-3 shadow-sm">
          <div className="text-xs font-semibold text-slate-600 mb-2 flex items-center gap-1">
            <span className="w-1 h-3.5 bg-sky-400 rounded-full inline-block" />
            텔레그램 알림 연동
            <span className="ml-auto text-xs text-slate-400 font-normal">플래티넘 · 다이아</span>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center">
                <svg className="w-4 h-4 text-slate-400" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.894 8.221-1.97 9.28c-.145.658-.537.818-1.084.508l-3-2.21-1.447 1.394c-.16.16-.295.295-.605.295l.213-3.053 5.56-5.023c.242-.213-.054-.333-.373-.12L7.17 13.667l-2.95-.924c-.64-.203-.654-.64.136-.954l11.566-4.458c.538-.194 1.006.131.972.89z"/>
                </svg>
              </div>
              <div>
                <div className="text-xs font-semibold text-slate-700">연결 안 됨</div>
                <div className="text-xs text-slate-400">텔레그램으로 번호를 받아보세요</div>
              </div>
            </div>
            <div className="px-3 py-1.5 bg-gradient-to-r from-sky-500 to-blue-600 text-white text-xs font-bold rounded-lg shadow-sm animate-pulse">
              텔레그램 연결하기
            </div>
          </div>
        </div>
      ),
    },
    {
      no: 3,
      title: '\'텔레그램 봇 열기\' 버튼 클릭',
      desc: '연결 코드가 생성되면 파란색 버튼을 클릭합니다. 자동으로 텔레그램 앱이 열립니다.',
      icon: (
        <svg className="w-7 h-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
        </svg>
      ),
      color: 'bg-indigo-50 border-indigo-200 text-indigo-600',
      dot: 'bg-indigo-500',
      mockup: (
        <div className="bg-white rounded-xl border border-slate-200 p-3 shadow-sm space-y-2">
          <div className="bg-sky-50 border border-sky-200 rounded-lg p-2.5">
            <p className="text-xs font-semibold text-sky-700 mb-1">📱 아래 순서로 진행하세요</p>
            <ol className="text-xs text-sky-600 space-y-0.5 list-decimal list-inside">
              <li>아래 버튼으로 텔레그램 봇을 엽니다</li>
              <li>텔레그램에서 <strong>시작</strong> 버튼을 누릅니다</li>
              <li>봇 메시지 확인 후 새로고침</li>
            </ol>
          </div>
          <div className="flex items-center justify-center gap-2 py-1">
            <div className="flex items-center gap-1.5 px-4 py-2 bg-sky-500 text-white text-xs font-bold rounded-lg shadow-sm w-full justify-center">
              <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.894 8.221-1.97 9.28c-.145.658-.537.818-1.084.508l-3-2.21-1.447 1.394c-.16.16-.295.295-.605.295l.213-3.053 5.56-5.023c.242-.213-.054-.333-.373-.12L7.17 13.667l-2.95-.924c-.64-.203-.654-.64.136-.954l11.566-4.458c.538-.194 1.006.131.972.89z"/>
              </svg>
              텔레그램 봇 열기 ↗
            </div>
          </div>
        </div>
      ),
    },
    {
      no: 4,
      title: '텔레그램에서 \'시작\' 버튼 클릭',
      desc: '텔레그램 앱이 열리면 채팅창 하단의 파란 \'시작\' 버튼을 클릭합니다. 자동으로 연결이 완료됩니다.',
      icon: (
        <svg className="w-7 h-7" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.894 8.221-1.97 9.28c-.145.658-.537.818-1.084.508l-3-2.21-1.447 1.394c-.16.16-.295.295-.605.295l.213-3.053 5.56-5.023c.242-.213-.054-.333-.373-.12L7.17 13.667l-2.95-.924c-.64-.203-.654-.64.136-.954l11.566-4.458c.538-.194 1.006.131.972.89z"/>
        </svg>
      ),
      color: 'bg-sky-50 border-sky-200 text-sky-500',
      dot: 'bg-sky-400',
      mockup: (
        <div className="bg-[#1c2733] rounded-xl p-3 shadow-sm">
          {/* 텔레그램 UI 모킹 */}
          <div className="flex items-center gap-2 mb-3 pb-2 border-b border-white/10">
            <div className="w-7 h-7 rounded-full bg-sky-500 flex items-center justify-center">
              <svg className="w-4 h-4 text-white" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.894 8.221-1.97 9.28c-.145.658-.537.818-1.084.508l-3-2.21-1.447 1.394c-.16.16-.295.295-.605.295l.213-3.053 5.56-5.023c.242-.213-.054-.333-.373-.12L7.17 13.667l-2.95-.924c-.64-.203-.654-.64.136-.954l11.566-4.458c.538-.194 1.006.131.972.89z"/>
              </svg>
            </div>
            <div>
              <div className="text-xs font-semibold text-white">쟁승메이드 로또봇</div>
              <div className="text-xs text-white/40">bot</div>
            </div>
          </div>
          <div className="bg-[#2b3d52] rounded-lg p-2 text-xs text-white/70 mb-2">
            안녕하세요! 로또 번호 알림 봇입니다. 아래 시작 버튼을 눌러 계정을 연결하세요.
          </div>
          <div className="flex justify-center">
            <div className="px-6 py-1.5 bg-sky-500 text-white text-xs font-bold rounded-full animate-bounce">
              시작
            </div>
          </div>
        </div>
      ),
    },
    {
      no: 5,
      title: '연결 완료!',
      desc: '봇이 "연결 완료" 메시지를 보냅니다. 마이페이지로 돌아와 \'연결 확인 새로고침\' 버튼을 누르면 완료됩니다.',
      icon: (
        <svg className="w-7 h-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      color: 'bg-emerald-50 border-emerald-200 text-emerald-600',
      dot: 'bg-emerald-500',
      mockup: (
        <div className="space-y-2">
          <div className="bg-[#1c2733] rounded-xl p-3 shadow-sm">
            <div className="bg-[#2b3d52] rounded-lg p-2 text-xs text-white/80">
              🎉 <strong className="text-white">텔레그램 연결 완료!</strong><br />
              <span className="text-white/60">이제 매주 로또 번호를 이 채팅으로 받아보실 수 있습니다. 🎰</span>
            </div>
          </div>
          <div className="bg-white rounded-xl border border-emerald-200 p-3 shadow-sm">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-sky-50 border border-sky-200 flex items-center justify-center">
                <svg className="w-4 h-4 text-sky-500" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.894 8.221-1.97 9.28c-.145.658-.537.818-1.084.508l-3-2.21-1.447 1.394c-.16.16-.295.295-.605.295l.213-3.053 5.56-5.023c.242-.213-.054-.333-.373-.12L7.17 13.667l-2.95-.924c-.64-.203-.654-.64.136-.954l11.566-4.458c.538-.194 1.006.131.972.89z"/>
                </svg>
              </div>
              <div>
                <div className="text-xs font-semibold text-[#04102b] flex items-center gap-1.5">
                  연결됨
                  <span className="w-2 h-2 rounded-full bg-emerald-400 inline-block" />
                </div>
                <div className="text-xs text-slate-500">매주 로또 번호 알림 수신 중</div>
              </div>
            </div>
          </div>
        </div>
      ),
    },
  ];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-3xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* 헤더 */}
        <div className="sticky top-0 bg-white rounded-t-3xl border-b border-slate-100 px-6 py-4 flex items-center justify-between z-10">
          <div>
            <h2 className="text-base font-extrabold text-[#04102b] flex items-center gap-2">
              <svg className="w-5 h-5 text-sky-500" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.894 8.221-1.97 9.28c-.145.658-.537.818-1.084.508l-3-2.21-1.447 1.394c-.16.16-.295.295-.605.295l.213-3.053 5.56-5.023c.242-.213-.054-.333-.373-.12L7.17 13.667l-2.95-.924c-.64-.203-.654-.64.136-.954l11.566-4.458c.538-.194 1.006.131.972.89z"/>
              </svg>
              텔레그램 연결 방법
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">5단계로 쉽게 연결할 수 있습니다</p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-full bg-slate-100 hover:bg-slate-200 transition text-slate-500 text-sm font-bold"
          >
            ✕
          </button>
        </div>

        {/* 스텝 목록 */}
        <div className="px-6 py-5 space-y-5">
          {steps.map((step, idx) => (
            <div key={step.no} className="relative">
              {/* 연결선 */}
              {idx < steps.length - 1 && (
                <div className="absolute left-5 top-14 w-0.5 h-4 bg-slate-200" />
              )}

              <div className="flex gap-3">
                {/* 스텝 번호 + 아이콘 */}
                <div className={`w-10 h-10 rounded-2xl border-2 flex items-center justify-center flex-shrink-0 ${step.color}`}>
                  {step.icon}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`w-5 h-5 rounded-full text-white text-xs font-extrabold flex items-center justify-center flex-shrink-0 ${step.dot}`}>
                      {step.no}
                    </span>
                    <h3 className="text-sm font-extrabold text-[#04102b] leading-tight">{step.title}</h3>
                  </div>
                  <p className="text-xs text-slate-500 leading-relaxed mb-2.5">{step.desc}</p>
                  {/* 화면 목업 */}
                  <div className="rounded-xl overflow-hidden">
                    {step.mockup}
                  </div>
                </div>
              </div>
            </div>
          ))}

          {/* 안내 메시지 */}
          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4">
            <p className="text-xs font-bold text-amber-700 mb-1.5 flex items-center gap-1.5">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              알아두세요
            </p>
            <ul className="text-xs text-amber-600 space-y-1">
              <li>• 연결 코드는 발급 후 <strong>15분</strong> 이내에 사용해야 합니다</li>
              <li>• 텔레그램 앱이 설치되어 있어야 합니다 (iOS / Android / PC 모두 가능)</li>
              <li>• 연결은 언제든 마이페이지에서 해제할 수 있습니다</li>
              <li>• 플래티넘 · 다이아 구독자만 텔레그램 알림을 받을 수 있습니다</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
