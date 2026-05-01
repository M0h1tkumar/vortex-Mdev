import { Router } from 'express';
import { 
  registerStudent, 
  verifyOTP, 
  adminVerifyStudent, 
  getAllOperatives,
  getStudentById
} from '../controllers/students.controller.js';

const router = Router();

router.post('/register', registerStudent);
router.post('/verify-otp', verifyOTP);
router.patch('/admin/students/:id/verify', adminVerifyStudent);
router.get('/admin/students', getAllOperatives);
router.get('/students', getAllOperatives);
router.get('/students/:id', getStudentById);

export default router;
