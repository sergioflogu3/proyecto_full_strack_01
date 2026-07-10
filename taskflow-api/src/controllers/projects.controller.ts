import { Request, Response } from 'express';
import { projectsService } from '../services/projects.service';
import { CreateProjectDto, UpdateProjectDto } from '../types/projects.types';
import { success, error } from '../utils/api-response';

export const projectsController = {

  /**
   * @openapi
   * /api/projects:
   *   get:
   *     tags: [Proyectos]
   *     summary: Listar todos los proyectos
   *     security:
   *       - bearerAuth: []
   *     responses:
   *       200:
   *         description: Lista de proyectos
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 data:
   *                   type: array
   *                   items:
   *                     $ref: '#/components/schemas/Project'
   *                 count:
   *                   type: integer
   */
  async getAll(req: Request, res: Response): Promise<void> {
    try {
      const projects = await projectsService.findAll();
      success(res, { items: projects, count: projects.length });
    } catch (e) {
      error(res, 'Error al obtener proyectos', 500);
    }
  },

  /**
   * @openapi
   * /api/projects/{id}:
   *   get:
   *     tags: [Proyectos]
   *     summary: Obtener un proyecto por ID
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: string
   *           format: uuid
   *         description: ID del proyecto
   *     security:
   *       - bearerAuth: []
   *     responses:
   *       200:
   *         description: Proyecto encontrado
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 data:
   *                   $ref: '#/components/schemas/Project'
   *       404:
   *         description: Proyecto no encontrado
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Error'
   */
  async getById(req: Request, res: Response): Promise<void> {
    try {
      const project = await projectsService.findById(req.params.id as string);
      if (!project) {
        error(res, 'Proyecto no encontrado', 404);
        return;
      }
      success(res, project);
    } catch (e) {
      error(res, 'Error al obtener el proyecto', 500);
    }
  },

  /**
   * @openapi
   * /api/projects:
   *   post:
   *     tags: [Proyectos]
   *     summary: Crear un nuevo proyecto
   *     security:
   *       - bearerAuth: []
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/CreateProjectInput'
   *     responses:
   *       201:
   *         description: Proyecto creado exitosamente
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 data:
   *                   $ref: '#/components/schemas/Project'
   *       400:
   *         description: Datos inválidos o faltantes
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Error'
   */
  async create(req: Request, res: Response): Promise<void> {
    try {
      const { name, description, ownerId } = req.body as CreateProjectDto;
      if (!name || !ownerId) {
        error(res, 'name y ownerId son requeridos', 400);
        return;
      }
      const project = await projectsService.create({ name, description, ownerId });
      success(res, project, 'Operación exitosa', 201);
    } catch (e: any) {
      if (e?.code === 'P2003') {
        error(res, 'El ownerId no existe en la base de datos', 400);
        return;
      }
      error(res, 'Error al crear el proyecto', 500);
    }
  },

  /**
   * @openapi
   * /api/projects/{id}:
   *   put:
   *     tags: [Proyectos]
   *     summary: Actualizar un proyecto
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: string
   *           format: uuid
   *         description: ID del proyecto
   *     security:
   *       - bearerAuth: []
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/UpdateProjectInput'
   *     responses:
   *       200:
   *         description: Proyecto actualizado
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 data:
   *                   $ref: '#/components/schemas/Project'
   *       404:
   *         description: Proyecto no encontrado
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Error'
   */
  async update(req: Request, res: Response): Promise<void> {
    try {
      const { name, description } = req.body as UpdateProjectDto;
      const project = await projectsService.update(req.params.id as string, { name, description });
      success(res, project);
    } catch (e: any) {
      if (e?.code === 'P2025') {
        error(res, 'Proyecto no encontrado', 404);
        return;
      }
      error(res, 'Error al actualizar el proyecto', 500);
    }
  },

  /**
   * @openapi
   * /api/projects/{id}:
   *   delete:
   *     tags: [Proyectos]
   *     summary: Eliminar un proyecto
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: string
   *           format: uuid
   *         description: ID del proyecto
   *     security:
   *       - bearerAuth: []
   *     responses:
   *       204:
   *         description: Proyecto eliminado (sin contenido)
   *       404:
   *         description: Proyecto no encontrado
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Error'
   */
  async remove(req: Request, res: Response): Promise<void> {
    try {
      await projectsService.remove(req.params.id as string);
      success(res, undefined, 'Operación exitosa', 200);
    } catch (e: any) {
      if (e?.code === 'P2025') {
        error(res, 'Proyecto no encontrado', 404);
        return;
      }
      error(res, 'Error al eliminar el proyecto', 500);
    }
  },
};
