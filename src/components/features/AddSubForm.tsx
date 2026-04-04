import React, { useState, useMemo } from 'react';
import { useAppStore } from '../../store/useAppStore';
import type { PresetService, ServicePlan } from '../../data/presets';
import { searchServices } from '../../data/presets';
import { Search, ChevronLeft, Check, Sparkles } from 'lucide-react';
import { clsx } from 'clsx';

interface AddSubFormProps {
  onSuccess: () => void;
  onCancel: () => void;
  initialService?: PresetService | null;
  onShowInterstitial?: (registerFn: () => void) => void;
}

type Step = 'service' | 'plan' | 'confirm';

const ServiceLogo: React.FC<{ service: PresetService; size?: string }> = ({
  service,
  size = 'w-10 h-10',
}) => (
  <div
    className={`${size} rounded-2xl flex items-center justify-center shrink-0 p-1.5 bg-white border border-toss-gray-100`}
  >
    <img
      src={service.logo}
      alt={service.name}
      className="w-full h-full object-contain rounded-lg"
    />
  </div>
);

const AddSubForm: React.FC<AddSubFormProps> = ({ onSuccess, onCancel, initialService, onShowInterstitial }) => {
  const { addSubscription } = useAppStore();

  const [step, setStep] = useState<Step>(initialService ? 'plan' : 'service');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedService, setSelectedService] = useState<PresetService | null>(initialService ?? null);
  const [selectedPlan, setSelectedPlan] = useState<ServicePlan | null>(null);
  const [nextBillingDate, setNextBillingDate] = useState(
    new Date().toISOString().split('T')[0]
  );

  const [isCustom, setIsCustom] = useState(false);
  const [customName, setCustomName] = useState('');
  const [customPrice, setCustomPrice] = useState('');
  const filteredServices = useMemo(() => searchServices(searchQuery), [searchQuery]);

  const handleSelectService = (service: PresetService) => {
    setSelectedService(service);
    setIsCustom(false);
    setStep('plan');
  };

  const handleSelectPlan = (plan: ServicePlan) => {
    setSelectedPlan(plan);
    setStep('confirm');
  };

  const doRegister = () => {
    if (isCustom) {
      addSubscription({
        serviceName: customName.trim(),
        price: Number(customPrice),
        currency: 'USD',
        billingCycle: 'MONTHLY',
        nextBillingDate,
        logoColor: '#6B7684',
      });
    } else if (selectedService && selectedPlan) {
      addSubscription({
        serviceName: `${selectedService.name} ${selectedPlan.name}`,
        price: selectedPlan.price,
        currency: selectedPlan.currency,
        billingCycle: selectedPlan.billingCycle,
        nextBillingDate,
        logoColor: selectedService.logoColor,
        logoUrl: selectedService.logo,
      });
    }
  };

  // "등록할게요" → 전면 광고 → 등록
  const handleSubmitClick = () => {
    if (isCustom && (!customName.trim() || !customPrice)) return;
    if (onShowInterstitial) {
      onShowInterstitial(doRegister);
    } else {
      doRegister();
      onSuccess();
    }
  };

  // ── Step 1: Service Selection ──
  if (step === 'service') {
    return (
      <div className="flex flex-col gap-5 pb-4 min-w-0 w-full">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-toss-gray-400" />
          <input
            type="text"
            placeholder="어떤 서비스를 쓰고 있나요?"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-12 pl-12 pr-4 bg-toss-gray-50 rounded-toss text-base outline-none border-2 border-transparent focus:border-toss-blue/30 focus:bg-white transition-all placeholder:text-toss-gray-300"
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          {filteredServices.map((service) => (
            <button
              key={service.id}
              type="button"
              onClick={() => handleSelectService(service)}
              className="flex items-center gap-3 p-4 bg-white rounded-toss border border-toss-gray-100 hover:border-toss-blue/30 active:scale-[0.97] transition-all text-left"
            >
              <ServiceLogo service={service} />
              <div className="flex flex-col min-w-0">
                <span className="text-[15px] font-bold text-toss-gray-800 truncate">
                  {service.name}
                </span>
                <span className="text-xs text-toss-gray-400">
                  {service.plans.length}개 요금제
                </span>
              </div>
            </button>
          ))}
        </div>

        <button
          type="button"
          onClick={() => {
            setIsCustom(true);
            setStep('confirm');
          }}
          className="w-full h-12 rounded-toss border-2 border-dashed border-toss-gray-200 text-toss-gray-400 font-medium text-sm hover:border-toss-gray-300 hover:text-toss-gray-500 transition-all active:scale-[0.98]"
        >
          + 직접 입력할게요
        </button>
      </div>
    );
  }

  // ── Step 2: Plan Selection ──
  if (step === 'plan' && selectedService) {
    return (
      <div className="flex flex-col gap-5 pb-4 min-w-0 w-full">
        <button
          type="button"
          onClick={() => {
            setStep('service');
            setSelectedService(null);
          }}
          className="flex items-center gap-1 text-toss-gray-500 text-sm font-medium -mb-2 self-start active:opacity-60"
        >
          <ChevronLeft className="w-4 h-4" />
          서비스 선택
        </button>

        <div className="flex items-center gap-3 pb-2">
          <ServiceLogo service={selectedService} size="w-12 h-12" />
          <div>
            <h4 className="text-lg font-bold text-toss-gray-900">{selectedService.name}</h4>
            <p className="text-xs text-toss-gray-400">어떤 요금제를 쓰고 있나요?</p>
          </div>
        </div>

        <div className="flex flex-col gap-3">
          {selectedService.plans.map((plan) => (
            <button
              key={plan.id}
              type="button"
              onClick={() => handleSelectPlan(plan)}
              className={clsx(
                'relative flex items-center justify-between p-4 rounded-toss border-2 text-left transition-all active:scale-[0.98]',
                plan.highlight
                  ? 'border-toss-blue/40 bg-blue-50/40'
                  : 'border-toss-gray-100 bg-white hover:border-toss-gray-200'
              )}
            >
              {plan.highlight && (
                <div className="absolute -top-2.5 left-3 flex items-center gap-1 bg-toss-blue text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                  <Sparkles className="w-3 h-3" />
                  인기
                </div>
              )}
              <div className="flex flex-col gap-0.5 min-w-0 flex-1 mr-3">
                <span className="text-[16px] font-bold text-toss-gray-800">
                  {plan.name}
                </span>
                {plan.description && (
                  <span className="text-xs text-toss-gray-400 truncate">{plan.description}</span>
                )}
              </div>
              <div className="flex flex-col items-end shrink-0">
                <span className="text-lg font-extrabold text-toss-gray-900">
                  ${plan.price}
                </span>
                <span className="text-[11px] text-toss-gray-400">
                  /{plan.billingCycle === 'MONTHLY' ? '월' : '년'}
                </span>
              </div>
            </button>
          ))}
        </div>
      </div>
    );
  }

  // ── Step 3: Confirm & Date ──
  return (
    <div className="flex flex-col gap-6 pb-4 min-w-0 w-full">
      <button
        type="button"
        onClick={() => {
          if (isCustom) {
            setIsCustom(false);
            setStep('service');
          } else {
            setStep('plan');
          }
        }}
        className="flex items-center gap-1 text-toss-gray-500 text-sm font-medium -mb-2 self-start active:opacity-60"
      >
        <ChevronLeft className="w-4 h-4" />
        {isCustom ? '서비스 선택' : '요금제 선택'}
      </button>

      {!isCustom && selectedService && selectedPlan && (
        <div className="flex items-center gap-4 p-5 bg-toss-gray-50 rounded-toss">
          <ServiceLogo service={selectedService} size="w-14 h-14" />
          <div className="flex flex-col flex-1">
            <span className="text-lg font-bold text-toss-gray-800">
              {selectedService.name}
            </span>
            <span className="text-sm text-toss-gray-500">
              {selectedPlan.name} · ${selectedPlan.price}/{selectedPlan.billingCycle === 'MONTHLY' ? '월' : '년'}
            </span>
          </div>
          <Check className="w-6 h-6 text-toss-blue shrink-0" />
        </div>
      )}

      {isCustom && (
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <label className="text-sm font-bold text-toss-gray-600 pl-1">서비스 이름이 뭔가요?</label>
            <input
              type="text"
              placeholder="예: ChatGPT Plus"
              value={customName}
              onChange={(e) => setCustomName(e.target.value)}
              className="w-full h-14 px-4 bg-toss-gray-50 rounded-toss text-lg outline-none border-2 border-transparent focus:border-toss-blue/30 focus:bg-white transition-all placeholder:text-toss-gray-300"
            />
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-sm font-bold text-toss-gray-600 pl-1">한 달에 얼마 내고 있나요? (USD)</label>
            <input
              type="number"
              placeholder="0"
              value={customPrice}
              onChange={(e) => setCustomPrice(e.target.value)}
              className="w-full h-14 px-4 bg-toss-gray-50 rounded-toss text-lg outline-none border-2 border-transparent focus:border-toss-blue/30 focus:bg-white transition-all placeholder:text-toss-gray-300"
            />
          </div>
        </div>
      )}

      <div className="flex flex-col gap-2">
        <label className="text-sm font-bold text-toss-gray-600 pl-1">다음 결제일이 언제인가요?</label>
        <div className="overflow-hidden rounded-toss">
          <input
            type="date"
            value={nextBillingDate}
            onChange={(e) => setNextBillingDate(e.target.value)}
            className="w-full h-14 px-4 bg-toss-gray-50 text-lg text-center outline-none border-2 border-transparent focus:border-toss-blue/30 focus:bg-white transition-all rounded-toss"
          />
        </div>
        <p className="text-xs text-toss-gray-400 pl-1">
          지난 날짜를 선택해도 다음 결제일로 자동 맞춰드려요
        </p>
      </div>

      <div className="flex gap-3 pt-4">
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 h-14 rounded-toss bg-toss-gray-100 text-toss-gray-600 font-bold transition-all active:scale-[0.97]"
        >
          닫기
        </button>
        <button
          type="button"
          onClick={handleSubmitClick}
          disabled={isCustom && (!customName.trim() || !customPrice)}
          className={clsx(
            'flex-[2] h-14 rounded-toss font-bold transition-all active:scale-[0.97]',
            isCustom && (!customName.trim() || !customPrice)
              ? 'bg-toss-gray-200 text-toss-gray-400'
              : 'bg-toss-blue text-white shadow-lg shadow-toss-blue/20'
          )}
        >
          등록할게요
        </button>
      </div>

    </div>
  );
};

export default AddSubForm;
