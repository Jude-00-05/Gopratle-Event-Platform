'use client';

import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  crewStep3Schema,
  CrewStep3FormValues,
} from '@/schemas/crew.schema';
import { FormField } from '@/components/ui/FormField';
import { Textarea } from '@/components/ui/Textarea';
import { Button } from '@/components/ui/Button';
import styles from '../../StepForm.module.css';

interface CrewStep3Props {
  initialValues?: Partial<CrewStep3FormValues>;
  onSubmit: (data: CrewStep3FormValues) => void;
  onBack: () => void;
}

export const CrewStep3: React.FC<CrewStep3Props> = ({
  initialValues,
  onSubmit,
  onBack,
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CrewStep3FormValues>({
    resolver: zodResolver(crewStep3Schema),
    defaultValues: {
      shiftSchedule: initialValues?.shiftSchedule || '',
      onSiteResponsibilities: initialValues?.onSiteResponsibilities || '',
      equipmentDetails: initialValues?.equipmentDetails || '',
      operationalNotes: initialValues?.operationalNotes || '',
    },
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className={styles.formCard} noValidate>
      <div className={styles.header}>
        <div className={styles.categoryBadge}>Category: Event Crew</div>
        <h2 className={styles.title}>Step 3: Shift Schedule & Operations</h2>
        <p className={styles.subtitle}>
          Provide reporting timings, on-site task breakdown, and technical gear details.
        </p>
      </div>

      <div className={styles.fieldGrid}>
        <div className={styles.fullWidth}>
          <FormField
            label="Shift Schedule & Reporting Times (Optional)"
            htmlFor="shiftSchedule"
            hint="Call time, briefing time, live execution window, wrap-up time"
            error={errors.shiftSchedule?.message}
          >
            <Textarea
              id="shiftSchedule"
              placeholder="e.g., Call time: 09:00 AM, Rigging & Soundcheck: 10:00 AM–01:00 PM, Show: 04:00 PM–10:00 PM..."
              rows={2}
              error={errors.shiftSchedule?.message}
              {...register('shiftSchedule')}
            />
          </FormField>
        </div>

        <div className={styles.fullWidth}>
          <FormField
            label="On-Site Responsibilities & Scope (Optional)"
            htmlFor="onSiteResponsibilities"
            hint="Specific duties, deliverables, or stations assigned"
            error={errors.onSiteResponsibilities?.message}
          >
            <Textarea
              id="onSiteResponsibilities"
              placeholder="e.g., Lead stage camera operator for live LED wall feed; responsible for equipment teardown..."
              rows={2}
              error={errors.onSiteResponsibilities?.message}
              {...register('onSiteResponsibilities')}
            />
          </FormField>
        </div>

        <div className={styles.fullWidth}>
          <FormField
            label="Equipment Specification & Gear Details (Optional)"
            htmlFor="equipmentDetails"
            hint="Specific camera models, lenses, audio desks, lighting fixtures, or radios"
            error={errors.equipmentDetails?.message}
          >
            <Textarea
              id="equipmentDetails"
              placeholder="e.g., Dual Sony FX3 cameras, 70-200mm f/2.8 GM lens, DJI RS3 Pro gimbal..."
              rows={2}
              error={errors.equipmentDetails?.message}
              {...register('equipmentDetails')}
            />
          </FormField>
        </div>

        <div className={styles.fullWidth}>
          <FormField
            label="Operational Notes & Logistics (Optional)"
            htmlFor="operationalNotes"
            hint="Dress code, backstage passes, crew meals, parking access"
            error={errors.operationalNotes?.message}
          >
            <Textarea
              id="operationalNotes"
              placeholder="e.g., All black production attire required. Crew meals provided in cafeteria. Vendor passes at Gate 3."
              rows={2}
              error={errors.operationalNotes?.message}
              {...register('operationalNotes')}
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
