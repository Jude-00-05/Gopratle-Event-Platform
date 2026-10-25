'use client';

import React from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  crewStep2Schema,
  CrewStep2FormValues,
} from '@/schemas/crew.schema';
import { FormField } from '@/components/ui/FormField';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Textarea } from '@/components/ui/Textarea';
import { Checkbox } from '@/components/ui/Checkbox';
import { Button } from '@/components/ui/Button';
import styles from '../../StepForm.module.css';

interface CrewStep2Props {
  initialValues?: Partial<CrewStep2FormValues>;
  onSubmit: (data: CrewStep2FormValues) => void;
  onBack: () => void;
}

const CREW_ROLES = [
  { value: 'photographer', label: 'Photographer (Candid, Traditional, Portrait)' },
  { value: 'videographer', label: 'Videographer (Cinematic, Drone, Live Stream)' },
  { value: 'sound-technician', label: 'Sound Engineer / Audio Tech' },
  { value: 'lighting-technician', label: 'Lighting Technician / Console Operator' },
  { value: 'stage-crew', label: 'Stage Hand / Production Crew' },
  { value: 'emcee', label: 'Master of Ceremonies (Emcee / Anchor)' },
  { value: 'other', label: 'Other Role (Specify below)' },
];

export const CrewStep2: React.FC<CrewStep2Props> = ({
  initialValues,
  onSubmit,
  onBack,
}) => {
  const {
    register,
    handleSubmit,
    watch,
    control,
    formState: { errors },
  } = useForm<CrewStep2FormValues>({
    resolver: zodResolver(crewStep2Schema),
    defaultValues: {
      requiredRole: initialValues?.requiredRole || ('' as any),
      requiredRoleOther: initialValues?.requiredRoleOther || '',
      numberOfPersonnel: initialValues?.numberOfPersonnel || ('' as any),
      workingHours: initialValues?.workingHours || ('' as any),
      equipmentProvided: initialValues?.equipmentProvided ?? false,
      estimatedBudget: initialValues?.estimatedBudget || ('' as any),
      step2Notes: initialValues?.step2Notes || '',
    },
  });

  const selectedRole = watch('requiredRole');

  return (
    <form onSubmit={handleSubmit(onSubmit)} className={styles.formCard} noValidate>
      <div className={styles.header}>
        <div className={styles.categoryBadge}>Category: Event Crew</div>
        <h2 className={styles.title}>Step 2: Crew & Technical Staffing</h2>
        <p className={styles.subtitle}>
          Define specific staffing roles, personnel count, working shifts, and compensation.
        </p>
      </div>

      <div className={styles.fieldGrid}>
        <FormField
          label="Required Staff Role"
          htmlFor="requiredRole"
          required
          error={errors.requiredRole?.message}
        >
          <Select
            id="requiredRole"
            placeholder="Select required crew role"
            options={CREW_ROLES}
            error={errors.requiredRole?.message}
            {...register('requiredRole')}
          />
        </FormField>

        {selectedRole === 'other' ? (
          <FormField
            label="Describe Required Role"
            htmlFor="requiredRoleOther"
            required
            error={errors.requiredRoleOther?.message}
          >
            <Input
              id="requiredRoleOther"
              placeholder="e.g., Drone Pilot, Pyrotechnician, Rigging Lead"
              error={errors.requiredRoleOther?.message}
              {...register('requiredRoleOther')}
            />
          </FormField>
        ) : (
          <div />
        )}

        <FormField
          label="Number of Personnel"
          htmlFor="numberOfPersonnel"
          required
          error={errors.numberOfPersonnel?.message}
          hint="Headcount required for this role"
        >
          <Input
            id="numberOfPersonnel"
            type="number"
            min="1"
            placeholder="e.g., 2"
            error={errors.numberOfPersonnel?.message}
            {...register('numberOfPersonnel', { valueAsNumber: true })}
          />
        </FormField>

        <FormField
          label="Working Hours per Day"
          htmlFor="workingHours"
          required
          error={errors.workingHours?.message}
          hint="Shift duration in hours (e.g., 8)"
        >
          <Input
            id="workingHours"
            type="number"
            step="0.5"
            min="0.5"
            placeholder="e.g., 8"
            error={errors.workingHours?.message}
            {...register('workingHours', { valueAsNumber: true })}
          />
        </FormField>

        <div className={styles.fullWidth}>
          <Controller
            name="equipmentProvided"
            control={control}
            render={({ field }) => (
              <Checkbox
                id="equipmentProvided"
                label="Organizer / Client will provide necessary gear and equipment"
                description="Uncheck if crew must bring their own professional kits (cameras, lenses, consoles, tools)"
                checked={field.value}
                onChange={(e) => field.onChange(e.target.checked)}
              />
            )}
          />
        </div>

        <FormField
          label="Estimated Budget (INR)"
          htmlFor="estimatedBudget"
          required
          error={errors.estimatedBudget?.message}
          hint="Total fee or day-rate allocation in ₹"
        >
          <div className={styles.currencyInput}>
            <span className={styles.currencySymbol}>₹</span>
            <Input
              id="estimatedBudget"
              type="number"
              min="1"
              placeholder="e.g., 40000"
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
            hint="Experience level, attire requirements, or brief overview"
          >
            <Textarea
              id="step2Notes"
              placeholder="e.g., Need experienced candid wedding photographers with Sony Alpha bodies..."
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
          Continue to Shift Details →
        </Button>
      </div>
    </form>
  );
};
