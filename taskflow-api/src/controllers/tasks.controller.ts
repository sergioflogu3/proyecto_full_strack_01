import { Request, Response } from 'express';
import { tasksService } from '../services/tasks.service';
import { CreateTaskDto, UpdateTaskDto } from '../types/task.types';
import { success, error } from '../utils/api-response';

export const tasksController = {

  /**
   * @openapi
   * /api/tasks/project/{projectId}:
   *   get:
   *     tags: [Tareas]
   *     summary: Listar tareas de un proyecto
   *     parameters:
   *       - in: path
   *         name: projectId
   *         required: true
   *         schema:
   *           type: string
   *           format: uuid
   *         description: ID del proyecto
   *       - in: query
   *         name: status
   *         required: false
   *         schema:
   *           type: string
   *           enum: [TODO, IN_PROGRESS, DONE, CANCELLED]
   *         description: Filtrar por estado
   *     security:
   *       - bearerAuth: []
   *     responses:
   *       200:
   *         description: Lista de tareas del proyecto
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 data:
   *                   type: array
   *                   items:
   *                     $ref: '#/components/schemas/Task'
   *                 count:
   *                   type: integer
   */
  async getByProject(req: Request, res: Response): Promise<void> {
    try {
      const projectId = req.params.projectId as string;
      const status = req.query.status as string | undefined;
      const tasks = await tasksService.findByProject(projectId, status);
      success(res, { items: tasks, count: tasks.length });
    } catch (e: any) { error(res, e?.message ?? 'Error al obtener tareas', e?.status ?? 500); }
  },

  /**
   * @openapi
   * /api/tasks/{id}:
   *   get:
   *     tags: [Tareas]
   *     summary: Obtener una tarea por ID
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: string
   *           format: uuid
   *         description: ID de la tarea
   *     security:
   *       - bearerAuth: []
   *     responses:
   *       200:
   *         description: Tarea encontrada
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 data:
   *                   $ref: '#/components/schemas/Task'
   *       404:
   *         description: Tarea no encontrada
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Error'
   */
  async getById(req: Request, res: Response): Promise<void> {
    try {
      const task = await tasksService.findById(req.params.id as string);
      if (!task) { error(res, 'Tarea no encontrada', 404); return; }
      success(res, task);
    } catch (e: any) { error(res, e?.message ?? 'Error al obtener la tarea', e?.status ?? 500); }
  },

  /**
   * @openapi
   * /api/tasks:
   *   post:
   *     tags: [Tareas]
   *     summary: Crear una nueva tarea
   *     security:
   *       - bearerAuth: []
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/CreateTaskInput'
   *     responses:
   *       201:
   *         description: Tarea creada exitosamente
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 data:
   *                   $ref: '#/components/schemas/Task'
   *       400:
   *         description: Datos inválidos o faltantes
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Error'
   */
  async create(req: Request, res: Response): Promise<void> {
    try {
      const task = await tasksService.create(
        req.body as CreateTaskDto,
        req.user!.userId
      );
      success(res, task, 'Operación exitosa', 201);
    } catch (e: any) { error(res, e?.message ?? 'Error al crear la tarea', e?.status ?? 500); }
  },

  /**
   * @openapi
   * /api/tasks/{id}:
   *   put:
   *     tags: [Tareas]
   *     summary: Actualizar una tarea
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: string
   *           format: uuid
   *         description: ID de la tarea
   *     security:
   *       - bearerAuth: []
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/UpdateTaskInput'
   *     responses:
   *       200:
   *         description: Tarea actualizada
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 data:
   *                   $ref: '#/components/schemas/Task'
   *       404:
   *         description: Tarea no encontrada
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Error'
   */
  async update(req: Request, res: Response): Promise<void> {
    try {
      const task = await tasksService.update(
        req.params.id as string,
        req.body as UpdateTaskDto,
        req.user!.userId
      );
      success(res, task);
    } catch (e: any) { error(res, e?.message ?? 'Error al actualizar la tarea', e?.status ?? 500); }
  },

  /**
   * @openapi
   * /api/tasks/{id}:
   *   delete:
   *     tags: [Tareas]
   *     summary: Eliminar una tarea
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: string
   *           format: uuid
   *         description: ID de la tarea
   *     security:
   *       - bearerAuth: []
   *     responses:
   *       204:
   *         description: Tarea eliminada (sin contenido)
   *       404:
   *         description: Tarea no encontrada
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Error'
   */
  async remove(req: Request, res: Response): Promise<void> {
    try {
      await tasksService.remove(req.params.id as string, req.user!.userId);
      success(res, undefined, 'Operación exitosa', 200);
    } catch (e: any) { error(res, e?.message ?? 'Error al eliminar la tarea', e?.status ?? 500); }
  },
};
