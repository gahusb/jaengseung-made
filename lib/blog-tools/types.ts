export interface BlogRequest {
  topic: string;
  keywords: string[];
  style: BlogStyle;
  tone: BlogTone;
  length: BlogLength;
  imageGuide: boolean;
  sections: number;
}

export type BlogStyle =
  | 'informational'   // 정보 전달
  | 'review'          // 리뷰/후기
  | 'howto'           // 방법/튜토리얼
  | 'listicle'        // 리스트형
  | 'comparison'      // 비교 분석
  | 'story';          // 에세이/스토리

export type BlogTone =
  | 'professional'    // 전문적
  | 'friendly'        // 친근한
  | 'casual'          // 캐주얼
  | 'formal';         // 격식체

export type BlogLength =
  | 'short'           // 800~1200자
  | 'medium'          // 1500~2500자
  | 'long';           // 3000~4500자

export interface BlogResult {
  success: true;
  data: {
    title: string;
    subtitle: string;
    content: BlogSection[];
    tags: string[];
    seoTitle: string;
    seoDescription: string;
    imageGuides: ImageGuide[];
    meta: {
      charCount: number;
      sectionCount: number;
      estimatedReadTime: string;
      generatedAt: string;
      model: string;
    };
  };
}

export interface BlogSection {
  heading: string;
  body: string;
  imageSlot?: boolean;
}

export interface ImageGuide {
  position: string;
  description: string;
  searchKeyword: string;
  altText: string;
}
