import { Request, Response } from 'express';
import { commentsService } from '../services/comments.service';
import { CreateCommentDto } from '../types/comment.types';
import { success, error } from '../utils/api-response';

export const commentsController = {

  /**
   * @openapi
   * /api/comments/task/{taskId}:
   *   get:
   *     tags: [Comentarios]
   *     summary: Listar comentarios de una tarea
   *     parameters:
   *       - in: path
   *         name: taskId
   *         required: true
   *         schema:
   *           type: string
   *           format: uuid
   *         description: ID de la tarea
   *     security:
   *       - bearerAuth: []
   *     responses:
   *       200:
   *         description: Lista de comentarios
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 data:
   *                   type: array
   *                   items:
   *                     $ref: '#/components/schemas/Comment'
   */
  async getByTask(req: Request, res: Response): Promise<void> {
    try {
      const taskId = req.params.taskId as string;
      const comments = await commentsService.findByTask(taskId);
      success(res, comments);
    } catch (e: any) {
      error(res, e?.message ?? 'Error al obtener comentarios', e?.status ?? 500);
    }
  },

  /**
   * @openapi
   * /api/comments:
   *   post:
   *     tags: [Comentarios]
   *     summary: Crear un comentario
   *     security:
   *       - bearerAuth: []
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/CreateCommentInput'
   *     responses:
   *       201:
   *         description: Comentario creado exitosamente
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 data:
   *                   $ref: '#/components/schemas/Comment'
   */
  async create(req: Request, res: Response): Promise<void> {
    try {
      const comment = await commentsService.create(req.body as CreateCommentDto, req.user!.userId);
      success(res, comment, 'Operación exitosa', 201);
    } catch (e: any) {
      error(res, e?.message ?? 'Error al crear el comentario', e?.status ?? 500);
    }
  },

  /**
   * @openapi
   * /api/comments/{id}:
   *   delete:
   *     tags: [Comentarios]
   *     summary: Eliminar un comentario
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: string
   *           format: uuid
   *         description: ID del comentario
   *     security:
   *       - bearerAuth: []
   *     responses:
   *       200:
   *         description: Comentario eliminado
   *       404:
   *         description: Comentario no encontrado
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Error'
   */
  async remove(req: Request, res: Response): Promise<void> {
    try {
      await commentsService.remove(req.params.id as string, req.user!.userId);
      success(res, undefined, 'Operación exitosa', 200);
    } catch (e: any) {
      error(res, e?.message ?? 'Error al eliminar el comentario', e?.status ?? 500);
    }
  },
};
