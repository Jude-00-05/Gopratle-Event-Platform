import { z } from 'zod';

// ---------------------------------------------------------------------------
// Base event fields (Step 1 — shared across all categories)
// ---------------------------------------------------------------------------
const baseEventObject = z.object({
  eventName: z
    .string({ required_error: 'Event name is required' })
    .trim()
    .min(1, 'Event name is required')
    .max(200),
  eventType: z.enum(
    ['Wedding', 'Concert', 'College Festival', 'Corporate Event', 'Birthday', 'Private Party', 'Other'],
    { errorMap: () => ({ message: 'Event type is required' }) }
  ),
  startDate: z
    .string({ required_error: 'Start date is required' })
    .datetime({ message: 'Start date must be a valid ISO 8601 datetime' }),
  endDate: z
    .string({ required_error: 'End date is required' })
    .datetime({ message: 'End date must be a valid ISO 8601 datetime' }),
  location: z
    .string({ required_error: 'Location is required' })
    .trim()
    .min(1, 'Location is required')
    .max(200),
  venue: z.string().trim().max(200).optional(),
});

// ---------------------------------------------------------------------------
// Planner details (Steps 2 + 3)
// ---------------------------------------------------------------------------
const plannerDetailsSchema = z.object({
  // Step 2 — quantitative/structural requirements
  expectedAttendance: z
    .number({ required_error: 'Expected attendance is required' })
    .int('Attendance must be a whole number')
    .positive('Attendance must be a positive number'),
  planningScope: z.enum(['full-service', 'selected-services'], {
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
      ])
    )
    .min(1, 'Select at least one service'),
  estimatedBudget: z
    .number({ required_error: 'Estimated budget is required' })
    .positive('Budget must be a positive number'),
  step2Notes: z.string().max(1000).optional(),

  // Step 3 — qualitative/logistical details
  decorationStyle:     z.string().max(500).optional(),
  cateringPreference:  z.string().max(500).optional(),
  vendorCoordination:  z.boolean(),
  logisticsNotes:      z.string().max(1000).optional(),
  specialArrangements: z.string().max(1000).optional(),
});

// ---------------------------------------------------------------------------
// Performer details (Steps 2 + 3)
// ---------------------------------------------------------------------------
const performerDetailsSchema = z
  .object({
    // Step 2
    performanceType: z.enum(
      ['singer', 'dj', 'dancer', 'band', 'comedian', 'speaker', 'other'],
      { errorMap: () => ({ message: 'Please select a performance type' }) }
    ),
    performanceTypeOther: z.string().max(100).optional(),
    numberOfPerformers: z
      .number({ required_error: 'Number of performers is required' })
      .int('Must be a whole number')
      .positive('Must be a positive number'),
    performanceDuration: z
      .number({ required_error: 'Performance duration is required' })
      .positive('Duration must be a positive number'),
    equipmentRequired: z.array(z.string().max(100)).default([]),
    estimatedBudget: z
      .number({ required_error: 'Estimated budget is required' })
      .positive('Budget must be a positive number'),
    step2Notes: z.string().max(1000).optional(),

    // Step 3
    stageSetup:             z.string().max(500).optional(),
    soundRequirements:      z.string().max(500).optional(),
    lightingRequired:       z.boolean(),
    backlineRequired:       z.boolean(),
    performancePreferences: z.string().max(1000).optional(),
    specialRequests:        z.string().max(1000).optional(),
  })
  .refine(
    (d) => !(d.performanceType === 'other' && !d.performanceTypeOther?.trim()),
    { message: 'Please describe the performance type', path: ['performanceTypeOther'] }
  );

// ---------------------------------------------------------------------------
// Crew details (Steps 2 + 3)
// ---------------------------------------------------------------------------
const crewDetailsSchema = z
  .object({
    // Step 2
    requiredRole: z.enum(
      [
        'photographer',
        'videographer',
        'sound-technician',
        'lighting-technician',
        'stage-crew',
        'emcee',
        'other',
      ],
      { errorMap: () => ({ message: 'Please select a required role' }) }
    ),
    requiredRoleOther: z.string().max(100).optional(),
    numberOfPersonnel: z
      .number({ required_error: 'Number of personnel is required' })
      .int('Must be a whole number')
      .positive('Must be a positive number'),
    workingHours: z
      .number({ required_error: 'Working hours are required' })
      .positive('Working hours must be a positive number'),
    equipmentProvided: z.boolean(),
    estimatedBudget: z
      .number({ required_error: 'Estimated budget is required' })
      .positive('Budget must be a positive number'),
    step2Notes: z.string().max(1000).optional(),

    // Step 3
    shiftSchedule:          z.string().max(500).optional(),
    onSiteResponsibilities: z.string().max(1000).optional(),
    equipmentDetails:       z.string().max(500).optional(),
    operationalNotes:       z.string().max(1000).optional(),
  })
  .refine(
    (d) => !(d.requiredRole === 'other' && !d.requiredRoleOther?.trim()),
    { message: 'Please describe the required role', path: ['requiredRoleOther'] }
  );

// ---------------------------------------------------------------------------
// Discriminated union — full payload schema
// Zod validates details against the correct sub-schema based on category.
// Unknown fields in details are stripped automatically (Zod default behaviour).
// ---------------------------------------------------------------------------
export const requirementPayloadSchema = z
  .discriminatedUnion('category', [
    baseEventObject.extend({
      category: z.literal('planner'),
      details:  plannerDetailsSchema,
    }),
    baseEventObject.extend({
      category: z.literal('performer'),
      details:  performerDetailsSchema,
    }),
    baseEventObject.extend({
      category: z.literal('crew'),
      details:  crewDetailsSchema,
    }),
  ])
  .refine(
    (d) => new Date(d.endDate) >= new Date(d.startDate),
    { message: 'End date must not precede start date', path: ['endDate'] }
  );

export type RequirementPayload = z.infer<typeof requirementPayloadSchema>;
