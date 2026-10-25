import React from 'react';
import styles from './Checkbox.module.css';

interface CheckboxProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label: React.ReactNode;
  description?: string;
}

export const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
  ({ label, description, className = '', id, ...props }, ref) => {
    const inputId = id || React.useId();

    return (
      <label htmlFor={inputId} className={`${styles.container} ${className}`}>
        <input
          ref={ref}
          type="checkbox"
          id={inputId}
          className={styles.input}
          {...props}
        />
        <span className={styles.checkboxCustom} aria-hidden="true">
          <svg
            className={styles.checkmark}
            viewBox="0 0 16 16"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="3.5 8 6.5 11 12.5 5" />
          </svg>
        </span>
        <span className={styles.labelContent}>
          <span className={styles.labelText}>{label}</span>
          {description && <span className={styles.descriptionText}>{description}</span>}
        </span>
      </label>
    );
  }
);

Checkbox.displayName = 'Checkbox';
