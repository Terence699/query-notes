'use client';

import { useEffect, useState } from 'react';
import ThemeToggle from './ThemeToggle';

interface ClientThemeToggleProps {
  variant?: 'button' | 'dropdown';
  className?: string;
}

export default function ClientThemeToggle({ variant = 'button', className = '' }: ClientThemeToggleProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    // Return a placeholder with the same dimensions to prevent layout shift
    return (
      <div className={`w-10 h-10 rounded-lg border border-border bg-background ${className}`} />
    );
  }

  return <ThemeToggle variant={variant} className={className} />;
}
