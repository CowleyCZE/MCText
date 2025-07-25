// src/services/geminiService.ts
import { GoogleGenerativeAI, GenerateContentResult } from "@google/generative-ai";
import type { GroundingAttribution, ArtistStyleAnalysis, WeakSpot } from '../types';
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
  return chunks.map((attr: any) => ({
    web: attr.web ? { uri: attr.web.uri || '', title: attr.web.title || '' } : undefined,
  })).filter((attr: any): attr is { web: { uri: string; title: string; } } => !!attr.web && (!!attr.web.uri || !!attr.web.title)); 
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
  weakSpots: WeakSpot[];
  topArtists: { artists: string[], attributions?: GroundingAttribution[] };
  rankedGenres: string[];
}> => {
  const cacheKey = `comprehensive-v2-${Buffer.from(lyrics).toString('base64').slice(0, 50)}`;
  const cached = cache.get(cacheKey);
  if (cached) return cached;

  const prompt = `Analyzuj následující text písně komplexně. Vrať odpověď POUZE jako JSON objekt s těmito klíči:
{
  "genre": "hlavní doporučený žánr (string)",
  "weakSpots": [{"text": "konkrétní slabá část textu", "description": "popis proč je to slabé místo", "startIndex": 0, "endIndex": 15}],
  "topArtists": ["5 top interpretů pro hlavní žánr (array of strings)"],
  "rankedGenres": ["5-7 žánrů seřazených od nejvhodnějšího (array of strings)"]
}

Text písně:
${lyrics}`;

  const model = ai.getGenerativeModel({
    model: GEMINI_MODEL,
    systemInstruction: `${ANALYSIS_PERSONA}\n\nVrať POUZE platný JSON objekt bez dalšího textu. Indexy (startIndex, endIndex) musí přesně odpovídat pozici 'text' v původním textu písně.`,
    tools: [{googleSearchRetrieval: {}}]
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

// Nová funkce pro návrhy na vylepšení konkrétní části
export const getImprovementSuggestions = async (ai: GoogleGenerativeAI, lyrics: string, weakSpot: WeakSpot): Promise<string[]> => {
  const prompt = `Navrhni 3-5 alternativních verzí pro následující problematickou část textu. Soustřeď se na odstranění popsaného problému.\n\nPůvodní text:\n---\n${lyrics}\n---\n\nProblematická část: "${weakSpot.text}"\nProblém: ${weakSpot.description}\n\nVrať odpověď POUZE jako JSON pole stringů: ["návrh 1", "návrh 2", "návrh 3"]`;

  const model = ai.getGenerativeModel({
    model: GEMINI_MODEL,
    systemInstruction: IMPROVEMENT_PERSONA,
    generationConfig: {
      responseMimeType: "application/json",
    }
  });

  const result = await model.generateContent(prompt);
  const responseText = result.response.text();

  return parseJsonSafely<string[]>(responseText, [], "getImprovementSuggestions");
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
        systemInstruction: COMPACT_PERSONA,
        tools: [{googleSearchRetrieval: {}}]
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
export const getImprovedLyrics = async (ai: GoogleGenerativeAI, originalLyrics: string, weakSpots: WeakSpot[], genre: string, artistAnalyses: string[]): Promise<string> => {
  const weakSpotDescriptions = weakSpots.map(ws => ws.description).join(', ');
  const prompt = `Vylepši tento text pro žánr ${genre}:\n\nPŮVODNÍ TEXT:\n${originalLyrics}\n\nSLABINY: ${weakSpotDescriptions || 'Bez specifických slabin'}\nSTYL: Inspiruj se styly: ${artistAnalyses.slice(0, 3).join('; ')}\n\nVrať POUZE vylepšený text bez komentářů.`

  const model = ai.getGenerativeModel({ model: GEMINI_MODEL, systemInstruction: IMPROVEMENT_PERSONA });
  const result = await model.generateContent(prompt);
  
  return result.response.text();
};

// Optimalizovaná verze Suno formátování - kratší prompt s příklady
export const getSunoFormattedLyrics = async (ai: GoogleGenerativeAI, improvedLyrics: string, genre: string): Promise<string> => {
  const prompt = `Naformátuj pro Suno.ai (žánr: ${genre}). Max 3000 znaků.\n\nVZOR:\n[intro]\n[verse]\nText verše...\n[chorus]\nText refrénu...\n[outro]\n\nTEXT K FORMÁTOVÁNÍ:\n${improvedLyrics}\n\nVrať POUZE naformátovaný text s metatagy.`

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
  const prompt = `"Style of Music" pro Suno.ai (max 200 znaků, anglicky):\nŽánr: ${genre}\nPříklad: "Upbeat pop rock with energetic drums"\n\nVrať POUZE popis stylu:`

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

  const prompt = `5 interpretů podobných stylu tohoto textu v žánru '${genre}'. JSON pole: ["Artist1", "Artist2", ...]\n\nText: ${lyrics.substring(0, 500)}...`;
  
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

  const prompt = `Přepiš text pro žánr '${targetGenre}'. ${artistPrompt}\n\nPŮVODNÍ:\n${originalLyrics}\n\nVrať POUZE přepsaný text:`;

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

  const prompt = `Proveď analýzu stylu psaní textů pro interpreta "${artistName}". Vrať odpověď POUZE jako JSON objekt s klíči "genre" a "analysis".`;

  const model = ai.getGenerativeModel({
    model: GEMINI_MODEL,
    systemInstruction: ANALYSIS_PERSONA,
    generationConfig: { 
      responseMimeType: "application/json",
    }
  });

  const result = await model.generateContent(prompt);
  const responseText = result.response.text();

  const analysisData = parseJsonSafely<{ genre: string; analysis: string; }>(responseText, 
    { genre: 'Neznámý', analysis: 'Analýza se nezdařila.' }, 
    "analyzeArtistForStyleTransfer"
  );
  
  // Attributions are not available when search tool is disabled
  const finalResult = { ...analysisData, attributions: [] };
  
  cache.set(cacheKey, finalResult);
  return finalResult;
};

// Utility pro vyčištění cache
export const clearCache = () => {
  cache.clear();
};


// --- Nová funkce pro vylepšení ---
export const getAdvancedSuggestions = async (ai: GoogleGenerativeAI, text: string): Promise<{
  rhymeSuggestions: { [word: string]: string[] };
  synonymSuggestions: { [word: string]: string[] };
  clicheWarnings: string[];
}> => {
  const prompt = `Pro následující text najdi:
1.  **Rýmy:** Pro poslední slovo každého řádku navrhni 3-5 vhodných rýmů.
2.  **Synonyma:** Pro 3-5 klíčových slov v textu navrhni 3-5 synonym.
3.  **Klišé:** Identifikuj případná klišé nebo otřepané fráze.

Vrať odpověď POUZE jako JSON objekt ve formátu:
{
  "rhymeSuggestions": { "slovo1": ["rým1", "rým2"], "slovo2": ["rým3", "rým4"] },
  "synonymSuggestions": { "slovoA": ["synonymum1", "synonymum2"], "slovoB": ["synonymum3", "synonymum4"] },
  "clicheWarnings": ["klišé1", "klišé2"]
}

Text:
${text}`;

  const model = ai.getGenerativeModel({
    model: GEMINI_MODEL,
    systemInstruction: "Jsi asistent pro psaní písňových textů. Tvým úkolem je poskytovat konkrétní, kreativní a kontextuálně vhodné návrhy na vylepšení textu. Soustřeď se na sémantickou a fonetickou kvalitu.",
    generationConfig: {
      responseMimeType: "application/json",
    }
  });

  const result = await model.generateContent(prompt);
  const responseText = result.response.text();

  return parseJsonSafely(responseText, {
    rhymeSuggestions: {},
    synonymSuggestions: {},
    clicheWarnings: []
  }, "getAdvancedSuggestions");
};