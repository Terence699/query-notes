'use client';

import { deleteNote } from '@/actions/notes';

export default function DeleteNoteButton({ noteId }: { noteId: string }) {
    // We use .bind to pre-fill the noteId argument for our Server Action.
    const deleteNoteWithId = deleteNote.bind(null, noteId);

    return (
        <form
            action={deleteNoteWithId}
            onSubmit={(e) => {
                // Show a confirmation dialog before submitting the form.
                if (!window.confirm("Are you sure you want to permanently delete this note?")) {
                    e.preventDefault();
                }
            }}
        >
            <button
                type="submit"
                className="text-sm font-semibold text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300 transition-colors"
            >
                Delete
            </button>
        </form>
    );
} 