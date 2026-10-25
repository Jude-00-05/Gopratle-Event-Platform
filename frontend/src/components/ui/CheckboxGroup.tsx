import React from 'react';
import { Checkbox } from './Checkbox';
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
        {options.map((opt) => (
          <div
            key={opt.value}
            className={`${styles.card} ${value.includes(opt.value) ? styles.selected : ''}`}
            onClick={() => handleToggle(opt.value)}
          >
            <Checkbox
              label={opt.label}
              description={opt.description}
              checked={value.includes(opt.value)}
              onChange={() => {}} // handled by card click or label click
            />
          </div>
        ))}
      </div>
      {error && (
        <span className={styles.error} role="alert">
          {error}
        </span>
      )}
    </div>
  );
};
