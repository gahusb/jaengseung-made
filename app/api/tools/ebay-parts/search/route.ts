import { NextResponse } from 'next/server';
import { crawlAll } from '@/lib/ebay-tools/crawler';
import { analyzeWithAI } from '@/lib/ebay-tools/ai-analyzer';
import { calculatePricing } from '@/lib/ebay-tools/pricing';
import type { SearchResult, PriceSource } from '@/lib/ebay-tools/types';

export const maxDuration = 60; // Vercel Pro timeout

export async function POST(request: Request) {
  const startTime = Date.now();

  try {
    const body = await request.json();
    const { partNumber, partName } = body;

    if (!partNumber || typeof partNumber !== 'string' || partNumber.trim().length === 0) {
      return NextResponse.json(
        { success: false, error: '품번을 입력해주세요.' },
        { status: 400 }
      );
    }

    const trimmedPart = partNumber.trim();

    if (trimmedPart.length > 50) {
      return NextResponse.json(
        { success: false, error: '품번은 50자 이내로 입력해주세요.' },
        { status: 400 }
      );
    }

    if (!/^[a-zA-Z0-9\s\-_.\/]+$/.test(trimmedPart)) {
      return NextResponse.json(
        { success: false, error: '품번에 허용되지 않는 문자가 포함되어 있습니다.' },
        { status: 400 }
      );
    }

    const trimmedName = partName?.trim() || undefined;

    // 1. 크롤링 (RockAuto + eBay)
    const crawlResults = await crawlAll(trimmedPart);

    // 2. AI 분석 (Claude API)
    let aiResult;
    const hasApiKey = !!process.env.ANTHROPIC_API_KEY;

    if (hasApiKey) {
      try {
        aiResult = await analyzeWithAI(trimmedPart, trimmedName, crawlResults);
      } catch (aiError) {
        console.error('[EbayParts] AI analysis failed, using fallback:', aiError);
      }
    }

    // AI 실패 또는 API 키 없으면 크롤링 데이터에서 기본 추출
    if (!aiResult) {
      aiResult = buildFallbackResult(trimmedPart, trimmedName, crawlResults);
    }

    // 3. 가격 비교 + 환율/관세 계산
    const priceSources: PriceSource[] = extractPrices(crawlResults);
    const pricing = await calculatePricing(priceSources, aiResult.basicInfo.partName);

    const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);

    const result: SearchResult = {
      success: true,
      data: {
        basicInfo: aiResult.basicInfo,
        listing: aiResult.listing,
        fitment: aiResult.fitment,
        pricing,
        rawData: Object.fromEntries(
          crawlResults.map(r => [r.source, { success: r.success, data: r.data, error: r.error }])
        ),
        meta: {
          searchedAt: new Date().toISOString(),
          sourcesChecked: crawlResults.map(r => r.source),
          processingTime: `${elapsed}s`,
          aiModel: hasApiKey ? 'claude-sonnet-4-20250514' : 'fallback (no API key)',
        },
      },
    };

    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    console.error('[EbayParts] Search error:', error);
    return NextResponse.json(
      { success: false, error: '검색 처리 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}

// 크롤링 결과에서 가격 추출
function extractPrices(crawlResults: Awaited<ReturnType<typeof crawlAll>>): PriceSource[] {
  const prices: PriceSource[] = [];

  for (const result of crawlResults) {
    if (!result.success) continue;

    if (result.source === 'RockAuto') {
      const parts = (result.data.parts as Array<{ price?: string; name?: string }>) || [];
      for (const part of parts) {
        if (part.price) {
          const numericPrice = parseFloat(part.price.replace(/[^0-9.]/g, ''));
          if (!isNaN(numericPrice) && numericPrice > 0) {
            prices.push({
              site: 'RockAuto',
              price: numericPrice,
              currency: 'USD',
              url: String(result.data.searchUrl || ''),
            });
            break; // 첫 번째 가격만
          }
        }
      }
    }

    if (result.source === 'eBay') {
      const listings = (result.data.listings as Array<{ price?: string; url?: string }>) || [];
      for (const listing of listings.slice(0, 2)) {
        if (listing.price) {
          const numericPrice = parseFloat(listing.price.replace(/[^0-9.]/g, ''));
          if (!isNaN(numericPrice) && numericPrice > 0) {
            prices.push({
              site: 'eBay (참고)',
              price: numericPrice,
              currency: 'USD',
              url: listing.url || '',
            });
          }
        }
      }
    }
  }

  return prices;
}

// AI 없이 기본 결과 생성
function buildFallbackResult(
  partNumber: string,
  partName: string | undefined,
  crawlResults: Awaited<ReturnType<typeof crawlAll>>
) {
  const name = partName || partNumber;

  return {
    basicInfo: {
      partNumber,
      partName: name,
      brand: '',
      oemNumbers: [partNumber],
      category: 'eBay Motors > Parts & Accessories > Car & Truck Parts',
    },
    listing: {
      title: `${name} ${partNumber} Auto Part`,
      category: '',
      itemSpecifics: {
        'Manufacturer Part Number': partNumber,
      },
    },
    fitment: [],
  };
}
