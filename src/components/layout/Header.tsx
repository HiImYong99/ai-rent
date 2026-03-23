import React from 'react';
import appLogo from '../../assets/app_logo.png';

interface HeaderProps {
  title: string;
  rightAction?: React.ReactNode;
}

const Header: React.FC<HeaderProps> = ({ title, rightAction }) => {
  return (
    <header className="sticky top-0 z-50 flex items-center justify-between w-full h-14 px-5 bg-toss-gray-50/80 backdrop-blur-md">
      <div className="flex items-center gap-2.5">
        <img
          src={appLogo}
          alt="AI 월세"
          className="w-7 h-7 rounded-lg"
        />
        <h1 className="text-[17px] font-bold text-toss-gray-900 tracking-tight">
          {title}
        </h1>
      </div>
      {rightAction && <div>{rightAction}</div>}
    </header>
  );
};

export default Header;
