'use client';

import { useFormStatus } from 'react-dom';

export function NewNoteButton() {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      className="bg-primary hover:opacity-90 text-primary-foreground font-semibold py-2 px-4 rounded-md text-sm disabled:opacity-50 disabled:cursor-not-allowed transition-opacity"
      disabled={pending}
    >
      {pending ? 'Creating...' : '+ New Note'}
    </button>
  );
} 