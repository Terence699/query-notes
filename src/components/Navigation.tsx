'use client';

import Link from 'next/link';
import AuthButton from './AuthButton';
import ClientThemeToggle from './ClientThemeToggle';

interface NavigationProps {
  showHomeLink?: boolean;
  title?: string;
  children?: React.ReactNode;
}

export default function Navigation({ showHomeLink = false, title, children }: NavigationProps) {
  return (
    <nav className="w-full flex justify-center border-b border-border h-16 bg-background">
      <div className="w-full max-w-4xl flex justify-between items-center p-3 text-sm">
        <div className="flex items-center gap-4">
          {showHomeLink && (
            <Link href="/" className="flex items-center gap-1 text-muted-foreground hover:text-foreground transition-colors">
              &larr; Home
            </Link>
          )}
          {title && (
            <h1 className="text-lg font-semibold text-foreground">{title}</h1>
          )}
        </div>
        <div className="flex items-center gap-3">
          <ClientThemeToggle variant="button" />
          <AuthButton />
          {children}
        </div>
      </div>
    </nav>
  );
}
