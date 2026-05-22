import { Router } from 'express';
import { getTutorials, getTutorial, createTutorial, updateTutorial, deleteTutorial, toggleLike } from '../controllers/tutorialController.js';
import { getComments, createComment, deleteComment } from '../controllers/commentController.js';
import auth from '../middleware/auth.js';
import upload from '../middleware/upload.js';

const router = Router();

router.get('/', getTutorials);
router.get('/:id', getTutorial);
router.post('/', auth, upload.array('files', 5), createTutorial);
router.put('/:id', auth, updateTutorial);
router.delete('/:id', auth, deleteTutorial);
router.post('/:id/like', auth, toggleLike);

router.get('/:id/comments', getComments);
router.post('/:id/comments', auth, createComment);
router.delete('/:id/comments/:commentId', auth, deleteComment);

export default router;
