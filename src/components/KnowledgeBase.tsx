import React, { useState } from 'react';
import type { KnowledgeBaseSection } from '../types';

interface KnowledgeBaseProps {
  sections: KnowledgeBaseSection[];
}

export const KnowledgeBase: React.FC<KnowledgeBaseProps> = ({ sections }) => {
  const [activeTab, setActiveTab] = useState<string>(sections[0]?.id || '');

  if (!sections || sections.length === 0) {
    return null;
  }

  return (
    <div className="bg-slate-800 rounded-xl shadow-2xl overflow-hidden">
      <div className="p-2 md:p-4">
        <h2 className="text-2xl font-semibold text-sky-300 mb-4 px-2">Znalostní Báze</h2>
        <div className="flex border-b border-slate-700 overflow-x-auto">
          {sections.map((section) => (
            <button
              key={section.id}
              onClick={() => setActiveTab(section.id)}
              className={`py-2 px-4 text-sm md:text-base font-medium whitespace-nowrap transition-colors duration-150
                ${activeTab === section.id 
                  ? 'border-b-2 border-sky-400 text-sky-300' 
                  : 'text-slate-400 hover:text-sky-300'
                }`}
            >
              {section.title}
            </button>
          ))}
        </div>
        <div className="p-3 md:p-5">
          {sections.map((section) =>
            activeTab === section.id ? (
              <div key={section.id} className="prose prose-sm md:prose-base prose-invert max-w-none 
                                             prose-p:text-slate-300 prose-li:text-slate-300 
                                             prose-headings:text-sky-300 prose-strong:text-sky-200
                                             prose-code:text-emerald-300 prose-code:bg-slate-900 prose-code:p-1 prose-code:rounded-sm
                                             prose-pre:bg-slate-900 prose-pre:p-4 prose-pre:rounded-md">
                {section.content}
              </div>
            ) : null
          )}
        </div>
      </div>
    </div>
  );
};
