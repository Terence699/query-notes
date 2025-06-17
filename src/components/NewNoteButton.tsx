'use client';

import { useFormStatus } from 'react-dom';

export function NewNoteButton() {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      className="bg-gradient-to-r from-blue-500/90 to-blue-600/90 hover:from-blue-600 hover:to-blue-700 text-white font-semibold py-2.5 px-6 rounded-xl text-sm shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
      disabled={pending}
    >
      {pending ? 'Creating...' : '+ New Note'}
    </button>
  );
} 