import { Router } from 'express';
import { register, login, getMe, updateProfile } from '../controllers/authController.js';
import auth from '../middleware/auth.js';

const router = Router();

router.post('/register', register);
router.post('/login', login);
router.get('/me', auth, getMe);
router.put('/me', auth, updateProfile);

export default router;
