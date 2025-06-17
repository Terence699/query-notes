'use client';

import { useFormStatus } from 'react-dom';
import { signOut } from '@/actions/auth';

interface LogoutButtonProps {
  variant?: 'default' | 'dropdown';
}

export function LogoutButton({ variant = 'default' }: LogoutButtonProps) {
  const { pending } = useFormStatus();

  const baseClasses = "disabled:opacity-50 disabled:cursor-not-allowed transition-colors";

  const variantClasses = {
    default: "py-2 px-4 rounded-md no-underline bg-secondary text-secondary-foreground hover:bg-muted",
    dropdown: "w-full text-left px-3 py-2 text-sm text-foreground hover:bg-muted rounded-md"
  };

  return (
    <form action={signOut}>
        <button
            className={`${baseClasses} ${variantClasses[variant]}`}
            disabled={pending}
        >
            {pending ? 'Logging out...' : 'Logout'}
        </button>
    </form>
  );
}