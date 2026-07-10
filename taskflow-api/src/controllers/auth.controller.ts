import { Request, Response } from 'express';
import { authService } from '../services/auth.service';
import { RegisterDto, LoginDto } from '../types/auth.types';
import { success, error } from '../utils/api-response';

export const authController = {

  /**
   * @openapi
   * /api/auth/register:
   *   post:
   *     tags: [Autenticación]
   *     summary: Registrar un nuevo usuario
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/RegisterInput'
   *     responses:
   *       201:
   *         description: Usuario registrado exitosamente
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/AuthResponse'
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
  async register(req: Request, res: Response): Promise<void> {
    try {
      const dto = req.body as RegisterDto;
      const result = await authService.register(dto);
      success(res, result, 'Operación exitosa', 201);
    } catch (e: any) {
      error(res, e?.message ?? 'Error al registrar', e?.status ?? 500);
    }
  },

  /**
   * @openapi
   * /api/auth/login:
   *   post:
   *     tags: [Autenticación]
   *     summary: Iniciar sesión
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/LoginInput'
   *     responses:
   *       200:
   *         description: Inicio de sesión exitoso
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/AuthResponse'
   *       401:
   *         description: Credenciales inválidas
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Error'
   */
  async login(req: Request, res: Response): Promise<void> {
    try {
      const dto = req.body as LoginDto;
      const result = await authService.login(dto);
      success(res, result);
    } catch (e: any) {
      error(res, e?.message ?? 'Error al iniciar sesión', e?.status ?? 500);
    }
  },

  /**
   * @openapi
   * /api/auth/me:
   *   get:
   *     tags: [Autenticación]
   *     summary: Obtener el usuario autenticado
   *     security:
   *       - bearerAuth: []
   *     responses:
   *       200:
   *         description: Usuario autenticado
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 data:
   *                   $ref: '#/components/schemas/User'
   *       401:
   *         description: Token no proporcionado o inválido
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Error'
   */
  async me(req: Request, res: Response): Promise<void> {
    try {
      success(res, req.user);
    } catch (e: any) {
      error(res, 'Error al obtener el usuario', 500);
    }
  },
};
