import { Router } from 'express';
import { getAllTutorials, reviewTutorial, getUsers, updateUserRole } from '../controllers/adminController.js';
import auth from '../middleware/auth.js';
import admin from '../middleware/admin.js';

const router = Router();

router.use(auth, admin);

router.get('/tutorials', getAllTutorials);
router.put('/tutorials/:id/review', reviewTutorial);
router.get('/users', getUsers);
router.put('/users/:id/role', updateUserRole);

export default router;
