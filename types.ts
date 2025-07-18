export interface GroundingAttribution {
  web?: {
    uri: string;
    title: string;
  };
  // Add other types if needed, e.g., retrievedContext for Vertex AI Search
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
  rawArtistNames?: string[]; // Stored for intermediate processing
  artistSearchAttributions?: GroundingAttribution[]; // Attributions for the "top artists" search itself

  // For genre adjustment feature - can be integrated later or kept separate
  adjustedLyricsByGenre?: string;
  sourceGenreForAdjustment?: string;
  sourceArtistForAdjustment?: string;
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
