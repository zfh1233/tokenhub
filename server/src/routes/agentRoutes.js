import { Router } from 'express';
import { getAgents, getAgent } from '../controllers/agentController.js';

const router = Router();

router.get('/', getAgents);
router.get('/:id', getAgent);

export default router;
