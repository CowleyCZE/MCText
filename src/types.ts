export interface GroundingAttribution {
  web?: {
    uri: string;
    title: string;
  };
}

export interface WeakSpot {
  text: string;
  description: string;
  startIndex: number;
  endIndex: number;
}

export interface ArtistInfo {
  name: string;
  analysis?: string;
  searchAttributions?: GroundingAttribution[];
}

export interface AnalysisResults {
  genre: string;
  weakSpots: WeakSpot[];
  topArtists: ArtistInfo[];
  improvedLyrics: string;
  sunoFormattedLyrics: string;
  styleOfMusic: string;
  rawArtistNames?: string[];
  artistSearchAttributions?: GroundingAttribution[];
}

export interface KnowledgeBaseSection {
  id: string;
  title: string;
  content: React.ReactNode;
}

export interface ArtistStyleAnalysis {
  genre: string;
  analysis: string;
  attributions?: GroundingAttribution[];
}

// Typ pro lokální cache session (nahrazuje Firebase SavedLyricSession)
export interface CachedLyricSession {
  id: string;
  title: string;
  lyrics: string;
  createdAt: number; // timestamp
  
  // Cached analysis results
  analysisResults?: AnalysisResults | null; 
  artistAnalysisResult?: ArtistStyleAnalysis | null;
  adjustedLyricsByArtist?: string | null;
  sunoFormattedArtistLyrics?: string | null;
  artistNameForAnalysis?: string;

  adjustedLyricsByGenre?: string | null;
  selectedGenreForAdjustment?: string | null;
  selectedArtistForAdjustment?: string | null;
}
