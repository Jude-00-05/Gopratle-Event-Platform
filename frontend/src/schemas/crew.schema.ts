import { z } from 'zod';

// ─── Step 2 ──────────────────────────────────────────────────────────────────

export const crewStep2Schema = z
  .object({
    requiredRole: z.enum(
      [
        'photographer',
        'videographer',
        'sound-technician',
        'lighting-technician',
        'stage-crew',
        'emcee',
        'other',
      ] as const,
      { errorMap: () => ({ message: 'Please select a required role' }) }
    ),
    requiredRoleOther: z.string().max(100).optional(),
    numberOfPersonnel: z
      .number({ required_error: 'Number of personnel is required', invalid_type_error: 'Must be a number' })
      .int('Must be a whole number')
      .positive('Must be at least 1'),
    workingHours: z
      .number({ required_error: 'Working hours are required', invalid_type_error: 'Must be a number' })
      .positive('Working hours must be greater than 0'),
    equipmentProvided: z.boolean(),
    estimatedBudget: z
      .number({ required_error: 'Estimated budget is required', invalid_type_error: 'Must be a number' })
      .positive('Budget must be greater than 0'),
    step2Notes: z.string().max(1000).optional(),
  })
  .refine(
    (d) => !(d.requiredRole === 'other' && !d.requiredRoleOther?.trim()),
    { message: 'Please describe the required role', path: ['requiredRoleOther'] }
  );

// ─── Step 3 ──────────────────────────────────────────────────────────────────

export const crewStep3Schema = z.object({
  shiftSchedule:          z.string().max(500).optional(),
  onSiteResponsibilities: z.string().max(1000).optional(),
  equipmentDetails:       z.string().max(500).optional(),
  operationalNotes:       z.string().max(1000).optional(),
});

export type CrewStep2FormValues = z.infer<typeof crewStep2Schema>;
export type CrewStep3FormValues = z.infer<typeof crewStep3Schema>;
