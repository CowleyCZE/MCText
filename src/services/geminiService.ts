
import { GoogleGenAI, GenerateContentResponse, GroundingChunk } from "@google/genai";
import type { GroundingAttribution, ArtistStyleAnalysis } from '../types'; // Local GroundingAttribution type
import { CORE_PERSONA } from '../persona'; // Import core persona

// Helper to parse grounding attributions
const parseGroundingAttributions = (genAIAttributions: GroundingChunk[] | undefined): GroundingAttribution[] => {
  if (!genAIAttributions) return [];
  return genAIAttributions.map(attr => ({
    web: attr.web ? { uri: attr.web.uri || '', title: attr.web.title || '' } : undefined,
  })).filter(attr => attr.web && (attr.web.uri || attr.web.title)); 
};

function parseJsonSafely<T>(jsonString: string, fallback: T, context?: string): T {
  let textToParse = jsonString.trim();
  const originalStringForLog = jsonString.substring(0, 500); 

  const fenceRegex = /```(?:json)?\s*\n?([\s\S]*?)\n?\s*```/;
  const match = textToParse.match(fenceRegex);

  if (match && match[1]) {
    textToParse = match[1].trim();
  }
  const textToParseForLog = textToParse.substring(0,500);

  try {
    const parsed = JSON.parse(textToParse);
    return parsed as T;
  } catch (error: any) {
    const arrayMatch = jsonString.match(/(\[[\s\S]*?\])/);
    if (arrayMatch && arrayMatch[1]) {
      try {
        const parsedArray = JSON.parse(arrayMatch[1]);
        return parsedArray as T;
      } catch (e2) {
        // Fallback failed
      }
    }

    const objectMatch = jsonString.match(/(\{[\s\S]*?\})/);
    if (objectMatch && objectMatch[1]) {
      try {
        const parsedObject = JSON.parse(objectMatch[1]);
        return parsedObject as T;
      } catch (e3) {
        // Fallback failed
      }
    }
    
    console.error(
        `[${context || 'JSON Parse'}] All JSON parsing attempts failed. Error: ${error.message}`
    );
    return fallback;
  }
}


export const GEMINI_MODEL = "gemini-2.5-flash"; // Export model name

export const getGenre = async (ai: GoogleGenAI, lyrics: string): Promise<string> => {
  const prompt = `Analyzuj následující text písně a urči nejvhodnější hudební žánr. Odpověz pouze názvem žánru (např. "Pop", "Rock", "Hip-Hop", "Folk", "Electronic"). Text písně:\n\n${lyrics}`;
  const response: GenerateContentResponse = await ai.models.generateContent({
    model: GEMINI_MODEL,
    contents: prompt,
    config: { systemInstruction: CORE_PERSONA }
  });
  return response.text.trim() || "Neznámý žánr";
};

export const getWeakSpots = async (ai: GoogleGenAI, lyrics: string): Promise<string[]> => {
  const prompt = `Analyzuj následující text písně a identifikuj konkrétní slabé části, jako jsou klišé, neobratné formulace, nekonzistentní rýmy nebo špatně rozvinuté verše. Vrať svá zjištění POUZE jako JSON pole řetězců, kde každý řetězec popisuje jednu slabinu, bez jakéhokoliv dalšího textu nebo vysvětlení. Příklad odpovědi: ["Rým v druhé sloce je příliš vynucený.", "Refrén postrádá údernost."]. Text písně:\n\n${lyrics}`;
  const response: GenerateContentResponse = await ai.models.generateContent({
    model: GEMINI_MODEL,
    contents: prompt,
    config: { 
      systemInstruction: CORE_PERSONA,
      responseMimeType: "application/json" 
    }
  });
  return parseJsonSafely<string[]>(response.text, [], "getWeakSpots");
};

export const getTopArtists = async (ai: GoogleGenAI, genre: string): Promise<{ artists: string[], attributions?: GroundingAttribution[] }> => {
  const prompt = `Vypiš 5 nejúspěšnějších a nejvlivnějších hudebních interpretů v žánru "${genre}". Zaměř se na současné umělce, pokud je to možné, ale zahrň i historicky významné, pokud jsou relevantní. Odpověz POUZE jako seznam jmen oddělených čárkami, bez jakéhokoliv dalšího textu nebo vysvětlení. Příklad odpovědi: Artist A, Artist B, Artist C, Artist D, Artist E`;
  const response: GenerateContentResponse = await ai.models.generateContent({
    model: GEMINI_MODEL,
    contents: prompt,
    config: { 
      systemInstruction: CORE_PERSONA,
      tools: [{googleSearch: {}}]
    }
  });
  const artists = response.text.trim().split(',').map(name => name.trim()).filter(Boolean);
  const attributions = parseGroundingAttributions(response.candidates?.[0]?.groundingMetadata?.groundingChunks);
  return { artists, attributions };
};

export const getArtistAnalysis = async (ai: GoogleGenAI, artistName: string, genre: string): Promise<{ analysis: string, attributions?: GroundingAttribution[] }> => {
  const prompt = `Pro interpreta "${artistName}" v žánru "${genre}" stručně analyzuj jeho typický styl psaní písní, lyrická témata a běžné struktury skladeb. Co činí jeho texty efektivními v tomto žánru? Poskytni stručnou analýzu (2-4 věty). Odpověz pouze textem analýzy.`;
  const response: GenerateContentResponse = await ai.models.generateContent({
    model: GEMINI_MODEL,
    contents: prompt,
    config: { 
      systemInstruction: CORE_PERSONA,
      tools: [{googleSearch: {}}] 
    }
  });
  const analysis = response.text.trim();
  const attributions = parseGroundingAttributions(response.candidates?.[0]?.groundingMetadata?.groundingChunks);
  return { analysis, attributions };
};

export const getImprovedLyrics = async (ai: GoogleGenAI, originalLyrics: string, weakSpots: string[], genre: string, artistAnalyses: string[]): Promise<string> => {
  const prompt = `Původní text písně:
--- Původní text ---
${originalLyrics}
---
Identifikované slabé části:
- ${weakSpots.join('\n- ') || 'Žádné specifické slabiny nebyly automaticky identifikovány.'}
---
Cílový žánr: ${genre}
---
Postřehy od úspěšných interpretů žánru ${genre} (např. na základě analýz interpretů jako ${artistAnalyses.map(a => a.split(':')[0]).join(', ')}):
${artistAnalyses.join('\n\n')}
---
Přepiš a vylepši slabé části původního textu. Zachovej hlavní myšlenku a příběh, pokud je to možné, ale vylepši rýmy, rytmus, obraznost a emocionální dopad tak, aby text odpovídal stylu žánru ${genre}.
Zaměř se na konkrétní vylepšení rýmů, frázování a celkové soudržnosti. Použij bohatší slovní zásobu, silnější obrazy a metafory relevantní k žánru.
Výstupem by měl být POUZE kompletní vylepšený text písně. Nepřidávej žádné úvodní ani závěrečné fráze typu "Zde je vylepšený text:".
`;
  const response: GenerateContentResponse = await ai.models.generateContent({
    model: GEMINI_MODEL,
    contents: prompt,
    config: { systemInstruction: CORE_PERSONA }
  });
  return response.text.trim();
};

const SUNO_METATAGS_EXAMPLES = "[intro], [verse], [pre-chorus], [chorus], [hook], [bridge], [solo], [instrumental], [outro], [break], [interlude], [fade out], [male singer], [female singer], [rap], [spoken word], [scream], [whisper], [background vocals], [harmony], [ad libs], [tempo: 120], [key: Cmaj], [genre: pop], [mood: happy], [style: acoustic], [guitar solo], [piano intro], [energetic], [emotional], [upbeat], [slow build], [strings section], [drum fill], [quiet part], [loud part]";

export const getSunoFormattedLyrics = async (ai: GoogleGenAI, improvedLyrics: string, genre: string): Promise<string> => {
  const prompt = `Vezmi následující vylepšený text písně a naformátuj ho pro Suno.ai.
Cílový žánr je "${genre}".
Vyber nejvhodnější metatagy Suno.ai (např. ${SUNO_METATAGS_EXAMPLES}) a správně je vlož do textu.
DŮLEŽITÉ PRAVIDLO: Strukturální tagy jako [verse], [chorus], [intro], [outro], [bridge], [solo], [instrumental], [pre-chorus] MUSÍ být VŽDY na samostatném řádku.
Ostatní popisné tagy (např. [male singer], [upbeat], [acoustic guitar]) mohou být na konci řádku textu nebo na samostatném řádku pod sekcí, kterou popisují, pokud to dává smysl.
Finální text, včetně textu písně a metatagů, NESMÍ překročit 3000 znaků.
Zajisti, aby metatagy byly použity efektivně pro strukturování písně a vyjádření její zamýšlené nálady a prvků. Nepoužívej nadbytečné nebo protichůdné tagy.
Nevkládej žádné vysvětlující komentáře k metatagům, pouze metatagy samotné a text písně.
Text písně k formátování:
--- Text písně ---
${improvedLyrics}
---
Výstupem by měl být POUZE naformátovaný text písně pro Suno.ai. Nepřidávej žádné úvodní ani závěrečné fráze jako "Zde je naformátovaný text:".
`;
  const response: GenerateContentResponse = await ai.models.generateContent({
    model: GEMINI_MODEL,
    contents: prompt,
    config: { systemInstruction: CORE_PERSONA }
  });
  let formatted = response.text.trim();
  if (formatted.length > 3000) {
    formatted = formatted.substring(0, 2990) + "\n[TEXT ZKRÁCEN]"; 
  }
  return formatted;
};

export const getStyleOfMusic = async (ai: GoogleGenAI, sunoFormattedLyrics: string, genre: string): Promise<string> => {
  const prompt = `Na základě žánru "${genre}" a následujícího textu písně (včetně Suno.ai metatagů) napiš stručný popis "Style of Music" pro Suno.ai.
Tento popis by měl být poutavý a přesně odrážet náladu a hudební charakteristiky písně.
Popis NESMÍ překročit 200 znaků. Měl by být v angličtině, jak je pro Suno.ai obvyklé.
Příklady: "Epic orchestral trailer music, cinematic, intense", "Chill lofi hip hop beat, relaxing, study music", "Upbeat 80s synthwave, retro, driving bassline", "Emotional acoustic ballad, heartfelt female vocals, strings".
Nepřidávej žádné úvodní ani závěrečné fráze typu "Zde je návrh stylu hudby:".

Text písně s metatagy:
--- Text písně ---
${sunoFormattedLyrics}
---
Výstupem by měl být POUZE text "Style of Music".
`;
  const response: GenerateContentResponse = await ai.models.generateContent({
    model: GEMINI_MODEL,
    contents: prompt,
    config: { systemInstruction: CORE_PERSONA }
  });
  let style = response.text.trim();
  if (style.length > 200) {
    style = style.substring(0, 197) + "...";
  }
  return style;
};

export const getRankedGenres = async (ai: GoogleGenAI, lyrics: string): Promise<string[]> => {
  const prompt = `Analyzuj tento text písně a navrhni 5 až 7 hudebních žánrů, ke kterým by se nejvíce hodil. 
Seřaď je od nejvhodnějšího po nejméně vhodný. 
Odpověz POUZE jako JSON pole řetězců s názvy žánrů. 
Příklad odpovědi: ["Pop", "Indie Pop", "Synth Pop", "Rock", "Folk Rock", "Singer-Songwriter"]. Text písně:
---
${lyrics}
---`;
  const response: GenerateContentResponse = await ai.models.generateContent({
    model: GEMINI_MODEL,
    contents: prompt,
    config: { 
      systemInstruction: CORE_PERSONA,
      responseMimeType: "application/json" 
    }
  });
  return parseJsonSafely<string[]>(response.text, [], "getRankedGenres");
};

export const getSimilarArtistsForGenre = async (ai: GoogleGenAI, lyrics: string, genre: string): Promise<string[]> => {
  const prompt = `Na základě následujícího textu písně a pro žánr '${genre}', navrhni 5 hudebních interpretů, kteří mají podobný styl psaní textů, témata nebo celkovou náladu.
Odpověz POUZE jako JSON pole řetězců se jmény interpretů. 
Příklad odpovědi: ["Artist X", "Artist Y", "Artist Z", "Artist A", "Artist B"]. Text písně:
---
${lyrics}
---`;
  const response: GenerateContentResponse = await ai.models.generateContent({
    model: GEMINI_MODEL,
    contents: prompt,
    config: { 
      systemInstruction: CORE_PERSONA,
      responseMimeType: "application/json" 
    }
  });
  return parseJsonSafely<string[]>(response.text, [], "getSimilarArtistsForGenre");
};

export const adjustLyricsToGenreAndArtist = async (
  ai: GoogleGenAI,
  originalLyrics: string,
  targetGenre: string,
  artistName?: string | null,
  artistAnalysis?: string | null
): Promise<string> => {
  const artistPromptPart = artistName && artistAnalysis
    ? `Navíc se pokus co nejvěrněji napodobit styl psaní textů interpreta '${artistName}'. Jako hlavní vodítko pro jeho styl použij tuto expertní analýzu:

--- ANALÝZA STYLU: ${artistName} ---
${artistAnalysis}
---
`
    : artistName
    ? `Navíc se pokus co nejvěrněji napodobit styl psaní textů interpreta '${artistName}'. Zohledni jeho charakteristická témata, volbu slov, frázování, rytmus, používání lyrických prostředků a způsob vyprávění, jak je popsáno ve tvých znalostních bázích.`
    : '';

  const prompt = `Tvým úkolem je přepsat následující původní text písně.
Cílový žánr je '${targetGenre}'.
${artistPromptPart}
Výsledný text by měl být nejen stylisticky přesný, ale také umělecky hodnotný, se silným emocionálním dopadem a originálními nápady.
Zachovej základní myšlenku původního textu, pokud je to možné a vhodné.

Původní text k úpravě:
---
${originalLyrics}
---

Vrať POUZE kompletní, nově přepsaný text písně. Nepřidávej žádné úvodní fráze, komentáře, vysvětlení, nadpisy ani původní text. Jen čistý text upravené písně.`;

  const response: GenerateContentResponse = await ai.models.generateContent({
    model: GEMINI_MODEL,
    contents: prompt,
    config: {
      systemInstruction: CORE_PERSONA,
      temperature: 0.7
    }
  });
  return response.text.trim();
};

export const analyzeArtistForStyleTransfer = async (ai: GoogleGenAI, artistName: string): Promise<ArtistStyleAnalysis> => {
    const prompt = `Pro umělce "${artistName}" proveď podrobnou analýzu jeho stylu pro účely přepsání textu. Zjisti jeho primární hudební žánr a analyzuj jeho typický styl psaní textů: běžná témata, slovní zásobu, rýmovací schémata, strukturu písní a celkovou náladu. Odpověz POUZE ve formátu:
Žánr: [zde uveď primární žánr]
Analýza: [zde uveď analýzu stylu o 5-7 větách]
Nepřidávej žádné další formátování, nadpisy ani markdown značky.`;

  const response: GenerateContentResponse = await ai.models.generateContent({
    model: GEMINI_MODEL,
    contents: prompt,
    config: { 
      systemInstruction: CORE_PERSONA,
      tools: [{googleSearch: {}}]
    }
  });

  const responseText = response.text.trim();
  const match = responseText.match(/Žánr:\s*([\s\S]*?)\s*Analýza:\s*([\s\S]*)/);

  let analysisData: { genre: string; analysis: string; };

  if (match && match[1] && match[2]) {
    analysisData = {
      genre: match[1].trim(),
      analysis: match[2].trim(),
    };
  } else {
    // Fallback if parsing fails - maybe model just returned the analysis text
    analysisData = { genre: 'Neznámý', analysis: responseText };
  }
  
  const attributions = parseGroundingAttributions(response.candidates?.[0]?.groundingMetadata?.groundingChunks);
  
  return { ...analysisData, attributions };
};
