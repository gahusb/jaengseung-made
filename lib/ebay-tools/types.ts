export interface SearchRequest {
  partNumber: string;
  partName?: string;
}

export interface BasicInfo {
  partNumber: string;
  partName: string;
  brand: string;
  oemNumbers: string[];
  category: string;
  imageUrl?: string;
}

export interface ListingInfo {
  title: string;
  category: string;
  itemSpecifics: Record<string, string>;
}

export interface FitmentEntry {
  year: string;
  make: string;
  model: string;
  engine: string;
  confidence: 'high' | 'medium' | 'low';
  source: string;
}

export interface PriceSource {
  site: string;
  price: number;
  currency: string;
  url: string;
}

export interface PricingInfo {
  sources: PriceSource[];
  exchangeRate: { rate: number; source: string; date: string };
  customs: {
    hsCode: string;
    dutyRate: string;
    estimatedDuty: number;
    vat: number;
    totalImportCost: number;
    isExempt: boolean;
    disclaimer: string;
  };
}

export interface SearchResult {
  success: boolean;
  data: {
    basicInfo: BasicInfo;
    listing: ListingInfo;
    fitment: FitmentEntry[];
    pricing: PricingInfo;
    rawData: Record<string, unknown>;
    meta: {
      searchedAt: string;
      sourcesChecked: string[];
      processingTime: string;
      aiModel: string;
    };
  };
  error?: string;
}

export interface CrawlResult {
  source: string;
  success: boolean;
  data: Record<string, unknown>;
  error?: string;
}
