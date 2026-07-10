import prisma from '../config/prisma';
import { CreateCommentDto } from '../types/comment.types';

export const commentsService = {

  async findByTask(taskId: string) {
    return prisma.comment.findMany({
      where: { taskId },
      include: { user: { select: { id: true, name: true, email: true } } },
      orderBy: { createdAt: 'asc' },
    });
  },

  async create(data: CreateCommentDto, userId: string) {
    // Verificar que la tarea existe
    const task = await prisma.task.findUnique({ where: { id: data.taskId } });
    if (!task) throw { status: 404, message: 'Tarea no encontrada' };

    return prisma.comment.create({
      data: { content: data.content, taskId: data.taskId, userId },
      include: { user: { select: { id: true, name: true } } },
    });
  },

  async remove(id: string, requesterId: string) {
    const comment = await prisma.comment.findUnique({ where: { id } });
    if (!comment) throw { status: 404, message: 'Comentario no encontrado' };
    // Solo el autor puede eliminar su comentario
    if (comment.userId !== requesterId)
      throw { status: 403, message: 'Solo puedes eliminar tus propios comentarios' };

    await prisma.comment.delete({ where: { id } });
  },
};
