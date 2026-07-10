import { Request, Response } from 'express';
import { usersService } from '../services/users.service';
import { CreateUserDto, UpdateUserDto } from '../types/users.types';
import { success, error } from '../utils/api-response';

function isPrismaError(error: unknown): error is { code: string } {
  return typeof error === 'object' && error !== null && 'code' in error;
}

export const usersController = {

  /**
   * @openapi
   * /api/users:
   *   get:
   *     tags: [Usuarios]
   *     summary: Listar todos los usuarios
   *     security:
   *       - bearerAuth: []
   *     responses:
   *       200:
   *         description: Lista de usuarios
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 data:
   *                   type: array
   *                   items:
   *                     $ref: '#/components/schemas/User'
   *                 count:
   *                   type: integer
   */
  async getAll(req: Request, res: Response): Promise<void> {
    try {
      const users = await usersService.findAll();
      success(res, { items: users, count: users.length });
    } catch (e) {
      error(res, 'Error al obtener usuarios', 500);
    }
  },

  /**
   * @openapi
   * /api/users/{id}:
   *   get:
   *     tags: [Usuarios]
   *     summary: Obtener un usuario por ID
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: string
   *           format: uuid
   *         description: ID del usuario
   *     security:
   *       - bearerAuth: []
   *     responses:
   *       200:
   *         description: Usuario encontrado
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 data:
   *                   $ref: '#/components/schemas/User'
   *       404:
   *         description: Usuario no encontrado
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Error'
   */
  async getById(req: Request, res: Response): Promise<void> {
    try {
      const user = await usersService.findById(req.params.id as string);
      if (!user) {
        error(res, 'Usuario no encontrado', 404);
        return;
      }
      success(res, user);
    } catch (e) {
      error(res, 'Error al obtener el usuario', 500);
    }
  },

  /**
   * @openapi
   * /api/users:
   *   post:
   *     tags: [Usuarios]
   *     summary: Crear un nuevo usuario
   *     security:
   *       - bearerAuth: []
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/CreateUserInput'
   *     responses:
   *       201:
   *         description: Usuario creado exitosamente
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 data:
   *                   $ref: '#/components/schemas/User'
   *       400:
   *         description: Datos inválidos o faltantes
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Error'
   *       409:
   *         description: El email ya está registrado
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Error'
   */
  async create(req: Request, res: Response): Promise<void> {
    try {
      const { name, email, password } = req.body as CreateUserDto;
      if (!name || !email || !password) {
        error(res, 'name, email y password son requeridos', 400);
        return;
      }
      const exists = await usersService.existsByEmail(email);
      if (exists) {
        error(res, 'El email ya está registrado', 409);
        return;
      }
      const user = await usersService.create({ name, email, password });
      success(res, user, 'Operación exitosa', 201);
    } catch (e) {
      error(res, 'Error al crear el usuario', 500);
    }
  },

  /**
   * @openapi
   * /api/users/{id}:
   *   put:
   *     tags: [Usuarios]
   *     summary: Actualizar un usuario
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: string
   *           format: uuid
   *         description: ID del usuario
   *     security:
   *       - bearerAuth: []
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/UpdateUserInput'
   *     responses:
   *       200:
   *         description: Usuario actualizado
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 data:
   *                   $ref: '#/components/schemas/User'
   *       404:
   *         description: Usuario no encontrado
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Error'
   */
  async update(req: Request, res: Response): Promise<void> {
    try {
      const { name, email } = req.body as UpdateUserDto;
      const user = await usersService.update(req.params.id as string, { name, email });
      success(res, user);
    } catch (e: unknown) {
      if (isPrismaError(e) && e.code === 'P2025') {
        error(res, 'Usuario no encontrado', 404);
        return;
      }
      error(res, 'Error al actualizar el usuario', 500);
    }
  },

  /**
   * @openapi
   * /api/users/{id}:
   *   delete:
   *     tags: [Usuarios]
   *     summary: Eliminar un usuario
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: string
   *           format: uuid
   *         description: ID del usuario
   *     security:
   *       - bearerAuth: []
   *     responses:
   *       204:
   *         description: Usuario eliminado (sin contenido)
   *       404:
   *         description: Usuario no encontrado
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Error'
   */
  async remove(req: Request, res: Response): Promise<void> {
    try {
      await usersService.remove(req.params.id as string);
      success(res, undefined, 'Operación exitosa', 200);
    } catch (e: unknown) {
      if (isPrismaError(e) && e.code === 'P2025') {
        error(res, 'Usuario no encontrado', 404);
        return;
      }
      error(res, 'Error al eliminar el usuario', 500);
    }
  },
};
