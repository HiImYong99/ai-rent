import React, { useMemo, useState, useCallback } from 'react';
import { Play, Lock } from 'lucide-react';
import { AD_IDS } from '../../config/adConfig';
import { loadFullScreenAd, showFullScreenAd } from '@apps-in-toss/web-framework';

import coffeeImg from '../../assets/comparisons/coffee.png';
import pizzaImg from '../../assets/comparisons/pizza.png';
import netflixImg from '../../assets/comparisons/netflix.png';
import lunchImg from '../../assets/comparisons/lunch.png';
import taxiImg from '../../assets/comparisons/taxi.png';
import phoneImg from '../../assets/comparisons/phone.png';

interface SpendingInsightProps {
  monthlyKRW: number;
}

interface InsightTier {
  minAmount: number;
  grade: string;
  emoji: string;
  color: string;
  bgColor: string;
  comment: string;
}

const TIERS: InsightTier[] = [
  { minAmount: 0, grade: 'AI 체험러', emoji: '🌱', color: '#00C471', bgColor: '#ECFDF5', comment: '아직 맛보기 단계예요' },
  { minAmount: 15000, grade: 'AI 입문러', emoji: '🤖', color: '#3182F6', bgColor: '#EFF6FF', comment: 'AI에 관심이 많으시네요' },
  { minAmount: 40000, grade: 'AI 파워유저', emoji: '⚡', color: '#7C3AED', bgColor: '#F5F3FF', comment: 'AI 없인 못 사는 분이시군요' },
  { minAmount: 80000, grade: 'AI 중독러', emoji: '🔥', color: '#F04452', bgColor: '#FEF2F2', comment: '당신의 AI가 월세를 내고 있어요' },
  { minAmount: 150000, grade: 'AI 재벌', emoji: '👑', color: '#D97706', bgColor: '#FFFBEB', comment: 'AI 회사 주주가 되는 게 나을지도...' },
  { minAmount: 300000, grade: 'AI 건물주', emoji: '🏰', color: '#B91C1C', bgColor: '#FEF2F2', comment: '이 정도면 AI가 당신한테 월세를 내야 해요' },
];

interface Comparison {
  image: string;
  label: string;
  calc: (amount: number) => string;
}

const COMPARISONS: Comparison[] = [
  { image: coffeeImg, label: '아메리카노', calc: (a) => `${Math.floor(a / 4500)}잔` },
  { image: pizzaImg, label: '피자', calc: (a) => `${Math.floor(a / 18000)}판` },
  { image: netflixImg, label: '넷플릭스', calc: (a) => `${(a / 17000).toFixed(1)}개월` },
  { image: lunchImg, label: '점심 한 끼', calc: (a) => `${Math.floor(a / 10000)}끼` },
  { image: taxiImg, label: '택시 기본요금', calc: (a) => `${Math.floor(a / 4800)}번` },
  { image: phoneImg, label: '5G 요금제', calc: (a) => `${(a / 69000).toFixed(1)}개월` },
];

const SpendingInsight: React.FC<SpendingInsightProps> = ({ monthlyKRW }) => {
  const [unlocked, setUnlocked] = useState(false);
  const [adState, setAdState] = useState<'idle' | 'loading' | 'done'>('idle');

  const tier = useMemo(() => {
    let current = TIERS[0];
    for (const t of TIERS) {
      if (monthlyKRW >= t.minAmount) current = t;
    }
    return current;
  }, [monthlyKRW]);

  const comparisons = useMemo(() => {
    const shuffled = [...COMPARISONS].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, 3).filter((c) => {
      const val = parseFloat(c.calc(monthlyKRW));
      return val >= 1;
    });
  }, [monthlyKRW]);

  const startRewardAd = useCallback(() => {
    if (!loadFullScreenAd.isSupported()) {
      setUnlocked(true);
      return;
    }
    setAdState('loading');
    loadFullScreenAd({
      options: { adGroupId: AD_IDS.REWARD_INSIGHT },
      onEvent: (event) => {
        if (event.type === 'loaded') {
          showFullScreenAd({
            options: { adGroupId: AD_IDS.REWARD_INSIGHT },
            onEvent: (showEvent) => {
              if (showEvent.type === 'userEarnedReward') {
                setUnlocked(true);
                setAdState('done');
              } else if (showEvent.type === 'dismissed') {
                setAdState('idle');
              }
            },
            onError: () => setAdState('idle'),
          });
        }
      },
      onError: () => setAdState('idle'),
    });
  }, []);

  if (monthlyKRW <= 0) return null;

  // ── Locked: CTA to watch ad ──
  if (!unlocked && adState === 'idle') {
    return (
      <div className="toss-card flex flex-col items-center py-6">
        <div className="w-14 h-14 rounded-full bg-toss-gray-100 flex items-center justify-center mb-4">
          <Lock className="w-6 h-6 text-toss-gray-400" />
        </div>
        <p className="text-[17px] font-bold text-toss-gray-800 mb-1">
          나의 AI 월세 분석
        </p>
        <p className="text-sm text-toss-gray-400 mb-5 text-center leading-relaxed">
          등급과 소비 비교를 확인해보세요
        </p>
        <button
          onClick={startRewardAd}
          className="flex items-center gap-2 px-6 py-3.5 bg-toss-blue text-white font-bold rounded-toss text-sm active:scale-[0.97] transition-all shadow-lg shadow-toss-blue/20"
        >
          <Play className="w-4 h-4" fill="white" />
          영상 보고 확인하기
        </button>
        <p className="text-[10px] text-toss-gray-300 mt-3">리워드 광고</p>
      </div>
    );
  }

  // ── Loading ad ──
  if (adState === 'loading') {
    return (
      <div className="toss-card flex flex-col items-center py-8 gap-3">
        <div className="w-8 h-8 border-2 border-toss-blue border-t-transparent rounded-full animate-spin" />
        <p className="text-sm text-toss-gray-400">광고 불러오는 중...</p>
      </div>
    );
  }

  // ── Unlocked: tier + comparisons in one card ──
  return (
    <div className="toss-card">
      {/* Tier */}
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-3">
          <span className="text-3xl">{tier.emoji}</span>
          <div>
            <p className="text-[11px] text-toss-gray-400 font-medium">나의 AI 월세 등급</p>
            <p className="text-xl font-extrabold" style={{ color: tier.color }}>
              {tier.grade}
            </p>
          </div>
        </div>
        <div
          className="px-3 py-1.5 rounded-full text-[11px] font-bold max-w-[160px] text-center leading-tight"
          style={{ backgroundColor: tier.bgColor, color: tier.color }}
        >
          {tier.comment}
        </div>
      </div>

      {/* Divider */}
      {comparisons.length > 0 && (
        <>
          <div className="border-t border-toss-gray-100 my-1" />

          {/* Comparisons */}
          <div className="pt-4">
            <p className="text-xs font-bold text-toss-gray-400 mb-3.5">
              이 돈이면 한 달에...
            </p>
            <div className="flex flex-col gap-3">
              {comparisons.map((c, i) => (
                <div key={i} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-toss-gray-50 flex items-center justify-center p-1.5">
                      <img src={c.image} alt={c.label} className="w-full h-full object-contain" />
                    </div>
                    <span className="text-[15px] text-toss-gray-700 font-medium">{c.label}</span>
                  </div>
                  <span className="text-[15px] font-bold text-toss-gray-900">
                    {c.calc(monthlyKRW)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default SpendingInsight;
