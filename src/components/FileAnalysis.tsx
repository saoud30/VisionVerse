import React from 'react';
import { Image as ImageIcon, Code } from 'lucide-react';

interface FileAnalysisProps {
  file: File;
  analysis: {
    type: 'image' | 'code';
    content: string;
    metadata?: any;
  };
}

export function FileAnalysis({ file, analysis }: FileAnalysisProps) {
  return (
    <div className="container glass-card rounded-xl p-6 mb-4">
      <div className="flex items-center gap-3 mb-4">
        {analysis.type === 'image' && <ImageIcon className="w-5 h-5 text-blue-600" />}
        {analysis.type === 'code' && <Code className="w-5 h-5 text-blue-600" />}
        <h2 className="text-sm font-semibold uppercase text-blue-900">
          {analysis.type.charAt(0).toUpperCase() + analysis.type.slice(1)} Analysis
        </h2>
      </div>

      {analysis.type === 'image' && (
        <div className="space-y-4">
          <img
            src={URL.createObjectURL(file)}
            alt="Analyzed image"
            className="max-h-64 rounded-lg object-contain mx-auto"
          />
          <div className="prose prose-sm max-w-none">
            <p className="text-gray-700">{analysis.content}</p>
            {analysis.metadata && (
              <div className="mt-4">
                <h3 className="text-sm font-medium text-gray-900">Detected Objects:</h3>
                <ul className="mt-2 grid grid-cols-2 gap-2">
                  {analysis.metadata.objects?.map((obj: any, index: number) => (
                    <li key={index} className="text-sm text-gray-600">
                      {obj.label} ({Math.round(obj.score * 100)}%)
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      )}

      {analysis.type === 'code' && (
        <div className="prose prose-sm max-w-none">
          <pre className="bg-gray-50 p-4 rounded-lg overflow-x-auto">
            <code className="text-sm">{file.name}</code>
          </pre>
          <div className="mt-4">
            <h3 className="text-sm font-medium text-gray-900">Explanation:</h3>
            <p className="mt-2 text-gray-700">{analysis.content}</p>
          </div>
        </div>
      )}
    </div>
  );
}