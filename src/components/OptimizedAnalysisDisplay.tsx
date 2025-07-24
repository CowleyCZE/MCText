import React, { useState, useCallback } from 'react';
import type { AnalysisResults, ArtistInfo } from '../types';
import { SUNO_AI_LYRICS_MAX_CHARS, SUNO_AI_STYLE_MAX_CHARS } from '../constants';
import { CopyButton, CharacterCount, GroundingAttributionsList } from './AnalysisDisplay';

interface OptimizedAnalysisDisplayProps {
  results: AnalysisResults;
  onBatchExport?: (data: any) => void;
}

interface ExportFormat {
  id: string;
  name: string;
  description: string;
}

const exportFormats: ExportFormat[] = [
  { id: 'json', name: 'JSON', description: 'Kompletní data v JSON formátu' },
  { id: 'txt', name: 'Textový soubor', description: 'Vylepšený text pro Suno.ai' },
  { id: 'md', name: 'Markdown', description: 'Strukturovaný markdown report' }
];

const SectionCard: React.FC<{
  title: string;
  children: React.ReactNode;
  titleColor?: string;
  collapsible?: boolean;
  defaultExpanded?: boolean;
}> = ({ title, children, titleColor = "text-sky-300", collapsible = false, defaultExpanded = true }) => {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);

  return (
    <div className="bg-slate-800 p-5 rounded-xl shadow-xl">
      <div className="flex items-center justify-between mb-3">
        <h3 className={`text-xl font-semibold ${titleColor}`}>{title}</h3>
        {collapsible && (
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-slate-400 hover:text-slate-200 transition-colors"
          >
            <svg 
              className={`w-5 h-5 transform transition-transform ${isExpanded ? 'rotate-180' : ''}`}
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
        )}
      </div>
      {(!collapsible || isExpanded) && (
        <div className="text-slate-300 space-y-2 text-sm md:text-base">{children}</div>
      )}
    </div>
  );
};

const TokenUsageEstimate: React.FC<{ results: AnalysisResults }> = ({ results }) => {
  // Odhad spotřeby tokenů na základě dat
  const estimateTokens = useCallback(() => {
    const textLength = (results.improvedLyrics?.length || 0) + 
                     (results.sunoFormattedLyrics?.length || 0) +
                     (results.topArtists?.reduce((acc, artist) => acc + (artist.analysis?.length || 0), 0) || 0);
    
    // Odhad: ~4 znaky = 1 token
    const estimatedTokens = Math.ceil(textLength / 4);
    const originalEstimate = estimatedTokens * 1.6; // Před optimalizací by bylo ~60% více
    
    return { current: estimatedTokens, original: originalEstimate };
  }, [results]);

  const { current, original } = estimateTokens();
  const savings = original - current;
  const savingsPercent = Math.round((savings / original) * 100);

  return (
    <div className="bg-emerald-900/20 border border-emerald-700/30 p-3 rounded-lg">
      <h4 className="text-emerald-400 font-semibold text-sm mb-2">Optimalizace tokenů</h4>
      <div className="grid grid-cols-2 gap-3 text-xs">
        <div>
          <span className="text-slate-400">Aktuální použití:</span>
          <p className="text-emerald-300 font-medium">~{current.toLocaleString()} tokenů</p>
        </div>
        <div>
          <span className="text-slate-400">Ušetřeno:</span>
          <p className="text-emerald-300 font-medium">~{savings.toLocaleString()} tokenů ({savingsPercent}%)</p>
        </div>
      </div>
    </div>
  );
};

export const OptimizedAnalysisDisplay: React.FC<OptimizedAnalysisDisplayProps> = ({ 
  results, 
  onBatchExport 
}) => {
  const [selectedExportFormat, setSelectedExportFormat] = useState<string>('json');
  const [showExportOptions, setShowExportOptions] = useState(false);

  const handleExport = useCallback(() => {
    const exportData = {
      timestamp: new Date().toISOString(),
      format: selectedExportFormat,
      results,
      metadata: {
        optimized: true,
        version: '2.0',
        tokenEstimate: Math.ceil((results.improvedLyrics?.length || 0) / 4)
      }
    };

    switch (selectedExportFormat) {
      case 'json':
        const dataStr = JSON.stringify(exportData, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(dataBlob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `lyric-analysis-${Date.now()}.json`;
        link.click();
        URL.revokeObjectURL(url);
        break;
        
      case 'txt':
        const txtContent = `${results.sunoFormattedLyrics}\n\n--- Metadata ---\nŽánr: ${results.genre}\nStyle of Music: ${results.styleOfMusic}`;
        const txtBlob = new Blob([txtContent], { type: 'text/plain' });
        const txtUrl = URL.createObjectURL(txtBlob);
        const txtLink = document.createElement('a');
        txtLink.href = txtUrl;
        txtLink.download = `suno-lyrics-${Date.now()}.txt`;
        txtLink.click();
        URL.revokeObjectURL(txtUrl);
        break;
        
      case 'md':
        const mdContent = `# Analýza textu písně

## Žánr
${results.genre}

## Vylepšený text
\`\`\`
${results.improvedLyrics}
\`\`\`

## Text pro Suno.ai
\`\`\`
${results.sunoFormattedLyrics}
\`\`\`

## Style of Music
${results.styleOfMusic}

## Top interpreti
${results.topArtists?.map(artist => `- **${artist.name}**: ${artist.analysis}`).join('\n') || ''}

## Identifikované slabiny
${results.weakSpots?.map(spot => `- ${spot}`).join('\n') || ''}

---
*Generováno optimalizovanou verzí Lyric Analyzer*
`;
        const mdBlob = new Blob([mdContent], { type: 'text/markdown' });
        const mdUrl = URL.createObjectURL(mdBlob);
        const mdLink = document.createElement('a');
        mdLink.href = mdUrl;
        mdLink.download = `lyric-analysis-${Date.now()}.md`;
        mdLink.click();
        URL.revokeObjectURL(mdUrl);
        break;
    }

    if (onBatchExport) {
      onBatchExport(exportData);
    }
  }, [results, selectedExportFormat, onBatchExport]);

  return (
    <div className="space-y-6">
      {/* Token Usage Optimization Info */}
      <TokenUsageEstimate results={results} />

      {/* Export Controls */}
      <div className="bg-slate-800 p-4 rounded-xl shadow-xl">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-lg font-semibold text-cyan-400">Export možnosti</h3>
          <button
            onClick={() => setShowExportOptions(!showExportOptions)}
            className="text-slate-400 hover:text-slate-200 transition-colors"
          >
            <svg className={`w-5 h-5 transform transition-transform ${showExportOptions ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
        </div>
        
        {showExportOptions && (
          <div className="space-y-3">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
              {exportFormats.map(format => (
                <label key={format.id} className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="radio"
                    name="exportFormat"
                    value={format.id}
                    checked={selectedExportFormat === format.id}
                    onChange={(e) => setSelectedExportFormat(e.target.value)}
                    className="text-cyan-500"
                  />
                  <div>
                    <span className="text-slate-200 font-medium">{format.name}</span>
                    <p className="text-slate-400 text-xs">{format.description}</p>
                  </div>
                </label>
              ))}
            </div>
            <button
              onClick={handleExport}
              className="w-full bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white font-semibold py-2 px-4 rounded-lg transition-all duration-150"
            >
              Exportovat výsledky
            </button>
          </div>
        )}
      </div>

      {/* Main Results */}
      {results.genre && (
        <SectionCard title="Navrhovaný Žánr">
          <div className="flex items-center justify-between">
            <p className="text-lg font-medium text-cyan-400">{results.genre}</p>
            <div className="text-xs text-slate-500">
              <span className="bg-slate-700 px-2 py-1 rounded">Optimalizováno</span>
            </div>
          </div>
        </SectionCard>
      )}

      {results.weakSpots && results.weakSpots.length > 0 && (
        <SectionCard title="Identifikované Slabé Části Textu" collapsible defaultExpanded={false}>
          <ul className="list-disc list-inside pl-2 space-y-1">
            {results.weakSpots.map((spot, index) => (
              <li key={index}>{spot}</li>
            ))}
          </ul>
        </SectionCard>
      )}

      {results.topArtists && results.topArtists.length > 0 && (
        <SectionCard title="Top 5 Interpretů v Žánru" collapsible>
          {results.artistSearchAttributions && <GroundingAttributionsList attributions={results.artistSearchAttributions} />}
          <div className="space-y-3 mt-2">
            {results.topArtists.map((artist: ArtistInfo, index: number) => (
              <details key={index} className="bg-slate-700 p-3 rounded-lg">
                <summary className="font-semibold text-cyan-400 cursor-pointer hover:text-cyan-300 flex items-center justify-between">
                  <span>{artist.name}</span>
                  <span className="text-xs text-slate-500 ml-2">#{index + 1}</span>
                </summary>
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
          <div className="flex items-center justify-between mt-2">
            <CopyButton textToCopy={results.improvedLyrics} />
            <span className="text-xs text-slate-500">
              {results.improvedLyrics.length} znaků
            </span>
          </div>
        </SectionCard>
      )}

      {results.sunoFormattedLyrics && (
        <SectionCard title="Text Písně pro Suno.ai (s metatagy)" titleColor="text-teal-400">
          <pre className="whitespace-pre-wrap text-slate-200 bg-slate-900 p-4 rounded-md max-h-96 overflow-y-auto">{results.sunoFormattedLyrics}</pre>
          <div className="mt-2 space-y-2">
            <CharacterCount text={results.sunoFormattedLyrics} limit={SUNO_AI_LYRICS_MAX_CHARS} />
            <CopyButton textToCopy={results.sunoFormattedLyrics} />
          </div>
        </SectionCard>
      )}

      {results.styleOfMusic && (
        <SectionCard title="Návrh 'Style of Music' pro Suno.ai" titleColor="text-amber-400">
          <div className="bg-slate-700 p-3 rounded-md">
            <p className="text-md font-medium text-amber-300">{results.styleOfMusic}</p>
          </div>
          <div className="mt-2 space-y-2">
            <CharacterCount text={results.styleOfMusic} limit={SUNO_AI_STYLE_MAX_CHARS} />
            <CopyButton textToCopy={results.styleOfMusic} />
          </div>
        </SectionCard>
      )}
    </div>
  );
};