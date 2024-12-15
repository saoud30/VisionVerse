import React from 'react';
import { Globe, Instagram, Film } from 'lucide-react';

interface Source {
  title: string;
  link: string;
  snippet: string;
}

interface SourcesProps {
  sources: Source[];
  isLoading?: boolean;
}

export function Sources({ sources, isLoading }: SourcesProps) {
  if (isLoading) {
    return (
      <div className="container mb-4">
        <div className="loader">
          <span></span>
          <span></span>
          <span></span>
        </div>
      </div>
    );
  }

  const getSourceIcon = (url: string) => {
    if (url.includes('wikipedia')) return <Globe className="w-5 h-5" />;
    if (url.includes('instagram')) return <Instagram className="w-5 h-5" />;
    if (url.includes('imdb')) return <Film className="w-5 h-5" />;
    return <Globe className="w-5 h-5" />;
  };

  return (
    <div className="container glass-card rounded-xl p-6 mb-4">
      <h2 className="text-sm font-semibold uppercase mb-4 text-blue-900">Sources:</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {sources.map((source, index) => (
          <a
            key={index}
            href={source.link}
            target="_blank"
            rel="noopener noreferrer"
            className="source-card flex items-center gap-3 p-4 bg-gradient-to-br from-white to-blue-50 rounded-lg hover:shadow-lg"
          >
            <div className="flex-shrink-0 text-blue-600">
              {getSourceIcon(source.link)}
            </div>
            <div className="min-w-0">
              <h3 className="font-medium text-sm text-gray-900 truncate">
                {source.title}
              </h3>
              <p className="text-xs text-blue-600/80 truncate">
                {source.link.replace(/^https?:\/\//, '')}
              </p>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
}