'use client';

import { useState } from 'react';
import { generateSummary } from '@/actions/deepseekActions';

interface GenerateSummaryButtonProps {
  noteId: string;
  noteContent: any; // The editor's JSON content
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
    } catch (e) {
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
            className="px-3 py-1.5 text-sm font-semibold text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
        >
            {isGenerating ? '✨ Generating Summary...' : '✨ Generate Summary'}
        </button>
        {error && <p className="text-sm text-red-600">{error}</p>}
    </div>
  );
} 