import React from 'react';
import { Search } from 'lucide-react';

interface SearchBarProps {
  searchTerm: string;
  onSearch: (term: string) => void;
}

export default function SearchBar({ searchTerm, onSearch }: SearchBarProps) {
  return (
    <div className="relative w-full max-w-xl">
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <Search className="h-5 w-5 text-gray-400" />
      </div>
      <input
        type="text"
        value={searchTerm}
        onChange={(e) => onSearch(e.target.value)}
        className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg 
                 bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 
                 focus:border-transparent"
        placeholder="Search words..."
      />
    </div>
  );
}