import React, { useState, useEffect, useCallback } from 'react';
import { X } from 'lucide-react';

interface InterstitialAdProps {
  adId: string;
  isOpen: boolean;
  onComplete: () => void;
  duration?: number; // seconds before skip is available
}

const SKIP_DELAY = 3; // 3초 후 닫기 가능

const InterstitialAd: React.FC<InterstitialAdProps> = ({ adId, isOpen, onComplete, duration = SKIP_DELAY }) => {
  const [countdown, setCountdown] = useState(duration);
  const [canSkip, setCanSkip] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      setCountdown(duration);
      setCanSkip(false);
      return;
    }

    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setCanSkip(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isOpen, duration]);

  const handleClose = useCallback(() => {
    if (canSkip) onComplete();
  }, [canSkip, onComplete]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[200] bg-black flex flex-col">
      {/* Top bar */}
      <div className="flex items-center justify-between px-4 py-3 bg-black/80">
        <span className="text-[10px] text-white/40 font-medium">AD · 광고</span>
        {canSkip ? (
          <button
            onClick={handleClose}
            className="flex items-center gap-1 px-3 py-1.5 bg-white/20 rounded-full text-white text-xs font-bold active:bg-white/30 transition-colors"
          >
            <X className="w-3.5 h-3.5" />
            닫기
          </button>
        ) : (
          <span className="px-3 py-1.5 bg-white/10 rounded-full text-white/60 text-xs font-medium">
            {countdown}초 후 닫기
          </span>
        )}
      </div>

      {/* Ad content area */}
      <div className="flex-1 flex flex-col items-center justify-center px-6">
        {/* 토스 SDK 연동 시 tossAd.showInterstitial(adId) 로 교체 */}
        <div
          className="w-full max-w-[400px] aspect-[9/16] max-h-[70vh] bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 rounded-2xl flex flex-col items-center justify-center relative overflow-hidden"
          data-ad-id={adId}
        >
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-toss-blue rounded-full blur-3xl" />
            <div className="absolute bottom-1/3 right-1/4 w-24 h-24 bg-purple-500 rounded-full blur-3xl" />
          </div>
          <div className="z-10 flex flex-col items-center gap-4 px-8 text-center">
            <span className="text-4xl text-white/20">AD</span>
            <p className="text-white/30 text-sm">토스 전면 광고 영역</p>
          </div>
        </div>
      </div>

      {/* Bottom progress */}
      <div className="px-4 pb-8 pt-3">
        <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden">
          <div
            className="h-full bg-white/40 rounded-full transition-all duration-1000 ease-linear"
            style={{
              width: `${((duration - countdown) / duration) * 100}%`,
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default InterstitialAd;
