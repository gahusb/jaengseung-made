import Anthropic from '@anthropic-ai/sdk';
import type { BlogRequest, BlogResult, BlogSection, ImageGuide } from './types';

let client: Anthropic | null = null;

function getClient(): Anthropic {
  if (!client) {
    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey) throw new Error('ANTHROPIC_API_KEY not set');
    client = new Anthropic({ apiKey });
  }
  return client;
}

const STYLE_LABELS: Record<string, string> = {
  informational: '정보 전달형',
  review: '리뷰/후기형',
  howto: '방법/튜토리얼형',
  listicle: '리스트형 (OO가지)',
  comparison: '비교 분석형',
  story: '에세이/스토리형',
};

const TONE_LABELS: Record<string, string> = {
  professional: '전문적이고 신뢰감 있는',
  friendly: '친근하고 대화하듯',
  casual: '편한 말투, 구어체',
  formal: '격식 있는 존댓말',
};

const LENGTH_RANGES: Record<string, string> = {
  short: '800~1200자',
  medium: '1500~2500자',
  long: '3000~4500자',
};

function buildPrompt(req: BlogRequest): string {
  return `당신은 네이버 블로그 SEO 전문 작가입니다.

## 작성 요청

- **주제**: ${req.topic}
- **핵심 키워드**: ${req.keywords.join(', ')}
- **글 형식**: ${STYLE_LABELS[req.style] || req.style}
- **톤앤매너**: ${TONE_LABELS[req.tone] || req.tone}
- **목표 분량**: ${LENGTH_RANGES[req.length] || req.length}
- **소제목 수**: ${req.sections}개
- **이미지 가이드**: ${req.imageGuide ? '포함' : '미포함'}

## 출력 형식 (반드시 아래 JSON 구조로 출력)

\`\`\`json
{
  "title": "블로그 제목 (네이버 검색에 최적화된 30자 내외)",
  "subtitle": "부제목 또는 한 줄 요약",
  "sections": [
    {
      "heading": "소제목",
      "body": "본문 내용 (마크다운 불릿·볼드 허용)",
      "imageSlot": true
    }
  ],
  "tags": ["태그1", "태그2", "태그3", "태그4", "태그5"],
  "seoTitle": "검색 노출용 제목 (핵심 키워드 포함 40자 이내)",
  "seoDescription": "메타 설명 (120자 이내, 키워드 자연스럽게 포함)",
  "imageGuides": [
    {
      "position": "섹션 제목 또는 위치",
      "description": "어떤 이미지가 적합한지 설명",
      "searchKeyword": "이미지 검색 키워드",
      "altText": "대체 텍스트"
    }
  ]
}
\`\`\`

## 작성 규칙

1. 네이버 블로그 검색 상위 노출을 위해 핵심 키워드를 제목·첫 문단·소제목에 자연스럽게 배치
2. 각 소제목(heading) 아래 본문은 구체적이고 실용적인 정보 포함
3. 첫 문단은 독자의 공감 또는 궁금증을 유발하는 도입부
4. 마지막 섹션은 요약 또는 CTA(댓글 유도, 공유 요청 등)
5. 본문에서 핵심 키워드는 전체 글의 2~3% 밀도로 자연스럽게 반복
6. imageSlot이 true인 섹션에는 반드시 imageGuides에 해당 위치의 이미지 가이드 포함
7. 태그는 5~8개, 관련 검색어와 롱테일 키워드 조합
8. JSON만 출력 — 설명이나 마크다운 코드블록 바깥 텍스트 금지`;
}

export async function generateBlogPost(req: BlogRequest): Promise<BlogResult> {
  const hasApiKey = !!process.env.ANTHROPIC_API_KEY;

  if (hasApiKey) {
    try {
      const ai = getClient();
      const response = await ai.messages.create({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 4096,
        messages: [
          { role: 'user', content: buildPrompt(req) },
        ],
      });

      const text = response.content
        .filter((b): b is Anthropic.TextBlock => b.type === 'text')
        .map((b) => b.text)
        .join('');

      // JSON 파싱 (코드블록 래핑 제거)
      const jsonStr = text.replace(/^```json?\s*/i, '').replace(/\s*```$/i, '').trim();
      const parsed = JSON.parse(jsonStr);

      const sections: BlogSection[] = (parsed.sections || []).map((s: Record<string, unknown>) => ({
        heading: String(s.heading || ''),
        body: String(s.body || ''),
        imageSlot: Boolean(s.imageSlot),
      }));

      const imageGuides: ImageGuide[] = (parsed.imageGuides || []).map((g: Record<string, unknown>) => ({
        position: String(g.position || ''),
        description: String(g.description || ''),
        searchKeyword: String(g.searchKeyword || ''),
        altText: String(g.altText || ''),
      }));

      const totalChars = sections.reduce((sum, s) => sum + s.heading.length + s.body.length, 0);

      return {
        success: true,
        data: {
          title: String(parsed.title || ''),
          subtitle: String(parsed.subtitle || ''),
          content: sections,
          tags: Array.isArray(parsed.tags) ? parsed.tags.map(String) : [],
          seoTitle: String(parsed.seoTitle || ''),
          seoDescription: String(parsed.seoDescription || ''),
          imageGuides,
          meta: {
            charCount: totalChars,
            sectionCount: sections.length,
            estimatedReadTime: `${Math.max(1, Math.round(totalChars / 500))}분`,
            generatedAt: new Date().toISOString(),
            model: 'claude-sonnet-4-20250514',
          },
        },
      };
    } catch (err) {
      console.error('[BlogGenerator] AI error, using fallback:', err);
    }
  }

  // Fallback (API 키 없거나 실패 시)
  return buildFallback(req);
}

function buildFallback(req: BlogRequest): BlogResult {
  const sections: BlogSection[] = [];
  for (let i = 0; i < req.sections; i++) {
    if (i === 0) {
      sections.push({
        heading: `${req.topic}이란?`,
        body: `${req.keywords[0] || req.topic}에 대해 알아보겠습니다. 이 글에서는 ${req.topic}의 핵심 내용을 정리해 드립니다.`,
        imageSlot: req.imageGuide,
      });
    } else if (i === req.sections - 1) {
      sections.push({
        heading: '마치며',
        body: `지금까지 ${req.topic}에 대해 알아보았습니다. 도움이 되셨다면 댓글과 공감 부탁드립니다!`,
      });
    } else {
      sections.push({
        heading: `포인트 ${i}`,
        body: `${req.topic} 관련 상세 내용이 이 자리에 들어갑니다. AI API 키 설정 후 실제 콘텐츠가 생성됩니다.`,
        imageSlot: i % 2 === 0 && req.imageGuide,
      });
    }
  }

  return {
    success: true,
    data: {
      title: `${req.topic} — 완벽 가이드`,
      subtitle: `${req.keywords.join(', ')} 핵심 정리`,
      content: sections,
      tags: req.keywords.slice(0, 5),
      seoTitle: `${req.topic} ${req.keywords[0] || ''} 총정리`,
      seoDescription: `${req.topic}에 대한 핵심 정보를 정리했습니다.`,
      imageGuides: req.imageGuide
        ? [{ position: '도입부', description: '주제 대표 이미지', searchKeyword: req.keywords[0] || req.topic, altText: req.topic }]
        : [],
      meta: {
        charCount: sections.reduce((s, sec) => s + sec.heading.length + sec.body.length, 0),
        sectionCount: sections.length,
        estimatedReadTime: '1분',
        generatedAt: new Date().toISOString(),
        model: 'fallback (no API key)',
      },
    },
  };
}
