import { Router, Request, Response } from 'express';
import pool from '../config/database';
import { success, error } from '../utils/api-response';

const router = Router();

/**
 * @openapi
 * /health:
 *   get:
 *     tags: [Sistema]
 *     summary: Verificar el estado del servidor y la base de datos
 *     responses:
 *       200:
 *         description: Servidor y BD funcionando
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: ok
 *                 message:
 *                   type: string
 *                 database:
 *                   type: object
 *                   properties:
 *                     status:
 *                       type: string
 *                       example: connected
 *                     timestamp:
 *                       type: string
 *                       format: date-time
 *                 environment:
 *                   type: string
 *       500:
 *         description: Error de conexión a la base de datos
 */
router.get('/', async (req: Request, res: Response) => {
  try {
    const result = await pool.query('SELECT NOW() as timestamp');
    success(res, {
      database: {
        status: 'connected',
        timestamp: result.rows[0].timestamp,
      },
      environment: process.env.NODE_ENV || 'development',
    }, 'TaskFlow API funcionando correctamente');
  } catch (e) {
    error(res, 'Error de conexión a la base de datos', 500);
  }
});

export default router;
