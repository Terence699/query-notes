'use client';

import { useFormStatus } from 'react-dom';

// Plus Icon Component
function PlusIcon({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
    </svg>
  );
}

// Loading Spinner Component
function LoadingSpinner({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <div className={`${className} border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin`} />
  );
}

export function NewNoteButton() {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      className="
        relative inline-flex items-center justify-center w-10 h-10
        bg-primary hover:opacity-90
        text-primary-foreground
        rounded-lg shadow-md hover:shadow-lg
        disabled:opacity-50 disabled:cursor-not-allowed
        transition-all duration-200 ease-in-out
        focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background
      "
      disabled={pending}
      aria-label={pending ? 'Creating new note...' : 'Create new note'}
      title={pending ? 'Creating new note...' : 'Create new note'}
    >
      {pending ? (
        <LoadingSpinner className="w-5 h-5" />
      ) : (
        <PlusIcon className="w-5 h-5" />
      )}
    </button>
  );
}