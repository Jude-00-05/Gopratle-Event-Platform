'use client';

import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { stepOneSchema, StepOneFormValues } from '@/schemas/stepOne.schema';
import { Category, StepOneData } from '@/types/requirement.types';
import { FormField } from '@/components/ui/FormField';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Button } from '@/components/ui/Button';
import styles from './StepForm.module.css';

interface StepOneProps {
  initialValues?: StepOneData | null;
  onSubmit: (data: StepOneData) => void;
  onCategoryChangeAttempt: (newCategory: Category) => boolean;
  pendingCategory?: Category | null;
}

const EVENT_TYPES = [
  { value: 'Wedding', label: 'Wedding' },
  { value: 'Concert', label: 'Concert' },
  { value: 'College Festival', label: 'College Festival' },
  { value: 'Corporate Event', label: 'Corporate Event' },
  { value: 'Birthday', label: 'Birthday Party' },
  { value: 'Private Party', label: 'Private Party' },
  { value: 'Other', label: 'Other' },
];

const CATEGORIES = [
  { value: 'planner', label: 'Event Planner (Decor, Catering, Full Coordination)' },
  { value: 'performer', label: 'Performer (Live Band, Singer, DJ, Speaker)' },
  { value: 'crew', label: 'Crew (Photography, Sound, Lighting, Stage Crew)' },
];

export const StepOne: React.FC<StepOneProps> = ({
  initialValues,
  onSubmit,
  onCategoryChangeAttempt,
  pendingCategory,
}) => {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<StepOneFormValues>({
    resolver: zodResolver(stepOneSchema),
    defaultValues: {
      eventName: initialValues?.eventName || '',
      eventType: initialValues?.eventType || '',
      startDate: initialValues?.startDate || '',
      endDate: initialValues?.endDate || '',
      location: initialValues?.location || '',
      venue: initialValues?.venue || '',
      category: initialValues?.category || undefined,
    },
  });

  const selectedCategory = watch('category');

  // Handle category change interception
  const handleCategorySelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newCategory = e.target.value as Category;
    const allowed = onCategoryChangeAttempt(newCategory);
    if (allowed) {
      setValue('category', newCategory, { shouldValidate: true });
    } else {
      // Revert the visual select back to current until modal confirmed
      e.target.value = initialValues?.category || '';
    }
  };

  // If pendingCategory was confirmed and applied externally
  useEffect(() => {
    if (initialValues?.category) {
      setValue('category', initialValues.category, { shouldValidate: true });
    }
  }, [initialValues?.category, setValue]);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className={styles.formCard} noValidate>
      <div className={styles.header}>
        <h2 className={styles.title}>Step 1: Event Basics</h2>
        <p className={styles.subtitle}>
          Tell us about your event. In subsequent steps, you&apos;ll specify category-specific requirements.
        </p>
      </div>

      <div className={styles.fieldGrid}>
        <div className={styles.fullWidth}>
          <FormField
            label="Event Name"
            htmlFor="eventName"
            required
            error={errors.eventName?.message}
            hint="e.g., Annual Tech Conclave 2026 or Sharma Family Sangeet"
          >
            <Input
              id="eventName"
              placeholder="Enter event name"
              error={errors.eventName?.message}
              {...register('eventName')}
            />
          </FormField>
        </div>

        <FormField
          label="Event Type"
          htmlFor="eventType"
          required
          error={errors.eventType?.message}
        >
          <Select
            id="eventType"
            placeholder="Select event type"
            options={EVENT_TYPES}
            error={errors.eventType?.message}
            {...register('eventType')}
          />
        </FormField>

        <FormField
          label="Primary Category Needed"
          htmlFor="category"
          required
          error={errors.category?.message}
          hint="Select what service role you are sourcing"
        >
          <Select
            id="category"
            placeholder="Select category"
            options={CATEGORIES}
            value={selectedCategory || ''}
            error={errors.category?.message}
            onChange={handleCategorySelect}
          />
        </FormField>

        <FormField
          label="Start Date"
          htmlFor="startDate"
          required
          error={errors.startDate?.message}
        >
          <Input
            id="startDate"
            type="date"
            error={errors.startDate?.message}
            {...register('startDate')}
          />
        </FormField>

        <FormField
          label="End Date"
          htmlFor="endDate"
          required
          error={errors.endDate?.message}
          hint="Must be same as or after start date"
        >
          <Input
            id="endDate"
            type="date"
            error={errors.endDate?.message}
            {...register('endDate')}
          />
        </FormField>

        <FormField
          label="City / Location"
          htmlFor="location"
          required
          error={errors.location?.message}
          hint="e.g., Mumbai, Maharashtra or Bengaluru"
        >
          <Input
            id="location"
            placeholder="Enter city or location"
            error={errors.location?.message}
            {...register('location')}
          />
        </FormField>

        <FormField
          label="Venue (Optional)"
          htmlFor="venue"
          error={errors.venue?.message}
          hint="e.g., Grand Hyatt Ballroom or Open Grounds"
        >
          <Input
            id="venue"
            placeholder="Enter venue name if decided"
            error={errors.venue?.message}
            {...register('venue')}
          />
        </FormField>
      </div>

      <div className={styles.actions}>
        <div />
        <Button type="submit" variant="primary" size="lg">
          Continue to Requirements →
        </Button>
      </div>
    </form>
  );
};
