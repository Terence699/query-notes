'use client';

import { useState } from 'react';
import { searchNotes } from '@/actions/notes';

// Search Icon Component
function SearchIcon({ className = "h-5 w-5 text-muted-foreground" }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
      />
    </svg>
  );
}

// Clear Icon Component
function ClearIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="h-4 w-4 text-muted-foreground hover:text-foreground"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
    </svg>
  );
}

type Note = {
  id: number;
  title: string | null;
  content: string | null;
  updated_at: string;
};

interface SearchBarProps {
  onSearchResults?: (notes: Note[] | undefined) => void;
  placeholder?: string;
  onClearSearch?: () => void;
}

export default function SearchBar({ onSearchResults, placeholder = "Search notes...", onClearSearch }: SearchBarProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);

  // Manual search function
  const handleSearch = async () => {
    if (searchQuery.trim() === '') {
      // Clear search results when query is empty
      onSearchResults?.(undefined);
      return;
    }

    setIsSearching(true);
    try {
      const results = await searchNotes(searchQuery);
      onSearchResults?.(results);
    } catch (error) {
      console.error('Search failed:', error);
      onSearchResults?.([]);
    } finally {
      setIsSearching(false);
    }
  };

  // Handle Enter key press
  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSearch();
    }
  };

  const handleClear = () => {
    setSearchQuery('');
    // Clear search results immediately when clearing
    onSearchResults?.(undefined);
    onClearSearch?.();
  };

  return (
    <div className="relative w-full max-w-lg">
      <div className="relative">
        {/* Search icon on the left */}
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          {isSearching ? (
            <div className="w-4 h-4 border-2 border-muted-foreground border-t-transparent rounded-full animate-spin"></div>
          ) : (
            <SearchIcon className="h-4 w-4 text-muted-foreground" />
          )}
        </div>

        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder={placeholder}
          disabled={isSearching}
          className="w-full pl-10 pr-10 py-2.5 bg-background border border-border rounded-xl focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all duration-200 shadow-sm hover:shadow-md disabled:bg-muted disabled:text-muted-foreground text-foreground placeholder:text-muted-foreground"
        />

        {/* Clear button on the right */}
        {searchQuery && !isSearching && (
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
            <button
              onClick={handleClear}
              className="hover:bg-muted p-1 rounded-full transition-colors"
              title="Clear search"
            >
              <ClearIcon />
            </button>
          </div>
        )}
      </div>
    </div>
  );
} 