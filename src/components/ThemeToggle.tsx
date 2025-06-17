'use client';

import React, { useState } from 'react';
import { useTheme } from './ThemeProvider';
import { HiSun, HiMoon, HiComputerDesktop } from 'react-icons/hi2';
import { Theme } from '@/lib/theme';

interface ThemeToggleProps {
  variant?: 'button' | 'dropdown';
  className?: string;
}

export default function ThemeToggle({ variant = 'button', className = '' }: ThemeToggleProps) {
  const { theme, resolvedTheme, setTheme } = useTheme();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const themeOptions: { value: Theme; label: string; icon: React.ReactNode }[] = [
    { value: 'light', label: 'Light', icon: <HiSun className="w-4 h-4" /> },
    { value: 'dark', label: 'Dark', icon: <HiMoon className="w-4 h-4" /> },
    { value: 'system', label: 'System', icon: <HiComputerDesktop className="w-4 h-4" /> },
  ];

  const currentThemeOption = themeOptions.find(option => option.value === theme) || themeOptions[0];

  if (variant === 'button') {
    return (
      <button
        onClick={() => setTheme(resolvedTheme === 'light' ? 'dark' : 'light')}
        className={`
          relative inline-flex items-center justify-center w-10 h-10
          rounded-lg border border-border
          bg-background
          text-foreground
          hover:bg-muted
          focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background
          transition-all duration-200 ease-in-out
          ${className}
        `}
        aria-label={`Switch to ${resolvedTheme === 'light' ? 'dark' : 'light'} mode`}
        title={`Switch to ${resolvedTheme === 'light' ? 'dark' : 'light'} mode`}
      >
        <div className="relative w-5 h-5">
          {/* Sun icon */}
          <HiSun 
            className={`
              absolute inset-0 w-5 h-5 transition-all duration-300 ease-in-out
              ${resolvedTheme === 'light' 
                ? 'opacity-100 rotate-0 scale-100' 
                : 'opacity-0 rotate-90 scale-75'
              }
            `}
          />
          {/* Moon icon */}
          <HiMoon 
            className={`
              absolute inset-0 w-5 h-5 transition-all duration-300 ease-in-out
              ${resolvedTheme === 'dark' 
                ? 'opacity-100 rotate-0 scale-100' 
                : 'opacity-0 -rotate-90 scale-75'
              }
            `}
          />
        </div>
      </button>
    );
  }

  return (
    <div className={`relative ${className}`}>
      <button
        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
        className="
          inline-flex items-center gap-2 px-3 py-2
          rounded-lg border border-border
          bg-background
          text-sm text-foreground
          hover:bg-muted
          focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background
          transition-all duration-200 ease-in-out
        "
        aria-label="Theme selector"
        aria-expanded={isDropdownOpen}
        aria-haspopup="true"
      >
        {currentThemeOption.icon}
        <span className="hidden sm:inline">{currentThemeOption.label}</span>
        <svg 
          className={`w-4 h-4 transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`}
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isDropdownOpen && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 z-10" 
            onClick={() => setIsDropdownOpen(false)}
            aria-hidden="true"
          />
          
          {/* Dropdown menu */}
          <div className="
            absolute right-0 top-full mt-2 z-20
            w-40 py-1
            bg-card
            border border-border
            rounded-lg shadow-lg
            ring-1 ring-black ring-opacity-5
          ">
            {themeOptions.map((option) => (
              <button
                key={option.value}
                onClick={() => {
                  setTheme(option.value);
                  setIsDropdownOpen(false);
                }}
                className={`
                  w-full flex items-center gap-3 px-3 py-2 text-sm text-left
                  hover:bg-muted
                  transition-colors duration-150
                  ${theme === option.value
                    ? 'text-primary bg-muted'
                    : 'text-card-foreground'
                  }
                `}
                role="menuitem"
              >
                {option.icon}
                {option.label}
                {theme === option.value && (
                  <svg className="w-4 h-4 ml-auto" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                )}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
