import prisma from '../config/prisma';
import { CreateProjectDto, UpdateProjectDto, ProjectPublic } from '../types/projects.types';

export const projectsService = {

  async findAll(): Promise<ProjectPublic[]> {
    return prisma.project.findMany({
      orderBy: { createdAt: "desc" },
      include: { _count: { select: { tasks: true } } },
    });
  },

  async findById(id: string) {
    return prisma.project.findUnique({
      where: { id },
      include: {
        owner: { select: { id: true, name: true, email: true } },
        _count: { select: { tasks: true } },
      },
    });
  },

  async create(data: CreateProjectDto): Promise<ProjectPublic> {
    return prisma.project.create({
      data: {
        name: data.name,
        description: data.description,
        ownerId: data.ownerId,
      },
    });
  },

  async update(id: string, data: UpdateProjectDto): Promise<ProjectPublic> {
    return prisma.project.update({
      where: { id },
      data,
    });
  },

  async remove(id: string): Promise<void> {
    await prisma.project.delete({ where: { id } });
  },
};
