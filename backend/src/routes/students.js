import { Router } from 'express';
import { 
  registerStudent, 
  verifyOTP, 
  adminVerifyStudent, 
  getAllOperatives 
} from '../controllers/students.controller.js';

const router = Router();

router.post('/register', registerStudent);
router.post('/verify-otp', verifyOTP);
router.patch('/admin/students/:id/verify', adminVerifyStudent);
router.get('/admin/students', getAllOperatives);

export default router;
