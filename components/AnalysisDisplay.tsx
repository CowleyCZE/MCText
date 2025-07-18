import React, { useState } from 'react';
import type { AnalysisResults, ArtistInfo, GroundingAttribution } from '../types';
import { SUNO_AI_LYRICS_MAX_CHARS, SUNO_AI_STYLE_MAX_CHARS } from '../constants';

interface SectionCardProps {
  title: string;
  children: React.ReactNode;
  titleColor?: string;
}

const SectionCard: React.FC<SectionCardProps> = ({ title, children, titleColor = "text-sky-300" }) => (
  <div className="bg-slate-800 p-5 rounded-xl shadow-xl">
    <h3 className={`text-xl font-semibold mb-3 ${titleColor}`}>{title}</h3>
    <div className="text-slate-300 space-y-2 text-sm md:text-base">{children}</div>
  </div>
);

interface CharacterCountProps {
  text: string;
  limit: number;
}

export const CharacterCount: React.FC<CharacterCountProps> = ({ text, limit }) => {
  const count = text.length;
  const isOverLimit = count > limit;
  return (
    <p className={`text-xs mt-2 ${isOverLimit ? 'text-red-400 font-semibold' : 'text-slate-500'}`}>
      Počet znaků: {count} / {limit} {isOverLimit && "(Překročeno!)"}
    </p>
  );
};

export const CopyButton: React.FC<{ textToCopy: string }> = ({ textToCopy }) => {
  const [copied, setCopied] = useState(false);
  const handleCopy = () => {
    navigator.clipboard.writeText(textToCopy).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };
  return (
    <button
      onClick={handleCopy}
      className="mt-2 px-3 py-1 text-xs bg-sky-600 hover:bg-sky-700 text-white rounded-md transition-colors"
    >
      {copied ? 'Zkopírováno!' : 'Kopírovat'}
    </button>
  );
};

export const GroundingAttributionsList: React.FC<{attributions?: GroundingAttribution[]}> = ({ attributions }) => {
  if (!attributions || attributions.length === 0) return null;
  
  const validAttributions = attributions.filter(attr => attr.web && attr.web.uri && attr.web.title);
  if (validAttributions.length === 0) return null;

  return (
    <div className="mt-2 text-xs text-slate-500">
      <p className="font-medium">Zdroje (Google Search):</p>
      <ul className="list-disc list-inside pl-2">
        {validAttributions.map((attr, idx) => (
          <li key={idx}>
            <a href={attr.web!.uri} target="_blank" rel="noopener noreferrer" className="hover:text-sky-400 underline">
              {attr.web!.title || attr.web!.uri}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}


export const AnalysisDisplay: React.FC<{ results: AnalysisResults }> = ({ results }) => {
  return (
    <div className="space-y-6">
      {results.genre && (
        <SectionCard title="Navrhovaný Žánr">
          <p className="text-lg font-medium text-cyan-400">{results.genre}</p>
        </SectionCard>
      )}

      {results.weakSpots && results.weakSpots.length > 0 && (
        <SectionCard title="Identifikované Slabé Části Textu">
          <ul className="list-disc list-inside pl-2 space-y-1">
            {results.weakSpots.map((spot, index) => (
              <li key={index}>{spot}</li>
            ))}
          </ul>
        </SectionCard>
      )}

      {results.topArtists && results.topArtists.length > 0 && (
        <SectionCard title="Top 5 Interpretů v Žánru">
          {results.artistSearchAttributions && <GroundingAttributionsList attributions={results.artistSearchAttributions} />}
          <div className="space-y-3 mt-2">
            {results.topArtists.map((artist: ArtistInfo, index: number) => (
              <details key={index} className="bg-slate-700 p-3 rounded-lg">
                <summary className="font-semibold text-cyan-400 cursor-pointer hover:text-cyan-300">{artist.name}</summary>
                <div className="mt-2 pl-2 border-l-2 border-slate-600">
                  <p className="whitespace-pre-wrap">{artist.analysis || "Analýza nedostupná."}</p>
                  <GroundingAttributionsList attributions={artist.searchAttributions} />
                </div>
              </details>
            ))}
          </div>
        </SectionCard>
      )}

      {results.improvedLyrics && (
        <SectionCard title="Vylepšený Text Písně">
          <pre className="whitespace-pre-wrap text-slate-200 bg-slate-700 p-3 rounded-md">{results.improvedLyrics}</pre>
          <CopyButton textToCopy={results.improvedLyrics} />
        </SectionCard>
      )}

      {results.sunoFormattedLyrics && (
        <SectionCard title="Text Písně pro Suno.ai (s metatagy)">
          <pre className="whitespace-pre-wrap text-slate-200 bg-slate-900 p-4 rounded-md max-h-96 overflow-y-auto">{results.sunoFormattedLyrics}</pre>
          <CharacterCount text={results.sunoFormattedLyrics} limit={SUNO_AI_LYRICS_MAX_CHARS} />
          <CopyButton textToCopy={results.sunoFormattedLyrics} />
        </SectionCard>
      )}

      {results.styleOfMusic && (
        <SectionCard title="Návrh 'Style of Music' pro Suno.ai">
          <p className="text-md font-medium text-cyan-400 bg-slate-700 p-3 rounded-md">{results.styleOfMusic}</p>
          <CharacterCount text={results.styleOfMusic} limit={SUNO_AI_STYLE_MAX_CHARS} />
          <CopyButton textToCopy={results.styleOfMusic} />
        </SectionCard>
      )}
    </div>
  );
};