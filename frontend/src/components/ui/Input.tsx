import React from 'react';
import styles from './Input.module.css';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: string;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ error, className = '', ...props }, ref) => (
    <input
      ref={ref}
      {...props}
      aria-invalid={!!error}
      aria-describedby={error && props.id ? `${props.id}-error` : undefined}
      className={`${styles.input} ${error ? styles.error : ''} ${className}`}
    />
  )
);
export { Input };
export default Input;
