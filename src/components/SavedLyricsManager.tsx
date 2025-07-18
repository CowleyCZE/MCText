import React from 'react';
import type { SavedLyricSession } from '../types';

interface SavedLyricsManagerProps {
  sessions: SavedLyricSession[];
  onLoad: (session: SavedLyricSession) => void;
  onDelete: (sessionId: string, sessionTitle: string) => void;
  isLoading: boolean;
}

export const SavedLyricsManager: React.FC<SavedLyricsManagerProps> = ({ sessions, onLoad, onDelete, isLoading }) => {
  return (
    <div className="bg-slate-800 p-6 rounded-xl shadow-2xl">
      <h3 className="text-xl font-semibold text-rose-400 mb-4">Uložené Texty</h3>
      <div className="max-h-72 overflow-y-auto space-y-2 pr-2">
        {isLoading && <p className="text-slate-400 text-sm">Načítám...</p>}
        {!isLoading && sessions.length === 0 && (
          <p className="text-slate-400 text-sm">Zatím nemáte žádné uložené texty.</p>
        )}
        {!isLoading && sessions.map((session) => (
          <div key={session.id} className="bg-slate-700 p-3 rounded-lg flex justify-between items-center gap-2">
            <div className="flex-grow min-w-0">
              <p className="font-semibold text-slate-100 truncate" title={session.title}>
                {session.title}
              </p>
              <p className="text-xs text-slate-400">
                {session.createdAt?.toDate ? session.createdAt.toDate().toLocaleString('cs-CZ') : 'Právě teď'}
              </p>
            </div>
            <div className="flex-shrink-0 flex gap-2">
              <button
                onClick={() => onLoad(session)}
                className="text-xs bg-sky-600 hover:bg-sky-700 text-white font-medium py-1 px-2 rounded-md transition-colors"
                title="Načíst tento text"
              >
                Načíst
              </button>
              <button
                onClick={() => onDelete(session.id, session.title)}
                className="text-xs bg-red-600 hover:bg-red-700 text-white font-medium py-1 px-2 rounded-md transition-colors"
                title="Smazat tento text"
              >
                Smazat
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
