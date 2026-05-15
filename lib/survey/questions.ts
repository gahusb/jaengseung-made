/**
 * CONTOUR 설문 7 질문 옵션 SSOT.
 * UI 컴포넌트(Q1Step ~ Q7Step)가 이 데이터를 import.
 */

export const AGE_RANGES = ['10대', '20대', '30대', '40대', '50대+'] as const;

export const STATUSES = [
  '직장인',
  '학생',
  '자영업',
  '프리랜서',
  '취업준비',
  '휴식 중',
  '기타',
] as const;

export const AWARENESS_FREQS = [
  '거의 매일 그래요',
  '자주 그래요',
  '가끔 그래요',
  '별로 없어요',
  '한 번도 없어요',
] as const;

export const TOOLS_OPTIONS = [
  '사주 / 타로',
  'MBTI / 성격 검사',
  '심리 상담',
  '자기계발 책 / 강의',
  '친구·가족과 대화',
  '일기 / 글쓰기',
  '검색 / 유튜브',
  '그냥 시간이 풀어줌',
  '아무것도 안 함',
] as const;

export const COST_RANGES = [
  '0원',
  '1만원 이하',
  '1~5만원',
  '5~10만원',
  '10~30만원',
  '30만원 이상',
] as const;

export const BEST_TOOLS = [
  '사주 / 타로',
  'MBTI',
  '심리 상담',
  '책 / 강의',
  '대화',
  '일기 / 글쓰기',
  '시간',
  '도움 된 게 없음',
] as const;

export const SATISFY_SCALE = [1, 2, 3, 4, 5] as const;

// 질문 헤더 카피
export const QUESTION_HEADERS: Record<string, { title: string; subtitle?: string }> = {
  q1: {
    title: '안녕하세요. 짧게 자기 소개부터.',
    subtitle: '나이대와 지금 상황을 알려주세요.',
  },
  q2: {
    title: "최근 1년 안에 '내가 뭘 원하는지 모르겠다'고 느낀 적 있어요?",
  },
  q3: {
    title: '그럴 때 어떻게 풀어가시나요?',
    subtitle: '해본 거 모두 골라주세요. (복수 선택)',
  },
  q4: {
    title: '지난 1년간 자기 이해·심리 영역에 돈 쓴 거 다 합쳐서 얼마쯤?',
  },
  q5: {
    title: '그중 가장 도움 됐던 거 + 만족도',
  },
  q6: {
    title: "혹시 '내가 진짜 알고 싶었던 건 이런 거였는데...' 하는 게 있나요?",
    subtitle: '자유롭게 적어주세요. 안 적으셔도 괜찮아요.',
  },
  q7: {
    title: '이런 도구가 나오면 알려드릴까요?',
    subtitle: '결과를 받고 싶으시면 이메일을 남겨주세요.',
  },
};
