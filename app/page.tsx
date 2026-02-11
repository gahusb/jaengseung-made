import ContactForm from './components/ContactForm';

export default function Home() {
  return (
    <div className="min-h-screen">
      {/* Enhanced Navigation */}
      <nav className="fixed top-0 w-full bg-white/95 backdrop-blur-md z-50 border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="text-2xl font-bold text-blue-900">쟁승메이드</div>
            <div className="hidden lg:flex space-x-6 items-center">
              <a href="#services" className="text-gray-700 hover:text-blue-700 transition font-medium">서비스</a>
              <a href="#pricing" className="text-gray-700 hover:text-blue-700 transition font-medium">비용안내</a>
              <a href="#tech" className="text-gray-700 hover:text-blue-700 transition font-medium">기술소개</a>
              <a href="#quote" className="text-gray-700 hover:text-blue-700 transition font-medium">자동견적</a>
              <a href="#portfolio" className="text-gray-700 hover:text-blue-700 transition font-medium">포트폴리오</a>
              <a href="#faq" className="text-gray-700 hover:text-blue-700 transition font-medium">FAQ</a>
              <a href="#contact" className="bg-blue-700 text-white px-6 py-2 rounded-lg hover:bg-blue-800 transition font-semibold shadow-md">
                무료 상담
              </a>
            </div>
            {/* Mobile menu button */}
            <div className="lg:hidden">
              <button className="text-gray-700 hover:text-blue-700">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section - Enhanced */}
      <section className="pt-32 pb-20 px-4 bg-gradient-to-br from-blue-50 via-white to-emerald-50">
        <div className="max-w-7xl mx-auto text-center">
          <div className="inline-block mb-4 px-4 py-2 bg-blue-100 text-blue-700 rounded-full text-sm font-semibold animate-pulse">
            🤖 대기업 출신 개발자의 RPA 자동화 전문
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
            <a href="#contact" className="bg-blue-700 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-blue-800 transition shadow-lg hover:shadow-xl">
              무료 상담 신청
            </a>
            <a href="#services" className="border-2 border-blue-700 text-blue-700 px-8 py-4 rounded-lg text-lg font-semibold hover:bg-blue-50 transition">
              서비스 둘러보기
            </a>
          </div>

          <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
            <div className="transform hover:scale-105 transition">
              <div className="text-4xl font-bold text-blue-700">100+</div>
              <div className="text-gray-600 mt-2">프로젝트 경험</div>
            </div>
            <div className="transform hover:scale-105 transition">
              <div className="text-4xl font-bold text-blue-700">24h</div>
              <div className="text-gray-600 mt-2">평균 응답 시간</div>
            </div>
            <div className="transform hover:scale-105 transition">
              <div className="text-4xl font-bold text-blue-700">98%</div>
              <div className="text-gray-600 mt-2">고객 만족도</div>
            </div>
            <div className="transform hover:scale-105 transition">
              <div className="text-4xl font-bold text-blue-700">5년+</div>
              <div className="text-gray-600 mt-2">개발 경력</div>
            </div>
          </div>
        </div>
      </section>

      {/* 이런 걱정 하고 계셨나요? */}
      <section className="py-20 px-4 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">이런 걱정 하고 계셨나요?</h2>
            <p className="text-xl text-gray-600">많은 고객들이 같은 고민을 하셨습니다</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition">
              <div className="text-4xl mb-4">😰</div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">외주 업체를 못 믿겠어요</h3>
              <p className="text-gray-600 mb-4">
                "프로젝트 맡겼는데 연락 두절... 이런 경험 다시는 하기 싫어요."
              </p>
              <div className="text-blue-700 font-semibold">
                ✓ 대기업 출신 검증된 개발자<br />
                ✓ 실시간 진행상황 공유<br />
                ✓ 투명한 커뮤니케이션
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition">
              <div className="text-4xl mb-4">💸</div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">비용이 너무 비싸요</h3>
              <p className="text-gray-600 mb-4">
                "대형 업체는 견적이 수천만원... 중소기업 예산으로는 불가능해요."
              </p>
              <div className="text-blue-700 font-semibold">
                ✓ 합리적인 가격<br />
                ✓ 불필요한 중간 마진 없음<br />
                ✓ 분할 납부 가능
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition">
              <div className="text-4xl mb-4">⏰</div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">프로젝트가 너무 오래 걸려요</h3>
              <p className="text-gray-600 mb-4">
                "6개월 걸린다고 했는데 1년 넘게... 언제 완성될지 모르겠어요."
              </p>
              <div className="text-blue-700 font-semibold">
                ✓ 명확한 일정 제시<br />
                ✓ 단계별 검수 및 피드백<br />
                ✓ 신속한 개발 프로세스
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition">
              <div className="text-4xl mb-4">🤔</div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">기술을 잘 몰라요</h3>
              <p className="text-gray-600 mb-4">
                "개발 용어가 너무 어려워요. 무엇을 요구해야 할지 모르겠어요."
              </p>
              <div className="text-blue-700 font-semibold">
                ✓ 쉬운 언어로 설명<br />
                ✓ 요구사항 정리 도움<br />
                ✓ 최적의 솔루션 제안
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition">
              <div className="text-4xl mb-4">🔧</div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">완성 후 유지보수가 걱정돼요</h3>
              <p className="text-gray-600 mb-4">
                "프로젝트 끝나면 연락 안 돼요. 오류 나면 어떻게 하죠?"
              </p>
              <div className="text-blue-700 font-semibold">
                ✓ 1개월 무상 기술지원<br />
                ✓ 평생 유지보수 가능<br />
                ✓ 빠른 응대 (24시간 이내)
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition">
              <div className="text-4xl mb-4">📝</div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">계약이 복잡해요</h3>
              <p className="text-gray-600 mb-4">
                "계약서 조항이 너무 많고 어려워요. 불리한 조건은 없을까요?"
              </p>
              <div className="text-blue-700 font-semibold">
                ✓ 명확하고 간단한 계약서<br />
                ✓ 공정한 계약 조건<br />
                ✓ 지적재산권 고객 이전
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 차별점 */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">쟁승메이드는 다릅니다</h2>
            <p className="text-xl text-gray-600">대형 업체도, 작은 외주도 아닌, 전문가의 1:1 맞춤 서비스</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center p-8 bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl">
              <div className="text-6xl mb-4">🎯</div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">대기업 퀄리티</h3>
              <p className="text-gray-700 leading-relaxed">
                5년 이상 대기업에서 검증된 개발 프로세스와 코드 품질을 그대로 적용합니다.
                엔터프라이즈급 품질을 합리적인 가격에 경험하세요.
              </p>
            </div>

            <div className="text-center p-8 bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-2xl">
              <div className="text-6xl mb-4">⚡</div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">스타트업 속도</h3>
              <p className="text-gray-700 leading-relaxed">
                불필요한 회의와 절차 없이, 빠르게 개발하고 배포합니다.
                MVP부터 완제품까지, 시장 진입 속도를 최대한 단축합니다.
              </p>
            </div>

            <div className="text-center p-8 bg-gradient-to-br from-purple-50 to-purple-100 rounded-2xl">
              <div className="text-6xl mb-4">💡</div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">컨설팅 마인드</h3>
              <p className="text-gray-700 leading-relaxed">
                단순 개발이 아닌, 비즈니스 성과를 위한 솔루션을 제안합니다.
                ROI를 최대화하는 최적의 기술 스택과 아키텍처를 선택합니다.
              </p>
            </div>
          </div>

          {/* 비교표 */}
          <div className="mt-16 overflow-x-auto">
            <table className="w-full bg-white rounded-xl overflow-hidden shadow-lg">
              <thead>
                <tr className="bg-gradient-to-r from-blue-600 to-blue-800 text-white">
                  <th className="py-4 px-6 text-left">비교 항목</th>
                  <th className="py-4 px-6 text-center">대형 외주업체</th>
                  <th className="py-4 px-6 text-center">작은 외주</th>
                  <th className="py-4 px-6 text-center bg-emerald-600">쟁승메이드</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                <tr className="hover:bg-gray-50">
                  <td className="py-4 px-6 font-semibold">가격</td>
                  <td className="py-4 px-6 text-center">💰💰💰</td>
                  <td className="py-4 px-6 text-center">💰</td>
                  <td className="py-4 px-6 text-center text-emerald-700 font-bold">💰💰 합리적</td>
                </tr>
                <tr className="hover:bg-gray-50">
                  <td className="py-4 px-6 font-semibold">품질</td>
                  <td className="py-4 px-6 text-center">⭐⭐⭐⭐⭐</td>
                  <td className="py-4 px-6 text-center">⭐⭐⭐</td>
                  <td className="py-4 px-6 text-center text-emerald-700 font-bold">⭐⭐⭐⭐⭐</td>
                </tr>
                <tr className="hover:bg-gray-50">
                  <td className="py-4 px-6 font-semibold">개발 속도</td>
                  <td className="py-4 px-6 text-center">🐢 느림</td>
                  <td className="py-4 px-6 text-center">⚡ 빠름</td>
                  <td className="py-4 px-6 text-center text-emerald-700 font-bold">⚡⚡ 매우 빠름</td>
                </tr>
                <tr className="hover:bg-gray-50">
                  <td className="py-4 px-6 font-semibold">커뮤니케이션</td>
                  <td className="py-4 px-6 text-center">😐 보통</td>
                  <td className="py-4 px-6 text-center">😕 느림</td>
                  <td className="py-4 px-6 text-center text-emerald-700 font-bold">😊 실시간</td>
                </tr>
                <tr className="hover:bg-gray-50">
                  <td className="py-4 px-6 font-semibold">유지보수</td>
                  <td className="py-4 px-6 text-center">✓ 계약 시</td>
                  <td className="py-4 px-6 text-center">❌ 어려움</td>
                  <td className="py-4 px-6 text-center text-emerald-700 font-bold">✓ 평생 가능</td>
                </tr>
                <tr className="hover:bg-gray-50">
                  <td className="py-4 px-6 font-semibold">맞춤 개발</td>
                  <td className="py-4 px-6 text-center">△ 제한적</td>
                  <td className="py-4 px-6 text-center">✓ 가능</td>
                  <td className="py-4 px-6 text-center text-emerald-700 font-bold">✓✓ 완전 맞춤</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* MY STORY */}
      <section className="py-20 px-4 bg-gradient-to-br from-slate-900 to-blue-900 text-white">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">MY STORY</h2>
            <p className="text-xl text-blue-200">왜 쟁승메이드를 시작했을까요?</p>
          </div>

          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 md:p-12">
            <div className="space-y-6 text-lg leading-relaxed">
              <p className="text-blue-100">
                <span className="text-2xl font-bold text-white">"</span>
                대기업 개발자로 5년간 일하면서 수백 개의 프로젝트를 진행했습니다.
                하지만 항상 아쉬웠던 점이 있었습니다.
              </p>

              <p className="text-blue-100">
                중소기업과 소상공인 분들은 <span className="text-yellow-300 font-bold">합리적인 가격에 좋은 개발자를 만나기 어렵다</span>는 것.
                대형 외주업체는 너무 비싸고, 작은 업체는 품질이 불안정했습니다.
              </p>

              <p className="text-blue-100">
                반복 업무에 시달리며 <span className="text-yellow-300 font-bold">"이걸 자동화할 수 있는데..."</span> 하고 생각하시는 분들.
                웹사이트가 필요한데 <span className="text-yellow-300 font-bold">수천만원 견적</span>에 포기하시는 분들.
              </p>

              <p className="text-white font-bold text-xl">
                이런 분들을 위해 쟁승메이드를 시작했습니다.
              </p>

              <p className="text-blue-100">
                대기업에서 쌓은 노하우와 품질은 그대로,
                불필요한 비용은 없애고 <span className="text-emerald-300 font-bold">정말 필요한 가치</span>만 제공합니다.
              </p>

              <p className="text-blue-100">
                단순한 외주가 아닌, <span className="text-emerald-300 font-bold">비즈니스 성장을 함께 고민하는 파트너</span>가 되고 싶습니다.
                <span className="text-2xl font-bold text-white">"</span>
              </p>
            </div>

            <div className="mt-8 pt-8 border-t border-white/20">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-2xl font-bold">박재오 (쟁승메이드 대표)</div>
                  <div className="text-blue-200">대기업 출신 풀스택 개발자</div>
                </div>
                <div className="text-6xl">👨‍💻</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* HOW WE WORK - 이렇게 진행됩니다 */}
      <section className="py-20 px-4 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">이렇게 진행됩니다</h2>
            <p className="text-xl text-gray-600">투명하고 체계적인 프로세스로 프로젝트를 진행합니다</p>
          </div>

          <div className="relative">
            {/* Timeline line */}
            <div className="hidden md:block absolute left-1/2 transform -translate-x-1/2 h-full w-1 bg-blue-200"></div>

            <div className="space-y-12">
              {/* Step 1 */}
              <div className="relative grid md:grid-cols-2 gap-8 items-center">
                <div className="md:text-right">
                  <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition">
                    <div className="text-blue-700 font-bold mb-2">STEP 1</div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-3">무료 상담 및 요구사항 분석</h3>
                    <p className="text-gray-600 mb-4">
                      전화, 이메일, 화상회의를 통해 프로젝트 목표와 요구사항을 상세히 분석합니다.
                      현재 업무 프로세스를 파악하고 최적의 솔루션을 제안합니다.
                    </p>
                    <div className="text-sm text-blue-700 font-semibold">
                      ⏱️ 소요 시간: 1~2일
                    </div>
                  </div>
                </div>
                <div className="flex justify-center md:justify-start">
                  <div className="w-16 h-16 bg-blue-600 text-white rounded-full flex items-center justify-center text-3xl font-bold shadow-lg z-10">
                    1
                  </div>
                </div>
              </div>

              {/* Step 2 */}
              <div className="relative grid md:grid-cols-2 gap-8 items-center">
                <div className="md:col-start-2">
                  <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition">
                    <div className="text-blue-700 font-bold mb-2">STEP 2</div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-3">견적서 및 제안서 전달</h3>
                    <p className="text-gray-600 mb-4">
                      상세한 개발 범위, 일정, 비용이 포함된 견적서를 제공합니다.
                      기술 스택, 구현 방법, 기대 효과를 명확하게 설명합니다.
                    </p>
                    <div className="text-sm text-blue-700 font-semibold">
                      ⏱️ 소요 시간: 1~3일
                    </div>
                  </div>
                </div>
                <div className="flex justify-center md:justify-end md:col-start-1 md:row-start-1">
                  <div className="w-16 h-16 bg-blue-600 text-white rounded-full flex items-center justify-center text-3xl font-bold shadow-lg z-10">
                    2
                  </div>
                </div>
              </div>

              {/* Step 3 */}
              <div className="relative grid md:grid-cols-2 gap-8 items-center">
                <div className="md:text-right">
                  <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition">
                    <div className="text-blue-700 font-bold mb-2">STEP 3</div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-3">계약 체결 및 계약금 입금</h3>
                    <p className="text-gray-600 mb-4">
                      명확한 계약서를 작성하고, 계약금(30%)을 입금하시면 개발을 시작합니다.
                      모든 조건은 투명하게 문서화됩니다.
                    </p>
                    <div className="text-sm text-blue-700 font-semibold">
                      ⏱️ 소요 시간: 1일
                    </div>
                  </div>
                </div>
                <div className="flex justify-center md:justify-start">
                  <div className="w-16 h-16 bg-blue-600 text-white rounded-full flex items-center justify-center text-3xl font-bold shadow-lg z-10">
                    3
                  </div>
                </div>
              </div>

              {/* Step 4 */}
              <div className="relative grid md:grid-cols-2 gap-8 items-center">
                <div className="md:col-start-2">
                  <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition">
                    <div className="text-blue-700 font-bold mb-2">STEP 4</div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-3">개발 진행 및 중간 검수</h3>
                    <p className="text-gray-600 mb-4">
                      주간 진행상황을 공유하고, 주요 마일스톤마다 중간 검수를 진행합니다.
                      피드백을 즉시 반영하여 원하시는 결과물을 만들어갑니다.
                    </p>
                    <div className="text-sm text-blue-700 font-semibold">
                      ⏱️ 소요 시간: 프로젝트에 따라 상이
                    </div>
                  </div>
                </div>
                <div className="flex justify-center md:justify-end md:col-start-1 md:row-start-1">
                  <div className="w-16 h-16 bg-blue-600 text-white rounded-full flex items-center justify-center text-3xl font-bold shadow-lg z-10">
                    4
                  </div>
                </div>
              </div>

              {/* Step 5 */}
              <div className="relative grid md:grid-cols-2 gap-8 items-center">
                <div className="md:text-right">
                  <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition">
                    <div className="text-blue-700 font-bold mb-2">STEP 5</div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-3">최종 납품 및 교육</h3>
                    <p className="text-gray-600 mb-4">
                      완성된 솔루션을 납품하고, 사용 방법을 교육합니다.
                      소스코드, 문서, 설치 가이드 모두 제공합니다.
                    </p>
                    <div className="text-sm text-blue-700 font-semibold">
                      ⏱️ 소요 시간: 1~2일
                    </div>
                  </div>
                </div>
                <div className="flex justify-center md:justify-start">
                  <div className="w-16 h-16 bg-blue-600 text-white rounded-full flex items-center justify-center text-3xl font-bold shadow-lg z-10">
                    5
                  </div>
                </div>
              </div>

              {/* Step 6 */}
              <div className="relative grid md:grid-cols-2 gap-8 items-center">
                <div className="md:col-start-2">
                  <div className="bg-gradient-to-br from-emerald-500 to-emerald-700 p-6 rounded-xl shadow-lg hover:shadow-xl transition text-white">
                    <div className="text-emerald-200 font-bold mb-2">STEP 6</div>
                    <h3 className="text-2xl font-bold mb-3">애프터 서비스</h3>
                    <p className="mb-4">
                      1개월 무상 기술지원과 평생 유지보수가 가능합니다.
                      추가 기능이 필요하시면 언제든지 문의해주세요.
                    </p>
                    <div className="text-sm text-emerald-200 font-semibold">
                      ⏱️ 소요 시간: 평생
                    </div>
                  </div>
                </div>
                <div className="flex justify-center md:justify-end md:col-start-1 md:row-start-1">
                  <div className="w-16 h-16 bg-emerald-600 text-white rounded-full flex items-center justify-center text-3xl font-bold shadow-lg z-10">
                    ✓
                  </div>
                </div>
              </div>
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
                <div className="text-3xl font-bold mb-2">5만원~</div>
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
                <div className="text-3xl font-bold text-gray-900 mb-2">50만원~</div>
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
                <div className="text-3xl font-bold text-gray-900 mb-2">200만원~</div>
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

      {/* 가격 안내 */}
      <section id="pricing" className="py-20 px-4 bg-gradient-to-br from-blue-50 to-emerald-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">투명한 가격 안내</h2>
            <p className="text-xl text-gray-600">숨겨진 비용 없이 명확한 가격을 제시합니다</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mb-12">
            {/* RPA Basic */}
            <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition">
              <div className="text-center mb-6">
                <div className="text-blue-700 font-bold mb-2">RPA BASIC</div>
                <div className="text-5xl font-bold text-gray-900 mb-2">5만원~</div>
                <div className="text-gray-600">간단한 자동화</div>
              </div>
              <ul className="space-y-3 mb-8">
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">✓</span>
                  <span>엑셀 데이터 처리</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">✓</span>
                  <span>파일 자동 정리</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">✓</span>
                  <span>간단한 웹 스크래핑</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">✓</span>
                  <span>1개월 무상 지원</span>
                </li>
              </ul>
              <a href="#contact" className="block w-full bg-blue-700 text-white text-center py-3 rounded-lg font-semibold hover:bg-blue-800 transition">
                문의하기
              </a>
            </div>

            {/* RPA PRO */}
            <div className="bg-gradient-to-br from-blue-700 to-blue-900 rounded-2xl p-8 shadow-2xl transform scale-105 relative">
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-emerald-500 text-white px-6 py-2 rounded-full text-sm font-bold">
                인기
              </div>
              <div className="text-center mb-6 text-white">
                <div className="text-blue-200 font-bold mb-2">RPA PRO</div>
                <div className="text-5xl font-bold mb-2">50만원~</div>
                <div className="text-blue-200">중급 자동화</div>
              </div>
              <ul className="space-y-3 mb-8 text-white">
                <li className="flex items-start">
                  <span className="text-emerald-400 mr-2">✓</span>
                  <span>복잡한 업무 프로세스 자동화</span>
                </li>
                <li className="flex items-start">
                  <span className="text-emerald-400 mr-2">✓</span>
                  <span>API 연동</span>
                </li>
                <li className="flex items-start">
                  <span className="text-emerald-400 mr-2">✓</span>
                  <span>데이터 분석 및 리포트</span>
                </li>
                <li className="flex items-start">
                  <span className="text-emerald-400 mr-2">✓</span>
                  <span>GUI 프로그램 개발</span>
                </li>
                <li className="flex items-start">
                  <span className="text-emerald-400 mr-2">✓</span>
                  <span>3개월 무상 지원</span>
                </li>
              </ul>
              <a href="#contact" className="block w-full bg-white text-blue-900 text-center py-3 rounded-lg font-semibold hover:bg-gray-100 transition">
                문의하기
              </a>
            </div>

            {/* RPA ENTERPRISE */}
            <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition">
              <div className="text-center mb-6">
                <div className="text-blue-700 font-bold mb-2">RPA ENTERPRISE</div>
                <div className="text-5xl font-bold text-gray-900 mb-2">200만원~</div>
                <div className="text-gray-600">대규모 자동화</div>
              </div>
              <ul className="space-y-3 mb-8">
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">✓</span>
                  <span>전사 업무 프로세스 자동화</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">✓</span>
                  <span>기존 시스템 연동</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">✓</span>
                  <span>관리자 대시보드</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">✓</span>
                  <span>DB 설계 및 구축</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">✓</span>
                  <span>6개월 무상 지원</span>
                </li>
              </ul>
              <a href="#contact" className="block w-full bg-blue-700 text-white text-center py-3 rounded-lg font-semibold hover:bg-blue-800 transition">
                문의하기
              </a>
            </div>
          </div>

          {/* 지급 조건 */}
          <div className="bg-white rounded-2xl p-8 shadow-lg">
            <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">💳 지급 조건</h3>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center p-6 bg-blue-50 rounded-xl">
                <div className="text-4xl font-bold text-blue-700 mb-2">30%</div>
                <div className="font-semibold text-gray-900 mb-2">계약금</div>
                <div className="text-sm text-gray-600">계약 체결 시</div>
              </div>
              <div className="text-center p-6 bg-blue-50 rounded-xl">
                <div className="text-4xl font-bold text-blue-700 mb-2">40%</div>
                <div className="font-semibold text-gray-900 mb-2">중도금</div>
                <div className="text-sm text-gray-600">개발 완료 시</div>
              </div>
              <div className="text-center p-6 bg-emerald-50 rounded-xl">
                <div className="text-4xl font-bold text-emerald-700 mb-2">30%</div>
                <div className="font-semibold text-gray-900 mb-2">잔금</div>
                <div className="text-sm text-gray-600">최종 인수 시</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 자동 견적 */}
      <section id="quote" className="py-20 px-4 bg-white">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">💰 자동 견적 계산기</h2>
            <p className="text-xl text-gray-600">프로젝트 유형과 규모를 선택하면 예상 견적을 확인할 수 있습니다</p>
          </div>

          <div className="bg-gradient-to-br from-blue-50 to-emerald-50 rounded-2xl p-8 shadow-lg">
            <div className="bg-white rounded-xl p-6 mb-6">
              <label className="block text-lg font-bold text-gray-900 mb-3">프로젝트 유형</label>
              <select className="w-full p-4 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none">
                <option>RPA 자동화 - 엑셀/데이터 처리</option>
                <option>RPA 자동화 - 웹 스크래핑</option>
                <option>RPA 자동화 - 업무 프로세스 전체</option>
                <option>웹 개발 - 랜딩 페이지</option>
                <option>웹 개발 - 기업 홈페이지</option>
                <option>웹 개발 - 웹 서비스/플랫폼</option>
                <option>앱 개발 - 간단한 앱</option>
                <option>앱 개발 - 일반 앱</option>
                <option>앱 개발 - 복잡한 앱</option>
              </select>
            </div>

            <div className="bg-white rounded-xl p-6 mb-6">
              <label className="block text-lg font-bold text-gray-900 mb-3">프로젝트 규모</label>
              <div className="space-y-3">
                <label className="flex items-center p-4 border-2 border-gray-300 rounded-lg hover:border-blue-500 cursor-pointer">
                  <input type="radio" name="scale" className="mr-3" />
                  <div>
                    <div className="font-semibold">소규모 (1~2주)</div>
                    <div className="text-sm text-gray-600">기본 기능만 포함</div>
                  </div>
                </label>
                <label className="flex items-center p-4 border-2 border-gray-300 rounded-lg hover:border-blue-500 cursor-pointer">
                  <input type="radio" name="scale" className="mr-3" defaultChecked />
                  <div>
                    <div className="font-semibold">중규모 (3~6주)</div>
                    <div className="text-sm text-gray-600">추가 기능 및 커스터마이징</div>
                  </div>
                </label>
                <label className="flex items-center p-4 border-2 border-gray-300 rounded-lg hover:border-blue-500 cursor-pointer">
                  <input type="radio" name="scale" className="mr-3" />
                  <div>
                    <div className="font-semibold">대규모 (2개월 이상)</div>
                    <div className="text-sm text-gray-600">복잡한 기능 및 시스템 연동</div>
                  </div>
                </label>
              </div>
            </div>

            <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white rounded-xl p-8 text-center">
              <div className="text-lg mb-2">예상 견적</div>
              <div className="text-5xl font-bold mb-4">200만원 ~ 300만원</div>
              <div className="text-blue-200 mb-6">부가세 포함 / 정확한 견적은 상담 후 제공</div>
              <a href="#contact" className="inline-block bg-white text-blue-900 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition">
                정확한 견적 받기
              </a>
            </div>

            <p className="text-center text-gray-600 mt-6 text-sm">
              * 실제 견적은 요구사항에 따라 달라질 수 있습니다
            </p>
          </div>
        </div>
      </section>

      {/* 기술 소개 */}
      <section id="tech" className="py-20 px-4 bg-slate-900 text-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">최신 기술 스택</h2>
            <p className="text-xl text-gray-300">검증된 기술로 안정적이고 확장 가능한 솔루션을 제공합니다</p>
          </div>

          <div className="grid md:grid-cols-2 gap-12">
            <div className="bg-slate-800 rounded-2xl p-8">
              <h3 className="text-2xl font-bold mb-6 flex items-center">
                <span className="text-3xl mr-3">🤖</span> RPA & Automation
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-slate-700 p-4 rounded-lg hover:bg-slate-600 transition">
                  <div className="text-2xl mb-2">🐍</div>
                  <div className="font-bold mb-1">Python</div>
                  <div className="text-sm text-gray-400">범용 자동화</div>
                </div>
                <div className="bg-slate-700 p-4 rounded-lg hover:bg-slate-600 transition">
                  <div className="text-2xl mb-2">📊</div>
                  <div className="font-bold mb-1">Pandas</div>
                  <div className="text-sm text-gray-400">데이터 처리</div>
                </div>
                <div className="bg-slate-700 p-4 rounded-lg hover:bg-slate-600 transition">
                  <div className="text-2xl mb-2">🌐</div>
                  <div className="font-bold mb-1">Selenium</div>
                  <div className="text-sm text-gray-400">웹 자동화</div>
                </div>
                <div className="bg-slate-700 p-4 rounded-lg hover:bg-slate-600 transition">
                  <div className="text-2xl mb-2">🎭</div>
                  <div className="font-bold mb-1">Playwright</div>
                  <div className="text-sm text-gray-400">브라우저 제어</div>
                </div>
              </div>
            </div>

            <div className="bg-slate-800 rounded-2xl p-8">
              <h3 className="text-2xl font-bold mb-6 flex items-center">
                <span className="text-3xl mr-3">💻</span> Web Development
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-slate-700 p-4 rounded-lg hover:bg-slate-600 transition">
                  <div className="text-2xl mb-2">⚛️</div>
                  <div className="font-bold mb-1">React</div>
                  <div className="text-sm text-gray-400">UI 라이브러리</div>
                </div>
                <div className="bg-slate-700 p-4 rounded-lg hover:bg-slate-600 transition">
                  <div className="text-2xl mb-2">▲</div>
                  <div className="font-bold mb-1">Next.js</div>
                  <div className="text-sm text-gray-400">풀스택 프레임워크</div>
                </div>
                <div className="bg-slate-700 p-4 rounded-lg hover:bg-slate-600 transition">
                  <div className="text-2xl mb-2">📘</div>
                  <div className="font-bold mb-1">TypeScript</div>
                  <div className="text-sm text-gray-400">타입 안정성</div>
                </div>
                <div className="bg-slate-700 p-4 rounded-lg hover:bg-slate-600 transition">
                  <div className="text-2xl mb-2">🎨</div>
                  <div className="font-bold mb-1">Tailwind CSS</div>
                  <div className="text-sm text-gray-400">스타일링</div>
                </div>
              </div>
            </div>

            <div className="bg-slate-800 rounded-2xl p-8">
              <h3 className="text-2xl font-bold mb-6 flex items-center">
                <span className="text-3xl mr-3">🔧</span> Backend & API
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-slate-700 p-4 rounded-lg hover:bg-slate-600 transition">
                  <div className="text-2xl mb-2">🟢</div>
                  <div className="font-bold mb-1">Node.js</div>
                  <div className="text-sm text-gray-400">서버 사이드</div>
                </div>
                <div className="bg-slate-700 p-4 rounded-lg hover:bg-slate-600 transition">
                  <div className="text-2xl mb-2">☕</div>
                  <div className="font-bold mb-1">Java/Spring</div>
                  <div className="text-sm text-gray-400">엔터프라이즈</div>
                </div>
                <div className="bg-slate-700 p-4 rounded-lg hover:bg-slate-600 transition">
                  <div className="text-2xl mb-2">🔥</div>
                  <div className="font-bold mb-1">FastAPI</div>
                  <div className="text-sm text-gray-400">고성능 API</div>
                </div>
                <div className="bg-slate-700 p-4 rounded-lg hover:bg-slate-600 transition">
                  <div className="text-2xl mb-2">🗄️</div>
                  <div className="font-bold mb-1">PostgreSQL</div>
                  <div className="text-sm text-gray-400">관계형 DB</div>
                </div>
              </div>
            </div>

            <div className="bg-slate-800 rounded-2xl p-8">
              <h3 className="text-2xl font-bold mb-6 flex items-center">
                <span className="text-3xl mr-3">☁️</span> Cloud & DevOps
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-slate-700 p-4 rounded-lg hover:bg-slate-600 transition">
                  <div className="text-2xl mb-2">🚀</div>
                  <div className="font-bold mb-1">Vercel</div>
                  <div className="text-sm text-gray-400">배포 플랫폼</div>
                </div>
                <div className="bg-slate-700 p-4 rounded-lg hover:bg-slate-600 transition">
                  <div className="text-2xl mb-2">☁️</div>
                  <div className="font-bold mb-1">AWS</div>
                  <div className="text-sm text-gray-400">클라우드 서비스</div>
                </div>
                <div className="bg-slate-700 p-4 rounded-lg hover:bg-slate-600 transition">
                  <div className="text-2xl mb-2">🐳</div>
                  <div className="font-bold mb-1">Docker</div>
                  <div className="text-sm text-gray-400">컨테이너화</div>
                </div>
                <div className="bg-slate-700 p-4 rounded-lg hover:bg-slate-600 transition">
                  <div className="text-2xl mb-2">📦</div>
                  <div className="font-bold mb-1">Git</div>
                  <div className="text-sm text-gray-400">버전 관리</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 고객 리뷰 */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">고객 후기</h2>
            <p className="text-xl text-gray-600">실제 고객들의 생생한 경험담을 확인하세요</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-gray-50 rounded-xl p-6 shadow-md hover:shadow-lg transition">
              <div className="flex items-center mb-4">
                <div className="text-yellow-500 text-xl">⭐⭐⭐⭐⭐</div>
              </div>
              <p className="text-gray-700 mb-4 leading-relaxed">
                "엑셀 파일 50개를 매월 수작업으로 합치던 업무를 자동화했습니다.
                5시간 걸리던 일이 10초로 단축됐어요. 정말 감사합니다!"
              </p>
              <div className="flex items-center">
                <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold mr-3">
                  김
                </div>
                <div>
                  <div className="font-bold text-gray-900">김철수 과장</div>
                  <div className="text-sm text-gray-600">제조업 / RPA 자동화</div>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 rounded-xl p-6 shadow-md hover:shadow-lg transition">
              <div className="flex items-center mb-4">
                <div className="text-yellow-500 text-xl">⭐⭐⭐⭐⭐</div>
              </div>
              <p className="text-gray-700 mb-4 leading-relaxed">
                "홈페이지 제작을 맡겼는데 대형 업체는 너무 비싸고...
                쟁승메이드는 퀄리티도 좋고 가격도 합리적이었어요. 완전 만족합니다!"
              </p>
              <div className="flex items-center">
                <div className="w-12 h-12 bg-emerald-600 rounded-full flex items-center justify-center text-white font-bold mr-3">
                  이
                </div>
                <div>
                  <div className="font-bold text-gray-900">이영희 대표</div>
                  <div className="text-sm text-gray-600">온라인 쇼핑몰 / 웹 개발</div>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 rounded-xl p-6 shadow-md hover:shadow-lg transition">
              <div className="flex items-center mb-4">
                <div className="text-yellow-500 text-xl">⭐⭐⭐⭐⭐</div>
              </div>
              <p className="text-gray-700 mb-4 leading-relaxed">
                "개발 과정 내내 소통이 빠르고 명확했습니다.
                원하는 걸 정확히 이해하고 구현해주셔서 수정 사항이 거의 없었어요."
              </p>
              <div className="flex items-center">
                <div className="w-12 h-12 bg-purple-600 rounded-full flex items-center justify-center text-white font-bold mr-3">
                  박
                </div>
                <div>
                  <div className="font-bold text-gray-900">박민수 팀장</div>
                  <div className="text-sm text-gray-600">IT 스타트업 / 앱 개발</div>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 rounded-xl p-6 shadow-md hover:shadow-lg transition">
              <div className="flex items-center mb-4">
                <div className="text-yellow-500 text-xl">⭐⭐⭐⭐⭐</div>
              </div>
              <p className="text-gray-700 mb-4 leading-relaxed">
                "Gmail 자동 분류 프로그램 덕분에 업무 효율이 150% 증가했습니다.
                이메일 정리하는 시간을 다른 업무에 쓸 수 있게 됐어요."
              </p>
              <div className="flex items-center">
                <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold mr-3">
                  최
                </div>
                <div>
                  <div className="font-bold text-gray-900">최지원 실장</div>
                  <div className="text-sm text-gray-600">컨설팅 / RPA 자동화</div>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 rounded-xl p-6 shadow-md hover:shadow-lg transition">
              <div className="flex items-center mb-4">
                <div className="text-yellow-500 text-xl">⭐⭐⭐⭐⭐</div>
              </div>
              <p className="text-gray-700 mb-4 leading-relaxed">
                "프로젝트 완료 후에도 유지보수가 잘 되고 있습니다.
                작은 수정 사항도 24시간 이내에 바로 대응해주셔서 믿음이 갑니다."
              </p>
              <div className="flex items-center">
                <div className="w-12 h-12 bg-emerald-600 rounded-full flex items-center justify-center text-white font-bold mr-3">
                  정
                </div>
                <div>
                  <div className="font-bold text-gray-900">정수진 이사</div>
                  <div className="text-sm text-gray-600">유통업 / 웹 개발</div>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 rounded-xl p-6 shadow-md hover:shadow-lg transition">
              <div className="flex items-center mb-4">
                <div className="text-yellow-500 text-xl">⭐⭐⭐⭐⭐</div>
              </div>
              <p className="text-gray-700 mb-4 leading-relaxed">
                "기술을 잘 모르는 저에게도 쉽게 설명해주시고,
                최적의 솔루션을 제안해주셨어요. 전문가의 컨설팅을 받는 느낌이었습니다."
              </p>
              <div className="flex items-center">
                <div className="w-12 h-12 bg-purple-600 rounded-full flex items-center justify-center text-white font-bold mr-3">
                  강
                </div>
                <div>
                  <div className="font-bold text-gray-900">강태훈 대표</div>
                  <div className="text-sm text-gray-600">소호 사업자 / RPA 자동화</div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-12 bg-gradient-to-r from-blue-600 to-blue-800 rounded-2xl p-8 text-white text-center">
            <div className="text-5xl font-bold mb-2">98%</div>
            <div className="text-xl mb-4">고객 만족도</div>
            <div className="text-blue-200">100개 이상의 프로젝트를 성공적으로 완수했습니다</div>
          </div>
        </div>
      </section>

      {/* 멈추지 않는 진화 */}
      <section className="py-20 px-4 bg-gradient-to-br from-purple-900 to-blue-900 text-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">멈추지 않는 진화</h2>
            <p className="text-xl text-purple-200">지속적인 학습과 개선으로 최고의 솔루션을 제공합니다</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 hover:bg-white/20 transition">
              <div className="text-4xl mb-4">📚</div>
              <h3 className="text-xl font-bold mb-3">최신 기술 학습</h3>
              <p className="text-purple-200">
                매월 새로운 기술과 프레임워크를 학습하여
                최신 트렌드를 반영한 솔루션을 제공합니다.
              </p>
            </div>

            <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 hover:bg-white/20 transition">
              <div className="text-4xl mb-4">🔄</div>
              <h3 className="text-xl font-bold mb-3">프로세스 개선</h3>
              <p className="text-purple-200">
                프로젝트마다 회고를 진행하고,
                더 나은 개발 프로세스를 위해 지속적으로 개선합니다.
              </p>
            </div>

            <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 hover:bg-white/20 transition">
              <div className="text-4xl mb-4">🎯</div>
              <h3 className="text-xl font-bold mb-3">고객 피드백 반영</h3>
              <p className="text-purple-200">
                고객의 피드백을 적극적으로 수렴하여
                서비스 품질을 지속적으로 향상시킵니다.
              </p>
            </div>

            <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 hover:bg-white/20 transition">
              <div className="text-4xl mb-4">🚀</div>
              <h3 className="text-xl font-bold mb-3">자동화 도구 개발</h3>
              <p className="text-purple-200">
                개발 효율을 높이는 자체 도구를 개발하여
                더 빠르고 정확한 납품을 실현합니다.
              </p>
            </div>
          </div>

          <div className="mt-12 grid md:grid-cols-3 gap-6 text-center">
            <div className="bg-white/10 backdrop-blur-md rounded-xl p-6">
              <div className="text-3xl font-bold mb-2">500+</div>
              <div className="text-purple-200">시간의 학습 시간 (연간)</div>
            </div>
            <div className="bg-white/10 backdrop-blur-md rounded-xl p-6">
              <div className="text-3xl font-bold mb-2">20+</div>
              <div className="text-purple-200">기술 스택 보유</div>
            </div>
            <div className="bg-white/10 backdrop-blur-md rounded-xl p-6">
              <div className="text-3xl font-bold mb-2">100%</div>
              <div className="text-purple-200">프로젝트 완수율</div>
            </div>
          </div>
        </div>
      </section>

      {/* Portfolio Section - Enhanced */}
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
              className="bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all transform hover:scale-105 block"
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

            {/* Portfolio Item 2 - Gmail Automation */}
            <a
              href="https://gitea.gahusb.synology.me/gahusb/gmail-automation-rpa"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all transform hover:scale-105 block"
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

            {/* Portfolio Item 3 */}
            <div className="bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all transform hover:scale-105">
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
          </div>

          <div className="text-center mt-12">
            <p className="text-gray-600 mb-4">더 많은 프로젝트는 GitHub에서 확인하세요</p>
            <a href="#contact" className="inline-block border-2 border-blue-700 text-blue-700 px-8 py-3 rounded-lg font-semibold hover:bg-blue-50 transition">
              전체 포트폴리오 보기
            </a>
          </div>
        </div>
      </section>

      {/* AFTER SERVICE */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">완벽한 애프터 서비스</h2>
            <p className="text-xl text-gray-600">프로젝트 완료 후에도 책임지고 관리합니다</p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 mb-12">
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-8">
              <div className="flex items-start mb-4">
                <div className="text-4xl mr-4">🎁</div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">무상 기술 지원</h3>
                  <p className="text-gray-700 mb-4">
                    납품 후 <span className="text-blue-700 font-bold">1개월간 무상</span>으로 기술 지원을 제공합니다.
                  </p>
                  <ul className="space-y-2 text-gray-700">
                    <li className="flex items-center">
                      <span className="text-blue-700 mr-2">✓</span>
                      프로그램 사용법 안내
                    </li>
                    <li className="flex items-center">
                      <span className="text-blue-700 mr-2">✓</span>
                      오류 및 버그 수정
                    </li>
                    <li className="flex items-center">
                      <span className="text-blue-700 mr-2">✓</span>
                      간단한 설정 변경
                    </li>
                    <li className="flex items-center">
                      <span className="text-blue-700 mr-2">✓</span>
                      24시간 이내 응답
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-2xl p-8">
              <div className="flex items-start mb-4">
                <div className="text-4xl mr-4">🔧</div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">평생 유지보수</h3>
                  <p className="text-gray-700 mb-4">
                    무상 기간 종료 후에도 <span className="text-emerald-700 font-bold">평생 유지보수</span>가 가능합니다.
                  </p>
                  <ul className="space-y-2 text-gray-700">
                    <li className="flex items-center">
                      <span className="text-emerald-700 mr-2">✓</span>
                      지속적인 기술 지원
                    </li>
                    <li className="flex items-center">
                      <span className="text-emerald-700 mr-2">✓</span>
                      기능 추가 개발 (유상)
                    </li>
                    <li className="flex items-center">
                      <span className="text-emerald-700 mr-2">✓</span>
                      버전 업그레이드
                    </li>
                    <li className="flex items-center">
                      <span className="text-emerald-700 mr-2">✓</span>
                      합리적인 유지보수 비용
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-r from-gray-900 to-blue-900 rounded-2xl p-8 text-white">
            <div className="text-center">
              <h3 className="text-3xl font-bold mb-4">🛡️ 안심 보증</h3>
              <p className="text-xl text-gray-300 mb-8">
                프로젝트 완료 후에도 책임지고 관리합니다
              </p>
              <div className="grid md:grid-cols-3 gap-6">
                <div className="bg-white/10 backdrop-blur-md rounded-xl p-6">
                  <div className="text-4xl mb-3">📞</div>
                  <div className="font-bold text-lg mb-2">빠른 응답</div>
                  <div className="text-gray-300">문의사항 24시간 이내 응답</div>
                </div>
                <div className="bg-white/10 backdrop-blur-md rounded-xl p-6">
                  <div className="text-4xl mb-3">🔒</div>
                  <div className="font-bold text-lg mb-2">소스코드 제공</div>
                  <div className="text-gray-300">모든 소스코드와 문서 제공</div>
                </div>
                <div className="bg-white/10 backdrop-blur-md rounded-xl p-6">
                  <div className="text-4xl mb-3">🤝</div>
                  <div className="font-bold text-lg mb-2">장기 파트너십</div>
                  <div className="text-gray-300">비즈니스 성장을 함께 합니다</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="py-20 px-4 bg-gray-50">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">자주 묻는 질문</h2>
            <p className="text-xl text-gray-600">궁금하신 점을 빠르게 확인하세요</p>
          </div>

          <div className="space-y-4">
            <details className="bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition cursor-pointer group">
              <summary className="text-lg font-bold text-gray-900 flex justify-between items-center">
                <span>💰 프로젝트 비용은 어떻게 결정되나요?</span>
                <span className="text-blue-700 group-open:rotate-180 transition-transform">▼</span>
              </summary>
              <div className="mt-4 text-gray-700 leading-relaxed">
                프로젝트 규모, 기능 복잡도, 개발 기간을 종합적으로 고려하여 견적을 산정합니다.
                무료 상담을 통해 요구사항을 분석한 후, 상세한 견적서를 제공해드립니다.
                대형 업체 대비 30~50% 저렴하면서도 동일한 품질을 보장합니다.
              </div>
            </details>

            <details className="bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition cursor-pointer group">
              <summary className="text-lg font-bold text-gray-900 flex justify-between items-center">
                <span>⏱️ 프로젝트 기간은 얼마나 걸리나요?</span>
                <span className="text-blue-700 group-open:rotate-180 transition-transform">▼</span>
              </summary>
              <div className="mt-4 text-gray-700 leading-relaxed">
                <ul className="space-y-2">
                  <li>• <strong>간단한 RPA 자동화:</strong> 1~2주</li>
                  <li>• <strong>중급 RPA/웹 개발:</strong> 3~6주</li>
                  <li>• <strong>복잡한 프로젝트:</strong> 2~3개월</li>
                </ul>
                정확한 일정은 요구사항 분석 후 견적서에 명시됩니다.
                긴급한 경우 특급 개발도 가능합니다 (추가 비용 발생).
              </div>
            </details>

            <details className="bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition cursor-pointer group">
              <summary className="text-lg font-bold text-gray-900 flex justify-between items-center">
                <span>🔧 기술을 잘 몰라도 상담 가능한가요?</span>
                <span className="text-blue-700 group-open:rotate-180 transition-transform">▼</span>
              </summary>
              <div className="mt-4 text-gray-700 leading-relaxed">
                네, 전혀 문제없습니다! 기술 용어를 사용하지 않고,
                비즈니스 목표와 현재 불편한 점만 말씀해주시면 됩니다.
                제가 요구사항을 정리하고 최적의 솔루션을 제안해드립니다.
                "엑셀 파일 합치는 게 너무 번거로워요" 정도만 말씀하셔도 충분합니다.
              </div>
            </details>

            <details className="bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition cursor-pointer group">
              <summary className="text-lg font-bold text-gray-900 flex justify-between items-center">
                <span>📝 계약 과정은 어떻게 되나요?</span>
                <span className="text-blue-700 group-open:rotate-180 transition-transform">▼</span>
              </summary>
              <div className="mt-4 text-gray-700 leading-relaxed">
                <ol className="space-y-2 list-decimal list-inside">
                  <li>무료 상담 및 요구사항 분석</li>
                  <li>견적서 및 제안서 제공</li>
                  <li>계약서 작성 (명확하고 공정한 조건)</li>
                  <li>계약금(30%) 입금</li>
                  <li>개발 시작</li>
                </ol>
                모든 조건은 계약서에 명시되며, 불리한 조항은 없습니다.
              </div>
            </details>

            <details className="bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition cursor-pointer group">
              <summary className="text-lg font-bold text-gray-900 flex justify-between items-center">
                <span>💳 지급은 어떻게 하나요?</span>
                <span className="text-blue-700 group-open:rotate-180 transition-transform">▼</span>
              </summary>
              <div className="mt-4 text-gray-700 leading-relaxed">
                <strong>3회 분할 납부</strong>가 기본입니다:
                <ul className="mt-2 space-y-1">
                  <li>• 계약금 30% - 계약 체결 시</li>
                  <li>• 중도금 40% - 개발 완료 시 (검수 전)</li>
                  <li>• 잔금 30% - 최종 인수 및 검수 완료 시</li>
                </ul>
                소규모 프로젝트는 2회 분할(50% + 50%)도 가능합니다.
              </div>
            </details>

            <details className="bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition cursor-pointer group">
              <summary className="text-lg font-bold text-gray-900 flex justify-between items-center">
                <span>🛠️ 완성 후 유지보수는 어떻게 되나요?</span>
                <span className="text-blue-700 group-open:rotate-180 transition-transform">▼</span>
              </summary>
              <div className="mt-4 text-gray-700 leading-relaxed">
                <ul className="space-y-2">
                  <li>• <strong>1개월 무상 기술지원:</strong> 버그 수정, 사용법 안내</li>
                  <li>• <strong>평생 유지보수 가능:</strong> 유상으로 지속적인 관리 가능</li>
                  <li>• <strong>합리적인 비용:</strong> 월 계약금의 5~10%</li>
                  <li>• <strong>빠른 대응:</strong> 24시간 이내 응답 보장</li>
                </ul>
              </div>
            </details>

            <details className="bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition cursor-pointer group">
              <summary className="text-lg font-bold text-gray-900 flex justify-between items-center">
                <span>📂 소스코드를 받을 수 있나요?</span>
                <span className="text-blue-700 group-open:rotate-180 transition-transform">▼</span>
              </summary>
              <div className="mt-4 text-gray-700 leading-relaxed">
                네, <strong>모든 소스코드와 문서를 제공</strong>합니다.
                계약 완료 후 GitHub/Gitea 저장소로 전달되며,
                소스코드에 대한 소유권은 고객에게 이전됩니다.
                필요하면 다른 개발자에게 인계도 가능합니다.
              </div>
            </details>

            <details className="bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition cursor-pointer group">
              <summary className="text-lg font-bold text-gray-900 flex justify-between items-center">
                <span>🔒 보안은 어떻게 보장되나요?</span>
                <span className="text-blue-700 group-open:rotate-180 transition-transform">▼</span>
              </summary>
              <div className="mt-4 text-gray-700 leading-relaxed">
                <ul className="space-y-2">
                  <li>• <strong>비밀 유지 계약(NDA):</strong> 요청 시 체결 가능</li>
                  <li>• <strong>데이터 암호화:</strong> 민감한 정보는 암호화 처리</li>
                  <li>• <strong>접근 권한 관리:</strong> 필요한 권한만 최소로 요청</li>
                  <li>• <strong>개인정보보호:</strong> 프로젝트 완료 후 데이터 삭제</li>
                </ul>
                고객의 비즈니스 기밀은 절대 보호됩니다.
              </div>
            </details>

            <details className="bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition cursor-pointer group">
              <summary className="text-lg font-bold text-gray-900 flex justify-between items-center">
                <span>🌍 원격으로도 가능한가요?</span>
                <span className="text-blue-700 group-open:rotate-180 transition-transform">▼</span>
              </summary>
              <div className="mt-4 text-gray-700 leading-relaxed">
                네, <strong>전국 어디서나 가능</strong>합니다.
                화상회의(Zoom, Google Meet), 이메일, 전화로 소통하며,
                필요 시 방문 미팅도 가능합니다 (수도권 기준).
                실제로 지방 고객도 많이 계십니다.
              </div>
            </details>

            <details className="bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition cursor-pointer group">
              <summary className="text-lg font-bold text-gray-900 flex justify-between items-center">
                <span>❓ 프로젝트 중간에 요구사항이 변경되면요?</span>
                <span className="text-blue-700 group-open:rotate-180 transition-transform">▼</span>
              </summary>
              <div className="mt-4 text-gray-700 leading-relaxed">
                <strong>합리적인 범위 내 수정은 무상</strong>으로 반영합니다.
                단, 프로젝트 범위를 크게 벗어나는 변경 사항은
                추가 견적을 협의 후 진행합니다.
                중간 검수 단계에서 피드백을 받아 조기에 조정하므로,
                큰 변경이 발생하는 경우는 거의 없습니다.
              </div>
            </details>
          </div>

          <div className="mt-12 text-center bg-white rounded-2xl p-8 shadow-md">
            <p className="text-gray-700 mb-4 text-lg">
              더 궁금하신 점이 있으신가요?
            </p>
            <a href="#contact" className="inline-block bg-blue-700 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-800 transition">
              직접 문의하기
            </a>
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

          <div className="mt-12 grid md:grid-cols-3 gap-6 text-center">
            <div className="bg-white rounded-xl p-6 shadow-md">
              <div className="text-4xl mb-3">📧</div>
              <div className="font-bold text-gray-900 mb-1">이메일</div>
              <div className="text-gray-600">bgg8988@gmail.com</div>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-md">
              <div className="text-4xl mb-3">📞</div>
              <div className="font-bold text-gray-900 mb-1">전화</div>
              <div className="text-gray-600">010-3907-1392</div>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-md">
              <div className="text-4xl mb-3">⏰</div>
              <div className="font-bold text-gray-900 mb-1">응답 시간</div>
              <div className="text-gray-600">24시간 이내</div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer - Enhanced */}
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
                <li><a href="#pricing" className="hover:text-white transition">가격 안내</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4">정보</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#portfolio" className="hover:text-white transition">포트폴리오</a></li>
                <li><a href="#tech" className="hover:text-white transition">기술 스택</a></li>
                <li><a href="#faq" className="hover:text-white transition">FAQ</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4">문의</h4>
              <ul className="space-y-2 text-gray-400">
                <li>bgg8988@gmail.com</li>
                <li>010-3907-1392</li>
                <li>평일 09:00~18:00</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-8 text-center text-gray-400">
            <p>&copy; 2025 쟁승메이드 (JaengSeung Made). All rights reserved.</p>
            <p className="mt-2 text-sm">대기업 출신 개발자가 제공하는 전문 비즈니스 솔루션</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
