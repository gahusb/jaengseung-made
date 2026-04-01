import SajuForm from '../components/SajuForm';

export default function SajuInputPage() {
  return (
    <div className="min-h-full bg-[#f0f5ff]">
      {/* Hero */}
      <div className="relative overflow-hidden px-6 py-12"
        style={{ background: '#04102b', backgroundImage: 'repeating-linear-gradient(135deg, rgba(255,255,255,0.012) 0px, rgba(255,255,255,0.012) 1px, transparent 1px, transparent 40px)' }}>

        <div className="relative max-w-xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-violet-400/10 border border-violet-400/25 text-violet-300 text-xs font-semibold px-4 py-1.5 rounded-full mb-4 tracking-wide">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
            AI 사주 분석 · 생년월일 입력
          </div>
          <h1 className="text-3xl md:text-4xl font-extrabold text-white leading-tight mb-3 tracking-tight">
            생년월일을 입력해주세요
          </h1>
          <p className="text-blue-200/60 text-sm leading-relaxed">
            정확한 생년월일과 태어난 시간을 입력하면<br />
            더 정밀한 사주팔자를 계산할 수 있습니다.
          </p>
        </div>
      </div>

      {/* Form 영역 */}
      <div className="px-6 py-10 max-w-2xl mx-auto">
        <div className="bg-white rounded-2xl border border-[#dbe8ff] p-8 shadow-lg">
          <div className="flex items-center gap-2 mb-6">
            <div className="w-1 h-5 bg-gradient-to-b from-[#1a56db] to-[#7c3aed] rounded-full" />
            <h2 className="font-bold text-[#04102b] text-base">기본 정보 입력</h2>
          </div>
          <SajuForm />
        </div>

        <p className="text-center text-xs text-slate-400 mt-6">
          입력하신 정보는 사주 계산에만 사용되며 별도로 저장되지 않습니다.
        </p>
      </div>
    </div>
  );
}
