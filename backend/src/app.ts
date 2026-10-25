import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { requirementsRouter } from './routes/requirements.routes';
import { errorHandler } from './middleware/errorHandler';

export function createApp(): express.Application {
  const app = express();

  // Security headers
  app.use(helmet());

  // CORS — only allow the configured frontend origin
  app.use(
    cors({
      origin: process.env.FRONTEND_URL ?? 'http://localhost:3000',
      methods: ['GET', 'POST', 'OPTIONS'],
    })
  );

  // Body parsing — cap at 1 MB to prevent oversized payloads
  app.use(express.json({ limit: '1mb' }));

  // Health check endpoint — used for uptime monitoring to prevent Render cold starts
  app.get('/health', (_req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
  });

  // API routes
  app.use('/api/requirements', requirementsRouter);

  // Centralized error handler — must be registered last
  app.use(errorHandler);

  return app;
}
