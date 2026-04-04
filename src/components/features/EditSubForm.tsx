import React, { useState } from 'react';
import { useAppStore } from '../../store/useAppStore';
import type { Subscription, BillingCycle, Currency } from '../../types';
import { clsx } from 'clsx';

interface EditSubFormProps {
  subscription: Subscription;
  onSuccess: () => void;
  onCancel: () => void;
}

const EditSubForm: React.FC<EditSubFormProps> = ({ subscription, onSuccess, onCancel }) => {
  const { updateSubscription } = useAppStore();

  const [price, setPrice] = useState<string>(String(subscription.price));
  const [currency, setCurrency] = useState<Currency>(subscription.currency);
  const [billingCycle, setBillingCycle] = useState<BillingCycle>(subscription.billingCycle);
  const [nextBillingDate, setNextBillingDate] = useState(subscription.nextBillingDate);

  const handleSubmit = () => {
    if (!price) return;
    updateSubscription(subscription.id, {
      price: Number(price),
      currency,
      billingCycle,
      nextBillingDate,
    });
    onSuccess();
  };

  return (
    <div className="flex flex-col gap-6 pb-8 min-w-0 w-full">
      <div className="flex items-center gap-4 p-4 bg-toss-gray-50 rounded-toss">
        {subscription.logoUrl ? (
          <div className="w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 p-1.5 bg-white border border-toss-gray-100">
            <img src={subscription.logoUrl} alt={subscription.serviceName} className="w-full h-full object-contain rounded-lg" />
          </div>
        ) : (
          <div
            className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-lg shrink-0"
            style={{ backgroundColor: subscription.logoColor || '#3182F6' }}
          >
            {subscription.serviceName.charAt(0).toUpperCase()}
          </div>
        )}
        <span className="text-lg font-bold text-toss-gray-800">{subscription.serviceName}</span>
      </div>

      <div className="flex flex-col gap-2">
        <label className="text-sm font-bold text-toss-gray-600 pl-1">얼마 내고 있나요?</label>
        <div className="flex gap-2">
          <input
            type="number"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            className="min-w-0 flex-1 h-14 px-4 bg-toss-gray-50 rounded-toss text-lg outline-none border-2 border-transparent focus:border-toss-blue/30 focus:bg-white transition-all"
          />
          <div className="flex bg-toss-gray-100 rounded-toss p-1 shrink-0">
            <button
              type="button"
              className={clsx(
                'px-3 h-full rounded-[12px] text-sm font-bold transition-all',
                currency === 'USD' ? 'bg-white text-toss-blue shadow-sm' : 'text-toss-gray-500'
              )}
              onClick={() => setCurrency('USD')}
            >
              USD
            </button>
            <button
              type="button"
              className={clsx(
                'px-3 h-full rounded-[12px] text-sm font-bold transition-all',
                currency === 'KRW' ? 'bg-white text-toss-blue shadow-sm' : 'text-toss-gray-500'
              )}
              onClick={() => setCurrency('KRW')}
            >
              KRW
            </button>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <label className="text-sm font-bold text-toss-gray-600 pl-1">결제 주기</label>
        <div className="flex bg-toss-gray-50 rounded-toss p-1.5 h-14">
          <button
            type="button"
            className={clsx(
              'flex-1 rounded-[12px] font-bold transition-all flex items-center justify-center',
              billingCycle === 'MONTHLY' ? 'bg-white text-toss-gray-800 shadow-sm' : 'text-toss-gray-400'
            )}
            onClick={() => setBillingCycle('MONTHLY')}
          >
            매월
          </button>
          <button
            type="button"
            className={clsx(
              'flex-1 rounded-[12px] font-bold transition-all flex items-center justify-center',
              billingCycle === 'YEARLY' ? 'bg-white text-toss-gray-800 shadow-sm' : 'text-toss-gray-400'
            )}
            onClick={() => setBillingCycle('YEARLY')}
          >
            매년
          </button>
        </div>
      </div>

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
          onClick={handleSubmit}
          className="flex-[2] h-14 rounded-toss bg-toss-blue text-white font-bold shadow-lg shadow-toss-blue/20 transition-all active:scale-[0.97]"
        >
          저장할게요
        </button>
      </div>
    </div>
  );
};

export default EditSubForm;
