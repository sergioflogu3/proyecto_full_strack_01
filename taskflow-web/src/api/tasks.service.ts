import api from './axios';
import type { ApiResponse, Task, CreateTaskData, UpdateTaskData } from '../types';

export const tasksService = {

  async getByProject(projectId: string): Promise<Task[]> {
    const res = await api.get<ApiResponse<{ items: Task[]; count: number }>>(`/tasks/project/${projectId}`);
    return res.data.data.items ?? [];
  },

  async create(data: CreateTaskData): Promise<Task> {
    const res = await api.post<ApiResponse<Task>>('/tasks', data);
    return res.data.data;
  },

  async update(id: string, data: UpdateTaskData): Promise<Task> {
    const res = await api.put<ApiResponse<Task>>(`/tasks/${id}`, data);
    return res.data.data;
  },

  async remove(id: string): Promise<void> {
    await api.delete(`/tasks/${id}`);
  },
};
