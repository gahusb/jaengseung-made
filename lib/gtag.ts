export const GA_ID = 'G-WG77RNHXRK';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
declare global { interface Window { gtag?: (...args: any[]) => void } }

export function trackEvent(
  eventName: string,
  params?: Record<string, string | number>,
) {
  if (typeof window !== 'undefined' && typeof window.gtag === 'function') {
    window.gtag('event', eventName, params);
  }
}

/** CTA 클릭 추적 */
export function trackCTAClick(label: string, page?: string) {
  trackEvent('cta_click', {
    event_category: 'engagement',
    event_label: label,
    page_location: page || (typeof window !== 'undefined' ? window.location.pathname : ''),
  });
}

/** 도구 체험/데모 클릭 */
export function trackToolDemo(toolName: string) {
  trackEvent('tool_demo_click', {
    event_category: 'engagement',
    tool_name: toolName,
  });
}

/** 무료 도구 다운로드 */
export function trackDownload(toolName: string) {
  trackEvent('file_download', {
    event_category: 'conversion',
    file_name: toolName,
  });
}

/** 외부 링크 클릭 (크몽 등) */
export function trackOutboundClick(url: string, label: string) {
  trackEvent('outbound_click', {
    event_category: 'outbound',
    event_label: label,
    link_url: url,
  });
}
