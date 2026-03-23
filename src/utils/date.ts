import { differenceInDays, isPast, parseISO, addMonths, addYears, format } from 'date-fns';
import { ko } from 'date-fns/locale';
import type { BillingCycle } from '../types';

/**
 * 다음 결제일까지의 D-Day를 계산합니다.
 */
export const calculateDDay = (nextBillingDate: string): string => {
  const targetDate = parseISO(nextBillingDate);
  const now = new Date();
  
  // 시간을 자정으로 맞춰 날짜 차이만 계산 (오늘이면 0)
  now.setHours(0, 0, 0, 0);
  const target = new Date(targetDate);
  target.setHours(0, 0, 0, 0);
  
  const diffDays = differenceInDays(target, now);

  if (diffDays === 0) return 'D-Day';
  if (diffDays < 0) return `결제 완료`;
  return `D-${diffDays}`;
};

/**
 * 결제일이 지났다면 다음 결제 주기의 날짜를 계산합니다.
 */
export const getEffectiveNextBillingDate = (dateStr: string, cycle: BillingCycle): string => {
  let date = parseISO(dateStr);
  const now = new Date();
  now.setHours(0, 0, 0, 0);

  while (isPast(date) && date.getTime() < now.getTime()) {
    if (cycle === 'MONTHLY') {
      date = addMonths(date, 1);
    } else {
      date = addYears(date, 1);
    }
  }

  return format(date, 'yyyy-MM-dd');
};

/**
 * 사람이 읽기 편한 날짜 형식으로 변환 (예: 3월 25일)
 */
export const formatKoreanDate = (dateStr: string): string => {
  return format(parseISO(dateStr), 'M월 d일', { locale: ko });
};
