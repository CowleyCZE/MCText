
import React from 'react';

export const LoadingSpinner: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center p-10 bg-slate-800 rounded-xl shadow-xl">
      <div className="w-12 h-12 border-4 border-sky-400 border-t-transparent border-solid rounded-full animate-spin mb-3"></div>
      <p className="text-sky-300 text-lg font-medium">Načítám data z Gemini...</p>
      <p className="text-slate-400 text-sm">Prosím, vyčkejte, může to chvíli trvat.</p>
    </div>
  );
};