import { Request, Response, NextFunction } from 'express';
import { z, ZodSchema } from 'zod';

// Factory: recibe un schema Zod y retorna un middleware de Express
export const validate = (schema: ZodSchema) =>
  (req: Request, res: Response, next: NextFunction): void => {
    const result = schema.safeParse({
      body:   req.body,
      params: req.params,
      query:  req.query,
    });

    if (!result.success) {
      const issues = result.error.issues.map(e => ({
        field:   e.path.slice(1).join('.'),  // quitar 'body.' del path
        message: e.message,
      }));
      res.status(400).json({ error: 'Datos de entrada inválidos', details: issues });
      return;
    }

    next();
  };
