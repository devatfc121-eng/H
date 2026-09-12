import React, { useState } from 'react';
import { Search, Mic, SlidersHorizontal, X } from 'lucide-react';

interface SearchBarProps {
  searchTerm: string;
  onSearchChange: (val: string) => void;
  onOpenFilter: () => void;
  activeFilterCount: number;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  searchTerm,
  onSearchChange,
  onOpenFilter,
  activeFilterCount,
}) => {
  const [isListening, setIsListening] = useState(false);

  const handleVoiceSearch = () => {
    // Check SpeechRecognition if available, or simulate voice search with speech query
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      try {
        const SpeechRecognition =
          (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
        const recognition = new SpeechRecognition();
        recognition.lang = 'en-IN';
        recognition.interimResults = false;
        recognition.maxAlternatives = 1;

        setIsListening(true);
        recognition.start();

        recognition.onresult = (event: any) => {
          const speechResult = event?.results?.[0]?.[0]?.transcript;
          if (speechResult) {
            onSearchChange(speechResult);
          }
          setIsListening(false);
        };

        recognition.onerror = () => {
          setIsListening(false);
        };

        recognition.onend = () => {
          setIsListening(false);
        };
      } catch {
        setIsListening(false);
      }
    } else {
      // Fallback hint
      setIsListening(true);
      setTimeout(() => {
        setIsListening(false);
      }, 1500);
    }
  };

  return (
    <div className="bg-sky-500 pb-4 px-4 sm:px-6 shadow-sm">
      <div className="max-w-5xl mx-auto">
        <div className="relative flex items-center bg-white rounded-full shadow-md px-4 py-2.5 transition-all focus-within:ring-2 focus-within:ring-sky-300">
          {/* Search Icon */}
          <Search className="w-5 h-5 text-slate-400 shrink-0 mr-2.5" />

          {/* Input */}
          <input
            id="product-search-input"
            type="text"
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search products, composition, brand..."
            className="w-full bg-transparent text-slate-800 placeholder-slate-400 text-sm sm:text-base font-medium focus:outline-none"
          />

          {/* Clear button if text entered */}
          {searchTerm && (
            <button
              onClick={() => onSearchChange('')}
              className="p-1 hover:bg-slate-100 rounded-full text-slate-400 mr-1"
              title="Clear search"
            >
              <X className="w-4 h-4" />
            </button>
          )}

          {/* Voice Search Mic */}
          <button
            id="voice-search-btn"
            type="button"
            onClick={handleVoiceSearch}
            className={`p-1.5 rounded-full transition-colors mr-1.5 ${
              isListening ? 'bg-rose-100 text-rose-600 animate-pulse' : 'text-slate-400 hover:text-sky-600'
            }`}
            title="Voice Search"
          >
            <Mic className="w-5 h-5" />
          </button>

          {/* Filter Modal Trigger */}
          <div className="h-5 w-[1px] bg-slate-200 mx-1" />
          <button
            id="open-filter-modal-btn"
            type="button"
            onClick={onOpenFilter}
            className="relative p-1.5 rounded-full text-slate-600 hover:text-sky-600 transition-colors ml-1"
            title="Filter by form and speciality"
          >
            <SlidersHorizontal className="w-5 h-5" />
            {activeFilterCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-sky-600 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                {activeFilterCount}
              </span>
            )}
          </button>
        </div>

        {isListening && (
          <div className="text-center mt-2 text-xs text-white font-medium animate-bounce">
            Listening... Speak medicine name (e.g., "Acephar", "Omega", "D3")
          </div>
        )}
      </div>
    </div>
  );
};
