import React, { useRef, useEffect } from 'react';
import { TossAds } from '@apps-in-toss/web-framework';

interface TossBannerAdProps {
  adId: string;
  className?: string;
}

const TossBannerAd: React.FC<TossBannerAdProps> = ({ adId, className = '' }) => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ref.current) return;
    if (!TossAds.attachBanner.isSupported()) return;

    const result = TossAds.attachBanner(adId, ref.current);
    return () => result.destroy();
  }, [adId]);

  return <div ref={ref} className={`w-full ${className}`} />;
};

export default TossBannerAd;
