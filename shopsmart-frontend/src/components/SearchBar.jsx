import React from 'react';
import { Search } from 'lucide-react';

export default function SearchBar({ searchTerm, setSearchTerm }) {
  return (
    <div className="relative max-w-md w-full">
      <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
        <Search className="h-5 w-5 text-gray-400" />
      </span>
      <input
        type="text"
        placeholder="Standard Catalog Search..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white shadow-sm"
      />
    </div>
  );
}