import { Router } from 'express';
import { createRequirement } from '../controllers/requirements.controller';

export const requirementsRouter = Router();

requirementsRouter.post('/', createRequirement);
