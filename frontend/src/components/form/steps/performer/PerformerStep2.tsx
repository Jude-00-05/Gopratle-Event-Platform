'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  performerStep2Schema,
  PerformerStep2FormValues,
} from '@/schemas/performer.schema';
import { FormField } from '@/components/ui/FormField';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Textarea } from '@/components/ui/Textarea';
import { Button } from '@/components/ui/Button';
import styles from '../../StepForm.module.css';

interface PerformerStep2Props {
  initialValues?: Partial<PerformerStep2FormValues>;
  onSubmit: (data: PerformerStep2FormValues) => void;
  onBack: () => void;
}

const PERFORMANCE_TYPES = [
  { value: 'singer', label: 'Singer / Solo Vocalist' },
  { value: 'dj', label: 'DJ / Electronic Music Producer' },
  { value: 'dancer', label: 'Dancer / Dance Troupe' },
  { value: 'band', label: 'Live Band / Acoustic Ensemble' },
  { value: 'comedian', label: 'Stand-up Comedian' },
  { value: 'speaker', label: 'Keynote Speaker / Host' },
  { value: 'other', label: 'Other (Specify below)' },
];

export const PerformerStep2: React.FC<PerformerStep2Props> = ({
  initialValues,
  onSubmit,
  onBack,
}) => {
  // Comma-separated equipment string for the input
  const [equipmentInput, setEquipmentInput] = useState<string>(
    initialValues?.equipmentRequired?.join(', ') || ''
  );

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<PerformerStep2FormValues>({
    resolver: zodResolver(performerStep2Schema),
    defaultValues: {
      performanceType: initialValues?.performanceType || ('' as any),
      performanceTypeOther: initialValues?.performanceTypeOther || '',
      numberOfPerformers: initialValues?.numberOfPerformers || ('' as any),
      performanceDuration: initialValues?.performanceDuration || ('' as any),
      equipmentRequired: initialValues?.equipmentRequired || [],
      estimatedBudget: initialValues?.estimatedBudget || ('' as any),
      step2Notes: initialValues?.step2Notes || '',
    },
  });

  const selectedType = watch('performanceType');

  const handleFormSubmit = (data: PerformerStep2FormValues) => {
    // Parse equipment comma separated
    const eqArray = equipmentInput
      .split(',')
      .map((item) => item.trim())
      .filter(Boolean);
    data.equipmentRequired = eqArray;
    onSubmit(data);
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className={styles.formCard} noValidate>
      <div className={styles.header}>
        <div className={styles.categoryBadge}>Category: Performer</div>
        <h2 className={styles.title}>Step 2: Performance Requirements</h2>
        <p className={styles.subtitle}>
          Specify the performance format, artist count, duration, and budget.
        </p>
      </div>

      <div className={styles.fieldGrid}>
        <FormField
          label="Performance Type"
          htmlFor="performanceType"
          required
          error={errors.performanceType?.message}
        >
          <Select
            id="performanceType"
            placeholder="Select performance type"
            options={PERFORMANCE_TYPES}
            error={errors.performanceType?.message}
            {...register('performanceType')}
          />
        </FormField>

        {selectedType === 'other' ? (
          <FormField
            label="Describe Performance Type"
            htmlFor="performanceTypeOther"
            required
            error={errors.performanceTypeOther?.message}
          >
            <Input
              id="performanceTypeOther"
              placeholder="e.g., Fire performer, Magician, Puppeteer"
              error={errors.performanceTypeOther?.message}
              {...register('performanceTypeOther')}
            />
          </FormField>
        ) : (
          <div />
        )}

        <FormField
          label="Number of Performers / Artists"
          htmlFor="numberOfPerformers"
          required
          error={errors.numberOfPerformers?.message}
          hint="Total artists on stage"
        >
          <Input
            id="numberOfPerformers"
            type="number"
            min="1"
            placeholder="e.g., 4"
            error={errors.numberOfPerformers?.message}
            {...register('numberOfPerformers', { valueAsNumber: true })}
          />
        </FormField>

        <FormField
          label="Performance Duration (Hours)"
          htmlFor="performanceDuration"
          required
          error={errors.performanceDuration?.message}
          hint="Total stage time (e.g. 1.5 or 2)"
        >
          <Input
            id="performanceDuration"
            type="number"
            step="0.5"
            min="0.5"
            placeholder="e.g., 2.5"
            error={errors.performanceDuration?.message}
            {...register('performanceDuration', { valueAsNumber: true })}
          />
        </FormField>

        <div className={styles.fullWidth}>
          <FormField
            label="Equipment Required by Artists (Optional)"
            htmlFor="equipmentRequired"
            hint="Comma-separated equipment or instruments, e.g., Wireless Mic, Drum Kit, In-Ear Monitors"
          >
            <Input
              id="equipmentRequired"
              placeholder="Microphones, Guitar Amp, DJ Console..."
              value={equipmentInput}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEquipmentInput(e.target.value)}
            />
          </FormField>
        </div>

        <FormField
          label="Estimated Budget (INR)"
          htmlFor="estimatedBudget"
          required
          error={errors.estimatedBudget?.message}
          hint="Performance fee budget in ₹"
        >
          <div className={styles.currencyInput}>
            <span className={styles.currencySymbol}>₹</span>
            <Input
              id="estimatedBudget"
              type="number"
              min="1"
              placeholder="e.g., 75000"
              error={errors.estimatedBudget?.message}
              {...register('estimatedBudget', { valueAsNumber: true })}
            />
          </div>
        </FormField>

        <div className={styles.fullWidth}>
          <FormField
            label="Additional Notes (Optional)"
            htmlFor="step2Notes"
            error={errors.step2Notes?.message}
            hint="Specific genres, songs, or performance schedule notes"
          >
            <Textarea
              id="step2Notes"
              placeholder="e.g., Bollywood acoustic set followed by retro dance numbers..."
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
          Continue to Technical Details →
        </Button>
      </div>
    </form>
  );
};
