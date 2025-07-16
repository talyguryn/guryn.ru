import React, { ReactNode } from 'react';

interface BrowserMockupProps {
  title?: string;
  children: ReactNode;
}

const BrowserMockup: React.FC<BrowserMockupProps> = ({ title, children }) => (
  <div className="mx-auto my-8 w-full min-h-72 rounded-lg border border-gray-300 dark:border-gray-600 shadow-lg bg-white dark:bg-gray-600 overflow-hidden flex flex-col">
    <div className="bg-gray-200 dark:bg-gray-700 h-6 flex items-center justify-center px-4 relative">
      <div className="absolute left-2.5 flex space-x-2">
        <div className="w-3 h-3 bg-red-500 dark:bg-red-400 rounded-full"></div>
        <div className="w-3 h-3 bg-yellow-500 dark:bg-yellow-400 rounded-full"></div>
        <div className="w-3 h-3 bg-green-500 dark:bg-green-400 rounded-full"></div>
      </div>
      <span className="text-xs text-gray-500 dark:text-gray-400">{title}</span>
    </div>
    <div className="flex-1">{children}</div>
  </div>
);

export default BrowserMockup;
