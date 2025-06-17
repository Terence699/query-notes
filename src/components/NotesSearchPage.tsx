'use client';

import { useState } from 'react';
import SearchBar from '@/components/SearchBar';
import NotesList from '@/components/NotesList';

type Note = {
  id: number;
  title: string | null;
  content: string | null;
  updated_at: string;
};

interface NotesSearchPageProps {
  initialNotes: Note[];
  createNoteAction: () => Promise<void>;
}

export default function NotesSearchPage({ initialNotes, createNoteAction }: NotesSearchPageProps) {
  const [searchResults, setSearchResults] = useState<Note[] | undefined>(undefined);
  const [isSearching, setIsSearching] = useState(false);

  const handleSearchResults = (notes: Note[] | undefined) => {
    setSearchResults(notes);
    setIsSearching(false);
  };

  const handleClearSearch = () => {
    setSearchResults(undefined);
  };

  return (
    <div className="pt-8">
      {/* Search Bar Section */}
      <div className="mb-8 flex justify-center">
        <SearchBar
          onSearchResults={handleSearchResults}
          placeholder="Search notes by title..."
          onClearSearch={handleClearSearch}
        />
      </div>

      {/* Notes List */}
      <NotesList
        initialNotes={initialNotes}
        searchResults={searchResults}
        isSearching={isSearching}
        onClearSearch={handleClearSearch}
        createNoteAction={createNoteAction}
      />
    </div>
  );
} 