import { TaskStatus } from '@prisma/client';

export interface CreateTaskDto {
  title: string;
  description?: string;
  status?: TaskStatus;
  projectId: string;
  assignedTo?: string;
}

export interface UpdateTaskDto {
  title?: string;
  description?: string;
  status?: TaskStatus;
  assignedTo?: string | null;
}