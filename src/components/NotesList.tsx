'use client';

import Link from 'next/link';
import { usePagination } from '@/hooks/usePagination';
import Pagination from '@/components/Pagination';
import { useEffect, useState, useRef } from 'react';

type Note = {
  id: number;
  title: string | null;
  content: string | null;
  updated_at: string;
};

interface NotesListProps {
  initialNotes: Note[];
  searchResults?: Note[];
  isSearching?: boolean;
  onClearSearch?: () => void;
}

/**
 * Formats a date string into a human-readable relative time.
 * e.g., "5m ago", "2h ago", "3d ago"
 */
function formatDate(dateString: string) {
  const date = new Date(dateString);
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diffInSeconds < 60) return `${diffInSeconds}s ago`;
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) return `${diffInHours}h ago`;
  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 7) return `${diffInDays}d ago`;
  
  return date.toLocaleDateString();
}

/**
 * Extracts a text snippet from the note's content, which might be JSON.
 */
function getContentSnippet(content: string | null): string {
    if (!content) return "No additional content";
    if (typeof content === 'string') {
        return content.substring(0, 120);
    }
    return "No additional content";
}

export default function NotesList({ initialNotes, searchResults, isSearching, onClearSearch }: NotesListProps) {
  // Use search results if available, otherwise use initial notes
  const notesToDisplay = searchResults !== undefined ? searchResults : initialNotes;
  const showSearchMessage = searchResults !== undefined && searchResults !== null;

  // Responsive items per page: 9 for desktop (3x3), 6 for mobile (2x3)
  const [itemsPerPage, setItemsPerPage] = useState(9);

  useEffect(() => {
    const updateItemsPerPage = () => {
      if (typeof window !== 'undefined') {
        setItemsPerPage(window.innerWidth >= 1024 ? 9 : 6);
      }
    };

    // Set initial value
    updateItemsPerPage();

    // Add resize listener
    if (typeof window !== 'undefined') {
      window.addEventListener('resize', updateItemsPerPage);
      return () => window.removeEventListener('resize', updateItemsPerPage);
    }
  }, []);

  const {
    currentPage,
    totalPages,
    paginatedData,
    goToPage,
    resetToFirstPage,
  } = usePagination({
    data: notesToDisplay || [],
    itemsPerPage,
  });



  // Track previous search results to avoid unnecessary resets
  const prevSearchResults = useRef(searchResults);
  
  // Reset to first page only when search results actually change
  useEffect(() => {
    if (prevSearchResults.current !== searchResults) {
      resetToFirstPage();
      prevSearchResults.current = searchResults;
    }
  }, [searchResults, resetToFirstPage]);

  if (isSearching) {
    return (
      <div className="flex items-center justify-center p-12">
        <div className="flex items-center gap-3 text-gray-600">
          <div className="w-6 h-6 border-2 border-gray-300 border-t-blue-600 rounded-full animate-spin"></div>
          <span>Searching notes...</span>
        </div>
      </div>
    );
  }

  if (notesToDisplay && notesToDisplay.length > 0) {
    return (
      <div>
        {showSearchMessage && (
          <div className="mb-4 flex items-center justify-between">
            <div className="text-sm text-muted-foreground">
              Found {notesToDisplay.length} note{notesToDisplay.length !== 1 ? 's' : ''}
              {totalPages > 1 && (
                <span className="opacity-70"> • Page {currentPage} of {totalPages}</span>
              )}
            </div>
            {onClearSearch && (
              <button
                onClick={onClearSearch}
                className="text-sm text-primary hover:opacity-80 font-medium transition-opacity"
              >
                ← Back to all notes
              </button>
            )}
          </div>
        )}
        
        {!showSearchMessage && totalPages > 1 && (
          <div className="mb-4 text-sm text-muted-foreground">
            Showing {paginatedData.length} of {notesToDisplay.length} notes • Page {currentPage} of {totalPages}
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {paginatedData.map((note) => (
            <Link key={note.id} href={`/notes/${note.id}`} className="block">
              <div className="bg-card border border-border rounded-lg shadow-sm h-full flex flex-col p-4 hover:shadow-md transition-shadow duration-200">
                <h3 className="font-semibold text-card-foreground truncate">
                  {note.title || "Untitled Note"}
                </h3>
                <p className="text-sm text-muted-foreground mt-2 flex-grow line-clamp-3">
                  {getContentSnippet(note.content)}
                </p>
                <time className="text-xs text-muted-foreground opacity-70 mt-4 block">
                  {formatDate(note.updated_at)}
                </time>
              </div>
            </Link>
          ))}
        </div>

        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={goToPage}
        />
      </div>
    );
  }

  // Empty state
  return (
    <div className="text-center p-12 bg-card border border-border rounded-lg shadow-sm">
      {showSearchMessage ? (
        <>
          <h2 className="text-xl font-semibold text-card-foreground">No notes found</h2>
          <p className="mt-2 text-muted-foreground">
            Try searching with different keywords or create a new note.
          </p>
          {onClearSearch && (
            <button
              onClick={onClearSearch}
              className="mt-4 text-primary hover:opacity-80 font-medium transition-opacity"
            >
              ← Back to all notes
            </button>
          )}
        </>
      ) : (
        <>
          <h2 className="text-xl font-semibold text-card-foreground">Your notebook is empty</h2>
          <p className="mt-2 text-muted-foreground">
            Click the &quot;+ New Note&quot; button to create your first one.
          </p>
        </>
      )}
    </div>
  );
} 