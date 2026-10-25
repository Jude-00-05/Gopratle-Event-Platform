import { Request, Response, NextFunction } from 'express';
import { requirementPayloadSchema } from '../schemas/requirement.schema';
import { Requirement } from '../models/Requirement.model';

export async function createRequirement(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  // 1. Validate the complete payload (base fields + category-specific details)
  const parsed = requirementPayloadSchema.safeParse(req.body);

  if (!parsed.success) {
    res.status(400).json({
      success: false,
      errors: parsed.error.flatten(),
    });
    return;
  }

  // 2. Coerce ISO date strings to Date objects for Mongoose
  const { startDate, endDate, ...rest } = parsed.data;
  const docData = {
    ...rest,
    startDate: new Date(startDate),
    endDate:   new Date(endDate),
  };

  try {
    // 3. Persist — success response is only returned after MongoDB confirms the write
    const saved = await Requirement.create(docData);

    res.status(201).json({
      success: true,
      data: saved,
    });
  } catch (err) {
    // Hand off to centralized error handler
    next(err);
  }
}
