// src/services/geminiService.ts
// OPRAVA: Použití destrukturalizovaného importu
import { GoogleGenerativeAI, GenerateContentResult } from "@google/generative-ai";
import type { GroundingAttribution, ArtistStyleAnalysis } from '../types';
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

// Helper to parse grounding attributions from the new response structure
const parseGroundingAttributionsFromResult = (result: GenerateContentResult): GroundingAttribution[] => {
  const chunks = result.response.candidates?.[0]?.groundingMetadata?.groundingChunks;
  if (!chunks) return [];
  return chunks.map(attr => ({
    web: attr.web ? { uri: attr.web.uri || '', title: attr.web.title || '' } : undefined,
  })).filter((attr): attr is { web: { uri: string; title: string; } } => !!attr.web && (!!attr.web.uri || !!attr.web.title));
};


function parseJsonSafely<T>(jsonString: string, fallback: T, context?: string): T {
  let textToParse = jsonString.trim();

  const fenceRegex = /```(?:json)?\s*\n?([\s\S]*?)\n?\s*```/;
  const match = textToParse.match(fenceRegex);

  if (match && match[1]) {
    textToParse = match[1].trim();
  }

  try {
    const parsed = JSON.parse(textToParse);
    return parsed as T;
  } catch (error: any) {
    const arrayMatch = jsonString.match(/(\[[\s\S]*?\])/);
    if (arrayMatch && arrayMatch[1]) {
      try {
        return JSON.parse(arrayMatch[1]) as T;
      } catch (e2) {
        // ignore
      }
    }

    const objectMatch = jsonString.match(/(\{[\s\S]*?\})/);
    if (objectMatch && objectMatch[1]) {
      try {
        return JSON.parse(objectMatch[1]) as T;
      } catch (e3) {
        // ignore
      }
    }

    console.error(`[${context || 'JSON Parse'}] JSON parsing failed: ${error.message}`);
    return fallback;
  }
}

export const GEMINI_MODEL = "gemini-1.5-flash-latest";

// Optimalizovaná verze - kombinuje více analýz do jednoho volání
export const getComprehensiveAnalysis = async (ai: GoogleGenerativeAI, lyrics: string): Promise<{
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

  const model = ai.getGenerativeModel({
    model: GEMINI_MODEL,
    systemInstruction: `${ANALYSIS_PERSONA}\n\nVrať POUZE platný JSON objekt bez dalšího textu.`,
    generationConfig: {
      responseMimeType: "application/json",
    }
  });

  const result = await model.generateContent(prompt);
  const responseText = result.response.text();

  const parsedResult = parseJsonSafely(responseText, {
    genre: "Neznámý žánr",
    weakSpots: [],
    topArtists: [],
    rankedGenres: []
  }, "getComprehensiveAnalysis");

  const attributions = parseGroundingAttributionsFromResult(result);

  const finalResult = {
    genre: parsedResult.genre,
    weakSpots: parsedResult.weakSpots,
    topArtists: { artists: parsedResult.topArtists, attributions },
    rankedGenres: parsedResult.rankedGenres
  };

  cache.set(cacheKey, finalResult);
  return finalResult;
};

// Optimalizovaná verze analýzy interpretů - paralelní zpracování
export const getArtistAnalyses = async (ai: GoogleGenerativeAI, artistNames: string[], genre: string): Promise<Array<{ analysis: string, attributions?: GroundingAttribution[] }>> => {
  const promises = artistNames.map(async (artistName) => {
    const cacheKey = `artist-analysis-${artistName.toLowerCase().trim()}-${genre.toLowerCase()}`;
    const cached = cache.get(cacheKey);
    if (cached) return cached;

    const prompt = `Stručně analyzuj styl psaní textů interpreta "${artistName}" v žánru "${genre}". Max 3 věty. Zaměř se na klíčové charakteristiky jeho textů.`;

    const model = ai.getGenerativeModel({
        model: GEMINI_MODEL,
        systemInstruction: COMPACT_PERSONA
    });

    const result = await model.generateContent(prompt);

    const finalResult = {
      analysis: result.response.text(),
      attributions: parseGroundingAttributionsFromResult(result)
    };

    cache.set(cacheKey, finalResult);
    return finalResult;
  });

  return Promise.all(promises);
};

// Optimalizovaná verze vylepšení textů - kratší prompt
export const getImprovedLyrics = async (ai: GoogleGenerativeAI, originalLyrics: string, weakSpots: string[], genre: string, artistAnalyses: string[]): Promise<string> => {
  const prompt = `Vylepši tento text pro žánr ${genre}:

PŮVODNÍ TEXT:
${originalLyrics}

SLABINY: ${weakSpots.join(', ') || 'Bez specifických slabin'}
STYL: Inspiruj se styly: ${artistAnalyses.slice(0, 3).join('; ')}

Vrať POUZE vylepšený text bez komentářů.`;

  const model = ai.getGenerativeModel({ model: GEMINI_MODEL, systemInstruction: IMPROVEMENT_PERSONA });
  const result = await model.generateContent(prompt);

  return result.response.text();
};

// Optimalizovaná verze Suno formátování - kratší prompt s příklady
export const getSunoFormattedLyrics = async (ai: GoogleGenerativeAI, improvedLyrics: string, genre: string): Promise<string> => {
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

  const model = ai.getGenerativeModel({ model: GEMINI_MODEL, systemInstruction: SUNO_PERSONA });
  const result = await model.generateContent(prompt);

  let formatted = result.response.text();
  if (formatted.length > 3000) {
    formatted = formatted.substring(0, 2990) + "\n[ZKRÁCENO]";
  }
  return formatted;
};

// Optimalizovaná verze Style of Music - velmi kratký prompt
export const getStyleOfMusic = async (ai: GoogleGenerativeAI, genre: string): Promise<string> => {
  const prompt = `"Style of Music" pro Suno.ai (max 200 znaků, anglicky):
Žánr: ${genre}
Příklad: "Upbeat pop rock with energetic drums"

Vrať POUZE popis stylu:`;

  const model = ai.getGenerativeModel({ model: GEMINI_MODEL, systemInstruction: COMPACT_PERSONA });
  const result = await model.generateContent(prompt);

  let style = result.response.text();
  if (style.length > 200) {
    style = style.substring(0, 197) + "...";
  }
  return style;
};

export const getSimilarArtistsForGenre = async (ai: GoogleGenerativeAI, lyrics: string, genre: string): Promise<string[]> => {
  const cacheKey = `similar-artists-${genre.toLowerCase()}-${Buffer.from(lyrics).toString('base64').slice(0, 30)}`;
  const cached = cache.get(cacheKey);
  if (cached) return cached;

  const prompt = `5 interpretů podobných stylu tohoto textu v žánru '${genre}'. JSON pole: ["Artist1", "Artist2", ...]

Text: ${lyrics.substring(0, 500)}...`;

  const model = ai.getGenerativeModel({
    model: GEMINI_MODEL,
    systemInstruction: COMPACT_PERSONA,
    generationConfig: {
        responseMimeType: "application/json"
    }
  });
  const result = await model.generateContent(prompt);

  const parsedResult = parseJsonSafely<string[]>(result.response.text(), [], "getSimilarArtistsForGenre");
  cache.set(cacheKey, parsedResult);
  return parsedResult;
};

export const adjustLyricsToGenreAndArtist = async (
  ai: GoogleGenerativeAI,
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

  const model = ai.getGenerativeModel({
    model: GEMINI_MODEL,
    systemInstruction: IMPROVEMENT_PERSONA,
    generationConfig: {
        temperature: 0.7
    }
  });
  const result = await model.generateContent(prompt);

  const adjustedText = result.response.text();
  cache.set(cacheKey, adjustedText);
  return adjustedText;
};

export const analyzeArtistForStyleTransfer = async (ai: GoogleGenerativeAI, artistName: string): Promise<ArtistStyleAnalysis> => {
  const cacheKey = `artist-style-${artistName.toLowerCase().trim()}`;
  const cached = cache.get(cacheKey);
  if (cached) return cached;

  const prompt = `Analýza stylu interpreta "${artistName}". JSON: {"genre": "žánr", "analysis": "analýza stylu (5-7 vět)"}`;

  const model = ai.getGenerativeModel({
    model: GEMINI_MODEL,
    systemInstruction: ANALYSIS_PERSONA
  });

  const result = await model.generateContent(prompt);
  const responseText = result.response.text();

  const analysisData = parseJsonSafely<{ genre: string; analysis: string; }>(
    responseText,
    { genre: 'Neznámý', analysis: 'Analýza se nezdařila.' },
    "analyzeArtistForStyleTransfer"
  );

  const attributions = parseGroundingAttributionsFromResult(result);

  const finalResult = { ...analysisData, attributions };

  cache.set(cacheKey, finalResult);
  return finalResult;
};

// Utility pro vyčištění cache
export const clearCache = () => {
  cache.clear();
};