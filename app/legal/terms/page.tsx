import { Metadata } from 'next';

export const metadata: Metadata = {
  title: '이용약관 | 쟁승메이드',
  description: '쟁승메이드 서비스 이용약관',
};

export default function TermsPage() {
  return (
    <div className="max-w-3xl mx-auto px-6 py-12">
      <h1 className="text-2xl font-extrabold text-[#04102b] mb-8">이용약관</h1>

      <div className="prose prose-sm prose-slate max-w-none space-y-6 text-slate-600 leading-relaxed">
        <section>
          <h2 className="text-lg font-bold text-slate-800 mt-8 mb-3">제1조 (목적)</h2>
          <p>
            본 약관은 쟁승메이드(이하 &quot;회사&quot;)가 운영하는 웹사이트(jaengseung-made.com)를 통해
            제공하는 서비스(이하 &quot;서비스&quot;)의 이용 조건 및 절차, 회사와 이용자의 권리·의무 및
            책임사항을 규정함을 목적으로 합니다.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-slate-800 mt-8 mb-3">제2조 (정의)</h2>
          <ol className="list-decimal pl-5 space-y-1">
            <li>&quot;서비스&quot;란 회사가 제공하는 웹 개발, AI 자동화, 프롬프트 엔지니어링, 사주 분석, 로또 번호 추천 등 각종 디지털 서비스를 말합니다.</li>
            <li>&quot;이용자&quot;란 본 약관에 따라 회사가 제공하는 서비스를 이용하는 회원 및 비회원을 말합니다.</li>
            <li>&quot;회원&quot;이란 회사에 개인정보를 제공하여 회원 등록을 한 자로서, 회사의 서비스를 지속적으로 이용할 수 있는 자를 말합니다.</li>
          </ol>
        </section>

        <section>
          <h2 className="text-lg font-bold text-slate-800 mt-8 mb-3">제3조 (약관의 효력 및 변경)</h2>
          <ol className="list-decimal pl-5 space-y-1">
            <li>본 약관은 서비스 화면에 게시하거나 기타의 방법으로 이용자에게 공지함으로써 효력이 발생합니다.</li>
            <li>회사는 관련 법령을 위반하지 않는 범위에서 본 약관을 변경할 수 있으며, 변경 시 적용일자 및 변경 사유를 명시하여 최소 7일 전 공지합니다.</li>
          </ol>
        </section>

        <section>
          <h2 className="text-lg font-bold text-slate-800 mt-8 mb-3">제4조 (서비스의 제공 및 변경)</h2>
          <ol className="list-decimal pl-5 space-y-1">
            <li>회사는 다음과 같은 서비스를 제공합니다.
              <ul className="list-disc pl-5 mt-1 space-y-0.5">
                <li>홈페이지 제작 서비스</li>
                <li>업무 자동화 개발 서비스</li>
                <li>프롬프트 엔지니어링 서비스</li>
                <li>AI 자동화 키트 구독 서비스</li>
                <li>AI 사주 분석 서비스</li>
                <li>로또 번호 추천 서비스</li>
                <li>주식 자동 매매 프로그램</li>
                <li>기타 회사가 추가 개발하거나 제휴를 통해 제공하는 서비스</li>
              </ul>
            </li>
            <li>회사는 서비스의 내용을 변경하는 경우 변경 사항을 사전에 공지합니다.</li>
          </ol>
        </section>

        <section>
          <h2 className="text-lg font-bold text-slate-800 mt-8 mb-3">제5조 (서비스의 중단)</h2>
          <p>
            회사는 컴퓨터 등 정보통신설비의 보수·점검, 교체 및 고장, 통신두절 또는 천재지변 등의 사유가
            발생한 경우 서비스의 제공을 일시적으로 중단할 수 있습니다. 이 경우 회사는 가능한 한 사전에 공지합니다.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-slate-800 mt-8 mb-3">제6조 (회원가입)</h2>
          <ol className="list-decimal pl-5 space-y-1">
            <li>이용자는 회사가 정한 가입 양식에 따라 회원 정보를 기입한 후 본 약관에 동의하여 회원 가입을 신청합니다.</li>
            <li>회사는 전항에 따른 회원 가입 신청에 대해 원칙적으로 승낙합니다. 다만, 다음 각 호에 해당하는 경우 거부할 수 있습니다.
              <ul className="list-disc pl-5 mt-1 space-y-0.5">
                <li>가입 신청자가 본 약관에 의해 이전에 회원 자격을 상실한 적이 있는 경우</li>
                <li>허위 정보를 기재한 경우</li>
                <li>기타 회사가 정한 이용신청 요건이 미비된 경우</li>
              </ul>
            </li>
          </ol>
        </section>

        <section>
          <h2 className="text-lg font-bold text-slate-800 mt-8 mb-3">제7조 (결제 및 요금)</h2>
          <ol className="list-decimal pl-5 space-y-1">
            <li>유료 서비스의 이용 요금은 해당 서비스 페이지에 명시된 금액을 따릅니다.</li>
            <li>결제는 신용카드, 간편결제(카카오페이, 네이버페이, 토스페이) 등 회사가 지원하는 수단으로 가능합니다.</li>
            <li>결제 완료 후에는 회사의 환불 정책에 따라 환불이 처리됩니다.</li>
          </ol>
        </section>

        <section>
          <h2 className="text-lg font-bold text-slate-800 mt-8 mb-3">제8조 (이용자의 의무)</h2>
          <ol className="list-decimal pl-5 space-y-1">
            <li>이용자는 서비스 이용 시 관련 법령, 본 약관, 이용 안내 등을 준수하여야 합니다.</li>
            <li>이용자는 다음 행위를 하여서는 안 됩니다.
              <ul className="list-disc pl-5 mt-1 space-y-0.5">
                <li>타인의 정보를 도용하는 행위</li>
                <li>회사의 서비스를 이용하여 얻은 정보를 무단으로 복제, 배포하는 행위</li>
                <li>회사 및 제3자의 지적 재산권을 침해하는 행위</li>
                <li>서비스의 안정적 운영을 방해하는 행위</li>
              </ul>
            </li>
          </ol>
        </section>

        <section>
          <h2 className="text-lg font-bold text-slate-800 mt-8 mb-3">제9조 (회사의 의무)</h2>
          <ol className="list-decimal pl-5 space-y-1">
            <li>회사는 관련 법령과 본 약관이 정하는 바에 따라 지속적이고 안정적으로 서비스를 제공하기 위해 노력합니다.</li>
            <li>회사는 이용자의 개인정보를 보호하기 위해 개인정보처리방침을 수립하고 이를 준수합니다.</li>
          </ol>
        </section>

        <section>
          <h2 className="text-lg font-bold text-slate-800 mt-8 mb-3">제10조 (면책조항)</h2>
          <ol className="list-decimal pl-5 space-y-1">
            <li>회사는 천재지변 또는 이에 준하는 불가항력으로 서비스를 제공할 수 없는 경우에는 책임이 면제됩니다.</li>
            <li>AI 기반 서비스(사주 분석, 로또 추천 등)는 참고 목적으로 제공되며, 서비스 결과에 대한 정확성을 보증하지 않습니다.</li>
            <li>이용자의 귀책사유로 인한 서비스 이용 장애에 대하여 회사는 책임을 지지 않습니다.</li>
          </ol>
        </section>

        <section>
          <h2 className="text-lg font-bold text-slate-800 mt-8 mb-3">제11조 (분쟁 해결)</h2>
          <p>
            본 약관에 관한 분쟁은 대한민국 법률을 준거법으로 하며, 서울중앙지방법원을 관할법원으로 합니다.
          </p>
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
