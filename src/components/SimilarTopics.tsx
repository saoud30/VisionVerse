import React from 'react';
import { Lightbulb } from 'lucide-react';

interface SimilarTopicsProps {
  topics: string[];
  onTopicClick: (topic: string) => void;
  onReset: () => void;
}

export function SimilarTopics({ topics, onTopicClick, onReset }: SimilarTopicsProps) {
  return (
    <div className="container glass-card rounded-xl p-6">
      <h2 className="text-sm font-semibold uppercase mb-4 text-blue-900">Similar Topics:</h2>
      <div className="space-y-2">
        {topics.map((topic, index) => (
          <button
            key={index}
            onClick={() => onTopicClick(topic)}
            className="flex items-center w-full p-4 text-left bg-gradient-to-r from-white to-blue-50 rounded-lg hover:shadow-md transition-all group"
          >
            <Lightbulb className="w-4 h-4 text-blue-600 opacity-0 group-hover:opacity-100 transition-opacity" />
            <span className="ml-2 text-sm text-gray-700">{topic}</span>
          </button>
        ))}
      </div>
    </div>
  );
}