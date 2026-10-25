'use client';

import { useState, useCallback } from 'react';
import {
  Category,
  StepOneData,
  RequirementPayload,
  PlannerDetails,
  PerformerDetails,
  CrewDetails,
} from '@/types/requirement.types';
import { submitRequirement, ApiError } from '@/lib/api';
import { toISODateTime } from '@/lib/utils';
import { useFormPersist, clearPersistedForm } from './useFormPersist';

interface PersistedState {
  currentStep: number;
  step1: StepOneData | null;
  details: Record<string, unknown>;
}

export function useMultiStepForm() {
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [step1Data, setStep1Data] = useState<StepOneData | null>(null);
  const [detailsData, setDetailsData] = useState<Record<string, unknown>>({});

  // Category switch modal state
  const [showCategoryModal, setShowCategoryModal] = useState<boolean>(false);
  const [pendingCategory, setPendingCategory] = useState<Category | null>(null);

  // Submission state
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submissionResult, setSubmissionResult] = useState<any | null>(null);

  // Sync with sessionStorage
  const handleRestore = useCallback((restored: unknown) => {
    const state = restored as PersistedState;
    if (state.step1) setStep1Data(state.step1);
    if (state.details) setDetailsData(state.details);
    if (state.currentStep && state.currentStep >= 1 && state.currentStep <= 4) {
      setCurrentStep(state.currentStep);
    }
  }, []);

  useFormPersist(
    {
      currentStep: currentStep > 4 ? 1 : currentStep,
      step1: step1Data,
      details: detailsData,
    },
    handleRestore
  );

  // Category Switch Logic
  const handleCategoryChangeAttempt = useCallback(
    (newCategory: Category, onConfirmSwitch?: () => void) => {
      const hasDetails = Object.keys(detailsData).length > 0;
      if (step1Data && step1Data.category !== newCategory && hasDetails) {
        setPendingCategory(newCategory);
        setShowCategoryModal(true);
        return false; // Intercepted
      }
      return true; // Allowed immediately
    },
    [detailsData, step1Data]
  );

  const confirmCategoryChange = useCallback(() => {
    if (pendingCategory) {
      if (step1Data) {
        setStep1Data({ ...step1Data, category: pendingCategory });
      }
      setDetailsData({}); // Reset category-specific details
    }
    setShowCategoryModal(false);
    setPendingCategory(null);
  }, [pendingCategory, step1Data]);

  const cancelCategoryChange = useCallback(() => {
    setShowCategoryModal(false);
    setPendingCategory(null);
  }, []);

  // Step 1 navigation
  const handleStepOneSubmit = useCallback((data: StepOneData) => {
    setStep1Data(data);
    setSubmitError(null);
    setCurrentStep(2);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  // Step 2 navigation
  const handleStepTwoSubmit = useCallback((step2Fields: Record<string, unknown>) => {
    setDetailsData((prev) => ({ ...prev, ...step2Fields }));
    setSubmitError(null);
    setCurrentStep(3);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  // Step 3 navigation
  const handleStepThreeSubmit = useCallback((step3Fields: Record<string, unknown>) => {
    setDetailsData((prev) => ({ ...prev, ...step3Fields }));
    setSubmitError(null);
    setCurrentStep(4);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  // Back button navigation
  const handleBack = useCallback((toStep?: number) => {
    setSubmitError(null);
    setCurrentStep((prev) => (toStep !== undefined ? toStep : Math.max(1, prev - 1)));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  // Final Step 4 submission
  const handleSubmit = useCallback(async () => {
    if (!step1Data || !step1Data.category) {
      setSubmitError('Missing basic event details. Please review your submission.');
      return;
    }

    setIsSubmitting(true);
    setSubmitError(null);

    try {
      const payload: RequirementPayload = {
        eventName: step1Data.eventName,
        eventType: step1Data.eventType,
        startDate: toISODateTime(step1Data.startDate),
        endDate: toISODateTime(step1Data.endDate),
        location: step1Data.location,
        venue: step1Data.venue || undefined,
        category: step1Data.category,
        details: detailsData as unknown as PlannerDetails & PerformerDetails & CrewDetails,
      } as RequirementPayload;

      const response = await submitRequirement(payload);
      setSubmissionResult(response.data);
      clearPersistedForm();
      setCurrentStep(5); // Success state
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err: any) {
      if (err instanceof ApiError) {
        if (typeof err.errors === 'string') {
          setSubmitError(err.errors);
        } else if (err.errors && typeof err.errors === 'object') {
          const errObj = err.errors as any;
          if (errObj.formErrors && errObj.formErrors.length > 0) {
            setSubmitError(errObj.formErrors.join(', '));
          } else if (errObj.fieldErrors) {
            const firstField = Object.keys(errObj.fieldErrors)[0];
            setSubmitError(`${firstField}: ${errObj.fieldErrors[firstField].join(', ')}`);
          } else {
            setSubmitError(err.message || 'Validation failed. Please verify your entries.');
          }
        } else {
          setSubmitError(`API Error (${err.status})`);
        }
      } else {
        setSubmitError(
          err.message || 'Failed to submit requirement. Please check your connection and try again.'
        );
      }
    } finally {
      setIsSubmitting(false);
    }
  }, [step1Data, detailsData]);

  // Reset entire form
  const handleReset = useCallback(() => {
    clearPersistedForm();
    setStep1Data(null);
    setDetailsData({});
    setCurrentStep(1);
    setSubmitError(null);
    setSubmissionResult(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  return {
    currentStep,
    step1Data,
    detailsData,
    category: step1Data?.category || null,
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
  };
}
