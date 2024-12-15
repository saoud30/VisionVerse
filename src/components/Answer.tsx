import React from 'react';
import { Copy, Sparkles } from 'lucide-react';
import { toast, Toaster } from 'react-hot-toast';

interface AnswerProps {
  content: string;
}

export function Answer({ content }: AnswerProps) {
  const handleCopy = () => {
    navigator.clipboard.writeText(content);
    toast('Answer copied to clipboard', {
      icon: '✨',
      style: {
        background: '#4F46E5',
        color: '#fff',
      },
    });
  };

  return (
    <div className="container glass-card rounded-xl p-6 mb-4">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-blue-600" />
          <h2 className="text-sm font-semibold uppercase text-blue-900">Answer:</h2>
        </div>
        {content && (
          <button
            onClick={handleCopy}
            className="p-2 hover:bg-blue-50 rounded-full transition-colors"
            title="Copy answer"
          >
            <Copy className="w-5 h-5 text-blue-600" />
          </button>
        )}
      </div>
      <div className="prose prose-sm max-w-none">
        {content ? (
          <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
            {content.trim()}
          </p>
        ) : (
          <div className="space-y-2">
            <div className="h-4 bg-blue-100 rounded animate-pulse" />
            <div className="h-4 bg-blue-100 rounded animate-pulse w-5/6" />
            <div className="h-4 bg-blue-100 rounded animate-pulse" />
          </div>
        )}
      </div>
      <Toaster position="top-center" reverseOrder={false} />
    </div>
  );
}