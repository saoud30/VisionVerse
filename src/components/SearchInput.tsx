import React, { useState } from 'react';
import { Search, Mic, StopCircle, Wand2 } from 'lucide-react';
import TypeAnimation from './TypeAnimation';
import { SpeechService } from '../services/speech';

interface SearchInputProps {
  value: string;
  onChange: (value: string) => void;
  onSearch: (query: string) => void;
  onFileUpload?: (file: File) => void;
  disabled?: boolean;
}

const speechService = new SpeechService();

export function SearchInput({ value, onChange, onSearch, onFileUpload, disabled }: SearchInputProps) {
  const [isListening, setIsListening] = useState(false);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (value.trim()) {
      onSearch(value.trim());
    }
  };

  const toggleVoiceInput = () => {
    if (isListening) {
      speechService.stopListening();
      setIsListening(false);
    } else {
      speechService.startListening(
        (text) => {
          onChange(text);
          setIsListening(false);
        },
        (error) => {
          console.error('Speech recognition error:', error);
          setIsListening(false);
        }
      );
      setIsListening(true);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && onFileUpload && file.type.startsWith('image/')) {
      onFileUpload(file);
    }
  };

  const isImageGeneration = value.startsWith('@');

  return (
    <form
      onSubmit={handleSubmit}
      className="mx-auto flex h-[66px] w-full items-center justify-between rounded-full bg-white/10 px-6 search-glow backdrop-blur-md border border-white/20 transition-all hover:bg-white/15"
    >
      <div className="flex items-center gap-2 flex-1">
        {isImageGeneration && (
          <Wand2 className="w-5 h-5 text-pink-400" />
        )}
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={isImageGeneration ? "Describe the image you want to generate..." : "Unleash your curiosity, explore the extraordinary..."}
          disabled={disabled}
          className="my-1 w-full text-lg font-light text-white outline-none bg-transparent placeholder:text-white/50 focus-visible:ring-0 focus-visible:ring-offset-0"
          required
        />
      </div>
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={toggleVoiceInput}
          className="p-2 rounded-full hover:bg-white/10 transition-colors"
          disabled={disabled}
        >
          {isListening ? (
            <StopCircle className="w-6 h-6 text-red-400 animate-pulse" />
          ) : (
            <Mic className="w-6 h-6 text-white/80" />
          )}
        </button>
        <button
          type="submit"
          disabled={disabled || !value.trim()}
          className={`relative flex h-[50px] w-[50px] shrink-0 items-center justify-center rounded-full transition-all disabled:opacity-75 ml-2 ${
            isImageGeneration 
              ? 'bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700'
              : 'bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700'
          }`}
        >
          {disabled ? (
            <div className="absolute inset-0 flex items-center justify-center">
              <TypeAnimation />
            </div>
          ) : (
            <Search className="w-6 h-6 text-white" />
          )}
        </button>
      </div>
    </form>
  );
}