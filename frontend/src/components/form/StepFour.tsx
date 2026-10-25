'use client';

import React from 'react';
import { StepOneData } from '@/types/requirement.types';
import { Button } from '@/components/ui/Button';
import { Spinner } from '@/components/ui/Spinner';
import { formatDate, formatINR, categoryLabel } from '@/lib/utils';
import styles from './StepFour.module.css';

interface StepFourProps {
  step1Data: StepOneData;
  detailsData: Record<string, any>;
  onEditStep: (stepNumber: number) => void;
  onSubmit: () => void;
  onBack: () => void;
  isSubmitting: boolean;
  submitError: string | null;
  submissionResult: any | null;
  onReset: () => void;
}

export const StepFour: React.FC<StepFourProps> = ({
  step1Data,
  detailsData,
  onEditStep,
  onSubmit,
  onBack,
  isSubmitting,
  submitError,
  submissionResult,
  onReset,
}) => {
  // If successfully submitted, display the Success Confirmation screen
  if (submissionResult) {
    return (
      <div className={styles.successCard}>
        <div className={styles.successIconWrapper}>
          <svg
            className={styles.successIcon}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="20 6 9 17 4 12" />
          </svg>
        </div>
        <h2 className={styles.successTitle}>Requirement Posted Successfully!</h2>
        <p className={styles.successSubtitle}>
          Your event requirement has been confirmed and stored in the GoPratle database.
        </p>

        <div className={styles.idBox}>
          <span className={styles.idLabel}>Reference ID:</span>
          <code className={styles.idCode}>{submissionResult._id || 'GP-REQ-CONFIRMED'}</code>
        </div>

        <div className={styles.successDetails}>
          <div className={styles.successRow}>
            <span>Event:</span>
            <strong>{step1Data.eventName}</strong>
          </div>
          <div className={styles.successRow}>
            <span>Category:</span>
            <strong>{categoryLabel(step1Data.category)}</strong>
          </div>
          <div className={styles.successRow}>
            <span>Budget:</span>
            <strong>{formatINR(detailsData.estimatedBudget || 0)}</strong>
          </div>
          <div className={styles.successRow}>
            <span>Location:</span>
            <strong>{step1Data.location}</strong>
          </div>
        </div>

        <div className={styles.successActions}>
          <Button variant="primary" size="lg" onClick={onReset}>
            + Post Another Requirement
          </Button>
        </div>
      </div>
    );
  }

  // Render Category-Specific Review Items
  const renderCategoryDetails = () => {
    switch (step1Data.category) {
      case 'planner':
        return (
          <>
            <div className={styles.reviewItem}>
              <span className={styles.reviewLabel}>Expected Attendance</span>
              <span className={styles.reviewValue}>{detailsData.expectedAttendance} guests</span>
            </div>
            <div className={styles.reviewItem}>
              <span className={styles.reviewLabel}>Planning Scope</span>
              <span className={styles.reviewValue}>
                {detailsData.planningScope === 'full-service' ? 'Full-Service Planning' : 'Selected Services Only'}
              </span>
            </div>
            <div className={styles.reviewItem}>
              <span className={styles.reviewLabel}>Services Required</span>
              <div className={styles.tagList}>
                {(detailsData.servicesRequired || []).map((srv: string) => (
                  <span key={srv} className={styles.tag}>
                    {srv}
                  </span>
                ))}
              </div>
            </div>
            <div className={styles.reviewItem}>
              <span className={styles.reviewLabel}>Estimated Budget</span>
              <span className={`${styles.reviewValue} ${styles.highlight}`}>
                {formatINR(detailsData.estimatedBudget || 0)}
              </span>
            </div>
            {detailsData.step2Notes && (
              <div className={`${styles.reviewItem} ${styles.fullRow}`}>
                <span className={styles.reviewLabel}>Planner Overview</span>
                <span className={styles.reviewValue}>{detailsData.step2Notes}</span>
              </div>
            )}
          </>
        );

      case 'performer':
        return (
          <>
            <div className={styles.reviewItem}>
              <span className={styles.reviewLabel}>Performance Type</span>
              <span className={styles.reviewValue}>
                {detailsData.performanceType === 'other'
                  ? `Other (${detailsData.performanceTypeOther})`
                  : detailsData.performanceType}
              </span>
            </div>
            <div className={styles.reviewItem}>
              <span className={styles.reviewLabel}>Performers Count</span>
              <span className={styles.reviewValue}>{detailsData.numberOfPerformers} artist(s)</span>
            </div>
            <div className={styles.reviewItem}>
              <span className={styles.reviewLabel}>Performance Duration</span>
              <span className={styles.reviewValue}>{detailsData.performanceDuration} hour(s)</span>
            </div>
            <div className={styles.reviewItem}>
              <span className={styles.reviewLabel}>Estimated Budget</span>
              <span className={`${styles.reviewValue} ${styles.highlight}`}>
                {formatINR(detailsData.estimatedBudget || 0)}
              </span>
            </div>
            {detailsData.equipmentRequired && detailsData.equipmentRequired.length > 0 && (
              <div className={`${styles.reviewItem} ${styles.fullRow}`}>
                <span className={styles.reviewLabel}>Equipment Required</span>
                <div className={styles.tagList}>
                  {detailsData.equipmentRequired.map((eq: string) => (
                    <span key={eq} className={styles.tag}>
                      {eq}
                    </span>
                  ))}
                </div>
              </div>
            )}
            {detailsData.step2Notes && (
              <div className={`${styles.reviewItem} ${styles.fullRow}`}>
                <span className={styles.reviewLabel}>Performer Notes</span>
                <span className={styles.reviewValue}>{detailsData.step2Notes}</span>
              </div>
            )}
          </>
        );

      case 'crew':
        return (
          <>
            <div className={styles.reviewItem}>
              <span className={styles.reviewLabel}>Required Staff Role</span>
              <span className={styles.reviewValue}>
                {detailsData.requiredRole === 'other'
                  ? `Other (${detailsData.requiredRoleOther})`
                  : detailsData.requiredRole}
              </span>
            </div>
            <div className={styles.reviewItem}>
              <span className={styles.reviewLabel}>Personnel Count</span>
              <span className={styles.reviewValue}>{detailsData.numberOfPersonnel} staff</span>
            </div>
            <div className={styles.reviewItem}>
              <span className={styles.reviewLabel}>Working Hours</span>
              <span className={styles.reviewValue}>{detailsData.workingHours} hrs/day</span>
            </div>
            <div className={styles.reviewItem}>
              <span className={styles.reviewLabel}>Equipment by Client</span>
              <span className={styles.reviewValue}>
                {detailsData.equipmentProvided ? 'Yes (Organizer provides gear)' : 'No (Crew brings gear)'}
              </span>
            </div>
            <div className={styles.reviewItem}>
              <span className={styles.reviewLabel}>Estimated Budget</span>
              <span className={`${styles.reviewValue} ${styles.highlight}`}>
                {formatINR(detailsData.estimatedBudget || 0)}
              </span>
            </div>
            {detailsData.step2Notes && (
              <div className={`${styles.reviewItem} ${styles.fullRow}`}>
                <span className={styles.reviewLabel}>Staffing Notes</span>
                <span className={styles.reviewValue}>{detailsData.step2Notes}</span>
              </div>
            )}
          </>
        );

      default:
        return null;
    }
  };

  // Render Step 3 Additional Details
  const renderAdditionalDetails = () => {
    switch (step1Data.category) {
      case 'planner':
        return (
          <>
            {detailsData.decorationStyle && (
              <div className={styles.reviewItem}>
                <span className={styles.reviewLabel}>Decoration Style</span>
                <span className={styles.reviewValue}>{detailsData.decorationStyle}</span>
              </div>
            )}
            {detailsData.cateringPreference && (
              <div className={styles.reviewItem}>
                <span className={styles.reviewLabel}>Catering Preferences</span>
                <span className={styles.reviewValue}>{detailsData.cateringPreference}</span>
              </div>
            )}
            <div className={styles.reviewItem}>
              <span className={styles.reviewLabel}>Vendor Coordination</span>
              <span className={styles.reviewValue}>
                {detailsData.vendorCoordination ? 'Required' : 'Not Required'}
              </span>
            </div>
            {detailsData.logisticsNotes && (
              <div className={styles.reviewItem}>
                <span className={styles.reviewLabel}>Logistics & Flow</span>
                <span className={styles.reviewValue}>{detailsData.logisticsNotes}</span>
              </div>
            )}
            {detailsData.specialArrangements && (
              <div className={`${styles.reviewItem} ${styles.fullRow}`}>
                <span className={styles.reviewLabel}>Special Arrangements</span>
                <span className={styles.reviewValue}>{detailsData.specialArrangements}</span>
              </div>
            )}
          </>
        );

      case 'performer':
        return (
          <>
            {detailsData.stageSetup && (
              <div className={styles.reviewItem}>
                <span className={styles.reviewLabel}>Stage Setup</span>
                <span className={styles.reviewValue}>{detailsData.stageSetup}</span>
              </div>
            )}
            {detailsData.soundRequirements && (
              <div className={styles.reviewItem}>
                <span className={styles.reviewLabel}>Audio System</span>
                <span className={styles.reviewValue}>{detailsData.soundRequirements}</span>
              </div>
            )}
            <div className={styles.reviewItem}>
              <span className={styles.reviewLabel}>Stage Lighting</span>
              <span className={styles.reviewValue}>
                {detailsData.lightingRequired ? 'Yes' : 'No'}
              </span>
            </div>
            <div className={styles.reviewItem}>
              <span className={styles.reviewLabel}>Backline Gear</span>
              <span className={styles.reviewValue}>
                {detailsData.backlineRequired ? 'Yes' : 'No'}
              </span>
            </div>
            {detailsData.performancePreferences && (
              <div className={styles.reviewItem}>
                <span className={styles.reviewLabel}>Preferences</span>
                <span className={styles.reviewValue}>{detailsData.performancePreferences}</span>
              </div>
            )}
            {detailsData.specialRequests && (
              <div className={`${styles.reviewItem} ${styles.fullRow}`}>
                <span className={styles.reviewLabel}>Hospitality / Special</span>
                <span className={styles.reviewValue}>{detailsData.specialRequests}</span>
              </div>
            )}
          </>
        );

      case 'crew':
        return (
          <>
            {detailsData.shiftSchedule && (
              <div className={styles.reviewItem}>
                <span className={styles.reviewLabel}>Shift Schedule</span>
                <span className={styles.reviewValue}>{detailsData.shiftSchedule}</span>
              </div>
            )}
            {detailsData.onSiteResponsibilities && (
              <div className={styles.reviewItem}>
                <span className={styles.reviewLabel}>On-Site Duties</span>
                <span className={styles.reviewValue}>{detailsData.onSiteResponsibilities}</span>
              </div>
            )}
            {detailsData.equipmentDetails && (
              <div className={styles.reviewItem}>
                <span className={styles.reviewLabel}>Equipment Specs</span>
                <span className={styles.reviewValue}>{detailsData.equipmentDetails}</span>
              </div>
            )}
            {detailsData.operationalNotes && (
              <div className={`${styles.reviewItem} ${styles.fullRow}`}>
                <span className={styles.reviewLabel}>Operational Notes</span>
                <span className={styles.reviewValue}>{detailsData.operationalNotes}</span>
              </div>
            )}
          </>
        );

      default:
        return null;
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2 className={styles.title}>Step 4: Review Your Requirement</h2>
        <p className={styles.subtitle}>
          Please verify all details carefully before submitting to the platform.
        </p>
      </div>

      {submitError && (
        <div className={styles.errorAlert} role="alert">
          <div className={styles.errorIcon}>⚠️</div>
          <div className={styles.errorText}>
            <strong>Submission Notice:</strong> {submitError}
          </div>
        </div>
      )}

      {/* Section 1: Event Basics */}
      <section className={styles.sectionCard}>
        <div className={styles.sectionHeader}>
          <h3 className={styles.sectionTitle}>1. Event Basics</h3>
          <button
            type="button"
            className={styles.editBtn}
            onClick={() => onEditStep(1)}
            disabled={isSubmitting}
          >
            Edit
          </button>
        </div>
        <div className={styles.grid}>
          <div className={styles.reviewItem}>
            <span className={styles.reviewLabel}>Event Name</span>
            <span className={styles.reviewValue}>{step1Data.eventName}</span>
          </div>
          <div className={styles.reviewItem}>
            <span className={styles.reviewLabel}>Event Type</span>
            <span className={styles.reviewValue}>{step1Data.eventType}</span>
          </div>
          <div className={styles.reviewItem}>
            <span className={styles.reviewLabel}>Event Dates</span>
            <span className={styles.reviewValue}>
              {formatDate(step1Data.startDate)} — {formatDate(step1Data.endDate)}
            </span>
          </div>
          <div className={styles.reviewItem}>
            <span className={styles.reviewLabel}>Category</span>
            <span className={`${styles.reviewValue} ${styles.categoryTag}`}>
              {categoryLabel(step1Data.category)}
            </span>
          </div>
          <div className={styles.reviewItem}>
            <span className={styles.reviewLabel}>Location</span>
            <span className={styles.reviewValue}>{step1Data.location}</span>
          </div>
          {step1Data.venue && (
            <div className={styles.reviewItem}>
              <span className={styles.reviewLabel}>Venue</span>
              <span className={styles.reviewValue}>{step1Data.venue}</span>
            </div>
          )}
        </div>
      </section>

      {/* Section 2: Requirements */}
      <section className={styles.sectionCard}>
        <div className={styles.sectionHeader}>
          <h3 className={styles.sectionTitle}>
            2. Core Requirements ({categoryLabel(step1Data.category)})
          </h3>
          <button
            type="button"
            className={styles.editBtn}
            onClick={() => onEditStep(2)}
            disabled={isSubmitting}
          >
            Edit
          </button>
        </div>
        <div className={styles.grid}>{renderCategoryDetails()}</div>
      </section>

      {/* Section 3: Additional Details */}
      <section className={styles.sectionCard}>
        <div className={styles.sectionHeader}>
          <h3 className={styles.sectionTitle}>3. Additional Logistics & Rider</h3>
          <button
            type="button"
            className={styles.editBtn}
            onClick={() => onEditStep(3)}
            disabled={isSubmitting}
          >
            Edit
          </button>
        </div>
        <div className={styles.grid}>{renderAdditionalDetails()}</div>
      </section>

      {/* Actions */}
      <div className={styles.actions}>
        <Button
          type="button"
          variant="secondary"
          onClick={onBack}
          disabled={isSubmitting}
        >
          ← Back to Step 3
        </Button>

        <Button
          type="button"
          variant="primary"
          size="lg"
          onClick={onSubmit}
          loading={isSubmitting}
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Posting Requirement...' : 'Confirm & Submit Requirement ✓'}
        </Button>
      </div>
    </div>
  );
};
