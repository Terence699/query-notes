// Shared type definitions for notes across the application

export interface Note {
  id: number;
  title: string | null;
  content: string | null;
  updated_at: string;
}

export interface NoteWithSummary extends Note {
  summary: string | null;
}

export interface NoteListItem {
  id: number;
  title: string | null;
  content: string | null;
  updated_at: string;
}

export interface NoteEditorData {
  id: number;
  title: string | null;
  content: string | null;
  summary: string | null;
}
