import { z } from 'zod';

// ─── Step 2 ──────────────────────────────────────────────────────────────────

export const plannerStep2Schema = z.object({
  expectedAttendance: z
    .number({ required_error: 'Expected attendance is required', invalid_type_error: 'Must be a number' })
    .int('Attendance must be a whole number')
    .positive('Attendance must be at least 1'),
  planningScope: z.enum(['full-service', 'selected-services'] as const, {
    errorMap: () => ({ message: 'Please select a planning scope' }),
  }),
  servicesRequired: z
    .array(
      z.enum([
        'decoration',
        'catering',
        'logistics',
        'coordination',
        'entertainment',
        'security',
        'photography',
      ] as const)
    )
    .min(1, 'Please select at least one service'),
  estimatedBudget: z
    .number({ required_error: 'Estimated budget is required', invalid_type_error: 'Must be a number' })
    .positive('Budget must be greater than 0'),
  step2Notes: z.string().max(1000).optional(),
});

// ─── Step 3 ──────────────────────────────────────────────────────────────────

export const plannerStep3Schema = z.object({
  decorationStyle:     z.string().max(500).optional(),
  cateringPreference:  z.string().max(500).optional(),
  vendorCoordination:  z.boolean(),
  logisticsNotes:      z.string().max(1000).optional(),
  specialArrangements: z.string().max(1000).optional(),
});

export type PlannerStep2FormValues = z.infer<typeof plannerStep2Schema>;
export type PlannerStep3FormValues = z.infer<typeof plannerStep3Schema>;
