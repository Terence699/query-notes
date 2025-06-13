'use client';

import { useRef, useLayoutEffect, type TextareaHTMLAttributes } from 'react';

// This component accepts all standard <textarea> props
type AutoGrowingTextareaProps = TextareaHTMLAttributes<HTMLTextAreaElement>;

export default function AutoGrowingTextarea({ value, className, ...props }: AutoGrowingTextareaProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const sizerRef = useRef<HTMLDivElement>(null);

  // This effect synchronizes the sizer's height to the container
  useLayoutEffect(() => {
    const textarea = textareaRef.current;
    const sizer = sizerRef.current;
    
    if (textarea && sizer) {
      // Get the textarea's computed style
      const style = window.getComputedStyle(textarea);
      
      // Copy relevant styles from textarea to sizer
      sizer.style.width = style.width;
      sizer.style.padding = style.padding;
      sizer.style.border = style.border;
      sizer.style.fontSize = style.fontSize;
      sizer.style.fontFamily = style.fontFamily;
      sizer.style.fontWeight = style.fontWeight;
      sizer.style.lineHeight = style.lineHeight;
      sizer.style.letterSpacing = style.letterSpacing;
      
      // Set sizer content, adding a trailing newline to ensure space for the cursor
      sizer.textContent = (value as string) || props.placeholder || '';
      if (sizer.textContent.slice(-1) !== '\n') {
        sizer.textContent += '\n';
      }
      
      // The parent of the textarea will be the one that grows.
      const parent = textarea.parentElement;
      if (parent) {
        // We set the parent's height to match the sizer's scrollHeight
        parent.style.minHeight = `${sizer.scrollHeight}px`;
      }
    }
  }, [value, props.placeholder]);

  const commonStyles: React.CSSProperties = {
    boxSizing: 'border-box',
    margin: 0,
    resize: 'none',
    overflow: 'hidden', // We don't want a scrollbar on the textarea itself
  };

  return (
    <div style={{ position: 'relative' }}>
      <textarea
        ref={textareaRef}
        value={value}
        className={className}
        style={{
          ...commonStyles,
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          background: 'transparent',
        }}
        {...props}
      />
      <div
        ref={sizerRef}
        style={{
          ...commonStyles,
          visibility: 'hidden',
          whiteSpace: 'pre-wrap', // Important for wrapping text like a textarea
          wordWrap: 'break-word', // To match textarea behavior
        }}
        aria-hidden="true"
      />
    </div>
  );
} 