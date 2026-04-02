import { NextResponse } from 'next/server';
import { generateBlogPost } from '@/lib/blog-tools/generator';
import type { BlogStyle, BlogTone, BlogLength } from '@/lib/blog-tools/types';

export const maxDuration = 60;

const VALID_STYLES: BlogStyle[] = ['informational', 'review', 'howto', 'listicle', 'comparison', 'story'];
const VALID_TONES: BlogTone[] = ['professional', 'friendly', 'casual', 'formal'];
const VALID_LENGTHS: BlogLength[] = ['short', 'medium', 'long'];

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { topic, keywords, style, tone, length, imageGuide, sections } = body;

    // 유효성 검증
    if (!topic || typeof topic !== 'string' || topic.trim().length === 0) {
      return NextResponse.json({ success: false, error: '주제를 입력해주세요.' }, { status: 400 });
    }

    if (topic.trim().length > 100) {
      return NextResponse.json({ success: false, error: '주제는 100자 이내로 입력해주세요.' }, { status: 400 });
    }

    if (!Array.isArray(keywords) || keywords.length === 0) {
      return NextResponse.json({ success: false, error: '키워드를 최소 1개 입력해주세요.' }, { status: 400 });
    }

    if (keywords.length > 10) {
      return NextResponse.json({ success: false, error: '키워드는 최대 10개까지 가능합니다.' }, { status: 400 });
    }

    if (!VALID_STYLES.includes(style)) {
      return NextResponse.json({ success: false, error: '유효하지 않은 글 형식입니다.' }, { status: 400 });
    }

    if (!VALID_TONES.includes(tone)) {
      return NextResponse.json({ success: false, error: '유효하지 않은 톤입니다.' }, { status: 400 });
    }

    if (!VALID_LENGTHS.includes(length)) {
      return NextResponse.json({ success: false, error: '유효하지 않은 분량입니다.' }, { status: 400 });
    }

    const sectionCount = Math.min(Math.max(Number(sections) || 4, 3), 8);

    const result = await generateBlogPost({
      topic: topic.trim(),
      keywords: keywords.map((k: string) => k.trim()).filter(Boolean),
      style,
      tone,
      length,
      imageGuide: Boolean(imageGuide),
      sections: sectionCount,
    });

    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    console.error('[NaverBlog] Generate error:', error);
    return NextResponse.json(
      { success: false, error: '블로그 글 생성 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}
