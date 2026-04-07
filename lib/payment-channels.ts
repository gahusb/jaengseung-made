/**
 * 포트원 V2 결제 채널 설정
 * 포트원 admin에서 채널 추가 후 각 Channel Key를 .env.local에 설정
 */

export type PayMethod = 'CARD' | 'EASY_PAY';

export interface PaymentChannel {
  id: string;
  label: string;
  icon: string;       // SVG or emoji placeholder
  channelKey: string;
  payMethod: PayMethod;
}

export const PAYMENT_CHANNELS: PaymentChannel[] = [
  {
    id: 'card',
    label: '신용/체크카드',
    icon: '💳',
    channelKey: process.env.NEXT_PUBLIC_PORTONE_CHANNEL_KPN ?? '',
    payMethod: 'CARD',
  },
  {
    id: 'kakaopay',
    label: '카카오페이',
    icon: '🟡',
    channelKey: process.env.NEXT_PUBLIC_PORTONE_CHANNEL_KAKAOPAY ?? '',
    payMethod: 'EASY_PAY',
  },
  {
    id: 'naverpay',
    label: '네이버페이',
    icon: '🟢',
    channelKey: process.env.NEXT_PUBLIC_PORTONE_CHANNEL_NAVERPAY ?? '',
    payMethod: 'EASY_PAY',
  },
  {
    id: 'tosspay',
    label: '토스페이',
    icon: '🔵',
    channelKey: process.env.NEXT_PUBLIC_PORTONE_CHANNEL_TOSSPAY ?? '',
    payMethod: 'EASY_PAY',
  },
];

/** channelKey가 설정된 채널만 반환 */
export function getActiveChannels(): PaymentChannel[] {
  return PAYMENT_CHANNELS.filter((ch) => ch.channelKey.length > 0);
}
