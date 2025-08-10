import React, { useState, useEffect } from 'react';
import { SUNO_AI_LYRICS_MAX_CHARS, SUNO_AI_STYLE_MAX_CHARS } from '../constants';
import { CopyButton, CharacterCount } from './AnalysisDisplay';

interface MetaTagsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (description: string | null) => Promise<void> | void;
  isProcessing?: boolean;
  initialDescription?: string;
  result?: { styleOfMusic: string; sunoFormattedLyrics: string } | null;
  error?: string | null;
}

export const MetaTagsModal: React.FC<MetaTagsModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  isProcessing = false,
  initialDescription = '',
  result,
  error
}) => {
  const [description, setDescription] = useState(initialDescription);

  useEffect(() => {
    setDescription(initialDescription);
  }, [initialDescription, isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
      <div className="bg-slate-800 w-full max-w-2xl rounded-xl shadow-2xl overflow-hidden">
        <div className="p-4 border-b border-slate-700 flex items-center justify-between">
          <h3 className="text-lg font-semibold text-teal-300">Generovat meta tagy pro Suno.ai</h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-200">✕</button>
        </div>

        <div className="p-4 space-y-4 max-h-[75vh] overflow-y-auto">
          <div>
            <label className="block text-sm text-slate-300 mb-1">Volitelný popis hudby (EN/CZ):</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Např. melancholic synthwave with 80s vibe... (ponechte prázdné pro automatické určení z textu)"
              rows={3}
              className="w-full p-3 bg-slate-700 border border-slate-600 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 text-slate-100 placeholder-slate-500"
              disabled={isProcessing}
            />
            <p className="text-xs text-slate-500 mt-1">Pokud nic nezadáte, styl bude odvozen přímo z textu písně.</p>
          </div>

          {error && (
            <div className="bg-red-800 border border-red-700 text-red-100 p-3 rounded-md text-sm">
              {error}
            </div>
          )}

          {result ? (
            <div className="space-y-4">
              <div className="bg-slate-700/50 p-3 rounded-lg">
                <div className="flex justify-between items-start">
                  <h4 className="font-semibold text-slate-200">Style of Music</h4>
                  <CopyButton textToCopy={result.styleOfMusic} />
                </div>
                <p className="text-amber-300 mt-1">{result.styleOfMusic}</p>
                <CharacterCount text={result.styleOfMusic} limit={SUNO_AI_STYLE_MAX_CHARS} />
              </div>

              <div className="bg-slate-700/50 p-3 rounded-lg">
                <div className="flex justify-between items-start">
                  <h4 className="font-semibold text-slate-200">Text s metatagy</h4>
                  <CopyButton textToCopy={result.sunoFormattedLyrics} />
                </div>
                <pre className="whitespace-pre-wrap text-slate-200 bg-slate-900 p-3 rounded-md max-h-72 overflow-y-auto">{result.sunoFormattedLyrics}</pre>
                <CharacterCount text={result.sunoFormattedLyrics} limit={SUNO_AI_LYRICS_MAX_CHARS} />
              </div>
            </div>
          ) : null}
        </div>

        <div className="p-4 border-t border-slate-700 flex items-center justify-end gap-2">
          <button onClick={onClose} className="px-3 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-md">Zavřít</button>
          <button
            onClick={() => onConfirm(description.trim() ? description : null)}
            disabled={isProcessing}
            className="px-4 py-2 bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-600 hover:to-cyan-600 text-white rounded-md disabled:opacity-50"
          >
            {isProcessing ? 'Generuji...' : 'Potvrdit a vygenerovat'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default MetaTagsModal;
