import React, { useState } from 'react';
import type { WeakSpot } from '../types';
import { getImprovementSuggestions } from '../services/geminiService';
import { GoogleGenerativeAI } from '@google/generative-ai';

interface InteractiveAnalysisDisplayProps {
  lyrics: string;
  weakSpots: WeakSpot[];
  onLyricsChange: (newLyrics: string) => void;
  ai: GoogleGenerativeAI | null;
}

const InteractiveAnalysisDisplay: React.FC<InteractiveAnalysisDisplayProps> = ({ lyrics, weakSpots, onLyricsChange, ai }) => {
  const [selectedWeakSpotIndex, setSelectedWeakSpotIndex] = useState<number | null>(null);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [isLoadingSuggestions, setIsLoadingSuggestions] = useState(false);

  // Guard Clause: If weakSpots is not a valid array, render a fallback UI.
  if (!Array.isArray(weakSpots)) {
    return (
        <div className="bg-slate-800 p-6 rounded-xl shadow-xl space-y-4">
            <h3 className="text-xl font-semibold text-sky-300">Vylepšený text</h3>
            <div className="p-4 border border-slate-600 rounded-md bg-slate-700/50 min-h-[200px]">
                <p className="whitespace-pre-wrap text-slate-200">{lyrics}</p>
            </div>
            <p className="text-slate-400 text-sm">Analýza neidentifikovala žádná konkrétní slabá místa nebo došlo k chybě při jejich zpracování.</p>
        </div>
    );
  }

  const handleWeakSpotClick = async (index: number) => {
    if (selectedWeakSpotIndex === index) {
      setSelectedWeakSpotIndex(null);
      setSuggestions([]);
      return;
    }

    setSelectedWeakSpotIndex(index);
    if (!ai) return;

    setIsLoadingSuggestions(true);
    const weakSpot = weakSpots[index];
    try {
      const newSuggestions = await getImprovementSuggestions(ai, lyrics, weakSpot);
      setSuggestions(newSuggestions);
    } catch (error) {
      console.error("Failed to get suggestions:", error);
      setSuggestions([]);
    } finally {
      setIsLoadingSuggestions(false);
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    if (selectedWeakSpotIndex === null) return;

    const weakSpot = weakSpots[selectedWeakSpotIndex];
    const newLyrics = lyrics.substring(0, weakSpot.startIndex) + suggestion + lyrics.substring(weakSpot.endIndex);
    onLyricsChange(newLyrics);
    setSelectedWeakSpotIndex(null);
    setSuggestions([]);
  };

  let lastIndex = 0;
  const renderedElements: (string | JSX.Element)[] = [];
  
  const sortedWeakSpots = [...weakSpots].sort((a, b) => a.startIndex - b.startIndex);

  sortedWeakSpots.forEach((weakSpot, index) => {
    if (weakSpot.startIndex > lastIndex) {
      renderedElements.push(lyrics.substring(lastIndex, weakSpot.startIndex));
    }
    renderedElements.push(
      <span
        key={index}
        className="bg-yellow-300/50 hover:bg-yellow-400/70 cursor-pointer rounded px-1 py-0.5 transition-colors"
        onClick={() => handleWeakSpotClick(index)}
      >
        {lyrics.substring(weakSpot.startIndex, weakSpot.endIndex)}
      </span>
    );
    lastIndex = weakSpot.endIndex;
  });

  if (lastIndex < lyrics.length) {
    renderedElements.push(lyrics.substring(lastIndex));
  }

  return (
    <div className="bg-slate-800 p-6 rounded-xl shadow-xl space-y-4">
        <h3 className="text-xl font-semibold text-sky-300">Vylepšený text (interaktivní)</h3>
        <div className="p-4 border border-slate-600 rounded-md bg-slate-700/50 min-h-[200px]">
            <p className="whitespace-pre-wrap text-slate-200">{renderedElements.length > 0 ? renderedElements : lyrics}</p>
        </div>
        {selectedWeakSpotIndex !== null && (
            <div className="mt-4 p-4 bg-slate-700 rounded-lg">
            <h4 className="text-lg font-semibold text-sky-400 mb-2">Návrhy na vylepšení pro: "<span className='italic'>{weakSpots[selectedWeakSpotIndex].text}</span>"</h4>
            <p className='text-sm text-slate-400 mb-3'>Důvod: {weakSpots[selectedWeakSpotIndex].description}</p>
            {isLoadingSuggestions ? (
                <div className="flex items-center justify-center p-4">
                    <div className="w-6 h-6 border-4 border-sky-400 border-t-transparent border-solid rounded-full animate-spin"></div>
                    <p className="ml-3 text-sky-300">Načítám návrhy...</p>
                </div>
            ) : (
                <ul className="space-y-2">
                {suggestions.map((suggestion, index) => (
                    <li key={index} className="flex items-center justify-between p-2 bg-slate-600/50 rounded-md">
                    <span className='text-slate-100'>{suggestion}</span>
                    <button
                        className="ml-4 bg-sky-600 hover:bg-sky-700 text-white font-bold py-1 px-3 rounded-md text-sm transition-colors"
                        onClick={() => handleSuggestionClick(suggestion)}
                    >
                        Použít
                    </button>
                    </li>
                ))}
                </ul>
            )}
            </div>
        )}
    </div>
  );
};

export default InteractiveAnalysisDisplay;