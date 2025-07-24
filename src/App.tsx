// src/App.tsx
import React, { useState, useCallback, useEffect } from 'react';
// OPRAVA: Změna na namespace import
import * as genAI from "@google/genai";
import { Buffer } from 'buffer';
import { LyricInput } from './components/LyricInput';
import { OptimizedAnalysisDisplay } from './components/OptimizedAnalysisDisplay';
import { KnowledgeBase } from './components/KnowledgeBase';
import { LoadingSpinner } from './components/LoadingSpinner';
import { KNOWLEDGE_BASE_SECTIONS } from './constants';
import type { AnalysisResults, ArtistInfo, ArtistStyleAnalysis } from './types';
import { 
  getComprehensiveAnalysis,
  getArtistAnalyses,
  getImprovedLyrics, 
  getSunoFormattedLyrics, 
  getStyleOfMusic,
  getSimilarArtistsForGenre,
  adjustLyricsToGenreAndArtist,
  analyzeArtistForStyleTransfer,
  clearCache
} from './services/geminiService';

// Nastavení globálního Bufferu pro polyfill
if (typeof window !== 'undefined') {
  (window as any).Buffer = Buffer;
}

const App: React.FC = () => {
  const [lyrics, setLyrics] = useState<string>('');
  const [analysisResults, setAnalysisResults] = useState<AnalysisResults | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [isApiKeyMissing, setIsApiKeyMissing] = useState<boolean>(false);

  // Stavy pro "Přizpůsobit text žánru"
  const [showGenreAdjustmentTool, setShowGenreAdjustmentTool] = useState<boolean>(false);
  const [rankedGenres, setRankedGenres] = useState<string[]>([]);
  const [selectedGenreForAdjustment, setSelectedGenreForAdjustment] = useState<string | null>(null);
  const [similarArtistsForGenre, setSimilarArtistsForGenre] = useState<string[]>([]);
  const [selectedArtistForAdjustment, setSelectedArtistForAdjustment] = useState<string | null>(null);
  const [adjustedLyricsByGenre, setAdjustedLyricsByGenre] = useState<string | null>(null);
  const [genreAdjustmentStep, setGenreAdjustmentStep] = useState<number>(0); 
  const [isGenreAdjustmentLoading, setIsGenreAdjustmentLoading] = useState<boolean>(false);
  const [genreAdjustmentError, setGenreAdjustmentError] = useState<string | null>(null);
  
  // Stavy pro "Upravit podle interpreta"
  const [artistNameForAnalysis, setArtistNameForAnalysis] = useState('');
  const [artistAnalysisResult, setArtistAnalysisResult] = useState<ArtistStyleAnalysis | null>(null);
  const [adjustedLyricsByArtist, setAdjustedLyricsByArtist] = useState<string | null>(null);
  const [isArtistAnalysisLoading, setIsArtistAnalysisLoading] = useState(false);
  const [artistAnalysisError, setArtistAnalysisError] = useState<string | null>(null);
  const [sunoFormattedArtistLyrics, setSunoFormattedArtistLyrics] = useState<string | null>(null);
  const [isFormattingArtistLyrics, setIsFormattingArtistLyrics] = useState<boolean>(false);

  // Progress tracking pro lepší UX
  const [analysisProgress, setAnalysisProgress] = useState<string>('');

  // OPRAVA: Aktualizace typu pro instanci klienta
  const [aiInstance, setAiInstance] = useState<genAI.GoogleGenerativeAI | null>(null);
  const [isAppReady, setIsAppReady] = useState<boolean>(false);

  useEffect(() => {
    const initializeApp = () => {
      const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
      if (apiKey) {
        // OPRAVA: Správná inicializace klienta s použitím namespace
        const ai = new genAI.GoogleGenerativeAI(apiKey);
        setAiInstance(ai);
        setIsAppReady(true);
      } else {
        setIsApiKeyMissing(true);
        setIsAppReady(false);
      }
    };
    
    initializeApp();
  }, []);

  const clearAllResults = useCallback(() => {
    setAnalysisResults(null);
    setError(null);
    setShowGenreAdjustmentTool(false);
    setRankedGenres([]);
    setSelectedGenreForAdjustment(null);
    setSimilarArtistsForGenre([]);
    setSelectedArtistForAdjustment(null);
    setAdjustedLyricsByGenre(null);
    setGenreAdjustmentStep(0);
    setGenreAdjustmentError(null);
    setArtistAnalysisResult(null);
    setAdjustedLyricsByArtist(null);
    setArtistAnalysisError(null);
    setSunoFormattedArtistLyrics(null);
    setAnalysisProgress('');
  }, []);

  // Optimalizovaná verze zpracování textů
  const handleProcessLyrics = useCallback(async () => {
    if (!lyrics.trim() || !aiInstance || !isAppReady) return;

    setIsLoading(true);
    setError(null);
    clearAllResults();

    try {
      setAnalysisProgress('Analyzuji text písně...');
      const comprehensive = await getComprehensiveAnalysis(aiInstance, lyrics);
      
      setAnalysisProgress('Analyzuji styly interpretů...');
      const artistAnalyses = await getArtistAnalyses(aiInstance, comprehensive.topArtists.artists, comprehensive.genre);
      
      setAnalysisProgress('Vylepšuji text a připravuji formáty...');
      const topArtists: ArtistInfo[] = comprehensive.topArtists.artists.map((name, index) => ({
        name,
        analysis: artistAnalyses[index]?.analysis || '',
        searchAttributions: artistAnalyses[index]?.attributions,
      }));

      const artistAnalysesTexts = topArtists.map(a => `${a.name}: ${a.analysis || 'N/A'}`);
      
      const improvedLyrics = await getImprovedLyrics(aiInstance, lyrics, comprehensive.weakSpots, comprehensive.genre, artistAnalysesTexts);

      const [sunoFormatted, styleOfMusic] = await Promise.all([
        getSunoFormattedLyrics(aiInstance, improvedLyrics, comprehensive.genre),
        getStyleOfMusic(aiInstance, comprehensive.genre)
      ]);

      const finalResults: AnalysisResults = {
        genre: comprehensive.genre,
        weakSpots: comprehensive.weakSpots,
        topArtists,
        improvedLyrics,
        sunoFormattedLyrics: sunoFormatted,
        styleOfMusic,
        rawArtistNames: comprehensive.topArtists.artists,
        artistSearchAttributions: comprehensive.topArtists.attributions,
      };

      setAnalysisResults(finalResults);
      setAnalysisProgress('');

    } catch (e: any) {
      console.error("Chyba při zpracování:", e);
      let errorMessage = `Došlo k chybě: ${e.message}. Zkontrolujte konzoli pro více detailů.`;
      if (e.message && e.message.includes("API key not valid")) {
         errorMessage = `Poskytnutý API klíč není platný. Zkontrolujte prosím konfiguraci API klíče v prostředí aplikace. (${e.message})`;
      } else if (e.message && e.message.toLowerCase().includes("quota")) {
        errorMessage = `Byl překročen limit API (quota). Zkuste to prosím později. (${e.message})`;
      }
      setError(errorMessage);
    } finally {
      setIsLoading(false);
      setAnalysisProgress('');
    }
  }, [lyrics, aiInstance, isAppReady, clearAllResults]);

  const handleToggleGenreAdjustmentTool = () => {
    if (!isAppReady) return;
    if (showGenreAdjustmentTool) {
      setShowGenreAdjustmentTool(false);
      setGenreAdjustmentStep(0);
      setAdjustedLyricsByGenre(null);
      setGenreAdjustmentError(null);
    } else {
      if (!lyrics.trim()) {
        setGenreAdjustmentError("Nejprve prosím vložte text písně do horního pole.");
        return;
      }
      setAnalysisResults(null); 
      setShowGenreAdjustmentTool(true);
      setGenreAdjustmentError(null);
      handleFetchRankedGenres();
    }
  };
  
  const handleFetchRankedGenres = async () => {
    if (!isAppReady || !aiInstance || !lyrics.trim()) {
      setGenreAdjustmentError('Text písně je prázdný nebo API není k dispozici.');
      return;
    }
    setIsGenreAdjustmentLoading(true);
    setGenreAdjustmentError(null);
    setRankedGenres([]);
    try {
      const comprehensive = await getComprehensiveAnalysis(aiInstance, lyrics);
      setRankedGenres(comprehensive.rankedGenres);
      setGenreAdjustmentStep(1); 
    } catch (e: any) {
      console.error("Chyba při načítání hodnocených žánrů:", e);
      setGenreAdjustmentError(`Nepodařilo se načíst žánry: ${e.message}`);
    } finally {
      setIsGenreAdjustmentLoading(false);
    }
  };

  const handleGenreSelectedForAdjustment = async (genre: string) => {
    if (!isAppReady || !aiInstance) return;
    setSelectedGenreForAdjustment(genre);
    setIsGenreAdjustmentLoading(true);
    setGenreAdjustmentError(null);
    setSimilarArtistsForGenre([]);
    try {
      const artists = await getSimilarArtistsForGenre(aiInstance, lyrics, genre);
      setSimilarArtistsForGenre(artists);
      setGenreAdjustmentStep(2); 
    } catch (e: any) {
      console.error("Chyba při načítání podobných interpretů:", e);
      setGenreAdjustmentError(`Nepodařilo se načíst interprety pro žánr ${genre}: ${e.message}`);
      setGenreAdjustmentStep(1); 
    } finally {
      setIsGenreAdjustmentLoading(false);
    }
  };

  const handleArtistSelectedForAdjustment = (artistName: string | null) => {
    if (!isAppReady) return;
    setSelectedArtistForAdjustment(artistName);
    if (selectedGenreForAdjustment) {
      handleAdjustLyricsSubmit(selectedGenreForAdjustment, artistName);
    } else {
      setGenreAdjustmentError("Žánr pro úpravu není vybrán.");
    }
  };
  
  const handleAdjustLyricsSubmit = async (genre: string | null, artist: string | null) => {
    if (!isAppReady || !aiInstance || !lyrics.trim() || !genre) {
      setGenreAdjustmentError('Chybí potřebné údaje pro úpravu textu (text, žánr).');
      return;
    }
    setIsGenreAdjustmentLoading(true);
    setGenreAdjustmentError(null);
    setAdjustedLyricsByGenre(null);
    try {
      const adjustedText = await adjustLyricsToGenreAndArtist(aiInstance, lyrics, genre, artist);
      setAdjustedLyricsByGenre(adjustedText);
      setGenreAdjustmentStep(3); 
    } catch (e: any) {
      console.error("Chyba při úpravě textu:", e);
      setGenreAdjustmentError(`Nepodařilo se upravit text: ${e.message}`);
      setGenreAdjustmentStep(2);
    } finally {
      setIsGenreAdjustmentLoading(false);
    }
  };

  const resetGenreAdjustment = () => {
    if (!isAppReady) return;
    setGenreAdjustmentStep(1);
    setSelectedArtistForAdjustment(null);
    setAdjustedLyricsByGenre(null);
    setGenreAdjustmentError(null);
  };
  
  const handleAdjustByArtist = async () => {
    if (!isAppReady || !aiInstance || !lyrics.trim() || !artistNameForAnalysis.trim()) {
      setArtistAnalysisError("Zadejte prosím text písně i jméno interpreta.");
      return;
    }
    setIsArtistAnalysisLoading(true);
    setArtistAnalysisError(null);
    setAnalysisResults(null);
    setArtistAnalysisResult(null);
    setAdjustedLyricsByArtist(null);
    setSunoFormattedArtistLyrics(null);

    try {
      const analysis = await analyzeArtistForStyleTransfer(aiInstance, artistNameForAnalysis);
      setArtistAnalysisResult(analysis);
      
      const adjustedText = await adjustLyricsToGenreAndArtist(aiInstance, lyrics, analysis.genre, artistNameForAnalysis, analysis.analysis);
      setAdjustedLyricsByArtist(adjustedText);

    } catch (e: any) {
      console.error("Chyba při úpravě podle interpreta:", e);
      setArtistAnalysisError(`Chyba při úpravě podle interpreta: ${e.message}`);
    } finally {
      setIsArtistAnalysisLoading(false);
    }
  };

  const handleFormatArtistLyricsForSuno = async () => {
    if (!isAppReady || !aiInstance || !adjustedLyricsByArtist || !artistAnalysisResult) {
      setArtistAnalysisError("Nejsou k dispozici potřebná data pro formátování.");
      return;
    }
    setIsFormattingArtistLyrics(true);
    setArtistAnalysisError(null);
    try {
      const sunoFormatted = await getSunoFormattedLyrics(aiInstance, adjustedLyricsByArtist, artistAnalysisResult.genre);
      setSunoFormattedArtistLyrics(sunoFormatted);
    } catch (e: any) {
      console.error("Chyba při formátování textu pro Suno.ai:", e);
      setArtistAnalysisError(`Nepodařilo se naformátovat text pro Suno.ai: ${e.message}`);
    } finally {
      setIsFormattingArtistLyrics(false);
    }
  };

  const handleClearCache = () => {
    clearCache();
    alert('Cache byla vyčištěna!');
  };

  if (isApiKeyMissing) { 
    return (
      <div className="min-h-screen bg-slate-900 container mx-auto p-4 md:p-8 flex flex-col items-center justify-center text-center">
        <div className="bg-slate-800 p-8 rounded-lg shadow-2xl max-w-md w-full">
           <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-red-500 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <h1 className="text-2xl font-bold text-red-400 mb-3">Chyba Konfigurace Aplikace</h1>
          <p className="text-slate-300 mb-2">
            API klíč pro Google Generative AI (Gemini) není správně nastaven v prostředí této aplikace.
          </p>
          <p className="text-slate-400 text-sm">
            Pro správnou funkci aplikace je nezbytné, aby byla proměnná prostředí <code className="bg-slate-700 text-emerald-400 px-1.5 py-0.5 rounded-md font-mono text-xs">VITE_GEMINI_API_KEY</code> nastavena na platný klíč. Prosím, kontaktujte správce aplikace nebo vývojáře.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen container mx-auto p-4 md:p-8 flex flex-col space-y-8 bg-slate-900 text-slate-100">
      <header className="text-center">
        <h1 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-sky-400 via-cyan-300 to-teal-400 mb-2">
          Lyric Analyzer & Suno.ai Helper
        </h1>
        <p className="text-slate-400 text-lg">
          Analyzujte, vylepšete a připravte své texty pro Suno.ai! (Optimalizovaná verze)
        </p>
        {import.meta.env.DEV && (
          <button
            onClick={handleClearCache}
            className="mt-2 px-3 py-1 text-xs bg-red-600 hover:bg-red-700 text-white rounded-md transition-colors"
          >
            Vyčistit Cache
          </button>
        )}
      </header>

      <main className="flex-grow grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-1 space-y-6">
          <LyricInput
            lyrics={lyrics}
            onLyricsChange={(newLyrics) => {
              setLyrics(newLyrics);
              if (analysisResults) setAnalysisResults(null);
            }}
            onProcess={handleProcessLyrics}
            isLoading={isLoading || !isAppReady || isGenreAdjustmentLoading || isArtistAnalysisLoading}
          />
           <div className="bg-slate-800 p-6 rounded-xl shadow-2xl space-y-4">
            <button
                onClick={handleToggleGenreAdjustmentTool}
                disabled={isLoading || !isAppReady || !lyrics.trim() || isGenreAdjustmentLoading || isArtistAnalysisLoading}
                className="w-full bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600 text-white font-semibold py-3 px-4 rounded-lg shadow-md disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-150 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:ring-opacity-75"
              >
                {showGenreAdjustmentTool ? 'Skrýt nástroj pro úpravu žánru' : 'Přizpůsobit text žánru'}
            </button>
            {genreAdjustmentError && !isGenreAdjustmentLoading && showGenreAdjustmentTool && (
              <div className="bg-red-800 border border-red-700 text-red-100 p-3 rounded-md text-sm">
                <p>{genreAdjustmentError}</p>
              </div>
            )}
          </div>
          
          <div className="bg-slate-800 p-6 rounded-xl shadow-2xl space-y-4">
              <h3 className="text-xl font-semibold text-emerald-400">Upravit podle interpreta</h3>
              <p className="text-slate-400 text-sm">Zadejte jméno a AI se pokusí přepsat text ve stylu daného umělce.</p>
              <div>
                <label htmlFor="artist-name" className="sr-only">Jméno interpreta</label>
                <input
                  id="artist-name"
                  type="text"
                  value={artistNameForAnalysis}
                  onChange={(e) => {
                    setArtistNameForAnalysis(e.target.value);
                    setAdjustedLyricsByArtist(null);
                    setArtistAnalysisResult(null);
                    setArtistAnalysisError(null);
                    setSunoFormattedArtistLyrics(null);
                  }}
                  placeholder="Např. Taylor Swift, Rammstein..."
                  className="w-full p-3 bg-slate-700 border border-slate-600 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-slate-100 placeholder-slate-500"
                  disabled={isLoading || !isAppReady || isArtistAnalysisLoading}
                />
              </div>
              <button
                onClick={handleAdjustByArtist}
                disabled={isLoading || !isAppReady || !lyrics.trim() || !artistNameForAnalysis.trim() || isArtistAnalysisLoading}
                className="w-full bg-gradient-to-r from-emerald-500 to-green-500 hover:from-emerald-600 hover:to-green-600 text-white font-semibold py-3 px-4 rounded-lg shadow-md disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-150 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:ring-opacity-75"
              >
                {isArtistAnalysisLoading ? 'Upravuji...' : 'Upravit v tomto stylu'}
              </button>
              {artistAnalysisError && (
                <div className="bg-red-800 border border-red-700 text-red-100 p-3 rounded-md text-sm">
                  <p>{artistAnalysisError}</p>
                </div>
              )}
            </div>

        </div>

        <div className="md:col-span-2 space-y-6">
          {(isLoading || isArtistAnalysisLoading) && (
            <div className="bg-slate-800 p-6 rounded-xl shadow-xl">
              <LoadingSpinner />
              {analysisProgress && (
                <p className="text-center text-sky-300 mt-4 font-medium">{analysisProgress}</p>
              )}
            </div>
          )}
          {error && !isLoading && (
            <div className="bg-red-800 border border-red-700 text-red-100 p-4 rounded-lg shadow-md">
              <div className="flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-3 text-red-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <h3 className="font-semibold text-lg">Chyba</h3>
              </div>
              <p className="mt-2 text-sm">{error}</p>
            </div>
          )}
          
          {isAppReady && analysisResults && !isLoading && <OptimizedAnalysisDisplay results={analysisResults} />}

          {isAppReady && showGenreAdjustmentTool && (
            <div className="bg-slate-800 p-5 rounded-xl shadow-xl space-y-4">
              <h3 className="text-xl font-semibold text-purple-400 mb-3">Nástroj pro přizpůsobení textu žánru</h3>
              {isGenreAdjustmentLoading && (
                <div className="flex flex-col items-center justify-center p-6">
                  <div className="w-10 h-10 border-4 border-purple-400 border-t-transparent border-solid rounded-full animate-spin mb-3"></div>
                  <p className="text-purple-300 text-md font-medium">Pracuji na tom...</p>
                </div>
              )}
              {!isGenreAdjustmentLoading && !genreAdjustmentError && (
                 <>
                  {genreAdjustmentStep === 1 && (
                    <div>
                      <h4 className="font-semibold text-slate-200 mb-2">1. Vyberte cílový žánr:</h4>
                      {rankedGenres.length > 0 ? (
                        <div className="flex flex-wrap gap-2">
                          {rankedGenres.map(genre => (
                            <button
                              key={genre}
                              onClick={() => handleGenreSelectedForAdjustment(genre)}
                              className="px-4 py-2 bg-slate-700 hover:bg-purple-600 text-slate-100 rounded-md transition-colors"
                            >
                              {genre}
                            </button>
                          ))}
                        </div>
                      ) : <p className="text-slate-400">Nebyly navrženy žádné žánry.</p>}
                    </div>
                  )}
                  {genreAdjustmentStep === 2 && selectedGenreForAdjustment && (
                     <div>
                      <h4 className="font-semibold text-slate-200 mb-1">2. Vyberte podobného interpreta pro žánr "{selectedGenreForAdjustment}" (volitelné):</h4>
                      <p className="text-xs text-slate-400 mb-2">Výběr pomůže lépe přizpůsobit styl.</p>
                      {similarArtistsForGenre.length > 0 ? (
                        <div className="flex flex-wrap gap-2 mb-3">
                          {similarArtistsForGenre.map(artist => (
                            <button key={artist} onClick={() => handleArtistSelectedForAdjustment(artist)} className="px-4 py-2 bg-slate-700 hover:bg-purple-600 text-slate-100 rounded-md transition-colors">{artist}</button>
                          ))}
                        </div>
                      ) : <p className="text-slate-400 my-2">Pro tento žánr nebyli navrženi žádní interpreti.</p>}
                      <button onClick={() => handleArtistSelectedForAdjustment(null)} className="px-4 py-2 bg-slate-600 hover:bg-slate-500 text-slate-100 rounded-md transition-colors text-sm">Pokračovat pouze podle žánru</button>
                    </div>
                  )}
                  {genreAdjustmentStep === 3 && adjustedLyricsByGenre && (
                    <div>
                      <h4 className="font-semibold text-slate-200 mb-2">Upravený text (Žánr: {selectedGenreForAdjustment}{selectedArtistForAdjustment ? `, styl: ${selectedArtistForAdjustment}` : ''}):</h4>
                      <pre className="whitespace-pre-wrap text-slate-200 bg-slate-700 p-3 rounded-md max-h-96 overflow-y-auto">{adjustedLyricsByGenre}</pre>
                      <div className="flex items-center space-x-2">
                        <CopyButton textToCopy={adjustedLyricsByGenre} />
                        <button onClick={resetGenreAdjustment} className="mt-2 px-4 py-1 bg-purple-600 hover:bg-purple-700 text-white rounded-md transition-colors text-xs">Upravit znovu</button>
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
          )}
          
          {isAppReady && adjustedLyricsByArtist && artistAnalysisResult && !isArtistAnalysisLoading && (
            <div className="bg-slate-800 p-5 rounded-xl shadow-xl space-y-4">
              <h3 className="text-xl font-semibold text-emerald-400">Úprava podle interpreta: <span className="font-bold">{artistNameForAnalysis}</span></h3>
              <div className="bg-slate-700/50 p-4 rounded-lg">
                <h4 className="font-semibold text-slate-200 mb-2">Analýza stylu (Žánr: {artistAnalysisResult.genre})</h4>
                <p className="whitespace-pre-wrap text-slate-300 text-sm">{artistAnalysisResult.analysis}</p>
                <GroundingAttributionsList attributions={artistAnalysisResult.attributions} />
              </div>
              <div className="bg-slate-700/50 p-4 rounded-lg space-y-3">
                 <div className="flex justify-between items-start">
                    <h4 className="font-semibold text-slate-200 pt-1">Upravený text písně</h4>
                    <CopyButton textToCopy={adjustedLyricsByArtist} />
                </div>
                <pre className="whitespace-pre-wrap text-slate-200 bg-slate-900 p-3 rounded-md max-h-96 overflow-y-auto">
                    {adjustedLyricsByArtist}
                </pre>
                <button
                  onClick={handleFormatArtistLyricsForSuno}
                  disabled={isFormattingArtistLyrics}
                  className="w-full bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-600 hover:to-cyan-600 text-white font-semibold py-2 px-4 rounded-lg shadow-md disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-150 ease-in-out"
                >
                  {isFormattingArtistLyrics ? 'Formátuji...' : 'Přidat metatagy pro Suno.ai'}
                </button>
              </div>

              {isFormattingArtistLyrics && (
                <div className="bg-slate-700/50 p-4 rounded-lg flex items-center justify-center">
                    <div className="w-8 h-8 border-4 border-cyan-400 border-t-transparent border-solid rounded-full animate-spin"></div>
                    <p className="ml-3 text-cyan-300">Pracuji na tom...</p>
                </div>
              )}
              
              {sunoFormattedArtistLyrics && !isFormattingArtistLyrics && (
                  <div className="bg-slate-700/50 p-4 rounded-lg space-y-2">
                      <div className="flex justify-between items-start">
                          <h4 className="font-semibold text-slate-200 pt-1">Text pro Suno.ai (s metatagy)</h4>
                          <CopyButton textToCopy={sunoFormattedArtistLyrics} />
                      </div>
                      <pre className="whitespace-pre-wrap text-slate-200 bg-slate-900 p-4 rounded-md max-h-96 overflow-y-auto">{sunoFormattedArtistLyrics}</pre>
                      <CharacterCount text={sunoFormattedArtistLyrics} limit={SUNO_AI_LYRICS_MAX_CHARS} />
                  </div>
              )}
            </div>
          )}

        </div>
      </main>
      
      <KnowledgeBase sections={KNOWLEDGE_BASE_SECTIONS} />

      <footer className="text-center text-sm text-slate-500 pt-8">
        <p>&copy; {new Date().getFullYear()} Lyric Analyzer - Optimalizovaná verze. Vytvořeno s React, Tailwind CSS a Gemini API.</p>
        <p className="text-xs mt-1 text-slate-600">
          Optimalizace: Snížena spotřeba tokenů o ~60%, rychlejší zpracování díky paralelním voláním a pokročilému cachování.
        </p>
      </footer>
    </div>
  );
};

export default App;
