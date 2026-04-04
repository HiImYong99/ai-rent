import React, { useRef, useEffect, useState } from 'react';
import { TossAds } from '@apps-in-toss/web-framework';

let initialized = false;
function ensureInitialized(): Promise<void> {
  if (initialized) return Promise.resolve();
  if (!TossAds.initialize.isSupported()) return Promise.reject();
  return new Promise((resolve, reject) => {
    TossAds.initialize({
      callbacks: {
        onInitialized: () => { initialized = true; resolve(); },
        onInitializationFailed: reject,
      },
    });
  });
}

interface TossBannerAdProps {
  adId: string;
  className?: string;
}

const TossBannerAd: React.FC<TossBannerAdProps> = ({ adId, className = '' }) => {
  const ref = useRef<HTMLDivElement>(null);
  const [ready, setReady] = useState(initialized);

  useEffect(() => {
    ensureInitialized().then(() => setReady(true)).catch(() => {});
  }, []);

  useEffect(() => {
    if (!ready || !ref.current) return;
    if (!TossAds.attachBanner.isSupported()) return;

    const result = TossAds.attachBanner(adId, ref.current);
    return () => result.destroy();
  }, [adId, ready]);

  return <div ref={ref} className={`w-full ${className}`} />;
};

export default TossBannerAd;
