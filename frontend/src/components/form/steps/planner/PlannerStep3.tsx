'use client';

import React from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  plannerStep3Schema,
  PlannerStep3FormValues,
} from '@/schemas/planner.schema';
import { FormField } from '@/components/ui/FormField';
import { Textarea } from '@/components/ui/Textarea';
import { Checkbox } from '@/components/ui/Checkbox';
import { Button } from '@/components/ui/Button';
import styles from '../../StepForm.module.css';

interface PlannerStep3Props {
  initialValues?: Partial<PlannerStep3FormValues>;
  onSubmit: (data: PlannerStep3FormValues) => void;
  onBack: () => void;
}

export const PlannerStep3: React.FC<PlannerStep3Props> = ({
  initialValues,
  onSubmit,
  onBack,
}) => {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<PlannerStep3FormValues>({
    resolver: zodResolver(plannerStep3Schema),
    defaultValues: {
      decorationStyle: initialValues?.decorationStyle || '',
      cateringPreference: initialValues?.cateringPreference || '',
      vendorCoordination: initialValues?.vendorCoordination ?? true,
      logisticsNotes: initialValues?.logisticsNotes || '',
      specialArrangements: initialValues?.specialArrangements || '',
    },
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className={styles.formCard} noValidate>
      <div className={styles.header}>
        <div className={styles.categoryBadge}>Category: Event Planner</div>
        <h2 className={styles.title}>Step 3: Planning & Logistics Details</h2>
        <p className={styles.subtitle}>
          Refine operational and styling expectations for your planner.
        </p>
      </div>

      <div className={styles.fieldGrid}>
        <div className={styles.fullWidth}>
          <FormField
            label="Decoration & Ambience Style (Optional)"
            htmlFor="decorationStyle"
            hint="e.g., Minimalist pastel floral, Royal traditional Rajasthani, Neon modern"
            error={errors.decorationStyle?.message}
          >
            <Textarea
              id="decorationStyle"
              placeholder="Describe preferred theme, colors, or decor aesthetic..."
              rows={2}
              error={errors.decorationStyle?.message}
              {...register('decorationStyle')}
            />
          </FormField>
        </div>

        <div className={styles.fullWidth}>
          <FormField
            label="Catering & Beverage Preferences (Optional)"
            htmlFor="cateringPreference"
            hint="Cuisine types, dietary restrictions (Jain, vegan, gluten-free), service style"
            error={errors.cateringPreference?.message}
          >
            <Textarea
              id="cateringPreference"
              placeholder="Specify menu preferences, live counters, or bar requirements..."
              rows={2}
              error={errors.cateringPreference?.message}
              {...register('cateringPreference')}
            />
          </FormField>
        </div>

        <div className={styles.fullWidth}>
          <Controller
            name="vendorCoordination"
            control={control}
            render={({ field }) => (
              <Checkbox
                id="vendorCoordination"
                label="Full Vendor Coordination Required"
                description="Planner will directly interface with venue, power, sound, and decorator teams"
                checked={field.value}
                onChange={(e) => field.onChange(e.target.checked)}
              />
            )}
          />
        </div>

        <div className={styles.fullWidth}>
          <FormField
            label="Logistics & Guest Flow Notes (Optional)"
            htmlFor="logisticsNotes"
            hint="Transport, valet parking, entry ticketing, or VIP handling"
            error={errors.logisticsNotes?.message}
          >
            <Textarea
              id="logisticsNotes"
              placeholder="Describe any transport schedules, gate management, or guest arrival flow..."
              rows={2}
              error={errors.logisticsNotes?.message}
              {...register('logisticsNotes')}
            />
          </FormField>
        </div>

        <div className={styles.fullWidth}>
          <FormField
            label="Special Arrangements / Constraints (Optional)"
            htmlFor="specialArrangements"
            hint="Wheelchair accessibility, noise curfews, licenses, surprise elements"
            error={errors.specialArrangements?.message}
          >
            <Textarea
              id="specialArrangements"
              placeholder="Mention sound curfews, permissions needed, or green room requirements..."
              rows={2}
              error={errors.specialArrangements?.message}
              {...register('specialArrangements')}
            />
          </FormField>
        </div>
      </div>

      <div className={styles.actions}>
        <Button type="button" variant="secondary" onClick={onBack}>
          ← Back to Requirements
        </Button>
        <Button type="submit" variant="primary">
          Review & Confirm →
        </Button>
      </div>
    </form>
  );
};
