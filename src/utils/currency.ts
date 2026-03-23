import type { Currency } from '../types';

/**
 * USD 금액을 KRW로 변환합니다.
 */
export const convertToKRW = (price: number, currency: Currency, exchangeRate: number): number => {
  if (currency === 'KRW') return price;
  return price * exchangeRate;
};

/**
 * 숫자를 한국어 금액 읽기 형식으로 포맷팅합니다.
 * 예: 27000 -> 2만 7,000원
 */
export const formatKoreanCurrency = (amount: number): string => {
  const formatter = new Intl.NumberFormat('ko-KR');
  
  if (amount >= 10000) {
    const man = Math.floor(amount / 10000);
    const rest = amount % 10000;
    
    if (rest === 0) return `${man}만원`;
    return `${man}만 ${formatter.format(rest)}원`;
  }
  
  return `${formatter.format(amount)}원`;
};

/**
 * 통화 기호를 포함한 기본 포맷팅
 */
export const formatCurrency = (amount: number, currency: Currency): string => {
  const symbol = currency === 'USD' ? '$' : '₩';
  return `${symbol}${amount.toLocaleString('ko-KR')}`;
};
