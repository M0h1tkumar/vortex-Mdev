import { Router } from 'express';
import { z } from 'zod';
import { validate } from '../middleware/validate.js';
import {
  getAllProblemStatements,
  getProblemStatementById,
  createProblemStatement,
  deleteProblemStatement,
} from '../controllers/ps.controller.js';

const router = Router();

const psSchema = z.object({
  title: z.string().min(1),
  domainId: z.string().min(1),
  minDomainMembers: z.number().int().min(1).default(2),
});

router.get('/', getAllProblemStatements);
router.get('/:id', getProblemStatementById);
router.post('/', validate(psSchema), createProblemStatement);
router.delete('/:id', deleteProblemStatement);

export default router;