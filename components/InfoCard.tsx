import React from 'react';

interface InfoCardProps {
  title: string;
  children: React.ReactNode;
}

export const InfoCard: React.FC<InfoCardProps> = ({ title, children }) => (
  <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-lg h-full transition-shadow hover:shadow-xl">
    <h2 className="text-xl font-bold text-slate-800 dark:text-white mb-3 border-b-2 border-slate-200 dark:border-slate-700 pb-2">
      {title}
    </h2>
    <div className="text-slate-600 dark:text-slate-300 space-y-2">
      {children}
    </div>
  </div>
);