import React from 'react';
import { useAppStore } from '../../store/useAppStore';
import { convertToKRW, formatKoreanCurrency } from '../../utils/currency';

const DashboardCard: React.FC = () => {
  const { subscriptions, exchangeRate } = useAppStore();

  if (subscriptions.length === 0) return null;

  // Calculate per-service monthly KRW costs
  const serviceCosts = subscriptions.map((sub) => {
    let monthly = convertToKRW(sub.price, sub.currency, exchangeRate);
    if (sub.billingCycle === 'YEARLY') monthly = monthly / 12;
    return { name: sub.serviceName, color: sub.logoColor || '#3182F6', monthly };
  });

  const totalMonthly = serviceCosts.reduce((acc, s) => acc + s.monthly, 0);
  const totalYearly = totalMonthly * 12;

  // Top services sorted by cost desc
  const sorted = [...serviceCosts].sort((a, b) => b.monthly - a.monthly);

  return (
    <div className="toss-card">
      {/* Monthly total - biggest emphasis */}
      <p className="text-sm font-medium text-toss-gray-600 mb-2">
        이번 달 AI 월세{subscriptions.length > 0 && ` (${subscriptions.length}개)`}
      </p>
      <div className="flex items-baseline gap-1.5">
        <h2 className="text-[34px] font-extrabold text-toss-gray-900 tracking-tight">
          {formatKoreanCurrency(Math.round(totalMonthly))}
        </h2>
      </div>

      {/* Yearly total */}
      <p className="text-sm text-toss-gray-400 mt-1">
        연간 <span className="font-bold text-toss-gray-600">{formatKoreanCurrency(Math.round(totalYearly))}</span> 예상
      </p>

      {/* Spending bar */}
      {subscriptions.length > 1 && (
        <div className="mt-5">
          <div className="flex rounded-full h-2.5 overflow-hidden gap-0.5">
            {sorted.map((s, i) => (
              <div
                key={i}
                className="h-full rounded-full first:rounded-l-full last:rounded-r-full transition-all"
                style={{
                  backgroundColor: s.color,
                  width: `${(s.monthly / totalMonthly) * 100}%`,
                  minWidth: '4px',
                }}
              />
            ))}
          </div>
          <div className="flex flex-wrap gap-x-4 gap-y-1 mt-3">
            {sorted.slice(0, 4).map((s, i) => (
              <div key={i} className="flex items-center gap-1.5">
                <div
                  className="w-2 h-2 rounded-full shrink-0"
                  style={{ backgroundColor: s.color }}
                />
                <span className="text-xs text-toss-gray-500">
                  {s.name}{' '}
                  <span className="font-semibold text-toss-gray-700">
                    {Math.round((s.monthly / totalMonthly) * 100)}%
                  </span>
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Exchange rate */}
      <div className="mt-4 pt-4 border-t border-toss-gray-100 flex justify-between items-center text-xs text-toss-gray-400">
        <span>{subscriptions.length}개 서비스 구독 중</span>
        <span className="font-semibold text-toss-gray-500">
          1 USD = {exchangeRate.toLocaleString()}원
        </span>
      </div>
    </div>
  );
};

export default DashboardCard;
