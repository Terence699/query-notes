'use client';

import Link from 'next/link';
import ClientThemeToggle from './ClientThemeToggle';

interface NoteEditorNavigationProps {
  children: React.ReactNode;
}

export default function NoteEditorNavigation({ children }: NoteEditorNavigationProps) {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border flex-shrink-0 bg-background">
      <div className="w-full flex justify-between items-center p-3 text-sm px-6">
        <div className="flex items-center gap-4">
          <Link href="/notes" className="flex items-center gap-1 text-muted-foreground hover:text-foreground transition-colors">
            &larr; Back to Notes
          </Link>
          <ClientThemeToggle variant="button" />
        </div>
        <div className="flex items-center gap-4">
          {children}
        </div>
      </div>
    </header>
  );
}
