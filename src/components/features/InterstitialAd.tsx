import React, { useEffect } from 'react';
import { loadFullScreenAd, showFullScreenAd } from '@apps-in-toss/web-framework';

interface InterstitialAdProps {
  adId: string;
  isOpen: boolean;
  onComplete: () => void;
}

const InterstitialAd: React.FC<InterstitialAdProps> = ({ adId, isOpen, onComplete }) => {
  useEffect(() => {
    if (!isOpen) return;
    if (!loadFullScreenAd.isSupported()) {
      onComplete();
      return;
    }

    const cleanup = loadFullScreenAd({
      options: { adGroupId: adId },
      onEvent: (event) => {
        if (event.type === 'loaded') {
          showFullScreenAd({
            options: { adGroupId: adId },
            onEvent: (showEvent) => {
              if (showEvent.type === 'dismissed') {
                onComplete();
              }
            },
            onError: () => onComplete(),
          });
        }
      },
      onError: () => onComplete(),
    });

    return cleanup;
  }, [isOpen, adId, onComplete]);

  return null;
};

export default InterstitialAd;
