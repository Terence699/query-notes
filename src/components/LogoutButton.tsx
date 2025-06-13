'use client';

import { useFormStatus } from 'react-dom';
import { signOut } from '@/actions/auth';

export function LogoutButton() {
  const { pending } = useFormStatus();

  return (
    <form action={signOut}>
        <button 
            className="py-2 px-4 rounded-md no-underline bg-gray-200 hover:bg-gray-300 disabled:bg-gray-400 disabled:cursor-not-allowed"
            disabled={pending}
        >
            {pending ? 'Logging out...' : 'Logout'}
        </button>
    </form>
  );
} 