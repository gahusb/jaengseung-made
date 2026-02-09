import ContactForm from './components/ContactForm';

export default function Home() {
  return (
    <div className="min-h-screen">
      {/* Navigation */}
      <nav className="fixed top-0 w-full bg-white/90 backdrop-blur-sm z-50 border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="text-2xl font-bold text-blue-900">쟁승메이드</div>
            <div className="hidden md:flex space-x-8">
              <a href="#services" className="text-gray-700 hover:text-blue-700 transition">서비스</a>
              <a href="#portfolio" className="text-gray-700 hover:text-blue-700 transition">포트폴리오</a>
              <a href="#about" className="text-gray-700 hover:text-blue-700 transition">소개</a>
              <a href="#contact" className="bg-blue-700 text-white px-6 py-2 rounded-lg hover:bg-blue-800 transition">문의하기</a>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 bg-gradient-to-br from-blue-50 via-white to-emerald-50">
        <div className="max-w-7xl mx-auto text-center">
          <div className="inline-block mb-4 px-4 py-2 bg-blue-100 text-blue-700 rounded-full text-sm font-semibold">
            🤖 RPA 자동화 전문
          </div>
          <h1 className="text-5xl md:text-7xl font-bold text-gray-900 mb-6 leading-tight">
            반복 업무를 <span className="text-blue-700">자동화</span>하고<br />
            생산성을 <span className="text-emerald-600">극대화</span>하세요
          </h1>
          <p className="text-xl text-gray-600 mb-10 max-w-3xl mx-auto leading-relaxed">
            대기업 출신 개발자가 제공하는 RPA 자동화, 웹/앱 개발 솔루션.<br />
            엑셀 자동화부터 복잡한 업무 프로세스까지, 비즈니스 성장을 가속화합니다.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="#contact" className="bg-blue-700 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-blue-800 transition shadow-lg">
              무료 상담 신청
            </a>
            <a href="#services" className="border-2 border-blue-700 text-blue-700 px-8 py-4 rounded-lg text-lg font-semibold hover:bg-blue-50 transition">
              서비스 둘러보기
            </a>
          </div>

          <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
            <div>
              <div className="text-4xl font-bold text-blue-700">100+</div>
              <div className="text-gray-600 mt-2">프로젝트 경험</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-blue-700">24h</div>
              <div className="text-gray-600 mt-2">평균 응답 시간</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-blue-700">98%</div>
              <div className="text-gray-600 mt-2">고객 만족도</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-blue-700">5년+</div>
              <div className="text-gray-600 mt-2">개발 경력</div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-20 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">제공 서비스</h2>
            <p className="text-xl text-gray-600">비즈니스 목표에 맞는 맞춤형 솔루션을 제공합니다</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* RPA 자동화 - Featured */}
            <div className="relative bg-gradient-to-br from-blue-700 to-blue-900 rounded-2xl p-8 text-white shadow-2xl transform hover:scale-105 transition">
              <div className="absolute -top-4 -right-4 bg-emerald-500 text-white px-4 py-2 rounded-full text-sm font-bold">
                추천
              </div>
              <div className="text-5xl mb-4">🤖</div>
              <h3 className="text-2xl font-bold mb-3">RPA 자동화</h3>
              <p className="text-blue-100 mb-6">
                반복적인 업무를 자동화하여 시간과 비용을 절감하세요
              </p>
              <div className="space-y-3 mb-6">
                <div className="flex items-center">
                  <span className="mr-2">✓</span> 엑셀/데이터 자동화
                </div>
                <div className="flex items-center">
                  <span className="mr-2">✓</span> 웹 스크래핑
                </div>
                <div className="flex items-center">
                  <span className="mr-2">✓</span> 업무 프로세스 자동화
                </div>
                <div className="flex items-center">
                  <span className="mr-2">✓</span> 데이터 수집/처리
                </div>
              </div>
              <div className="border-t border-blue-600 pt-4">
                <div className="text-3xl font-bold mb-2">50만원~</div>
                <div className="text-blue-200 text-sm">프로젝트 규모에 따라 상이</div>
              </div>
            </div>

            {/* 웹 개발 */}
            <div className="bg-white border-2 border-gray-200 rounded-2xl p-8 hover:border-blue-500 hover:shadow-xl transition">
              <div className="text-5xl mb-4">💻</div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">웹 개발</h3>
              <p className="text-gray-600 mb-6">
                현대적이고 반응형인 웹사이트/웹앱을 구축합니다
              </p>
              <div className="space-y-3 mb-6 text-gray-700">
                <div className="flex items-center">
                  <span className="mr-2">✓</span> 랜딩 페이지
                </div>
                <div className="flex items-center">
                  <span className="mr-2">✓</span> 기업 홈페이지
                </div>
                <div className="flex items-center">
                  <span className="mr-2">✓</span> 관리자 대시보드
                </div>
                <div className="flex items-center">
                  <span className="mr-2">✓</span> E-Commerce
                </div>
              </div>
              <div className="border-t border-gray-200 pt-4">
                <div className="text-3xl font-bold text-gray-900 mb-2">200만원~</div>
                <div className="text-gray-500 text-sm">기능에 따라 상이</div>
              </div>
            </div>

            {/* 앱 개발 */}
            <div className="bg-white border-2 border-gray-200 rounded-2xl p-8 hover:border-blue-500 hover:shadow-xl transition">
              <div className="text-5xl mb-4">📱</div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">앱 개발</h3>
              <p className="text-gray-600 mb-6">
                iOS/Android 크로스 플랫폼 앱을 개발합니다
              </p>
              <div className="space-y-3 mb-6 text-gray-700">
                <div className="flex items-center">
                  <span className="mr-2">✓</span> 모바일 앱
                </div>
                <div className="flex items-center">
                  <span className="mr-2">✓</span> 하이브리드 앱
                </div>
                <div className="flex items-center">
                  <span className="mr-2">✓</span> 업무용 앱
                </div>
                <div className="flex items-center">
                  <span className="mr-2">✓</span> 커스텀 기능
                </div>
              </div>
              <div className="border-t border-gray-200 pt-4">
                <div className="text-3xl font-bold text-gray-900 mb-2">300만원~</div>
                <div className="text-gray-500 text-sm">복잡도에 따라 상이</div>
              </div>
            </div>
          </div>

          {/* Custom Solution */}
          <div className="mt-12 bg-gradient-to-r from-gray-50 to-blue-50 rounded-2xl p-8 border border-gray-200">
            <div className="flex flex-col md:flex-row items-center justify-between">
              <div className="mb-4 md:mb-0">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">🔧 맞춤형 솔루션</h3>
                <p className="text-gray-600">특별한 요구사항이 있으신가요? 무엇이든 상담해주세요.</p>
              </div>
              <a href="#contact" className="bg-gray-900 text-white px-8 py-3 rounded-lg font-semibold hover:bg-gray-800 transition whitespace-nowrap">
                견적 문의
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Portfolio Section */}
      <section id="portfolio" className="py-20 px-4 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">프로젝트 포트폴리오</h2>
            <p className="text-xl text-gray-600">실제 구현한 프로젝트를 확인해보세요</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Portfolio Item 1 - Excel Merger RPA */}
            <a
              href="https://gitea.gahusb.synology.me/gahusb/excel-merge-rpa"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition block"
            >
              <div className="bg-gradient-to-br from-blue-500 to-blue-700 h-48 flex items-center justify-center">
                <div className="text-white text-6xl">📊</div>
              </div>
              <div className="p-6">
                <div className="text-sm text-blue-700 font-semibold mb-2">RPA 자동화</div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">엑셀 데이터 통합 자동화</h3>
                <p className="text-gray-600 mb-4">
                  여러 엑셀 파일을 클릭 한 번으로 자동 통합. 5시간 → 10초로 단축
                </p>
                <div className="flex flex-wrap gap-2 mb-3">
                  <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">Python</span>
                  <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">Pandas</span>
                  <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">Openpyxl</span>
                </div>
                <div className="text-blue-600 text-sm font-semibold flex items-center">
                  <span className="mr-1">→</span> GitHub에서 보기
                </div>
              </div>
            </a>

            {/* Portfolio Item 2 */}
            <div className="bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition">
              <div className="bg-gradient-to-br from-emerald-500 to-emerald-700 h-48 flex items-center justify-center">
                <div className="text-white text-6xl">🌐</div>
              </div>
              <div className="p-6">
                <div className="text-sm text-emerald-700 font-semibold mb-2">웹 개발</div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">기업 홈페이지 제작</h3>
                <p className="text-gray-600 mb-4">
                  반응형 디자인과 SEO 최적화로 방문자 200% 증가
                </p>
                <div className="flex flex-wrap gap-2">
                  <span className="px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-sm">Next.js</span>
                  <span className="px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-sm">React</span>
                  <span className="px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-sm">Tailwind</span>
                </div>
              </div>
            </div>

            {/* Portfolio Item 3 - Gmail Automation */}
            <a
              href="https://gitea.gahusb.synology.me/gahusb/gmail-automation-rpa"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition block"
            >
              <div className="bg-gradient-to-br from-purple-500 to-purple-700 h-48 flex items-center justify-center">
                <div className="text-white text-6xl">📧</div>
              </div>
              <div className="p-6">
                <div className="text-sm text-purple-700 font-semibold mb-2">RPA 자동화</div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Gmail 이메일 자동화</h3>
                <p className="text-gray-600 mb-4">
                  Gmail API로 이메일 자동 분류/답장. 업무 효율 150% 증가
                </p>
                <div className="flex flex-wrap gap-2 mb-3">
                  <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm">Python</span>
                  <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm">Gmail API</span>
                  <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm">OAuth</span>
                </div>
                <div className="text-purple-600 text-sm font-semibold flex items-center">
                  <span className="mr-1">→</span> GitHub에서 보기
                </div>
              </div>
            </a>
          </div>

          <div className="text-center mt-12">
            <p className="text-gray-600 mb-4">더 많은 프로젝트는 GitHub에서 확인하세요</p>
            <a href="#contact" className="inline-block border-2 border-blue-700 text-blue-700 px-8 py-3 rounded-lg font-semibold hover:bg-blue-50 transition">
              전체 포트폴리오 보기
            </a>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-20 px-4 bg-slate-900 text-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl md:text-5xl font-bold mb-6">신뢰할 수 있는<br />전문 개발자</h2>
              <p className="text-xl text-gray-300 mb-8 leading-relaxed">
                대기업에서 쌓은 5년 이상의 실무 경험을 바탕으로,
                고품질의 비즈니스 솔루션을 제공합니다.
                단순한 개발이 아닌, 비즈니스 성장을 위한 파트너가 되겠습니다.
              </p>
              <div className="space-y-4">
                <div className="flex items-start">
                  <div className="text-2xl mr-4">🏢</div>
                  <div>
                    <div className="font-bold text-lg">대기업 개발자 출신</div>
                    <div className="text-gray-400">검증된 개발 역량과 프로젝트 관리 능력</div>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="text-2xl mr-4">⚡</div>
                  <div>
                    <div className="font-bold text-lg">빠른 커뮤니케이션</div>
                    <div className="text-gray-400">평균 24시간 이내 응답, 실시간 진행상황 공유</div>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="text-2xl mr-4">🎯</div>
                  <div>
                    <div className="font-bold text-lg">결과 중심</div>
                    <div className="text-gray-400">고객의 ROI를 최우선으로 생각하는 솔루션 제공</div>
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-slate-800 rounded-2xl p-8">
              <h3 className="text-2xl font-bold mb-6">기술 스택</h3>
              <div className="space-y-6">
                <div>
                  <div className="text-sm text-gray-400 mb-2">Backend</div>
                  <div className="flex flex-wrap gap-2">
                    <span className="px-4 py-2 bg-blue-900 rounded-lg">Python</span>
                    <span className="px-4 py-2 bg-blue-900 rounded-lg">Node.js</span>
                    <span className="px-4 py-2 bg-blue-900 rounded-lg">Java</span>
                    <span className="px-4 py-2 bg-blue-900 rounded-lg">C/C++/C#</span>
                  </div>
                </div>
                <div>
                  <div className="text-sm text-gray-400 mb-2">Frontend</div>
                  <div className="flex flex-wrap gap-2">
                    <span className="px-4 py-2 bg-blue-900 rounded-lg">React</span>
                    <span className="px-4 py-2 bg-blue-900 rounded-lg">Next.js</span>
                    <span className="px-4 py-2 bg-blue-900 rounded-lg">TypeScript</span>
                  </div>
                </div>
                <div>
                  <div className="text-sm text-gray-400 mb-2">RPA & Automation</div>
                  <div className="flex flex-wrap gap-2">
                    <span className="px-4 py-2 bg-emerald-900 rounded-lg">Selenium</span>
                    <span className="px-4 py-2 bg-emerald-900 rounded-lg">Pandas</span>
                    <span className="px-4 py-2 bg-emerald-900 rounded-lg">Playwright</span>
                    <span className="px-4 py-2 bg-emerald-900 rounded-lg">RPA</span>
                  </div>
                </div>
                <div>
                  <div className="text-sm text-gray-400 mb-2">Database & Cloud</div>
                  <div className="flex flex-wrap gap-2">
                    <span className="px-4 py-2 bg-blue-900 rounded-lg">PostgreSQL</span>
                    <span className="px-4 py-2 bg-blue-900 rounded-lg">MongoDB</span>
                    <span className="px-4 py-2 bg-blue-900 rounded-lg">AWS</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-20 px-4 bg-gradient-to-br from-blue-50 to-emerald-50">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">프로젝트 문의</h2>
            <p className="text-xl text-gray-600">무엇이든 편하게 상담해주세요. 24시간 이내 답변드립니다.</p>
          </div>

          <ContactForm />
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-white py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="text-2xl font-bold mb-4">쟁승메이드</div>
              <p className="text-gray-400">비즈니스 성장을 위한<br />전문 개발 솔루션</p>
            </div>
            <div>
              <h4 className="font-bold mb-4">서비스</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#services" className="hover:text-white transition">RPA 자동화</a></li>
                <li><a href="#services" className="hover:text-white transition">웹 개발</a></li>
                <li><a href="#services" className="hover:text-white transition">앱 개발</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4">포트폴리오</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#portfolio" className="hover:text-white transition">프로젝트</a></li>
                <li><a href="#about" className="hover:text-white transition">기술 스택</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4">문의</h4>
              <ul className="space-y-2 text-gray-400">
                <li>bgg8988@gmail.com</li>
                <li>010-3907-1392</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-8 text-center text-gray-400">
            <p>&copy; 2025 쟁승메이드. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
