'use client';

import React from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { StepIndicator } from '@/components/layout/StepIndicator';
import { Modal } from '@/components/ui/Modal';
import { useMultiStepForm } from '@/hooks/useMultiStepForm';
import { StepOne } from '@/components/form/StepOne';
import { PlannerStep2 } from '@/components/form/steps/planner/PlannerStep2';
import { PlannerStep3 } from '@/components/form/steps/planner/PlannerStep3';
import { PerformerStep2 } from '@/components/form/steps/performer/PerformerStep2';
import { PerformerStep3 } from '@/components/form/steps/performer/PerformerStep3';
import { CrewStep2 } from '@/components/form/steps/crew/CrewStep2';
import { CrewStep3 } from '@/components/form/steps/crew/CrewStep3';
import { StepFour } from '@/components/form/StepFour';
import styles from './page.module.css';

export default function NewRequirementPage() {
  const {
    currentStep,
    step1Data,
    detailsData,
    category,
    showCategoryModal,
    pendingCategory,
    isSubmitting,
    submitError,
    submissionResult,
    handleStepOneSubmit,
    handleStepTwoSubmit,
    handleStepThreeSubmit,
    handleBack,
    handleSubmit,
    handleReset,
    handleCategoryChangeAttempt,
    confirmCategoryChange,
    cancelCategoryChange,
  } = useMultiStepForm();

  return (
    <div className={styles.page}>
      <Navbar />

      <main className={styles.main}>
        <div className={styles.container}>
          {currentStep <= 4 && (
            <StepIndicator currentStep={currentStep} totalSteps={4} />
          )}

          <div className={styles.formWrapper}>
            {/* Step 1: Event Basics */}
            {currentStep === 1 && (
              <StepOne
                initialValues={step1Data}
                onSubmit={handleStepOneSubmit}
                onCategoryChangeAttempt={handleCategoryChangeAttempt}
                pendingCategory={pendingCategory}
              />
            )}

            {/* Step 2: Category Specific Core Requirements */}
            {currentStep === 2 && (
              <>
                {category === 'planner' && (
                  <PlannerStep2
                    initialValues={detailsData}
                    onSubmit={handleStepTwoSubmit}
                    onBack={() => handleBack(1)}
                  />
                )}
                {category === 'performer' && (
                  <PerformerStep2
                    initialValues={detailsData}
                    onSubmit={handleStepTwoSubmit}
                    onBack={() => handleBack(1)}
                  />
                )}
                {category === 'crew' && (
                  <CrewStep2
                    initialValues={detailsData}
                    onSubmit={handleStepTwoSubmit}
                    onBack={() => handleBack(1)}
                  />
                )}
                {!category && (
                  <div className={styles.fallbackBox}>
                    <p>No category selected. Please return to Step 1.</p>
                    <button onClick={() => handleBack(1)} className={styles.fallbackBtn}>
                      ← Return to Step 1
                    </button>
                  </div>
                )}
              </>
            )}

            {/* Step 3: Category Specific Technical & Operational Details */}
            {currentStep === 3 && (
              <>
                {category === 'planner' && (
                  <PlannerStep3
                    initialValues={detailsData}
                    onSubmit={handleStepThreeSubmit}
                    onBack={() => handleBack(2)}
                  />
                )}
                {category === 'performer' && (
                  <PerformerStep3
                    initialValues={detailsData}
                    onSubmit={handleStepThreeSubmit}
                    onBack={() => handleBack(2)}
                  />
                )}
                {category === 'crew' && (
                  <CrewStep3
                    initialValues={detailsData}
                    onSubmit={handleStepThreeSubmit}
                    onBack={() => handleBack(2)}
                  />
                )}
                {!category && (
                  <div className={styles.fallbackBox}>
                    <p>No category selected. Please return to Step 1.</p>
                    <button onClick={() => handleBack(1)} className={styles.fallbackBtn}>
                      ← Return to Step 1
                    </button>
                  </div>
                )}
              </>
            )}

            {/* Step 4 & 5: Review & Submit or Success Screen */}
            {(currentStep === 4 || currentStep === 5) && step1Data && (
              <StepFour
                step1Data={step1Data}
                detailsData={detailsData}
                onEditStep={(step) => handleBack(step)}
                onSubmit={handleSubmit}
                onBack={() => handleBack(3)}
                isSubmitting={isSubmitting}
                submitError={submitError}
                submissionResult={submissionResult}
                onReset={handleReset}
              />
            )}
          </div>
        </div>
      </main>

      {/* Category switch warning modal */}
      <Modal
        isOpen={showCategoryModal}
        title="Change Service Category?"
        description="Switching to a different category will reset the specific requirements entered for this category. Are you sure you want to proceed?"
        confirmText="Switch Category"
        cancelText="Keep Current"
        onConfirm={confirmCategoryChange}
        onCancel={cancelCategoryChange}
      />
    </div>
  );
}
