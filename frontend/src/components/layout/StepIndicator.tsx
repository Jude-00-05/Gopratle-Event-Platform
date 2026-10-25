import React from 'react';
import styles from './StepIndicator.module.css';

interface StepIndicatorProps {
  currentStep: number; // 1 to 4
  totalSteps?: number;
  category?: string;
}

const STEPS = [
  { step: 1, title: 'Basics', subtitle: 'Event Details' },
  { step: 2, title: 'Requirements', subtitle: 'Role & Specs' },
  { step: 3, title: 'Preferences', subtitle: 'Logistics' },
  { step: 4, title: 'Review', subtitle: 'Confirmation' },
];

export const StepIndicator: React.FC<StepIndicatorProps> = ({
  currentStep,
  totalSteps = 4,
}) => {
  return (
    <div className={styles.wrapper} aria-label="Progress">
      <div className={styles.container}>
        {STEPS.map((s, index) => {
          const isCompleted = currentStep > s.step;
          const isCurrent = currentStep === s.step;

          return (
            <React.Fragment key={s.step}>
              <div
                className={`${styles.stepItem} ${
                  isCompleted ? styles.completed : ''
                } ${isCurrent ? styles.active : ''}`}
              >
                <div className={styles.circle}>
                  {isCompleted ? (
                    <svg
                      className={styles.checkIcon}
                      viewBox="0 0 16 16"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                    >
                      <polyline points="3.5 8 6.5 11 12.5 5" />
                    </svg>
                  ) : (
                    <span>{s.step}</span>
                  )}
                </div>
                <div className={styles.labelGroup}>
                  <span className={styles.stepTitle}>{s.title}</span>
                  <span className={styles.stepSubtitle}>{s.subtitle}</span>
                </div>
              </div>

              {index < totalSteps - 1 && (
                <div
                  className={`${styles.connector} ${
                    currentStep > s.step ? styles.connectorCompleted : ''
                  }`}
                  aria-hidden="true"
                />
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
};
