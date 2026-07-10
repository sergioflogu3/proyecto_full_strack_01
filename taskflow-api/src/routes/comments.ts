import { Router } from 'express';
import { commentsController } from '../controllers/comments.controller';

const router = Router();

router.get('/task/:taskId', commentsController.getByTask);
router.post('/', commentsController.create);
router.delete('/:id', commentsController.remove);

export default router;
