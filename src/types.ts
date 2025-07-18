export interface GroundingAttribution {
  web?: {
    uri: string;
    title: string;
  };
}

export interface ArtistInfo {
  name: string;
  analysis?: string;
  searchAttributions?: GroundingAttribution[];
}

export interface AnalysisResults {
  genre: string;
  weakSpots: string[];
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

export interface SavedLyricSession {
  id: string; // Firestore document ID
  title: string;
  cleanedLyrics: string;
  createdAt: any; // Firestore Timestamp
  
  // The state of the app when saved
  analysisResults?: AnalysisResults | null; 
  artistAnalysisResult?: ArtistStyleAnalysis | null;
  adjustedLyricsByArtist?: string | null;
  sunoFormattedArtistLyrics?: string | null;
  artistNameForAnalysis?: string;

  adjustedLyricsByGenre?: string | null;
  selectedGenreForAdjustment?: string | null;
  selectedArtistForAdjustment?: string | null;
}
