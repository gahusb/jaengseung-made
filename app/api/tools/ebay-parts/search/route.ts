import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { partNumber, partName } = body;

    if (!partNumber || typeof partNumber !== 'string' || partNumber.trim().length === 0) {
      return NextResponse.json(
        { success: false, error: '품번을 입력해주세요.' },
        { status: 400 }
      );
    }

    // MVP: 1.5초 딜레이로 실제 크롤링 소요 시간 시뮬레이션
    await new Promise((resolve) => setTimeout(resolve, 1500));

    const trimmedPart = partNumber.trim();
    const trimmedName = partName?.trim() || 'Fuel Pump Assembly';

    const mockData = {
      basicInfo: {
        partNumber: trimmedPart,
        partName: trimmedName,
        brand: 'Toyota / Denso',
        oemNumbers: [trimmedPart, '23220-0H040'],
        category:
          'eBay Motors > Parts & Accessories > Car & Truck Parts > Fuel System > Fuel Pumps',
      },
      listing: {
        title: `${trimmedName} For Toyota Camry 2007-2011 2.4L ${trimmedPart} OEM Denso`,
        category: '33549',
        itemSpecifics: {
          Brand: 'Denso',
          'Manufacturer Part Number': trimmedPart,
          Type: trimmedName,
          'Placement on Vehicle': 'In-Tank',
          Voltage: '12V',
          Warranty: '1 Year',
        },
      },
      fitment: [
        { year: '2007', make: 'Toyota', model: 'Camry', engine: '2.4L L4', confidence: 'high' },
        { year: '2008', make: 'Toyota', model: 'Camry', engine: '2.4L L4', confidence: 'high' },
        { year: '2009', make: 'Toyota', model: 'Camry', engine: '2.4L L4', confidence: 'high' },
        { year: '2010', make: 'Toyota', model: 'Camry', engine: '2.4L L4', confidence: 'high' },
        { year: '2011', make: 'Toyota', model: 'Camry', engine: '2.4L L4', confidence: 'high' },
        { year: '2007', make: 'Toyota', model: 'Camry', engine: '3.5L V6', confidence: 'medium' },
      ],
      pricing: {
        sources: [
          { site: 'RockAuto', price: 89.99, currency: 'USD', url: 'https://www.rockauto.com/en/catalog/toyota,2009,camry,2.4l+l4,1443745,fuel+&+air,fuel+pump+&+housing+assembly,6256' },
          { site: 'AutoZone', price: 129.99, currency: 'USD', url: 'https://www.autozone.com/fuel-delivery/fuel-pump-assembly' },
          { site: 'Amazon', price: 95.5, currency: 'USD', url: 'https://www.amazon.com/dp/B07EXAMPLE' },
        ],
        exchangeRate: { rate: 1380, source: '한국은행', date: '2026-04-02' },
        customs: { hsCode: '8413.30', dutyRate: '8%', estimatedDuty: 9920 },
      },
      rawData: {
        crawledSources: ['RockAuto', 'AutoZone', 'Amazon'],
        rawResults: {
          rockauto: { found: true, listings: 3, avgPrice: 89.99 },
          autozone: { found: true, listings: 1, avgPrice: 129.99 },
          amazon: { found: true, listings: 5, avgPrice: 95.5 },
        },
        fitmentSources: ['PartsFinder DB', 'eBay Catalog'],
        timestamp: new Date().toISOString(),
      },
      meta: {
        searchedAt: new Date().toISOString(),
        sourcesChecked: ['RockAuto', 'AutoZone', 'Amazon'],
        processingTime: '12.3s',
        aiModel: 'claude-sonnet-4-20250514',
      },
    };

    return NextResponse.json({ success: true, data: mockData }, { status: 200 });
  } catch (error) {
    console.error('[EbayParts] Search error:', error);
    return NextResponse.json(
      { success: false, error: '검색 처리 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}
