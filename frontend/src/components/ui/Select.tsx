import React from 'react';
import styles from './Select.module.css';

interface Option {
  value: string;
  label: string;
}

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  options: Option[];
  placeholder?: string;
  error?: string;
}

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ options, placeholder, error, className = '', ...props }, ref) => {
    return (
      <div className={styles.selectWrapper}>
        <select
          ref={ref}
          className={`${styles.select} ${error ? styles.hasError : ''} ${className}`}
          aria-invalid={error ? 'true' : undefined}
          {...props}
        >
          {placeholder && (
            <option value="" disabled>
              {placeholder}
            </option>
          )}
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        <span className={styles.arrow} aria-hidden="true">
          ▾
        </span>
      </div>
    );
  }
);

Select.displayName = 'Select';
