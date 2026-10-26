import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { requirementsRouter } from './routes/requirements.routes';
import { errorHandler } from './middleware/errorHandler';

export function createApp(): express.Application {
  const app = express();

  // Security headers
  app.use(helmet());

  // CORS must run before routes so browser preflight requests finish here.
  const allowedOrigins = [
    'https://gopratle-event-platform.vercel.app',
    'http://localhost:3000',
    process.env.FRONTEND_URL,
  ].filter((origin): origin is string => Boolean(origin));

  app.use(
    cors({
      origin: allowedOrigins,
      methods: ['GET', 'POST', 'OPTIONS'],
      optionsSuccessStatus: 204,
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

const app = createApp();

export default app;
