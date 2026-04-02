import * as cheerio from 'cheerio';
import type { CrawlResult } from './types';

// 크롤러 설정
const CRAWL_CONFIG = {
  rockAuto: {
    baseUrl: 'https://www.rockauto.com',
    searchUrl: 'https://www.rockauto.com/en/partsearch/',
    type: 'http' as const,
    rateLimit: 3000, // ms between requests
  },
  // 향후 사이트 추가
};

// User-Agent 로테이션
const USER_AGENTS = [
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36',
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:128.0) Gecko/20100101 Firefox/128.0',
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.0 Safari/605.1.15',
];

function getRandomUA() {
  return USER_AGENTS[Math.floor(Math.random() * USER_AGENTS.length)];
}

// 딜레이 함수
function delay(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// HTTP 기반 크롤러
async function fetchPage(url: string): Promise<string> {
  const response = await fetch(url, {
    headers: {
      'User-Agent': getRandomUA(),
      'Accept': 'text/html,application/xhtml+xml',
      'Accept-Language': 'en-US,en;q=0.9',
    },
  });
  if (!response.ok) throw new Error(`HTTP ${response.status}`);
  return response.text();
}

// RockAuto 검색
export async function crawlRockAuto(partNumber: string): Promise<CrawlResult> {
  try {
    const searchUrl = `${CRAWL_CONFIG.rockAuto.searchUrl}?partnum=${encodeURIComponent(partNumber)}`;
    const html = await fetchPage(searchUrl);
    const $ = cheerio.load(html);

    // RockAuto 검색 결과 파싱
    // MVP: 기본 구조만 추출 (실제 셀렉터는 사이트 구조에 따라 조정 필요)
    const results: Record<string, unknown> = {
      searchUrl,
      title: $('title').text().trim(),
      // 부품 정보 추출 시도
      parts: [] as Array<Record<string, string>>,
    };

    // 검색 결과에서 부품 정보 추출 시도
    // RockAuto의 실제 DOM 구조에 맞게 셀렉터 조정 필요
    const partsList: Array<Record<string, string>> = [];
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    $('[id^="vPRD"]').each((_: number, el: any) => {
      const $el = $(el);
      partsList.push({
        name: $el.find('.listing-text-row-moreinfo-truck').text().trim() || $el.text().trim().slice(0, 100),
        price: $el.find('.listing-final-price').text().trim(),
        brand: $el.find('.listing-text-row-moreinfo-pair .listing-text-row-moreinfo-value').first().text().trim(),
      });
    });
    results.parts = partsList;

    // 페이지 전체 텍스트도 보관 (AI 분석용)
    results.pageText = $('body').text().replace(/\s+/g, ' ').trim().slice(0, 5000);

    return { source: 'RockAuto', success: true, data: results };
  } catch (error) {
    return {
      source: 'RockAuto',
      success: false,
      data: {},
      error: error instanceof Error ? error.message : String(error),
    };
  }
}

// eBay 검색 (공식 API — MVP에서는 간소화된 Browse API 호출)
export async function searchEbay(partNumber: string): Promise<CrawlResult> {
  try {
    // eBay Browse API (인증 필요 — MVP에서는 비인증 검색)
    // 실제 구현 시 OAuth 토큰 필요
    const searchUrl = `https://www.ebay.com/sch/i.html?_nkw=${encodeURIComponent(partNumber)}&_sacat=6028`;
    const html = await fetchPage(searchUrl);
    const $ = cheerio.load(html);

    const listings: Array<Record<string, string>> = [];
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    $('.s-item').slice(0, 5).each((_: number, el: any) => {
      const $el = $(el);
      listings.push({
        title: $el.find('.s-item__title').text().trim(),
        price: $el.find('.s-item__price').text().trim(),
        url: $el.find('.s-item__link').attr('href') || '',
      });
    });

    return {
      source: 'eBay',
      success: true,
      data: { listings, searchUrl, pageText: $('body').text().replace(/\s+/g, ' ').trim().slice(0, 3000) },
    };
  } catch (error) {
    return {
      source: 'eBay',
      success: false,
      data: {},
      error: error instanceof Error ? error.message : String(error),
    };
  }
}

// 메인 크롤링 오케스트레이터
export async function crawlAll(partNumber: string): Promise<CrawlResult[]> {
  const results: CrawlResult[] = [];

  // 순차 실행 (rate limiting 준수)
  results.push(await crawlRockAuto(partNumber));
  await delay(CRAWL_CONFIG.rockAuto.rateLimit);
  results.push(await searchEbay(partNumber));

  return results;
}
