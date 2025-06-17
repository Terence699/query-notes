'use client';

import { useFormStatus } from 'react-dom';
import { signOut } from '@/actions/auth';

export function LogoutButton() {
  const { pending } = useFormStatus();

  return (
    <form action={signOut}>
        <button
            className="py-2 px-4 rounded-md no-underline bg-secondary text-secondary-foreground hover:bg-muted disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            disabled={pending}
        >
            {pending ? 'Logging out...' : 'Logout'}
        </button>
    </form>
  );
} 