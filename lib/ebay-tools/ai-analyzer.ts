import Anthropic from '@anthropic-ai/sdk';
import type { CrawlResult, BasicInfo, ListingInfo, FitmentEntry } from './types';

function getClient(): Anthropic {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) throw new Error('ANTHROPIC_API_KEY is not set');
  return new Anthropic({ apiKey });
}

const SYSTEM_PROMPT = `당신은 자동차 부품 전문가이자 이베이 리스팅 최적화 전문가입니다.
주어진 크롤링 데이터에서 정확한 부품 정보를 추출하고, eBay 리스팅에 최적화된 형태로 정리합니다.

중요 원칙:
- 확인된 정보만 포함합니다. 추측하지 마세요.
- Fitment(호환 차종)은 크롤링 데이터에서 확인된 것만 포함합니다.
- 데이터에 없는 정보는 빈 문자열이나 빈 배열로 남깁니다.
- 이베이 제목은 80자 이내, 핵심 키워드 포함 (브랜드 + 부품명 + 적용차종 + OEM번호)`;

interface AIAnalysisResult {
  basicInfo: BasicInfo;
  listing: ListingInfo;
  fitment: FitmentEntry[];
}

export async function analyzeWithAI(
  partNumber: string,
  partName: string | undefined,
  crawlResults: CrawlResult[]
): Promise<AIAnalysisResult> {
  // 크롤링 결과를 텍스트로 정리
  const crawlSummary = crawlResults
    .map(r => {
      if (!r.success) return `[${r.source}] 크롤링 실패: ${r.error}`;
      return `[${r.source}] 수집 데이터:\n${JSON.stringify(r.data, null, 2).slice(0, 3000)}`;
    })
    .join('\n\n---\n\n');

  const userMessage = `품번: ${partNumber}
${partName ? `품명: ${partName}` : ''}

아래는 여러 자동차 부품 사이트에서 크롤링한 데이터입니다. 이 데이터를 분석해 이베이 리스팅에 필요한 정보를 정리해주세요.

${crawlSummary}`;

  const response = await getClient().messages.create({
    model: 'claude-sonnet-4-20250514',
    max_tokens: 4096,
    system: SYSTEM_PROMPT,
    messages: [{ role: 'user', content: userMessage }],
    tools: [{
      name: 'format_listing_data',
      description: '이베이 리스팅용 데이터를 구조화된 형태로 반환합니다',
      input_schema: {
        type: 'object' as const,
        properties: {
          basicInfo: {
            type: 'object' as const,
            properties: {
              partNumber: { type: 'string' as const },
              partName: { type: 'string' as const },
              brand: { type: 'string' as const },
              oemNumbers: { type: 'array' as const, items: { type: 'string' as const } },
              category: { type: 'string' as const },
              imageUrl: { type: 'string' as const },
            },
            required: ['partNumber', 'partName', 'brand', 'oemNumbers', 'category'] as const,
          },
          listing: {
            type: 'object' as const,
            properties: {
              title: { type: 'string' as const, description: '이베이 리스팅 제목 (80자 이내)' },
              category: { type: 'string' as const, description: '이베이 카테고리 ID' },
              itemSpecifics: {
                type: 'object' as const,
                additionalProperties: { type: 'string' as const },
                description: '이베이 Item Specifics (Brand, MPN, Type 등)',
              },
            },
            required: ['title', 'category', 'itemSpecifics'] as const,
          },
          fitment: {
            type: 'array' as const,
            items: {
              type: 'object' as const,
              properties: {
                year: { type: 'string' as const },
                make: { type: 'string' as const },
                model: { type: 'string' as const },
                engine: { type: 'string' as const },
                confidence: { type: 'string' as const, enum: ['high', 'medium', 'low'] },
                source: { type: 'string' as const },
              },
              required: ['year', 'make', 'model', 'engine', 'confidence', 'source'] as const,
            },
            description: '호환 차종 목록 (크롤링 데이터에서 확인된 것만)',
          },
        },
        required: ['basicInfo', 'listing', 'fitment'] as const,
      },
    }],
    tool_choice: { type: 'tool', name: 'format_listing_data' },
  });

  // Tool Use 응답에서 결과 추출
  const toolUse = response.content.find(block => block.type === 'tool_use');
  if (!toolUse || toolUse.type !== 'tool_use') {
    throw new Error('AI 분석 결과를 파싱할 수 없습니다');
  }

  const input = toolUse.input as Record<string, unknown>;
  if (!input.basicInfo || !input.listing || !Array.isArray(input.fitment)) {
    throw new Error('AI 응답에 필수 필드가 누락되었습니다');
  }
  const result = input as unknown as AIAnalysisResult;
  return result;
}
