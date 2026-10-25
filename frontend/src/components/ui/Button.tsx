import styles from './Button.module.css';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost';
  size?:    'sm' | 'md' | 'lg';
  loading?: boolean;
  fullWidth?: boolean;
}

export default function Button({
  variant   = 'primary',
  size      = 'md',
  loading   = false,
  fullWidth = false,
  disabled,
  children,
  className = '',
  ...props
}: ButtonProps) {
  return (
    <button
      {...props}
      disabled={disabled || loading}
      className={[
        styles.btn,
        styles[variant],
        styles[size],
        fullWidth ? styles.fullWidth : '',
        loading   ? styles.loading   : '',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      {loading ? (
        <>
          <span className={styles.spinner} aria-hidden="true" />
          <span>{children}</span>
        </>
      ) : (
        children
      )}
    </button>
  );
}

export { Button };
