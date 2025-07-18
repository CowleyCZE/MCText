
import type { KnowledgeBaseSection } from './types';
import { CzechRhymeAndSemantics } from './knowledge/czechRhymeAndSemantics';
import { PoetryAnalysisForAI } from './knowledge/PoetryAnalysisForAI';
import { PoeticsAndStructureInLyrics } from './knowledge/PoeticsAndStructureInLyrics';
import { SunoAIComprehensiveGuide } from './knowledge/SunoAIComprehensiveGuide';
import { GenreSpecificWritingGuide } from './knowledge/GenreSpecificWritingGuide';
import { SongwritingGuide } from './knowledge/SongwritingGuide';


export const SUNO_AI_LYRICS_MAX_CHARS = 3000;
export const SUNO_AI_STYLE_MAX_CHARS = 200;

export const KNOWLEDGE_BASE_SECTIONS: KnowledgeBaseSection[] = [
  {
    id: 'suno-comprehensive-guide',
    title: 'Průvodce pro Suno.ai',
    content: <SunoAIComprehensiveGuide />,
  },
  {
    id: 'songwriting-guide',
    title: 'Tipy pro psaní textů',
    content: <SongwritingGuide />,
  },
  {
    id: 'genre-specific-guide',
    title: 'Psaní podle žánru',
    content: <GenreSpecificWritingGuide />,
  },
  {
    id: 'alchemical-art-lyrics',
    title: 'Alchymické umění textu',
    content: <CzechRhymeAndSemantics />,
  },
  {
    id: 'architecture-soul-lyrics',
    title: 'Architektura a duše textu',
    content: <PoetryAnalysisForAI />,
  },
  {
    id: 'poetics-and-structure-lyrics',
    title: 'Poetika a struktura v lyrice',
    content: <PoeticsAndStructureInLyrics />,
  },
];