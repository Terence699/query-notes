'use client';

import { useState } from 'react';
import { generateSummary } from '@/actions/deepseekActions';

interface GenerateSummaryButtonProps {
  noteId: string;
  noteContent: string; // The editor's content as string
}

export default function GenerateSummaryButton({ noteId, noteContent }: GenerateSummaryButtonProps) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleClick = async () => {
    setIsGenerating(true);
    setError(null);
    try {
      const result = await generateSummary(noteId, noteContent);
      if (result.error) {
        setError(result.error);
      }
    } catch {
      setError('An unexpected error occurred.');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="flex flex-col items-start gap-2">
        <button
            onClick={handleClick}
            disabled={isGenerating}
            className="px-3 py-1.5 text-sm font-semibold text-primary-foreground bg-primary rounded-md hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-opacity"
        >
            {isGenerating ? '✨ Generating Summary...' : '✨ Generate Summary'}
        </button>
        {error && <p className="text-sm text-red-600 dark:text-red-400">{error}</p>}
    </div>
  );
} 