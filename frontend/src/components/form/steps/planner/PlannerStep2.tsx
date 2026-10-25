'use client';

import React from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  plannerStep2Schema,
  PlannerStep2FormValues,
} from '@/schemas/planner.schema';
import { FormField } from '@/components/ui/FormField';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Textarea } from '@/components/ui/Textarea';
import { CheckboxGroup } from '@/components/ui/CheckboxGroup';
import { Button } from '@/components/ui/Button';
import styles from '../../StepForm.module.css';

interface PlannerStep2Props {
  initialValues?: Partial<PlannerStep2FormValues>;
  onSubmit: (data: PlannerStep2FormValues) => void;
  onBack: () => void;
}

const SCOPE_OPTIONS = [
  { value: 'full-service', label: 'Full-Service Planning (End-to-End Management)' },
  { value: 'selected-services', label: 'Selected Services Only (Partial Coordination)' },
];

const SERVICE_OPTIONS = [
  { value: 'decoration', label: 'Decoration & Stage Design' },
  { value: 'catering', label: 'Catering & Food Services' },
  { value: 'logistics', label: 'Logistics & Guest Flow' },
  { value: 'coordination', label: 'On-Day Event Coordination' },
  { value: 'entertainment', label: 'Artist & Entertainment Sourcing' },
  { value: 'security', label: 'Security & Crowd Control' },
  { value: 'photography', label: 'Event Photography & Media' },
];

export const PlannerStep2: React.FC<PlannerStep2Props> = ({
  initialValues,
  onSubmit,
  onBack,
}) => {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<PlannerStep2FormValues>({
    resolver: zodResolver(plannerStep2Schema),
    defaultValues: {
      expectedAttendance: initialValues?.expectedAttendance || ('' as any),
      planningScope: initialValues?.planningScope || ('' as any),
      servicesRequired: initialValues?.servicesRequired || [],
      estimatedBudget: initialValues?.estimatedBudget || ('' as any),
      step2Notes: initialValues?.step2Notes || '',
    },
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className={styles.formCard} noValidate>
      <div className={styles.header}>
        <div className={styles.categoryBadge}>Category: Event Planner</div>
        <h2 className={styles.title}>Step 2: Planner Requirements</h2>
        <p className={styles.subtitle}>
          Define the scale, scope, and budget required for event planning services.
        </p>
      </div>

      <div className={styles.fieldGrid}>
        <FormField
          label="Expected Attendance (Pax)"
          htmlFor="expectedAttendance"
          required
          error={errors.expectedAttendance?.message}
          hint="Estimated number of guests attending"
        >
          <Input
            id="expectedAttendance"
            type="number"
            min="1"
            placeholder="e.g., 350"
            error={errors.expectedAttendance?.message}
            {...register('expectedAttendance', { valueAsNumber: true })}
          />
        </FormField>

        <FormField
          label="Planning Scope"
          htmlFor="planningScope"
          required
          error={errors.planningScope?.message}
        >
          <Select
            id="planningScope"
            placeholder="Select planning scope"
            options={SCOPE_OPTIONS}
            error={errors.planningScope?.message}
            {...register('planningScope')}
          />
        </FormField>

        <div className={styles.fullWidth}>
          <FormField
            label="Services Required"
            htmlFor="servicesRequired"
            required
            error={errors.servicesRequired?.message}
            hint="Choose one or more planning services needed"
          >
            <Controller
              name="servicesRequired"
              control={control}
              render={({ field }) => (
                <CheckboxGroup
                  options={SERVICE_OPTIONS}
                  value={field.value || []}
                  onChange={field.onChange}
                  error={errors.servicesRequired?.message}
                />
              )}
            />
          </FormField>
        </div>

        <FormField
          label="Estimated Budget (INR)"
          htmlFor="estimatedBudget"
          required
          error={errors.estimatedBudget?.message}
          hint="Total planned budget for these services in ₹"
        >
          <div className={styles.currencyInput}>
            <span className={styles.currencySymbol}>₹</span>
            <Input
              id="estimatedBudget"
              type="number"
              min="1"
              placeholder="e.g., 150000"
              error={errors.estimatedBudget?.message}
              {...register('estimatedBudget', { valueAsNumber: true })}
            />
          </div>
        </FormField>

        <div className={styles.fullWidth}>
          <FormField
            label="Additional Notes / Overview (Optional)"
            htmlFor="step2Notes"
            error={errors.step2Notes?.message}
            hint="Any initial context or expectations"
          >
            <Textarea
              id="step2Notes"
              placeholder="Provide any key highlights or specific requirements..."
              rows={3}
              error={errors.step2Notes?.message}
              {...register('step2Notes')}
            />
          </FormField>
        </div>
      </div>

      <div className={styles.actions}>
        <Button type="button" variant="secondary" onClick={onBack}>
          ← Back to Basics
        </Button>
        <Button type="submit" variant="primary">
          Continue to Additional Details →
        </Button>
      </div>
    </form>
  );
};
