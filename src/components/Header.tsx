import React from 'react';
import { Brain, ArrowLeft } from 'lucide-react';

interface HeaderProps {
  showBackButton?: boolean;
  onBack?: () => void;
}

export function Header({ showBackButton, onBack }: HeaderProps) {
  return (
    <header className="container mx-auto px-4 py-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          {showBackButton && (
            <button
              onClick={onBack}
              className="p-2 hover:bg-white/10 rounded-full transition-colors"
              aria-label="Go back to homepage"
            >
              <ArrowLeft className="w-5 h-5 text-white" />
            </button>
          )}
          <a href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <Brain className="w-8 h-8 text-white float-animation" />
            <span className="font-bold text-xl text-white">AI-Sink</span>
          </a>
        </div>
      </div>
    </header>
  );
}