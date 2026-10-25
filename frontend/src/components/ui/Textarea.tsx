import React from 'react';
import styles from './Textarea.module.css';

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  error?: string;
}

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ error, className = '', ...props }, ref) => {
    return (
      <textarea
        ref={ref}
        className={`${styles.textarea} ${error ? styles.hasError : ''} ${className}`}
        aria-invalid={error ? 'true' : undefined}
        {...props}
      />
    );
  }
);

Textarea.displayName = 'Textarea';
