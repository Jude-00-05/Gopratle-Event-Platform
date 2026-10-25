import { Request, Response, NextFunction } from 'express';

interface AppError extends Error {
  status?: number;
  code?: number;
}

export function errorHandler(
  err: AppError,
  _req: Request,
  res: Response,
  _next: NextFunction
): void {
  const isDev = process.env.NODE_ENV === 'development';

  // Always log the full error server-side
  console.error('[ErrorHandler]', err);

  // Mongoose validation error (should rarely reach here since Zod pre-validates)
  if (err.name === 'ValidationError') {
    res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: err.message,
    });
    return;
  }

  // MongoDB duplicate key error
  if (err.code === 11000) {
    res.status(409).json({
      success: false,
      message: 'Duplicate record',
    });
    return;
  }

  // Generic 500 — never expose stack traces or credentials to the client in production
  res.status(500).json({
    success: false,
    message: 'An unexpected error occurred. Please try again.',
    ...(isDev && { detail: err.message }), // detail is only included in development
  });
}
