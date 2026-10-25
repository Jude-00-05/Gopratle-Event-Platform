'use client';

import React from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  performerStep3Schema,
  PerformerStep3FormValues,
} from '@/schemas/performer.schema';
import { FormField } from '@/components/ui/FormField';
import { Textarea } from '@/components/ui/Textarea';
import { Checkbox } from '@/components/ui/Checkbox';
import { Button } from '@/components/ui/Button';
import styles from '../../StepForm.module.css';

interface PerformerStep3Props {
  initialValues?: Partial<PerformerStep3FormValues>;
  onSubmit: (data: PerformerStep3FormValues) => void;
  onBack: () => void;
}

export const PerformerStep3: React.FC<PerformerStep3Props> = ({
  initialValues,
  onSubmit,
  onBack,
}) => {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<PerformerStep3FormValues>({
    resolver: zodResolver(performerStep3Schema),
    defaultValues: {
      stageSetup: initialValues?.stageSetup || '',
      soundRequirements: initialValues?.soundRequirements || '',
      lightingRequired: initialValues?.lightingRequired ?? true,
      backlineRequired: initialValues?.backlineRequired ?? false,
      performancePreferences: initialValues?.performancePreferences || '',
      specialRequests: initialValues?.specialRequests || '',
    },
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className={styles.formCard} noValidate>
      <div className={styles.header}>
        <div className={styles.categoryBadge}>Category: Performer</div>
        <h2 className={styles.title}>Step 3: Stage & Technical Rider</h2>
        <p className={styles.subtitle}>
          Specify stage dimensions, audio-visual technical needs, and artist hospitality requirements.
        </p>
      </div>

      <div className={styles.fieldGrid}>
        <div className={styles.fullWidth}>
          <FormField
            label="Stage Setup & Footprint (Optional)"
            htmlFor="stageSetup"
            hint="Stage dimensions, riser requirements, floor covering"
            error={errors.stageSetup?.message}
          >
            <Textarea
              id="stageSetup"
              placeholder="e.g., Elevated 12x8 ft stage with drum riser, black carpet..."
              rows={2}
              error={errors.stageSetup?.message}
              {...register('stageSetup')}
            />
          </FormField>
        </div>

        <div className={styles.fullWidth}>
          <FormField
            label="Sound & Audio System Requirements (Optional)"
            htmlFor="soundRequirements"
            hint="PA system power, FOH mixing console, monitors, mic channels"
            error={errors.soundRequirements?.message}
          >
            <Textarea
              id="soundRequirements"
              placeholder="e.g., 2 Front-of-House speakers, 2 stage wedges, 3 cordless microphones..."
              rows={2}
              error={errors.soundRequirements?.message}
              {...register('soundRequirements')}
            />
          </FormField>
        </div>

        <div className={styles.fullWidth}>
          <Controller
            name="lightingRequired"
            control={control}
            render={({ field }) => (
              <Checkbox
                id="lightingRequired"
                label="Stage & Effect Lighting Required"
                description="Profile spots, LED par cans, moving heads, or ambient stage wash"
                checked={field.value}
                onChange={(e) => field.onChange(e.target.checked)}
              />
            )}
          />
        </div>

        <div className={styles.fullWidth}>
          <Controller
            name="backlineRequired"
            control={control}
            render={({ field }) => (
              <Checkbox
                id="backlineRequired"
                label="Backline Equipment Required by Venue"
                description="Drum kits, guitar amplifier stacks, or keyboard stands provided by organizer"
                checked={field.value}
                onChange={(e) => field.onChange(e.target.checked)}
              />
            )}
          />
        </div>

        <div className={styles.fullWidth}>
          <FormField
            label="Performance Style & Setlist Preferences (Optional)"
            htmlFor="performancePreferences"
            hint="Tone, crowd interaction level, language preferences"
            error={errors.performancePreferences?.message}
          >
            <Textarea
              id="performancePreferences"
              placeholder="e.g., High-energy crowd singalong, clean family-friendly humor..."
              rows={2}
              error={errors.performancePreferences?.message}
              {...register('performancePreferences')}
            />
          </FormField>
        </div>

        <div className={styles.fullWidth}>
          <FormField
            label="Hospitality & Green Room Requests (Optional)"
            htmlFor="specialRequests"
            hint="Dressing room, beverages, artist security, or meal arrangements"
            error={errors.specialRequests?.message}
          >
            <Textarea
              id="specialRequests"
              placeholder="e.g., Private green room, bottled water, stage access 1 hour prior..."
              rows={2}
              error={errors.specialRequests?.message}
              {...register('specialRequests')}
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
