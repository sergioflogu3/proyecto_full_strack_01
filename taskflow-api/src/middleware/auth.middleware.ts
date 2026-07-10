import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { JwtPayload } from '../types/auth.types';
import { apiResponse } from '../utils/api-response';

const EXCLUDED_ROUTES = [
  { method: 'POST', path: '/auth/register' },
  { method: 'POST', path: '/auth/login' },
  { method: 'GET', path: '/health' },
];

function isExcluded(req: Request): boolean {
  return EXCLUDED_ROUTES.some(
    (route) => route.method === req.method && req.path.endsWith(route.path),
  );
}

export function createAuthMiddleware() {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (isExcluded(req)) {
      next();
      return;
    }

    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      res.status(401).json(apiResponse(401, 'Token de autenticación requerido', undefined, 'INVALID_TOKEN'));
      return;
    }

    const token = authHeader.split(' ')[1];

    if (!token) {
      res.status(401).json(apiResponse(401, 'Token no proporcionado', undefined, 'INVALID_TOKEN'));
      return;
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;
      req.user = decoded;
      next();
    } catch {
      res.status(401).json(apiResponse(401, 'Token inválido o expirado', undefined, 'INVALID_TOKEN'));
    }
  };
}
