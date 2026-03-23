import React, { useState, useRef } from 'react';
import { useAppStore } from '../../store/useAppStore';
import { calculateDDay, getEffectiveNextBillingDate, formatKoreanDate } from '../../utils/date';
import { formatCurrency, convertToKRW, formatKoreanCurrency } from '../../utils/currency';
import { Trash2, Pencil } from 'lucide-react';
import BottomSheet from '../common/BottomSheet';
import EditSubForm from './EditSubForm';
import type { Subscription } from '../../types';
import { POPULAR_SERVICES, type PresetService } from '../../data/presets';

interface SubscriptionListProps {
  onQuickAdd?: (service: PresetService) => void;
  onAddNew?: () => void;
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

  const { exchangeRate } = useAppStore();
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
          {sub.currency === 'USD' && (
            <span className="text-xs text-toss-gray-400">
              {formatKoreanCurrency(Math.round(convertToKRW(sub.price, sub.currency, exchangeRate)))}
            </span>
          )}
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

const LOGO_POSITIONS = [
  { top: '8%',  left: '4%',  size: 44, delay: '0ms' },
  { top: '0%',  left: '38%', size: 52, delay: '60ms' },
  { top: '5%',  left: '72%', size: 40, delay: '120ms' },
  { top: '48%', left: '82%', size: 46, delay: '180ms' },
  { top: '72%', left: '62%', size: 38, delay: '240ms' },
  { top: '78%', left: '22%', size: 48, delay: '300ms' },
  { top: '44%', left: '2%',  size: 42, delay: '360ms' },
];

const SubscriptionList: React.FC<SubscriptionListProps> = ({ onAddNew }) => {
  const { subscriptions, removeSubscription } = useAppStore();
  const [editingSub, setEditingSub] = useState<Subscription | null>(null);
  const [detailSub, setDetailSub] = useState<Subscription | null>(null);

  // Landing page
  if (subscriptions.length === 0) {
    const displayServices = POPULAR_SERVICES.slice(0, 7);
    return (
      <div className="flex flex-col px-1 pt-2 pb-10">
        {/* Hero - dark card with floating logos */}
        <div
          className="relative w-full rounded-[28px] overflow-hidden mb-7"
          style={{ height: 280, background: 'linear-gradient(145deg, #0f1923 0%, #1a2a3a 60%, #0d2137 100%)' }}
        >
          {/* Subtle grid pattern */}
          <div
            className="absolute inset-0 opacity-[0.06]"
            style={{
              backgroundImage: 'linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)',
              backgroundSize: '32px 32px',
            }}
          />

          {/* Floating service logos */}
          {displayServices.map((service, i) => {
            const pos = LOGO_POSITIONS[i];
            const s = pos.size;
            return (
              <div
                key={service.id}
                className="absolute bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl flex items-center justify-center p-2"
                style={{ top: pos.top, left: pos.left, width: s, height: s }}
              >
                <img src={service.logo} alt={service.name} className="w-full h-full object-contain rounded-lg" />
              </div>
            );
          })}

          {/* Center mock teaser */}
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-1">
            <p className="text-white/50 text-xs font-medium tracking-widest uppercase">이번 달 AI 구독료</p>
            <p className="text-white font-extrabold text-[38px] tracking-tight" style={{ filter: 'blur(7px)', userSelect: 'none' }}>
              ₩89,000
            </p>
            <div className="flex items-center gap-1.5 mt-1">
              <div className="w-1.5 h-1.5 rounded-full bg-toss-blue" />
              <p className="text-white/40 text-xs">등록 후 확인할 수 있어요</p>
            </div>
          </div>
        </div>

        {/* Copy */}
        <div className="px-1 mb-8">
          <h2 className="text-[26px] font-extrabold text-toss-gray-900 leading-tight mb-2.5">
            AI 구독료,<br/>한눈에 파악해요
          </h2>
          <p className="text-[15px] text-toss-gray-400 leading-relaxed">
            ChatGPT, Claude, Cursor…<br/>
            여기저기 흩어진 구독을 모아서<br/>
            매달 얼마 나가는지 바로 알 수 있어요.
          </p>
        </div>

        {/* CTA */}
        <button
          type="button"
          onClick={onAddNew}
          className="w-full h-[56px] rounded-2xl bg-toss-blue text-white font-bold text-[16px] shadow-lg active:scale-[0.97] transition-all"
          style={{ boxShadow: '0 8px 24px rgba(49,130,246,0.35)' }}
        >
          첫 구독 등록하기
        </button>
        <p className="text-center text-xs text-toss-gray-300 mt-3">무료 · 데이터는 내 기기에만 저장돼요</p>
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
