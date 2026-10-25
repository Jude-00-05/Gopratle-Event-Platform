import { z } from 'zod';

export const stepOneSchema = z
  .object({
    eventName: z
      .string({ required_error: 'Event name is required' })
      .min(1, 'Event name is required')
      .max(200, 'Event name must be 200 characters or fewer'),
    eventType: z
      .string({ required_error: 'Event type is required' })
      .min(1, 'Please select an event type'),
    startDate: z
      .string({ required_error: 'Start date is required' })
      .min(1, 'Start date is required'),
    endDate: z
      .string({ required_error: 'End date is required' })
      .min(1, 'End date is required'),
    location: z
      .string({ required_error: 'Location is required' })
      .min(1, 'Location is required')
      .max(200, 'Location must be 200 characters or fewer'),
    venue: z.string().max(200, 'Venue must be 200 characters or fewer').optional(),
    category: z.enum(['planner', 'performer', 'crew'] as const, {
      errorMap: () => ({ message: 'Please select a category' }),
    }),
  })
  .refine(
    (d) => {
      if (!d.startDate || !d.endDate) return true;
      return new Date(d.endDate) >= new Date(d.startDate);
    },
    { message: 'End date must not precede start date', path: ['endDate'] }
  );

export type StepOneFormValues = z.infer<typeof stepOneSchema>;
