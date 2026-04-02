import type { PricingInfo, PriceSource } from './types';

// 환율 조회 (한국은행 공개 API 또는 fallback)
export async function getExchangeRate(): Promise<{ rate: number; source: string; date: string }> {
  try {
    // ExchangeRate-API (무료 티어)
    const res = await fetch('https://open.er-api.com/v6/latest/USD');
    if (res.ok) {
      const data = await res.json();
      return {
        rate: data.rates?.KRW || 1380,
        source: 'ExchangeRate-API',
        date: new Date().toISOString().slice(0, 10),
      };
    }
  } catch {
    // fallback
  }
  return { rate: 1380, source: 'fallback', date: new Date().toISOString().slice(0, 10) };
}

// HS Code 기반 관세율 (자동차 부품 기본)
const CUSTOMS_RATES: Record<string, { hsCode: string; rate: number }> = {
  'fuel_pump': { hsCode: '8413.30', rate: 8 },
  'brake_pad': { hsCode: '6813.81', rate: 8 },
  'filter': { hsCode: '8421.23', rate: 8 },
  'sensor': { hsCode: '9032.89', rate: 0 },
  'bearing': { hsCode: '8482.10', rate: 8 },
  'default': { hsCode: '8708.99', rate: 8 }, // 기타 자동차 부품
};

function estimateCustomsCategory(partName: string): { hsCode: string; rate: number } {
  const lower = partName.toLowerCase();
  if (lower.includes('pump')) return CUSTOMS_RATES.fuel_pump;
  if (lower.includes('brake') || lower.includes('pad')) return CUSTOMS_RATES.brake_pad;
  if (lower.includes('filter')) return CUSTOMS_RATES.filter;
  if (lower.includes('sensor')) return CUSTOMS_RATES.sensor;
  if (lower.includes('bearing')) return CUSTOMS_RATES.bearing;
  return CUSTOMS_RATES.default;
}

// 가격 정보 종합
export async function calculatePricing(
  sources: PriceSource[],
  partName: string
): Promise<PricingInfo> {
  const exchangeRate = await getExchangeRate();
  const customs = estimateCustomsCategory(partName);

  // 최저가 기준 관세 계산
  const usdPrices = sources.filter(s => s.currency === 'USD').map(s => s.price);
  const lowestUSD = usdPrices.length > 0 ? Math.min(...usdPrices) : 0;
  const krwValue = Math.round(lowestUSD * exchangeRate.rate);

  // $150 이하 소액면세 (목록통관 기준)
  const isExempt = lowestUSD <= 150;
  const estimatedDuty = isExempt ? 0 : Math.round(krwValue * (customs.rate / 100));
  // VAT = (물품가 + 관세) * 10%
  const vat = isExempt ? 0 : Math.round((krwValue + estimatedDuty) * 0.1);
  const totalImportCost = krwValue + estimatedDuty + vat;

  return {
    sources,
    exchangeRate,
    customs: {
      hsCode: customs.hsCode,
      dutyRate: `${customs.rate}%`,
      estimatedDuty,
      vat,
      totalImportCost,
      isExempt,
      disclaimer: '본 관세/부가세 계산은 참고용 추정치이며, 실제 통관 시 세관 심사에 따라 달라질 수 있습니다. 정확한 세액은 관세사에게 문의하세요.',
    },
  };
}
