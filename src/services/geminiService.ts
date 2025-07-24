
import { GoogleGenAI, GenerateContentResponse, GroundingChunk } from "@google/genai";
import type { GroundingAttribution, ArtistStyleAnalysis } from '../types'; // Local GroundingAttribution type
import { COMPACT_PERSONA, ANALYSIS_PERSONA, IMPROVEMENT_PERSONA, SUNO_PERSONA } from '../persona';

// Cache pro optimalizaci API volání
interface CacheEntry {
  data: any;
  timestamp: number;
}

class OptimizedCache {
  private cache = new Map<string, CacheEntry>();
  private readonly TTL = 24 * 60 * 60 * 1000; // 24 hodin

  set(key: string, data: any): void {
    this.cache.set(key, {
      data,
      timestamp: Date.now()
    });
  }

  get(key: string): any | null {
    const entry = this.cache.get(key);
    if (!entry) return null;
    
    if (Date.now() - entry.timestamp > this.TTL) {
      this.cache.delete(key);
      return null;
    }
    
    return entry.data;
  }

  clear(): void {
    this.cache.clear();
  }
}

const cache = new OptimizedCache();

// Helper to parse grounding attributions
const parseGroundingAttributions = (genAIAttributions: GroundingChunk[] | undefined): GroundingAttribution[] => {
  if (!genAIAttributions) return [];
  return genAIAttributions.map(attr => ({
    web: attr.web ? { uri: attr.web.uri || '', title: attr.web.title || '' } : undefined,
  })).filter(attr => attr.web && (attr.web.uri || attr.web.title)); 
};

function parseJsonSafely<T>(jsonString: string, fallback: T, context?: string): T {
  let textToParse = jsonString.trim();
  
  // Pokus o extrakci JSON z markdown bloků
  const fenceRegex = /```(?:json)?\s*\n?([\s\S]*?)\n?\s*```/;
  const match = textToParse.match(fenceRegex);

  if (match && match[1]) {
    textToParse = match[1].trim();
  }

  try {
    const parsed = JSON.parse(textToParse);
    return parsed as T;
  } catch (error: any) {
    // Pokus o extrakci prvního pole
    const arrayMatch = jsonString.match(/(\[[\s\S]*?\])/);
    if (arrayMatch && arrayMatch[1]) {
      try {
        return JSON.parse(arrayMatch[1]) as T;
      } catch (e2) {}
    }

    // Pokus o extrakci prvního objektu
    const objectMatch = jsonString.match(/(\{[\s\S]*?\})/);
    if (objectMatch && objectMatch[1]) {
      try {
        return JSON.parse(objectMatch[1]) as T;
      } catch (e3) {}
    }
    
    console.error(`[${context || 'JSON Parse'}] JSON parsing failed: ${error.message}`);
    return fallback;
  }
}

export const GEMINI_MODEL = "gemini-2.5-flash-preview-04-17"; // Export model name

// Optimalizovaná verze - kombinuje více analýz do jednoho volání
export const getComprehensiveAnalysis = async (ai: GoogleGenAI, lyrics: string): Promise<{
  genre: string;
  weakSpots: string[];
  topArtists: { artists: string[], attributions?: GroundingAttribution[] };
  rankedGenres: string[];
}> => {
  const cacheKey = `comprehensive-${Buffer.from(lyrics).toString('base64').slice(0, 50)}`;
  const cached = cache.get(cacheKey);
  if (cached) return cached;

  const prompt = `Analyzuj následující text písně komplexně. Vrať odpověď POUZE jako JSON objekt s těmito klíči:
{
  "genre": "hlavní doporučený žánr (string)",
  "weakSpots": ["slabé části textu (array of strings)"],
  "topArtists": ["5 top interpretů pro hlavní žánr (array of strings)"],
  "rankedGenres": ["5-7 žánrů seřazených od nejvhodnějšího (array of strings)"]
}

Text písně:
${lyrics}`;

  const response: GenerateContentResponse = await ai.models.generateContent({
    model: GEMINI_MODEL,
    contents: prompt,
    config: { 
      systemInstruction: `${ANALYSIS_PERSONA}\n\nVrať POUZE platný JSON objekt bez dalšího textu.`,
      responseMimeType: "application/json",
      tools: [{googleSearch: {}}]
    }
  });

  const result = parseJsonSafely(typeof response.text === 'string' ? response.text : '', {
    genre: "Neznámý žánr",
    weakSpots: [],
    topArtists: [],
    rankedGenres: []
  }, "getComprehensiveAnalysis");

  const attributions = parseGroundingAttributions(response.candidates?.[0]?.groundingMetadata?.groundingChunks);
  
  const finalResult = {
    genre: result.genre,
    weakSpots: result.weakSpots,
    topArtists: { artists: result.topArtists, attributions },
    rankedGenres: result.rankedGenres
  };

  cache.set(cacheKey, finalResult);
  return finalResult;
};

// Optimalizovaná verze analýzy interpretů - paralelní zpracování
export const getArtistAnalyses = async (ai: GoogleGenAI, artistNames: string[], genre: string): Promise<Array<{ analysis: string, attributions?: GroundingAttribution[] }>> => {
  const promises = artistNames.map(async (artistName) => {
    const cacheKey = `artist-analysis-${artistName.toLowerCase().trim()}-${genre.toLowerCase()}`;
    const cached = cache.get(cacheKey);
    if (cached) return cached;

    const prompt = `Stručně analyzuj styl psaní textů interpreta "${artistName}" v žánru "${genre}". Max 3 věty. Zaměř se na klíčové charakteristiky jeho textů.`;
    
    const response: GenerateContentResponse = await ai.models.generateContent({
      model: GEMINI_MODEL,
      contents: prompt,
      config: { 
        systemInstruction: COMPACT_PERSONA,
        tools: [{googleSearch: {}}] 
      }
    });
    
    const result = {
      analysis: typeof response.text === 'string' ? response.text.trim() : '',
      attributions: parseGroundingAttributions(response.candidates?.[0]?.groundingMetadata?.groundingChunks)
    };

    cache.set(cacheKey, result);
    return result;
  });

  return Promise.all(promises);
};

// Optimalizovaná verze vylepšení textů - kratší prompt
export const getImprovedLyrics = async (ai: GoogleGenAI, originalLyrics: string, weakSpots: string[], genre: string, artistAnalyses: string[]): Promise<string> => {
  const prompt = `Vylepši tento text pro žánr ${genre}:

PŮVODNÍ TEXT:
${originalLyrics}

SLABINY: ${weakSpots.join(', ') || 'Bez specifických slabin'}
STYL: Inspiruj se styly: ${artistAnalyses.slice(0, 3).join('; ')}

Vrať POUZE vylepšený text bez komentářů.`;

  const response: GenerateContentResponse = await ai.models.generateContent({
    model: GEMINI_MODEL,
    contents: prompt,
    config: { systemInstruction: IMPROVEMENT_PERSONA }
  });
  
  return typeof response.text === 'string' ? response.text.trim() : '';
};

// Optimalizovaná verze Suno formátování - kratší prompt s příklady
export const getSunoFormattedLyrics = async (ai: GoogleGenAI, improvedLyrics: string, genre: string): Promise<string> => {
  const prompt = `Naformátuj pro Suno.ai (žánr: ${genre}). Max 3000 znaků.

VZOR:
[intro]
[verse]
Text verše...
[chorus]
Text refrénu...
[outro]

TEXT K FORMÁTOVÁNÍ:
${improvedLyrics}

Vrať POUZE naformátovaný text s metatagy.`;

  const response: GenerateContentResponse = await ai.models.generateContent({
    model: GEMINI_MODEL,
    contents: prompt,
    config: { systemInstruction: SUNO_PERSONA }
  });
  
  let formatted = typeof response.text === 'string' ? response.text.trim() : '';
  if (formatted.length > 3000) {
    formatted = formatted.substring(0, 2990) + "\n[ZKRÁCENO]"; 
  }
  return formatted;
};

// Optimalizovaná verze Style of Music - velmi kratký prompt
export const getStyleOfMusic = async (ai: GoogleGenAI, genre: string): Promise<string> => {
  const prompt = `"Style of Music" pro Suno.ai (max 200 znaků, anglicky):
Žánr: ${genre}
Příklad: "Upbeat pop rock with energetic drums"

Vrať POUZE popis stylu:`;

  const response: GenerateContentResponse = await ai.models.generateContent({
    model: GEMINI_MODEL,
    contents: prompt,
    config: { systemInstruction: COMPACT_PERSONA }
  });
  
  let style = typeof response.text === 'string' ? response.text.trim() : '';
  if (style.length > 200) {
    style = style.substring(0, 197) + "...";
  }
  return style;
};

// Zachovávám původní funkce pro kompatibilitu
export const getGenre = async (ai: GoogleGenAI, lyrics: string): Promise<string> => {
  const analysis = await getComprehensiveAnalysis(ai, lyrics);
  return analysis.genre;
};

export const getWeakSpots = async (ai: GoogleGenAI, lyrics: string): Promise<string[]> => {
  const analysis = await getComprehensiveAnalysis(ai, lyrics);
  return analysis.weakSpots;
};

export const getTopArtists = async (ai: GoogleGenAI, genre: string): Promise<{ artists: string[], attributions?: GroundingAttribution[] }> => {
  // Pro kompatibilitu - v praxi použije výsledek z comprehensive analysis
  const prompt = `Top 5 interpretů žánru "${genre}". JSON pole jmen: ["Artist1", "Artist2", ...]`;
  const response: GenerateContentResponse = await ai.models.generateContent({
    model: GEMINI_MODEL,
    contents: prompt,
    config: { 
      systemInstruction: COMPACT_PERSONA,
      tools: [{googleSearch: {}}]
    }
  });
  const artists = parseJsonSafely<string[]>(typeof response.text === 'string' ? response.text : '', [], "getTopArtists");
  const attributions = parseGroundingAttributions(response.candidates?.[0]?.groundingMetadata?.groundingChunks);
  return { artists, attributions };
};

export const getArtistAnalysis = async (ai: GoogleGenAI, artistName: string, genre: string): Promise<{ analysis: string, attributions?: GroundingAttribution[] }> => {
  const analyses = await getArtistAnalyses(ai, [artistName], genre);
  return analyses[0] || { analysis: '', attributions: [] };
};

export const getRankedGenres = async (ai: GoogleGenAI, lyrics: string): Promise<string[]> => {
  const analysis = await getComprehensiveAnalysis(ai, lyrics);
  return analysis.rankedGenres;
};

export const getSimilarArtistsForGenre = async (ai: GoogleGenAI, lyrics: string, genre: string): Promise<string[]> => {
  const cacheKey = `similar-artists-${genre.toLowerCase()}-${Buffer.from(lyrics).toString('base64').slice(0, 30)}`;
  const cached = cache.get(cacheKey);
  if (cached) return cached;

  const prompt = `5 interpretů podobných stylu tohoto textu v žánru '${genre}'. JSON pole: ["Artist1", "Artist2", ...]

Text: ${lyrics.substring(0, 500)}...`;
  
  const response: GenerateContentResponse = await ai.models.generateContent({
    model: GEMINI_MODEL,
    contents: prompt,
    config: { 
      systemInstruction: COMPACT_PERSONA,
      responseMimeType: "application/json" 
    }
  });
  
  const result = parseJsonSafely<string[]>(typeof response.text === 'string' ? response.text : '', [], "getSimilarArtistsForGenre");
  cache.set(cacheKey, result);
  return result;
};

export const adjustLyricsToGenreAndArtist = async (
  ai: GoogleGenAI,
  originalLyrics: string,
  targetGenre: string,
  artistName?: string | null,
  artistAnalysis?: string | null
): Promise<string> => {
  const cacheKey = `adjust-${targetGenre}-${artistName || 'none'}-${Buffer.from(originalLyrics).toString('base64').slice(0, 30)}`;
  const cached = cache.get(cacheKey);
  if (cached) return cached;

  const artistPrompt = artistName && artistAnalysis
    ? `Styl: ${artistName} (${artistAnalysis})`
    : artistName
    ? `Styl: ${artistName}`
    : '';

  const prompt = `Přepiš text pro žánr '${targetGenre}'. ${artistPrompt}

PŮVODNÍ:
${originalLyrics}

Vrať POUZE přepsaný text:`;

  const response: GenerateContentResponse = await ai.models.generateContent({
    model: GEMINI_MODEL,
    contents: prompt,
    config: {
      systemInstruction: IMPROVEMENT_PERSONA,
      temperature: 0.7
    }
  });
  
  const result = typeof response.text === 'string' ? response.text.trim() : '';
  cache.set(cacheKey, result);
  return result;
};

export const analyzeArtistForStyleTransfer = async (ai: GoogleGenAI, artistName: string): Promise<ArtistStyleAnalysis> => {
  const cacheKey = `artist-style-${artistName.toLowerCase().trim()}`;
  let cached = null;
  
  // Zkusím cache i localStorage pro zachování kompatibility
  try {
    const localStorageData = localStorage.getItem(`artist-analysis:${artistName.toLowerCase().trim()}`);
    if (localStorageData) {
      cached = JSON.parse(localStorageData);
    }
  } catch (e) {}
  
  if (!cached) {
    cached = cache.get(cacheKey);
  }
  
  if (cached) return cached;

  const prompt = `Analýza stylu interpreta "${artistName}". JSON: {"genre": "žánr", "analysis": "analýza stylu (5-7 vět)"}`;

  const response: GenerateContentResponse = await ai.models.generateContent({
    model: GEMINI_MODEL,
    contents: prompt,
    config: { 
      systemInstruction: ANALYSIS_PERSONA,
      tools: [{googleSearch: {}}]
    }
  });

  const analysisData = parseJsonSafely<{ genre: string; analysis: string; }>(
    typeof response.text === 'string' ? response.text : '', 
    { genre: 'Neznámý', analysis: 'Analýza se nezdařila.' }, 
    "analyzeArtistForStyleTransfer"
  );
  
  const attributions = parseGroundingAttributions(response.candidates?.[0]?.groundingMetadata?.groundingChunks);
  
  const result = { ...analysisData, attributions };
  
  // Uložím do obou cachí
  cache.set(cacheKey, result);
  try {
    localStorage.setItem(`artist-analysis:${artistName.toLowerCase().trim()}`, JSON.stringify(result));
  } catch (e) {}
  
  return result;
};

// Nová optimalizovaná funkce pro kompletní analýzu v jednom volání
export const getCompleteAnalysis = async (ai: GoogleGenAI, lyrics: string) => {
  const comprehensive = await getComprehensiveAnalysis(ai, lyrics);
  const artistAnalyses = await getArtistAnalyses(ai, comprehensive.topArtists.artists, comprehensive.genre);
  
  return {
    ...comprehensive,
    artistAnalyses
  };
};

// Utility pro vyčištění cache
export const clearCache = () => {
  cache.clear();
};
