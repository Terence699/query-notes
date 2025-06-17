'use client';

import { useState, useEffect, useRef, useCallback } from "react";
import { updateNoteAutoSave } from "@/actions/notes";
import DeleteNoteButton from "@/components/DeleteNoteButton";
import GenerateSummaryButton from "@/components/GenerateSummaryButton";
import AutoGrowingTextarea from "@/components/AutoGrowingTextarea";
import QAPanel from "@/components/qa/QAPanel";
import NoteEditorNavigation from "@/components/NoteEditorNavigation";

// Define the shape of the note object
type Note = {
  id: number;
  title: string | null;
  content: string | null;
  summary: string | null;
};

// Define the state that can be undone/redone
type EditableState = {
  title: string;
  content: string;
};

// Custom hook for undo/redo functionality
function useUndoRedo(initialState: EditableState) {
  const [history, setHistory] = useState<EditableState[]>([initialState]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [currentState, setCurrentState] = useState(initialState);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const pushState = useCallback((newState: EditableState) => {
    // Update current state immediately for responsive UI
    setCurrentState(newState);
    
    // Clear any pending timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    // Debounce history updates to avoid creating too many entries
    timeoutRef.current = setTimeout(() => {
      setHistory(prev => {
        // Remove any future history if we're not at the end
        const newHistory = prev.slice(0, currentIndex + 1);
        // Add the new state
        newHistory.push(newState);
        // Limit history to 50 entries to prevent memory issues
        if (newHistory.length > 50) {
          newHistory.shift();
          return newHistory;
        }
        return newHistory;
      });
      setCurrentIndex(prev => {
        const newIndex = prev + 1;
        return newIndex > 49 ? 49 : newIndex;
      });
    }, 500); // 500ms debounce
  }, [currentIndex]);

  const undo = useCallback(() => {
    if (currentIndex > 0) {
      const newIndex = currentIndex - 1;
      setCurrentIndex(newIndex);
      setCurrentState(history[newIndex]);
    }
  }, [currentIndex, history]);

  const redo = useCallback(() => {
    if (currentIndex < history.length - 1) {
      const newIndex = currentIndex + 1;
      setCurrentIndex(newIndex);
      setCurrentState(history[newIndex]);
    }
  }, [currentIndex, history]);

  const canUndo = currentIndex > 0;
  const canRedo = currentIndex < history.length - 1;

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return {
    currentState,
    pushState,
    undo,
    redo,
    canUndo,
    canRedo
  };
}

// --- Helper Components ---
function ChatIcon() {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
        </svg>
    );
}

function UndoIcon() {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
        </svg>
    );
}

function RedoIcon() {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 10h-10a8 8 0 00-8 8v2m18-10l-6 6m6-6l-6-6" />
        </svg>
    );
}

// The main component
export default function NoteEditor({ note }: { note: Note }) {
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const [showSavedMessage, setShowSavedMessage] = useState(false);
  const autoSaveTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const savedMessageTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  
  // Initialize undo/redo with current note data
  const {
    currentState,
    pushState,
    undo,
    redo,
    canUndo,
    canRedo
  } = useUndoRedo({
    title: note.title || "",
    content: note.content || ""
  });

  // Auto-save function
  const autoSave = useCallback(async () => {
    if (isSaving) return; // Prevent concurrent saves
    
    // Clear any existing saved message and timeout before starting new save
    setShowSavedMessage(false);
    if (savedMessageTimeoutRef.current) {
      clearTimeout(savedMessageTimeoutRef.current);
    }
    
    setIsSaving(true);
    try {
      const formData = new FormData();
      formData.append('id', note.id.toString());
      formData.append('title', currentState.title);
      formData.append('content', currentState.content);
      
      const result = await updateNoteAutoSave(formData);
      
      if (result.success) {
        // Show saved message
        setShowSavedMessage(true);
        
        // Hide message after 5 seconds
        savedMessageTimeoutRef.current = setTimeout(() => {
          setShowSavedMessage(false);
        }, 5000);
      } else {
        console.error('Auto-save failed:', result.error);
      }
      
    } catch (error) {
      console.error('Auto-save failed:', error);
    } finally {
      setIsSaving(false);
    }
  }, [note.id, currentState.title, currentState.content, isSaving]);

  // Schedule auto-save
  const scheduleAutoSave = useCallback(() => {
    // Clear existing timeout
    if (autoSaveTimeoutRef.current) {
      clearTimeout(autoSaveTimeoutRef.current);
    }
    
    // Schedule new auto-save after 15 seconds of inactivity
    autoSaveTimeoutRef.current = setTimeout(() => {
      autoSave();
    }, 15000);
  }, [autoSave]);

  // Handle title changes
  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTitle = e.target.value;
    pushState({
      title: newTitle,
      content: currentState.content
    });
    scheduleAutoSave();
  };

  // Handle content changes
  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newContent = e.target.value;
    pushState({
      title: currentState.title,
      content: newContent
    });
    scheduleAutoSave();
  };

  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'z' && !e.shiftKey) {
        e.preventDefault();
        undo();
      } else if ((e.metaKey || e.ctrlKey) && (e.key === 'y' || (e.key === 'z' && e.shiftKey))) {
        e.preventDefault();
        redo();
      } else if ((e.metaKey || e.ctrlKey) && e.key === 's') {
        e.preventDefault();
        autoSave(); // Manual save with Ctrl+S
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [undo, redo, autoSave]);

  // Cleanup timeouts on unmount
  useEffect(() => {
    return () => {
      if (autoSaveTimeoutRef.current) {
        clearTimeout(autoSaveTimeoutRef.current);
      }
      if (savedMessageTimeoutRef.current) {
        clearTimeout(savedMessageTimeoutRef.current);
      }
    };
  }, []);

  return (
    <div className="w-full h-screen flex">
      {/* Main Content Area */}
      <div className={`flex-1 flex flex-col transition-all duration-300 ${isPanelOpen ? "mr-96" : "mr-0"}`}>
        {/* Page Header */}
        <NoteEditorNavigation>
              {/* Undo/Redo Buttons */}
              <div className="flex items-center gap-1 border border-border rounded-md">
                <button
                  type="button"
                  onClick={undo}
                  disabled={!canUndo}
                  className="p-2 text-muted-foreground hover:text-foreground hover:bg-muted disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  title="Undo (Ctrl+Z)"
                >
                  <UndoIcon />
                </button>
                <div className="w-px h-6 bg-border"></div>
                <button
                  type="button"
                  onClick={redo}
                  disabled={!canRedo}
                  className="p-2 text-muted-foreground hover:text-foreground hover:bg-muted disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  title="Redo (Ctrl+Y)"
                >
                  <RedoIcon />
                </button>
              </div>
              
              <DeleteNoteButton noteId={note.id.toString()} />
              
              {/* Auto-save status */}
              <div className="flex items-center gap-2">
                {isSaving && (
                  <div className="flex items-center gap-1 text-sm text-muted-foreground">
                    <div className="w-3 h-3 border-2 border-border border-t-primary rounded-full animate-spin"></div>
                    Saving...
                  </div>
                )}
                {showSavedMessage && !isSaving && (
                  <div className="text-sm text-green-600 dark:text-green-400">
                    Note saved successfully
                  </div>
                )}
                <button
                  type="button"
                  onClick={() => {
                    // Use the same autoSave logic to prevent page refresh
                    autoSave();
                  }}
                  disabled={isSaving}
                  className="bg-primary hover:opacity-90 disabled:opacity-50 text-primary-foreground font-semibold py-2 px-4 rounded-md text-sm transition-opacity"
                >
                  {isSaving ? 'Saving...' : 'Save Now'}
                </button>
              </div>
        </NoteEditorNavigation>

        {/* Editor */}
        <main className="flex-grow p-6 overflow-y-auto">
          <div className="max-w-4xl mx-auto flex flex-col h-full">
            <div className="mb-6">
              <div className="flex flex-col items-start gap-4">
                <h2 className="text-xl font-semibold text-foreground">AI Summary</h2>
                {note.summary ? (
                  <div className="prose prose-sm max-w-none p-4 bg-muted rounded-md border border-border w-full text-foreground">
                    <p>{note.summary}</p>
                  </div>
                ) : (
                  <div className="w-full p-4 bg-blue-50 dark:bg-blue-900/20 text-blue-800 dark:text-blue-200 rounded-md border border-blue-200 dark:border-blue-800">
                    No summary yet. Click the button to generate one.
                  </div>
                )}
                <GenerateSummaryButton noteId={note.id.toString()} noteContent={currentState.content} />
              </div>
            </div>
            <div className="h-px bg-border my-8"></div>
            <div className="flex-grow flex flex-col">
              <input
                value={currentState.title}
                onChange={handleTitleChange}
                placeholder="Untitled Note"
                className="text-2xl font-bold p-2 mb-4 bg-transparent text-foreground placeholder:text-muted-foreground focus:outline-none"
              />
              <AutoGrowingTextarea
                value={currentState.content}
                onChange={handleContentChange}
                placeholder="Start writing..."
                className="flex-grow w-full p-2 bg-transparent text-foreground placeholder:text-muted-foreground focus:outline-none resize-none border-none"
              />
            </div>
          </div>
        </main>
      </div>

      {/* Floating Chat Button */}
      {!isPanelOpen && (
        <button
          onClick={() => setIsPanelOpen(true)}
          className="fixed bottom-8 right-8 z-40 bg-primary text-primary-foreground p-4 rounded-full shadow-lg hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-all hover:scale-110"
          title="Ask about this note"
        >
          <ChatIcon />
        </button>
      )}

      {/* Q&A Panel */}
      <QAPanel
        isOpen={isPanelOpen}
        onClose={() => setIsPanelOpen(false)}
        noteId={note.id}
      />
    </div>
  );
} 