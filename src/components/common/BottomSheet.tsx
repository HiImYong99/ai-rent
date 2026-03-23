import React, { useEffect, useState } from 'react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface BottomSheetProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
}

const BottomSheet: React.FC<BottomSheetProps> = ({ isOpen, onClose, title, children }) => {
  const [shouldRender, setShouldRender] = useState(isOpen);

  useEffect(() => {
    if (isOpen) {
      setShouldRender(true);
      const scrollY = window.scrollY;
      document.body.style.position = 'fixed';
      document.body.style.top = `-${scrollY}px`;
      document.body.style.width = '100%';
    } else {
      const top = document.body.style.top;
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.width = '';
      if (top) window.scrollTo(0, -parseInt(top, 10));
    }
    return () => {
      const top = document.body.style.top;
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.width = '';
      if (top) window.scrollTo(0, -parseInt(top, 10));
    };
  }, [isOpen]);

  const handleAnimationEnd = () => {
    if (!isOpen) setShouldRender(false);
  };

  if (!shouldRender) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-end justify-center">
      {/* Backdrop */}
      <div 
        className={cn(
          "absolute inset-0 bg-black/40 transition-opacity duration-300",
          isOpen ? "opacity-100" : "opacity-0"
        )}
        onClick={onClose}
      />
      
      {/* Content */}
      <div 
        className={cn(
          "relative w-full max-w-[600px] bg-white rounded-t-[24px] px-6 pb-12 pt-4 transition-transform duration-300 ease-out",
          isOpen ? "translate-y-0" : "translate-y-full"
        )}
        onTransitionEnd={handleAnimationEnd}
      >
        <div className="flex justify-center mb-4">
          <div className="w-12 h-1.5 bg-toss-gray-200 rounded-full" />
        </div>
        
        {title && (
          <h3 className="text-xl font-bold text-toss-gray-900 mb-6">
            {title}
          </h3>
        )}
        
        <div className="max-h-[70vh] overflow-y-auto overflow-x-hidden">
          {children}
        </div>
      </div>
    </div>
  );
};

export default BottomSheet;
