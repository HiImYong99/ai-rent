import { useState, useCallback } from 'react';
import AppLayout from './components/layout/AppLayout';
import DashboardCard from './components/features/DashboardCard';
import SubscriptionList from './components/features/SubscriptionList';
import BottomSheet from './components/common/BottomSheet';
import AddSubForm from './components/features/AddSubForm';
import SpendingInsight from './components/features/SpendingInsight';
import TossBannerAd from './components/features/AdBanner';
import InterstitialAd from './components/features/InterstitialAd';
import { Plus } from 'lucide-react';
import { useAppStore } from './store/useAppStore';
import { convertToKRW } from './utils/currency';
import { AD_IDS } from './config/adConfig';
import type { PresetService } from './data/presets';

function App() {
  const [isAddSheetOpen, setIsAddSheetOpen] = useState(false);
  const [quickAddService, setQuickAddService] = useState<PresetService | null>(null);
  const [showInterstitial, setShowInterstitial] = useState(false);
  const [pendingRegistration, setPendingRegistration] = useState<(() => void) | null>(null);
  const { subscriptions, exchangeRate } = useAppStore();

  const totalMonthlyKRW = subscriptions.reduce((acc, sub) => {
    let monthly = convertToKRW(sub.price, sub.currency, exchangeRate);
    if (sub.billingCycle === 'YEARLY') monthly = monthly / 12;
    return acc + monthly;
  }, 0);

  const handleQuickAdd = (service: PresetService) => {
    setQuickAddService(service);
    setIsAddSheetOpen(true);
  };

  const handleCloseAdd = () => {
    setIsAddSheetOpen(false);
    setQuickAddService(null);
  };

  const handleShowInterstitial = useCallback((registerFn: () => void) => {
    setPendingRegistration(() => registerFn);
    setShowInterstitial(true);
  }, []);

  const handleAdComplete = useCallback(() => {
    setShowInterstitial(false);
    if (pendingRegistration) {
      pendingRegistration();
      setPendingRegistration(null);
    }
    handleCloseAdd();
  }, [pendingRegistration]);

  return (
    <div className="bg-toss-gray-100 min-h-screen">
      <AppLayout>
        <div className="mt-4 pb-24 flex flex-col gap-5">
          {/* 1. Dashboard - 월간 총액 */}
          <section>
            <DashboardCard />
          </section>

          {/* 2. Spending Insight - 등급 + 소비비교 (리워드 광고 게이트) */}
          {subscriptions.length > 0 && (
            <section>
              <SpendingInsight monthlyKRW={Math.round(totalMonthlyKRW)} />
            </section>
          )}

          {/* 3. Subscription List */}
          <section>
            <SubscriptionList onQuickAdd={handleQuickAdd} />
          </section>

          {/* 4. 토스 배너 광고 - 스크롤 영역 하단 */}
          {subscriptions.length > 0 && (
            <section>
              <TossBannerAd adId={AD_IDS.BANNER_LIST_BOTTOM} />
            </section>
          )}
        </div>

        {/* FAB - 우측 하단 고정 (max-width 컨테이너 내) */}
        <div className="fixed bottom-0 left-0 right-0 z-50 pointer-events-none">
          <div className="max-w-[600px] mx-auto relative">
            <button
              onClick={() => setIsAddSheetOpen(true)}
              className="pointer-events-auto absolute bottom-6 right-5 w-14 h-14 rounded-full bg-toss-blue text-white shadow-xl shadow-toss-blue/30 flex items-center justify-center active:scale-90 transition-all"
            >
              <Plus className="w-7 h-7" strokeWidth={2.5} />
            </button>
          </div>
        </div>

        <BottomSheet
          isOpen={isAddSheetOpen}
          onClose={handleCloseAdd}
          title="구독 추가하기"
        >
          <AddSubForm
            onSuccess={handleCloseAdd}
            onCancel={handleCloseAdd}
            initialService={quickAddService}
            onShowInterstitial={handleShowInterstitial}
          />
        </BottomSheet>
      </AppLayout>

      {/* 전면 광고 - BottomSheet 밖에서 렌더링 (full-screen 보장) */}
      <InterstitialAd
        adId={AD_IDS.INTERSTITIAL_REGISTER}
        isOpen={showInterstitial}
        onComplete={handleAdComplete}
      />
    </div>
  );
}

export default App;
