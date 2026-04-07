import { Metadata } from 'next';

export const metadata: Metadata = {
  title: '개인정보처리방침 | 쟁승메이드',
  description: '쟁승메이드 개인정보처리방침',
};

export default function PrivacyPage() {
  return (
    <div className="max-w-3xl mx-auto px-6 py-12">
      <h1 className="text-2xl font-extrabold text-[#04102b] mb-8">개인정보처리방침</h1>

      <div className="prose prose-sm prose-slate max-w-none space-y-6 text-slate-600 leading-relaxed">
        <p>
          쟁승메이드(이하 &quot;회사&quot;)는 개인정보보호법 등 관련 법령을 준수하며,
          이용자의 개인정보를 보호하기 위해 다음과 같은 개인정보처리방침을 수립·공개합니다.
        </p>

        <section>
          <h2 className="text-lg font-bold text-slate-800 mt-8 mb-3">1. 수집하는 개인정보 항목</h2>
          <p>회사는 서비스 제공을 위해 다음의 개인정보를 수집합니다.</p>
          <table className="w-full text-sm border border-slate-200 mt-3">
            <thead>
              <tr className="bg-slate-50">
                <th className="border border-slate-200 px-3 py-2 text-left font-semibold">수집 시점</th>
                <th className="border border-slate-200 px-3 py-2 text-left font-semibold">수집 항목</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border border-slate-200 px-3 py-2">회원가입</td>
                <td className="border border-slate-200 px-3 py-2">이메일, 이름(닉네임)</td>
              </tr>
              <tr>
                <td className="border border-slate-200 px-3 py-2">문의 접수</td>
                <td className="border border-slate-200 px-3 py-2">이름, 이메일, 연락처, 문의 내용</td>
              </tr>
              <tr>
                <td className="border border-slate-200 px-3 py-2">유료 결제</td>
                <td className="border border-slate-200 px-3 py-2">결제 수단 정보(PG사를 통해 처리, 회사 직접 저장하지 않음)</td>
              </tr>
              <tr>
                <td className="border border-slate-200 px-3 py-2">사주 분석</td>
                <td className="border border-slate-200 px-3 py-2">생년월일, 출생시간, 성별</td>
              </tr>
              <tr>
                <td className="border border-slate-200 px-3 py-2">자동 수집</td>
                <td className="border border-slate-200 px-3 py-2">접속 IP, 브라우저 종류, 접속 일시, 쿠키</td>
              </tr>
            </tbody>
          </table>
        </section>

        <section>
          <h2 className="text-lg font-bold text-slate-800 mt-8 mb-3">2. 개인정보의 수집·이용 목적</h2>
          <ul className="list-disc pl-5 space-y-1">
            <li>서비스 제공 및 계약 이행: 문의 응대, 서비스 제공, 결제 처리</li>
            <li>회원 관리: 회원 식별, 본인 확인, 서비스 이용 내역 관리</li>
            <li>서비스 개선: 접속 통계, 이용 패턴 분석을 통한 서비스 개선</li>
            <li>마케팅·홍보: 신규 서비스 안내, 이벤트 정보 제공 (별도 동의 시)</li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-bold text-slate-800 mt-8 mb-3">3. 개인정보의 보유 및 이용 기간</h2>
          <ul className="list-disc pl-5 space-y-1">
            <li>회원 정보: 회원 탈퇴 시까지 (탈퇴 후 즉시 파기)</li>
            <li>문의 내역: 문의 처리 완료 후 3년 (전자상거래법)</li>
            <li>결제 기록: 5년 (전자상거래법)</li>
            <li>접속 로그: 3개월 (통신비밀보호법)</li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-bold text-slate-800 mt-8 mb-3">4. 개인정보의 제3자 제공</h2>
          <p>
            회사는 이용자의 동의 없이 개인정보를 제3자에게 제공하지 않습니다.
            다만, 다음의 경우는 예외로 합니다.
          </p>
          <ul className="list-disc pl-5 space-y-1">
            <li>이용자가 사전에 동의한 경우</li>
            <li>법령에 의해 요구되는 경우</li>
            <li>결제 처리를 위해 PG사(포트원, 한국결제네트웍스 등)에 필요 최소 정보 전달</li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-bold text-slate-800 mt-8 mb-3">5. 개인정보의 처리 위탁</h2>
          <table className="w-full text-sm border border-slate-200 mt-3">
            <thead>
              <tr className="bg-slate-50">
                <th className="border border-slate-200 px-3 py-2 text-left font-semibold">수탁업체</th>
                <th className="border border-slate-200 px-3 py-2 text-left font-semibold">위탁 업무</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border border-slate-200 px-3 py-2">포트원(주)</td>
                <td className="border border-slate-200 px-3 py-2">전자결제 처리</td>
              </tr>
              <tr>
                <td className="border border-slate-200 px-3 py-2">Supabase Inc.</td>
                <td className="border border-slate-200 px-3 py-2">회원 인증 및 데이터 저장</td>
              </tr>
              <tr>
                <td className="border border-slate-200 px-3 py-2">Vercel Inc.</td>
                <td className="border border-slate-200 px-3 py-2">웹사이트 호스팅</td>
              </tr>
              <tr>
                <td className="border border-slate-200 px-3 py-2">Resend Inc.</td>
                <td className="border border-slate-200 px-3 py-2">이메일 발송</td>
              </tr>
            </tbody>
          </table>
        </section>

        <section>
          <h2 className="text-lg font-bold text-slate-800 mt-8 mb-3">6. 개인정보의 파기 절차 및 방법</h2>
          <ul className="list-disc pl-5 space-y-1">
            <li>파기 절차: 보유 기간 경과 또는 처리 목적 달성 시 지체 없이 파기</li>
            <li>파기 방법: 전자적 파일은 복구 불가능한 방법으로 삭제, 종이 문서는 분쇄 또는 소각</li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-bold text-slate-800 mt-8 mb-3">7. 이용자의 권리</h2>
          <p>이용자는 언제든지 다음의 권리를 행사할 수 있습니다.</p>
          <ul className="list-disc pl-5 space-y-1">
            <li>개인정보 열람 요구</li>
            <li>개인정보 정정·삭제 요구</li>
            <li>개인정보 처리 정지 요구</li>
            <li>회원 탈퇴 (마이페이지 또는 이메일 요청)</li>
          </ul>
          <p className="mt-2">
            위 요청은 이메일(bgg8988@gmail.com)로 접수하면 10일 이내에 처리합니다.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-slate-800 mt-8 mb-3">8. 쿠키(Cookie) 운용</h2>
          <p>
            회사는 서비스 이용 분석을 위해 Google Analytics를 사용하며, 이 과정에서 쿠키가 설치됩니다.
            이용자는 브라우저 설정을 통해 쿠키 저장을 거부할 수 있으나, 일부 서비스 이용이 제한될 수 있습니다.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-slate-800 mt-8 mb-3">9. 개인정보 보호책임자</h2>
          <ul className="list-none space-y-0.5">
            <li>성명: 박재오</li>
            <li>직위: 대표</li>
            <li>이메일: bgg8988@gmail.com</li>
            <li>전화: 010-3907-1392</li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-bold text-slate-800 mt-8 mb-3">10. 개인정보 침해 구제</h2>
          <p>개인정보 침해에 대한 신고·상담은 아래 기관에 문의하실 수 있습니다.</p>
          <ul className="list-disc pl-5 space-y-1">
            <li>개인정보분쟁조정위원회: 1833-6972 (kopico.go.kr)</li>
            <li>개인정보침해신고센터: 118 (privacy.kisa.or.kr)</li>
            <li>대검찰청 사이버수사과: 1301 (spo.go.kr)</li>
            <li>경찰청 사이버수사국: 182 (ecrm.cyber.go.kr)</li>
          </ul>
        </section>

        <section className="border-t border-slate-200 pt-6 mt-10">
          <p className="text-slate-400 text-xs">
            시행일자: 2025년 4월 7일<br />
            상호: 쟁승메이드 · 대표: 박재오 · 사업자등록번호: 267-53-00822
          </p>
        </section>
      </div>
    </div>
  );
}
