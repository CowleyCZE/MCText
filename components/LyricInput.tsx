
import React from 'react';
import { SUNO_AI_LYRICS_MAX_CHARS } from '../constants';

interface LyricInputProps {
  lyrics: string;
  onLyricsChange: (lyrics: string) => void;
  onProcess: () => void;
  isLoading: boolean;
}

export const LyricInput: React.FC<LyricInputProps> = ({ lyrics, onLyricsChange, onProcess, isLoading }) => {
  const charCount = lyrics.length;
  // Suno.ai has a typical limit around 2000-3000 for the prompt (lyrics+tags)
  // This is just a soft indicator for the raw lyrics.
  const lyricsLimit = SUNO_AI_LYRICS_MAX_CHARS - 500; // Estimate for tags

  return (
    <div className="bg-slate-800 p-6 rounded-xl shadow-2xl space-y-4">
      <label htmlFor="lyrics" className="block text-xl font-semibold text-sky-300">
        Vložte text písně:
      </label>
      <textarea
        id="lyrics"
        value={lyrics}
        onChange={(e) => onLyricsChange(e.target.value)}
        placeholder="Sem vložte svůj text písně..."
        rows={15}
        className="w-full p-3 bg-slate-700 border border-slate-600 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 text-slate-100 resize-y placeholder-slate-500"
        disabled={isLoading}
      />
      <div className="text-right text-sm text-slate-400">
        Počet znaků: {charCount} / ~{lyricsLimit} (orientační limit pro text)
      </div>
      <button
        onClick={onProcess}
        disabled={isLoading || !lyrics.trim()}
        className="w-full bg-gradient-to-r from-sky-500 to-cyan-500 hover:from-sky-600 hover:to-cyan-600 text-white font-semibold py-3 px-4 rounded-lg shadow-md disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-150 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-sky-400 focus:ring-opacity-75"
      >
        {isLoading ? 'Zpracovávám...' : 'Analyzovat a Vylepšit Text'}
      </button>
    </div>
  );
};