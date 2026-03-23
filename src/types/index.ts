export type BillingCycle = 'MONTHLY' | 'YEARLY';
export type Currency = 'USD' | 'KRW';

export interface Subscription {
  id: string; // UUID
  serviceName: string; // 예: "ChatGPT Plus"
  price: number; // 예: 20
  currency: Currency; 
  billingCycle: BillingCycle;
  nextBillingDate: string; // ISO 8601 string (YYYY-MM-DD)
  logoColor?: string; // UI 표시용 테마 컬러
  logoUrl?: string;   // 서비스 로고 이미지 경로
}

export interface AppState {
  subscriptions: Subscription[];
  exchangeRate: number; // USD to KRW 환율 (기본값: 1350)
  addSubscription: (sub: Omit<Subscription, 'id'>) => void;
  updateSubscription: (id: string, sub: Partial<Subscription>) => void;
  removeSubscription: (id: string) => void;
  setExchangeRate: (rate: number) => void;
}
