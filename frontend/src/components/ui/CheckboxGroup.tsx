import React from 'react';
import styles from './CheckboxGroup.module.css';

interface Option {
  value: string;
  label: string;
  description?: string;
}

interface CheckboxGroupProps {
  options: Option[];
  value: string[];
  onChange: (value: string[]) => void;
  error?: string;
  className?: string;
}

export const CheckboxGroup: React.FC<CheckboxGroupProps> = ({
  options,
  value = [],
  onChange,
  error,
  className = '',
}) => {
  const handleToggle = (optValue: string) => {
    if (value.includes(optValue)) {
      onChange(value.filter((v) => v !== optValue));
    } else {
      onChange([...value, optValue]);
    }
  };

  return (
    <div className={`${styles.group} ${className}`} role="group">
      <div className={styles.grid}>
        {options.map((opt) => {
          const isChecked = value.includes(opt.value);
          return (
            <label
              key={opt.value}
              className={`${styles.card} ${isChecked ? styles.selected : ''}`}
            >
              <input
                type="checkbox"
                className={styles.input}
                checked={isChecked}
                onChange={() => handleToggle(opt.value)}
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
                <span className={styles.labelText}>{opt.label}</span>
                {opt.description && (
                  <span className={styles.descriptionText}>{opt.description}</span>
                )}
              </span>
            </label>
          );
        })}
      </div>
      {error && (
        <span className={styles.error} role="alert">
          {error}
        </span>
      )}
    </div>
  );
};
