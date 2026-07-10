import { Router } from 'express';
import { tasksController } from '../controllers/tasks.controller';
import { validate } from '../middleware/validate.middleware';
import { createTaskSchema, updateTaskSchema } from '../schema/task.schemas';

const router = Router();

// Rutas públicas (solo requieren token para leer — ajustable)
router.get('/project/:projectId', tasksController.getByProject);
router.get('/:id', tasksController.getById);

// Rutas que modifican datos — requieren auth + validación
router.post('/', validate(createTaskSchema), tasksController.create);
router.put('/:id', validate(updateTaskSchema), tasksController.update);
router.delete('/:id', tasksController.remove);

export default router;
