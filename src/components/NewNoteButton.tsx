'use client';

import { useFormStatus } from 'react-dom';

export function NewNoteButton() {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-md text-sm disabled:bg-blue-400 disabled:cursor-not-allowed"
      disabled={pending}
    >
      {pending ? 'Creating...' : '+ New Note'}
    </button>
  );
} 