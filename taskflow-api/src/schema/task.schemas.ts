import { z } from 'zod';
import { TaskStatus } from '@prisma/client';

export const createTaskSchema = z.object({
  body: z.object({
    title:       z.string().min(1, 'El título es requerido'),
    description: z.string().optional(),
    status:      z.nativeEnum(TaskStatus).optional().default('TODO'),
    projectId:   z.string().uuid('projectId debe ser un UUID válido'),
    assignedTo:  z.string().uuid('assignedTo debe ser un UUID válido').optional(),
  }),
});

export const updateTaskSchema = z.object({
  body: z.object({
    title:       z.string().min(1).optional(),
    description: z.string().optional(),
    status:      z.nativeEnum(TaskStatus).optional(),
    assignedTo:  z.string().uuid().optional().nullable(),
  }),
});
