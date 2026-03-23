import React, { useState, useRef } from 'react';
import { useAppStore } from '../../store/useAppStore';
import { calculateDDay, getEffectiveNextBillingDate, formatKoreanDate } from '../../utils/date';
import { formatCurrency } from '../../utils/currency';
import { Trash2, Pencil } from 'lucide-react';
import BottomSheet from '../common/BottomSheet';
import EditSubForm from './EditSubForm';
import type { Subscription } from '../../types';
import { POPULAR_SERVICES, type PresetService } from '../../data/presets';

interface SubscriptionListProps {
  onQuickAdd?: (service: PresetService) => void;
}

// Logo component: shows real logo if available, fallback to colored circle
const SubLogo: React.FC<{ sub: Subscription; size?: string }> = ({ sub, size = 'w-12 h-12' }) => {
  if (sub.logoUrl) {
    return (
      <div className={`${size} rounded-2xl flex items-center justify-center shrink-0 p-1.5 bg-white border border-toss-gray-100`}>
        <img src={sub.logoUrl} alt={sub.serviceName} className="w-full h-full object-contain rounded-lg" />
      </div>
    );
  }
  return (
    <div
      className={`${size} rounded-full flex items-center justify-center text-white font-bold text-lg shrink-0`}
      style={{ backgroundColor: sub.logoColor || '#3182F6' }}
    >
      {sub.serviceName.charAt(0).toUpperCase()}
    </div>
  );
};

// Swipeable card component
const SwipeableCard: React.FC<{
  sub: Subscription;
  onEdit: () => void;
  onDelete: () => void;
  onClick: () => void;
}> = ({ sub, onEdit, onDelete, onClick }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const startX = useRef(0);
  const currentX = useRef(0);
  const [offset, setOffset] = useState(0);
  const [swiping, setSwiping] = useState(false);

  const THRESHOLD = 70;

  const handleTouchStart = (e: React.TouchEvent) => {
    startX.current = e.touches[0].clientX;
    currentX.current = startX.current;
    setSwiping(true);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!swiping) return;
    currentX.current = e.touches[0].clientX;
    const diff = currentX.current - startX.current;
    const clamped = Math.max(-120, Math.min(120, diff));
    setOffset(clamped);
  };

  const handleTouchEnd = () => {
    setSwiping(false);
    if (offset < -THRESHOLD) {
      setOffset(-120);
      setTimeout(() => {
        onDelete();
        setOffset(0);
      }, 200);
    } else if (offset > THRESHOLD) {
      setOffset(0);
      onEdit();
    } else {
      setOffset(0);
    }
  };

  const effectiveDate = getEffectiveNextBillingDate(sub.nextBillingDate, sub.billingCycle);
  const dday = calculateDDay(effectiveDate);

  return (
    <div className="relative overflow-hidden rounded-toss">
      <div className="absolute inset-0 flex">
        <div className="flex items-center justify-center bg-toss-blue text-white w-[120px]">
          <div className="flex flex-col items-center gap-1">
            <Pencil className="w-5 h-5" />
            <span className="text-xs font-bold">수정</span>
          </div>
        </div>
        <div className="flex-1" />
        <div className="flex items-center justify-center bg-toss-red text-white w-[120px]">
          <div className="flex flex-col items-center gap-1">
            <Trash2 className="w-5 h-5" />
            <span className="text-xs font-bold">삭제</span>
          </div>
        </div>
      </div>

      <div
        ref={containerRef}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onClick={() => offset === 0 && onClick()}
        className="relative bg-white p-4 flex items-center justify-between cursor-pointer active:bg-toss-gray-50 transition-colors"
        style={{
          transform: `translateX(${offset}px)`,
          transition: swiping ? 'none' : 'transform 0.25s ease-out',
        }}
      >
        <div className="flex items-center gap-4">
          <SubLogo sub={sub} />
          <div className="flex flex-col">
            <span className="text-[17px] font-bold text-toss-gray-800 leading-tight">
              {sub.serviceName}
            </span>
            <span className="text-sm text-toss-gray-500 mt-0.5">
              {formatKoreanDate(effectiveDate)} · {sub.billingCycle === 'MONTHLY' ? '매월' : '매년'}
            </span>
          </div>
        </div>
        <div className="flex flex-col items-end">
          <span className="text-lg font-bold text-toss-gray-900">
            {formatCurrency(sub.price, sub.currency)}
          </span>
          <span
            className={
              dday === 'D-Day'
                ? 'text-toss-red text-xs font-bold'
                : 'text-toss-blue text-xs font-semibold'
            }
          >
            {dday}
          </span>
        </div>
      </div>
    </div>
  );
};

const SubscriptionList: React.FC<SubscriptionListProps> = ({ onQuickAdd }) => {
  const { subscriptions, removeSubscription } = useAppStore();
  const [editingSub, setEditingSub] = useState<Subscription | null>(null);
  const [detailSub, setDetailSub] = useState<Subscription | null>(null);

  // Empty state
  if (subscriptions.length === 0) {
    return (
      <div className="flex flex-col items-center pt-16 pb-8 px-2">
        <div className="w-16 h-16 bg-toss-gray-100 rounded-full flex items-center justify-center mb-6">
          <span className="text-3xl">🤖</span>
        </div>
        <h3 className="text-xl font-bold text-toss-gray-900 mb-2">
          아직 등록한 구독이 없어요
        </h3>
        <p className="text-sm text-toss-gray-500 mb-8 text-center">
          쓰고 있는 AI 서비스를 탭해서 바로 등록해보세요
        </p>

        <div className="w-full grid grid-cols-2 gap-3">
          {POPULAR_SERVICES.map((service) => (
            <button
              key={service.id}
              type="button"
              onClick={() => onQuickAdd?.(service)}
              className="flex items-center gap-3 p-4 bg-white rounded-toss border border-toss-gray-100 active:scale-[0.97] transition-all text-left shadow-sm"
            >
              <div className="w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 p-1.5 bg-white border border-toss-gray-100">
                <img src={service.logo} alt={service.name} className="w-full h-full object-contain rounded-lg" />
              </div>
              <div className="flex flex-col min-w-0">
                <span className="text-[14px] font-bold text-toss-gray-800 truncate">
                  {service.name}
                </span>
                <span className="text-xs text-toss-gray-400">
                  {service.plans.length}개 요금제
                </span>
              </div>
            </button>
          ))}
        </div>

      </div>
    );
  }

  const listItems = subscriptions.map((sub) => (
    <SwipeableCard
      key={sub.id}
      sub={sub}
      onEdit={() => setEditingSub(sub)}
      onDelete={() => removeSubscription(sub.id)}
      onClick={() => setDetailSub(sub)}
    />
  ));

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between px-1 mb-1">
        <h3 className="text-sm font-semibold text-toss-gray-600">내 구독 목록</h3>
        <span className="text-xs text-toss-gray-400">← 수정 | 삭제 →</span>
      </div>

      {listItems}

      {/* Detail bottom sheet */}
      <BottomSheet
        isOpen={!!detailSub}
        onClose={() => setDetailSub(null)}
        title={detailSub?.serviceName || ''}
      >
        {detailSub && (
          <div className="flex flex-col gap-5 pb-6">
            <div className="flex items-center gap-4">
              <SubLogo sub={detailSub} size="w-16 h-16" />
              <div>
                <p className="text-xl font-bold text-toss-gray-900">{detailSub.serviceName}</p>
                <p className="text-sm text-toss-gray-500 mt-0.5">
                  {formatCurrency(detailSub.price, detailSub.currency)} /{' '}
                  {detailSub.billingCycle === 'MONTHLY' ? '매월' : '매년'}
                </p>
              </div>
            </div>

            <div className="bg-toss-gray-50 rounded-toss p-4 flex flex-col gap-3">
              <div className="flex justify-between text-sm">
                <span className="text-toss-gray-500">다음 결제일</span>
                <span className="font-bold text-toss-gray-800">
                  {formatKoreanDate(
                    getEffectiveNextBillingDate(detailSub.nextBillingDate, detailSub.billingCycle)
                  )}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-toss-gray-500">결제 주기</span>
                <span className="font-bold text-toss-gray-800">
                  {detailSub.billingCycle === 'MONTHLY' ? '매월' : '매년'}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-toss-gray-500">통화</span>
                <span className="font-bold text-toss-gray-800">{detailSub.currency}</span>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => {
                  setDetailSub(null);
                  setTimeout(() => setEditingSub(detailSub), 300);
                }}
                className="flex-1 h-12 rounded-toss bg-toss-gray-100 text-toss-gray-700 font-bold active:scale-[0.97] transition-all flex items-center justify-center gap-2"
              >
                <Pencil className="w-4 h-4" />
                수정
              </button>
              <button
                onClick={() => {
                  removeSubscription(detailSub.id);
                  setDetailSub(null);
                }}
                className="flex-1 h-12 rounded-toss bg-red-50 text-toss-red font-bold active:scale-[0.97] transition-all flex items-center justify-center gap-2"
              >
                <Trash2 className="w-4 h-4" />
                삭제
              </button>
            </div>
          </div>
        )}
      </BottomSheet>

      {/* Edit bottom sheet */}
      <BottomSheet
        isOpen={!!editingSub}
        onClose={() => setEditingSub(null)}
        title="구독 수정하기"
      >
        {editingSub && (
          <EditSubForm
            subscription={editingSub}
            onSuccess={() => setEditingSub(null)}
            onCancel={() => setEditingSub(null)}
          />
        )}
      </BottomSheet>
    </div>
  );
};

export default SubscriptionList;
