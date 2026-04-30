import { Router } from 'express';
import {
  updateGlobalConfig,
  getGlobalConfig,
  broadcastMail,
  generateReport
} from '../controllers/admin.controller.js';
import {
  createInstitute,
  getInstitutes,
  deleteInstitute
} from '../controllers/domains.controller.js';

const router = Router();

router.get('/config', getGlobalConfig);
router.patch('/config', updateGlobalConfig);
router.post('/broadcast', broadcastMail);
router.get('/report', generateReport);

router.get('/institutes', getInstitutes);
router.post('/institutes', createInstitute);
router.delete('/institutes/:id', deleteInstitute);

export default router;
