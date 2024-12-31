import React from 'react';
import { ExternalLink } from 'lucide-react';
import { Word } from '../types/dictionary';

interface WordListProps {
  words: Word[];
  onWordClick: (wordId: string) => void;
}

export default function WordList({ words, onWordClick }: WordListProps) {
  return (
    <div className="space-y-4">
      {words.map((word) => (
        <div
          key={word.id}
          className="bg-white p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow"
        >
          <div className="flex justify-between items-start">
            <h3 className="text-xl font-semibold text-gray-900">{word.term}</h3>
            <button
              onClick={() => onWordClick(word.id)}
              className="text-blue-500 hover:text-blue-600"
              title="Copy link to word"
            >
              <ExternalLink className="h-5 w-5" />
            </button>
          </div>
          <p className="text-gray-600 mt-2">{word.definition}</p>

          {/* Safe check for customFields */}
          {Array.isArray(word.customFields) && word.customFields.length > 0 && (
            <div className="mt-3 border-t pt-3">
              <div className="grid grid-cols-2 gap-2">
                {word.customFields.map((field) => (
                  <div key={field.id} className="text-sm">
                    <span className="font-medium text-gray-700">{field.name}: </span>
                    <span className="text-gray-600">{field.value}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="mt-2 text-sm text-gray-500">
            Added: {new Date(word.createdAt).toLocaleDateString()}
          </div>
        </div>
      ))}
    </div>
  );
}
