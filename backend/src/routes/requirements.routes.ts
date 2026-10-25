import { Router } from 'express';
import { createRequirement, getRequirements } from '../controllers/requirements.controller';

export const requirementsRouter = Router();

requirementsRouter.get('/', getRequirements);
requirementsRouter.post('/', createRequirement);
