import React from 'react';

interface AppLayoutProps {
  children: React.ReactNode;
}

const AppLayout: React.FC<AppLayoutProps> = ({ children }) => {
  return (
    <div className="flex flex-col min-h-screen max-w-[600px] mx-auto bg-toss-gray-50 shadow-lg sm:shadow-none">
      <main className="flex-1 w-full px-5 py-2 overflow-x-hidden">
        {children}
      </main>
    </div>
  );
};

export default AppLayout;
