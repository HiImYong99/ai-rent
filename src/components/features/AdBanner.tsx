import React from 'react';

interface TossBannerAdProps {
  adId: string;
  className?: string;
}

/**
 * 토스 배너 광고 컴포넌트
 *
 * 실제 토스 SDK 연동 시:
 * - tossAd.loadBanner(adId) 호출로 교체
 * - 광고 로드 실패 시 fallback으로 빈 영역 처리
 *
 * 현재는 플레이스홀더로 표시
 */
const TossBannerAd: React.FC<TossBannerAdProps> = ({ adId, className = '' }) => {
  return (
    <div
      className={`w-full rounded-toss overflow-hidden ${className}`}
      data-ad-id={adId}
    >
      {/* 토스 SDK 연동 시 이 영역이 광고로 대체됨 */}
      <div className="w-full h-[60px] bg-toss-gray-50 border border-toss-gray-100 rounded-toss flex items-center justify-center">
        <span className="text-[11px] text-toss-gray-300 font-medium">
          AD · {adId.replace('PLACEHOLDER_', '')}
        </span>
      </div>
    </div>
  );
};

export default TossBannerAd;
