import React from 'react';
import { MessageSquare } from 'lucide-react';

interface QuestionDisplayProps {
  question: string;
}

export function QuestionDisplay({ question }: QuestionDisplayProps) {
  return (
    <div className="container mb-6">
      <div className="flex items-center gap-3 text-white/90 bg-white/10 p-4 rounded-xl backdrop-blur-sm">
        <MessageSquare className="w-5 h-5" />
        <div className="flex items-center gap-2">
          <span className="font-semibold uppercase">Question:</span>
          <span className="text-white">&quot;{question}&quot;</span>
        </div>
      </div>
    </div>
  );
}