import { z } from 'zod';

// ─── Step 2 ──────────────────────────────────────────────────────────────────

export const performerStep2Schema = z
  .object({
    performanceType: z.enum(
      ['singer', 'dj', 'dancer', 'band', 'comedian', 'speaker', 'other'] as const,
      { errorMap: () => ({ message: 'Please select a performance type' }) }
    ),
    performanceTypeOther: z.string().max(100).optional(),
    numberOfPerformers: z
      .number({ required_error: 'Number of performers is required', invalid_type_error: 'Must be a number' })
      .int('Must be a whole number')
      .positive('Must be at least 1'),
    performanceDuration: z
      .number({ required_error: 'Performance duration is required', invalid_type_error: 'Must be a number' })
      .positive('Duration must be greater than 0'),
    equipmentRequired: z.array(z.string().max(100)).default([]),
    estimatedBudget: z
      .number({ required_error: 'Estimated budget is required', invalid_type_error: 'Must be a number' })
      .positive('Budget must be greater than 0'),
    step2Notes: z.string().max(1000).optional(),
  })
  .refine(
    (d) => !(d.performanceType === 'other' && !d.performanceTypeOther?.trim()),
    { message: 'Please describe the performance type', path: ['performanceTypeOther'] }
  );

// ─── Step 3 ──────────────────────────────────────────────────────────────────

export const performerStep3Schema = z.object({
  stageSetup:             z.string().max(500).optional(),
  soundRequirements:      z.string().max(500).optional(),
  lightingRequired:       z.boolean(),
  backlineRequired:       z.boolean(),
  performancePreferences: z.string().max(1000).optional(),
  specialRequests:        z.string().max(1000).optional(),
});

export type PerformerStep2FormValues = z.infer<typeof performerStep2Schema>;
export type PerformerStep3FormValues = z.infer<typeof performerStep3Schema>;
