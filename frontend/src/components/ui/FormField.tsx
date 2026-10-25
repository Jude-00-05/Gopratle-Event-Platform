import React from 'react';
import styles from './FormField.module.css';

interface FormFieldProps {
  label:      string;
  htmlFor:    string;
  error?:     string;
  hint?:      string;
  required?:  boolean;
  children:   React.ReactNode;
}

/**
 * Wraps a form control with an accessible label, optional hint text, and error message.
 * Error messages use role="alert" so screen readers announce them immediately.
 */
export default function FormField({
  label,
  htmlFor,
  error,
  hint,
  required,
  children,
}: FormFieldProps) {
  return (
    <div className={`${styles.field} ${error ? styles.hasError : ''}`}>
      <label htmlFor={htmlFor} className={styles.label}>
        {label}
        {required && <span className={styles.required} aria-hidden="true"> *</span>}
      </label>
      {hint && <p className={styles.hint}>{hint}</p>}
      {children}
      {error && (
        <p role="alert" className={styles.error} id={`${htmlFor}-error`}>
          {error}
        </p>
      )}
    </div>
  );
}

export { FormField };
