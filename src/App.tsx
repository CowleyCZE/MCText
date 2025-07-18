
import React, { useState, useCallback, useEffect } from 'react';
import { GoogleGenAI } from "@google/genai";
import type { User } from '@firebase/auth';
import { onAuthStateChanged, signInAnonymously, signInWithCustomToken } from "@firebase/auth";
import { LyricInput } from './components/LyricInput';
import { AnalysisDisplay, GroundingAttributionsList, CopyButton, CharacterCount } from './components/AnalysisDisplay';
import { KnowledgeBase } from './components/KnowledgeBase';
import { LoadingSpinner } from './components/LoadingSpinner';
import { SavedLyricsManager } from './components/SavedLyricsManager';
import { KNOWLEDGE_BASE_SECTIONS, SUNO_AI_LYRICS_MAX_CHARS } from './constants';
import type { AnalysisResults, ArtistInfo, ArtistStyleAnalysis, SavedLyricSession } from './types';
import { getGenre, getWeakSpots, getTopArtists, getArtistAnalysis, getImprovedLyrics, getSunoFormattedLyrics, getStyleOfMusic, getRankedGenres, getSimilarArtistsForGenre, adjustLyricsToGenreAndArtist, analyzeArtistForStyleTransfer } from './services/geminiService';
import { auth } from './firebase';
import * as dbService from './services/dbService';
import { stripSunoTags } from './utils';

const App: React.FC = () => {
  const [lyrics, setLyrics] = useState<string>('');
  const [analysisResults, setAnalysisResults] = useState<AnalysisResults | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [dbError, setDbError] = useState<string | null>(null);
  const [isApiKeyMissing, setIsApiKeyMissing] = useState<boolean>(false);
  const [user, setUser] = useState<User | null>(null);
  const [isOffline, setIsOffline] = useState(!navigator.onLine);

  const [showGenreAdjustmentTool, setShowGenreAdjustmentTool] = useState<boolean>(false);
  const [rankedGenres, setRankedGenres] = useState<string[]>([]);
  const [selectedGenreForAdjustment, setSelectedGenreForAdjustment] = useState<string | null>(null);
  const [similarArtistsForGenre, setSimilarArtistsForGenre] = useState<string[]>([]);
  const [selectedArtistForAdjustment, setSelectedArtistForAdjustment] = useState<string | null>(null);
  const [adjustedLyricsByGenre, setAdjustedLyricsByGenre] = useState<string | null>(null);
  const [genreAdjustmentStep, setGenreAdjustmentStep] = useState<number>(0); 
  const [isGenreAdjustmentLoading, setIsGenreAdjustmentLoading] = useState<boolean>(false);
  const [genreAdjustmentError, setGenreAdjustmentError] = useState<string | null>(null);
  
  const [artistNameForAnalysis, setArtistNameForAnalysis] = useState('');
  const [artistAnalysisResult, setArtistAnalysisResult] = useState<ArtistStyleAnalysis | null>(null);
  const [adjustedLyricsByArtist, setAdjustedLyricsByArtist] = useState<string | null>(null);
  const [isArtistAnalysisLoading, setIsArtistAnalysisLoading] = useState(false);
  const [artistAnalysisError, setArtistAnalysisError] = useState<string | null>(null);
  const [sunoFormattedArtistLyrics, setSunoFormattedArtistLyrics] = useState<string | null>(null);
  const [isFormattingArtistLyrics, setIsFormattingArtistLyrics] = useState<boolean>(false);
  
  const [savedSessions, setSavedSessions] = useState<SavedLyricSession[]>([]);
  const [isSessionsLoading, setIsSessionsLoading] = useState<boolean>(true);


  const aiInstance = React.useMemo(() => {
    if (process.env.API_KEY) {
      return new GoogleGenAI({ apiKey: process.env.API_KEY });
    }
    setIsApiKeyMissing(true); 
    return null;
  }, []);
  
  useEffect(() => {
    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
        window.removeEventListener('online', handleOnline);
        window.removeEventListener('offline', handleOffline);
    };
  }, []);

  useEffect(() => {
    if (!process.env.API_KEY) {
      setIsApiKeyMissing(true);
      setError('API klíč pro Google Generative AI není nastaven v prostředí aplikace.');
    }

    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
        if (currentUser) {
            setUser(currentUser);
        } else {
            try {
                if (typeof (window as any).__initial_auth_token !== 'undefined' && (window as any).__initial_auth_token) {
                    const userCredential = await signInWithCustomToken(auth, (window as any).__initial_auth_token);
                    setUser(userCredential.user);
                } else {
                    const userCredential = await signInAnonymously(auth);
                    setUser(userCredential.user);
                }
            } catch (err: any) {
                console.error("Firebase Auth Error:", err);
                let authError = `Chyba autentizace: ${err.message}`;
                if (err.code === 'auth/network-request-failed') {
                    authError = "Chyba sítě při pokusu o přihlášení. Zkontrolujte prosím své internetové připojení.";
                    setIsOffline(true);
                }
                setError(authError);
            }
        }
    });

    return () => unsubscribe();
  }, []);
  
  useEffect(() => {
      if (user) {
          setIsSessionsLoading(true);
          const unsubscribe = dbService.listenToSavedLyrics(
              user.uid,
              ({ sessions, fromCache }) => { // Success callback
                  setSavedSessions(sessions);
                  setIsSessionsLoading(false);
                  if (!fromCache) {
                    setIsOffline(false);
                    setDbError(null); // Clear error on successful connection/reconnection
                  }
              },
              (error) => { // Error callback
                  setDbError("Nepodařilo se navázat spojení s databází. Aplikace pracuje v offline režimu.");
                  setIsSessionsLoading(false);
                  setIsOffline(true);
              }
          );
          return () => unsubscribe();
      } else {
          setSavedSessions([]);
          setIsSessionsLoading(false);
      }
  }, [user]);

  const resetGenreTool = () => {
    setShowGenreAdjustmentTool(false);
    setGenreAdjustmentStep(0);
    setRankedGenres([]);
    setSelectedGenreForAdjustment(null);
    setSimilarArtistsForGenre([]);
    setSelectedArtistForAdjustment(null);
    setAdjustedLyricsByGenre(null);
    setGenreAdjustmentError(null);
  };

  const resetArtistTool = () => {
    setArtistAnalysisResult(null);
    setAdjustedLyricsByArtist(null);
    setSunoFormattedArtistLyrics(null);
    setArtistAnalysisError(null);
  };

  const clearAllResults = (keepLyrics: boolean = false) => {
    setAnalysisResults(null);
    resetGenreTool();
    resetArtistTool();
    setError(null);
    if (!keepLyrics) {
      setLyrics('');
      setArtistNameForAnalysis('');
    }
  };

  /**
   * Clears results that are directly dependent on the main lyrics input,
   * but preserves state that is independent (like artist analysis).
   */
  const clearLyricDependentResults = () => {
    setAnalysisResults(null);
    resetGenreTool();
    // Clear lyrics adjusted by artist, as they depend on the original lyrics
    setAdjustedLyricsByArtist(null);
    setSunoFormattedArtistLyrics(null);
    setError(null);
  };


  const isAppReady = !isApiKeyMissing && user;

  const handleProcessLyrics = useCallback(async () => {
    if (!isAppReady || !aiInstance) {
      setError('Aplikace není připravena, chybí API klíč nebo uživatel není přihlášen.');
      return;
    }
    const cleanedLyrics = stripSunoTags(lyrics);
    if (!cleanedLyrics.trim()) {
      setError('Prosím, zadejte text písně.');
      return;
    }

    setIsLoading(true);
    setError(null);
    clearAllResults(true);

    try {
      let currentResults: Partial<AnalysisResults> = {};

      const genre = await getGenre(aiInstance, cleanedLyrics);
      currentResults.genre = genre;
      setAnalysisResults(prev => ({ ...prev, ...currentResults } as AnalysisResults));

      const weakSpots = await getWeakSpots(aiInstance, cleanedLyrics);
      currentResults.weakSpots = weakSpots;
      setAnalysisResults(prev => ({ ...prev, ...currentResults } as AnalysisResults));
      
      const { artists: artistNames, attributions: artistSearchAttributions } = await getTopArtists(aiInstance, genre);
      currentResults.rawArtistNames = artistNames;
      currentResults.artistSearchAttributions = artistSearchAttributions;
      setAnalysisResults(prev => ({ ...prev, ...currentResults } as AnalysisResults));

      const artistAnalysesPromises = artistNames.map(name => getArtistAnalysis(aiInstance, name, genre));
      const resolvedArtistAnalyses = await Promise.all(artistAnalysesPromises);
      
      const topArtists: ArtistInfo[] = artistNames.map((name, index) => ({
        name,
        analysis: resolvedArtistAnalyses[index].analysis,
        searchAttributions: resolvedArtistAnalyses[index].attributions,
      }));
      currentResults.topArtists = topArtists;
      setAnalysisResults(prev => ({ ...prev, ...currentResults } as AnalysisResults));

      const artistAnalysesTexts = topArtists.map(a => `${a.name}: ${a.analysis || 'N/A'}`);
      const improvedLyrics = await getImprovedLyrics(aiInstance, cleanedLyrics, weakSpots, genre, artistAnalysesTexts);
      currentResults.improvedLyrics = improvedLyrics;
      setAnalysisResults(prev => ({ ...prev, ...currentResults } as AnalysisResults));

      const sunoFormattedLyrics = await getSunoFormattedLyrics(aiInstance, improvedLyrics, genre);
      currentResults.sunoFormattedLyrics = sunoFormattedLyrics;
      setAnalysisResults(prev => ({ ...prev, ...currentResults } as AnalysisResults));
      
      const styleOfMusic = await getStyleOfMusic(aiInstance, sunoFormattedLyrics, genre);
      currentResults.styleOfMusic = styleOfMusic;

      setAnalysisResults(currentResults as AnalysisResults);

    } catch (e: any) {
      console.error("Chyba při zpracování:", e);
      let errorMessage = `Došlo k chybě: ${e.message}.`;
      if (e.message?.includes("API key not valid")) {
         errorMessage = `Poskytnutý API klíč není platný.`;
      } else if (e.message?.toLowerCase().includes("quota")) {
        errorMessage = `Byl překročen limit API (quota). Zkuste to prosím později.`;
      }
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, [lyrics, aiInstance, isAppReady]);

  const handleToggleGenreAdjustmentTool = () => {
    if (!isAppReady) return;
    const cleanedLyrics = stripSunoTags(lyrics);
    if (showGenreAdjustmentTool) {
      resetGenreTool();
    } else {
      if (!cleanedLyrics.trim()) {
        setGenreAdjustmentError("Nejprve prosím vložte text písně do horního pole.");
        return;
      }
      resetArtistTool(); // Close other tool if it was open
      setShowGenreAdjustmentTool(true);
      setGenreAdjustmentError(null);
      handleFetchRankedGenres();
    }
  };
  
  const handleFetchRankedGenres = async () => {
    if (!isAppReady || !aiInstance) return;
    const cleanedLyrics = stripSunoTags(lyrics);
    if (!cleanedLyrics.trim()) {
      setGenreAdjustmentError('Text písně je prázdný.');
      return;
    }
    setIsGenreAdjustmentLoading(true);
    setGenreAdjustmentError(null);
    setRankedGenres([]);
    try {
      const genres = await getRankedGenres(aiInstance, cleanedLyrics);
      setRankedGenres(genres);
      setGenreAdjustmentStep(1); 
    } catch (e: any) {
      setGenreAdjustmentError(`Nepodařilo se načíst žánry: ${e.message}`);
    } finally {
      setIsGenreAdjustmentLoading(false);
    }
  };

  const handleGenreSelectedForAdjustment = async (genre: string) => {
    if (!isAppReady || !aiInstance) return;
    const cleanedLyrics = stripSunoTags(lyrics);
    setSelectedGenreForAdjustment(genre);
    setIsGenreAdjustmentLoading(true);
    setGenreAdjustmentError(null);
    setSimilarArtistsForGenre([]);
    try {
      const artists = await getSimilarArtistsForGenre(aiInstance, cleanedLyrics, genre);
      setSimilarArtistsForGenre(artists);
      setGenreAdjustmentStep(2); 
    } catch (e: any) {
      setGenreAdjustmentError(`Nepodařilo se načíst interprety pro žánr ${genre}: ${e.message}`);
      setGenreAdjustmentStep(1); 
    } finally {
      setIsGenreAdjustmentLoading(false);
    }
  };

  const handleArtistSelectedForAdjustment = (artistName: string | null) => {
    if (!isAppReady) return;
    setSelectedArtistForAdjustment(artistName);
    handleAdjustLyricsSubmit(selectedGenreForAdjustment, artistName);
  };
  
  const handleAdjustLyricsSubmit = async (genre: string | null, artist: string | null) => {
    if (!isAppReady || !aiInstance || !genre) return;
    const cleanedLyrics = stripSunoTags(lyrics);
     if (!cleanedLyrics.trim()) {
      setGenreAdjustmentError('Chybí text písně pro úpravu.');
      return;
    }
    setIsGenreAdjustmentLoading(true);
    setGenreAdjustmentError(null);
    setAdjustedLyricsByGenre(null);
    try {
      const adjustedText = await adjustLyricsToGenreAndArtist(aiInstance, cleanedLyrics, genre, artist);
      setAdjustedLyricsByGenre(adjustedText);
      setGenreAdjustmentStep(3); 
    } catch (e: any) {
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
    if (!isAppReady || !aiInstance || !user) return;
    const cleanedLyrics = stripSunoTags(lyrics);
    if (!cleanedLyrics.trim() || !artistNameForAnalysis.trim()) {
      setArtistAnalysisError("Zadejte prosím text písně i jméno interpreta.");
      return;
    }
    setIsArtistAnalysisLoading(true);
    setArtistAnalysisError(null);
    resetGenreTool();
    resetArtistTool();

    try {
      let analysis = await dbService.getArtistAnalysisFromCache(user.uid, artistNameForAnalysis);

      if (!analysis) {
        analysis = await analyzeArtistForStyleTransfer(aiInstance, artistNameForAnalysis);
        await dbService.saveArtistAnalysisToCache(user.uid, artistNameForAnalysis, analysis);
      }
      setArtistAnalysisResult(analysis);
      
      const adjustedText = await adjustLyricsToGenreAndArtist(aiInstance, cleanedLyrics, analysis.genre, artistNameForAnalysis, analysis.analysis);
      setAdjustedLyricsByArtist(adjustedText);

    } catch (e: any) {
      setArtistAnalysisError(`Chyba při úpravě podle interpreta: ${e.message}`);
    } finally {
      setIsArtistAnalysisLoading(false);
    }
  };

  const handleFormatArtistLyricsForSuno = async () => {
    if (!isAppReady || !aiInstance || !adjustedLyricsByArtist || !artistAnalysisResult) return;
    setIsFormattingArtistLyrics(true);
    setArtistAnalysisError(null);
    try {
      const sunoFormatted = await getSunoFormattedLyrics(aiInstance, adjustedLyricsByArtist, artistAnalysisResult.genre);
      setSunoFormattedArtistLyrics(sunoFormatted);
    } catch (e: any) {
      setArtistAnalysisError(`Nepodařilo se naformátovat text pro Suno.ai: ${e.message}`);
    } finally {
      setIsFormattingArtistLyrics(false);
    }
  };

  const handleSaveSession = async () => {
    if (!isAppReady || !user) return;
    const title = prompt("Zadejte název pro uložení tohoto textu:", "Můj nový text");
    if (!title) return;

    const cleanedLyrics = stripSunoTags(lyrics);

    const sessionData: Omit<SavedLyricSession, 'id' | 'createdAt'> = {
      title,
      cleanedLyrics,
      analysisResults,
      artistAnalysisResult,
      adjustedLyricsByArtist,
      sunoFormattedArtistLyrics,
      artistNameForAnalysis,
      adjustedLyricsByGenre,
      selectedGenreForAdjustment,
      selectedArtistForAdjustment,
    };

    try {
      await dbService.saveLyricSession(user.uid, sessionData);
      alert("Text byl úspěšně uložen!");
    } catch (e: any) {
      setError(`Chyba při ukládání: ${e.message}`);
    }
  };

  const handleLoadSession = (session: SavedLyricSession) => {
    clearAllResults();
    setLyrics(session.cleanedLyrics);
    setAnalysisResults(session.analysisResults || null);
    setArtistAnalysisResult(session.artistAnalysisResult || null);
    setAdjustedLyricsByArtist(session.adjustedLyricsByArtist || null);
    setSunoFormattedArtistLyrics(session.sunoFormattedArtistLyrics || null);
    setArtistNameForAnalysis(session.artistNameForAnalysis || '');
    setAdjustedLyricsByGenre(session.adjustedLyricsByGenre || null);
    setSelectedGenreForAdjustment(session.selectedGenreForAdjustment || null);
    setSelectedArtistForAdjustment(session.selectedArtistForAdjustment || null);
    
    if (session.adjustedLyricsByGenre) {
        setShowGenreAdjustmentTool(true);
        setGenreAdjustmentStep(3);
    }
  };

  const handleDeleteSession = (sessionId: string, sessionTitle: string) => {
    if (!user) return;
    if (window.confirm(`Opravdu si přejete smazat "${sessionTitle}"?`)) {
      dbService.deleteLyricSession(user.uid, sessionId).catch(e => {
        setError(`Nepodařilo se smazat text: ${e.message}`);
      });
    }
  };
  
  const showSaveButton = analysisResults || adjustedLyricsByArtist || adjustedLyricsByGenre;

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
            Pro správnou funkci aplikace je nezbytné, aby byla proměnná prostředí <code className="bg-slate-700 text-emerald-400 px-1.5 py-0.5 rounded-md font-mono text-xs">API_KEY</code> nastavena na platný klíč.
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
          Analyzujte, vylepšete a připravte své texty pro Suno.ai! (Česky)
        </p>
      </header>

      <main className="flex-grow grid grid-cols-1 lg:grid-cols-3 gap-8">
        {(isOffline || dbError) && (
            <div className="lg:col-span-3 bg-amber-800/50 border border-amber-700 text-amber-200 p-3 rounded-lg text-sm flex items-center gap-3">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126z" />
                </svg>
                <span>
                    {dbError || (isOffline && "Aplikace je v offline režimu. Změny se synchronizují po obnovení připojení.")}
                </span>
            </div>
        )}
        <div className="lg:col-span-1 space-y-6">
          <LyricInput
            lyrics={lyrics}
            onLyricsChange={(newLyrics) => {
              setLyrics(newLyrics);
              clearLyricDependentResults();
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
                {showGenreAdjustmentTool ? 'Zavřít nástroj pro žánr' : 'Přizpůsobit text žánru'}
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
                    setArtistNameForAnalysis(e.target.value)
                    resetArtistTool()
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
            
            {user && <SavedLyricsManager sessions={savedSessions} onLoad={handleLoadSession} onDelete={handleDeleteSession} isLoading={isSessionsLoading} />}

        </div>

        <div className="lg:col-span-2 space-y-6">
          {(isLoading || isArtistAnalysisLoading) && <LoadingSpinner />}
          {error && !isLoading && (
            <div className="bg-red-800 border border-red-700 text-red-100 p-4 rounded-lg shadow-md">
              <h3 className="font-semibold text-lg">Chyba</h3>
              <p className="mt-2 text-sm">{error}</p>
            </div>
          )}
          
          {isAppReady && showSaveButton && (
            <div className="bg-slate-800 p-3 rounded-xl shadow-xl flex justify-end">
              <button
                onClick={handleSaveSession}
                className="bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 text-white font-semibold py-2 px-4 rounded-lg shadow-md transition-all duration-150 ease-in-out transform hover:scale-105"
              >
                Uložit aktuální text
              </button>
            </div>
          )}

          {isAppReady && analysisResults && !isLoading && <AnalysisDisplay results={analysisResults} />}

          {isAppReady && showGenreAdjustmentTool && (
            <div className="bg-slate-800 p-5 rounded-xl shadow-xl space-y-4">
              <h3 className="text-xl font-semibold text-purple-400 mb-3">Nástroj pro přizpůsobení textu žánru</h3>
              {isGenreAdjustmentLoading && <div className="flex justify-center p-6"><div className="w-10 h-10 border-4 border-purple-400 border-t-transparent border-solid rounded-full animate-spin"></div></div>}
              {!isGenreAdjustmentLoading && !genreAdjustmentError && (
                 <>
                  {genreAdjustmentStep === 1 && (
                    <div>
                      <h4 className="font-semibold text-slate-200 mb-2">1. Vyberte cílový žánr:</h4>
                      <div className="flex flex-wrap gap-2">
                        {rankedGenres.map(genre => (
                          <button key={genre} onClick={() => handleGenreSelectedForAdjustment(genre)} className="px-4 py-2 bg-slate-700 hover:bg-purple-600 text-slate-100 rounded-md transition-colors">{genre}</button>
                        ))}
                      </div>
                    </div>
                  )}
                  {genreAdjustmentStep === 2 && selectedGenreForAdjustment && (
                     <div>
                      <h4 className="font-semibold text-slate-200 mb-1">2. Vyberte podobného interpreta pro žánr "{selectedGenreForAdjustment}" (volitelné):</h4>
                      <div className="flex flex-wrap gap-2 my-3">
                        {similarArtistsForGenre.map(artist => ( <button key={artist} onClick={() => handleArtistSelectedForAdjustment(artist)} className="px-4 py-2 bg-slate-700 hover:bg-purple-600 text-slate-100 rounded-md transition-colors">{artist}</button>))}
                      </div>
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
                <pre className="whitespace-pre-wrap text-slate-200 bg-slate-900 p-3 rounded-md max-h-96 overflow-y-auto">{adjustedLyricsByArtist}</pre>
                <button onClick={handleFormatArtistLyricsForSuno} disabled={isFormattingArtistLyrics} className="w-full bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-600 hover:to-cyan-600 text-white font-semibold py-2 px-4 rounded-lg shadow-md disabled:opacity-50">
                  {isFormattingArtistLyrics ? 'Formátuji...' : 'Přidat metatagy pro Suno.ai'}
                </button>
              </div>

              {isFormattingArtistLyrics && <div className="bg-slate-700/50 p-4 rounded-lg flex items-center justify-center"><div className="w-8 h-8 border-4 border-cyan-400 border-t-transparent border-solid rounded-full animate-spin"></div><p className="ml-3 text-cyan-300">Pracuji na tom...</p></div>}
              
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
        <p>&copy; {new Date().getFullYear()} Lyric Analyzer. Vytvořeno s React, Firebase a Gemini API.</p>
      </footer>
    </div>
  );
};

export default App;
