import { Metadata } from 'next';

export const metadata: Metadata = {
  title: '환불 정책 | 쟁승메이드',
  description: '쟁승메이드 환불 및 취소 정책',
};

export default function RefundPage() {
  return (
    <div className="max-w-3xl mx-auto px-6 py-12">
      <h1 className="text-2xl font-extrabold text-[#04102b] mb-8">환불 정책</h1>

      <div className="prose prose-sm prose-slate max-w-none space-y-6 text-slate-600 leading-relaxed">
        <p>
          쟁승메이드(이하 &quot;회사&quot;)는 공정하고 투명한 환불 정책을 운영합니다.
          서비스 유형에 따라 환불 조건이 다르므로 아래 내용을 확인해주세요.
        </p>

        <section>
          <h2 className="text-lg font-bold text-slate-800 mt-8 mb-3">1. 디지털 콘텐츠 (즉시 제공 상품)</h2>
          <p className="font-medium text-slate-700">대상: 프롬프트 패키지, AI 사주 리포트, 로또 분석 등</p>
          <table className="w-full text-sm border border-slate-200 mt-3">
            <thead>
              <tr className="bg-slate-50">
                <th className="border border-slate-200 px-3 py-2 text-left font-semibold">시점</th>
                <th className="border border-slate-200 px-3 py-2 text-left font-semibold">환불 가능 여부</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border border-slate-200 px-3 py-2">결제 후 다운로드/열람 전</td>
                <td className="border border-slate-200 px-3 py-2 text-emerald-600 font-medium">전액 환불</td>
              </tr>
              <tr>
                <td className="border border-slate-200 px-3 py-2">다운로드/열람 후 7일 이내</td>
                <td className="border border-slate-200 px-3 py-2 text-amber-600 font-medium">서비스 하자 시 환불 (정상 제공 시 환불 불가)</td>
              </tr>
              <tr>
                <td className="border border-slate-200 px-3 py-2">7일 경과</td>
                <td className="border border-slate-200 px-3 py-2 text-slate-400">환불 불가</td>
              </tr>
            </tbody>
          </table>
          <p className="text-xs text-slate-400 mt-2">
            * 전자상거래법 제17조에 따라, 디지털 콘텐츠는 이용 후 청약철회가 제한될 수 있습니다.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-slate-800 mt-8 mb-3">2. 구독 서비스</h2>
          <p className="font-medium text-slate-700">대상: AI 자동화 키트 월 구독, 로또 월간 플랜, 주식 월 유지비 등</p>
          <table className="w-full text-sm border border-slate-200 mt-3">
            <thead>
              <tr className="bg-slate-50">
                <th className="border border-slate-200 px-3 py-2 text-left font-semibold">시점</th>
                <th className="border border-slate-200 px-3 py-2 text-left font-semibold">환불 가능 여부</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border border-slate-200 px-3 py-2">결제 후 서비스 이용 전</td>
                <td className="border border-slate-200 px-3 py-2 text-emerald-600 font-medium">전액 환불</td>
              </tr>
              <tr>
                <td className="border border-slate-200 px-3 py-2">이용 시작 후 7일 이내</td>
                <td className="border border-slate-200 px-3 py-2 text-amber-600 font-medium">이용일수 공제 후 환불</td>
              </tr>
              <tr>
                <td className="border border-slate-200 px-3 py-2">7일 경과</td>
                <td className="border border-slate-200 px-3 py-2 text-slate-400">당월 환불 불가, 다음 결제일 전 해지 가능</td>
              </tr>
            </tbody>
          </table>
          <p className="text-xs text-slate-400 mt-2">
            * 구독 해지는 마이페이지 또는 이메일(bgg8988@gmail.com)로 요청 가능합니다.
            해지 시 다음 결제일부터 과금이 중지되며, 당월 잔여 기간은 계속 이용 가능합니다.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-slate-800 mt-8 mb-3">3. 외주 개발 서비스</h2>
          <p className="font-medium text-slate-700">대상: 홈페이지 제작, 업무 자동화, 맞춤 개발 등</p>
          <table className="w-full text-sm border border-slate-200 mt-3">
            <thead>
              <tr className="bg-slate-50">
                <th className="border border-slate-200 px-3 py-2 text-left font-semibold">시점</th>
                <th className="border border-slate-200 px-3 py-2 text-left font-semibold">환불 가능 여부</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border border-slate-200 px-3 py-2">착수 전 (선금 결제 후 작업 시작 전)</td>
                <td className="border border-slate-200 px-3 py-2 text-emerald-600 font-medium">선금 전액 환불</td>
              </tr>
              <tr>
                <td className="border border-slate-200 px-3 py-2">작업 진행 중</td>
                <td className="border border-slate-200 px-3 py-2 text-amber-600 font-medium">진행률에 따른 부분 환불 (협의)</td>
              </tr>
              <tr>
                <td className="border border-slate-200 px-3 py-2">납품 완료 후</td>
                <td className="border border-slate-200 px-3 py-2 text-slate-400">환불 불가 (하자 보수는 별도)</td>
              </tr>
            </tbody>
          </table>
          <p className="text-xs text-slate-400 mt-2">
            * 외주 개발은 선금 50% / 잔금 50% 구조이며, 계약서에 명시된 조건을 우선합니다.
            <br />
            * 회사 귀책으로 납기 지연 시 1일당 계약금의 1%를 차감합니다.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-slate-800 mt-8 mb-3">4. 환불 신청 방법</h2>
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
            <ol className="list-decimal pl-5 space-y-2">
              <li>이메일(<strong>bgg8988@gmail.com</strong>)로 환불 요청
                <ul className="list-disc pl-5 mt-1 text-xs text-slate-500">
                  <li>제목: [환불 요청] 주문번호 또는 서비스명</li>
                  <li>본문: 성함, 결제일, 환불 사유</li>
                </ul>
              </li>
              <li>담당자 확인 후 <strong>영업일 기준 3일 이내</strong> 환불 처리</li>
              <li>환불 금액은 원래 결제 수단으로 환급 (카드 취소는 카드사에 따라 3~7영업일 소요)</li>
            </ol>
          </div>
        </section>

        <section>
          <h2 className="text-lg font-bold text-slate-800 mt-8 mb-3">5. 환불이 불가능한 경우</h2>
          <ul className="list-disc pl-5 space-y-1">
            <li>이용자의 단순 변심으로 디지털 콘텐츠를 이미 열람/다운로드한 경우</li>
            <li>서비스 이용 후 7일이 경과한 경우</li>
            <li>이용자의 과실로 서비스 이용이 불가능해진 경우</li>
            <li>관련 법령에 의해 환불이 제한되는 경우</li>
          </ul>
        </section>

        <section className="border-t border-slate-200 pt-6 mt-10">
          <p className="text-slate-400 text-xs">
            시행일자: 2025년 4월 7일<br />
            상호: 쟁승메이드 · 대표: 박재오 · 사업자등록번호: 267-53-00822<br />
            환불 문의: bgg8988@gmail.com · 010-3907-1392
          </p>
        </section>
      </div>
    </div>
  );
}
